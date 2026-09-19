const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');
const root = process.cwd();
const output = path.join(root, '.frontend-qa');
fs.mkdirSync(output, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const checks = [];
const errors = [];
function check(name, value, detail) {
  checks.push({ name, pass: !!value, ...(detail ? { detail } : {}) });
  console.log((value ? 'PASS ' : 'FAIL ') + name + (detail ? ' ' + JSON.stringify(detail) : ''));
}
const server = http.createServer((req, res) => {
  let file;
  try { file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname)); }
  catch { res.writeHead(400).end(); return; }
  if (file === root) file = path.join(root, 'index.html');
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end(); return;
  }
  const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4' };
  const size = fs.statSync(file).size;
  const range = /bytes=(\d+)-(\d*)/.exec(req.headers.range || '');
  const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  if (range) {
    const start = Number(range[1]), end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    res.writeHead(206, { ...headers, 'Content-Range': 'bytes ' + start + '-' + end + '/' + size, 'Content-Length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { ...headers, 'Content-Length': size });
    fs.createReadStream(file).pipe(res);
  }
});
let browser, socket;
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const debugPort = 9337;
  browser = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=' + debugPort, '--user-data-dir=' + path.join(output, 'chrome-profile'),
    'about:blank'
  ], { stdio: 'ignore', windowsHide: true });
  let tabs;
  for (let i = 0; i < 80; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:' + debugPort + '/json')).json(); break; }
    catch { await sleep(100); }
  }
  if (!tabs) throw new Error('Browser did not start');
  socket = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let sequence = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id); pending.delete(data.id);
      data.error ? reject(new Error(JSON.stringify(data.error))) : resolve(data.result);
    }
    if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text);
  });
  function cdp(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++sequence; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const value = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (value.exceptionDetails) throw new Error(JSON.stringify(value.exceptionDetails));
    return value.result.value;
  }
  async function viewport(width, height = 900, mobile = false) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
    await cdp('Emulation.setTouchEmulationEnabled', { enabled: mobile });
  }
  async function load(file) {
    await cdp('Page.navigate', { url: 'http://127.0.0.1:' + port + '/' + file });
    for (let i = 0; i < 150; i++) {
      const ready = await evaluate("document.readyState === 'complete' && !!document.querySelector('.aes-back-top') && !!window.tailwind");
      if (ready) break;
      await sleep(100);
    }
    await sleep(250);
  }
  async function key(key, code, modifiers = 0) {
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, code, modifiers });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, code, modifiers });
  }
  async function screenshot(name) {
    const shot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(path.join(output, name + '.png'), Buffer.from(shot.data, 'base64'));
  }
  await cdp('Page.enable'); await cdp('Runtime.enable');
  await viewport(1440);
  const files = fs.readdirSync(root).filter(f => f.endsWith('.html'));
  for (const file of files) {
    await load(file);
    const state = await evaluate(`(() => ({
      enhanced: !!document.querySelector('link[href="assets/site.css"]') && !!document.querySelector('.aes-back-top'),
      overflow: document.documentElement.scrollWidth > innerWidth,
      h1: document.querySelectorAll('h1').length,
      broken: Array.from(document.images).filter(i => i.getAttribute('src') && i.complete && !i.naturalWidth).map(i => i.getAttribute('src')),
      unlabeled: Array.from(document.querySelectorAll('input:not([type=hidden]),select,textarea')).filter(i => !i.labels.length && !i.getAttribute('aria-label')).length
    }))()`);
    if (['services.html', 'careers.html', 'about.html'].includes(file)) await screenshot(file.replace('.html', '-desktop'));
    check(file + ' desktop layout', state.enhanced && !state.overflow && state.h1 === 1 && !state.broken.length && !state.unlabeled, state);
    await evaluate("document.querySelector('header a').focus(); openModal('inquiryModal')");
    await sleep(80);
    const modal = await evaluate(`(() => {
      const m = document.getElementById('inquiryModal');
      return !!m && !m.classList.contains('hidden') && m.getAttribute('role') === 'dialog' && document.body.style.overflow === 'hidden' && document.querySelector('header').inert && document.activeElement === m;
    })()`);
    check(file + ' inquiry modal', modal);
    check(file + ' shared services toggle', await evaluate("!!document.querySelector('.aes-menu-toggle')"));
    await key('Escape', 'Escape');
    check(file + ' Escape restores page', await evaluate("document.getElementById('inquiryModal').classList.contains('hidden') && !document.querySelector('header').inert && document.body.style.overflow !== 'hidden'"));
  }
  await load('index.html');
  await screenshot('home-desktop');
  await evaluate("document.querySelector('.aes-menu-toggle').focus(); document.querySelector('.aes-menu-toggle').click()");
  check('Services menu opens by button', await evaluate("document.querySelector('.aes-menu-toggle').getAttribute('aria-expanded') === 'true' && !document.querySelector('.mega-dropdown-menu').inert"));
  await screenshot('desktop-navigation');
  await key('Escape', 'Escape');
  check('Services menu Escape and focus', await evaluate("document.querySelector('.aes-menu-toggle').getAttribute('aria-expanded') === 'false' && document.activeElement.classList.contains('aes-menu-toggle')"));
  await evaluate("document.querySelector('.btn-premium-orange').focus(); openModal('inquiryModal')");
  await sleep(300);
  await key('Tab', 'Tab', 8);
  check('Dialog reverse Tab stays inside', await evaluate("document.getElementById('inquiryModal').contains(document.activeElement)"));
  await key('Tab', 'Tab');
  check('Dialog forward Tab wraps', await evaluate("document.activeElement === document.querySelector('#inquiryModal button')"));
  await screenshot('inquiry-desktop');
  await key('Escape', 'Escape');
  check('Dialog restores trigger focus', await evaluate("document.activeElement.classList.contains('btn-premium-orange')"));
  await evaluate("openModal('inquiryModal'); openModal('trainingModal')");
  await sleep(80);
  check('Switching dialogs keeps one open', await evaluate("document.querySelectorAll('.modal-backdrop:not(.hidden)').length === 1 && document.body.style.overflow === 'hidden'"));
  await evaluate("closeModal('trainingModal')");
  const titleVisibility = await evaluate(`Array.from(document.querySelectorAll('.service-slide-card')).every(card => {
    const title = card.querySelector('h3').getBoundingClientRect(), box = card.getBoundingClientRect();
    return title.bottom <= box.bottom + 1;
  })`);
  check('Featured service titles fully visible', titleVisibility);
  await evaluate("document.getElementById('services').scrollIntoView(); document.querySelector('.service-slide-card').focus()");
  await sleep(700);
  check('Service drawer responds to keyboard focus', await evaluate("getComputedStyle(document.querySelector('.service-card-drawer')).transform === 'matrix(1, 0, 0, 1, 0, 0)'"));
  await screenshot('home-services-desktop');
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await evaluate('scrollTo(0,0)');
  await sleep(300);
  check('Reduced motion pauses background video', await evaluate('document.querySelector("video").paused'));
  check('Reduced motion disables smooth scroll', await evaluate('getComputedStyle(document.documentElement).scrollBehavior === "auto"'));
  await cdp('Emulation.setEmulatedMedia', { features: [] });
  for (const width of [320, 390, 768, 1024]) {
    await viewport(width, 844, width < 1024);
    for (const file of ['index.html', 'services.html', 'about.html', 'careers.html', 'service-tpi.html']) {
      await load(file);
      const detail = await evaluate(`({width:innerWidth,scroll:document.documentElement.scrollWidth, offenders:Array.from(document.querySelectorAll('body *')).filter(e=>{const r=e.getBoundingClientRect();return r.width && r.right>innerWidth+2 && getComputedStyle(e).position!=='fixed' && !e.closest('.mega-dropdown-menu, .modal-backdrop');}).slice(0,5).map(e=>e.className)})`);
      check(file + ' at ' + width + 'px fits viewport', detail.scroll <= detail.width, detail.scroll > detail.width ? detail : null);
      if (width === 390 && ['services.html', 'careers.html', 'about.html'].includes(file)) await screenshot(file.replace('.html', '-mobile'));
      if (width === 390 && file === 'index.html') {
        await screenshot('home-mobile');
        await evaluate("document.getElementById('mobile-menu-btn').click()");
        check('Mobile menu opens once', await evaluate("!document.getElementById('mobile-menu').classList.contains('hidden') && document.getElementById('mobile-menu-btn').getAttribute('aria-expanded') === 'true'"));
        await screenshot('mobile-navigation');
        await key('Escape', 'Escape');
        check('Mobile menu closes on Escape', await evaluate("document.getElementById('mobile-menu').classList.contains('hidden')"));
        await evaluate("openModal('verifyDocModal')");
        await sleep(300);
        await screenshot('verify-mobile');
        check('Mobile dialog fits viewport', await evaluate("document.querySelector('#verifyDocModal > div').getBoundingClientRect().bottom <= innerHeight"));
        await key('Escape', 'Escape');
        await evaluate("document.getElementById('services').scrollIntoView()");
        await sleep(500);
        await screenshot('home-services-mobile');
      }
    }
  }
  await load('careers.html');
  await evaluate("selectJobAndScroll('Certified Welding Inspector (CWI)')");
  check('Career apply preserves selected role', await evaluate("document.getElementById('cand_role').value === 'Certified Welding Inspector (CWI)'"));
  await load('about.html');
  await evaluate("selectReason('training_inquiry')");
  await sleep(50);
  check('Dynamic inquiry fields remain labeled', await evaluate("Array.from(document.querySelectorAll('#dynamicFormFields input, #dynamicFormFields select')).every(e=>e.labels.length)"));
  check('No browser JavaScript errors', !errors.length, errors.length ? errors : null);
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify({ checks, errors }, null, 2));
  console.log('RESULT ' + checks.filter(x=>x.pass).length + '/' + checks.length + ' passed');
  await cdp('Browser.close');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => {
  if (socket) socket.close();
  if (browser) browser.kill();
  server.close();
});

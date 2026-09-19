const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const out = path.join(__dirname, 'motif');
fs.mkdirSync(out, { recursive: true });
const baseline = process.argv.includes('--baseline');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let browser, socket;
const errors = [];
(async () => {
  browser = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=9341', '--user-data-dir=' + path.join(out, 'chrome-profile'), 'about:blank'
  ], { stdio: 'ignore', windowsHide: true });
  let tabs;
  for (let i = 0; i < 100; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9341/json')).json(); break; }
    catch { await sleep(100); }
  }
  if (!tabs) throw new Error('Chrome did not start');
  socket = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let sequence = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      data.error ? reject(new Error(JSON.stringify(data.error))) : resolve(data.result);
    }
    if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text);
  });
  const cdp = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const viewport = (width, height = 900) => cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  async function load(file = 'index.html') {
    await cdp('Page.navigate', { url: 'http://127.0.0.1:4173/' + file });
    for (let i = 0; i < 150; i++) {
      if (await evaluate("document.readyState === 'complete' && !!document.querySelector('.aes-back-top') && !!window.tailwind")) break;
      await sleep(100);
    }
    await evaluate('document.fonts.ready');
    await sleep(700);
  }
  async function shot(name) {
    const result = await cdp('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(out, name + '.png'), Buffer.from(result.data, 'base64'));
  }
  async function scrollToSection(selector, offset = 130) {
    await evaluate(`window.scrollTo({top: document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect().top + scrollY - ${offset}, behavior: 'instant'})`);
    await sleep(1000);
  }
  const snapshot = () => evaluate(`Array.from(document.querySelectorAll('main > section, main h1, main h2, main h3, main p, main .grid, main a, main button:not(.aes-video-toggle)')).map(el => { const r = el.getBoundingClientRect(); return {tag: el.tagName, text: el.matches('section, .grid') ? '' : el.textContent.trim(), x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height)} })`);
  await cdp('Runtime.enable');
  await cdp('Page.enable');
  await cdp('Network.enable');
  await cdp('Network.setCacheDisabled', { cacheDisabled: true });
  if (process.argv.includes('--inspect')) {
    await viewport(1440);
    await load();
    console.log(await evaluate(`({hosts:document.querySelectorAll('[data-aes-motif-host]').length,motifs:Array.from(document.querySelectorAll('[data-aes-motif]')).map(el=>({variant:el.dataset.aesMotif,classes:el.getAttribute('class'),rect:el.getBoundingClientRect().toJSON(),visibility:getComputedStyle(el).visibility})),errors:${JSON.stringify(errors)}})`));
    await shot('homepage-hero-desktop');
    await scrollToSection('#services');
    await shot('homepage-services-desktop');
    await scrollToSection('#sectors');
    await shot('homepage-sectors-desktop');
    await scrollToSection('#clients');
    await shot('homepage-divider-desktop');
    await viewport(320, 740);
    await load();
    console.log(await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:Array.from(document.querySelectorAll('body *')).filter(el=>{const r=el.getBoundingClientRect();return r.width && r.right>innerWidth && getComputedStyle(el).visibility==='visible'}).map(el=>({tag:el.tagName,cls:el.className,text:el.textContent.slice(0,60),right:el.getBoundingClientRect().right})).slice(0,12)})`));
    console.log(errors);
    return;
  }
  const layouts = {};
  for (const width of [1440, 1024, 768, 390, 320]) {
    await viewport(width);
    await load();
    layouts[width] = await snapshot();
  }
  if (baseline) {
    fs.writeFileSync(path.join(out, 'baseline-layouts.json'), JSON.stringify(layouts, null, 2));
    await viewport(1440);
    await load();
    await shot('before-hero');
    console.log('Baseline saved at five viewport widths.');
    return;
  }
  const checks = [];
  const check = (name, pass, detail) => { checks.push({ name, pass, detail }); console.log((pass ? 'PASS ' : 'FAIL ') + name + (detail ? ' ' + JSON.stringify(detail) : '')); };
  const before = JSON.parse(fs.readFileSync(path.join(out, 'baseline-layouts.json'), 'utf8'));
  for (const width of Object.keys(layouts)) {
    const differences = layouts[width].flatMap((el, i) => JSON.stringify(el) === JSON.stringify(before[width][i]) ? [] : [{before: before[width][i], after: el}]);
    check('Copy and layout preserved at ' + width, differences.length === 0, differences.slice(0, 3));
  }
  for (const [width, height] of [[1440, 900], [1440, 1800], [1024, 900], [768, 1024], [390, 844], [320, 740]]) {
    await viewport(width, height);
    await load();
    const scan = await evaluate(`(async () => {
      const style = document.createElement('style'); style.textContent = '.aes-motif {display:none!important}'; document.head.appendChild(style);
      const originalWidth = document.documentElement.scrollWidth; style.remove();
      const failures = []; let maxVisible = 0; const activated = new Set();
      for (let y = 0; y < document.documentElement.scrollHeight; y += 180) {
        scrollTo({top: y, behavior: 'instant'});
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const visible = Array.from(document.querySelectorAll('[data-aes-motif]')).filter(el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return s.visibility === 'visible' && s.display !== 'none' && Number(s.opacity) > 0 && r.bottom > 0 && r.top < innerHeight; });
        maxVisible = Math.max(maxVisible, visible.length);
        visible.forEach(el => activated.add(el.dataset.aesMotif));
        if (visible.length > 1) failures.push({y, reason: 'multiple motifs'});
        if (document.documentElement.scrollWidth > Math.max(innerWidth, originalWidth)) failures.push({y, reason: 'new overflow'});
      }
      return {failures, maxVisible, activated: Array.from(activated), originalWidth};
    })()`);
    check('Viewport exclusivity and overflow ' + width + 'x' + height, scan.failures.length === 0, scan);
    check('Expected motifs become visible at ' + width, width < 768 ? scan.maxVisible === 0 : scan.activated.length === (width >= 1280 ? 4 : 3));
  }
  await viewport(1440);
  await load();
  await evaluate("document.querySelector('[data-aes-motif=hero]').classList.remove('is-drawing'); document.querySelector('[data-aes-motif=hero]').getBoundingClientRect(); document.querySelector('[data-aes-motif=hero]').classList.add('is-drawing')");
  await sleep(100);
  const drawing = await evaluate("getComputedStyle(document.querySelector('[data-aes-motif=hero] path')).strokeDashoffset");
  check('Draw-on animation runs', parseFloat(drawing) > 0 && parseFloat(drawing) < 1, drawing);
  await sleep(1000);
  const decorations = await evaluate(`Array.from(document.querySelectorAll('[data-aes-motif]')).map(el => ({hidden:el.getAttribute('aria-hidden'),focusable:el.getAttribute('focusable'),pointer:getComputedStyle(el).pointerEvents,fill:getComputedStyle(el).fill,caps:getComputedStyle(el).strokeLinecap}))`);
  check('Decorations are noninteractive rounded SVG strokes', decorations.length === 4 && decorations.every(el => el.hidden === 'true' && el.focusable === 'false' && el.pointer === 'none' && el.fill === 'none' && el.caps === 'round'), decorations);
  await shot('homepage-hero-desktop');
  await scrollToSection('#services');
  await shot('homepage-services-desktop');
  const card = await evaluate("(() => {const r = document.querySelector('#services .service-slide-card').getBoundingClientRect(); return {x: r.x + r.width / 2, y: r.y + r.height / 2};})()");
  await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', ...card });
  await sleep(600);
  await shot('homepage-services-hover');
  await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
  await scrollToSection('#sectors');
  await shot('homepage-sectors-desktop');
  await scrollToSection('#clients');
  await shot('homepage-divider-desktop');
  await viewport(390, 844);
  await load();
  await shot('homepage-mobile');
  await scrollToSection('#services', 90);
  await shot('homepage-services-mobile');
  await viewport(1440);
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await load();
  await scrollToSection('#services');
  const reduced = await evaluate(`Array.from(document.querySelectorAll('[data-aes-motif].is-active path')).map(el => ({offset: getComputedStyle(el).strokeDashoffset, animation: getComputedStyle(el).animationName}))`);
  check('Reduced motion shows completed strokes without animation', reduced.length > 0 && reduced.every(p => p.offset === '0px' && p.animation === 'none'), reduced);
  check('No homepage JavaScript errors', errors.length === 0, [...errors]);
  await load('about.html');
  check('Other pages have no new motif instances', await evaluate("document.querySelectorAll('[data-aes-motif]').length === 0"));
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(checks, null, 2));
  if (checks.some(check => !check.pass)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { if (socket) socket.close(); if (browser) browser.kill(); });

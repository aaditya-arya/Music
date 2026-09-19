const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const out = path.join(__dirname, 'refined');
fs.mkdirSync(out, { recursive: true });
const baseline = process.argv.includes('--baseline');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let browser, socket;
const errors = [];
(async () => {
  browser = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=9343', '--user-data-dir=' + path.join(out, 'chrome-profile'), 'about:blank'
  ], { stdio: 'ignore', windowsHide: true });
  let tabs;
  for (let i = 0; i < 100; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9343/json')).json(); break; }
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
  const pages = fs.readdirSync(process.cwd()).filter(name => name.endsWith('.html'));
  const representative = ['index.html', 'services.html', 'service-tpi.html', 'about.html', 'careers.html', 'we-hear-you.html'];
  const layouts = {}, checks = [];
  const check = (name, pass, detail) => { checks.push({name,pass,detail}); console.log((pass ? 'PASS ' : 'FAIL ') + name + (detail ? ' ' + JSON.stringify(detail) : '')); };
  const quick = process.argv.includes('--quick');
  for (const width of quick ? [1440] : [1440, 390]) {
    await viewport(width, width === 1440 ? 1000 : 844);
    for (const file of width === 1440 && !quick ? pages : representative) {
      await load(file);
      layouts[file + ':' + width] = await snapshot();
      if (baseline) continue;
      const state = await evaluate(`({motifs:document.querySelectorAll('.aes-motif').length, overflow:document.documentElement.scrollWidth>innerWidth,broken:Array.from(document.images).filter(i=>i.complete&&!i.naturalWidth).length})`);
      check(file + ' at ' + width, state.motifs > 0 && !state.overflow && state.broken === 0, state);
      if (width === 1440 && representative.includes(file)) {
        await shot(file.replace('.html', '-hero'));
        const scan = await evaluate(`(async()=>{let max=0;const seen=new Set();const failures=[];
          for(let y=0;y<document.documentElement.scrollHeight;y+=220){scrollTo({top:y,behavior:'instant'});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
            const active=Array.from(document.querySelectorAll('.aes-motif.is-active')).filter(el=>getComputedStyle(el).display!=='none');max=Math.max(max,active.length);
            active.forEach(el=>seen.add(el.dataset.aesMotif));if(document.documentElement.scrollWidth>innerWidth)failures.push(y);
          }return{max,seen:Array.from(seen),failures};})()`);
        check(file + ' scrolling', scan.max === 1 && scan.failures.length === 0, scan);
        const selector = file === 'index.html' ? '#services' : file === 'services.html' ? 'main > section:nth-of-type(2)' : file.startsWith('service-') ? 'main' : file === 'about.html' ? 'main' : file === 'careers.html' ? '#openings' : 'main';
        await scrollToSection(selector, file === 'index.html' ? 110 : 140);
        await shot(file.replace('.html', '-detail'));
      } else if (width === 390) await shot(file.replace('.html', '-mobile'));
    }
  }
  if (baseline) {
    fs.writeFileSync(path.join(out,'baseline-layouts.json'),JSON.stringify(layouts));
    fs.writeFileSync(path.join(out,'baseline-errors.json'),JSON.stringify(errors));
    console.log('Saved baseline for all pages and representative mobile layouts.');
    return;
  }
  const before = JSON.parse(fs.readFileSync(path.join(out,'baseline-layouts.json'),'utf8'));
  for(const [name,layout] of Object.entries(layouts)) {
    const differences=layout.flatMap((el,i)=>JSON.stringify(el)===JSON.stringify(before[name]?.[i])?[]:[{before:before[name]?.[i],after:el}]);
    check(name+' copy/layout preserved',differences.length===0,differences.slice(0,2));
  }
  if (!quick) {
    for (const [width,height] of [[320,740],[768,1024],[1024,900],[1440,1800]]) {
      await viewport(width,height);
      for (const file of ['index.html','service-tpi.html','services.html']) {
        await load(file);
        const result=await evaluate(`(async()=>{
          const style=document.createElement('style');style.textContent='.aes-motif{display:none!important}';document.head.appendChild(style);const originalWidth=document.documentElement.scrollWidth;style.remove();
          let max=0;let overflow=false;for(let y=0;y<document.documentElement.scrollHeight;y+=260){scrollTo({top:y,behavior:'instant'});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
            const active=Array.from(document.querySelectorAll('.aes-motif.is-active')).filter(el=>getComputedStyle(el).display!=='none');max=Math.max(max,active.length);overflow ||= document.documentElement.scrollWidth>Math.max(innerWidth,originalWidth);
          }return{max,overflow,originalWidth};})()`);
        check(file+' responsive '+width+'x'+height,!result.overflow&&result.max===(width<768?0:1),result);
      }
    }
  }
  await viewport(1440);
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await load('service-tpi.html');
  await scrollToSection('main',140);
  check('Reduced motion completes strokes',await evaluate(`(()=>{const paths=Array.from(document.querySelectorAll('.aes-motif.is-active path'));return paths.length>0&&paths.every(el=>getComputedStyle(el).animationName==='none'&&parseFloat(getComputedStyle(el).strokeDashoffset)===0)})()`));
  check('Decorative SVG stays out of keyboard and pointer interaction',await evaluate(`Array.from(document.querySelectorAll('.aes-motif')).every(el=>el.getAttribute('aria-hidden')==='true'&&el.getAttribute('focusable')==='false'&&getComputedStyle(el).pointerEvents==='none')`));
  await evaluate("openModal('inquiryModal')");
  check('Existing inquiry modal remains usable',await evaluate("!document.getElementById('inquiryModal').classList.contains('hidden') && document.querySelector('header').inert"));
  await evaluate("closeModal('inquiryModal')");
  const oldErrors = JSON.parse(fs.readFileSync(path.join(out,'baseline-errors.json'),'utf8'));
  const normalizeError=error=>error.replace(/:\d+:\d+/g,':LINE:COL');
  const newErrors=errors.filter(error=>!oldErrors.some(old=>normalizeError(old)===normalizeError(error)));
  check('No new JavaScript exceptions',newErrors.length===0,newErrors);
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(checks,null,2));
  if(checks.some(check=>!check.pass))process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>{if(socket)socket.close();if(browser)browser.kill();});

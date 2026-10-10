/* A continuous PDF reader. The PDF renderer is loaded only when the brochure opens. */
(() => {
  'use strict';
  let modal = document.getElementById('companyProfileModal');
  const oldSource = modal?.querySelector('a[download]')?.href;
  const source = oldSource || AES.theme + '/assets/Company%20Profile.pdf';
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'companyProfileModal';
    modal.className = 'modal-backdrop hidden fixed inset-0 flex items-center justify-center';
    document.body.appendChild(modal);
  }
  modal.classList.add('aes-brochure-modal');
  modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-hidden', 'true'); modal.setAttribute('aria-labelledby', 'aes-pdf-title');
  modal.tabIndex = -1;
  modal.innerHTML = `<div class="aes-pdf-panel">
    <div class="aes-pdf-toolbar"><h2 id="aes-pdf-title">Company brochure</h2><div class="aes-pdf-controls">
      <button type="button" data-pdf-out aria-label="Zoom out"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/></svg></button>
      <output aria-label="Zoom level">100%</output>
      <button type="button" data-pdf-in aria-label="Zoom in"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5v14"/></svg></button>
      <a class="aes-action" data-pdf-download download="AES_Company_Profile.pdf">Download</a>
      <button type="button" data-pdf-close aria-label="Close brochure"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
    </div></div>
    <div class="aes-pdf-viewport" tabindex="0" aria-label="Brochure pages"><p class="aes-pdf-status" role="status">Loading the brochure…</p><div class="aes-pdf-document"></div></div>
  </div>`;
  modal.querySelector('[data-pdf-download]').href = source;
  window.aesEnhanceButtons?.(modal);
  document.querySelectorAll('[title*="Interactive 3D Brochure"]').forEach(el => el.title = 'Read company brochure');
  const viewport = modal.querySelector('.aes-pdf-viewport');
  const documentView = modal.querySelector('.aes-pdf-document');
  const status = modal.querySelector('.aes-pdf-status');
  const output = modal.querySelector('output');
  const zoomIn = modal.querySelector('[data-pdf-in]'), zoomOut = modal.querySelector('[data-pdf-out]');
  let pdf, loading, zoom = 1, observer, resizeTimer;
  const pages = [];
  let baseWidth = 860;
  const isOpen = () => !modal.classList.contains('hidden');
  async function renderPage(record) {
    if (!record || !isOpen() || record.busy || (record.scale === zoom && record.width === baseWidth)) return;
    record.busy = true;
    const scale = zoom, width = baseWidth;
    try {
      const page = record.page || await pdf.getPage(record.number);
      record.page = page;
      const native = page.getViewport({ scale: 1 });
      const view = page.getViewport({ scale: width * scale / native.width });
      const density = Math.min(devicePixelRatio || 1, 2);
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(view.width * density); canvas.height = Math.ceil(view.height * density);
      canvas.setAttribute('aria-label', 'Brochure page ' + record.number);
      await page.render({ canvasContext: canvas.getContext('2d'), viewport: view, transform: density === 1 ? null : [density, 0, 0, density, 0, 0] }).promise;
      record.element.replaceChildren(canvas);
      record.scale = scale;
      record.width = width;
    } catch (error) {
      record.element.textContent = 'This page could not be displayed. You can download the brochure above.';
    } finally {
      record.busy = false;
      if (isOpen() && (scale !== zoom || width !== baseWidth)) renderPage(record);
    }
  }
  function resizePages() {
    if (!pdf || !isOpen()) return;
    const nextWidth = Math.min(860, Math.max(240, viewport.clientWidth - (innerWidth < 640 ? 24 : 48)));
    if (nextWidth !== baseWidth) pages.forEach(record => record.scale = null);
    baseWidth = nextWidth;
    pages.forEach(record => {
      record.element.style.width = baseWidth * zoom + 'px';
      record.element.style.height = baseWidth * zoom * record.ratio + 'px';
      const rect = record.element.getBoundingClientRect(), container = viewport.getBoundingClientRect();
      if (rect.bottom >= container.top - 240 && rect.top <= container.bottom + 240) renderPage(record);
    });
  }
  async function load() {
    if (loading) return loading;
    loading = (async () => {
      try {
        const library = await import(AES.theme + '/assets/vendor/pdfjs/pdf.mjs');
        library.GlobalWorkerOptions.workerSrc = AES.theme + '/assets/vendor/pdfjs/pdf.worker.mjs';
        pdf = await library.getDocument({ url: source, useWasm: false }).promise;
        for (let number = 1; number <= pdf.numPages; number++) {
          const page = await pdf.getPage(number);
          const native = page.getViewport({ scale: 1 });
          const element = document.createElement('div');
          element.className = 'aes-pdf-page'; element.setAttribute('role', 'img');
          element.setAttribute('aria-label', 'Company brochure, page ' + number + ' of ' + pdf.numPages);
          documentView.appendChild(element);
          pages.push({ number, element, page, ratio: native.height / native.width, scale: null, busy: false });
        }
        status.hidden = true;
        observer = new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting) renderPage(pages.find(record => record.element === entry.target));
        }), { root: viewport, rootMargin: '240px' });
        resizePages(); pages.forEach(record => observer.observe(record.element));
      } catch (error) {
        status.textContent = 'The preview could not load. Use Download to open the PDF on your device.';
        loading = null;
      }
    })();
    return loading;
  }
  function changeZoom(amount) {
    zoom = Math.min(2, Math.max(.75, zoom + amount));
    output.value = Math.round(zoom * 100) + '%';
    zoomOut.disabled = zoom <= .75; zoomIn.disabled = zoom >= 2;
    resizePages();
  }
  zoomIn.addEventListener('click', () => changeZoom(.25));
  zoomOut.addEventListener('click', () => changeZoom(-.25));
  modal.querySelector('[data-pdf-close]').addEventListener('click', () => window.closeModal(modal.id));
  const open = window.openModal;
  window.openModal = id => {
    open(id);
    if (id === modal.id) { load(); requestAnimationFrame(resizePages); }
  };
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resizePages, 160); }, { passive: true });
})();

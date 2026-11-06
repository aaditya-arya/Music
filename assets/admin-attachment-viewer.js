/* Private attachment bytes are fetched only from the administrator's protected URL. */
(() => {
  let library;
  window.AESAttachmentViewer = {
    mount(root, file) {
      let disposed = false, pdf, loadingTask, task, pageNumber = 1, zoom = 1, rendering = false, pending = false;
      root.replaceChildren(); root.className = 'aes-inbox-file-viewer';
      const toolbar = document.createElement('div'); toolbar.className = 'aes-inbox-viewer-toolbar';
      const status = document.createElement('p'); status.setAttribute('role', 'status'); status.textContent = 'Loading ' + file.name + '...';
      const stage = document.createElement('div'); stage.className = 'aes-inbox-viewer-stage';
      const makeButton = (text, action) => { const button = document.createElement('button'); button.type = 'button'; button.textContent = text; button.className = 'aes-inbox-button'; button.addEventListener('click', action); toolbar.append(button); return button; };
      const close = makeButton('Close preview', () => { dispose(); root.replaceChildren(); });
      root.append(toolbar, status, stage);
      const dispose = () => {
        if (disposed) return;
        disposed = true; resize.disconnect(); task?.cancel();
        if (loadingTask) loadingTask.destroy().catch(() => {});
      };
      const resize = new ResizeObserver(() => { if (pdf && !disposed) render(); }); resize.observe(root);
      if (file.mime !== 'application/pdf') {
        const image = document.createElement('img'); image.src = file.previewUrl; image.alt = file.label + ': ' + file.name; image.onload = () => { status.textContent = file.name; }; image.onerror = () => { status.textContent = 'This image could not be displayed. Use Download to open the attachment.'; }; stage.append(image); return dispose;
      }
      const previous = makeButton('Previous page', () => { pageNumber = Math.max(1, pageNumber - 1); render(); });
      const next = makeButton('Next page', () => { pageNumber = Math.min(pdf.numPages, pageNumber + 1); render(); });
      const out = makeButton('Zoom out', () => { zoom = Math.max(.5, zoom - .25); render(); });
      const into = makeButton('Zoom in', () => { zoom = Math.min(2, zoom + .25); render(); });
      const controls = [previous, next, out, into]; controls.forEach(button => button.disabled = true);
      async function render() {
        if (!pdf || disposed) return;
        if (rendering) { pending = true; return; }
        rendering = true;
        try {
          const currentPage = pageNumber;
          const page = await pdf.getPage(currentPage);
          const native = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: Math.max(180, stage.clientWidth - 24) / native.width * zoom });
          const canvas = document.createElement('canvas'); const density = Math.min(devicePixelRatio || 1, 2);
          canvas.width = Math.ceil(viewport.width * density); canvas.height = Math.ceil(viewport.height * density);
          canvas.style.width = viewport.width + 'px'; canvas.style.height = viewport.height + 'px'; canvas.setAttribute('aria-label', file.name + ', page ' + currentPage);
          task = page.render({ canvasContext: canvas.getContext('2d'), viewport, transform: density === 1 ? null : [density, 0, 0, density, 0, 0] });
          await task.promise;
          if (disposed) return;
          stage.replaceChildren(canvas); status.textContent = file.name + ' · Page ' + currentPage + ' of ' + pdf.numPages + ' · ' + Math.round(zoom * 100) + '%';
          previous.disabled = pageNumber <= 1; next.disabled = pageNumber >= pdf.numPages; out.disabled = zoom <= .5; into.disabled = zoom >= 2;
        } catch (error) { if (!disposed) status.textContent = 'This PDF could not be displayed. Use Download to open the attachment.'; }
        finally { rendering = false; if (pending && !disposed) { pending = false; render(); } }
      }
      (async () => {
        try {
          library ||= import(AES_ATTACHMENT_VIEWER.theme + '/assets/vendor/pdfjs/pdf.mjs');
          const module = await library;
          if (disposed) return;
          module.GlobalWorkerOptions.workerSrc = AES_ATTACHMENT_VIEWER.theme + '/assets/vendor/pdfjs/pdf.worker.mjs';
          loadingTask = module.getDocument({ url: file.previewUrl, withCredentials: true, useWasm: false });
          pdf = await loadingTask.promise;
          if (disposed) return;
          render();
        } catch (error) { if (!disposed) status.textContent = 'Could not load the PDF. Refresh the request or download the attachment.'; }
      })();
      return dispose;
    }
  };
})();

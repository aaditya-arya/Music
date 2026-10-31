(() => {
  document.querySelectorAll('.aes-setting-media').forEach(button => button.addEventListener('click', () => {
    const frame = wp.media({ title: 'Choose website media', library: { type: button.dataset.mediaType }, multiple: false });
    frame.on('select', () => {
      const field = button.closest('form').querySelector('[name="' + button.dataset.field + '"]');
      field.value = frame.state().get('selection').first().toJSON().url;
      field.dispatchEvent(new Event('input', { bubbles: true }));
    });
    frame.open();
  }));
  // 1. Existing Page/CMS Field Sync
  document.querySelectorAll('.aes-controls').forEach(root => {
    const sync = () => {
      const values = {};
      root.querySelectorAll('.aes-value').forEach(el => values[el.dataset.key] = el.value);
      const jsonEl = root.querySelector('.aes-json');
      if (jsonEl) jsonEl.value = JSON.stringify(values);
    };
    sync();
    root.addEventListener('input', sync);
    root.closest('form')?.addEventListener('submit', sync);

    const filterEl = root.querySelector('.aes-filter');
    if (filterEl) {
      filterEl.addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        root.querySelectorAll('.aes-group').forEach(group => {
          let hits = 0;
          group.querySelectorAll('.aes-row').forEach(row => {
            const match = (row.textContent + ' ' + (row.querySelector('textarea')?.value || '')).toLowerCase().includes(q);
            row.hidden = !match;
            hits += match ? 1 : 0;
          });
          group.hidden = !hits;
          if (q && hits) group.open = true;
        });
      });
    }

    root.querySelectorAll('.aes-media').forEach(btn => btn.addEventListener('click', () => {
      const frame = wp.media({ title: 'Select an image or document', multiple: false });
      frame.on('select', () => {
        btn.parentElement.querySelector('textarea').value = frame.state().get('selection').first().toJSON().url;
        sync();
      });
      frame.open();
    }));
  });

  const pageSearch = document.getElementById('aesPageSearch');
  pageSearch?.addEventListener('input', () => {
    const query = pageSearch.value.trim().toLowerCase(); let count = 0;
    document.querySelectorAll('[data-page-search]').forEach(row => { row.hidden = !row.dataset.pageSearch.includes(query); if (!row.hidden) count++; });
    document.getElementById('aesPageSearchEmpty').hidden = count > 0;
  });
})();

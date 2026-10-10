/* Filtering augments the complete, server-rendered service portfolio. */
(() => {
  'use strict';
  const root = document.querySelector('.aes-services-page');
  if (!root) return;
  const grid = root.querySelector('#aes-service-grid');
  const search = root.querySelector('#aes-service-search');
  const count = root.querySelector('#aes-service-count');
  const empty = root.querySelector('.aes-service-empty');
  const controls = [...root.querySelectorAll('[data-service-filter]')];
  if (!grid || !search || !count || !empty || !controls.length) return;
  const normalize = text => text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const cards = [...grid.querySelectorAll('.aes-directory-card')].map(element => ({
    element,
    category: element.dataset.serviceCategory,
    text: normalize(element.textContent + ' ' + element.dataset.serviceKeywords)
  }));
  let category = 'all';
  const labels = { source: 'Source & approve', inspect: 'Inspect & verify', build: 'Build & commission', qualify: 'Qualify & develop' };
  const update = () => {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let visible = 0;
    cards.forEach(card => {
      const match = (category === 'all' || card.category === category) && terms.every(term => card.text.includes(term));
      card.element.hidden = !match;
      if (match) visible++;
    });
    controls.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.serviceFilter === category)));
    count.textContent = visible === cards.length && !terms.length ? `Showing all ${cards.length} services` : `Showing ${visible} of ${cards.length} services${category === 'all' ? '' : ' · ' + labels[category]}`;
    empty.hidden = visible !== 0;
    grid.hidden = visible === 0;
  };
  controls.forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => { category = button.dataset.serviceFilter; update(); });
  });
  search.addEventListener('input', update);
  root.querySelector('[data-service-reset]')?.addEventListener('click', () => {
    category = 'all'; search.value = ''; update(); search.focus({ preventScroll: true });
  });
  // Existing links to a particular service still work after someone filters the page.
  const revealLinkedCard = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (error) { return; }
    const card = cards.find(item => item.element.id === id);
    if (!card || !card.element.hidden) return;
    category = 'all'; search.value = ''; update();
    card.element.scrollIntoView({ behavior: 'instant', block: 'center' });
  };
  window.addEventListener('hashchange', revealLinkedCard);
  root.querySelector('.aes-service-tools').hidden = false;
  update();
})();

/* The server renders every opening; filtering only narrows that complete list. */
(() => {
  document.querySelectorAll('[data-openings-directory]').forEach(root => {
    const form = root.querySelector('[data-openings-filters]');
    if (!form) return;
    form.addEventListener('submit', event => event.preventDefault());
    const cards = [...root.querySelectorAll('[data-opening-search-text]')];
    const groups = [...root.querySelectorAll('[data-opening-group]')];
    const update = () => {
      const terms = root.querySelector('[data-opening-search]').value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
      const department = root.querySelector('[data-opening-department]').value;
      let total = 0;
      cards.forEach(card => { card.hidden = !!department && card.dataset.department !== department || !terms.every(term => card.dataset.openingSearchText.includes(term)); if (!card.hidden) total++; });
      groups.forEach(group => { const count = group.querySelectorAll('[data-opening-search-text]:not([hidden])').length; group.hidden = !count; group.querySelector('[data-group-count]').textContent = count + (count === 1 ? ' job' : ' jobs'); });
      root.querySelector('[data-opening-count]').textContent = total + (total === 1 ? ' open role' : ' open roles'); root.querySelector('[data-opening-empty]').hidden = !!total;
    };
    form.addEventListener('input', update); form.addEventListener('change', update); form.addEventListener('reset', () => requestAnimationFrame(update));
  });
})();

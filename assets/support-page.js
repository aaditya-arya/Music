/* Request-specific controls, retaining common details and drafts between categories. */
(() => {
  'use strict';
  const root = document.querySelector('.aes-support-page');
  if (!root) return;
  const form = root.querySelector('#reasonWiseForm');
  const dynamic = root.querySelector('#dynamicFormFields');
  const dropdown = root.querySelector('#reasonDropdown');
  if (!form || !dynamic || !dropdown) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const drafts = new Map();
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  let saved = {};
  try { saved = JSON.parse(root.dataset.supportConfig || '{}'); } catch (error) { /* Use defaults if old markup has no config. */ }
  const reasons = {};
  for (const [key, defaults] of Object.entries(window.AES_SUPPORT_REQUESTS || {})) {
    const config = { ...defaults, ...(saved[key] || {}) };
    config.fields = defaults.fields.map(field => ({ ...field, ...(saved[key]?.fields?.find(item => item.id === field.id) || {}), id: field.id, type: field.type, required: field.required }));
    config.html = key === 'inquiry' ? dynamic.innerHTML : config.fields.map(field => {
      const label = escape(field.label), id = escape(field.id);
      const control = field.type === 'select'
        ? `<select id="${id}" name="${id}" ${field.required ? 'required' : ''}><option value="">Select ${escape(field.label.toLowerCase())}${field.required ? '' : ' (optional)'}</option>${field.options.map(option => `<option>${escape(option)}</option>`).join('')}</select>`
        : `<input id="${id}" name="${id}" type="${field.type}" ${field.required ? 'required' : ''} placeholder="${escape(field.placeholder)}" />`;
      return `<div><label for="${id}">${label}${field.required ? ' *' : ''}</label>${control}</div>`;
    }).join('');
    reasons[key] = config;
  }
  // Inquiry copy is already saved in the visual block. Read it before switching types.
  if (reasons.inquiry) Object.assign(reasons.inquiry, {
    title: root.querySelector('#selectedReasonInput').value,
    heading: root.querySelector('#request-form-heading').textContent.trim(),
    submit: root.querySelector('#formSubmitBtn').textContent.trim(),
    label: root.querySelector('#messageLabel').textContent.trim(),
    placeholder: root.querySelector('#messageTextarea').placeholder,
    contextTitle: root.querySelector('#support-context-title').textContent.trim(),
    context: root.querySelector('#support-context-copy').textContent.trim()
  });
  let current = 'inquiry';
  const selectReason = value => {
    const aliases = { report_update: 'complaint_appeal', client_feedback: 'feedback', certificate: 'doc_verify' };
    const key = aliases[value] || value;
    const data = reasons[key];
    if (!data) return;
    if (current !== key) {
      if (current) drafts.set(current, [...dynamic.querySelectorAll('input, select')].map(input => [input.name, input.value]));
      dynamic.innerHTML = data.html;
      for (const [name, saved] of drafts.get(key) || []) {
        const input = [...dynamic.querySelectorAll('input, select')].find(field => field.name === name);
        if (input) input.value = saved;
      }
      current = key;
    }
    dropdown.value = key;
    root.querySelector('#selectedReasonInput').value = data.title;
    root.querySelector('#request-form-heading').textContent = data.heading;
    root.querySelector('#messageLabel').textContent = data.label;
    root.querySelector('#messageTextarea').placeholder = data.placeholder;
    root.querySelector('#support-context-title').textContent = data.contextTitle;
    root.querySelector('#support-context-copy').textContent = data.context;
    const submit = root.querySelector('#formSubmitBtn');
    submit.replaceChildren(document.createTextNode(data.submit));
    submit.insertAdjacentHTML('beforeend', arrow);
    root.querySelectorAll('[data-support-reason]').forEach(button => {
      const active = button.dataset.supportReason === key;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  window.selectReason = selectReason;
  const goToRequest = () => {
    const target = root.querySelector(matchMedia('(max-width: 850px)').matches ? '.aes-support-form-panel' : '#supportRequest');
    target.scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'start' });
    root.querySelector('#request-form-heading').focus({ preventScroll: true });
  };
  root.querySelectorAll('[data-support-reason]').forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => { selectReason(button.dataset.supportReason); goToRequest(); });
  });
  dropdown.addEventListener('change', () => selectReason(dropdown.value));
  root.querySelector('a[href="#supportRequest"]')?.addEventListener('click', event => { event.preventDefault(); goToRequest(); });
  form.addEventListener('reset', () => { drafts.clear(); current = null; });
  // Shared inquiry controls have a direct destination on this page without a second form.
  const openModal = window.openModal;
  window.openModal = id => {
    if (document.getElementById(id)?.classList.contains('modal-backdrop')) return openModal?.(id);
    if (id === 'inquiryModal' || id === 'verifyDocModal' || id === 'trainingModal') {
      selectReason(id === 'verifyDocModal' ? 'doc_verify' : 'inquiry');
      if (id === 'trainingModal') root.querySelector('#primaryService').value = 'QA/QC & NDT Training';
      goToRequest();
      return;
    }
    openModal?.(id);
  };
  // Direct links can choose a request type as well as the existing blog/help anchor.
  const selectLinkedReason = () => {
    const key = location.hash.slice(1);
    if (reasons[key] || ['report_update', 'client_feedback', 'certificate'].includes(key)) { selectReason(key); goToRequest(); }
  };
  selectReason('inquiry');
  selectLinkedReason();
  window.addEventListener('hashchange', selectLinkedReason);
})();

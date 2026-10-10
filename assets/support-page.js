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
  const textField = (id, label, placeholder, required = false, type = 'text') => `<div><label for="${id}">${label}${required ? ' *' : ''}</label><input id="${id}" name="${id}" type="${type}" ${required ? 'required' : ''} placeholder="${placeholder}" /></div>`;
  const selectField = (id, label, options, required = false) => `<div><label for="${id}">${label}${required ? ' *' : ''}</label><select id="${id}" name="${id}" ${required ? 'required' : ''}><option value="">Select ${label.toLowerCase()}${required ? '' : ' (optional)'}</option>${options.map(option => `<option>${option}</option>`).join('')}</select></div>`;
  const reasons = {
    inquiry: { title: 'Quick Inquiry', heading: 'Tell us about your project', submit: 'Submit inquiry', label: 'Project scope & location *', placeholder: 'Tell us the equipment, project location, inspection stage and target dates.', contextTitle: 'For a project inquiry', context: 'Include the equipment, vendor or project location, inspection stage and target dates. A specification or inspection plan is a useful starting point.', html: dynamic.innerHTML },
    feedback: { title: 'Feedback', heading: 'Tell us about your experience', submit: 'Submit feedback', label: 'Your feedback & suggestions *', placeholder: 'What worked well? What could we improve about the inspection, reporting or communication?', contextTitle: 'For useful feedback', context: 'Share the project or report reference if available. Tell us what worked well and where the service could improve.', html: selectField('feedbackRating', 'Overall service rating', ['5 - Exceptional', '4 - Very good', '3 - Satisfactory', '2 - Needs improvement', '1 - Unsatisfactory'], true) + selectField('feedbackArea', 'Feedback area', ['Inspector technical knowledge', 'Report delivery', 'Communication', 'Project coordination', 'Other']) + textField('feedbackReference', 'Project / report reference', 'Reference or project name (optional)') },
    complaint_appeal: { title: 'Complaint / Appeal', heading: 'Help us understand your concern', submit: 'Submit complaint / appeal', label: 'Grounds for complaint or appeal *', placeholder: 'Describe the relevant events, the observation or decision in question and the outcome you are seeking.', contextTitle: 'For a complaint or appeal', context: 'Include the inspection or project reference, relevant dates and the outcome you are seeking. A supporting report can help explain your concern.', html: textField('complaintReference', 'Job / report reference', 'Report reference or project name', true) + textField('manufacturerName', 'Manufacturer / vendor', 'Manufacturer or vendor name', true) + selectField('urgencyLevel', 'Urgency', ['Cargo waiting for dispatch', 'Upcoming project milestone', 'Routine follow-up']) },
    doc_verify: { title: 'Inspection Certificate Verification', heading: 'Request a document check', submit: 'Request verification', label: 'Document details & purpose of verification *', placeholder: 'Tell us what you need to confirm about this document. Add the issuing details if known.', contextTitle: 'For certificate verification', context: 'Provide the document number and type, plus the issue date if known. You may attach a copy. Our team will review the request against the relevant records.', html: textField('certificateNumber', 'Document / certificate number', 'e.g. AES-IRN-2026-XXXX', true) + selectField('documentType', 'Document type', ['Inspection Release Note (IRN)', 'Material certificate endorsement', 'WPS / PQR / WPQ certificate', 'NDT certificate', 'Vendor audit dossier', 'Other AES document'], true) + textField('issueDate', 'Date of issue (if known)', '', false, 'date') }
  };
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

/* Shared public-form validation and repeatable submission lifecycle. */
(() => {
  'use strict';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const key = field => (field.name || field.id || '').toLowerCase();
  const email = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const phone = value => /^\+?[0-9]{10,15}$/.test(value.replace(/[\s().-]/g, ''));
  const person = value => /^[\p{L}\p{M}][\p{L}\p{M} .\u2019'-]*$/u.test(value) && (value.match(/\p{L}/gu) || []).length >= 2;
  const message = (field, rule) => {
    const value = field.value.trim();
    if (!value && field.required) return 'Please complete this field.';
    if (!value) return '';
    if (rule?.kind === 'person' && !person(value)) return 'Use letters, spaces, apostrophes or hyphens. Names cannot contain numbers.';
    if ((rule?.kind === 'email' || field.type === 'email') && !email(value)) return 'Enter a valid email address, for example name@company.com.';
    if ((rule?.kind === 'tel' || field.type === 'tel') && !phone(value)) return 'Enter 10 to 15 digits, optionally starting with +. Phone numbers cannot contain letters.';
    if (rule?.kind === 'contact') {
      const address = value.match(/[^\s/]+@[^\s/]+/)?.[0] || '';
      if (!email(address) || !phone(value.replace(address, '').replace(/^[\s/|,;]+|[\s/|,;]+$/g, ''))) return 'Include a valid email address and a phone number without letters.';
    }
    if (rule?.kind === 'experience' && (!/^\d+(?:\.\d{1,2})?$/.test(value) || Number(value) < 0 || Number(value) > 50)) return 'Enter experience between 0 and 50 years; decimals are allowed.';
    if (field.type === 'date' && value > new Date().toLocaleDateString('en-CA')) return 'The date cannot be in the future.';
    if (value.length > (rule?.kind === 'email' ? 254 : ['person', 'tel'].includes(rule?.kind) ? 100 : 5000)) return 'This value is too long.';
    return '';
  };
  document.querySelectorAll('form[data-aes-form]').forEach(form => {
    form.removeAttribute('onsubmit'); form.onsubmit = null;
    const aliases = { 'Inquiry desk': 'contact-us-0', 'Training registration': 'contact-us-1', 'Certificate verification': 'contact-us-2' };
    form.dataset.aesForm = aliases[form.dataset.aesForm] || form.dataset.aesForm;
    const config = window.AES_VALIDATION?.[form.dataset.aesForm] || { rules: {} };
    const rules = config.rules;
    const trap = document.createElement('div'); trap.className = 'aes-trap'; trap.setAttribute('aria-hidden', 'true');
    trap.innerHTML = '<label>Leave blank<input name="website" tabindex="-1" autocomplete="off"></label>'; form.append(trap);
    const status = document.createElement('div'); status.className = 'aes-form-status-container'; status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); form.append(status);
    const controls = () => [...form.querySelectorAll('input,select,textarea')].filter(field => !field.disabled && field.name !== 'website' && !['submit', 'button', 'reset', 'hidden'].includes(field.type));
    const enhance = () => controls().forEach(field => {
      const rule = rules[key(field)];
      if (field.type === 'file') field.accept = '.pdf,.jpg,.jpeg,.png';
      if (rule?.kind === 'person') { field.autocomplete = 'name'; field.maxLength = 100; }
      if (rule?.kind === 'tel') { field.inputMode = 'tel'; field.maxLength = field.maxLength > 0 ? field.maxLength : 24; }
      if (rule?.kind === 'experience') { field.min = '0'; field.max = '50'; field.step = '0.01'; }
      if (field.type === 'date') field.max = new Date().toLocaleDateString('en-CA');
      if (config.challenge?.name === key(field)) {
        const challenge = field.parentElement.querySelector('span, label');
        if (challenge && challenge.textContent !== config.challenge.question) challenge.textContent = config.challenge.question;
        field.min = '0'; field.max = '18'; field.step = '1';
      }
    });
    enhance();
    new MutationObserver(enhance).observe(form, { childList: true, subtree: true });
    form.addEventListener('input', event => {
      if (!event.target.matches('input,select,textarea')) return;
      const field = event.target; field.setCustomValidity(message(field, rules[key(field)])); field.removeAttribute('aria-invalid');
    });
    const alert = text => { status.replaceChildren(); const node = document.createElement('p'); node.className = 'aes-form-alert aes-form-alert--error'; node.textContent = text; status.append(node); };
    form.addEventListener('submit', async event => {
      event.preventDefault(); event.stopImmediatePropagation();
      if (form.dataset.busy) return;
      controls().forEach(field => field.setCustomValidity(message(field, rules[key(field)])));
      if (!form.reportValidity()) return;
      const data = new FormData(), fields = [];
      let total = 0;
      for (const field of form.querySelectorAll('input,select,textarea')) {
        if (field.disabled || field.name === 'website' || ['submit', 'button', 'reset'].includes(field.type) || (['radio', 'checkbox'].includes(field.type) && !field.checked)) continue;
        if (field.type === 'file') {
          for (const file of field.files) {
            total += file.size;
            if (file.size > 2 * 1024 * 1024 || total > 5 * 1024 * 1024) return alert('Each attachment must be under 2 MB; total attachments must be under 5 MB.');
            if (!/\.(pdf|jpe?g|png)$/i.test(file.name) || (file.type && !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type))) return alert('Attach PDF, JPG or PNG files only.');
            data.append(field.name || field.id, file);
          }
        } else fields.push({ name: field.name || field.id, value: field.value.trim() });
      }
      data.append('action', 'aes_submit'); data.append('nonce', AES.nonce); data.append('form', form.dataset.aesForm); data.append('fields', JSON.stringify(fields)); data.append('website', form.querySelector('[name=website]').value);
      if (config.challenge) data.append('math_token', config.challenge.token);
      const buttons = [...form.querySelectorAll('[type=submit]')];
      form.dataset.busy = '1'; buttons.forEach(button => { button.disabled = true; button.setAttribute('aria-busy', 'true'); });
      status.textContent = 'Sending your request...';
      try {
        const response = await fetch(AES.ajax, { method: 'POST', body: data, credentials: 'same-origin' });
        const result = await response.json();
        if (!response.ok || !result.success) {
          const errors = result.data?.fields || {};
          for (const field of controls()) if (errors[key(field)]) { field.setCustomValidity(errors[key(field)]); field.setAttribute('aria-invalid', 'true'); }
          form.reportValidity(); throw Error(result.data?.message || 'Submission failed. Please try again.');
        }
        const reference = result.data.message.match(/AES-\d+/)?.[0] || '';
        const reason = form.querySelector('#reasonDropdown')?.value;
        const hidden = new Map([...form.children].filter(child => child !== status && child !== trap).map(child => [child, child.hidden]));
        hidden.forEach((_, child) => child.hidden = true);
        status.innerHTML = '<div class="aes-form-success-card"><div class="aes-success-badge" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 4 4L19 6"/></svg></div><h3 class="aes-success-title">Submission received</h3><p class="aes-success-ref"></p><p>Your details have been recorded. Keep your reference for follow-up.</p><button type="button" class="aes-success-reset-btn aes-action">Submit another request</button></div>';
        status.querySelector('.aes-success-ref').textContent = reference;
        const reset = () => {
          form.reset(); controls().forEach(field => { field.setCustomValidity(''); field.removeAttribute('aria-invalid'); });
          hidden.forEach((wasHidden, child) => child.hidden = wasHidden); status.replaceChildren();
          if (reason && window.selectReason) window.selectReason(reason);
          enhance(); controls().find(field => field.type !== 'file')?.focus({ preventScroll: true });
        };
        status.querySelector('.aes-success-reset-btn').addEventListener('click', reset);
        status.scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'nearest' });
      } catch (error) { alert(error.message || 'Could not connect. Please try again.'); }
      finally { buttons.forEach(button => { button.disabled = false; button.removeAttribute('aria-busy'); }); delete form.dataset.busy; }
    }, true);
  });
})();

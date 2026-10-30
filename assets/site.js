/* Progressive enhancements shared by all AES pages; no build step or dependencies. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 1024px)');
  const header = $('body > header');
  const mobileButton = $('#mobile-menu-btn');
  const mobileMenu = $('#mobile-menu');
  const dropdown = $('.nav-item-dropdown');
  const megaMenu = $('.mega-dropdown-menu');
  const focusable = 'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const visibleControls = root => $$(focusable, root).filter(el => el.getClientRects().length && !el.closest('[inert]'));
  // Shared button motion; the stylesheet owns normal, selected and pressed colors.
  window.aesEnhanceButtons = (root = document) => {
    $$('button, a[class*="btn-"], a.aes-action', root).forEach(button => {
      if (button.classList.contains('aes-button-depth')) return;
      button.classList.add('aes-button-depth');
      if (getComputedStyle(button).position === 'static') button.classList.add('aes-motion-surface');
      if (button.lastElementChild?.tagName.toLowerCase() === 'svg' && button.textContent.trim()) button.lastElementChild.classList.add('aes-action-arrow');
    });
  };
  window.aesEnhanceButtons();
  // A clipped, disposable ripple never intercepts the control's native action.
  function pressFeedback(control, x, y) {
    if (!control || motion.matches || !control.animate || control.matches(':disabled, [aria-disabled="true"]')) return;
    $('.aes-press-feedback', control)?.remove();
    const rect = control.getBoundingClientRect();
    const layer = document.createElement('span');
    layer.className = 'aes-press-feedback';
    layer.setAttribute('aria-hidden', 'true');
    const wave = document.createElement('span');
    const size = Math.hypot(rect.width, rect.height) * 2;
    wave.style.cssText = `width:${size}px;height:${size}px;left:${x - size / 2}px;top:${y - size / 2}px`;
    layer.appendChild(wave);
    // Preserve first/last label selectors on compound choice cards.
    if (control.children.length > 1) control.insertBefore(layer, control.lastElementChild);
    else control.appendChild(layer);
    wave.animate([{ transform: 'scale(0)', opacity: .16 }, { transform: 'scale(1)', opacity: 0 }], {
      duration: 560, easing: 'cubic-bezier(.2,.65,.3,1)',
    }).finished.catch(() => {}).finally(() => layer.remove());
  }
  document.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const control = event.target.closest('.aes-button-depth');
    if (!control) return;
    const rect = control.getBoundingClientRect();
    pressFeedback(control, event.clientX - rect.left, event.clientY - rect.top);
  }, { passive: true });
  document.addEventListener('keydown', event => {
    if (event.repeat || !['Enter', ' '].includes(event.key)) return;
    const control = event.target.closest('.aes-button-depth');
    if (!control || (event.key === ' ' && control.tagName !== 'BUTTON')) return;
    pressFeedback(control, control.clientWidth / 2, control.clientHeight / 2);
  });
  $$('main a[href]').forEach(link => {
    if (!link.matches('[class*="btn-"], .aes-action') && !link.querySelector('img, svg, div, h2, h3, p') &&
        !link.closest('.service-slide-card, .aes-directory-card')) link.classList.add('aes-text-link');
  });
  const main = $('main');
  $$('.aes-reach-card h2 a[href^="mailto:"]').forEach(link => {
    const email = link.textContent.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    const [user, domain] = email.split('@');
    const parts = domain.split(/(?=engineering)/);
    link.replaceChildren(document.createTextNode(user + '@'), document.createElement('wbr'));
    parts.forEach((part, index) => {
      if (index) link.appendChild(document.createElement('wbr'));
      link.appendChild(document.createTextNode(part));
    });
  });
  if (main) {
    if (!main.id) main.id = 'main-content';
    main.tabIndex = -1;
    const skip = document.createElement('a');
    skip.className = 'aes-skip-link';
    skip.href = '#' + main.id;
    skip.textContent = 'Skip to content';
    document.body.prepend(skip);
  }

  // Keep the current page and its service family visible in navigation.
  const currentFile = location.pathname.replace(/\/$/, '') || '/';
  $$('header a[href]').forEach(link => {
    const file = new URL(link.href).pathname.replace(/\/$/, '') || '/';
    if (file === currentFile) link.setAttribute('aria-current', 'page');
    else if (file === 'services.html' && currentFile.startsWith('service-')) link.setAttribute('aria-current', 'true');
  });
  $$('a[target="_blank"]').forEach(link => link.relList.add('noopener', 'noreferrer'));
  $$('a[href*="wa.me"]').forEach(link => link.setAttribute('aria-label', 'Chat with AES on WhatsApp (opens in a new tab)'));
  $$('header a[href], footer a[href]').forEach(link => {
    if (!link.querySelector('img, svg') && !link.matches('.btn-premium-orange, .btn-premium-blue, .btn-theme, .aes-social-link') && !link.classList.contains('group')) {
      link.classList.add('aes-quick-link');
    }
  });

  function closeMobile(restoreFocus = false) {
    if (!mobileMenu || !mobileButton) return;
    mobileMenu.classList.add('hidden');
    mobileButton.setAttribute('aria-expanded', 'false');
    mobileButton.setAttribute('aria-label', 'Open navigation');
    if (restoreFocus) mobileButton.focus();
  }
  function measureHeader() {
    if (!header) return;
    const rect = header.getBoundingClientRect();
    document.documentElement.style.setProperty('--aes-header-height', Math.ceil(rect.height) + 'px');
    if (mobileMenu) mobileMenu.style.maxHeight = Math.max(0, innerHeight - rect.bottom - 12) + 'px';
  }
  measureHeader();
  if (header && 'ResizeObserver' in window) new ResizeObserver(measureHeader).observe(header);
  window.addEventListener('resize', measureHeader, { passive: true });
  if (mobileButton && mobileMenu) {
    mobileButton.setAttribute('aria-controls', mobileMenu.id);
    mobileButton.setAttribute('aria-expanded', 'false');
    mobileButton.setAttribute('aria-label', 'Open navigation');
    mobileMenu.setAttribute('role', 'navigation');
    mobileMenu.setAttribute('aria-label', 'Mobile navigation');
    // Capture replaces the different legacy toggles without double toggling.
    mobileButton.addEventListener('click', event => {
      event.stopImmediatePropagation();
      const opening = mobileMenu.classList.contains('hidden');
      if (opening) measureHeader();
      mobileMenu.classList.toggle('hidden', !opening);
      mobileButton.setAttribute('aria-expanded', String(opening));
      mobileButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
    }, true);
    mobileMenu.addEventListener('click', event => {
      // Keep the link in place until the browser has performed its default action.
      if (event.target.closest('a, button')) setTimeout(() => closeMobile(), 0);
    });
    document.addEventListener('click', event => {
      if (header && !header.contains(event.target)) closeMobile();
    });
    header.addEventListener('focusout', event => {
      if (event.relatedTarget && header.contains(event.relatedTarget)) return;
      setTimeout(() => { if (!header.contains(document.activeElement)) closeMobile(); }, 0);
    });
    desktop.addEventListener('change', () => closeMobile());
  }

  let menuButton;
  let menuTimer;
  let menuOpenTimer;
  let servicePanel;
  let contactButton;
  function measureMega() {
    if (!header || !desktop.matches) return;
    const height = Math.min(innerHeight - 16, 720, Math.max(560, innerHeight * .5, megaMenu.scrollHeight + 128));
    const row = $(':scope > div:first-child', header);
    header.style.setProperty('--aes-panel-height', height + 'px');
    header.style.setProperty('--aes-logo-shift-y', (height - row.getBoundingClientRect().height) / 2 + 'px');
    const brand = $('.aes-header-brand', header);
    const spacer = $('.aes-services-panel__spacer', header);
    if (brand && spacer) {
      const slot = spacer.getBoundingClientRect();
      const scale = innerWidth < 1280 ? .8 : .92;
      const currentX = parseFloat(getComputedStyle(brand).translate) || 0;
      const targetLeft = slot.left + (slot.width - brand.offsetWidth * scale) / 2;
      header.style.setProperty('--aes-logo-shift-x', (targetLeft - brand.getBoundingClientRect().left + currentX) + 'px');
    }
    if (contactButton) {
      const rect = contactButton.getBoundingClientRect();
      const transform = getComputedStyle(contactButton).transform;
      const matrix = transform === 'none' ? { m41: 0, m42: 0 } : new DOMMatrixReadOnly(transform);
      const gutter = parseFloat(getComputedStyle(row).paddingRight);
      const left = document.documentElement.clientWidth - gutter - rect.width;
      const top = row.getBoundingClientRect().bottom + 18;
      header.style.setProperty('--aes-contact-shift-x', (left - rect.left + matrix.m41) + 'px');
      header.style.setProperty('--aes-contact-shift-y', (top - rect.top + matrix.m42) + 'px');
    }
  }
  function setMega(open) {
    if (!dropdown || !megaMenu) return;
    open = open && desktop.matches && !document.documentElement.classList.contains('aes-intro-active');
    clearTimeout(menuTimer);
    clearTimeout(menuOpenTimer);
    // Re-focusing an open menu must not remeasure its moving logo or CTA.
    if (open && dropdown.dataset.aesMenu !== 'open') measureMega();
    dropdown.dataset.aesMenu = open ? 'open' : 'closed';
    header.classList.toggle('aes-services-open', open);
    if (servicePanel) {
      servicePanel.setAttribute('aria-hidden', String(!open));
      servicePanel.inert = !open;
    }
    megaMenu.setAttribute('aria-hidden', String(!open));
    megaMenu.inert = !open;
    if (menuButton) menuButton.setAttribute('aria-expanded', String(open));
  }
  $$('aside button[onclick*="trainingModal"]').forEach(btn => btn.remove());
  if (dropdown && megaMenu) {
    megaMenu.id = megaMenu.id || 'services-navigation';
    megaMenu.setAttribute('aria-label', 'All engineering services');
    const shutdownLink = $$('a', megaMenu).find(a => a.href.includes('service-project-shutdown-qa') || /shutdown/i.test(a.textContent));
    if (shutdownLink) {
      shutdownLink.textContent = 'Project & Shutdown Inspection';
      const menuLinks = $$('a', megaMenu);
      if (menuLinks.length >= 3 && menuLinks[2] !== shutdownLink) {
        megaMenu.insertBefore(shutdownLink, menuLinks[2]);
      }
    }
    const link = $('a', dropdown);
    menuButton = document.createElement('button');
    menuButton.type = 'button';
    menuButton.className = 'aes-menu-toggle';
    menuButton.setAttribute('aria-label', 'Show all services');
    menuButton.setAttribute('aria-controls', megaMenu.id);
    menuButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
    const previousIcon = $('svg', link);
    if (previousIcon) previousIcon.remove();
    dropdown.appendChild(menuButton);
    // Reuse the saved WordPress menu and contact details in a full-width header panel.
    header.classList.add('aes-expanded-header');
    $(':scope > div:first-child > a', header)?.classList.add('aes-header-brand');
    contactButton = $('nav > .btn-premium-orange, nav > .btn-theme', header);
    contactButton?.classList.add('aes-header-contact');
    servicePanel = document.createElement('div');
    servicePanel.className = 'aes-services-panel';
    servicePanel.id = 'aes-services-panel';
    servicePanel.innerHTML = '<div class="aes-services-panel__inner"><div class="aes-services-panel__spacer" aria-hidden="true"></div><div class="aes-services-panel__links"></div><div class="aes-services-panel__contact"></div></div>';
    $('.aes-services-panel__links', servicePanel).appendChild(megaMenu);
    const contactArea = $('.aes-services-panel__contact', servicePanel);
    const whatsapp = $('footer a[href*="wa.me/"]');
    const email = $('footer a[href^="mailto:"]');
    const phone = whatsapp ? new URL(whatsapp.href).pathname.replace(/\D/g, '') : '918200441159';
    const mail = email ? email.getAttribute('href').slice(7).split('?')[0] : 'info@aksharengineeringservices.com';
    function addContact(href, label, value, svg, newTab = false) {
      const anchor = document.createElement('a');
      anchor.className = 'aes-menu-contact';
      anchor.href = href;
      if (newTab) { anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; }
      anchor.innerHTML = '<span class="aes-menu-contact__icon" aria-hidden="true"></span><span class="aes-menu-contact__copy"><span class="aes-menu-contact__label"></span><span class="aes-menu-contact__value"></span></span>';
      $('.aes-menu-contact__label', anchor).textContent = label;
      const valueElement = $('.aes-menu-contact__value', anchor);
      if (label === 'Email us' && value.includes('@')) {
        const [localPart, domain] = value.split('@');
        valueElement.append(localPart + '@', document.createElement('wbr'), domain);
      } else valueElement.textContent = value;
      $('.aes-menu-contact__icon', anchor).innerHTML = svg;
      contactArea.appendChild(anchor);
    }
    const whatsappIcon = whatsapp?.querySelector('svg')?.outerHTML || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a9 9 0 0 1-13.4 7.9L3 21l1.6-4.6A9 9 0 1 1 21 11.5Z"/></svg>';
    const phoneLabel = phone.length === 12 && phone.startsWith('91') ? '+91 ' + phone.slice(2, 7) + ' ' + phone.slice(7) : '+' + phone;
    addContact('https://wa.me/' + phone, 'WhatsApp', phoneLabel, whatsappIcon, true);
    addContact('mailto:' + mail, 'Email us', mail, '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>');
    header.appendChild(servicePanel);
    menuButton.setAttribute('aria-controls', servicePanel.id);
    measureMega();
    setMega(false);
    menuButton.addEventListener('click', () => setMega(dropdown.dataset.aesMenu !== 'open'));
    dropdown.addEventListener('mouseenter', () => {
      clearTimeout(menuTimer);
      if (matchMedia('(hover: hover)').matches) menuOpenTimer = setTimeout(() => setMega(true), 70);
    });
    dropdown.addEventListener('mouseleave', () => clearTimeout(menuOpenTimer));
    header.addEventListener('mouseleave', () => {
      clearTimeout(menuOpenTimer);
      clearTimeout(menuTimer);
      menuTimer = setTimeout(() => {
        if (!header.contains(document.activeElement) || !document.activeElement.matches(':focus-visible')) setMega(false);
      }, 240);
    });
    header.addEventListener('mouseenter', () => clearTimeout(menuTimer));
    header.addEventListener('focusout', event => {
      if (event.relatedTarget && header.contains(event.relatedTarget)) return;
      setTimeout(() => { if (!header.contains(document.activeElement)) setMega(false); }, 0);
    });
    header.addEventListener('focusin', event => {
      if (servicePanel.contains(event.target)) setMega(true);
      else if (!dropdown.contains(event.target) && event.target !== contactButton) setMega(false);
    });
    $$('nav > a:not(.aes-header-contact)', header).forEach(anchor => {
      anchor.addEventListener('mouseenter', () => {
        clearTimeout(menuOpenTimer);
        clearTimeout(menuTimer);
        menuTimer = setTimeout(() => setMega(false), 160);
      });
      anchor.addEventListener('mouseleave', () => clearTimeout(menuTimer));
    });
    dropdown.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' && (event.target === link || event.target === menuButton)) {
        event.preventDefault(); setMega(true);
        const first = $('a', megaMenu);
        requestAnimationFrame(() => {
          if (first && dropdown.dataset.aesMenu === 'open') first.focus({ preventScroll: true });
        });
      }
    });
    document.addEventListener('click', event => {
      if (!header.contains(event.target)) setMega(false);
    });
    desktop.addEventListener('change', () => setMega(false));
    window.addEventListener('resize', () => {
      measureMega();
      if (!desktop.matches) setMega(false);
    }, { passive: true });
    document.fonts?.ready.then(measureMega);
  }

  // One modal controller preserves the existing openModal / closeModal API.
  const modals = $$('.modal-backdrop');
  let activeModal = null;
  let returnFocus = null;
  let savedOverflow = '';
  const inertBefore = new Map();
  modals.forEach(modal => {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.tabIndex = -1;
    const heading = $('h2, h3', modal);
    if (heading) {
      heading.id = heading.id || modal.id + '-title';
      modal.setAttribute('aria-labelledby', heading.id);
    }
    $$('button[onclick*="closeModal"]', modal).forEach(button => {
      button.type = 'button';
      button.setAttribute('aria-label', 'Close dialog');
      const headingRow = button.closest('.modal-backdrop > div > div');
      headingRow?.classList.add('aes-modal-heading');
    });
  });
  function restoreBackground() {
    inertBefore.forEach((wasInert, element) => { element.inert = wasInert; });
    inertBefore.clear();
  }
  window.openModal = id => {
    const modal = document.getElementById(id);
    if (!modal || !modal.classList.contains('modal-backdrop')) {
      const reason = { inquiryModal: 'inquiry', trainingModal: 'inquiry', verifyDocModal: 'doc_verify' }[id];
      if (reason && window.AES?.supportUrl) location.assign(AES.supportUrl + '#' + reason);
      return;
    }
    if (activeModal === modal) return;
    if (!activeModal) {
      returnFocus = document.activeElement;
      savedOverflow = document.body.style.overflow;
    } else {
      activeModal.classList.add('hidden');
      activeModal.setAttribute('aria-hidden', 'true');
      restoreBackground();
    }
    closeMobile();
    setMega(false);
    activeModal = modal;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('overflow-hidden');
    Array.from(document.body.children).forEach(element => {
      if (element !== modal && !['SCRIPT', 'STYLE', 'LINK'].includes(element.tagName)) {
        inertBefore.set(element, element.inert);
        element.inert = true;
      }
    });
    const panel = modal.firstElementChild;
    if (panel) panel.scrollTop = 0;
    requestAnimationFrame(() => {
      if (activeModal === modal) modal.focus({ preventScroll: true });
    });
  };
  window.closeModal = id => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    if (modal !== activeModal) return;
    activeModal = null;
    restoreBackground();
    document.body.style.overflow = savedOverflow;
    document.body.classList.remove('overflow-hidden');
    if (returnFocus && returnFocus.isConnected && returnFocus.getClientRects().length) {
      returnFocus.focus({ preventScroll: true });
    } else if (mobileButton && !desktop.matches) {
      mobileButton.focus({ preventScroll: true });
    }
    returnFocus = null;
  };
  document.addEventListener('click', event => {
    if (activeModal && event.target === activeModal) {
      event.stopImmediatePropagation();
      window.closeModal(activeModal.id);
    }
  }, true);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      // Stop the old page handlers from closing a modal without restoring focus.
      event.stopImmediatePropagation();
      if (activeModal) { event.preventDefault(); window.closeModal(activeModal.id); }
      else if (dropdown && dropdown.dataset.aesMenu === 'open') {
        event.preventDefault(); setMega(false); menuButton.focus();
      } else if (mobileMenu && !mobileMenu.classList.contains('hidden')) closeMobile(true);
    }
    if (event.key === 'Tab' && activeModal) {
      const controls = visibleControls(activeModal);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); activeModal.focus(); }
      else if (event.shiftKey && (document.activeElement === first || document.activeElement === activeModal)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === activeModal)) {
        event.preventDefault(); first.focus();
      }
    }
  }, true);

  // Associate the existing visible labels, including the dynamically changed inquiry fields.
  let fieldNumber = 0;
  function labelFields(root) {
    $$('input:not([type=hidden]), select, textarea', root).forEach(field => {
      if (field.labels && field.labels.length) return;
      const parent = field.parentElement;
      const challenge = Array.from(parent.children).find(node => node.tagName === 'SPAN' && /Are you human\?/i.test(node.textContent));
      if (challenge) {
        challenge.id = challenge.id || 'aes-challenge-' + (++fieldNumber);
        field.setAttribute('aria-labelledby', challenge.id);
        field.dataset.aesLabel = 'Human verification';
        return;
      }
      const label = $('label', parent) || (field.type === 'file' && parent.parentElement ? $('label', parent.parentElement) : null);
      if (!label || label.htmlFor) return;
      if (!field.id) {
        do { field.id = 'aes-field-' + (++fieldNumber); } while (document.getElementById(field.id) !== field);
      }
      label.htmlFor = field.id;
    });
  }
  labelFields(document);
  const dynamicFields = $('#dynamicFormFields');
  if (dynamicFields) new MutationObserver(() => labelFields(dynamicFields)).observe(dynamicFields, { childList: true });
  $$('input[type=file]').forEach(input => {
    // Careers already has its own visible filename, so retain that handler.
    if (input.hasAttribute('onchange')) return;
    const status = document.createElement('p');
    status.className = 'aes-file-status';
    status.id = 'aes-upload-' + (++fieldNumber);
    status.setAttribute('role', 'status');
    input.parentElement.insertAdjacentElement('afterend', status);
    input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'), status.id].filter(Boolean).join(' '));
    input.addEventListener('change', () => {
      status.textContent = input.files.length ? Array.from(input.files, file => file.name).join(', ') : '';
    });
    if (input.form) input.form.addEventListener('reset', () => { status.textContent = ''; });
  });
  $$('.reason-pill').forEach(pill => {
    const sync = () => pill.setAttribute('aria-pressed', String(pill.classList.contains('active')));
    sync();
    new MutationObserver(sync).observe(pill, { attributes: true, attributeFilter: ['class'] });
  });
  $$('div[onclick]').forEach(card => {
    if (card.querySelector('a, button, input, select, textarea')) return;
    card.tabIndex = 0; card.setAttribute('role', 'button');
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); }
    });
  });

  // Measure the real title height so wrapped card titles never disappear below the edge.
  $$('.service-card-drawer').forEach(drawer => {
    const title = $('h3', drawer);
    if (!title) return;
    const measure = () => {
      const padding = parseFloat(getComputedStyle(drawer).paddingTop);
      const eyebrow = drawer.firstElementChild !== title ? drawer.firstElementChild.getBoundingClientRect().height + 4 : 0;
      drawer.style.setProperty('--aes-drawer-peek', Math.ceil(title.getBoundingClientRect().height + eyebrow + padding * 2) + 'px');
    };
    measure();
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(title);
  });

  // Reset the drawer, trace one rounded border from top centre, then navigate the new tab.
  $$('a.service-slide-card[href], a.aes-directory-card[href]').forEach(card => {
    card.target = '_blank';
    card.relList.add('noopener', 'noreferrer');
    let opening = false;
    let openDirectly = false;
    const releaseReset = () => {
      if (!opening) card.classList.remove('aes-card-reset');
    };
    card.addEventListener('mouseleave', releaseReset);
    card.addEventListener('focusout', releaseReset);
    card.addEventListener('click', async event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (opening) { event.preventDefault(); event.stopImmediatePropagation(); return; }
      if (openDirectly) { openDirectly = false; return; }
      card.classList.add('aes-card-reset');
      if (motion.matches || !card.animate) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      opening = true;
      card.blur();
      const href = card.href;

      card.classList.remove('card-highlighted');
      $$('.card-trace-svg, .aes-card-click-trace', card).forEach(trace => trace.remove());
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('aes-card-click-trace');
      svg.setAttribute('aria-hidden', 'true');
      const width = card.clientWidth, height = card.clientHeight;
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('preserveAspectRatio', 'none');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const edge = 3, right = width - edge, bottom = height - edge;
      const radius = Math.min(14, width / 4, height / 4);
      path.setAttribute('d', `M ${width / 2} ${edge} H ${right - radius} Q ${right} ${edge} ${right} ${edge + radius} V ${bottom - radius} Q ${right} ${bottom} ${right - radius} ${bottom} H ${edge + radius} Q ${edge} ${bottom} ${edge} ${bottom - radius} V ${edge + radius} Q ${edge} ${edge} ${edge + radius} ${edge} H ${width / 2}`);
      svg.appendChild(path);
      card.appendChild(svg);
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = String(length);
      try {
        await path.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
          duration: 850, easing: 'linear', fill: 'forwards'
        }).finished;
        await svg.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 360, easing: 'ease-in-out', fill: 'forwards'
        }).finished;
        // Let the transparent final frame paint before the browser opens the destination.
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      } catch (error) { /* Reduced-motion changes cancel the trace and continue navigation. */ }
      finally {
        svg.remove();
        opening = false;
        if (!card.matches(':hover') || !matchMedia('(hover: hover)').matches) releaseReset();
        // Keep the whole sequence short enough to retain the click's transient user activation.
        const destination = window.open('', '_blank');
        if (destination) {
          destination.opener = null;
          destination.location.replace(href);
        } else {
          // A blocked popup leaves the real anchor usable on the next trusted click.
          openDirectly = true;
          card.title = 'Click again to open this service in a new tab';
        }
      }
    }, true);
  });
  $$('#equipment .grid > div, #sectors .grid > div, #openings .grid > div, main section .grid > div.border').forEach(card => {
    if (!card.querySelector('form')) card.classList.add('aes-content-card');
  });

  // Content remains visible if animation APIs are unavailable or JavaScript is interrupted.
  // Each homepage heading owns a line aligned with its first letter.
  const headingRules = [];
  if (document.body.classList.contains('home')) $$('section h2').forEach(heading => {
    if (heading.closest('.service-slide-card, .modal-backdrop, form, footer')) return;
    if (heading.nextElementSibling?.matches('.heading-line-track')) heading.nextElementSibling.remove();
    heading.classList.add('aes-home-heading');
    if (getComputedStyle(heading).textAlign === 'center') heading.classList.add('aes-home-heading--center');
    const rule = document.createElement('span');
    rule.className = 'aes-heading-rule'; rule.setAttribute('aria-hidden', 'true');
    rule.innerHTML = '<span class="aes-heading-rule__fill"></span>';
    heading.appendChild(rule); headingRules.push(rule);
  });
  if (headingRules.length) {
    const fill = rule => rule.classList.add('is-filled');
    if (motion.matches || !('IntersectionObserver' in window)) headingRules.forEach(fill);
    else {
      const headingObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        fill(entry.target); headingObserver.unobserve(entry.target);
      }), { threshold: 1, rootMargin: '0px 0px -12% 0px' });
      headingRules.forEach(rule => headingObserver.observe(rule));
    }
  }
  const revealCandidates = $$('main h1, main h2, main .grid > *, main .service-slide-card, main .aes-directory-card, main .aes-service-stage, main .aes-engagement-map > li, main .aes-contact-channel, main .aes-process-step, main .aes-reach-card, main .aes-culture-card, main .aes-jobs-grid > article, main .aes-hiring-map > li, .aes-detail-hero__copy, footer .footer-grid > div, main > section:first-child > .relative > div > *');
  const revealSet = new Set(revealCandidates);
  const revealTargets = revealCandidates.filter(target => {
    // Animate each content group once; nested animations would compound the movement.
    for (let parent = target.parentElement; parent; parent = parent.parentElement) {
      if (revealSet.has(parent)) return false;
    }
    return !target.closest('.modal-backdrop, form') && !target.querySelector('form');
  });
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (motion.matches || !entry.target.animate) return;
        const siblings = Array.from(entry.target.parentElement.children);
        const delay = Math.min(siblings.indexOf(entry.target) * 45, 135);
        const sideways = entry.target.classList.contains('service-slide-card') || !!entry.target.closest('.aes-culture-gallery');
        entry.target.animate([
          { opacity: .35, translate: sideways ? '-18px 8px' : '0 18px' },
          { opacity: 1, translate: '0 0' }
        ], { duration: 700, delay, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' });
      });
    }, { threshold: .08 });
    revealTargets.forEach(target => observer.observe(target));
  }
  motion.addEventListener('change', () => {
    if (motion.matches) document.getAnimations().forEach(animation => animation.cancel());
    updateImagePan();
  });

  // A small horizontal image pan follows scroll progress; vertical hover movement stays independent.
  const panCards = $$('.service-slide-card').filter(card => $(':scope > img', card));
  const visiblePanCards = new Set(panCards);
  function updateImagePan() {
    if (motion.matches) {
      panCards.forEach(card => card.style.removeProperty('--aes-pan-x'));
      return;
    }
    const viewport = window.innerHeight;
    const positions = Array.from(visiblePanCards, card => ({ card, rect: card.getBoundingClientRect() }));
    positions.forEach(({ card, rect }) => {
      const progress = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport + rect.height)));
      card.style.setProperty('--aes-pan-x', (-12 + progress * 24).toFixed(2) + 'px');
    });
  }
  if ('IntersectionObserver' in window) {
    const panObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visiblePanCards.add(entry.target);
        else visiblePanCards.delete(entry.target);
      });
      updateImagePan();
    }, { rootMargin: '80px 0px' });
    panCards.forEach(card => panObserver.observe(card));
  }
  window.addEventListener('resize', () => requestAnimationFrame(updateImagePan), { passive: true });

  const video = $('video#heroVideo') || $('video');
  if (video) {
    // Strip any poster image to prevent static image flashing during video transitions
    video.removeAttribute('poster');

    video.setAttribute('aria-hidden', 'true');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.playbackRate = 1.0;

    // Playlist: loop through wind_turbine.mp4 and solar_plant.mp4
    const playlistAttr = video.getAttribute('data-playlist');
    let playlist = [];
    if (playlistAttr) {
      playlist = playlistAttr.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (!playlist.length) {
      playlist = [
        AES.theme + '/video/wind_turbine.mp4',
        AES.theme + '/video/solar_plant.mp4'
      ];
    }

    let currentIdx = 0;
    const initialSource = video.querySelector('source')?.getAttribute('src') || video.currentSrc || video.src || '';
    if (initialSource) {
      const foundIdx = playlist.findIndex(url => initialSource.includes(url.split('/').pop()));
      if (foundIdx !== -1) currentIdx = foundIdx;
    }

    video.removeAttribute('loop');
    video.loop = false;

    // Dual-buffer ping-pong player: pre-decodes the next video in the background for zero-delay (0ms gap) handoff
    let bufferVideo = document.getElementById('heroVideoBuffer');
    if (!bufferVideo && video.parentNode && playlist.length > 1) {
      bufferVideo = document.createElement('video');
      bufferVideo.id = 'heroVideoBuffer';
      bufferVideo.className = video.className;
      bufferVideo.muted = true;
      bufferVideo.playsInline = true;
      bufferVideo.preload = 'auto';
      bufferVideo.playbackRate = 1.0;
      bufferVideo.setAttribute('aria-hidden', 'true');
      video.parentNode.insertBefore(bufferVideo, video.nextSibling);
    }

    if (bufferVideo) {
      bufferVideo.removeAttribute('poster');
      bufferVideo.muted = true;
      bufferVideo.playsInline = true;
      bufferVideo.preload = 'auto';
    }

    let activeVideo = video;
    let idleVideo = bufferVideo;

    function applyVideoStates() {
      if (activeVideo) {
        activeVideo.classList.add('aes-hero-video-active');
        activeVideo.classList.remove('aes-hero-video-idle');
        activeVideo.style.zIndex = '3';
        activeVideo.style.opacity = '0.92';
      }
      if (idleVideo) {
        idleVideo.classList.add('aes-hero-video-idle');
        idleVideo.classList.remove('aes-hero-video-active');
        idleVideo.style.zIndex = '1';
        idleVideo.style.opacity = '0';
      }
    }
    applyVideoStates();

    function prepareIdle() {
      if (!idleVideo || playlist.length < 2) return;
      const nextIdx = (currentIdx + 1) % playlist.length;
      const nextUrl = playlist[nextIdx];
      idleVideo.removeAttribute('poster');
      if (idleVideo.src !== nextUrl) {
        idleVideo.src = nextUrl;
        idleVideo.load();
      }
      idleVideo.currentTime = 0;
    }
    prepareIdle();

    let switching = false;
    function switchNext() {
      if (switching || playlist.length < 2 || !idleVideo) {
        if (playlist.length === 1 && activeVideo) {
          activeVideo.currentTime = 0;
          activeVideo.play().catch(() => {});
        }
        return;
      }
      switching = true;

      // Start the pre-buffered idle video immediately with zero delay
      idleVideo.play().then(() => {
        const prevActive = activeVideo;
        activeVideo = idleVideo;
        idleVideo = prevActive;

        currentIdx = (currentIdx + 1) % playlist.length;
        applyVideoStates();

        // Delay loading the next clip on the retired video until the new active video is firmly displayed
        setTimeout(() => {
          prevActive.pause();
          prepareIdle();
          switching = false;
        }, 150);
      }).catch(() => {
        const prevActive = activeVideo;
        activeVideo = idleVideo;
        idleVideo = prevActive;
        currentIdx = (currentIdx + 1) % playlist.length;
        applyVideoStates();
        setTimeout(() => {
          prepareIdle();
          switching = false;
        }, 150);
      });
    }

    function onTimeUpdate(e) {
      const v = e.target;
      if (v !== activeVideo) return;
      if (v.duration && v.currentTime >= v.duration - 0.08) {
        switchNext();
      }
    }

    function onEnded(e) {
      if (e.target !== activeVideo) return;
      switchNext();
    }

    function onError(e) {
      if (e.target === activeVideo) {
        setTimeout(switchNext, 200);
      }
    }

    [video, bufferVideo].filter(Boolean).forEach(v => {
      v.addEventListener('timeupdate', onTimeUpdate);
      v.addEventListener('ended', onEnded);
      v.addEventListener('error', onError);
    });

    const hero = video.closest('section');
    let inView = true;
    function syncVideo() {
      if (document.hidden || !inView) {
        if (activeVideo) activeVideo.pause();
        if (idleVideo) idleVideo.pause();
      } else {
        if (activeVideo) activeVideo.play().catch(() => {});
      }
    }
    document.addEventListener('visibilitychange', syncVideo);
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting;
        syncVideo();
      }).observe(hero);
    }
    syncVideo();
  }

  const backTop = document.createElement('button');
  backTop.type = 'button'; backTop.className = 'aes-back-top';
  backTop.setAttribute('aria-label', 'Back to top');
  backTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 12 6-6 6 6M12 6v14"/></svg>';
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: motion.matches ? 'instant' : 'smooth' });
    const logo = header && $('a', header);
    if (logo) logo.focus({ preventScroll: true });
  });
  document.body.appendChild(backTop);
  window.aesEnhanceButtons(document.body);
  let scrollPending = false;
  function updateScroll() {
    if (header) header.classList.toggle('aes-scrolled', scrollY > 12);
    backTop.classList.toggle('is-visible', scrollY > 650);
    updateImagePan();
    scrollPending = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  updateScroll();
})();

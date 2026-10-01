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
  const main = $('main');
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
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  $$('header a[href]').forEach(link => {
    const file = new URL(link.href).pathname.split('/').pop();
    if (file === currentFile) link.setAttribute('aria-current', 'page');
    else if (file === 'services.html' && currentFile.startsWith('service-')) link.setAttribute('aria-current', 'true');
  });
  $$('a[target="_blank"]').forEach(link => link.relList.add('noopener', 'noreferrer'));
  $$('a[href*="wa.me"]').forEach(link => link.setAttribute('aria-label', 'Chat with AES on WhatsApp (opens in a new tab)'));

  function closeMobile(restoreFocus = false) {
    if (!mobileMenu || !mobileButton) return;
    mobileMenu.classList.add('hidden');
    mobileButton.setAttribute('aria-expanded', 'false');
    mobileButton.setAttribute('aria-label', 'Open navigation');
    if (restoreFocus) mobileButton.focus();
  }
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
      mobileMenu.classList.toggle('hidden', !opening);
      mobileButton.setAttribute('aria-expanded', String(opening));
      mobileButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
    }, true);
    mobileMenu.addEventListener('click', event => {
      if (event.target.closest('a, button')) closeMobile();
    });
    document.addEventListener('click', event => {
      if (header && !header.contains(event.target)) closeMobile();
    });
    header.addEventListener('focusout', () => {
      queueMicrotask(() => { if (!header.contains(document.activeElement)) closeMobile(); });
    });
    desktop.addEventListener('change', () => closeMobile());
  }

  let menuButton;
  let menuTimer;
  function setMega(open) {
    if (!dropdown || !megaMenu) return;
    clearTimeout(menuTimer);
    dropdown.dataset.aesMenu = open ? 'open' : 'closed';
    megaMenu.setAttribute('aria-hidden', String(!open));
    megaMenu.inert = !open;
    if (menuButton) menuButton.setAttribute('aria-expanded', String(open));
  }
  if (dropdown && megaMenu) {
    megaMenu.id = megaMenu.id || 'services-navigation';
    megaMenu.setAttribute('aria-label', 'All engineering services');
    const link = $('a', dropdown);
    menuButton = document.createElement('button');
    menuButton.type = 'button';
    menuButton.className = 'aes-menu-toggle';
    menuButton.setAttribute('aria-label', 'Show all services');
    menuButton.setAttribute('aria-controls', megaMenu.id);
    menuButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
    const previousIcon = $('svg', link);
    if (previousIcon) previousIcon.remove();
    dropdown.insertBefore(menuButton, megaMenu);
    setMega(false);
    menuButton.addEventListener('click', () => setMega(dropdown.dataset.aesMenu !== 'open'));
    dropdown.addEventListener('mouseenter', () => {
      if (matchMedia('(hover: hover)').matches) setMega(true);
    });
    dropdown.addEventListener('mouseleave', () => {
      menuTimer = setTimeout(() => {
        if (!dropdown.contains(document.activeElement)) setMega(false);
      }, 180);
    });
    dropdown.addEventListener('focusout', () => queueMicrotask(() => {
      if (!dropdown.contains(document.activeElement)) setMega(false);
    }));
    dropdown.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' && (event.target === link || event.target === menuButton)) {
        event.preventDefault(); setMega(true);
        const first = $('a', megaMenu);
        if (first) first.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!dropdown.contains(event.target)) setMega(false);
    });
    desktop.addEventListener('change', () => setMega(false));
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
    });
  });
  function restoreBackground() {
    inertBefore.forEach((wasInert, element) => { element.inert = wasInert; });
    inertBefore.clear();
  }
  window.openModal = id => {
    const modal = document.getElementById(id);
    if (!modal || !modal.classList.contains('modal-backdrop')) return;
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
      drawer.style.setProperty('--aes-drawer-peek', Math.ceil(title.getBoundingClientRect().height + padding * 2) + 'px');
    };
    measure();
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(title);
  });
  $$('.service-slide-card').forEach(card => {
    card.addEventListener('click', () => card.blur());
    card.addEventListener('mouseleave', () => card.blur());
  });
  $$('#equipment .grid > div, #sectors .grid > div, #openings .grid > div, main section .grid > div.border').forEach(card => {
    if (!card.querySelector('form')) card.classList.add('aes-content-card');
  });

  // Content remains visible if animation APIs are unavailable or JavaScript is interrupted.
  const revealTargets = $$('main h2, .service-slide-card, .service-card-target, .aes-content-card');
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (motion.matches || !entry.target.animate) return;
        entry.target.animate([
          { opacity: .55, translate: '0 16px' },
          { opacity: 1, translate: '0 0' }
        ], { duration: 550, easing: 'cubic-bezier(.22, 1, .36, 1)' });
      });
    }, { threshold: .08 });
    revealTargets.forEach(target => observer.observe(target));
  }
  motion.addEventListener('change', () => {
    if (motion.matches) document.getAnimations().forEach(animation => animation.cancel());
  });

  const video = $('video#heroVideo') || $('video');
  if (video) {
    const playlist = [
      'video/oil refinery.mp4',
      'video/solar park.mp4',
      'video/wind plant.mp4',
      'video/windmill.mp4'
    ];
    let currentVideoIdx = 0;

    video.poster = 'assets/hero_inspection.jpg';
    video.setAttribute('aria-hidden', 'true');
    video.removeAttribute('loop');
    video.preload = 'auto';
    video.playbackRate = 1.0;

    function playNextVideo() {
      currentVideoIdx = (currentVideoIdx + 1) % playlist.length;
      video.style.opacity = '0.8';
      video.src = encodeURI(playlist[currentVideoIdx]);
      video.load();
      video.play().then(() => {
        video.style.opacity = '1';
      }).catch(() => {});
    }

    video.addEventListener('ended', playNextVideo);
    video.addEventListener('error', () => {
      setTimeout(playNextVideo, 1200);
    });

    const hero = video.closest('section');
    let inView = true;
    function syncVideo() {
      if (document.hidden || !inView) {
        video.pause();
      } else {
        video.play().catch(() => {});
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
  let scrollPending = false;
  function updateScroll() {
    if (header) header.classList.toggle('aes-scrolled', scrollY > 12);
    backTop.classList.toggle('is-visible', scrollY > 650);
    scrollPending = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  updateScroll();
})();

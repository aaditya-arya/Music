(function (wp) {
  const { registerBlockType } = wp.blocks || {};
  const { createElement: el, useState, useEffect, useRef, Fragment } = wp.element || {};
  const { InspectorControls, useBlockProps } = wp.blockEditor || wp.editor || {};
  const { PanelBody, TextControl, TextareaControl, SelectControl, ToggleControl, Button } = wp.components || {};

  /**
   * Parse Services Dropdown items from Header HTML
   */
  function parseDropdownItems(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const menu = doc.querySelector('.mega-dropdown-menu');
    if (!menu) return [];
    const items = [];
    menu.querySelectorAll('a').forEach((a) => {
      items.push({
        label: a.textContent.trim(),
        url: a.getAttribute('href') || '#',
      });
    });
    return items;
  }

  /**
   * Write updated Services Dropdown items back into Header HTML
   */
  function updateDropdownItemsInHtml(html, items) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const menu = doc.querySelector('.mega-dropdown-menu');
    if (!menu) return html;

    // Preserve existing link classes or use standard AES dropdown item classes
    const sampleLink = menu.querySelector('a');
    const linkClass = sampleLink
      ? sampleLink.getAttribute('class')
      : 'block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors';

    menu.innerHTML = '';
    items.forEach((item) => {
      const a = doc.createElement('a');
      a.setAttribute('class', linkClass);
      a.setAttribute('href', item.url || '#');
      a.textContent = item.label || 'Service Item';
      menu.appendChild(a);
    });

    return doc.body.innerHTML;
  }

  /**
   * Clean editor-only attributes before saving HTML into block attributes
   */
  function serializeCleanHtml(container) {
    if (!container) return '';
    const clone = container.cloneNode(true);
    clone.querySelectorAll('[contenteditable]').forEach((node) => {
      node.removeAttribute('contenteditable');
    });
    clone.querySelectorAll('[data-aes-editor-events]').forEach(node => {
      for (const [name, value] of Object.entries(JSON.parse(node.dataset.aesEditorEvents))) node.setAttribute(name, value);
      node.removeAttribute('data-aes-editor-events');
    });
    clone.querySelectorAll('[data-aes-editor-disabled]').forEach(node => {
      node.setAttribute('disabled', ''); node.removeAttribute('data-aes-editor-disabled');
    });
    clone.querySelectorAll('.aes-gb-active-element').forEach((node) => {
      node.classList.remove('aes-gb-active-element');
      if (node.getAttribute('class') === '') node.removeAttribute('class');
    });
    return clone.innerHTML.replace(/<!--[\s\S]*?-->/g, '');
  }

  /**
   * Make text elements inside the visual canvas directly editable
   */
  function enableInlineEditing(container) {
    if (!container) return;
    container.querySelectorAll('*').forEach(node => {
      const events = {};
      for (const attribute of [...node.attributes]) if (/^on/i.test(attribute.name)) {
        events[attribute.name] = attribute.value; node.removeAttribute(attribute.name);
      }
      if (Object.keys(events).length) node.dataset.aesEditorEvents = JSON.stringify(events);
      if (node.matches('button[disabled]')) { node.dataset.aesEditorDisabled = '1'; node.disabled = false; }
    });
    const selectors = 'h1, h2, h3, h4, h5, h6, p, span, strong, em, cite, li, a, button, label, div, dd, dt, summary, address, legend';
    container.querySelectorAll(selectors).forEach((node) => {
      // Only make leaf text containers or inline text containers contenteditable
      const hasBlockChildren = node.querySelector('div, section, ul, ol, dl, table, article, header, footer, nav, form, fieldset, input, select, textarea, h1, h2, h3, h4, h5, h6, p');
      if (!hasBlockChildren && node.textContent.trim().length > 0 && !node.parentElement.closest('[contenteditable="true"]') && !node.closest('svg, [aria-hidden="true"]')) {
        node.setAttribute('contenteditable', 'true');
      }
    });
  }

  /**
   * Find closest repeating card/item (e.g. Service card, Equipment card, Sector card, Client logo, List item)
   */
  function findRepeatableCard(target, root) {
    if (!target || !root) return null;
    // Never treat anything inside hero banner, global header, or global footer as a repeatable card
    if (root.querySelector('#heroVideo')) {
      return null;
    }
    let curr = target;
    while (curr && curr !== root && curr.parentElement && curr.parentElement !== root) {
      const parent = curr.parentElement;
      const tag = curr.tagName.toLowerCase();
      if (tag === 'li' || tag === 'article' || curr.matches('.service-slide-card, .aes-directory-card')) {
        if (curr.querySelector('form')) return null;
        return curr;
      }
      // Only match repeatable cards inside an explicit grid or list
      const parentClass = parent.className || '';
      if (
        typeof parentClass === 'string' &&
        (parentClass.includes('grid-cols') || parentClass.includes('footer-list')) &&
        !parentClass.includes('min-h-') &&
        parent.children.length > 0
      ) {
        return curr;
      }
      curr = parent;
    }
    return null;
  }

  registerBlockType('aes/section', {
    title: 'AES Visual Page Section',
    icon: 'layout',
    category: 'layout',
    attributes: {
      sectionId: { type: 'string', default: '' },
      title: { type: 'string', default: 'Page Section' },
      isGlobalHeader: { type: 'boolean', default: false },
      isGlobalFooter: { type: 'boolean', default: false },
      html: { type: 'string', default: '' },
      heroPlaylist: { type: 'array', default: [] },
      heroPlaylistManaged: { type: 'boolean', default: false },
      sectionHidden: { type: 'boolean', default: false },
    },

    edit: function (props) {
      const { attributes, setAttributes, isSelected } = props;
      const blockProps = useBlockProps();
      const { title, isGlobalHeader, isGlobalFooter, html, sectionId } = attributes;
      const decodedHtml = html ? decodeURIComponent(html) : '';

      const canvasRef = useRef(null);
      const activeNodeRef = useRef(null);
      const activeCardRef = useRef(null);
      const activeLinkRef = useRef(null);

      const [showDropdownEditor, setShowDropdownEditor] = useState(false);
      const usesWordPressMenu = !!window.AES_GUTENBERG?.nativeServiceMenu;
      const editServicesMenu = () => {
        if (usesWordPressMenu) window.open(window.AES_GUTENBERG.menusUrl, '_blank', 'noopener');
        else setShowDropdownEditor(!showDropdownEditor);
      };
      const [dropdownItems, setDropdownItems] = useState(() =>
        isGlobalHeader ? parseDropdownItems(decodedHtml) : []
      );
      const [contextState, setContextState] = useState(null); // { type: 'image'|'video'|'element', src, alt, href, hasCard, tagName }
      const [showCodeEditor, setShowCodeEditor] = useState(false);
      const [requestType, setRequestType] = useState('inquiry');
      const isSupport = decodedHtml.includes('aes-support-page');
      const supportDefaults = window.AES_GUTENBERG?.supportRequests || {};
      const getSupportConfig = () => {
        const node = canvasRef.current?.querySelector('.aes-support-page');
        let saved = {};
        try { saved = JSON.parse(node?.dataset.supportConfig || '{}'); } catch (error) {}
        const defaults = supportDefaults[requestType] || {};
        const config = { ...defaults, ...(saved[requestType] || {}) };
        config.fields = (defaults.fields || []).map(field => ({ ...field, ...(saved[requestType]?.fields?.find(item => item.id === field.id) || {}) }));
        if (requestType === 'inquiry' && node) {
          for (const [key, selector] of Object.entries({ title: '#selectedReasonInput', heading: '#request-form-heading', submit: '#formSubmitBtn', label: '#messageLabel', placeholder: '#messageTextarea', contextTitle: '#support-context-title', context: '#support-context-copy' })) {
            const target = node.querySelector(selector);
            if (target) config[key] = key === 'title' ? target.value : key === 'placeholder' ? target.placeholder : target.textContent.trim();
          }
        }
        return config;
      };
      const updateSupportCopy = (key, value, fieldId = null) => {
        const root = canvasRef.current?.querySelector('.aes-support-page');
        if (!root) return;
        let saved = {};
        try { saved = JSON.parse(root.dataset.supportConfig || '{}'); } catch (error) {}
        const config = getSupportConfig();
        if (fieldId) config.fields = config.fields.map(field => field.id === fieldId ? { ...field, [key]: value } : field);
        else config[key] = value;
        saved[requestType] = config;
        root.dataset.supportConfig = JSON.stringify(saved);
        if (requestType === 'inquiry' && !fieldId) {
          const target = root.querySelector({ title: '#selectedReasonInput', heading: '#request-form-heading', submit: '#formSubmitBtn', label: '#messageLabel', placeholder: '#messageTextarea', contextTitle: '#support-context-title', context: '#support-context-copy' }[key]);
          if (key === 'title') target.value = value;
          else if (key === 'placeholder') target.placeholder = value;
          else {
            const svg = target.querySelector('svg')?.cloneNode(true);
            target.textContent = value;
            if (svg) target.appendChild(svg);
          }
        }
        syncDomToAttributes();
      };

      const isHeroSection = window.AES_GUTENBERG?.layout === 'home' && sectionId === 'home-sec-1';
      const playlist = attributes.heroPlaylistManaged ? attributes.heroPlaylist : window.AESHeroPlaylist.read(decodedHtml);
      const heroVideoUrl = playlist[0]?.url || '';
      const getVideoUrlFromHtml = str => {
        const video = new DOMParser().parseFromString(str, 'text/html').querySelector('video');
        return video?.querySelector('source')?.getAttribute('src') || video?.getAttribute('src') || '';
      };
      const commitPlaylist = items => {
        const updated = window.AESHeroPlaylist.apply(canvasRef.current ? serializeCleanHtml(canvasRef.current) : decodedHtml, items);
        if (canvasRef.current) { canvasRef.current.innerHTML = updated; enableInlineEditing(canvasRef.current); }
        setAttributes({ html: encodeURIComponent(updated), heroPlaylist: items, heroPlaylistManaged: true });
      };
      const openMediaLibraryForHeroVideo = () => window.AESHeroPlaylist.choose(items => {
        if (isHeroSection) { commitPlaylist(playlist.concat(items)); return; }
        const root = canvasRef.current?.querySelector('section, main') || canvasRef.current;
        if (!root) return;
        for (const item of items) {
          const video = document.createElement('video'); video.controls = true; video.preload = 'metadata';
          video.className = 'w-full rounded-xl my-4'; video.src = item.url; root.appendChild(video);
        }
        syncDomToAttributes();
      });
      const addOrChangeHeroVideo = newUrl => {
        if (isHeroSection) {
          const next = playlist.slice(); next[0] = { id: next[0]?.id || 'first', url: newUrl }; commitPlaylist(next);
        } else {
          const video = activeNodeRef.current;
          if (video?.tagName === 'VIDEO') { video.removeAttribute('src'); video.querySelectorAll('source').forEach(node => node.remove()); video.src = newUrl; setContextState(previous => previous ? { ...previous, src: newUrl } : previous); syncDomToAttributes(); }
        }
      };
      const replaceActiveVideo = () => window.AESHeroPlaylist.choose(items => { if (items[0]) addOrChangeHeroVideo(items[0].url); }, false);

      const removeHeroVideo = () => {
        if (isHeroSection) {
          if (confirm('Remove all background videos? You can add them again from the playlist manager.')) commitPlaylist([]);
        } else { activeNodeRef.current?.remove(); syncDomToAttributes(); }
        setContextState(null);
      };

      // Mount / external HTML update
      useEffect(() => {
        if (!canvasRef.current) return;
        const currentClean = serializeCleanHtml(canvasRef.current);
        if (currentClean !== decodedHtml && !canvasRef.current.contains(canvasRef.current.ownerDocument.activeElement)) {
          canvasRef.current.innerHTML = decodedHtml || '';
          enableInlineEditing(canvasRef.current);
        } else if (!canvasRef.current.innerHTML && decodedHtml) {
          canvasRef.current.innerHTML = decodedHtml;
          enableInlineEditing(canvasRef.current);
        }
        if (isGlobalHeader) {
          setDropdownItems(parseDropdownItems(decodedHtml));
        }
      }, [decodedHtml, isGlobalHeader]);

      const syncDomToAttributes = () => {
        if (!canvasRef.current) return;
        const updated = serializeCleanHtml(canvasRef.current);
        setAttributes({ html: encodeURIComponent(updated) });
        if (isGlobalHeader) {
          setDropdownItems(parseDropdownItems(updated));
        }
      };

      const handleCanvasClick = (e) => {
        // Prevent links, buttons, or inline onclick handlers from navigating away inside the editor
        if (!(e.target.tagName === 'VIDEO' && e.target.controls)) e.preventDefault();
        e.stopPropagation();
        // The canvas stops navigation events, so select its block explicitly.
        wp.data.dispatch('core/block-editor').selectBlock(props.clientId);

        if (!canvasRef.current) return;
        canvasRef.current.querySelectorAll('.aes-gb-active-element').forEach((n) => {
          n.classList.remove('aes-gb-active-element');
        });

        const target = e.target;
        if (target.matches('input:not([type=hidden]):not([type=file]), select, textarea')) {
          activeNodeRef.current = target;
          setContextState({ type: 'field', placeholder: target.getAttribute('placeholder') || '', options: target.tagName === 'SELECT' ? [...target.options].map(option => option.textContent).join('\n') : null, src: null, href: null, hasCard: false });
          return;
        }
        // If user clicked "Services" dropdown trigger in header, open the Services Dropdown Editor
        if (isGlobalHeader && target.closest('.nav-item-dropdown')) {
          editServicesMenu();
        }

        const videoElem = target.closest('video') || (target.id === 'heroVideo' ? target : (target.querySelector ? target.querySelector('video') : null));

        // If clicking in the Hero section and not directly typing on editable text, select Hero Video controls
        if (isHeroSection) {
          const isText = target.closest('h1, h2, h3, h4, h5, h6, p, a, button, input');
          if (videoElem || target.id === 'heroVideo' || target.classList.contains('absolute') || !isText) {
            setContextState({
              type: 'element',
              src: heroVideoUrl || getVideoUrlFromHtml(decodedHtml),
              alt: null,
              href: null,
              hasCard: false,
              tagName: 'VIDEO',
            });
            return;
          }
        }

        const img = target.tagName === 'IMG' ? target : target.querySelector('img');
        const link = target.closest('a');
        const card = findRepeatableCard(target, canvasRef.current);

        activeNodeRef.current = videoElem || img || target;
        activeLinkRef.current = link;
        activeCardRef.current = card;

        if (activeNodeRef.current && activeNodeRef.current !== canvasRef.current) {
          activeNodeRef.current.classList.add('aes-gb-active-element');
        }

        if (videoElem) {
          const currentSrc = getVideoUrlFromHtml(videoElem.outerHTML) || heroVideoUrl;
          setContextState({
            type: 'video',
            src: currentSrc,
            alt: null,
            href: null,
            hasCard: false,
            tagName: 'VIDEO',
          });
        } else if (img && (target.tagName === 'IMG' || !target.closest('[contenteditable="true"]'))) {
          setContextState({
            type: 'image',
            src: img.getAttribute('src') || '',
            alt: img.getAttribute('alt') || '',
            href: link ? link.getAttribute('href') || '' : null,
            hasCard: !!card,
            tagName: 'IMG',
          });
        } else {
          setContextState({
            type: 'element',
            src: img ? img.getAttribute('src') || '' : null,
            alt: img ? img.getAttribute('alt') || '' : null,
            href: link ? link.getAttribute('href') || '' : null,
            hasCard: !!card,
            tagName: target.tagName,
          });
        }
      };

      const openMediaLibraryForActiveImage = () => {
        const node = activeNodeRef.current;
        const img = node && node.tagName === 'IMG' ? node : (node && node.querySelector ? node.querySelector('img') : null);
        if (!img) return;

        const frame = wp.media({
          title: 'Select or Upload Image',
          button: { text: 'Use this image' },
          multiple: false,
        });

        frame.on('select', () => {
          const attachment = frame.state().get('selection').first().toJSON();
          if (attachment && attachment.url) {
            img.setAttribute('src', attachment.url);
            img.closest('picture')?.querySelectorAll('source').forEach(source => source.remove());
            for (const attr of ['srcset', 'sizes', 'width', 'height']) img.removeAttribute(attr);
            img.setAttribute('alt', attachment.alt || '');
            setContextState((prev) =>
              prev ? Object.assign({}, prev, { src: attachment.url, alt: attachment.alt || prev.alt }) : prev
            );
            syncDomToAttributes();
          }
        });

        frame.open();
      };

      const updateActiveImageSrc = (newSrc) => {
        const node = activeNodeRef.current;
        const img = node && node.tagName === 'IMG' ? node : (node && node.querySelector ? node.querySelector('img') : null);
        if (!img) return;
        img.setAttribute('src', newSrc);
        img.closest('picture')?.querySelectorAll('source').forEach(source => source.remove());
        for (const attr of ['srcset', 'sizes', 'width', 'height']) img.removeAttribute(attr);
        setContextState((prev) => (prev ? Object.assign({}, prev, { src: newSrc }) : prev));
        syncDomToAttributes();
      };

      const updateActiveLinkHref = (newHref) => {
        const link = activeLinkRef.current;
        if (!link) return;
        link.setAttribute('href', newHref);
        setContextState((prev) => (prev ? Object.assign({}, prev, { href: newHref }) : prev));
        syncDomToAttributes();
      };

      const duplicateActiveCard = () => {
        const card = activeCardRef.current;
        if (!card || !card.parentElement) return;
        const clone = card.cloneNode(true);
        clone.classList.remove('aes-gb-active-element');
        const suffix = '-copy-' + Date.now();
        const ids = new Map();
        [clone, ...clone.querySelectorAll('[id]')].forEach(node => {
          if (node.id) { ids.set(node.id, node.id + suffix); node.id += suffix; }
        });
        clone.querySelectorAll('[for], [aria-labelledby], [aria-describedby], [aria-controls]').forEach(node => {
          for (const attr of ['for', 'aria-labelledby', 'aria-describedby', 'aria-controls']) {
            if (node.hasAttribute(attr)) node.setAttribute(attr, node.getAttribute(attr).split(/\s+/).map(id => ids.get(id) || id).join(' '));
          }
        });
        card.parentElement.insertBefore(clone, card.nextSibling);
        enableInlineEditing(clone);
        syncDomToAttributes();
      };

      const removeActiveCard = () => {
        const card = activeCardRef.current;
        if (!card || !card.parentElement) return;
        const starter = document.createElement('div'); starter.appendChild(card.cloneNode(true));
        card.parentElement.dataset.aesCardTemplate = encodeURIComponent(serializeCleanHtml(starter));
        card.remove();
        activeCardRef.current = null;
        setContextState(null);
        syncDomToAttributes();
      };

      const moveActiveCard = (dir) => {
        const card = activeCardRef.current;
        if (!card || !card.parentElement) return;
        const parent = card.parentElement;
        if (dir === -1 && card.previousElementSibling) {
          parent.insertBefore(card, card.previousElementSibling);
          syncDomToAttributes();
        } else if (dir === 1 && card.nextElementSibling) {
          parent.insertBefore(card.nextElementSibling, card);
          syncDomToAttributes();
        }
      };

      // Services Dropdown Handlers
      const handleDropdownChange = (idx, field, value) => {
        const next = dropdownItems.map((item, i) =>
          i === idx ? Object.assign({}, item, { [field]: value }) : item
        );
        setDropdownItems(next);
        const newHtml = updateDropdownItemsInHtml(decodedHtml, next);
        if (canvasRef.current) {
          canvasRef.current.innerHTML = newHtml;
          enableInlineEditing(canvasRef.current);
        }
        setAttributes({ html: encodeURIComponent(newHtml) });
      };

      const handleAddDropdownItem = () => {
        const next = dropdownItems.concat([
          { label: 'New Service Item', url: (window.AES_GUTENBERG && window.AES_GUTENBERG.pages[0]?.url) || '#' },
        ]);
        setDropdownItems(next);
        const newHtml = updateDropdownItemsInHtml(decodedHtml, next);
        if (canvasRef.current) {
          canvasRef.current.innerHTML = newHtml;
          enableInlineEditing(canvasRef.current);
        }
        setAttributes({ html: encodeURIComponent(newHtml) });
      };

      const handleRemoveDropdownItem = (idx) => {
        const next = dropdownItems.filter((_, i) => i !== idx);
        setDropdownItems(next);
        const newHtml = updateDropdownItemsInHtml(decodedHtml, next);
        if (canvasRef.current) {
          canvasRef.current.innerHTML = newHtml;
          enableInlineEditing(canvasRef.current);
        }
        setAttributes({ html: encodeURIComponent(newHtml) });
      };

      const handleMoveDropdownItem = (idx, dir) => {
        const targetIdx = idx + dir;
        if (targetIdx < 0 || targetIdx >= dropdownItems.length) return;
        const next = dropdownItems.slice();
        const temp = next[idx];
        next[idx] = next[targetIdx];
        next[targetIdx] = temp;
        setDropdownItems(next);
        const newHtml = updateDropdownItemsInHtml(decodedHtml, next);
        if (canvasRef.current) {
          canvasRef.current.innerHTML = newHtml;
          enableInlineEditing(canvasRef.current);
        }
        setAttributes({ html: encodeURIComponent(newHtml) });
      };

      function handleReloadSectionFromCode() {
        if (!window.AES_GUTENBERG || !AES_GUTENBERG.postId || !sectionId) {
          alert('Section ID or Post ID missing.');
          return;
        }
        const layoutName = window.AES_GUTENBERG && AES_GUTENBERG.layout ? AES_GUTENBERG.layout : 'template';
        if (
          !confirm(
            'Reload this section from the code template file (templates/' +
              layoutName +
              '.html)?\n\nAny manual in-editor text changes made ONLY in this specific section will be refreshed to match the code.'
          )
        ) {
          return;
        }

        const formData = new FormData();
        formData.append('action', 'aes_get_fresh_section_html');
        formData.append('nonce', AES_GUTENBERG.nonce);
        formData.append('post_id', AES_GUTENBERG.postId);
        formData.append('section_id', sectionId);

        fetch(AES_GUTENBERG.ajaxUrl, {
          method: 'POST',
          body: formData,
        })
          .then((r) => r.json())
          .then((res) => {
            if (res.success && res.data && res.data.html) {
              const freshHtml = decodeURIComponent(res.data.html);
              if (canvasRef.current) {
                canvasRef.current.innerHTML = freshHtml;
                enableInlineEditing(canvasRef.current);
              }
              setAttributes({ html: res.data.html });
              alert('Section successfully reloaded from code template!');
            } else {
              alert(res.data && res.data.message ? res.data.message : 'Error reloading section.');
            }
          })
          .catch((err) => {
            alert('Network error: ' + err.message);
          });
      }

      function handleSyncFromCodeTemplate() {
        if (!window.AES_GUTENBERG || !AES_GUTENBERG.postId) {
          alert('Post ID missing.');
          return;
        }
        const layoutName = window.AES_GUTENBERG && AES_GUTENBERG.layout ? AES_GUTENBERG.layout : 'template';
        if (
          !confirm(
            'Re-sync the entire page from templates/' +
              layoutName +
              '.html?\n\nThis will refresh all blocks in the WordPress database to match your latest code edits. The editor page will then reload.'
          )
        ) {
          return;
        }

        const formData = new FormData();
        formData.append('action', 'aes_resync_page_template');
        formData.append('nonce', AES_GUTENBERG.nonce);
        formData.append('post_id', AES_GUTENBERG.postId);

        fetch(AES_GUTENBERG.ajaxUrl, {
          method: 'POST',
          body: formData,
        })
          .then((r) => r.json())
          .then((res) => {
            if (res.success) {
              alert(res.data && res.data.message ? res.data.message : 'Page re-synced successfully!');
              window.location.reload();
            } else {
              alert(res.data && res.data.message ? res.data.message : 'Error syncing template.');
            }
          })
          .catch((err) => {
            alert('Network error: ' + err.message);
          });
      }

      const pagesList = (window.AES_GUTENBERG && window.AES_GUTENBERG.pages) || [];
      const requestConfig = isSupport ? getSupportConfig() : {};
      const listSelector = '[class*="grid-cols"], ul, ol, .footer-list, [data-aes-card-template]';
      const listDocument = new DOMParser().parseFromString(decodedHtml, 'text/html');
      const editableLists = [...listDocument.body.querySelectorAll(listSelector)].map((node, index) => ({ node, index })).filter(({ node }) =>
        !node.closest('form, header, nav') && !node.querySelector('form, input, select, textarea') &&
        (node.dataset.aesCardTemplate || node.children.length > 0 && [...node.children].every(item => item.matches('li, article, div, a, figure')))
      );
      const addListItem = index => {
        const parent = canvasRef.current?.querySelectorAll(listSelector)[index];
        if (!parent) return;
        const parsed = parent.dataset.aesCardTemplate ? new DOMParser().parseFromString(decodeURIComponent(parent.dataset.aesCardTemplate), 'text/html').body.firstElementChild : parent.firstElementChild;
        if (!parsed) return;
        const item = parsed.cloneNode(true), suffix = '-copy-' + Date.now(), ids = new Map();
        [item, ...item.querySelectorAll('[id]')].forEach(node => { if (node.id) { ids.set(node.id, node.id + suffix); node.id += suffix; } });
        item.querySelectorAll('[for], [aria-labelledby], [aria-describedby], [aria-controls], a[href^="#"]').forEach(node => {
          for (const attr of ['for', 'aria-labelledby', 'aria-describedby', 'aria-controls']) if (node.hasAttribute(attr)) node.setAttribute(attr, node.getAttribute(attr).split(/\s+/).map(id => ids.get(id) || id).join(' '));
          if (node.hasAttribute('href')) { const id = node.getAttribute('href').slice(1); if (ids.has(id)) node.setAttribute('href', '#' + ids.get(id)); }
        });
        parent.appendChild(item); enableInlineEditing(item); syncDomToAttributes();
      };

      return el(
        Fragment,
        null,
        el(
          InspectorControls,
          null,
          isSupport && el(PanelBody, { title: 'Request form copy', initialOpen: true },
            el('p', null, 'Edit the wording for each request type. Field names and validation stay connected to the form.'),
            el(SelectControl, { label: 'Request type to edit', value: requestType, options: Object.entries(supportDefaults).map(([value, item]) => ({ value, label: item.title })), onChange: setRequestType }),
            Object.entries({ title: 'Saved request label', heading: 'Form heading', submit: 'Submit button', label: 'Message label', placeholder: 'Message placeholder', contextTitle: 'Guidance heading', context: 'Guidance text' }).map(([key, label]) => el(key === 'context' || key === 'placeholder' ? TextareaControl : TextControl, { key, label, value: requestConfig[key] || '', onChange: value => updateSupportCopy(key, value) })),
            (requestConfig.fields || []).map(field => el('div', { key: field.id, className: 'aes-gb-field-settings' },
              el(TextControl, { label: field.id + ' — label', value: field.label, onChange: value => updateSupportCopy('label', value, field.id) }),
              field.type === 'select' ? el(TextareaControl, { label: 'Options (one per line)', value: field.options.join('\n'), onChange: value => updateSupportCopy('options', value.split('\n').filter(Boolean), field.id) }) : field.type !== 'date' && el(TextControl, { label: 'Placeholder', value: field.placeholder, onChange: value => updateSupportCopy('placeholder', value, field.id) })
            ))
          ),
          !isGlobalHeader && editableLists.length > 0 && el(PanelBody, { title: 'Cards and lists', initialOpen: false },
            el('p', null, 'Add an item even after removing the last one. Click a card in the canvas to edit, move, duplicate or remove it.'),
            editableLists.map(({ node, index }) => el('div', { key: index, style: { marginBottom: '12px' } },
              el('p', null, 'List ' + (index + 1) + ': ' + node.children.length + ' items'),
              el(Button, { variant: 'secondary', onClick: () => addListItem(index) }, 'Add item to list ' + (index + 1))
            ))
          ),
          contextState?.hasCard && activeCardRef.current?.matches('.aes-directory-card') && el(PanelBody, { title: 'Service card settings', initialOpen: true },
            el(SelectControl, { label: 'Service category', value: activeCardRef.current.dataset.serviceCategory, options: [{ value: 'source', label: 'Source & approve' }, { value: 'inspect', label: 'Inspect & verify' }, { value: 'build', label: 'Build & commission' }, { value: 'qualify', label: 'Qualify & develop' }], onChange: value => { activeCardRef.current.dataset.serviceCategory = value; syncDomToAttributes(); } }),
            el(TextControl, { label: 'Search keywords', value: activeCardRef.current.dataset.serviceKeywords || '', onChange: value => { activeCardRef.current.dataset.serviceKeywords = value; syncDomToAttributes(); } })
          ),
          contextState?.type === 'image' && el(PanelBody, { title: 'Image framing', initialOpen: true },
            el(SelectControl, { label: 'Image fit', value: activeNodeRef.current?.ownerDocument.defaultView.getComputedStyle(activeNodeRef.current).objectFit || 'cover', options: [{ value: 'cover', label: 'Fill frame (crop edges)' }, { value: 'contain', label: 'Show the whole image' }], onChange: value => { activeNodeRef.current.style.setProperty('object-fit', value, 'important'); syncDomToAttributes(); } }),
            el(TextControl, { label: 'Image focal position', help: 'For example: 50% 50% (center), 50% 20% (toward the top).', value: contextState.objectPosition ?? (activeNodeRef.current?.style.objectPosition || '50% 50%'), onChange: value => { setContextState(previous => ({ ...previous, objectPosition: value })); activeNodeRef.current.style.setProperty('object-position', value, 'important'); syncDomToAttributes(); } })
          ),
          contextState?.type === 'field' && el(PanelBody, { title: 'Form field wording', initialOpen: true },
            el(TextControl, { label: 'Placeholder', value: contextState.placeholder, onChange: value => { activeNodeRef.current.setAttribute('placeholder', value); setContextState(previous => ({ ...previous, placeholder: value })); syncDomToAttributes(); } }),
            contextState.options !== null && el(TextareaControl, { label: 'Option labels (one per line; keep their order)', help: 'Existing option values are preserved so form routing continues to work.', value: contextState.options, onChange: value => {
              const labels = value.split('\n'), select = activeNodeRef.current;
              [...select.options].forEach((option, index) => { if (labels[index] !== undefined) { const oldValue = option.value; option.textContent = labels[index]; option.value = oldValue; } });
              setContextState(previous => ({ ...previous, options: value })); syncDomToAttributes();
            } })
          ),
          el(
            PanelBody,
            {
              title:
                'Advanced template tools (' +
                (window.AES_GUTENBERG && AES_GUTENBERG.layout ? AES_GUTENBERG.layout + '.html' : 'Code') +
                ')',
              initialOpen: false,
            },
            el(
              'p',
              { style: { fontSize: '12px', color: '#64748b', lineHeight: 1.4 } },
              'Restores starter content from templates/' +
                (window.AES_GUTENBERG && AES_GUTENBERG.layout ? AES_GUTENBERG.layout : 'template') +
                '.html. This replaces saved page edits. Normal content changes only need Save / Update.'
            ),
            el(
              Button,
              {
                isPrimary: true,
                style: { width: '100%', justifyContent: 'center', marginBottom: '8px' },
                onClick: handleSyncFromCodeTemplate,
              },
              '🔄 Re-Sync Page from Code Template'
            )
          ),
          isHeroSection && el(PanelBody, { title: 'Homepage video playlist', initialOpen: true },
            el('p', null, 'Use the numbered video list above the hero to add multiple clips, replace, reorder, or remove an individual video. Save / Update applies the playlist with the rest of this page.')
          ),
          el(
            PanelBody,
            { title: 'Section Settings', initialOpen: true },
            !isGlobalHeader && !isGlobalFooter && el(ToggleControl, { label: 'Hide this section on the website', checked: !!attributes.sectionHidden, onChange: value => setAttributes({ sectionHidden: value }), help: 'Your content stays in the editor and can be shown again at any time.' }),
            !isGlobalHeader && !isGlobalFooter && !isHeroSection && el(Button, { variant: 'secondary', onClick: openMediaLibraryForHeroVideo }, 'Add video to this section'),
            el(TextControl, {
              label: 'Section Label',
              value: title,
              onChange: (val) => setAttributes({ title: val }),
            }),
            el(
              'p',
              { style: { fontSize: '12px', color: '#475569' } },
              'Click directly on any text, image, button, or card in the visual canvas to edit it in place, replace images, or duplicate/remove cards.'
            ),
            isGlobalHeader &&
              el(
                Button,
                {
                  isPrimary: true,
                  onClick: editServicesMenu,
                  style: { width: '100%', justifyContent: 'center', marginBottom: '8px' },
                },
                usesWordPressMenu ? 'Edit Services menu in WordPress' : showDropdownEditor ? 'Hide Services Dropdown Editor' : 'Edit Services Dropdown (' + dropdownItems.length + ')'
              ),
            el(
              Button,
              {
                isSecondary: true,
                onClick: () => setShowCodeEditor(!showCodeEditor),
                style: { width: '100%', justifyContent: 'center' },
              },
              showCodeEditor ? 'Switch to Visual Mode' : 'View / Edit Section HTML'
            )
          )
        ),

        el(
          'div',
          { ...blockProps, className: (blockProps.className || '') + ' aes-gb-section-wrap' + (isSelected ? ' is-selected' : '') },
          attributes.sectionHidden && el('p', { className: 'aes-gb-hidden-notice', role: 'status' }, 'Hidden on the website. Turn off "Hide this section" in Section Settings to show it again.'),
          // Top Section Header Bar
          el(
            'div',
            { className: 'aes-gb-section-bar' },
            el(
              'div',
              { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
              el(
                'span',
                {
                  className:
                    'aes-gb-section-badge' + (isGlobalHeader || isGlobalFooter ? ' is-global' : ''),
                },
                isGlobalHeader
                  ? 'GLOBAL HEADER'
                  : isGlobalFooter
                  ? 'GLOBAL FOOTER'
                  : 'VISUAL BLOCK'
              ),
              el('span', null, title),
              (isGlobalHeader || isGlobalFooter) &&
                el(
                  'span',
                  { style: { fontSize: '11px', color: '#94a3b8', fontWeight: 400 } },
                  '(Syncs across all pages when saved)'
                )
            ),
            el(
              'div',
              { className: 'aes-gb-bar-actions' },
              isHeroSection &&
                el(
                  Fragment,
                  null,
                  el(
                    'button',
                    {
                      type: 'button',
                      className: 'aes-gb-btn is-primary',
                      title: 'Select or upload a video for the hero background',
                      onClick: openMediaLibraryForHeroVideo,
                    },
                    'Add videos'
                  ),
                  heroVideoUrl &&
                    el(
                      'button',
                      {
                        type: 'button',
                        className: 'aes-gb-btn is-danger',
                        title: 'Remove background video',
                        onClick: removeHeroVideo,
                      },
                      isHeroSection ? 'Remove all videos' : 'Remove video'
                    )
                ),
              isGlobalHeader &&
                el(
                  'button',
                  {
                    type: 'button',
                    className: 'aes-gb-btn is-primary',
                    onClick: editServicesMenu,
                  },
                  usesWordPressMenu ? 'Edit Services menu in WordPress' : 'Services Dropdown (' + dropdownItems.length + ' items) - Add / Remove'
                ),
              el(
                'button',
                {
                  type: 'button',
                  className: 'aes-gb-btn',
                  title:
                    'Reload this section from the code template file (templates/' +
                    (window.AES_GUTENBERG && AES_GUTENBERG.layout ? AES_GUTENBERG.layout : 'template') +
                    '.html)',
                  onClick: handleReloadSectionFromCode,
                },
                '🔄 Sync from Code'
              ),
              el(
                'button',
                {
                  type: 'button',
                  className: 'aes-gb-btn',
                  onClick: () => setShowCodeEditor(!showCodeEditor),
                },
                showCodeEditor ? '👁 Visual Editor' : '</> HTML'
              )
            )
          ),

          // Interactive Services Dropdown Manager (for Header block)
          isGlobalHeader &&
            showDropdownEditor &&
            el(
              'div',
              { className: 'aes-gb-dropdown-editor' },
              el(
                'div',
                { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' } },
                el(
                  'div',
                  null,
                  el('strong', { style: { fontSize: '14px', color: '#f16826' } }, 'Services Dropdown Menu Items (' + dropdownItems.length + ')'),
                  el(
                    'div',
                    { style: { fontSize: '11px', color: '#cbd5e1', marginTop: '2px' } },
                    'Add, remove, rename, or reorder services in the Header dropdown. Clicking Update saves this dropdown across the entire website.'
                  )
                ),
                el(
                  'div',
                  { style: { display: 'flex', gap: '8px' } },
                  el(
                    'button',
                    {
                      type: 'button',
                      className: 'aes-gb-btn is-primary',
                      onClick: handleAddDropdownItem,
                    },
                    '+ Add New Service to Dropdown'
                  ),
                  el(
                    'button',
                    {
                      type: 'button',
                      className: 'aes-gb-btn',
                      onClick: () => setShowDropdownEditor(false),
                    },
                    'Done'
                  )
                )
              ),
              el(
                'div',
                { className: 'aes-gb-dropdown-grid' },
                dropdownItems.map((item, idx) =>
                  el(
                    'div',
                    { key: idx, className: 'aes-gb-dropdown-item' },
                    el(
                      'div',
                      { className: 'aes-gb-dropdown-item-top' },
                      el('span', { style: { fontSize: '11px', fontWeight: 700, color: '#94a3b8' } }, '#' + (idx + 1)),
                      el(
                        'div',
                        { style: { display: 'flex', gap: '4px' } },
                        el(
                          'button',
                          {
                            type: 'button',
                            className: 'aes-gb-btn',
                            title: 'Move Up',
                            onClick: () => handleMoveDropdownItem(idx, -1),
                          },
                          '↑'
                        ),
                        el(
                          'button',
                          {
                            type: 'button',
                            className: 'aes-gb-btn',
                            title: 'Move Down',
                            onClick: () => handleMoveDropdownItem(idx, 1),
                          },
                          '↓'
                        ),
                        el(
                          'button',
                          {
                            type: 'button',
                            className: 'aes-gb-btn is-danger',
                            title: 'Remove Service from Dropdown',
                            onClick: () => handleRemoveDropdownItem(idx),
                          },
                          '✕ Remove'
                        )
                      )
                    ),
                    el('input', {
                      type: 'text',
                      value: item.label,
                      placeholder: 'Service Name...',
                      onChange: (e) => handleDropdownChange(idx, 'label', e.target.value),
                    }),
                    el(
                      'div',
                      { style: { display: 'flex', gap: '6px' } },
                      el('input', {
                        type: 'text',
                        value: item.url,
                        placeholder: 'URL or Page Link...',
                        onChange: (e) => handleDropdownChange(idx, 'url', e.target.value),
                      }),
                      pagesList.length > 0 &&
                        el(
                          'select',
                          {
                            style: {
                              background: '#070e22',
                              color: '#cbd5e1',
                              border: '1px solid #334155',
                              borderRadius: '5px',
                              fontSize: '11px',
                              maxWidth: '110px',
                            },
                            value: '',
                            onChange: (e) => {
                              if (e.target.value) handleDropdownChange(idx, 'url', e.target.value);
                            },
                          },
                          el('option', { value: '' }, 'Pick Page...'),
                          pagesList.map((p, pIdx) =>
                            el('option', { key: pIdx, value: p.url }, p.title)
                          )
                        )
                    )
                  )
                )
              )
            ),

          // Contextual Action Bar when an Image, Link, or Repeatable Card is clicked
          contextState &&
            el(
              'div',
              { className: 'aes-gb-context-bar' },
              el(
                'div',
                { className: 'aes-gb-context-group' },
                el(
                  'span',
                  { style: { fontWeight: 800, color: '#f16826', textTransform: 'uppercase' } },
                  contextState.type === 'image'
                    ? '🖼 Image Selected:'
                    : contextState.type === 'video'
                    ? '🎬 Video Selected:'
                    : '✏ Element Selected:'
                ),
                contextState.type === 'video' &&
                  el(
                    Fragment,
                    null,
                    el(
                      'button',
                      {
                        type: 'button',
                        className: 'aes-gb-btn is-primary',
                        onClick: replaceActiveVideo,
                      },
                      'Replace selected video'
                    ),
                    (heroVideoUrl || contextState.src) &&
                      el(
                        'button',
                        {
                          type: 'button',
                          className: 'aes-gb-btn is-danger',
                          onClick: removeHeroVideo,
                        },
                        isHeroSection ? 'Remove all videos' : 'Remove video'
                      ),
                    el('input', {
                      type: 'text',
                      className: 'aes-gb-input',
                      value: heroVideoUrl || contextState.src || '',
                      placeholder: 'Video URL (MP4 / WebM)...',
                      onChange: (e) => addOrChangeHeroVideo(e.target.value),
                    })
                  ),
                contextState.type !== 'video' &&
                  contextState.src !== null &&
                  el(
                    Fragment,
                    null,
                    el(
                      'button',
                      {
                        type: 'button',
                        className: 'aes-gb-btn is-primary',
                        onClick: openMediaLibraryForActiveImage,
                      },
                      '📷 Change Image (Media Library)'
                    ),
                    el('input', {
                      type: 'text',
                      className: 'aes-gb-input',
                      value: contextState.src || '',
                      placeholder: 'Image URL...',
                      onChange: (e) => updateActiveImageSrc(e.target.value),
                    })
                  ),
                contextState.href !== null &&
                  el(
                    Fragment,
                    null,
                    el('span', { style: { color: '#94a3b8' } }, '🔗 Link URL:'),
                    el('input', {
                      type: 'text',
                      className: 'aes-gb-input',
                      value: contextState.href || '',
                      placeholder: 'https://...',
                      onChange: (e) => updateActiveLinkHref(e.target.value),
                    }),
                    pagesList.length > 0 &&
                      el(
                        'select',
                        {
                          className: 'aes-gb-input',
                          style: { minWidth: '130px' },
                          value: '',
                          onChange: (e) => {
                            if (e.target.value) updateActiveLinkHref(e.target.value);
                          },
                        },
                        el('option', { value: '' }, 'Link to Page...'),
                        pagesList.map((p, idx) =>
                          el('option', { key: idx, value: p.url }, p.title)
                        )
                      )
                  )
              ),
              el(
                'div',
                { className: 'aes-gb-context-group' },
                contextState.hasCard &&
                  el(
                    Fragment,
                    null,
                    el(
                      'button',
                      {
                        type: 'button',
                        className: 'aes-gb-btn is-primary',
                        onClick: duplicateActiveCard,
                        title: 'Duplicate this card/item to add another one',
                      },
                      '+ Add / Duplicate Card'
                    ),
                    el(
                      'button',
                      {
                        type: 'button',
                        className: 'aes-gb-btn',
                        onClick: () => moveActiveCard(-1),
                        title: 'Move Card Back',
                      },
                      '⬅ Move'
                    ),
                    el(
                      'button',
                      {
                        type: 'button',
                        className: 'aes-gb-btn',
                        onClick: () => moveActiveCard(1),
                        title: 'Move Card Forward',
                      },
                      'Move ➡'
                    ),
                    el(
                      'button',
                      {
                        type: 'button',
                        className: 'aes-gb-btn is-danger',
                        onClick: removeActiveCard,
                        title: 'Delete this card/item',
                      },
                      '🗑 Remove Card'
                    )
                  ),
                el(
                  'button',
                  {
                    type: 'button',
                    className: 'aes-gb-btn',
                    onClick: () => setContextState(null),
                  },
                  '✕'
                )
              )
            ),

          isHeroSection && el(window.AESHeroPlaylist.Editor, { items: playlist, onChange: commitPlaylist, clientId: props.clientId }),

          // Either Raw HTML Code Editor or Live Visual WYSIWYG Canvas
          showCodeEditor
            ? el('textarea', {
                style: {
                  width: '100%',
                  minHeight: '320px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  padding: '16px',
                  background: '#0f172a',
                  color: '#e2e8f0',
                  border: 'none',
                },
                value: decodedHtml,
                onChange: (e) => setAttributes({ html: encodeURIComponent(e.target.value) }),
              })
            : el('div', {
                ref: canvasRef,
                className: 'aes-gb-canvas',
                onClick: handleCanvasClick,
                onInput: syncDomToAttributes,
                onBlur: syncDomToAttributes,
              })
        )
      );
    },

    save: function () {
      // Rendered dynamically via PHP render_callback so Gutenberg never throws block validation errors
      return null;
    },
  });
})(window.wp);

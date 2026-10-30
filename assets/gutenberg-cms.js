(function (wp) {
  const { registerBlockType } = wp.blocks || {};
  const { createElement: el, useState, useEffect, useRef, Fragment } = wp.element || {};
  const { InspectorControls } = wp.blockEditor || wp.editor || {};
  const { PanelBody, TextControl, TextareaControl, SelectControl, Button } = wp.components || {};

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
    if (root.querySelector('#heroVideo') || root.querySelector('video')) {
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
        parent.children.length > 1
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
    },

    edit: function (props) {
      const { attributes, setAttributes, isSelected } = props;
      const { title, isGlobalHeader, isGlobalFooter, html, sectionId } = attributes;
      const decodedHtml = html ? decodeURIComponent(html) : '';

      const canvasRef = useRef(null);
      const activeNodeRef = useRef(null);
      const activeCardRef = useRef(null);
      const activeLinkRef = useRef(null);

      const [showDropdownEditor, setShowDropdownEditor] = useState(false);
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

      const isHeroSection =
        sectionId === 'home-sec-1' ||
        (title && title.toLowerCase().includes('hero')) ||
        decodedHtml.includes('heroVideo') ||
        decodedHtml.includes('<video');

      const getVideoUrlFromHtml = (str) => {
        if (!str) return '';
        const match = str.match(/<source[^>]+src=["']([^"']*)["']/i) || str.match(/<video[^>]+src=["']([^"']*)["']/i);
        return match ? match[1] : '';
      };

      const [heroVideoUrl, setHeroVideoUrl] = useState(() => getVideoUrlFromHtml(decodedHtml));
      const videoSaveQueue = useRef(Promise.resolve());
      const latestVideoChoice = useRef(null);

      const persistHeroVideo = (url) => {
        const config = window.AES_GUTENBERG;
        if (!config || config.layout !== 'home') return;
        latestVideoChoice.current = url;
        // Serialize writes so an earlier upload request cannot replace a newer choice.
        videoSaveQueue.current = videoSaveQueue.current.catch(() => {}).then(async () => {
          const data = new URLSearchParams({
            action: 'aes_save_hero_video', video_url: url,
            post_id: config.postId, nonce: config.nonce,
          });
          try {
            const response = await fetch(config.ajaxUrl, { method: 'POST', body: data, credentials: 'same-origin' });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.data?.message || 'Could not save the homepage video.');
            if (latestVideoChoice.current === url) {
              window.dispatchEvent(new CustomEvent('aes:hero-video-saved', { detail: { url: result.data.video_url } }));
            }
          } catch (error) {
            wp.data.dispatch('core/notices').createErrorNotice(error.message + ' Please select the video again to retry.', { id: 'aes-video-save', isDismissible: true });
          }
        });
      };

      useEffect(() => {
        if (isHeroSection) {
          const detected = getVideoUrlFromHtml(decodedHtml);
          if (detected !== heroVideoUrl) {
            setHeroVideoUrl(detected);
          }
        }
      }, [decodedHtml, isHeroSection]);

      const addOrChangeHeroVideo = (newUrl, persist = true) => {
        if (!newUrl) return;
        setHeroVideoUrl(newUrl);
        if (canvasRef.current) {
          let video = canvasRef.current.querySelector('video');
          if (!video) {
            const bgWrapper =
              canvasRef.current.querySelector('.absolute.inset-0.z-0') ||
              canvasRef.current.querySelector('.absolute.inset-0') ||
              canvasRef.current;
            video = document.createElement('video');
            video.id = 'heroVideo';
            video.className = 'w-full h-full object-cover transition-opacity duration-700';
            video.setAttribute('autoplay', '');
            video.setAttribute('loop', '');
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');
            const source = document.createElement('source');
            source.setAttribute('src', newUrl);
            source.setAttribute('type', 'video/mp4');
            video.appendChild(source);
            if (bgWrapper) {
              bgWrapper.insertBefore(video, bgWrapper.firstChild);
            }
          } else {
            let srcNode = video.querySelector('source');
            if (srcNode) {
              srcNode.setAttribute('src', newUrl);
              srcNode.removeAttribute('type');
              video.removeAttribute('src');
            } else {
              video.setAttribute('src', newUrl);
            }
          }
          try {
            video.load();
            video.play().catch(() => {});
          } catch (e) {}
          syncDomToAttributes();
        } else {
          let updated = decodedHtml;
          if (decodedHtml.includes('<video')) {
            updated = decodedHtml.replace(/(<source[^>]+src=["'])[^"']*(["'])/i, '$1' + newUrl + '$2');
          } else {
            const videoTag =
              '<video autoplay="" class="w-full h-full object-cover transition-opacity duration-700" id="heroVideo" loop="" muted="" playsinline=""><source src="' +
              newUrl +
              '" type="video/mp4"/></video>';
            updated = updated.replace(/(<div class="absolute inset-0[^>]*>)/i, '$1' + videoTag);
          }
          setAttributes({ html: encodeURIComponent(updated) });
        }

        if (persist) persistHeroVideo(newUrl);
      };

      const removeHeroVideo = (ask = true, persist = true) => {
        if (ask && !confirm('Remove the hero background video? The hero will display with a clean solid navy background.')) return;
        if (canvasRef.current) {
          const video = canvasRef.current.querySelector('video');
          if (video) video.remove();
          syncDomToAttributes();
        } else {
          const updated = decodedHtml.replace(/<video[^>]*>[\s\S]*?<\/video>/i, '');
          setAttributes({ html: encodeURIComponent(updated) });
        }
        setHeroVideoUrl('');
        setContextState(null);

        if (persist) persistHeroVideo('');
      };

      useEffect(() => {
        if (!isHeroSection || window.AES_GUTENBERG?.layout !== 'home') return;
        const syncVideoControls = (event) => {
          if (event.detail.url) addOrChangeHeroVideo(event.detail.url, false);
          else removeHeroVideo(false, false);
        };
        window.addEventListener('aes:hero-video-saved', syncVideoControls);
        return () => window.removeEventListener('aes:hero-video-saved', syncVideoControls);
      }, [decodedHtml, isHeroSection]);

      const openMediaLibraryForHeroVideo = () => {
        const frame = wp.media({
          title: 'Select or Upload Homepage Hero Background Video (MP4 / WebM)',
          button: { text: 'Use this Video' },
          library: { type: 'video' },
          multiple: false,
        });

        frame.on('select', () => {
          const attachment = frame.state().get('selection').first().toJSON();
          if (attachment && attachment.url) {
            addOrChangeHeroVideo(attachment.url);
          }
        });

        frame.open();
      };

      // Mount / external HTML update
      useEffect(() => {
        if (!canvasRef.current) return;
        const currentClean = serializeCleanHtml(canvasRef.current);
        if (currentClean !== decodedHtml && !canvasRef.current.contains(document.activeElement)) {
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
        e.preventDefault();
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
          setShowDropdownEditor(true);
        }

        const videoElem = target.closest('video') || (target.id === 'heroVideo' ? target : (target.querySelector ? target.querySelector('video') : null));

        // If clicking in the Hero section and not directly typing on editable text, select Hero Video controls
        if (isHeroSection) {
          const isText = target.closest('h1, h2, h3, h4, h5, h6, p, a, button, input');
          if (videoElem || target.id === 'heroVideo' || target.classList.contains('absolute') || !isText) {
            setContextState({
              type: 'video',
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
        } else if (img && target.tagName === 'IMG') {
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
            if (attachment.alt) img.setAttribute('alt', attachment.alt);
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
          contextState?.hasCard && activeCardRef.current?.matches('.aes-directory-card') && el(PanelBody, { title: 'Service card settings', initialOpen: true },
            el(SelectControl, { label: 'Service category', value: activeCardRef.current.dataset.serviceCategory, options: [{ value: 'source', label: 'Source & approve' }, { value: 'inspect', label: 'Inspect & verify' }, { value: 'build', label: 'Build & commission' }, { value: 'qualify', label: 'Qualify & develop' }], onChange: value => { activeCardRef.current.dataset.serviceCategory = value; syncDomToAttributes(); } }),
            el(TextControl, { label: 'Search keywords', value: activeCardRef.current.dataset.serviceKeywords || '', onChange: value => { activeCardRef.current.dataset.serviceKeywords = value; syncDomToAttributes(); } })
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
          isHeroSection &&
            el(
              PanelBody,
              { title: '🎬 Hero Background Video', initialOpen: true },
              el(
                'p',
                { style: { fontSize: '12px', color: '#64748b', lineHeight: 1.4 } },
                'Modify, replace, or remove the background video that plays on the homepage hero section.'
              ),
              el(
                'div',
                { style: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' } },
                el(
                  Button,
                  {
                    isPrimary: true,
                    style: { width: '100%', justifyContent: 'center' },
                    onClick: openMediaLibraryForHeroVideo,
                  },
                  heroVideoUrl ? '📁 Change / Replace Video' : '➕ Upload / Add Video'
                ),
                heroVideoUrl &&
                  el(
                    Button,
                    {
                      isDestructive: true,
                      style: { width: '100%', justifyContent: 'center' },
                      onClick: removeHeroVideo,
                    },
                    '🗑 Remove Video Completely'
                  )
              ),
              el(TextControl, {
                label: 'Video File URL (MP4 / WebM)',
                value: heroVideoUrl,
                placeholder: 'https://.../video.mp4',
                onChange: (val) => addOrChangeHeroVideo(val),
              }),
              el(
                'div',
                { style: { fontSize: '11px', color: heroVideoUrl ? '#16a34a' : '#f59e0b', fontWeight: 600, marginTop: '4px' } },
                heroVideoUrl ? ('✓ Active: ' + (heroVideoUrl.split('/').pop() || heroVideoUrl)) : '○ No video (using solid navy background)'
              )
            ),
          el(
            PanelBody,
            { title: 'Section Settings', initialOpen: true },
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
                  onClick: () => setShowDropdownEditor(!showDropdownEditor),
                  style: { width: '100%', justifyContent: 'center', marginBottom: '8px' },
                },
                showDropdownEditor ? 'Hide Services Dropdown Editor' : 'Edit Services Dropdown (' + dropdownItems.length + ')'
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
          { className: 'aes-gb-section-wrap' + (isSelected ? ' is-selected' : '') },
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
                    heroVideoUrl ? '🎬 Change Video' : '🎬 Add Video'
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
                      '🗑 Remove Video'
                    )
                ),
              isGlobalHeader &&
                el(
                  'button',
                  {
                    type: 'button',
                    className: 'aes-gb-btn is-primary',
                    onClick: () => setShowDropdownEditor(!showDropdownEditor),
                  },
                  '▾ Services Dropdown (' + dropdownItems.length + ' items) — Add / Remove'
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
                        onClick: openMediaLibraryForHeroVideo,
                      },
                      heroVideoUrl ? '📁 Change Video (Media Library)' : '➕ Add Video'
                    ),
                    heroVideoUrl &&
                      el(
                        'button',
                        {
                          type: 'button',
                          className: 'aes-gb-btn is-danger',
                          onClick: removeHeroVideo,
                        },
                        '🗑 Remove Video'
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

          // Persistent Floating Video Action Bar right on top of the Hero Section
          isHeroSection &&
            el(
              'div',
              {
                className: 'aes-hero-video-bar-float',
                style: {
                  background: '#070e22',
                  borderBottom: '2px solid #f16826',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  color: '#ffffff',
                },
              },
              el(
                'div',
                { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                el(
                  'span',
                  { style: { fontWeight: 800, color: '#f16826', fontSize: '12px', textTransform: 'uppercase' } },
                  '🎬 Homepage Background Video:'
                ),
                el(
                  'span',
                  { style: { fontSize: '11px', color: heroVideoUrl ? '#34d399' : '#f59e0b', fontWeight: 600 } },
                  heroVideoUrl
                    ? '● Active (' + (heroVideoUrl.split('/').pop() || heroVideoUrl) + ')'
                    : '○ No Video (Using dark navy background)'
                )
              ),
              el(
                'div',
                { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                el(
                  'button',
                  {
                    type: 'button',
                    className: 'aes-gb-btn is-primary',
                    onClick: openMediaLibraryForHeroVideo,
                  },
                  heroVideoUrl ? '📁 Change / Replace Video' : '➕ Upload / Add Video'
                ),
                heroVideoUrl &&
                  el(
                    'button',
                    {
                      type: 'button',
                      className: 'aes-gb-btn is-danger',
                      onClick: removeHeroVideo,
                    },
                    '🗑 Remove Video'
                  )
              )
            ),

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

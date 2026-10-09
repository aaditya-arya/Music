(function (wp) {
  const { registerBlockType } = wp.blocks || {};
  const { createElement: el, useState, useEffect, useRef, Fragment } = wp.element || {};
  const { InspectorControls } = wp.blockEditor || wp.editor || {};
  const { PanelBody, TextControl, Button } = wp.components || {};

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
    const selectors = 'h1, h2, h3, h4, h5, h6, p, span, strong, em, cite, li, a, button, label, div';
    container.querySelectorAll(selectors).forEach((node) => {
      // Only make leaf text containers or inline text containers contenteditable
      const hasBlockChildren = node.querySelector('div, section, ul, ol, table, article, header, footer, nav, form');
      if (!hasBlockChildren && node.textContent.trim().length > 0) {
        node.setAttribute('contenteditable', 'true');
      }
    });
  }

  /**
   * Find closest repeating card/item (e.g. Service card, Equipment card, Sector card, Client logo, List item)
   */
  function findRepeatableCard(target, root) {
    let curr = target;
    while (curr && curr !== root && curr.parentElement && curr.parentElement !== root) {
      const parent = curr.parentElement;
      const tag = curr.tagName.toLowerCase();
      if (tag === 'li' || tag === 'article' || curr.classList.contains('service-slide-card')) {
        return curr;
      }
      // If parent is a grid or flex container with multiple element children of the same tag
      const parentClass = parent.className || '';
      if (
        (typeof parentClass === 'string' && (parentClass.includes('grid') || parentClass.includes('flex') || parentClass.includes('space-y-') || parentClass.includes('footer-list'))) &&
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
      const { title, isGlobalHeader, isGlobalFooter, html } = attributes;
      const decodedHtml = html ? decodeURIComponent(html) : '';

      const canvasRef = useRef(null);
      const activeNodeRef = useRef(null);
      const activeCardRef = useRef(null);
      const activeLinkRef = useRef(null);

      const [showDropdownEditor, setShowDropdownEditor] = useState(false);
      const [dropdownItems, setDropdownItems] = useState(() =>
        isGlobalHeader ? parseDropdownItems(decodedHtml) : []
      );
      const [contextState, setContextState] = useState(null); // { type: 'image'|'element', src, alt, href, hasCard, tagName }
      const [showCodeEditor, setShowCodeEditor] = useState(false);

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

        if (!canvasRef.current) return;
        canvasRef.current.querySelectorAll('.aes-gb-active-element').forEach((n) => {
          n.classList.remove('aes-gb-active-element');
        });

        const target = e.target;
        // If user clicked "Services" dropdown trigger in header, open the Services Dropdown Editor
        if (isGlobalHeader && target.closest('.nav-item-dropdown')) {
          setShowDropdownEditor(true);
        }

        const img = target.tagName === 'IMG' ? target : target.querySelector('img');
        const link = target.closest('a');
        const card = findRepeatableCard(target, canvasRef.current);

        activeNodeRef.current = img || target;
        activeLinkRef.current = link;
        activeCardRef.current = card;

        if (activeNodeRef.current && activeNodeRef.current !== canvasRef.current) {
          activeNodeRef.current.classList.add('aes-gb-active-element');
        }

        if (img && target.tagName === 'IMG') {
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

      const pagesList = (window.AES_GUTENBERG && window.AES_GUTENBERG.pages) || [];

      return el(
        Fragment,
        null,
        el(
          InspectorControls,
          null,
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
                  contextState.type === 'image' ? '🖼 Image Selected:' : '✏ Element Selected:'
                ),
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

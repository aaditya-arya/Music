(function (wp) {
  const { createElement: el, useState } = wp.element;
  const { useSelect, useDispatch } = wp.data;
  const { PluginDocumentSettingPanel } = wp.editor || wp.editPost;
  const { TextControl, TextareaControl, SelectControl, Button } = wp.components;
  function PageDetails() {
    const fields = window.AES_GUTENBERG?.detailsFields || {};
    const [query, setQuery] = useState('');
    const [chosen, setChosen] = useState('description');
    const meta = useSelect(select => select('core/editor').getEditedPostAttribute('meta') || {}, []);
    const { editPost } = useDispatch('core/editor');
    const options = Object.entries(fields).filter(([key, item]) => (item.label + ' ' + item.group).toLowerCase().includes(query.toLowerCase()));
    const key = options.some(([key]) => key === chosen) ? chosen : options[0]?.[0];
    const field = fields[key];
    if (!Object.keys(fields).length) return null;
    const values = meta._aes_values || {};
    const change = value => editPost({ meta: { ...meta, _aes_values: { ...values, [key]: value } } });
    return el(PluginDocumentSettingPanel, { name: 'aes-page-details', title: 'Page details and popup copy', initialOpen: true },
      el('p', null, 'Edit the search description and popup content here. Visible page copy stays in the visual blocks. Save / Update applies both.'),
      el(TextControl, { label: 'Find a page detail', value: query, placeholder: 'Search title, image, inspection...', onChange: setQuery }),
      options.length ? el(SelectControl, { label: 'Page detail to edit', value: key, options: options.map(([value, item]) => ({ value, label: item.label })), onChange: setChosen }) : el('p', null, 'No matching fields.'),
      field && el(TextareaControl, { label: field.label, rows: field.type === 'text' ? 5 : 3, value: Object.prototype.hasOwnProperty.call(values, key) ? values[key] : field.default, onChange: change }),
      field && ['image', 'url'].includes(field.type) && el(Button, { variant: 'secondary', onClick: () => {
        const frame = wp.media({ title: 'Choose page media', library: field.type === 'image' ? { type: 'image' } : undefined, multiple: false });
        frame.on('select', () => change(frame.state().get('selection').first().toJSON().url)); frame.open();
      } }, 'Choose from Media Library')
    );
  }
  wp.plugins.registerPlugin('aes-page-details', { render: PageDetails });
})(window.wp);

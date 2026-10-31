(function (wp) {
  const { createElement: el, useState, useEffect } = wp.element;
  const { Button, TextControl, Notice } = wp.components;
  const makeItem = url => ({ id: 'clip-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9), url });
  const validUrl = value => {
    try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) && /\.(mp4|webm|ogv|ogg|m4v)$/i.test(url.pathname); } catch { return false; }
  };
  function read(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const video = doc.querySelector('#heroVideo');
    if (!video) return [];
    let urls = [];
    try { urls = JSON.parse(video.dataset.aesPlaylist || 'null'); } catch {}
    if (!Array.isArray(urls)) urls = (video.dataset.playlist || '').split(',').filter(Boolean);
    if (!urls.length) urls = [video.querySelector('source')?.getAttribute('src') || video.getAttribute('src')].filter(Boolean);
    return urls.map((url, i) => ({ id: 'video-' + i, url }));
  }
  function apply(html, items) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    let video = doc.querySelector('#heroVideo');
    doc.querySelector('#heroVideoBuffer')?.remove();
    if (!items.length) { video?.remove(); return doc.body.innerHTML; }
    if (!video) {
      video = doc.createElement('video'); video.id = 'heroVideo';
      video.className = 'w-full h-full object-cover aes-hero-video-active';
      const wrapper = doc.querySelector('.absolute.inset-0.z-0, .absolute.inset-0') || doc.querySelector('section') || doc.body;
      wrapper.prepend(video);
    }
    video.removeAttribute('src'); video.removeAttribute('data-playlist');
    video.dataset.aesPlaylist = JSON.stringify(items.map(item => item.url));
    video.toggleAttribute('loop', items.length === 1);
    for (const attr of ['autoplay', 'muted', 'playsinline']) video.setAttribute(attr, '');
    video.innerHTML = '';
    const source = doc.createElement('source'); source.setAttribute('src', items[0].url); video.append(source);
    return doc.body.innerHTML;
  }
  function choose(callback, multiple = true) {
    const frame = wp.media({ title: multiple ? 'Add background videos in playback order' : 'Replace this video', button: { text: multiple ? 'Add selected videos' : 'Replace video' }, library: { type: 'video' }, multiple });
    frame.on('select', () => callback(frame.state().get('selection').toJSON().filter(item => item.url).map(item => makeItem(item.url))));
    frame.open();
  }
  function Editor({ items, onChange, clientId }) {
    const [newUrl, setNewUrl] = useState('');
    const invalid = items.some(item => !validUrl(item.url));
    useEffect(() => {
      const lock = 'aes-playlist-' + clientId;
      const editor = wp.data.dispatch('core/editor');
      if (invalid) editor.lockPostSaving(lock); else editor.unlockPostSaving(lock);
      return () => editor.unlockPostSaving(lock);
    }, [invalid, clientId]);
    const change = (index, item) => onChange(items.map((old, i) => i === index ? item : old));
    const move = (index, direction) => {
      const next = items.slice();
      [next[index], next[index + direction]] = [next[index + direction], next[index]];
      onChange(next);
    };
    return el('div', { className: 'aes-playlist-editor', 'aria-label': 'Homepage video playlist' },
      el('div', { className: 'aes-playlist-heading' }, el('div', null, el('strong', null, 'Homepage video playlist (' + items.length + ')'), el('p', null, 'Videos play in this order. Add as many as needed, replace any one, or remove just that clip. Click WordPress Save / Update to apply your changes.')), el(Button, { variant: 'primary', onClick: () => choose(selected => onChange(items.concat(selected))) }, 'Add videos')),
      invalid && el(Notice, { status: 'error', isDismissible: false }, 'Enter a complete MP4, WebM, OGV or M4V file URL for each video before saving.'),
      !items.length && el('p', { className: 'aes-playlist-empty' }, 'No background videos. The hero keeps its navy background; removed clips will not play.'),
      el('ol', { className: 'aes-playlist-items' }, items.map((item, index) => el('li', { key: item.id, className: 'aes-playlist-item' },
        el('div', { className: 'aes-playlist-preview' }, el('span', null, 'Video ' + (index + 1)), validUrl(item.url) && el('video', { src: item.url, controls: true, muted: true, preload: 'none', playsInline: true })),
        el('div', { className: 'aes-playlist-fields' },
          el(TextControl, { label: 'Video ' + (index + 1) + ' file URL', value: item.url, onChange: url => change(index, { ...item, url }) }),
          el('div', { className: 'aes-playlist-actions' },
            el(Button, { variant: 'secondary', onClick: () => choose(selected => { if (selected[0]) change(index, { ...item, url: selected[0].url }); }, false) }, 'Replace video ' + (index + 1)),
            el(Button, { variant: 'secondary', disabled: index === 0, onClick: () => move(index, -1), 'aria-label': 'Move video ' + (index + 1) + ' up' }, 'Move up'),
            el(Button, { variant: 'secondary', disabled: index === items.length - 1, onClick: () => move(index, 1), 'aria-label': 'Move video ' + (index + 1) + ' down' }, 'Move down'),
            el(Button, { isDestructive: true, onClick: () => onChange(items.filter((_, i) => i !== index)) }, 'Remove video ' + (index + 1))
          )
        )
      ))),
      el('div', { className: 'aes-playlist-add-url' }, el(TextControl, { label: 'Or add a video file URL', value: newUrl, placeholder: 'https://example.com/video.mp4', onChange: setNewUrl }), el(Button, { variant: 'secondary', disabled: !validUrl(newUrl), onClick: () => { onChange(items.concat(makeItem(newUrl))); setNewUrl(''); } }, 'Add URL'))
    );
  }
  window.AESHeroPlaylist = { Editor, read, apply, choose };
})(window.wp);

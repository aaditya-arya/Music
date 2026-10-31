(() => {
    'use strict';
    const root = document.querySelector('.aes-inbox');
    if (!root || !window.AES_INBOX) return;
    const config = window.AES_INBOX;
    const $ = id => document.getElementById(id);
    const form = $('aes-inbox-filters');
    const overlay = $('aes-inbox-overlay');
    const dialog = $('aes-inbox-detail');
    document.body.append(overlay);
    const state = { category: 'all', scope: 'inbox', page: 1, pages: 1, items: [], selected: new Map(), drafts: new Map(), detail: null, busy: false, listController: null, detailController: null };
    let returnFocus, returnFocusId, returnFocusClass, inertElements = [], searchTimer;
    const el = (tag, text, className) => {
        const node = document.createElement(tag);
        if (text !== undefined) node.textContent = String(text);
        if (className) node.className = className;
        return node;
    };
    const button = (text, action, className = 'aes-inbox-button') => {
        const node = el('button', text, className);
        node.type = 'button';
        node.addEventListener('click', action);
        return node;
    };
    const notify = (message = '', error = false, detail = false) => {
        const node = $(detail ? 'aes-detail-notice' : 'aes-inbox-notice');
        node.textContent = message;
        node.classList.toggle('is-error', error);
        node.hidden = !message;
    };
    async function api(action, params = {}, signal, post = false) {
        const data = new URLSearchParams({ action: `aes_inbox_${action}`, nonce: config.nonce, ...params });
        let response;
        try {
            response = await fetch(post ? config.ajax : `${config.ajax}?${data}`, { credentials: 'same-origin', signal, ...(post ? { method: 'POST', body: data } : {}) });
        } catch (error) {
            if (error.name === 'AbortError') throw error;
            throw new Error('Could not connect. Check your connection and try again. Your changes have been kept.');
        }
        let result;
        try { result = await response.json(); } catch { throw new Error('The server returned an unexpected response. Refresh the inbox and try again.'); }
        if (!response.ok || !result.success) {
            const error = new Error(result.data?.message || 'The request could not be completed. Please try again.');
            error.status = response.status;
            throw error;
        }
        return result.data;
    }
    const filters = () => ({ ...Object.fromEntries(new FormData(form)), category: state.category, scope: state.scope, page: state.page, per_page: $('aes-inbox-size').value, sort: $('aes-inbox-sort').value });
    const exportUrl = ids => {
        const url = new URL(config.exportUrl);
        Object.entries(filters()).forEach(([key, value]) => url.searchParams.set(key, value));
        if (ids) url.searchParams.set('ids', ids.join(','));
        return url.href;
    };
    const download = url => {
        const anchor = el('a'); anchor.href = url; anchor.download = ''; document.body.append(anchor); anchor.click(); anchor.remove();
    };
    function updateSelection() {
        const count = state.selected.size;
        $('aes-inbox-bulk').hidden = !count;
        $('aes-inbox-selected').textContent = `${count} selected on this page`;
        const all = $('aes-inbox-check-all');
        all.checked = !!state.items.length && count === state.items.length;
        all.indeterminate = count > 0 && count < state.items.length;
        all.disabled = !state.items.length;
        root.querySelectorAll('[data-select-id]').forEach(node => { node.checked = state.selected.has(Number(node.dataset.selectId)); });
    }
    function clearSelection() { state.selected.clear(); updateSelection(); }
    function syncViews() {
        root.querySelectorAll('[data-category]').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.category === state.category)));
        root.querySelectorAll('[data-scope]').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.scope === state.scope)));
        const actions = state.scope === 'trash' ? [['restore', 'Restore to inbox'], ['delete', 'Delete permanently']] : [['status:new', 'Set status: New'], ['status:in_progress', 'Set status: In progress'], ['status:resolved', 'Set status: Resolved'], ['status:archived', 'Set status: Archived'], ['read', 'Mark as read'], ['unread', 'Mark as unread'], ['trash', 'Move to Trash']];
        $('aes-inbox-bulk-action').replaceChildren(...[['', 'Choose an action…'], ...actions].map(([value, label]) => { const option = el('option', label); option.value = value; return option; }));
        $('aes-inbox-export').href = exportUrl();
    }
    function renderRows() {
        const focused = $('aes-inbox-rows').contains(document.activeElement) ? document.activeElement : null;
        const fragment = document.createDocumentFragment();
        for (const item of state.items) {
            const row = el('tr', undefined, item.unread ? 'is-unread' : '');
            const checkCell = el('td', undefined, 'aes-inbox-check');
            const checkbox = el('input'); checkbox.type = 'checkbox'; checkbox.dataset.selectId = item.id; checkbox.setAttribute('aria-label', `Select ${item.reference}`);
            checkbox.addEventListener('change', () => { if (checkbox.checked) state.selected.set(item.id, item.version); else state.selected.delete(item.id); updateSelection(); });
            checkCell.append(checkbox); row.append(checkCell);
            const reference = el('td');
            const open = button(item.reference, event => openDetail(item.id, event.currentTarget), 'aes-inbox-open');
            open.dataset.openId = item.id;
            if (item.unread) { const dot = el('span', '', 'aes-inbox-dot'); dot.setAttribute('aria-label', 'Unread'); open.prepend(dot); }
            reference.append(open, el('small', `${item.date} · ${item.time}`)); row.append(reference);
            const contact = el('td'); contact.append(el('strong', item.name || 'Name not provided'));
            if (item.company) contact.append(el('small', item.company));
            if (item.email) { const link = el('a', item.email, 'aes-inbox-row-contact'); link.href = `mailto:${item.email}`; contact.append(link); }
            if (item.phone) contact.append(el('small', item.phone)); row.append(contact);
            const summary = el('td'); summary.append(el('strong', config.categories[item.category] || 'Other'), el('small', item.form_title));
            if (item.message) summary.append(el('span', item.message, 'aes-inbox-preview')); row.append(summary);
            const status = el('td'); status.append(el('span', config.statuses[item.status] || 'New', `aes-inbox-badge ${item.status}`));
            if (item.priority === 'high') { status.append(el('br'), el('span', 'High priority', 'aes-inbox-badge high')); } row.append(status);
            row.append(el('td', item.file_count || '—', 'aes-inbox-file-count'));
            const action = el('td'); const view = button('Open', event => openDetail(item.id, event.currentTarget), 'aes-inbox-row-view'); view.dataset.openId = item.id; view.setAttribute('aria-label', `Open ${item.reference}`); action.append(view); row.append(action);
            fragment.append(row);
        }
        $('aes-inbox-rows').replaceChildren(fragment);
        updateSelection();
        if (focused) {
            const selector = focused.dataset.selectId ? `[data-select-id="${focused.dataset.selectId}"]` : focused.dataset.openId ? `.${focused.className}[data-open-id="${focused.dataset.openId}"]` : '';
            const target = selector && root.querySelector(selector);
            if (target) target.focus(); else { $('aes-inbox-refresh').disabled = false; $('aes-inbox-refresh').focus(); }
        }
    }
    async function loadList({ quiet = false } = {}) {
        state.listController?.abort();
        const controller = state.listController = new AbortController();
        $('aes-inbox-table').setAttribute('aria-busy', 'true');
        $('aes-inbox-refresh').disabled = true;
        if (!quiet) $('aes-inbox-results').textContent = 'Loading requests…';
        try {
            let data = await api('list', filters(), controller.signal);
            while (data.indexing) {
                $('aes-inbox-results').textContent = `Preparing existing requests… ${data.remaining} remaining`;
                data = await api('list', filters(), controller.signal);
            }
            if (controller !== state.listController) return;
            state.items = data.items; state.page = data.page; state.pages = data.pages;
            for (const id of state.selected.keys()) if (!data.items.some(item => item.id === id)) state.selected.delete(id);
            renderRows(); syncViews();
            root.querySelectorAll('[data-count]').forEach(node => { node.textContent = data.stats[node.dataset.count].toLocaleString(); });
            const categoryCounts = state.scope === 'trash' ? data.stats.trash_categories : data.stats.categories;
            root.querySelectorAll('[data-category-count]').forEach(node => { node.textContent = categoryCounts[node.dataset.categoryCount].toLocaleString(); });
            const start = data.total ? (state.page - 1) * Number($('aes-inbox-size').value) + 1 : 0;
            $('aes-inbox-results').textContent = `${start.toLocaleString()}–${Math.min(start + data.items.length - 1, data.total).toLocaleString()} of ${data.total.toLocaleString()} requests${state.scope === 'trash' ? ' in Trash' : ''}`;
            if (!data.total) $('aes-inbox-results').textContent = '0 requests';
            $('aes-inbox-page').textContent = `Page ${state.page} of ${data.pages}`;
            $('aes-inbox-prev').disabled = state.page <= 1; $('aes-inbox-next').disabled = state.page >= data.pages;
            $('aes-inbox-empty').hidden = !!data.items.length;
            const activeFilters = state.category !== 'all' || form.q.value || form.status.value !== 'all' || form.from.value || form.to.value || form.unread.checked;
            $('aes-inbox-empty-title').textContent = activeFilters ? 'No matching requests' : state.scope === 'trash' ? 'Trash is empty' : 'Your inbox is ready';
            $('aes-inbox-empty-copy').textContent = activeFilters ? 'Try a different search or reset your filters to see more requests.' : state.scope === 'trash' ? 'Requests moved to Trash can be restored here before WordPress removes them.' : 'New website submissions will appear here. Use Refresh to check for updates.';
            $('aes-inbox-updated').textContent = `Updated ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } catch (error) {
            if (error.name !== 'AbortError') { notify(error.message, true); $('aes-inbox-results').textContent = 'Could not update requests. Use Refresh to retry.'; }
        } finally {
            if (controller === state.listController) { $('aes-inbox-table').setAttribute('aria-busy', 'false'); $('aes-inbox-refresh').disabled = false; }
        }
    }
    function changed() { clearTimeout(searchTimer); searchTimer = null; state.page = 1; clearSelection(); syncViews(); loadList(); }
    root.querySelectorAll('[data-category]').forEach(node => node.addEventListener('click', () => { state.category = node.dataset.category; changed(); }));
    root.querySelectorAll('[data-scope]').forEach(node => node.addEventListener('click', () => { state.scope = node.dataset.scope; changed(); }));
    function resetFilters() { form.reset(); state.category = 'all'; state.scope = 'inbox'; }
    root.querySelectorAll('[data-metric]').forEach(node => node.addEventListener('click', () => { resetFilters(); const key = node.dataset.metric; if (key === 'unread') form.unread.checked = true; if (key === 'open' || key === 'resolved') form.status.value = key; changed(); }));
    form.addEventListener('submit', event => { event.preventDefault(); clearTimeout(searchTimer); changed(); });
    form.q.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { searchTimer = null; changed(); }, 300); });
    form.addEventListener('change', event => { if (event.target !== form.q) changed(); });
    $('aes-inbox-reset').addEventListener('click', () => { resetFilters(); changed(); });
    $('aes-inbox-sort').addEventListener('change', changed); $('aes-inbox-size').addEventListener('change', changed);
    $('aes-inbox-prev').addEventListener('click', () => { if (state.page > 1) { state.page--; clearSelection(); loadList(); } });
    $('aes-inbox-next').addEventListener('click', () => { if (state.page < state.pages) { state.page++; clearSelection(); loadList(); } });
    $('aes-inbox-refresh').addEventListener('click', () => { notify(); clearSelection(); loadList(); });
    $('aes-inbox-export').addEventListener('click', event => { event.preventDefault(); download(exportUrl()); });
    $('aes-inbox-export-selected').addEventListener('click', () => download(exportUrl([...state.selected.keys()])));
    $('aes-inbox-clear').addEventListener('click', clearSelection);
    $('aes-inbox-check-all').addEventListener('change', event => { state.selected.clear(); if (event.target.checked) state.items.forEach(item => state.selected.set(item.id, item.version)); updateSelection(); });
    function lock(busy) {
        state.busy = busy;
        root.querySelectorAll('#aes-inbox-apply, #aes-inbox-bulk-action').forEach(node => { node.disabled = busy; });
        dialog.querySelectorAll('button, select, textarea').forEach(node => { node.disabled = busy; });
        if (!busy && state.detail?.trashed) $('aes-detail-save').disabled = true;
    }
    async function mutate(operation, versions, extra = {}) { return api('mutate', { operation, ids: JSON.stringify([...versions.keys()]), versions: JSON.stringify(Object.fromEntries(versions)), ...extra }, undefined, true); }
    $('aes-inbox-apply').addEventListener('click', async () => {
        if (state.busy || !state.selected.size) return;
        const [operation, status] = $('aes-inbox-bulk-action').value.split(':');
        if (!operation) return notify('Choose an action for the selected requests.', true);
        if ((operation === 'trash' || operation === 'delete') && !window.confirm(operation === 'delete' ? `Permanently delete ${state.selected.size} selected requests and their attachments? This cannot be undone.` : `Move ${state.selected.size} selected requests to Trash? You can restore them from the Trash view.`)) return;
        lock(true);
        try { const result = await mutate(operation, new Map(state.selected), status ? { status } : {}); notify(result.message); clearSelection(); await loadList(); } catch (error) { notify(error.message, true); } finally { lock(false); }
    });
    function captureDraft() {
        const item = state.detail;
        if (!item || item.trashed || !$('aes-detail-status')) return;
        const draft = { status: $('aes-detail-status').value, priority: $('aes-detail-priority').value, note: $('aes-detail-note').value };
        if (draft.status !== item.status || draft.priority !== item.priority || draft.note.trim()) state.drafts.set(item.id, draft); else state.drafts.delete(item.id);
        $('aes-detail-save-state').textContent = state.drafts.has(item.id) ? 'Unsaved changes · kept while this page stays open' : 'Changes are private to administrators.';
        $('aes-detail-discard').hidden = !state.drafts.has(item.id);
    }
    function closeDetail() {
        if (state.busy) return;
        captureDraft(); state.detailController?.abort(); overlay.hidden = true; state.detail = null;
        document.body.classList.remove('aes-inbox-modal-open');
        inertElements.forEach(([node, value]) => { node.inert = value; }); inertElements = [];
        const replacement = returnFocusId && root.querySelector(`.${returnFocusClass}[data-open-id="${returnFocusId}"]`);
        if (returnFocus?.isConnected) returnFocus.focus(); else if (replacement) replacement.focus(); else $('aes-inbox-refresh').focus();
    }
    $('aes-detail-close').addEventListener('click', closeDetail);
    function positionDrawer() {
        if (overlay.hidden) return;
        const bar = $('wpadminbar');
        overlay.style.top = `${bar ? Math.max(0, Math.min(bar.getBoundingClientRect().bottom, bar.offsetHeight)) : 0}px`;
    }
    window.addEventListener('resize', positionDrawer);
    window.addEventListener('scroll', positionDrawer, { passive: true });
    overlay.addEventListener('click', event => { if (event.target === overlay) closeDetail(); });
    overlay.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); closeDetail(); }
        if (event.key !== 'Tab') return;
        const focusable = [...dialog.querySelectorAll('button:not(:disabled), a[href], select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')].filter(node => node.getClientRects().length);
        const first = focusable[0], last = focusable.at(-1);
        if (!first) { event.preventDefault(); return dialog.focus(); }
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    async function openDetail(id, opener) {
        if (state.busy) return;
        captureDraft(); state.detailController?.abort();
        const controller = state.detailController = new AbortController();
        state.detail = null;
        if (overlay.hidden) {
            returnFocus = opener || document.activeElement;
            returnFocusId = returnFocus.dataset.openId;
            returnFocusClass = returnFocus.classList.contains('aes-inbox-row-view') ? 'aes-inbox-row-view' : 'aes-inbox-open';
            inertElements = [...document.body.children].filter(node => node !== overlay && !['SCRIPT', 'STYLE', 'LINK'].includes(node.tagName)).map(node => [node, node.inert]);
            inertElements.forEach(([node]) => { node.inert = true; });
            overlay.hidden = false; document.body.classList.add('aes-inbox-modal-open');
            positionDrawer();
        }
        $('aes-detail-reference').textContent = `AES-${id}`; $('aes-detail-title').textContent = 'Loading request…'; $('aes-detail-date').textContent = '';
        $('aes-detail-content').replaceChildren(); $('aes-detail-footer').hidden = true; notify('', false, true); dialog.focus();
        try {
            let item = await api('detail', { id }, controller.signal);
            if (item.unread && !item.trashed) {
                try { await mutate('read', new Map([[item.id, item.version]])); item = await api('detail', { id }, controller.signal); }
                catch (error) { if (error.name === 'AbortError') throw error; notify(error.message, true, true); }
            }
            if (controller !== state.detailController || overlay.hidden) return;
            state.detail = item; renderDetail(item); loadList({ quiet: true });
        } catch (error) {
            if (error.name !== 'AbortError') { $('aes-detail-title').textContent = 'Could not load request'; notify(error.message, true, true); $('aes-detail-content').append(button('Try again', () => openDetail(id))); }
        }
    }
    const section = title => { const node = el('section', undefined, 'aes-inbox-detail-section'); node.append(el('h3', title)); return node; };
    function selectControl(label, id, options, value) {
        const wrapper = el('label', label), select = el('select'); select.id = id;
        Object.entries(options).forEach(([key, text]) => { const option = el('option', text); option.value = key; select.append(option); }); select.value = value; wrapper.append(select); select.addEventListener('change', captureDraft); return wrapper;
    }
    function renderDetail(item) {
        $('aes-detail-title').textContent = config.categories[item.category] || 'Website request';
        $('aes-detail-date').textContent = `${item.date} at ${item.time} · ${config.timezone}${item.trashed ? ' · In Trash' : ''}`;
        const content = $('aes-detail-content'); content.replaceChildren();
        const person = section('Submitted by'); person.append(el('p', item.name || 'Name not provided', 'aes-inbox-detail-person'));
        if (item.company) person.append(el('p', item.company, 'aes-inbox-detail-company'));
        const contacts = el('div', undefined, 'aes-inbox-detail-contact');
        if (item.email) { const link = el('a', item.email); link.href = `mailto:${item.email}`; contacts.append(link); }
        if (item.phone) { const link = el('a', item.phone); link.href = `tel:${item.phone.replace(/[^+\d]/g, '')}`; contacts.append(link); }
        person.append(contacts); content.append(person);
        if (!item.trashed) {
            const draft = state.drafts.get(item.id) || item;
            const workflow = section('Follow-up'); const controls = el('div', undefined, 'aes-inbox-detail-controls');
            controls.append(selectControl('Status', 'aes-detail-status', config.statuses, draft.status), selectControl('Priority', 'aes-detail-priority', { normal: 'Normal', high: 'High priority' }, draft.priority));
            workflow.append(controls); content.append(workflow);
        }
        const fields = section('Complete submission'); fields.append(el('p', `Source: ${item.form_title}`, 'aes-inbox-detail-muted'));
        const list = el('dl', undefined, 'aes-inbox-detail-fields');
        item.details.forEach(field => { list.append(el('dt', field.label || field.name || 'Field'), el('dd', field.value || '—')); });
        if (!item.details.length) fields.append(el('p', 'No submitted fields were recorded.', 'aes-inbox-detail-muted'));
        fields.append(list); content.append(fields);
        const files = section(`Attachments (${item.files.length})`); const attachments = el('div', undefined, 'aes-inbox-attachments');
        item.files.forEach(file => { const link = el('a', undefined, 'aes-inbox-attachment'); link.href = file.url; link.download = file.name; link.append(el('span', file.name), el('small', `${Math.max(1, Math.round(file.size / 1024))} KB ↓`)); attachments.append(link); });
        files.append(item.files.length ? attachments : el('p', 'No attachments were submitted.', 'aes-inbox-detail-muted')); content.append(files);
        const notes = section('Internal notes');
        item.notes.forEach(note => { const node = el('div', undefined, 'aes-inbox-note'); node.append(el('p', note.text), el('small', `${note.author} · ${new Date(note.date).toLocaleString()}`)); notes.append(node); });
        if (!item.notes.length) notes.append(el('p', 'No notes yet. Keep a record of calls, replies and next steps here.', 'aes-inbox-detail-muted'));
        if (!item.trashed) {
            const label = el('label', 'Add a private note', 'aes-inbox-note-label'); const textarea = el('textarea'); textarea.id = 'aes-detail-note'; textarea.maxLength = 4000; textarea.placeholder = 'What happened, and what needs to happen next?'; textarea.value = state.drafts.get(item.id)?.note || ''; textarea.addEventListener('input', captureDraft); label.append(textarea); notes.append(label, el('p', 'Up to 4,000 characters. Notes are visible only to administrators.', 'aes-inbox-detail-muted'));
        }
        content.append(notes);
        const actions = section('Record actions'); actions.append(el('p', item.notification, 'aes-inbox-detail-muted'));
        const actionButtons = el('div', undefined, 'aes-inbox-detail-actions');
        actionButtons.append(button('Refresh request', () => openDetail(item.id)));
        if (item.trashed) actionButtons.append(button('Restore to inbox', () => detailAction('restore')), button('Delete permanently', () => detailAction('delete'), 'aes-inbox-button aes-inbox-danger'));
        else actionButtons.append(button(item.unread ? 'Mark as read' : 'Mark as unread', () => detailAction(item.unread ? 'read' : 'unread')), button('Move to Trash', () => detailAction('trash'), 'aes-inbox-button aes-inbox-danger'));
        actions.append(actionButtons); content.append(actions);
        $('aes-detail-footer').hidden = item.trashed;
        $('aes-detail-save').disabled = false;
        captureDraft();
    }
    $('aes-detail-discard').addEventListener('click', () => {
        if (state.busy || !state.detail) return;
        state.drafts.delete(state.detail.id); renderDetail(state.detail); notify('Unsaved changes discarded.', false, true);
    });
    $('aes-detail-save').addEventListener('click', async () => {
        if (state.busy || !state.detail || state.detail.trashed) return;
        captureDraft(); const item = state.detail, draft = state.drafts.get(item.id);
        if (!draft) return notify('Everything is already saved.', false, true);
        lock(true); notify('', false, true); let committed = false;
        try {
            await mutate('save', new Map([[item.id, item.version]]), draft);
            committed = true;
            state.drafts.delete(item.id);
            item.status = draft.status; item.priority = draft.priority; item.version++;
            $('aes-detail-note').value = '';
            state.detail = await api('detail', { id: item.id }); renderDetail(state.detail);
            notify('Status, priority and note saved.', false, true); await loadList({ quiet: true });
        } catch (error) { notify(committed ? 'Your changes were saved, but details could not refresh. Use Refresh request to load the latest record.' : error.message, true, true); } finally { lock(false); }
    });
    async function detailAction(operation) {
        if (state.busy || !state.detail) return;
        captureDraft(); const item = state.detail;
        if (operation === 'delete' && !window.confirm(`Permanently delete ${item.reference} and its attachments? This cannot be undone.`)) return;
        if (operation === 'trash' && !window.confirm(`Move ${item.reference} to Trash?${state.drafts.has(item.id) ? ' Unsaved changes will be discarded.' : ''} You can restore this request later.`)) return;
        lock(true);
        try {
            const result = await mutate(operation, new Map([[item.id, item.version]]));
            if (['trash', 'restore', 'delete'].includes(operation)) { state.drafts.delete(item.id); lock(false); state.detail = null; closeDetail(); notify(result.message); }
            else if (operation === 'unread') { lock(false); state.detail = null; closeDetail(); notify('Request marked as unread.'); }
            else { state.detail = await api('detail', { id: item.id }); renderDetail(state.detail); notify('Request marked as read.', false, true); }
            clearSelection(); await loadList({ quiet: true });
        } catch (error) { notify(error.message, true, true); } finally { lock(false); }
    }
    window.addEventListener('beforeunload', event => { captureDraft(); if (state.drafts.size) { event.preventDefault(); event.returnValue = ''; } });
    setInterval(() => { if (!document.hidden && overlay.hidden && !state.busy && !state.selected.size && !searchTimer) loadList({ quiet: true }); }, 60000);
    syncViews(); loadList();
})();

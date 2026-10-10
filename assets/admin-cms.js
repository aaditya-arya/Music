(() => {
  // 1. Existing Page/CMS Field Sync
  document.querySelectorAll('.aes-controls').forEach(root => {
    const sync = () => {
      const values = {};
      root.querySelectorAll('.aes-value').forEach(el => values[el.dataset.key] = el.value);
      const jsonEl = root.querySelector('.aes-json');
      if (jsonEl) jsonEl.value = JSON.stringify(values);
    };
    sync();
    root.addEventListener('input', sync);
    root.closest('form')?.addEventListener('submit', sync);

    const filterEl = root.querySelector('.aes-filter');
    if (filterEl) {
      filterEl.addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        root.querySelectorAll('.aes-group').forEach(group => {
          let hits = 0;
          group.querySelectorAll('.aes-row').forEach(row => {
            const match = (row.textContent + ' ' + (row.querySelector('textarea')?.value || '')).toLowerCase().includes(q);
            row.hidden = !match;
            hits += match ? 1 : 0;
          });
          group.hidden = !hits;
          if (q && hits) group.open = true;
        });
      });
    }

    root.querySelectorAll('.aes-media').forEach(btn => btn.addEventListener('click', () => {
      const frame = wp.media({ title: 'Select an image or document', multiple: false });
      frame.on('select', () => {
        btn.parentElement.querySelector('textarea').value = frame.state().get('selection').first().toJSON().url;
        sync();
      });
      frame.open();
    }));
  });

  const pageSearch = document.getElementById('aesPageSearch');
  pageSearch?.addEventListener('input', () => {
    const query = pageSearch.value.trim().toLowerCase(); let count = 0;
    document.querySelectorAll('[data-page-search]').forEach(row => { row.hidden = !row.dataset.pageSearch.includes(query); if (!row.hidden) count++; });
    document.getElementById('aesPageSearchEmpty').hidden = count > 0;
  });
  const announce = message => {
    let status = document.getElementById('aesAdminFeedback');
    if (!status) {
      status = document.createElement('p'); status.id = 'aesAdminFeedback'; status.className = 'aes-admin-feedback'; status.setAttribute('role', 'status');
      document.querySelector('.aes-toolbar-card')?.appendChild(status);
    }
    status.textContent = message;
  };
  // 2. Submissions Hub Logic
  let activeCategory = 'all';

  window.aesFilterCategory = function (cat) {
    activeCategory = cat;
    document.querySelectorAll('.btn-glass-tab').forEach(tab => {
      if (tab.dataset.filter === cat) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    document.querySelectorAll('.btn-glass-tab').forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.filter === cat)));
    aesApplyFilters();
  };

  window.aesApplyFilters = function () {
    const searchInput = document.getElementById('aesSubmissionSearch');
    const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    const rows = document.querySelectorAll('.aes-sub-row');
    let visibleCount = 0;

    rows.forEach(row => {
      const cat = row.dataset.cat;
      const searchStr = row.dataset.search || '';

      const matchCat = (activeCategory === 'all' || cat === activeCategory);
      const matchSearch = (!query || searchStr.includes(query));

      if (matchCat && matchSearch) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    const emptyRow = document.querySelector('.aes-empty-row');
    if (emptyRow) {
      emptyRow.style.display = (visibleCount === 0) ? '' : 'none';
    }
  };

  let modalReturnFocus, bodyOverflow, inertElements = [];
  window.aesOpenDetailModal = function (id) {
    const data = (window.AES_SUBMISSIONS || []).find(s => s.id === id);
    if (!data) return;

    const modal = document.getElementById('aesDetailModal');
    if (!modal) return;

    document.getElementById('modalTitle').textContent = data.form_title;
    document.getElementById('modalSubtitle').textContent = `Reference: AES-${data.id} • Submitted on ${data.date}`;
    
    const catBadge = document.getElementById('modalCategoryBadge');
    catBadge.textContent = data.category.toUpperCase();
    catBadge.className = `aes-cat-badge aes-cat-${data.category}`;

    document.getElementById('modalNoticeText').textContent = data.notification || 'Saved in WordPress database';

    // Populate Fields
    const tbody = document.getElementById('modalFieldsBody');
    tbody.innerHTML = '';
    
    if (Array.isArray(data.details) && data.details.length > 0) {
      data.details.forEach(item => {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = item.label || 'Field';
        const td = document.createElement('td');
        td.textContent = item.value || '—';
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
      });
    } else {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="2" style="text-align:center; color:#94a3b8;">No specific field entries recorded.</td>';
      tbody.appendChild(tr);
    }

    // Populate Attachments
    const attachSection = document.getElementById('modalAttachmentsSection');
    const attachList = document.getElementById('modalAttachmentsList');
    attachList.innerHTML = '';

    if (Array.isArray(data.files) && data.files.length > 0) {
      attachSection.style.display = '';
      data.files.forEach(f => {
        const a = document.createElement('a');
        a.href = f.url;
        a.className = 'btn-glass btn-glass-file';
        a.target = '_blank';
        a.textContent = f.name;
        a.rel = 'noopener';
        attachList.appendChild(a);
      });
    } else {
      attachSection.style.display = 'none';
    }

    if (modal.style.display !== 'flex') {
      modalReturnFocus = document.activeElement; bodyOverflow = document.body.style.overflow;
      inertElements = [...document.body.children].filter(element => !element.contains(modal) && !['SCRIPT', 'STYLE', 'LINK'].includes(element.tagName)).map(element => [element, element.inert]);
      inertElements.forEach(([element]) => { element.inert = true; });
    }
    document.body.style.overflow = 'hidden';
    modal.style.display = 'flex'; modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('.aes-modal-close').focus();
  };

  window.aesCloseDetailModal = function () {
    const modal = document.getElementById('aesDetailModal');
    if (!modal || modal.style.display === 'none') return;
    modal.style.display = 'none'; modal.setAttribute('aria-hidden', 'true');
    inertElements.forEach(([element, wasInert]) => { element.inert = wasInert; }); inertElements = [];
    document.body.style.overflow = bodyOverflow || '';
    modalReturnFocus?.focus();
  };

  window.aesCopyModalDetails = function () {
    const rows = document.querySelectorAll('#modalFieldsBody tr');
    let text = `${document.getElementById('modalTitle').textContent}\n${document.getElementById('modalSubtitle').textContent}\n\n`;
    rows.forEach(r => {
      const th = r.querySelector('th')?.textContent?.trim() || '';
      const td = r.querySelector('td')?.textContent?.trim() || '';
      if (th && td) {
        text += `${th}: ${td}\n`;
      }
    });
    const copyButton = document.querySelector('[onclick="aesCopyModalDetails()"]');
    const copied = () => { copyButton.textContent = 'Copied'; setTimeout(() => { copyButton.textContent = 'Copy all text'; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(copied).catch(() => announce('Copy was unavailable. Select and copy the details manually.'));
    else {
      const field = document.createElement('textarea'); field.value = text; document.getElementById('aesDetailModal').appendChild(field); field.select();
      if (document.execCommand('copy')) copied(); else announce('Select and copy the details manually.');
      field.remove(); copyButton.focus();
    }
  };

  window.aesDeleteSubmission = async function (id) {
    if (!confirm(`Are you sure you want to permanently delete submission AES-${id}? This action cannot be undone.`)) {
      return;
    }

    const formData = new FormData();
    formData.append('action', 'aes_delete_submission');
    formData.append('nonce', window.AES_ADMIN_NONCE);
    formData.append('id', id);

    try {
      const res = await fetch(window.AES_AJAX_URL, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.data?.message || 'Deletion failed.');
      }
      // Remove row smoothly
      const row = document.querySelector(`.aes-sub-row[data-id="${id}"]`);
      if (row) {
        row.style.opacity = '0';
        setTimeout(() => {
          row.remove();
          // Update local memory
          if (Array.isArray(window.AES_SUBMISSIONS)) {
            window.AES_SUBMISSIONS = window.AES_SUBMISSIONS.filter(s => s.id !== id);
          }
          updateCounts();
          aesApplyFilters();
          announce(`Submission AES-${id} deleted.`);
        }, 200);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete submission.');
    }
  };

  const updateCounts = () => {
    const data = window.AES_SUBMISSIONS || [];
    document.querySelectorAll('.aes-stat-card, .btn-glass-tab').forEach(control => {
      const category = control.dataset.cat || control.dataset.filter;
      const count = category === 'all' ? data.length : data.filter(item => item.category === category).length;
      const number = control.querySelector('.aes-stat-value, .aes-tab-count'); if (number) number.textContent = count;
    });
  };
  window.aesExportCSV = function () {
    const visible = new Set([...document.querySelectorAll('.aes-sub-row')].filter(row => row.style.display !== 'none').map(row => Number(row.dataset.id)));
    const data = (window.AES_SUBMISSIONS || []).filter(item => visible.has(item.id));
    if (!data.length) { announce('No matching submissions to export.'); return; }
    const headers = ['Ref ID', 'Date', 'Form Type', 'Category', 'Name', 'Email', 'Phone', 'Company / Organization', 'Key Details', 'Notification Status'];
    const rows = [headers, ...data.map(item => [`AES-${item.id}`, item.date, item.form_title, item.category, item.name, item.email, item.phone, item.company, item.snippet, item.notification])];
    const cell = value => {
      let text = String(value ?? '');
      if (/^\s*[=+@-]/.test(text)) text = "'" + text;
      return '"' + text.replace(/"/g, '""') + '"';
    };
    const csv = '\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `aes_submissions_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(`Exported ${data.length} matching submissions.`);
  };
  document.querySelectorAll('.aes-stat-card').forEach(card => {
    card.tabIndex = 0; card.setAttribute('role', 'button');
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); } });
  });
  document.addEventListener('keydown', event => {
    const modal = document.getElementById('aesDetailModal');
    if (!modal || modal.style.display === 'none') return;
    if (event.key === 'Escape') { event.preventDefault(); aesCloseDetailModal(); }
    if (event.key === 'Tab') {
      const controls = [...modal.querySelectorAll('a[href], button, input, textarea')].filter(element => element.getClientRects().length);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  if (document.getElementById('aesSubmissionsTable')) aesApplyFilters();

})();

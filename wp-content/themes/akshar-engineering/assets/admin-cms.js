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
      emptyRow.style.display = (visibleCount === 0 && rows.length > 0) ? '' : 'none';
    }
  };

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
        a.innerHTML = `<span>📥 ${f.name}</span>`;
        attachList.appendChild(a);
      });
    } else {
      attachSection.style.display = 'none';
    }

    modal.style.display = 'flex';
  };

  window.aesCloseDetailModal = function () {
    const modal = document.getElementById('aesDetailModal');
    if (modal) modal.style.display = 'none';
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
    navigator.clipboard.writeText(text).then(() => {
      alert('Submission details copied to clipboard!');
    }).catch(() => {
      alert('Unable to copy to clipboard.');
    });
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
          aesApplyFilters();
        }, 200);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete submission.');
    }
  };

  window.aesExportCSV = function () {
    const data = window.AES_SUBMISSIONS || [];
    if (data.length === 0) {
      alert('No submission data available to export.');
      return;
    }

    const headers = ['Ref ID', 'Date', 'Form Type', 'Category', 'Name', 'Email', 'Phone', 'Company / Organization', 'Key Details', 'Notification Status'];
    const rows = [headers];

    data.forEach(item => {
      rows.push([
        `AES-${item.id}`,
        item.date || '',
        item.form_title || '',
        item.category || '',
        item.name || '',
        item.email || '',
        item.phone || '',
        item.company || '',
        (item.snippet || '').replace(/"/g, '""'),
        item.notification || ''
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(val => `"${val}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aes_submissions_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Keyboard shortcut for closing modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      aesCloseDetailModal();
    }
  });

})();

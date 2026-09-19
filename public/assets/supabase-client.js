/**
 * Akshar Engineering Services (AES) - Supabase Integration Client
 * Dedicated backend connector strictly for the 16 Services inspection request forms.
 */

// ======================================================================================
// CONFIGURATION: Set your Supabase Project URL and Public Anon Key below
// ======================================================================================
const AES_SUPABASE_CONFIG = {
  url: 'https://zbdtidadzgevqpvzxfkr.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZHRpZGFkemdldnFwdnp4ZmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3ODQwMDMsImV4cCI6MjEwNTM2MDAwM30.RXN7JN_9GAm2NfCrdWIwWOOZqJ5-FuM_crM9pMOkXpI'
};

let _supabaseClient = null;

function getSupabaseClient() {
  if (_supabaseClient) return _supabaseClient;
  const globalSupabase = (typeof window !== 'undefined' && window.supabase) || (typeof supabase !== 'undefined' && supabase);
  if (globalSupabase && globalSupabase.createClient) {
    if (AES_SUPABASE_CONFIG.url && !AES_SUPABASE_CONFIG.url.includes('YOUR_PROJECT_ID')) {
      const cleanUrl = AES_SUPABASE_CONFIG.url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
      _supabaseClient = globalSupabase.createClient(cleanUrl, AES_SUPABASE_CONFIG.anonKey.trim());
      return _supabaseClient;
    }
  }
  return null;
}

// ======================================================================================
// TOAST NOTIFICATION UTILITY
// ======================================================================================
function showAesToast(message, type = 'success', duration = 5000) {
  let container = document.getElementById('aes-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'aes-toast-container';
    container.className = 'fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgClass = type === 'success' 
    ? 'bg-slate-900 border-l-4 border-emerald-500 text-white' 
    : type === 'error' 
    ? 'bg-slate-900 border-l-4 border-rose-500 text-white' 
    : 'bg-slate-900 border-l-4 border-brand-orange text-white';

  const icon = type === 'success' ? '&#10004;' : type === 'error' ? '&#9888;' : '&#9432;';

  toast.className = `${bgClass} p-4 rounded-xl shadow-2xl flex items-start gap-3 pointer-events-auto transition-all duration-300 transform translate-y-4 opacity-0 text-xs sm:text-sm`;
  toast.innerHTML = `
    <span class="text-base font-bold">${icon}</span>
    <div class="flex-1 leading-snug">${message}</div>
    <button onclick="this.parentElement.remove()" class="text-white/60 hover:text-white font-bold ml-2 text-base leading-none">&times;</button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ======================================================================================
// FILE UPLOAD HELPER (Supabase Storage)
// ======================================================================================
async function uploadToSupabaseStorage(bucketName, file, folder = 'uploads') {
  const client = getSupabaseClient();
  if (!client) {
    console.warn('[AES Backend] Supabase client not initialized.');
    return null;
  }

  try {
    const fileExt = file.name.split('.').pop();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${folder}/${Date.now()}_${cleanFileName}`;

    const { data, error } = await client.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: urlData } = client.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return urlData ? urlData.publicUrl : null;
  } catch (err) {
    console.error('[AES Storage Upload Error]', err);
    return null;
  }
}

// ======================================================================================
// 1. INSPECTION REQUEST SUBMISSION (STRICTLY FOR THE 16 SERVICES PAGES)
// ======================================================================================
async function submitInspectionRequest(formData, file = null, submitBtn = null) {
  const client = getSupabaseClient();
  const origBtnText = submitBtn ? submitBtn.innerHTML : '';

  // Validation Check: Exactly 10 Digits
  const phoneClean = (formData.phone || '').replace(/[^0-9]/g, '');
  if (phoneClean.length !== 10) {
    showAesToast('Please enter an exact 10-digit mobile number.', 'error');
    return { success: false, error: 'Invalid phone number' };
  }

  // Validation Check: Email format
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test((formData.email || '').trim())) {
    showAesToast('Please enter a valid email address (e.g. name@company.com).', 'error');
    return { success: false, error: 'Invalid email address' };
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="inline-block animate-spin mr-2">&#9696;</span> Submitting Scope...`;
  }

  try {
    let attachmentUrl = null;
    if (file && client) {
      attachmentUrl = await uploadToSupabaseStorage('aes-attachments', file, 'inspections');
    }

    if (client) {
      const { data, error } = await client
        .from('inspection_requests')
        .insert([{
          client_name: formData.name,
          company_name: formData.company,
          email: formData.email.trim(),
          phone: phoneClean,
          service_type: formData.service || 'General Inspection',
          location_and_scope: formData.scope || '',
          preferred_date: formData.preferredDate || null,
          attachment_url: attachmentUrl,
          source_page: window.location.pathname.split('/').pop() || 'service-inspection.html'
        }]);

      if (error) {
        console.error('[Supabase Insert Error]', error);
        throw error;
      }
    }

    showAesToast(`Thank you, <strong>${formData.name}</strong>! Your inspection request has been logged. Our technical desk will contact you within 2 to 4 hours.`, 'success');
    return { success: true };
  } catch (err) {
    console.error('[Submit Inspection Error]', err);
    showAesToast(`Submission error: ${err.message || 'Please check Supabase connection.'}`, 'error');
    return { success: false, error: err };
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnText;
    }
  }
}

// ======================================================================================
// 2. DYNAMIC CAREERS CMS MODULE
// ======================================================================================
async function fetchActiveJobOpenings() {
  const client = getSupabaseClient();
  if (!client) return [];
  try {
    const { data, error } = await client
      .from('job_openings')
      .select('*')
      .eq('status', 'active')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Fetch Jobs Error - Using Fallbacks]', err);
    return [];
  }
}

async function submitJobApplication(formData, resumeFile = null, submitBtn = null) {
  const client = getSupabaseClient();
  const origBtnText = submitBtn ? submitBtn.innerHTML : '';

  const phoneClean = (formData.phone || '').replace(/[^0-9]/g, '');
  if (phoneClean.length !== 10) {
    showAesToast('Please enter an exact 10-digit mobile number.', 'error');
    return { success: false, error: 'Invalid phone number' };
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test((formData.email || '').trim())) {
    showAesToast('Please enter a valid email address.', 'error');
    return { success: false, error: 'Invalid email address' };
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="inline-block animate-spin mr-2">&#9696;</span> Uploading Profile...`;
  }

  try {
    let resumeUrl = null;
    if (resumeFile && client) {
      resumeUrl = await uploadToSupabaseStorage('aes-resumes', resumeFile, 'candidates');
    }

    if (client) {
      const { data, error } = await client
        .from('job_applications')
        .insert([{
          full_name: formData.fullName,
          email: formData.email.trim(),
          phone: phoneClean,
          current_location: formData.location || '',
          position_applied: formData.position,
          experience_level: formData.experience,
          certifications: formData.certifications || [],
          notice_period: formData.noticePeriod,
          resume_url: resumeUrl,
          cover_notes: formData.notes || '',
          status: 'Received'
        }]);

      if (error) throw error;
    }

    showAesToast(`Application received! Thank you, <strong>${formData.fullName}</strong>. Our HR technical screening desk will review your profile.`, 'success');
    return { success: true };
  } catch (err) {
    console.error('[Submit Job App Error]', err);
    showAesToast(`Application submission error: ${err.message || 'Please check connection.'}`, 'error');
    return { success: false, error: err };
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnText;
    }
  }
}

// ======================================================================================
// 3. DOCUMENT VERIFICATION MODULE
// ======================================================================================
async function verifyDocumentByReportNo(reportNo) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Database client unavailable.' };
  }

  const cleanNo = (reportNo || '').trim();
  if (!cleanNo) {
    return { success: false, error: 'Please enter a report or certificate number.' };
  }

  try {
    const { data, error } = await client
      .from('verified_documents')
      .select('*')
      .ilike('report_no', cleanNo)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return { success: false, notFound: true, reportNo: cleanNo };
    }

    return { success: true, document: data };
  } catch (err) {
    console.error('[Verify Document Error]', err);
    return { success: false, error: err.message };
  }
}

async function submitManualVerification(formData, docFile = null, submitBtn = null) {
  const client = getSupabaseClient();
  const origBtnText = submitBtn ? submitBtn.innerHTML : '';

  const phoneClean = (formData.phone || '').replace(/[^0-9]/g, '');
  if (phoneClean.length !== 10) {
    showAesToast('Please enter an exact 10-digit mobile number.', 'error');
    return { success: false, error: 'Invalid phone number' };
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="inline-block animate-spin mr-2">&#9696;</span> Submitting...`;
  }

  try {
    let fileUrl = null;
    if (docFile && client) {
      fileUrl = await uploadToSupabaseStorage('aes-documents', docFile, 'verification_requests');
    }

    if (client) {
      const { data, error } = await client
        .from('general_inquiries')
        .insert([{
          full_name: formData.name,
          phone: phoneClean,
          email: formData.email ? formData.email.trim() : '',
          company_name: formData.company || '',
          inquiry_type: 'Document Verification',
          message: `Report/Certificate No: ${formData.reportNo || 'N/A'}\nNotes: ${formData.notes || ''}\nAttachment URL: ${fileUrl || 'None'}`,
          source_page: window.location.pathname.split('/').pop() || 'index.html',
          status: 'New'
        }]);

      if (error) throw error;
    }

    showAesToast(`Verification request for <strong>${formData.reportNo || 'document'}</strong> submitted! Our QA cell will authenticate and respond shortly.`, 'success');
    return { success: true };
  } catch (err) {
    console.error('[Manual Verification Error]', err);
    showAesToast(`Error: ${err.message || 'Submission failed'}`, 'error');
    return { success: false, error: err };
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnText;
    }
  }
}

// ======================================================================================
// 4. GENERAL INQUIRIES & TRAINING SUBMISSION
// ======================================================================================
async function submitGeneralInquiry(formData, submitBtn = null) {
  const client = getSupabaseClient();
  const origBtnText = submitBtn ? submitBtn.innerHTML : '';

  const phoneClean = (formData.phone || '').replace(/[^0-9]/g, '');
  if (phoneClean.length !== 10) {
    showAesToast('Please enter an exact 10-digit mobile number.', 'error');
    return { success: false, error: 'Invalid phone number' };
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="inline-block animate-spin mr-2">&#9696;</span> Sending...`;
  }

  try {
    if (client) {
      const { data, error } = await client
        .from('general_inquiries')
        .insert([{
          full_name: formData.name,
          email: formData.email.trim(),
          phone: phoneClean,
          company_name: formData.company || '',
          inquiry_type: formData.inquiryType || 'General Inquiry',
          message: formData.message || '',
          source_page: window.location.pathname.split('/').pop() || 'contact.html',
          status: 'New'
        }]);

      if (error) throw error;
    }

    showAesToast(`Thank you! Your message has been routed to the AES team. We will respond promptly.`, 'success');
    return { success: true };
  } catch (err) {
    console.error('[General Inquiry Error]', err);
    showAesToast(`Error submitting inquiry: ${err.message}`, 'error');
    return { success: false, error: err };
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnText;
    }
  }
}

// ======================================================================================
// 5. GLOBAL HANDLER FOR THE 16 SERVICE PAGES
// ======================================================================================
window.handleServiceInspectionForm = async function(form, e) {
  if (e) e.preventDefault();
  const submitBtn = form.querySelector('button[type="submit"]');
  const nameInp = form.querySelector('input[placeholder*="Rajesh"]') || form.querySelector('input[name="name"]') || form.querySelector('input[type="text"]');
  const compInp = form.querySelector('input[placeholder*="Larsen"]') || form.querySelector('input[placeholder*="Company"]') || form.querySelector('input[name="company"]');
  const emailInp = form.querySelector('input[type="email"]');
  const phoneInp = form.querySelector('input[type="tel"]');
  const scopeInp = form.querySelector('textarea');
  const fileInput = form.querySelector('input[type="file"]');
  const file = fileInput && fileInput.files ? fileInput.files[0] : null;

  const formData = {
    name: nameInp ? nameInp.value : 'Prospective Client',
    company: compInp ? compInp.value : '',
    email: emailInp ? emailInp.value : '',
    phone: phoneInp ? phoneInp.value : '',
    service: document.title.split(' - ')[0] || 'Inspection Service',
    scope: scopeInp ? scopeInp.value : ''
  };

  const res = await submitInspectionRequest(formData, file, submitBtn);
  if (res.success) {
    form.reset();
  }
};

// ======================================================================================
// 6. ADMIN PORTAL CRUD & AUTH SERVICES
// ======================================================================================
const AesAdmin = {
  async login(email, password) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client not initialized');
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });
    if (error) throw error;
    return data;
  },

  async logout() {
    const client = getSupabaseClient();
    if (client) await client.auth.signOut();
  },

  async getSession() {
    const client = getSupabaseClient();
    if (!client) return null;
    const { data } = await client.auth.getSession();
    return data && data.session ? data.session : null;
  },

  // Inspection Leads
  async getInspectionLeads() {
    const client = getSupabaseClient();
    if (!client) return [];
    const { data, error } = await client
      .from('inspection_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateLeadStatus(id, status) {
    const client = getSupabaseClient();
    if (!client) return;
    const { error } = await client
      .from('inspection_requests')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },

  async deleteLead(id) {
    const client = getSupabaseClient();
    if (!client) return;
    const { error } = await client
      .from('inspection_requests')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Job Openings CMS
  async getAllJobs() {
    const client = getSupabaseClient();
    if (!client) return [];
    const { data, error } = await client
      .from('job_openings')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async saveJob(jobData, id = null) {
    const client = getSupabaseClient();
    if (!client) return;
    if (id) {
      const { error } = await client
        .from('job_openings')
        .update(jobData)
        .eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await client
        .from('job_openings')
        .insert([jobData]);
      if (error) throw error;
    }
  },

  async toggleJobStatus(id, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    return this.saveJob({ status: newStatus }, id);
  },

  async deleteJob(id) {
    const client = getSupabaseClient();
    if (!client) return;
    const { error } = await client
      .from('job_openings')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Job Applications
  async getJobApplications() {
    const client = getSupabaseClient();
    if (!client) return [];
    const { data, error } = await client
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateApplicationStatus(id, status) {
    const client = getSupabaseClient();
    if (!client) return;
    const { error } = await client
      .from('job_applications')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },

  async deleteApplication(id) {
    const client = getSupabaseClient();
    if (!client) return;
    const { error } = await client
      .from('job_applications')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Verified Documents
  async getVerifiedDocuments() {
    const client = getSupabaseClient();
    if (!client) return [];
    const { data, error } = await client
      .from('verified_documents')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async saveDocument(docData, pdfFile = null) {
    const client = getSupabaseClient();
    if (!client) return;
    let docUrl = docData.document_url || null;
    if (pdfFile) {
      docUrl = await uploadToSupabaseStorage('aes-documents', pdfFile, 'reports');
    }
    const payload = { ...docData, document_url: docUrl };

    if (docData.id) {
      const { error } = await client
        .from('verified_documents')
        .update(payload)
        .eq('id', docData.id);
      if (error) throw error;
    } else {
      const { error } = await client
        .from('verified_documents')
        .insert([payload]);
      if (error) throw error;
    }
  },

  async deleteDocument(id) {
    const client = getSupabaseClient();
    if (!client) return;
    const { error } = await client
      .from('verified_documents')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // General Inquiries
  async getGeneralInquiries() {
    const client = getSupabaseClient();
    if (!client) return [];
    const { data, error } = await client
      .from('general_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateInquiryStatus(id, status) {
    const client = getSupabaseClient();
    if (!client) return;
    const { error } = await client
      .from('general_inquiries')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },

  async deleteInquiry(id) {
    const client = getSupabaseClient();
    if (!client) return;
    const { error } = await client
      .from('general_inquiries')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Export to CSV helper
  exportCsv(data, filename = 'export.csv') {
    if (!data || !data.length) {
      showAesToast('No records available to export.', 'info');
      return;
    }
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    for (const row of data) {
      const values = headers.map(header => {
        let val = row[header];
        if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
        const escaped = ('' + (val ?? '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
};

// Expose globally
window.AesSupabase = {
  getSupabaseClient,
  showAesToast,
  uploadToSupabaseStorage,
  submitInspectionRequest,
  fetchActiveJobOpenings,
  submitJobApplication,
  verifyDocumentByReportNo,
  submitManualVerification,
  submitGeneralInquiry,
  admin: AesAdmin
};


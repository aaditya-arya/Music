import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://zbdtidadzgevqpvzxfkr.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZHRpZGFkemdldnFwdnp4ZmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODY5ODMsImV4cCI6MjA4OTU2Mjk4M30.7Q_BqZ5z93zW6iP815p6F78q-44W5R88-s45i9B1q44';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper: Upload a file to Supabase Storage Bucket
export async function uploadToStorage(bucketName, file, folder = 'uploads') {
  if (!file) return null;
  const fileExt = file.name.split('.').pop();
  const cleanBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `${folder}/${Date.now()}_${cleanBaseName}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) {
    console.error(`[Supabase Storage Error (${bucketName})]`, error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrlData?.publicUrl || null;
}

// 1. Submit Inspection Scope Request (From Service Detail Pages or Modal)
export async function submitInspectionRequest(formData, drawingFile = null) {
  let attachmentUrl = null;
  if (drawingFile) {
    attachmentUrl = await uploadToStorage('aes-attachments', drawingFile, 'inspections');
  }

  const { data, error } = await supabase
    .from('inspection_requests')
    .insert([{
      client_name: formData.name,
      company_name: formData.company,
      email: formData.email.trim(),
      phone: formData.phone.replace(/[^0-9]/g, ''),
      service_type: formData.service || 'General Inspection',
      location_and_scope: formData.scope || '',
      preferred_date: formData.preferredDate || null,
      attachment_url: attachmentUrl,
      source_page: formData.sourcePage || 'React App'
    }])
    .select();

  if (error) throw error;
  return data;
}

// 2. Careers: Fetch Active Jobs
export async function fetchActiveJobs() {
  try {
    const { data, error } = await supabase
      .from('job_openings')
      .select('*')
      .eq('status', 'active')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Fetch Jobs Fallback]', err);
    return [];
  }
}

// 3. Careers: Submit Candidate Application
export async function submitJobApplication(formData, resumeFile = null) {
  let resumeUrl = null;
  if (resumeFile) {
    resumeUrl = await uploadToStorage('aes-resumes', resumeFile, 'candidates');
  }

  const { data, error } = await supabase
    .from('job_applications')
    .insert([{
      full_name: formData.fullName,
      email: formData.email.trim(),
      phone: formData.phone.replace(/[^0-9]/g, ''),
      current_location: formData.location || '',
      position_applied: formData.position,
      experience_level: formData.experience,
      certifications: formData.certifications || [],
      notice_period: formData.noticePeriod,
      resume_url: resumeUrl,
      cover_notes: formData.notes || '',
      status: 'Received'
    }])
    .select();

  if (error) throw error;
  return data;
}

// 4. Live Document Verification: Lookup by Report Number
export async function verifyDocumentByReportNo(reportNo) {
  const cleanNo = (reportNo || '').trim();
  if (!cleanNo) return { success: false, error: 'Please enter a report number.' };

  const { data, error } = await supabase
    .from('verified_documents')
    .select('*')
    .ilike('report_no', cleanNo)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { success: false, notFound: true, reportNo: cleanNo };
  return { success: true, document: data };
}

// 5. Submit Manual Document Verification Request
export async function submitManualVerificationRequest(formData, docFile = null) {
  let fileUrl = null;
  if (docFile) {
    fileUrl = await uploadToStorage('aes-documents', docFile, 'verification_requests');
  }

  const { data, error } = await supabase
    .from('general_inquiries')
    .insert([{
      full_name: formData.name,
      phone: formData.phone.replace(/[^0-9]/g, ''),
      email: formData.email ? formData.email.trim() : '',
      company_name: formData.company || '',
      inquiry_type: 'Document Verification',
      message: `Report/Certificate ID: ${formData.reportNo || 'N/A'}\nNotes: ${formData.notes || ''}\nAttachment: ${fileUrl || 'None'}`,
      source_page: 'VerifyDocModal',
      status: 'New'
    }])
    .select();

  if (error) throw error;
  return data;
}

// 6. General Inquiries & Adaptive Support (We Hear You)
export async function submitGeneralInquiry(formData) {
  const { data, error } = await supabase
    .from('general_inquiries')
    .insert([{
      full_name: formData.name,
      email: formData.email.trim(),
      phone: formData.phone.replace(/[^0-9]/g, ''),
      company_name: formData.company || '',
      inquiry_type: formData.inquiryType || 'General Inquiry',
      message: formData.message || '',
      source_page: formData.sourcePage || 'we-hear-you',
      status: 'New'
    }])
    .select();

  if (error) throw error;
  return data;
}

// 7. Admin Portal API Suite
export const adminApi = {
  // Leads
  async getLeads() {
    const { data, error } = await supabase
      .from('inspection_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateLeadStatus(id, status) {
    const { error } = await supabase
      .from('inspection_requests')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },

  async deleteLead(id) {
    const { error } = await supabase
      .from('inspection_requests')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Jobs CMS
  async getAllJobs() {
    const { data, error } = await supabase
      .from('job_openings')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async saveJob(jobData) {
    if (jobData.id) {
      const { error } = await supabase
        .from('job_openings')
        .update({
          title: jobData.title,
          category: jobData.category,
          location: jobData.location,
          employment_type: jobData.employment_type,
          experience_years: jobData.experience_years,
          certifications_required: jobData.certifications_required,
          description: jobData.description,
          status: jobData.status,
          display_order: jobData.display_order
        })
        .eq('id', jobData.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('job_openings')
        .insert([jobData]);
      if (error) throw error;
    }
  },

  async toggleJobStatus(id, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    const { error } = await supabase
      .from('job_openings')
      .update({ status: newStatus })
      .eq('id', id);
    if (error) throw error;
    return newStatus;
  },

  async deleteJob(id) {
    const { error } = await supabase
      .from('job_openings')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Job Applications
  async getApplications() {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateApplicationStatus(id, status) {
    const { error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },

  async deleteApplication(id) {
    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Verified Documents CMS
  async getDocuments() {
    const { data, error } = await supabase
      .from('verified_documents')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async saveDocument(docData, pdfFile = null) {
    let docUrl = docData.document_url || null;
    if (pdfFile) {
      docUrl = await uploadToStorage('aes-documents', pdfFile, 'reports');
    }
    const payload = { ...docData, document_url: docUrl };

    if (docData.id) {
      const { error } = await supabase
        .from('verified_documents')
        .update(payload)
        .eq('id', docData.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('verified_documents')
        .insert([payload]);
      if (error) throw error;
    }
  },

  async deleteDocument(id) {
    const { error } = await supabase
      .from('verified_documents')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Inquiries Desk
  async getInquiries() {
    const { data, error } = await supabase
      .from('general_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateInquiryStatus(id, status) {
    const { error } = await supabase
      .from('general_inquiries')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },

  async deleteInquiry(id) {
    const { error } = await supabase
      .from('general_inquiries')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // CSV Exporter
  exportToCsv(data, filename = 'export.csv') {
    if (!data || !data.length) return false;
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
    return true;
  }
};

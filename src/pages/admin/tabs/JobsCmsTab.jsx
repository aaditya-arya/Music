import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, MapPin, Briefcase, Award, Loader2 } from 'lucide-react';
import { adminApi } from '../../../lib/supabase';
import { useToast } from '../../../context/ToastContext';

export default function JobsCmsTab({ jobs, onRefresh }) {
  const { addToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Third Party Inspection');
  const [location, setLocation] = useState('Vadodara / Gujarat Corridors');
  const [employmentType, setEmploymentType] = useState('Full Time');
  const [experience, setExperience] = useState('5-8 Years');
  const [certifications, setCertifications] = useState('ASNT Level II, API 510');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');

  const openAddModal = () => {
    setEditingJob(null);
    setTitle('');
    setCategory('Third Party Inspection');
    setLocation('Vadodara / Gujarat Corridors');
    setEmploymentType('Full Time');
    setExperience('5-8 Years');
    setCertifications('ASNT Level II, API 510');
    setDescription('');
    setStatus('active');
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setTitle(job.title);
    setCategory(job.category || 'Third Party Inspection');
    setLocation(job.location || 'Vadodara');
    setEmploymentType(job.employment_type || 'Full Time');
    setExperience(job.experience_years || '5-8 Years');
    setCertifications(Array.isArray(job.certifications_required) ? job.certifications_required.join(', ') : (job.certifications_required || ''));
    setDescription(job.description || '');
    setStatus(job.status || 'active');
    setModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    setSaving(true);
    const certsArray = certifications.split(',').map(c => c.trim()).filter(Boolean);

    try {
      await adminApi.saveJob({
        id: editingJob?.id,
        title,
        category,
        location,
        employment_type: employmentType,
        experience_years: experience,
        certifications_required: certsArray,
        description,
        status,
        display_order: editingJob?.display_order || 0
      });

      addToast(`Job opening "<strong>${title}</strong>" saved successfully!`, 'success');
      setModalOpen(false);
      onRefresh();
    } catch (err) {
      addToast(`Save error: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (job) => {
    try {
      const newStatus = await adminApi.toggleJobStatus(job.id, job.status);
      addToast(`Job status changed to "<strong>${newStatus}</strong>".`, 'info');
      onRefresh();
    } catch (err) {
      addToast(`Status toggle error: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete the job posting for "${title}"?`)) return;
    try {
      await adminApi.deleteJob(id);
      addToast('Job posting deleted.', 'info');
      onRefresh();
    } catch (err) {
      addToast(`Delete error: ${err.message}`, 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">
            Careers &amp; Job Postings CMS
          </h1>
          <p className="text-xs text-slate-500">
            Publish new job openings, edit requirements, or close vacancies dynamically across careers.html.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-orange-700 text-white text-xs font-extrabold shadow-lg transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs col-span-full bg-white rounded-2xl border border-slate-200">
            No job postings created yet. Click "Post New Job" above.
          </div>
        ) : (
          jobs.map(job => (
            <div
              key={job.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                job.status === 'active' ? 'border-slate-200' : 'border-slate-200/60 opacity-60 bg-slate-50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {job.category || 'Inspection'}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(job)}
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full cursor-pointer flex items-center gap-1 ${
                      job.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {job.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span className="capitalize">{job.status}</span>
                  </button>
                </div>

                <h3 className="text-base font-bold text-brand-dark leading-snug">
                  {job.title}
                </h3>

                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-brand-blue" />
                    <span>{job.employment_type} &bull; {job.experience_years}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(job)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-orange transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => handleDelete(job.id, job.title)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                  title="Delete Job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Job Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-blur">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-200 p-6 space-y-4 text-xs animate-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-brand-dark">
                {editingJob ? 'Edit Job Opening' : 'Post New Engineering Position'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Position Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Welding Inspector (CSWIP 3.1)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                  >
                    <option>Third Party Inspection</option>
                    <option>Welding Engineering</option>
                    <option>NDT Inspection Services</option>
                    <option>Tank Inspection</option>
                    <option>QA/QC Management</option>
                    <option>Vendor Assessment</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Employment Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                  >
                    <option>Full Time</option>
                    <option>Contract / Project-Based</option>
                    <option>Freelance Consultant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Location / Base *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Vadodara / Pan-India"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Experience Required *
                  </label>
                  <input
                    type="text"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 5-8 Years"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Certifications Required (Comma-Separated)
                </label>
                <input
                  type="text"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  placeholder="e.g. CSWIP 3.1, ASNT Level II (UT/RT), API 510"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Job Description &amp; Scope Responsibilities *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail key inspection tasks, hold-point witnessing, code familiarities, and reporting requirements..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Posting Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-bold"
                >
                  <option value="active">Active (Visible on careers.html)</option>
                  <option value="closed">Closed / Inactive</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-premium-orange text-white font-bold px-6 py-2 rounded-lg flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingJob ? 'Save Changes' : 'Publish Job'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

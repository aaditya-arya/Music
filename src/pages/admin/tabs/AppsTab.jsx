import React, { useState } from 'react';
import { Download, Search, Trash2, ExternalLink, RefreshCw, FileText, UserCheck } from 'lucide-react';
import { adminApi } from '../../../lib/supabase';
import { useToast } from '../../../context/ToastContext';

export default function AppsTab({ applications, onRefresh }) {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      (app.full_name || '').toLowerCase().includes(term) ||
      (app.position_applied || '').toLowerCase().includes(term) ||
      (app.email || '').toLowerCase().includes(term) ||
      (app.phone || '').includes(term) ||
      (app.current_location || '').toLowerCase().includes(term)
    );
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminApi.updateApplicationStatus(id, newStatus);
      addToast(`Candidate status updated to "<strong>${newStatus}</strong>".`, 'success');
      onRefresh();
    } catch (err) {
      addToast(`Status update error: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete application from "${name}"?`)) return;
    try {
      await adminApi.deleteApplication(id);
      addToast('Application deleted.', 'info');
      onRefresh();
    } catch (err) {
      addToast(`Delete error: ${err.message}`, 'error');
    }
  };

  const handleExportCsv = () => {
    const success = adminApi.exportToCsv(filteredApps, `AES_Candidate_Applications_${Date.now()}.csv`);
    if (success) addToast('Applications exported to CSV.', 'success');
    else addToast('No records to export.', 'warning');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">
            Candidate Applications &amp; Resumes
          </h1>
          <p className="text-xs text-slate-500">
            Profiles submitted via careers.html direct application portal.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Roster</span>
          </button>
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-brand-blue shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate, role, phone, location..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-brand-orange"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-brand-orange"
        >
          <option value="ALL">All Statuses</option>
          <option value="Received">Received</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Hired">Hired</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold">
              <tr>
                <th className="p-4">Applied Date</th>
                <th className="p-4">Candidate Name</th>
                <th className="p-4">Position &amp; Exp</th>
                <th className="p-4">Certifications</th>
                <th className="p-4">Notice Period</th>
                <th className="p-4">Resume</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    No candidate applications found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{app.full_name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{app.phone} &bull; {app.current_location || 'India'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-brand-blue">{app.position_applied}</div>
                      <div className="text-[11px] text-slate-500">{app.experience_level}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(Array.isArray(app.certifications) ? app.certifications : [app.certifications]).map((c, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 text-[11px]">
                      {app.notice_period || 'Immediate'}
                    </td>
                    <td className="p-4">
                      {app.resume_url ? (
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-brand-orange hover:text-brand-blue font-bold"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>PDF Resume</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No File</span>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={app.status || 'Received'}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none ${
                          app.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          app.status === 'Interviewing' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          app.status === 'Hired' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                          app.status === 'Rejected' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="Received">Received</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(app.id, app.full_name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Delete Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { Download, Search, Trash2, ExternalLink, RefreshCw, Eye } from 'lucide-react';
import { adminApi } from '../../../lib/supabase';
import { useToast } from '../../../context/ToastContext';

export default function LeadsTab({ leads, onRefresh }) {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState(null);

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      (lead.client_name || '').toLowerCase().includes(term) ||
      (lead.company_name || '').toLowerCase().includes(term) ||
      (lead.email || '').toLowerCase().includes(term) ||
      (lead.phone || '').includes(term) ||
      (lead.service_type || '').toLowerCase().includes(term)
    );
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminApi.updateLeadStatus(id, newStatus);
      addToast(`Lead status updated to "<strong>${newStatus}</strong>".`, 'success');
      onRefresh();
    } catch (err) {
      addToast(`Status update error: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete lead from "${name}"?`)) return;
    try {
      await adminApi.deleteLead(id);
      addToast('Inspection lead deleted.', 'info');
      onRefresh();
    } catch (err) {
      addToast(`Delete error: ${err.message}`, 'error');
    }
  };

  const handleExportCsv = () => {
    const success = adminApi.exportToCsv(filteredLeads, `AES_Inspection_Leads_${Date.now()}.csv`);
    if (success) addToast('Inspection leads exported to CSV.', 'success');
    else addToast('No records to export.', 'warning');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">
            Inspection Leads &amp; Scope RFQs
          </h1>
          <p className="text-xs text-slate-500">
            Submissions received from all 16 technical service scope pages and modals.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-brand-blue shadow-xs cursor-pointer"
            aria-label="Refresh leads"
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
            placeholder="Search client, company, phone, email, service..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-brand-orange"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-brand-orange"
        >
          <option value="ALL">All Statuses</option>
          <option value="New">New</option>
          <option value="Under Review">Under Review</option>
          <option value="Contacted">Contacted</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Client / Company</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Service Type</th>
                <th className="p-4">Attachment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No inspection leads found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {new Date(lead.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{lead.client_name}</div>
                      <div className="text-[11px] text-slate-500">{lead.company_name}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-900 font-mono">{lead.phone}</div>
                      <div className="text-[11px] text-slate-500">{lead.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-brand-blue">{lead.service_type}</span>
                    </td>
                    <td className="p-4">
                      {lead.attachment_url ? (
                        <a
                          href={lead.attachment_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-brand-orange hover:text-brand-blue font-bold"
                        >
                          <span>Drawing PDF</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No File</span>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={lead.status || 'New'}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none ${
                          lead.status === 'New' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          lead.status === 'Under Review' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          lead.status === 'Contacted' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                          'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-1.5 text-slate-400 hover:text-brand-blue rounded-lg hover:bg-slate-100"
                          title="View Full Scope"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id, lead.client_name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-blur">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 text-xs animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-brand-dark">Inspection Lead Details</h3>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-800 text-xl font-bold">
                &times;
              </button>
            </div>
            
            <div className="space-y-2.5">
              <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Client Name:</span> <strong className="text-slate-800">{selectedLead.client_name} ({selectedLead.company_name})</strong></div>
              <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Contact:</span> <span className="font-mono">{selectedLead.phone}</span> &bull; {selectedLead.email}</div>
              <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Service:</span> <strong className="text-brand-blue">{selectedLead.service_type}</strong></div>
              <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Preferred Date:</span> {selectedLead.preferred_date || 'Not specified'}</div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Scope / Notes:</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed mt-1">
                  {selectedLead.location_and_scope || 'No scope details provided.'}
                </p>
              </div>
              {selectedLead.attachment_url && (
                <div className="pt-2">
                  <a href={selectedLead.attachment_url} target="_blank" rel="noreferrer" className="btn-premium-orange text-white font-bold py-2 px-4 rounded-lg inline-flex items-center gap-1.5 text-xs">
                    <Download className="w-4 h-4" /> Download Attached RFQ Drawing
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

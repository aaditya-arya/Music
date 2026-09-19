import React, { useState } from 'react';
import { Download, Search, Trash2, RefreshCw, MessageSquare, Eye } from 'lucide-react';
import { adminApi } from '../../../lib/supabase';
import { useToast } from '../../../context/ToastContext';

export default function InquiriesTab({ inquiries, onRefresh }) {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const filteredInquiries = inquiries.filter(inq => {
    const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      (inq.full_name || '').toLowerCase().includes(term) ||
      (inq.company_name || '').toLowerCase().includes(term) ||
      (inq.email || '').toLowerCase().includes(term) ||
      (inq.phone || '').includes(term) ||
      (inq.inquiry_type || '').toLowerCase().includes(term) ||
      (inq.message || '').toLowerCase().includes(term)
    );
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminApi.updateInquiryStatus(id, newStatus);
      addToast(`Inquiry status updated to "<strong>${newStatus}</strong>".`, 'success');
      onRefresh();
    } catch (err) {
      addToast(`Status update error: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete inquiry from "${name}"?`)) return;
    try {
      await adminApi.deleteInquiry(id);
      addToast('Inquiry deleted.', 'info');
      onRefresh();
    } catch (err) {
      addToast(`Delete error: ${err.message}`, 'error');
    }
  };

  const handleExportCsv = () => {
    const success = adminApi.exportToCsv(filteredInquiries, `AES_General_Inquiries_${Date.now()}.csv`);
    if (success) addToast('Inquiries exported to CSV.', 'success');
    else addToast('No records to export.', 'warning');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">
            General Inquiries &amp; Support Desk
          </h1>
          <p className="text-xs text-slate-500">
            Messages, client feedback, and training requests routed from we-hear-you.html.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Inquiries</span>
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
            placeholder="Search name, company, email, inquiry type..."
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
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Sender / Organization</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Inquiry Category</th>
                <th className="p-4">Message Snippet</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No inquiries found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map(inq => (
                  <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {new Date(inq.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{inq.full_name}</div>
                      <div className="text-[11px] text-slate-500">{inq.company_name || 'Individual'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-900 font-mono">{inq.phone}</div>
                      <div className="text-[11px] text-slate-500">{inq.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-brand-orange">{inq.inquiry_type}</span>
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-600 text-[11px]">
                      {inq.message}
                    </td>
                    <td className="p-4">
                      <select
                        value={inq.status || 'New'}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none ${
                          inq.status === 'New' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          inq.status === 'In Progress' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="p-1.5 text-slate-400 hover:text-brand-blue rounded-lg hover:bg-slate-100 cursor-pointer"
                          title="View Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(inq.id, inq.full_name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="Delete Inquiry"
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

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-blur">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 text-xs animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-brand-dark">Technical Inquiry Message</h3>
              <button onClick={() => setSelectedInquiry(null)} className="text-slate-400 hover:text-slate-800 text-xl font-bold">
                &times;
              </button>
            </div>
            
            <div className="space-y-2.5">
              <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Sender:</span> <strong className="text-slate-800">{selectedInquiry.full_name} ({selectedInquiry.company_name || 'N/A'})</strong></div>
              <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Contact:</span> <span className="font-mono">{selectedInquiry.phone}</span> &bull; {selectedInquiry.email}</div>
              <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Category:</span> <strong className="text-brand-orange">{selectedInquiry.inquiry_type}</strong></div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Full Message:</span>
                <pre className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-sans whitespace-pre-wrap leading-relaxed mt-1 text-xs">
                  {selectedInquiry.message}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

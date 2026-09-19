import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink, RefreshCw, ShieldCheck, Upload, Loader2, Download } from 'lucide-react';
import { adminApi } from '../../../lib/supabase';
import { useToast } from '../../../context/ToastContext';

export default function DocumentsTab({ documents, onRefresh }) {
  const { addToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [reportNo, setReportNo] = useState('');
  const [clientName, setClientName] = useState('');
  const [equipment, setEquipment] = useState('');
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('Passed / Verified');
  const [pdfFile, setPdfFile] = useState(null);

  const openAddModal = () => {
    setReportNo('');
    setClientName('');
    setEquipment('');
    setInspectionDate(new Date().toISOString().split('T')[0]);
    setStatus('Passed / Verified');
    setPdfFile(null);
    setModalOpen(true);
  };

  const handleSaveDocument = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await adminApi.saveDocument({
        report_no: reportNo.trim(),
        client_name: clientName,
        equipment_description: equipment,
        inspection_date: inspectionDate,
        status
      }, pdfFile);

      addToast(`Certificate <strong>${reportNo}</strong> registered in online registry!`, 'success');
      setModalOpen(false);
      onRefresh();
    } catch (err) {
      addToast(`Registration error: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, no) => {
    if (!window.confirm(`Are you sure you want to delete certificate record for "${no}"?`)) return;
    try {
      await adminApi.deleteDocument(id);
      addToast('Certificate record deleted.', 'info');
      onRefresh();
    } catch (err) {
      addToast(`Delete error: ${err.message}`, 'error');
    }
  };

  const handleExportCsv = () => {
    const success = adminApi.exportToCsv(documents, `AES_Verified_Documents_${Date.now()}.csv`);
    if (success) addToast('Verified documents exported to CSV.', 'success');
    else addToast('No records to export.', 'warning');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">
            Verify Documents &amp; Certificates CMS
          </h1>
          <p className="text-xs text-slate-500">
            Register inspection release notes (IRN) and upload certificate PDFs for live client verification.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Registry</span>
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-blue hover:bg-brand-dark text-white text-xs font-extrabold shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Certificate</span>
          </button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold">
              <tr>
                <th className="p-4">Report Number</th>
                <th className="p-4">Client / Project</th>
                <th className="p-4">Equipment / Scope</th>
                <th className="p-4">Inspection Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Certificate File</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No verified certificates registered yet.
                  </td>
                </tr>
              ) : (
                documents.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <strong className="font-mono text-brand-dark">{doc.report_no}</strong>
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      {doc.client_name || 'N/A'}
                    </td>
                    <td className="p-4 text-slate-600">
                      {doc.equipment_description || 'N/A'}
                    </td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {doc.inspection_date || 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {doc.status || 'Verified'}
                      </span>
                    </td>
                    <td className="p-4">
                      {doc.document_url ? (
                        <a
                          href={doc.document_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-brand-orange hover:text-brand-blue font-bold"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>PDF Document</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No File Uploaded</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(doc.id, doc.report_no)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Delete Record"
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

      {/* Register Certificate Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-blur">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-200 p-6 space-y-4 text-xs animate-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-brand-dark flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Register Official Inspection Certificate</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Report / Certificate Number (Exact Key) *
                </label>
                <input
                  type="text"
                  required
                  value={reportNo}
                  onChange={(e) => setReportNo(e.target.value)}
                  placeholder="e.g. AES/IRN/2026/8941"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Client / Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. L&T Hydrocarbon Engineering"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Equipment / Scope Description *
                </label>
                <input
                  type="text"
                  required
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  placeholder="e.g. Cryogenic Pressure Vessel (Tag: V-104) ASME Sec VIII"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Inspection Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Verification Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-bold"
                  >
                    <option>Passed / Verified</option>
                    <option>Compliant</option>
                    <option>Conditionally Cleared</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Upload Official Certificate PDF
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-brand-orange bg-slate-50 rounded-xl p-3 text-center transition-colors cursor-pointer relative group">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setPdfFile(e.target.files[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center justify-center space-y-0.5">
                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-brand-orange transition-colors" />
                    <p className="text-xs font-semibold text-slate-700">
                      {pdfFile ? pdfFile.name : 'Click to Upload Official Stamped Certificate PDF'}
                    </p>
                    <p className="text-[10px] text-slate-400">PDF up to 25MB</p>
                  </div>
                </div>
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
                  <span>Save in Registry</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

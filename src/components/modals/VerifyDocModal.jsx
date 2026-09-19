import React, { useState } from 'react';
import { X, Search, CheckCircle2, AlertTriangle, FileText, Download, Upload, ShieldCheck, Loader2 } from 'lucide-react';
import { verifyDocumentByReportNo, submitManualVerificationRequest } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';

export default function VerifyDocModal({ isOpen, onClose }) {
  const { addToast } = useToast();
  const [searchReportNo, setSearchReportNo] = useState('');
  const [searching, setSearching] = useState(false);
  const [verifiedDoc, setVerifiedDoc] = useState(null);
  const [notFoundState, setNotFoundState] = useState(false);
  const [queriedNo, setQueriedNo] = useState('');

  // Manual fallback form state
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualReportNo, setManualReportNo] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [manualFile, setManualFile] = useState(null);
  const [submittingManual, setSubmittingManual] = useState(false);

  if (!isOpen) return null;

  const handleOnlineLookup = async (e) => {
    e.preventDefault();
    const cleanNo = searchReportNo.trim();
    if (!cleanNo) {
      addToast('Please enter a Report or Certificate number to verify.', 'warning');
      return;
    }

    setSearching(true);
    setVerifiedDoc(null);
    setNotFoundState(false);
    setQueriedNo(cleanNo);

    try {
      const res = await verifyDocumentByReportNo(cleanNo);
      if (res.success && res.document) {
        setVerifiedDoc(res.document);
      } else {
        setNotFoundState(true);
        setManualReportNo(cleanNo);
      }
    } catch (err) {
      addToast(`Verification lookup failed: ${err.message}`, 'error');
    } finally {
      setSearching(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const phoneClean = manualPhone.replace(/[^0-9]/g, '');
    if (phoneClean.length !== 10) {
      addToast('Please enter an exact 10-digit mobile number.', 'error');
      return;
    }

    setSubmittingManual(true);
    try {
      await submitManualVerificationRequest({
        name: manualName,
        phone: phoneClean,
        reportNo: manualReportNo || searchReportNo,
        notes: manualNotes
      }, manualFile);

      addToast(`Verification request for <strong>${manualReportNo || 'document'}</strong> submitted! Our QA cell will authenticate and respond shortly.`, 'success');
      // Reset and close
      setManualName('');
      setManualPhone('');
      setManualReportNo('');
      setManualNotes('');
      setManualFile(null);
      onClose();
    } catch (err) {
      addToast(`Submission error: ${err.message}`, 'error');
    } finally {
      setSubmittingManual(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-blur animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-200">
        
        {/* Header */}
        <div className="bg-brand-navy text-white px-6 py-4 rounded-t-2xl flex justify-between items-center border-b border-white/10 sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h3 className="text-base sm:text-lg font-bold">Verify AES Documents &amp; Certificates</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-bold p-1 leading-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <p className="text-slate-600 text-xs leading-relaxed border-b border-slate-100 pb-3">
            Authenticate AES inspection release notes (IRN), test certificates, or audit reports directly with our central QA records.
          </p>

          {/* Quick Live Search */}
          <form onSubmit={handleOnlineLookup} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Instant Online Verification
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchReportNo}
                  onChange={(e) => setSearchReportNo(e.target.value)}
                  placeholder="e.g. AES/IRN/2026/8941"
                  className="w-full bg-white border border-slate-300 rounded-lg pl-3 pr-3 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-mono font-bold"
                />
              </div>
              <button
                type="submit"
                disabled={searching}
                className="btn-premium-orange text-white font-bold px-4 py-2 rounded-lg text-xs tracking-wider shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Verify</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Enter the full report reference code printed on the inspection certificate.
            </p>
          </form>

          {/* Verification Result Area */}
          {verifiedDoc && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 inline" />
                  Officially Authenticated &amp; Valid
                </span>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  {verifiedDoc.status || 'Passed'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Report No:</span>
                  <strong className="font-mono text-slate-800">{verifiedDoc.report_no}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Client / Project:</span>
                  <strong className="text-slate-800">{verifiedDoc.client_name || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Equipment / Scope:</span>
                  <strong className="text-slate-800">{verifiedDoc.equipment_description || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Inspection Date:</span>
                  <strong className="text-slate-800">{verifiedDoc.inspection_date || 'N/A'}</strong>
                </div>
              </div>

              {verifiedDoc.document_url && (
                <div className="pt-2 border-t border-emerald-200">
                  <a
                    href={verifiedDoc.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Authenticated Certificate PDF
                  </a>
                </div>
              )}
            </div>
          )}

          {notFoundState && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1 animate-in zoom-in-95 duration-200">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 inline" />
                No Instant Digital Record Found
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                No instant record matched <strong>"{queriedNo}"</strong>. Documents issued prior to 2024 or undergoing manual archival can be verified below.
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400">
              or Submit for Manual QA Review
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Manual Submission Form */}
          <form onSubmit={handleManualSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="e.g. Ramesh Chandra"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact No (10-Digit Mobile / WhatsApp) *
              </label>
              <input
                type="tel"
                pattern="[0-9]{10}"
                minLength={10}
                maxLength={10}
                inputMode="numeric"
                required
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                placeholder="e.g. 9876543210 (10 digits)"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Report No / Certificate ID (If known)
              </label>
              <input
                type="text"
                value={manualReportNo}
                onChange={(e) => setManualReportNo(e.target.value)}
                placeholder="e.g. AES/IRN/2026/8941"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Attachment (Document PDF / Scan / Photo)
              </label>
              <div className="border-2 border-dashed border-slate-300 hover:border-brand-orange bg-slate-50 rounded-xl p-3 text-center transition-colors cursor-pointer relative group">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                  onChange={(e) => setManualFile(e.target.files[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center space-y-0.5">
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-brand-orange transition-colors" />
                  <p className="text-xs font-semibold text-slate-700">
                    {manualFile ? manualFile.name : 'Click or Drag & Drop Document File'}
                  </p>
                  <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 25MB</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={manualNotes}
                onChange={(e) => setManualNotes(e.target.value)}
                placeholder="Specific vendor name, PO number, or verification instructions..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={submittingManual}
                className="w-full btn-premium-blue text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submittingManual && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Submit for Manual QA Verification</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

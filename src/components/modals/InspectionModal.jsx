import React, { useState } from 'react';
import { X, Upload, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { submitInspectionRequest } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';

export default function InspectionModal({ isOpen, onClose, defaultService = 'Third Party Inspection (TPI)' }) {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(defaultService);
  const [preferredDate, setPreferredDate] = useState('');
  const [scope, setScope] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneClean = phone.replace(/[^0-9]/g, '');
    if (phoneClean.length !== 10) {
      addToast('Please enter an exact 10-digit mobile number.', 'error');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email.trim())) {
      addToast('Please enter a valid work email address.', 'error');
      return;
    }

    setLoading(true);
    try {
      await submitInspectionRequest({
        name,
        company,
        email: email.trim(),
        phone: phoneClean,
        service,
        preferredDate: preferredDate || null,
        scope,
        sourcePage: 'InspectionModal'
      }, file);

      addToast(`Thank you, <strong>${name}</strong>! Your inspection request has been logged. Our technical desk will contact you within 2 to 4 hours.`, 'success');
      // Reset
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setScope('');
      setFile(null);
      onClose();
    } catch (err) {
      addToast(`Submission error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-blur animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-200">
        
        {/* Header */}
        <div className="bg-brand-navy text-white px-6 py-4 rounded-t-2xl flex justify-between items-center border-b border-white/10 sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-orange"></span>
            <h3 className="text-base sm:text-lg font-bold">Request Inspection Scope / RFQ</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-bold p-1 leading-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <p className="text-slate-600 text-xs leading-relaxed border-b border-slate-100 pb-3">
            Deploy senior ASNT/CSWIP/API certified inspectors to your vendor shop floor or site across India &amp; overseas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Patel"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company / Organization *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. L&T Hydrocarbon"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Work Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number (10 Digits) *
              </label>
              <input
                type="tel"
                pattern="[0-9]{10}"
                minLength={10}
                maxLength={10}
                inputMode="numeric"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                placeholder="e.g. 9876543210 (10 digits)"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Inspection Service *
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-medium"
              >
                <option>Third Party Inspection (TPI)</option>
                <option>Vendor Assessment & Audits</option>
                <option>QA/QC Documentation & MRB</option>
                <option>Pre-Shipment Inspection (PSI)</option>
                <option>Welding Engineering & WPS/PQR</option>
                <option>NDT Inspection (UT/RT/MPT/DPT)</option>
                <option>Expediting & Production Tracking</option>
                <option>Design Examination & Calculations</option>
                <option>Project & Plant Shutdown QA</option>
                <option>International Sourcing QA</option>
                <option>Performance & Hydrostatic Testing</option>
                <option>Process & Coating Qualification</option>
                <option>API 650/653 Tank Inspection</option>
                <option>Owner's Engineer Oversight</option>
                <option>Process Piping (ASME B31.3)</option>
                <option>Corporate QA/QC Training</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Preferred Inspection Date
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Inspection Scope &amp; Vendor Location Details *
            </label>
            <textarea
              rows={3}
              required
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="Specify equipment type, vendor city/country, fabrication stages, hold points, or drawing references..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Attach QAP / Drawing / PO Specification (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-brand-orange bg-slate-50 rounded-xl p-3 text-center transition-colors cursor-pointer relative group">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.dwg,.jpg,.jpeg,.png,.zip"
                onChange={(e) => setFile(e.target.files[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center space-y-0.5">
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-brand-orange transition-colors" />
                <p className="text-xs font-semibold text-slate-700">
                  {file ? file.name : 'Click or Drag & Drop Drawings or QAP'}
                </p>
                <p className="text-[10px] text-slate-400">PDF, DWG, DOCX, ZIP up to 25MB</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-premium-orange w-full text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Submit Inspection Scope</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

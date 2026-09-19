import React, { useState } from 'react';
import { X, GraduationCap, Loader2, CheckCircle2 } from 'lucide-react';
import { submitGeneralInquiry } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';

export default function TrainingModal({ isOpen, onClose }) {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('ASNT Level II - NDT Certification (UT/RT/MPT/DPT)');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneClean = phone.replace(/[^0-9]/g, '');
    if (phoneClean.length !== 10) {
      addToast('Please enter an exact 10-digit phone number.', 'error');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email.trim())) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);
    try {
      await submitGeneralInquiry({
        name,
        company,
        email: email.trim(),
        phone: phoneClean,
        inquiryType: 'Corporate Technical Training',
        message: `Training Course Registration: ${course}`,
        sourcePage: 'training-modal'
      });

      addToast(`Thank you, <strong>${name}</strong>! Your registration for <em>${course}</em> has been submitted. Our training coordinator will contact you shortly.`, 'success');
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      onClose();
    } catch (err) {
      addToast(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-brand-navy/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 text-slate-800">
        
        {/* Header */}
        <div className="bg-brand-navy p-6 text-white flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <GraduationCap className="w-6 h-6 text-brand-orange" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Corporate Training Registration</h3>
              <p className="text-xs text-slate-300 mt-0.5">ASNT Level II, Welding &amp; QA/QC Courses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
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
              placeholder="Company Name"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Work Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number (10 Digits) *
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
                placeholder="e.g. 9876543210"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Course Desired *
            </label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-medium"
            >
              <option>ASNT Level II - NDT Certification (UT/RT/MPT/DPT)</option>
              <option>Welding Inspection &amp; WPS/PQR Course</option>
              <option>ISO 9001:2015 &amp; ISO 17020 Quality Auditing</option>
              <option>ASME Boiler &amp; Pressure Vessel Code Workshop</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue hover:bg-brand-dark text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Register for Training</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

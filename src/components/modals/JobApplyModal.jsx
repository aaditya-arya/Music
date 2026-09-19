import React, { useState } from 'react';
import { X, Upload, Send, Loader2, Award } from 'lucide-react';
import { submitJobApplication } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';

export default function JobApplyModal({ isOpen, onClose, selectedJob = null }) {
  const { addToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [position, setPosition] = useState(selectedJob ? selectedJob.title : 'Senior TPI Mechanical Inspector');
  const [experience, setExperience] = useState('5-8 Years');
  const [certifications, setCertifications] = useState([]);
  const [noticePeriod, setNoticePeriod] = useState('Immediate (0-15 Days)');
  const [notes, setNotes] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Update position if selectedJob changes
  React.useEffect(() => {
    if (selectedJob?.title) {
      setPosition(selectedJob.title);
    }
  }, [selectedJob]);

  if (!isOpen) return null;

  const certOptions = [
    'ASNT Level II (UT/RT/MPT/DPT)',
    'ASNT Level III',
    'CSWIP 3.1 / 3.2',
    'AWS CWI / SCWI',
    'API 510 Pressure Vessel',
    'API 570 Piping Inspector',
    'API 653 Aboveground Tank',
    'NACE / BGAS Coating Level 2',
    'ISO 9001 Lead Auditor',
    'B.E. / Diploma Mechanical'
  ];

  const toggleCert = (cert) => {
    setCertifications(prev => 
      prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneClean = phone.replace(/[^0-9]/g, '');
    if (phoneClean.length !== 10) {
      addToast('Please enter an exact 10-digit mobile number.', 'error');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email.trim())) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    if (!resumeFile) {
      addToast('Please upload your updated resume / CV (PDF or DOCX).', 'warning');
      return;
    }

    setLoading(true);
    try {
      await submitJobApplication({
        fullName,
        email: email.trim(),
        phone: phoneClean,
        location,
        position,
        experience,
        certifications,
        noticePeriod,
        notes
      }, resumeFile);

      addToast(`Application received! Thank you, <strong>${fullName}</strong>. Our HR technical screening desk will review your profile.`, 'success');
      // Reset
      setFullName('');
      setEmail('');
      setPhone('');
      setLocation('');
      setCertifications([]);
      setNotes('');
      setResumeFile(null);
      onClose();
    } catch (err) {
      addToast(`Application error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-blur animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-slate-200">
        
        {/* Header */}
        <div className="bg-brand-navy text-white px-6 py-4 rounded-t-2xl flex justify-between items-center border-b border-white/10 sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h3 className="text-base sm:text-lg font-bold">Apply for Engineering Position</h3>
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
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Applied Position</span>
            <div className="text-sm font-bold text-brand-dark">{position}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Anand Sharma"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anand.sharma@example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current City / Base Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Vadodara / Mumbai / Pune"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Total Relevant Experience *
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-medium"
              >
                <option>0-2 Years (Junior / Trainee)</option>
                <option>3-5 Years (Mid-Level Inspector)</option>
                <option>5-8 Years (Senior Surveyor)</option>
                <option>8-12 Years (Lead QA/QC Auditor)</option>
                <option>12+ Years (Principal Expert / Level III)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Notice Period / Availability *
              </label>
              <select
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-medium"
              >
                <option>Immediate (0-15 Days)</option>
                <option>1 Month Notice</option>
                <option>2 Months Notice</option>
                <option>Freelance / Project-Basis Only</option>
              </select>
            </div>
          </div>

          {/* Technical Certifications Multi-Select */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-brand-orange" />
              <span>Technical Qualifications &amp; Certifications (Select All That Apply)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {certOptions.map(cert => (
                <button
                  type="button"
                  key={cert}
                  onClick={() => toggleCert(cert)}
                  className={`p-2 rounded-lg text-[11px] font-medium text-left border transition-all ${
                    certifications.includes(cert)
                      ? 'bg-brand-blue text-white border-brand-blue shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {certifications.includes(cert) ? '✓ ' : '+ '} {cert}
                </button>
              ))}
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Upload Updated Resume (PDF / DOCX) *
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-brand-orange bg-slate-50 rounded-xl p-3 text-center transition-colors cursor-pointer relative group">
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center space-y-0.5">
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-brand-orange transition-colors" />
                <p className="text-xs font-semibold text-slate-700">
                  {resumeFile ? resumeFile.name : 'Click or Drag & Drop Resume File'}
                </p>
                <p className="text-[10px] text-slate-400">PDF, DOC, DOCX up to 15MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Cover Note / Key Project Highlights (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Highlight major EPC clients (L&T, Reliance, Toyo), overseas deployments, or special inspection equipment skills..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-premium-orange w-full text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Submit Application Profile</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

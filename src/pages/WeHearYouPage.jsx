import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Send, Loader2, MessageSquare, FileCheck, Star, Users, Briefcase, GraduationCap, CheckCircle2, Shield } from 'lucide-react';
import { submitGeneralInquiry } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

export default function WeHearYouPage() {
  const { addToast } = useToast();
  const [activeReason, setActiveReason] = useState('inquiry');

  // Form fields
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic extra fields
  const [equipmentType, setEquipmentType] = useState('');
  const [reportNo, setReportNo] = useState('');
  const [rating, setRating] = useState('5 - Exceptional Precision');
  const [empanelmentCategory, setEmpanelmentCategory] = useState('Senior Freelance Surveyor (CSWIP/API)');
  const [trainingCourse, setTrainingCourse] = useState('ASNT Level II NDT Certification (UT/RT/MPT/DPT)');
  const [batchSize, setBatchSize] = useState('Full Corporate Batch (6 to 15 Persons)');

  const reasons = [
    { id: 'inquiry', title: 'General Technical Inquiry', icon: <MessageSquare className="w-4 h-4" />, btnText: 'Submit Technical Inquiry', placeholder: 'Specify equipment type, vendor city/country, fabrication stages, and mobilization requirements...' },
    { id: 'report_update', title: 'Inspection Report / Status Update', icon: <FileCheck className="w-4 h-4" />, btnText: 'Request Report Status', placeholder: 'Provide purchase order number, vendor name, inspection date, and specific query...' },
    { id: 'client_feedback', title: 'Client Feedback & Rating', icon: <Star className="w-4 h-4" />, btnText: 'Submit Quality Feedback', placeholder: 'Share your observations regarding inspector professionalism, report clarity, and responsiveness...' },
    { id: 'doc_verify', title: 'Certificate & Document Verification', icon: <Shield className="w-4 h-4" />, btnText: 'Request Document Authentication', placeholder: 'Provide report reference number, client name, and document date...' },
    { id: 'vendor_reg', title: 'Surveyor & Vendor Empanelment', icon: <Briefcase className="w-4 h-4" />, btnText: 'Apply for Empanelment', placeholder: 'Summarize your certifications (CSWIP/API/ASNT), base location, laboratory testing capabilities, and key clients...' },
    { id: 'training_inquiry', title: 'Corporate Technical Training', icon: <GraduationCap className="w-4 h-4" />, btnText: 'Request Training Proposal', placeholder: 'Describe desired syllabus customization, participant background, on-site vs classroom preference, and tentative dates...' }
  ];

  const currentReasonObj = reasons.find(r => r.id === activeReason) || reasons[0];

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

    // Build full formatted message including dynamic extra fields
    let dynamicDetails = `\n\n[Inquiry Category: ${currentReasonObj.title}]`;
    if (activeReason === 'inquiry' && equipmentType) dynamicDetails += `\nEquipment Type: ${equipmentType}`;
    if (activeReason === 'report_update' && reportNo) dynamicDetails += `\nReferenced Report No: ${reportNo}`;
    if (activeReason === 'client_feedback') dynamicDetails += `\nQuality Rating: ${rating}`;
    if (activeReason === 'vendor_reg') dynamicDetails += `\nEmpanelment Category: ${empanelmentCategory}`;
    if (activeReason === 'training_inquiry') dynamicDetails += `\nCourse: ${trainingCourse}\nBatch Size: ${batchSize}`;

    setLoading(true);
    try {
      await submitGeneralInquiry({
        name,
        company,
        email: email.trim(),
        phone: phoneClean,
        inquiryType: currentReasonObj.title,
        message: message + dynamicDetails,
        sourcePage: 'we-hear-you'
      });

      addToast(`Thank you! Your resolution request for "<strong>${currentReasonObj.title}</strong>" has been received. Our technical desk will contact you within 2 to 4 hours.`, 'success');
      // Reset
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setMessage('');
      setEquipmentType('');
      setReportNo('');
    } catch (err) {
      addToast(`Submission error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="bg-brand-navy text-white py-16 px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-brand-orange font-bold uppercase tracking-wider mb-3">
            <Link to="/" className="text-slate-400 hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span>We Hear You</span>
          </div>

          <span className="inline-block bg-brand-orange/20 text-brand-orange text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-brand-orange/30 mb-3">
            Client Care &bull; Direct Technical Desk &bull; Rapid Resolution
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            We Hear You
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed font-light">
            At Akshar Engineering Services, we listen to your operational challenges, quality observations, and project milestones. Submit your request below for rapid technical resolution.
          </p>
        </div>
      </section>

      {/* 2. ADAPTIVE FORM SECTION */}
      <section className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        <div className="bg-gradient-to-br from-slate-900 via-brand-navy to-brand-blue text-white rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="mb-8 relative z-10">
            <span className="text-xs font-extrabold text-brand-orange uppercase tracking-wider block mb-1">
              Adaptive Technical Hub
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Update, Feedback &amp; Technical Support Desk
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Select your contact reason below to route your request directly to the appropriate technical specialist.
            </p>
          </div>

          {/* Reason Selector Pills */}
          <div className="mb-8 relative z-10">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Select Your Reason for Contact:
            </label>
            <div className="flex flex-wrap gap-2.5">
              {reasons.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setActiveReason(r.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                    activeReason === r.id
                      ? 'bg-brand-orange text-white border-brand-orange shadow-lg shadow-orange-500/30'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border-slate-700'
                  }`}
                >
                  {r.icon}
                  <span>{r.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white text-slate-800 p-6 sm:p-10 rounded-2xl shadow-2xl relative z-10">
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              
              {/* Row 1: Name & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Patel"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange focus:bg-white transition-all text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. L&T Hydrocarbon / ISGEC"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange focus:bg-white transition-all text-xs"
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Work Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange focus:bg-white transition-all text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp Number (10 Digits) *
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange focus:bg-white transition-all text-xs"
                  />
                </div>
              </div>

              {/* DYNAMIC SECTION BASED ON REASON */}
              {activeReason === 'inquiry' && (
                <div className="pt-2 border-t border-slate-100">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Equipment / Industry Discipline
                  </label>
                  <input
                    type="text"
                    value={equipmentType}
                    onChange={(e) => setEquipmentType(e.target.value)}
                    placeholder="e.g. Cryogenic Heat Exchanger, API 650 Tank, ASME B31.3 Piping..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                  />
                </div>
              )}

              {activeReason === 'report_update' && (
                <div className="pt-2 border-t border-slate-100">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Inspection Release Note (IRN) / PO Number
                  </label>
                  <input
                    type="text"
                    value={reportNo}
                    onChange={(e) => setReportNo(e.target.value)}
                    placeholder="e.g. AES/IRN/2026/8941"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange font-mono text-xs font-bold"
                  />
                </div>
              )}

              {activeReason === 'client_feedback' && (
                <div className="pt-2 border-t border-slate-100">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Service Quality Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-medium"
                  >
                    <option>5 - Exceptional Precision &amp; Rapid Turnaround</option>
                    <option>4 - Satisfactory &amp; Code Compliant</option>
                    <option>3 - Neutral / Met Requirements</option>
                    <option>2 - Needs Improvement in Communication</option>
                    <option>1 - Unsatisfactory Experience</option>
                  </select>
                </div>
              )}

              {activeReason === 'vendor_reg' && (
                <div className="pt-2 border-t border-slate-100">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category of Empanelment
                  </label>
                  <select
                    value={empanelmentCategory}
                    onChange={(e) => setEmpanelmentCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-medium"
                  >
                    <option>Senior Freelance Surveyor (CSWIP/API)</option>
                    <option>NABL Accredited Testing Laboratory</option>
                    <option>Specialized NDT Service Agency</option>
                    <option>Overseas Inspection Associate Partner</option>
                  </select>
                </div>
              )}

              {activeReason === 'training_inquiry' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Course Program
                    </label>
                    <select
                      value={trainingCourse}
                      onChange={(e) => setTrainingCourse(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-medium"
                    >
                      <option>ASNT Level II NDT Certification (UT/RT/MPT/DPT)</option>
                      <option>Welding Inspection &amp; WPS/PQR Workshop</option>
                      <option>ASME Pressure Vessel &amp; Piping Codes Masterclass</option>
                      <option>ISO 9001:2015 &amp; ISO 17020 Auditing</option>
                      <option>Industrial Painting &amp; NACE Coating Quality</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Estimated Batch Size
                    </label>
                    <select
                      value={batchSize}
                      onChange={(e) => setBatchSize(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-medium"
                    >
                      <option>Individual (1 Person)</option>
                      <option>Small Corporate Team (2 to 5 Persons)</option>
                      <option>Full Corporate Batch (6 to 15 Persons)</option>
                      <option>Enterprise In-House (15+ Persons)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Detailed Message */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Message / Request Specifics *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={currentReasonObj.placeholder}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange focus:bg-white transition-all text-xs"
                />
              </div>

              {/* Submit Button & SLA Notice */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-premium-orange w-full sm:w-auto text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-lg shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{currentReasonObj.btnText}</span>
                </button>
                <div className="text-[11px] text-slate-500 text-center sm:text-right">
                  Priority Technical Routing &bull; Guaranteed Response within <span className="font-bold text-slate-800">4 Hours</span>
                </div>
              </div>

            </form>
          </div>

        </div>
      </section>

    </div>
  );
}

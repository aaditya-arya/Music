import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Shield, Award, CheckCircle2, Upload, Send, Loader2, FileCheck, ArrowLeft, BookOpen, Clock, Building } from 'lucide-react';
import { getServiceBySlug, servicesData } from '../lib/servicesData';
import { submitInspectionRequest } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const service = getServiceBySlug(slug);

  // Form state
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [scope, setScope] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
        service: service.title,
        preferredDate: preferredDate || null,
        scope,
        sourcePage: `service-${service.slug}`
      }, file);

      addToast(`Thank you, <strong>${name}</strong>! Your inspection scope for <em>${service.title}</em> has been logged. Our technical desk will contact you within 2 to 4 hours.`, 'success');
      // Reset
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setPreferredDate('');
      setScope('');
      setFile(null);
    } catch (err) {
      addToast(`Submission error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="bg-brand-navy text-white py-16 px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="flex items-center gap-2 text-xs text-brand-orange font-bold uppercase tracking-wider mb-4">
            <Link to="/" className="text-slate-400 hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <Link to="/services" className="text-slate-400 hover:text-white">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-brand-orange">{service.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block bg-brand-orange/20 text-brand-orange text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-brand-orange/30">
                {service.badge} &bull; Discipline #{String(service.id).padStart(2, '0')}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {service.title}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                {service.tagline}
              </p>
            </div>

            <div className="lg:col-span-4 hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs space-y-3">
                <div className="font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
                  Technical Service Matrix
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Inspection Protocol:</span>
                  <strong className="text-white">Hold / Witness Point</strong>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Report Turnaround:</span>
                  <strong className="text-emerald-400">Within 24 Hours</strong>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Accreditation:</span>
                  <strong className="text-white">ISO 17020 Aligned</strong>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. MAIN CONTENT & SCOPE REQUEST FORM */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Scope Details, Standards, Methodology */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Overview */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-orange" />
                <span>Technical Scope Overview</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {service.overview}
              </p>
            </div>

            {/* Key Deliverables */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Key Surveillance Deliverables</span>
              </h2>
              <div className="space-y-3">
                {service.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Applicable Standards & Codes */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-blue" />
                <span>Applicable Codes &amp; International Standards</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {service.standards.map((std, idx) => (
                  <div key={idx} className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs font-mono font-bold text-brand-blue flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                    <span>{std}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4-Step Methodology */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-orange" />
                <span>Inspection &amp; Audit Methodology</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.methodology.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <span className="text-xs font-mono font-black text-brand-orange">
                      STAGE {m.step}
                    </span>
                    <h3 className="text-xs font-bold text-brand-dark">{m.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Benefits */}
            <div className="bg-gradient-to-br from-brand-navy to-brand-blue text-white p-8 rounded-3xl shadow-xl space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Why Clients Choose AES for {service.title}</span>
              </h2>
              <div className="space-y-2.5">
                {service.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    <p className="leading-relaxed">{b}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Embedded Interactive Scope Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
              
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-orange block mb-1">
                  Direct Technical RFQ Desk
                </span>
                <h3 className="text-lg font-bold text-brand-dark">
                  Request {service.title} Scope
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Submit vendor details and drawing attachments. Our coordinator will revert within 2 to 4 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
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
                    placeholder="e.g. L&T Hydrocarbon / ISGEC"
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
                      Mobile (10 Digits) *
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
                    Preferred Inspection Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Scope Description &amp; Vendor Location *
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
                    Attach QAP / Drawing (Optional)
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
                        {file ? file.name : 'Click to Upload QAP or Drawings'}
                      </p>
                      <p className="text-[10px] text-slate-400">PDF, DWG, ZIP up to 25MB</p>
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
                    <span>Submit Inspection Request</span>
                  </button>
                </div>
              </form>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

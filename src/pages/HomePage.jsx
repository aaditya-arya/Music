import React, { useState, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Shield, ArrowRight, FileCheck, Play, Pause, Send, Loader2 } from 'lucide-react';
import { servicesData } from '../lib/servicesData';
import { submitInspectionRequest } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import QualityPolicy from '../components/common/QualityPolicy';

export default function HomePage() {
  const { onOpenVerifyDoc } = useOutletContext();
  const { addToast } = useToast();

  // Video playback toggle state
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Quick Technical Inquiry on-page form state
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Third Party Inspection (TPI)');
  const [scope, setScope] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInquirySubmit = async (e) => {
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
        scope,
        sourcePage: 'homepage-inquiry'
      });

      addToast(`Thank you, <strong>${name}</strong>! Your inspection inquiry has been submitted. Our technical dispatch team will respond within 4 hours.`, 'success');
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setScope('');
    } catch (err) {
      addToast(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const sectors = [
    {
      title: 'Oil & Gas Upstream/Downstream',
      desc: 'Offshore platforms, refinery pressure vessels, API 650 storage tanks, and high-pressure subsea piping.',
      image: '/assets/sector_oil_gas.jpg'
    },
    {
      title: 'Refinery & Petrochemical Plants',
      desc: 'Reactors, cryogenic distillation columns, Hastelloy/Titanium heat exchangers, and toxic fluid piping.',
      image: '/assets/sector_refinery.jpg'
    },
    {
      title: 'Thermal & Nuclear Power Plants',
      desc: 'ASME Section I steam boilers, turbine rotors, heat recovery steam generators (HRSG), and piping.',
      image: '/assets/sector_power_plant.jpg'
    },
    {
      title: 'Heavy Engineering & Fabrication',
      desc: 'Structural steel girders, overhead EOT cranes, offshore monopiles, and heavy pressure vessel shells.',
      image: '/assets/sector_heavy_fab.jpg'
    },
    {
      title: 'Renewables & Green Hydrogen',
      desc: 'High-pressure hydrogen storage bullets, wind turbine monopiles, and solar balance-of-plant structures.',
      image: '/assets/sector_renewables.jpg'
    },
    {
      title: 'Civil Infrastructure & Structural',
      desc: 'Pre-engineered buildings (PEB), industrial bridges, metro rail girders, and large architectural steel.',
      image: '/assets/sector_civil_infra.jpg'
    }
  ];

  const clientLogos = [
    { name: 'ISGEC Heavy Engineering', src: '/assets/partner_isgec.png' },
    { name: 'Deneb Energy', src: '/assets/partner_deneb.png' },
    { name: 'Oriano Clean Energy', src: '/assets/partner_oriano.png' },
    { name: 'Oswal Industries', src: '/assets/partner_oswal.png' },
    { name: 'Foursquare', src: '/assets/partner_foursquare.png' },
    { name: 'Teras Offshore', src: '/assets/partner_teras.png' }
  ];

  return (
    <div className="bg-white text-slate-800 selection:bg-brand-orange selection:text-white">
      
      {/* ================================================================= */}
      {/* 1. SIGNATURE HERO BANNER (With Full Background Video)             */}
      {/* ================================================================= */}
      <section className="relative aes-hero flex items-center bg-brand-navy text-white overflow-hidden">
        
        {/* Full Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-brand-navy pointer-events-none">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/hero_inspection.jpg"
            className="w-full h-full object-cover opacity-60"
          >
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/70 to-brand-navy/40" />
        </div>

        {/* Play/Pause Video Toggle Control */}
        <button
          onClick={toggleVideo}
          className="aes-video-toggle cursor-pointer"
          aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause background video</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Play background video</span>
            </>
          )}
        </button>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 py-20 lg:py-28 w-full">
          <div className="max-w-3xl space-y-6">
            
            <span className="inline-block bg-brand-orange/20 text-brand-orange text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-brand-orange/30">
              Independent Third Party Inspection &bull; Pan-India &bull; Global
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              <span>Engineering <span className="text-brand-orange">Integrity</span>, Guaranteed Quality.</span>
            </h1>

            <div className="border-l-4 border-brand-orange pl-4 space-y-2">
              <p className="text-lg sm:text-xl font-bold text-white">
                Third-Party Inspection, Vendor Assessment &amp; Statutory QA/QC Surveillance.
              </p>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                Delivering unbiased third-party surveillance, vendor capability audits, NDT Level III examination, and ASME/API code compliance across heavy industrial manufacturing corridors.
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/services"
                className="btn-premium-orange inline-flex items-center gap-2 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-xl transition-all"
              >
                <span>Explore 16 Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={onOpenVerifyDoc}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl backdrop-blur-md transition-all cursor-pointer"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify Report Online</span>
              </button>
            </div>

            {/* 3 Metric Counters */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-brand-orange">16+</div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Specialized Disciplines</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Code Compliance</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">24-48h</div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Rapid Deployment</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. COMPANY PROFILE & JOURNEY (#about)                             */}
      {/* ================================================================= */}
      <section className="py-20 bg-white border-b border-slate-200" id="about">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block">
                <h2 className="text-3xl font-black text-brand-dark tracking-tight">Our Company Journey</h2>
                <div className="heading-line-track mt-2 mb-4">
                  <div className="section-accent-line"></div>
                </div>
              </div>

              <p className="text-base text-slate-700 leading-relaxed">
                <strong>Akshar Engineering Services Pvt. Ltd.</strong> (Formerly known as <em>Akshar Consultancy Services</em>) was established as a dedicated technical assurance and third-party inspection powerhouse. We operate with complete impartiality, independence, and technical rigor across heavy engineering, oil &amp; gas, chemical processing, power generation, renewables, and civil infrastructure.
              </p>

              <p className="text-base text-slate-600 leading-relaxed font-normal">
                From our founding, our guiding philosophy has remained unwavering: protect client capital investments and human lives through rigid technical compliance, verified material traceability, and zero-compromise adherence to international codes (ASME, API, AWS, ISO, EN, IBR).
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-center">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="block text-2xl sm:text-3xl font-black text-brand-blue">100%</span>
                  <span className="text-xs font-bold text-slate-600 uppercase mt-1 block">Impartiality</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="block text-2xl sm:text-3xl font-black text-brand-orange">24-48h</span>
                  <span className="text-xs font-bold text-slate-600 uppercase mt-1 block">Mobilization</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="block text-2xl sm:text-3xl font-black text-brand-blue">Pan-India</span>
                  <span className="text-xs font-bold text-slate-600 uppercase mt-1 block">&amp; Overseas</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 relative group">
                <img
                  src="/assets/hero_inspection.jpg"
                  alt="Technical Inspection at AES"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-1">Field Surveillance</div>
                  <div className="text-lg font-bold">Precision Technical Oversight on the Shop Floor</div>
                </div>
              </div>
            </div>

          </div>

          {/* 3 Value Proposition Cards: Vision, Mission, Impartiality */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 text-slate-900 p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-brand-orange">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center text-xl font-black mb-6">
                  &#128065;
                </div>
                <h3 className="text-2xl font-black text-brand-dark mb-3">Our Vision</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  To be the most trusted and recognized global technical inspection and project engineering partner, safeguarding critical industrial assets through uncompromising technical integrity.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-brand-orange font-bold">
                Trusted Inspection For A Safer Tomorrow
              </div>
            </div>

            <div className="bg-slate-50 text-slate-900 p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-brand-blue">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xl font-black mb-6">
                  &#9874;
                </div>
                <h3 className="text-2xl font-black text-brand-dark mb-3">Our Mission</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  To provide thorough, timely, and fully independent quality assurance, vendor evaluation, and NDT engineering services, ensuring complete compliance with approved ITPs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-brand-blue font-bold">
                Zero Tolerance for Non-Conformance
              </div>
            </div>

            <div className="bg-slate-50 text-slate-900 p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-brand-orange">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center text-xl font-black mb-6">
                  &#9878;
                </div>
                <h3 className="text-2xl font-black text-brand-dark mb-3">Impartiality Charter</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  As an ISO/IEC 17020 Type-A body, we guarantee total freedom from commercial, financial, or manufacturing pressures. Our inspectors evaluate purely on technical facts.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-brand-orange font-bold">
                Guaranteed Ethical Independence
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. CORE SERVICE FEATURED IMAGE CARDS (With Hover Drawer Peek)     */}
      {/* ================================================================= */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-black text-brand-orange uppercase tracking-wider block mb-1">
                Featured Disciplines
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-brand-dark tracking-tight">
                Core Inspection Disciplines
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                Comprehensive vendor surveillance, non-destructive testing, and statutory technical governance.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-blue hover:text-brand-orange transition-colors"
            >
              <span>Explore All 16 Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3 High-Impact Service Cards with 50% Drawer Peek */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1. TPI */}
            <Link
              to="/services/service-tpi"
              className="service-slide-card relative h-[440px] rounded-3xl overflow-hidden border border-slate-200 shadow-md group block"
            >
              <img
                src="/assets/service_tpi.jpg"
                alt="Third Party Inspection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-transparent" />
              
              <div className="service-card-drawer absolute inset-x-0 bottom-0 p-6 text-white space-y-2 bg-gradient-to-t from-brand-navy via-brand-navy/90 to-transparent">
                <span className="text-[11px] font-black uppercase tracking-wider text-brand-orange block">
                  Hold &amp; Witness Surveillance
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors">
                  Third Party Inspection
                </h3>
                <p className="service-drawer-desc text-xs text-slate-300 leading-relaxed">
                  Independent witness and hold point inspection during manufacturing to ensure full compliance with approved ITPs and international codes.
                </p>
                <div className="pt-2 flex items-center text-xs font-bold text-brand-orange">
                  <span>View Technical Scope &rarr;</span>
                </div>
              </div>
            </Link>

            {/* 2. Vendor Assessment */}
            <Link
              to="/services/service-vendor-assessment"
              className="service-slide-card relative h-[440px] rounded-3xl overflow-hidden border border-slate-200 shadow-md group block"
            >
              <img
                src="/assets/service_vendor_audit.jpg"
                alt="Vendor Assessment & Auditing"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-transparent" />
              
              <div className="service-card-drawer absolute inset-x-0 bottom-0 p-6 text-white space-y-2 bg-gradient-to-t from-brand-navy via-brand-navy/90 to-transparent">
                <span className="text-[11px] font-black uppercase tracking-wider text-brand-orange block">
                  Shop Audit &amp; QMS
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors">
                  Vendor Assessment
                </h3>
                <p className="service-drawer-desc text-xs text-slate-300 leading-relaxed">
                  Rigorous shop approval, facility capacity verification, and manufacturing competence auditing to mitigate supply chain risk.
                </p>
                <div className="pt-2 flex items-center text-xs font-bold text-brand-orange">
                  <span>View Technical Scope &rarr;</span>
                </div>
              </div>
            </Link>

            {/* 3. QA/QC Documentation */}
            <Link
              to="/services/service-qa-qc-documentation"
              className="service-slide-card relative h-[440px] rounded-3xl overflow-hidden border border-slate-200 shadow-md group block"
            >
              <img
                src="/assets/service_qa_qc.jpg"
                alt="QA/QC Documentation & MRB"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-transparent" />
              
              <div className="service-card-drawer absolute inset-x-0 bottom-0 p-6 text-white space-y-2 bg-gradient-to-t from-brand-navy via-brand-navy/90 to-transparent">
                <span className="text-[11px] font-black uppercase tracking-wider text-brand-orange block">
                  MDR Dossier &amp; Traceability
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors">
                  QA/QC Documentation
                </h3>
                <p className="service-drawer-desc text-xs text-slate-300 leading-relaxed">
                  Comprehensive Manufacturer Data Report (MDR) review, welder log auditing, and EN 10204 Type 3.2 material certification.
                </p>
                <div className="pt-2 flex items-center text-xs font-bold text-brand-orange">
                  <span>View Technical Scope &rarr;</span>
                </div>
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. EQUIPMENT & ASSET SCOPE (4 Cards)                              */}
      {/* ================================================================= */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black text-brand-orange uppercase tracking-wider block mb-1">
              Material Spectrum
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-brand-dark tracking-tight">
              Equipment &amp; Asset Scope
            </h2>
            <div className="heading-line-track track-center mx-auto mt-2 mb-4">
              <div className="section-accent-line"></div>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Surveillance capabilities covering raw metallics through complex critical modular systems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-brand-orange transition-all">
              <span className="text-xs font-black text-brand-orange uppercase tracking-wider block mb-2">
                01. Basic Material
              </span>
              <h3 className="text-base font-bold text-brand-dark mb-2">Plates, Forgings &amp; Castings</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Pipes, seamless tubes, forged flanges, butt-weld fittings, bar stock, and structural sections with EN 10204 3.1 &amp; 3.2 traceability.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-brand-orange transition-all">
              <span className="text-xs font-black text-brand-orange uppercase tracking-wider block mb-2">
                02. Fabricated Structures
              </span>
              <h3 className="text-base font-bold text-brand-dark mb-2">Heavy Columns &amp; Skids</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Pre-engineered buildings, pressure vessels, shell-and-tube heat exchangers, and skid-mounted process packages.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-brand-orange transition-all">
              <span className="text-xs font-black text-brand-orange uppercase tracking-wider block mb-2">
                03. Static Equipment
              </span>
              <h3 className="text-base font-bold text-brand-dark mb-2">Storage Tanks &amp; Boilers</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                API 650/653 storage tanks, steam boilers (IBR), chemical reactors, and cryogenic vacuum-insulated vessels.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-brand-orange transition-all">
              <span className="text-xs font-black text-brand-orange uppercase tracking-wider block mb-2">
                04. Rotary Machinery
              </span>
              <h3 className="text-base font-bold text-brand-dark mb-2">Pumps, Turbines &amp; Valves</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Centrifugal pumps, reciprocating compressors, control valves, API 6D pipeline valves, and mechanical seals.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 5. SECTORS WE SERVE (6 Cards with Real Photos)                   */}
      {/* ================================================================= */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black text-brand-orange uppercase tracking-wider block mb-1">
              Industry Verticals
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-brand-dark tracking-tight">
              Sectors We Serve
            </h2>
            <div className="heading-line-track track-center mx-auto mt-2 mb-4">
              <div className="section-accent-line"></div>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Deploying tailored surveillance matrices matching the stringent statutory mandates of global heavy industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sec, idx) => (
              <div
                key={idx}
                className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group"
              >
                <img
                  src={sec.image}
                  alt={sec.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/sector_heavy_fab.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-orange transition-colors mb-1">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 font-normal">
                    {sec.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 6. TRUSTED BY / 6-LOGO ROW                                        */}
      {/* ================================================================= */}
      <section className="py-16 bg-white border-b border-slate-200" id="clients">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-8">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Trusted by Leading EPC Contractors &amp; Industrial Equipment Manufacturers
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center opacity-85 hover:opacity-100 transition-opacity">
            {clientLogos.map((client, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center w-full h-20">
                <img
                  src={client.src}
                  alt={client.name}
                  className="max-h-12 max-w-[120px] object-contain grayscale hover:grayscale-0 transition-all"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span class="text-xs font-bold text-slate-700 text-center">${client.name}</span>`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 7. QUALITY POLICY & OBJECTIVES (Above Footer)                     */}
      {/* ================================================================= */}
      <QualityPolicy />

      {/* ================================================================= */}
      {/* 8. QUICK TECHNICAL INQUIRY FORM (Connected to Supabase)           */}
      {/* ================================================================= */}
      <section className="py-20 bg-slate-50" id="inquiry">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-brand-orange">
              Direct Technical Desk
            </span>
            <h2 className="text-3xl font-black text-brand-dark tracking-tight mt-1">
              Submit Inspection Scope Inquiry
            </h2>
            <div className="heading-line-track track-center mx-auto mt-2 mb-4">
              <div className="section-accent-line"></div>
            </div>
            <p className="text-slate-600 text-sm">
              Receive a customized technical proposal and surveyor mobilization schedule within 4 hours.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl">
            <form onSubmit={handleInquirySubmit} className="space-y-5 text-xs">
              
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. L&amp;T Hydrocarbon"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Service Required *
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-medium"
                >
                  {servicesData.map(s => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Inspection Location &amp; Scope Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  placeholder="Specify equipment type, vendor city/country, fabrication stages, hold points, or drawing numbers..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-premium-orange w-full text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Submit Inspection Inquiry</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

    </div>
  );
}

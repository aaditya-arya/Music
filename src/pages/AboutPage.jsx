import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, ShieldCheck, Award, Eye, Wrench, Scale } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white text-slate-800 selection:bg-brand-orange selection:text-white">
      
      {/* ================================================================= */}
      {/* 1. HERO BANNER (With Face Image on Right)                         */}
      {/* ================================================================= */}
      <section className="relative bg-brand-navy py-14 sm:py-20 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-blue/50 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-orange/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-brand-orange">About Us</span>
          </nav>

          {/* 2-Column Hero Grid: Text on Left, Face Image Card on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left: Text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block bg-brand-orange/20 text-brand-orange text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-brand-orange/30">
                Independent Technical Excellence &bull; ISO/IEC 17020 Type-A Body
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                About Akshar Engineering Services
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
                Delivering uncompromising quality assurance, independent third-party surveillance, and statutory technical compliance for global industrial supply chains and capital infrastructure.
              </p>
            </div>

            {/* Right: Face Image Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative group w-full max-w-sm">
                {/* Ambient Glow Effect */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-brand-orange/50 to-brand-blue/50 rounded-3xl blur-lg opacity-50 group-hover:opacity-80 transition duration-500"></div>
                
                {/* Image Frame */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-brand-navy">
                  <img
                    src="/assets/Face.jpeg"
                    alt="Leadership at Akshar Engineering Services"
                    className="w-full h-[360px] sm:h-[400px] object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/hero_inspection.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/20 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-black text-brand-orange uppercase tracking-wider block">
                      Leadership &amp; Technical Governance
                    </span>
                    <span className="text-sm font-bold text-white">Akshar Engineering Services</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. COMPANY PROFILE & JOURNEY                                      */}
      {/* ================================================================= */}
      <main className="py-16 bg-white" id="companyJourney">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-20">
          
          {/* Company Background & Overview */}
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
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-1">Field Surveillance</div>
                  <div className="text-lg font-bold">Precision Technical Oversight on the Shop Floor</div>
                </div>
              </div>
            </div>
          </div>

          {/* Vision, Mission & Impartiality Charter (3 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Our Vision */}
            <div className="bg-slate-50 text-slate-900 p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-brand-orange">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center text-xl font-black mb-6">
                  &#128065;
                </div>
                <h3 className="text-2xl font-black text-brand-dark mb-3">Our Vision</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  To be the most trusted and recognized global technical inspection and project engineering partner, safeguarding critical industrial assets through uncompromising technical integrity and state-of-the-art engineering practices.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-brand-orange font-bold">
                Trusted Inspection For A Safer Tomorrow
              </div>
            </div>

            {/* Card 2: Our Mission */}
            <div className="bg-slate-50 text-slate-900 p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-brand-blue">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xl font-black mb-6">
                  &#9874;
                </div>
                <h3 className="text-2xl font-black text-brand-dark mb-3">Our Mission</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  To provide thorough, timely, and fully independent quality assurance, vendor evaluation, and NDT engineering services, ensuring complete compliance with approved ITPs, statutory safety rules, and contractual specifications.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-brand-blue font-bold">
                Zero Tolerance for Non-Conformance
              </div>
            </div>

            {/* Card 3: Impartiality Charter */}
            <div className="bg-slate-50 text-slate-900 p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-brand-orange">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center text-xl font-black mb-6">
                  &#9878;
                </div>
                <h3 className="text-2xl font-black text-brand-dark mb-3">Impartiality Charter</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  As an ISO/IEC 17020 Type-A body, we guarantee total freedom from commercial, financial, or manufacturing pressures. Our inspectors evaluate purely on technical facts, code criteria, and physical measurement proofs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-brand-orange font-bold">
                Guaranteed Ethical Independence
              </div>
            </div>

          </div>

          {/* Five Pillars of Excellence (6 Cards) */}
          <section className="bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-block">
                <h2 className="text-3xl font-black text-brand-dark tracking-tight">Five Pillars of AES Excellence</h2>
                <div className="heading-line-track track-center mx-auto mt-2 mb-4">
                  <div className="section-accent-line"></div>
                </div>
              </div>
              <p className="text-sm sm:text-base text-slate-600">
                The core operational disciplines that set Akshar Engineering Services apart in the global technical inspection landscape.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-brand-orange font-black text-lg mb-1">01</div>
                <h3 className="text-base font-bold text-brand-dark mb-2">CSWIP &amp; ASNT Certified Inspectors</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">Our personnel maintain active global qualifications including CSWIP 3.1, AWS CWI, ASNT Level III/II (UT/RT/MPI/DPT), NACE/AMPP Level 2, and API 510/570/653 certifications.</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-brand-orange font-black text-lg mb-1">02</div>
                <h3 className="text-base font-bold text-brand-dark mb-2">Rapid 24-48h Field Deployment</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">Strategic surveyor deployment hubs across major industrial corridors in Gujarat, Maharashtra, South India, and overseas networks for rapid on-site mobilization.</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-brand-orange font-black text-lg mb-1">03</div>
                <h3 className="text-base font-bold text-brand-dark mb-2">Immediate 24-Hour Flash Reports</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">Daily photographic flash summaries dispatched within 24 hours of inspection completion, giving engineering managers real-time visibility of vendor shop floors.</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-brand-orange font-black text-lg mb-1">04</div>
                <h3 className="text-base font-bold text-brand-dark mb-2">Complete Material Traceability</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">Rigid heat number correlation matrix mapping every structural plate, forging, and welding consumable directly to EN 10204 Type 3.1 &amp; 3.2 certificates.</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-brand-orange font-black text-lg mb-1">05</div>
                <h3 className="text-base font-bold text-brand-dark mb-2">Statutory Code Conformance</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">Strict adherence to ASME Boiler and Pressure Vessel Codes (Sec II, V, VIII, IX), ASME B31.3 Piping, API 650/620 Tanks, AWS D1.1, and Indian Boiler Regulations (IBR).</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-brand-orange font-black text-lg mb-1">06</div>
                <h3 className="text-base font-bold text-brand-dark mb-2">Digital Document Verification</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">Instant online authentication of all issued Inspection Release Notes (IRN) and test endorsements to eliminate counterfeit documentation risks.</p>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* 3. WE HEAR YOU CALLOUT SECTION                                    */}
          {/* ================================================================= */}
          <section className="scroll-mt-28 bg-gradient-to-br from-brand-navy via-slate-900 to-brand-blue text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden text-center border border-white/10">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-brand-blue/30 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-2xl mx-auto relative z-10 space-y-6">
              <span className="inline-block bg-brand-orange/20 text-brand-orange text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-brand-orange/30">
                Client Care &bull; Priority Resolution Desk
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                We Hear You
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                At Akshar Engineering Services, we listen closely to your operational challenges, inspection milestone updates, and quality feedback. If you have any problem, report question, or require immediate technical assistance, click below for quick resolution.
              </p>
              <div className="pt-2">
                <Link
                  to="/we-hear-you"
                  className="btn-premium-orange text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-2xl inline-flex items-center gap-2 group transition-all duration-300"
                >
                  <span>Click for Quick Resolution</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>

    </div>
  );
}

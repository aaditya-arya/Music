<?php
/**
 * Template Name: Front Page (Homepage)
 *
 * @package Akshar_Theme
 */

get_header();
?>

<main id="main-content">
  <!-- ================================================================= -->
  <!-- HERO SECTION WITH INFINITE 4-VIDEO LOOP BACKGROUND                -->
  <!-- ================================================================= -->
  <section class="relative min-h-[600px] lg:min-h-[720px] bg-brand-navy overflow-hidden flex items-center">
    
    <!-- Background Sequential Video Player -->
    <div class="absolute inset-0 z-0">
      <video id="heroBgVideo" autoplay muted playsinline class="w-full h-full object-cover opacity-35 transition-opacity duration-1000"></video>
      <div class="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/85 to-transparent"></div>
    </div>

    <!-- Hero Content -->
    <div class="relative z-10 w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20 py-20 lg:py-28 text-white">
      <div class="max-w-3xl space-y-6">
        
        <div class="inline-flex items-center gap-2 bg-brand-orange/20 text-brand-orange text-xs font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full border border-brand-orange/30 shadow-xs">
          <span class="w-2 h-2 rounded-full bg-brand-orange"></span>
          <span>ISO/IEC 17020 Type-A Quality Assurance</span>
        </div>

        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
          Uncompromising <span class="text-brand-orange">Engineering Inspection</span> &amp; Quality Surveillance
        </h1>

        <p class="text-slate-300 text-base sm:text-xl font-normal leading-relaxed max-w-2xl">
          Independent third-party inspection, shop floor witness surveillance, vendor assessment, and technical assurance across global oil &amp; gas, renewables, and heavy fabrication supply chains.
        </p>

        <!-- CTA Action Buttons -->
        <div class="pt-4 flex flex-wrap items-center gap-4">
          <button onclick="openModal('inquiryModal')" class="btn-premium-orange font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg cursor-pointer">
            Deploy an Inspector (24h)
          </button>
          <a href="<?php echo esc_url(home_url('/services')); ?>" class="btn-premium-blue font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg">
            Explore 16 Disciplines &rarr;
          </a>
          <button onclick="openModal('companyProfileModal')" class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl transition-all cursor-pointer">
            <span>&#128214;</span> Read Flipbook Brochure
          </button>
        </div>

      </div>
    </div>
  </section>

  <!-- ================================================================= -->
  <!-- TRUSTED CLIENTS CONTINUOUS MARQUEE                                -->
  <!-- ================================================================= -->
  <section class="py-8 bg-slate-900 border-y border-slate-800 overflow-hidden">
    <div class="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20 mb-4 text-center">
      <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Trusted By Industry Leaders &amp; Global EPCs</span>
    </div>
    <div class="flex overflow-hidden relative">
      <div class="animate-marquee-ltr flex items-center space-x-12 whitespace-nowrap text-slate-400 text-sm font-bold uppercase tracking-wider">
        <span>&bull; Larsen &amp; Toubro</span>
        <span>&bull; Reliance Industries</span>
        <span>&bull; ONGC India</span>
        <span>&bull; Indian Oil (IOCL)</span>
        <span>&bull; Bharat Petroleum</span>
        <span>&bull; Adani Energy Solutions</span>
        <span>&bull; Tata Projects</span>
        <span>&bull; Thermax Global</span>
        <span>&bull; Petrofac International</span>
        <span>&bull; Engineers India Limited</span>
        <span>&bull; BHEL</span>
        <span>&bull; GAIL India</span>
        <!-- Duplicate for infinite seamless loop -->
        <span>&bull; Larsen &amp; Toubro</span>
        <span>&bull; Reliance Industries</span>
        <span>&bull; ONGC India</span>
        <span>&bull; Indian Oil (IOCL)</span>
        <span>&bull; Bharat Petroleum</span>
        <span>&bull; Adani Energy Solutions</span>
      </div>
    </div>
  </section>

  <!-- ================================================================= -->
  <!-- CORE SERVICES SECTION                                             -->
  <!-- ================================================================= -->
  <section class="py-20 sm:py-28 bg-white">
    <div class="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20">
      
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
        <div>
          <span class="text-xs font-black text-brand-orange uppercase tracking-wider block mb-1">Our Capabilities</span>
          <h2 class="text-3xl sm:text-5xl font-black text-brand-dark">Specialized Inspection Services</h2>
          <div class="heading-line-track max-w-sm mt-3">
            <div class="section-accent-line"></div>
          </div>
        </div>
        <a href="<?php echo esc_url(home_url('/services')); ?>" class="inline-flex items-center gap-2 text-xs font-black text-brand-orange hover:text-brand-dark uppercase tracking-wider bg-orange-50 hover:bg-orange-100 px-5 py-3 rounded-xl border border-orange-200 transition-all">
          <span>View All 16 Disciplines</span>
          <span class="text-sm">&rarr;</span>
        </a>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        
        <!-- Service Card 1 -->
        <a href="<?php echo esc_url(home_url('/service-tpi')); ?>" class="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block">
          <div class="overflow-hidden h-52 bg-slate-900">
            <img src="<?php echo akshar_asset('service_tpi.jpg'); ?>" alt="Third Party Inspection" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
          </div>
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <span class="text-xs font-black text-brand-orange uppercase tracking-wider mb-1 block">Shop &amp; Site Surveillance</span>
              <h3 class="text-xl font-bold text-slate-900 group-hover:text-brand-orange transition-colors mb-2">Third Party Inspection</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Independent witness and hold point surveillance during manufacturing to guarantee full code compliance.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-brand-blue">
              <span>ISO 17020 Type-A</span>
              <span>Details &rarr;</span>
            </div>
          </div>
        </a>

        <!-- Service Card 2 -->
        <a href="<?php echo esc_url(home_url('/service-vendor-assessment')); ?>" class="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block">
          <div class="overflow-hidden h-52 bg-slate-900">
            <img src="<?php echo akshar_asset('service_vendor_audit.jpg'); ?>" alt="Vendor Assessment" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
          </div>
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <span class="text-xs font-black text-brand-orange uppercase tracking-wider mb-1 block">Shop Audit &amp; QMS</span>
              <h3 class="text-xl font-bold text-slate-900 group-hover:text-brand-orange transition-colors mb-2">Vendor Assessment</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Rigorous shop approval, facility capacity verification, and manufacturing competence auditing.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-brand-blue">
              <span>ISO 9001 / API Q1</span>
              <span>Details &rarr;</span>
            </div>
          </div>
        </a>

        <!-- Service Card 3 -->
        <a href="<?php echo esc_url(home_url('/service-qa-qc-documentation')); ?>" class="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block">
          <div class="overflow-hidden h-52 bg-slate-900">
            <img src="<?php echo akshar_asset('service_qa_qc.jpg'); ?>" alt="QA/QC Documentation" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
          </div>
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <span class="text-xs font-black text-brand-orange uppercase tracking-wider mb-1 block">MDR Dossier &amp; Traceability</span>
              <h3 class="text-xl font-bold text-slate-900 group-hover:text-brand-orange transition-colors mb-2">QA/QC Documentation</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Comprehensive Manufacturer Data Report review, welder logs, and EN 10204 Type 3.2 co-signing.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-brand-blue">
              <span>EN 10204 3.2</span>
              <span>Details &rarr;</span>
            </div>
          </div>
        </a>

        <!-- Service Card 4 -->
        <a href="<?php echo esc_url(home_url('/service-welding-engineering')); ?>" class="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block">
          <div class="overflow-hidden h-52 bg-slate-900">
            <img src="<?php echo akshar_asset('service_welding_nde.jpg'); ?>" alt="Welding Engineering" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
          </div>
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <span class="text-xs font-black text-brand-orange uppercase tracking-wider mb-1 block">WPS / PQR / WPQ</span>
              <h3 class="text-xl font-bold text-slate-900 group-hover:text-brand-orange transition-colors mb-2">Welding Engineering</h3>
              <p class="text-xs text-slate-600 leading-relaxed">CSWIP 3.1 &amp; AWS CWI welding inspection, procedure qualification, and welder certification.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-brand-blue">
              <span>ASME Sec IX / AWS</span>
              <span>Details &rarr;</span>
            </div>
          </div>
        </a>

      </div>
    </div>
  </section>
</main>

<?php
get_footer();

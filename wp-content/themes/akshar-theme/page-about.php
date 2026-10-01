<?php
/**
 * Template Name: About Us Page
 *
 * @package Akshar_Theme
 */

get_header();
?>

<!-- ================================================================= -->
<!-- 1. HERO & FOUNDER (Editorial Narrative Left, Natural Portrait Right) -->
<!-- ================================================================= -->
<section class="relative bg-white text-slate-800 pt-10 pb-16 overflow-hidden">
  <div class="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8 uppercase tracking-wider">
      <a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-brand-orange transition-colors">Home</a>
      <span>/</span>
      <span class="text-brand-orange">About Us</span>
    </nav>

    <!-- 2-Column Grid: Editorial Narrative Left, Portrait Right -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      
      <!-- Left: Founder Narrative -->
      <div class="lg:col-span-7 space-y-6">
        <span class="text-xs font-bold uppercase tracking-widest text-brand-orange">
          Leadership &bull; Engineering Heritage
        </span>
        
        <h1 class="text-3xl sm:text-5xl font-black text-brand-dark tracking-tight leading-tight">
          About <span class="text-brand-orange">Akshar Engineering Services</span>
        </h1>
        
        <div class="heading-line-track mb-2"><div class="section-accent-line"></div></div>

        <p class="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
          Founded by <strong>Kunal Shah</strong>, <strong>Akshar Engineering Services</strong> was established with a singular focus: delivering uncompromising third-party technical inspection, quality surveillance, and expediting services for heavy manufacturing, power, renewables, and oil &amp; gas projects.
        </p>

        <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
          With hands-on technical experience on shop floors and fabrication sites, AES was built on a simple foundation: safeguarding engineering integrity through certified inspectors, strict code compliance (ASME, API, AWS, ISO), and uncompromised reporting.
        </p>

        <!-- Seamless Editorial Pull-Quote -->
        <blockquote class="pl-6 border-l-2 border-brand-orange my-6 space-y-2">
          <p class="text-base sm:text-lg text-slate-800 italic font-medium leading-relaxed">
            &ldquo;Quality inspection is not an administrative routine. It is the direct responsibility to protect human safety and capital assets through verified technical facts.&rdquo;
          </p>
          <cite class="text-xs font-bold text-slate-500 not-italic block uppercase tracking-wider">
            &mdash; Kunal Shah, <span class="text-brand-dark font-extrabold">Founder &amp; Managing Director</span>
          </cite>
        </blockquote>
      </div>

      <!-- Right: Natural Portrait (Seamlessly Blended, No Box Frame) -->
      <div class="lg:col-span-5 flex justify-center lg:justify-end">
        <div class="relative w-full max-w-md">
          <!-- Subtle Ambient Background Glow -->
          <div class="absolute -inset-4 bg-gradient-to-tr from-brand-orange/10 to-brand-blue/10 rounded-3xl blur-2xl -z-10"></div>
          
          <div class="relative overflow-hidden rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-[1.01] group bg-slate-100">
            <img src="<?php echo esc_url(akshar_asset('Face.jpeg')); ?>" alt="Kunal Shah - Founder & Managing Director" class="w-full h-[460px] sm:h-[520px] lg:h-[560px] object-cover object-top block">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none"></div>
            
            <div class="absolute bottom-6 left-6 right-6 text-white space-y-0.5">
              <span class="text-[10px] uppercase font-bold tracking-widest text-brand-orange block">Founder &amp; Leadership</span>
              <h3 class="text-xl font-black text-white leading-tight">Kunal Shah</h3>
              <p class="text-xs text-slate-300 font-medium">Akshar Engineering Services Pvt. Ltd.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ================================================================= -->
<!-- 2. COMPANY OVERVIEW & SEAMLESS METRICS                            -->
<!-- ================================================================= -->
<section class="py-20 bg-slate-50/70 border-y border-slate-200/60" id="companyJourney">
  <div class="max-w-7xl mx-auto px-6 lg:px-12">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      
      <div class="lg:col-span-7 space-y-6">
        <div class="inline-block">
          <span class="text-xs font-bold uppercase tracking-widest text-brand-blue">Company Profile &amp; Ethos</span>
          <h2 class="text-3xl sm:text-4xl font-black text-brand-dark tracking-tight mt-1">Our Company Journey</h2>
          <div class="heading-line-track mt-2 mb-4"><div class="section-accent-line"></div></div>
        </div>
        
        <p class="text-base text-slate-700 leading-relaxed">
          <strong>Akshar Engineering Services Pvt. Ltd.</strong> (formerly known as <em>Akshar Consultancy Services</em>) operates as a dedicated technical assurance and third-party inspection powerhouse across India and global supply corridors.
        </p>
        <p class="text-base text-slate-600 leading-relaxed">
          From our founding, our guiding philosophy has remained unwavering: protect client capital investments and human lives through rigid technical compliance, verified material traceability, and zero-compromise adherence to international codes (ASME, API, AWS, ISO, EN, IBR).
        </p>

        <!-- Seamless Metrics Bar (No rigid cards) -->
        <div class="grid grid-cols-3 gap-8 pt-6 border-t border-slate-200">
          <div>
            <div class="text-3xl sm:text-4xl font-black text-brand-blue tracking-tight">100<span class="text-brand-orange">%</span></div>
            <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Impartial Oversight</div>
          </div>
          <div>
            <div class="text-3xl sm:text-4xl font-black text-brand-blue tracking-tight">24-48<span class="text-brand-orange">h</span></div>
            <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Fast Mobilization</div>
          </div>
          <div>
            <div class="text-3xl sm:text-4xl font-black text-brand-blue tracking-tight">Global<span class="text-brand-orange">+</span></div>
            <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Pan-India &amp; Overseas</div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5">
        <div class="rounded-2xl overflow-hidden shadow-xl relative group">
          <img src="<?php echo esc_url(akshar_asset('hero_inspection.jpg')); ?>" alt="Technical Inspection at AES" class="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700 ease-out">
          <div class="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent"></div>
          <div class="absolute bottom-6 left-6 right-6 text-white">
            <div class="text-xs font-bold text-brand-orange uppercase tracking-wider mb-1">Field Surveillance</div>
            <div class="text-lg font-bold">Precision Technical Oversight on the Shop Floor</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ================================================================= -->
<!-- 3. KEY MOMENTS & EVOLUTION (Seamless Connected Timeline)          -->
<!-- ================================================================= -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-6 lg:px-12 space-y-14">
    
    <div class="text-center max-w-2xl mx-auto">
      <span class="text-xs font-bold uppercase tracking-widest text-brand-orange">
        Evolution &bull; Milestones
      </span>
      <h3 class="text-3xl sm:text-4xl font-black text-brand-dark mt-1 tracking-tight">
        Key Moments in Our Journey
      </h3>
      <div class="heading-line-track track-center mx-auto mt-2"><div class="section-accent-line"></div></div>
    </div>

    <!-- Seamless Horizontal Timeline (Connected, No Card Boxes) -->
    <div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      
      <!-- Timeline Step 1 -->
      <div class="relative space-y-3 pt-4 border-t-2 border-brand-orange">
        <div class="flex items-center justify-between">
          <span class="text-2xl font-black text-brand-orange">2013</span>
          <span class="w-2.5 h-2.5 rounded-full bg-brand-orange"></span>
        </div>
        <h4 class="text-base font-black text-brand-dark">Founding Foundation</h4>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Established in Gujarat as Akshar Consultancy Services, providing specialized vendor auditing and baseline pressure equipment QA.
        </p>
      </div>

      <!-- Timeline Step 2 -->
      <div class="relative space-y-3 pt-4 border-t-2 border-brand-blue">
        <div class="flex items-center justify-between">
          <span class="text-2xl font-black text-brand-blue">2017</span>
          <span class="w-2.5 h-2.5 rounded-full bg-brand-blue"></span>
        </div>
        <h4 class="text-base font-black text-brand-dark">Multi-Sector Scale</h4>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Expanded third-party inspection into Oil &amp; Gas refineries, cross-country pipelines, renewables, and heavy structural engineering.
        </p>
      </div>

      <!-- Timeline Step 3 -->
      <div class="relative space-y-3 pt-4 border-t-2 border-brand-orange">
        <div class="flex items-center justify-between">
          <span class="text-2xl font-black text-brand-orange">2021</span>
          <span class="w-2.5 h-2.5 rounded-full bg-brand-orange"></span>
        </div>
        <h4 class="text-base font-black text-brand-dark">Type-A ISO Framework</h4>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Solidified full ISO/IEC 17020 Type-A impartial governance and established instantaneous digital document verification cells.
        </p>
      </div>

      <!-- Timeline Step 4 -->
      <div class="relative space-y-3 pt-4 border-t-2 border-brand-blue">
        <div class="flex items-center justify-between">
          <span class="text-2xl font-black text-brand-blue">Present</span>
          <span class="w-2.5 h-2.5 rounded-full bg-brand-blue"></span>
        </div>
        <h4 class="text-base font-black text-brand-dark">Global Technical Dominance</h4>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Pan-India rapid surveyor deployment network and international partner reach across critical turnarounds and capital projects.
        </p>
      </div>

    </div>
  </div>
</section>

<!-- ================================================================= -->
<!-- 4. VISION & MISSION (Seamless 2-Column Editorial on White Background) -->
<!-- ================================================================= -->
<section class="py-16 sm:py-20 bg-white border-t border-slate-200/70">
  <div class="max-w-7xl mx-auto px-6 lg:px-12">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 divide-y md:divide-y-0 md:divide-x divide-slate-200">
      
      <!-- Vision -->
      <div class="space-y-4 md:pr-10 pt-6 md:pt-0">
        <div class="flex items-center gap-3">
          <span class="w-12 h-12 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center text-2xl font-bold border border-orange-200/70 shadow-xs">
            &#128065;
          </span>
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-brand-orange block">Our Vision</span>
            <span class="text-sm font-bold text-slate-800">Trusted Inspection For A Safer Tomorrow</span>
          </div>
        </div>
        <p class="text-slate-600 text-base sm:text-lg leading-relaxed font-normal pt-2">
          To be the world&apos;s most recognized and dependable technical inspection partner—safeguarding critical industrial assets through uncompromising engineering integrity and verified quality compliance.
        </p>
      </div>

      <!-- Mission -->
      <div class="space-y-4 md:pl-10 pt-8 md:pt-0">
        <div class="flex items-center gap-3">
          <span class="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center text-2xl font-bold border border-blue-200/70 shadow-xs">
            &#9874;
          </span>
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-brand-blue block">Our Mission</span>
            <span class="text-sm font-bold text-slate-800">Zero Tolerance for Non-Conformance</span>
          </div>
        </div>
        <p class="text-slate-600 text-base sm:text-lg leading-relaxed font-normal pt-2">
          To deliver rapid, thorough, and fully independent quality assurance, vendor auditing, and NDT engineering—guaranteeing 100% compliance with approved ITPs and statutory codes on every shop floor.
        </p>
      </div>

    </div>
  </div>
</section>

<!-- ================================================================= -->
<!-- 6. COMPANY PROFILE BROCHURE (Seamless Full-Width Action Strip)    -->
<!-- ================================================================= -->
<section class="py-16 bg-slate-50 border-t border-slate-200">
  <div class="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
    
    <div class="flex items-center gap-6">
      <div class="w-16 h-22 sm:w-20 sm:h-28 bg-brand-dark rounded-xl shadow-lg border-l-4 border-brand-orange flex flex-col justify-between p-2.5 shrink-0 transform -rotate-3 hover:rotate-0 transition-transform duration-300 cursor-pointer" onclick="openModal('companyProfileModal')" title="Open Interactive 3D Brochure">
        <span class="text-[8px] font-black text-brand-orange uppercase">AES PDF</span>
        <div class="text-[10px] font-extrabold text-white leading-tight">Company Profile</div>
        <span class="text-[7px] text-slate-400">2026 Edition</span>
      </div>
      <div>
        <span class="text-xs font-bold uppercase tracking-widest text-brand-orange">Official Publication</span>
        <h3 class="text-2xl font-black text-brand-dark mt-0.5">AES Corporate Profile &amp; Technical Scope</h3>
        <p class="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl font-normal leading-relaxed">
          Review our complete inspection methodologies, equipment testing standards, surveyor qualifications, and client portfolio.
        </p>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
      <button onclick="openModal('companyProfileModal')" class="btn-premium-orange text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md inline-flex items-center justify-center gap-2 cursor-pointer">
        <span>&#128214; Read 3D Flipbook</span>
        <span class="text-sm">&rarr;</span>
      </button>
      <a href="<?php echo esc_url(get_theme_mod('brochure_pdf_url', akshar_asset('Company Profile.pdf'))); ?>" download="AES_Company_Profile.pdf" class="bg-white hover:bg-slate-100 text-brand-blue border border-slate-300 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-xs inline-flex items-center justify-center gap-2 transition-colors">
        <span>&#128190; Download PDF</span>
      </a>
    </div>

  </div>
</section>

<!-- ================================================================= -->
<!-- 7. WE HEAR YOU CALLOUT (Seamless Clean Transition to Footer)      -->
<!-- ================================================================= -->
<section class="py-20 bg-white border-t border-slate-200 text-center">
  <div class="max-w-3xl mx-auto px-6 lg:px-12 space-y-6">
    <span class="text-xs font-bold uppercase tracking-widest text-brand-orange">
      Client Care &bull; Priority Technical Desk
    </span>
    <h2 class="text-3xl sm:text-4xl font-black text-brand-dark tracking-tight">
      We Hear You
    </h2>
    <p class="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
      At Akshar Engineering Services, we listen closely to your operational challenges, inspection milestone updates, and quality feedback. If you have any requirement, report question, or require immediate technical assistance, our desk is ready.
    </p>
    <div class="pt-2">
      <a href="<?php echo esc_url(home_url('/we-hear-you')); ?>" class="btn-premium-orange text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-md inline-flex items-center gap-2 group transition-all duration-300">
        <span>Click for Quick Resolution</span>
        <span class="text-sm transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
      </a>
    </div>
  </div>
</section>

<?php
get_footer();

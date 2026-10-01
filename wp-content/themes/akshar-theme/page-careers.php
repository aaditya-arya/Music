<?php
/**
 * Template Name: Careers Page
 *
 * @package Akshar_Theme
 */

get_header();
?>

<style>
  /* 5-Second Glowing Effect for Join Us CTA Button: Sweeps from Top-Left to Full 360-Degree Circular Halo */
  @keyframes sweepTopLeftToFullGlow5s {
    0% {
      box-shadow: -14px -14px 28px 4px rgba(241, 104, 38, 0.95), 0 0 0 0 rgba(241, 104, 38, 0);
      transform: scale(1.02);
    }
    15% {
      box-shadow: -18px -18px 40px 8px rgba(241, 104, 38, 1), 0 0 20px 4px rgba(241, 104, 38, 0.6);
      transform: scale(1.05);
    }
    30% {
      box-shadow: 0 0 45px 12px rgba(241, 104, 38, 0.95), 0 0 75px 22px rgba(241, 104, 38, 0.65);
      transform: scale(1.08);
    }
    50% {
      box-shadow: 0 0 35px 8px rgba(241, 104, 38, 0.85), 0 0 55px 15px rgba(241, 104, 38, 0.5);
      transform: scale(1.04);
    }
    70% {
      box-shadow: 0 0 50px 14px rgba(241, 104, 38, 1), 0 0 85px 25px rgba(241, 104, 38, 0.7);
      transform: scale(1.08);
    }
    88% {
      box-shadow: 0 0 25px 6px rgba(241, 104, 38, 0.7), 0 0 40px 10px rgba(241, 104, 38, 0.4);
      transform: scale(1.03);
    }
    100% {
      box-shadow: 0 4px 12px rgba(241, 104, 38, 0.25);
      transform: scale(1);
    }
  }
  .join-btn-glowing {
    animation: sweepTopLeftToFullGlow5s 5s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
  }
</style>

<main id="main-content">
  <!-- Hero Section -->
  <section class="py-14 sm:py-20 bg-white border-b border-slate-200">
    <div class="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16">
      <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-brand-orange transition-colors">Home</a>
        <span>/</span>
        <span class="text-brand-orange">Careers</span>
      </nav>

      <div class="max-w-3xl">
        <span class="inline-block bg-brand-orange/10 text-brand-orange text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-brand-orange/20 mb-4">
          Engineering Excellence &bull; Growth &bull; Culture
        </span>
        <h1 class="text-3xl sm:text-5xl font-black text-brand-dark tracking-tight mb-4 leading-tight">
          Careers at AES
        </h1>
        <p class="text-slate-600 text-base sm:text-lg leading-relaxed">
          At Akshar Engineering Services, we empower technical professionals with meritocratic growth, uncompromising engineering ethics, and international inspection standards.
        </p>
      </div>
    </div>
  </section>

  <!-- 4 Working Principles Section -->
  <section class="py-16 sm:py-24 bg-slate-50">
    <div class="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16">
      <div class="mb-12">
        <span class="text-xs font-black text-brand-orange uppercase tracking-wider block mb-1">Our Working Principles</span>
        <h2 class="text-3xl sm:text-5xl font-black text-brand-dark">Life &amp; Growth at Akshar Engineering</h2>
        <div class="heading-line-track max-w-sm mt-3">
          <div class="section-accent-line"></div>
        </div>
      </div>

      <!-- 4 Massive Cards Left to Right -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
        
        <!-- Principle 1 -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-500 group flex flex-col justify-between h-full min-h-[580px] relative overflow-hidden">
          <div>
            <div class="relative overflow-hidden rounded-2xl h-60 sm:h-64 w-full mb-5 bg-slate-900 shadow-inner">
              <img src="<?php echo akshar_asset('career_pay_performance.jpg'); ?>" alt="Pay for Performance" class="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>
              <div class="absolute top-3.5 left-3.5 bg-brand-orange text-white text-xs font-black px-3.5 py-1.5 rounded-lg shadow-md uppercase tracking-wider">01 &bull; Performance</div>
            </div>
            <span class="text-[11px] font-extrabold text-brand-orange uppercase tracking-wider block mb-1">Meritocracy &amp; Incentives</span>
            <h3 class="text-xl sm:text-2xl font-black text-brand-dark group-hover:text-brand-orange transition-colors leading-snug mb-2">Pay for Performance</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">Transparent, performance-driven compensation rewarding technical precision, turnaround speed, and statutory rigor.</p>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-700 space-y-2">
            <div class="flex items-center gap-2"><span class="text-brand-orange font-black">&#10003;</span> Merit-based annual increments</div>
            <div class="flex items-center gap-2"><span class="text-brand-orange font-black">&#10003;</span> Direct site deployment premiums</div>
            <div class="flex items-center gap-2"><span class="text-brand-orange font-black">&#10003;</span> Milestone project profit-shares</div>
          </div>
        </div>

        <!-- Principle 2 -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-500 group flex flex-col justify-between h-full min-h-[580px] relative overflow-hidden">
          <div>
            <div class="relative overflow-hidden rounded-2xl h-60 sm:h-64 w-full mb-5 bg-slate-900 shadow-inner">
              <img src="<?php echo akshar_asset('career_culture.jpg'); ?>" alt="Engineering Culture" class="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>
              <div class="absolute top-3.5 left-3.5 bg-brand-blue text-white text-xs font-black px-3.5 py-1.5 rounded-lg shadow-md uppercase tracking-wider">02 &bull; Culture</div>
            </div>
            <span class="text-[11px] font-extrabold text-brand-blue uppercase tracking-wider block mb-1">Ethics &amp; Safety First</span>
            <h3 class="text-xl sm:text-2xl font-black text-brand-dark group-hover:text-brand-blue transition-colors leading-snug mb-2">Engineering Culture</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">Unconditional stop-work authority on site. Zero compromise on engineering ethics, quality, or personnel safety.</p>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-700 space-y-2">
            <div class="flex items-center gap-2"><span class="text-brand-blue font-black">&#10003;</span> Stop-work ethical authority</div>
            <div class="flex items-center gap-2"><span class="text-brand-blue font-black">&#10003;</span> Zero-harm HSE field mandate</div>
            <div class="flex items-center gap-2"><span class="text-brand-blue font-black">&#10003;</span> Open technical peer reviews</div>
          </div>
        </div>

        <!-- Principle 3 -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-500 group flex flex-col justify-between h-full min-h-[580px] relative overflow-hidden">
          <div>
            <div class="relative overflow-hidden rounded-2xl h-60 sm:h-64 w-full mb-5 bg-slate-900 shadow-inner">
              <img src="<?php echo akshar_asset('career_employment_policy.jpg'); ?>" alt="Employment Policy" class="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>
              <div class="absolute top-3.5 left-3.5 bg-brand-orange text-white text-xs font-black px-3.5 py-1.5 rounded-lg shadow-md uppercase tracking-wider">03 &bull; Policy</div>
            </div>
            <span class="text-[11px] font-extrabold text-brand-orange uppercase tracking-wider block mb-1">Statutory &amp; Governance</span>
            <h3 class="text-xl sm:text-2xl font-black text-brand-dark group-hover:text-brand-orange transition-colors leading-snug mb-2">Employment Policy</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">ISO/IEC 17020 Type-A impartiality governance with comprehensive family medical cover and transparent automated payroll.</p>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-700 space-y-2">
            <div class="flex items-center gap-2"><span class="text-brand-orange font-black">&#10003;</span> Conflict-of-interest shield</div>
            <div class="flex items-center gap-2"><span class="text-brand-orange font-black">&#10003;</span> Comprehensive medical cover</div>
            <div class="flex items-center gap-2"><span class="text-brand-orange font-black">&#10003;</span> Timely &amp; transparent payroll</div>
          </div>
        </div>

        <!-- Principle 4 -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-500 group flex flex-col justify-between h-full min-h-[580px] relative overflow-hidden">
          <div>
            <div class="relative overflow-hidden rounded-2xl h-60 sm:h-64 w-full mb-5 bg-slate-900 shadow-inner">
              <img src="<?php echo akshar_asset('career_personal_development.jpg'); ?>" alt="Personal Development" class="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>
              <div class="absolute top-3.5 left-3.5 bg-brand-blue text-white text-xs font-black px-3.5 py-1.5 rounded-lg shadow-md uppercase tracking-wider">04 &bull; Growth</div>
            </div>
            <span class="text-[11px] font-extrabold text-brand-blue uppercase tracking-wider block mb-1">Sponsorship &amp; Mentorship</span>
            <h3 class="text-xl sm:text-2xl font-black text-brand-dark group-hover:text-brand-blue transition-colors leading-snug mb-2">Personal Development</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">100% sponsored CSWIP, AWS, API, and ASNT Level III qualifications with dedicated senior surveyor QA mentorship.</p>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-700 space-y-2">
            <div class="flex items-center gap-2"><span class="text-brand-blue font-black">&#10003;</span> 100% sponsored certifications</div>
            <div class="flex items-center gap-2"><span class="text-brand-blue font-black">&#10003;</span> ASME &amp; API masterclasses</div>
            <div class="flex items-center gap-2"><span class="text-brand-blue font-black">&#10003;</span> Surveyor leadership QA roadmap</div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Typography Typewriter & 5-Sec Glowing CTA Section -->
  <section id="careersCtaSection" class="py-16 sm:py-20 bg-white border-t border-slate-200">
    <div class="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20 text-center">
      <div class="bg-gradient-to-br from-brand-navy via-brand-dark to-slate-900 text-white rounded-3xl p-10 sm:p-16 shadow-2xl relative overflow-hidden border border-slate-800 max-w-5xl mx-auto">
        
        <div class="relative z-10 space-y-6">
          <div class="inline-flex items-center gap-2 bg-brand-orange/20 text-brand-orange text-xs font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full border border-brand-orange/30 shadow-xs">
            <span class="w-2 h-2 rounded-full bg-brand-orange"></span>
            <span>Open Engineering Roles</span>
          </div>

          <!-- Dynamic Typewriter Typography Effect -->
          <h2 id="careerHeadingTypewriter" class="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight min-h-[3.5rem] sm:min-h-[5.5rem] flex items-center justify-center">
            <span id="typewriterText">Ready to Build Your Engineering Career with AES?</span><span id="typewriterCursor" class="text-brand-orange font-mono font-bold animate-pulse ml-0.5">|</span>
          </h2>

          <p class="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Take the leap. Explore our open roles across third-party mechanical inspection, welding QA/QC, NDT Level II/III, and API turnaround surveillance.
          </p>

          <!-- 5-Second Glowing Action Button -->
          <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a id="joinUsCtaBtn" href="<?php echo esc_url(home_url('/join-us')); ?>" class="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-orange-600 text-white font-bold text-sm uppercase tracking-wider px-9 py-3.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer">
              <span>Join Us</span>
              <span class="text-base">&rarr;</span>
            </a>
            <button onclick="openModal('inquiryModal')" class="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-sm uppercase tracking-wider px-7 py-3.5 rounded-xl transition-all cursor-pointer">
              <span>Contact Talent Desk</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </section>
</main>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    var headingText = "Ready to Build Your Engineering Career with AES?";
    var textElem = document.getElementById('typewriterText');
    var cursorElem = document.getElementById('typewriterCursor');
    var ctaBtn = document.getElementById('joinUsCtaBtn');
    var ctaSection = document.getElementById('careersCtaSection');
    var hasTyped = false;

    function startTypewriter() {
      if (hasTyped || !textElem) return;
      hasTyped = true;
      textElem.textContent = '';
      var charIdx = 0;
      var typingSpeed = 65; // ms per char (deliberate & smooth)

      function typeNext() {
        if (charIdx < headingText.length) {
          textElem.textContent += headingText.charAt(charIdx);
          charIdx++;
          setTimeout(typeNext, typingSpeed);
        } else {
          if (cursorElem) cursorElem.style.display = 'none';
          if (ctaBtn) {
            ctaBtn.classList.add('join-btn-glowing');
            setTimeout(function() {
              ctaBtn.classList.remove('join-btn-glowing');
            }, 5000);
          }
        }
      }
      typeNext();
    }

    if (ctaSection && 'IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
          startTypewriter();
          obs.unobserve(ctaSection);
        }
      }, { threshold: 0.25 });
      obs.observe(ctaSection);
    } else {
      startTypewriter();
    }
  });
</script>

<?php
get_footer();

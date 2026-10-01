<?php
/**
 * Template Name: Join Us (Open Roles & Job Application)
 *
 * @package Akshar_Theme
 */

get_header();
?>

<main id="main-content">
  <section class="py-14 sm:py-20 bg-white border-b border-slate-200">
    <div class="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20">
      <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-brand-orange transition-colors">Home</a>
        <span>/</span>
        <a href="<?php echo esc_url(home_url('/careers')); ?>" class="hover:text-brand-orange transition-colors">Careers</a>
        <span>/</span>
        <span class="text-brand-orange">Join Us</span>
      </nav>

      <div class="max-w-3xl">
        <span class="inline-block bg-brand-orange/10 text-brand-orange text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-brand-orange/20 mb-4">
          Open Engineering Opportunities
        </span>
        <h1 class="text-3xl sm:text-5xl font-black text-brand-dark tracking-tight mb-4 leading-tight">
          Explore Open Roles &amp; Apply
        </h1>
        <p class="text-slate-600 text-base sm:text-lg leading-relaxed">
          Join our multidisciplinary team of mechanical inspectors, welding engineers, NDT Level III specialists, and vendor auditors across high-value industrial projects.
        </p>
      </div>
    </div>
  </section>

  <!-- Open Roles & Application Form -->
  <section class="py-16 bg-slate-50">
    <div class="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <!-- Active Openings Column -->
        <div class="space-y-4">
          <h2 class="text-xl font-black text-brand-dark mb-4">Current Opportunities</h2>
          
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span class="text-[10px] font-black uppercase tracking-wider text-brand-orange bg-orange-50 px-2 py-0.5 rounded">Full-Time Field</span>
            <h3 class="text-base font-bold text-slate-900">Senior TPI Mechanical Inspector</h3>
            <p class="text-xs text-slate-500">API 510/570/653 &bull; Gujarat / Maharashtra &bull; 5+ Yrs Exp</p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span class="text-[10px] font-black uppercase tracking-wider text-brand-blue bg-blue-50 px-2 py-0.5 rounded">Full-Time Field</span>
            <h3 class="text-base font-bold text-slate-900">Welding Inspector (CSWIP / AWS)</h3>
            <p class="text-xs text-slate-500">Structural &amp; Piping &bull; Pan-India Field Deployment</p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span class="text-[10px] font-black uppercase tracking-wider text-brand-orange bg-orange-50 px-2 py-0.5 rounded">Office / Remote</span>
            <h3 class="text-base font-bold text-slate-900">QA/QC Documentation Engineer</h3>
            <p class="text-xs text-slate-500">EN 10204 3.2 &bull; Manufacturing Record Books (MRB)</p>
          </div>
        </div>

        <!-- Application Form Column -->
        <div class="lg:col-span-2">
          <div class="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg">
            <h2 class="text-2xl font-black text-brand-dark mb-6">Submit Your Application</h2>

            <form action="#" method="POST" onsubmit="event.preventDefault(); alert('Application submitted successfully! HR talent desk will review and contact shortlisted engineers.');" class="space-y-5 text-xs">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name *</label>
                  <input type="text" required placeholder="Aaditya Patel" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address *</label>
                  <input type="email" required placeholder="aaditya@engineer.com" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block font-bold text-slate-700 uppercase tracking-wider mb-2">Contact Phone *</label>
                  <input type="tel" required placeholder="+91 98XXXXXXXX" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 uppercase tracking-wider mb-2">Role Applying For *</label>
                  <select class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
                    <option>Senior TPI Mechanical Inspector</option>
                    <option>Welding Inspector (CSWIP 3.1 / AWS CWI)</option>
                    <option>NDT Level II / III Specialist</option>
                    <option>QA/QC Documentation Engineer</option>
                    <option>Vendor Assessment Auditor</option>
                    <option>Other Technical Role</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 uppercase tracking-wider mb-2">Attach Resume (PDF / DOC / DOCX) *</label>
                <div class="border-2 border-dashed border-slate-300 hover:border-brand-orange bg-slate-50 rounded-xl p-6 text-center transition-colors cursor-pointer relative group">
                  <input type="file" required accept=".pdf,.doc,.docx" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
                  <div class="flex flex-col items-center justify-center space-y-2">
                    <span class="text-2xl">&#128196;</span>
                    <p class="text-xs font-bold text-slate-800">Click or Drag &amp; Drop Your Resume</p>
                    <p class="text-[11px] text-slate-400">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                </div>
              </div>

              <button type="submit" class="btn-premium-orange w-full sm:w-auto text-white font-bold py-4 px-10 rounded-xl uppercase tracking-wider text-xs shadow-md">
                Submit Engineering Application &rarr;
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  </section>
</main>

<?php
get_footer();

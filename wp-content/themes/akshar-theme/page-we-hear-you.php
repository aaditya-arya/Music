<?php
/**
 * Template Name: We Hear You (Client Care)
 *
 * @package Akshar_Theme
 */

get_header();
?>

<main id="main-content">
  <section class="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
    <div class="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20">
      <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-brand-orange transition-colors">Home</a>
        <span>/</span>
        <span class="text-brand-orange">We Hear You</span>
      </nav>

      <div class="max-w-3xl">
        <span class="inline-block bg-brand-orange/10 text-brand-orange text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-brand-orange/20 mb-4">
          Direct Technical Desk &bull; Rapid Resolution
        </span>
        <h1 class="text-3xl sm:text-5xl font-black text-brand-dark tracking-tight mb-4 leading-tight">
          We Hear You
        </h1>
        <p class="text-slate-600 text-base sm:text-lg leading-relaxed">
          At Akshar Engineering Services, we listen to your operational challenges, quality observations, project feedback, and technical queries. Submit your request for rapid technical response.
        </p>
      </div>
    </div>
  </section>

  <!-- Submission Form & Contact Details -->
  <section class="py-16 bg-white">
    <div class="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <!-- Left: Contact Details & Guarantee -->
        <div class="space-y-6">
          <div class="bg-slate-50 p-8 rounded-3xl border border-slate-200">
            <h3 class="text-xl font-black text-brand-dark mb-4">Quality &amp; Client Support</h3>
            <div class="space-y-4 text-xs font-medium text-slate-600">
              <div>
                <span class="block text-[11px] font-black uppercase text-brand-orange mb-1">Direct Technical Desk</span>
                <a href="mailto:<?php echo esc_attr(get_theme_mod('company_email', 'info@aksharengineeringservices.com')); ?>" class="text-slate-900 font-bold hover:text-brand-orange text-sm"><?php echo esc_html(get_theme_mod('company_email', 'info@aksharengineeringservices.com')); ?></a>
              </div>
              <div>
                <span class="block text-[11px] font-black uppercase text-brand-orange mb-1">24/7 Operations Line</span>
                <a href="tel:<?php echo esc_attr(preg_replace('/[^0-9+]/', '', get_theme_mod('company_phone', '+91 8200441159'))); ?>" class="text-slate-900 font-bold hover:text-brand-orange text-sm"><?php echo esc_html(get_theme_mod('company_phone', '+91 8200441159')); ?></a>
              </div>
              <div class="pt-2">
                <span class="block text-[11px] font-black uppercase text-brand-orange mb-1">Central Technical Office</span>
                <p class="text-slate-800">Akshar Engineering Services Pvt. Ltd., Gujarat / Maharashtra, India</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Inquiry / Feedback Form -->
        <div class="lg:col-span-2">
          <div class="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg">
            <h2 class="text-2xl font-black text-brand-dark mb-6">Submit Your Technical Inquiry or Feedback</h2>
            
            <form action="#" method="POST" onsubmit="event.preventDefault(); alert('Message received! Our engineering desk will contact you within 2 hours.');" class="space-y-5 text-xs">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name *</label>
                  <input type="text" required placeholder="Rajesh Patel" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 uppercase tracking-wider mb-2">Company Name *</label>
                  <input type="text" required placeholder="L&amp;T Hydrocarbon" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block font-bold text-slate-700 uppercase tracking-wider mb-2">Work Email *</label>
                  <input type="email" required placeholder="rajesh@company.com" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 uppercase tracking-wider mb-2">Phone / WhatsApp *</label>
                  <input type="tel" required placeholder="+91 98XXXXXXXX" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 uppercase tracking-wider mb-2">Category *</label>
                <select class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
                  <option>New Inspection Scope Inquiry (TPI / Expediting / PDI)</option>
                  <option>Document / Report Authentication</option>
                  <option>Ongoing Surveillance Milestone Update</option>
                  <option>Vendor Audit &amp; Shop Assessment Request</option>
                  <option>General Corporate Feedback</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 uppercase tracking-wider mb-2">Message / Scope Description *</label>
                <textarea rows="4" required placeholder="Please provide equipment details, manufacturing location, and code requirements..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"></textarea>
              </div>

              <button type="submit" class="btn-premium-orange w-full sm:w-auto text-white font-bold py-4 px-10 rounded-xl uppercase tracking-wider text-xs shadow-md">
                Transmit Message &rarr;
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

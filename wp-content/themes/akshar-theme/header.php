<?php
/**
 * Akshar Engineering Services - Header Template
 *
 * @package Akshar_Theme
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="scroll-smooth">
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="<?php echo akshar_asset('logo.png'); ?>" type="image/png">
  <?php wp_head(); ?>
  
  <style>
    body {
      font-feature-settings: "cv02", "cv03", "cv04", "cv11";
      -webkit-font-smoothing: antialiased;
    }
    .modal-backdrop {
      background-color: rgba(11, 22, 51, 0.78);
      backdrop-filter: blur(6px);
    }
  </style>
</head>
<body <?php body_class('bg-white text-slate-800 font-sans antialiased selection:bg-brand-orange selection:text-white relative'); ?>>
<?php wp_body_open(); ?>

  <!-- ================================================================= -->
  <!-- FULL-WIDTH HEADER (Logo Left, Nav Right)                          -->
  <!-- ================================================================= -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm relative">
    <div class="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20 flex justify-between items-center h-24 sm:h-28">
      
      <!-- Left Logo -->
      <a href="<?php echo esc_url(home_url('/')); ?>" class="flex items-center space-x-3 shrink-0 py-2">
        <img src="<?php echo akshar_asset('logo.png'); ?>" alt="<?php bloginfo('name'); ?>" class="h-16 sm:h-20 md:h-24 max-h-24 w-auto object-contain transition-transform duration-300 hover:scale-105">
      </a>

      <!-- Right Menubar -->
      <nav class="hidden lg:flex items-center justify-end space-x-8 text-base sm:text-lg font-extrabold shrink-0">
        <a href="<?php echo esc_url(home_url('/about')); ?>" class="<?php echo is_page('about') ? 'text-brand-orange' : 'text-brand-blue hover:text-brand-orange'; ?> transition-colors duration-300">About Us</a>
        
        <div class="nav-item-dropdown relative group py-6 flex items-center">
          <a href="<?php echo esc_url(home_url('/services')); ?>" class="<?php echo (is_page('services') || is_singular('service')) ? 'text-brand-orange' : 'text-brand-blue hover:text-brand-orange'; ?> text-base sm:text-lg font-extrabold flex items-center gap-1.5 transition-colors duration-300">
            Service
            <svg class="w-4 h-4 text-brand-blue group-hover:text-brand-orange transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
          </a>
          <div class="mega-dropdown-menu absolute top-full left-1/2 -translate-x-1/2 w-72 bg-[#0b1633] border border-slate-700/80 shadow-2xl rounded-2xl py-2 invisible opacity-0 z-50 transition-all flex flex-col text-left divide-y divide-white/10">
            <a href="<?php echo esc_url(home_url('/service-tpi')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Third Party Inspection</a>
            <a href="<?php echo esc_url(home_url('/service-vendor-assessment')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Vendor Assessment</a>
            <a href="<?php echo esc_url(home_url('/service-qa-qc-documentation')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">QA/QC Documentation</a>
            <a href="<?php echo esc_url(home_url('/service-pre-shipment-inspection')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Pre-Shipment Inspection</a>
            <a href="<?php echo esc_url(home_url('/service-welding-engineering')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Welding Engineering</a>
            <a href="<?php echo esc_url(home_url('/service-ndt-inspection')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">NDT Inspection Services</a>
            <a href="<?php echo esc_url(home_url('/service-expediting')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Expediting Services</a>
            <a href="<?php echo esc_url(home_url('/service-design-examination')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Design Examination</a>
            <a href="<?php echo esc_url(home_url('/service-project-shutdown-qa')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Project &amp; Shutdown QA</a>
            <a href="<?php echo esc_url(home_url('/service-international-sourcing')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">International Sourcing</a>
            <a href="<?php echo esc_url(home_url('/service-performance-hydro-tests')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Performance &amp; Hydro-Tests</a>
            <a href="<?php echo esc_url(home_url('/service-process-qualification')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Process Qualification</a>
            <a href="<?php echo esc_url(home_url('/service-api-tank-inspection')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">API Tank Inspection</a>
            <a href="<?php echo esc_url(home_url('/service-owners-engineer')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Owner's Engineer</a>
            <a href="<?php echo esc_url(home_url('/service-process-piping')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Process Piping (B31.3)</a>
            <a href="<?php echo esc_url(home_url('/service-training')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">QA/QC &amp; NDT Training</a>
          </div>
        </div>

        <a href="<?php echo esc_url(home_url('/we-hear-you')); ?>" class="<?php echo is_page('we-hear-you') ? 'text-brand-orange' : 'text-brand-blue hover:text-brand-orange'; ?> transition-colors duration-300">We hear you</a>
      </nav>

      <!-- Mobile Menu Button -->
      <div class="flex lg:hidden justify-end">
        <button id="mobile-menu-btn" type="button" class="p-2 text-brand-blue hover:text-brand-orange rounded-md border border-slate-200" aria-label="Open Navigation">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Nav Menu -->
    <div id="mobile-menu" class="hidden lg:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-3">
      <a href="<?php echo esc_url(home_url('/about')); ?>" class="block text-base font-bold text-brand-blue hover:text-brand-orange">About Us</a>
      <a href="<?php echo esc_url(home_url('/services')); ?>" class="block text-base font-bold text-brand-blue hover:text-brand-orange">Service</a>
      <a href="<?php echo esc_url(home_url('/we-hear-you')); ?>" class="block text-base font-bold text-brand-blue hover:text-brand-orange">We hear you</a>
    </div>
  </header>

  <!-- ================================================================= -->
  <!-- STICKY RIGHT SIDEBAR BUTTONS (No icons, text only)                -->
  <!-- ================================================================= -->
  <aside aria-label="Quick Action Floating Desk" class="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col space-y-2.5">
    <button onclick="openModal('inquiryModal')" class="bg-brand-orange hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider py-4 px-3 rounded-l-xl shadow-xl flex items-center justify-center transition-transform hover:-translate-x-2 [writing-mode:vertical-rl] rotate-180 cursor-pointer group">
      <span>Quick Reach / Inquiry</span>
    </button>
    <button onclick="openModal('trainingModal')" class="bg-brand-blue hover:bg-brand-dark text-white font-bold text-xs uppercase tracking-wider py-4 px-3 rounded-l-xl shadow-xl flex items-center justify-center transition-transform hover:-translate-x-2 [writing-mode:vertical-rl] rotate-180 cursor-pointer group">
      <span>Training Registration</span>
    </button>
  </aside>

  <!-- FLOATING WHATSAPP BUTTON -->
  <aside aria-label="Quick WhatsApp Contact" class="fixed bottom-6 right-6 z-50">
    <a href="https://wa.me/<?php echo preg_replace('/[^0-9]/', '', get_theme_mod('company_phone', '918200441159')); ?>" target="_blank" rel="noopener noreferrer" class="group flex items-center bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110" aria-label="Chat on WhatsApp">
      <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
  </aside>

<?php
/**
 * The Header for Akshar Engineering Theme
 *
 * @package Akshar_Engineering
 */
$theme_uri = get_template_directory_uri();
?><!DOCTYPE html>
<html <?php language_attributes(); ?> class="scroll-smooth">
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="profile" href="https://gmpg.org/xfn/11">
  <?php wp_head(); ?>
</head>
<body <?php body_class('bg-white text-slate-800 font-sans antialiased selection:bg-brand-orange selection:text-white relative'); ?>>
<?php wp_body_open(); ?>

  <!-- ================================================================= -->
  <!-- 1. FULL-WIDTH HEADER (Logo Left, Nav Right)                       -->
  <!-- ================================================================= -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm relative">
    <div class="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20 flex justify-between items-center h-24 sm:h-28">
      
      <!-- Left Logo -->
      <a href="<?php echo esc_url(home_url('/')); ?>" class="flex items-center space-x-3 shrink-0 py-2">
        <img src="<?php echo esc_url($theme_uri . '/assets/logo.png'); ?>" alt="<?php bloginfo('name'); ?>" class="h-16 sm:h-20 md:h-24 max-h-24 w-auto object-contain transition-transform duration-300 hover:scale-105">
      </a>

      <!-- Right Menubar -->
      <nav class="hidden lg:flex items-center justify-end space-x-8 text-base sm:text-lg font-extrabold shrink-0">
        <a href="<?php echo esc_url(home_url('/about-us/')); ?>" class="text-brand-blue hover:text-brand-orange transition-colors duration-300">About Us</a>
        
        <div class="nav-item-dropdown relative group py-6 flex items-center">
          <a href="<?php echo esc_url(home_url('/services/')); ?>" class="text-brand-blue hover:text-brand-orange text-base sm:text-lg font-extrabold flex items-center gap-1.5 transition-colors duration-300">
            Service
            <svg class="w-4 h-4 text-brand-blue group-hover:text-brand-orange transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
          </a>
          <div class="mega-dropdown-menu absolute top-full left-1/2 -translate-x-1/2 w-72 bg-[#0b1633] border border-slate-700/80 shadow-2xl rounded-2xl py-2 invisible opacity-0 z-50 transition-all flex flex-col text-left divide-y divide-white/10 max-h-[75vh] overflow-y-auto">
            <a href="<?php echo esc_url(home_url('/service-tpi/')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Third Party Inspection</a>
            <a href="<?php echo esc_url(home_url('/service-vendor-assessment/')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Vendor Assessment</a>
            <a href="<?php echo esc_url(home_url('/service-qa-qc-documentation/')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">QA/QC Documentation</a>
            <a href="<?php echo esc_url(home_url('/service-pre-shipment-inspection/')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Pre-Shipment Inspection</a>
            <a href="<?php echo esc_url(home_url('/service-welding-engineering/')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Welding Engineering</a>
            <a href="<?php echo esc_url(home_url('/service-ndt-inspection/')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">NDT Inspection Services</a>
            <a href="<?php echo esc_url(home_url('/service-expediting/')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Expediting Services</a>
            <a href="<?php echo esc_url(home_url('/service-design-examination/')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Design Examination</a>
            <a href="<?php echo esc_url(home_url('/service-project-shutdown-qa/')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Project &amp; Shutdown QA</a>
            <a href="<?php echo esc_url(home_url('/service-international-sourcing/')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">International Sourcing</a>
            <a href="<?php echo esc_url(home_url('/service-performance-hydro-tests/')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Performance &amp; Hydro-Tests</a>
            <a href="<?php echo esc_url(home_url('/service-process-qualification/')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Process Qualification</a>
            <a href="<?php echo esc_url(home_url('/service-api-tank-inspection/')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">API Tank Inspection</a>
            <a href="<?php echo esc_url(home_url('/service-owners-engineer/')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Owner's Engineer</a>
            <a href="<?php echo esc_url(home_url('/service-process-piping/')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">Process Piping (B31.3)</a>
            <a href="<?php echo esc_url(home_url('/service-training/')); ?>" class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors">QA/QC &amp; NDT Training</a>
          </div>
        </div>

        <a href="<?php echo esc_url(home_url('/we-hear-you/')); ?>" class="text-brand-blue hover:text-brand-orange transition-colors duration-300">We hear you</a>
      </nav>

      <!-- Mobile Menu Button -->
      <div class="flex lg:hidden justify-end">
        <button id="mobile-menu-btn" type="button" class="p-2 text-brand-blue hover:text-brand-orange rounded-md border border-slate-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Nav Menu -->
    <div id="mobile-menu" class="hidden lg:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-3">
      <a href="<?php echo esc_url(home_url('/about-us/')); ?>" class="block text-base font-bold text-brand-blue hover:text-brand-orange">About Us</a>
      <a href="<?php echo esc_url(home_url('/services/')); ?>" class="block text-base font-bold text-brand-blue hover:text-brand-orange">Service</a>
      <a href="<?php echo esc_url(home_url('/we-hear-you/')); ?>" class="block text-base font-bold text-brand-blue hover:text-brand-orange">We hear you</a>
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

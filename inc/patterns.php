<?php
/**
 * Akshar Engineering Block Patterns
 *
 * @package Akshar_Engineering
 */

if (!defined('ABSPATH')) {
    exit;
}

function akshar_register_block_patterns() {
    $theme_uri = get_template_directory_uri();
    $home_url  = home_url('/');

    // 1. Signature Hero Banner (Managed via AES Slider Plugin)
    register_block_pattern(
        'akshar/hero-banner',
        [
            'title'       => __('Signature Hero Banner (AES Slider)', 'akshar-engineering'),
            'categories'  => ['akshar-patterns'],
            'description' => __('Signature full-width hero video banner managed via the AES Custom Slider plugin.', 'akshar-engineering'),
            'content'     => '<!-- wp:shortcode -->
[aes_hero_slider]
<!-- /wp:shortcode -->'
        ]
    );

    // 2. Company Journey & Vision
    register_block_pattern(
        'akshar/company-journey-vision',
        [
            'title'       => __('Company Journey & Vision', 'akshar-engineering'),
            'categories'  => ['akshar-patterns'],
            'description' => __('Company Journey narrative on left and Our Vision card on right.', 'akshar-engineering'),
            'content'     => '<!-- wp:group {"tagName":"section","align":"full","className":"py-20 bg-white border-b border-slate-200","layout":{"type":"constrained","contentSize":"1600px"}} -->
<section class="wp-block-group alignfull py-20 bg-white border-b border-slate-200"><!-- wp:columns {"className":"gap-12 items-stretch"} -->
<div class="wp-block-columns gap-12 items-stretch"><!-- wp:column {"width":"58.33%","className":"flex flex-col justify-center"} -->
<div class="wp-block-column flex flex-col justify-center" style="flex-basis:58.33%"><!-- wp:group {"className":"aes-heading-group mb-4","layout":{"type":"default"}} -->
<div class="wp-block-group aes-heading-group mb-4"><!-- wp:heading {"level":2,"className":"text-3xl font-black text-brand-dark tracking-tight"} -->
<h2 class="wp-block-heading text-3xl font-black text-brand-dark tracking-tight">Company Journey</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"aes-heading-accent"} -->
<p class="aes-heading-accent"></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"text-base text-slate-700 leading-relaxed mt-4 mb-4"} -->
<p class="text-base text-slate-700 leading-relaxed mt-4 mb-4"><strong>Akshar Engineering Services Pvt. Ltd.</strong> (Formerly known as Akshar Consultancy Services) is a professional third-party inspection services and project support organization delivering quality-focused technical solutions across various industries to achieve the best quality with impartiality, integrity, ethics, health, safety &amp; environment by delivering efficient, trustworthy, and client-centric services.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"text-base text-slate-600 leading-relaxed mb-6"} -->
<p class="text-base text-slate-600 leading-relaxed mb-6">Our multidisciplinary engineers safeguard capital investments through rigid adherence to statutory codes (ASME, API, AWS, ISO/EN) and approved quality assurance plans (QAP/ITP).</p>
<!-- /wp:paragraph -->

<!-- wp:columns {"className":"aes-stat-grid pt-4 border-t border-slate-100 text-center"} -->
<div class="wp-block-columns aes-stat-grid pt-4 border-t border-slate-100 text-center"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"aes-stat-box"} -->
<div class="wp-block-group aes-stat-box"><!-- wp:paragraph {"className":"aes-stat-num text-brand-blue"} -->
<p class="aes-stat-num text-brand-blue">100%</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"aes-stat-label"} -->
<p class="aes-stat-label">Impartial &amp; Neutral</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"aes-stat-box"} -->
<div class="wp-block-group aes-stat-box"><!-- wp:paragraph {"className":"aes-stat-num text-brand-orange"} -->
<p class="aes-stat-num text-brand-orange">24-48h</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"aes-stat-label"} -->
<p class="aes-stat-label">Field Mobilization</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"aes-stat-box"} -->
<div class="wp-block-group aes-stat-box"><!-- wp:paragraph {"className":"aes-stat-num text-brand-blue"} -->
<p class="aes-stat-num text-brand-blue">Certified</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"aes-stat-label"} -->
<p class="aes-stat-label">ASNT / CSWIP / NACE</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"41.67%","className":"flex"} -->
<div class="wp-block-column flex" style="flex-basis:41.67%"><!-- wp:group {"className":"aes-vision-card"} -->
<div class="wp-block-group aes-vision-card"><!-- wp:heading {"level":3,"className":"text-2xl font-black text-white mb-2"} -->
<h3 class="wp-block-heading text-2xl font-black text-white mb-2">Our Vision</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"aes-vision-bar"} -->
<p class="aes-vision-bar"></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"text-slate-200 text-base leading-relaxed mb-6"} -->
<p class="text-slate-200 text-base leading-relaxed mb-6">To become a trusted and recognized third-party inspection &amp; project engineering service organization by delivering reliable inspection, robust quality assurance, and ethical engineering solutions.</p>
<!-- /wp:paragraph -->

<!-- wp:list {"className":"aes-vision-list"} -->
<ul class="wp-block-list aes-vision-list"><!-- wp:list-item -->
<li>Zero tolerance for non-conformance</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Complete traceability &amp; auditability</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Immediate 24-hour flash reporting</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph {"className":"aes-vision-footer"} -->
<p class="aes-vision-footer">Committed to Health, Safety, Quality &amp; Environmental Sustainability.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->'
        ]
    );

    // 3. Core Services Grid
    register_block_pattern(
        'akshar/core-services',
        [
            'title'       => __('Core Services Cards', 'akshar-engineering'),
            'categories'  => ['akshar-patterns'],
            'description' => __('3 Featured Core Services cards with 50% slide-up drawer on hover.', 'akshar-engineering'),
            'content'     => '<!-- wp:group {"tagName":"section","align":"full","className":"py-20 bg-slate-50 border-b border-slate-200","layout":{"type":"constrained","contentSize":"1600px"}} -->
<section class="wp-block-group alignfull py-20 bg-slate-50 border-b border-slate-200"><!-- wp:group {"className":"max-w-2xl mx-auto mb-14 text-center","layout":{"type":"default"}} -->
<div class="wp-block-group max-w-2xl mx-auto mb-14 text-center"><!-- wp:group {"className":"inline-block","layout":{"type":"default"}} -->
<div class="wp-block-group inline-block"><!-- wp:heading {"textAlign":"center","level":2,"className":"text-3xl sm:text-4xl font-black text-brand-dark tracking-tight"} -->
<h2 class="wp-block-heading has-text-align-center text-3xl sm:text-4xl font-black text-brand-dark tracking-tight">Core Services</h2>
<!-- /wp:heading -->

<!-- wp:html -->
<div class="heading-line-track track-center mx-auto mt-2 mb-4"><div class="section-accent-line"></div></div>
<!-- /wp:html --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"align":"center","className":"text-base text-slate-600 mt-2"} -->
<p class="has-text-align-center text-base text-slate-600 mt-2">Comprehensive surveillance, expediting, auditing, and NDT engineering interventions for mission-critical industrial assets.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:columns {"className":"gap-6 text-left mb-8"} -->
<div class="wp-block-columns gap-6 text-left mb-8"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:html -->
<a href="' . esc_url($home_url . 'service-tpi/') . '" class="service-slide-card group relative h-[440px] bg-slate-900 border border-slate-200 rounded-2xl overflow-hidden shadow-md block">
  <img src="' . esc_url($theme_uri . '/assets/service_tpi.jpg') . '" alt="Third Party Inspection" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out">
  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none"></div>
  <div class="service-card-drawer absolute inset-x-0 bottom-0 p-6 z-10 bg-white/95 backdrop-blur-md border-t-2 border-brand-orange shadow-2xl">
    <h3 class="text-2xl font-black text-brand-dark leading-tight group-hover:text-brand-orange transition-colors duration-300">Third Party Inspection</h3>
    <div class="service-drawer-desc mt-3">
      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">Rigid technical surveillance ensuring complete conformance with client QAP, approved ITPs, and statutory international codes.</p>
      <div class="mt-4 pt-3 border-t border-slate-200 flex items-center text-xs font-bold text-brand-orange uppercase tracking-wider gap-1.5">
        <span>Explore Full Scope</span>
        <span class="text-sm transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </div>
    </div>
  </div>
</a>
<!-- /wp:html --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:html -->
<a href="' . esc_url($home_url . 'service-vendor-assessment/') . '" class="service-slide-card group relative h-[440px] bg-slate-900 border border-slate-200 rounded-2xl overflow-hidden shadow-md block">
  <img src="' . esc_url($theme_uri . '/assets/service_vendor_audit.jpg') . '" alt="Vendor Assessment" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out">
  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none"></div>
  <div class="service-card-drawer absolute inset-x-0 bottom-0 p-6 z-10 bg-white/95 backdrop-blur-md border-t-2 border-brand-orange shadow-2xl">
    <h3 class="text-2xl font-black text-brand-dark leading-tight group-hover:text-brand-orange transition-colors duration-300">Vendor Assessment</h3>
    <div class="service-drawer-desc mt-3">
      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">Exhaustive shop-floor capability verification protecting capital buyers against unproven fabricators and supply delays.</p>
      <div class="mt-4 pt-3 border-t border-slate-200 flex items-center text-xs font-bold text-brand-orange uppercase tracking-wider gap-1.5">
        <span>Explore Full Scope</span>
        <span class="text-sm transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </div>
    </div>
  </div>
</a>
<!-- /wp:html --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:html -->
<a href="' . esc_url($home_url . 'service-qa-qc-documentation/') . '" class="service-slide-card group relative h-[440px] bg-slate-900 border border-slate-200 rounded-2xl overflow-hidden shadow-md block">
  <img src="' . esc_url($theme_uri . '/assets/service_qa_qc.jpg') . '" alt="QA/QC Documentation" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out">
  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none"></div>
  <div class="service-card-drawer absolute inset-x-0 bottom-0 p-6 z-10 bg-white/95 backdrop-blur-md border-t-2 border-brand-orange shadow-2xl">
    <h3 class="text-2xl font-black text-brand-dark leading-tight group-hover:text-brand-orange transition-colors duration-300">QA/QC Documentation</h3>
    <div class="service-drawer-desc mt-3">
      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">Flawless technical record governance ensuring zero documentation hold-ups for plant commissioning and handover.</p>
      <div class="mt-4 pt-3 border-t border-slate-200 flex items-center text-xs font-bold text-brand-orange uppercase tracking-wider gap-1.5">
        <span>Explore Full Scope</span>
        <span class="text-sm transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </div>
    </div>
  </div>
</a>
<!-- /wp:html --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->'
        ]
    );

    // 4. Equipment & Asset Scope
    register_block_pattern(
        'akshar/equipment-scope',
        [
            'title'       => __('Equipment & Asset Scope', 'akshar-engineering'),
            'categories'  => ['akshar-patterns'],
            'description' => __('4 Human Readable Equipment & Asset Scope Cards with Standards.', 'akshar-engineering'),
            'content'     => '<!-- wp:group {"tagName":"section","align":"full","className":"py-20 bg-white border-b border-slate-200","layout":{"type":"constrained","contentSize":"1600px"}} -->
<section class="wp-block-group alignfull py-20 bg-white border-b border-slate-200"><!-- wp:group {"className":"max-w-3xl mb-14 text-center md:text-left","layout":{"type":"default"}} -->
<div class="wp-block-group max-w-3xl mb-14 text-center md:text-left"><!-- wp:group {"className":"aes-heading-group","layout":{"type":"default"}} -->
<div class="wp-block-group aes-heading-group"><!-- wp:heading {"level":2,"className":"text-3xl sm:text-4xl font-black text-brand-dark tracking-tight"} -->
<h2 class="wp-block-heading text-3xl sm:text-4xl font-black text-brand-dark tracking-tight">Equipment &amp; Asset Scope</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"w-full h-1.5 bg-brand-orange mt-2 mb-4 rounded-full"} -->
<p class="w-full h-1.5 bg-brand-orange mt-2 mb-4 rounded-full"></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"text-base text-slate-600 mt-2"} -->
<p class="text-base text-slate-600 mt-2">Disciplines and asset classes audited by our certified field surveyors across fabrication shops and raw material mills.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:columns {"className":"gap-8"} -->
<div class="wp-block-columns gap-8"><!-- wp:column {"width":"50%"} -->
<div class="wp-block-column" style="flex-basis:50%"><!-- wp:group {"className":"aes-equipment-card"} -->
<div class="wp-block-group aes-equipment-card"><!-- wp:group {"className":"aes-card-header","layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group aes-card-header"><!-- wp:paragraph {"className":"aes-card-badge"} -->
<p class="aes-card-badge">1</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"className":"text-2xl font-bold text-brand-dark"} -->
<h3 class="wp-block-heading text-2xl font-bold text-brand-dark">Basic Material</h3>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"text-sm text-slate-600 mb-6 leading-relaxed"} -->
<p class="text-sm text-slate-600 mb-6 leading-relaxed">Verification at steel mills, foundries, and stockyards covering plates, seamless and welded pipes, forged flanges, fittings, and castings.</p>
<!-- /wp:paragraph -->

<!-- wp:list {"className":"aes-card-list"} -->
<ul class="wp-block-list aes-card-list"><!-- wp:list-item -->
<li>Positive Material Identification (PMI via XRF/OES)</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Tensile, Charpy V-notch impact, and Hardness test witness</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Mill Test Certificate (MTC) verification &amp; heat correlation</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph {"className":"aes-card-footer"} -->
<p class="aes-card-footer">Standards: ASTM, ASME Sec II, EN 10204 Type 3.1 &amp; 3.2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"50%"} -->
<div class="wp-block-column" style="flex-basis:50%"><!-- wp:group {"className":"aes-equipment-card"} -->
<div class="wp-block-group aes-equipment-card"><!-- wp:group {"className":"aes-card-header","layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group aes-card-header"><!-- wp:paragraph {"className":"aes-card-badge"} -->
<p class="aes-card-badge">2</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"className":"text-2xl font-bold text-brand-dark"} -->
<h3 class="wp-block-heading text-2xl font-bold text-brand-dark">Fabricated Structures</h3>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"text-sm text-slate-600 mb-6 leading-relaxed"} -->
<p class="text-sm text-slate-600 mb-6 leading-relaxed">Surveillance at structural yards and piping shops covering process piping spools, heavy steel structures, modular skids, and manifolds.</p>
<!-- /wp:paragraph -->

<!-- wp:list {"className":"aes-card-list"} -->
<ul class="wp-block-list aes-card-list"><!-- wp:list-item -->
<li>Fit-up inspection, root gap, and bevel angle checks</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Weld visual audit, NDE witness, and PWHT chart review</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Hydrostatic pressure testing and isometric drawing validation</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph {"className":"aes-card-footer"} -->
<p class="aes-card-footer">Standards: ASME B31.3, ASME B31.1, AWS D1.1, EN 1090-2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:columns {"className":"gap-8 mt-8"} -->
<div class="wp-block-columns gap-8 mt-8"><!-- wp:column {"width":"50%"} -->
<div class="wp-block-column" style="flex-basis:50%"><!-- wp:group {"className":"aes-equipment-card"} -->
<div class="wp-block-group aes-equipment-card"><!-- wp:group {"className":"aes-card-header","layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group aes-card-header"><!-- wp:paragraph {"className":"aes-card-badge"} -->
<p class="aes-card-badge">3</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"className":"text-2xl font-bold text-brand-dark"} -->
<h3 class="wp-block-heading text-2xl font-bold text-brand-dark">Static Equipment</h3>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"text-sm text-slate-600 mb-6 leading-relaxed"} -->
<p class="text-sm text-slate-600 mb-6 leading-relaxed">Critical path inspection for pressure vessels, shell &amp; tube heat exchangers, storage tanks, columns, and industrial boilers.</p>
<!-- /wp:paragraph -->

<!-- wp:list {"className":"aes-card-list"} -->
<ul class="wp-block-list aes-card-list"><!-- wp:list-item -->
<li>Plate layout, shell rolling radius, and nozzle orientation audit</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Reinforcement pad pneumatic leak test &amp; radiographic film review</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Tube-to-tubesheet joint expansion torque &amp; hydro-test witness</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph {"className":"aes-card-footer"} -->
<p class="aes-card-footer">Standards: ASME Sec VIII Div 1/2, TEMA, API 650, API 620, IBR</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"50%"} -->
<div class="wp-block-column" style="flex-basis:50%"><!-- wp:group {"className":"aes-equipment-card"} -->
<div class="wp-block-group aes-equipment-card"><!-- wp:group {"className":"aes-card-header","layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group aes-card-header"><!-- wp:paragraph {"className":"aes-card-badge"} -->
<p class="aes-card-badge">4</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"className":"text-2xl font-bold text-brand-dark"} -->
<h3 class="wp-block-heading text-2xl font-bold text-brand-dark">Rotary Machinery</h3>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"text-sm text-slate-600 mb-6 leading-relaxed"} -->
<p class="text-sm text-slate-600 mb-6 leading-relaxed">Performance run auditing and factory acceptance testing for centrifugal pumps, gas compressors, industrial turbines, and gearboxes.</p>
<!-- /wp:paragraph -->

<!-- wp:list {"className":"aes-card-list"} -->
<ul class="wp-block-list aes-card-list"><!-- wp:list-item -->
<li>Rotor dynamic balancing witness (ISO 1940 Grade G2.5)</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Mechanical Run Test (MRT) with vibration and temperature logging</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Head, flow, and NPSH required (NPSHr) suppression curve audit</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph {"className":"aes-card-footer"} -->
<p class="aes-card-footer">Standards: API 610, API 617, API 618, ISO 10816</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->'
        ]
    );

    // 5. Sectors We Serve
    register_block_pattern(
        'akshar/sectors-we-serve',
        [
            'title'       => __('Sectors We Serve Cards', 'akshar-engineering'),
            'categories'  => ['akshar-patterns'],
            'description' => __('6 Featured Sectors with 50% slide-up drawer cards on hover.', 'akshar-engineering'),
            'content'     => '<!-- wp:group {"tagName":"section","align":"full","className":"py-20 bg-slate-50 border-b border-slate-200","layout":{"type":"constrained","contentSize":"1600px"}} -->
<section class="wp-block-group alignfull py-20 bg-slate-50 border-b border-slate-200"><!-- wp:group {"className":"max-w-3xl mb-14 text-center md:text-left","layout":{"type":"default"}} -->
<div class="wp-block-group max-w-3xl mb-14 text-center md:text-left"><!-- wp:group {"className":"inline-block","layout":{"type":"default"}} -->
<div class="wp-block-group inline-block"><!-- wp:heading {"level":2,"className":"text-3xl sm:text-4xl font-black text-brand-dark tracking-tight"} -->
<h2 class="wp-block-heading text-3xl sm:text-4xl font-black text-brand-dark tracking-tight">Sectors We Serve</h2>
<!-- /wp:heading -->

<!-- wp:html -->
<div class="heading-line-track mt-2 mb-4"><div class="section-accent-line"></div></div>
<!-- /wp:html --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"text-base text-slate-600 mt-2"} -->
<p class="text-base text-slate-600 mt-2">Dedicated quality assurance personnel deployed across capital-intensive engineering domains.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:columns {"className":"gap-6 sm:gap-8"} -->
<div class="wp-block-columns gap-6 sm:gap-8"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:html -->
<div class="service-slide-card group relative h-[400px] bg-slate-900 border border-slate-200 rounded-2xl overflow-hidden shadow-md block">
  <img src="' . esc_url($theme_uri . '/assets/sector_oil_gas.jpg') . '" alt="Oil & Gas" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out">
  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none"></div>
  <div class="service-card-drawer absolute inset-x-0 bottom-0 p-6 z-10 bg-white/95 backdrop-blur-md border-t-2 border-brand-orange shadow-2xl">
    <h3 class="text-xl sm:text-2xl font-black text-brand-dark leading-tight group-hover:text-brand-orange transition-colors duration-300">Oil &amp; Gas</h3>
    <div class="service-drawer-desc mt-3">
      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">Upstream manifolds, offshore drilling platforms, subsea pipelines, and sour service gas processing facilities.</p>
      <div class="mt-4 pt-3 border-t border-slate-200 flex items-center text-xs font-bold text-brand-orange uppercase tracking-wider gap-1.5">
        <span>Explore Sector Scope</span>
        <span class="text-sm transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </div>
    </div>
  </div>
</div>
<!-- /wp:html --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:html -->
<div class="service-slide-card group relative h-[400px] bg-slate-900 border border-slate-200 rounded-2xl overflow-hidden shadow-md block">
  <img src="' . esc_url($theme_uri . '/assets/sector_refinery.jpg') . '" alt="Refinery & Petrochemical" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out">
  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none"></div>
  <div class="service-card-drawer absolute inset-x-0 bottom-0 p-6 z-10 bg-white/95 backdrop-blur-md border-t-2 border-brand-orange shadow-2xl">
    <h3 class="text-xl sm:text-2xl font-black text-brand-dark leading-tight group-hover:text-brand-orange transition-colors duration-300">Refinery &amp; Petrochemical</h3>
    <div class="service-drawer-desc mt-3">
      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">Cracking towers, catalytic reforming vessels, hydrotreaters, and high-capacity storage tank farms.</p>
      <div class="mt-4 pt-3 border-t border-slate-200 flex items-center text-xs font-bold text-brand-orange uppercase tracking-wider gap-1.5">
        <span>Explore Sector Scope</span>
        <span class="text-sm transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </div>
    </div>
  </div>
</div>
<!-- /wp:html --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:html -->
<div class="service-slide-card group relative h-[400px] bg-slate-900 border border-slate-200 rounded-2xl overflow-hidden shadow-md block">
  <img src="' . esc_url($theme_uri . '/assets/sector_power_plant.jpg') . '" alt="Power Plants" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out">
  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none"></div>
  <div class="service-card-drawer absolute inset-x-0 bottom-0 p-6 z-10 bg-white/95 backdrop-blur-md border-t-2 border-brand-orange shadow-2xl">
    <h3 class="text-xl sm:text-2xl font-black text-brand-dark leading-tight group-hover:text-brand-orange transition-colors duration-300">Power Plants</h3>
    <div class="service-drawer-desc mt-3">
      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">Supercritical thermal boilers, combined cycle heat recovery steam generators (HRSG), and turbine halls.</p>
      <div class="mt-4 pt-3 border-t border-slate-200 flex items-center text-xs font-bold text-brand-orange uppercase tracking-wider gap-1.5">
        <span>Explore Sector Scope</span>
        <span class="text-sm transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </div>
    </div>
  </div>
</div>
<!-- /wp:html --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:columns {"className":"gap-6 sm:gap-8 mt-6 sm:mt-8"} -->
<div class="wp-block-columns gap-6 sm:gap-8 mt-6 sm:mt-8"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:html -->
<div class="service-slide-card group relative h-[400px] bg-slate-900 border border-slate-200 rounded-2xl overflow-hidden shadow-md block">
  <img src="' . esc_url($theme_uri . '/assets/sector_renewables.jpg') . '" alt="Renewable Energy" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out">
  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none"></div>
  <div class="service-card-drawer absolute inset-x-0 bottom-0 p-6 z-10 bg-white/95 backdrop-blur-md border-t-2 border-brand-orange shadow-2xl">
    <h3 class="text-xl sm:text-2xl font-black text-brand-dark leading-tight group-hover:text-brand-orange transition-colors duration-300">Renewable Energy</h3>
    <div class="service-drawer-desc mt-3">
      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">Utility-scale solar module testing, tracker foundations, wind turbine tower weldments, and green hydrogen skids.</p>
      <div class="mt-4 pt-3 border-t border-slate-200 flex items-center text-xs font-bold text-brand-orange uppercase tracking-wider gap-1.5">
        <span>Explore Sector Scope</span>
        <span class="text-sm transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </div>
    </div>
  </div>
</div>
<!-- /wp:html --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:html -->
<div class="service-slide-card group relative h-[400px] bg-slate-900 border border-slate-200 rounded-2xl overflow-hidden shadow-md block">
  <img src="' . esc_url($theme_uri . '/assets/sector_civil_infra.jpg') . '" alt="Civil Construction" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out">
  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none"></div>
  <div class="service-card-drawer absolute inset-x-0 bottom-0 p-6 z-10 bg-white/95 backdrop-blur-md border-t-2 border-brand-orange shadow-2xl">
    <h3 class="text-xl sm:text-2xl font-black text-brand-dark leading-tight group-hover:text-brand-orange transition-colors duration-300">Civil Construction</h3>
    <div class="service-drawer-desc mt-3">
      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">Major highway bridge viaducts, metro rail frameworks, precast girder alignments, and heavy structural assemblies.</p>
      <div class="mt-4 pt-3 border-t border-slate-200 flex items-center text-xs font-bold text-brand-orange uppercase tracking-wider gap-1.5">
        <span>Explore Sector Scope</span>
        <span class="text-sm transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </div>
    </div>
  </div>
</div>
<!-- /wp:html --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:html -->
<div class="service-slide-card group relative h-[400px] bg-slate-900 border border-slate-200 rounded-2xl overflow-hidden shadow-md block">
  <img src="' . esc_url($theme_uri . '/assets/sector_heavy_fab.jpg') . '" alt="Heavy Fabrication" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out">
  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none"></div>
  <div class="service-card-drawer absolute inset-x-0 bottom-0 p-6 z-10 bg-white/95 backdrop-blur-md border-t-2 border-brand-orange shadow-2xl">
    <h3 class="text-xl sm:text-2xl font-black text-brand-dark leading-tight group-hover:text-brand-orange transition-colors duration-300">Heavy Fabrication</h3>
    <div class="service-drawer-desc mt-3">
      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">OEM machinery manufacturing, heavy crane structures, mining equipment frames, and critical material handling assemblies.</p>
      <div class="mt-4 pt-3 border-t border-slate-200 flex items-center text-xs font-bold text-brand-orange uppercase tracking-wider gap-1.5">
        <span>Explore Sector Scope</span>
        <span class="text-sm transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </div>
    </div>
  </div>
</div>
<!-- /wp:html --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->'
        ]
    );

    // 6. Companies We Served
    register_block_pattern(
        'akshar/companies-we-served',
        [
            'title'       => __('Companies We Served Marquee', 'akshar-engineering'),
            'categories'  => ['akshar-patterns'],
            'description' => __('Continuous scrolling marquee for partner/client logos from index.html.', 'akshar-engineering'),
            'content'     => '<!-- wp:group {"tagName":"section","align":"full","className":"py-20 bg-slate-50 border-b border-slate-200 overflow-hidden relative","layout":{"type":"constrained","contentSize":"1600px"}} -->
<section class="wp-block-group alignfull py-20 bg-slate-50 border-b border-slate-200 overflow-hidden relative"><!-- wp:group {"className":"max-w-2xl mx-auto text-center mb-10","layout":{"type":"default"}} -->
<div class="wp-block-group max-w-2xl mx-auto text-center mb-10"><!-- wp:group {"className":"inline-block","layout":{"type":"default"}} -->
<div class="wp-block-group inline-block"><!-- wp:heading {"textAlign":"center","level":2,"className":"text-3xl sm:text-4xl font-black text-brand-dark tracking-tight"} -->
<h2 class="wp-block-heading has-text-align-center text-3xl sm:text-4xl font-black text-brand-dark tracking-tight">Companies We Served</h2>
<!-- /wp:heading -->

<!-- wp:html -->
<div class="w-full h-1.5 bg-brand-orange mt-2 mb-4 rounded-full mx-auto"></div>
<!-- /wp:html --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"align":"center","className":"text-sm sm:text-base text-slate-600 mt-2"} -->
<p class="has-text-align-center text-sm sm:text-base text-slate-600 mt-2">Empaneled and approved third-party technical inspection partner for premier EPC contractors, project developers, and heavy industrial manufacturers.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:shortcode -->
[aes_client_marquee]
<!-- /wp:shortcode --></section>
<!-- /wp:group -->'
        ]
    );
}
add_action('init', 'akshar_register_block_patterns');

<?php
/**
 * Template Name: Services Page
 *
 * @package Akshar_Theme
 */

get_header();
?>

<main id="main-content">
  <!-- Hero Section -->
  <section class="pt-8 pb-8 sm:pt-10 sm:pb-10 bg-slate-50 border-b border-slate-200">
    <div class="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20">
      <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-slate-800 transition-colors">Home</a>
        <span>/</span>
        <span class="text-brand-orange">Services</span>
      </nav>

      <div class="max-w-3xl">
        <span class="inline-block bg-brand-orange/10 text-brand-orange text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-brand-orange/20 mb-3">
          Comprehensive Quality Assurance Portfolio
        </span>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-dark tracking-tight mb-3 leading-tight">
          Specialized Engineering &amp; Inspection Services
        </h1>
        <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
          Delivering independent vendor surveillance, fabrication QA/QC, and technical audits for critical industrial assets globally.
        </p>
      </div>
    </div>
  </section>

  <!-- 16 Services Grid -->
  <section class="py-10 sm:py-14 bg-white">
    <div class="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        <?php
        $services = array(
          array('slug' => 'tpi', 'title' => 'Third Party Inspection', 'sub' => 'Hold & Witness Surveillance', 'img' => 'service_tpi.jpg', 'std' => 'ISO 17020', 'desc' => 'Independent witness and hold point inspection during manufacturing to ensure full compliance with approved ITPs and international codes.'),
          array('slug' => 'vendor-assessment', 'title' => 'Vendor Assessment', 'sub' => 'Shop Audit & QMS', 'img' => 'service_vendor_audit.jpg', 'std' => 'ISO 9001', 'desc' => 'Rigorous shop approval, facility capacity verification, and manufacturing competence auditing to mitigate supply chain risk.'),
          array('slug' => 'qa-qc-documentation', 'title' => 'QA/QC Documentation', 'sub' => 'MDR Dossier & Traceability', 'img' => 'service_qa_qc.jpg', 'std' => 'EN 10204 3.2', 'desc' => 'Comprehensive Manufacturer Data Report (MDR) review, welder log auditing, and EN 10204 Type 3.2 material certification.'),
          array('slug' => 'pre-shipment-inspection', 'title' => 'Pre-Shipment Inspection', 'sub' => 'Pre-Dispatch & Packing', 'img' => 'service_pre_dispatch.jpg', 'std' => 'IRN Certified', 'desc' => 'Final physical quantity verification, preservation and crating inspection, and Inspection Release Note (IRN) sign-off.'),
          array('slug' => 'welding-engineering', 'title' => 'Welding Engineering', 'sub' => 'WPS / PQR / WPQ', 'img' => 'service_welding_nde.jpg', 'std' => 'ASME IX / AWS', 'desc' => 'CSWIP 3.1 & AWS CWI welding inspection, procedure qualification, and welder performance certification.'),
          array('slug' => 'ndt-inspection', 'title' => 'NDT Inspection Services', 'sub' => 'Level II & III Surveillance', 'img' => 'service_welding_nde.jpg', 'std' => 'ASNT SNT-TC-1A', 'desc' => 'Surveillance and verification of Ultrasonic, Radiographic, Magnetic Particle, and Liquid Penetrant testing.'),
          array('slug' => 'expediting', 'title' => 'Expediting Services', 'sub' => 'Project Timeline Auditing', 'img' => 'service_expediting.jpg', 'std' => 'CPM Schedule', 'desc' => 'On-site vendor expediting to prevent bottlenecks, verify raw material procurement, and ensure on-time EPC delivery.'),
          array('slug' => 'design-examination', 'title' => 'Design Examination', 'sub' => 'Calculation & Drawing Audit', 'img' => 'service_design_audit.jpg', 'std' => 'ASME VIII / B31.3', 'desc' => 'Independent third-party verification of engineering calculations, fabrication drawings, and finite element models.'),
          array('slug' => 'project-shutdown-qa', 'title' => 'Project & Shutdown QA', 'sub' => 'Turnaround & Plant Integrity', 'img' => 'service_plant_shutdown.jpg', 'std' => 'Turnaround QA', 'desc' => 'High-tempo turnaround quality assurance for refinery and chemical plant turnarounds and statutory inspections.'),
          array('slug' => 'international-sourcing', 'title' => 'International Sourcing', 'sub' => 'Global Vendor Surveillance', 'img' => 'service_global_sourcing.jpg', 'std' => 'Global Reach', 'desc' => 'International vendor surveillance across Europe, Middle East, and Asia guaranteeing imported component quality.'),
          array('slug' => 'performance-hydro-tests', 'title' => 'Performance & Hydro-Tests', 'sub' => 'Pressure & Functional Witness', 'img' => 'service_hydrotest.jpg', 'std' => 'API 610 / ASME', 'desc' => 'Witnessing hydrostatic, pneumatic pressure tests, and pump performance curves for static and rotating machinery.'),
          array('slug' => 'process-qualification', 'title' => 'Process Qualification', 'sub' => 'Coating & Heat Treatment', 'img' => 'service_coating.jpg', 'std' => 'NACE / SSPC', 'desc' => 'Technical qualification of specialized processes: surface preparation, NACE coating, galvanizing, and PWHT.'),
          array('slug' => 'api-tank-inspection', 'title' => 'API Tank Inspection', 'sub' => 'API 650 & 653 Integrity', 'img' => 'service_api_tank.jpg', 'std' => 'API 650 / 653', 'desc' => 'Storage tank bottom plate MFL scanning, settlement evaluation, shell verticality, and floating roof inspection.'),
          array('slug' => 'owners-engineer', 'title' => 'Owner\'s Engineer', 'sub' => 'Client Representation', 'img' => 'service_pipeline_audit.jpg', 'std' => 'Project QA', 'desc' => 'Acting as owner’s trusted technical representative across EPC contract lifecycle, site QA/QC, and commissioning.'),
          array('slug' => 'process-piping', 'title' => 'Process Piping (B31.3)', 'sub' => 'ASME B31.3 Spool Audit', 'img' => 'service_piping_spool.jpg', 'std' => 'ASME B31.3', 'desc' => 'Shop fabrication fit-up, root pass inspection, isometric drawing correlation, and hydro-testing for piping spools.'),
          array('slug' => 'training', 'title' => 'QA/QC & NDT Training', 'sub' => 'Corporate Upskilling', 'img' => 'service_ndt_training.jpg', 'std' => 'Certified Courses', 'desc' => 'Corporate certification in ASNT Level II NDT methods, welding inspection, and ISO 9001/17020 internal auditing.')
        );

        foreach ($services as $srv):
        ?>
        <a href="<?php echo esc_url(home_url('/service-' . $srv['slug'])); ?>" class="service-slide-card group relative h-[430px] bg-slate-900 border border-slate-200 rounded-2xl overflow-hidden shadow-md block">
          <img src="<?php echo akshar_asset($srv['img']); ?>" alt="<?php echo esc_attr($srv['title']); ?>" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none"></div>
          
          <div class="service-card-drawer absolute inset-x-0 bottom-0 p-5 z-10 bg-white/95 backdrop-blur-md border-t-2 border-brand-orange shadow-2xl">
            <span class="text-[11px] font-black text-brand-orange uppercase tracking-wider block mb-1"><?php echo esc_html($srv['sub']); ?></span>
            <h3 class="text-lg sm:text-xl font-black text-brand-dark leading-snug group-hover:text-brand-orange transition-colors duration-300">
              <?php echo esc_html($srv['title']); ?>
            </h3>
            <div class="service-drawer-desc mt-2.5">
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <?php echo esc_html($srv['desc']); ?>
              </p>
            </div>
          </div>
        </a>
        <?php endforeach; ?>

      </div>
    </div>
  </section>
</main>

<?php
get_footer();

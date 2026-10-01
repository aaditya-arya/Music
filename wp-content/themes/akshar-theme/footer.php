<?php
/**
 * Akshar Engineering Services - Footer Template
 *
 * @package Akshar_Theme
 */

$brochure_pdf_url = get_theme_mod('brochure_pdf_url', akshar_asset('Company Profile.pdf'));
$brochure_flipbook_url = get_theme_mod('brochure_flipbook_url', 'https://heyzine.com/flip-book/4b6632ed19.html');
$company_phone = get_theme_mod('company_phone', '+91 8200441159');
$company_email = get_theme_mod('company_email', 'info@aksharengineeringservices.com');
?>

  <!-- ================================================================= -->
  <!-- CORPORATE FOOTER (CLASSIC BLUE THEME)                             -->
  <!-- ================================================================= -->
  <footer class="relative bg-brand-navy text-slate-300 text-sm border-t border-slate-800">
    <div class="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        <div class="lg:col-span-2 space-y-4">
          <a href="<?php echo esc_url(home_url('/')); ?>" class="inline-block bg-white p-2.5 rounded-xl shadow-md">
            <img src="<?php echo akshar_asset('logo.png'); ?>" alt="<?php bloginfo('name'); ?>" class="h-14 sm:h-16 w-auto object-contain">
          </a>
          <p class="text-slate-300 text-sm leading-relaxed max-w-md font-normal">
            Akshar Engineering Services Pvt. Ltd. delivers independent third-party inspection, vendor quality surveillance, and technical assurance across global industrial supply chains.
          </p>
          <div class="text-xs text-slate-400 space-y-1.5 font-medium pt-2">
            <div>Email: <a href="mailto:<?php echo esc_attr($company_email); ?>" class="text-slate-200 hover:text-brand-orange transition-colors font-semibold"><?php echo esc_html($company_email); ?></a></div>
            <div>Phone: <a href="tel:<?php echo esc_attr(preg_replace('/[^0-9+]/', '', $company_phone)); ?>" class="text-slate-200 hover:text-brand-orange transition-colors font-semibold"><?php echo esc_html($company_phone); ?></a></div>
          </div>
        </div>

        <div>
          <span class="block font-black text-white text-xs uppercase tracking-wider mb-4">Navigation</span>
          <ul class="space-y-2.5 text-sm">
            <li><a href="<?php echo esc_url(home_url('/')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Home</a></li>
            <li><a href="<?php echo esc_url(home_url('/about')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">About Us</a></li>
            <li><a href="<?php echo esc_url(home_url('/services')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Services</a></li>
            <li><a href="<?php echo esc_url(home_url('/careers')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Careers at AES</a></li>
            <li><a href="<?php echo esc_url(home_url('/join-us')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Join Us (Open Roles)</a></li>
            <li><a href="<?php echo esc_url(home_url('/we-hear-you')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">We Hear You</a></li>
            <li><a href="javascript:void(0)" onclick="openModal('verifyDocModal')" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Verify Document</a></li>
            <li><a href="javascript:void(0)" onclick="openModal('companyProfileModal')" class="text-brand-orange hover:text-white transition-colors font-bold flex items-center gap-1.5"><span class="text-base">&#128214;</span> Company Brochure</a></li>
          </ul>
        </div>

        <div>
          <span class="block font-black text-white text-xs uppercase tracking-wider mb-4">Key Services</span>
          <ul class="space-y-2.5 text-sm">
            <li><a href="<?php echo esc_url(home_url('/service-tpi')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Third Party Inspection (TPI)</a></li>
            <li><a href="<?php echo esc_url(home_url('/service-vendor-assessment')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Vendor Assessment &amp; Audit</a></li>
            <li><a href="<?php echo esc_url(home_url('/service-qa-qc-documentation')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">QA/QC Documentation &amp; MRB</a></li>
            <li><a href="<?php echo esc_url(home_url('/service-pre-shipment-inspection')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Pre-Shipment &amp; Pre-Despatch</a></li>
            <li><a href="<?php echo esc_url(home_url('/service-welding-engineering')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Welding Engineering &amp; Inspection</a></li>
            <li><a href="<?php echo esc_url(home_url('/service-ndt-inspection')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">NDT Inspection (UT/RT/MPT/DPT)</a></li>
            <li><a href="<?php echo esc_url(home_url('/service-expediting')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Project Expediting &amp; Sourcing</a></li>
            <li><a href="<?php echo esc_url(home_url('/service-api-tank-inspection')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">API Tank &amp; Piping Inspection</a></li>
          </ul>
        </div>

      </div>

      <div class="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
        <div>
          &copy; <?php echo date('Y'); ?> Akshar Engineering Services Pvt. Ltd. All rights reserved.
        </div>
        <div class="flex space-x-6">
          <a href="<?php echo esc_url(home_url('/about')); ?>" class="hover:text-brand-orange transition-colors">Quality Policy</a>
          <a href="<?php echo esc_url(home_url('/about')); ?>" class="hover:text-brand-orange transition-colors">Confidentiality</a>
          <a href="<?php echo esc_url(home_url('/about')); ?>" class="hover:text-brand-orange transition-colors">Impartiality Charter</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- ================================================================= -->
  <!-- MODAL DIALOGS (DYNAMIC INTEGRATION)                               -->
  <!-- ================================================================= -->

  <!-- Modal: Company Profile Native Interactive Flipbook Reader -->
  <div id="companyProfileModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-2 sm:p-4 modal-backdrop bg-black/85 backdrop-blur-md">
    <div class="bg-[#0b1633] text-white rounded-2xl shadow-2xl max-w-6xl w-full h-[94vh] flex flex-col border border-slate-700/80 overflow-hidden relative">
      
      <!-- Modal Header -->
      <div class="bg-[#0b1633] px-4 sm:px-6 py-3 flex justify-between items-center shrink-0 border-b border-white/10">
        <div class="flex items-center space-x-3">
          <span class="text-2xl text-brand-orange">&#128214;</span>
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-white leading-tight">Akshar Engineering Services — Interactive Brochure</h3>
            <span id="aesFlipbookPageLabel" class="text-xs text-brand-orange font-bold">Page 1 of 8 — Cover</span>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="window.aesToggleZoom()" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors border border-white/10 cursor-pointer">
            <span>&#128065;</span> <span id="aesZoomBtnText">Zoom 125%</span>
          </button>
          <button onclick="window.aesToggleFullscreen()" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors border border-white/10 cursor-pointer">
            <span>&#x26F6;</span> Fullscreen
          </button>
          <a href="<?php echo esc_url($brochure_pdf_url); ?>" download="AES_Company_Profile.pdf" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-orange hover:bg-orange-600 text-xs font-bold text-white shadow-md transition-colors">
            <span>&#128190;</span> Download PDF
          </a>
          <button onclick="closeModal('companyProfileModal')" class="p-1.5 text-slate-400 hover:text-white text-2xl font-bold leading-none ml-1 cursor-pointer">&times;</button>
        </div>
      </div>

      <!-- Flipbook Main Stage with Side Arrows -->
      <div id="aesFlipbookContainer" class="flex-1 w-full bg-slate-950 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none">
        
        <!-- Left Flip Arrow -->
        <button onclick="window.aesFlipPrev()" class="absolute left-2 sm:left-4 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/60 hover:bg-brand-orange text-white flex items-center justify-center text-lg sm:text-xl font-black shadow-xl transition-all duration-200 border border-white/20 hover:scale-110 cursor-pointer backdrop-blur-xs" aria-label="Previous Page">
          &#10094;
        </button>

        <!-- Dynamic Book Stage -->
        <div id="aesFlipbookStage" class="w-full h-full flex items-center justify-center overflow-auto">
          <!-- Injected via flipbook-reader.js -->
        </div>

        <!-- Right Flip Arrow -->
        <button onclick="window.aesFlipNext()" class="absolute right-2 sm:right-4 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/60 hover:bg-brand-orange text-white flex items-center justify-center text-lg sm:text-xl font-black shadow-xl transition-all duration-200 border border-white/20 hover:scale-110 cursor-pointer backdrop-blur-xs" aria-label="Next Page">
          &#10095;
        </button>
      </div>

      <!-- Bottom Thumbnail Navigation Strip -->
      <div class="bg-[#080f24] px-4 py-2.5 border-t border-white/10 shrink-0 flex items-center justify-between gap-4">
        <span class="hidden md:inline-block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Brochure Pages:</span>
        <div id="aesFlipbookThumbStrip" class="flex items-center gap-2 overflow-x-auto py-1 max-w-full no-scrollbar mx-auto">
          <!-- Injected via flipbook-reader.js -->
        </div>
        <div class="hidden md:flex items-center gap-2 text-slate-400 text-xs font-semibold">
          <span>Use &#x2B05; &#x27A1; arrow keys</span>
        </div>
      </div>

    </div>
  </div>

  <!-- Modal: Quick Reach / Inquiry Form -->
  <div id="inquiryModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 modal-backdrop">
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200">
      <div class="bg-brand-blue text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
        <h3 class="text-lg font-bold">Quick Reach / Technical Inquiry</h3>
        <button onclick="closeModal('inquiryModal')" class="text-white/80 hover:text-white text-2xl font-bold">&times;</button>
      </div>
      <form action="#" method="POST" onsubmit="event.preventDefault(); alert('Inquiry submitted successfully. Our engineering desk will respond within 4 hours.'); closeModal('inquiryModal');" class="p-6 space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Type of Enquiry *</label>
          <select class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange">
            <option>Third Party Inspection (TPI)</option>
            <option>Project Expediting Services</option>
            <option>Pre-Shipment / Pre-Dispatch Inspection</option>
            <option>Vendor Assessment &amp; Shop Approval</option>
            <option>Welding Engineering &amp; Inspection</option>
            <option>NDT Inspection Services</option>
            <option>QA/QC Documentation &amp; 3.2 Certification</option>
            <option>Other Inspection Scope</option>
          </select>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
            <input type="text" required placeholder="Rajesh Patel" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange">
          </div>
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Company *</label>
            <input type="text" required placeholder="L&amp;T Hydrocarbon" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange">
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Email *</label>
            <input type="email" required placeholder="rajesh@company.com" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange">
          </div>
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Phone *</label>
            <input type="tel" required placeholder="+91 98XXXXXXXX" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange">
          </div>
        </div>
        <div>
          <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Project Scope / Location</label>
          <textarea rows="3" placeholder="Describe equipment, standards (ASME/API/ISO), and inspection timeline..." class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange"></textarea>
        </div>
        <button type="submit" class="btn-premium-orange w-full text-white font-bold py-3 rounded-lg uppercase tracking-wider text-xs">
          Submit Inspection Request
        </button>
      </form>
    </div>
  </div>

  <!-- Modal: Verify Document Authenticity -->
  <div id="verifyDocModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 modal-backdrop">
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-200">
      <div class="bg-brand-navy text-white px-6 py-4 rounded-t-2xl flex justify-between items-center border-b border-white/10">
        <div class="flex items-center space-x-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <h3 class="text-base sm:text-lg font-bold">Verify AES Documents</h3>
        </div>
        <button onclick="closeModal('verifyDocModal')" class="text-white/80 hover:text-white text-2xl font-bold">&times;</button>
      </div>
      <form action="#" method="POST" onsubmit="event.preventDefault(); alert('Document verification request received. Our authentication cell will verify against official records.'); closeModal('verifyDocModal');" class="p-6 space-y-4 text-xs">
        <p class="text-slate-600 text-xs leading-relaxed border-b border-slate-100 pb-3">
          Authenticate AES inspection release notes (IRN), test certificates, or audit reports directly with our central QA records.
        </p>
        <div>
          <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Name *</label>
          <input type="text" required placeholder="Ramesh Chandra" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
        </div>
        <div>
          <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Contact No (Phone / WhatsApp) *</label>
          <input type="tel" required placeholder="+91 98XXXXXXXX" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
        </div>
        <div>
          <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Report No / Certificate ID *</label>
          <input type="text" required placeholder="e.g. AES/IRN/2026/8941" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-mono font-bold text-brand-dark">
        </div>
        <div>
          <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Attachment (Document PDF / Image / Scan) *</label>
          <div class="border-2 border-dashed border-slate-300 hover:border-brand-orange bg-slate-50 rounded-xl p-4 text-center transition-colors cursor-pointer relative group">
            <input type="file" required accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
            <div class="flex flex-col items-center justify-center space-y-1">
              <span class="text-xl">&#128196;</span>
              <p class="text-xs font-semibold text-slate-700">Click or Drag &amp; Drop Document File</p>
              <p class="text-[10px] text-slate-400">PDF, JPG, PNG, ZIP up to 25MB</p>
            </div>
          </div>
        </div>
        <button type="submit" class="w-full bg-brand-orange hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-xs uppercase tracking-wider cursor-pointer">
          Verify Document Authenticity
        </button>
      </form>
    </div>
  </div>

  <!-- Modal: Training Registration -->
  <div id="trainingModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 modal-backdrop">
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200">
      <div class="bg-brand-navy text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
        <h3 class="text-lg font-bold">QA/QC &amp; NDT Training Registration</h3>
        <button onclick="closeModal('trainingModal')" class="text-white/80 hover:text-white text-2xl font-bold">&times;</button>
      </div>
      <form action="#" method="POST" onsubmit="event.preventDefault(); alert('Registration submitted! Training coordinator will connect with batch schedule.'); closeModal('trainingModal');" class="p-6 space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Course Program *</label>
          <select class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange">
            <option>NDT Level II (UT, RT, MPT, DPT, VT)</option>
            <option>Welding Inspection (CSWIP / AWS Preparatory)</option>
            <option>API 510 / 570 / 653 Exam Preparation</option>
            <option>ISO 9001 / ISO 17020 Internal Auditor</option>
            <option>Painting &amp; Coating Inspection (NACE / SSPC)</option>
          </select>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Participant Name *</label>
            <input type="text" required placeholder="Aaditya Patel" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange">
          </div>
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Phone / WhatsApp *</label>
            <input type="tel" required placeholder="+91 98XXXXXXXX" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange">
          </div>
        </div>
        <div>
          <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Email *</label>
          <input type="email" required placeholder="aaditya@email.com" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange">
        </div>
        <button type="submit" class="btn-premium-blue w-full text-white font-bold py-3 rounded-lg uppercase tracking-wider text-xs">
          Confirm Training Enrollment
        </button>
      </form>
    </div>
  </div>

  <script>
    function openModal(id) {
      var modal = document.getElementById(id);
      if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }
    function closeModal(id) {
      var modal = document.getElementById(id);
      if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop:not(.hidden)').forEach(function(m) {
          m.classList.add('hidden');
        });
        document.body.classList.remove('overflow-hidden');
      }
    });
  </script>

<?php wp_footer(); ?>
</body>
</html>

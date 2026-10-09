<?php
/**
 * The Footer for Akshar Engineering Theme
 *
 * @package Akshar_Engineering
 */
$theme_uri = get_template_directory_uri();
?>

  <!-- ================================================================= -->
  <!-- 8. CORPORATE FOOTER (CLASSIC BLUE THEME)                          -->
  <!-- ================================================================= -->
  <footer class="relative bg-brand-navy text-slate-300 text-sm border-t border-slate-800">
    <div class="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        <div class="lg:col-span-2 space-y-4">
          <a href="<?php echo esc_url(home_url('/')); ?>" class="inline-block bg-white p-2.5 rounded-xl shadow-md">
            <img src="<?php echo esc_url($theme_uri . '/assets/logo.png'); ?>" alt="<?php bloginfo('name'); ?>" class="h-14 sm:h-16 w-auto object-contain">
          </a>
          <p class="text-slate-300 text-sm leading-relaxed max-w-md font-normal">
            Akshar Engineering Services Pvt. Ltd. delivers independent third-party inspection, vendor quality surveillance, and technical assurance across global industrial supply chains.
          </p>
          <div class="text-xs text-slate-400 space-y-1.5 font-medium pt-2">
            <div>Email: <a href="mailto:info@aksharengineeringservices.com" class="text-slate-200 hover:text-brand-orange transition-colors font-semibold">info@aksharengineeringservices.com</a></div>
            <div>Phone: <a href="tel:+918200441159" class="text-slate-200 hover:text-brand-orange transition-colors font-semibold">+91 8200441159</a></div>
          </div>
        </div>

        <div>
          <span class="block font-black text-white text-xs uppercase tracking-wider mb-4">Navigation</span>
          <ul class="space-y-2.5 text-sm">
            <li><a href="<?php echo esc_url(home_url('/')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Home</a></li>
            <li><a href="<?php echo esc_url(home_url('/about-us/')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">About Us</a></li>
            <li><a href="<?php echo esc_url(home_url('/services/')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Services</a></li>
            <li><a href="<?php echo esc_url(home_url('/careers/')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Careers at AES</a></li>
            <li><a href="<?php echo esc_url(home_url('/about-us/#feedbackHub')); ?>" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Update / Feedback</a></li>
            <li><a href="javascript:void(0)" onclick="openModal('verifyDocModal')" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Verify Document</a></li>
          </ul>
        </div>

        <div>
          <span class="block font-black text-white text-xs uppercase tracking-wider mb-4">Key Services</span>
          <ul class="space-y-2.5 text-sm">
            <li><a href="<?php echo esc_url(home_url('/service-tpi/')); ?>" target="_blank" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Third Party Inspection (TPI)</a></li>
            <li><a href="<?php echo esc_url(home_url('/service-vendor-assessment/')); ?>" target="_blank" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Vendor Assessment &amp; Audit</a></li>
            <li><a href="<?php echo esc_url(home_url('/service-qa-qc-documentation/')); ?>" target="_blank" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">QA/QC Documentation &amp; MRB</a></li>
            <li><a href="<?php echo esc_url(home_url('/service-pre-shipment-inspection/')); ?>" target="_blank" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Pre-Shipment &amp; Pre-Despatch</a></li>
            <li><a href="<?php echo esc_url(home_url('/service-welding-engineering/')); ?>" target="_blank" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Welding Engineering &amp; Inspection</a></li>
            <li><a href="<?php echo esc_url(home_url('/service-ndt-inspection/')); ?>" target="_blank" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">NDT Inspection (UT/RT/MPT/DPT)</a></li>
            <li><a href="<?php echo esc_url(home_url('/service-expediting/')); ?>" target="_blank" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">Project Expediting &amp; Sourcing</a></li>
            <li><a href="<?php echo esc_url(home_url('/service-api-tank-inspection/')); ?>" target="_blank" class="text-slate-400 hover:text-brand-orange transition-colors font-medium">API Tank &amp; Piping Inspection</a></li>
          </ul>
        </div>

      </div>

      <div class="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
        <div>
          &copy; <?php echo date('Y'); ?> Akshar Engineering Services Pvt. Ltd. All rights reserved.
        </div>
        <div class="flex space-x-6">
          <a href="<?php echo esc_url(home_url('/about-us/#qualityPolicy')); ?>" class="hover:text-brand-orange transition-colors">Quality Policy</a>
          <a href="<?php echo esc_url(home_url('/about-us/#confidentiality')); ?>" class="hover:text-brand-orange transition-colors">Confidentiality</a>
          <a href="<?php echo esc_url(home_url('/about-us/#impartiality')); ?>" class="hover:text-brand-orange transition-colors">Impartiality Charter</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- ================================================================= -->
  <!-- 10. INTERACTIVE POPUP MODALS                                      -->
  <!-- ================================================================= -->

  <!-- Modal: Company Profile PDF Reader -->
  <div id="companyProfileModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-2 sm:p-4 modal-backdrop bg-black/85 backdrop-blur-md">
    <div class="bg-[#0b1633] text-white rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col border border-slate-700/80 overflow-hidden relative">
      
      <!-- PDF Header -->
      <div class="bg-[#0b1633] px-4 sm:px-6 py-3.5 flex justify-between items-center shrink-0 border-b border-white/10">
        <div class="flex items-center space-x-3">
          <span class="text-2xl text-brand-orange">📄</span>
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-white leading-tight">Akshar Engineering Services — Company Profile</h3>
            <span class="text-xs text-slate-400 font-medium">Official Corporate Brochure & Scope Catalog</span>
          </div>
        </div>
        <div class="flex items-center space-x-2.5">
          <a class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-orange hover:bg-orange-600 text-xs font-bold text-white shadow-md transition-all duration-200 hover:scale-105" download="Akshar-Engineering-Company-Profile.pdf" href="<?php echo esc_url($theme_uri . '/assets/Company Profile.pdf'); ?>">
            <span>📥</span> <span>Download PDF</span>
          </a>
          <a class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors border border-white/10" target="_blank" href="<?php echo esc_url($theme_uri . '/assets/Company Profile.pdf'); ?>">
            <span>↗</span> <span>Open Fullscreen</span>
          </a>
          <button class="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-xl leading-none font-bold" onclick="closeModal('companyProfileModal')">✕</button>
        </div>
      </div>

      <!-- PDF Viewer Body -->
      <div class="flex-1 w-full bg-slate-900 relative">
        <iframe 
          src="<?php echo esc_url($theme_uri . '/assets/Company Profile.pdf#toolbar=1&navpanes=0&view=FitH'); ?>" 
          class="w-full h-full border-0" 
          title="Akshar Engineering Services Company Profile">
          <p class="p-8 text-center text-slate-300 text-sm">
            Your browser does not support inline PDF viewing. 
            <a href="<?php echo esc_url($theme_uri . '/assets/Company Profile.pdf'); ?>" class="text-brand-orange underline font-bold" download>Click here to download the PDF</a>.
          </p>
        </iframe>
      </div>

      <!-- PDF Footer -->
      <div class="bg-[#070e22] px-4 sm:px-6 py-2.5 flex justify-between items-center shrink-0 border-t border-white/10 text-xs text-slate-400">
        <span>Akshar Engineering Services Pvt. Ltd.</span>
        <a href="<?php echo esc_url($theme_uri . '/assets/Company Profile.pdf'); ?>" download="Akshar-Engineering-Company-Profile.pdf" class="text-brand-orange hover:underline font-bold inline-flex items-center gap-1">
          <span>Download Official PDF Brochure (9.9 MB)</span> <span>⬇</span>
        </a>
      </div>

    </div>
  </div>

  <!-- Modal 1: Quick Reach / Inquiry Form -->
  <div id="inquiryModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 modal-backdrop">
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200">
      
      <div class="bg-brand-blue text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
        <h3 class="text-lg font-bold">Quick Reach / Inquiry</h3>
        <button onclick="closeModal('inquiryModal')" class="text-white/80 hover:text-white text-2xl font-bold">&times;</button>
      </div>

      <form action="#" method="POST" class="aes-ajax-form p-6 space-y-4 text-sm">
        <input type="hidden" name="form_type" value="inquiry">
        <input type="hidden" name="aes_nonce" value="<?php echo esc_attr(wp_create_nonce('aes_forms_nonce')); ?>">
        <div class="aes-form-status hidden"></div>
        
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Type of Enquiry *</label>
          <select name="service_course" id="inquiryServiceSelect" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
            <option>Third Party Inspection (TPI)</option>
            <option>Project Expediting Services</option>
            <option>Pre-Shipment / Pre-Dispatch Inspection</option>
            <option>Vendor Assessment &amp; Shop Approval</option>
            <option>Welding Engineering &amp; Inspection</option>
            <option>NDT Inspection Services</option>
            <option>Painting &amp; Coating Inspection</option>
            <option>Civil &amp; Renewable Projects</option>
            <option>QA/QC Documentation &amp; 3.2 Certification</option>
            <option>Other Inspection Service</option>
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">User Name *</label>
            <input type="text" name="full_name" required placeholder="Your full name" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Designation</label>
            <input type="text" name="designation" placeholder="e.g. QA/QC Manager" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Organization Name *</label>
            <input type="text" name="company_name" required placeholder="Company name" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mobile Number (+91) *</label>
            <input type="tel" name="phone" required placeholder="10-digit mobile number" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">E-mail *</label>
          <input type="email" name="email" required placeholder="corporate@company.com" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Detail Inquiry</label>
          <textarea name="message" rows="3" placeholder="Enter details regarding item, location, standards, and dates..." class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"></textarea>
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full btn-premium-orange text-white font-bold py-2.5 rounded-lg shadow-sm uppercase tracking-wider text-xs">
            Submit Inquiry
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 2: Training Registration -->
  <div id="trainingModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 modal-backdrop">
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200">
      
      <div class="bg-brand-navy text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
        <h3 class="text-lg font-bold">Training Registration</h3>
        <button onclick="closeModal('trainingModal')" class="text-white/80 hover:text-white text-2xl font-bold">&times;</button>
      </div>

      <form action="#" method="POST" class="aes-ajax-form p-6 space-y-4 text-sm" enctype="multipart/form-data">
        <input type="hidden" name="form_type" value="training">
        <input type="hidden" name="aes_nonce" value="<?php echo esc_attr(wp_create_nonce('aes_forms_nonce')); ?>">
        <div class="aes-form-status hidden"></div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Candidate Name *</label>
          <input type="text" name="full_name" required placeholder="Full Candidate Name" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-blue text-xs">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mobile Number (+91) *</label>
            <input type="tel" name="phone" required placeholder="10-digit mobile number" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-blue text-xs">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">E-mail *</label>
            <input type="email" name="email" required placeholder="candidate@email.com" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-blue text-xs">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Qualification *</label>
            <input type="text" name="qualification" required placeholder="e.g. B.E / B.Tech Mechanical, Diploma" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-blue text-xs">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Select Course *</label>
            <select name="service_course" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-blue text-xs">
              <option>ASNT NDT Level II (RT, UT, MPT, DPT, VT)</option>
              <option>CSWIP / AWS Welding Inspection Prep</option>
              <option>BGAS / NACE Painting &amp; Coating</option>
              <option>QA/QC Mechanical &amp; Piping Engineering</option>
              <option>ASME Boiler &amp; Pressure Vessel Code Training</option>
              <option>ISO 9001 / ISO 17020 Quality Auditor</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Upload your Biodata / Resume (Optional)</label>
          <input type="file" name="attachment" class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-brand-blue hover:file:bg-slate-200">
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full btn-premium-blue text-white font-bold py-2.5 rounded-lg shadow-sm uppercase tracking-wider text-xs">
            Submit Registration
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 3: Verify Document Form -->
  <div id="verifyDocModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 modal-backdrop">
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-200">
      
      <div class="bg-brand-navy text-white px-6 py-4 rounded-t-2xl flex justify-between items-center border-b border-white/10">
        <div class="flex items-center space-x-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <h3 class="text-base sm:text-lg font-bold">Verify AES Documents</h3>
        </div>
        <button onclick="closeModal('verifyDocModal')" class="text-white/80 hover:text-white text-2xl font-bold">&times;</button>
      </div>

      <form action="#" method="POST" class="aes-ajax-form p-6 space-y-4 text-xs" enctype="multipart/form-data">
        <input type="hidden" name="form_type" value="verify_doc">
        <input type="hidden" name="aes_nonce" value="<?php echo esc_attr(wp_create_nonce('aes_forms_nonce')); ?>">
        <div class="aes-form-status hidden"></div>
        
        <p class="text-slate-600 text-xs leading-relaxed border-b border-slate-100 pb-3">
          Authenticate AES inspection release notes (IRN), test certificates, or audit reports directly with our central QA records.
        </p>

        <div>
          <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Name *</label>
          <input type="text" name="full_name" required placeholder="e.g. Ramesh Chandra" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
        </div>

        <div>
          <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Contact No (Phone / WhatsApp) *</label>
          <input type="tel" name="phone" required placeholder="+91 98XXXXXXXX" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
        </div>

        <div>
          <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Report No / Certificate ID *</label>
          <input type="text" name="service_course" required placeholder="e.g. AES/IRN/2026/8941" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-mono font-bold text-brand-dark">
        </div>

        <div>
          <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Attachment (Document PDF / Image / Scan) *</label>
          <div class="border-2 border-dashed border-slate-300 hover:border-brand-orange bg-slate-50 rounded-xl p-4 text-center transition-colors cursor-pointer relative group">
            <input type="file" name="attachment" required accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
            <div class="flex flex-col items-center justify-center space-y-1">
              <span class="text-xl">&#128196;</span>
              <p class="text-xs font-semibold text-slate-700">Click or Drag &amp; Drop Document File</p>
              <p class="text-[10px] text-slate-400">PDF, JPG, PNG, ZIP up to 25MB</p>
            </div>
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Additional Notes (Optional)</label>
          <textarea name="message" rows="2" placeholder="Specific vendor name, PO number, or verification instructions..." class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"></textarea>
        </div>

        <div class="pt-1">
          <button type="submit" class="w-full btn-premium-orange text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-xs uppercase tracking-wider cursor-pointer">
            Verify Document Authenticity
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 4: Careers at AES -->
  <div id="careersModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 modal-backdrop">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
      <div class="bg-brand-blue text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
        <h3 class="text-lg font-bold">Careers at AES</h3>
        <button onclick="closeModal('careersModal')" class="text-white/80 hover:text-white text-2xl font-bold">&times;</button>
      </div>
      <div class="p-6 sm:p-8 space-y-6 text-sm">
        <div>
          <h4 class="text-base font-bold text-brand-dark mb-1">Join Our Technical Inspection Network</h4>
          <p class="text-xs text-slate-600 leading-relaxed">
            We are actively hiring certified senior surveyors, NDT Level II/III specialists, and welding inspection auditors across heavy fabrication corridors.
          </p>
        </div>
        <div class="space-y-3">
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <div class="font-bold text-slate-900 text-xs">Senior TPI Mechanical Inspector</div>
              <div class="text-[11px] text-slate-500">API 510/570/653 &bull; Gujarat / Maharashtra &bull; 5+ Yrs Exp</div>
            </div>
            <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">Active</span>
          </div>
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <div class="font-bold text-slate-900 text-xs">Welding Inspector (CSWIP 3.1 / AWS CWI)</div>
              <div class="text-[11px] text-slate-500">Structural &amp; Piping &bull; Pan-India Field Deployment</div>
            </div>
            <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">Active</span>
          </div>
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <div class="font-bold text-slate-900 text-xs">QA/QC Documentation &amp; MDR Engineer</div>
              <div class="text-[11px] text-slate-500">EN 10204 3.2 Dossier &bull; Vadodara Office / Remote</div>
            </div>
            <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">Active</span>
          </div>
        </div>
        <form action="#" method="POST" class="aes-ajax-form space-y-3 pt-2 border-t border-slate-100" enctype="multipart/form-data">
          <input type="hidden" name="form_type" value="career">
          <input type="hidden" name="aes_nonce" value="<?php echo esc_attr(wp_create_nonce('aes_forms_nonce')); ?>">
          <div class="aes-form-status hidden"></div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input type="text" name="full_name" required class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-blue">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
              <input type="email" name="email" required class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-blue">
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Position Applied For</label>
              <select name="service_course" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-blue">
                <option>Senior TPI Mechanical Inspector</option>
                <option>Welding Inspector (CSWIP / AWS)</option>
                <option>NDT Level II/III Specialist</option>
                <option>QA/QC Documentation Engineer</option>
                <option>Vendor Assessment Auditor</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Attach Resume (PDF/DOC) *</label>
              <input type="file" name="attachment" required class="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-brand-blue hover:file:bg-slate-200">
            </div>
          </div>
          <div class="pt-2">
            <button type="submit" class="btn-premium-blue w-full text-white font-bold py-2.5 rounded-lg text-xs">
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal 5: Update & Feedback -->
  <div id="feedbackModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 modal-backdrop">
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200">
      <div class="bg-brand-navy text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
        <h3 class="text-lg font-bold">Project Update &amp; Client Feedback</h3>
        <button onclick="closeModal('feedbackModal')" class="text-white/80 hover:text-white text-2xl font-bold">&times;</button>
      </div>
      <form action="#" method="POST" class="aes-ajax-form p-6 space-y-4 text-sm">
        <input type="hidden" name="form_type" value="feedback">
        <input type="hidden" name="aes_nonce" value="<?php echo esc_attr(wp_create_nonce('aes_forms_nonce')); ?>">
        <div class="aes-form-status hidden"></div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Request Category *</label>
          <select name="service_course" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
            <option>Project Milestone / Inspection Status Update</option>
            <option>Request 24-Hour Flash Report Copy</option>
            <option>Surveyor Performance &amp; Quality Feedback</option>
            <option>Billing &amp; Invoice Clearance Update</option>
          </select>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Contact Name *</label>
            <input type="text" name="full_name" required class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Project / PO Number</label>
            <input type="text" name="company_name" placeholder="e.g. PO-AES-2026-89" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email *</label>
          <input type="email" name="email" required class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Feedback / Status Details</label>
          <textarea name="message" rows="3" placeholder="Provide notes regarding the ongoing surveillance or feedback..." class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"></textarea>
        </div>
        <div class="pt-2">
          <button type="submit" class="btn-premium-orange w-full text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider">
            Send Feedback / Update Request
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 6: Dynamic Quick View Modal (For All 16 Services) -->
  <div id="quickViewModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 modal-backdrop">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200">
      
      <!-- Modal Header with Dynamic Title in Corporate Blue -->
      <div class="bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl flex justify-between items-center">
        <div>
          <span id="qvCategory" class="text-[10px] font-black uppercase tracking-wider text-brand-orange bg-orange-50 px-2 py-0.5 rounded">Core Discipline</span>
          <h3 id="qvTitle" class="text-2xl font-black text-brand-blue mt-1">Third Party Inspection</h3>
        </div>
        <button onclick="closeModal('quickViewModal')" class="text-slate-400 hover:text-slate-700 text-3xl font-bold">&times;</button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 sm:p-8 space-y-6">
        
        <!-- Large Featured Image -->
        <div class="rounded-xl overflow-hidden shadow-md h-56 w-full relative bg-brand-navy">
          <img id="qvImage" src="<?php echo esc_url($theme_uri . '/assets/service_tpi.jpg'); ?>" alt="Service Preview" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent"></div>
          <div class="absolute bottom-4 left-4 right-4 text-white">
            <span id="qvSubline" class="text-xs font-semibold text-brand-lightOrange uppercase tracking-wider">Independent Quality Assurance</span>
          </div>
        </div>

        <!-- Detailed Description -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Scope of Inspection &amp; Methodology</h4>
          <p id="qvDesc" class="text-sm text-slate-700 leading-relaxed">
            Akshar Engineering Services acts as an impartial third-party inspection agency conducting shop floor and field surveillance. Our multidisciplinary engineers verify stage-wise manufacturing against approved Quality Assurance Plans (QAP), client specifications, and statutory codes.
          </p>
        </div>

        <!-- Deliverables & Standards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span class="block text-xs font-bold text-brand-blue uppercase tracking-wider mb-2">Key Deliverables</span>
            <ul id="qvDeliverables" class="text-xs text-slate-600 space-y-1.5 list-disc pl-4 font-medium">
              <li>Immediate 24-hour Flash Reports</li>
              <li>Inspection Release Notes (IRN)</li>
              <li>Non-Conformance Reports (NCR) tracking</li>
              <li>Traceability &amp; MRB certification</li>
            </ul>
          </div>

          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span class="block text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">Applicable Codes</span>
            <ul id="qvCodes" class="text-xs text-slate-600 space-y-1.5 list-disc pl-4 font-medium">
              <li>ISO/IEC 17020 Type-A Body</li>
              <li>ASME Sec II, V, VIII, IX, B31.3</li>
              <li>API 510, 570, 650, 653</li>
              <li>AWS D1.1, EN 10204 3.2</li>
            </ul>
          </div>
        </div>

        <!-- Direct CTA Button -->
        <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-xs text-slate-500">
            Mobilization time: <span class="font-bold text-slate-800">24 to 48 Hours Pan-India</span>
          </div>
          <button id="qvCtaBtn" onclick="closeModal('quickViewModal'); openModal('inquiryModal');" class="btn-premium-orange w-full sm:w-auto text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-md">
            Request Inspection for this Scope
          </button>
        </div>

      </div>
    </div>
  </div>

  <!-- Vanilla JS Engine -->
  <script>
    var servicesDB = {
      tpi: {
        category: 'Third Party Inspection',
        title: 'Third Party Inspection (TPI)',
        subline: 'Shop Floor & Field Surveillance',
        image: '<?php echo esc_url($theme_uri . "/assets/service_tpi.jpg"); ?>',
        desc: 'Akshar Engineering Services provides fully impartial, independent Third-Party Inspection services across all stages of heavy manufacturing and site installation. Our surveyors verify material heat numbers, oversee fit-up and welding, witness destructive/non-destructive tests, and validate statutory compliance according to approved Inspection and Test Plans (ITP).',
        deliverables: ['Immediate 24-hour Flash Reports with photographic proof', 'Inspection Release Note (IRN) generation', 'NCR logging and corrective action verification', 'Material Test Certificate (MTC) endorsement'],
        codes: ['ISO/IEC 17020 Type-A Accredited Inspection Body', 'ASME Boiler & Pressure Vessel Code (Sec VIII Div 1/2)', 'AWS D1.1 Structural Welding Code', 'EN 10204 Type 3.2 Material Certification']
      },
      vendor: {
        category: 'Vendor Assessment',
        title: 'Vendor Evaluation & Shop Approval',
        subline: 'Supply Chain Risk Mitigation',
        image: '<?php echo esc_url($theme_uri . "/assets/service_vendor_audit.jpg"); ?>',
        desc: 'We conduct comprehensive technical capability and quality system audits of potential suppliers, fabricators, and foundries before procurement release. Our auditors evaluate manufacturing plant machinery, welder qualifications, calibration matrices, calibration records, and past performance.',
        deliverables: ['Detailed Vendor Audit Scoring Matrix', 'Shop Capacity & Machinery Verification Report', 'Quality Management System Gap Analysis', 'Approved Vendor Recommendation Dossier'],
        codes: ['ISO 9001:2015 Quality Management Systems', 'ISO 3834 Comprehensive Quality Requirements for Fusion Welding', 'API Q1 / Spec Q2 Quality Programs', 'Client-specific vendor approval protocols']
      },
      qaqc: {
        category: 'Quality Documentation',
        title: 'QA/QC Documentation & MRB Support',
        subline: 'Dossier Verification & 3.2 Certification',
        image: '<?php echo esc_url($theme_uri . "/assets/service_qa_qc.jpg"); ?>',
        desc: 'We provide end-to-end technical dossier compilation and independent review for major capital EPC handovers. We cross-verify material test reports (MTR), radiographic films, hydrostatic test charts, PWHT temperature graphs, and As-Built drawings to assemble flawless Manufacturing Record Books (MRB).',
        deliverables: ['Complete Manufacturing Record Book (MRB) Audit', 'EN 10204 3.2 Co-sign Certification', 'Traceability Log & Heat Number Correlation Matrix', 'Punch List Closure Validation Certificate'],
        codes: ['EN 10204 3.1 & 3.2 Inspection Documents', 'ASME Section II & Section VIII Div 1/2', 'ISO 9001 Traceability Mandates', 'Project Technical Specifications (PTS)']
      },
      preshipment: {
        category: 'Pre-Shipment Inspection',
        title: 'Pre-Shipment & Pre-Despatch Verification',
        subline: 'Final Inspection & Packaging Clearance',
        image: '<?php echo esc_url($theme_uri . "/assets/service_pre_dispatch.jpg"); ?>',
        desc: 'Before any industrial component leaves the manufacturing shop, AES surveyors conduct 100% visual and dimensional checks, verify coating dry film thickness (DFT), check rust prevention wrapping and crating, and verify shipping markings to prevent customs holds and transport damage.',
        deliverables: ['Final Inspection Release Note (IRN)', 'Preservation & Packing Audit Certificate', 'Dimensional Conformity Report', 'Shipping Mark & Tagging Verification Log'],
        codes: ['HPE Packaging Guidelines', 'NACE SP0188 / SSPC Surface Protection', 'ASME B16.5 / B16.47 Flange Tolerances', 'Client Shipping Specifications']
      },
      welding: {
        category: 'Welding Engineering',
        title: 'Welding Engineering & Inspection',
        subline: 'WPS, PQR & Welder Performance Qualification',
        image: '<?php echo esc_url($theme_uri . "/assets/service_welding_nde.jpg"); ?>',
        desc: 'Our CSWIP 3.1 and AWS CWI certified welding engineers review and qualify Welding Procedure Specifications (WPS) and Procedure Qualification Records (PQR). We witness destructive weld coupon bend and tensile tests and certify welder performance qualifications (WPQ).',
        deliverables: ['WPS / PQR Endorsement Certificates', 'Welder Performance Qualification (WPQ) Cards', 'Weld Joint Traceability Maps', 'Heat Input & Interpass Temperature Logs'],
        codes: ['ASME Section IX Welding & Brazing', 'AWS D1.1 / D1.6 Structural Stainless', 'ISO 15614 / ISO 9606 Welder Standards', 'API 1104 Pipeline Welding']
      },
      ndt: {
        category: 'Non-Destructive Testing',
        title: 'NDT Inspection Services (Level II & III)',
        subline: 'Volumetric & Surface Flaw Detection',
        image: '<?php echo esc_url($theme_uri . "/assets/service_ndt_flaw.jpg"); ?>',
        desc: 'AES delivers rigorous surveillance and auditing of non-destructive testing procedures. Our ASNT Level III and Level II specialists witness Ultrasonic Testing (UT), Radiographic Film Interpretation (RT), Magnetic Particle Testing (MPT), and Dye Penetrant Testing (DPT).',
        deliverables: ['NDT Witness Certification & Reports', 'Radiographic Film Re-interpretation Log', 'Defect Sizing & Acceptance Evaluation', 'Calibration Block & Couplant Traceability Record'],
        codes: ['ASNT SNT-TC-1A / ISO 9712 Guidelines', 'ASME Section V Nondestructive Examination', 'ASTM E165, E709, E114, E142 Standards', 'API 570 / 510 In-Service Evaluation']
      },
      expediting: {
        category: 'Project Expediting',
        title: 'Supply Chain Expediting Services',
        subline: 'Schedule Integrity & Milestone Auditing',
        image: '<?php echo esc_url($theme_uri . "/assets/service_expediting.jpg"); ?>',
        desc: 'We place boots on the ground at vendor facilities worldwide to monitor raw material receipt, sub-tier supplier progress, machining milestones, and testing schedules to prevent critical supply chain bottlenecks and keep EPC deadlines on track.',
        deliverables: ['Field Milestone Progress Reports', 'Bottleneck Identification & Recovery Plan', 'Sub-supplier Procurement Status Log', 'Weekly 4-Week Lookahead Schedule Audits'],
        codes: ['Critical Path Method (CPM) Schedule Vetting', 'ISO 9001 Production Planning Audits', 'Contractual Milestone Verification Protocols']
      },
      design: {
        category: 'Engineering Examination',
        title: 'Engineering Design Examination',
        subline: 'Calculations & Drawing Appraisal',
        image: '<?php echo esc_url($theme_uri . "/assets/hero_inspection.jpg"); ?>',
        desc: 'Our senior technical design examiners verify pressure vessel, heat exchanger, and piping design calculations against statutory codes prior to fabrication kickoff, ensuring safety margins, material selections, and nozzle reinforcements comply with design rules.',
        deliverables: ['Design Appraisal Certificate', 'Mechanical Calculation Review Matrix', 'Drawing Redline & Approval Stamp', 'Code Exemption & Deviation Assessment'],
        codes: ['ASME Sec VIII Div 1 & Div 2', 'PD 5500 & EN 13445 Unfired Pressure Vessels', 'TEMA Standards for Heat Exchangers', 'API 650 Welded Tanks for Oil Storage']
      },
      shutdown: {
        category: 'Plant Integrity',
        title: 'Project & Shutdown Inspection',
        subline: 'Turnaround Surveillance & Asset Life Assessment',
        image: '<?php echo esc_url($theme_uri . "/assets/sector_oil_gas.jpg"); ?>',
        desc: 'During plant turnarounds and maintenance shutdowns in refineries and petrochemical facilities, AES deploys fast-response inspection squads to inspect columns, boilers, furnaces, and piping for remaining wall thickness, corrosion mechanisms, and weld repairs.',
        deliverables: ['Shutdown Inspection Defect Log', 'Remaining Life & Corrosion Rate Assessment', 'Immediate Repair Recommendation Scope', 'Post-Repair Hydro-test Sign-off'],
        codes: ['API 510 Pressure Vessel Inspector', 'API 570 Piping Inspector', 'API 571 Damage Mechanisms in Refineries', 'IBR Indian Boiler Regulations']
      },
      sourcing: {
        category: 'Global Surveillance',
        title: 'International Sourcing Surveillance',
        subline: 'Overseas Vendor Quality Assurance',
        image: '<?php echo esc_url($theme_uri . "/assets/sector_refinery.jpg"); ?>',
        desc: 'For EPC contractors procuring valves, forgings, turbine skids, and electrical packages from overseas suppliers, AES provides trusted on-site technical inspection, validating factory acceptance tests before release of shipment funds.',
        deliverables: ['Factory Acceptance Test (FAT) Protocol Witness', 'Overseas Quality Surveillance Dossier', 'Export Packaging & Containerization Audit', 'Pre-Payment Technical Clearance Certificate'],
        codes: ['ISO/IEC 17020 Compliance', 'Incoterms 2020 Quality Protocols', 'API 6D Pipeline Valves Specification', 'IEC Electrical Equipment Norms']
      },
      hydrotest: {
        category: 'Pressure Testing',
        title: 'Witnessing Performance & Hydro-Tests',
        subline: 'Hydrostatic & Pneumatic Leak Integrity',
        image: '<?php echo esc_url($theme_uri . "/assets/sector_power_plant.jpg"); ?>',
        desc: 'AES engineers witness critical hydrostatic pressure tests, pneumatic leak tests, helium leak checks, and rotary machinery running tests. We verify calibrated dual pressure gauges, test medium chemistry, hold periods, and pressure decay graphs.',
        deliverables: ['Certified Hydrostatic Test Chart & Certificate', 'Pressure Gauge Calibration Verification', 'Water Chloride Content Test Witness Report', 'Zero-Leakage Sign-off Certificate'],
        codes: ['ASME Section VIII UG-99 & UG-100', 'ASME B31.3 Chapter VI Pressure Testing', 'API 598 Valve Inspection and Testing', 'IBR Regulation 392 Boiler Hydro-tests']
      },
      process: {
        category: 'Special Processes',
        title: 'Process Qualification & Auditing',
        subline: 'Surface Treatment, NACE & Heat Treatment',
        image: '<?php echo esc_url($theme_uri . "/assets/service_coating.jpg"); ?>',
        desc: 'We qualify special industrial processes including Post-Weld Heat Treatment (PWHT) cycle calibration, blast surface cleanliness (Sa 2.5), NACE/AMPP coating application, passivation, and pickling.',
        deliverables: ['PWHT Time-Temperature Chart Audit', 'Surface Profile & DFT Audit Certificate', 'Salt Contamination (Bresle) Test Record', 'Holiday Detection Inspection Sheet'],
        codes: ['NACE MR0175 / ISO 15156 Sour Service', 'SSPC-SP10 / ISO 8501-1 Blast Standards', 'ASTM A380 Passivation & Cleaning', 'ASME Section VIII UW-40 PWHT']
      },
      apitank: {
        category: 'Storage Tanks',
        title: 'API Storage Tank Inspection (650/653)',
        subline: 'Atmospheric & Low-Pressure Tank Integrity',
        image: '<?php echo esc_url($theme_uri . "/assets/service_api_tank.jpg"); ?>',
        desc: 'Specialized inspection services for field-erected vertical storage tanks. We audit foundation settlement, annular plate weld vacuum box testing, shell verticality/peaking/banding tolerances, floating roof seals, and bottom plate MFL scanning.',
        deliverables: ['Tank Plumbness & Roundness Survey Chart', 'Vacuum Box Weld Inspection Report', 'Annular & Bottom Plate MFL Scan Results', 'Hydrostatic Water Fill Settlement Record'],
        codes: ['API 650 Welded Tanks for Oil Storage', 'API 653 Tank Inspection, Repair, Alteration', 'API 620 Low-Pressure Storage Tanks', 'AWWA D100 Water Storage Tanks']
      },
      ownersengineer: {
        category: "Client Representation",
        title: "Owner's Engineer Deployment",
        subline: 'Direct Quality & Technical Representation',
        image: '<?php echo esc_url($theme_uri . "/assets/service_civil_renew.jpg"); ?>',
        desc: 'We act as the direct technical representative of the project owner / asset developer on site and in supplier factories, managing the EPC contractor quality interface, validating test certificates, and auditing construction quality.',
        deliverables: ['Weekly Owner Technical Audit Reports', 'Contractor Quality KPI & Non-Conformance Tracker', 'Stage Milestone Validation for Payment Release', 'Project Handover Readiness Dossier'],
        codes: ['ISO 9001 Project Quality Management', 'FIDIC Contract Technical Quality Clauses', 'Statutory Building & Energy Codes', 'Project Specific Quality Assurance Plans']
      },
      piping: {
        category: 'Piping Engineering',
        title: 'Process Piping Inspection (ASME B31.3)',
        subline: 'Spool Fabrication & Tie-in Assurance',
        image: '<?php echo esc_url($theme_uri . "/assets/service_piping_spool.jpg"); ?>',
        desc: 'Comprehensive surveillance of process piping fabrication, spool alignment, flange face finish, gasket verification, bolt torque checks, cold spring verification, and spring support settings.',
        deliverables: ['Piping Isometric Drawing Redline & Sign-off', 'Flange Torque Tightening Log Sheet', 'Piping Spool Dimension & Ovality Record', 'Golden Weld Witness Certificate'],
        codes: ['ASME B31.3 Process Piping Code', 'ASME B16.5 / B16.47 Pipe Flanges', 'ASME B16.9 Factory-Made Butt-weld Fittings', 'MSS SP-97 Integrally Reinforced Outlets']
      }
    };

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

    function openQuickView(key) {
      var data = servicesDB[key] || servicesDB['tpi'];
      document.getElementById('qvCategory').textContent = data.category;
      document.getElementById('qvTitle').textContent = data.title;
      document.getElementById('qvSubline').textContent = data.subline;
      document.getElementById('qvImage').src = data.image;
      document.getElementById('qvDesc').textContent = data.desc;
      
      var delivList = document.getElementById('qvDeliverables');
      delivList.innerHTML = '';
      data.deliverables.forEach(function(item) {
        var li = document.createElement('li');
        li.textContent = item;
        delivList.appendChild(li);
      });

      var codeList = document.getElementById('qvCodes');
      codeList.innerHTML = '';
      data.codes.forEach(function(item) {
        var li = document.createElement('li');
        li.textContent = item;
        codeList.appendChild(li);
      });

      var select = document.getElementById('inquiryServiceSelect');
      if (select) {
        for (var i = 0; i < select.options.length; i++) {
          if (select.options[i].text.toLowerCase().includes(data.category.toLowerCase()) || select.options[i].text.toLowerCase().includes(data.title.toLowerCase())) {
            select.selectedIndex = i;
            break;
          }
        }
      }

      openModal('quickViewModal');
    }

    window.addEventListener('click', function(e) {
      if (e.target.classList.contains('modal-backdrop')) {
        e.target.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        var openModals = document.querySelectorAll('.modal-backdrop:not(.hidden)');
        openModals.forEach(function(m) {
          m.classList.add('hidden');
        });
        document.body.classList.remove('overflow-hidden');
      }
    });

    // Mega Dropdown Hover Handling with Graceful Delay
    (function () {
      var dropdown = document.querySelector('.nav-item-dropdown');
      var menu = document.querySelector('.mega-dropdown-menu');
      var closeTimer = null;

      if (dropdown && menu) {
        function openMenu() {
          if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
          }
          menu.classList.add('is-open');
        }

        function scheduleClose() {
          if (closeTimer) clearTimeout(closeTimer);
          closeTimer = setTimeout(function () {
            menu.classList.remove('is-open');
          }, 280);
        }

        dropdown.addEventListener('mouseenter', openMenu);
        dropdown.addEventListener('mouseleave', scheduleClose);
        menu.addEventListener('mouseenter', openMenu);
        menu.addEventListener('mouseleave', scheduleClose);
      }
    })();

    // Mobile Menu Toggle
    (function () {
      var mobileBtn = document.getElementById('mobile-menu-btn');
      var mobileMenu = document.getElementById('mobile-menu');
      if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', function () {
          mobileMenu.classList.toggle('hidden');
        });

        var navLinks = mobileMenu.querySelectorAll('a, button');
        for (var i = 0; i < navLinks.length; i++) {
          navLinks[i].addEventListener('click', function () {
            mobileMenu.classList.add('hidden');
          });
        }
      }
    })();

    // Scroll-Triggered Heading Accent Lines
    function initHeadingObserver() {
      var headingTracks = document.querySelectorAll('.heading-line-track');
      if (!headingTracks.length) return;
      if ('IntersectionObserver' in window) {
        var trackObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              var line = entry.target.querySelector('.section-accent-line');
              if (line) {
                line.classList.add('line-animated');
              }
              trackObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.05,
          rootMargin: "0px 0px -10% 0px"
        });

        headingTracks.forEach(function(track) {
          trackObserver.observe(track);
        });
      } else {
        headingTracks.forEach(function(track) {
          var line = track.querySelector('.section-accent-line');
          if (line) line.classList.add('line-animated');
        });
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initHeadingObserver);
    } else {
      initHeadingObserver();
    }
  </script>

<?php wp_footer(); ?>
</body>
</html>

import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield, CheckCircle, ArrowUpRight } from 'lucide-react';

export default function Footer({ onOpenVerifyDoc }) {
  return (
    <footer className="relative bg-brand-navy text-slate-400 text-sm border-t border-white/10 overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand & Profile */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white inline-block p-2.5 rounded-xl">
              <img src="/assets/logo.png" alt="Akshar Engineering Services" className="h-10 w-auto" />
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              Akshar Engineering Services Pvt. Ltd. provides independent Third Party Inspection, Vendor Quality Audits, and Technical Surveillance across global oil &amp; gas, power, nuclear, and heavy fabrication supply chains.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" /> ISO 9001:2015 Certified
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                <Shield className="w-3 h-3" /> ISO 17020 Inspection Alignment
              </span>
            </div>
          </div>

          {/* Col 3: Key Services */}
          <div>
            <span className="block font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Core Services
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services/tpi" className="hover:text-brand-orange transition-colors">
                  Third Party Inspection (TPI)
                </Link>
              </li>
              <li>
                <Link to="/services/vendor-assessment" className="hover:text-brand-orange transition-colors">
                  Vendor Capability Assessment
                </Link>
              </li>
              <li>
                <Link to="/services/qa-qc-documentation" className="hover:text-brand-orange transition-colors">
                  QA/QC &amp; MRB Documentation
                </Link>
              </li>
              <li>
                <Link to="/services/pre-shipment-inspection" className="hover:text-brand-orange transition-colors">
                  Pre-Shipment Inspection (PSI)
                </Link>
              </li>
              <li>
                <Link to="/services/welding-engineering" className="hover:text-brand-orange transition-colors">
                  Welding Engineering &amp; WPS/PQR
                </Link>
              </li>
              <li>
                <Link to="/services/ndt-inspection" className="hover:text-brand-orange transition-colors">
                  NDT Level II/III Inspection
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-brand-orange hover:text-white font-bold inline-flex items-center gap-1 pt-1">
                  <span>View All 16 Services</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate Navigation */}
          <div>
            <span className="block font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Navigation
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-brand-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-orange transition-colors">
                  Services Catalog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-brand-orange transition-colors">
                  Careers at AES
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-orange transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/we-hear-you" className="hover:text-brand-orange transition-colors">
                  We Hear You (Feedback)
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenVerifyDoc}
                  className="text-brand-orange hover:text-white font-bold transition-colors cursor-pointer text-left"
                >
                  Verify Document
                </button>
              </li>
              <li>
                <Link to="/admin" className="text-slate-500 hover:text-slate-300">
                  Admin Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Direct Technical Desk */}
          <div>
            <span className="block font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Technical Desk
            </span>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  Vadodara, Gujarat &bull; Pan-India Inspection Corridors &bull; Global Network
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="tel:+918200441159" className="text-slate-300 hover:text-white transition-colors">
                  +91 8200441159
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="mailto:info@aksharengineeringservices.com" className="text-slate-300 hover:text-white transition-colors break-all">
                  info@aksharengineeringservices.com
                </a>
              </li>
            </ul>

            <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300">
              <span className="text-brand-orange font-bold block mb-0.5">Rapid Deployment SLA</span>
              Surveillance inspectors mobilized within 24 hours of notification across western industrial belts.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Akshar Engineering Services Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex space-x-6 text-[11px]">
            <span className="text-slate-400">Third Party Inspection</span>
            <span>&bull;</span>
            <span className="text-slate-400">Quality Assurance</span>
            <span>&bull;</span>
            <span className="text-slate-400">ASNT NDT Level III</span>
          </div>
        </div>
      </div>

    </footer>
  );
}

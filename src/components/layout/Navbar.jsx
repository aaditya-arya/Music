import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ShieldCheck, Phone, Mail, FileCheck, ArrowRight } from 'lucide-react';
import { servicesData } from '../../lib/servicesData';

export default function Navbar({ onOpenVerifyDoc, onOpenInspection }) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMegaOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Top Corporate Strip */}
      <div className="bg-brand-navy text-white text-[11px] py-1.5 px-6 lg:px-12 hidden sm:block border-b border-white/10">
        <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-6 text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              ISO 9001:2015 &amp; ISO 17020 Inspection Standards
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <span className="hidden md:flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-brand-orange" />
              info@aksharengineeringservices.com
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenVerifyDoc}
              className="text-brand-orange hover:text-white font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Verify AES Documents</span>
            </button>
            <span className="text-slate-600">|</span>
            <Link to="/admin" className="text-slate-400 hover:text-white font-medium transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="w-full px-6 lg:px-12 flex justify-between items-center h-20 sm:h-24 max-w-7xl mx-auto">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center shrink-0 h-full py-2 group">
            <img
              src="/assets/logo.png"
              alt="Akshar Engineering Services"
              className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Center: Desktop Navigation & Centered 4x4 Mega Dropdown */}
          <nav className="hidden lg:flex items-center justify-center space-x-8 text-base font-extrabold text-brand-blue">
            
            {/* Services Dropdown Trigger */}
            <div
              className="relative py-6 flex items-center group"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <Link
                to="/services"
                className="hover:text-brand-orange flex items-center gap-1.5 transition-colors"
              >
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${megaOpen ? 'rotate-180 text-brand-orange' : ''}`} />
              </Link>

              {/* 4x4 Mega Menu Dropdown */}
              {megaOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[92vw] max-w-6xl max-h-[80vh] overflow-y-auto bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div>
                      <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider">
                        Technical Inspection &amp; Quality Assurance Catalog
                      </h3>
                      <p className="text-xs text-slate-500 font-normal">
                        16 Comprehensive Specialized Surveillance Disciplines for Heavy Engineering &amp; Energy Supply Chains
                      </p>
                    </div>
                    <Link
                      to="/services"
                      onClick={() => setMegaOpen(false)}
                      className="text-xs font-bold text-brand-orange hover:text-brand-blue flex items-center gap-1 transition-colors"
                    >
                      <span>View Full Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* 4x4 Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-1 text-left">
                    {servicesData.map(service => (
                      <Link
                        key={service.id}
                        to={`/services/${service.slug}`}
                        onClick={() => setMegaOpen(false)}
                        className="group/item p-3.5 rounded-xl hover:bg-orange-50/80 border border-slate-100 hover:border-orange-200 transition-all flex flex-col justify-start shadow-xs hover:shadow-md bg-slate-50/50 hover:bg-white"
                      >
                        <h4 className="text-[13px] font-bold text-brand-blue group-hover/item:text-brand-orange transition-colors">
                          {service.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1 font-normal">
                          {service.shortDesc}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/careers" className="hover:text-brand-orange transition-colors">
              Careers
            </Link>
            <Link to="/about" className="hover:text-brand-orange transition-colors">
              About Us
            </Link>
            <Link to="/we-hear-you" className="hover:text-brand-orange transition-colors">
              We Hear You
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={onOpenVerifyDoc}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-brand-orange text-brand-dark hover:text-brand-orange text-xs font-bold transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verify Report</span>
            </button>

            <Link
              to="/services"
              className="btn-premium-orange text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md uppercase tracking-wider inline-flex items-center"
            >
              Request Inspection
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={onOpenVerifyDoc}
              className="p-2 text-slate-700 hover:text-brand-orange rounded-lg border border-slate-200"
              aria-label="Verify Document"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-blue hover:text-brand-orange rounded-lg border border-slate-200"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col space-y-3 text-base font-bold text-slate-800">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-brand-orange transition-colors py-1.5 border-b border-slate-100"
              >
                Home
              </Link>
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-brand-orange transition-colors py-1.5 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Services Catalog (16 Disciplines)</span>
                <ArrowRight className="w-4 h-4 text-brand-orange" />
              </Link>
              <Link
                to="/careers"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-brand-orange transition-colors py-1.5 border-b border-slate-100"
              >
                Careers at AES
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-brand-orange transition-colors py-1.5 border-b border-slate-100"
              >
                About Us
              </Link>
              <Link
                to="/we-hear-you"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-brand-orange transition-colors py-1.5 border-b border-slate-100"
              >
                We Hear You (Technical Desk)
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-slate-500 hover:text-brand-blue py-1"
              >
                Admin Workspace
              </Link>
            </nav>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-premium-orange w-full text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider text-center block"
              >
                Request an Inspection
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVerifyDoc();
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verify Document Authenticity</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

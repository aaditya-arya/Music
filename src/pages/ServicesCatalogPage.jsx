import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { servicesData } from '../lib/servicesData';

export default function ServicesCatalogPage() {
  const { onOpenInspection } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = servicesData.filter(s => {
    const term = searchTerm.toLowerCase();
    return s.title.toLowerCase().includes(term) ||
      s.shortDesc.toLowerCase().includes(term) ||
      s.badge.toLowerCase().includes(term) ||
      s.standards.some(std => std.toLowerCase().includes(term));
  });

  return (
    <div className="bg-white text-slate-800 selection:bg-brand-orange selection:text-white min-h-screen">
      
      {/* ================================================================= */}
      {/* 1. SERVICES HEADER                                                */}
      {/* ================================================================= */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <div className="inline-block">
            <h1 className="text-4xl sm:text-5xl font-black text-brand-dark tracking-tight">
              Comprehensive Inspection Services
            </h1>
            <div className="heading-line-track track-center mx-auto mt-4 mb-6">
              <div className="section-accent-line"></div>
            </div>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto font-normal">
            Delivering independent vendor surveillance, fabrication QA/QC, and technical audits for critical industrial assets globally.
          </p>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 -mt-7 relative z-20">
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search service, standard (e.g. ASME, API, NDT, TPI, hydro, piping)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-brand-orange focus:bg-white transition-all font-medium"
            />
          </div>
          <button
            onClick={onOpenInspection}
            className="btn-premium-orange text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-md cursor-pointer shrink-0"
          >
            Request Inspection Scope
          </button>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. SERVICES GRID (16 Specialized Disciplines in 3-Col Layout)     */}
      {/* ================================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                id={service.slug}
                className="service-card-target scroll-mt-28 group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-1 relative block"
              >
                <div className="overflow-hidden bg-slate-100 h-52">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/sector_heavy_fab.jpg';
                    }}
                  />
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-xs font-black text-brand-orange uppercase tracking-wider mb-1">
                    {service.badge}
                  </span>
                  
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-orange transition-colors duration-300 mb-2">
                    {service.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 flex-1 leading-relaxed font-normal">
                    {service.shortDesc}
                  </p>
                  
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-blue group-hover:text-brand-orange transition-colors flex items-center gap-1">
                      <span>View Technical Details</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                      {service.standards[0] || 'ISO 17020'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-base font-bold text-slate-700">No inspection service matched your search.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-3 text-xs font-bold text-brand-orange hover:underline"
              >
                Clear Search Filter
              </button>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}

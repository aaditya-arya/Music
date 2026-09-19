import React from 'react';
import { Download, CheckSquare, ShieldCheck, Award, Target, FileCheck } from 'lucide-react';

export default function QualityPolicy() {
  const qualityObjectives = [
    "Delivering technically precise, reliable, and value-added inspection services strictly adhering to statutory codes & client specifications.",
    "Enhancing client satisfaction by systematically understanding and fulfilling evolving quality demands across industrial supply chains.",
    "Ensuring unwavering impartiality, independence, and objectivity throughout all inspection, witnessing, and certification activities.",
    "Committing to perpetual improvement of quality processes and management systems to exceed national & international industry benchmarks.",
    "Continuously enhancing personnel competence, technical expertise, and proficiency through specialized upskilling and certification."
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-brand-navy to-brand-blue text-white relative overflow-hidden">
      
      {/* Background Motifs & Ambient Lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Quality Policy Statement */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-xs font-black uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                <span>Organizational Commitment</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                QUALITY POLICY
              </h2>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              At <strong className="text-white font-bold">Akshar Engineering Services</strong>, we are steadfastly committed to executing third-party inspection and technical assurance services with the highest caliber of professionalism, precision, and ethics.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-brand-orange font-bold text-xs mt-0.5">
                  01
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Continuous Improvement</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mt-0.5">
                    Relentless refinement of inspection methodologies and quality systems while upholding absolute impartiality, independence, and operational integrity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-brand-orange font-bold text-xs mt-0.5">
                  02
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Customer Satisfaction</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mt-0.5">
                    Exceeding client expectations by delivering technically accurate, timely, and code-compliant surveillance reports aligned with international standards.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-brand-orange font-bold text-xs mt-0.5">
                  03
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Ethical &amp; Sustainable Practices</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mt-0.5">
                    Empowering personnel competence, practicing conscientious resource management, and upholding environmental stewardship across industrial corridors.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#quality-manual"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Akshar Engineering Services ISO 9001:2015 Quality Policy & Manual (PDF) is available for client compliance audits upon request.');
                }}
                className="btn-premium-orange inline-flex items-center gap-2 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Quality Policy PDF</span>
              </a>
              <span className="text-[11px] text-slate-400">
                Document Ref: <span className="font-mono text-slate-300">AES/QP/REV-04</span>
              </span>
            </div>
          </div>

          {/* Right Column: 5 Quality Objectives Card */}
          <div className="lg:col-span-6">
            <div className="bg-white text-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100 relative">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                <div>
                  <span className="text-brand-orange text-xs font-black uppercase tracking-wider block mb-1">
                    Quality Management System
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-brand-dark">
                    Quality Objectives
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-brand-orange shrink-0">
                  <Target className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-4">
                {qualityObjectives.map((obj, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <CheckSquare className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">
                      {obj}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-bold text-brand-dark">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>ISO 9001:2015 &amp; ISO 17020</span>
                </div>
                <span className="text-[11px] bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold">
                  Annual Quality Audit Valid
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

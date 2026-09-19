import React from 'react';
import { Users, FileText, Briefcase, ShieldCheck, ArrowRight, RefreshCw, Clock } from 'lucide-react';

export default function OverviewTab({ stats, leads, onSwitchTab, onRefresh }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
            Executive Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time surveillance on client scopes, talent pipelines, and authenticated certificates.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-brand-blue text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync Live Data</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Leads */}
        <div
          onClick={() => onSwitchTab('leads')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Inspection Leads</span>
            <FileText className="w-5 h-5 text-brand-orange group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-brand-dark">{stats.leads}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
          </div>
        </div>

        {/* Jobs */}
        <div
          onClick={() => onSwitchTab('jobs')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Job Postings</span>
            <Briefcase className="w-5 h-5 text-brand-blue group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-brand-blue">{stats.jobs}</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Careers CMS</span>
          </div>
        </div>

        {/* Applications */}
        <div
          onClick={() => onSwitchTab('applications')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Candidate Resumes</span>
            <Users className="w-5 h-5 text-brand-orange group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-brand-orange">{stats.apps}</span>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Talent Desk</span>
          </div>
        </div>

        {/* Documents */}
        <div
          onClick={() => onSwitchTab('documents')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Documents</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-emerald-600">{stats.docs}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Secured</span>
          </div>
        </div>

      </div>

      {/* Recent Leads Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-brand-dark">Recent Client RFQ Inquiries</h2>
            <p className="text-xs text-slate-500">Live feed of submissions from 16 technical scope forms.</p>
          </div>
          <button
            onClick={() => onSwitchTab('leads')}
            className="text-xs font-bold text-brand-orange hover:text-brand-blue flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {leads.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No recent inquiries logged yet.
            </div>
          ) : (
            leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-brand-dark">{lead.client_name}</strong>
                    <span className="text-slate-400 text-xs">&bull;</span>
                    <span className="text-xs text-slate-600">{lead.company_name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      lead.status === 'New' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {lead.status || 'New'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1">
                    <strong className="text-brand-blue">{lead.service_type}</strong>: {lead.location_and_scope || 'Standard inspection scope'}
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400 shrink-0">
                  {new Date(lead.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

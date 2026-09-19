import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { adminApi } from '../../lib/supabase';
import AdminLoginPage from './AdminLoginPage';
import OverviewTab from './tabs/OverviewTab';
import LeadsTab from './tabs/LeadsTab';
import JobsCmsTab from './tabs/JobsCmsTab';
import AppsTab from './tabs/AppsTab';
import DocumentsTab from './tabs/DocumentsTab';
import InquiriesTab from './tabs/InquiriesTab';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  ShieldCheck,
  MessageSquare,
  LogOut,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminPortal() {
  const { user, loading: authLoading, logout, isDevBypass } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Master Data States
  const [leads, setLeads] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const loadAllData = async () => {
    setLoadingData(true);
    try {
      const [leadsData, jobsData, appsData, docsData, inqsData] = await Promise.all([
        adminApi.getLeads().catch(() => []),
        adminApi.getAllJobs().catch(() => []),
        adminApi.getApplications().catch(() => []),
        adminApi.getDocuments().catch(() => []),
        adminApi.getInquiries().catch(() => [])
      ]);

      setLeads(leadsData);
      setJobs(jobsData);
      setApplications(appsData);
      setDocuments(docsData);
      setInquiries(inqsData);
    } catch (err) {
      console.error('[Admin Load Error]', err);
      addToast('Error loading live data from Supabase.', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center text-white text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (!user) {
    return <AdminLoginPage />;
  }

  const handleLogout = async () => {
    await logout();
    addToast('Signed out of admin portal.', 'info');
  };

  const navItems = [
    { id: 'overview', label: 'Overview Dashboard', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
    { id: 'leads', label: 'Inspection Leads', icon: <FileText className="w-4 h-4 shrink-0" />, count: leads.length },
    { id: 'jobs', label: 'Careers & Jobs CMS', icon: <Briefcase className="w-4 h-4 shrink-0" />, count: jobs.length },
    { id: 'applications', label: 'Job Applications', icon: <Users className="w-4 h-4 shrink-0" />, count: applications.length },
    { id: 'documents', label: 'Verify Documents CMS', icon: <ShieldCheck className="w-4 h-4 shrink-0" />, count: documents.length },
    { id: 'inquiries', label: 'General Inquiries', icon: <MessageSquare className="w-4 h-4 shrink-0" />, count: inquiries.length },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800 font-sans">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-sm">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/assets/logo.png" alt="AES Logo" className="h-9 w-auto" />
            </Link>
            <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-brand-orange px-2 py-0.5 rounded">
              v2.0 React
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-brand-blue text-white font-bold shadow-md shadow-brand-blue/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-brand-orange text-white font-black flex items-center justify-center text-xs shrink-0">
                A
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-800 truncate">
                  {user.email || 'Administrator'}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {isDevBypass ? 'Dev Mode' : 'Live Connected'}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-h-screen">
        {activeTab === 'overview' && (
          <OverviewTab
            stats={{
              leads: leads.length,
              jobs: jobs.filter(j => j.status === 'active').length,
              apps: applications.length,
              docs: documents.length
            }}
            leads={leads}
            onSwitchTab={setActiveTab}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === 'leads' && (
          <LeadsTab
            leads={leads}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === 'jobs' && (
          <JobsCmsTab
            jobs={jobs}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === 'applications' && (
          <AppsTab
            applications={applications}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsTab
            documents={documents}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === 'inquiries' && (
          <InquiriesTab
            inquiries={inquiries}
            onRefresh={loadAllData}
          />
        )}
      </main>

    </div>
  );
}

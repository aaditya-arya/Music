import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const { login, devBypass } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email.trim(), password);
      addToast('Welcome back, Administrator! Connected to live Supabase backend.', 'success');
    } catch (err) {
      addToast(`Authentication failed: ${err.message || 'Invalid credentials'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDevBypass = () => {
    devBypass();
    addToast('Developer Preview Access enabled (Bypass Mode).', 'info');
  };

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-blue/30 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full border border-slate-200 text-center relative z-10 animate-in zoom-in-95 duration-200">
        
        <div className="inline-block p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
          <img src="/assets/logo.png" alt="Akshar Engineering Services" className="h-12 w-auto mx-auto" />
        </div>

        <h1 className="text-2xl font-black text-brand-dark tracking-tight mb-1">
          AES Admin Portal
        </h1>
        <p className="text-xs text-slate-500 mb-8">
          Centralized workspace for RFQ leads, Careers CMS, and certificate authentication.
        </p>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aksharengineeringservices.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-brand-orange text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-brand-orange text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange hover:bg-orange-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>Sign In to Portal</span>
          </button>

          <div className="pt-3 text-center border-t border-slate-100">
            <button
              type="button"
              onClick={handleDevBypass}
              className="text-xs text-brand-blue hover:text-brand-orange font-bold transition-colors cursor-pointer"
            >
              ⚡ Quick Preview Access (Development Mode)
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

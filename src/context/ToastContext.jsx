import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 5000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-md w-full px-4 pointer-events-none">
        {toasts.map(toast => {
          let bgClass = 'bg-white border-slate-200 text-slate-800';
          let icon = <Info className="w-5 h-5 text-brand-blue shrink-0" />;
          let barClass = 'bg-brand-blue';

          if (toast.type === 'success') {
            bgClass = 'bg-emerald-950/95 border-emerald-500/40 text-emerald-100 shadow-emerald-950/50';
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
            barClass = 'bg-emerald-400';
          } else if (toast.type === 'error') {
            bgClass = 'bg-rose-950/95 border-rose-500/40 text-rose-100 shadow-rose-950/50';
            icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
            barClass = 'bg-rose-500';
          } else if (toast.type === 'warning') {
            bgClass = 'bg-amber-950/95 border-amber-500/40 text-amber-100 shadow-amber-950/50';
            icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
            barClass = 'bg-amber-400';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-300 relative overflow-hidden ${bgClass}`}
            >
              <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${barClass}`} />
              <div className="pl-1 pt-0.5">{icon}</div>
              <div
                className="flex-1 text-xs leading-relaxed font-medium"
                dangerouslySetInnerHTML={{ __html: toast.message }}
              />
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/60 hover:text-white transition-colors pt-0.5"
                aria-label="Close Toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

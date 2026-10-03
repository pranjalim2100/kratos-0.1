import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />,
          warn: <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />,
          error: <XCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />,
          info: <Info className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />,
        };

        const borderColors = {
          success: 'border-emerald-500/40 bg-[#0E1B1B]',
          warn: 'border-amber-500/40 bg-[#1D170E]',
          error: 'border-rose-500/40 bg-[#1D0E12]',
          info: 'border-cyan-500/40 bg-[#0F172A]',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border ${borderColors[toast.type]} shadow-2xl backdrop-blur-md flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            <div className="flex items-start gap-2.5">
              {icons[toast.type]}
              <div>
                <p className="text-xs font-semibold text-white tracking-tight">
                  {toast.title}
                </p>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

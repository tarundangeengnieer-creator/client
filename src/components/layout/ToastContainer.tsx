import React from 'react';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const ui = useUI();

  if (ui.toasts.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {ui.toasts.map((toast) => {
        const icons = {
          success: <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />,
          warning: <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />,
          error: <XCircle className="w-4 h-4 text-rose-400 shrink-0" />,
          info: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-800/80 bg-slate-900/95 text-emerald-200',
          warning: 'border-amber-800/80 bg-slate-900/95 text-amber-200',
          error: 'border-rose-800/80 bg-slate-900/95 text-rose-200',
          info: 'border-sky-800/80 bg-slate-900/95 text-sky-200',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-2.5 p-3 rounded-lg border shadow-xl backdrop-blur-xs text-xs font-mono transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${borders[toast.type]}`}
          >
            <div className="flex items-start gap-2.5">
              {icons[toast.type]}
              <div className="leading-snug text-slate-200">{toast.message}</div>
            </div>
            <button
              type="button"
              onClick={() => uiStore.removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-100 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

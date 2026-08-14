import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = CheckCircle2;
          let colorStyles = 'bg-slate-900/95 text-white border-slate-700/60 shadow-xl shadow-slate-950/20';
          let iconColor = 'text-emerald-400';

          if (toast.type === 'error') {
            colorStyles = 'bg-rose-950/95 text-white border-rose-800/80 shadow-xl shadow-rose-950/30';
            iconColor = 'text-rose-400';
            Icon = AlertCircle;
          } else if (toast.type === 'warning') {
            colorStyles = 'bg-amber-950/95 text-white border-amber-800/80 shadow-xl shadow-amber-950/30';
            iconColor = 'text-amber-400';
            Icon = AlertTriangle;
          } else if (toast.type === 'info') {
            colorStyles = 'bg-indigo-950/95 text-white border-indigo-800/80 shadow-xl shadow-indigo-950/30';
            iconColor = 'text-indigo-400';
            Icon = Info;
          }

          return (
            <motion.div
              key={toast.id}
              id={`toast-${toast.id}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md ${colorStyles}`}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold tracking-tight">{toast.title}</p>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                  {toast.message}
                </p>
              </div>
              <button
                id={`toast-dismiss-${toast.id}`}
                onClick={() => onDismiss(toast.id)}
                className="text-slate-400 hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-lg"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bell,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { FinancialInsight } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  insights: FinancialInsight[];
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  insights,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="notification-drawer-backdrop"
        className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs"
        onClick={onClose}
      >
        <motion.div
          id="notification-drawer-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Financial Insights & Alerts
                </h3>
                <p className="text-xs text-slate-500">
                  {insights.length} active updates for this period
                </p>
              </div>
            </div>
            <button
              id="close-notifications-btn"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Insights */}
          <div className="p-5 flex-1 overflow-y-auto space-y-3">
            {insights.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm flex flex-col items-center">
                <ShieldCheck className="w-10 h-10 text-emerald-500 mb-2" />
                <p className="font-semibold text-slate-700">All clear!</p>
                <p className="text-xs text-slate-500 mt-1">No alerts or warnings right now.</p>
              </div>
            ) : (
              insights.map((insight) => {
                let icon = Sparkles;
                let bgStyle = 'bg-indigo-50/70 border-indigo-100 text-indigo-900';
                let iconStyle = 'text-indigo-600 bg-indigo-100/80';

                if (insight.type === 'warning') {
                  icon = AlertTriangle;
                  bgStyle = 'bg-rose-50/70 border-rose-100 text-rose-900';
                  iconStyle = 'text-rose-600 bg-rose-100/80';
                } else if (insight.type === 'positive') {
                  icon = TrendingUp;
                  bgStyle = 'bg-emerald-50/70 border-emerald-100 text-emerald-900';
                  iconStyle = 'text-emerald-600 bg-emerald-100/80';
                }

                const IconComponent = icon;

                return (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-2xl border ${bgStyle} transition-all duration-150`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconStyle}`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold tracking-tight">{insight.title}</h4>
                          {insight.metric && (
                            <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-white/80 shadow-2xs">
                              {insight.metric}
                            </span>
                          )}
                        </div>
                        <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              Calculated dynamically from real transactions
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

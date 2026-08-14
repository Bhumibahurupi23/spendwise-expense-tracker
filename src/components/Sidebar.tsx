import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  BarChart2,
  Settings,
  PlusCircle,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActivePage } from '../types';
import { calculateFinancialSummary } from '../utils/analytics';
import { formatCurrency } from '../utils/formatters';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const {
    activePage,
    setActivePage,
    openTransactionModal,
    transactions,
    settings,
  } = useApp();

  const summary = calculateFinancialSummary(transactions);

  const navItems: { id: ActivePage; label: string; icon: React.FC<any>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt, badge: transactions.length },
    { id: 'budgets', label: 'Budgets', icon: PiggyBank },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      id="app-sidebar"
      className={`fixed lg:sticky top-0 lg:top-[65px] left-0 z-40 h-full lg:h-[calc(100vh-65px)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 transition-transform duration-200 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Brand & Navigation */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header in Sidebar */}
        <div className="lg:hidden p-3 mb-2 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <div className="w-3.5 h-3.5 bg-white rounded-xs rotate-45" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800">SpendWise</span>
          </div>
        </div>

        <nav className="space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Pro / Savings Summary Card */}
      <div className="p-2 border-t border-slate-100 mt-auto space-y-3">
        <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-400 font-medium">Net Savings</p>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
              {summary.savingsRate}% Rate
            </span>
          </div>
          <p className="text-base font-bold text-white tracking-tight mb-2">
            {formatCurrency(summary.savings, settings.currency)}
          </p>
          <button
            id="sidebar-new-tx-btn"
            onClick={() => {
              openTransactionModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full bg-white text-slate-900 hover:bg-slate-100 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
            + Add Transaction
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center font-medium">
          SpendWise • Smart Financial Tracking
        </p>
      </div>
    </aside>
  );
};


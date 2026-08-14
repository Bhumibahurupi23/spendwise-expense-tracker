import React from 'react';
import { LayoutDashboard, Receipt, PiggyBank, BarChart2, Settings, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActivePage } from '../types';

export const MobileNav: React.FC = () => {
  const { activePage, setActivePage, openTransactionModal } = useApp();

  const navButtons: { id: ActivePage; label: string; icon: React.FC<any> }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'transactions', label: 'History', icon: Receipt },
    { id: 'budgets', label: 'Budgets', icon: PiggyBank },
    { id: 'analytics', label: 'Insights', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div
      id="mobile-bottom-navbar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg"
    >
      {navButtons.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            id={`mobile-nav-${item.id}`}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}

      {/* Floating Center Plus CTA */}
      <button
        id="mobile-center-add-btn"
        onClick={() => openTransactionModal()}
        className="w-12 h-12 -mt-5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 active:scale-95 transition-all border-4 border-slate-50"
        aria-label="Add transaction"
      >
        <Plus className="w-6 h-6" />
      </button>

      {navButtons.slice(2).map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            id={`mobile-nav-${item.id}`}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

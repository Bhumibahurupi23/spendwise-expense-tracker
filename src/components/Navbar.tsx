import React, { useState } from 'react';
import {
  Plus,
  Search,
  Bell,
  User,
  Menu,
  X,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURRENCIES } from '../utils/formatters';
import { CurrencyCode } from '../types';
import { generateFinancialInsights } from '../utils/analytics';
import { NotificationDrawer } from './NotificationDrawer';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const {
    settings,
    setCurrency,
    openTransactionModal,
    searchQuery,
    setSearchQuery,
    setActivePage,
    transactions,
    budgets,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const insights = generateFinancialInsights(transactions, budgets);
  const unreadCount = insights.filter((i) => i.type === 'warning').length || insights.length;

  return (
    <>
      <header
        id="app-navbar"
        className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-all"
      >
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-open-btn"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActivePage('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-xs">
              <div className="w-3.5 h-3.5 bg-white rounded-xs rotate-45" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 hidden sm:inline">
              SpendWise
            </span>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="flex-1 max-w-md mx-2 sm:mx-8 hidden md:block">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-full pl-10 pr-9 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Currency switcher, CTA, Notifications & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Currency Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/50">
            {(['INR', 'USD', 'EUR', 'GBP'] as CurrencyCode[]).map((curr) => (
              <button
                key={curr}
                id={`nav-currency-${curr}`}
                onClick={() => setCurrency(curr)}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  settings.currency === curr
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {CURRENCIES[curr].symbol}
              </button>
            ))}
          </div>

          {/* Notifications Button */}
          <button
            id="notifications-toggle-btn"
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Add Transaction Button */}
          <button
            id="nav-add-transaction-btn"
            onClick={() => openTransactionModal()}
            className="bg-indigo-600 text-white px-3.5 sm:px-4 py-2 rounded-lg text-sm font-semibold shadow-xs shadow-indigo-200 hover:bg-indigo-700 active:scale-98 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              id="profile-menu-btn"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
            >
              {settings.userName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase() || 'SW'}
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div
                id="profile-dropdown-menu"
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 text-xs"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900 truncate">{settings.userName}</p>
                  <p className="text-slate-400 text-[11px] truncate">{settings.userEmail}</p>
                </div>
                <button
                  onClick={() => setActivePage('settings')}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-indigo-600 text-slate-700 font-medium transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  Account Settings
                </button>
                <button
                  onClick={() => setActivePage('analytics')}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-indigo-600 text-slate-700 font-medium transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Financial Analytics
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        insights={insights}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
};


import React, { useState } from 'react';
import {
  User,
  DollarSign,
  Bell,
  Download,
  Trash2,
  RotateCcw,
  ShieldAlert,
  Save,
  CheckCircle2,
  Info,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURRENCIES, formatCurrency } from '../utils/formatters';
import { CurrencyCode, UserSettings } from '../types';
import { exportToCSV } from '../utils/storage';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    transactions,
    handleResetToSample,
    handleClearAllTransactions,
    handleFullReset,
    openConfirmModal,
  } = useApp();

  const [formData, setFormData] = useState<UserSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (field: keyof UserSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div id="settings-page" className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your profile, currency, financial targets, and data storage
        </p>
      </div>

      {/* Profile & Targets Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Profile & Financial Targets
            </h3>
            <p className="text-xs text-slate-500">Personalize your SpendWise experience</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="settings-username"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="settings-username"
                type="text"
                value={formData.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="settings-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="settings-email"
                type="email"
                value={formData.userEmail}
                onChange={(e) => handleInputChange('userEmail', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="settings-monthly-income-target"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Monthly Income Target ({CURRENCIES[formData.currency].symbol})
              </label>
              <input
                id="settings-monthly-income-target"
                type="number"
                value={formData.monthlyIncomeTarget}
                onChange={(e) =>
                  handleInputChange('monthlyIncomeTarget', parseFloat(e.target.value) || 0)
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="settings-monthly-savings-target"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Monthly Savings Goal ({CURRENCIES[formData.currency].symbol})
              </label>
              <input
                id="settings-monthly-savings-target"
                type="number"
                value={formData.monthlySavingsTarget}
                onChange={(e) =>
                  handleInputChange('monthlySavingsTarget', parseFloat(e.target.value) || 0)
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            {isSaved && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </span>
            )}
            <button
              type="submit"
              id="save-profile-settings-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-xs shadow-indigo-600/20 transition-all"
            >
              <Save className="w-4 h-4" />
              Save Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Currency Selection */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Display Currency</h3>
            <p className="text-xs text-slate-500">
              Select your primary accounting denomination
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {(['INR', 'USD', 'EUR', 'GBP'] as CurrencyCode[]).map((code) => {
            const isSelected = settings.currency === code;
            const cur = CURRENCIES[code];

            return (
              <button
                key={code}
                type="button"
                id={`currency-option-${code}`}
                onClick={() => updateSettings({ currency: code })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="text-2xl font-extrabold font-display block text-slate-900">
                  {cur.symbol}
                </span>
                <span className="text-xs font-bold text-slate-800 mt-1 block">{code}</span>
                <span className="text-[11px] text-slate-500 truncate block">{cur.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Management & Export */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Data Management</h3>
            <p className="text-xs text-slate-500">
              Export your data, reload sample records, or wipe local storage
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Export CSV */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Export Transactions as CSV</h4>
              <p className="text-xs text-slate-500">
                Download your complete expense and income ledger into Excel/Google Sheets
              </p>
            </div>
            <button
              id="settings-export-csv-btn"
              onClick={() => exportToCSV(transactions, settings.currency)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shrink-0"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Download CSV ({transactions.length} items)
            </button>
          </div>

          {/* Reset Sample Data */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Restore Realistic Sample Data</h4>
              <p className="text-xs text-slate-500">
                Repopulate realistic Indian transactions (Blinkit, Zomato, Uber, Salary) and budgets
              </p>
            </div>
            <button
              id="settings-restore-sample-btn"
              onClick={() => {
                openConfirmModal({
                  title: 'Load Realistic Sample Data',
                  message: 'This will replace your current transactions with realistic preset demo data. Do you wish to continue?',
                  confirmLabel: 'Load Sample Data',
                  onConfirm: handleResetToSample,
                });
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors shrink-0"
            >
              <RotateCcw className="w-4 h-4 text-indigo-600" />
              Load Sample Data
            </button>
          </div>

          {/* Clear All Transactions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-rose-50/50 rounded-xl border border-rose-100 gap-3">
            <div>
              <h4 className="text-sm font-bold text-rose-900">Clear All Transaction History</h4>
              <p className="text-xs text-rose-600">
                Permanently delete all income and expense items while keeping budgets intact
              </p>
            </div>
            <button
              id="settings-clear-transactions-btn"
              onClick={() => {
                openConfirmModal({
                  title: 'Clear All Transactions',
                  message: 'Are you sure you want to delete all transaction history? This cannot be undone.',
                  confirmLabel: 'Clear All',
                  isDestructive: true,
                  onConfirm: handleClearAllTransactions,
                });
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              Clear Transactions
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold font-display">SpendWise</span>
          <span className="text-xs bg-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-400/20">
            v1.0.0
          </span>
        </div>
        <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
          "Track your money. Understand your spending. Build better habits." Built for modern,
          privacy-conscious individuals. All financial calculations run client-side on your
          device with instant LocalStorage caching.
        </p>
      </div>
    </div>
  );
};

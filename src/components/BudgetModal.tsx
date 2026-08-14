import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, PiggyBank, Target } from 'lucide-react';
import { Budget, CurrencyCode, ExpenseCategory } from '../types';
import { EXPENSE_CATEGORIES, formatCurrency, CATEGORY_COLORS } from '../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  editingBudget: Budget | null;
  currency: CurrencyCode;
  existingBudgetCategories: ExpenseCategory[];
  onClose: () => void;
  onSave: (category: ExpenseCategory, amount: number) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  editingBudget,
  currency,
  existingBudgetCategories,
  onClose,
  onSave,
}) => {
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editingBudget) {
      setCategory(editingBudget.category);
      setAmount(editingBudget.amount.toString());
    } else {
      // Find first category without a budget or default to Food
      const available = EXPENSE_CATEGORIES.find((c) => !existingBudgetCategories.includes(c));
      setCategory(available || 'Food');
      setAmount('5000');
    }
    setError('');
  }, [editingBudget, isOpen, existingBudgetCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please specify a monthly budget limit greater than 0');
      return;
    }

    onSave(category, numAmount);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="budget-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        onClick={onClose}
      >
        <motion.div
          id="budget-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 overflow-hidden"
        >
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <PiggyBank className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="budget-modal-title"
                  className="text-lg font-bold text-slate-900 tracking-tight"
                >
                  {editingBudget ? 'Update Category Budget' : 'Set Category Budget'}
                </h3>
                <p className="text-xs text-slate-500">
                  Control monthly spending limits per category
                </p>
              </div>
            </div>
            <button
              id="budget-modal-close-btn"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="budget-category"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Expense Category
              </label>
              <select
                id="budget-category"
                value={category}
                disabled={!!editingBudget}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 disabled:opacity-60 transition-all"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="budget-amount"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Monthly Spending Limit *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 font-bold">
                  {formatCurrency(0, currency).charAt(0)}
                </span>
                <input
                  id="budget-amount"
                  type="number"
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (error) setError('');
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-lg font-bold text-slate-900 focus:outline-hidden focus:ring-2 transition-all ${
                    error
                      ? 'border-rose-300 focus:ring-rose-500/30'
                      : 'border-slate-200 focus:ring-indigo-500/30 focus:border-indigo-500'
                  }`}
                />
              </div>
              {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
            </div>

            {/* Quick Amount Suggestion Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Presets:</span>
              {[2000, 5000, 10000, 15000, 25000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toString())}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 transition-colors"
                >
                  {formatCurrency(val, currency)}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                id="budget-modal-cancel-btn"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="budget-modal-submit-btn"
                className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {editingBudget ? 'Update Budget' : 'Set Budget'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

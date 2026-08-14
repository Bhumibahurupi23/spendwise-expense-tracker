import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  PlusCircle,
  Check,
  Calendar,
  CreditCard,
  Tag,
  FileText,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import {
  Transaction,
  TransactionType,
  PaymentMethod,
  CurrencyCode,
} from '../types';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
  formatCurrency,
  CATEGORY_COLORS,
} from '../utils/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  editingTransaction: Transaction | null;
  currency: CurrencyCode;
  onClose: () => void;
  onSave: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onUpdate: (data: Transaction) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  editingTransaction,
  currency,
  onClose,
  onSave,
  onUpdate,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Food');
  const [date, setDate] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [notes, setNotes] = useState<string>('');

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or populate fields on open / change
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setDescription(editingTransaction.description);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setPaymentMethod(editingTransaction.paymentMethod);
      setNotes(editingTransaction.notes || '');
    } else {
      // Default new transaction
      setType('expense');
      setAmount('');
      setDescription('');
      setCategory('Food');
      const todayIso = new Date().toISOString().split('T')[0];
      setDate(todayIso);
      setPaymentMethod('UPI');
      setNotes('');
    }
    setErrors({});
  }, [editingTransaction, isOpen]);

  // When type toggles, adapt default category
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income') {
      if (!INCOME_CATEGORIES.includes(category)) {
        setCategory('Salary');
      }
    } else {
      if (!EXPENSE_CATEGORIES.includes(category as any)) {
        setCategory('Food');
      }
    }
  };

  const handleQuickAddAmount = (addValue: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + addValue).toString());
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!description.trim()) {
      newErrors.description = 'Please enter a description or merchant name';
    }

    if (!date) {
      newErrors.date = 'Please select a valid transaction date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      type,
      amount: parseFloat(amount),
      description: description.trim(),
      category,
      date,
      paymentMethod,
      notes: notes.trim() || undefined,
    };

    if (editingTransaction) {
      onUpdate({
        ...editingTransaction,
        ...payload,
      });
    } else {
      onSave(payload);
    }

    onClose();
  };

  if (!isOpen) return null;

  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <AnimatePresence>
      <div
        id="transaction-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          id="transaction-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2
                id="transaction-modal-title"
                className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
              >
                {editingTransaction ? 'Edit Transaction' : 'Record Transaction'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {editingTransaction
                  ? 'Update transaction details and category'
                  : 'Add a new expense or income record'}
              </p>
            </div>
            <button
              id="transaction-modal-close-btn"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Type Switcher: Income vs Expense */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                id="type-toggle-expense"
                onClick={() => handleTypeChange('expense')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all duration-150 ${
                  type === 'expense'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                Expense
              </button>
              <button
                type="button"
                id="type-toggle-income"
                onClick={() => handleTypeChange('income')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all duration-150 ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                Income
              </button>
            </div>

            {/* Amount Field with Quick Presets */}
            <div>
              <label
                htmlFor="transaction-amount"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Amount *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 text-lg font-bold">
                  {formatCurrency(0, currency).charAt(0)}
                </span>
                <input
                  id="transaction-amount"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-xl font-bold text-slate-900 placeholder:text-slate-300 focus:outline-hidden focus:ring-2 transition-all ${
                    errors.amount
                      ? 'border-rose-300 focus:ring-rose-500/30'
                      : 'border-slate-200 focus:ring-indigo-500/30 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.amount}</p>
              )}

              {/* Quick Add Buttons */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[11px] text-slate-400 font-medium mr-1">Quick:</span>
                {[100, 500, 1000, 5000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAddAmount(val)}
                    className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 transition-colors"
                  >
                    +{val}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="transaction-description"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Description / Merchant *
              </label>
              <div className="relative">
                <input
                  id="transaction-description"
                  type="text"
                  placeholder="e.g. Zomato Food Order, Electricity Bill, Salary..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description)
                      setErrors((prev) => ({ ...prev, description: '' }));
                  }}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
                    errors.description
                      ? 'border-rose-300 focus:ring-rose-500/30'
                      : 'border-slate-200 focus:ring-indigo-500/30 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.description && (
                <p className="text-xs text-rose-600 mt-1 font-medium">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Category Selector Chips */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentCategories.map((cat) => {
                  const isSelected = category === cat;
                  const catStyle = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;

                  return (
                    <button
                      key={cat}
                      type="button"
                      id={`category-select-${cat.toLowerCase()}`}
                      onClick={() => setCategory(cat)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-600/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: catStyle.hex }}
                      />
                      <span className="truncate">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Payment Method Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="transaction-date"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                >
                  Date *
                </label>
                <div className="relative">
                  <input
                    id="transaction-date"
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  />
                </div>
                {errors.date && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{errors.date}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="transaction-payment-method"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                >
                  Payment Method
                </label>
                <select
                  id="transaction-payment-method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                >
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label
                htmlFor="transaction-notes"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Notes (Optional)
              </label>
              <textarea
                id="transaction-notes"
                rows={2}
                placeholder="Add receipt reference, tags, or extra context..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                id="transaction-modal-cancel-btn"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="transaction-modal-submit-btn"
                className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition-all duration-150 active:scale-95 flex items-center gap-2 ${
                  type === 'expense'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                }`}
              >
                <Check className="w-4 h-4" />
                {editingTransaction ? 'Save Changes' : 'Record Transaction'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

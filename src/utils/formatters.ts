import { CurrencyCode, ExpenseCategory, PaymentMethod } from '../types';

export const CURRENCIES: Record<CurrencyCode, { symbol: string; name: string; locale: string }> = {
  INR: { symbol: '₹', name: 'Indian Rupee (INR)', locale: 'en-IN' },
  USD: { symbol: '$', name: 'US Dollar (USD)', locale: 'en-US' },
  EUR: { symbol: '€', name: 'Euro (EUR)', locale: 'de-DE' },
  GBP: { symbol: '£', name: 'British Pound (GBP)', locale: 'en-GB' },
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Shopping',
  'Transport',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Gift',
  'Refund',
  'Other',
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  'UPI',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Cash',
];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; hex: string; lightBg: string }> = {
  Food: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', hex: '#F59E0B', lightBg: '#FEF3C7' },
  Shopping: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', hex: '#8B5CF6', lightBg: '#EDE9FE' },
  Transport: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', hex: '#3B82F6', lightBg: '#DBEAFE' },
  Bills: { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800', hex: '#F43F5E', lightBg: '#FFE4E6' },
  Entertainment: { bg: 'bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800', hex: '#EC4899', lightBg: '#FCE7F3' },
  Health: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', hex: '#10B981', lightBg: '#D1FAE5' },
  Education: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800', hex: '#6366F1', lightBg: '#E0E7FF' },
  Salary: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', hex: '#10B981', lightBg: '#D1FAE5' },
  Freelance: { bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800', hex: '#06B6D4', lightBg: '#CFFAFE' },
  Investments: { bg: 'bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800', hex: '#14B8A6', lightBg: '#CCFBF1' },
  Gift: { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-600 dark:text-fuchsia-400', border: 'border-fuchsia-200 dark:border-fuchsia-800', hex: '#D946EF', lightBg: '#FAE8FF' },
  Refund: { bg: 'bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-800', hex: '#0EA5E9', lightBg: '#E0F2FE' },
  Other: { bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-800', hex: '#64748B', lightBg: '#F1F5F9' },
};

export function formatCurrency(amount: number, currencyCode: CurrencyCode = 'INR', includeDecimals = false): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const absVal = Math.abs(amount);
  
  let formattedNumber: string;
  try {
    formattedNumber = new Intl.NumberFormat(config.locale, {
      minimumFractionDigits: includeDecimals ? 2 : 0,
      maximumFractionDigits: includeDecimals ? 2 : 0,
    }).format(absVal);
  } catch {
    formattedNumber = absVal.toLocaleString();
  }

  const sign = amount < 0 ? '-' : '';
  return `${sign}${config.symbol}${formattedNumber}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatRelativeDate(dateString: string): string {
  if (!dateString) return '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dateString + 'T00:00:00');
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays === -1) return 'Tomorrow';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
  
  return formatDate(dateString);
}

export function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
}

export type TransactionType = 'income' | 'expense';

export type ExpenseCategory =
  | 'Food'
  | 'Shopping'
  | 'Transport'
  | 'Bills'
  | 'Entertainment'
  | 'Health'
  | 'Education'
  | 'Other';

export type IncomeCategory =
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Gift'
  | 'Refund'
  | 'Other';

export type PaymentMethod =
  | 'Cash'
  | 'UPI'
  | 'Credit Card'
  | 'Debit Card'
  | 'Bank Transfer';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: number;
}

export interface Budget {
  id: string;
  category: ExpenseCategory;
  amount: number;
  month?: string; // YYYY-MM or global
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export interface UserSettings {
  userName: string;
  userEmail: string;
  currency: CurrencyCode;
  monthlyIncomeTarget: number;
  monthlySavingsTarget: number;
  notificationsEnabled: boolean;
  compactView: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export type ActivePage = 'dashboard' | 'transactions' | 'budgets' | 'analytics' | 'settings';

export interface FinancialInsight {
  id: string;
  type: 'positive' | 'warning' | 'info' | 'neutral';
  title: string;
  description: string;
  metric?: string;
}

export interface BudgetStatus {
  category: ExpenseCategory;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  isOverBudget: boolean;
  status: 'safe' | 'warning' | 'danger';
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string;
}


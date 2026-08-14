import { Transaction, Budget, UserSettings, CurrencyCode } from '../types';
import { DEFAULT_USER_SETTINGS, DEFAULT_BUDGETS, generateSampleTransactions } from '../data/sampleData';
import { CURRENCIES } from './formatters';

const STORAGE_KEYS = {
  TRANSACTIONS: 'spendwise_transactions_v1',
  BUDGETS: 'spendwise_budgets_v1',
  SETTINGS: 'spendwise_settings_v1',
  INITIALIZED: 'spendwise_initialized_v1',
};

// --- Initial Setup / Data Bootstrapping ---
export function initializeStorageIfNeeded(): {
  transactions: Transaction[];
  budgets: Budget[];
  settings: UserSettings;
} {
  try {
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInitialized) {
      const sampleTxs = generateSampleTransactions();
      const defaultBudgets = [...DEFAULT_BUDGETS];
      const defaultSettings = { ...DEFAULT_USER_SETTINGS };

      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(sampleTxs));
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(defaultBudgets));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');

      return {
        transactions: sampleTxs,
        budgets: defaultBudgets,
        settings: defaultSettings,
      };
    }
  } catch (err) {
    console.error('LocalStorage init error:', err);
  }

  return {
    transactions: getStoredTransactions(),
    budgets: getStoredBudgets(),
    settings: getStoredSettings(),
  };
}

// --- Transactions CRUD ---
export function getStoredTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to load transactions:', err);
  }
  return [];
}

export function saveStoredTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (err) {
    console.error('Failed to save transactions:', err);
  }
}

// --- Budgets CRUD ---
export function getStoredBudgets(): Budget[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to load budgets:', err);
  }
  return [...DEFAULT_BUDGETS];
}

export function saveStoredBudgets(budgets: Budget[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  } catch (err) {
    console.error('Failed to save budgets:', err);
  }
}

// --- Settings CRUD ---
export function getStoredSettings(): UserSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
  return { ...DEFAULT_USER_SETTINGS };
}

export function saveStoredSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

// --- Reset & Clear Operations ---
export function resetAppToSampleData(): {
  transactions: Transaction[];
  budgets: Budget[];
  settings: UserSettings;
} {
  const sampleTxs = generateSampleTransactions();
  const defaultBudgets = [...DEFAULT_BUDGETS];
  const defaultSettings = { ...DEFAULT_USER_SETTINGS };

  saveStoredTransactions(sampleTxs);
  saveStoredBudgets(defaultBudgets);
  saveStoredSettings(defaultSettings);
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');

  return {
    transactions: sampleTxs,
    budgets: defaultBudgets,
    settings: defaultSettings,
  };
}

export function clearAllTransactions(): void {
  saveStoredTransactions([]);
}

export function resetAllAppData(): void {
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  localStorage.removeItem(STORAGE_KEYS.BUDGETS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
}

// --- Export to CSV ---
export function exportToCSV(transactions: Transaction[], currency: CurrencyCode = 'INR'): void {
  if (!transactions.length) return;

  const symbol = CURRENCIES[currency]?.symbol || '₹';
  const headers = ['ID', 'Date', 'Type', 'Description', 'Category', `Amount (${symbol})`, 'Payment Method', 'Notes'];

  const rows = transactions.map((t) => [
    `"${t.id}"`,
    `"${t.date}"`,
    `"${t.type.toUpperCase()}"`,
    `"${t.description.replace(/"/g, '""')}"`,
    `"${t.category}"`,
    t.amount.toString(),
    `"${t.paymentMethod}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SpendWise_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

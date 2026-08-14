import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Transaction,
  Budget,
  UserSettings,
  ActivePage,
  ToastMessage,
  CurrencyCode,
} from '../types';
import {
  initializeStorageIfNeeded,
  saveStoredTransactions,
  saveStoredBudgets,
  saveStoredSettings,
  resetAppToSampleData,
  clearAllTransactions as clearStorageTransactions,
  resetAllAppData as resetStorageAll,
} from '../utils/storage';

interface ConfirmModalConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}

interface AppContextType {
  // State
  transactions: Transaction[];
  budgets: Budget[];
  settings: UserSettings;
  activePage: ActivePage;
  searchQuery: string;
  toasts: ToastMessage[];

  // Navigation
  setActivePage: (page: ActivePage) => void;
  setSearchQuery: (query: string) => void;

  // Actions - Transactions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;

  // Actions - Budgets
  upsertBudget: (category: Budget['category'], amount: number) => void;
  deleteBudget: (id: string) => void;

  // Actions - Settings & Data
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  setCurrency: (currency: CurrencyCode) => void;
  handleResetToSample: () => void;
  handleClearAllTransactions: () => void;
  handleFullReset: () => void;

  // Modals & UI Triggers
  isTransactionModalOpen: boolean;
  editingTransaction: Transaction | null;
  openTransactionModal: (tx?: Transaction) => void;
  closeTransactionModal: () => void;

  isBudgetModalOpen: boolean;
  editingBudget: Budget | null;
  openBudgetModal: (budget?: Budget) => void;
  closeBudgetModal: () => void;

  confirmModalConfig: ConfirmModalConfig | null;
  openConfirmModal: (config: ConfirmModalConfig) => void;
  closeConfirmModal: () => void;

  // Notifications / Toast
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    userName: 'Alex Sharma',
    userEmail: 'alex.sharma@example.com',
    currency: 'INR',
    monthlyIncomeTarget: 85000,
    monthlySavingsTarget: 30000,
    notificationsEnabled: true,
    compactView: false,
  });

  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const [confirmModalConfig, setConfirmModalConfig] = useState<ConfirmModalConfig | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const initial = initializeStorageIfNeeded();
    setTransactions(initial.transactions);
    setBudgets(initial.budgets);
    setSettings(initial.settings);
  }, []);

  // Toast trigger
  const showToast = useCallback(
    (title: string, message: string, type: ToastMessage['type'] = 'success') => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, title, message, type };
      setToasts((prev) => [...prev.slice(-3), newToast]); // Keep max 4

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Transactions Actions
  const addTransaction = useCallback(
    (txData: Omit<Transaction, 'id' | 'createdAt'>) => {
      const newTx: Transaction = {
        ...txData,
        id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        createdAt: Date.now(),
      };

      setTransactions((prev) => {
        const updated = [newTx, ...prev];
        saveStoredTransactions(updated);
        return updated;
      });

      showToast(
        'Transaction Added',
        `${newTx.type === 'income' ? 'Income' : 'Expense'} of ${newTx.amount} recorded for ${newTx.category}.`,
        'success'
      );
    },
    [showToast]
  );

  const updateTransaction = useCallback(
    (updatedTx: Transaction) => {
      setTransactions((prev) => {
        const updated = prev.map((t) => (t.id === updatedTx.id ? updatedTx : t));
        saveStoredTransactions(updated);
        return updated;
      });

      showToast('Transaction Updated', 'Your changes have been saved successfully.', 'info');
    },
    [showToast]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions((prev) => {
        const updated = prev.filter((t) => t.id !== id);
        saveStoredTransactions(updated);
        return updated;
      });

      showToast('Transaction Deleted', 'Transaction was removed from your records.', 'info');
    },
    [showToast]
  );

  // Budget Actions
  const upsertBudget = useCallback(
    (category: Budget['category'], amount: number) => {
      setBudgets((prev) => {
        const exists = prev.find((b) => b.category === category);
        let updated: Budget[];
        if (exists) {
          updated = prev.map((b) => (b.category === category ? { ...b, amount } : b));
        } else {
          updated = [...prev, { id: 'b-' + Date.now(), category, amount }];
        }
        saveStoredBudgets(updated);
        return updated;
      });

      showToast('Budget Saved', `Monthly budget for ${category} set to ${amount}.`, 'success');
    },
    [showToast]
  );

  const deleteBudget = useCallback(
    (id: string) => {
      setBudgets((prev) => {
        const updated = prev.filter((b) => b.id !== id);
        saveStoredBudgets(updated);
        return updated;
      });

      showToast('Budget Removed', 'Category budget has been deleted.', 'info');
    },
    [showToast]
  );

  // Settings Actions
  const updateSettings = useCallback(
    (newSettings: Partial<UserSettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        saveStoredSettings(updated);
        return updated;
      });
      showToast('Settings Updated', 'Preferences saved successfully.', 'success');
    },
    [showToast]
  );

  const setCurrency = useCallback(
    (currency: CurrencyCode) => {
      updateSettings({ currency });
    },
    [updateSettings]
  );

  // Reset & Clear Handlers
  const handleResetToSample = useCallback(() => {
    const data = resetAppToSampleData();
    setTransactions(data.transactions);
    setBudgets(data.budgets);
    setSettings(data.settings);
    showToast('Reset Complete', 'Loaded realistic sample transactions and budgets.', 'info');
  }, [showToast]);

  const handleClearAllTransactions = useCallback(() => {
    clearStorageTransactions();
    setTransactions([]);
    showToast('Transactions Cleared', 'All transaction history has been removed.', 'warning');
  }, [showToast]);

  const handleFullReset = useCallback(() => {
    resetStorageAll();
    const data = resetAppToSampleData();
    setTransactions(data.transactions);
    setBudgets(data.budgets);
    setSettings(data.settings);
    showToast('App Reset', 'SpendWise has been reset to its original fresh state.', 'info');
  }, [showToast]);

  // Modal Handlers
  const openTransactionModal = useCallback((tx?: Transaction) => {
    setEditingTransaction(tx || null);
    setIsTransactionModalOpen(true);
  }, []);

  const closeTransactionModal = useCallback(() => {
    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
  }, []);

  const openBudgetModal = useCallback((budget?: Budget) => {
    setEditingBudget(budget || null);
    setIsBudgetModalOpen(true);
  }, []);

  const closeBudgetModal = useCallback(() => {
    setIsBudgetModalOpen(false);
    setEditingBudget(null);
  }, []);

  const openConfirmModal = useCallback((config: ConfirmModalConfig) => {
    setConfirmModalConfig(config);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModalConfig(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        transactions,
        budgets,
        settings,
        activePage,
        searchQuery,
        toasts,
        setActivePage,
        setSearchQuery,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        upsertBudget,
        deleteBudget,
        updateSettings,
        setCurrency,
        handleResetToSample,
        handleClearAllTransactions,
        handleFullReset,
        isTransactionModalOpen,
        editingTransaction,
        openTransactionModal,
        closeTransactionModal,
        isBudgetModalOpen,
        editingBudget,
        openBudgetModal,
        closeBudgetModal,
        confirmModalConfig,
        openConfirmModal,
        closeConfirmModal,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

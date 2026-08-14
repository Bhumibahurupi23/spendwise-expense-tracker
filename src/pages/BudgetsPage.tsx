import React, { useState, useMemo } from 'react';
import {
  PiggyBank,
  Plus,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { BudgetCard } from '../components/BudgetCard';
import { BudgetModal } from '../components/BudgetModal';
import { EmptyState } from '../components/EmptyState';
import {
  calculateBudgetStatuses,
  getCurrentYearMonth,
} from '../utils/analytics';
import { formatCurrency, EXPENSE_CATEGORIES } from '../utils/formatters';
import { ExpenseCategory } from '../types';

export const BudgetsPage: React.FC = () => {
  const {
    budgets,
    transactions,
    settings,
    upsertBudget,
    deleteBudget,
    isBudgetModalOpen,
    editingBudget,
    openBudgetModal,
    closeBudgetModal,
    openConfirmModal,
  } = useApp();

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentYearMonth());

  const budgetStatuses = useMemo(() => {
    return calculateBudgetStatuses(transactions, budgets, selectedMonth);
  }, [transactions, budgets, selectedMonth]);

  const totalBudgeted = useMemo(() => {
    return budgets.reduce((sum, b) => sum + b.amount, 0);
  }, [budgets]);

  const totalSpentInMonth = useMemo(() => {
    return budgetStatuses.reduce((sum, b) => sum + b.spentAmount, 0);
  }, [budgetStatuses]);

  const overallPercent = totalBudgeted > 0 ? Math.round((totalSpentInMonth / totalBudgeted) * 100) : 0;
  const isOverallOver = totalSpentInMonth > totalBudgeted && totalBudgeted > 0;
  const overspentCount = budgetStatuses.filter((b) => b.isOverBudget).length;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const existingBudgetCategories = useMemo(() => {
    return budgets.map((b) => b.category);
  }, [budgets]);

  const currentMonthLabel = new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${selectedMonth}-01T00:00:00`));

  return (
    <div id="budgets-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Monthly Budgets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Set smart category limits and eliminate unexpected overspending
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {overspentCount === 0 && budgetStatuses.length > 0 && (
            <button
              onClick={triggerCelebration}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              On Track!
            </button>
          )}

          <button
            id="add-budget-btn"
            onClick={() => openBudgetModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Set Category Budget
          </button>
        </div>
      </div>

      {/* Aggregate Budget Status Banner */}
      <div
        id="overall-budget-summary-banner"
        className={`rounded-2xl border p-5 sm:p-6 text-white shadow-md relative overflow-hidden ${
          isOverallOver
            ? 'bg-gradient-to-br from-rose-900 via-rose-800 to-slate-900 border-rose-700'
            : overallPercent >= 80
            ? 'bg-gradient-to-br from-amber-900 via-amber-800 to-slate-900 border-amber-700'
            : 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-indigo-800'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1 text-slate-300 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Overview for {currentMonthLabel}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              {formatCurrency(totalSpentInMonth, settings.currency)}{' '}
              <span className="text-sm sm:text-lg font-normal text-slate-300">
                spent of {formatCurrency(totalBudgeted, settings.currency)} budgeted
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {isOverallOver ? (
                <span className="text-rose-300 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Monthly aggregate budget exceeded by{' '}
                  {formatCurrency(totalSpentInMonth - totalBudgeted, settings.currency)}
                </span>
              ) : (
                <span>
                  {formatCurrency(totalBudgeted - totalSpentInMonth, settings.currency)} remaining
                  across all categories.
                </span>
              )}
            </p>
          </div>

          <div className="w-full lg:w-72 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>Overall Utilization</span>
              <span className={isOverallOver ? 'text-rose-400' : 'text-emerald-400'}>
                {overallPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverallOver
                    ? 'bg-rose-500'
                    : overallPercent >= 80
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(overallPercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{budgetStatuses.length} category budgets</span>
              <span>
                {overspentCount > 0 ? `${overspentCount} over limit` : 'All within limits'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Category Budgets */}
      {budgetStatuses.length === 0 ? (
        <EmptyState
          title="No budgets created yet"
          description="Create monthly spending caps for groceries, shopping, bills, and entertainment to manage your savings goals."
          actionLabel="Create First Budget"
          onAction={() => openBudgetModal()}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {budgetStatuses.map((status) => {
            const rawBudget = budgets.find((b) => b.category === status.category);
            return (
              <BudgetCard
                key={status.category}
                budgetStatus={status}
                currency={settings.currency}
                onEdit={() => openBudgetModal(rawBudget)}
                onDelete={() => {
                  if (rawBudget) {
                    openConfirmModal({
                      title: `Delete ${status.category} Budget`,
                      message: `Are you sure you want to remove the monthly limit for ${status.category}?`,
                      confirmLabel: 'Delete Budget',
                      isDestructive: true,
                      onConfirm: () => deleteBudget(rawBudget.id),
                    });
                  }
                }}
              />
            );
          })}
        </div>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        editingBudget={editingBudget}
        currency={settings.currency}
        existingBudgetCategories={existingBudgetCategories}
        onClose={closeBudgetModal}
        onSave={(category: ExpenseCategory, amount: number) => {
          upsertBudget(category, amount);
        }}
      />
    </div>
  );
};

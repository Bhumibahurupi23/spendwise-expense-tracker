import React, { useMemo } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SummaryCard } from '../components/SummaryCard';
import { SpendingOverviewChart } from '../components/charts/SpendingOverviewChart';
import { ExpenseBreakdownChart } from '../components/charts/ExpenseBreakdownChart';
import { TransactionList } from '../components/TransactionList';
import { EmptyState } from '../components/EmptyState';
import {
  calculateFinancialSummary,
  calculateBudgetStatuses,
  getCurrentYearMonth,
} from '../utils/analytics';
import { formatCurrency, CATEGORY_COLORS } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const {
    transactions,
    budgets,
    settings,
    setActivePage,
    openTransactionModal,
    deleteTransaction,
    openConfirmModal,
    searchQuery,
  } = useApp();

  const summary = useMemo(() => calculateFinancialSummary(transactions), [transactions]);
  const budgetStatuses = useMemo(
    () => calculateBudgetStatuses(transactions, budgets, getCurrentYearMonth()),
    [transactions, budgets]
  );

  // Filter transactions for recent list based on global search if present
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.paymentMethod.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q))
    );
  }, [transactions, searchQuery]);

  // Greeting based on current hour
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const currentMonthName = new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div id="dashboard-page" className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {getGreeting()}, {settings.userName.split(' ')[0]}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Here's what's happening with your finances this {currentMonthName}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="dashboard-add-tx-cta"
            onClick={() => openTransactionModal()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xs shadow-indigo-200 hover:bg-indigo-700 active:scale-98 transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          id="summary-total-balance"
          title="Total Balance"
          amount={summary.totalBalance}
          currency={settings.currency}
          icon={Wallet}
          changePercent={summary.balanceChangePercent}
          variant="primary"
          trendLabel="all-time"
        />

        <SummaryCard
          id="summary-total-income"
          title="Monthly Income"
          amount={summary.totalIncome}
          currency={settings.currency}
          icon={ArrowUpRight}
          changePercent={summary.incomeChangePercent}
          variant="success"
          trendLabel="from last month"
        />

        <SummaryCard
          id="summary-total-expenses"
          title="Monthly Expenses"
          amount={summary.totalExpenses}
          currency={settings.currency}
          icon={ArrowDownLeft}
          changePercent={summary.expenseChangePercent}
          variant="danger"
          trendLabel="from last month"
        />

        <SummaryCard
          id="summary-total-savings"
          title="Net Savings"
          amount={summary.savings}
          currency={settings.currency}
          icon={PiggyBank}
          changePercent={summary.savingsChangePercent}
          variant="purple"
          subText={`${summary.savingsRate}% savings rate`}
        />
      </div>

      {/* Charts Section: Spending Overview & Expense Breakdown Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <SpendingOverviewChart transactions={transactions} currency={settings.currency} />
        </div>

        <div className="lg:col-span-5">
          <ExpenseBreakdownChart
            transactions={transactions}
            currency={settings.currency}
            monthFilter={getCurrentYearMonth()}
            onViewAllCategories={() => setActivePage('analytics')}
          />
        </div>
      </div>

      {/* Monthly Budget Quick Health Snapshot */}
      {budgetStatuses.length > 0 && (
        <div
          id="dashboard-budget-snapshot"
          className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs"
        >
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Monthly Budget Health
              </h3>
              <p className="text-xs text-slate-500">Active category spending limits</p>
            </div>
            <button
              id="dashboard-manage-budgets-btn"
              onClick={() => setActivePage('budgets')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 group cursor-pointer"
            >
              Manage Budgets
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {budgetStatuses.slice(0, 4).map((status) => {
              const catStyle = CATEGORY_COLORS[status.category] || CATEGORY_COLORS.Other;
              return (
                <div
                  key={status.category}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: catStyle.hex }}
                      />
                      {status.category}
                    </span>
                    <span
                      className={`font-semibold text-[11px] px-1.5 py-0.5 rounded ${
                        status.isOverBudget
                          ? 'bg-rose-100 text-rose-700'
                          : status.percentageUsed >= 85
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {status.percentageUsed}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        status.isOverBudget
                          ? 'bg-rose-500'
                          : status.percentageUsed >= 85
                          ? 'bg-amber-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{ width: `${Math.min(status.percentageUsed, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{formatCurrency(status.spentAmount, settings.currency)} spent</span>
                    <span>of {formatCurrency(status.budgetAmount, settings.currency)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Transactions List */}
      <div
        id="dashboard-recent-transactions"
        className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden"
      >
        <div className="flex items-center justify-between gap-2 p-6 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Recent Transactions
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {searchQuery ? `Showing results for "${searchQuery}"` : 'Latest financial activity'}
            </p>
          </div>

          <button
            id="dashboard-view-all-tx-btn"
            onClick={() => setActivePage('transactions')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 group cursor-pointer"
          >
            View all ({transactions.length})
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {filteredTransactions.length === 0 ? (
            <EmptyState
              title="No transactions found"
              description="Start recording your daily income and expenses to unlock live financial insights."
              actionLabel="Add Transaction"
              onAction={() => openTransactionModal()}
            />
          ) : (
            <TransactionList
              transactions={filteredTransactions}
              currency={settings.currency}
              limit={6}
              onEdit={(tx) => openTransactionModal(tx)}
              onDelete={(id) => {
                openConfirmModal({
                  title: 'Delete Transaction',
                  message: 'Are you sure you want to remove this transaction? This action cannot be undone.',
                  confirmLabel: 'Delete',
                  isDestructive: true,
                  onConfirm: () => deleteTransaction(id),
                });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};


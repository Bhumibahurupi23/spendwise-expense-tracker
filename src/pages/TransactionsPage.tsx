import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TransactionList } from '../components/TransactionList';
import { EmptyState } from '../components/EmptyState';
import { exportToCSV } from '../utils/storage';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
  formatCurrency,
} from '../utils/formatters';
import { TransactionType } from '../types';

export const TransactionsPage: React.FC = () => {
  const {
    transactions,
    settings,
    openTransactionModal,
    deleteTransaction,
    openConfirmModal,
    searchQuery: globalSearch,
  } = useApp();

  // Local Filter States
  const [searchTerm, setSearchTerm] = useState<string>(globalSearch || '');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [dateMonthFilter, setDateMonthFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_desc' | 'amount_asc'>('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Extract unique months from transactions for filter dropdown
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    transactions.forEach((t) => {
      if (t.date) {
        monthsSet.add(t.date.slice(0, 7)); // YYYY-MM
      }
    });
    return Array.from(monthsSet).sort().reverse();
  }, [transactions]);

  // Combine category list
  const allCategories = useMemo(() => {
    const set = new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]);
    return Array.from(set);
  }, []);

  // Filter and Sort Logic
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.paymentMethod.toLowerCase().includes(q) ||
          (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((t) => t.type === typeFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.category === categoryFilter);
    }

    // Payment method filter
    if (paymentMethodFilter !== 'all') {
      result = result.filter((t) => t.paymentMethod === paymentMethodFilter);
    }

    // Month filter
    if (dateMonthFilter !== 'all') {
      result = result.filter((t) => t.date.startsWith(dateMonthFilter));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'amount_desc') {
        return b.amount - a.amount;
      }
      if (sortBy === 'amount_asc') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [
    transactions,
    searchTerm,
    typeFilter,
    categoryFilter,
    paymentMethodFilter,
    dateMonthFilter,
    sortBy,
  ]);

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    typeFilter,
    categoryFilter,
    paymentMethodFilter,
    dateMonthFilter,
    sortBy,
  ]);

  // Paginated slice
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTransactions.slice(start, start + itemsPerPage);
  }, [filteredAndSortedTransactions, currentPage]);

  const hasActiveFilters =
    searchTerm !== '' ||
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    paymentMethodFilter !== 'all' ||
    dateMonthFilter !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setPaymentMethodFilter('all');
    setDateMonthFilter('all');
    setSortBy('newest');
  };

  // Total sums of filtered transactions
  const totalIncomeFiltered = filteredAndSortedTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenseFiltered = filteredAndSortedTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div id="transactions-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Transactions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search, filter, and audit your complete financial records
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="export-csv-btn"
            onClick={() => exportToCSV(transactions, settings.currency)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>

          <button
            id="transactions-add-btn"
            onClick={() => openTransactionModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="transactions-search-input"
              type="text"
              placeholder="Search description, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Toggle: All / Income / Expense */}
          <div className="lg:col-span-3 flex items-center bg-slate-100 p-1 rounded-xl">
            {(['all', 'income', 'expense'] as const).map((t) => (
              <button
                key={t}
                id={`filter-type-${t}`}
                onClick={() => setTypeFilter(t)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                  typeFilter === t
                    ? t === 'income'
                      ? 'bg-white text-emerald-600 shadow-2xs'
                      : t === 'expense'
                      ? 'bg-white text-rose-600 shadow-2xs'
                      : 'bg-white text-indigo-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="lg:col-span-2">
            <select
              id="filter-category-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="all">All Categories</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Dropdown */}
          <div className="lg:col-span-3">
            <select
              id="filter-payment-method-select"
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="all">All Payment Methods</option>
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Row: Month Filter, Sorting & Active Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium">Filter Month:</span>
            <select
              id="filter-month-select"
              value={dateMonthFilter}
              onChange={(e) => setDateMonthFilter(e.target.value)}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700"
            >
              <option value="all">All Time</option>
              {availableMonths.map((m) => {
                const dateObj = new Date(`${m}-01T00:00:00`);
                const label = new Intl.DateTimeFormat('en-IN', {
                  month: 'short',
                  year: 'numeric',
                }).format(dateObj);
                return (
                  <option key={m} value={m}>
                    {label}
                  </option>
                );
              })}
            </select>

            <span className="text-slate-400 font-medium ml-2">Sort by:</span>
            <select
              id="sort-by-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_desc">Amount: High to Low</option>
              <option value="amount_asc">Amount: Low to High</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                id="reset-filters-btn"
                onClick={resetFilters}
                className="text-indigo-600 hover:text-indigo-700 font-bold text-xs"
              >
                Clear all filters
              </button>
            )}

            <span className="text-slate-400 font-medium">
              Showing {filteredAndSortedTransactions.length} results
            </span>
          </div>
        </div>
      </div>

      {/* Filtered Financial Summary Pill */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-xl flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-800">Filtered Income</span>
          <span className="text-sm font-extrabold text-emerald-700 font-display">
            {formatCurrency(totalIncomeFiltered, settings.currency)}
          </span>
        </div>
        <div className="bg-rose-50/70 border border-rose-100 p-3 rounded-xl flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-800">Filtered Expenses</span>
          <span className="text-sm font-extrabold text-rose-700 font-display">
            {formatCurrency(totalExpenseFiltered, settings.currency)}
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-indigo-50/70 border border-indigo-100 p-3 rounded-xl flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-800">Filtered Net</span>
          <span className="text-sm font-extrabold text-indigo-700 font-display">
            {formatCurrency(totalIncomeFiltered - totalExpenseFiltered, settings.currency)}
          </span>
        </div>
      </div>

      {/* Transaction Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        {filteredAndSortedTransactions.length === 0 ? (
          <EmptyState
            title="No matching transactions"
            description="Try adjusting your filters, searching for a different keyword, or add a new transaction."
            actionLabel="Add Transaction"
            onAction={() => openTransactionModal()}
          />
        ) : (
          <>
            <TransactionList
              transactions={paginatedTransactions}
              currency={settings.currency}
              onEdit={(tx) => openTransactionModal(tx)}
              onDelete={(id) => {
                openConfirmModal({
                  title: 'Delete Transaction',
                  message: 'Are you sure you want to remove this record? This action cannot be reversed.',
                  confirmLabel: 'Delete',
                  isDestructive: true,
                  onConfirm: () => deleteTransaction(id),
                });
              }}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Page <span className="font-bold text-slate-800">{currentPage}</span> of{' '}
                  <span className="font-bold text-slate-800">{totalPages}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    id="pagination-prev-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg font-bold transition-colors ${
                          currentPage === pageNum
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    id="pagination-next-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

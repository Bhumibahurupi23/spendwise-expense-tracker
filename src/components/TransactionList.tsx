import React from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Edit3,
  Trash2,
  Calendar,
  CreditCard,
  Tag,
  FileText,
} from 'lucide-react';
import { Transaction, CurrencyCode } from '../types';
import {
  formatCurrency,
  formatRelativeDate,
  CATEGORY_COLORS,
} from '../utils/formatters';

interface TransactionListProps {
  transactions: Transaction[];
  currency: CurrencyCode;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  limit?: number;
  showActions?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  currency,
  onEdit,
  onDelete,
  limit,
  showActions = true,
}) => {
  const displayList = limit ? transactions.slice(0, limit) : transactions;

  if (displayList.length === 0) {
    return (
      <div className="py-8 text-center text-slate-400 text-sm">
        No transactions found matching your criteria.
      </div>
    );
  }

  return (
    <div id="transactions-list-container" className="divide-y divide-slate-100">
      {displayList.map((tx) => {
        const isExpense = tx.type === 'expense';
        const catStyle = CATEGORY_COLORS[tx.category] || CATEGORY_COLORS.Other;

        return (
          <div
            key={tx.id}
            id={`transaction-row-${tx.id}`}
            className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50/80 rounded-xl transition-all duration-150 gap-3"
          >
            {/* Left: Icon & Details */}
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Type Indicator Icon */}
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                  isExpense
                    ? 'bg-rose-50 text-rose-600 border border-rose-100'
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}
              >
                {isExpense ? (
                  <ArrowDownLeft className="w-5 h-5" />
                ) : (
                  <ArrowUpRight className="w-5 h-5" />
                )}
              </div>

              {/* Title, Category & Payment Method */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">
                    {tx.description}
                  </h4>
                  {tx.notes && (
                    <span
                      title={tx.notes}
                      className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md flex items-center gap-1 cursor-help"
                    >
                      <FileText className="w-3 h-3" />
                      Note
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 flex-wrap">
                  <span
                    className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md text-[11px]"
                    style={{
                      backgroundColor: catStyle.lightBg,
                      color: catStyle.hex,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: catStyle.hex }}
                    />
                    {tx.category}
                  </span>

                  <span className="text-slate-300">•</span>
                  <span className="font-medium text-slate-500">{tx.paymentMethod}</span>

                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400 font-medium">
                    {formatRelativeDate(tx.date)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Amount & Actions */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 self-end sm:self-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="text-right">
                <span
                  className={`text-base sm:text-lg font-extrabold tracking-tight font-display ${
                    isExpense ? 'text-slate-900' : 'text-emerald-600'
                  }`}
                >
                  {isExpense ? '-' : '+'}
                  {formatCurrency(tx.amount, currency)}
                </span>
              </div>

              {showActions && (
                <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    id={`edit-tx-${tx.id}`}
                    onClick={() => onEdit(tx)}
                    title="Edit transaction"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    id={`delete-tx-${tx.id}`}
                    onClick={() => onDelete(tx.id)}
                    title="Delete transaction"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

import React from 'react';
import { AlertCircle, CheckCircle2, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { BudgetStatus, CurrencyCode } from '../types';
import { formatCurrency, CATEGORY_COLORS } from '../utils/formatters';

interface BudgetCardProps {
  budgetStatus: BudgetStatus;
  currency: CurrencyCode;
  onEdit: () => void;
  onDelete: () => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budgetStatus,
  currency,
  onEdit,
  onDelete,
}) => {
  const {
    category,
    budgetAmount,
    spentAmount,
    remainingAmount,
    percentageUsed,
    isOverBudget,
  } = budgetStatus;

  const categoryStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;

  // Visual status indicators
  let barColor = 'bg-indigo-500';
  let badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let badgeLabel = `${100 - Math.min(percentageUsed, 100)}% left`;

  if (isOverBudget) {
    barColor = 'bg-rose-500';
    badgeStyles = 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
    badgeLabel = `Overspent by ${formatCurrency(Math.abs(remainingAmount), currency)}`;
  } else if (percentageUsed >= 85) {
    barColor = 'bg-amber-500';
    badgeStyles = 'bg-amber-50 text-amber-700 border-amber-200';
    badgeLabel = 'Near limit';
  }

  return (
    <div
      id={`budget-card-${category.toLowerCase()}`}
      className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        isOverBudget ? 'border-rose-200 ring-2 ring-rose-500/10' : 'border-slate-200/80'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
              style={{ backgroundColor: categoryStyle.hex }}
            />
            <h4 className="text-base font-bold text-slate-900 tracking-tight">{category}</h4>
          </div>

          <div className="flex items-center gap-1">
            <button
              id={`edit-budget-${category.toLowerCase()}`}
              onClick={onEdit}
              title="Edit Budget"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              id={`delete-budget-${category.toLowerCase()}`}
              onClick={onDelete}
              title="Delete Budget"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Amount Spent vs Total Budget */}
        <div className="flex items-baseline justify-between mt-2 mb-3">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Spent</span>
            <span className="text-xl font-extrabold text-slate-900 font-display">
              {formatCurrency(spentAmount, currency)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium block">Budget</span>
            <span className="text-sm font-bold text-slate-600">
              {formatCurrency(budgetAmount, currency)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          />
        </div>
      </div>

      {/* Footer Info & Badges */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <span>{percentageUsed}% used</span>
        </div>

        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-semibold text-[11px] ${badgeStyles}`}
        >
          {isOverBudget ? (
            <AlertCircle className="w-3 h-3 text-rose-600" />
          ) : (
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          )}
          {badgeLabel}
        </span>
      </div>
    </div>
  );
};

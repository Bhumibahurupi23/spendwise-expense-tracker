import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { CurrencyCode } from '../types';

interface SummaryCardProps {
  id: string;
  title: string;
  amount: number;
  currency: CurrencyCode;
  icon: LucideIcon;
  changePercent?: number;
  trendLabel?: string;
  variant?: 'primary' | 'success' | 'danger' | 'purple';
  subText?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  id,
  title,
  amount,
  currency,
  icon: Icon,
  changePercent,
  trendLabel = 'from last month',
  variant = 'primary',
  subText,
}) => {
  const isPositive = (changePercent ?? 0) > 0;
  const isNeutral = changePercent === 0 || changePercent === undefined;

  // Variants styling aligned with Professional Polish
  const variantStyles = {
    primary: {
      bgIcon: 'bg-indigo-50 text-indigo-600',
    },
    success: {
      bgIcon: 'bg-emerald-50 text-emerald-600',
    },
    danger: {
      bgIcon: 'bg-rose-50 text-rose-600',
    },
    purple: {
      bgIcon: 'bg-amber-50 text-amber-600',
    },
  }[variant];

  return (
    <div
      id={id}
      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(amount, currency)}
          </h3>
        </div>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${variantStyles.bgIcon}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        {changePercent !== undefined ? (
          <span
            className={`font-medium flex items-center gap-0.5 ${
              isNeutral
                ? 'text-slate-500'
                : isPositive
                ? variant === 'danger'
                  ? 'text-rose-600'
                  : 'text-emerald-600'
                : variant === 'danger'
                ? 'text-emerald-600'
                : 'text-rose-600'
            }`}
          >
            {isNeutral ? (
              <Minus className="w-3 h-3" />
            ) : isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`}
          </span>
        ) : null}
        <span className="text-slate-400 font-normal">{subText || trendLabel}</span>
      </div>
    </div>
  );
};


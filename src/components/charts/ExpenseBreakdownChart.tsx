import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Transaction, CurrencyCode } from '../../types';
import { calculateCategoryBreakdown } from '../../utils/analytics';
import { formatCurrency, CATEGORY_COLORS } from '../../utils/formatters';
import { PieChart as PieIcon, ArrowRight } from 'lucide-react';

interface ExpenseBreakdownChartProps {
  transactions: Transaction[];
  currency: CurrencyCode;
  monthFilter?: string;
  onViewAllCategories?: () => void;
}

export const ExpenseBreakdownChart: React.FC<ExpenseBreakdownChartProps> = ({
  transactions,
  currency,
  monthFilter,
  onViewAllCategories,
}) => {
  const breakdown = useMemo(() => {
    return calculateCategoryBreakdown(transactions, monthFilter);
  }, [transactions, monthFilter]);

  const totalExpense = useMemo(() => {
    return breakdown.reduce((sum, item) => sum + item.amount, 0);
  }, [breakdown]);

  const chartData = useMemo(() => {
    return breakdown.map((item) => ({
      name: item.category,
      value: item.amount,
      percentage: item.percentage,
      color: CATEGORY_COLORS[item.category]?.hex || '#64748B',
    }));
  }, [breakdown]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700/60 backdrop-blur-md text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            />
            <span className="font-bold text-slate-200">{data.name}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-300">{formatCurrency(data.value, currency)}</span>
            <span className="font-semibold text-indigo-300">
              {data.payload.percentage}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="expense-breakdown-card"
      className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between"
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Expense Breakdown
            </h3>
            <p className="text-xs text-slate-500">By category distribution</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 font-medium block">Total Spent</span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900">
            {formatCurrency(totalExpense, currency)}
          </span>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          No expenses logged yet. Add an expense to see the breakdown.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto">
          {/* Donut Chart */}
          <div className="lg:col-span-6 relative h-48 sm:h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Total Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-400 font-medium">Categories</span>
              <span className="text-lg font-extrabold text-slate-800">
                {chartData.length}
              </span>
            </div>
          </div>

          {/* Category List / Progress Bars */}
          <div className="lg:col-span-6 flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
            {breakdown.slice(0, 5).map((item) => {
              const style = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;
              return (
                <div key={item.category} className="group flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: style.hex }}
                      />
                      <span className="font-semibold text-slate-700 truncate">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-slate-900 font-bold">
                        {formatCurrency(item.amount, currency)}
                      </span>
                      <span className="text-slate-400 text-[11px] w-8 text-right font-semibold">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  {/* Progress Line */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: style.hex,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {onViewAllCategories && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
          <button
            id="view-all-categories-btn"
            onClick={onViewAllCategories}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 group"
          >
            View detailed analytics
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

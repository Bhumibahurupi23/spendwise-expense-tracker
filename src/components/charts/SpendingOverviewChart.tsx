import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Transaction, CurrencyCode } from '../../types';
import { generateSpendingChartData } from '../../utils/analytics';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface SpendingOverviewChartProps {
  transactions: Transaction[];
  currency: CurrencyCode;
}

export const SpendingOverviewChart: React.FC<SpendingOverviewChartProps> = ({
  transactions,
  currency,
}) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const chartData = useMemo(() => {
    return generateSpendingChartData(transactions, timeframe);
  }, [transactions, timeframe]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const incomeVal = payload.find((p: any) => p.dataKey === 'income')?.value || 0;
      const expenseVal = payload.find((p: any) => p.dataKey === 'expense')?.value || 0;
      const netVal = incomeVal - expenseVal;

      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700/60 backdrop-blur-md text-xs min-w-[170px]">
          <p className="font-bold text-slate-200 border-b border-slate-700/80 pb-1.5 mb-2">
            {label}
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Income
              </span>
              <span className="font-semibold">{formatCurrency(incomeVal, currency)}</span>
            </div>
            <div className="flex items-center justify-between text-rose-400">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Expenses
              </span>
              <span className="font-semibold">{formatCurrency(expenseVal, currency)}</span>
            </div>
            <div className="flex items-center justify-between text-indigo-300 pt-1.5 border-t border-slate-800">
              <span className="font-medium">Net Savings</span>
              <span className="font-bold">
                {netVal >= 0 ? '+' : ''}
                {formatCurrency(netVal, currency)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="spending-overview-card"
      className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Spending Overview
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track income flow against expenses across periods
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div
          id="spending-overview-timeframe-switch"
          className="inline-flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto"
        >
          {(['weekly', 'monthly', 'yearly'] as const).map((tf) => (
            <button
              key={tf}
              id={`timeframe-tab-${tf}`}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all duration-150 ${
                timeframe === tf
                  ? 'bg-white text-indigo-600 shadow-xs shadow-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              tick={{ fill: '#64748B', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
              tickFormatter={(v) => `${formatCurrency(v, currency).slice(0, 4)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
            />
            <Bar
              name="Income"
              dataKey="income"
              fill="#10B981"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              name="Expenses"
              dataKey="expense"
              fill="#F43F5E"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
          Showing dynamic flow for {timeframe} timeframe
        </span>
        <span className="font-semibold text-slate-700">
          Updated with {transactions.length} transactions
        </span>
      </div>
    </div>
  );
};

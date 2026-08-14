import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  PieChart as PieIcon,
  CreditCard,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Activity,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  calculateFinancialSummary,
  calculateCategoryBreakdown,
  generateSpendingChartData,
  generateFinancialInsights,
  getCurrentYearMonth,
} from '../utils/analytics';
import { formatCurrency, CATEGORY_COLORS, PAYMENT_METHODS } from '../utils/formatters';

export const AnalyticsPage: React.FC = () => {
  const { transactions, budgets, settings } = useApp();

  const summary = useMemo(() => calculateFinancialSummary(transactions), [transactions]);
  const categoryBreakdown = useMemo(
    () => calculateCategoryBreakdown(transactions, getCurrentYearMonth()),
    [transactions]
  );
  const monthlyTrends = useMemo(
    () => generateSpendingChartData(transactions, 'monthly'),
    [transactions]
  );
  const insights = useMemo(
    () => generateFinancialInsights(transactions, budgets),
    [transactions, budgets]
  );

  // Highest spending category
  const topCategory = categoryBreakdown[0] || null;

  // Average monthly spending calculation
  const averageMonthlyExpense = useMemo(() => {
    if (monthlyTrends.length === 0) return 0;
    const total = monthlyTrends.reduce((sum, item) => sum + item.expense, 0);
    return Math.round(total / monthlyTrends.length);
  }, [monthlyTrends]);

  // Payment Methods Breakdown
  const paymentMethodData = useMemo(() => {
    const counts: Record<string, number> = {};
    let totalAmt = 0;
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        counts[t.paymentMethod] = (counts[t.paymentMethod] || 0) + t.amount;
        totalAmt += t.amount;
      });

    return Object.keys(counts).map((pm) => ({
      name: pm,
      value: counts[pm],
      percentage: totalAmt > 0 ? Math.round((counts[pm] / totalAmt) * 100) : 0,
    }));
  }, [transactions]);

  // Financial Health Score Calculation (0 to 100)
  const healthScore = useMemo(() => {
    let score = 50; // base

    // Savings rate weight (up to 30 pts)
    if (summary.savingsRate >= 30) score += 30;
    else if (summary.savingsRate >= 20) score += 20;
    else if (summary.savingsRate > 0) score += 10;
    else score -= 15;

    // Budget adherence weight (up to 20 pts)
    const overspentCount = insights.filter((i) => i.id === 'ins-budget-over').length;
    if (overspentCount === 0) score += 20;
    else score -= 10;

    return Math.max(10, Math.min(100, score));
  }, [summary.savingsRate, insights]);

  const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];

  return (
    <div id="analytics-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Financial Analytics & Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Deep algorithmic breakdown of your cashflow, velocity, and savings habits
          </p>
        </div>
      </div>

      {/* Dynamic Automated Insights Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Calculated Insights & Patterns
            </h3>
            <p className="text-xs text-slate-500">Derived from your active spending history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {insights.map((insight) => {
            const isPositive = insight.type === 'positive';
            const isWarning = insight.type === 'warning';

            return (
              <div
                key={insight.id}
                className={`p-4 rounded-xl border flex flex-col justify-between gap-2 ${
                  isWarning
                    ? 'bg-rose-50/60 border-rose-200/70 text-rose-900'
                    : isPositive
                    ? 'bg-emerald-50/60 border-emerald-200/70 text-emerald-900'
                    : 'bg-indigo-50/60 border-indigo-200/70 text-indigo-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider">{insight.title}</h4>
                  {insight.metric && (
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-white/90 shadow-2xs">
                      {insight.metric}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{insight.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Highest Spending Category */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Top Category
          </span>
          <p className="text-xl font-extrabold text-slate-900 tracking-tight">
            {topCategory ? topCategory.category : 'N/A'}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            {topCategory
              ? `${formatCurrency(topCategory.amount, settings.currency)} (${topCategory.percentage}%)`
              : 'No expenses logged'}
          </span>
        </div>

        {/* Average Monthly Spending */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Avg Monthly Spend
          </span>
          <p className="text-xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(averageMonthlyExpense, settings.currency)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Across past 6 recorded months</span>
        </div>

        {/* Savings Rate */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Current Savings Rate
          </span>
          <p className="text-xl font-extrabold text-emerald-600 tracking-tight">
            {summary.savingsRate}%
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            {formatCurrency(summary.savings, settings.currency)} net retained
          </span>
        </div>

        {/* Financial Health Score */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Financial Health
            </span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-extrabold text-indigo-600 tracking-tight mt-1">
            {healthScore}/100
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            {healthScore >= 75 ? 'Excellent Health' : healthScore >= 50 ? 'Moderate Health' : 'Needs Attention'}
          </span>
        </div>
      </div>

      {/* Main Charts: 6-Month Income vs Expense Trend & Category Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Monthly Income vs Expense Trajectory */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              6-Month Income vs Expenses Trajectory
            </h3>
            <p className="text-xs text-slate-500">Historical financial cash flow performance</p>
          </div>

          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
                  tickFormatter={(v) => `${formatCurrency(v, settings.currency).slice(0, 4)}k`}
                />
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value), settings.currency)}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 10 }} />
                <Bar name="Income" dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={30} />
                <Bar name="Expense" dataKey="expense" fill="#F43F5E" radius={[6, 6, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Payment Methods Breakdown
            </h3>
            <p className="text-xs text-slate-500">Volume distribution by channel</p>
          </div>

          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {paymentMethodData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => formatCurrency(Number(val), settings.currency)}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '10px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-4 pt-3 border-t border-slate-100">
            {paymentMethodData.map((pm, idx) => (
              <div key={pm.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  {pm.name}
                </span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(pm.value, settings.currency)} ({pm.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category-wise Spending Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Detailed Category Spending Breakdown
          </h3>
          <p className="text-xs text-slate-500">Current month rank and metrics</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">Category</th>
                <th className="pb-3 text-center">Transactions</th>
                <th className="pb-3 text-right">Total Spent</th>
                <th className="pb-3 text-right">% of Total</th>
                <th className="pb-3 text-right pr-2">Avg per Transaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {categoryBreakdown.map((item) => {
                const style = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;
                const avg = item.transactionCount > 0 ? Math.round(item.amount / item.transactionCount) : 0;

                return (
                  <tr key={item.category} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 pl-2 flex items-center gap-2.5 font-bold text-slate-900">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: style.hex }}
                      />
                      {item.category}
                    </td>
                    <td className="py-3 text-center text-slate-600">{item.transactionCount}</td>
                    <td className="py-3 text-right font-bold text-slate-900">
                      {formatCurrency(item.amount, settings.currency)}
                    </td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700">
                        {item.percentage}%
                      </span>
                    </td>
                    <td className="py-3 text-right pr-2 text-slate-600">
                      {formatCurrency(avg, settings.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import { Transaction, Budget, FinancialInsight, ExpenseCategory } from '../types';
import { EXPENSE_CATEGORIES } from './formatters';

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  savingsRate: number;
  // Month-over-month comparisons (current vs previous month)
  incomeChangePercent: number;
  expenseChangePercent: number;
  savingsChangePercent: number;
  balanceChangePercent: number;
  transactionCount: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string;
}

export interface BudgetStatus {
  category: ExpenseCategory;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  isOverBudget: boolean;
  status: 'safe' | 'warning' | 'danger';
}

export interface PeriodChartData {
  label: string;
  income: number;
  expense: number;
  net: number;
}

// Extract current YYYY-MM
export function getCurrentYearMonth(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${mm}`;
}

export function getPreviousYearMonth(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${mm}`;
}

// Calculate comprehensive financial summaries
export function calculateFinancialSummary(transactions: Transaction[]): FinancialSummary {
  const currentYM = getCurrentYearMonth();
  const prevYM = getPreviousYearMonth();

  let allTimeIncome = 0;
  let allTimeExpenses = 0;

  let currentMonthIncome = 0;
  let currentMonthExpenses = 0;

  let prevMonthIncome = 0;
  let prevMonthExpenses = 0;

  transactions.forEach((tx) => {
    const isCurrentMonth = tx.date.startsWith(currentYM);
    const isPrevMonth = tx.date.startsWith(prevYM);

    if (tx.type === 'income') {
      allTimeIncome += tx.amount;
      if (isCurrentMonth) currentMonthIncome += tx.amount;
      if (isPrevMonth) prevMonthIncome += tx.amount;
    } else {
      allTimeExpenses += tx.amount;
      if (isCurrentMonth) currentMonthExpenses += tx.amount;
      if (isPrevMonth) prevMonthExpenses += tx.amount;
    }
  });

  const totalBalance = allTimeIncome - allTimeExpenses;
  const currentSavings = currentMonthIncome - currentMonthExpenses;
  const prevSavings = prevMonthIncome - prevMonthExpenses;

  const savingsRate = currentMonthIncome > 0 ? (currentSavings / currentMonthIncome) * 100 : 0;

  // Percentage calculations safely
  const calcChange = (curr: number, prev: number): number => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  const incomeChangePercent = calcChange(currentMonthIncome, prevMonthIncome);
  const expenseChangePercent = calcChange(currentMonthExpenses, prevMonthExpenses);
  const savingsChangePercent = calcChange(currentSavings, prevSavings);
  const balanceChangePercent = calcChange(totalBalance, totalBalance - currentSavings);

  return {
    totalBalance,
    totalIncome: currentMonthIncome || allTimeIncome,
    totalExpenses: currentMonthExpenses || allTimeExpenses,
    savings: currentSavings,
    savingsRate: Math.max(0, Math.round(savingsRate)),
    incomeChangePercent,
    expenseChangePercent,
    savingsChangePercent,
    balanceChangePercent,
    transactionCount: transactions.length,
  };
}

// Expense Category Breakdown
export function calculateCategoryBreakdown(
  transactions: Transaction[],
  monthFilter?: string
): CategoryBreakdown[] {
  const expenseTxs = transactions.filter(
    (t) => t.type === 'expense' && (!monthFilter || t.date.startsWith(monthFilter))
  );

  const categoryTotals: Record<string, { amount: number; count: number }> = {};
  let totalExpense = 0;

  expenseTxs.forEach((t) => {
    if (!categoryTotals[t.category]) {
      categoryTotals[t.category] = { amount: 0, count: 0 };
    }
    categoryTotals[t.category].amount += t.amount;
    categoryTotals[t.category].count += 1;
    totalExpense += t.amount;
  });

  const breakdown: CategoryBreakdown[] = Object.keys(categoryTotals).map((category) => {
    const data = categoryTotals[category];
    const percentage = totalExpense > 0 ? Math.round((data.amount / totalExpense) * 100) : 0;
    return {
      category,
      amount: data.amount,
      percentage,
      transactionCount: data.count,
      color: '#6366F1',
    };
  });

  return breakdown.sort((a, b) => b.amount - a.amount);
}

// Calculate Budget Statuses for each category
export function calculateBudgetStatuses(
  transactions: Transaction[],
  budgets: Budget[],
  month: string = getCurrentYearMonth()
): BudgetStatus[] {
  const monthExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(month)
  );

  return EXPENSE_CATEGORIES.map((category) => {
    const budget = budgets.find((b) => b.category === category);
    const budgetAmount = budget ? budget.amount : 0;

    const spentAmount = monthExpenses
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);

    const remainingAmount = budgetAmount - spentAmount;
    const percentageUsed = budgetAmount > 0 ? Math.round((spentAmount / budgetAmount) * 100) : 0;
    const isOverBudget = budgetAmount > 0 && spentAmount > budgetAmount;

    let status: 'safe' | 'warning' | 'danger' = 'safe';
    if (isOverBudget || percentageUsed >= 90) {
      status = 'danger';
    } else if (percentageUsed >= 70) {
      status = 'warning';
    }

    return {
      category,
      budgetAmount,
      spentAmount,
      remainingAmount,
      percentageUsed,
      isOverBudget,
      status,
    };
  }).filter((b) => b.budgetAmount > 0 || b.spentAmount > 0);
}

// Generate Period Chart Data (Weekly, Monthly, Yearly)
export function generateSpendingChartData(
  transactions: Transaction[],
  timeframe: 'weekly' | 'monthly' | 'yearly'
): PeriodChartData[] {
  if (timeframe === 'weekly') {
    // Last 7 days
    const days: PeriodChartData[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const isoDate = d.toISOString().split('T')[0];
      const dayName = new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(d);

      let income = 0;
      let expense = 0;

      transactions.forEach((t) => {
        if (t.date === isoDate) {
          if (t.type === 'income') income += t.amount;
          else expense += t.amount;
        }
      });

      days.push({
        label: i === 0 ? 'Today' : dayName,
        income,
        expense,
        net: income - expense,
      });
    }
    return days;
  }

  if (timeframe === 'monthly') {
    // Last 6 months
    const months: PeriodChartData[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const ym = `${yyyy}-${mm}`;
      const monthName = new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(d);

      let income = 0;
      let expense = 0;

      transactions.forEach((t) => {
        if (t.date.startsWith(ym)) {
          if (t.type === 'income') income += t.amount;
          else expense += t.amount;
        }
      });

      months.push({
        label: monthName,
        income,
        expense,
        net: income - expense,
      });
    }
    return months;
  }

  // Yearly (last 4 quarters or years)
  const years: PeriodChartData[] = [];
  const currentYear = new Date().getFullYear();

  for (let yr = currentYear - 2; yr <= currentYear; yr++) {
    const yrStr = String(yr);
    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      if (t.date.startsWith(yrStr)) {
        if (t.type === 'income') income += t.amount;
        else expense += t.amount;
      }
    });

    years.push({
      label: yrStr,
      income,
      expense,
      net: income - expense,
    });
  }

  return years;
}

// Generate Automated Financial Insights
export function generateFinancialInsights(
  transactions: Transaction[],
  budgets: Budget[]
): FinancialInsight[] {
  const insights: FinancialInsight[] = [];
  const currentYM = getCurrentYearMonth();
  const prevYM = getPreviousYearMonth();

  const currentMonthTxs = transactions.filter((t) => t.date.startsWith(currentYM));
  const prevMonthTxs = transactions.filter((t) => t.date.startsWith(prevYM));

  const currentIncome = currentMonthTxs
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentExpense = currentMonthTxs
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // 1. Savings Rate Insight
  if (currentIncome > 0) {
    const savingsRate = Math.round(((currentIncome - currentExpense) / currentIncome) * 100);
    if (savingsRate >= 30) {
      insights.push({
        id: 'ins-savings-good',
        type: 'positive',
        title: 'Strong Savings Rate',
        description: `Your savings rate this month is ${savingsRate}%. Excellent discipline towards your financial goals.`,
        metric: `${savingsRate}%`,
      });
    } else if (savingsRate > 0) {
      insights.push({
        id: 'ins-savings-mod',
        type: 'info',
        title: 'Positive Savings Flow',
        description: `You are saving ${savingsRate}% of your monthly income. Aim for 20-30% to build your emergency buffer.`,
        metric: `${savingsRate}%`,
      });
    } else {
      insights.push({
        id: 'ins-savings-neg',
        type: 'warning',
        title: 'Deficit Alert',
        description: 'Your monthly expenses currently exceed your income. Review optional subscriptions and shopping.',
        metric: `${savingsRate}%`,
      });
    }
  }

  // 2. Highest Spending Category
  const categoryBreakdown = calculateCategoryBreakdown(transactions, currentYM);
  if (categoryBreakdown.length > 0) {
    const topCategory = categoryBreakdown[0];
    insights.push({
      id: 'ins-top-cat',
      type: 'info',
      title: 'Top Expense Category',
      description: `${topCategory.category} is your highest spending category this month, accounting for ${topCategory.percentage}% of all expenses.`,
      metric: `${topCategory.percentage}%`,
    });
  }

  // 3. Category Month-over-Month Comparison
  const topCurrent = categoryBreakdown[0]?.category;
  if (topCurrent) {
    const prevCatTotal = prevMonthTxs
      .filter((t) => t.type === 'expense' && t.category === topCurrent)
      .reduce((sum, t) => sum + t.amount, 0);
    const currCatTotal = categoryBreakdown[0].amount;

    if (prevCatTotal > 0) {
      const diffPercent = Math.round(((currCatTotal - prevCatTotal) / prevCatTotal) * 100);
      if (diffPercent > 10) {
        insights.push({
          id: 'ins-cat-increase',
          type: 'warning',
          title: `Increased Spend on ${topCurrent}`,
          description: `You spent ${diffPercent}% more on ${topCurrent} compared to last month.`,
          metric: `+${diffPercent}%`,
        });
      } else if (diffPercent < -10) {
        insights.push({
          id: 'ins-cat-decrease',
          type: 'positive',
          title: `Smart Savings on ${topCurrent}`,
          description: `You decreased ${topCurrent} spending by ${Math.abs(diffPercent)}% compared to last month.`,
          metric: `${diffPercent}%`,
        });
      }
    }
  }

  // 4. Budget Overrun Alert
  const budgetStatuses = calculateBudgetStatuses(transactions, budgets, currentYM);
  const overBudgetCategories = budgetStatuses.filter((b) => b.isOverBudget);
  if (overBudgetCategories.length > 0) {
    insights.push({
      id: 'ins-budget-over',
      type: 'warning',
      title: 'Budget Limit Exceeded',
      description: `${overBudgetCategories.map((c) => c.category).join(', ')} exceeded set monthly budget limit.`,
      metric: `${overBudgetCategories.length} Over`,
    });
  }

  // 5. Payment Method Insight
  const paymentCounts: Record<string, number> = {};
  currentMonthTxs.forEach((t) => {
    paymentCounts[t.paymentMethod] = (paymentCounts[t.paymentMethod] || 0) + 1;
  });
  const mostUsedMethod = Object.entries(paymentCounts).sort((a, b) => b[1] - a[1])[0];
  if (mostUsedMethod) {
    insights.push({
      id: 'ins-payment-method',
      type: 'neutral',
      title: 'Preferred Payment Channel',
      description: `${mostUsedMethod[0]} is your most active payment method with ${mostUsedMethod[1]} transactions this month.`,
      metric: mostUsedMethod[0],
    });
  }

  return insights;
}

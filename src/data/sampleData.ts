import { Transaction, Budget, UserSettings } from '../types';

export const DEFAULT_USER_SETTINGS: UserSettings = {
  userName: 'Alex Sharma',
  userEmail: 'alex.sharma@example.com',
  currency: 'INR',
  monthlyIncomeTarget: 85000,
  monthlySavingsTarget: 30000,
  notificationsEnabled: true,
  compactView: false,
};

export const DEFAULT_BUDGETS: Budget[] = [
  { id: 'b-1', category: 'Food', amount: 12000 },
  { id: 'b-2', category: 'Shopping', amount: 8000 },
  { id: 'b-3', category: 'Transport', amount: 4500 },
  { id: 'b-4', category: 'Bills', amount: 6500 },
  { id: 'b-5', category: 'Entertainment', amount: 3000 },
  { id: 'b-6', category: 'Health', amount: 3500 },
  { id: 'b-7', category: 'Education', amount: 5000 },
  { id: 'b-8', category: 'Other', amount: 2000 },
];

export function generateSampleTransactions(): Transaction[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  // Helper to generate ISO date YYYY-MM-DD
  const makeDate = (daysAgo: number): string => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const makePastMonthDate = (monthOffset: number, dayOfMonth: number): string => {
    const d = new Date(currentYear, currentMonth - monthOffset, dayOfMonth);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(Math.min(dayOfMonth, 28)).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return [
    // Current Month Income
    {
      id: 'tx-1',
      type: 'income',
      amount: 75000,
      description: 'Monthly Salary - Tech Innovations Ltd',
      category: 'Salary',
      date: makeDate(13),
      paymentMethod: 'Bank Transfer',
      notes: 'Direct deposit for August salary',
      createdAt: Date.now() - 13 * 86400000,
    },
    {
      id: 'tx-2',
      type: 'income',
      amount: 18500,
      description: 'Freelance UI/UX Design Project',
      category: 'Freelance',
      date: makeDate(4),
      paymentMethod: 'UPI',
      notes: 'Final milestone payment for mobile app redesign',
      createdAt: Date.now() - 4 * 86400000,
    },
    {
      id: 'tx-3',
      type: 'income',
      amount: 3200,
      description: 'Stock Dividend Yield',
      category: 'Investments',
      date: makeDate(8),
      paymentMethod: 'Bank Transfer',
      notes: 'Quarterly dividends',
      createdAt: Date.now() - 8 * 86400000,
    },

    // Current Month Expenses - Today & Recent
    {
      id: 'tx-4',
      type: 'expense',
      amount: 1450,
      description: 'Grocery Shopping - Blinkit Superstore',
      category: 'Food',
      date: makeDate(0), // Today
      paymentMethod: 'UPI',
      notes: 'Fresh veggies, dairy, and fruits',
      createdAt: Date.now(),
    },
    {
      id: 'tx-5',
      type: 'expense',
      amount: 680,
      description: 'Zomato Gourmet Dinner',
      category: 'Food',
      date: makeDate(1), // Yesterday
      paymentMethod: 'UPI',
      notes: 'Dinner with colleagues',
      createdAt: Date.now() - 1 * 86400000,
    },
    {
      id: 'tx-6',
      type: 'expense',
      amount: 3899,
      description: 'Amazon Purchase - Wireless Headphones',
      category: 'Shopping',
      date: makeDate(2),
      paymentMethod: 'Credit Card',
      notes: 'Noise cancelling earphones on Prime deal',
      createdAt: Date.now() - 2 * 86400000,
    },
    {
      id: 'tx-7',
      type: 'expense',
      amount: 420,
      description: 'Uber Premier Ride to City Center',
      category: 'Transport',
      date: makeDate(2),
      paymentMethod: 'UPI',
      notes: 'Meeting with client in HSR layout',
      createdAt: Date.now() - 2 * 86400000,
    },
    {
      id: 'tx-8',
      type: 'expense',
      amount: 2450,
      description: 'Electricity Bill - BESCOM',
      category: 'Bills',
      date: makeDate(5),
      paymentMethod: 'Debit Card',
      notes: 'Monthly utility electricity payment',
      createdAt: Date.now() - 5 * 86400000,
    },
    {
      id: 'tx-9',
      type: 'expense',
      amount: 999,
      description: 'Airtel Fiber Broadband',
      category: 'Bills',
      date: makeDate(6),
      paymentMethod: 'UPI',
      notes: '300 Mbps unlimited plan',
      createdAt: Date.now() - 6 * 86400000,
    },
    {
      id: 'tx-10',
      type: 'expense',
      amount: 649,
      description: 'Netflix Premium 4K Subscription',
      category: 'Entertainment',
      date: makeDate(7),
      paymentMethod: 'Credit Card',
      notes: 'Monthly family recurring streaming plan',
      createdAt: Date.now() - 7 * 86400000,
    },
    {
      id: 'tx-11',
      type: 'expense',
      amount: 1850,
      description: 'Apollo Pharmacy Health & Vitamins',
      category: 'Health',
      date: makeDate(9),
      paymentMethod: 'UPI',
      notes: 'Monthly wellness supplements & first aid',
      createdAt: Date.now() - 9 * 86400000,
    },
    {
      id: 'tx-12',
      type: 'expense',
      amount: 2200,
      description: 'Zara Weekend Casual Shirt',
      category: 'Shopping',
      date: makeDate(10),
      paymentMethod: 'Credit Card',
      notes: 'Summer collection formal wear',
      createdAt: Date.now() - 10 * 86400000,
    },
    {
      id: 'tx-13',
      type: 'expense',
      amount: 3200,
      description: 'Online Full-Stack Certification Course',
      category: 'Education',
      date: makeDate(11),
      paymentMethod: 'Debit Card',
      notes: 'TypeScript Masterclass on Udemy',
      createdAt: Date.now() - 11 * 86400000,
    },
    {
      id: 'tx-14',
      type: 'expense',
      amount: 850,
      description: 'Cafe Coffee Day - Brainstorming Session',
      category: 'Food',
      date: makeDate(12),
      paymentMethod: 'Cash',
      notes: 'Coffee & snacks with project partner',
      createdAt: Date.now() - 12 * 86400000,
    },
    {
      id: 'tx-15',
      type: 'expense',
      amount: 550,
      description: 'Metro Smart Card Recharge',
      category: 'Transport',
      date: makeDate(14),
      paymentMethod: 'UPI',
      notes: 'Monthly commute balance top-up',
      createdAt: Date.now() - 14 * 86400000,
    },

    // Previous Month Data (for month-over-month trend and charts)
    {
      id: 'tx-16',
      type: 'income',
      amount: 75000,
      description: 'Monthly Salary - Tech Innovations Ltd',
      category: 'Salary',
      date: makePastMonthDate(1, 1),
      paymentMethod: 'Bank Transfer',
      createdAt: Date.now() - 40 * 86400000,
    },
    {
      id: 'tx-17',
      type: 'income',
      amount: 12000,
      description: 'Freelance Consultation',
      category: 'Freelance',
      date: makePastMonthDate(1, 18),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 25 * 86400000,
    },
    {
      id: 'tx-18',
      type: 'expense',
      amount: 9800,
      description: 'Monthly Supermarket Provisions',
      category: 'Food',
      date: makePastMonthDate(1, 5),
      paymentMethod: 'Credit Card',
      createdAt: Date.now() - 38 * 86400000,
    },
    {
      id: 'tx-19',
      type: 'expense',
      amount: 6200,
      description: 'College Semester Exam & Lab Fees',
      category: 'Education',
      date: makePastMonthDate(1, 10),
      paymentMethod: 'Bank Transfer',
      createdAt: Date.now() - 34 * 86400000,
    },
    {
      id: 'tx-20',
      type: 'expense',
      amount: 4500,
      description: 'Fashion Shopping - Myntra Sale',
      category: 'Shopping',
      date: makePastMonthDate(1, 15),
      paymentMethod: 'Credit Card',
      createdAt: Date.now() - 29 * 86400000,
    },
    {
      id: 'tx-21',
      type: 'expense',
      amount: 3100,
      description: 'Fuel & Car Service Maintenance',
      category: 'Transport',
      date: makePastMonthDate(1, 20),
      paymentMethod: 'Debit Card',
      createdAt: Date.now() - 24 * 86400000,
    },
    {
      id: 'tx-22',
      type: 'expense',
      amount: 2800,
      description: 'Annual Health Checkup & Dental Cleaning',
      category: 'Health',
      date: makePastMonthDate(1, 22),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 22 * 86400000,
    },
    {
      id: 'tx-23',
      type: 'expense',
      amount: 1200,
      description: 'PVR IMAX Movie Tickets & Popcorn',
      category: 'Entertainment',
      date: makePastMonthDate(1, 26),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 18 * 86400000,
    },
    
    // 2 Months ago sample data for quarterly/yearly visualizations
    {
      id: 'tx-24',
      type: 'income',
      amount: 72000,
      description: 'Monthly Salary - Tech Innovations Ltd',
      category: 'Salary',
      date: makePastMonthDate(2, 1),
      paymentMethod: 'Bank Transfer',
      createdAt: Date.now() - 70 * 86400000,
    },
    {
      id: 'tx-25',
      type: 'expense',
      amount: 8900,
      description: 'Groceries & Household Goods',
      category: 'Food',
      date: makePastMonthDate(2, 6),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 65 * 86400000,
    },
    {
      id: 'tx-26',
      type: 'expense',
      amount: 3400,
      description: 'Electricity & Water Utility Bill',
      category: 'Bills',
      date: makePastMonthDate(2, 12),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 59 * 86400000,
    },
  ];
}

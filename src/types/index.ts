export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'cash';
  balance: number;
  currency: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'savings';
  color: string;
  parentId?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  categoryId: string;
  accountId: string;
  type: 'income' | 'expense';
  notes?: string;
}

export interface BudgetItem {
  id: string;
  categoryId: string;
  month: string; // YYYY-MM format
  budgetAmount: number;
  actualAmount: number;
  accountId?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'liquid' | 'non-liquid';
  category: 'cash' | 'stocks' | 'crypto' | 'gold' | 'property' | 'deposit';
  symbol?: string;
  shares?: number;
  price: number;
  currentValue: number;
  targetValue?: number;
  lastUpdated: string;
}

export interface MonthlyReport {
  month: number;
  year: number;
  totalIncome: number;
  totalSavings: number;
  totalSpending: number;
  remainingBudget: number;
  categories: BudgetCategory[];
  accounts: BankAccount[];
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  budgeted: number;
  actual: number;
  percentage: number;
  variance: number;
}

export interface DashboardData {
  monthlyReport: MonthlyReport;
  expensesByCategory: ChartData[];
  monthlyTrend: Array<{
    month: string;
    amount: number;
    budget: number;
  }>;
  assetsSummary: {
    totalValue: number;
    liquid: number;
    nonLiquid: number;
    profit: number;
    profitPercentage: number;
  };
}

export interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlyTrendData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface Settings {
  currency: string;
  dateFormat: string;
  categories: Category[];
  accounts: Account[];
  budgetTarget: number;
  savingsGoal: number;
  googleSheetId?: string;
  notificationPreferences: {
    budgetAlerts: boolean;
    monthlyReports: boolean;
    goalAchievements: boolean;
  };
  months: string[];
  defaultAccount: string;
  stockApiKey?: string;
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheets: {
    transactions: string;
    budgets: string;
    assets: string;
    categories: string;
    accounts: string;
    settings: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface TransactionFormData {
  date: string;
  description: string;
  amount: number;
  categoryId: string;
  accountId: string;
  type: 'income' | 'expense';
  notes?: string;
}

export interface BudgetFormData {
  categoryId: string;
  month: string;
  budgetAmount: number;
  accountId?: string;
}

export interface AssetFormData {
  name: string;
  type: 'liquid' | 'non-liquid';
  category: string;
  symbol?: string;
  quantity: number;
  currentPrice: number;
}

// Stock price data
export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

// Types for Personal Finance Tracker

export interface MonthlyIncome {
  id: string;
  source: string;
  amount: number;
  month: number;
  year: number;
  account?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  type: 'needs' | 'wants' | 'savings';
  color: string;
  allocation: number;
  spent: number;
  month: number;
  year: number;
  account?: string;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  account: string;
  month: number;
  year: number;
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment';
  balance: number;
  color: string;
}

export interface CategorySetting {
  id: string;
  name: string;
  type: 'needs' | 'wants' | 'savings';
  color: string;
  isActive: boolean;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
  percentage?: number;
}

// Authentication types
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  createdAt?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    budget: boolean;
    goals: boolean;
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SpreadsheetConfig {
  spreadsheetId: string;
  apiKey: string;
  ranges: {
    income: string;
    budget: string;
    expenses: string;
    assets: string;
    accounts: string;
    settings: string;
  };
}
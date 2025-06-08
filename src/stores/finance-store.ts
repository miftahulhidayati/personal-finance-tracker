import { create } from 'zustand';
import {
  MonthlyIncome,
  BudgetCategory,
  Expense,
  Asset,
  BankAccount,
  Settings,
  MonthlyReport,
  DashboardData
} from '@/types';

interface FinanceState {
  // Current state
  currentMonth: number;
  currentYear: number;

  // Data
  monthlyIncome: MonthlyIncome[];
  budgetCategories: BudgetCategory[];
  expenses: Expense[];
  assets: Asset[];
  bankAccounts: BankAccount[];
  settings: Settings | null;

  // Historical data for analytics
  historicalData: {
    income: MonthlyIncome[];
    expenses: Expense[];
    budget: BudgetCategory[];
  } | null;

  // Dashboard data
  dashboardData: DashboardData | null;

  // Loading states
  isLoading: boolean;
  isUpdating: boolean;

  // Error handling
  error: string | null;

  // Actions
  setCurrentMonth: (month: number, year: number) => void;
  loadData: () => Promise<void>;
  loadHistoricalData: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  exportData: (period: 'month' | 'quarter' | 'year') => void;

  // Income actions
  addIncome: (income: Omit<MonthlyIncome, 'id'>) => Promise<void>;
  updateIncome: (income: MonthlyIncome) => Promise<void>;

  // Budget actions
  updateBudgetCategory: (category: BudgetCategory) => Promise<void>;

  // Expense actions
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  // Asset actions
  updateAsset: (asset: Asset) => Promise<void>;
  refreshAssetPrices: () => Promise<void>;

  // Account actions
  updateAccount: (account: BankAccount) => Promise<void>;

  // Settings actions
  updateSettings: (settings: Settings) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  // Initial state
  currentMonth: new Date().getMonth() + 1,
  currentYear: new Date().getFullYear(),

  monthlyIncome: [],
  budgetCategories: [],
  expenses: [],
  assets: [],
  bankAccounts: [],
  settings: null,

  historicalData: null,

  dashboardData: null,

  isLoading: false,
  isUpdating: false,
  error: null,

  // Set current month/year
  setCurrentMonth: (month: number, year: number) => {
    set({ currentMonth: month, currentYear: year });
    get().loadData();
  },

  // Load all data for current month/year
  loadData: async () => {
    try {
      set({ isLoading: true, error: null });

      const { currentMonth, currentYear } = get();

      // Load all data via API routes
      const response = await fetch(`/api/sheets?type=all&month=${currentMonth}&year=${currentYear}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const { data } = await response.json();

      set({
        monthlyIncome: data.income || [],
        budgetCategories: data.budget || [],
        expenses: data.expenses || [],
        assets: data.assets || [],
        bankAccounts: data.accounts || [],
        settings: data.settings || null,
        isLoading: false
      });

      // Refresh dashboard after loading data
      get().refreshDashboard();

    } catch (error) {
      console.error('Error loading data:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load data',
        isLoading: false
      });
    }
  },

  // Load historical data for analytics
  loadHistoricalData: async () => {
    try {
      console.log('Loading historical data for analytics...');
      
      const response = await fetch('/api/sheets?type=historical');
      
      if (!response.ok) {
        throw new Error('Failed to fetch historical data');
      }

      const { data } = await response.json();
      
      set({
        historicalData: data.historicalData,
        // Also update current data if provided
        monthlyIncome: data.currentIncome || get().monthlyIncome,
        budgetCategories: data.currentBudget || get().budgetCategories,
        expenses: data.currentExpenses || get().expenses,
        assets: data.assets || get().assets,
        bankAccounts: data.accounts || get().bankAccounts,
      });

    } catch (error) {
      console.error('Error loading historical data:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load historical data'
      });
    }
  },

  // Refresh dashboard calculations
  refreshDashboard: async () => {
    try {
      const {
        currentMonth,
        currentYear,
        monthlyIncome,
        budgetCategories,
        expenses,
        assets,
        bankAccounts
      } = get();

      // Calculate monthly report
      const totalIncome = monthlyIncome.reduce((sum, income) => sum + income.amount, 0);
      const totalSavings = budgetCategories
        .filter(cat => cat.type === 'savings')
        .reduce((sum, cat) => sum + cat.allocation, 0);
      const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const remainingBudget = totalIncome - totalSpending;

      const monthlyReport: MonthlyReport = {
        month: currentMonth,
        year: currentYear,
        totalIncome,
        totalSavings,
        totalSpending,
        remainingBudget,
        categories: budgetCategories,
        accounts: bankAccounts
      };

      // Calculate expenses by category for charts
      const expensesByCategory = budgetCategories.map(category => {
        const categoryExpenses = expenses
          .filter(expense => expense.category === category.name)
          .reduce((sum, expense) => sum + expense.amount, 0);

        return {
          name: category.name,
          value: categoryExpenses,
          color: category.color,
          percentage: totalSpending > 0 ? (categoryExpenses / totalSpending) * 100 : 0
        };
      }).filter(item => item.value > 0);

      // Calculate monthly trend (last 12 months)
      const monthlyTrend = [];
      for (let i = 11; i >= 0; i--) {
        const month = currentMonth - i;
        const year = month <= 0 ? currentYear - 1 : currentYear;
        const adjustedMonth = month <= 0 ? month + 12 : month;

        // You'd load historical data here - for now using mock data
        monthlyTrend.push({
          month: `${adjustedMonth}/${year}`,
          amount: Math.random() * 5000000, // Mock data
          budget: Math.random() * 6000000   // Mock data
        });
      }

      // Calculate assets summary
      const totalAssetValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
      const liquidAssets = assets
        .filter(asset => asset.type === 'liquid')
        .reduce((sum, asset) => sum + asset.currentValue, 0);
      const nonLiquidAssets = assets
        .filter(asset => asset.type === 'non-liquid')
        .reduce((sum, asset) => sum + asset.currentValue, 0);

      const totalCost = assets.reduce((sum, asset) => sum + (asset.shares || 1) * asset.price, 0);
      const profit = totalAssetValue - totalCost;
      const profitPercentage = totalCost > 0 ? (profit / totalCost) * 100 : 0;

      const assetsSummary = {
        totalValue: totalAssetValue,
        liquid: liquidAssets,
        nonLiquid: nonLiquidAssets,
        profit,
        profitPercentage
      };

      const dashboardData: DashboardData = {
        monthlyReport,
        expensesByCategory,
        monthlyTrend,
        assetsSummary
      };

      set({ dashboardData });

    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      set({ error: 'Failed to refresh dashboard' });
    }
  },

  // Add new income
  addIncome: async (income: Omit<MonthlyIncome, 'id'>) => {
    try {
      set({ isUpdating: true });

      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'income', data: income }),
      });

      if (!response.ok) {
        throw new Error('Failed to add income');
      }

      // Refresh data
      await get().loadData();

    } catch (error) {
      console.error('Error adding income:', error);
      set({ error: 'Failed to add income' });
    } finally {
      set({ isUpdating: false });
    }
  },

  // Update income
  updateIncome: async (income: MonthlyIncome) => {
    try {
      set({ isUpdating: true });

      // Update local state immediately for better UX
      const { monthlyIncome } = get();
      const updatedIncome = monthlyIncome.map(item =>
        item.id === income.id ? income : item
      );
      set({ monthlyIncome: updatedIncome });

      // TODO: Implement update in Google Sheets

    } catch (error) {
      console.error('Error updating income:', error);
      set({ error: 'Failed to update income' });
    } finally {
      set({ isUpdating: false });
    }
  },

  // Update budget category
  updateBudgetCategory: async (category: BudgetCategory) => {
    try {
      set({ isUpdating: true });

      const response = await fetch('/api/sheets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'budget', data: category }),
      });

      if (!response.ok) {
        throw new Error('Failed to update budget category');
      }

      // Update local state
      const { budgetCategories } = get();
      const updatedCategories = budgetCategories.map(cat =>
        cat.id === category.id ? category : cat
      );
      set({ budgetCategories: updatedCategories });

      // Refresh dashboard
      get().refreshDashboard();

    } catch (error) {
      console.error('Error updating budget category:', error);
      set({ error: 'Failed to update budget category' });
    } finally {
      set({ isUpdating: false });
    }
  },

  // Add new expense
  addExpense: async (expense: Omit<Expense, 'id'>) => {
    try {
      set({ isUpdating: true });

      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'expense', data: expense }),
      });

      if (!response.ok) {
        throw new Error('Failed to add expense');
      }

      // Refresh data
      await get().loadData();

    } catch (error) {
      console.error('Error adding expense:', error);
      set({ error: 'Failed to add expense' });
    } finally {
      set({ isUpdating: false });
    }
  },

  // Update expense
  updateExpense: async (expense: Expense) => {
    try {
      set({ isUpdating: true });

      // Update local state immediately
      const { expenses } = get();
      const updatedExpenses = expenses.map(item =>
        item.id === expense.id ? expense : item
      );
      set({ expenses: updatedExpenses });

      // TODO: Implement update in Google Sheets

    } catch (error) {
      console.error('Error updating expense:', error);
      set({ error: 'Failed to update expense' });
    } finally {
      set({ isUpdating: false });
    }
  },

  // Delete expense
  deleteExpense: async (id: string) => {
    try {
      set({ isUpdating: true });

      // Remove from local state immediately
      const { expenses } = get();
      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      set({ expenses: updatedExpenses });

      // TODO: Implement delete in Google Sheets

    } catch (error) {
      console.error('Error deleting expense:', error);
      set({ error: 'Failed to delete expense' });
    } finally {
      set({ isUpdating: false });
    }
  },

  // Update asset
  updateAsset: async (asset: Asset) => {
    try {
      set({ isUpdating: true });

      // Update local state
      const { assets } = get();
      const updatedAssets = assets.map(item =>
        item.id === asset.id ? asset : item
      );
      set({ assets: updatedAssets });

      const response = await fetch('/api/sheets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'assets', data: updatedAssets }),
      });

      if (!response.ok) {
        throw new Error('Failed to update asset');
      }

    } catch (error) {
      console.error('Error updating asset:', error);
      set({ error: 'Failed to update asset' });
    } finally {
      set({ isUpdating: false });
    }
  },

  // Refresh asset prices
  refreshAssetPrices: async () => {
    try {
      set({ isUpdating: true });

      const { assets } = get();

      // Get symbols for stocks/crypto
      const symbols = assets
        .filter(asset => asset.symbol && (asset.category === 'stocks' || asset.category === 'crypto'))
        .map(asset => asset.symbol!);

      if (symbols.length > 0) {
        // TODO: Implement real price fetching
        // const prices = await getStockPrices(symbols);

        // Update asset prices
        const updatedAssets = assets.map(asset => {
          if (asset.symbol && symbols.includes(asset.symbol)) {
            // Mock price update
            const newPrice = asset.price * (0.95 + Math.random() * 0.1); // ±5% change
            return {
              ...asset,
              price: newPrice,
              currentValue: (asset.shares || 1) * newPrice,
              lastUpdated: new Date().toISOString()
            };
          }
          return asset;
        });

        set({ assets: updatedAssets });

        const response = await fetch('/api/sheets', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'assets', data: updatedAssets }),
        });

        if (!response.ok) {
          throw new Error('Failed to update asset prices');
        }
      }

    } catch (error) {
      console.error('Error refreshing asset prices:', error);
      set({ error: 'Failed to refresh asset prices' });
    } finally {
      set({ isUpdating: false });
    }
  },

  // Update account
  updateAccount: async (account: BankAccount) => {
    try {
      set({ isUpdating: true });

      // Update local state
      const { bankAccounts } = get();
      const updatedAccounts = bankAccounts.map(acc =>
        acc.id === account.id ? account : acc
      );
      set({ bankAccounts: updatedAccounts });

      // TODO: Implement update in Google Sheets

    } catch (error) {
      console.error('Error updating account:', error);
      set({ error: 'Failed to update account' });
    } finally {
      set({ isUpdating: false });
    }
  },

  // Update settings
  updateSettings: async (settings: Settings) => {
    try {
      set({ isUpdating: true });

      set({ settings });

      // TODO: Implement update in Google Sheets

    } catch (error) {
      console.error('Error updating settings:', error);
      set({ error: 'Failed to update settings' });
    } finally {
      set({ isUpdating: false });
    }
  },

  // Export data functionality
  exportData: (period: 'month' | 'quarter' | 'year') => {
    const { monthlyIncome, expenses, budgetCategories, historicalData, currentMonth, currentYear } = get();
    
    // Prepare data based on period
    let dataToExport: any = {};
    
    if (period === 'month') {
      dataToExport = {
        period: `${currentMonth}/${currentYear}`,
        income: monthlyIncome,
        expenses: expenses,
        budget: budgetCategories,
        exportDate: new Date().toISOString()
      };
    } else {
      // Use historical data for quarter/year periods
      dataToExport = {
        period: period === 'quarter' ? 'Last 3 Months' : 'Last 12 Months',
        historicalData: historicalData,
        currentData: {
          income: monthlyIncome,
          expenses: expenses,
          budget: budgetCategories
        },
        exportDate: new Date().toISOString()
      };
    }

    // Convert to JSON and download
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-data-${period}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}));
import { google } from 'googleapis';
import {
  MonthlyIncome,
  BudgetCategory,
  Expense,
  Asset,
  BankAccount,
  Settings,
  SpreadsheetConfig
} from '@/types';

export class GoogleSheetsService {
  private sheets: any;
  private config: SpreadsheetConfig;
  private isConfigured: boolean = false;

  constructor(config: SpreadsheetConfig) {
    this.config = config;

    // Initialize Google Sheets API
    try {
      // Configure authentication - validate required credentials
      const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
      const projectId = process.env.GOOGLE_PROJECT_ID

      if (!privateKey || !clientEmail || !projectId) {
        console.warn('Google Sheets API credentials not configured. Using mock data.');
        this.isConfigured = false;
        return;
      }

      if (!this.config.spreadsheetId || this.config.spreadsheetId === '1234567890abcdef1234567890abcdef12345678') {
        console.warn('Google Sheets spreadsheet ID not configured. Using mock data.');
        this.isConfigured = false;
        return;
      }

      const auth = new google.auth.GoogleAuth({
        credentials: {
          type: 'service_account',
          private_key: privateKey,
          client_email: clientEmail,
          project_id: projectId,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      this.isConfigured = true;
      console.log('Google Sheets API initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Sheets API:', error);
      this.isConfigured = false;
    }
  }

  // Get data from specific range
  async getRange(range: string): Promise<any[][]> {
    if (!this.isConfigured) {
      // Return empty data when not configured
      return [];
    }

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.spreadsheetId,
        range: range,
      });

      return response.data.values || [];
    } catch (error) {
      console.error('Error fetching range:', range, error);
      // Return empty data on error instead of throwing
      return [];
    }
  }

  // Update data in specific range
  async updateRange(range: string, values: any[][]): Promise<void> {
    if (!this.isConfigured) {
      console.warn('Google Sheets not configured. Update operation skipped.');
      return;
    }

    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.config.spreadsheetId,
        range: range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: values,
        },
      });
    } catch (error) {
      console.error('Error updating range:', error);
      // Don't throw error, just log it
    }
  }

  // Append data to sheet
  async appendData(range: string, values: any[][]): Promise<void> {
    if (!this.isConfigured) {
      console.warn('Google Sheets not configured. Append operation skipped.');
      return;
    }

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.config.spreadsheetId,
        range: range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: values,
        },
      });
    } catch (error) {
      console.error('Error appending data:', error);
      // Don't throw error, just log it
    }
  }

  // Get monthly income data
  async getMonthlyIncome(month: number, year: number): Promise<MonthlyIncome[]> {
    const range = this.config.ranges.income;
    const data = await this.getRange(range);

    if (!data || data.length === 0) {
      // Return realistic demo income data
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      // Only show demo data for current month/year
      if (month !== currentMonth || year !== currentYear) {
        return [];
      }

      return [
        { id: 'income-1', source: 'Salary', amount: 25000000, month, year, account: 'BCA Checking' },
        { id: 'income-2', source: 'Freelance Work', amount: 5000000, month, year, account: 'BCA Checking' },
        { id: 'income-3', source: 'Investment Returns', amount: 2500000, month, year, account: 'Investasi Saham' },
      ];
    }

    return data.slice(1).map((row, index) => ({
      id: `income-${index}`,
      source: row[0] || '',
      amount: parseFloat(row[1]) || 0,
      month: parseInt(row[2]) || month,
      year: parseInt(row[3]) || year,
      account: row[4] || '',
    })).filter(item => item.month === month && item.year === year);
  }

  // Get budget categories
  async getBudgetCategories(month: number, year: number): Promise<BudgetCategory[]> {
    const range = this.config.ranges.budget;
    const data = await this.getRange(range);

    if (!data || data.length === 0) {
      // Return realistic demo budget data
      return [
        { id: 'budget-1', name: 'Food & Groceries', type: 'needs', color: '#10B981', allocation: 4000000, spent: 3200000, month, year, account: 'BCA Checking' },
        { id: 'budget-2', name: 'Transportation', type: 'needs', color: '#3B82F6', allocation: 2000000, spent: 1800000, month, year, account: 'BCA Checking' },
        { id: 'budget-3', name: 'Utilities', type: 'needs', color: '#F59E0B', allocation: 1500000, spent: 1200000, month, year, account: 'BCA Checking' },
        { id: 'budget-4', name: 'Entertainment', type: 'wants', color: '#EF4444', allocation: 2500000, spent: 3100000, month, year, account: 'BCA Checking' },
        { id: 'budget-5', name: 'Shopping', type: 'wants', color: '#8B5CF6', allocation: 2000000, spent: 1500000, month, year, account: 'BCA Checking' },
        { id: 'budget-6', name: 'Emergency Fund', type: 'savings', color: '#059669', allocation: 5000000, spent: 5000000, month, year, account: 'Mandiri Savings' },
        { id: 'budget-7', name: 'Investments', type: 'savings', color: '#7C3AED', allocation: 3000000, spent: 3000000, month, year, account: 'Investasi Saham' },
      ];
    }

    return data.slice(1).map((row, index) => {
      // Map sheet values to our interface
      let type: 'needs' | 'wants' | 'savings' = 'needs';
      const sheetType = (row[1] || '').toLowerCase();

      if (sheetType.includes('variable') || sheetType.includes('entertainment') || sheetType.includes('travel')) {
        type = 'wants';
      } else if (sheetType.includes('savings') || sheetType.includes('investment')) {
        type = 'savings';
      } else {
        type = 'needs'; // Fixed expenses, utilities, etc.
      }

      return {
        id: `budget-${index}`,
        name: row[0] || '',
        type,
        color: row[2] || '#3B82F6',
        allocation: parseFloat(row[3]) || 0,
        spent: parseFloat(row[4]) || 0,
        month: parseInt(row[5]) || month,
        year: parseInt(row[6]) || year,
        account: row[7] || '',
      };
    }).filter(item => item.month === month && item.year === year);
  }

  // Get expenses
  async getExpenses(month: number, year: number): Promise<Expense[]> {
    const range = this.config.ranges.expenses;
    const data = await this.getRange(range);

    if (!data || data.length === 0) {
      // Return realistic demo expense data
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      // Only show demo data for current month/year
      if (month !== currentMonth || year !== currentYear) {
        return [];
      }

      return [
        { id: 'expense-1', date: `${year}-${month.toString().padStart(2, '0')}-05`, description: 'Supermarket Shopping', amount: 750000, category: 'Food & Groceries', account: 'BCA Checking', month, year },
        { id: 'expense-2', date: `${year}-${month.toString().padStart(2, '0')}-08`, description: 'Grab Transport', amount: 85000, category: 'Transportation', account: 'BCA Checking', month, year },
        { id: 'expense-3', date: `${year}-${month.toString().padStart(2, '0')}-10`, description: 'Electricity Bill', amount: 450000, category: 'Utilities', account: 'BCA Checking', month, year },
        { id: 'expense-4', date: `${year}-${month.toString().padStart(2, '0')}-12`, description: 'Netflix Subscription', amount: 186000, category: 'Entertainment', account: 'BCA Checking', month, year },
        { id: 'expense-5', date: `${year}-${month.toString().padStart(2, '0')}-15`, description: 'Restaurant Dinner', amount: 420000, category: 'Entertainment', account: 'BCA Checking', month, year },
        { id: 'expense-6', date: `${year}-${month.toString().padStart(2, '0')}-18`, description: 'Clothing Shopping', amount: 650000, category: 'Shopping', account: 'BCA Checking', month, year },
        { id: 'expense-7', date: `${year}-${month.toString().padStart(2, '0')}-20`, description: 'Grocery Store', amount: 320000, category: 'Food & Groceries', account: 'BCA Checking', month, year },
        { id: 'expense-8', date: `${year}-${month.toString().padStart(2, '0')}-22`, description: 'Gas Station', amount: 200000, category: 'Transportation', account: 'BCA Checking', month, year },
        { id: 'expense-9', date: `${year}-${month.toString().padStart(2, '0')}-25`, description: 'Coffee Shop', amount: 85000, category: 'Entertainment', account: 'BCA Checking', month, year },
        { id: 'expense-10', date: `${year}-${month.toString().padStart(2, '0')}-28`, description: 'Internet Bill', amount: 350000, category: 'Utilities', account: 'BCA Checking', month, year },
      ];
    }

    return data.slice(1).map((row, index) => ({
      id: `expense-${index}`,
      date: row[0] || '',
      description: row[1] || '',
      amount: parseFloat(row[2]) || 0,
      category: row[3] || '',
      account: row[4] || '',
      month: parseInt(row[5]) || month,
      year: parseInt(row[6]) || year,
    })).filter(item => item.month === month && item.year === year);
  }

  // Get assets
  async getAssets(): Promise<Asset[]> {
    const range = this.config.ranges.assets;
    const data = await this.getRange(range);

    if (!data || data.length === 0) {
      // Return realistic demo asset data
      return [
        { id: 'asset-1', name: 'Bank BCA Saham', type: 'liquid', category: 'stocks', symbol: 'BBCA.JK', shares: 100, price: 9750, currentValue: 97500000, targetValue: 120000000, lastUpdated: new Date().toISOString() },
        { id: 'asset-2', name: 'Bitcoin', type: 'liquid', category: 'crypto', symbol: 'BTC', shares: 0.5, price: 1500000000, currentValue: 75000000, targetValue: 100000000, lastUpdated: new Date().toISOString() },
        { id: 'asset-3', name: 'Deposito BCA', type: 'liquid', category: 'deposit', symbol: 'DEP', shares: 1, price: 50000000, currentValue: 50000000, targetValue: 60000000, lastUpdated: new Date().toISOString() },
        { id: 'asset-4', name: 'Ethereum', type: 'liquid', category: 'crypto', symbol: 'ETH', shares: 2, price: 65000000, currentValue: 130000000, targetValue: 150000000, lastUpdated: new Date().toISOString() },
        { id: 'asset-5', name: 'Gold Investment', type: 'liquid', category: 'gold', symbol: 'GOLD', shares: 10, price: 1200000, currentValue: 12000000, targetValue: 15000000, lastUpdated: new Date().toISOString() },
      ];
    }

    return data.slice(1).map((row, index) => {
      // Map sheet values to our interface
      let type: 'liquid' | 'non-liquid' = 'liquid';
      const sheetType = (row[1] || '').toLowerCase();

      if (sheetType.includes('property') || sheetType.includes('real estate') || sheetType.includes('land')) {
        type = 'non-liquid';
      }

      let category: 'cash' | 'stocks' | 'crypto' | 'gold' | 'property' | 'deposit' = 'cash';
      const sheetCategory = (row[2] || '').toLowerCase();

      if (sheetCategory.includes('digital') || sheetCategory.includes('crypto')) {
        category = 'crypto';
      } else if (sheetCategory.includes('property') || sheetCategory.includes('real estate')) {
        category = 'property';
      } else if (sheetCategory.includes('investment') || sheetCategory.includes('stock') || sheetCategory.includes('fund')) {
        category = 'stocks';
      } else if (sheetCategory.includes('precious') || sheetCategory.includes('gold') || sheetCategory.includes('metal')) {
        category = 'gold';
      } else if (sheetCategory.includes('deposit') || sheetCategory.includes('savings')) {
        category = 'deposit';
      }

      return {
        id: `asset-${index}`,
        name: row[0] || '',
        type,
        category,
        symbol: row[3] || '',
        shares: parseFloat(row[4]) || 0,
        price: parseFloat(row[5]) || 0,
        currentValue: parseFloat(row[6]) || 0,
        targetValue: parseFloat(row[7]) || 0,
        lastUpdated: row[8] || new Date().toISOString(),
      };
    });
  }

  // Get bank accounts
  async getBankAccounts(): Promise<BankAccount[]> {
    try {
      const range = this.config.ranges.accounts;
      const data = await this.getRange(range);

      if (!data || data.length === 0) {
        // Return enhanced demo accounts with realistic data
        return [
          { id: 'account-1', name: 'BCA Checking', type: 'checking', balance: 15750000, color: '#3B82F6' },
          { id: 'account-2', name: 'Mandiri Savings', type: 'savings', balance: 87500000, color: '#10B981' },
          { id: 'account-3', name: 'Investasi Saham', type: 'investment', balance: 125000000, color: '#8B5CF6' },
        ];
      }

      return data.slice(1).map((row, index) => ({
        id: `account-${index}`,
        name: row[0] || '',
        type: (row[1] as 'checking' | 'savings' | 'investment') || 'checking',
        balance: parseFloat(row[2]) || 0,
        color: row[3] || '#3B82F6',
      }));
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      // Return enhanced demo accounts on error
      return [
        { id: 'account-1', name: 'BCA Checking', type: 'checking', balance: 15750000, color: '#3B82F6' },
        { id: 'account-2', name: 'Mandiri Savings', type: 'savings', balance: 87500000, color: '#10B981' },
        { id: 'account-3', name: 'Investasi Saham', type: 'investment', balance: 125000000, color: '#8B5CF6' },
      ];
    }
  }

  // Add new expense
  async addExpense(expense: Omit<Expense, 'id'>): Promise<void> {
    const values = [[
      expense.date,
      expense.description,
      expense.amount,
      expense.category,
      expense.account,
      expense.month,
      expense.year,
    ]];

    await this.appendData(this.config.ranges.expenses, values);
  }

  // Add new income
  async addIncome(income: Omit<MonthlyIncome, 'id'>): Promise<void> {
    const values = [[
      income.source,
      income.amount,
      income.month,
      income.year,
      income.account,
    ]];

    await this.appendData(this.config.ranges.income, values);
  }

  // Update budget category
  async updateBudgetCategory(category: BudgetCategory): Promise<void> {
    // This would require finding the specific row and updating it
    // For simplicity, we'll implement a basic version
    const range = this.config.ranges.budget;
    const data = await this.getRange(range);

    // Find the row with matching category
    const rowIndex = data.findIndex((row, index) =>
      index > 0 && row[0] === category.name &&
      parseInt(row[5]) === category.month &&
      parseInt(row[6]) === category.year
    );

    if (rowIndex > 0) {
      const updateRange = `${range.split('!')[0]}!A${rowIndex + 1}:H${rowIndex + 1}`;
      const values = [[
        category.name,
        category.type,
        category.color,
        category.allocation,
        category.spent,
        category.month,
        category.year,
        category.account,
      ]];

      await this.updateRange(updateRange, values);
    }
  }

  // Update asset prices (for stocks/crypto)
  async updateAssetPrices(assets: Asset[]): Promise<void> {
    const range = this.config.ranges.assets;

    const updates = assets.map((asset) => [
      asset.name,
      asset.type,
      asset.category,
      asset.symbol,
      asset.shares,
      asset.price,
      asset.currentValue,
      asset.targetValue,
      asset.lastUpdated,
    ]);

    // Update all asset data
    await this.updateRange(`${range.split('!')[0]}!A2:I${updates.length + 1}`, updates);
  }

  // Get settings
  async getSettings(): Promise<Settings> {
    const range = this.config.ranges.settings;
    const data = await this.getRange(range);

    // Parse settings from the sheet
    // This is a simplified version - you'd want more robust parsing
    return {
      currency: data[0]?.[1] || 'Rp',
      categories: [],
      accounts: [],
      months: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
               'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
      defaultAccount: data[1]?.[1] || 'Bank 1',
      stockApiKey: data[2]?.[1] || '',
      dateFormat: 'DD/MM/YYYY',
      budgetTarget: 80,
      savingsGoal: 20,
      notificationPreferences: {
        budgetAlerts: true,
        monthlyReports: true,
        goalAchievements: true,
      },
    };
  }

  // Generate historical demo data for analytics
  generateHistoricalData(months: number = 6): {
    income: MonthlyIncome[],
    expenses: Expense[],
    budget: BudgetCategory[]
  } {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()
    
    const income: MonthlyIncome[] = []
    const expenses: Expense[] = []
    const budget: BudgetCategory[] = []
    
    // Generate data for the past N months
    for (let i = 0; i < months; i++) {
      const targetDate = new Date(currentYear, currentMonth - 1 - i, 1)
      const month = targetDate.getMonth() + 1
      const year = targetDate.getFullYear()
      
      // Monthly income with slight variations
      const baseIncome = 25000000
      const variation = (Math.random() - 0.5) * 0.2 // ±10% variation
      const monthlyIncome = Math.round(baseIncome * (1 + variation))
      
      income.push(
        { id: `income-${year}-${month}-1`, source: 'Salary', amount: monthlyIncome, month, year, account: 'BCA Checking' },
        { id: `income-${year}-${month}-2`, source: 'Freelance Work', amount: Math.round(5000000 * (1 + variation * 0.5)), month, year, account: 'BCA Checking' },
        { id: `income-${year}-${month}-3`, source: 'Investment Returns', amount: Math.round(2500000 * (1 + variation * 0.3)), month, year, account: 'Investasi Saham' }
      )
      
      // Budget categories with seasonal variations
      const seasonalMultiplier = month === 12 ? 1.3 : (month === 6 || month === 7 ? 1.1 : 1) // Higher spending in December and vacation months
      
      const budgetCategories = [
        { name: 'Food & Groceries', type: 'needs' as const, allocation: 4000000, baseSpent: 3200000 },
        { name: 'Transportation', type: 'needs' as const, allocation: 2000000, baseSpent: 1800000 },
        { name: 'Utilities', type: 'needs' as const, allocation: 1500000, baseSpent: 1200000 },
        { name: 'Entertainment', type: 'wants' as const, allocation: 2500000, baseSpent: 2100000 },
        { name: 'Shopping', type: 'wants' as const, allocation: 2000000, baseSpent: 1500000 },
        { name: 'Emergency Fund', type: 'savings' as const, allocation: 5000000, baseSpent: 5000000 },
        { name: 'Investments', type: 'savings' as const, allocation: 3000000, baseSpent: 3000000 }
      ]
      
      budgetCategories.forEach((cat, index) => {
        const spentVariation = (Math.random() - 0.5) * 0.3 // ±15% variation
        const spent = Math.round(cat.baseSpent * seasonalMultiplier * (1 + spentVariation))
        const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#059669', '#7C3AED']
        
        budget.push({
          id: `budget-${year}-${month}-${index}`,
          name: cat.name,
          type: cat.type,
          color: colors[index] || '#3B82F6',
          allocation: cat.allocation,
          spent: Math.min(spent, cat.allocation * 1.2), // Cap overspending at 120%
          month,
          year,
          account: cat.type === 'savings' ? (cat.name.includes('Emergency') ? 'Mandiri Savings' : 'Investasi Saham') : 'BCA Checking'
        })
      })
      
      // Generate detailed expenses for current month only
      if (i === 0) {
        const expenseTemplates = [
          { description: 'Supermarket Shopping', category: 'Food & Groceries', baseAmount: 750000 },
          { description: 'Grab Transport', category: 'Transportation', baseAmount: 85000 },
          { description: 'Electricity Bill', category: 'Utilities', baseAmount: 450000 },
          { description: 'Netflix Subscription', category: 'Entertainment', baseAmount: 186000 },
          { description: 'Restaurant Dinner', category: 'Entertainment', baseAmount: 420000 },
          { description: 'Clothing Shopping', category: 'Shopping', baseAmount: 650000 },
          { description: 'Grocery Store', category: 'Food & Groceries', baseAmount: 320000 },
          { description: 'Gas Station', category: 'Transportation', baseAmount: 200000 },
          { description: 'Coffee Shop', category: 'Entertainment', baseAmount: 85000 },
          { description: 'Internet Bill', category: 'Utilities', baseAmount: 350000 }
        ]
        
        expenseTemplates.forEach((template, index) => {
          const day = 5 + (index * 2.5)
          const amount = Math.round(template.baseAmount * (0.8 + Math.random() * 0.4)) // ±20% variation
          
          expenses.push({
            id: `expense-${year}-${month}-${index}`,
            date: `${year}-${month.toString().padStart(2, '0')}-${Math.floor(day).toString().padStart(2, '0')}`,
            description: template.description,
            amount,
            category: template.category,
            account: 'BCA Checking',
            month,
            year
          })
        })
      }
    }
    
    return { income, expenses, budget }
  }

  // Get all financial data with historical context
  async getAllData(): Promise<{
    accounts: BankAccount[],
    assets: Asset[],
    currentIncome: MonthlyIncome[],
    currentExpenses: Expense[],
    currentBudget: BudgetCategory[],
    historicalData: any
  }> {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()
    
    // Get current data
    const [accounts, assets, currentIncome, currentExpenses, currentBudget] = await Promise.all([
      this.getBankAccounts(),
      this.getAssets(),
      this.getMonthlyIncome(currentMonth, currentYear),
      this.getExpenses(currentMonth, currentYear),
      this.getBudgetCategories(currentMonth, currentYear)
    ])
    
    // Generate historical data for analytics
    const historicalData = this.generateHistoricalData(6)
    
    return {
      accounts,
      assets,
      currentIncome,
      currentExpenses,
      currentBudget,
      historicalData
    }
  }
}

// Create a singleton instance
let sheetsService: GoogleSheetsService | null = null;

export function getSheetsService(): GoogleSheetsService {
  if (!sheetsService) {
    const config: SpreadsheetConfig = {
      spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEET_ID || '',
      apiKey: process.env.GOOGLE_API_KEY || '',
      ranges: {
        income: 'Income!A1:E1000',
        budget: 'Budgeting!A1:H1000',
        expenses: 'Spending!A1:G1000',
        assets: 'Assets!A1:I1000',
        accounts: 'Accounts!A1:E1000',
        settings: 'Settings!A1:B10',
      },
    };

    sheetsService = new GoogleSheetsService(config);
  }

  return sheetsService;
}

// Stock price API integration
export async function getStockPrices(symbols: string[]): Promise<Record<string, number>> {
  try {
    // For Indonesian stocks, you can use Yahoo Finance API or other free APIs
    // This is a placeholder implementation
    const prices: Record<string, number> = {};

    for (const symbol of symbols) {
      // Mock implementation - replace with real API
      if (symbol.includes('.JK')) {
        // Indonesian stocks
        prices[symbol] = Math.random() * 10000; // Mock price
      } else {
        // US stocks or crypto
        prices[symbol] = Math.random() * 1000; // Mock price
      }
    }

    return prices;
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    return {};
  }
}
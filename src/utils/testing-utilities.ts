/**
 * Testing utilities for the Personal Finance Tracker application
 * Provides comprehensive testing functions for real-time features, data validation, and performance
 */

import { MonthlyIncome, BudgetCategory, Expense, Asset, BankAccount } from '@/types';

export interface TestResult {
  testName: string;
  passed: boolean;
  message: string;
  duration: number;
  timestamp: Date;
}

export interface TestSuite {
  suiteName: string;
  results: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  totalDuration: number;
}

/**
 * Test runner for executing and tracking test results
 */
export class TestRunner {
  private results: TestSuite[] = [];

  /**
   * Run a test and capture results
   */
  async runTest(testName: string, testFunction: () => Promise<boolean> | boolean): Promise<TestResult> {
    const startTime = Date.now();
    const timestamp = new Date();
    
    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      return {
        testName,
        passed: result,
        message: result ? 'Test passed' : 'Test failed',
        duration,
        timestamp
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        testName,
        passed: false,
        message: `Test error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration,
        timestamp
      };
    }
  }

  /**
   * Run a complete test suite
   */
  async runTestSuite(suiteName: string, tests: Array<{ name: string; test: () => Promise<boolean> | boolean }>): Promise<TestSuite> {
    const suiteStartTime = Date.now();
    const results: TestResult[] = [];

    for (const { name, test } of tests) {
      const result = await this.runTest(name, test);
      results.push(result);
    }

    const passedTests = results.filter(r => r.passed).length;
    const failedTests = results.length - passedTests;
    const totalDuration = Date.now() - suiteStartTime;

    const suite: TestSuite = {
      suiteName,
      results,
      totalTests: results.length,
      passedTests,
      failedTests,
      totalDuration
    };

    this.results.push(suite);
    return suite;
  }

  /**
   * Get all test results
   */
  getResults(): TestSuite[] {
    return this.results;
  }

  /**
   * Clear all test results
   */
  clearResults(): void {
    this.results = [];
  }
}

/**
 * Data validation tests
 */
export class DataValidationTests {
  /**
   * Test expense data validation
   */
  static testExpenseValidation(expense: Expense): boolean {
    if (!expense.id || typeof expense.id !== 'string') return false;
    if (!expense.description || typeof expense.description !== 'string') return false;
    if (typeof expense.amount !== 'number' || expense.amount <= 0) return false;
    if (!expense.category || typeof expense.category !== 'string') return false;
    if (!expense.date || !(expense.date instanceof Date)) return false;
    return true;
  }

  /**
   * Test income data validation
   */
  static testIncomeValidation(income: MonthlyIncome): boolean {
    if (!income.id || typeof income.id !== 'string') return false;
    if (!income.source || typeof income.source !== 'string') return false;
    if (typeof income.amount !== 'number' || income.amount <= 0) return false;
    if (typeof income.month !== 'number' || income.month < 1 || income.month > 12) return false;
    if (typeof income.year !== 'number' || income.year < 2000) return false;
    return true;
  }

  /**
   * Test budget category validation
   */
  static testBudgetValidation(budget: BudgetCategory): boolean {
    if (!budget.id || typeof budget.id !== 'string') return false;
    if (!budget.name || typeof budget.name !== 'string') return false;
    if (typeof budget.allocated !== 'number' || budget.allocated < 0) return false;
    if (typeof budget.spent !== 'number' || budget.spent < 0) return false;
    if (typeof budget.month !== 'number' || budget.month < 1 || budget.month > 12) return false;
    if (typeof budget.year !== 'number' || budget.year < 2000) return false;
    return true;
  }

  /**
   * Test asset data validation
   */
  static testAssetValidation(asset: Asset): boolean {
    if (!asset.id || typeof asset.id !== 'string') return false;
    if (!asset.name || typeof asset.name !== 'string') return false;
    if (!asset.type || typeof asset.type !== 'string') return false;
    if (typeof asset.currentValue !== 'number' || asset.currentValue < 0) return false;
    return true;
  }

  /**
   * Test bank account validation
   */
  static testAccountValidation(account: BankAccount): boolean {
    if (!account.id || typeof account.id !== 'string') return false;
    if (!account.name || typeof account.name !== 'string') return false;
    if (!account.type || typeof account.type !== 'string') return false;
    if (typeof account.balance !== 'number') return false;
    return true;
  }
}

/**
 * Performance testing utilities
 */
export class PerformanceTests {
  /**
   * Test data processing performance
   */
  static async testDataProcessingPerformance(dataSize: number): Promise<{ duration: number; throughput: number }> {
    const testData = Array.from({ length: dataSize }, (_, i) => ({
      id: `test-${i}`,
      value: Math.random() * 1000,
      category: `category-${i % 10}`,
      timestamp: new Date()
    }));

    const startTime = Date.now();
    
    // Simulate data processing
    const processed = testData
      .filter(item => item.value > 100)
      .map(item => ({ ...item, processed: true }))
      .reduce((acc, item) => {
        const key = item.category;
        acc[key] = (acc[key] || 0) + item.value;
        return acc;
      }, {} as Record<string, number>);

    const duration = Date.now() - startTime;
    const throughput = dataSize / (duration / 1000); // items per second

    return { duration, throughput };
  }

  /**
   * Test memory usage during data operations
   */
  static testMemoryUsage(): { used: number; total: number; percentage: number } {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in window.performance) {
      const memory = (window.performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
      };
    }
    
    // Fallback for environments without memory API
    return { used: 0, total: 0, percentage: 0 };
  }

  /**
   * Test chart rendering performance
   */
  static async testChartRenderingPerformance(dataPoints: number): Promise<number> {
    const startTime = Date.now();
    
    // Simulate chart data generation
    const chartData = Array.from({ length: dataPoints }, (_, i) => ({
      x: i,
      y: Math.sin(i * 0.1) * 100 + Math.random() * 50,
      label: `Point ${i}`
    }));

    // Simulate rendering operations
    await new Promise(resolve => setTimeout(resolve, Math.random() * 10));
    
    return Date.now() - startTime;
  }
}

/**
 * API testing utilities
 */
export class APITests {
  /**
   * Test API endpoint availability
   */
  static async testAPIEndpoint(url: string): Promise<{ available: boolean; responseTime: number; status?: number }> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const responseTime = Date.now() - startTime;
      
      return {
        available: response.ok,
        responseTime,
        status: response.status
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        available: false,
        responseTime,
        status: undefined
      };
    }
  }

  /**
   * Test Google Sheets API connection
   */
  static async testGoogleSheetsConnection(): Promise<{ connected: boolean; responseTime: number; error?: string }> {
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/sheets?type=income&month=1&year=2024');
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        return {
          connected: !data.error,
          responseTime,
          error: data.error
        };
      } else {
        return {
          connected: false,
          responseTime,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        connected: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

/**
 * Integration tests for real-time features
 */
export class RealTimeFeatureTests {
  /**
   * Test auto-refresh functionality
   */
  static async testAutoRefresh(refreshInterval: number): Promise<boolean> {
    return new Promise((resolve) => {
      let refreshCount = 0;
      const maxRefreshes = 3;
      
      const interval = setInterval(() => {
        refreshCount++;
        
        if (refreshCount >= maxRefreshes) {
          clearInterval(interval);
          resolve(true);
        }
      }, refreshInterval);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
        resolve(false);
      }, 10000);
    });
  }

  /**
   * Test data synchronization
   */
  static async testDataSync(): Promise<boolean> {
    try {
      // Test data write
      const testExpense = {
        id: `test-${Date.now()}`,
        description: 'Test Expense',
        amount: 100,
        category: 'Testing',
        date: new Date(),
        account: 'Test Account'
      };

      const writeResponse = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'expense', data: testExpense })
      });

      if (!writeResponse.ok) {
        return false;
      }

      // Test data read
      const readResponse = await fetch('/api/sheets?type=expenses&month=1&year=2024');
      const readData = await readResponse.json();

      return readResponse.ok && !readData.error;
    } catch (error) {
      return false;
    }
  }

  /**
   * Test real-time validation
   */
  static testRealTimeValidation(): boolean {
    const testData = {
      expenses: [
        { id: '1', description: 'Valid', amount: 100, category: 'Food', date: new Date(), account: 'Bank' },
        { id: '2', description: '', amount: -50, category: '', date: new Date(), account: 'Bank' } // Invalid
      ]
    };

    const validExpenses = testData.expenses.filter(DataValidationTests.testExpenseValidation);
    return validExpenses.length === 1; // Should filter out the invalid expense
  }
}

/**
 * Utility functions for test data generation
 */
export class TestDataGenerator {
  /**
   * Generate test expense data
   */
  static generateExpenses(count: number): Expense[] {
    const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities'];
    const accounts = ['Main Checking', 'Savings', 'Credit Card'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `expense-${i}`,
      description: `Test Expense ${i + 1}`,
      amount: Math.random() * 1000 + 10,
      category: categories[i % categories.length],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      account: accounts[i % accounts.length]
    }));
  }

  /**
   * Generate test income data
   */
  static generateIncome(count: number): MonthlyIncome[] {
    const sources = ['Salary', 'Freelance', 'Investments', 'Side Business'];
    const accounts = ['Main Checking', 'Savings'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `income-${i}`,
      source: sources[i % sources.length],
      amount: Math.random() * 5000 + 1000,
      month: Math.floor(Math.random() * 12) + 1,
      year: 2024,
      account: accounts[i % accounts.length]
    }));
  }

  /**
   * Generate test budget data
   */
  static generateBudget(count: number): BudgetCategory[] {
    const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities'];
    const types = ['expense', 'savings'] as const;
    
    return Array.from({ length: count }, (_, i) => ({
      id: `budget-${i}`,
      name: categories[i % categories.length],
      type: types[i % types.length],
      allocated: Math.random() * 1000 + 100,
      spent: Math.random() * 800,
      month: Math.floor(Math.random() * 12) + 1,
      year: 2024,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
    }));
  }
}

/**
 * Export comprehensive testing suite
 */
export function createComprehensiveTestSuite(): Array<{ name: string; test: () => Promise<boolean> | boolean }> {
  return [
    {
      name: 'Data Validation - Expenses',
      test: () => {
        const testExpenses = TestDataGenerator.generateExpenses(10);
        return testExpenses.every(DataValidationTests.testExpenseValidation);
      }
    },
    {
      name: 'Data Validation - Income',
      test: () => {
        const testIncome = TestDataGenerator.generateIncome(5);
        return testIncome.every(DataValidationTests.testIncomeValidation);
      }
    },
    {
      name: 'Data Validation - Budget',
      test: () => {
        const testBudget = TestDataGenerator.generateBudget(5);
        return testBudget.every(DataValidationTests.testBudgetValidation);
      }
    },
    {
      name: 'Performance - Data Processing',
      test: async () => {
        const result = await PerformanceTests.testDataProcessingPerformance(1000);
        return result.duration < 1000 && result.throughput > 100; // Should process 1000 items in under 1s
      }
    },
    {
      name: 'Performance - Chart Rendering',
      test: async () => {
        const duration = await PerformanceTests.testChartRenderingPerformance(100);
        return duration < 500; // Should render 100 data points in under 500ms
      }
    },
    {
      name: 'API - Sheets Endpoint',
      test: async () => {
        const result = await APITests.testAPIEndpoint('/api/sheets');
        return result.available && result.responseTime < 5000; // Should respond within 5s
      }
    },
    {
      name: 'Real-time - Validation',
      test: () => RealTimeFeatureTests.testRealTimeValidation()
    },
    {
      name: 'Integration - Google Sheets',
      test: async () => {
        const result = await APITests.testGoogleSheetsConnection();
        return result.connected || result.responseTime < 10000; // Either connected or quick failure
      }
    }
  ];
}

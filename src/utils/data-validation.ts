import { Expense, MonthlyIncome, BudgetCategory } from '@/types'

/**
 * Utility functions for validating and sanitizing financial data
 * Ensures data integrity for real-time updates and analytics
 */

export interface DataValidationResult {
  isValid: boolean
  errors: string[]
  sanitizedData?: any
}

/**
 * Validates expense data
 */
export function validateExpense(expense: Partial<Expense>): DataValidationResult {
  const errors: string[] = []

  if (!expense.id) errors.push('Expense ID is required')
  if (!expense.description || expense.description.trim().length === 0) {
    errors.push('Expense description is required')
  }
  if (!expense.amount || expense.amount <= 0) {
    errors.push('Expense amount must be greater than 0')
  }
  if (!expense.category) errors.push('Expense category is required')
  if (!expense.account) errors.push('Expense account is required')
  if (!expense.date) errors.push('Expense date is required')
  if (!expense.month || expense.month < 1 || expense.month > 12) {
    errors.push('Expense month must be between 1 and 12')
  }
  if (!expense.year || expense.year < 2000 || expense.year > 2100) {
    errors.push('Expense year must be a valid year')
  }

  // Sanitize data
  const sanitizedData = errors.length === 0 ? {
    ...expense,
    description: expense.description?.trim(),
    amount: Math.abs(expense.amount || 0),
    category: expense.category?.trim(),
    account: expense.account?.trim()
  } : undefined

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  }
}

/**
 * Validates income data
 */
export function validateIncome(income: Partial<MonthlyIncome>): DataValidationResult {
  const errors: string[] = []

  if (!income.id) errors.push('Income ID is required')
  if (!income.source || income.source.trim().length === 0) {
    errors.push('Income source is required')
  }
  if (!income.amount || income.amount <= 0) {
    errors.push('Income amount must be greater than 0')
  }
  if (!income.month || income.month < 1 || income.month > 12) {
    errors.push('Income month must be between 1 and 12')
  }
  if (!income.year || income.year < 2000 || income.year > 2100) {
    errors.push('Income year must be a valid year')
  }

  const sanitizedData = errors.length === 0 ? {
    ...income,
    source: income.source?.trim(),
    amount: Math.abs(income.amount || 0)
  } : undefined

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  }
}

/**
 * Validates budget category data
 */
export function validateBudgetCategory(category: Partial<BudgetCategory>): DataValidationResult {
  const errors: string[] = []

  if (!category.id) errors.push('Category ID is required')
  if (!category.name || category.name.trim().length === 0) {
    errors.push('Category name is required')
  }
  if (!category.type || !['needs', 'wants', 'savings'].includes(category.type)) {
    errors.push('Category type must be needs, wants, or savings')
  }
  if (!category.color) errors.push('Category color is required')
  if (category.allocation !== undefined && category.allocation < 0) {
    errors.push('Category allocation must be non-negative')
  }
  if (category.spent !== undefined && category.spent < 0) {
    errors.push('Category spent amount must be non-negative')
  }

  const sanitizedData = errors.length === 0 ? {
    ...category,
    name: category.name?.trim(),
    allocation: Math.abs(category.allocation || 0),
    spent: Math.abs(category.spent || 0)
  } : undefined

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  }
}

/**
 * Sanitizes chart data to prevent rendering issues
 */
export function sanitizeChartData(data: any[]): any[] {
  return data.map(item => ({
    ...item,
    // Ensure numeric values are valid numbers
    ...Object.keys(item).reduce((acc, key) => {
      const value = item[key]
      if (typeof value === 'number') {
        acc[key] = isNaN(value) || !isFinite(value) ? 0 : value
      } else {
        acc[key] = value
      }
      return acc
    }, {} as any)
  }))
}

/**
 * Validates and filters expense data for analytics
 */
export function validateAnalyticsData(
  expenses: Expense[],
  income: MonthlyIncome[],
  categories: BudgetCategory[]
): {
  validExpenses: Expense[]
  validIncome: MonthlyIncome[]
  validCategories: BudgetCategory[]
  errors: string[]
} {
  const errors: string[] = []
  const validExpenses: Expense[] = []
  const validIncome: MonthlyIncome[] = []
  const validCategories: BudgetCategory[] = []

  // Validate expenses
  expenses.forEach((expense, index) => {
    const validation = validateExpense(expense)
    if (validation.isValid && validation.sanitizedData) {
      validExpenses.push(validation.sanitizedData as Expense)
    } else {
      errors.push(`Expense ${index + 1}: ${validation.errors.join(', ')}`)
    }
  })

  // Validate income
  income.forEach((inc, index) => {
    const validation = validateIncome(inc)
    if (validation.isValid && validation.sanitizedData) {
      validIncome.push(validation.sanitizedData as MonthlyIncome)
    } else {
      errors.push(`Income ${index + 1}: ${validation.errors.join(', ')}`)
    }
  })

  // Validate categories
  categories.forEach((category, index) => {
    const validation = validateBudgetCategory(category)
    if (validation.isValid && validation.sanitizedData) {
      validCategories.push(validation.sanitizedData as BudgetCategory)
    } else {
      errors.push(`Category ${index + 1}: ${validation.errors.join(', ')}`)
    }
  })

  return {
    validExpenses,
    validIncome,
    validCategories,
    errors
  }
}

/**
 * Performs performance-optimized data aggregation
 */
export function aggregateDataEfficiently<T>(
  data: T[],
  groupBy: (item: T) => string,
  reducer: (accumulator: number, item: T) => number,
  initialValue: number = 0
): Record<string, number> {
  const result: Record<string, number> = {}
  
  // Use a single pass through the data
  for (const item of data) {
    const key = groupBy(item)
    result[key] = reducer(result[key] || initialValue, item)
  }
  
  return result
}

/**
 * Debounces real-time updates to prevent excessive re-renders
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

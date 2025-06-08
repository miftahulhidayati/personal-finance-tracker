'use client';

import React, { useEffect, useState } from 'react';
import { useFinanceStore } from '@/stores/finance-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import {
  PlusCircle,
  Save,
  Target,
  Calculator,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus
} from 'lucide-react';

interface MonthlyBudget {
  month: number;
  income: {
    salary: number;
    additional: number;
  };
  categories: {
    id: string;
    name: string;
    amount: number;
    type: 'savings' | 'needs' | 'wants';
  }[];
  notes: string;
  isComplete: boolean;
}

export default function BudgetingPage() {
  const {
    isLoading,
    loadData
  } = useFinanceStore();

  const [showPrivateValues, setShowPrivateValues] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(new Set([new Date().getMonth() + 1]));
  const [monthlyBudgets, setMonthlyBudgets] = useState<MonthlyBudget[]>([]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    loadData();
    initializeMonthlyBudgets();
  }, [loadData]);

  const initializeMonthlyBudgets = () => {
    const budgets: MonthlyBudget[] = [];
    for (let month = 1; month <= 12; month++) {
      budgets.push({
        month,
        income: {
          salary: 0,
          additional: 0
        },
        categories: [],
        notes: '',
        isComplete: false
      });
    }
    setMonthlyBudgets(budgets);
  };

  const toggleMonth = (month: number) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(month)) {
      newExpanded.delete(month);
    } else {
      newExpanded.add(month);
    }
    setExpandedMonths(newExpanded);
  };

  const updateMonthlyBudget = (month: number, updates: Partial<MonthlyBudget>) => {
    setMonthlyBudgets(prev => prev.map(budget =>
      budget.month === month ? { ...budget, ...updates } : budget
    ));
  };

  const addCategory = (month: number) => {
    const newCategory = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
      type: 'needs' as const
    };

    updateMonthlyBudget(month, {
      categories: [...monthlyBudgets.find(b => b.month === month)?.categories || [], newCategory]
    });
  };

  const removeCategory = (month: number, categoryId: string) => {
    const budget = monthlyBudgets.find(b => b.month === month);
    if (budget) {
      updateMonthlyBudget(month, {
        categories: budget.categories.filter(c => c.id !== categoryId)
      });
    }
  };

  const updateCategory = (month: number, categoryId: string, updates: Partial<typeof monthlyBudgets[0]['categories'][0]>) => {
    const budget = monthlyBudgets.find(b => b.month === month);
    if (budget) {
      updateMonthlyBudget(month, {
        categories: budget.categories.map(c =>
          c.id === categoryId ? { ...c, ...updates } : c
        )
      });
    }
  };

  const getMonthTotals = (month: number) => {
    const budget = monthlyBudgets.find(b => b.month === month);
    if (!budget) return { income: 0, expenses: 0, remaining: 0 };

    const income = budget.income.salary + budget.income.additional;
    const expenses = budget.categories.reduce((sum, cat) => sum + cat.amount, 0);
    const remaining = income - expenses;

    return { income, expenses, remaining };
  };

  const getYearlyTotals = () => {
    const totalIncome = monthlyBudgets.reduce((sum, budget) =>
      sum + budget.income.salary + budget.income.additional, 0);
    const totalExpenses = monthlyBudgets.reduce((sum, budget) =>
      sum + budget.categories.reduce((catSum, cat) => catSum + cat.amount, 0), 0);
    const totalRemaining = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, totalRemaining };
  };

  const { totalIncome, totalExpenses, totalRemaining } = getYearlyTotals();
  const allocationPercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-lime-400 border-t-transparent"></div>
      </div>
    );
  }

  	return (
		<div className="space-y-8">
      			{/* Fixed Header Section */}
			<div className="sticky top-0 bg-neutral-50 border-b border-neutral-100 pb-6 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Budget Planning 2025</h1>
            <p className="mt-2 text-neutral-600">
              Plan your yearly finances with precision and clarity
            </p>
          </div>

          <div className="mt-6 sm:mt-0 flex items-center space-x-4">
            <Button
              variant="secondary"
              onClick={() => setShowPrivateValues(!showPrivateValues)}
              className="border border-neutral-200 hover:border-lime-400 transition-all"
            >
              {showPrivateValues ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPrivateValues ? 'Hide Values' : 'Show Values'}
            </Button>
            <Button className="bg-lime-400 hover:bg-lime-500 text-black font-medium shadow-lg shadow-lime-400/20">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-lime-50 to-lime-100 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-lime-700 mb-2">Total Income</p>
                  <p className="text-2xl font-bold text-black">
                    {showPrivateValues ? formatCurrency(totalIncome) : '••••••'}
                  </p>
                  <p className="text-xs text-lime-600 mt-1">Yearly projection</p>
                </div>
                <div className="p-3 bg-lime-400/30 rounded-2xl">
                  <TrendingUp className="h-6 w-6 text-lime-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-2">Allocated Budget</p>
                  <p className="text-2xl font-bold text-black">
                    {showPrivateValues ? formatCurrency(totalExpenses) : '••••••'}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">{allocationPercentage.toFixed(1)}% of income</p>
                </div>
                <div className="p-3 bg-blue-400/30 rounded-2xl">
                  <Calculator className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-2">Unallocated</p>
                  <p className="text-2xl font-bold text-black">
                    {showPrivateValues ? formatCurrency(totalRemaining) : '••••••'}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">Available funds</p>
                </div>
                <div className="p-3 bg-purple-400/30 rounded-2xl">
                  <Target className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700 mb-2">Budget Health</p>
                  <div className="flex items-center space-x-2 mb-2">
                    {totalRemaining >= 0 ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-sm font-medium text-black">
                      {totalRemaining >= 0 ? 'Balanced' : 'Over-allocated'}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-600">Financial status</p>
                </div>
                <div className="p-3 bg-emerald-400/30 rounded-2xl">
                  <DollarSign className="h-6 w-6 text-emerald-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monthly Accordion Sections */}
      <div className="space-y-4">
        {monthlyBudgets.map((budget) => {
          const isExpanded = expandedMonths.has(budget.month);
          const { income, expenses, remaining } = getMonthTotals(budget.month);
          const isOverBudget = remaining < 0;

          return (
            <Card key={budget.month} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Month Header */}
              <div
                className="p-6 cursor-pointer bg-gradient-to-r from-neutral-50 to-neutral-100 hover:from-lime-50 hover:to-lime-100 transition-all duration-300"
                onClick={() => toggleMonth(budget.month)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-neutral-600" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-neutral-600" />
                      )}
                      <Calendar className="h-5 w-5 text-lime-600" />
                      <h3 className="text-xl font-semibold text-black">{monthNames[budget.month - 1]}</h3>
                    </div>

                    {/* Status indicator */}
                    {budget.isComplete ? (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    ) : income > 0 || expenses > 0 ? (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-neutral-300"></div>
                    )}
                  </div>

                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="text-neutral-500">Income</p>
                      <p className="font-semibold text-lime-600">
                        {showPrivateValues ? formatCurrency(income) : '•••'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-neutral-500">Budget</p>
                      <p className="font-semibold text-blue-600">
                        {showPrivateValues ? formatCurrency(expenses) : '•••'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-neutral-500">Remaining</p>
                      <p className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>
                        {showPrivateValues ? formatCurrency(remaining) : '•••'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <CardContent className="p-6 bg-white border-t border-neutral-100">
                  <div className="space-y-8">
                    {/* Income Sources Section */}
                    <div>
                      <h4 className="text-lg font-semibold text-black mb-4 flex items-center">
                        <DollarSign className="h-5 w-5 text-lime-600 mr-2" />
                        Income Sources
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Monthly Salary
                          </label>
                          <input
                            type="number"
                            value={budget.income.salary}
                            onChange={(e) => updateMonthlyBudget(budget.month, {
                              income: { ...budget.income, salary: parseFloat(e.target.value) || 0 }
                            })}
                            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                            placeholder="Enter amount..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Additional Income
                          </label>
                          <input
                            type="number"
                            value={budget.income.additional}
                            onChange={(e) => updateMonthlyBudget(budget.month, {
                              income: { ...budget.income, additional: parseFloat(e.target.value) || 0 }
                            })}
                            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                            placeholder="Enter amount..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Budget Categories Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-black flex items-center">
                          <Target className="h-5 w-5 text-blue-600 mr-2" />
                          Budget Categories
                        </h4>
                        <Button
                          variant="ghost"
                          onClick={() => addCategory(budget.month)}
                          className="text-lime-600 hover:text-lime-700 hover:bg-lime-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Category
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {budget.categories.map((category) => (
                          <div key={category.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-xl">
                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Category Name
                              </label>
                              <input
                                type="text"
                                value={category.name}
                                onChange={(e) => updateCategory(budget.month, category.id, { name: e.target.value })}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                                placeholder="Category name..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Amount
                              </label>
                              <input
                                type="number"
                                value={category.amount}
                                onChange={(e) => updateCategory(budget.month, category.id, { amount: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Type
                              </label>
                              <select
                                value={category.type}
                                onChange={(e) => updateCategory(budget.month, category.id, { type: e.target.value as any })}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                              >
                                <option value="needs">Needs</option>
                                <option value="wants">Wants</option>
                                <option value="savings">Savings</option>
                              </select>
                            </div>
                            <div className="flex items-end">
                              <Button
                                variant="ghost"
                                onClick={() => removeCategory(budget.month, category.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        {budget.categories.length === 0 && (
                          <div className="text-center py-8 text-neutral-500">
                            No categories added yet. Click "Add Category" to get started.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div>
                      <h4 className="text-lg font-semibold text-black mb-4">
                        Notes (Optional)
                      </h4>
                      <textarea
                        value={budget.notes}
                        onChange={(e) => updateMonthlyBudget(budget.month, { notes: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all resize-none"
                        rows={3}
                        placeholder="Add any notes or reminders for this month..."
                      />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t border-neutral-100">
                      <Button
                        onClick={() => updateMonthlyBudget(budget.month, { isComplete: true })}
                        className="bg-lime-400 hover:bg-lime-500 text-black font-medium px-8 shadow-lg shadow-lime-400/20"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save {monthNames[budget.month - 1]}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
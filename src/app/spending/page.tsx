'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { useFinanceStore } from '@/stores/finance-store';
import { formatCurrency } from '@/utils/formatters';

export default function SpendingPage() {
  const {
    expenses,
    settings,
    loadData
  } = useFinanceStore();
  const [selectedBank, setSelectedBank] = useState('All');
  const selectedDate = '20 Dec 2024';

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Get real expenses data
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Filter expenses for current month and selected bank
  const filteredExpenses = expenses.filter(expense =>
    expense.month === currentMonth &&
    expense.year === currentYear &&
    (selectedBank === 'All' || expense.account === selectedBank)
  );

  // Calculate total spending
  const totalSpending = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'bg-orange-100 text-orange-800',
      'Supplies': 'bg-blue-100 text-blue-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Transportation': 'bg-green-100 text-green-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Utilities': 'bg-yellow-100 text-yellow-800',
      'Gifts': 'bg-indigo-100 text-indigo-800',
      'Home Rent': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getAccountColor = (account: string) => {
    const colors: Record<string, string> = {
      'Bank 1': 'bg-teal-100 text-teal-800',
      'Bank 2': 'bg-purple-100 text-purple-800',
      'Bank 3': 'bg-blue-100 text-blue-800',
    };
    return colors[account] || 'bg-gray-100 text-gray-800';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            💳 Spending Tracker
          </h1>
          <div className="flex items-center space-x-4">
            <select
              className="input text-sm"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
            >
              <option value="All">All Banks</option>
              <option value="Bank 1">Bank 1</option>
              <option value="Bank 2">Bank 2</option>
              <option value="Bank 3">Bank 3</option>
            </select>
          </div>
        </div>

        {/* Date and Balance Info */}
        <div className="card">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Date: {selectedDate}</h3>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Spending ({new Date().toLocaleString('default', { month: 'long' })})</p>
                <p className="text-xl font-bold text-orange-600">{formatCurrency(totalSpending, settings?.currency || 'Rp')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="table-header">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Description</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Total</th>
                  <th className="table-header">Account</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="table-cell font-medium">{expense.date}</td>
                    <td className="table-cell">{expense.description}</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="table-cell font-semibold">
                      {formatCurrency(expense.amount, settings?.currency || 'Rp')}
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getAccountColor(expense.account)}`}>
                        {expense.account}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Empty rows for future transactions */}
                {Array(10).fill(0).map((_, index) => (
                  <tr key={`empty-${index}`} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="table-cell"></td>
                    <td className="table-cell"></td>
                    <td className="table-cell">
                      <select className="text-xs rounded px-2 py-1 border-gray-300">
                        <option>Select Category</option>
                        <option>Food</option>
                        <option>Transportation</option>
                        <option>Healthcare</option>
                        <option>Entertainment</option>
                        <option>Utilities</option>
                        <option>Shopping</option>
                      </select>
                    </td>
                    <td className="table-cell"></td>
                    <td className="table-cell">
                      <select className="text-xs rounded px-2 py-1 border-gray-300">
                        <option>Select Account</option>
                        <option>Bank 1</option>
                        <option>Bank 2</option>
                        <option>Bank 3</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Add Transaction */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add Transaction</h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              type="date"
              className="input"
              placeholder="Date"
            />
            <input
              type="text"
              className="input"
              placeholder="Description"
            />
            <select className="input">
              <option>Select Category</option>
              <option>Food</option>
              <option>Transportation</option>
              <option>Healthcare</option>
              <option>Entertainment</option>
              <option>Utilities</option>
              <option>Shopping</option>
            </select>
            <input
              type="number"
              className="input"
              placeholder="Amount"
            />
            <select className="input">
              <option>Select Account</option>
              <option>Bank 1</option>
              <option>Bank 2</option>
              <option>Bank 3</option>
            </select>
            <button className="btn btn-primary">
              Add Transaction
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 py-4">
          Quotes are not sourced from all markets and may be delayed by up to 20 minutes. Information is provided 'as is' and solely for informational purposes, not for trading purposes or advice.
        </div>
      </div>
    </MainLayout>
  );
}
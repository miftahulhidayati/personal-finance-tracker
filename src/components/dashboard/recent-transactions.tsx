'use client';

import React from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingCart,
  Car,
  Home,
  Coffee,
  Smartphone,
  MoreHorizontal,
  Filter
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  icon: string;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

// Sample transaction data
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    type: 'expense',
    category: 'Food & Dining',
    description: 'Starbucks Coffee',
    amount: 45000,
    date: '2025-06-08',
    icon: 'coffee'
  },
  {
    id: '2',
    type: 'income',
    category: 'Salary',
    description: 'Monthly Salary',
    amount: 8500000,
    date: '2025-06-07',
    icon: 'home'
  },
  {
    id: '3',
    type: 'expense',
    category: 'Transportation',
    description: 'Grab to Office',
    amount: 25000,
    date: '2025-06-07',
    icon: 'car'
  },
  {
    id: '4',
    type: 'expense',
    category: 'Shopping',
    description: 'Online Shopping',
    amount: 150000,
    date: '2025-06-06',
    icon: 'shopping'
  },
  {
    id: '5',
    type: 'expense',
    category: 'Technology',
    description: 'Netflix Subscription',
    amount: 186000,
    date: '2025-06-05',
    icon: 'smartphone'
  }
];

const iconMap = {
  coffee: Coffee,
  home: Home,
  car: Car,
  shopping: ShoppingCart,
  smartphone: Smartphone,
};

export function RecentTransactions({ transactions = sampleTransactions }: RecentTransactionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || ShoppingCart;
    return IconComponent;
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Recent Transactions</h3>
          <p className="text-sm text-neutral-500">Latest financial activity</p>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-xl hover:bg-neutral-100 transition-colors">
            <Filter className="w-4 h-4 text-neutral-600" />
          </button>
          <button className="p-2 rounded-xl hover:bg-neutral-100 transition-colors">
            <MoreHorizontal className="w-4 h-4 text-neutral-600" />
          </button>
        </div>
      </div>

      {/* Transactions list */}
      <div className="space-y-3">
        {transactions.map((transaction) => {
          const Icon = getIcon(transaction.icon);
          const isExpense = transaction.type === 'expense';

          return (
            <div key={transaction.id} className="transaction-item group">
              {/* Icon */}
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center mr-4
                ${isExpense
                  ? 'bg-red-50 group-hover:bg-red-100'
                  : 'bg-green-50 group-hover:bg-green-100'
                }
                transition-colors duration-200
              `}>
                <Icon className={`w-5 h-5 ${
                  isExpense ? 'text-red-600' : 'text-green-600'
                }`} />
              </div>

              {/* Transaction details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900 truncate">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {transaction.category} • {formatDate(transaction.date)}
                    </p>
                  </div>

                  <div className="text-right ml-4">
                    <p className={`font-semibold ${
                      isExpense ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </p>

                    {/* Direction indicator */}
                    <div className="flex justify-end mt-1">
                      {isExpense ? (
                        <ArrowUpRight className="w-3 h-3 text-red-400" />
                      ) : (
                        <ArrowDownLeft className="w-3 h-3 text-green-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View all button */}
      <div className="mt-6 pt-4 border-t border-neutral-100">
        <button className="w-full text-center text-lime-600 hover:text-lime-700 font-medium py-2 rounded-xl hover:bg-lime-50 transition-colors">
          View All Transactions
        </button>
      </div>
    </div>
  );
}
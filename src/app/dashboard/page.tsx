'use client';

import React from 'react';
import { AccountBalanceCard } from '@/components/dashboard/account-balance-card';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { QuickSpending } from '@/components/dashboard/quick-spending';
import { SpendingRadar } from '@/components/dashboard/spending-radar';
import { BudgetTracking } from '@/components/dashboard/budget-tracking';
import {
  TrendingUp,
  DollarSign,
  PiggyBank,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

export default function DashboardPage() {
  // Sample data - in a real app, this would come from your data store/API
  const accountData = {
    balance: 25450000,
    previousBalance: 23200000,
  };

  const quickStats = [
    {
      title: 'Total Income',
      value: 'Rp 8.500.000',
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-lime-600',
      bgColor: 'bg-lime-100',
    },
    {
      title: 'Total Expenses',
      value: 'Rp 4.300.000',
      change: '-8.2%',
      trend: 'down' as const,
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Savings Rate',
      value: '49.4%',
      change: '+5.1%',
      trend: 'up' as const,
      icon: PiggyBank,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Investments',
      value: 'Rp 18.200.000',
      change: '+15.8%',
      trend: 'up' as const,
      icon: Wallet,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Financial Dashboard
          </h1>
          <p className="mt-2 text-neutral-600">
            Welcome back! Here's your financial overview for June 2025
          </p>
        </div>

        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-2 bg-lime-50 rounded-xl border border-lime-200">
            <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse-subtle"></div>
            <span className="text-sm font-medium text-lime-700">Live Data</span>
          </div>

          <button className="btn btn-primary">
            Generate Report
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-neutral-900 mb-2">
                    {stat.value}
                  </p>
                  <div className={`flex items-center text-sm ${
                    stat.trend === 'up' ? 'text-lime-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4 mr-1" />
                    )}
                    <span className="font-medium">{stat.change}</span>
                  </div>
                </div>

                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Account Balance Card */}
          <AccountBalanceCard
            balance={accountData.balance}
            previousBalance={accountData.previousBalance}
          />

          {/* Budget Tracking */}
          <BudgetTracking />

          {/* Recent Transactions */}
          <RecentTransactions />
        </div>

        {/* Right Column - Sidebar Content */}
        <div className="space-y-8">
          {/* Quick Add Expense */}
          <QuickSpending />

          {/* Spending Radar */}
          <SpendingRadar />

          {/* Financial Goals Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900">Financial Goals</h3>
              <button className="text-lime-600 hover:text-lime-700 text-sm font-medium">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {/* Emergency Fund Goal */}
              <div className="p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-neutral-900">Emergency Fund</span>
                  <span className="text-sm text-neutral-600">85%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                  <div className="bg-lime-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-600">
                  <span>Rp 17.000.000</span>
                  <span>of Rp 20.000.000</span>
                </div>
              </div>

              {/* Vacation Fund Goal */}
              <div className="p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-neutral-900">Vacation Fund</span>
                  <span className="text-sm text-neutral-600">42%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-600">
                  <span>Rp 2.100.000</span>
                  <span>of Rp 5.000.000</span>
                </div>
              </div>

              {/* Investment Goal */}
              <div className="p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-neutral-900">Investment Portfolio</span>
                  <span className="text-sm text-neutral-600">73%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-600">
                  <span>Rp 14.600.000</span>
                  <span>of Rp 20.000.000</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 btn btn-secondary text-sm">
              Set New Goal
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section - Financial Insights */}
      <div className="bg-gradient-to-br from-lime-50 to-neutral-50 rounded-2xl p-8 border border-lime-100">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-lime-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-neutral-900" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              Monthly Financial Summary
            </h3>
            <p className="text-neutral-700 mb-4">
              Excellent work this month! You've successfully saved 49.4% of your income and stayed within budget on most categories. Your emergency fund is almost complete, and your investment portfolio is growing steadily.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-soft">
                <p className="text-sm text-neutral-600">Best Category</p>
                <p className="font-semibold text-lime-600">Transportation</p>
                <p className="text-xs text-neutral-500">20% under budget</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-soft">
                <p className="text-sm text-neutral-600">Needs Attention</p>
                <p className="font-semibold text-orange-600">Food & Dining</p>
                <p className="text-xs text-neutral-500">5% over budget</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-soft">
                <p className="text-sm text-neutral-600">Next Milestone</p>
                <p className="font-semibold text-purple-600">Emergency Fund</p>
                <p className="text-xs text-neutral-500">Rp 3M to complete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
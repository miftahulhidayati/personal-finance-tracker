'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';

interface AccountBalanceCardProps {
  balance: number;
  previousBalance?: number;
  currency?: string;
  accountName?: string;
}

export function AccountBalanceCard({
  balance,
  previousBalance,
  currency = 'IDR',
  accountName = 'Total Balance'
}: AccountBalanceCardProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const changeAmount = previousBalance ? balance - previousBalance : 0;
  const changePercentage = previousBalance ? ((changeAmount / previousBalance) * 100) : 0;
  const isPositiveChange = changeAmount >= 0;

  return (
    <div className="card-highlight relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-lime-50 to-lime-100 opacity-50"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-neutral-600 uppercase tracking-wider">
              {accountName}
            </p>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-lime-500 rounded-full mr-2"></div>
              <span className="text-xs text-neutral-500">Live Balance</span>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-2 rounded-xl hover:bg-lime-200 transition-colors"
          >
            {isVisible ? (
              <Eye className="w-5 h-5 text-neutral-600" />
            ) : (
              <EyeOff className="w-5 h-5 text-neutral-600" />
            )}
          </button>
        </div>

        {/* Balance */}
        <div className="mb-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
            {isVisible ? formatCurrency(balance) : '••••••••'}
          </h2>
        </div>

        {/* Change indicator */}
        {previousBalance && isVisible && (
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 ${
              isPositiveChange ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositiveChange ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-semibold">
                {formatCurrency(Math.abs(changeAmount))}
              </span>
              <span className="text-sm">
                ({isPositiveChange ? '+' : ''}{changePercentage.toFixed(1)}%)
              </span>
            </div>

            <div className="text-right">
              <p className="text-xs text-neutral-500">vs last month</p>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="flex space-x-3 mt-6">
          <button className="btn btn-primary flex-1 text-sm py-3">
            Add Money
          </button>
          <button className="btn btn-secondary flex-1 text-sm py-3">
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
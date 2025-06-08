'use client';

import React from 'react';
import { MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';

interface SpendingData {
  category: string;
  amount: number;
  budget: number;
  color: string;
}

interface SpendingRadarProps {
  data?: SpendingData[];
}

// Sample data
const sampleData: SpendingData[] = [
  { category: 'Food & Dining', amount: 850000, budget: 1000000, color: '#f97316' },
  { category: 'Transportation', amount: 450000, budget: 600000, color: '#3b82f6' },
  { category: 'Shopping', amount: 320000, budget: 500000, color: '#a855f7' },
  { category: 'Bills & Utilities', amount: 780000, budget: 800000, color: '#ef4444' },
  { category: 'Entertainment', amount: 250000, budget: 400000, color: '#ec4899' },
  { category: 'Health & Fitness', amount: 180000, budget: 300000, color: '#10b981' },
];

export function SpendingRadar({ data = sampleData }: SpendingRadarProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getUsagePercentage = (amount: number, budget: number) => {
    return Math.min((amount / budget) * 100, 100);
  };

  const totalSpent = data.reduce((sum, item) => sum + item.amount, 0);
  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
  const overallUsage = (totalSpent / totalBudget) * 100;

  // Create radar chart points (simplified circular visualization)
  const centerX = 100;
  const centerY = 100;
  const radius = 80;

  const radarPoints = data.map((item, index) => {
    const angle = (index / data.length) * 2 * Math.PI - Math.PI / 2;
    const percentage = getUsagePercentage(item.amount, item.budget);
    const distance = (percentage / 100) * radius;

    return {
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance,
      labelX: centerX + Math.cos(angle) * (radius + 20),
      labelY: centerY + Math.sin(angle) * (radius + 20),
      category: item.category,
      percentage,
      color: item.color,
    };
  });

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Spending Categories</h3>
          <p className="text-sm text-neutral-500">Budget usage overview</p>
        </div>

        <button className="p-2 rounded-xl hover:bg-neutral-100 transition-colors">
          <MoreHorizontal className="w-4 h-4 text-neutral-600" />
        </button>
      </div>

      {/* Overall Stats */}
      <div className="flex items-center justify-between mb-6 p-4 bg-neutral-50 rounded-xl">
        <div>
          <p className="text-sm text-neutral-600">Total Spent</p>
          <p className="text-xl font-bold text-neutral-900">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutral-600">Budget Usage</p>
          <div className="flex items-center space-x-2">
            <p className={`text-xl font-bold ${overallUsage > 80 ? 'text-red-600' : 'text-lime-600'}`}>
              {overallUsage.toFixed(1)}%
            </p>
            {overallUsage > 80 ? (
              <TrendingUp className="w-4 h-4 text-red-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-lime-600" />
            )}
          </div>
        </div>
      </div>

      {/* Radar Chart Visualization */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-64 h-64">
          <svg width="200" height="200" className="absolute inset-0 m-auto">
            {/* Grid circles */}
            {[20, 40, 60, 80].map((r) => (
              <circle
                key={r}
                cx={centerX}
                cy={centerY}
                r={r}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
                className="opacity-50"
              />
            ))}

            {/* Grid lines */}
            {data.map((_, index) => {
              const angle = (index / data.length) * 2 * Math.PI - Math.PI / 2;
              const endX = centerX + Math.cos(angle) * radius;
              const endY = centerY + Math.sin(angle) * radius;

              return (
                <line
                  key={index}
                  x1={centerX}
                  y1={centerY}
                  x2={endX}
                  y2={endY}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  className="opacity-50"
                />
              );
            })}

            {/* Data polygon */}
            <polygon
              points={radarPoints.map(point => `${point.x},${point.y}`).join(' ')}
              fill="#c6ef4e"
              fillOpacity="0.3"
              stroke="#c6ef4e"
              strokeWidth="2"
            />

            {/* Data points */}
            {radarPoints.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={point.color}
                stroke="white"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {data.map((item, index) => {
          const usagePercentage = getUsagePercentage(item.amount, item.budget);
          const isOverBudget = usagePercentage > 100;
          const isNearLimit = usagePercentage > 80;

          return (
            <div key={index} className="spending-category">
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-900">
                      {item.category}
                    </span>
                    <span className={`text-sm font-semibold ${
                      isOverBudget ? 'text-red-600' :
                      isNearLimit ? 'text-orange-600' : 'text-neutral-700'
                    }`}>
                      {usagePercentage.toFixed(0)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>{formatCurrency(item.amount)}</span>
                    <span>of {formatCurrency(item.budget)}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isOverBudget ? 'bg-red-500' :
                        isNearLimit ? 'bg-orange-500' : 'bg-lime-500'
                      }`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Target, MoreHorizontal } from 'lucide-react';

interface BudgetData {
  month: string;
  budget: number;
  spent: number;
  saved: number;
}

interface BudgetTrackingProps {
  data?: BudgetData[];
  currentMonth?: string;
}

// Sample data for the last 6 months
const sampleData: BudgetData[] = [
  { month: 'Jan', budget: 5000000, spent: 4200000, saved: 800000 },
  { month: 'Feb', budget: 5000000, spent: 4800000, saved: 200000 },
  { month: 'Mar', budget: 5200000, spent: 4500000, saved: 700000 },
  { month: 'Apr', budget: 5200000, spent: 5100000, saved: 100000 },
  { month: 'May', budget: 5500000, spent: 4900000, saved: 600000 },
  { month: 'Jun', budget: 5500000, spent: 4300000, saved: 1200000 },
];

export function BudgetTracking({ data = sampleData, currentMonth = 'Jun' }: BudgetTrackingProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

    const currentData = data.find(d => d.month === currentMonth) || data[data.length - 1];
  if (!currentData) return null; // Guard clause

  const currentIndex = data.indexOf(currentData);
  const previousData = currentIndex > 0 ? data[currentIndex - 1] : undefined;

  const savingsChange = previousData ? currentData.saved - previousData.saved : 0;
  const savingsPercentageChange = previousData ? ((savingsChange / previousData.saved) * 100) : 0;

  // Calculate chart dimensions
  const maxValue = Math.max(...data.map(d => Math.max(d.budget, d.spent)));
  const chartHeight = 200;
  const chartWidth = 400;
  const padding = 40;

  // Create chart points
  const budgetPoints = data.map((d, i) => ({
    x: padding + (i * (chartWidth - 2 * padding)) / (data.length - 1),
    y: chartHeight - padding - ((d.budget / maxValue) * (chartHeight - 2 * padding))
  }));

  const spentPoints = data.map((d, i) => ({
    x: padding + (i * (chartWidth - 2 * padding)) / (data.length - 1),
    y: chartHeight - padding - ((d.spent / maxValue) * (chartHeight - 2 * padding))
  }));

  const createPath = (points: { x: number; y: number }[]) => {
    return points.reduce((path, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      return path + ` L ${point.x} ${point.y}`;
    }, '');
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Budget Tracking</h3>
          <p className="text-sm text-neutral-500">Monthly budget vs spending trends</p>
        </div>

        <button className="p-2 rounded-xl hover:bg-neutral-100 transition-colors">
          <MoreHorizontal className="w-4 h-4 text-neutral-600" />
        </button>
      </div>

      {/* Current month stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Budget</p>
              <p className="text-xl font-bold text-neutral-900">
                {formatCurrency(currentData.budget)}
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Spent</p>
              <p className="text-xl font-bold text-neutral-900">
                {formatCurrency(currentData.spent)}
              </p>
              <p className={`text-sm ${
                currentData.spent > currentData.budget ? 'text-red-600' : 'text-lime-600'
              }`}>
                {((currentData.spent / currentData.budget) * 100).toFixed(1)}% of budget
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentData.spent > currentData.budget ? 'bg-red-100' : 'bg-lime-100'
            }`}>
              {currentData.spent > currentData.budget ? (
                <TrendingUp className="w-4 h-4 text-red-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-lime-600" />
              )}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Saved</p>
              <p className="text-xl font-bold text-lime-600">
                {formatCurrency(currentData.saved)}
              </p>
              {previousData && (
                <p className={`text-sm ${savingsChange >= 0 ? 'text-lime-600' : 'text-red-600'}`}>
                  {savingsChange >= 0 ? '+' : ''}{savingsPercentageChange.toFixed(1)}% vs last month
                </p>
              )}
            </div>
            <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-lime-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-neutral-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-neutral-900">6-Month Trend</h4>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-neutral-600">Budget</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-lime-500 rounded-full"></div>
              <span className="text-sm text-neutral-600">Spent</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <svg width={chartWidth} height={chartHeight} className="w-full h-auto">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((percentage) => {
              const y = chartHeight - padding - ((percentage / 100) * (chartHeight - 2 * padding));
              return (
                <g key={percentage}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray={percentage === 0 ? "none" : "2,2"}
                  />
                  <text
                    x={padding - 10}
                    y={y + 4}
                    className="text-xs fill-neutral-400"
                    textAnchor="end"
                  >
                    {formatCurrency((percentage / 100) * maxValue).replace('Rp', '').trim()}
                  </text>
                </g>
              );
            })}

            {/* Budget line */}
            <path
              d={createPath(budgetPoints)}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Spent line */}
            <path
              d={createPath(spentPoints)}
              fill="none"
              stroke="#c6ef4e"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {budgetPoints.map((point, i) => (
              <circle
                key={`budget-${i}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
            ))}

            {spentPoints.map((point, i) => (
              <circle
                key={`spent-${i}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#c6ef4e"
                stroke="white"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
            ))}

            {/* X-axis labels */}
            {data.map((d, i) => {
              const x = padding + (i * (chartWidth - 2 * padding)) / (data.length - 1);
              return (
                <text
                  key={d.month}
                  x={x}
                  y={chartHeight - 10}
                  className={`text-sm text-center ${
                    d.month === currentMonth ? 'fill-neutral-900 font-semibold' : 'fill-neutral-500'
                  }`}
                  textAnchor="middle"
                >
                  {d.month}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Budget insights */}
      <div className="mt-6 p-4 bg-lime-50 rounded-xl border border-lime-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-lime-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Target className="w-4 h-4 text-neutral-900" />
          </div>
          <div>
            <h5 className="font-semibold text-neutral-900 mb-1">Budget Insights</h5>
            <p className="text-sm text-neutral-700">
              {currentData.spent < currentData.budget ? (
                `Great job! You're ${formatCurrency(currentData.budget - currentData.spent)} under budget this month. Keep up the good spending habits.`
              ) : (
                `You've exceeded your budget by ${formatCurrency(currentData.spent - currentData.budget)}. Consider reviewing your spending categories.`
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
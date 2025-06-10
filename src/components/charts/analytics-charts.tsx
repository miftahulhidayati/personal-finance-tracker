'use client'

import React, { useMemo, useCallback } from 'react'
import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	PieChart,
	Pie,
	Cell,
	Line,
	Area,
	AreaChart
} from 'recharts'
import { useFinanceStore } from '@/stores/finance-store'
import { formatCurrency, formatPercentage } from '@/utils/formatters'

interface ChartProps {
	period: 'month' | 'quarter' | 'year'
}

// Color palette
const COLORS = ['#c6ef4e', '#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69']

// Enhanced tooltip component for real-time data
const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${formatter ? formatter(entry.value) : formatCurrency(entry.value, 'Rp')}`}
          </p>
        ))}
        {payload.length > 1 && (
          <div className="border-t border-gray-100 mt-2 pt-2">
            <p className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
    )
  }
  return null
}

export function IncomeVsExpensesChart({ period }: ChartProps) {
	const { expenses, monthlyIncome, historicalData } = useFinanceStore()

	const data = useMemo(() => {
		// Use historical data if available, otherwise fall back to current data logic
		if (historicalData && period !== 'month') {
			const monthlyData = new Map()
			
			// Process historical income
			historicalData.income.forEach(income => {
				const key = `${income.year}-${income.month.toString().padStart(2, '0')}`
				if (!monthlyData.has(key)) {
					monthlyData.set(key, { 
						month: new Date(income.year, income.month - 1).toLocaleDateString('en-US', { month: 'short' }),
						income: 0, 
						expenses: 0, 
						net: 0 
					})
				}
				const entry = monthlyData.get(key)!
				entry.income += income.amount
			})
			
			// Process historical expenses
			historicalData.expenses.forEach(expense => {
				const key = `${expense.year}-${expense.month.toString().padStart(2, '0')}`
				if (!monthlyData.has(key)) {
					monthlyData.set(key, { 
						month: new Date(expense.year, expense.month - 1).toLocaleDateString('en-US', { month: 'short' }),
						income: 0, 
						expenses: 0, 
						net: 0 
					})
				}
				const entry = monthlyData.get(key)!
				entry.expenses += expense.amount
			})
			
			// Calculate net and sort by date
			const sortedData = Array.from(monthlyData.entries())
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([, value]) => ({
					...value,
					net: value.income - value.expenses
				}))
			
			// Return last 6 months for quarter view, 12 for year
			const maxMonths = period === 'quarter' ? 3 : period === 'year' ? 12 : 6
			return sortedData.slice(-maxMonths)
		}
		
		// Fallback to original logic for current month data
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		
		return months.map((month, index) => {
			// Mock data - replace with actual calculations
			const income = monthlyIncome.find(mi => mi.month === index + 1)?.amount || 0
			const monthExpenses = expenses
				.filter(expense => new Date(expense.date).getMonth() === index)
				.reduce((sum, expense) => sum + expense.amount, 0)

			return {
				month,
				income,
				expenses: monthExpenses,
				net: income - monthExpenses
			}
		})
	}, [expenses, monthlyIncome, historicalData, period])

	return (
		<ResponsiveContainer width="100%" height={300}>
			<BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="month" />
				<YAxis tickFormatter={(value) => formatCurrency(value)} />
				<Tooltip 
					content={<CustomTooltip formatter={(value: number) => formatCurrency(value, 'Rp')} />}
				/>
				<Legend />
				<Bar dataKey="income" fill="#c6ef4e" name="Pemasukan" />
				<Bar dataKey="expenses" fill="#ef4444" name="Pengeluaran" />
			</BarChart>
		</ResponsiveContainer>
	)
}

export function CategorySpendingBreakdown({ period }: ChartProps) {
	const { expenses, budgetCategories, historicalData } = useFinanceStore()

	const data = useMemo(() => {
		// Determine which expenses to use based on period and historical data availability
		let expensesToAnalyze = expenses
		
		if (historicalData && period !== 'month') {
			// For quarter/year views, use historical data if available
			const currentDate = new Date()
			const monthsToInclude = period === 'quarter' ? 3 : period === 'year' ? 12 : 1
			
			// Filter historical expenses based on period
			expensesToAnalyze = historicalData.expenses.filter(expense => {
				const expenseDate = new Date(expense.year, expense.month - 1)
				const cutoffDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsToInclude + 1)
				return expenseDate >= cutoffDate
			})
		}
		
		const categoryTotals = expensesToAnalyze.reduce((acc, expense) => {
			const category = budgetCategories.find(cat => cat.name === expense.category)
			const categoryName = category?.name || expense.category || 'Unknown'
			acc[categoryName] = (acc[categoryName] || 0) + expense.amount
			return acc
		}, {} as Record<string, number>)

		const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

		return Object.entries(categoryTotals).map(([name, amount], index) => ({
			name,
			value: amount,
			percentage: total > 0 ? (amount / total) * 100 : 0,
			color: COLORS[index % COLORS.length]
		}))
	}, [expenses, budgetCategories, historicalData, period])

	const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
		const RADIAN = Math.PI / 180
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5
		const x = cx + radius * Math.cos(-midAngle * RADIAN)
		const y = cy + radius * Math.sin(-midAngle * RADIAN)

		if (percent < 0.05) return null

		return (
			<text 
				x={x} 
				y={y} 
				fill="white" 
				textAnchor={x > cx ? 'start' : 'end'} 
				dominantBaseline="central"
				fontSize={12}
				fontWeight="bold"
			>
				{`${(percent * 100).toFixed(0)}%`}
			</text>
		)
	}

	return (
		<div className="space-y-4">
			<ResponsiveContainer width="100%" height={250}>
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						labelLine={false}
						label={renderCustomizedLabel}
						outerRadius={80}
						fill="#8884d8"
						dataKey="value"
					>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Pie>
					<Tooltip formatter={(value: number) => formatCurrency(value)} />
				</PieChart>
			</ResponsiveContainer>
			
			{/* Legend */}
			<div className="grid grid-cols-2 gap-2">
				{data.map((entry) => (
					<div key={entry.name} className="flex items-center gap-2 text-sm">
						<div 
							className="w-3 h-3 rounded-full" 
							style={{ backgroundColor: entry.color }}
						/>
						<span className="truncate">{entry.name}</span>
						<span className="ml-auto font-medium">{formatPercentage(entry.percentage)}</span>
					</div>
				))}
			</div>
		</div>
	)
}

export function CashflowTrendChart({ period }: ChartProps) {
	const { expenses, monthlyIncome, historicalData } = useFinanceStore()

	const data = useMemo(() => {
		// Use historical data if available and not in current month view
		if (historicalData && period !== 'month') {
			const monthlyData = new Map()
			
			// Process historical income
			historicalData.income.forEach(income => {
				const key = `${income.year}-${income.month.toString().padStart(2, '0')}`
				const monthName = new Date(income.year, income.month - 1).toLocaleDateString('en-US', { month: 'short' })
				if (!monthlyData.has(key)) {
					monthlyData.set(key, { 
						month: monthName,
						income: 0, 
						expenses: 0, 
						balance: 0,
						netFlow: 0
					})
				}
				const entry = monthlyData.get(key)!
				entry.income += income.amount
			})
			
			// Process historical expenses
			historicalData.expenses.forEach(expense => {
				const key = `${expense.year}-${expense.month.toString().padStart(2, '0')}`
				const monthName = new Date(expense.year, expense.month - 1).toLocaleDateString('en-US', { month: 'short' })
				if (!monthlyData.has(key)) {
					monthlyData.set(key, { 
						month: monthName,
						income: 0, 
						expenses: 0, 
						balance: 0,
						netFlow: 0
					})
				}
				const entry = monthlyData.get(key)!
				entry.expenses += expense.amount
			})
			
			// Calculate net flow and running balance
			let runningBalance = 0
			const sortedData = Array.from(monthlyData.entries())
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([, value]) => {
					const netFlow = value.income - value.expenses
					runningBalance += netFlow
					return {
						...value,
						netFlow,
						balance: runningBalance
					}
				})
			
			// Return appropriate number of months based on period
			const maxMonths = period === 'quarter' ? 3 : period === 'year' ? 12 : 6
			return sortedData.slice(-maxMonths)
		}
		
		// Fallback to original logic
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		let runningBalance = 0
		
		return months.map((month, index) => {
			const income = monthlyIncome.find(mi => mi.month === index + 1)?.amount || 0
			const monthExpenses = expenses
				.filter(expense => new Date(expense.date).getMonth() === index)
				.reduce((sum, expense) => sum + expense.amount, 0)
			
			const netFlow = income - monthExpenses
			runningBalance += netFlow

			return {
				month,
				income,
				expenses: monthExpenses,
				balance: runningBalance,
				netFlow
			}
		})
	}, [expenses, monthlyIncome, historicalData, period])

	return (
		<ResponsiveContainer width="100%" height={350}>
			<AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
				<defs>
					<linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#c6ef4e" stopOpacity={0.8}/>
						<stop offset="95%" stopColor="#c6ef4e" stopOpacity={0.1}/>
					</linearGradient>
					<linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
						<stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="month" />
				<YAxis tickFormatter={(value) => formatCurrency(value)} />
				<Tooltip 
					formatter={(value: number) => formatCurrency(value)}
					labelStyle={{ color: '#374151' }}
				/>
				<Legend />
				<Area 
					type="monotone" 
					dataKey="income" 
					stackId="1" 
					stroke="#c6ef4e" 
					fillOpacity={1} 
					fill="url(#colorIncome)"
					name="Pemasukan"
				/>
				<Area 
					type="monotone" 
					dataKey="expenses" 
					stackId="2" 
					stroke="#ef4444" 
					fillOpacity={1} 
					fill="url(#colorExpenses)"
					name="Pengeluaran"
				/>
				<Line 
					type="monotone" 
					dataKey="balance" 
					stroke="#8b5cf6" 
					strokeWidth={3}
					name="Saldo"
				/>
			</AreaChart>
		</ResponsiveContainer>
	)
}

export function BudgetAllocationChart({ period }: ChartProps) {
	const { budgetCategories, expenses, historicalData } = useFinanceStore()

	const data = useMemo(() => {
		// Determine which expenses to use based on period and historical data availability
		let expensesToAnalyze = expenses
		
		if (historicalData && period !== 'month') {
			const currentDate = new Date()
			const monthsToInclude = period === 'quarter' ? 3 : period === 'year' ? 12 : 1
			
			// Filter historical expenses based on period
			expensesToAnalyze = historicalData.expenses.filter(expense => {
				const expenseDate = new Date(expense.year, expense.month - 1)
				const cutoffDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsToInclude + 1)
				return expenseDate >= cutoffDate
			})
		}
		
		return budgetCategories.map(category => {
			const actualSpent = expensesToAnalyze
				.filter(expense => expense.category === category.name)
				.reduce((sum, expense) => sum + expense.amount, 0)

			// For multi-month periods, multiply budget allocation accordingly
			const periodMultiplier = period === 'quarter' ? 3 : period === 'year' ? 12 : 1
			const adjustedBudget = category.allocation * periodMultiplier

			const efficiency = adjustedBudget > 0 
				? (actualSpent / adjustedBudget) * 100 
				: 0

			return {
				name: category.name,
				budgeted: adjustedBudget,
				actual: actualSpent,
				efficiency: Math.min(efficiency, 150), // Cap at 150% for visualization
				variance: actualSpent - adjustedBudget
			}
		})
	}, [budgetCategories, expenses, historicalData, period])

	return (
		<ResponsiveContainer width="100%" height={300}>
			<BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis 
					dataKey="name" 
					angle={-45}
					textAnchor="end"
					height={60}
					interval={0}
				/>
				<YAxis tickFormatter={(value) => formatCurrency(value)} />
				<Tooltip 
					formatter={(value: number) => formatCurrency(value)}
					labelStyle={{ color: '#374151' }}
				/>
				<Legend />
				<Bar dataKey="budgeted" fill="#94a3b8" name="Anggaran" />
				<Bar dataKey="actual" fill="#c6ef4e" name="Aktual" />
			</BarChart>
		</ResponsiveContainer>
	)
}

export function OverUnderAllocationTracker({ period }: ChartProps) {
	const { budgetCategories, expenses, historicalData } = useFinanceStore()

	const data = useMemo(() => {
		// Determine which expenses to use based on period and historical data availability
		let expensesToAnalyze = expenses
		
		if (historicalData && period !== 'month') {
			const currentDate = new Date()
			const monthsToInclude = period === 'quarter' ? 3 : period === 'year' ? 12 : 1
			
			// Filter historical expenses based on period
			expensesToAnalyze = historicalData.expenses.filter(expense => {
				const expenseDate = new Date(expense.year, expense.month - 1)
				const cutoffDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsToInclude + 1)
				return expenseDate >= cutoffDate
			})
		}
		
		return budgetCategories.map(category => {
			const actualSpent = expensesToAnalyze
				.filter(expense => expense.category === category.name)
				.reduce((sum, expense) => sum + expense.amount, 0)

			// For multi-month periods, multiply budget allocation accordingly
			const periodMultiplier = period === 'quarter' ? 3 : period === 'year' ? 12 : 1
			const adjustedBudget = category.allocation * periodMultiplier

			const variance = actualSpent - adjustedBudget
			const percentage = adjustedBudget > 0 
				? (variance / adjustedBudget) * 100 
				: 0

			return {
				name: category.name,
				variance,
				percentage,
				status: variance > 0 ? 'over' : variance < 0 ? 'under' : 'exact'
			}
		}).sort((a, b) => Math.abs(b.percentage) - Math.abs(a.percentage))
	}, [budgetCategories, expenses, historicalData, period])

	return (
		<div className="space-y-3">
			{data.map((item) => (
				<div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
					<div className="flex items-center gap-3">
						<div className={`w-3 h-3 rounded-full ${
							item.status === 'over' ? 'bg-red-500' : 
							item.status === 'under' ? 'bg-blue-500' : 
							'bg-green-500'
						}`} />
						<span className="font-medium">{item.name}</span>
					</div>
					<div className="text-right">
						<div className={`font-bold ${
							item.status === 'over' ? 'text-red-600' : 
							item.status === 'under' ? 'text-blue-600' : 
							'text-green-600'
						}`}>
							{item.variance >= 0 ? '+' : ''}{formatCurrency(item.variance)}
						</div>
						<div className="text-sm text-gray-500">
							{item.percentage >= 0 ? '+' : ''}{formatPercentage(item.percentage)}
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
	TrendingUp, 
	TrendingDown, 
	Calendar,
	Target
} from 'lucide-react'
import { useFinanceStore } from '@/stores/finance-store'
import { formatCurrency, formatPercentage } from '@/utils/formatters'

interface TrendData {
	category: string
	currentMonth: number
	previousMonth: number
	trend: 'up' | 'down' | 'stable'
	percentage: number
	impact: 'positive' | 'negative' | 'neutral'
}

interface FinancialTrendsProps {
	period: 'month' | 'quarter' | 'year'
}

export function FinancialTrends({ period: _ }: FinancialTrendsProps) {
	const { expenses, monthlyIncome, budgetCategories, historicalData } = useFinanceStore()

	const trendAnalysis = useMemo(() => {
		if (!historicalData) {
			return {
				trends: [],
				overallSavingsRate: 0,
				projectedSavings: 0,
				riskScore: 0
			}
		}

		const currentDate = new Date()
		const currentMonth = currentDate.getMonth() + 1
		const currentYear = currentDate.getFullYear()

		// Calculate previous period data
		const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1
		const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear

		// Get current period data
		const currentIncome = historicalData.income
			.filter(income => income.month === currentMonth && income.year === currentYear)
			.reduce((sum, income) => sum + income.amount, 0)

		const currentExpenses = historicalData.expenses
			.filter(expense => expense.month === currentMonth && expense.year === currentYear)
			.reduce((sum, expense) => sum + expense.amount, 0)

		// Get previous period data
		const previousIncome = historicalData.income
			.filter(income => income.month === previousMonth && income.year === previousYear)
			.reduce((sum, income) => sum + income.amount, 0)

		const previousExpenses = historicalData.expenses
			.filter(expense => expense.month === previousMonth && expense.year === previousYear)
			.reduce((sum, expense) => sum + expense.amount, 0)

		// Calculate category trends
		const categoryTrends: TrendData[] = budgetCategories.map(category => {
			const currentCategoryExpenses = historicalData.expenses
				.filter(expense => 
					expense.category === category.name && 
					expense.month === currentMonth && 
					expense.year === currentYear
				)
				.reduce((sum, expense) => sum + expense.amount, 0)

			const previousCategoryExpenses = historicalData.expenses
				.filter(expense => 
					expense.category === category.name && 
					expense.month === previousMonth && 
					expense.year === previousYear
				)
				.reduce((sum, expense) => sum + expense.amount, 0)

			const difference = currentCategoryExpenses - previousCategoryExpenses
			const percentageChange = previousCategoryExpenses > 0 
				? (difference / previousCategoryExpenses) * 100 
				: currentCategoryExpenses > 0 ? 100 : 0

			let trend: 'up' | 'down' | 'stable' = 'stable'
			let impact: 'positive' | 'negative' | 'neutral' = 'neutral'

			if (Math.abs(percentageChange) > 5) {
				trend = percentageChange > 0 ? 'up' : 'down'
				// For expenses, up is generally negative, down is positive
				impact = percentageChange > 0 ? 'negative' : 'positive'
			}

			return {
				category: category.name,
				currentMonth: currentCategoryExpenses,
				previousMonth: previousCategoryExpenses,
				trend,
				percentage: Math.abs(percentageChange),
				impact
			}
		})

		// Calculate overall savings rate trend
		const currentSavingsRate = currentIncome > 0 ? ((currentIncome - currentExpenses) / currentIncome) * 100 : 0
		const previousSavingsRate = previousIncome > 0 ? ((previousIncome - previousExpenses) / previousIncome) * 100 : 0

		// Project next month savings based on trend
		const savingsRateTrend = currentSavingsRate - previousSavingsRate
		const projectedSavingsRate = currentSavingsRate + savingsRateTrend
		const projectedSavings = currentIncome * (projectedSavingsRate / 100)

		// Calculate financial risk score (0-100, lower is better)
		const expenseVolatility = categoryTrends.reduce((sum, trend) => sum + trend.percentage, 0) / categoryTrends.length
		const savingsRateVolatility = Math.abs(savingsRateTrend)
		const budgetUtilization = budgetCategories.reduce((sum, category) => {
			const spent = expenses.filter(e => e.category === category.name).reduce((s, e) => s + e.amount, 0)
			return sum + (spent / category.allocation) * 100
		}, 0) / budgetCategories.length

		const riskScore = Math.min(100, (expenseVolatility + savingsRateVolatility + Math.max(0, budgetUtilization - 80)) / 3)

		return {
			trends: categoryTrends.sort((a, b) => b.percentage - a.percentage),
			overallSavingsRate: currentSavingsRate,
			projectedSavings,
			riskScore
		}
	}, [expenses, monthlyIncome, budgetCategories, historicalData])

	if (!historicalData) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						Financial Trends
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8 text-gray-500">
						<Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
						<p>Historical data needed for trend analysis</p>
						<p className="text-sm">Switch to Quarter or Year view to see trends</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	const getRiskColor = (score: number) => {
		if (score < 30) return 'text-green-600'
		if (score < 60) return 'text-yellow-600'
		return 'text-red-600'
	}

	const getRiskLabel = (score: number) => {
		if (score < 30) return 'Low Risk'
		if (score < 60) return 'Medium Risk'
		return 'High Risk'
	}

	return (
		<div className="space-y-6">
			{/* Overall Financial Health */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5" />
						Financial Health Overview
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">
								{formatPercentage(trendAnalysis.overallSavingsRate)}
							</div>
							<div className="text-sm text-gray-600">Current Savings Rate</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-600">
								{formatCurrency(trendAnalysis.projectedSavings)}
							</div>
							<div className="text-sm text-gray-600">Projected Monthly Savings</div>
						</div>
						<div className="text-center">
							<div className={`text-2xl font-bold ${getRiskColor(trendAnalysis.riskScore)}`}>
								{trendAnalysis.riskScore.toFixed(0)}%
							</div>
							<div className="text-sm text-gray-600">
								<Badge variant={trendAnalysis.riskScore < 30 ? 'default' : trendAnalysis.riskScore < 60 ? 'secondary' : 'destructive'}>
									{getRiskLabel(trendAnalysis.riskScore)}
								</Badge>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Category Trends */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						Category Spending Trends
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{trendAnalysis.trends.map((trend) => (
							<div key={trend.category} className="flex items-center justify-between p-3 border rounded-lg">
								<div className="flex items-center gap-3">
									{trend.trend === 'up' ? (
										<TrendingUp className={`h-4 w-4 ${trend.impact === 'negative' ? 'text-red-500' : 'text-green-500'}`} />
									) : trend.trend === 'down' ? (
										<TrendingDown className={`h-4 w-4 ${trend.impact === 'positive' ? 'text-green-500' : 'text-red-500'}`} />
									) : (
										<div className="h-4 w-4 bg-gray-300 rounded-full" />
									)}
									<div>
										<div className="font-medium">{trend.category}</div>
										<div className="text-sm text-gray-600">
											{formatCurrency(trend.currentMonth)} this month
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className={`font-medium ${
										trend.impact === 'positive' ? 'text-green-600' : 
										trend.impact === 'negative' ? 'text-red-600' : 'text-gray-600'
									}`}>
										{trend.trend === 'up' ? '+' : trend.trend === 'down' ? '-' : ''}
										{formatPercentage(trend.percentage)}
									</div>
									<div className="text-sm text-gray-500">
										vs last month
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

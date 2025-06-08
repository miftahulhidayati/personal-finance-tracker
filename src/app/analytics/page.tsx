'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
	TrendingUp, 
	TrendingDown, 
	Target, 
	BarChart3,
	PieChart,
	LineChart,
	DollarSign,
	Lightbulb,
	Info,
	RefreshCw,
	Download
} from 'lucide-react'
import { useFinanceStore } from '@/stores/finance-store'
import { 
	IncomeVsExpensesChart,
	CategorySpendingBreakdown,
	CashflowTrendChart,
	BudgetAllocationChart,
	OverUnderAllocationTracker
} from '@/components/charts/analytics-charts'
import { SmartRecommendations } from '@/components/analytics/smart-recommendations'
import { FinancialHealthScores } from '@/components/analytics/financial-health-scores'
import { GoalProgress } from '@/components/analytics/goal-progress'
import { DataSummary } from '@/components/analytics/data-summary'
import { FinancialTrends } from '@/components/analytics/financial-trends'
import { formatCurrency, formatPercentage } from '@/utils/formatters'

type AnalyticsPeriod = 'month' | 'quarter' | 'year'
type AnalyticsTab = 'charts' | 'budget' | 'insights' | 'goals'

export default function AnalyticsPage() {
	const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>('month')
	const [activeTab, setActiveTab] = useState<AnalyticsTab>('charts')
	const [isDemoMode, setIsDemoMode] = useState(false)
	const [isLoadingHistorical, setIsLoadingHistorical] = useState(false)
	const { 
		expenses, 
		monthlyIncome, 
		budgetCategories,
		historicalData,
		loadHistoricalData,
		exportData
	} = useFinanceStore()

	// Check if we're in demo mode (no real Google Sheets connection)
	useEffect(() => {
		const spreadsheetId = process.env.NEXT_PUBLIC_SPREADSHEET_ID
		const isDemo = !spreadsheetId || spreadsheetId === '1234567890abcdef1234567890abcdef12345678'
		setIsDemoMode(isDemo)
	}, [])

	// Load historical data for analytics when component mounts or period changes
	useEffect(() => {
		if (selectedPeriod !== 'month' && !historicalData) {
			setIsLoadingHistorical(true)
			loadHistoricalData().finally(() => {
				setIsLoadingHistorical(false)
			})
		}
	}, [historicalData, loadHistoricalData, selectedPeriod])

	// Calculate analytics data
	const analyticsData = useMemo(() => {
		// Determine which data to use based on period and historical data availability
		let incomeToAnalyze = monthlyIncome
		let expensesToAnalyze = expenses
		
		if (historicalData && selectedPeriod !== 'month') {
			const currentDate = new Date()
			const monthsToInclude = selectedPeriod === 'quarter' ? 3 : selectedPeriod === 'year' ? 12 : 1
			
			// Filter historical data based on period
			incomeToAnalyze = historicalData.income.filter(income => {
				const incomeDate = new Date(income.year, income.month - 1)
				const cutoffDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsToInclude + 1)
				return incomeDate >= cutoffDate
			})
			
			expensesToAnalyze = historicalData.expenses.filter(expense => {
				const expenseDate = new Date(expense.year, expense.month - 1)
				const cutoffDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsToInclude + 1)
				return expenseDate >= cutoffDate
			})
		}
		
		const totalIncome = incomeToAnalyze.reduce((sum, income) => sum + income.amount, 0)
		const totalExpenses = expensesToAnalyze.reduce((sum, expense) => sum + expense.amount, 0)
		const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
		
		// Calculate top spending categories
		const categoryTotals = expensesToAnalyze.reduce((acc, expense) => {
			const category = budgetCategories.find(cat => cat.name === expense.category)
			const categoryName = category?.name || expense.category || 'Lainnya'
			acc[categoryName] = (acc[categoryName] || 0) + expense.amount
			return acc
		}, {} as Record<string, number>)

		const topCategories = Object.entries(categoryTotals)
			.map(([name, amount]) => ({ 
				categoryId: name,
				name, 
				amount,
				percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
			}))
			.sort((a, b) => b.amount - a.amount)
			.slice(0, 3)
		
		return {
			totalIncome,
			totalExpenses,
			netIncome: totalIncome - totalExpenses,
			savingsRate,
			topCategories
		}
	}, [expenses, monthlyIncome, budgetCategories, historicalData, selectedPeriod])

	// Period options with better labels
	const periods = [
		{ id: 'month' as const, label: 'Bulan Ini', shortLabel: 'Month' },
		{ id: 'quarter' as const, label: 'Kuartal', shortLabel: 'Quarter' },
		{ id: 'year' as const, label: 'Tahun Ini', shortLabel: 'Year' }
	]

	// Tab configuration with icons
	const tabs = [
		{ id: 'charts' as const, label: 'Charts & Visualizations', icon: BarChart3 },
		{ id: 'budget' as const, label: 'Budget Analysis', icon: PieChart },
		{ id: 'insights' as const, label: 'Smart Insights', icon: Lightbulb },
		{ id: 'goals' as const, label: 'Goal Progress', icon: Target }
	]

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Demo Mode Banner */}
			{isDemoMode && (
				<Card className="border-blue-200 bg-blue-50">
					<CardContent className="flex items-center gap-3 p-4">
						<Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
						<div className="flex-1">
							<h4 className="font-medium text-blue-900">Demo Mode Active</h4>
							<p className="text-sm text-blue-700">
								You're viewing sample data. To connect your Google Sheets, configure the API credentials in your <code className="bg-blue-100 px-1 rounded">.env.local</code> file.
							</p>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
					<p className="text-gray-600 mt-1">
						Analisis mendalam keuangan Anda untuk keputusan yang lebih baik
					</p>
				</div>
				
				{/* Period Selector & Actions */}
				<div className="flex gap-2">
					<Button
						variant="secondary"
						size="sm"
						onClick={() => {
							try {
								exportData(selectedPeriod)
							} catch (error) {
								console.error('Export error:', error)
							}
						}}
						className="flex items-center gap-2"
					>
						<Download className="h-4 w-4" />
						Export Data
					</Button>
					<Button
						variant="secondary"
						size="sm"
						onClick={() => {
							setIsLoadingHistorical(true)
							loadHistoricalData().finally(() => {
								setIsLoadingHistorical(false)
							})
						}}
						disabled={isLoadingHistorical}
						className="flex items-center gap-2"
					>
						<RefreshCw className={`h-4 w-4 ${isLoadingHistorical ? 'animate-spin' : ''}`} />
						Refresh
					</Button>
					{periods.map((period) => (
						<Button
							key={period.id}
							variant={selectedPeriod === period.id ? 'primary' : 'secondary'}
							size="sm"
							onClick={() => setSelectedPeriod(period.id)}
							className={selectedPeriod === period.id ? 'bg-[#c6ef4e] text-black hover:bg-[#b8e63f]' : ''}
						>
							{period.shortLabel}
						</Button>
					))}
				</div>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Total Pemasukan</p>
								<p className="text-2xl font-bold text-green-600">
									{formatCurrency(analyticsData.totalIncome)}
								</p>
							</div>
							<TrendingUp className="h-8 w-8 text-green-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Total Pengeluaran</p>
								<p className="text-2xl font-bold text-red-600">
									{formatCurrency(analyticsData.totalExpenses)}
								</p>
							</div>
							<TrendingDown className="h-8 w-8 text-red-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Net Income</p>
								<p className={`text-2xl font-bold ${analyticsData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
									{formatCurrency(analyticsData.netIncome)}
								</p>
							</div>
							<DollarSign className="h-8 w-8 text-blue-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Savings Rate</p>
								<p className={`text-2xl font-bold ${analyticsData.savingsRate >= 15 ? 'text-green-600' : analyticsData.savingsRate >= 8 ? 'text-yellow-600' : 'text-red-600'}`}>
									{formatPercentage(analyticsData.savingsRate)}
								</p>
							</div>
							<Target className="h-8 w-8 text-purple-600" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Historical Data Status */}
			{(isLoadingHistorical || historicalData) && (
				<Card className="border-gray-200 bg-gray-50">
					<CardContent className="flex items-center gap-3 p-3">
						{isLoadingHistorical ? (
							<>
								<div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
								<span className="text-sm text-gray-700">Loading historical data for enhanced analytics...</span>
							</>
						) : (
							<>
								<div className="w-4 h-4 bg-green-500 rounded-full"></div>
								<span className="text-sm text-gray-700">
									Historical data loaded • Showing {selectedPeriod === 'quarter' ? '3-month' : selectedPeriod === 'year' ? '12-month' : 'current month'} analytics
								</span>
							</>
						)}
					</CardContent>
				</Card>
			)}

			{/* Navigation Tabs */}
			<div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
				{tabs.map((tab) => {
					const Icon = tab.icon
					return (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
								activeTab === tab.id
									? 'bg-white shadow-sm text-black'
									: 'text-gray-600 hover:text-gray-900'
							}`}
						>
							<Icon className="h-4 w-4" />
							{tab.label}
						</button>
					)
				})}
			</div>

			{/* Tab Content */}
			<div className="space-y-6">
				{activeTab === 'charts' && (
					<>
						{/* Data Summary */}
						<DataSummary 
							period={selectedPeriod}
							historicalData={historicalData}
							currentData={{
								totalIncome: analyticsData.totalIncome,
								totalExpenses: analyticsData.totalExpenses
							}}
						/>

						{/* Income vs Expenses */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<LineChart className="h-5 w-5" />
										Income vs Expenses
									</CardTitle>
								</CardHeader>
								<CardContent>
									<IncomeVsExpensesChart period={selectedPeriod} />
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<PieChart className="h-5 w-5" />
										Category Spending Breakdown
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CategorySpendingBreakdown period={selectedPeriod} />
								</CardContent>
							</Card>
						</div>

						{/* Cashflow Trend */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<BarChart3 className="h-5 w-5" />
									Cashflow Trend
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CashflowTrendChart period={selectedPeriod} />
							</CardContent>
						</Card>

						{/* Top Spending Categories */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<span>Top 3 Spending Categories</span>
									<Badge variant="secondary" className="bg-[#c6ef4e] text-black">
										{formatCurrency(analyticsData.topCategories.reduce((sum, cat) => sum + cat.amount, 0))} Total
									</Badge>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{analyticsData.topCategories.length === 0 ? (
										<div className="text-center py-8 text-gray-500">
											<PieChart className="h-12 w-12 mx-auto mb-4" />
											<p>Belum ada data pengeluaran</p>
										</div>
									) : (
										analyticsData.topCategories.map((category, index) => {
											const isHighSpending = category.percentage > 30
											const budget = budgetCategories.find(b => b.name === category.name)
											const isOverBudget = budget && category.amount > budget.allocation
											
											return (
												<div key={category.categoryId} className="space-y-2">
													<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-[#c6ef4e]">
														<div className="flex items-center gap-3">
															<Badge 
																variant="secondary" 
																className={`${index === 0 ? 'bg-yellow-100 border-yellow-300' : index === 1 ? 'bg-gray-100 border-gray-300' : 'bg-orange-100 border-orange-300'}`}
															>
																#{index + 1}
															</Badge>
															<div>
																<span className="font-medium text-lg">{category.name}</span>
																{budget && (
																	<p className="text-sm text-gray-500">
																		Budget: {formatCurrency(budget.allocation)}
																		{isOverBudget && (
																			<span className="text-red-600 ml-2">
																				(Over {formatCurrency(category.amount - budget.allocation)})
																			</span>
																		)}
																	</p>
																)}
															</div>
														</div>
														<div className="text-right">
															<span className="text-xl font-bold">{formatCurrency(category.amount)}</span>
															<p className={`text-sm ${isHighSpending ? 'text-red-600' : 'text-gray-500'}`}>
																{formatPercentage(category.percentage)} dari total
															</p>
														</div>
													</div>
													
													{/* Progress bar showing budget vs actual */}
													{budget && (
														<div className="px-4">
															<div className="flex justify-between text-xs text-gray-500 mb-1">
																<span>Budget Usage</span>
																<span>{formatPercentage((category.amount / budget.allocation) * 100)}</span>
															</div>
															<div className="w-full bg-gray-200 rounded-full h-2">
																<div 
																	className={`h-2 rounded-full transition-all ${
																		category.amount > budget.allocation 
																			? 'bg-red-500' 
																			: category.amount > budget.allocation * 0.8 
																				? 'bg-yellow-500' 
																				: 'bg-[#c6ef4e]'
																	}`}
																	style={{ width: `${Math.min((category.amount / budget.allocation) * 100, 100)}%` }}
																></div>
															</div>
															{isOverBudget && (
																<p className="text-xs text-red-600 mt-1">
																	⚠️ Melebihi budget sebesar {formatPercentage(((category.amount - budget.allocation) / budget.allocation) * 100)}
																</p>
															)}
														</div>
													)}
													
													{/* Quick insights */}
													<div className="px-4">
														{isHighSpending && (
															<div className="flex items-center gap-2 text-orange-600 text-sm">
																<Target className="h-4 w-4" />
																<span>Kategori ini menghabiskan lebih dari 30% total pengeluaran</span>
															</div>
														)}
													</div>
												</div>
											)
										})
									)}
								</div>
							</CardContent>
						</Card>
					</>
				)}

				{activeTab === 'budget' && (
					<>
						{/* Budget Allocation */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Card>
								<CardHeader>
									<CardTitle>Budget Allocation Efficiency</CardTitle>
								</CardHeader>
								<CardContent>
									<BudgetAllocationChart period={selectedPeriod} />
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Over/Under Allocation Tracker</CardTitle>
								</CardHeader>
								<CardContent>
									<OverUnderAllocationTracker period={selectedPeriod} />
								</CardContent>
							</Card>
						</div>
					</>
				)}

				{activeTab === 'insights' && (
					<>
						<FinancialTrends period={selectedPeriod} />
						<SmartRecommendations />
						<FinancialHealthScores />
					</>
				)}

				{activeTab === 'goals' && (
					<>
						<GoalProgress />
					</>
				)}
			</div>
		</div>
	)
}

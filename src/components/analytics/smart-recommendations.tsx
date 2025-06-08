'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
	AlertTriangle, 
	Lightbulb,
	CheckCircle,
	XCircle,
	Info
} from 'lucide-react'
import { useFinanceStore } from '@/stores/finance-store'
import { formatPercentage } from '@/utils/formatters'

interface Recommendation {
	id: string
	type: 'warning' | 'success' | 'info' | 'danger'
	category: string
	title: string
	message: string
	action?: string
	actionLabel?: string
	impact: 'high' | 'medium' | 'low'
	value?: number
}

export function SmartRecommendations() {
	const { expenses, monthlyIncome, budgetCategories } = useFinanceStore()

	const recommendations = useMemo(() => {
		const totalIncome = monthlyIncome.reduce((sum, income) => sum + income.amount, 0)
		const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
		const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

		const recs: Recommendation[] = []

		// Advanced spending pattern analysis
		const recentExpenses = expenses.slice(-30) // Last 30 transactions
		const expensesByDay = recentExpenses.reduce((acc, expense) => {
			const date = new Date(expense.date).toDateString()
			acc[date] = (acc[date] || 0) + expense.amount
			return acc
		}, {} as Record<string, number>)

		// Calculate daily spending variance
		const dailySpending = Object.values(expensesByDay)
		const avgDailySpending = dailySpending.reduce((sum, amount) => sum + amount, 0) / dailySpending.length

		// Detect spending spikes
		const recentHighSpending = dailySpending.filter(amount => amount > avgDailySpending * 2).length
		if (recentHighSpending > 2) {
			recs.push({
				id: 'spending-spikes',
				type: 'warning',
				category: 'Spending Patterns',
				title: 'Unusual Spending Spikes Detected',
				message: `You've had ${recentHighSpending} days with spending significantly above average. Consider reviewing recent purchases.`,
				impact: 'medium',
				value: recentHighSpending
			})
		}

		// Weekend vs weekday spending analysis
		const weekendExpenses = expenses.filter(expense => {
			const day = new Date(expense.date).getDay()
			return day === 0 || day === 6 // Sunday or Saturday
		})
		
		const weekendSpendingTotal = weekendExpenses.reduce((sum, expense) => sum + expense.amount, 0)
		const weekendRatio = totalExpenses > 0 ? (weekendSpendingTotal / totalExpenses) * 100 : 0

		if (weekendRatio > 40) {
			recs.push({
				id: 'weekend-spending',
				type: 'info',
				category: 'Spending Habits',
				title: 'High Weekend Spending',
				message: `${formatPercentage(weekendRatio)}% of your spending occurs on weekends. Consider planning weekend activities with a budget.`,
				impact: 'medium',
				value: weekendRatio
			})
		}

		// Calculate category spending
		const categorySpending = expenses.reduce((acc, expense) => {
			acc[expense.category] = (acc[expense.category] || 0) + expense.amount
			return acc
		}, {} as Record<string, number>)

		// AI-powered budget optimization suggestions
		const underutilizedCategories = budgetCategories.filter(category => {
			const spent = categorySpending[category.name] || 0
			const utilization = category.allocation > 0 ? (spent / category.allocation) * 100 : 0
			return utilization < 50 && category.allocation > 100000 // Significant budget with low utilization
		})

		if (underutilizedCategories.length > 0) {
			const totalUnused = underutilizedCategories.reduce((sum, category) => {
				const spent = categorySpending[category.name] || 0
				return sum + (category.allocation - spent)
			}, 0)

			recs.push({
				id: 'budget-reallocation',
				type: 'success',
				category: 'Budget Optimization',
				title: 'Budget Reallocation Opportunity',
				message: `You have significant unused budget in ${underutilizedCategories.length} categories. Consider reallocating this budget to high-priority goals.`,
				impact: 'high',
				value: totalUnused
			})
		}

		// Analyze each category
		budgetCategories.forEach(category => {
			const spent = categorySpending[category.name] || 0
			const budgeted = category.allocation
			const variance = spent - budgeted

			if (variance > budgeted * 0.15) {
				recs.push({
					id: `overspent-${category.id}`,
					type: 'warning',
					category: category.name,
					title: `Overspending di ${category.name}`,
					message: `Anda telah menghabiskan ${formatPercentage((spent / budgeted) * 100)} dari anggaran ${category.name}. Pertimbangkan untuk mengurangi pengeluaran kategori ini.`,
					impact: 'high',
					value: variance
				})
			}

			// Check for food spending specifically
			if (category.name.toLowerCase().includes('makan') || category.name.toLowerCase().includes('food')) {
				const lastMonthSpent = spent // This should be actual last month data
				const currentSpent = spent
				const increase = ((currentSpent - lastMonthSpent) / lastMonthSpent) * 100

				if (increase > 15) {
					recs.push({
						id: `food-increase-${category.id}`,
						type: 'warning',
						category: 'Food',
						title: 'Peningkatan Pengeluaran Makanan',
						message: `Anda menghabiskan ${formatPercentage(increase)} lebih banyak untuk makanan bulan ini dibanding bulan lalu — pertimbangkan untuk menetapkan batas yang lebih ketat.`,
						impact: 'medium',
						value: increase
					})
				}
			}

			// Check for entertainment spending
			if (category.name.toLowerCase().includes('hiburan') || category.name.toLowerCase().includes('entertainment')) {
				const entertainmentPercentage = totalIncome > 0 ? (spent / totalIncome) * 100 : 0
				if (entertainmentPercentage > 15) {
					recs.push({
						id: `entertainment-high-${category.id}`,
						type: 'danger',
						category: 'Entertainment',
						title: 'Pengeluaran Hiburan Terlalu Tinggi',
						message: `Pengeluaran hiburan Anda adalah ${formatPercentage(entertainmentPercentage)} dari penghasilan. Maksimal yang disarankan: 15%.`,
						action: 'reduce-entertainment',
						actionLabel: 'Buat Rencana Pengurangan',
						impact: 'high',
						value: entertainmentPercentage
					})
				}
			}
		})

		// Savings rate recommendations
		if (savingsRate < 8) {
			recs.push({
				id: 'low-savings-rate',
				type: 'danger',
				category: 'Savings',
				title: 'Tingkat Tabungan Rendah',
				message: `Tingkat tabungan Anda saat ini ${formatPercentage(savingsRate)}. Tingkatkan menjadi 15% untuk pertumbuhan jangka panjang yang lebih baik.`,
				action: 'increase-savings',
				actionLabel: 'Buat Rencana Tabungan',
				impact: 'high',
				value: savingsRate
			})
		} else if (savingsRate >= 15) {
			recs.push({
				id: 'good-savings-rate',
				type: 'success',
				category: 'Savings',
				title: 'Tingkat Tabungan Excellent!',
				message: `Selamat! Tingkat tabungan Anda ${formatPercentage(savingsRate)} sudah melebihi target 15%. Pertahankan kebiasaan baik ini.`,
				impact: 'low',
				value: savingsRate
			})
		} else {
			recs.push({
				id: 'moderate-savings-rate',
				type: 'info',
				category: 'Savings',
				title: 'Tingkat Tabungan Baik',
				message: `Tingkat tabungan Anda ${formatPercentage(savingsRate)} sudah cukup baik. Coba tingkatkan sedikit lagi menuju target 15%.`,
				impact: 'medium',
				value: savingsRate
			})
		}

		// Emergency fund recommendation
		const liquidAssets = 5000000 // This should come from actual asset calculations
		const monthlyExpenses = totalExpenses
		const emergencyFundMonths = monthlyExpenses > 0 ? liquidAssets / monthlyExpenses : 0

		if (emergencyFundMonths < 3) {
			recs.push({
				id: 'emergency-fund-low',
				type: 'warning',
				category: 'Emergency Fund',
				title: 'Dana Darurat Kurang',
				message: `Dana darurat Anda hanya cukup untuk ${emergencyFundMonths.toFixed(1)} bulan. Target minimum: 3-6 bulan pengeluaran.`,
				action: 'build-emergency-fund',
				actionLabel: 'Mulai Dana Darurat',
				impact: 'high',
				value: emergencyFundMonths
			})
		} else if (emergencyFundMonths >= 6) {
			recs.push({
				id: 'emergency-fund-excellent',
				type: 'success',
				category: 'Emergency Fund',
				title: 'Dana Darurat Excellent!',
				message: `Dana darurat Anda cukup untuk ${emergencyFundMonths.toFixed(1)} bulan. Anda memiliki proteksi finansial yang sangat baik.`,
				impact: 'low',
				value: emergencyFundMonths
			})
		}

		// Debt-to-income analysis
		const debtPayments = expenses.filter(expense => 
			expense.category.toLowerCase().includes('loan') || 
			expense.category.toLowerCase().includes('debt') ||
			expense.category.toLowerCase().includes('credit')
		).reduce((sum, expense) => sum + expense.amount, 0)
		
		const debtToIncomeRatio = totalIncome > 0 ? (debtPayments / totalIncome) * 100 : 0

		if (debtToIncomeRatio > 36) {
			recs.push({
				id: 'high-debt-ratio',
				type: 'danger',
				category: 'Debt Management',
				title: 'Rasio Utang Terlalu Tinggi',
				message: `Rasio utang terhadap pendapatan Anda ${formatPercentage(debtToIncomeRatio)} melebihi batas aman 36%. Prioritaskan pelunasan utang.`,
				action: 'debt-payoff-plan',
				actionLabel: 'Buat Rencana Pelunasan',
				impact: 'high',
				value: debtToIncomeRatio
			})
		}

		// Investment recommendations
		if (savingsRate >= 15 && emergencyFundMonths >= 3) {
			recs.push({
				id: 'investment-opportunity',
				type: 'info',
				category: 'Investment',
				title: 'Siap Untuk Investasi',
				message: 'Dengan tabungan yang solid dan dana darurat yang memadai, Anda siap mengalokasikan dana untuk investasi jangka panjang.',
				action: 'start-investing',
				actionLabel: 'Mulai Investasi',
				impact: 'medium'
			})
		}

		// Monthly income trend analysis
		const recentIncomeGrowth = monthlyIncome.length >= 2 ? 
			((monthlyIncome[monthlyIncome.length - 1]?.amount || 0) - (monthlyIncome[monthlyIncome.length - 2]?.amount || 0)) / (monthlyIncome[monthlyIncome.length - 2]?.amount || 1) * 100 : 0

		if (recentIncomeGrowth > 10) {
			recs.push({
				id: 'income-growth',
				type: 'success',
				category: 'Income',
				title: 'Pertumbuhan Pendapatan Bagus!',
				message: `Pendapatan Anda tumbuh ${formatPercentage(recentIncomeGrowth)} bulan ini. Pertimbangkan untuk meningkatkan alokasi tabungan.`,
				action: 'increase-savings-allocation',
				actionLabel: 'Tingkatkan Alokasi',
				impact: 'low',
				value: recentIncomeGrowth
			})
		}

		// Goal-based recommendations
		const currentAge = 30 // This should come from user profile
		const retirementAge = 55
		const yearsToRetirement = retirementAge - currentAge
		const monthlyRetirementNeeds = totalExpenses * 0.8 // 80% of current expenses
		const requiredRetirementFund = monthlyRetirementNeeds * 12 * 20 // 20 years of retirement
		const currentRetirementSavings = 100000000 // This should come from actual data
		const monthlyRetirementSaving = (requiredRetirementFund - currentRetirementSavings) / (yearsToRetirement * 12)

		if (monthlyRetirementSaving > totalIncome * 0.15) {
			recs.push({
				id: 'retirement-planning',
				type: 'warning',
				category: 'Retirement Planning',
				title: 'Persiapan Pensiun Perlu Perhatian',
				message: `Untuk pensiun di usia ${retirementAge}, Anda perlu menabung lebih agresif atau mempertimbangkan untuk memperpanjang masa kerja.`,
				action: 'retirement-calculator',
				actionLabel: 'Hitung Kebutuhan Pensiun',
				impact: 'high',
				value: monthlyRetirementSaving
			})
		}

		// Subscription analysis
		const subscriptionExpenses = expenses.filter(expense => 
			expense.description?.toLowerCase().includes('subscription') ||
			expense.description?.toLowerCase().includes('langganan') ||
			expense.description?.toLowerCase().includes('netflix') ||
			expense.description?.toLowerCase().includes('spotify')
		)

		if (subscriptionExpenses.length > 5) {
			const totalSubscriptions = subscriptionExpenses.reduce((sum, expense) => sum + expense.amount, 0)
			recs.push({
				id: 'subscription-audit',
				type: 'info',
				category: 'Subscriptions',
				title: 'Audit Langganan Diperlukan',
				message: `Anda memiliki ${subscriptionExpenses.length} langganan dengan total Rp ${totalSubscriptions.toLocaleString('id-ID')}/bulan. Tinjau mana yang masih digunakan.`,
				action: 'subscription-audit',
				actionLabel: 'Audit Langganan',
				impact: 'medium',
				value: totalSubscriptions
			})
		}

		return recs.sort((a, b) => {
			const impactOrder = { high: 3, medium: 2, low: 1 }
			return impactOrder[b.impact] - impactOrder[a.impact]
		})
	}, [expenses, monthlyIncome, budgetCategories])

	const getIcon = (type: Recommendation['type']) => {
		switch (type) {
			case 'warning': return AlertTriangle
			case 'danger': return XCircle
			case 'success': return CheckCircle
			case 'info': return Info
			default: return Lightbulb
		}
	}

	const getColorClass = (type: Recommendation['type']) => {
		switch (type) {
			case 'warning': return 'border-yellow-200 bg-yellow-50'
			case 'danger': return 'border-red-200 bg-red-50'
			case 'success': return 'border-green-200 bg-green-50'
			case 'info': return 'border-blue-200 bg-blue-50'
			default: return 'border-gray-200 bg-gray-50'
		}
	}

	const getIconColor = (type: Recommendation['type']) => {
		switch (type) {
			case 'warning': return 'text-yellow-600'
			case 'danger': return 'text-red-600'
			case 'success': return 'text-green-600'
			case 'info': return 'text-blue-600'
			default: return 'text-gray-600'
		}
	}

	const getBadgeVariant = (impact: Recommendation['impact']) => {
		switch (impact) {
			case 'high': return 'destructive'
			case 'medium': return 'secondary'
			case 'low': return 'outline'
			default: return 'outline'
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Lightbulb className="h-5 w-5 text-yellow-600" />
					Smart Recommendations
				</CardTitle>
				<p className="text-sm text-gray-600">
					Rekomendasi berdasarkan analisis pola pengeluaran Anda
				</p>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{recommendations.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
							<p className="text-lg font-medium">Semua terlihat baik!</p>
							<p className="text-sm">Tidak ada rekomendasi khusus saat ini.</p>
						</div>
					) : (
						recommendations.map((rec) => {
							const Icon = getIcon(rec.type)
							return (
								<div
									key={rec.id}
									className={`p-4 rounded-lg border-2 ${getColorClass(rec.type)}`}
								>
									<div className="flex items-start gap-3">
										<Icon className={`h-5 w-5 mt-0.5 ${getIconColor(rec.type)}`} />
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<h4 className="font-semibold text-gray-900">{rec.title}</h4>
												<Badge variant={getBadgeVariant(rec.impact)} className="text-xs">
													{rec.impact.toUpperCase()}
												</Badge>
											</div>
											<p className="text-gray-700 mb-3">{rec.message}</p>
											{rec.action && (
												<Button 
													size="sm" 
													variant="secondary"
													className="bg-white hover:bg-gray-50"
												>
													{rec.actionLabel}
												</Button>
											)}
										</div>
									</div>
								</div>
							)
						})
					)}
				</div>
			</CardContent>
		</Card>
	)
}

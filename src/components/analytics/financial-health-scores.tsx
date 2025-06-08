'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
	Shield, 
	TrendingUp, 
	Wallet,
	AlertCircle,
	CheckCircle,
	Heart
} from 'lucide-react'
import { useFinanceStore } from '@/stores/finance-store'
import { formatPercentage } from '@/utils/formatters'

interface HealthScore {
	name: string
	score: number
	maxScore: number
	status: 'excellent' | 'good' | 'fair' | 'poor'
	description: string
	recommendation?: string
	icon: React.ComponentType<any>
}

interface CategoryScore {
	category: string
	score: number
	maxScore: number
	status: 'good' | 'warning' | 'danger'
	color: string
}

export function FinancialHealthScores() {
	const { expenses, monthlyIncome, budgetCategories, assets } = useFinanceStore()

	const healthScores = useMemo(() => {
		const totalIncome = monthlyIncome.reduce((sum, income) => sum + income.amount, 0)
		const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
		const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

		// Calculate liquid assets (mock data - should come from actual assets)
		const liquidAssets = 15000000 // This should come from actual liquid asset calculations
		const emergencyFundMonths = totalExpenses > 0 ? liquidAssets / totalExpenses : 0

		// Calculate debt-to-income ratio (mock data)
		const totalDebt = 5000000 // This should come from actual debt calculations
		const debtToIncomeRatio = totalIncome > 0 ? (totalDebt / totalIncome) * 100 : 0

		const scores: HealthScore[] = [
			{
				name: 'Savings Rate',
				score: Math.min(savingsRate, 30), // Cap at 30% for scoring
				maxScore: 30,
				status: savingsRate >= 20 ? 'excellent' : savingsRate >= 15 ? 'good' : savingsRate >= 8 ? 'fair' : 'poor',
				description: `Anda menyimpan ${formatPercentage(savingsRate)} dari penghasilan bulanan`,
				recommendation: savingsRate < 15 ? 'Tingkatkan tabungan hingga minimal 15% dari penghasilan' : 'Pertahankan tingkat tabungan yang baik',
				icon: TrendingUp
			},
			{
				name: 'Emergency Fund',
				score: Math.min(emergencyFundMonths * 10, 60), // 6 months = max score of 60
				maxScore: 60,
				status: emergencyFundMonths >= 6 ? 'excellent' : emergencyFundMonths >= 3 ? 'good' : emergencyFundMonths >= 1 ? 'fair' : 'poor',
				description: `Dana darurat Anda cukup untuk ${emergencyFundMonths.toFixed(1)} bulan`,
				recommendation: emergencyFundMonths < 6 ? 'Kumpulkan dana darurat minimal 6 bulan pengeluaran' : 'Dana darurat Anda sudah memadai',
				icon: Shield
			},
			{
				name: 'Debt-to-Income',
				score: Math.max(0, 100 - debtToIncomeRatio), // Lower debt = higher score
				maxScore: 100,
				status: debtToIncomeRatio <= 20 ? 'excellent' : debtToIncomeRatio <= 36 ? 'good' : debtToIncomeRatio <= 50 ? 'fair' : 'poor',
				description: `Rasio utang terhadap penghasilan: ${formatPercentage(debtToIncomeRatio)}`,
				recommendation: debtToIncomeRatio > 36 ? 'Kurangi utang hingga di bawah 36% dari penghasilan' : 'Rasio utang Anda dalam batas yang baik',
				icon: Wallet
			}
		]

		return scores
	}, [expenses, monthlyIncome, assets])

	const categoryScores = useMemo(() => {
		const totalIncome = monthlyIncome.reduce((sum, income) => sum + income.amount, 0)
		
		const categorySpending = expenses.reduce((acc, expense) => {
			const category = budgetCategories.find(cat => cat.name === expense.category)
			if (category) {
				acc[category.name] = (acc[category.name] || 0) + expense.amount
			}
			return acc
		}, {} as Record<string, number>)

		const scores: CategoryScore[] = []

		// Define recommended percentages for different categories
		const recommendations = {
			'Makanan': { max: 15, warning: 20 },
			'Transportasi': { max: 15, warning: 20 },
			'Hiburan': { max: 10, warning: 15 },
			'Belanja': { max: 10, warning: 15 },
			'Kesehatan': { max: 5, warning: 10 },
			'Utilitas': { max: 10, warning: 15 }
		}

		Object.entries(categorySpending).forEach(([category, amount]) => {
			const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0
			const recommendation = recommendations[category as keyof typeof recommendations]
			
			if (recommendation) {
				let status: CategoryScore['status'] = 'good'
				let color = '#c6ef4e'

				if (percentage > recommendation.warning) {
					status = 'danger'
					color = '#ef4444'
				} else if (percentage > recommendation.max) {
					status = 'warning'
					color = '#f59e0b'
				}

				scores.push({
					category,
					score: percentage,
					maxScore: recommendation.warning,
					status,
					color
				})
			}
		})

		return scores.sort((a, b) => b.score - a.score)
	}, [expenses, monthlyIncome, budgetCategories])

	const overallHealthScore = useMemo(() => {
		const totalScore = healthScores.reduce((sum, score) => sum + score.score, 0)
		const maxTotalScore = healthScores.reduce((sum, score) => sum + score.maxScore, 0)
		return maxTotalScore > 0 ? (totalScore / maxTotalScore) * 100 : 0
	}, [healthScores])

	const getStatusColor = (status: HealthScore['status']) => {
		switch (status) {
			case 'excellent': return 'text-green-600 bg-green-100'
			case 'good': return 'text-blue-600 bg-blue-100'
			case 'fair': return 'text-yellow-600 bg-yellow-100'
			case 'poor': return 'text-red-600 bg-red-100'
			default: return 'text-gray-600 bg-gray-100'
		}
	}

	const getOverallStatus = (score: number) => {
		if (score >= 80) return { label: 'Excellent', color: 'text-green-600', icon: CheckCircle }
		if (score >= 60) return { label: 'Good', color: 'text-blue-600', icon: Heart }
		if (score >= 40) return { label: 'Fair', color: 'text-yellow-600', icon: AlertCircle }
		return { label: 'Needs Improvement', color: 'text-red-600', icon: AlertCircle }
	}

	const overallStatus = getOverallStatus(overallHealthScore)
	const OverallIcon = overallStatus.icon

	return (
		<div className="space-y-6">
			{/* Overall Health Score */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Heart className="h-5 w-5 text-red-500" />
						Overall Financial Health
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center space-y-4">
						<div className="relative w-32 h-32 mx-auto">
							<svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
								<circle
									cx="60"
									cy="60"
									r="50"
									stroke="#e5e7eb"
									strokeWidth="8"
									fill="none"
								/>
								<circle
									cx="60"
									cy="60"
									r="50"
									stroke="#c6ef4e"
									strokeWidth="8"
									fill="none"
									strokeDasharray={`${(overallHealthScore / 100) * 314} 314`}
									strokeLinecap="round"
								/>
							</svg>
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="text-center">
									<div className="text-2xl font-bold">{overallHealthScore.toFixed(0)}</div>
									<div className="text-sm text-gray-500">Score</div>
								</div>
							</div>
						</div>
						<div className="flex items-center justify-center gap-2">
							<OverallIcon className={`h-5 w-5 ${overallStatus.color}`} />
							<span className={`font-semibold ${overallStatus.color}`}>
								{overallStatus.label}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Individual Health Metrics */}
			<Card>
				<CardHeader>
					<CardTitle>Financial Ratios & Health Metrics</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{healthScores.map((score) => {
						const Icon = score.icon
						const percentage = (score.score / score.maxScore) * 100
						
						return (
							<div key={score.name} className="space-y-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<Icon className="h-5 w-5 text-gray-600" />
										<div>
											<h4 className="font-medium">{score.name}</h4>
											<p className="text-sm text-gray-600">{score.description}</p>
										</div>
									</div>
									<Badge className={getStatusColor(score.status)}>
										{score.status.charAt(0).toUpperCase() + score.status.slice(1)}
									</Badge>
								</div>
								<Progress value={percentage} className="h-2" />
								{score.recommendation && (
									<p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
										💡 {score.recommendation}
									</p>
								)}
							</div>
						)
					})}
				</CardContent>
			</Card>

			{/* Spending Scorecard */}
			<Card>
				<CardHeader>
					<CardTitle>Spending Scorecard</CardTitle>
					<p className="text-sm text-gray-600">
						Persentase pengeluaran per kategori dari total penghasilan
					</p>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{categoryScores.map((category) => (
							<div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
								<div className="flex items-center gap-3">
									<div 
										className="w-4 h-4 rounded-full" 
										style={{ backgroundColor: category.color }}
									/>
									<span className="font-medium">{category.category}</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-sm text-gray-600">
										{formatPercentage(category.score)}
									</span>
									<Badge 
										variant={category.status === 'good' ? 'default' : 'destructive'}
										className={category.status === 'good' ? 'bg-[#c6ef4e] text-black' : ''}
									>
										{category.status === 'good' ? '✓' : category.status === 'warning' ? '⚠' : '✗'}
									</Badge>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

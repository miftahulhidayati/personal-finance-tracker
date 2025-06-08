'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
	Target, 
	Plus, 
	Calendar, 
	DollarSign,
	Smartphone,
	Car,
	Home,
	GraduationCap,
	Plane
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/formatters'

interface FinancialGoal {
	id: string
	name: string
	description: string
	targetAmount: number
	currentAmount: number
	targetDate: string
	category: 'travel' | 'gadget' | 'emergency' | 'investment' | 'education' | 'home' | 'car' | 'other'
	priority: 'high' | 'medium' | 'low'
	autoSaveAmount?: number // Monthly auto-save amount
}

// Mock data - this should come from your store
const mockGoals: FinancialGoal[] = [
	{
		id: '1',
		name: 'Liburan Bali',
		description: 'Liburan keluarga ke Bali untuk 1 minggu',
		targetAmount: 15000000,
		currentAmount: 8500000,
		targetDate: '2025-12-31',
		category: 'travel',
		priority: 'high',
		autoSaveAmount: 1000000
	},
	{
		id: '2',
		name: 'iPhone 16 Pro',
		description: 'Upgrade smartphone untuk produktivitas',
		targetAmount: 20000000,
		currentAmount: 12000000,
		targetDate: '2025-09-30',
		category: 'gadget',
		priority: 'medium',
		autoSaveAmount: 1500000
	},
	{
		id: '3',
		name: 'Dana Darurat',
		description: 'Dana darurat untuk 6 bulan pengeluaran',
		targetAmount: 30000000,
		currentAmount: 18000000,
		targetDate: '2025-12-31',
		category: 'emergency',
		priority: 'high',
		autoSaveAmount: 2000000
	},
	{
		id: '4',
		name: 'Down Payment Rumah',
		description: 'DP untuk rumah idaman di Jakarta Selatan',
		targetAmount: 150000000,
		currentAmount: 45000000,
		targetDate: '2027-06-30',
		category: 'home',
		priority: 'high',
		autoSaveAmount: 5000000
	}
]

export function GoalProgress() {
	const [selectedCategory, setSelectedCategory] = useState<string>('all')

	const goals = mockGoals // In real app, this would come from store

	const filteredGoals = useMemo(() => {
		if (selectedCategory === 'all') return goals
		return goals.filter(goal => goal.category === selectedCategory)
	}, [goals, selectedCategory])

	const goalAnalytics = useMemo(() => {
		const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
		const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
		const totalProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0
		
		const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length
		const totalGoals = goals.length
		
		return {
			totalTargetAmount,
			totalCurrentAmount,
			totalProgress,
			completedGoals,
			totalGoals,
			remainingAmount: totalTargetAmount - totalCurrentAmount
		}
	}, [goals])

	const calculateTimeToTarget = (goal: FinancialGoal) => {
		const remaining = goal.targetAmount - goal.currentAmount
		if (remaining <= 0) return 'Tercapai!'
		
		if (!goal.autoSaveAmount || goal.autoSaveAmount <= 0) return 'Tidak terprediksi'
		
		const monthsToTarget = Math.ceil(remaining / goal.autoSaveAmount)
		const targetDate = new Date()
		targetDate.setMonth(targetDate.getMonth() + monthsToTarget)
		
		if (monthsToTarget === 1) return '1 bulan lagi'
		if (monthsToTarget < 12) return `${monthsToTarget} bulan lagi`
		
		const years = Math.floor(monthsToTarget / 12)
		const months = monthsToTarget % 12
		
		if (months === 0) return `${years} tahun lagi`
		return `${years} tahun ${months} bulan lagi`
	}

	const getBudgetAdjustmentSuggestion = (goal: FinancialGoal) => {
		const remaining = goal.targetAmount - goal.currentAmount
		const targetDate = new Date(goal.targetDate)
		const now = new Date()
		const monthsRemaining = Math.max(1, (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30))
		
		const requiredMonthlySaving = remaining / monthsRemaining
		const currentMonthlySaving = goal.autoSaveAmount || 0
		
		if (requiredMonthlySaving > currentMonthlySaving) {
			const additionalSaving = requiredMonthlySaving - currentMonthlySaving
			return `Tambahkan ${formatCurrency(additionalSaving)}/bulan untuk mencapai target tepat waktu`
		}
		
		return 'Target dapat dicapai dengan tabungan saat ini'
	}

	const getIcon = (category: FinancialGoal['category']) => {
		switch (category) {
			case 'travel': return Plane
			case 'gadget': return Smartphone
			case 'emergency': return Target
			case 'home': return Home
			case 'car': return Car
			case 'education': return GraduationCap
			default: return DollarSign
		}
	}

	const getPriorityColor = (priority: FinancialGoal['priority']) => {
		switch (priority) {
			case 'high': return 'bg-red-100 text-red-800'
			case 'medium': return 'bg-yellow-100 text-yellow-800'
			case 'low': return 'bg-green-100 text-green-800'
			default: return 'bg-gray-100 text-gray-800'
		}
	}

	const categories = [
		{ id: 'all', label: 'Semua' },
		{ id: 'travel', label: 'Travel' },
		{ id: 'gadget', label: 'Gadget' },
		{ id: 'emergency', label: 'Emergency' },
		{ id: 'investment', label: 'Investment' },
		{ id: 'home', label: 'Rumah' },
		{ id: 'car', label: 'Kendaraan' },
		{ id: 'education', label: 'Edukasi' }
	]

	return (
		<div className="space-y-6">
			{/* Goal Analytics Overview */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5 text-purple-600" />
						Goal Progress Overview
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
						<div className="text-center">
							<div className="text-2xl font-bold text-purple-600">
								{goalAnalytics.completedGoals}/{goalAnalytics.totalGoals}
							</div>
							<div className="text-sm text-gray-600">Goals Completed</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">
								{goalAnalytics.totalProgress.toFixed(1)}%
							</div>
							<div className="text-sm text-gray-600">Overall Progress</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-600">
								{formatCurrency(goalAnalytics.totalCurrentAmount)}
							</div>
							<div className="text-sm text-gray-600">Total Saved</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-orange-600">
								{formatCurrency(goalAnalytics.remainingAmount)}
							</div>
							<div className="text-sm text-gray-600">Remaining</div>
						</div>
					</div>
					
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span>Overall Progress</span>
							<span>{goalAnalytics.totalProgress.toFixed(1)}%</span>
						</div>
						<Progress value={goalAnalytics.totalProgress} className="h-3" />
					</div>
				</CardContent>
			</Card>

			{/* Category Filter */}
			<div className="flex flex-wrap gap-2">
				{categories.map((category) => (
					<Button
						key={category.id}
						variant={selectedCategory === category.id ? 'primary' : 'secondary'}
						size="sm"
						onClick={() => setSelectedCategory(category.id)}
						className={selectedCategory === category.id ? 'bg-[#c6ef4e] text-black hover:bg-[#b8e63f]' : ''}
					>
						{category.label}
					</Button>
				))}
			</div>

			{/* Goals Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{filteredGoals.map((goal) => {
					const Icon = getIcon(goal.category)
					const progress = (goal.currentAmount / goal.targetAmount) * 100
					const isCompleted = goal.currentAmount >= goal.targetAmount
					
					return (
						<Card key={goal.id} className={isCompleted ? 'border-green-200 bg-green-50' : ''}>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-purple-100 rounded-lg">
											<Icon className="h-5 w-5 text-purple-600" />
										</div>
										<div>
											<h3 className="font-semibold text-gray-900">{goal.name}</h3>
											<p className="text-sm text-gray-600">{goal.description}</p>
										</div>
									</div>
									<Badge className={getPriorityColor(goal.priority)}>
										{goal.priority.toUpperCase()}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Progress Bar */}
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>Progress</span>
										<span>{progress.toFixed(1)}%</span>
									</div>
									<Progress 
										value={Math.min(progress, 100)} 
										className="h-2"
									/>
									<div className="flex justify-between text-sm text-gray-600">
										<span>{formatCurrency(goal.currentAmount)}</span>
										<span>{formatCurrency(goal.targetAmount)}</span>
									</div>
								</div>

								{/* Goal Details */}
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<div className="text-gray-600">Target Date</div>
										<div className="font-medium flex items-center gap-1">
											<Calendar className="h-4 w-4" />
											{formatDate(goal.targetDate)}
										</div>
									</div>
									<div>
										<div className="text-gray-600">Auto Save</div>
										<div className="font-medium">
											{goal.autoSaveAmount ? formatCurrency(goal.autoSaveAmount) + '/bulan' : 'Tidak aktif'}
										</div>
									</div>
								</div>

								{/* Time Estimation */}
								<div className="p-3 bg-blue-50 rounded-lg">
									<div className="text-sm text-blue-800 font-medium">
										⏱️ {calculateTimeToTarget(goal)}
									</div>
									<div className="text-xs text-blue-600 mt-1">
										{getBudgetAdjustmentSuggestion(goal)}
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex gap-2">
									<Button size="sm" variant="secondary" className="flex-1">
										Update Progress
									</Button>
									<Button size="sm" variant="secondary" className="flex-1">
										Adjust Goal
									</Button>
								</div>
							</CardContent>
						</Card>
					)
				})}
			</div>

			{/* Add New Goal */}
			<Card className="border-dashed border-2 border-gray-300">
				<CardContent className="flex flex-col items-center justify-center py-12">
					<Plus className="h-12 w-12 text-gray-400 mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">Add New Goal</h3>
					<p className="text-gray-600 text-center mb-4">
						Tetapkan target keuangan baru dan pantau progressnya
					</p>
					<Button className="bg-[#c6ef4e] text-black hover:bg-[#b8e63f]">
						<Plus className="h-4 w-4 mr-2" />
						Create New Goal
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}

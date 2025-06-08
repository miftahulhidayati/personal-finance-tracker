'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, TrendingUp, Database } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'

interface DataSummaryProps {
	period: 'month' | 'quarter' | 'year'
	historicalData?: {
		income: Array<{ month: number; year: number; amount: number }>
		expenses: Array<{ month: number; year: number; amount: number }>
	} | null
	currentData: {
		totalIncome: number
		totalExpenses: number
	}
}

export function DataSummary({ period, historicalData, currentData }: DataSummaryProps) {
	const getDataRange = () => {
		if (!historicalData || period === 'month') {
			const currentDate = new Date()
			return {
				from: currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
				to: null,
				dataPoints: 1
			}
		}

		// Find date range from historical data
		const allDates = [
			...historicalData.income.map(i => new Date(i.year, i.month - 1)),
			...historicalData.expenses.map(e => new Date(e.year, e.month - 1))
		].sort((a, b) => a.getTime() - b.getTime())

		if (allDates.length === 0) {
			return { from: 'No data', to: null, dataPoints: 0 }
		}

		const from = allDates[0]?.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) || 'Unknown'
		const to = allDates[allDates.length - 1]?.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) || 'Unknown'
		
		// Count unique months
		const uniqueMonths = new Set(allDates.map(date => `${date.getFullYear()}-${date.getMonth()}`))
		
		return {
			from,
			to: from !== to ? to : null,
			dataPoints: uniqueMonths.size
		}
	}

	const { from, to, dataPoints } = getDataRange()
	const periodLabel = period === 'month' ? 'Current Month' : period === 'quarter' ? 'Last 3 Months' : 'Last 12 Months'

	return (
		<Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
			<CardContent className="p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-blue-100 rounded-lg">
							<Database className="h-5 w-5 text-blue-600" />
						</div>
						<div>
							<h3 className="font-semibold text-gray-900">{periodLabel} Analytics</h3>
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<Calendar className="h-4 w-4" />
								<span>
									{from}{to && ` - ${to}`} • {dataPoints} month{dataPoints !== 1 ? 's' : ''} of data
								</span>
							</div>
						</div>
					</div>
					
					<div className="text-right">
						<div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
							<TrendingUp className="h-4 w-4" />
							<span>Period Summary</span>
						</div>
						<div className="space-y-1">
							<div className="text-sm">
								<span className="text-gray-600">Income: </span>
								<span className="font-medium text-green-600">{formatCurrency(currentData.totalIncome)}</span>
							</div>
							<div className="text-sm">
								<span className="text-gray-600">Expenses: </span>
								<span className="font-medium text-red-600">{formatCurrency(currentData.totalExpenses)}</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

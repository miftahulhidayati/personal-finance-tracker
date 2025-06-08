'use client'

import { useState, useEffect } from 'react'
import { useFinanceStore } from '@/stores/finance-store'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	Settings as SettingsIcon,
	Save,
	RefreshCw,
	Bell,
	DollarSign,
	Shield,
	Eye,
	EyeOff,
	CheckCircle
} from 'lucide-react'

export default function SettingsPage() {
	const {
		settings,
		isLoading,
		loadData,
		updateSettings
	} = useFinanceStore()

	const [showPrivateValues, setShowPrivateValues] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [saveSuccess, setSaveSuccess] = useState(false)

	const [formData, setFormData] = useState({
		currency: 'Rp',
		dateFormat: 'DD/MM/YYYY',
		budgetTarget: 80,
		savingsGoal: 20,
		defaultAccount: 'Bank 1',
		stockApiKey: '',
		notificationPreferences: {
			budgetAlerts: true,
			monthlyReports: true,
			goalAchievements: true,
		},
	})

	useEffect(() => {
		loadData()
	}, [loadData])

	useEffect(() => {
		if (settings) {
			setFormData({
				currency: settings.currency || 'Rp',
				dateFormat: settings.dateFormat || 'DD/MM/YYYY',
				budgetTarget: settings.budgetTarget || 80,
				savingsGoal: settings.savingsGoal || 20,
				defaultAccount: settings.defaultAccount || 'Bank 1',
				stockApiKey: settings.stockApiKey || '',
				notificationPreferences: settings.notificationPreferences || {
					budgetAlerts: true,
					monthlyReports: true,
					goalAchievements: true,
				},
			})
		}
	}, [settings])

	const handleInputChange = (field: string, value: any) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}))
	}

	const handleNotificationChange = (field: string, value: boolean) => {
		setFormData(prev => ({
			...prev,
			notificationPreferences: {
				...prev.notificationPreferences,
				[field]: value
			}
		}))
	}

	const handleSave = async () => {
		if (!settings) return

		setIsSaving(true)
		setSaveSuccess(false)

		try {
			await updateSettings({
				...settings,
				...formData
			})
			setSaveSuccess(true)
			setTimeout(() => setSaveSuccess(false), 3000)
		} catch (error) {
			console.error('Failed to save settings:', error)
		} finally {
			setIsSaving(false)
		}
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-2 border-lime-400 border-t-transparent"></div>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-bold text-black">Settings</h1>
					<p className="mt-2 text-neutral-600">
						Manage your application preferences and financial configurations
					</p>
				</div>

				<div className="mt-6 sm:mt-0 flex items-center space-x-4">
					<Button
						variant="secondary"
						onClick={() => setShowPrivateValues(!showPrivateValues)}
						className="border border-neutral-200 hover:border-lime-400 transition-all"
					>
						{showPrivateValues ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
						{showPrivateValues ? 'Hide Values' : 'Show Values'}
					</Button>
					<Button
						onClick={() => loadData()}
						variant="secondary"
						className="border border-neutral-200 hover:border-lime-400 transition-all"
					>
						<RefreshCw className="h-4 w-4 mr-2" />
						Refresh
					</Button>
					<Button
						onClick={handleSave}
						disabled={isSaving}
						className="bg-lime-400 hover:bg-lime-500 text-black font-medium shadow-lg shadow-lime-400/20"
					>
						{isSaving ? (
							<RefreshCw className="h-4 w-4 mr-2 animate-spin" />
						) : (
							<Save className="h-4 w-4 mr-2" />
						)}
						{isSaving ? 'Saving...' : 'Save Settings'}
					</Button>
				</div>
			</div>

			{/* Success Message */}
			{saveSuccess && (
				<div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
					<div className="flex items-center">
						<CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
						<div>
							<p className="font-medium text-emerald-800">Settings saved successfully!</p>
							<p className="text-sm text-emerald-600">
								Your preferences have been updated and will take effect immediately.
							</p>
						</div>
					</div>
				</div>
			)}

        			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* General Settings */}
				<Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
					<CardHeader className="pb-6">
						<CardTitle className="text-xl font-semibold text-black flex items-center">
							<div className="p-2 bg-lime-400/20 rounded-xl mr-3">
								<SettingsIcon className="h-5 w-5 text-lime-600" />
							</div>
							General Settings
						</CardTitle>
						<p className="text-neutral-600 mt-2">
							Configure basic application preferences and display options
						</p>
					</CardHeader>
					<CardContent className="space-y-6">
						<div>
							<label className="block text-sm font-semibold text-neutral-800 mb-3">
								Currency
							</label>
							<select
								value={formData.currency}
								onChange={(e) => handleInputChange('currency', e.target.value)}
								className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all bg-white"
							>
								<option value="Rp">Rupiah (Rp)</option>
								<option value="$">US Dollar ($)</option>
								<option value="€">Euro (€)</option>
								<option value="¥">Japanese Yen (¥)</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-semibold text-neutral-800 mb-3">
								Date Format
							</label>
							<select
								value={formData.dateFormat}
								onChange={(e) => handleInputChange('dateFormat', e.target.value)}
								className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all bg-white"
							>
								<option value="DD/MM/YYYY">DD/MM/YYYY</option>
								<option value="MM/DD/YYYY">MM/DD/YYYY</option>
								<option value="YYYY-MM-DD">YYYY-MM-DD</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-semibold text-neutral-800 mb-3">
								Default Account
							</label>
							<select
								value={formData.defaultAccount}
								onChange={(e) => handleInputChange('defaultAccount', e.target.value)}
								className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all bg-white"
							>
								<option value="Bank 1">Bank 1</option>
								<option value="Bank 2">Bank 2</option>
								<option value="Bank 3">Bank 3</option>
							</select>
						</div>
					</CardContent>
				</Card>

				{/* Financial Goals */}
				<Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
					<CardHeader className="pb-6">
						<CardTitle className="text-xl font-semibold text-black flex items-center">
							<div className="p-2 bg-blue-400/20 rounded-xl mr-3">
								<DollarSign className="h-5 w-5 text-blue-600" />
							</div>
							Financial Goals
						</CardTitle>
						<p className="text-neutral-600 mt-2">
							Set your budget targets and savings goals for better financial planning
						</p>
					</CardHeader>
					<CardContent className="space-y-6">
						<div>
							<label className="block text-sm font-semibold text-neutral-800 mb-3">
								Budget Target (%)
							</label>
							<input
								type="number"
								min="0"
								max="100"
								value={formData.budgetTarget}
								onChange={(e) => handleInputChange('budgetTarget', parseInt(e.target.value))}
								className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
								placeholder="80"
							/>
							<p className="text-xs text-neutral-500 mt-2">
								Percentage of income you want to allocate for your budget
							</p>
						</div>

						<div>
							<label className="block text-sm font-semibold text-neutral-800 mb-3">
								Savings Goal (%)
							</label>
							<input
								type="number"
								min="0"
								max="100"
								value={formData.savingsGoal}
								onChange={(e) => handleInputChange('savingsGoal', parseInt(e.target.value))}
								className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
								placeholder="20"
							/>
							<p className="text-xs text-neutral-500 mt-2">
								Percentage of income you want to save each month
							</p>
						</div>

						<div>
							<label className="block text-sm font-semibold text-neutral-800 mb-3">
								Stock API Key (Optional)
							</label>
							<input
								type={showPrivateValues ? "text" : "password"}
								value={formData.stockApiKey}
								onChange={(e) => handleInputChange('stockApiKey', e.target.value)}
								placeholder="Enter API key for automatic stock price updates"
								className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
							/>
							<p className="text-xs text-neutral-500 mt-2">
								For automatic stock price updates and portfolio tracking
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Notification Settings */}
				<Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
					<CardHeader className="pb-6">
						<CardTitle className="text-xl font-semibold text-black flex items-center">
							<div className="p-2 bg-purple-400/20 rounded-xl mr-3">
								<Bell className="h-5 w-5 text-purple-600" />
							</div>
							Notifications
						</CardTitle>
						<p className="text-neutral-600 mt-2">
							Control when and how you receive financial updates and alerts
						</p>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
							<div>
								<p className="font-semibold text-neutral-900">Budget Alerts</p>
								<p className="text-sm text-neutral-600 mt-1">
									Get notified when spending approaches budget limits
								</p>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={formData.notificationPreferences.budgetAlerts}
									onChange={(e) => handleNotificationChange('budgetAlerts', e.target.checked)}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lime-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-400"></div>
							</label>
						</div>

						<div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
							<div>
								<p className="font-semibold text-neutral-900">Monthly Reports</p>
								<p className="text-sm text-neutral-600 mt-1">
									Receive monthly financial summary reports via email
								</p>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={formData.notificationPreferences.monthlyReports}
									onChange={(e) => handleNotificationChange('monthlyReports', e.target.checked)}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lime-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-400"></div>
							</label>
						</div>

						<div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
							<div>
								<p className="font-semibold text-neutral-900">Goal Achievements</p>
								<p className="text-sm text-neutral-600 mt-1">
									Celebrate when you reach savings or investment milestones
								</p>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={formData.notificationPreferences.goalAchievements}
									onChange={(e) => handleNotificationChange('goalAchievements', e.target.checked)}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lime-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-400"></div>
							</label>
						</div>
					</CardContent>
				</Card>

				{/* Google Sheets Integration */}
				<Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
					<CardHeader className="pb-6">
						<CardTitle className="text-xl font-semibold text-black flex items-center">
							<div className="p-2 bg-emerald-400/20 rounded-xl mr-3">
								<Shield className="h-5 w-5 text-emerald-600" />
							</div>
							Data Integration
						</CardTitle>
						<p className="text-neutral-600 mt-2">
							Manage your Google Sheets connection and data synchronization
						</p>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
							<div className="flex items-center">
								<div className="w-3 h-3 bg-emerald-500 rounded-full mr-4"></div>
								<div>
									<p className="font-semibold text-emerald-800">Connected</p>
									<p className="text-sm text-emerald-600">
										Google Sheets is connected and data synchronization is active
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-semibold text-neutral-800 mb-3">
									Sheet ID
								</label>
								<div className="bg-neutral-100 p-4 rounded-xl">
									<p className="text-sm text-neutral-600 font-mono break-all">
										{showPrivateValues ? '17rTY_6aK8ZJXhztvinGcNsPwjVHOOYMyQKt7ZHhBVBg' : '••••••••••••••••••••••••••••••••••••••••••••'}
									</p>
								</div>
							</div>

							<div>
								<label className="block text-sm font-semibold text-neutral-800 mb-3">
									Last Synchronization
								</label>
								<p className="text-sm text-neutral-600 bg-neutral-100 p-4 rounded-xl">
									{new Date().toLocaleString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									})}
								</p>
							</div>

							<Button variant="secondary" className="w-full border border-neutral-200 hover:border-lime-400 transition-all">
								<RefreshCw className="h-4 w-4 mr-2" />
								Test Connection
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
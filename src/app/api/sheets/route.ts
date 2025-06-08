import { NextRequest, NextResponse } from 'next/server'
import { GoogleSheetsService } from '@/lib/google-sheets'

/**
 * Create Google Sheets service instance with validation
 */
function createSheetsService(): GoogleSheetsService {
	// Validate required environment variables
	const requiredEnvVars = {
		GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
		GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
		GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
	}

	for (const [key, value] of Object.entries(requiredEnvVars)) {
		if (!value) {
			throw new Error(`Missing required environment variable: ${key}`)
		}
	}

	return new GoogleSheetsService({
		spreadsheetId: requiredEnvVars.GOOGLE_SHEET_ID!,
		apiKey: process.env.GOOGLE_API_KEY || '',
		ranges: {
			income: 'Income!A2:F100',
			budget: 'Budget!A2:H100',
			expenses: 'Expenses!A2:G1000',
			assets: 'Assets!A2:I100',
			accounts: 'Accounts!A2:E100',
			settings: 'Settings!A2:B10',
		},
	})
}

/**
 * Debug endpoint to check environment configuration
 */
export async function HEAD() {
	const envCheck = {
		GOOGLE_SHEET_ID: !!process.env.GOOGLE_SHEET_ID,
		GOOGLE_CLIENT_EMAIL: !!process.env.GOOGLE_CLIENT_EMAIL,
		GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
		GOOGLE_PROJECT_ID: !!process.env.GOOGLE_PROJECT_ID,
	}

	const allPresent = Object.values(envCheck).every(Boolean)

	return NextResponse.json({
		configured: allPresent,
		variables: envCheck,
		message: allPresent ? 'All required variables present' : 'Missing required environment variables'
	})
}

/**
 * GET /api/sheets - Fetch financial data from Google Sheets
 * Query parameters: month, year, type (income|budget|expenses|assets|accounts)
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const month = parseInt(searchParams.get('month') || '1')
		const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
		const type = searchParams.get('type')

		console.log(`API Request: type=${type}, month=${month}, year=${year}`)

		// Create service instance
		const sheetsService = createSheetsService()

		switch (type) {
			case 'income':
				const income = await sheetsService.getMonthlyIncome(month, year)
				return NextResponse.json({ data: income })

			case 'budget':
				const budget = await sheetsService.getBudgetCategories(month, year)
				return NextResponse.json({ data: budget })

			case 'expenses':
				const expenses = await sheetsService.getExpenses(month, year)
				return NextResponse.json({ data: expenses })

			case 'assets':
				const assets = await sheetsService.getAssets()
				return NextResponse.json({ data: assets })

			case 'accounts':
				const accounts = await sheetsService.getBankAccounts()
				return NextResponse.json({ data: accounts })

			case 'historical':
				// Fetch all data with historical context for analytics
				console.log('Fetching historical data...')
				const historicalData = await sheetsService.getAllData()
				return NextResponse.json({ data: historicalData })

			case 'all':
				// Fetch all data for dashboard
				console.log('Fetching all data from Google Sheets...')

				try {
					const [incomeData, budgetData, expensesData, assetsData, accountsData] = await Promise.allSettled([
						sheetsService.getMonthlyIncome(month, year),
						sheetsService.getBudgetCategories(month, year),
						sheetsService.getExpenses(month, year),
						sheetsService.getAssets(),
						sheetsService.getBankAccounts(),
					])

					// Handle partial failures gracefully
					const result = {
						income: incomeData.status === 'fulfilled' ? incomeData.value : [],
						budget: budgetData.status === 'fulfilled' ? budgetData.value : [],
						expenses: expensesData.status === 'fulfilled' ? expensesData.value : [],
						assets: assetsData.status === 'fulfilled' ? assetsData.value : [],
						accounts: accountsData.status === 'fulfilled' ? accountsData.value : [],
					}

					// Log any failures
					const failures = [
						{ name: 'income', result: incomeData },
						{ name: 'budget', result: budgetData },
						{ name: 'expenses', result: expensesData },
						{ name: 'assets', result: assetsData },
						{ name: 'accounts', result: accountsData },
					].filter(item => item.result.status === 'rejected')

					if (failures.length > 0) {
						console.warn('Some data failed to load:', failures.map(f => f.name))
						failures.forEach(f => {
							if (f.result.status === 'rejected') {
								console.error(`${f.name} error:`, f.result.reason)
							}
						})
					}

					return NextResponse.json({ data: result })
				} catch (error) {
					console.error('Error fetching all data:', error)
					// Return empty data structure instead of failing completely
					return NextResponse.json({
						data: {
							income: [],
							budget: [],
							expenses: [],
							assets: [],
							accounts: [],
						},
					})
				}

			default:
				return NextResponse.json(
					{ error: 'Invalid type parameter. Use: income, budget, expenses, assets, accounts, or all' },
					{ status: 400 }
				)
		}
	} catch (error) {
		console.error('Google Sheets API error:', error)

		// Provide more specific error messages
		let errorMessage = 'Failed to fetch data from Google Sheets'
		if (error instanceof Error) {
			if (error.message.includes('Missing required environment variable')) {
				errorMessage = `Configuration error: ${error.message}`
			} else if (error.message.includes('ENOTFOUND') || error.message.includes('network')) {
				errorMessage = 'Network error: Unable to connect to Google Sheets'
			} else if (error.message.includes('permission') || error.message.includes('forbidden')) {
				errorMessage = 'Permission error: Check Google Sheets sharing settings'
			}
		}

		return NextResponse.json(
			{ error: errorMessage, details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}

/**
 * POST /api/sheets - Add new data to Google Sheets
 * Body: { type, data }
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { type, data } = body

		const sheetsService = createSheetsService()

		switch (type) {
			case 'expense':
				await sheetsService.addExpense(data)
				return NextResponse.json({ success: true })

			case 'income':
				await sheetsService.addIncome(data)
				return NextResponse.json({ success: true })

			default:
				return NextResponse.json(
					{ error: 'Invalid type parameter. Use: expense, income' },
					{ status: 400 }
				)
		}
	} catch (error) {
		console.error('Google Sheets API error:', error)
		return NextResponse.json(
			{ error: 'Failed to add data to Google Sheets' },
			{ status: 500 }
		)
	}
}

/**
 * PUT /api/sheets - Update existing data in Google Sheets
 * Body: { type, data }
 */
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json()
		const { type, data } = body

		const sheetsService = createSheetsService()

		switch (type) {
			case 'budget':
				await sheetsService.updateBudgetCategory(data)
				return NextResponse.json({ success: true })

			case 'assets':
				await sheetsService.updateAssetPrices(data)
				return NextResponse.json({ success: true })

			default:
				return NextResponse.json(
					{ error: 'Invalid type parameter. Use: budget, assets' },
					{ status: 400 }
				)
		}
	} catch (error) {
		console.error('Google Sheets API error:', error)
		return NextResponse.json(
			{ error: 'Failed to update data in Google Sheets' },
			{ status: 500 }
		)
	}
}
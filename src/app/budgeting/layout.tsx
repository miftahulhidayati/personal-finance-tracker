import { MainLayout } from '@/components/layout/main-layout'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
	title: 'Budgeting - Personal Finance Tracker',
	description: 'Manage your monthly and yearly budget allocations',
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
}

export default function BudgetingLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <MainLayout>{children}</MainLayout>
}
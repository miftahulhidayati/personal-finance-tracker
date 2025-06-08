import { MainLayout } from '@/components/layout/main-layout'

export const metadata = {
	title: 'Budgeting - Personal Finance Tracker',
	description: 'Manage your monthly and yearly budget allocations',
	viewport: 'width=device-width, initial-scale=1',
}

export default function BudgetingLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <MainLayout>{children}</MainLayout>
}
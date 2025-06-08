import { MainLayout } from '@/components/layout/main-layout'

export const metadata = {
	title: 'Settings - Personal Finance Tracker',
	description: 'Manage your application preferences and configurations',
	viewport: 'width=device-width, initial-scale=1',
}

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <MainLayout>{children}</MainLayout>
}
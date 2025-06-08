'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	LayoutDashboard,
	Target,
	CreditCard,
	TrendingUp,
	Settings,
	BarChart3,
	Menu,
	X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavigationItem {
	href: string
	label: string
	icon: React.ComponentType<any>
}

const navigationItems: NavigationItem[] = [
	{
		href: '/dashboard',
		label: 'Dashboard',
		icon: LayoutDashboard
	},
	{
		href: '/budgeting',
		label: 'Budgeting',
		icon: Target
	},
	{
		href: '/spending',
		label: 'Spending',
		icon: CreditCard
	},
	{
		href: '/analytics',
		label: 'Analytics',
		icon: BarChart3
	},
	{
		href: '/assets',
		label: 'Assets',
		icon: TrendingUp
	},
	{
		href: '/settings',
		label: 'Settings',
		icon: Settings
	}
]

/**
 * Navigation component with responsive design and accessibility features
 * Follows the custom rules for component structure and naming conventions
 */
export function Navigation() {
	const pathname = usePathname()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

	const handleMobileMenuToggle = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen)
	}

	const isActiveRoute = (href: string): boolean => {
		return pathname === href || pathname.startsWith(`${href}/`)
	}

	const NavigationLink = ({
		item,
		isMobile = false
	}: {
		item: NavigationItem
		isMobile?: boolean
	}) => {
		const isActive = isActiveRoute(item.href)
		const Icon = item.icon

		return (
			<Link
				href={item.href}
				className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
					isActive
						? 'bg-blue-100 text-blue-700'
						: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
				} ${isMobile ? 'w-full justify-start' : ''}`}
				aria-current={isActive ? 'page' : undefined}
				onClick={() => isMobile && setIsMobileMenuOpen(false)}
			>
				<Icon className={`h-4 w-4 ${isMobile ? 'mr-3' : 'mr-2'}`} />
				{item.label}
			</Link>
		)
	}

	return (
		<nav
			className="bg-white shadow-lg border-b border-gray-200"
			role="navigation"
			aria-label="Main navigation"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex items-center">
						<Link
							href="/dashboard"
							className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
						>
							<span className="text-2xl">💰</span>
							<h1 className="text-xl font-bold text-gray-900">
								Finance Tracker
							</h1>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex space-x-1">
						{navigationItems.map((item) => (
							<NavigationLink key={item.href} item={item} />
						))}
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleMobileMenuToggle}
							aria-expanded={isMobileMenuOpen}
							aria-controls="mobile-menu"
							aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
						>
							{isMobileMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Navigation Menu */}
				{isMobileMenuOpen && (
					<div
						id="mobile-menu"
						className="md:hidden py-4 border-t border-gray-200"
					>
						<div className="space-y-1">
							{navigationItems.map((item) => (
								<NavigationLink
									key={item.href}
									item={item}
									isMobile={true}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		</nav>
	)
}
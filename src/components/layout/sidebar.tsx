'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	LayoutDashboard,
	PiggyBank,
	CreditCard,
	TrendingUp,
	Settings,
	User,
	X,
	ChevronLeft,
	ChevronRight
} from 'lucide-react';

interface SidebarProps {
	isOpen: boolean;
	onToggle: () => void;
	isCollapsed: boolean;
	onCollapseToggle: () => void;
}

const navigationItems = [
	{
		label: 'Dashboard',
		href: '/dashboard',
		icon: LayoutDashboard,
	},
	{
		label: 'Budgeting',
		href: '/budgeting',
		icon: PiggyBank,
	},
	{
		label: 'Spending',
		href: '/spending',
		icon: CreditCard,
	},
	{
		label: 'Analytics',
		href: '/analytics',
		icon: TrendingUp,
	},
	{
		label: 'Settings',
		href: '/settings',
		icon: Settings,
	},
];

export function Sidebar({ isOpen, onToggle, isCollapsed, onCollapseToggle }: SidebarProps) {
	const pathname = usePathname();

	return (
		<>
			{/* Mobile backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-neutral-900/50 z-40 lg:hidden"
					onClick={onToggle}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`
					fixed left-0 top-0 z-50 h-full bg-white border-r border-neutral-200 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto
					${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
					${isCollapsed ? 'w-20' : 'w-72'}
				`}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-neutral-100">
					<div className="flex items-center space-x-3 overflow-hidden">
						<div className="w-8 h-8 bg-lime-500 rounded-xl flex items-center justify-center flex-shrink-0">
							<span className="text-neutral-900 font-bold text-sm">F</span>
						</div>
						{!isCollapsed && (
							<h1 className="text-xl font-bold text-neutral-900 whitespace-nowrap">FinanceFlow</h1>
						)}
					</div>

					<div className="flex items-center space-x-2">
						{/* Collapse toggle for desktop */}
						<button
							onClick={onCollapseToggle}
							className="hidden lg:flex p-2 rounded-xl hover:bg-neutral-100 transition-colors"
							title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
						>
							{isCollapsed ? (
								<ChevronRight className="w-4 h-4 text-neutral-600" />
							) : (
								<ChevronLeft className="w-4 h-4 text-neutral-600" />
							)}
						</button>

						{/* Mobile close button */}
						<button
							onClick={onToggle}
							className="lg:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors"
						>
							<X className="w-5 h-5 text-neutral-600" />
						</button>
					</div>
				</div>

				{/* Navigation */}
				<nav className="px-4 py-6 space-y-2 custom-scrollbar overflow-y-auto h-full pb-20">
					{navigationItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`
									flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative
									${isActive
										? 'bg-lime-100 text-lime-700 shadow-sm'
										: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
									}
									${isCollapsed ? 'justify-center' : ''}
								`}
								onClick={() => {
									// Close mobile sidebar when item is clicked
									if (window.innerWidth < 1024) {
										onToggle();
									}
								}}
								title={isCollapsed ? item.label : undefined}
							>
								<Icon className={`w-5 h-5 group-hover:scale-110 transition-transform duration-200 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />

								{!isCollapsed && (
									<>
										<span className="font-medium">{item.label}</span>
										{isActive && (
											<div className="ml-auto w-2 h-2 bg-lime-500 rounded-full" />
										)}
									</>
								)}

								{/* Tooltip for collapsed state */}
								{isCollapsed && (
									<div className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
										{item.label}
										<div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-neutral-900"></div>
									</div>
								)}
							</Link>
						);
					})}
				</nav>

				{/* User Profile Section */}
				<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-100 bg-white">
					<div className={`flex items-center p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
						<div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center flex-shrink-0">
							<User className="w-5 h-5 text-neutral-900" />
						</div>
						{!isCollapsed && (
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-neutral-900 truncate">
									John Doe
								</p>
								<p className="text-xs text-neutral-500 truncate">
									john@example.com
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
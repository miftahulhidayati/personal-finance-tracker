'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { ErrorBoundary } from './error-boundary';

interface MainLayoutProps {
	children: React.ReactNode;
}

/**
 * Main layout component that provides the overall page structure
 * with modern sidebar navigation and top bar
 *
 * @param props - The component props
 * @param props.children - The page content to render
 * @returns The main layout wrapper component
 */
export function MainLayout({ children }: MainLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

	// Load sidebar collapsed state from localStorage on mount
	useEffect(() => {
		const savedCollapsed = localStorage.getItem('sidebar-collapsed');
		if (savedCollapsed !== null) {
			setSidebarCollapsed(JSON.parse(savedCollapsed));
		}
	}, []);

	// Save sidebar collapsed state to localStorage
	useEffect(() => {
		localStorage.setItem('sidebar-collapsed', JSON.stringify(sidebarCollapsed));
	}, [sidebarCollapsed]);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const toggleSidebarCollapse = () => {
		setSidebarCollapsed(!sidebarCollapsed);
	};

	return (
		<ErrorBoundary>
			<div className="h-full flex bg-neutral-50">
				{/* Sidebar */}
				<Sidebar
					isOpen={sidebarOpen}
					onToggle={toggleSidebar}
					isCollapsed={sidebarCollapsed}
					onCollapseToggle={toggleSidebarCollapse}
				/>

				{/* Main content area */}
				<div className="flex-1 flex flex-col min-w-0 lg:ml-0">
					{/* Top bar */}
					<TopBar onMenuToggle={toggleSidebar} />

					{/* Main content */}
					<main className="flex-1 px-4 lg:px-8 py-6 overflow-y-auto custom-scrollbar">
						<div className="max-w-7xl mx-auto">
							{children}
						</div>
					</main>
				</div>
			</div>
		</ErrorBoundary>
	);
}
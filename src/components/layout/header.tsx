'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { UserNav } from '@/components/features/auth/user-nav'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { DollarSign } from 'lucide-react'

export function Header() {
	const { data: session } = useSession()

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<div className="mr-4 hidden md:flex">
					<Link href="/" className="mr-6 flex items-center space-x-2">
						<DollarSign className="h-6 w-6" />
						<span className="hidden font-bold sm:inline-block">
							FinanceFlow
						</span>
					</Link>
					<nav className="flex items-center space-x-6 text-sm font-medium">
						<Link
							href="/dashboard"
							className="transition-colors hover:text-foreground/80 text-foreground"
						>
							Dashboard
						</Link>
						<Link
							href="/budgeting"
							className="transition-colors hover:text-foreground/80 text-foreground/60"
						>
							Budget
						</Link>
						<Link
							href="/spending"
							className="transition-colors hover:text-foreground/80 text-foreground/60"
						>
							Spending
						</Link>
						<Link
							href="/analytics"
							className="transition-colors hover:text-foreground/80 text-foreground/60"
						>
							Analytics
						</Link>
					</nav>
				</div>
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<div className="w-full flex-1 md:w-auto md:flex-none">
						<Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
							<DollarSign className="h-6 w-6" />
							<span className="font-bold">FinanceFlow</span>
						</Link>
					</div>
					<nav className="flex items-center space-x-2">
						{session ? (
							<>
								<ThemeToggle />
								<UserNav />
							</>
						) : (
							<>
								<ThemeToggle />
								<Link href="/auth/signin">
									<Button variant="outline" size="sm">
										Sign In
									</Button>
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
	)
}
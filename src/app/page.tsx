'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { DollarSign, TrendingUp, PieChart, Target } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
	const { data: session, status } = useSession()
	const router = useRouter()

	useEffect(() => {
		if (session) {
			router.push('/dashboard')
		}
	}, [session, router])

	if (status === 'loading') {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="animate-pulse text-lg">Loading...</div>
			</div>
		)
	}

	if (session) {
		return null // Will redirect to dashboard
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-14 items-center justify-between">
					<div className="flex items-center space-x-2">
						<DollarSign className="h-6 w-6" />
						<span className="font-bold text-lg">FinanceFlow</span>
					</div>
					<div className="flex items-center space-x-2">
						<ThemeToggle />
						<Link href="/auth/signin">
							<Button variant="outline">Sign In</Button>
						</Link>
					</div>
				</div>
			</header>

			{/* Main content */}
			<main className="container mx-auto px-4 py-12">
				<div className="text-center space-y-8">
					<div className="space-y-4">
						<h1 className="text-4xl font-bold tracking-tight">
							Take Control of Your
							<span className="text-primary"> Financial Future</span>
						</h1>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Track expenses, manage budgets, and grow your wealth with our comprehensive personal finance platform.
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="/auth/signin">
							<Button size="lg" className="text-lg px-8">
								Get Started
							</Button>
						</Link>
						<Link href="/auth/signin">
							<Button variant="outline" size="lg" className="text-lg px-8">
								Sign In
							</Button>
						</Link>
					</div>

					{/* Features */}
					<div className="grid md:grid-cols-3 gap-6 mt-16">
						<Card>
							<CardHeader>
								<TrendingUp className="h-8 w-8 text-primary mb-2" />
								<CardTitle>Track Spending</CardTitle>
								<CardDescription>
									Monitor your expenses and income with detailed analytics and insights.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card>
							<CardHeader>
								<PieChart className="h-8 w-8 text-primary mb-2" />
								<CardTitle>Budget Management</CardTitle>
								<CardDescription>
									Create and manage budgets to stay on top of your financial goals.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card>
							<CardHeader>
								<Target className="h-8 w-8 text-primary mb-2" />
								<CardTitle>Financial Goals</CardTitle>
								<CardDescription>
									Set and track your savings goals with powerful analytics tools.
								</CardDescription>
							</CardHeader>
						</Card>
					</div>

					{/* Demo note */}
					<div className="mt-16 p-6 bg-muted rounded-lg">
						<h3 className="font-semibold text-lg mb-2">Demo Version</h3>
						<p className="text-muted-foreground">
							This is a demo version. Use any email and password combination to sign in and explore the features.
							You can also sign in with Google for a quick start.
						</p>
					</div>
				</div>
			</main>
		</div>
	)
}
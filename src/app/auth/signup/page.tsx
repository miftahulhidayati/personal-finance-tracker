'use client'


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SignUpPage() {

	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Create an account
					</CardTitle>
					<CardDescription className="text-center">
						Welcome to FinanceFlow
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="text-center space-y-4">
						<p className="text-sm text-muted-foreground">
							For this demo version, we use the same authentication as sign in.
						</p>
						<p className="text-sm text-muted-foreground">
							Simply use any email and password combination to get started.
						</p>
						<Link href="/auth/signin">
							<Button className="w-full">
								Go to Sign In
							</Button>
						</Link>
						<p className="text-xs text-muted-foreground">
							Already have an account?{' '}
							<Link href="/auth/signin" className="text-primary hover:underline">
								Sign in here
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
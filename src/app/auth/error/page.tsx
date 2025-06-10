'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AuthErrorPage() {
	const searchParams = useSearchParams()
	const error = searchParams.get('error')

	const getErrorMessage = (error: string | null) => {
		switch (error) {
			case 'Configuration':
				return 'There is a problem with the server configuration.'
			case 'AccessDenied':
				return 'Access denied. You do not have permission to sign in.'
			case 'Verification':
				return 'The verification token has expired or has already been used.'
			default:
				return 'An error occurred during authentication. Please try again.'
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<div className="flex items-center space-x-2">
						<AlertCircle className="h-5 w-5 text-destructive" />
						<CardTitle className="text-2xl font-bold">
							Authentication Error
						</CardTitle>
					</div>
					<CardDescription>
						There was a problem with your authentication
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-4">
						<p className="text-sm text-muted-foreground">
							{getErrorMessage(error)}
						</p>
						<div className="space-y-2">
							<Link href="/auth/signin">
								<Button className="w-full">
									Try Again
								</Button>
							</Link>
							<Link href="/">
								<Button variant="outline" className="w-full">
									Go Home
								</Button>
							</Link>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
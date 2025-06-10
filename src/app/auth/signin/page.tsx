'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Chrome } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [credentials, setCredentials] = useState({
		email: '',
		password: ''
	})

	const handleCredentialsSignIn = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			const result = await signIn('credentials', {
				email: credentials.email,
				password: credentials.password,
				redirect: false,
			})

			if (result?.ok) {
				router.push('/dashboard')
			} else {
				console.error('Sign in failed:', result?.error)
			}
		} catch (error) {
			console.error('Sign in error:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleGoogleSignIn = async () => {
		setIsLoading(true)
		try {
			await signIn('google', { callbackUrl: '/dashboard' })
		} catch (error) {
			console.error('Google sign in error:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Welcome back
					</CardTitle>
					<CardDescription className="text-center">
						Sign in to your FinanceFlow account
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Button
						variant="outline"
						className="w-full"
						onClick={handleGoogleSignIn}
						disabled={isLoading}
					>
						<Chrome className="mr-2 h-4 w-4" />
						Continue with Google
					</Button>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<Separator className="w-full" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>

					<form onSubmit={handleCredentialsSignIn} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								value={credentials.email}
								onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Enter your password"
								value={credentials.password}
								onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
								required
							/>
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}
						>
							{isLoading ? 'Signing in...' : 'Sign in'}
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex flex-col space-y-2">
					<div className="text-sm text-muted-foreground text-center">
						Don't have an account?{' '}
						<Link href="/auth/signup" className="text-primary hover:underline">
							Sign up
						</Link>
					</div>
					<div className="text-xs text-muted-foreground text-center">
						For demo purposes, use any email and password combination
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}
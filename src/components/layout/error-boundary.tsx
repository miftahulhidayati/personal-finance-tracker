'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorBoundaryState {
	hasError: boolean
	error?: Error | undefined
	errorInfo?: React.ErrorInfo | undefined
}

interface ErrorBoundaryProps {
	children: React.ReactNode
	fallback?: React.ComponentType<{
		error: Error | undefined
		resetError: () => void
	}>
}

/**
 * Error boundary component that catches and handles React errors gracefully
 * Provides a fallback UI and error logging capabilities
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props)

		this.state = {
			hasError: false,
		}
	}

	/**
	 * Update state to trigger fallback UI when an error occurs
	 * @param error - The error that was thrown
	 * @returns Updated state object
	 */
	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return {
			hasError: true,
			error,
		}
	}

	/**
	 * Log error information for debugging and external tracking
	 * @param error - The error that was thrown
	 * @param errorInfo - Additional error information from React
	 */
	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Log to console in development
		if (process.env.NODE_ENV === 'development') {
			console.error('Error Boundary caught an error:', error)
			console.error('Error Info:', errorInfo)
		}

		// In production, you would typically log to an external service
		// Example: Sentry.captureException(error, { extra: errorInfo })

		this.setState({
			error,
			errorInfo,
		})
	}

	/**
	 * Reset the error boundary state to recover from the error
	 */
	handleResetError = () => {
		this.setState({
			hasError: false,
			error: undefined,
			errorInfo: undefined,
		})
	}

	render() {
		if (this.state.hasError) {
			// Use custom fallback component if provided
			if (this.props.fallback) {
				const FallbackComponent = this.props.fallback
				return (
					<FallbackComponent
						error={this.state.error}
						resetError={this.handleResetError}
					/>
				)
			}

			// Default fallback UI
			return (
				<div className="min-h-screen flex items-center justify-center p-4">
					<Card className="w-full max-w-md">
						<CardHeader className="text-center">
							<div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
								<AlertTriangle className="h-6 w-6 text-red-600" />
							</div>
							<CardTitle className="text-red-800">
								Something went wrong
							</CardTitle>
						</CardHeader>
						<CardContent className="text-center space-y-4">
							<p className="text-gray-600">
								We apologize for the inconvenience. An unexpected error has
								occurred.
							</p>

							{process.env.NODE_ENV === 'development' &&
								this.state.error && (
								<details className="text-left bg-gray-50 p-3 rounded text-sm">
									<summary className="cursor-pointer font-medium text-gray-700">
										Error Details
									</summary>
									<pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap">
										{this.state.error.toString()}
									</pre>
								</details>
							)}

							<div className="flex flex-col sm:flex-row gap-2">
								<Button
									onClick={this.handleResetError}
									className="flex-1"
									variant="primary"
								>
									<RefreshCw className="h-4 w-4 mr-2" />
									Try Again
								</Button>
								<Button
									onClick={() => window.location.reload()}
									className="flex-1"
									variant="secondary"
								>
									Reload Page
								</Button>
							</div>

							<p className="text-xs text-gray-500">
								If the problem persists, please contact support.
							</p>
						</CardContent>
					</Card>
				</div>
			)
		}

		return this.props.children
	}
}
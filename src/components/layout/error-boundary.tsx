'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
	children?: ReactNode
}

interface State {
	hasError: boolean
	error?: Error | undefined
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
export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false
	}

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error }
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo)
	}

	private handleReload = () => {
		window.location.reload()
	}

	private handleReset = () => {
		this.setState({ hasError: false })
	}

	public render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen flex items-center justify-center bg-background p-4">
					<div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
						<div className="flex justify-center mb-4">
							<AlertTriangle className="h-12 w-12 text-red-500" />
						</div>

						<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
							Something went wrong
						</h2>

						<p className="text-gray-600 dark:text-gray-400 mb-6">
							An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
						</p>

						{process.env.NODE_ENV === 'development' && this.state.error && (
							<details className="mb-6 text-left">
								<summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
									Error Details
								</summary>
								<pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto">
									{this.state.error.message}
									{this.state.error.stack && (
										<>
											{'\n\n'}
											{this.state.error.stack}
										</>
									)}
								</pre>
							</details>
						)}

						<div className="flex gap-3 justify-center">
							<button
								onClick={this.handleReset}
								className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
							>
								Try Again
							</button>

							<button
								onClick={this.handleReload}
								className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
							>
								<RefreshCw className="h-4 w-4" />
								Reload Page
							</button>
						</div>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}
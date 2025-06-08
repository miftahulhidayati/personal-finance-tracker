'use client'

import React from 'react'
import { clsx } from 'clsx'

interface FormFieldProps {
	id: string
	label: string
	type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
	value: string
	placeholder?: string
	required?: boolean
	disabled?: boolean
	error?: string
	helperText?: string
	className?: string
	onChange: (value: string) => void
	onBlur?: () => void
}

/**
 * Reusable form field component with built-in validation and accessibility
 * Follows the custom rules for component structure and naming conventions
 *
 * @param props - The form field props
 * @returns A fully accessible form field with label, input, and error handling
 *
 * @example
 * ```tsx
 * <FormField
 *   id="email"
 *   label="Email Address"
 *   type="email"
 *   value={email}
 *   onChange={setEmail}
 *   error={emailError}
 *   required
 * />
 * ```
 */
export function FormField({
	id,
	label,
	type = 'text',
	value,
	placeholder,
	required = false,
	disabled = false,
	error,
	helperText,
	className,
	onChange,
	onBlur,
}: FormFieldProps) {
	const hasError = Boolean(error)
	const inputId = `${id}-input`
	const errorId = `${id}-error`
	const helperId = `${id}-helper`

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.value)
	}

	return (
		<div className={clsx('space-y-1', className)}>
			{/* Label */}
			<label
				htmlFor={inputId}
				className={clsx(
					'block text-sm font-medium',
					hasError ? 'text-red-700' : 'text-gray-700',
					required && "after:content-['*'] after:ml-0.5 after:text-red-500"
				)}
			>
				{label}
			</label>

			{/* Input */}
			<input
				id={inputId}
				type={type}
				value={value}
				placeholder={placeholder}
				required={required}
				disabled={disabled}
				className={clsx(
					'block w-full px-3 py-2 border rounded-md shadow-sm',
					'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2',
					'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
					'transition-colors duration-200',
					hasError
						? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
						: 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
				)}
				onChange={handleInputChange}
				onBlur={onBlur}
				aria-invalid={hasError}
				aria-describedby={clsx(
					error && errorId,
					helperText && helperId
				)}
			/>

			{/* Helper Text */}
			{helperText && !error && (
				<p
					id={helperId}
					className="text-sm text-gray-600"
				>
					{helperText}
				</p>
			)}

			{/* Error Message */}
			{error && (
				<p
					id={errorId}
					className="text-sm text-red-600"
					role="alert"
					aria-live="polite"
				>
					{error}
				</p>
			)}
		</div>
	)
}
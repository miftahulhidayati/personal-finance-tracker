import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for managing localStorage with TypeScript support
 * Provides state synchronization with localStorage and SSR safety
 *
 * @param key - The localStorage key
 * @param initialValue - The initial value if key doesn't exist
 * @returns A tuple containing the value, setter, and remover
 *
 * @example
 * ```tsx
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')
 * ```
 */
export function useLocalStorage<T>(
	key: string,
	initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
	// State to store the current value
	const [storedValue, setStoredValue] = useState<T>(() => {
		// Return initial value during SSR
		if (typeof window === 'undefined') {
			return initialValue
		}

		try {
			const item = window.localStorage.getItem(key)
			return item ? JSON.parse(item) : initialValue
		} catch (error) {
			console.warn(`Error reading localStorage key "${key}":`, error)
			return initialValue
		}
	})

	// Setter function that updates both state and localStorage
	const setValue = useCallback(
		(value: T | ((val: T) => T)) => {
			try {
				// Allow value to be a function for functional updates
				const valueToStore = value instanceof Function ? value(storedValue) : value

				setStoredValue(valueToStore)

				// Save to localStorage if available
				if (typeof window !== 'undefined') {
					window.localStorage.setItem(key, JSON.stringify(valueToStore))
				}
			} catch (error) {
				console.warn(`Error setting localStorage key "${key}":`, error)
			}
		},
		[key, storedValue]
	)

	// Function to remove the key from localStorage
	const removeValue = useCallback(() => {
		try {
			setStoredValue(initialValue)

			if (typeof window !== 'undefined') {
				window.localStorage.removeItem(key)
			}
		} catch (error) {
			console.warn(`Error removing localStorage key "${key}":`, error)
		}
	}, [key, initialValue])

	// Listen for changes to the localStorage key from other tabs
	useEffect(() => {
		if (typeof window === 'undefined') {
			return
		}

		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === key && e.newValue !== null) {
				try {
					setStoredValue(JSON.parse(e.newValue))
				} catch (error) {
					console.warn(`Error parsing localStorage value for key "${key}":`, error)
				}
			}
		}

		window.addEventListener('storage', handleStorageChange)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
		}
	}, [key])

	return [storedValue, setValue, removeValue]
}
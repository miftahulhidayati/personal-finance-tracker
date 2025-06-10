'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/providers/theme-provider'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
	const { theme, setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="border-neutral-200 dark:border-gray-600 hover:bg-neutral-100 dark:hover:bg-gray-700"
				>
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="bg-white dark:bg-gray-800">
				<DropdownMenuItem
					onClick={() => setTheme('light')}
					className={theme === 'light' ? 'bg-gray-100 dark:bg-gray-700' : ''}
				>
					<Sun className="mr-2 h-4 w-4" />
					Light
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme('dark')}
					className={theme === 'dark' ? 'bg-gray-100 dark:bg-gray-700' : ''}
				>
					<Moon className="mr-2 h-4 w-4" />
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme('system')}
					className={theme === 'system' ? 'bg-gray-100 dark:bg-gray-700' : ''}
				>
					<Sun className="mr-2 h-4 w-4" />
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
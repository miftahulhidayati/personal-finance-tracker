import React from 'react'
import { clsx } from 'clsx'

interface SeparatorProps {
	className?: string
	orientation?: 'horizontal' | 'vertical'
}

export const Separator: React.FC<SeparatorProps> = ({
	className,
	orientation = 'horizontal'
}) => {
	return (
		<div
			className={clsx(
				'bg-border',
				orientation === 'horizontal' ? 'h-[1px] w-full' : 'w-[1px] h-full',
				className
			)}
		/>
	)
}
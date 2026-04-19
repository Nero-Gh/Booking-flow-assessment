'use client'

import { RefreshCw, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

interface RetryButtonProps {
    onClick: () => void
    isLoading?: boolean
    text?: string
    loadingText?: string
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    className?: string
}

const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
}

const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
}

export function RetryButton({
                                onClick,
                                isLoading = false,
                                text = 'Retry',
                                loadingText = 'Retrying...',
                                variant = 'primary',
                                size = 'md',
                                fullWidth = false,
                                className,
                            }: RetryButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isLoading}
            data-testid="retry-button"
            className={clsx(
                'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
                variantClasses[variant],
                sizeClasses[size],
                fullWidth && 'w-full',
                className
            )}
        >
            {isLoading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{loadingText}</span>
                </>
            ) : (
                <>
                    <RefreshCw className="h-4 w-4" />
                    <span>{text}</span>
                </>
            )}
        </button>
    )
}

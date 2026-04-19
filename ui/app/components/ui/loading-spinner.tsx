'use client'

import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    text?: string
    fullScreen?: boolean
    className?: string
}

const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
}

export function LoadingSpinner({
                                   size = 'md',
                                   text,
                                   fullScreen = false,
                                   className
                               }: LoadingSpinnerProps) {
    const spinnerContent = (
        <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
            <Loader2
                className={clsx('animate-spin text-blue-600', sizeClasses[size])}
                data-testid="loading-spinner"
            />
            {text && (
                <p className="text-gray-600 text-sm">{text}</p>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                {spinnerContent}
            </div>
        )
    }

    return spinnerContent
}

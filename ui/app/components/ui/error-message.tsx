'use client'

import { AlertCircle, X } from 'lucide-react'
import { clsx } from 'clsx'

interface ErrorMessageProps {
    title?: string
    message: string
    onRetry?: () => void
    onDismiss?: () => void
    variant?: 'inline' | 'card'
    className?: string
}

export function ErrorMessage({
                                 title = 'Error',
                                 message,
                                 onRetry,
                                 onDismiss,
                                 variant = 'card',
                                 className
                             }: ErrorMessageProps) {
    if (variant === 'inline') {
        return (
            <div
                className={clsx('flex items-start gap-2 text-sm text-red-600', className)}
                data-testid="error-message-inline"
            >
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{message}</span>
            </div>
        )
    }

    return (
        <div
            className={clsx('rounded-lg bg-red-50 p-4', className)}
            data-testid="error-message-card"
        >
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800">{title}</h3>
                    <div className="mt-2 text-sm text-red-700">
                        <p>{message}</p>
                    </div>
                    {(onRetry || onDismiss) && (
                        <div className="mt-4 flex gap-3">
                            {onRetry && (
                                <button
                                    type="button"
                                    onClick={onRetry}
                                    data-testid="error-retry-button"
                                    className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600
                           shadow-sm hover:bg-red-100 focus:outline-none focus:ring-2
                           focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Try again
                                </button>
                            )}
                            {onDismiss && (
                                <button
                                    type="button"
                                    onClick={onDismiss}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-red-700
                           hover:text-red-800 focus:outline-none focus:ring-2
                           focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Dismiss
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {onDismiss && !onRetry && (
                    <div className="ml-auto pl-3">
                        <button
                            type="button"
                            onClick={onDismiss}
                            className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500
                       hover:bg-red-100 focus:outline-none focus:ring-2
                       focus:ring-red-500 focus:ring-offset-2"
                            aria-label="Dismiss"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

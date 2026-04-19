'use client'

import { SearchX, Home, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'

interface EmptyStateProps {
    title: string
    description: string
    icon?: 'search' | 'home' | 'alert'
    action?: {
        label: string
        onClick: () => void
    }
    className?: string
}

const icons = {
    search: SearchX,
    home: Home,
    alert: AlertCircle,
}

export function EmptyState({
                               title,
                               description,
                               icon = 'search',
                               action,
                               className
                           }: EmptyStateProps) {
    const Icon = icons[icon]

    return (
        <div
            className={clsx('text-center py-12', className)}
            data-testid="empty-state"
        >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Icon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">{description}</p>
            {action && (
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={action.onClick}
                        data-testid="empty-state-action"
                        className="inline-flex items-center px-4 py-2 border border-transparent
                     text-sm font-medium rounded-md shadow-sm text-white bg-blue-600
                     hover:bg-blue-700 focus:outline-none focus:ring-2
                     focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {action.label}
                    </button>
                </div>
            )}
        </div>
    )
}

'use client'

import { Lock } from 'lucide-react'
import { clsx } from 'clsx'

interface DisabledBadgeProps {
    reason?: string
    className?: string
}

export function DisabledBadge({ reason, className }: DisabledBadgeProps) {
    return (
        <div
            className={clsx(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
                'bg-gray-100 text-gray-600 text-xs font-medium',
                className
            )}
            data-testid="disabled-badge"
        >
            <Lock className="h-3 w-3" />
            <span>{reason || 'Unavailable'}</span>
        </div>
    )
}

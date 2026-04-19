'use client'

import { clsx } from 'clsx'
import { SkipCard } from './skip-card'
import type { Skip } from '@/app/store/types'

interface SkipGridProps {
    skips: Skip[]
    selectedSkipSize: string | null
    onSelect: (skip: Skip) => void
    loading?: boolean
    className?: string
}

export function SkipGrid({
                             skips,
                             selectedSkipSize,
                             onSelect,
                             loading = false,
                             className
                         }: SkipGridProps) {
    if (skips.length === 0 && !loading) {
        return null
    }

    return (
        <div
            className={clsx(
                'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
                loading && 'opacity-60 pointer-events-none',
                className
            )}
            data-testid="skip-grid"
        >
            {skips.map((skip) => (
                <SkipCard
                    key={skip.size}
                    skip={skip}
                    isSelected={selectedSkipSize === skip.size}
                    onSelect={onSelect}
                />
            ))}
        </div>
    )
}

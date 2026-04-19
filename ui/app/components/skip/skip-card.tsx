'use client'

import {Check, PoundSterling, Ruler, Truck} from 'lucide-react'
import {clsx} from 'clsx'
import {DisabledBadge} from './disabled-badge'
import type {Skip} from '@/app/store/types'

interface SkipCardProps {
    skip: Skip
    isSelected?: boolean
    onSelect: (skip: Skip) => void
    disabled?: boolean
    showPrice?: boolean
}

export function SkipCard({
                             skip,
                             isSelected = false,
                             onSelect,
                             disabled = false,
                             showPrice = true
                         }: SkipCardProps) {
    const isDisabled = skip.disabled || disabled

    const handleClick = () => {
        if (!isDisabled) {
            onSelect(skip)
        }
    }

    return (
        <div
            data-testid={`skip-card-${skip.size}`}
            data-selected={isSelected}
            data-disabled={isDisabled}
            className={clsx(
                'skip-card',
                isDisabled && 'skip-card-disabled',
                !isDisabled && !isSelected && 'skip-card-enabled',
                !isDisabled && isSelected && 'skip-card-selected'
            )}
            onClick={handleClick}
            role="button"
            tabIndex={isDisabled ? -1 : 0}
            aria-disabled={isDisabled}
            aria-label={`${skip.size} skip, £${skip.price}${isDisabled ? ', unavailable' : ''}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleClick()
                }
            }}
        >
            {/* Selection indicator */}
            {!isDisabled && isSelected && (
                <div className="absolute top-3 right-3">
                    <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                    </div>
                </div>
            )}

            {/* Disabled badge */}
            {isDisabled && (
                <div className="absolute top-3 right-3">
                    <DisabledBadge reason={skip.disabled ? "Not available for heavy waste" : undefined} />
                </div>
            )}

            {/* Skip icon */}
            <div className="mb-4">
                <div className={clsx(
                    'w-16 h-16 rounded-lg flex items-center justify-center',
                    isSelected ? 'bg-blue-100' : 'bg-gray-100'
                )}>
                    <Truck className={clsx(
                        'h-8 w-8',
                        isSelected ? 'text-blue-600' : 'text-gray-500'
                    )} />
                </div>
            </div>

            {/* Skip size */}
            <h3 className="text-xl font-bold text-gray-900 mb-1">
                {skip.size}
            </h3>

            {/* Skip dimensions (mock data for realism) */}
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                <Ruler className="h-4 w-4" />
                <span>
          {skip.size === '4-yard' && '5ft x 3ft x 3ft'}
                    {skip.size === '6-yard' && '6ft x 4ft x 3ft'}
                    {skip.size === '8-yard' && '8ft x 4ft x 3ft'}
                    {skip.size === '10-yard' && '9ft x 5ft x 4ft'}
                    {skip.size === '12-yard' && '10ft x 5ft x 4ft'}
                    {skip.size === '14-yard' && '11ft x 5ft x 4ft'}
                    {skip.size === '16-yard' && '12ft x 6ft x 5ft'}
                    {skip.size === '20-yard' && '14ft x 6ft x 5ft'}
        </span>
            </div>

            {/* Price */}
            {showPrice && (
                <div className="mt-auto pt-3 border-t border-gray-200">
                    <div className="flex items-baseline gap-1">
                        <PoundSterling className="h-4 w-4 text-gray-500" />
                        <span className="text-2xl font-bold text-gray-900">
              {skip.price}
            </span>
                        <span className="text-sm text-gray-500">/ week</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Includes VAT
                    </p>
                </div>
            )}

            {/* Selection hint */}
            {!isDisabled && !isSelected && (
                <p className="text-sm text-blue-600 mt-3 font-medium">
                    Click to select
                </p>
            )}

            {!isDisabled && isSelected && (
                <p className="text-sm text-blue-600 mt-3 font-medium">
                    Selected
                </p>
            )}
        </div>
    )
}

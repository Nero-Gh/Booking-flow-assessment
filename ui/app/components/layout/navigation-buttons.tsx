'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'

interface NavigationButtonsProps {
    onBack?: () => void
    onNext?: () => void
    nextLabel?: string
    backLabel?: string
    isNextDisabled?: boolean
    isNextLoading?: boolean
    showBack?: boolean
    showNext?: boolean
    className?: string
}

export function NavigationButtons({
                                      onBack,
                                      onNext,
                                      nextLabel = 'Continue',
                                      backLabel = 'Back',
                                      isNextDisabled = false,
                                      isNextLoading = false,
                                      showBack = true,
                                      showNext = true,
                                      className,
                                  }: NavigationButtonsProps) {
    return (
        <div className={clsx('flex items-center justify-between pt-6 border-t', className)}>
            {showBack ? (
                <button
                    type="button"
                    onClick={onBack}
                    data-testid="navigation-back"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700
                   hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500
                   focus:ring-offset-2 rounded-lg transition-colors"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {backLabel}
                </button>
            ) : (
                <div /> // Spacer for flex alignment
            )}

            {showNext && onNext && (
                <button
                    type="button"
                    onClick={onNext}
                    disabled={isNextDisabled || isNextLoading}
                    data-testid="navigation-next"
                    className={clsx(
                        'inline-flex items-center px-6 py-2 text-sm font-medium rounded-lg',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        'transition-colors',
                        isNextDisabled || isNextLoading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    )}
                >
                    {isNextLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            {nextLabel}
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </>
                    )}
                </button>
            )}
        </div>
    )
}

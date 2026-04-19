'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Info } from 'lucide-react'
import { BookingLayout } from '@/app/components/layout/booking-layout'
import { SkipGrid } from '@/app/components/skip/skip-grid'
import { LoadingSpinner } from '@/app/components/ui/loading-spinner'
import { ErrorMessage } from '@/app/components/ui/error-message'
import { EmptyState } from '@/app/components/ui/empty-state'
import { useBookingStore } from '@/app/store/booking-store'
import {
    useSelectedAddressId,
    useIsWasteTypeSelected,
    useWasteType,
    useAvailableSkips,
    useSelectedSkip,
    useSkipLoading,
    useSkipError,
    useIsSkipSelected,
    useEnabledSkips,
    useDisabledSkips,
} from '@/app/store/selectors'

export default function SkipSelectionPage() {
    const router = useRouter()
    const [hasFetched, setHasFetched] = useState(false)

    const {
        fetchSkips,
        selectSkip,
        markStepComplete,
        goToNextStep,
        clearSkipError,
    } = useBookingStore()

    const selectedAddressId = useSelectedAddressId()
    const isWasteTypeSelected = useIsWasteTypeSelected()
    const wasteType = useWasteType()
    const availableSkips = useAvailableSkips()
    const selectedSkip = useSelectedSkip()
    const isLoading = useSkipLoading()
    const error = useSkipError()
    const isSkipSelected = useIsSkipSelected()
    const enabledSkips = useEnabledSkips()
    const disabledSkips = useDisabledSkips()

    const isHeavyWaste = wasteType === 'heavy'

    // Redirect if prerequisites not met
    useEffect(() => {
        if (!selectedAddressId) {
            router.push('/booking/postcode')
        } else if (!isWasteTypeSelected) {
            router.push('/booking/waste-type')
        }
    }, [selectedAddressId, isWasteTypeSelected, router])

    // Fetch skips on mount
    useEffect(() => {
        if (selectedAddressId && isWasteTypeSelected && !hasFetched) {
            fetchSkips()
            setHasFetched(true)
        }
    }, [selectedAddressId, isWasteTypeSelected, hasFetched, fetchSkips])

    const handleSkipSelect = (skip: typeof availableSkips[0]) => {
        if (!skip.disabled) {
            selectSkip(skip)
        }
    }

    const handleContinue = () => {
        if (isSkipSelected) {
            markStepComplete(3)
            goToNextStep()
            router.push('/booking/review')
        }
    }

    const handleRetry = () => {
        clearSkipError()
        fetchSkips()
    }

    // Don't render if prerequisites not met
    if (!selectedAddressId || !isWasteTypeSelected) {
        return null
    }

    return (
        <BookingLayout
            title="Select your skip size"
            description={`Available skips for your location${isHeavyWaste ? ' (Heavy Waste)' : ''}`}
            showNavigation={true}
            onNext={handleContinue}
            isNextDisabled={!isSkipSelected || isLoading}
            nextLabel="Continue to Review"
        >
            <div className="space-y-6">
                {/* Heavy waste notice */}
                {isHeavyWaste && (
                    <div
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                        data-testid="heavy-waste-notice"
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-yellow-800">
                                    Heavy Waste Notice
                                </h4>
                                <p className="text-sm text-yellow-700 mt-1">
                                    Some skip sizes are not available for heavy waste due to weight restrictions.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading state */}
                {isLoading && (
                    <div className="py-12">
                        <LoadingSpinner
                            size="lg"
                            text="Loading available skips..."
                        />
                    </div>
                )}

                {/* Error state */}
                {error && !isLoading && (
                    <ErrorMessage
                        title="Unable to load skips"
                        message={error}
                        onRetry={handleRetry}
                    />
                )}

                {/* Skip selection */}
                {!isLoading && !error && availableSkips.length > 0 && (
                    <div className="space-y-6">
                        {/* Selected skip summary */}
                        {selectedSkip && (
                            <div
                                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                                data-testid="selected-skip-summary"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-700 font-medium">
                                            Selected Skip
                                        </p>
                                        <p className="text-lg font-bold text-blue-900">
                                            {selectedSkip.size} - £{selectedSkip.price}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleContinue}
                                        data-testid="continue-from-summary"
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg
                             hover:bg-blue-700 focus:outline-none focus:ring-2
                             focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Skip grid */}
                        <SkipGrid
                            skips={availableSkips}
                            selectedSkipSize={selectedSkip?.size || null}
                            onSelect={handleSkipSelect}
                        />

                        {/* Disabled skips info */}
                        {isHeavyWaste && disabledSkips.length > 0 && (
                            <div
                                className="mt-6 p-4 bg-gray-50 rounded-lg"
                                data-testid="disabled-skips-info"
                            >
                                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    Unavailable skip sizes for heavy waste:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {disabledSkips.map((skip) => (
                                        <span
                                            key={skip.size}
                                            className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-full"
                                            data-testid={`disabled-skip-${skip.size}`}
                                        >
                      {skip.size}
                    </span>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-3">
                                    These sizes cannot be used for heavy waste due to weight restrictions.
                                    Please select an available size.
                                </p>
                            </div>
                        )}

                        {/* Available skips count */}
                        <div
                            className="text-sm text-gray-500"
                            data-testid="skips-count"
                        >
                            Showing {enabledSkips.length} available skip size{enabledSkips.length !== 1 ? 's' : ''}
                            {isHeavyWaste && ` (${disabledSkips.length} unavailable)`}
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !error && availableSkips.length === 0 && (
                    <EmptyState
                        icon="search"
                        title="No skips available"
                        description="We couldn't find any skips for your location and waste type. Please try a different combination."
                        action={{
                            label: 'Change waste type',
                            onClick: () => router.push('/booking/waste-type'),
                        }}
                    />
                )}
            </div>
        </BookingLayout>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { BookingLayout } from '@/app/components/layout/booking-layout'
import { PostcodeForm } from '@/app/forms/postcode-form'
import { AddressList } from './address-list'
import { LoadingSpinner } from '@/app/components/ui/loading-spinner'
import { ErrorMessage } from '@/app/components/ui/error-message'
import { EmptyState } from '@/app/components/ui/empty-state'
import { RetryButton } from '@/app/components/ui/retry-button'
import { useBookingStore } from '@/app/store/booking-store'
import {
    useAddresses,
    useSelectedAddressId,
    usePostcodeLoading,
    usePostcodeError,
    usePostcodeLookupPerformed,
    useHasAddresses,
} from '@/app/store/selectors'

export default function PostcodePage() {
    const router = useRouter()
    const [hasAttemptedNavigation, setHasAttemptedNavigation] = useState(false)

    const {
        selectAddress,
        markStepComplete,
        goToNextStep,
        retryPostcodeLookup,
    } = useBookingStore()

    const addresses = useAddresses()
    const selectedAddressId = useSelectedAddressId()
    const isLoading = usePostcodeLoading()
    const error = usePostcodeError()
    const lookupPerformed = usePostcodeLookupPerformed()
    const hasAddresses = useHasAddresses()

    const showAddressList = lookupPerformed && hasAddresses && !isLoading
    const showEmptyState = lookupPerformed && !hasAddresses && !isLoading && !error
    const showError = error && !isLoading

    // Handle address selection
    const handleAddressSelect = (addressId: string) => {
        selectAddress(addressId)
    }

    // Handle navigation to next step
    const handleContinue = () => {
        if (selectedAddressId) {
            markStepComplete(1)
            goToNextStep()
            router.push('/booking/waste-type')
        }
    }

    // Handle form success (addresses loaded)
    const handleFormSuccess = () => {
        setHasAttemptedNavigation(false)
    }

    // Auto-navigate when address is selected
    useEffect(() => {
        if (selectedAddressId && !hasAttemptedNavigation && showAddressList) {
            setHasAttemptedNavigation(true)

            const timer = setTimeout(() => {
                handleContinue()
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [selectedAddressId, hasAttemptedNavigation, showAddressList])

    return (
        <BookingLayout
            title="Where do you need a skip?"
            description="Enter your postcode to see available skips in your area"
            showNavigation={false}
        >
            <div className="space-y-8">
                {/* Postcode Form */}
                <PostcodeForm onSuccess={handleFormSuccess} />

                {/* Loading State */}
                {isLoading && (
                    <div className="py-12">
                        <LoadingSpinner
                            size="lg"
                            text="Looking up addresses..."
                            fullScreen={false}
                        />
                    </div>
                )}

                {/* Error State */}
                {showError && (
                    <div className="space-y-4">
                        <ErrorMessage
                            title="Unable to lookup postcode"
                            message={error}
                            onRetry={retryPostcodeLookup}
                        />

                        {/* Special retry state for BS1 4DJ */}
                        {error.includes('500') && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800">
                                            Service temporarily unavailable
                                        </p>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            The service is experiencing issues. Please try again.
                                        </p>
                                        <div className="mt-3">
                                            <RetryButton
                                                onClick={retryPostcodeLookup}
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Address List */}
                {showAddressList && (
                    <div className="pt-4 border-t">
                        <AddressList
                            addresses={addresses}
                            selectedAddressId={selectedAddressId}
                            onSelect={handleAddressSelect}
                        />

                        {/* Manual continue button (fallback for auto-navigation) */}
                        {selectedAddressId && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleContinue}
                                    data-testid="continue-to-waste-type"
                                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg
                           hover:bg-blue-700 focus:outline-none focus:ring-2
                           focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                >
                                    Continue
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {showEmptyState && (
                    <div className="pt-4 border-t">
                        <EmptyState
                            icon="home"
                            title="No addresses found"
                            description={`We couldn't find any addresses for this postcode. Please check the postcode and try again.`}
                            action={{
                                label: 'Try a different postcode',
                                onClick: () => {
                                    document.querySelector<HTMLInputElement>('[data-testid="postcode-input"]')?.focus()
                                },
                            }}
                        />
                    </div>
                )}
            </div>
        </BookingLayout>
    )
}

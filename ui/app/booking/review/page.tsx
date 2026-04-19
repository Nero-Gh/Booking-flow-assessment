'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import { BookingLayout } from '@/app/components/layout/booking-layout'
import { BookingSummary } from '@/app/components/booking/booking-summary'
import { PriceBreakdown } from '@/app/components/booking/price-breakdown'
import { ConfirmationSuccess } from '@/app/components/booking/confirmation-success'
import { ErrorMessage } from '@/app/components/ui/error-message'
import { useBookingStore } from '@/app/store/booking-store'
import {
    useSelectedAddress,
    usePostcode,
    useWasteType,
    usePlasterboardOption,
    useSelectedSkip,
    usePriceBreakdown,
    useIsSubmitting,
    useIsSuccess,
    useConfirmationError,
    useBookingId,
} from '@/app/store/selectors'

export default function ReviewPage() {
    const router = useRouter()
    const [hasConfirmed, setHasConfirmed] = useState(false)

    const {
        confirmBooking,
        resetConfirmation,
        clearConfirmationError,
        resetStore,
        goToStep,
    } = useBookingStore()

    const postcode = usePostcode()
    const selectedAddress = useSelectedAddress()
    const wasteType = useWasteType()
    const plasterboardOption = usePlasterboardOption()
    const selectedSkip = useSelectedSkip()
    const { skipPrice, vat, total } = usePriceBreakdown()
    const isSubmitting = useIsSubmitting()
    const isSuccess = useIsSuccess()
    const confirmationError = useConfirmationError()
    const bookingId = useBookingId()

    // Redirect if prerequisites not met
    useEffect(() => {
        if (!selectedAddress) {
            router.push('/booking/postcode')
        } else if (!wasteType) {
            router.push('/booking/waste-type')
        } else if (!selectedSkip) {
            router.push('/booking/skip-selection')
        }
    }, [selectedAddress, wasteType, selectedSkip, router])

    // Reset confirmation state when leaving page
    useEffect(() => {
        return () => {
            if (!hasConfirmed) {
                resetConfirmation()
            }
        }
    }, [hasConfirmed, resetConfirmation])

    const handleConfirm = async () => {
        clearConfirmationError()
        await confirmBooking()
        setHasConfirmed(true)
    }

    const handleEdit = (step: number) => {
        goToStep(step as 1 | 2 | 3 | 4)
        router.push(
            step === 1 ? '/booking/postcode' :
                step === 2 ? '/booking/waste-type' :
                    '/booking/skip-selection'
        )
    }

    const handleNewBooking = () => {
        resetStore()
        router.push('/booking/postcode')
    }

    const handleRetry = () => {
        clearConfirmationError()
        confirmBooking()
    }

    // Don't render if prerequisites not met
    if (!selectedAddress || !wasteType || !selectedSkip) {
        return null
    }

    // Show success screen
    if (isSuccess && bookingId) {
        return (
            <BookingLayout
                title="Booking Confirmed"
                description="Your skip hire has been successfully booked"
                showNavigation={false}
            >
                <ConfirmationSuccess
                    bookingId={bookingId}
                    onNewBooking={handleNewBooking}
                />
            </BookingLayout>
        )
    }

    return (
        <BookingLayout
            title="Review your booking"
            description="Please review your details before confirming"
            showNavigation={true}
            onNext={handleConfirm}
            isNextDisabled={isSubmitting}
            isNextLoading={isSubmitting}
            nextLabel="Confirm Booking"
        >
            <div className="space-y-8">
                {/* Error display */}
                {confirmationError && (
                    <ErrorMessage
                        title="Booking failed"
                        message={confirmationError}
                        onRetry={handleRetry}
                    />
                )}

                {/* Booking summary */}
                <BookingSummary
                    postcode={postcode}
                    address={selectedAddress}
                    wasteType={wasteType}
                    plasterboardOption={plasterboardOption}
                    skipSize={selectedSkip?.size}
                    skipPrice={selectedSkip?.price}
                />

                {/* Price breakdown */}
                <PriceBreakdown
                    skipPrice={skipPrice}
                    vat={vat}
                    total={total}
                />

                {/* Terms and conditions */}
                <div className="border-t pt-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            defaultChecked
                            data-testid="terms-checkbox"
                            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded
                       focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">
              I confirm that I have read and agree to the{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-700">
                Terms and Conditions
              </a>
                            {' '}and{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </a>
              . I understand that additional charges may apply for prohibited items
              or exceeding the weight limit.
            </span>
                    </label>
                </div>

                {/* Important notice */}
                <div
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                    data-testid="important-notice"
                >
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-blue-900">
                                Important Information
                            </h4>
                            <ul className="mt-2 text-sm text-blue-800 space-y-1">
                                <li>• Delivery will be made within 2-3 working days</li>
                                <li>• Skip must be placed on private property</li>
                                <li>• Permit required for placement on public highway</li>
                                <li>• Maximum hire period is 14 days</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Double submit prevention note */}
                {isSubmitting && (
                    <div
                        className="text-center text-sm text-gray-500"
                        data-testid="submitting-message"
                    >
                        Processing your booking... Please do not refresh the page.
                    </div>
                )}
            </div>
        </BookingLayout>
    )
}

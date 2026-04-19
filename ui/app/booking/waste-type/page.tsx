'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookingLayout } from '@/app/components/layout/booking-layout'
import { WasteTypeForm } from '@/app/forms/waste-type-form'
import { useBookingStore } from '@/app/store/booking-store'
import {
    useSelectedAddressId,
    useIsWasteTypeSelected,
    useShowPlasterboardOptions,
    useIsPlasterboardOptionSelected,
} from '@/app/store/selectors'

export default function WasteTypePage() {
    const router = useRouter()
    const { markStepComplete, goToNextStep } = useBookingStore()

    const selectedAddressId = useSelectedAddressId()
    const isWasteTypeSelected = useIsWasteTypeSelected()
    const showPlasterboardOptions = useShowPlasterboardOptions()
    const isPlasterboardOptionSelected = useIsPlasterboardOptionSelected()

    // Determine if form is complete
    const isFormComplete = isWasteTypeSelected && (
        !showPlasterboardOptions || isPlasterboardOptionSelected
    )

    // Redirect if no address selected
    useEffect(() => {
        if (!selectedAddressId) {
            router.push('/booking/postcode')
        }
    }, [selectedAddressId, router])

    const handleFormSuccess = () => {
        markStepComplete(2)
        goToNextStep()
        router.push('/booking/skip-selection')
    }

    if (!selectedAddressId) {
        return null
    }

    return (
        <BookingLayout
            title="What type of waste?"
            description="Select the type of waste you'll be disposing of"
            showNavigation={false}
        >
            <div className="space-y-6">
                <WasteTypeForm onSuccess={handleFormSuccess} />

                {/* Info box about waste types */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg" data-testid="waste-type-info">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                        Important information
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• General waste: Suitable for household and non-hazardous waste</li>
                        <li>• Heavy waste: For construction materials, soil, and heavy items</li>
                        <li>• Plasterboard: Must be kept separate from other waste types</li>
                    </ul>
                </div>
            </div>
        </BookingLayout>
    )
}

'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useBookingStore } from '@/app/store/booking-store'
import { useCurrentStep } from '@/app/store/selectors'

export default function BookingLayout({
                                          children,
                                      }: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const currentStep = useCurrentStep()

    // Sync URL with current step
    useEffect(() => {
        const stepFromPath = pathname.split('/').pop()
        const stepMap: Record<string, number> = {
            'postcode': 1,
            'waste-type': 2,
            'skip-selection': 3,
            'review': 4,
        }

        const pathStep = stepMap[stepFromPath || '']

        if (pathStep && pathStep !== currentStep) {
            // User navigated directly to a step URL
            useBookingStore.getState().goToStep(pathStep as 1 | 2 | 3 | 4)
        }
    }, [pathname, currentStep])

    return (
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    )
}

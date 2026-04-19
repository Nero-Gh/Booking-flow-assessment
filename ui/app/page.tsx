'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBookingStore } from '@/app/store/booking-store'

export default function HomePage() {
    const router = useRouter()
    const resetStore = useBookingStore((state) => state.resetStore)

    useEffect(() => {

        resetStore()
        router.push('/booking/postcode')
    }, [router, resetStore])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Redirecting to booking flow...</p>
            </div>
        </div>
    )
}

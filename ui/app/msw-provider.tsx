'use client'

import { useEffect, useState } from 'react'
import { initMocks } from '@/app/mocks'

export function MSWProvider({ children }: { children: React.ReactNode }) {
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const init = async () => {
            await initMocks()
            setIsReady(true)
        }

        init()
    }, [])

    if (!isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading mock API...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}

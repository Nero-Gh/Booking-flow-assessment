export async function initMocks() {
    if (typeof window === 'undefined') {
        // Server-side - not needed for this assessment as we're client-side only
        return
    }

    if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
        const { worker } = await import('./browser')

        await worker.start({
            onUnhandledRequest: 'bypass',
            serviceWorker: {
                url: '/mockServiceWorker.js',
            },
        })

        console.log('[MSW] Mocking enabled')
    }
}

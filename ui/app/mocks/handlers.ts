import { http, HttpResponse, delay } from 'msw'
import {
    addressFixtures,
    baseSkips,
    heavyWasteSkips,
    getBs1CallCount,
    incrementBs1CallCount,
    generateBookingId,
} from './fixtures'

// Helper to normalize postcode (remove spaces)
const normalizePostcode = (postcode: string): string => {
    return postcode.replace(/\s+/g, '').toUpperCase()
}

export const handlers = [
    // POST /api/postcode/lookup
    http.post('/api/postcode/lookup', async ({ request }) => {
        const body = (await request.json()) as { postcode: string }
        const normalizedPostcode = normalizePostcode(body.postcode)

        // M1 1AE - Simulate 3 second latency
        if (normalizedPostcode === 'M11AE') {
            await delay(3000)
        }

        // BS1 4DJ - Return 500 error on first call, success on retry
        if (normalizedPostcode === 'BS14DJ') {
            const callCount = getBs1CallCount()
            incrementBs1CallCount()

            if (callCount === 0) {
                return new HttpResponse(null, {
                    status: 500,
                    statusText: 'Internal Server Error',
                })
            }
        }

        // Look up addresses
        const addresses = addressFixtures[body.postcode] || []

        return HttpResponse.json({
            postcode: body.postcode,
            addresses,
        })
    }),

    // POST /api/waste-types
    http.post('/api/waste-types', async ({ request }) => {
        const body = (await request.json()) as {
            heavyWaste: boolean
            plasterboard: boolean
            plasterboardOption: string | null
        }

        // Validate plasterboard option if plasterboard is selected
        if (body.plasterboard && !body.plasterboardOption) {
            return new HttpResponse(
                JSON.stringify({ error: 'Plasterboard option is required' }),
                { status: 400 }
            )
        }

        return HttpResponse.json({ ok: true })
    }),

    // GET /api/skips
    http.get('/api/skips', async ({ request }) => {
        const url = new URL(request.url)
        const heavyWaste = url.searchParams.get('heavyWaste') === 'true'

        // Return heavy waste skips if heavyWaste is true
        const skips = heavyWaste ? heavyWasteSkips : baseSkips

        return HttpResponse.json({ skips })
    }),

    // POST /api/booking/confirm
    http.post('/api/booking/confirm', async ({ request }) => {
        const body = (await request.json()) as {
            postcode: string
            addressId: string
            heavyWaste: boolean
            plasterboard: boolean
            skipSize: string
            price: number
        }

        // Validate required fields
        if (!body.postcode || !body.addressId || !body.skipSize) {
            return new HttpResponse(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400 }
            )
        }

        const bookingId = generateBookingId()

        return HttpResponse.json({
            status: 'success',
            bookingId,
        })
    }),
]

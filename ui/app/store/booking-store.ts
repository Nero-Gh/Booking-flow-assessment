import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { BookingStore, Address, Skip, WasteType, PlasterboardOption } from './types'

// Initial state
const initialState = {
    postcode: {
        postcode: '',
        addresses: [],
        selectedAddressId: null,
        isLoading: false,
        error: null,
        lookupPerformed: false,
    },
    wasteType: {
        wasteType: null,
        plasterboardOption: null,
        isLoading: false,
        error: null,
    },
    skipSelection: {
        availableSkips: [],
        selectedSkip: null,
        isLoading: false,
        error: null,
    },
    confirmation: {
        bookingId: null,
        isSubmitting: false,
        isSuccess: false,
        error: null,
    },
    currentStep: 1 as const,
    completedSteps: [],
}

// Helper to get stored postcode for retry
let lastLookupPostcode = ''

export const useBookingStore = create<BookingStore>()(
    devtools(
        (set, get) => ({
            ...initialState,

            // Postcode actions
            setPostcode: (postcode: string) => {
                set((state) => ({
                    postcode: {
                        ...state.postcode,
                        postcode,
                        error: null,
                    },
                }))
            },

            lookupPostcode: async (postcode: string) => {
                lastLookupPostcode = postcode

                set((state) => ({
                    postcode: {
                        ...state.postcode,
                        isLoading: true,
                        error: null,
                        addresses: [],
                        selectedAddressId: null,
                    },
                }))

                try {
                    const response = await fetch('/api/postcode/lookup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ postcode }),
                    })

                    if (!response.ok) {
                        throw new Error(`Failed to lookup postcode: ${response.status}`)
                    }

                    const data = await response.json()

                    set((state) => ({
                        postcode: {
                            ...state.postcode,
                            postcode: data.postcode,
                            addresses: data.addresses,
                            isLoading: false,
                            lookupPerformed: true,
                            error: data.addresses.length === 0 ? 'No addresses found for this postcode' : null,
                        },
                    }))
                } catch (error) {
                    set((state) => ({
                        postcode: {
                            ...state.postcode,
                            isLoading: false,
                            error: error instanceof Error ? error.message : 'An unexpected error occurred',
                            lookupPerformed: true,
                        },
                    }))
                }
            },

            selectAddress: (addressId: string) => {
                set((state) => {
                    const selectedAddress = state.postcode.addresses.find(addr => addr.id === addressId)
                    if (!selectedAddress) return state

                    return {
                        postcode: {
                            ...state.postcode,
                            selectedAddressId: addressId,
                        },
                    }
                })
            },

            clearPostcodeError: () => {
                set((state) => ({
                    postcode: {
                        ...state.postcode,
                        error: null,
                    },
                }))
            },

            retryPostcodeLookup: async () => {
                const { postcode } = get().postcode
                if (postcode || lastLookupPostcode) {
                    await get().lookupPostcode(postcode || lastLookupPostcode)
                }
            },

            // Waste type actions
            setWasteType: (wasteType: WasteType) => {
                set((state) => ({
                    wasteType: {
                        ...state.wasteType,
                        wasteType,
                        plasterboardOption: wasteType === 'plasterboard' ? state.wasteType.plasterboardOption : null,
                        error: null,
                    },
                }))
            },

            setPlasterboardOption: (option: PlasterboardOption) => {
                set((state) => ({
                    wasteType: {
                        ...state.wasteType,
                        plasterboardOption: option,
                        error: null,
                    },
                }))
            },

            submitWasteType: async () => {
                const { wasteType, plasterboardOption } = get().wasteType

                set((state) => ({
                    wasteType: {
                        ...state.wasteType,
                        isLoading: true,
                        error: null,
                    },
                }))

                try {
                    const response = await fetch('/api/waste-types', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            heavyWaste: wasteType === 'heavy',
                            plasterboard: wasteType === 'plasterboard',
                            plasterboardOption: wasteType === 'plasterboard' ? plasterboardOption : null,
                        }),
                    })

                    if (!response.ok) {
                        const errorData = await response.json()
                        throw new Error(errorData.error || 'Failed to submit waste type')
                    }

                    set((state) => ({
                        wasteType: {
                            ...state.wasteType,
                            isLoading: false,
                        },
                    }))
                } catch (error) {
                    set((state) => ({
                        wasteType: {
                            ...state.wasteType,
                            isLoading: false,
                            error: error instanceof Error ? error.message : 'An unexpected error occurred',
                        },
                    }))
                }
            },

            clearWasteTypeError: () => {
                set((state) => ({
                    wasteType: {
                        ...state.wasteType,
                        error: null,
                    },
                }))
            },

            // Skip selection actions
            fetchSkips: async () => {
                const { postcode } = get().postcode
                const { wasteType } = get().wasteType

                set((state) => ({
                    skipSelection: {
                        ...state.skipSelection,
                        isLoading: true,
                        error: null,
                    },
                }))

                try {
                    const normalizedPostcode = postcode.replace(/\s+/g, '')
                    const response = await fetch(
                        `/api/skips?postcode=${normalizedPostcode}&heavyWaste=${wasteType === 'heavy'}`
                    )

                    if (!response.ok) {
                        throw new Error(`Failed to fetch skips: ${response.status}`)
                    }

                    const data = await response.json()

                    set((state) => ({
                        skipSelection: {
                            ...state.skipSelection,
                            availableSkips: data.skips,
                            isLoading: false,
                        },
                    }))
                } catch (error) {
                    set((state) => ({
                        skipSelection: {
                            ...state.skipSelection,
                            isLoading: false,
                            error: error instanceof Error ? error.message : 'An unexpected error occurred',
                        },
                    }))
                }
            },

            selectSkip: (skip: Skip) => {
                if (skip.disabled) return

                set((state) => ({
                    skipSelection: {
                        ...state.skipSelection,
                        selectedSkip: skip,
                    },
                }))
            },

            clearSkipError: () => {
                set((state) => ({
                    skipSelection: {
                        ...state.skipSelection,
                        error: null,
                    },
                }))
            },

            // Booking confirmation actions
            confirmBooking: async () => {
                const { postcode, selectedAddressId } = get().postcode
                const { wasteType, plasterboardOption } = get().wasteType
                const { selectedSkip } = get().skipSelection

                if (!selectedAddressId || !selectedSkip) {
                    set((state) => ({
                        confirmation: {
                            ...state.confirmation,
                            error: 'Missing required booking information',
                        },
                    }))
                    return
                }

                set((state) => ({
                    confirmation: {
                        ...state.confirmation,
                        isSubmitting: true,
                        error: null,
                    },
                }))

                try {
                    const response = await fetch('/api/booking/confirm', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            postcode,
                            addressId: selectedAddressId,
                            heavyWaste: wasteType === 'heavy',
                            plasterboard: wasteType === 'plasterboard',
                            skipSize: selectedSkip.size,
                            price: selectedSkip.price,
                        }),
                    })

                    if (!response.ok) {
                        const errorData = await response.json()
                        throw new Error(errorData.error || 'Failed to confirm booking')
                    }

                    const data = await response.json()

                    set((state) => ({
                        confirmation: {
                            ...state.confirmation,
                            bookingId: data.bookingId,
                            isSubmitting: false,
                            isSuccess: true,
                        },
                        completedSteps: [...state.completedSteps, 4],
                    }))
                } catch (error) {
                    set((state) => ({
                        confirmation: {
                            ...state.confirmation,
                            isSubmitting: false,
                            error: error instanceof Error ? error.message : 'An unexpected error occurred',
                        },
                    }))
                }
            },

            resetConfirmation: () => {
                set((state) => ({
                    confirmation: {
                        ...initialState.confirmation,
                    },
                }))
            },

            clearConfirmationError: () => {
                set((state) => ({
                    confirmation: {
                        ...state.confirmation,
                        error: null,
                    },
                }))
            },

            // Flow control actions
            goToStep: (step: 1 | 2 | 3 | 4) => {
                set({ currentStep: step })
            },

            goToNextStep: () => {
                const { currentStep, completedSteps } = get()
                const nextStep = (currentStep + 1) as 1 | 2 | 3 | 4

                set({
                    currentStep: nextStep,
                    completedSteps: completedSteps.includes(currentStep)
                        ? completedSteps
                        : [...completedSteps, currentStep],
                })
            },

            goToPreviousStep: () => {
                const { currentStep } = get()
                const prevStep = Math.max(1, currentStep - 1) as 1 | 2 | 3 | 4

                set({ currentStep: prevStep })
            },

            markStepComplete: (step: number) => {
                set((state) => ({
                    completedSteps: state.completedSteps.includes(step)
                        ? state.completedSteps
                        : [...state.completedSteps, step],
                }))
            },

            // Reset actions
            resetStore: () => {
                lastLookupPostcode = ''
                set(initialState)
            },
        }),
        { name: 'booking-store' }
    )
)

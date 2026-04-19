// Address type
export interface Address {
    id: string
    line1: string
    line2?: string
    city: string
    postcode: string
}

// Skip type
export interface Skip {
    size: string
    price: number
    disabled: boolean
}

// Plasterboard options
export type PlasterboardOption = 'bagged' | 'wrapped' | 'loose' | null

// Waste type
export type WasteType = 'general' | 'heavy' | 'plasterboard'

// Postcode lookup state
export interface PostcodeState {
    postcode: string
    addresses: Address[]
    selectedAddressId: string | null
    isLoading: boolean
    error: string | null
    lookupPerformed: boolean
}

// Waste type state
export interface WasteTypeState {
    wasteType: WasteType | null
    plasterboardOption: PlasterboardOption
    isLoading: boolean
    error: string | null
}

// Skip selection state
export interface SkipSelectionState {
    availableSkips: Skip[]
    selectedSkip: Skip | null
    isLoading: boolean
    error: string | null
}

// Booking confirmation state
export interface BookingConfirmationState {
    bookingId: string | null
    isSubmitting: boolean
    isSuccess: boolean
    error: string | null
}

// Complete booking state
export interface BookingState {
    // Step states
    postcode: PostcodeState
    wasteType: WasteTypeState
    skipSelection: SkipSelectionState
    confirmation: BookingConfirmationState

    // Flow control
    currentStep: 1 | 2 | 3 | 4
    completedSteps: number[]
}

// Store actions
export interface BookingActions {
    // Postcode actions
    setPostcode: (postcode: string) => void
    lookupPostcode: (postcode: string) => Promise<void>
    selectAddress: (addressId: string) => void
    clearPostcodeError: () => void
    retryPostcodeLookup: () => Promise<void>

    // Waste type actions
    setWasteType: (wasteType: WasteType) => void
    setPlasterboardOption: (option: PlasterboardOption) => void
    submitWasteType: () => Promise<void>
    clearWasteTypeError: () => void

    // Skip selection actions
    fetchSkips: () => Promise<void>
    selectSkip: (skip: Skip) => void
    clearSkipError: () => void

    // Booking confirmation actions
    confirmBooking: () => Promise<void>
    resetConfirmation: () => void
    clearConfirmationError: () => void

    // Flow control actions
    goToStep: (step: 1 | 2 | 3 | 4) => void
    goToNextStep: () => void
    goToPreviousStep: () => void
    markStepComplete: (step: number) => void

    // Reset actions
    resetStore: () => void
}

// Combined store type
export type BookingStore = BookingState & BookingActions

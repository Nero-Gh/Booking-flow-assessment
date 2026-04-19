import { useBookingStore } from './booking-store'
import type { Address, Skip } from './types'

// Postcode selectors
export const usePostcode = () => useBookingStore((state) => state.postcode.postcode)
export const useAddresses = () => useBookingStore((state) => state.postcode.addresses)
export const useSelectedAddress = (): Address | undefined => {
    const { addresses, selectedAddressId } = useBookingStore((state) => state.postcode)
    return addresses.find(addr => addr.id === selectedAddressId)
}
export const useSelectedAddressId = () => useBookingStore((state) => state.postcode.selectedAddressId)
export const usePostcodeLoading = () => useBookingStore((state) => state.postcode.isLoading)
export const usePostcodeError = () => useBookingStore((state) => state.postcode.error)
export const usePostcodeLookupPerformed = () => useBookingStore((state) => state.postcode.lookupPerformed)
export const useHasAddresses = () => useBookingStore((state) => state.postcode.addresses.length > 0)
export const useIsAddressSelected = () => useBookingStore((state) => state.postcode.selectedAddressId !== null)

// Waste type selectors
export const useWasteType = () => useBookingStore((state) => state.wasteType.wasteType)
export const usePlasterboardOption = () => useBookingStore((state) => state.wasteType.plasterboardOption)
export const useWasteTypeLoading = () => useBookingStore((state) => state.wasteType.isLoading)
export const useWasteTypeError = () => useBookingStore((state) => state.wasteType.error)
export const useIsWasteTypeSelected = () => useBookingStore((state) => state.wasteType.wasteType !== null)
export const useShowPlasterboardOptions = () => useBookingStore((state) => state.wasteType.wasteType === 'plasterboard')
export const useIsPlasterboardOptionSelected = () => {
    const { wasteType, plasterboardOption } = useBookingStore((state) => state.wasteType)
    if (wasteType !== 'plasterboard') return true
    return plasterboardOption !== null
}

// Skip selection selectors
export const useAvailableSkips = () => useBookingStore((state) => state.skipSelection.availableSkips)
export const useSelectedSkip = (): Skip | null => useBookingStore((state) => state.skipSelection.selectedSkip)
export const useSkipLoading = () => useBookingStore((state) => state.skipSelection.isLoading)
export const useSkipError = () => useBookingStore((state) => state.skipSelection.error)
export const useIsSkipSelected = () => useBookingStore((state) => state.skipSelection.selectedSkip !== null)
export const useEnabledSkips = () => {
    const skips = useBookingStore((state) => state.skipSelection.availableSkips)
    return skips.filter(skip => !skip.disabled)
}
export const useDisabledSkips = () => {
    const skips = useBookingStore((state) => state.skipSelection.availableSkips)
    return skips.filter(skip => skip.disabled)
}

// Confirmation selectors
export const useBookingId = () => useBookingStore((state) => state.confirmation.bookingId)
export const useIsSubmitting = () => useBookingStore((state) => state.confirmation.isSubmitting)
export const useIsSuccess = () => useBookingStore((state) => state.confirmation.isSuccess)
export const useConfirmationError = () => useBookingStore((state) => state.confirmation.error)

// Flow control selectors
export const useCurrentStep = () => useBookingStore((state) => state.currentStep)
export const useCompletedSteps = () => useBookingStore((state) => state.completedSteps)
export const useIsStepComplete = (step: number) => {
    const completedSteps = useBookingStore((state) => state.completedSteps)
    return completedSteps.includes(step)
}
export const useCanProceedToNextStep = (): boolean => {
    const state = useBookingStore()

    switch (state.currentStep) {
        case 1:
            return state.postcode.selectedAddressId !== null
        case 2:
            if (state.wasteType.wasteType === 'plasterboard') {
                return state.wasteType.plasterboardOption !== null
            }
            return state.wasteType.wasteType !== null
        case 3:
            return state.skipSelection.selectedSkip !== null && !state.skipSelection.selectedSkip.disabled
        case 4:
            return !state.confirmation.isSubmitting && !state.confirmation.isSuccess
        default:
            return false
    }
}

// Price calculation selectors
export const usePriceBreakdown = () => {
    const selectedSkip = useBookingStore((state) => state.skipSelection.selectedSkip)

    if (!selectedSkip) {
        return { skipPrice: 0, vat: 0, total: 0 }
    }

    const skipPrice = selectedSkip.price
    const vat = skipPrice * 0.2
    const total = skipPrice + vat

    return { skipPrice, vat, total }
}

// Booking summary selectors
export const useBookingSummary = () => {
    const state = useBookingStore()
    const selectedAddress = useSelectedAddress()
    const { total } = usePriceBreakdown()

    return {
        postcode: state.postcode.postcode,
        address: selectedAddress,
        wasteType: state.wasteType.wasteType,
        plasterboardOption: state.wasteType.plasterboardOption,
        selectedSkip: state.skipSelection.selectedSkip,
        totalPrice: total,
        bookingId: state.confirmation.bookingId,
    }
}

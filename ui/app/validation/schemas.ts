import { z } from 'zod'

// UK Postcode regex pattern
// Matches formats: SW1A 1AA, M1 1AE, EC1A 1BB, etc.
const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i

// Postcode validation schema
export const postcodeSchema = z.object({
    postcode: z
        .string()
        .min(1, 'Postcode is required')
        .regex(ukPostcodeRegex, 'Please enter a valid UK postcode')
        .transform((val) => val.toUpperCase().trim()),
})

// Waste type validation schema
export const wasteTypeSchema = z.object({
    wasteType: z.enum(['general', 'heavy', 'plasterboard']),
}).refine((data) => data.wasteType !== undefined, {
    message: 'Please select a waste type',
    path: ['wasteType'],
})

// Plasterboard options validation schema
export const plasterboardSchema = z.object({
    plasterboardOption: z.enum(['bagged', 'wrapped', 'loose']),
}).refine((data) => data.plasterboardOption !== undefined, {
    message: 'Please select how your plasterboard will be prepared',
    path: ['plasterboardOption'],
})

// Combined waste type schema with conditional validation
export const wasteTypeWithPlasterboardSchema = z
    .object({
        wasteType: z.enum(['general', 'heavy', 'plasterboard']),
        plasterboardOption: z.enum(['bagged', 'wrapped', 'loose']).nullable(),
    })
    .refine(
        (data) => {
            // If waste type is plasterboard, plasterboardOption must be selected
            if (data.wasteType === 'plasterboard') {
                return data.plasterboardOption !== null
            }
            return true
        },
        {
            message: 'Plasterboard option is required when selecting plasterboard waste',
            path: ['plasterboardOption'],
        }
    )
    .refine((data) => data.wasteType !== undefined, {
        message: 'Please select a waste type',
        path: ['wasteType'],
    })

// Address selection validation
export const addressSelectionSchema = z.object({
    addressId: z.string().min(1, 'Please select an address'),
})

// Skip selection validation
export const skipSelectionSchema = z.object({
    skipSize: z.string().min(1, 'Please select a skip size'),
})

// Complete booking validation schema
export const bookingSchema = z.object({
    postcode: z.string().regex(ukPostcodeRegex, 'Invalid postcode format'),
    addressId: z.string().min(1, 'Address is required'),
    wasteType: z.enum(['general', 'heavy', 'plasterboard']),
    plasterboardOption: z.enum(['bagged', 'wrapped', 'loose']).nullable(),
    skipSize: z.string().min(1, 'Skip size is required'),
    price: z.number().positive('Price must be positive'),
})

// Export inferred types
export type PostcodeFormData = z.infer<typeof postcodeSchema>
export type WasteTypeFormData = z.infer<typeof wasteTypeSchema>
export type PlasterboardFormData = z.infer<typeof plasterboardSchema>
export type WasteTypeWithPlasterboardFormData = z.infer<typeof wasteTypeWithPlasterboardSchema>
export type AddressSelectionFormData = z.infer<typeof addressSelectionSchema>
export type SkipSelectionFormData = z.infer<typeof skipSelectionSchema>
export type BookingFormData = z.infer<typeof bookingSchema>

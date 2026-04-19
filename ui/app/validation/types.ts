import {
    PostcodeFormData,
    WasteTypeFormData,
    PlasterboardFormData,
    WasteTypeWithPlasterboardFormData,
    AddressSelectionFormData,
    SkipSelectionFormData,
    BookingFormData,
} from './schemas'

export type {
    PostcodeFormData,
    WasteTypeFormData,
    PlasterboardFormData,
    WasteTypeWithPlasterboardFormData,
    AddressSelectionFormData,
    SkipSelectionFormData,
    BookingFormData,
}

// Form field error type
export interface FieldError {
    message: string
    type?: string
}

// Form state type
export interface FormState<T> {
    values: T
    errors: Record<keyof T, FieldError | undefined>
    isSubmitting: boolean
    isValid: boolean
    isDirty: boolean
}

// Validation result type
export interface ValidationResult<T> {
    success: boolean
    data?: T
    errors?: Record<string, FieldError>
}

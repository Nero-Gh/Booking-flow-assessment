'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2, Hammer, Package, AlertCircle, Loader2 } from 'lucide-react'
import {
    wasteTypeWithPlasterboardSchema,
    type WasteTypeWithPlasterboardFormData
} from '@/app/validation/schemas'
import { useBookingStore } from '@/app/store/booking-store'
import {
    useWasteType,
    usePlasterboardOption,
    useWasteTypeLoading,
    useWasteTypeError
} from '@/app/store/selectors'
import { PlasterboardOptions } from './plasterboard-options'

interface WasteTypeFormProps {
    onSuccess?: () => void
}

export function WasteTypeForm({ onSuccess }: WasteTypeFormProps) {
    const {
        setWasteType,
        setPlasterboardOption,
        submitWasteType,
        clearWasteTypeError
    } = useBookingStore()

    const currentWasteType = useWasteType()
    const currentPlasterboardOption = usePlasterboardOption()
    const isLoading = useWasteTypeLoading()
    const storeError = useWasteTypeError()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid },
        trigger,
    } = useForm<WasteTypeWithPlasterboardFormData>({
        resolver: zodResolver(wasteTypeWithPlasterboardSchema),
        mode: 'onChange',
        defaultValues: {
            wasteType: currentWasteType || undefined,
            plasterboardOption: currentPlasterboardOption || null,
        },
    })

    const selectedWasteType = watch('wasteType')
    const showPlasterboardOptions = selectedWasteType === 'plasterboard'

    // Sync form with store
    useEffect(() => {
        if (currentWasteType && currentWasteType !== selectedWasteType) {
            setValue('wasteType', currentWasteType)
        }
        if (currentPlasterboardOption) {
            setValue('plasterboardOption', currentPlasterboardOption)
        }
    }, [currentWasteType, currentPlasterboardOption, selectedWasteType, setValue])

    // Update store when waste type changes
    const handleWasteTypeChange = (value: 'general' | 'heavy' | 'plasterboard') => {
        setValue('wasteType', value)
        setWasteType(value)
        clearWasteTypeError()

        // Clear plasterboard option if not plasterboard
        if (value !== 'plasterboard') {
            setValue('plasterboardOption', null)
            setPlasterboardOption(null)
        }

        trigger()
    }

    // Update store when plasterboard option changes
    const handlePlasterboardOptionChange = (value: 'bagged' | 'wrapped' | 'loose') => {
        setValue('plasterboardOption', value)
        setPlasterboardOption(value)
        trigger()
    }

    const onSubmit = async (data: WasteTypeWithPlasterboardFormData) => {
        setIsSubmitting(true)

        try {
            await submitWasteType()

            // Check if submission was successful
            const state = useBookingStore.getState()
            if (!state.wasteType.error) {
                onSuccess?.()
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const isFormSubmitting = isLoading || isSubmitting

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                    Select waste type
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* General Waste */}
                    <div
                        data-testid="waste-type-general"
                        className={`
              relative flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer
              transition-all hover:shadow-md
              ${selectedWasteType === 'general'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }
            `}
                        onClick={() => handleWasteTypeChange('general')}
                    >
                        <input
                            type="radio"
                            {...register('wasteType')}
                            value="general"
                            className="sr-only"
                            aria-label="General Waste"
                        />
                        <Trash2 className={`h-8 w-8 mb-3 ${selectedWasteType === 'general' ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="font-medium text-gray-900">General Waste</span>
                        <span className="text-sm text-gray-500 mt-1">Household & general items</span>
                        {selectedWasteType === 'general' && (
                            <div className="absolute top-2 right-2 h-4 w-4 bg-blue-500 rounded-full" />
                        )}
                    </div>

                    {/* Heavy Waste */}
                    <div
                        data-testid="waste-type-heavy"
                        className={`
              relative flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer
              transition-all hover:shadow-md
              ${selectedWasteType === 'heavy'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }
            `}
                        onClick={() => handleWasteTypeChange('heavy')}
                    >
                        <input
                            type="radio"
                            {...register('wasteType')}
                            value="heavy"
                            className="sr-only"
                            aria-label="Heavy Waste"
                        />
                        <Hammer className={`h-8 w-8 mb-3 ${selectedWasteType === 'heavy' ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="font-medium text-gray-900">Heavy Waste</span>
                        <span className="text-sm text-gray-500 mt-1">Construction & heavy materials</span>
                        {selectedWasteType === 'heavy' && (
                            <div className="absolute top-2 right-2 h-4 w-4 bg-blue-500 rounded-full" />
                        )}
                    </div>

                    {/* Plasterboard */}
                    <div
                        data-testid="waste-type-plasterboard"
                        className={`
              relative flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer
              transition-all hover:shadow-md
              ${selectedWasteType === 'plasterboard'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }
            `}
                        onClick={() => handleWasteTypeChange('plasterboard')}
                    >
                        <input
                            type="radio"
                            {...register('wasteType')}
                            value="plasterboard"
                            className="sr-only"
                            aria-label="Plasterboard"
                        />
                        <Package className={`h-8 w-8 mb-3 ${selectedWasteType === 'plasterboard' ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="font-medium text-gray-900">Plasterboard</span>
                        <span className="text-sm text-gray-500 mt-1">Gypsum & plasterboard waste</span>
                        {selectedWasteType === 'plasterboard' && (
                            <div className="absolute top-2 right-2 h-4 w-4 bg-blue-500 rounded-full" />
                        )}
                    </div>
                </div>

                {errors.wasteType && (
                    <div
                        className="mt-2 flex items-start gap-2 text-sm text-red-600"
                        data-testid="waste-type-validation-error"
                    >
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{errors.wasteType.message}</span>
                    </div>
                )}
            </div>

            {/* Plasterboard Options */}
            {showPlasterboardOptions && (
                <PlasterboardOptions
                    selectedOption={currentPlasterboardOption}
                    onSelect={handlePlasterboardOptionChange}
                    error={errors.plasterboardOption?.message}
                />
            )}

            {/* Store Error */}
            {storeError && (
                <div
                    className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg"
                    data-testid="waste-type-api-error"
                >
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{storeError}</span>
                </div>
            )}

            <button
                type="submit"
                data-testid="waste-type-submit"
                disabled={!isValid || isFormSubmitting}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg
                 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
                {isFormSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </span>
                ) : (
                    'Continue to Skip Selection'
                )}
            </button>
        </form>
    )
}

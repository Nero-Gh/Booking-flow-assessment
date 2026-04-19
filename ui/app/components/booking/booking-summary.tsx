'use client'

import { MapPin, Trash2, Truck, Package, AlertCircle } from 'lucide-react'
import type { Address } from '@/app/store/types'

interface BookingSummaryProps {
    postcode: string
    address?: Address
    wasteType: string | null
    plasterboardOption?: string | null
    skipSize?: string
    skipPrice?: number
}

export function BookingSummary({
                                   postcode,
                                   address,
                                   wasteType,
                                   plasterboardOption,
                                   skipSize,
                                   skipPrice,
                               }: BookingSummaryProps) {
    const getWasteTypeLabel = (type: string | null): string => {
        switch (type) {
            case 'general':
                return 'General Waste'
            case 'heavy':
                return 'Heavy Waste'
            case 'plasterboard':
                return 'Plasterboard'
            default:
                return 'Not selected'
        }
    }

    const getPlasterboardOptionLabel = (option: string | null | undefined): string => {
        switch (option) {
            case 'bagged':
                return 'Bagged'
            case 'wrapped':
                return 'Wrapped'
            case 'loose':
                return 'Loose'
            default:
                return 'Not specified'
        }
    }

    return (
        <div className="space-y-6" data-testid="booking-summary">
            {/* Location */}
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Delivery Location</h4>
                    {address ? (
                        <div>
                            <p className="text-base font-medium text-gray-900">{address.line1}</p>
                            {address.line2 && (
                                <p className="text-sm text-gray-600">{address.line2}</p>
                            )}
                            <p className="text-sm text-gray-600">
                                {address.city}, {address.postcode}
                            </p>
                        </div>
                    ) : (
                        <p className="text-base text-gray-900">{postcode}</p>
                    )}
                    <button
                        type="button"
                        data-testid="edit-location"
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Change
                    </button>
                </div>
            </div>

            {/* Waste Type */}
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Trash2 className="h-5 w-5 text-green-600" />
                    </div>
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Waste Type</h4>
                    <p className="text-base font-medium text-gray-900">
                        {getWasteTypeLabel(wasteType)}
                    </p>
                    {wasteType === 'plasterboard' && (
                        <div className="mt-2">
                            <span className="text-sm text-gray-500">Preparation: </span>
                            <span className="text-sm font-medium text-gray-700">
                {getPlasterboardOptionLabel(plasterboardOption)}
              </span>
                        </div>
                    )}
                    <button
                        type="button"
                        data-testid="edit-waste-type"
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Change
                    </button>
                </div>
            </div>

            {/* Skip Selection */}
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Truck className="h-5 w-5 text-purple-600" />
                    </div>
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Selected Skip</h4>
                    {skipSize ? (
                        <div>
                            <p className="text-base font-medium text-gray-900">{skipSize}</p>
                            {skipPrice && (
                                <p className="text-sm text-gray-600">£{skipPrice} per week</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-base text-gray-400">No skip selected</p>
                    )}
                    <button
                        type="button"
                        data-testid="edit-skip"
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Change
                    </button>
                </div>
            </div>

            {/* Warning for plasterboard */}
            {wasteType === 'plasterboard' && (
                <div
                    className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg"
                    data-testid="plasterboard-warning"
                >
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-yellow-800">
                            Plasterboard Notice
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                            Plasterboard must be kept separate from other waste. Additional charges may apply if mixed.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

'use client'

import {Check, MapPin} from 'lucide-react'
import {clsx} from 'clsx'
import type {Address} from '@/app/store/types'

interface AddressListProps {
    addresses: Address[]
    selectedAddressId: string | null
    onSelect: (addressId: string) => void
    disabled?: boolean
}

export function AddressList({
                                addresses,
                                selectedAddressId,
                                onSelect,
                                disabled = false
                            }: AddressListProps) {
    if (addresses.length === 0) {
        return null
    }

    return (
        <div className="space-y-3" data-testid="address-list">
            <label className="block text-sm font-medium text-gray-700">
                Select your address
                <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {addresses.map((address) => {
                    const isSelected = selectedAddressId === address.id

                    return (
                        <div
                            key={address.id}
                            data-testid={`address-${address.id}`}
                            data-selected={isSelected}
                            className={clsx(
                                'relative flex items-start p-4 border-2 rounded-lg cursor-pointer',
                                'transition-all hover:shadow-sm',
                                disabled && 'opacity-50 cursor-not-allowed',
                                isSelected
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            )}
                            onClick={() => !disabled && onSelect(address.id)}
                        >
                            <div className="flex-shrink-0">
                                <MapPin className={clsx(
                                    'h-5 w-5',
                                    isSelected ? 'text-blue-600' : 'text-gray-400'
                                )} />
                            </div>

                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    {address.line1}
                                </p>
                                {address.line2 && (
                                    <p className="text-sm text-gray-500">{address.line2}</p>
                                )}
                                <p className="text-sm text-gray-500">
                                    {address.city}, {address.postcode}
                                </p>
                            </div>

                            {isSelected && (
                                <div className="flex-shrink-0">
                                    <Check className="h-5 w-5 text-blue-600" />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

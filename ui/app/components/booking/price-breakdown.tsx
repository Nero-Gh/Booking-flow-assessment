'use client'

import { PoundSterling, Calculator } from 'lucide-react'
import { clsx } from 'clsx'

interface PriceBreakdownProps {
    skipPrice: number
    vat: number
    total: number
    className?: string
}

export function PriceBreakdown({
                                   skipPrice,
                                   vat,
                                   total,
                                   className
                               }: PriceBreakdownProps) {
    return (
        <div
            className={clsx('bg-gray-50 rounded-lg p-6', className)}
            data-testid="price-breakdown"
        >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-gray-500" />
                Price Breakdown
            </h3>

            <dl className="space-y-3">
                <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600 flex items-center gap-1">
                        <PoundSterling className="h-4 w-4" />
                        Skip hire (per week)
                    </dt>
                    <dd className="text-sm font-medium text-gray-900" data-testid="skip-price">
                        £{skipPrice.toFixed(2)}
                    </dd>
                </div>

                <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">
                        VAT (20%)
                    </dt>
                    <dd className="text-sm font-medium text-gray-900" data-testid="vat-amount">
                        £{vat.toFixed(2)}
                    </dd>
                </div>

                <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <dt className="text-base font-semibold text-gray-900">
                            Total Price
                        </dt>
                        <dd
                            className="text-2xl font-bold text-gray-900"
                            data-testid="total-price"
                        >
                            £{total.toFixed(2)}
                        </dd>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Includes all fees and VAT
                    </p>
                </div>
            </dl>
        </div>
    )
}

'use client'

import { CheckCircle, Calendar, Truck, Printer } from 'lucide-react'

interface ConfirmationSuccessProps {
    bookingId: string
    onNewBooking?: () => void
}

export function ConfirmationSuccess({ bookingId, onNewBooking }: ConfirmationSuccessProps) {
    return (
        <div className="text-center py-8" data-testid="booking-success">
            {/* Success icon */}
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            {/* Success message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Booking Confirmed!
            </h2>
            <p className="text-gray-600 mb-6">
                Your skip hire booking has been successfully confirmed.
            </p>

            {/* Booking reference */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
                <p
                    className="text-3xl font-mono font-bold text-gray-900"
                    data-testid="booking-reference"
                >
                    {bookingId}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Please quote this reference for any inquiries
                </p>
            </div>

            {/* Next steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Delivery Date</p>
                    <p className="text-xs text-gray-500">We'll contact you within 24 hours</p>
                </div>

                <div className="text-center">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Truck className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Delivery Window</p>
                    <p className="text-xs text-gray-500">7:00 AM - 7:00 PM</p>
                </div>

                <div className="text-center">
                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Printer className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Confirmation</p>
                    <p className="text-xs text-gray-500">Email sent to your inbox</p>
                </div>
            </div>

            {/* Actions */}
            {onNewBooking && (
                <button
                    type="button"
                    onClick={onNewBooking}
                    data-testid="new-booking-button"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg
                   hover:bg-blue-700 focus:outline-none focus:ring-2
                   focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    Book Another Skip
                </button>
            )}
        </div>
    )
}

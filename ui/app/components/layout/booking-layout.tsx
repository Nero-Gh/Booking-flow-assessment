'use client'

import { useBookingStore } from '@/app/store/booking-store'
import { useCurrentStep, useCompletedSteps } from '@/app/store/selectors'
import { StepIndicator } from './step-indicator'
import { NavigationButtons } from './navigation-buttons'
import { clsx } from 'clsx'

interface BookingLayoutProps {
    children: React.ReactNode
    title: string
    description?: string
    showNavigation?: boolean
    onNext?: () => void
    onBack?: () => void
    isNextDisabled?: boolean
    isNextLoading?: boolean
    nextLabel?: string
}

export function BookingLayout({
                                  children,
                                  title,
                                  description,
                                  showNavigation = true,
                                  onNext,
                                  onBack,
                                  isNextDisabled = false,
                                  isNextLoading = false,
                                  nextLabel,
                              }: BookingLayoutProps) {
    const currentStep = useCurrentStep()
    const completedSteps = useCompletedSteps()
    const { goToPreviousStep, goToNextStep } = useBookingStore()

    const handleBack = onBack || (() => {
        if (currentStep > 1) {
            goToPreviousStep()
        }
    })

    const handleNext = onNext || (() => {
        if (currentStep < 4) {
            goToNextStep()
        }
    })

    const showBackButton = currentStep > 1

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900" data-testid="page-title">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-2 text-gray-600" data-testid="page-description">
                            {description}
                        </p>
                    )}
                </header>

                {/* Step Indicator */}
                <StepIndicator
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                />

                {/* Main Content */}
                <main className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                    {children}
                </main>

                {/* Navigation */}
                {showNavigation && (
                    <div className="mt-8">
                        <NavigationButtons
                            onBack={handleBack}
                            onNext={handleNext}
                            showBack={showBackButton}
                            isNextDisabled={isNextDisabled}
                            isNextLoading={isNextLoading}
                            nextLabel={nextLabel}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

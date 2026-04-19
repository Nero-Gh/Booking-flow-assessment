'use client'

import { Check } from 'lucide-react'
import { clsx } from 'clsx'

interface Step {
    id: number
    name: string
    description: string
}

const steps: Step[] = [
    { id: 1, name: 'Postcode', description: 'Enter your location' },
    { id: 2, name: 'Waste Type', description: 'Select waste type' },
    { id: 3, name: 'Skip', description: 'Choose skip size' },
    { id: 4, name: 'Review', description: 'Confirm booking' },
]

interface StepIndicatorProps {
    currentStep: number
    completedSteps: number[]
    onStepClick?: (step: number) => void
}

export function StepIndicator({
                                  currentStep,
                                  completedSteps,
                                  onStepClick
                              }: StepIndicatorProps) {
    return (
        <nav aria-label="Progress" className="mb-8">
            <ol className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id)
                    const isCurrent = currentStep === step.id
                    const isClickable = onStepClick && (isCompleted || step.id < currentStep)

                    return (
                        <li
                            key={step.id}
                            className={clsx(
                                'relative flex-1',
                                index !== steps.length - 1 && 'pr-8 sm:pr-0'
                            )}
                        >
                            {/* Connector line */}
                            {index !== steps.length - 1 && (
                                <div
                                    className="absolute top-4 left-0 right-0 hidden sm:block"
                                    aria-hidden="true"
                                >
                                    <div className="h-0.5 w-full bg-gray-200">
                                        <div
                                            className={clsx(
                                                'h-0.5 transition-all duration-300',
                                                isCompleted ? 'bg-blue-600 w-full' : 'w-0'
                                            )}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="relative flex flex-col items-center sm:flex-row sm:items-start">
                                {/* Step circle */}
                                <button
                                    type="button"
                                    onClick={() => isClickable && onStepClick?.(step.id)}
                                    disabled={!isClickable}
                                    data-testid={`step-indicator-${step.id}`}
                                    data-active={isCurrent}
                                    data-completed={isCompleted}
                                    className={clsx(
                                        'relative z-10 flex h-8 w-8 items-center justify-center rounded-full',
                                        'transition-colors duration-200',
                                        isClickable && 'cursor-pointer hover:ring-2 hover:ring-blue-300',
                                        !isClickable && 'cursor-default',
                                        isCompleted && 'bg-blue-600 text-white',
                                        isCurrent && !isCompleted && 'bg-white border-2 border-blue-600 text-blue-600',
                                        !isCompleted && !isCurrent && 'bg-white border-2 border-gray-300 text-gray-400'
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <span className="text-sm font-medium">{step.id}</span>
                                    )}
                                </button>

                                {/* Step text */}
                                <div className="mt-2 sm:mt-0 sm:ml-3 text-center sm:text-left">
                                    <p
                                        className={clsx(
                                            'text-sm font-medium',
                                            isCurrent && 'text-blue-600',
                                            isCompleted && 'text-gray-900',
                                            !isCompleted && !isCurrent && 'text-gray-500'
                                        )}
                                    >
                                        {step.name}
                                    </p>
                                    <p className="text-xs text-gray-500 hidden sm:block">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ol>

            {/* Mobile step description */}
            <div className="mt-4 sm:hidden">
                <p className="text-sm text-gray-600 text-center">
                    {steps[currentStep - 1].description}
                </p>
            </div>
        </nav>
    )
}

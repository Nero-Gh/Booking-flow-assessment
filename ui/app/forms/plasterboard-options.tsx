'use client'

import { Package, Shield, Archive, AlertCircle } from 'lucide-react'

interface PlasterboardOptionsProps {
    selectedOption: 'bagged' | 'wrapped' | 'loose' | null
    onSelect: (option: 'bagged' | 'wrapped' | 'loose') => void
    error?: string
}

const options = [
    {
        id: 'bagged',
        label: 'Bagged',
        description: 'Plasterboard must be bagged in heavy-duty bags',
        icon: Package,
        testId: 'plasterboard-bagged',
    },
    {
        id: 'wrapped',
        label: 'Wrapped',
        description: 'Plasterboard must be wrapped in plastic sheeting',
        icon: Shield,
        testId: 'plasterboard-wrapped',
    },
    {
        id: 'loose',
        label: 'Loose',
        description: 'Plasterboard can be loaded loose (additional fee may apply)',
        icon: Archive,
        testId: 'plasterboard-loose',
    },
] as const

export function PlasterboardOptions({
                                        selectedOption,
                                        onSelect,
                                        error
                                    }: PlasterboardOptionsProps) {
    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
                How will your plasterboard be prepared?
                <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="space-y-3">
                {options.map((option) => {
                    const Icon = option.icon
                    const isSelected = selectedOption === option.id

                    return (
                        <div
                            key={option.id}
                            data-testid={option.testId}
                            className={`
                relative flex items-start p-4 border-2 rounded-lg cursor-pointer
                transition-all hover:shadow-sm
                ${isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }
              `}
                            onClick={() => onSelect(option.id)}
                        >
                            <div className="flex items-center h-5">
                                <input
                                    type="radio"
                                    name="plasterboard-option"
                                    value={option.id}
                                    checked={isSelected}
                                    onChange={() => onSelect(option.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    aria-label={option.label}
                                    data-testid={`${option.testId}-radio`}
                                />
                            </div>

                            <div className="ml-3 flex-1">
                                <div className="flex items-center gap-2">
                                    <Icon className={`h-5 w-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <span className="font-medium text-gray-900">{option.label}</span>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{option.description}</p>
                            </div>

                            {isSelected && (
                                <div className="absolute top-2 right-2 h-4 w-4 bg-blue-500 rounded-full" />
                            )}
                        </div>
                    )
                })}
            </div>

            {error && (
                <div
                    className="flex items-start gap-2 text-sm text-red-600"
                    data-testid="plasterboard-validation-error"
                >
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}

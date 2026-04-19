export interface TestPostcode {
    code: string
    description: string
    expectedAddresses: number
    behavior: string
}

export const testPostcodes: Record<string, TestPostcode> = {
    standard: {
        code: 'SW1A 1AA',
        description: 'Standard postcode with 12 addresses',
        expectedAddresses: 12,
        behavior: 'success',
    },
    empty: {
        code: 'EC1A 1BB',
        description: 'Postcode with no addresses',
        expectedAddresses: 0,
        behavior: 'empty',
    },
    latency: {
        code: 'M1 1AE',
        description: 'Postcode with 3 second latency',
        expectedAddresses: 3,
        behavior: 'latency',
    },
    errorRetry: {
        code: 'BS1 4DJ',
        description: 'Postcode that fails first then succeeds',
        expectedAddresses: 0,
        behavior: 'error-then-success',
    },
}

export interface TestAddress {
    id: string
    line1: string
    city: string
}

export const testAddresses: TestAddress[] = [
    { id: 'addr_1', line1: '10 Downing Street', city: 'London' },
    { id: 'addr_2', line1: '11 Downing Street', city: 'London' },
    { id: 'addr_3', line1: '12 Downing Street', city: 'London' },
]

export interface TestSkip {
    size: string
    price: number
    disabled: boolean
    heavyWasteDisabled: boolean
}

export const testSkips: TestSkip[] = [
    { size: '4-yard', price: 120, disabled: false, heavyWasteDisabled: false },
    { size: '6-yard', price: 150, disabled: false, heavyWasteDisabled: false },
    { size: '8-yard', price: 180, disabled: false, heavyWasteDisabled: false },
    { size: '10-yard', price: 220, disabled: false, heavyWasteDisabled: false },
    { size: '12-yard', price: 260, disabled: false, heavyWasteDisabled: true },
    { size: '14-yard', price: 300, disabled: false, heavyWasteDisabled: true },
    { size: '16-yard', price: 350, disabled: false, heavyWasteDisabled: false },
    { size: '20-yard', price: 420, disabled: false, heavyWasteDisabled: false },
]

export const heavyWasteDisabledSkips = testSkips.filter(s => s.heavyWasteDisabled).map(s => s.size)
export const heavyWasteEnabledSkips = testSkips.filter(s => !s.heavyWasteDisabled).map(s => s.size)

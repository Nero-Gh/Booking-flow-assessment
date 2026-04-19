export interface Address {
    id: string
    line1: string
    line2?: string
    city: string
    postcode: string
}

export interface Skip {
    size: string
    price: number
    disabled: boolean
}

export const addressFixtures: Record<string, Address[]> = {
    'SW1A 1AA': [
        { id: 'addr_1', line1: '10 Downing Street', city: 'London', postcode: 'SW1A 1AA' },
        { id: 'addr_2', line1: '11 Downing Street', city: 'London', postcode: 'SW1A 1AA' },
        { id: 'addr_3', line1: '12 Downing Street', city: 'London', postcode: 'SW1A 1AA' },
        { id: 'addr_4', line1: '1 Whitehall', city: 'London', postcode: 'SW1A 1AA' },
        { id: 'addr_5', line1: '2 Whitehall', city: 'London', postcode: 'SW1A 1AA' },
        { id: 'addr_6', line1: '3 Whitehall', city: 'London', postcode: 'SW1A 1AA' },
        { id: 'addr_7', line1: '4 Whitehall', city: 'London', postcode: 'SW1A 1AA' },
        { id: 'addr_8', line1: '5 Whitehall', city: 'London', postcode: 'SW1A 1AA' },
        { id: 'addr_9', line1: '6 Whitehall', city: 'London', postcode: 'SW1A 1AA' },
        { id: 'addr_10', line1: '7 Whitehall', city: 'London', postcode: 'SW1A 1AA' },
        { id: 'addr_11', line1: '8 Whitehall', city: 'London', postcode: 'SW1A 1AA' },
        { id: 'addr_12', line1: '9 Whitehall', city: 'London', postcode: 'SW1A 1AA' },
    ],
    'EC1A 1BB': [],
    'M1 1AE': [
        { id: 'addr_man_1', line1: '1 Market Street', city: 'Manchester', postcode: 'M1 1AE' },
        { id: 'addr_man_2', line1: '2 Market Street', city: 'Manchester', postcode: 'M1 1AE' },
        { id: 'addr_man_3', line1: '3 Market Street', city: 'Manchester', postcode: 'M1 1AE' },
    ],
}

export const baseSkips: Skip[] = [
    { size: '4-yard', price: 120, disabled: false },
    { size: '6-yard', price: 150, disabled: false },
    { size: '8-yard', price: 180, disabled: false },
    { size: '10-yard', price: 220, disabled: false },
    { size: '12-yard', price: 260, disabled: false },
    { size: '14-yard', price: 300, disabled: false },
    { size: '16-yard', price: 350, disabled: false },
    { size: '20-yard', price: 420, disabled: false },
]

export const heavyWasteSkips: Skip[] = baseSkips.map((skip) => {
    if (skip.size === '12-yard' || skip.size === '14-yard') {
        return { ...skip, disabled: true }
    }
    return skip
})


let bs1CallCount = 0
export const getBs1CallCount = () => bs1CallCount
export const incrementBs1CallCount = () => {
    bs1CallCount++
}
export const resetBs1CallCount = () => {
    bs1CallCount = 0
}

export const generateBookingId = (): string => {
    const prefix = 'BK-'
    const randomNum = Math.floor(10000 + Math.random() * 90000)
    return `${prefix}${randomNum}`
}

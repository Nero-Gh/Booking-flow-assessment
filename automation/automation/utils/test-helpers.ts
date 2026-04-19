import { Page, expect } from '@playwright/test'

// Wait for MSW to be ready
export async function waitForMSW(page: Page): Promise<void> {
    await page.waitForFunction(() => {
        return !document.querySelector('[data-testid="loading-spinner"]') ||
            document.querySelector('[data-testid="loading-spinner"]') === null
    }, { timeout: 10000 })
}

// Fill postcode and submit
export async function fillPostcode(page: Page, postcode: string): Promise<void> {
    await page.getByTestId('postcode-input').fill(postcode)
    await page.getByTestId('postcode-submit').click()
}

// Select an address by index
export async function selectAddress(page: Page, addressId: string): Promise<void> {
    await page.getByTestId(`address-${addressId}`).click()
}

// Select waste type
export async function selectWasteType(page: Page, type: 'general' | 'heavy' | 'plasterboard'): Promise<void> {
    await page.getByTestId(`waste-type-${type}`).click()
}

// Select plasterboard option if applicable
export async function selectPlasterboardOption(page: Page, option: 'bagged' | 'wrapped' | 'loose'): Promise<void> {
    await page.getByTestId(`plasterboard-${option}`).click()
}

// Submit waste type form
export async function submitWasteType(page: Page): Promise<void> {
    await page.getByTestId('waste-type-submit').click()
}

// Select a skip by size
export async function selectSkip(page: Page, size: string): Promise<void> {
    await page.getByTestId(`skip-card-${size}`).click()
}

// Confirm booking
export async function confirmBooking(page: Page): Promise<void> {
    await page.getByTestId('navigation-next').click()
}

// Verify success message
export async function verifyBookingSuccess(page: Page): Promise<void> {
    await expect(page.getByTestId('booking-success')).toBeVisible()
    await expect(page.getByTestId('booking-reference')).toBeVisible()
}

// Verify step indicator
export async function verifyStepIndicator(page: Page, currentStep: number): Promise<void> {
    const step = page.getByTestId(`step-indicator-${currentStep}`)
    await expect(step).toHaveAttribute('data-active', 'true')
}

// Verify address count
export async function verifyAddressCount(page: Page, expectedCount: number): Promise<void> {
    if (expectedCount > 0) {
        await expect(page.getByTestId('address-list')).toBeVisible()
        const addresses = page.locator('[data-testid^="address-"]')
        await expect(addresses).toHaveCount(expectedCount)
    } else {
        await expect(page.getByTestId('empty-state')).toBeVisible()
    }
}

// Verify disabled skips for heavy waste
export async function verifyHeavyWasteDisabledSkips(page: Page): Promise<void> {
    const disabledSkips = page.locator('[data-testid^="disabled-skip-"]')
    await expect(disabledSkips).toHaveCount(2)
    await expect(page.getByTestId('disabled-skip-12-yard')).toBeVisible()
    await expect(page.getByTestId('disabled-skip-14-yard')).toBeVisible()
}

// Verify price breakdown
export async function verifyPriceBreakdown(page: Page, expectedSkipPrice: number): Promise<void> {
    const expectedVat = expectedSkipPrice * 0.2
    const expectedTotal = expectedSkipPrice + expectedVat

    await expect(page.getByTestId('skip-price')).toContainText(`£${expectedSkipPrice.toFixed(2)}`)
    await expect(page.getByTestId('vat-amount')).toContainText(`£${expectedVat.toFixed(2)}`)
    await expect(page.getByTestId('total-price')).toContainText(`£${expectedTotal.toFixed(2)}`)
}

// Wait for loading state to finish
export async function waitForLoading(page: Page): Promise<void> {
    try {
        await page.waitForSelector('[data-testid="loading-spinner"]', {
            state: 'hidden',
            timeout: 5000
        })
    } catch {}
}

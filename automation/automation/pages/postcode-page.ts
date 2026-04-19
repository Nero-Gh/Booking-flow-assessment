import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base-page'

export class PostcodePage extends BasePage {
    constructor(page: Page) {
        super(page)
    }

    get postcodeInput(): Locator {
        return this.page.getByTestId('postcode-input')
    }

    get postcodeSubmit(): Locator {
        return this.page.getByTestId('postcode-submit')
    }

    get postcodeLoading(): Locator {
        return this.page.getByTestId('postcode-loading')
    }

    get validationError(): Locator {
        return this.page.getByTestId('postcode-validation-error')
    }

    get apiError(): Locator {
        return this.page.getByTestId('postcode-api-error')
    }

    get addressList(): Locator {
        return this.page.getByTestId('address-list')
    }

    get emptyState(): Locator {
        return this.page.getByTestId('empty-state')
    }

    get emptyStateAction(): Locator {
        return this.page.getByTestId('empty-state-action')
    }

    get continueButton(): Locator {
        return this.page.getByTestId('continue-to-waste-type')
    }

    // Address locator
    addressItem(addressId: string): Locator {
        return this.page.getByTestId(`address-${addressId}`)
    }

    // Actions
    async goto(): Promise<void> {
        await this.page.goto('/booking/postcode')
        await this.waitForLoad()
    }

    async fillPostcode(postcode: string): Promise<void> {
        await this.postcodeInput.fill(postcode)
    }

    async submitPostcode(): Promise<void> {
        await this.postcodeSubmit.click()
    }

    async lookupPostcode(postcode: string): Promise<void> {
        await this.fillPostcode(postcode)
        await this.submitPostcode()
    }

    async selectAddress(addressId: string): Promise<void> {
        await this.addressItem(addressId).click()
    }

    async continueToWasteType(): Promise<void> {
        await this.continueButton.click()
    }

    async completePostcodeStep(postcode: string, addressId: string): Promise<void> {
        await this.lookupPostcode(postcode)
        await this.waitForLoad()
        await this.selectAddress(addressId)
        await this.continueToWasteType()
    }

    // Assertions
    async verifyAddressCount(expectedCount: number): Promise<void> {
        if (expectedCount > 0) {
            await expect(this.addressList).toBeVisible()
            const addresses = this.page.locator('[data-testid^="address-addr_"]')
            await expect(addresses).toHaveCount(expectedCount)
        } else {
            await expect(this.emptyState).toBeVisible()
        }
    }

    async verifyAddressSelected(addressId: string): Promise<void> {
        await expect(this.addressItem(addressId)).toHaveAttribute('data-selected', 'true')
    }

    async verifyValidationError(message: string): Promise<void> {
        await expect(this.validationError).toBeVisible()
        await expect(this.validationError).toContainText(message)
    }

    async verifyApiError(): Promise<void> {
        await expect(this.apiError).toBeVisible()
    }

    async verifyLoadingState(): Promise<void> {
        await expect(this.postcodeLoading).toBeVisible()
        await expect(this.postcodeSubmit).toBeDisabled()
    }

    async verifyEmptyState(): Promise<void> {
        await expect(this.emptyState).toBeVisible()
        await expect(this.emptyState).toContainText('No addresses found')
    }

    async verifySubmitDisabled(): Promise<void> {
        await expect(this.postcodeSubmit).toBeDisabled()
    }

    async verifySubmitEnabled(): Promise<void> {
        await expect(this.postcodeSubmit).toBeEnabled()
    }
}

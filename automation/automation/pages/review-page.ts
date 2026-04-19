import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base-page'

export class ReviewPage extends BasePage {
    constructor(page: Page) {
        super(page)
    }

    // Locators
    get bookingSummary(): Locator {
        return this.page.getByTestId('booking-summary')
    }

    get priceBreakdown(): Locator {
        return this.page.getByTestId('price-breakdown')
    }

    get skipPrice(): Locator {
        return this.page.getByTestId('skip-price')
    }

    get vatAmount(): Locator {
        return this.page.getByTestId('vat-amount')
    }

    get totalPrice(): Locator {
        return this.page.getByTestId('total-price')
    }

    get termsCheckbox(): Locator {
        return this.page.getByTestId('terms-checkbox')
    }

    get importantNotice(): Locator {
        return this.page.getByTestId('important-notice')
    }

    get plasterboardWarning(): Locator {
        return this.page.getByTestId('plasterboard-warning')
    }

    get editLocation(): Locator {
        return this.page.getByTestId('edit-location')
    }

    get editWasteType(): Locator {
        return this.page.getByTestId('edit-waste-type')
    }

    get editSkip(): Locator {
        return this.page.getByTestId('edit-skip')
    }

    // Actions
    async checkTerms(): Promise<void> {
        if (!(await this.termsCheckbox.isChecked())) {
            await this.termsCheckbox.check()
        }
    }

    async uncheckTerms(): Promise<void> {
        if (await this.termsCheckbox.isChecked()) {
            await this.termsCheckbox.uncheck()
        }
    }

    async confirmBooking(): Promise<void> {
        await this.clickNext()
    }

    async editLocationClick(): Promise<void> {
        await this.editLocation.click()
    }

    async editWasteTypeClick(): Promise<void> {
        await this.editWasteType.click()
    }

    async editSkipClick(): Promise<void> {
        await this.editSkip.click()
    }

    // Assertions
    async verifyBookingSummaryVisible(): Promise<void> {
        await expect(this.bookingSummary).toBeVisible()
    }

    async verifyBookingSummaryContains(text: string): Promise<void> {
        await expect(this.bookingSummary).toContainText(text)
    }

    async verifyPriceBreakdownVisible(): Promise<void> {
        await expect(this.priceBreakdown).toBeVisible()
    }

    async verifySkipPrice(price: number): Promise<void> {
        await expect(this.skipPrice).toContainText(`£${price.toFixed(2)}`)
    }

    async verifyVatAmount(expectedVat: number): Promise<void> {
        await expect(this.vatAmount).toContainText(`£${expectedVat.toFixed(2)}`)
    }

    async verifyTotalPrice(expectedTotal: number): Promise<void> {
        await expect(this.totalPrice).toContainText(`£${expectedTotal.toFixed(2)}`)
    }

    async verifyFullPriceBreakdown(skipPrice: number): Promise<void> {
        const expectedVat = skipPrice * 0.2
        const expectedTotal = skipPrice + expectedVat

        await this.verifySkipPrice(skipPrice)
        await this.verifyVatAmount(expectedVat)
        await this.verifyTotalPrice(expectedTotal)
    }

    async verifyTermsChecked(): Promise<void> {
        await expect(this.termsCheckbox).toBeChecked()
    }

    async verifyTermsUnchecked(): Promise<void> {
        await expect(this.termsCheckbox).not.toBeChecked()
    }

    async verifyImportantNoticeVisible(): Promise<void> {
        await expect(this.importantNotice).toBeVisible()
    }

    async verifyPlasterboardWarningVisible(): Promise<void> {
        await expect(this.plasterboardWarning).toBeVisible()
    }

    async verifyPlasterboardWarningHidden(): Promise<void> {
        await expect(this.plasterboardWarning).not.toBeVisible()
    }

    async verifyConfirmButtonDisabled(): Promise<void> {
        await expect(this.navigationNext).toBeDisabled()
    }

    async verifyConfirmButtonEnabled(): Promise<void> {
        await expect(this.navigationNext).toBeEnabled()
    }
}

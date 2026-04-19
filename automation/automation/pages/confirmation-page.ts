import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base-page'

export class ConfirmationPage extends BasePage {
    constructor(page: Page) {
        super(page)
    }

    // Locators
    get bookingSuccess(): Locator {
        return this.page.getByTestId('booking-success')
    }

    get bookingReference(): Locator {
        return this.page.getByTestId('booking-reference')
    }

    get newBookingButton(): Locator {
        return this.page.getByTestId('new-booking-button')
    }

    // Actions
    async startNewBooking(): Promise<void> {
        await this.newBookingButton.click()
    }

    // Assertions
    async verifyBookingSuccessVisible(): Promise<void> {
        await expect(this.bookingSuccess).toBeVisible()
    }

    async verifyBookingSuccessMessage(): Promise<void> {
        await expect(this.bookingSuccess).toContainText('Booking Confirmed!')
    }

    async verifyBookingReferenceVisible(): Promise<void> {
        await expect(this.bookingReference).toBeVisible()
    }

    async verifyBookingReferenceFormat(): Promise<void> {
        await expect(this.bookingReference).toContainText('BK-')
    }

    async verifyNewBookingButtonVisible(): Promise<void> {
        await expect(this.newBookingButton).toBeVisible()
    }
}

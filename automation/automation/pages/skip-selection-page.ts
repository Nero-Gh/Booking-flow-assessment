import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base-page'

export class SkipSelectionPage extends BasePage {
    constructor(page: Page) {
        super(page)
    }

    // Locators
    get skipGrid(): Locator {
        return this.page.getByTestId('skip-grid')
    }

    get heavyWasteNotice(): Locator {
        return this.page.getByTestId('heavy-waste-notice')
    }

    get selectedSkipSummary(): Locator {
        return this.page.getByTestId('selected-skip-summary')
    }

    get disabledSkipsInfo(): Locator {
        return this.page.getByTestId('disabled-skips-info')
    }

    get skipsCount(): Locator {
        return this.page.getByTestId('skips-count')
    }

    get continueFromSummary(): Locator {
        return this.page.getByTestId('continue-from-summary')
    }

    // Skip card locator
    skipCard(size: string): Locator {
        return this.page.getByTestId(`skip-card-${size}`)
    }

    disabledSkipBadge(size: string): Locator {
        return this.page.getByTestId(`disabled-skip-${size}`)
    }

    // Actions
    async selectSkip(size: string): Promise<void> {
        await this.skipCard(size).click()
    }

    async continueFromSummaryClick(): Promise<void> {
        await this.continueFromSummary.click()
    }

    async completeSkipSelectionStep(skipSize: string): Promise<void> {
        await this.selectSkip(skipSize)
    }

    // Assertions
    async verifySkipGridVisible(): Promise<void> {
        await expect(this.skipGrid).toBeVisible()
    }

    async verifySkipSelected(size: string): Promise<void> {
        await expect(this.skipCard(size)).toHaveAttribute('data-selected', 'true')
    }

    async verifySkipNotSelected(size: string): Promise<void> {
        await expect(this.skipCard(size)).not.toHaveAttribute('data-selected', 'true')
    }

    async verifySkipDisabled(size: string): Promise<void> {
        await expect(this.skipCard(size)).toHaveAttribute('data-disabled', 'true')
    }

    async verifySkipEnabled(size: string): Promise<void> {
        await expect(this.skipCard(size)).toHaveAttribute('data-disabled', 'false')
    }

    async verifyHeavyWasteNoticeVisible(): Promise<void> {
        await expect(this.heavyWasteNotice).toBeVisible()
        await expect(this.heavyWasteNotice).toContainText('Heavy Waste Notice')
    }

    async verifyHeavyWasteNoticeHidden(): Promise<void> {
        await expect(this.heavyWasteNotice).not.toBeVisible()
    }

    async verifyDisabledSkipsInfoVisible(): Promise<void> {
        await expect(this.disabledSkipsInfo).toBeVisible()
        await expect(this.disabledSkipsInfo).toContainText('Unavailable skip sizes for heavy waste')
    }

    async verifyDisabledSkipListed(size: string): Promise<void> {
        await expect(this.disabledSkipBadge(size)).toBeVisible()
    }

    async verifySelectedSummaryVisible(): Promise<void> {
        await expect(this.selectedSkipSummary).toBeVisible()
    }

    async verifySelectedSummaryContains(text: string): Promise<void> {
        await expect(this.selectedSkipSummary).toContainText(text)
    }

    async verifySkipsCountContains(text: string): Promise<void> {
        await expect(this.skipsCount).toContainText(text)
    }

    async verifyNextDisabled(): Promise<void> {
        await expect(this.navigationNext).toBeDisabled()
    }

    async verifyNextEnabled(): Promise<void> {
        await expect(this.navigationNext).toBeEnabled()
    }
}

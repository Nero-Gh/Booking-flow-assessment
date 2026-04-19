import { Page, Locator, expect } from '@playwright/test'

export class BasePage {
    protected readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    // Common locators
    get pageTitle(): Locator {
        return this.page.getByTestId('page-title')
    }

    get pageDescription(): Locator {
        return this.page.getByTestId('page-description')
    }

    get loadingSpinner(): Locator {
        return this.page.getByTestId('loading-spinner')
    }

    get navigationBack(): Locator {
        return this.page.getByTestId('navigation-back')
    }

    get navigationNext(): Locator {
        return this.page.getByTestId('navigation-next')
    }

    get errorMessage(): Locator {
        return this.page.getByTestId('error-message-card')
    }

    get retryButton(): Locator {
        return this.page.getByTestId('retry-button')
    }

    // Common actions
    async waitForLoad(): Promise<void> {
        try {
            await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 })
        } catch {
            // Loading spinner might not be present
        }
    }

    async clickNext(): Promise<void> {
        await this.navigationNext.click()
    }

    async clickBack(): Promise<void> {
        await this.navigationBack.click()
    }

    async verifyStepIndicator(step: number): Promise<void> {
        const stepIndicator = this.page.getByTestId(`step-indicator-${step}`)
        await expect(stepIndicator).toHaveAttribute('data-active', 'true')
    }

    async verifyPageTitle(expectedTitle: string): Promise<void> {
        await expect(this.pageTitle).toContainText(expectedTitle)
    }

    async takeScreenshot(name: string): Promise<void> {
        await this.page.screenshot({ path: `screenshots/${name}.png` })
    }
}

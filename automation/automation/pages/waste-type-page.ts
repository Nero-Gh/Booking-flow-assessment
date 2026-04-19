import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base-page'

export class WasteTypePage extends BasePage {
    constructor(page: Page) {
        super(page)
    }

    // Locators
    get generalWasteOption(): Locator {
        return this.page.getByTestId('waste-type-general')
    }

    get heavyWasteOption(): Locator {
        return this.page.getByTestId('waste-type-heavy')
    }

    get plasterboardOption(): Locator {
        return this.page.getByTestId('waste-type-plasterboard')
    }

    get plasterboardBagged(): Locator {
        return this.page.getByTestId('plasterboard-bagged')
    }

    get plasterboardWrapped(): Locator {
        return this.page.getByTestId('plasterboard-wrapped')
    }

    get plasterboardLoose(): Locator {
        return this.page.getByTestId('plasterboard-loose')
    }

    get submitButton(): Locator {
        return this.page.getByTestId('waste-type-submit')
    }

    get validationError(): Locator {
        return this.page.getByTestId('waste-type-validation-error')
    }

    get apiError(): Locator {
        return this.page.getByTestId('waste-type-api-error')
    }

    get plasterboardValidationError(): Locator {
        return this.page.getByTestId('plasterboard-validation-error')
    }

    get wasteTypeInfo(): Locator {
        return this.page.getByTestId('waste-type-info')
    }

    // Actions
    async selectGeneralWaste(): Promise<void> {
        await this.generalWasteOption.click()
    }

    async selectHeavyWaste(): Promise<void> {
        await this.heavyWasteOption.click()
    }

    async selectPlasterboard(): Promise<void> {
        await this.plasterboardOption.click()
    }

    async selectPlasterboardOption(option: 'bagged' | 'wrapped' | 'loose'): Promise<void> {
        const optionMap = {
            bagged: this.plasterboardBagged,
            wrapped: this.plasterboardWrapped,
            loose: this.plasterboardLoose,
        }
        await optionMap[option].click()
    }

    async submit(): Promise<void> {
        await this.submitButton.click()
    }

    async completeWasteTypeStep(type: 'general' | 'heavy' | 'plasterboard', plasterboardOpt?: 'bagged' | 'wrapped' | 'loose'): Promise<void> {
        switch (type) {
            case 'general':
                await this.selectGeneralWaste()
                break
            case 'heavy':
                await this.selectHeavyWaste()
                break
            case 'plasterboard':
                await this.selectPlasterboard()
                if (plasterboardOpt) {
                    await this.selectPlasterboardOption(plasterboardOpt)
                }
                break
        }
        await this.submit()
    }

    // Assertions
    async verifyWasteTypeSelected(type: 'general' | 'heavy' | 'plasterboard'): Promise<void> {
        const optionMap = {
            general: this.generalWasteOption,
            heavy: this.heavyWasteOption,
            plasterboard: this.plasterboardOption,
        }
        await expect(optionMap[type]).toHaveClass(/border-blue-500/)
    }

    async verifyPlasterboardOptionsVisible(): Promise<void> {
        await expect(this.plasterboardBagged).toBeVisible()
        await expect(this.plasterboardWrapped).toBeVisible()
        await expect(this.plasterboardLoose).toBeVisible()
    }

    async verifyPlasterboardOptionsHidden(): Promise<void> {
        await expect(this.plasterboardBagged).not.toBeVisible()
        await expect(this.plasterboardWrapped).not.toBeVisible()
        await expect(this.plasterboardLoose).not.toBeVisible()
    }

    async verifySubmitDisabled(): Promise<void> {
        await expect(this.submitButton).toBeDisabled()
    }

    async verifySubmitEnabled(): Promise<void> {
        await expect(this.submitButton).toBeEnabled()
    }

    async verifyInfoBoxVisible(): Promise<void> {
        await expect(this.wasteTypeInfo).toBeVisible()
    }
}

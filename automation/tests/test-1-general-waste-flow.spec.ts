import { test, expect } from '@playwright/test'
import { PostcodePage } from '../automation/pages/postcode-page'
import { WasteTypePage } from '../automation/pages/waste-type-page'
import { SkipSelectionPage } from '../automation/pages/skip-selection-page'
import { ReviewPage } from '../automation/pages/review-page'
import { ConfirmationPage } from '../automation/pages/confirmation-page'
import { testPostcodes } from '../automation/fixtures/test-data'

test.describe('General Waste Booking Flow', () => {
    let postcodePage: PostcodePage
    let wasteTypePage: WasteTypePage
    let skipSelectionPage: SkipSelectionPage
    let reviewPage: ReviewPage
    let confirmationPage: ConfirmationPage

    test.beforeEach(async ({ page }) => {
        postcodePage = new PostcodePage(page)
        wasteTypePage = new WasteTypePage(page)
        skipSelectionPage = new SkipSelectionPage(page)
        reviewPage = new ReviewPage(page)
        confirmationPage = new ConfirmationPage(page)

        await page.goto('/')
        await postcodePage.waitForLoad()
    })

    test('should complete general waste booking flow successfully', async ({ page }) => {
        // Step 1: Postcode lookup
        await test.step('Enter postcode and verify address list', async () => {
            await postcodePage.verifyStepIndicator(1)
            await postcodePage.verifyPageTitle('Where do you need a skip?')

            await postcodePage.lookupPostcode(testPostcodes.standard.code)
            await postcodePage.waitForLoad()

            await postcodePage.verifyAddressCount(testPostcodes.standard.expectedAddresses)
        })

        // Step 2: Select address
        await test.step('Select address and navigate to waste type', async () => {
            await postcodePage.selectAddress('addr_1')
            await postcodePage.verifyAddressSelected('addr_1')
            await postcodePage.continueToWasteType()

            await wasteTypePage.verifyPageTitle('What type of waste?')
            await wasteTypePage.verifyStepIndicator(2)
        })

        // Step 3: Select waste type
        await test.step('Select general waste and proceed to skip selection', async () => {
            await wasteTypePage.selectGeneralWaste()
            await wasteTypePage.submit()
            await wasteTypePage.waitForLoad()

            await skipSelectionPage.verifyPageTitle('Select your skip size')
            await skipSelectionPage.verifyStepIndicator(3)
            await skipSelectionPage.verifyHeavyWasteNoticeHidden()
        })

        // Step 4: Select skip
        await test.step('Select 8-yard skip', async () => {
            await skipSelectionPage.verifySkipGridVisible()
            await skipSelectionPage.selectSkip('8-yard')

            await skipSelectionPage.verifySkipSelected('8-yard')
            await skipSelectionPage.verifySelectedSummaryVisible()
            await skipSelectionPage.verifySelectedSummaryContains('8-yard')
        })

        // Step 5: Review booking
        await test.step('Review booking details', async () => {
            await skipSelectionPage.clickNext()

            await reviewPage.verifyPageTitle('Review your booking')
            await reviewPage.verifyStepIndicator(4)
            await reviewPage.verifyBookingSummaryVisible()
            await reviewPage.verifyPriceBreakdownVisible()
            await reviewPage.verifyFullPriceBreakdown(180)

            await reviewPage.verifyBookingSummaryContains('10 Downing Street')
            await reviewPage.verifyBookingSummaryContains('London, SW1A 1AA')
            await reviewPage.verifyBookingSummaryContains('General Waste')
            await reviewPage.verifyBookingSummaryContains('8-yard')
        })

        // Step 6: Confirm booking
        await test.step('Confirm booking and verify success', async () => {
            await reviewPage.checkTerms()
            await reviewPage.confirmBooking()
            await reviewPage.waitForLoad()

            await confirmationPage.verifyBookingSuccessVisible()
            await confirmationPage.verifyBookingSuccessMessage()
            await confirmationPage.verifyBookingReferenceVisible()
            await confirmationPage.verifyBookingReferenceFormat()
        })

        // Step 7: Start new booking
        await test.step('Start new booking', async () => {
            await confirmationPage.startNewBooking()

            await postcodePage.verifyPageTitle('Where do you need a skip?')
            await postcodePage.verifyStepIndicator(1)
        })
    })

    test('should display empty state for postcode with no addresses', async () => {
        await postcodePage.lookupPostcode(testPostcodes.empty.code)
        await postcodePage.waitForLoad()

        await postcodePage.verifyEmptyState()
    })

    test('should handle postcode with 3 second latency', async () => {
        await postcodePage.lookupPostcode(testPostcodes.latency.code)
        await postcodePage.verifyLoadingState()
        await postcodePage.waitForLoad()

        await postcodePage.verifyAddressCount(testPostcodes.latency.expectedAddresses)
    })

    test('should handle error with retry for BS1 4DJ', async () => {
        await postcodePage.lookupPostcode(testPostcodes.errorRetry.code)
        await postcodePage.waitForLoad()

        await postcodePage.verifyApiError()
        await postcodePage.retryButton.click()
        await postcodePage.waitForLoad()

        await postcodePage.verifyEmptyState()
    })

    test('should validate postcode format', async () => {
        await postcodePage.fillPostcode('INVALID')
        await postcodePage.submitPostcode()

        await postcodePage.verifyValidationError('valid UK postcode')
        await postcodePage.verifySubmitDisabled()

        await postcodePage.fillPostcode('')
        await postcodePage.postcodeInput.blur()
        await postcodePage.verifyValidationError('required')
    })

    test('should prevent selecting disabled skips', async () => {
        // Setup with heavy waste to get disabled skips
        await postcodePage.completePostcodeStep(testPostcodes.standard.code, 'addr_1')
        await wasteTypePage.completeWasteTypeStep('heavy')
        await skipSelectionPage.waitForLoad()

        await skipSelectionPage.selectSkip('12-yard')
        await skipSelectionPage.verifySkipNotSelected('12-yard')
        await skipSelectionPage.verifyNextDisabled()

        await skipSelectionPage.selectSkip('8-yard')
        await skipSelectionPage.verifySkipSelected('8-yard')
        await skipSelectionPage.verifyNextEnabled()
    })

    test('should persist state when navigating back', async () => {
        await postcodePage.completePostcodeStep(testPostcodes.standard.code, 'addr_1')
        await wasteTypePage.completeWasteTypeStep('general')
        await skipSelectionPage.waitForLoad()

        await skipSelectionPage.selectSkip('6-yard')
        await skipSelectionPage.clickBack()

        await wasteTypePage.verifyWasteTypeSelected('general')
        await wasteTypePage.submit()
        await skipSelectionPage.waitForLoad()

        await skipSelectionPage.verifySkipSelected('6-yard')
    })
})

import { test } from "@playwright/test";
import {
  heavyWasteDisabledSkips,
  heavyWasteEnabledSkips,
  testPostcodes,
} from "../automation/fixtures/test-data";
import { ConfirmationPage } from "../automation/pages/confirmation-page";
import { PostcodePage } from "../automation/pages/postcode-page";
import { ReviewPage } from "../automation/pages/review-page";
import { SkipSelectionPage } from "../automation/pages/skip-selection-page";
import { WasteTypePage } from "../automation/pages/waste-type-page";

test.describe("Heavy Waste Booking Flow", () => {
  let postcodePage: PostcodePage;
  let wasteTypePage: WasteTypePage;
  let skipSelectionPage: SkipSelectionPage;
  let reviewPage: ReviewPage;
  let confirmationPage: ConfirmationPage;

  test.beforeEach(async ({ page }) => {
    postcodePage = new PostcodePage(page);
    wasteTypePage = new WasteTypePage(page);
    skipSelectionPage = new SkipSelectionPage(page);
    reviewPage = new ReviewPage(page);
    confirmationPage = new ConfirmationPage(page);

    await page.goto("/");
    await postcodePage.waitForLoad();

    await postcodePage.completePostcodeStep(
      testPostcodes.standard.code,
      "addr_1",
    );
  });

  test("should complete heavy waste booking flow with disabled skips", async () => {
    // Step 1: Select heavy waste
    await test.step("Select heavy waste type", async () => {
      await wasteTypePage.verifyStepIndicator(2);
      await wasteTypePage.selectHeavyWaste();
      await wasteTypePage.verifyWasteTypeSelected("heavy");
      await wasteTypePage.submit();
      await wasteTypePage.waitForLoad();
    });

    // Step 2: Verify heavy waste notice and disabled skips
    await test.step("Verify heavy waste notice and disabled skips", async () => {
      await skipSelectionPage.verifyStepIndicator(3);
      await skipSelectionPage.verifyHeavyWasteNoticeVisible();
      await skipSelectionPage.verifyDisabledSkipsInfoVisible();

      for (const disabledSize of heavyWasteDisabledSkips) {
        await skipSelectionPage.verifySkipDisabled(disabledSize);
      }

      for (const enabledSize of heavyWasteEnabledSkips.slice(0, 3)) {
        await skipSelectionPage.verifySkipEnabled(enabledSize);
      }
    });

    // Step 3: Select available skip
    await test.step("Select available skip for heavy waste", async () => {
      await skipSelectionPage.selectSkip("12-yard");
      await skipSelectionPage.verifySkipNotSelected("12-yard");

      await skipSelectionPage.selectSkip("8-yard");
      await skipSelectionPage.verifySkipSelected("8-yard");
      await skipSelectionPage.verifySelectedSummaryVisible();
      await skipSelectionPage.verifySelectedSummaryContains("8-yard");
    });

    // Step 4: Review booking
    await test.step("Review heavy waste booking", async () => {
      await skipSelectionPage.clickNext();

      await reviewPage.verifyStepIndicator(4);
      await reviewPage.verifyBookingSummaryVisible();
      await reviewPage.verifyBookingSummaryContains("Heavy Waste");
      await reviewPage.verifyFullPriceBreakdown(180);
    });

    // Step 5: Confirm booking
    await test.step("Confirm heavy waste booking", async () => {
      await reviewPage.checkTerms();
      await reviewPage.confirmBooking();
      await reviewPage.waitForLoad();

      await confirmationPage.verifyBookingSuccessVisible();
    });
  });

  test("should show disabled skips info section", async () => {
    await wasteTypePage.completeWasteTypeStep("heavy");
    await skipSelectionPage.waitForLoad();

    await skipSelectionPage.verifyDisabledSkipsInfoVisible();

    for (const disabledSize of heavyWasteDisabledSkips) {
      await skipSelectionPage.verifyDisabledSkipListed(disabledSize);
    }

    await skipSelectionPage.verifySkipsCountContains("2 unavailable");
  });

  test("should prevent navigation when no valid skip selected", async () => {
    await wasteTypePage.completeWasteTypeStep("heavy");
    await skipSelectionPage.waitForLoad();

    await skipSelectionPage.verifyNextDisabled();
    await skipSelectionPage.selectSkip("4-yard");
    await skipSelectionPage.verifyNextEnabled();
  });

  test("should maintain heavy waste state when navigating back", async () => {
    await wasteTypePage.completeWasteTypeStep("heavy");
    await skipSelectionPage.waitForLoad();

    await skipSelectionPage.selectSkip("10-yard");
    await skipSelectionPage.clickBack();

    await wasteTypePage.verifyWasteTypeSelected("heavy");
    await wasteTypePage.submit();
    await skipSelectionPage.waitForLoad();

    await skipSelectionPage.verifySkipSelected("10-yard");
  });

  test("should show correct price for heavy waste skip", async () => {
    await wasteTypePage.completeWasteTypeStep("heavy");
    await skipSelectionPage.waitForLoad();

    await skipSelectionPage.selectSkip("16-yard");
    await skipSelectionPage.clickNext();

    await reviewPage.verifyFullPriceBreakdown(350);
    await reviewPage.verifyTotalPrice(420);
  });
});

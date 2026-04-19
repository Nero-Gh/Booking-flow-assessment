# Manual Test Cases - Booking Flow Assessment

## Test Environment Setup
- URL: `http://localhost:3000`
- Browser: Chrome, Firefox, Safari (latest versions)
- Viewport: Desktop (1920x1080) and Mobile (375x667)
- Mock API: MSW enabled

## Test Data Reference

| Postcode | Behavior | Expected Result |
|----------|----------|-----------------|
| SW1A 1AA | Success | 12 addresses returned |
| EC1A 1BB | Empty | 0 addresses, empty state |
| M1 1AE | Latency | 3 second delay, 3 addresses |
| BS1 4DJ | Error/Retry | 500 error first, success on retry |

---

## 1. Positive Test Cases

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| TC-001 | Complete General Waste Flow | 1. Enter postcode SW1A 1AA<br>2. Select address addr_1<br>3. Select General Waste<br>4. Select 8-yard skip<br>5. Review booking<br>6. Confirm booking | Booking confirmed with BK-XXXXX reference. Success message displayed. | High |
| TC-002 | Complete Heavy Waste Flow | 1. Enter postcode SW1A 1AA<br>2. Select address addr_1<br>3. Select Heavy Waste<br>4. Select 8-yard skip<br>5. Review booking<br>6. Confirm booking | Heavy waste notice displayed. 12-yard and 14-yard skips disabled. Booking confirmed successfully. | High |
| TC-003 | Complete Plasterboard Flow (Bagged) | 1. Enter postcode SW1A 1AA<br>2. Select address<br>3. Select Plasterboard<br>4. Select Bagged option<br>5. Select 6-yard skip<br>6. Confirm booking | Plasterboard options displayed. Bagged selected. Warning shown on review page. Booking confirmed. | High |
| TC-004 | Complete Plasterboard Flow (Wrapped) | 1. Enter postcode SW1A 1AA<br>2. Select address<br>3. Select Plasterboard<br>4. Select Wrapped option<br>5. Select 6-yard skip<br>6. Confirm booking | Wrapped option selected. Warning shown on review. Booking confirmed. | High |
| TC-005 | Complete Plasterboard Flow (Loose) | 1. Enter postcode SW1A 1AA<br>2. Select address<br>3. Select Plasterboard<br>4. Select Loose option<br>5. Select 6-yard skip<br>6. Confirm booking | Loose option selected. Warning shown on review. Booking confirmed. | High |
| TC-006 | Select Different Skip Sizes | 1. Complete steps 1-2<br>2. Select 4-yard skip<br>3. Change to 20-yard skip | Skip selection updates. Selected summary reflects new skip. Price updates accordingly. | Medium |
| TC-007 | Navigate Back and Forward | 1. Complete to step 3<br>2. Click Back to waste type<br>3. Click Next to return | State persists. Previous selections maintained. No data loss. | Medium |
| TC-008 | Edit from Review Page - Location | 1. Complete to review page<br>2. Click Change on location<br>3. Select different address<br>4. Return to review | Address updates correctly. Summary reflects new address. | Medium |
| TC-009 | Edit from Review Page - Waste Type | 1. Complete to review page<br>2. Click Change on waste type<br>3. Change from General to Heavy<br>4. Return to skip selection<br>5. Select valid skip<br>6. Return to review | Waste type updated. Skip selection reset. Heavy waste notice displayed. | Medium |
| TC-010 | Edit from Review Page - Skip | 1. Complete to review page<br>2. Click Change on skip<br>3. Select different skip<br>4. Return to review | Skip updated. Price breakdown reflects new skip price. | Medium |
| TC-011 | Start New Booking After Success | 1. Complete full flow<br>2. Click "Book Another Skip" | Returns to postcode page. Form reset. Step indicator at step 1. | Medium |
| TC-012 | View All 12 Addresses | 1. Enter SW1A 1AA<br>2. Wait for response | All 12 addresses displayed. Scrollable list visible. | Low |
| TC-013 | Verify Price Calculation | 1. Select 8-yard skip (£180)<br>2. Navigate to review | Skip price: £180.00<br>VAT: £36.00<br>Total: £216.00 | High |
| TC-014 | Verify All Skip Sizes Displayed | 1. Complete to skip selection | All 8 skip sizes displayed (4, 6, 8, 10, 12, 14, 16, 20-yard) | Medium |
| TC-015 | Terms Checkbox Required | 1. Complete to review<br>2. Uncheck terms<br>3. Attempt to confirm | Confirm button disabled. Cannot proceed without accepting terms. | High |

---

## 2. Negative Test Cases

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| TC-016 | Empty Postcode Submission | 1. Leave postcode empty<br>2. Click Find Address | Validation error: "Postcode is required". Submit button disabled. | High |
| TC-017 | Invalid Postcode Format - Letters Only | 1. Enter "ABCDEFG"<br>2. Click Find Address | Validation error: "Please enter a valid UK postcode" | High |
| TC-018 | Invalid Postcode Format - Numbers Only | 1. Enter "123456"<br>2. Click Find Address | Validation error: "Please enter a valid UK postcode" | Medium |
| TC-019 | Invalid Postcode Format - Special Characters | 1. Enter "SW1A@£$"<br>2. Click Find Address | Validation error: "Please enter a valid UK postcode" | Low |
| TC-020 | No Waste Type Selected | 1. Complete postcode step<br>2. Attempt to continue without selecting waste type | Continue button disabled. Cannot proceed. | High |
| TC-021 | Plasterboard Without Option | 1. Select Plasterboard<br>2. Attempt to continue without selecting option | Validation error displayed. Continue button disabled. | High |
| TC-022 | No Skip Selected | 1. Complete to skip selection<br>2. Attempt to continue without selecting skip | Next button disabled. Cannot proceed. | High |
| TC-023 | Attempt to Select Disabled Skip | 1. Select Heavy Waste<br>2. Click 12-yard skip | Skip not selected. No visual selection state. Next button remains disabled. | High |
| TC-024 | Terms Not Accepted | 1. Complete to review<br>2. Uncheck terms checkbox<br>3. Click Confirm Booking | Confirm button disabled. Cannot submit booking. | High |
| TC-025 | Missing Address Selection | 1. Enter valid postcode<br>2. Wait for addresses<br>3. Attempt to continue without selecting | Continue button not visible or disabled. Must select address. | Medium |

---

## 3. Edge Cases

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| TC-026 | Empty Address List (EC1A 1BB) | 1. Enter EC1A 1BB<br>2. Submit | Empty state displayed. "No addresses found" message. Option to try different postcode. | High |
| TC-027 | Postcode with 3s Latency (M1 1AE) | 1. Enter M1 1AE<br>2. Submit | Loading spinner visible for 3 seconds. Submit button disabled during load. Addresses appear after delay. | High |
| TC-028 | API Error with Retry (BS1 4DJ) | 1. Enter BS1 4DJ<br>2. Submit | Error message on first attempt. Retry button visible. Second attempt succeeds. | High |
| TC-029 | Heavy Waste - Two Skips Disabled | 1. Select Heavy Waste<br>2. View available skips | 12-yard and 14-yard skips show as disabled. Disabled badge visible. | High |
| TC-030 | Switch Between Waste Types | 1. Select General Waste<br>2. Switch to Heavy Waste<br>3. Switch to Plasterboard | UI updates correctly. Plasterboard options appear/hide appropriately. | Medium |
| TC-031 | Rapid Postcode Submission | 1. Enter SW1A 1AA<br>2. Rapidly click submit multiple times | Only one request sent. Submit button disabled during request. | Medium |
| TC-032 | Very Long Address Line | 1. Enter SW1A 1AA<br>2. Select address with long name | Address displays correctly without overflow. Text wraps appropriately. | Low |
| TC-033 | Mobile Viewport - All Steps | 1. Complete entire flow on mobile | All elements accessible. No horizontal scroll. Step indicator adapts to mobile. | Medium |
| TC-034 | Keyboard Navigation | 1. Navigate flow using Tab/Enter | All interactive elements focusable. Logical tab order. Enter submits forms. | Medium |
| TC-035 | Screen Reader Compatibility | 1. Enable screen reader<br>2. Navigate entire flow | All elements have proper ARIA labels. Errors announced. Progress announced. | Medium |

---

## 4. API Failure Tests

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| TC-036 | Postcode API 500 Error | 1. Enter BS1 4DJ<br>2. Submit | Error message displayed. Retry button visible. UI not broken. | High |
| TC-037 | Postcode API Timeout | 1. Simulate network timeout<br>2. Submit postcode | Error message displayed. User can retry. | High |
| TC-038 | Waste Type API Failure | 1. Simulate waste type API 500<br>2. Submit waste type | Error message displayed. Form remains editable. Retry option. | Medium |
| TC-039 | Skip API Failure | 1. Simulate skip API 500<br>2. Navigate to skip selection | Error message displayed. Retry button. Can navigate back. | Medium |
| TC-040 | Booking Confirm API Failure | 1. Complete to review<br>2. Simulate confirm API 500<br>3. Confirm booking | Error message displayed. Form not reset. Can retry confirmation. | High |

---

## 5. State Transition Tests

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| TC-041 | Direct URL Access - Step 3 | 1. Navigate directly to /booking/skip-selection | Redirected to postcode page. Prerequisites enforced. | High |
| TC-042 | Direct URL Access - Step 4 | 1. Navigate directly to /booking/review | Redirected to postcode page. Cannot bypass steps. | High |
| TC-043 | Browser Refresh - Step 2 | 1. Complete postcode step<br>2. Refresh page | State may reset. User starts from postcode step. | Medium |
| TC-044 | Browser Back Button | 1. Complete to step 3<br>2. Click browser back | Returns to previous page. Form state may persist or reset based on implementation. | Medium |
| TC-045 | Session Expiry Simulation | 1. Complete to step 3<br>2. Clear local storage/cookies<br>3. Attempt to continue | May redirect to start. Graceful handling of missing state. | Low |

---

## 6. UI and Accessibility Tests

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| TC-046 | Loading State Visibility | 1. Enter M1 1AE<br>2. Observe loading indicator | Spinner visible. Submit button disabled. Loading text displayed. | High |
| TC-047 | Error State Visibility | 1. Enter BS1 4DJ<br>2. Submit | Red error styling. Error icon visible. Clear error message. | High |
| TC-048 | Empty State Visibility | 1. Enter EC1A 1BB<br>2. Submit | Empty state icon visible. Helpful message. Action button available. | High |
| TC-049 | Disabled Skip Styling | 1. Select Heavy Waste<br>2. View 12-yard skip | Greyed out appearance. Lock icon visible. Not clickable. Opacity reduced. | High |
| TC-050 | Selected Skip Styling | 1. Select any skip | Blue border. Checkmark icon. Background color change. Clear visual selection. | Medium |
| TC-051 | Step Indicator Progress | 1. Progress through flow | Current step highlighted. Completed steps show checkmark. Clear visual progress. | Medium |
| TC-052 | Price Breakdown Formatting | 1. View review page | Prices formatted with £ symbol. Two decimal places. Clear VAT calculation. | High |
| TC-053 | Success Page Elements | 1. Complete booking | Green success icon. Booking reference prominent. Clear next steps. | High |
| TC-054 | Form Validation Error Styling | 1. Submit invalid postcode | Red border on input. Red error text. Error icon visible. | Medium |
| TC-055 | Focus States | 1. Tab through all interactive elements | Visible focus ring on all elements. Keyboard users can see focus. | Medium |

---

## Test Execution Summary

| Category | Count |
|----------|-------|
| Positive Tests | 15 |
| Negative Tests | 10 |
| Edge Cases | 10 |
| API Failure Tests | 5 |
| State Transition Tests | 5 |
| UI/Accessibility Tests | 10 |
| **Total** | **55** |

---

## Test Data Matrix

| Waste Type | Skip Availability | Disabled Skips | Special Conditions |
|------------|------------------|----------------|-------------------|
| General | All 8 available | None | - |
| Heavy | 6 available | 12-yard, 14-yard | Heavy waste notice displayed |
| Plasterboard | All 8 available | None | Requires preparation option |

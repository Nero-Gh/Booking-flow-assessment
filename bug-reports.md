# Bug Reports - Booking Flow Assessment

## Bug Report Summary

| Bug ID | Title | Severity | Priority | Status |
|--------|-------|----------|----------|--------|
| BUG-001 | Heavy Waste State Not Persisted When Navigating Back From Skip Selection | High | High | Open |
| BUG-002 | Double Submit Allows Duplicate Bookings | High | High | Open |
| BUG-003 | Plasterboard Option Not Reset When Switching From Plasterboard to Other Waste Type | Medium | Medium | Open |
| BUG-004 | Address Selection Auto-Navigation Skips User Confirmation | Low | Low | Open |

---

## BUG-001: Heavy Waste State Not Persisted When Navigating Back From Skip Selection

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-001 |
| **Title** | Heavy waste state not persisted when navigating back from skip selection |
| **Severity** | High |
| **Priority** | High |
| **Environment** | Chrome 120, Firefox 121, Safari 17 (all environments) |
| **Reported By** | QA Engineer |
| **Date Reported** | 2024-01-15 |
| **Component** | State Management / Navigation |

### Steps to Reproduce

1. Navigate to the postcode page
2. Enter postcode `SW1A 1AA` and submit
3. Select any address (e.g., "10 Downing Street")
4. Click Continue to waste type
5. Select "Heavy Waste" option
6. Click "Continue to Skip Selection"
7. Observe heavy waste notice and disabled skips (12-yard and 14-yard)
8. Click the "Back" button to return to waste type page
9. Observe the waste type selection state

### Expected Result

- Heavy Waste option should remain selected (blue border and checkmark)
- User should see their previously selected waste type
- Clicking "Continue" again should return to skip selection with heavy waste state intact

### Actual Result

- The Heavy Waste option is no longer visually selected
- Radio button appears unselected
- User must re-select Heavy Waste
- If user clicks Continue without re-selecting, validation error appears: "Please select a waste type"

### Evidence

**Screenshots:**

1. **After selecting Heavy Waste (Step 2):**
    - Heavy Waste card has blue border
    - Blue checkmark visible in top-right corner
    - Radio button visually checked

2. **After navigating back from skip selection:**
    - Heavy Waste card has gray border
    - No checkmark visible
    - Radio button appears unchecked

**Console Logs:**
```
[Zustand] State update: wasteType changed from 'heavy' to null
[React Hook Form] Form reset detected during navigation
```

### Root Cause Analysis

The issue appears to be in the `waste-type-form.tsx` component. When the component mounts (after navigating back), the `useEffect` hook that syncs form state with store state may be executing in the wrong order, causing the form to reset to default values instead of restoring from the Zustand store.

**Suspected Code Location:**
```typescript
// src/forms/waste-type-form.tsx
useEffect(() => {
  if (currentWasteType && currentWasteType !== selectedWasteType) {
    setValue('wasteType', currentWasteType)
  }
  if (currentPlasterboardOption) {
    setValue('plasterboardOption', currentPlasterboardOption)
  }
}, [currentWasteType, currentPlasterboardOption, selectedWasteType, setValue])
```

The dependency array includes `selectedWasteType`, which may cause the effect to run before `currentWasteType` is properly populated from the store.

### Impact

- **User Experience:** Users must re-select their waste type when navigating back, causing frustration and extra clicks
- **Data Integrity:** If user doesn't notice the selection was lost, they might proceed with incorrect waste type
- **Conversion:** Additional friction in the booking flow may increase abandonment rate

### Recommended Fix

- Remove `selectedWasteType` from the `useEffect` dependency array
- Use `useForm`'s `reset` method with store values when component mounts
- Consider using React Hook Form's `defaultValues` with proper initialization

**Proposed Code Change:**
```typescript
// Initialize form with store values
const form = useForm<WasteTypeWithPlasterboardFormData>({
  resolver: zodResolver(wasteTypeWithPlasterboardSchema),
  defaultValues: {
    wasteType: storeWasteType || undefined,
    plasterboardOption: storePlasterboardOption,
  },
})

// Reset form when store values change (e.g., from another component)
useEffect(() => {
  form.reset({
    wasteType: storeWasteType || undefined,
    plasterboardOption: storePlasterboardOption,
  })
}, [storeWasteType, storePlasterboardOption, form])
```

### Additional Notes

- This issue may also affect the Plasterboard option persistence
- Similar pattern should be checked in postcode form and skip selection
- Consider adding E2E test for this scenario (currently not covered in automation)

---

## BUG-002: Double Submit Allows Duplicate Bookings

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-002 |
| **Title** | Double submit vulnerability allows duplicate booking confirmations |
| **Severity** | High |
| **Priority** | High |
| **Environment** | All browsers (reproducible in Chrome, Firefox, Safari) |
| **Reported By** | QA Engineer |
| **Date Reported** | 2024-01-15 |
| **Component** | Booking Confirmation / API |

### Steps to Reproduce

1. Complete booking flow up to review page (steps 1–3)
2. Open browser DevTools Network tab
3. Ensure terms checkbox is checked
4. Rapidly click the "Confirm Booking" button multiple times (double-click or triple-click)
5. Observe network requests in DevTools

### Expected Result

- First click should trigger booking confirmation
- Confirm button should be immediately disabled
- Loading spinner should appear
- Subsequent clicks should be ignored
- Only one `POST /api/booking/confirm` request should be sent
- Only one booking confirmation should be processed

### Actual Result

- Multiple `POST /api/booking/confirm` requests are sent (2–3 requests)
- Each request returns a different booking ID
- User may see multiple success messages flash
- Multiple booking references are generated for the same order

### Evidence

**Network Tab:**
```
POST /api/booking/confirm - 200 OK - BK-12345
POST /api/booking/confirm - 200 OK - BK-67890
POST /api/booking/confirm - 200 OK - BK-24680
```

**Console Logs:**
```
[MSW] POST /api/booking/confirm - generated bookingId: BK-12345
[MSW] POST /api/booking/confirm - generated bookingId: BK-67890
[MSW] POST /api/booking/confirm - generated bookingId: BK-24680
```

**Store State After Double Submit:**
```javascript
{
  confirmation: {
    bookingId: "BK-24680", // Last request overwrote previous
    isSubmitting: false,
    isSuccess: true,
    // Multiple successful confirmations processed
  }
}
```

### Root Cause Analysis

The issue occurs because the `isSubmitting` state is set asynchronously in the `confirmBooking` action, and there's a small window between the first click and when `isSubmitting` becomes `true` where additional clicks can trigger the function again.

**Current Implementation:**
```typescript
// src/store/booking-store.ts
confirmBooking: async () => {
  const { postcode, selectedAddressId } = get().postcode
  const { wasteType } = get().wasteType
  const { selectedSkip } = get().skipSelection

  // State update is asynchronous
  set((state) => ({
    confirmation: {
      ...state.confirmation,
      isSubmitting: true, // This takes time to propagate
      error: null,
    },
  }))

  // API call happens after state update is queued
  const response = await fetch('/api/booking/confirm', {...})
}
```

The button's `disabled` attribute is bound to `isSubmitting`, but React hasn't re-rendered yet when the second click occurs.

### Impact

- **Financial:** Multiple bookings created, potentially charging customer multiple times
- **Data Integrity:** Duplicate records in booking system
- **Customer Service:** Confusion over which booking reference is valid
- **Compliance:** May violate double-submit prevention requirements for payment flows

### Recommended Fix

**Option 1 — Guard Clause (Immediate Fix):**
```typescript
confirmBooking: async () => {
  const state = get()

  // Guard clause - check if already submitting
  if (state.confirmation.isSubmitting || state.confirmation.isSuccess) {
    return
  }

  const { postcode, selectedAddressId } = state.postcode
  const { wasteType } = state.wasteType
  const { selectedSkip } = state.skipSelection

  if (!selectedAddressId || !selectedSkip) {
    set((state) => ({
      confirmation: {
        ...state.confirmation,
        error: 'Missing required booking information',
      },
    }))
    return
  }

  set((state) => ({
    confirmation: {
      ...state.confirmation,
      isSubmitting: true,
      error: null,
    },
  }))

  try {
    const response = await fetch('/api/booking/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postcode,
        addressId: selectedAddressId,
        heavyWaste: wasteType === 'heavy',
        plasterboard: wasteType === 'plasterboard',
        skipSize: selectedSkip.size,
        price: selectedSkip.price,
      }),
    })
    // Rest of implementation...
  } catch (error) {
    // Error handling...
  }
}
```

**Option 2 — Idempotency Key (Long-term Fix):**
```typescript
// Generate once per booking attempt
const idempotencyKey = `${selectedAddressId}-${selectedSkip.size}-${Date.now()}`

const response = await fetch('/api/booking/confirm', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey,
  },
  body: JSON.stringify({...}),
})
```

### Additional Notes

- This is a critical issue that should be fixed before production deployment
- Consider adding a Playwright test that attempts double-click on confirm button
- Same pattern should be checked in postcode lookup and waste type submission

---

## BUG-003: Plasterboard Option Not Reset When Switching From Plasterboard to Other Waste Type

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-003 |
| **Title** | Plasterboard option not properly cleared when switching waste types |
| **Severity** | Medium |
| **Priority** | Medium |
| **Environment** | All browsers |
| **Reported By** | QA Engineer |
| **Date Reported** | 2024-01-15 |
| **Component** | Waste Type Form / State Management |

### Steps to Reproduce

1. Navigate to waste type page (after completing postcode step)
2. Select "Plasterboard" waste type
3. Select a plasterboard option (e.g., "Bagged")
4. Switch to "General Waste"
5. Click "Continue to Skip Selection"
6. Navigate through skip selection to review page
7. Observe the booking summary

### Expected Result

- When switching from Plasterboard to General Waste, the plasterboard option should be cleared (set to `null`)
- The booking summary on review page should show "General Waste" without any plasterboard option
- The store's `wasteType.plasterboardOption` should be `null`

### Actual Result

- The plasterboard option remains in the store as `"bagged"`
- On the review page, the booking summary shows both "General Waste" and "Plasterboard Option: Bagged"
- This creates a confusing and incorrect summary for the user

### Evidence

**Store State After Switching:**
```javascript
{
  wasteType: {
    wasteType: "general",         // Correct
    plasterboardOption: "bagged", // INCORRECT - should be null
    isLoading: false,
    error: null
  }
}
```

**Review Page Display:**
```
Waste Type: General Waste
Preparation: Bagged  ← This should not appear
```

### Root Cause Analysis

The `setWasteType` action in the Zustand store updates the waste type but conditionally handles the plasterboard option. The issue is in the UI component where the plasterboard option state isn't properly synchronized with the waste type change.

**Current Implementation (`waste-type-form.tsx`):**
```typescript
const handleWasteTypeChange = (value: 'general' | 'heavy' | 'plasterboard') => {
  setValue('wasteType', value)
  setWasteType(value)
  clearWasteTypeError()

  // This clears the form value but not necessarily the store
  if (value !== 'plasterboard') {
    setValue('plasterboardOption', null)
    setPlasterboardOption(null) // This is called but may be async
  }

  trigger()
}
```

The `setPlasterboardOption(null)` is called, but due to React's batching and Zustand's async nature, the store update might not complete before the component re-renders or before other actions read the stale value.

### Impact

- **User Confusion:** Booking summary shows contradictory information
- **Data Accuracy:** Incorrect data may be sent to backend (though validation might catch it)
- **Trust:** Users may question the reliability of the booking system
- **Edge Case:** If user quickly submits, wrong data could be persisted

### Recommended Fix

Ensure the store's `setWasteType` action also handles clearing the plasterboard option.

**Proposed Code Change (`booking-store.ts`):**
```typescript
setWasteType: (wasteType: WasteType) => {
  set((state) => ({
    wasteType: {
      ...state.wasteType,
      wasteType,
      // Always clear plasterboard option when not plasterboard
      plasterboardOption: wasteType === 'plasterboard'
        ? state.wasteType.plasterboardOption
        : null,
      error: null,
    },
  }))
},
```

**Updated UI Component:**
```typescript
const handleWasteTypeChange = (value: 'general' | 'heavy' | 'plasterboard') => {
  setWasteType(value) // This now handles plasterboardOption internally
  setValue('wasteType', value)

  if (value !== 'plasterboard') {
    setValue('plasterboardOption', null)
  }

  clearWasteTypeError()
  trigger()
}
```

### Additional Notes

- This bug demonstrates a classic state synchronization issue between UI and global store
- Consider adding a test case for switching between all waste type combinations
- The reverse scenario (switching to Plasterboard) should also be tested

---

## BUG-004: Address Selection Auto-Navigation Skips User Confirmation

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-004 |
| **Title** | Auto-navigation after address selection prevents user from reviewing selection |
| **Severity** | Low |
| **Priority** | Low |
| **Environment** | All browsers |
| **Reported By** | QA Engineer |
| **Date Reported** | 2024-01-15 |
| **Component** | Postcode Page / Navigation |

### Steps to Reproduce

1. Navigate to postcode page
2. Enter postcode `SW1A 1AA` and submit
3. Wait for addresses to load (12 addresses displayed)
4. Click on any address (e.g., "10 Downing Street")
5. Observe the behavior

### Expected Result

- Address should be visually selected (blue border, checkmark)
- User should see a "Continue" button to proceed
- User can review their selection before proceeding
- User should have the option to select a different address

### Actual Result

- Address is briefly highlighted
- Page automatically navigates to the waste type page after ~500ms
- User has no time to review or change their selection
- If user accidentally clicks wrong address, they must navigate back

### Evidence

**Timeline of Events:**
```
T+0ms:   User clicks address
T+50ms:  Address gets selected state
T+500ms: Auto-navigation triggers
T+600ms: Waste type page loads
```

**Code Reference (`postcode/page.tsx`):**
```typescript
useEffect(() => {
  if (selectedAddressId && !hasAttemptedNavigation && showAddressList) {
    setHasAttemptedNavigation(true)
    const timer = setTimeout(() => {
      handleContinue()
    }, 500) // Auto-navigation after 500ms
    return () => clearTimeout(timer)
  }
}, [selectedAddressId, hasAttemptedNavigation, showAddressList])
```

### Root Cause Analysis

This is an intentional "feature" implemented as auto-navigation for perceived better UX. The 500ms delay was added to show the selection state before navigating, but it's too short for users to read their selected address, confirm it's correct, or change their mind.

### Impact

- **User Experience:** Feels rushed and disorienting
- **Accessibility:** Violates WCAG guidelines for predictable navigation
- **Error Recovery:** Users who misclick must use back button, losing context
- **Cognitive Load:** Unexpected navigation increases mental overhead

### Recommended Fix

**Option A (Recommended) — Remove auto-navigation entirely:**
```typescript
// Remove the auto-navigation useEffect entirely
// Rely on the existing "Continue" button that appears when address is selected

{selectedAddressId && (
  <div className="mt-6 flex justify-end">
    <button
      type="button"
      onClick={handleContinue}
      data-testid="continue-to-waste-type"
      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg"
    >
      Continue
    </button>
  </div>
)}
```

**Option B — Increase delay with countdown indicator:**
```typescript
useEffect(() => {
  if (selectedAddressId && !hasAttemptedNavigation && showAddressList) {
    setHasAttemptedNavigation(true)
    const timer = setTimeout(() => {
      handleContinue()
    }, 3000) // Increased to 3 seconds

    // Show countdown indicator
    setCountdown(3)

    return () => clearTimeout(timer)
  }
}, [selectedAddressId, hasAttemptedNavigation, showAddressList])
```

**Option C** — Add an undo/cancel option during the delay period.

### Additional Notes

- This is a UX issue rather than a functional bug
- Some users may prefer auto-navigation, so consider A/B testing
- If keeping auto-navigation, ensure it's announced to screen readers
- Consider making this a user preference setting

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total Bugs Reported | 4 |
| High Severity | 2 |
| Medium Severity | 1 |
| Low Severity | 1 |
| State/Branching Logic Issues | 3 |
| UI/UX Issues | 1 |

# Booking Flow Assessment - QA Project

A comprehensive QA assessment project implementing a realistic waste skip booking flow with deterministic API behavior, automated E2E tests, and full QA artifacts.

## Project Overview

This project implements a 4-step booking flow for waste skip hire:

1. **Postcode Lookup** - Enter postcode and select delivery address
2. **Waste Type Selection** - Choose from General, Heavy, or Plasterboard waste
3. **Skip Selection** - Select skip size with availability based on waste type
4. **Review & Confirm** - Review details, view price breakdown, and confirm booking

### Key Features

- **Deterministic Mock API** - MSW intercepts requests with predictable responses
- **State Persistence** - Zustand manages global state across steps
- **Form Validation** - React Hook Form with Zod schemas
- **Accessibility** - Semantic HTML with ARIA labels and keyboard navigation
- **Responsive Design** - Works on desktop and mobile devices
- **E2E Testing** - Playwright tests using Page Object Model

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 14.2.0 |
| Language | TypeScript | 5.4.3 |
| Styling | Tailwind CSS | ^4.0.0 |
| State Management | Zustand | 4.5.2 |
| Form Handling | React Hook Form | 7.51.0 |
| Validation | Zod | 3.22.4 |
| API Mocking | MSW | 2.2.13 |
| E2E Testing | Playwright | 1.43.0 |
| Icons | Lucide React | 0.363.0 |

## Project Structure

```
project-root/

├── app/
│   │   ├── booking/
│   │   │   ├── postcode/
│   │   │   │   ├── page.tsx
│   │   │   │   └── address-list.tsx
│   │   │   ├── waste-type/
│   │   │   │   └── page.tsx
│   │   │   ├── skip-selection/
│   │   │   │   └── page.tsx
│   │   │   ├── review/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── msw-provider.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── booking-layout.tsx
│   │   │   ├── navigation-buttons.tsx
│   │   │   └── step-indicator.tsx
│   │   ├── ui/
│   │   │   ├── loading-spinner.tsx
│   │   │   ├── error-message.tsx
│   │   │   ├── retry-button.tsx
│   │   │   └── empty-state.tsx
│   │   ├── skip/
│   │   │   ├── skip-card.tsx
│   │   │   ├── skip-grid.tsx
│   │   │   └── disabled-badge.tsx
│   │   └── booking/
│   │       ├── booking-summary.tsx
│   │       ├── price-breakdown.tsx
│   │       └── confirmation-success.tsx
│   ├── store/
│   │   ├── booking-store.ts
│   │   ├── types.ts
│   │   └── selectors.ts
│   ├── forms/
│   │   ├── postcode-form.tsx
│   │   ├── waste-type-form.tsx
│   │   └── plasterboard-options.tsx
│   ├── validation/
│   │   ├── schemas.ts
│   │   └── types.ts
│   └── mocks/
│       ├── browser.ts
│       ├── server.ts
│       ├── handlers.ts
│       ├── fixtures.ts
│       └── index.ts
├── automation/
│   ├── pages/
│   │   ├── base-page.ts
│   │   ├── postcode-page.ts
│   │   ├── waste-type-page.ts
│   │   ├── skip-selection-page.ts
│   │   ├── review-page.ts
│   │   └── confirmation-page.ts
│   ├── fixtures/
│   │   └── test-data.ts
│   ├── test-1-general-waste-flow.spec.ts
│   └── test-2-heavy-waste-flow.spec.ts
├── public/
│   └── mockServiceWorker.js
├── playwright.config.ts
├── manual-tests.md
├── bug-reports.md
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd booking-flow-assessment

# Install dependencies
npm install

# Generate MSW service worker
npx msw init public/ --save
```

### Running the Application

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Mock API Documentation

This project uses Mock Service Worker (MSW) to intercept API requests and return deterministic responses.

### Deterministic Test Data

| Postcode | Behavior | Expected Result |
|----------|----------|-----------------|
| SW1A 1AA | Success | Returns 12 addresses |
| EC1A 1BB | Empty | Returns 0 addresses (empty state) |
| M1 1AE | Latency | 3-second delay, then returns 3 addresses |
| BS1 4DJ | Error/Retry | 500 error on first call, success on retry |

### API Endpoints

#### `POST /api/postcode/lookup`

**Request:**
```json
{ "postcode": "SW1A 1AA" }
```

**Response:**
```json
{
  "postcode": "SW1A 1AA",
  "addresses": [
    { "id": "addr_1", "line1": "10 Downing Street", "city": "London" }
  ]
}
```

#### `POST /api/waste-types`

**Request:**
```json
{
  "heavyWaste": true,
  "plasterboard": false,
  "plasterboardOption": null
}
```

**Response:**
```json
{ "ok": true }
```

#### `GET /api/skips?postcode=SW1A1AA&heavyWaste=true`

**Response:**
```json
{
  "skips": [
    { "size": "4-yard",  "price": 120, "disabled": false },
    { "size": "6-yard",  "price": 150, "disabled": false },
    { "size": "8-yard",  "price": 180, "disabled": false },
    { "size": "10-yard", "price": 220, "disabled": false },
    { "size": "12-yard", "price": 260, "disabled": true  },
    { "size": "14-yard", "price": 300, "disabled": true  },
    { "size": "16-yard", "price": 350, "disabled": false },
    { "size": "20-yard", "price": 420, "disabled": false }
  ]
}
```

#### `POST /api/booking/confirm`

**Request:**
```json
{
  "postcode": "SW1A 1AA",
  "addressId": "addr_1",
  "heavyWaste": true,
  "plasterboard": false,
  "skipSize": "4-yard",
  "price": 120
}
```

**Response:**
```json
{
  "status": "success",
  "bookingId": "BK-12345"
}
```

### Heavy Waste Rule

When `heavyWaste=true`, at least 2 skip sizes are disabled:

- 12-yard (disabled)
- 14-yard (disabled)

All other sizes remain available.

---

## Running Tests

### Playwright E2E Tests

```bash
# Install Playwright browsers
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run tests with UI mode
npm run test:e2e:ui

# Run tests in headed mode
npm run test:e2e:headed

# View test report
npm run test:e2e:report
```

### Test Coverage

| Test | Description |
|------|-------------|
| `test-1-general-waste-flow.spec.ts` | Complete general waste flow with all assertions |
| `test-2-heavy-waste-flow.spec.ts` | Heavy waste flow verifying disabled skips |

---

## Architecture

### State Management

The application uses Zustand for global state management. The store (`src/store/booking-store.ts`) manages:

- Postcode lookup state
- Selected address
- Waste type selection
- Plasterboard options
- Skip selection
- Booking confirmation state
- Loading and error states
- Step navigation

Memoized selectors (`src/store/selectors.ts`) provide derived state and prevent unnecessary re-renders.

### Form Validation

React Hook Form with Zod validation ensures:

- UK postcode format validation
- Required field validation
- Conditional validation for plasterboard options
- Real-time validation feedback

### Page Object Model

E2E tests use the Page Object Model pattern:

```
BasePage
├── PostcodePage
├── WasteTypePage
├── SkipSelectionPage
├── ReviewPage
└── ConfirmationPage
```

Each page class encapsulates locators, actions, and assertions for that page.

### Stable Selectors

All interactive elements use `data-testid` attributes for stable test automation:

```tsx
<input data-testid="postcode-input" />
<button data-testid="postcode-submit">Find Address</button>
<div data-testid="address-addr_1">...</div>
```

---

## Testing Strategy

### Unit / Integration Testing

- Form validation logic
- Store actions and selectors
- Component rendering

### E2E Testing (Playwright)

- Complete user flows
- API error handling
- State persistence
- Navigation
- Form validation

### Manual Testing

See `manual-tests.md` for 55+ manual test cases.

### Bug Tracking

See `bug-reports.md` for documented issues.

---

## UI Evidence

### Screenshot Instructions

**Mobile Screenshot**
1. Open Chrome DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select "iPhone 12" or "Pixel 5"
4. Navigate through the flow
5. Take screenshot using DevTools camera icon

**Desktop Screenshot**
1. Ensure viewport is 1920x1080
2. Navigate to desired page
3. Take screenshot (Cmd+Shift+4 on Mac, Win+Shift+S on Windows)

**Error State Screenshot**
1. Enter postcode `BS1 4DJ`
2. Wait for error message
3. Capture screenshot showing error message and retry button

**Retry State Screenshot**
1. After error appears for `BS1 4DJ`, capture screenshot showing retry button
2. Click retry and capture success state

**Disabled Skip Screenshot**
1. Select "Heavy Waste"
2. Navigate to skip selection
3. Capture screenshot showing 12-yard and 14-yard with disabled styling

**Price Breakdown Screenshot**
1. Complete flow to review page
2. Capture screenshot showing skip price, VAT (20%), and total price

### Demo Video Instructions

Record a 60–120 second video demonstrating:

1. **Start** - Landing page redirecting to postcode
2. **Postcode** - Enter `SW1A 1AA`, select address
3. **Waste Type** - Select "Heavy Waste"
4. **Skip Selection** - Show disabled skips, select valid skip
5. **Review** - Show price breakdown, confirm booking
6. **Success** - Show confirmation with booking reference

**Recording tools:**
- macOS: QuickTime Player (File > New Screen Recording)
- Windows: Xbox Game Bar (Win+G)
- Browser: Loom or Screencastify extensions

---

## QA Artifacts

| Artifact | File | Description |
|----------|------|-------------|
| Manual Tests | `manual-tests.md` | 55+ test cases covering positive, negative, and edge cases |
| Bug Reports | `bug-reports.md` | Comprehensive bug reports with evidence |
| E2E Tests | `automation/` | Playwright tests with Page Object Model |
| Mock API | `src/mocks/` | MSW handlers with deterministic behavior |

---

## Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_MOCKING` | `enabled` | Enable MSW mocking in development |

---

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Fully supported |
| Firefox | Latest | ✅ Fully supported |
| Safari | Latest | ✅ Fully supported |
| Edge | Latest | ✅ Fully supported |
| Mobile Chrome | Latest | ✅ Fully supported |
| Mobile Safari | Latest | ✅ Fully supported |

---

## Known Issues

See `bug-reports.md` for detailed bug reports:

- **BUG-001:** Heavy waste state not persisted when navigating back
- **BUG-002:** Double submit allows duplicate bookings
- **BUG-003:** Plasterboard option not reset when switching waste types

---

## Contributing

This is a QA assessment project. Please follow the existing patterns and add appropriate tests for any changes.

---

## License

This project is created for QA assessment purposes.
- Project overview and tech stack
- Complete project structure
- Setup and running instructions
- Mock API documentation with deterministic behaviors
- E2E test running instructions
- Architecture explanation
- Testing strategy
- UI evidence capture instructions (screenshots and video)
- QA artifacts reference

The full project is now complete with all required components!

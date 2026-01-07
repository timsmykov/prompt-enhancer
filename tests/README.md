# Test Suite for Prompt Improver Extension

This directory contains a comprehensive test suite for the Prompt Improver Chrome extension.

## Test Categories

### 1. E2E Tests (`tests/e2e/`)
Full end-to-end testing using Playwright with Chrome extension support.

- **popup.spec.ts** - Popup UI functionality
  - Form validation
  - Settings persistence
  - API connection testing
  - Keyboard shortcuts
  - Error handling

- **overlay.spec.ts** - Overlay UI functionality
  - Text selection and improvement
  - Typing animation
  - Replace/Copy actions
  - Comparison mode
  - History panel
  - Keyboard shortcuts

- **integration.spec.ts** - Cross-component workflows
  - Complete user workflows
  - Settings persistence
  - API integration
  - Concurrent requests
  - Session management

### 2. Unit Tests (`tests/unit/`)
Isolated unit testing using Vitest with jsdom environment.

- **ExtensionState.spec.js** - State management
  - Get/Set storage
  - Subscription handling
  - Validation logic
  - Reset functionality

- **ErrorHandler.spec.js** - Error handling
  - Error mapping
  - User-friendly messages
  - Retry logic
  - Error identification

- **utils.spec.js** - Utility functions
  - Token generation
  - Text truncation
  - HTML sanitization
  - Clipboard operations
  - Debouncing

### 3. Accessibility Tests (`tests/accessibility/`)
WCAG AAA compliance testing using axe-core.

- **axe-audit.spec.ts**
  - Color contrast (7:1+)
  - Keyboard navigation
  - Screen reader compatibility
  - ARIA labels and roles
  - Focus management
  - Touch target sizes
  - Reduced motion support

### 4. Performance Tests (`tests/performance/`)
Performance benchmarking and optimization.

- **lighthouse-audit.spec.ts**
  - Load time metrics
  - Bundle size limits
  - Animation frame rate (60fps)
  - Memory leak detection
  - API timeout handling
  - Concurrent request performance
  - Storage operation speed
  - Host page impact

### 5. Security Tests (`tests/security/`)
Security vulnerability testing.

- **security-audit.spec.ts**
  - XSS prevention
  - HTML sanitization
  - postMessage origin validation
  - Session token security
  - API key storage security
  - Data leakage prevention
  - CSP enforcement
  - CSRF protection
  - Input validation

## Setup

### Prerequisites
- Node.js >= 18.0.0
- Chrome browser (for extension testing)
- Extension built and available

### Installation

```bash
cd /Users/timsmykov/Desktop/worktree-testing
npm install
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### E2E Tests Only
```bash
npm run test:e2e
```

### E2E Tests with UI
```bash
npm run test:e2e:ui
```

### E2E Tests with Debug Mode
```bash
npm run test:e2e:debug
```

### Accessibility Tests
```bash
npm run test:accessibility
```

### Performance Tests
```bash
npm run test:performance
```

### Security Tests
```bash
npm run test:security
```

## Test Reports

After running tests, view the HTML report:

```bash
npm run report
```

## Configuration

### Playwright Configuration
See `playwright.config.ts` for:
- Extension loading
- Browser settings
- Test timeouts
- Reporting options

### Vitest Configuration
See `vitest.config.js` for:
- Test environment
- Coverage settings
- File matching patterns

## Coverage Goals

- **Overall**: > 80%
- **Statements**: > 80%
- **Branches**: > 80%
- **Functions**: > 80%
- **Lines**: > 80%

## Performance Targets

- **Performance Score**: 95+
- **Accessibility**: 100
- **Best Practices**: 95+
- **Load Time**: < 1s
- **Animation FPS**: 60fps
- **Memory Growth**: < 50MB

## Accessibility Standards

- **WCAG Level**: AAA
- **Color Contrast**: 7:1+
- **Keyboard Navigation**: Full support
- **Screen Reader**: Full compatibility
- **Touch Targets**: 44x44px minimum

## Writing New Tests

### E2E Test Template
```typescript
import { test, expect } from '@playwright/test';
import { getExtensionId, openPopup, setStorageData } from '../helpers/extension-loader';

test.describe('Feature Name', () => {
  let extensionId: string;
  let page: any;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    extensionId = await getExtensionId(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should do something', async () => {
    await openPopup(page, extensionId);
    // Test implementation
  });
});
```

### Unit Test Template
```javascript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something', () => {
    // Test implementation
    expect(result).toBe(expected);
  });
});
```

## Troubleshooting

### Extension Not Found
- Ensure extension is built
- Check extension path in `playwright.config.ts`
- Verify Chrome is installed

### Tests Timeout
- Increase timeout in `playwright.config.ts`
- Check if API mocks are working
- Verify extension is loaded

### Headless Mode Issues
- Extensions require headed mode
- Use `headed: true` in config
- Debug with `npm run test:e2e:debug`

## CI/CD Integration

Tests are designed to run in CI environments:
- Set `CI=true` environment variable
- Tests will use 2 retries on failure
- Parallel execution is disabled for extension tests

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [axe-core Documentation](https://www.deque.com/axe/)
- [Chrome Extension Testing Guide](https://developer.chrome.com/docs/extensions/mv3/testing/)

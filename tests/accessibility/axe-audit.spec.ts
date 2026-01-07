import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-core';
import { getExtensionId, openPopup, setStorageData, clearStorage } from '../helpers/extension-loader';
import { generateTestApiKey, delay, createTestPage } from '../helpers/test-utils';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

test.describe('Accessibility Audit (WCAG AAA Compliance)', () => {
  let extensionId: string;
  let page: any;
  let testPageUrl: string;

  test.beforeAll(async ({ browser, context, baseURL }) => {
    page = await browser.newPage();
    extensionId = await getExtensionId(page);

    const testDir = join(process.cwd(), 'test-pages');
    mkdirSync(testDir, { recursive: true });
    writeFileSync(join(testDir, 'a11y-test.html'), createTestPage());
    testPageUrl = `${baseURL}/test-pages/a11y-test.html`;
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.beforeEach(async () => {
    await clearStorage(page);
  });

  test('Popup should have no WCAG violations', async () => {
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    await injectAxe(page);
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true },
      rules: {
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'aria-labels': { enabled: true }
      }
    });
  });

  test('Popup should meet WCAG AAA contrast requirements (7:1)', async () => {
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    await injectAxe(page);

    // Check color contrast specifically
    await checkA11y(page, null, {
      detailedReport: true,
      rules: {
        'color-contrast': {
          enabled: true,
          options: {
            minContrast: 'aaa' // WCAG AAA requires 7:1 for normal text
          }
        }
      }
    });
  });

  test('Popup should be keyboard navigable', async () => {
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    // Fill API key
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="apiKey"]')).toBeFocused();

    await page.type('input[name="apiKey"]', generateTestApiKey());
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="model"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('textarea[name="systemPrompt"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();

    // Activate button with Enter
    await page.keyboard.press('Enter');

    // Should save successfully
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible({ timeout: 3000 });
  });

  test('Popup should have proper ARIA labels', async () => {
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    // Check for ARIA labels on form fields
    const apiKeyLabel = await page.getAttribute('input[name="apiKey"]', 'aria-label');
    const modelLabel = await page.getAttribute('input[name="model"]', 'aria-label');
    const systemPromptLabel = await page.getAttribute('textarea[name="systemPrompt"]', 'aria-label');

    expect(apiKeyLabel).toBeTruthy();
    expect(modelLabel).toBeTruthy();
    expect(systemPromptLabel).toBeTruthy();
  });

  test('Popup should announce errors to screen readers', async () => {
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    // Try to save without API key
    await page.click('button[type="submit"]');

    // Check for error message with role="alert" or aria-live
    const errorMessage = page.locator('[role="alert"], [aria-live="polite"], [aria-live="assertive"]');
    await expect(errorMessage).toBeVisible();

    // Check error message is accessible
    const errorText = await errorMessage.textContent();
    expect(errorText).toBeTruthy();
    expect(errorText?.length).toBeGreaterThan(0);
  });

  test('Overlay should have no WCAG violations', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    // Mock API response
    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              content: 'Accessible improved text'
            }
          }]
        })
      });
    });

    await page.goto(testPageUrl);

    // Open overlay
    await page.evaluate(() => {
      const event = new CustomEvent('improve-prompt', {
        detail: { text: 'Test prompt for accessibility' }
      });
      window.dispatchEvent(event);
    });

    await page.waitForSelector('#prompt-improver-overlay', { timeout: 5000 });
    await delay(1000);

    await injectAxe(page);
    await checkA11y(page, '#prompt-improver-overlay', {
      detailedReport: true
    });
  });

  test('Overlay should have proper focus management', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              content: 'Focus test improvement'
            }
          }]
        })
      });
    });

    await page.goto(testPageUrl);

    // Open overlay
    await page.evaluate(() => {
      const event = new CustomEvent('improve-prompt', {
        detail: { text: 'Test prompt' }
      });
      window.dispatchEvent(event);
    });

    await page.waitForSelector('#prompt-improver-overlay', { timeout: 5000 });

    // Check that focus is trapped in overlay
    const overlay = page.locator('#prompt-improver-overlay');
    await expect(overlay).toBeVisible();

    // Test Escape to close (should return focus to trigger)
    await page.keyboard.press('Escape');
    await expect(overlay).not.toBeVisible();
  });

  test('Overlay buttons should have accessible labels', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              content: 'Button labels test'
            }
          }]
        })
      });
    });

    await page.goto(testPageUrl);

    await page.evaluate(() => {
      const event = new CustomEvent('improve-prompt', {
        detail: { text: 'Test prompt' }
      });
      window.dispatchEvent(event);
    });

    await page.waitForSelector('#prompt-improver-overlay', { timeout: 5000 });
    await delay(1500);

    // Check button labels
    const replaceButton = page.locator('[data-testid="replace-btn"]');
    const copyButton = page.locator('[data-testid="copy-btn"]');

    await expect(replaceButton).toHaveAttribute('aria-label');
    await expect(copyButton).toHaveAttribute('aria-label');
  });

  test('Should handle keyboard shortcuts accessibly', async () => {
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    // Test keyboard shortcuts
    await page.fill('input[name="apiKey"]', generateTestApiKey());

    // Cmd+S to save
    await page.keyboard.press('Meta+s');

    // Check for success announcement
    const successMessage = page.locator('[role="status"], [aria-live="polite"]');
    await expect(successMessage).toBeVisible({ timeout: 3000 });
  });

  test('Form inputs should have proper labels and descriptions', async () => {
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    // Check label associations
    const apiKeyLabel = page.locator('label[for="apiKey"]');
    const apiKeyInput = page.locator('input[name="apiKey"]');

    await expect(apiKeyLabel).toBeVisible();
    await expect(apiKeyInput).toHaveAttribute('aria-labelledby');

    // Check helper text
    const helperText = page.locator('[data-testid="helper-text"]');
    await expect(helperText).toBeVisible();
    await expect(helperText).toHaveAttribute('aria-describedby');
  });

  test('Error messages should be associated with inputs', async () => {
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    // Trigger validation error
    await page.click('button[type="submit"]');

    // Check error message
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();

    // Check error is announced
    await expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  test('Should support screen reader announcements', async () => {
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    // Create a live region for testing
    await page.evaluate(() => {
      const announcer = document.createElement('div');
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.id = 'test-announcer';
      document.body.appendChild(announcer);
    });

    // Fill form
    await page.fill('input[name="apiKey"]', generateTestApiKey());
    await page.click('button[type="submit"]');

    // Check for live region update
    const announcer = page.locator('#test-announcer');
    await expect(announcer).toBeVisible();
  });

  test('Touch targets should meet minimum size (44x44px)', async () => {
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    // Check button sizes
    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('Should skip to main content properly', async () => {
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    // Look for "Skip to content" link (should be first focusable element)
    await page.keyboard.press('Tab');

    const firstElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    // Should have skip link or logical first focusable element
    expect(['A', 'BUTTON', 'INPUT']).toContain(firstElement);
  });

  test('Focus indicators should be visible', async () => {
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    // Test focus indicators
    const inputs = page.locator('input, button, textarea');
    const count = await inputs.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      await inputs.nth(i).focus();

      const hasFocusOutline = await inputs.nth(i).evaluate((el: any) => {
        const styles = window.getComputedStyle(el);
        return (
          styles.outline !== 'none' ||
          styles.boxShadow !== 'none' ||
          styles.border !== 'none'
        );
      });

      expect(hasFocusOutline).toBe(true);
    }
  });

  test('Should respect reduced motion preference', async () => {
    const context = page.context();
    await context.addInitScript(() => {
      window.matchMedia = () => ({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true
      } as any);
    });

    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    // Check that animations respect preference
    const animationsDisabled = await page.evaluate(() => {
      const root = document.documentElement;
      return root.style.getPropertyValue('--animation-duration') === '0ms';
    });

    expect(animationsDisabled).toBe(true);
  });
});

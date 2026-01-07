import { test, expect } from '@playwright/test';
import {
  getExtensionId,
  setStorageData,
  clearStorage,
  mockOpenRouterAPI,
  waitForOverlay,
  getOverlayContent,
  selectText,
  triggerContextMenu
} from '../helpers/extension-loader';
import { generateTestApiKey, delay, createTestPage } from '../helpers/test-utils';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

test.describe('Overlay E2E Tests', () => {
  let extensionId: string;
  let page: any;
  let testPageUrl: string;

  test.beforeAll(async ({ browser, context, baseURL }) => {
    page = await browser.newPage();
    extensionId = await getExtensionId(page);

    // Create test page
    const testDir = join(process.cwd(), 'test-pages');
    mkdirSync(testDir, { recursive: true });
    writeFileSync(join(testDir, 'overlay-test.html'), createTestPage());
    testPageUrl = `${baseURL}/test-pages/overlay-test.html`;
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.beforeEach(async () => {
    await clearStorage(page);
    // Set up extension with valid API key
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto',
      systemPrompt: 'You are a helpful prompt improver.'
    });
  });

  test('should open overlay from context menu', async () => {
    await page.goto(testPageUrl);
    await page.waitForLoadState('networkidle');

    // Select text
    await selectText(page, '#test-text-1');

    // Trigger context menu click
    await page.click('#test-text-1', { button: 'right' });
    await delay(200);

    // Click "Improve prompt" menu item
    const menuSelector = '[data-menu-item="improve-prompt"]';
    await page.click(menuSelector);

    // Wait for overlay to appear
    await waitForOverlay(page);
    await expect(page.locator('#prompt-improver-overlay')).toBeVisible();
  });

  test('should display original text in overlay', async () => {
    await page.goto(testPageUrl);
    await selectText(page, '#test-text-1');
    await page.click('#test-text-1', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');

    await waitForOverlay(page);

    const content = await getOverlayContent(page);
    expect(content?.originalText).toBe('This is a simple prompt that needs improvement.');
  });

  test('should show improved text after API call', async () => {
    // Mock API response
    await mockOpenRouterAPI(page, {
      choices: [{
        message: {
          content: 'This is an improved version of the prompt with better clarity and specificity.'
        }
      }]
    });

    await page.goto(testPageUrl);
    await selectText(page, '#test-text-1');
    await page.click('#test-text-1', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');

    await waitForOverlay(page);
    await delay(1000); // Wait for typing animation to start

    const content = await getOverlayContent(page);
    expect(content?.improvedText).toContain('improved version');
  });

  test('should display typing animation', async () => {
    await mockOpenRouterAPI(page, {
      choices: [{
        message: {
          content: 'Animated improved text'
        }
      }]
    });

    await page.goto(testPageUrl);
    await selectText(page, '#test-text-2');
    await page.click('#test-text-2', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');

    await waitForOverlay(page);

    // Check if typing indicator is visible
    await expect(page.locator('[data-testid="typing-indicator"]')).toBeVisible();

    // Wait for animation to complete
    await delay(2000);
    await expect(page.locator('[data-testid="typing-indicator"]')).not.toBeVisible();
  });

  test('should support Replace action', async () => {
    await mockOpenRouterAPI(page, {
      choices: [{
        message: {
          content: 'Replaced improved prompt'
        }
      }]
    });

    await page.goto(testPageUrl);
    await selectText(page, '#test-text-1');
    await page.click('#test-text-1', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');

    await waitForOverlay(page);
    await delay(1500); // Wait for typing to complete

    // Click Replace button
    await page.click('[data-testid="replace-btn"]');

    // Verify text was replaced
    const newText = await page.textContent('#test-text-1');
    expect(newText).toBe('Replaced improved prompt');
  });

  test('should support Copy action', async () => {
    await mockOpenRouterAPI(page, {
      choices: [{
        message: {
          content: 'Copied improved text'
        }
      }]
    });

    await page.goto(testPageUrl);
    await selectText(page, '#test-text-1');
    await page.click('#test-text-1', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');

    await waitForOverlay(page);
    await delay(1500);

    // Click Copy button
    await page.click('[data-testid="copy-btn"]');

    // Verify clipboard
    const clipboardText = await page.evaluate(() => {
      return navigator.clipboard.readText();
    });
    expect(clipboardText).toBe('Copied improved text');

    // Verify success message
    await expect(page.locator('[data-testid="copy-success"]')).toBeVisible();
  });

  test('should show comparison mode toggle', async () => {
    await mockOpenRouterAPI(page, {
      choices: [{
        message: {
          content: 'Improved for comparison'
        }
      }]
    });

    await page.goto(testPageUrl);
    await selectText(page, '#test-text-1');
    await page.click('#test-text-1', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');

    await waitForOverlay(page);
    await delay(1500);

    // Toggle comparison mode
    await page.click('[data-testid="comparison-toggle"]');

    // Verify comparison view is visible
    await expect(page.locator('[data-testid="comparison-view"]')).toBeVisible();
    await expect(page.locator('.original-text')).toBeVisible();
    await expect(page.locator('.improved-text')).toBeVisible();
  });

  test('should display history panel', async () => {
    await mockOpenRouterAPI(page, {
      choices: [{
        message: {
          content: 'Historical improvement'
        }
      }]
    });

    await page.goto(testPageUrl);
    await selectText(page, '#test-text-1');
    await page.click('#test-text-1', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');

    await waitForOverlay(page);
    await delay(1500);

    // Open history panel
    await page.click('[data-testid="history-toggle"]');

    await expect(page.locator('[data-testid="history-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="history-item"]')).toHaveCount(1);
  });

  test('should handle keyboard shortcuts - Escape to close', async () => {
    await mockOpenRouterAPI(page, {
      choices: [{
        message: {
          content: 'Closeable text'
        }
      }]
    });

    await page.goto(testPageUrl);
    await selectText(page, '#test-text-1');
    await page.click('#test-text-1', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');

    await waitForOverlay(page);

    // Press Escape
    await page.keyboard.press('Escape');

    // Overlay should close
    await expect(page.locator('#prompt-improver-overlay')).not.toBeVisible();
  });

  test('should handle API errors gracefully', async () => {
    // Mock error response
    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Rate limit exceeded' })
      });
    });

    await page.goto(testPageUrl);
    await selectText(page, '#test-text-1');
    await page.click('#test-text-1', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');

    await waitForOverlay(page);

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Rate limit');
  });

  test('should handle empty selection', async () => {
    await page.goto(testPageUrl);

    // Try to improve without selection
    await page.click('body');
    await page.click('[data-menu-item="improve-prompt"]');

    // Should show error toast
    await expect(page.locator('[data-testid="toast-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="toast-error"]')).toContainText('select some text');
  });

  test('should work with contenteditable elements', async () => {
    await mockOpenRouterAPI(page, {
      choices: [{
        message: {
          content: 'Contenteditable improvement'
        }
      }]
    });

    await page.goto(testPageUrl);
    await selectText(page, '#test-text-3');
    await page.click('#test-text-3', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');

    await waitForOverlay(page);
    await delay(1500);

    await expect(page.locator('#prompt-improver-overlay')).toBeVisible();
  });

  test('should handle multiple rapid requests', async () => {
    let requestCount = 0;
    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      requestCount++;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              content: `Improvement ${requestCount}`
            }
          }]
        })
      });
    });

    await page.goto(testPageUrl);

    // Make multiple requests
    for (let i = 1; i <= 3; i++) {
      await selectText(page, '#test-text-1');
      await page.click('#test-text-1', { button: 'right' });
      await delay(200);
      await page.click('[data-menu-item="improve-prompt"]');
      await delay(500);
    }

    // Should process all requests
    await delay(2000);
    expect(requestCount).toBe(3);
  });

  test('should maintain position on scrolled page', async () => {
    await mockOpenRouterAPI(page, {
      choices: [{
        message: {
          content: 'Scrolled improvement'
        }
      }]
    });

    await page.goto(testPageUrl);

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await delay(200);

    await selectText(page, '#test-text-1');
    await page.click('#test-text-1', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');

    await waitForOverlay(page);

    // Overlay should be visible and properly positioned
    await expect(page.locator('#prompt-improver-overlay')).toBeVisible();

    // Verify it's within viewport
    const isVisible = await page.evaluate(() => {
      const overlay = document.querySelector('#prompt-improver-overlay');
      if (!overlay) return false;
      const rect = overlay.getBoundingClientRect();
      return rect.top >= 0 && rect.left >= 0;
    });
    expect(isVisible).toBe(true);
  });
});

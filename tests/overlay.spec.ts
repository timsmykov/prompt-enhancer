import { test, expect } from '@playwright/test';

test.describe('Overlay UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to overlay HTML file
    await page.goto('file:///Users/timsmykov/worktrees-prompt-extension/frontend/extension/src/ui/overlay/overlay.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Overlay UI loads', async ({ page }) => {
    // Check that the app container is visible
    const app = page.locator('#app');
    await expect(app).toBeVisible();

    // Check for title - use text locator to avoid matching logo span
    const title = page.getByText('Prompt Improver');
    await expect(title).toBeVisible();
  });

  test('Overlay shows idle state with hint text', async ({ page }) => {
    // Check idle state hint is visible
    const hint = page.locator('.hint');
    await expect(hint).toContainText('Select text on the page, then run Improve Prompt.');
  });

  test('Result textarea is present and readonly in idle state', async ({ page }) => {
    const resultTextarea = page.locator('#result');
    await expect(resultTextarea).toBeVisible();
    await expect(resultTextarea).toHaveAttribute('readonly');
    await expect(resultTextarea).toHaveAttribute('placeholder', 'Improved prompt will appear here');
  });

  test('Status pill shows correct states', async ({ page }) => {
    // Initial state should be idle
    const statusPill = page.locator('.status-pill');
    await expect(statusPill).toHaveText('Idle');

    // Check status pill has correct data-status attribute
    await expect(statusPill).toHaveAttribute('data-status', 'idle');
  });

  test('Close button is present', async ({ page }) => {
    const closeButton = page.locator('.icon-button');
    await expect(closeButton).toBeVisible();
    await expect(closeButton).toHaveAttribute('aria-label', 'Close');
  });

  test('Action buttons are present but disabled in idle state', async ({ page }) => {
    const replaceButton = page.locator('button.primary');
    const copyButton = page.locator('button.secondary');
    const regenerateButton = page.locator('button.ghost');

    await expect(replaceButton).toContainText('Replace');
    await expect(copyButton).toContainText('Copy');
    await expect(regenerateButton).toContainText('Regenerate');

    // Buttons should be disabled when no result
    await expect(replaceButton).toBeDisabled();
    await expect(copyButton).toBeDisabled();
    await expect(regenerateButton).toBeDisabled();
  });

  test('No console errors on overlay load', async ({ page }) => {
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    // Wait for any async errors
    await page.waitForTimeout(1000);

    // Filter out non-critical errors
    const jsErrors = consoleMessages.filter(msg =>
      !msg.includes('favicon') &&
      !msg.includes('404') &&
      !msg.includes('chrome') // Chrome API not available in file:// context
    );

    if (jsErrors.length > 0) {
      console.log('Console errors found:', jsErrors);
    }

    expect(jsErrors.length).toBe(0);
  });
});

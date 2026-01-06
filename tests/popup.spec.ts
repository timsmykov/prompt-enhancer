import { test, expect } from '@playwright/test';

test.describe('Popup UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Store errors for later assertion
    (page as any).consoleErrors = consoleErrors;

    // Navigate to popup HTML file
    await page.goto('file:///Users/timsmykov/worktrees-prompt-extension/frontend/extension/src/ui/popup/popup.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Popup UI loads', async ({ page }) => {
    // Check that the app container is visible
    const app = page.locator('#app');
    await expect(app).toBeVisible();

    // Check for title - use text locator to avoid matching logo span
    const title = page.getByText('Prompt Improver');
    await expect(title).toBeVisible();
  });

  test('Popup form fields are present and functional', async ({ page }) => {
    // Check all form fields exist
    await expect(page.locator('#apiKey')).toBeVisible();
    await expect(page.locator('#model')).toBeVisible();
    await expect(page.locator('#systemPrompt')).toBeVisible();
    await expect(page.locator('#typingSpeed')).toBeVisible();

    // Check default values
    await expect(page.locator('#model')).toHaveValue('openrouter/auto');
    await expect(page.locator('#typingSpeed')).toHaveValue('25');

    // Test input interaction
    await page.locator('#model').fill('anthropic/claude-3-haiku');
    await expect(page.locator('#model')).toHaveValue('anthropic/claude-3-haiku');

    await page.locator('#typingSpeed').fill('50');
    await expect(page.locator('#typingSpeed')).toHaveValue('50');
  });

  test('Show/Hide API key toggle works', async ({ page }) => {
    const apiKeyInput = page.locator('#apiKey');

    // Initially should be password type
    await expect(apiKeyInput).toHaveAttribute('type', 'password');

    // Click show button
    await page.locator('button.ghost').first().click();

    // Should now be text type
    await expect(apiKeyInput).toHaveAttribute('type', 'text');

    // Click hide button again
    await page.locator('button.ghost').first().click();

    // Should be password type again
    await expect(apiKeyInput).toHaveAttribute('type', 'password');
  });

  test('Save button is present and functional', async ({ page }) => {
    const saveButton = page.locator('button.primary');
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toContainText('Save');

    // Fill in form data
    await page.locator('#apiKey').fill('sk-test-api-key');
    await page.locator('#model').fill('test-model');
    await page.locator('#systemPrompt').fill('Test system prompt');

    // Click save
    await saveButton.click();

    // Should show "Saved." message briefly
    const statusMessage = page.locator('.status');
    await expect(statusMessage).toContainText('Saved.');
  });

  test('No console errors on popup load', async ({ page }) => {
    // Wait a bit for any async errors
    await page.waitForTimeout(1000);

    // Check console for errors
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    // Force another wait to catch any delayed errors
    await page.waitForTimeout(500);

    // There should be no console errors
    const jsErrors = consoleMessages.filter(msg =>
      !msg.includes('favicon') &&
      !msg.includes('404')
    );

    if (jsErrors.length > 0) {
      console.log('Console errors found:', jsErrors);
    }

    expect(jsErrors.length).toBe(0);
  });
});

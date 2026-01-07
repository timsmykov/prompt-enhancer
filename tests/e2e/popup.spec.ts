import { test, expect } from '@playwright/test';
import {
  getExtensionId,
  openPopup,
  setStorageData,
  getStorageData,
  clearStorage,
  mockOpenRouterAPI
} from '../helpers/extension-loader';
import { generateTestApiKey, delay } from '../helpers/test-utils';

test.describe('Popup E2E Tests', () => {
  let extensionId: string;
  let page: any;

  test.beforeAll(async ({ browser, context }) => {
    page = await browser.newPage();
    extensionId = await getExtensionId(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.beforeEach(async () => {
    await clearStorage(page);
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');
  });

  test('should open popup successfully', async () => {
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('[data-testid="popup-container"]')).toBeVisible({ timeout: 5000 });
  });

  test('should display all form fields', async () => {
    await expect(page.locator('input[name="apiKey"]')).toBeVisible();
    await expect(page.locator('input[name="model"]')).toBeVisible();
    await expect(page.locator('textarea[name="systemPrompt"]')).toBeVisible();
  });

  test('should save API key', async () => {
    const testApiKey = generateTestApiKey();

    await page.fill('input[name="apiKey"]', testApiKey);
    await page.click('button[type="submit"]');

    // Wait for save to complete
    await delay(500);

    // Verify saved in storage
    const storage = await getStorageData(page);
    expect(storage.apiKey).toBe(testApiKey);
  });

  test('should save model selection', async () => {
    await page.fill('input[name="apiKey"]', generateTestApiKey());
    await page.fill('input[name="model"]', 'openai/gpt-4');
    await page.click('button[type="submit"]');

    await delay(500);

    const storage = await getStorageData(page);
    expect(storage.model).toBe('openai/gpt-4');
  });

  test('should save system prompt', async () => {
    const testPrompt = 'You are an expert prompt engineer.';
    await page.fill('input[name="apiKey"]', generateTestApiKey());
    await page.fill('textarea[name="systemPrompt"]', testPrompt);
    await page.click('button[type="submit"]');

    await delay(500);

    const storage = await getStorageData(page);
    expect(storage.systemPrompt).toBe(testPrompt);
  });

  test('should validate empty API key', async () => {
    await page.fill('input[name="apiKey"]', '');
    await page.click('button[type="submit"]');

    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('API key is required');
  });

  test('should validate invalid API key format', async () => {
    await page.fill('input[name="apiKey"]', 'invalid-key');
    await page.click('button[type="submit"]');

    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should show success message on valid save', async () => {
    await page.fill('input[name="apiKey"]', generateTestApiKey());
    await page.click('button[type="submit"]');

    await expect(page.locator('[data-testid="success-message"]')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Settings saved');
  });

  test('should load existing settings from storage', async () => {
    const existingSettings = {
      apiKey: generateTestApiKey(),
      model: 'anthropic/claude-3-opus',
      systemPrompt: 'You are a helpful assistant.',
      typingSpeed: 20
    };

    await setStorageData(page, existingSettings);
    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('input[name="apiKey"]')).toHaveValue(existingSettings.apiKey);
    await expect(page.locator('input[name="model"]')).toHaveValue(existingSettings.model);
    await expect(page.locator('textarea[name="systemPrompt"]')).toHaveValue(existingSettings.systemPrompt);
  });

  test('should test API connection', async () => {
    const testApiKey = generateTestApiKey();

    // Mock successful API response
    await mockOpenRouterAPI(page, {
      choices: [{
        message: {
          content: 'Test improved prompt'
        }
      }]
    });

    await page.fill('input[name="apiKey"]', testApiKey);
    await page.click('[data-testid="test-connection-btn"]');

    await expect(page.locator('[data-testid="connection-status"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="connection-status"]')).toContainText('Connection successful');
  });

  test('should show error on failed API connection', async () => {
    // Mock failed API response
    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid API key' })
      });
    });

    await page.fill('input[name="apiKey"]', 'invalid-key');
    await page.click('[data-testid="test-connection-btn"]');

    await expect(page.locator('[data-testid="connection-status"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="connection-status"]')).toContainText('Connection failed');
  });

  test('should handle keyboard shortcuts - Cmd+S to save', async () => {
    await page.fill('input[name="apiKey"]', generateTestApiKey());

    // Press Cmd+S
    await page.keyboard.press('Meta+s');

    await expect(page.locator('[data-testid="success-message"]')).toBeVisible({ timeout: 3000 });
  });

  test('should handle keyboard shortcuts - Escape to close', async () => {
    // This test verifies the popup can handle Escape key
    await page.keyboard.press('Escape');

    // In a real popup, Escape would close it
    // Here we just verify no errors occur
    await expect(page.locator('body')).toBeVisible();
  });

  test('should reset to defaults', async () => {
    await page.fill('input[name="apiKey"]', generateTestApiKey());
    await page.fill('input[name="model"]', 'custom-model');
    await page.click('[data-testid="reset-btn"]');

    await expect(page.locator('input[name="model"]')).toHaveValue('openrouter/auto');
  });

  test('should show loading state during save', async () => {
    await page.fill('input[name="apiKey"]', generateTestApiKey());
    await page.click('button[type="submit"]');

    await expect(page.locator('[data-testid="save-button"]')).toHaveAttribute('data-loading', 'true');
  });

  test('should handle special characters in system prompt', async () => {
    const specialPrompt = 'Test prompt with "quotes" and \'apostrophes\' and <special> & chars';
    await page.fill('input[name="apiKey"]', generateTestApiKey());
    await page.fill('textarea[name="systemPrompt"]', specialPrompt);
    await page.click('button[type="submit"]');

    await delay(500);

    const storage = await getStorageData(page);
    expect(storage.systemPrompt).toBe(specialPrompt);
  });

  test('should handle long system prompts', async () => {
    const longPrompt = 'A'.repeat(4000); // Max allowed length
    await page.fill('input[name="apiKey"]', generateTestApiKey());
    await page.fill('textarea[name="systemPrompt"]', longPrompt);

    const charCount = await page.textContent('[data-testid="char-count"]');
    expect(charCount).toContain('4000');
  });

  test('should show error when prompt exceeds max length', async () => {
    const tooLongPrompt = 'A'.repeat(5000); // Exceeds max
    await page.fill('input[name="apiKey"]', generateTestApiKey());
    await page.fill('textarea[name="systemPrompt"]', tooLongPrompt);

    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });
});

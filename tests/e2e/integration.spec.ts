import { test, expect } from '@playwright/test';
import {
  getExtensionId,
  openPopup,
  setStorageData,
  clearStorage,
  mockOpenRouterAPI,
  waitForOverlay,
  selectText
} from '../helpers/extension-loader';
import { generateTestApiKey, delay, createTestPage } from '../helpers/test-utils';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

test.describe('Integration E2E Tests', () => {
  let extensionId: string;
  let page: any;
  let testPageUrl: string;

  test.beforeAll(async ({ browser, context, baseURL }) => {
    page = await browser.newPage();
    extensionId = await getExtensionId(page);

    const testDir = join(process.cwd(), 'test-pages');
    mkdirSync(testDir, { recursive: true });
    writeFileSync(join(testDir, 'integration-test.html'), createTestPage());
    testPageUrl = `${baseURL}/test-pages/integration-test.html`;
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.beforeEach(async () => {
    await clearStorage(page);
  });

  test('complete workflow: setup popup → improve prompt → replace', async () => {
    // Step 1: Open popup and configure
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    const apiKey = generateTestApiKey();
    await page.fill('input[name="apiKey"]', apiKey);
    await page.fill('input[name="model"]', 'openai/gpt-4');
    await page.fill('textarea[name="systemPrompt"]', 'You are an expert prompt engineer.');
    await page.click('button[type="submit"]');

    await expect(page.locator('[data-testid="success-message"]')).toBeVisible({ timeout: 3000 });
    await delay(500);

    // Step 2: Go to test page and improve prompt
    await mockOpenRouterAPI(page, {
      choices: [{
        message: {
          content: 'Expertly crafted improved prompt with precision and clarity.'
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

    // Step 3: Verify improvement and replace
    await expect(page.locator('.improved-text')).toContainText('Expertly crafted');
    await page.click('[data-testid="replace-btn"]');

    const newText = await page.textContent('#test-text-1');
    expect(newText).toBe('Expertly crafted improved prompt with precision and clarity.');
  });

  test('should maintain settings across popup closes', async () => {
    // Open popup, set settings
    await openPopup(page, extensionId);
    const settings = {
      apiKey: generateTestApiKey(),
      model: 'anthropic/claude-3',
      systemPrompt: 'Persistent settings test',
      typingSpeed: 30
    };

    await page.fill('input[name="apiKey"]', settings.apiKey);
    await page.fill('input[name="model"]', settings.model);
    await page.fill('textarea[name="systemPrompt"]', settings.systemPrompt);
    await page.click('button[type="submit"]');

    await delay(500);

    // Close and reopen popup
    await page.close();
    page = await page.context().newPage();
    await openPopup(page, extensionId);

    // Verify settings persisted
    await expect(page.locator('input[name="apiKey"]')).toHaveValue(settings.apiKey);
    await expect(page.locator('input[name="model"]')).toHaveValue(settings.model);
    await expect(page.locator('textarea[name="systemPrompt"]')).toHaveValue(settings.systemPrompt);
  });

  test('should handle multiple improvements in history', async () => {
    // Set up extension
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto',
      systemPrompt: 'Test prompt improver'
    });

    await page.goto(testPageUrl);

    // First improvement
    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              content: 'First improvement'
            }
          }]
        })
      });
    });

    await selectText(page, '#test-text-1');
    await page.click('#test-text-1', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');
    await waitForOverlay(page);
    await delay(1500);
    await page.keyboard.press('Escape');

    // Second improvement
    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              content: 'Second improvement'
            }
          }]
        })
      });
    });

    await selectText(page, '#test-text-2');
    await page.click('#test-text-2', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');
    await waitForOverlay(page);
    await delay(1500);

    // Open history
    await page.click('[data-testid="history-toggle"]');

    // Should have 2 history items
    await expect(page.locator('[data-testid="history-item"]')).toHaveCount(2);
  });

  test('should validate API key before allowing improvements', async () => {
    // Set invalid API key
    await setStorageData(page, {
      apiKey: 'invalid-key',
      model: 'openrouter/auto'
    });

    await page.goto(testPageUrl);
    await selectText(page, '#test-text-1');
    await page.click('#test-text-1', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');

    // Should show error about invalid API key
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible({ timeout: 5000 });
  });

  test('should respect system prompt settings in API calls', async () => {
    const customSystemPrompt = 'Always respond with JSON format';

    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto',
      systemPrompt: customSystemPrompt
    });

    // Capture API request
    let capturedRequest: any = null;
    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      const request = route.request();
      capturedRequest = requestpostDataJSON();
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              content: '{"result": "formatted response"}'
            }
          }]
        })
      });
    });

    await page.goto(testPageUrl);
    await selectText(page, '#test-text-1');
    await page.click('#test-text-1', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');

    await delay(2000);

    // Verify system prompt was sent
    expect(capturedRequest?.messages?.[0]?.content).toBe(customSystemPrompt);
  });

  test('should handle offline scenario gracefully', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    // Simulate offline by blocking API
    await page.route('**://openrouter.ai/**', (route: any) => {
      route.abort('failed');
    });

    await page.goto(testPageUrl);
    await selectText(page, '#test-text-1');
    await page.click('#test-text-1', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');

    await waitForOverlay(page);

    // Should show network error
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('network');
  });

  test('should handle session token validation', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    await mockOpenRouterAPI(page, {
      choices: [{
        message: {
          content: 'Secure improvement'
        }
      }]
    });

    await page.goto(testPageUrl);
    await selectText(page, '#test-text-1');
    await page.click('#test-text-1', { button: 'right' });
    await delay(200);
    await page.click('[data-menu-item="improve-prompt"]');

    await waitForOverlay(page);

    // Should not show security errors
    await expect(page.locator('[data-testid="security-error"]')).not.toBeVisible();
  });

  test('should handle concurrent improvement requests', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    const responses = ['Improvement 1', 'Improvement 2', 'Improvement 3'];
    let responseIndex = 0;

    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              content: responses[responseIndex++ % responses.length]
            }
          }]
        })
      });
    });

    await page.goto(testPageUrl);

    // Trigger multiple improvements quickly
    const promises = [];
    for (let i = 0; i < 3; i++) {
      await selectText(page, '#test-text-1');
      await page.click('#test-text-1', { button: 'right' });
      await delay(100);
      await page.click('[data-menu-item="improve-prompt"]');
      await delay(200);
    }

    await delay(3000);

    // All should complete without errors
    await expect(page.locator('[data-testid="error-message"]')).not.toBeVisible();
  });
});

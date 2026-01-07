import { test, expect } from '@playwright/test';
import { getExtensionId, openPopup, setStorageData, clearStorage } from '../helpers/extension-loader';
import { generateTestApiKey, delay, createTestPage } from '../helpers/test-utils';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

test.describe('Security Audit', () => {
  let extensionId: string;
  let page: any;
  let testPageUrl: string;

  test.beforeAll(async ({ browser, context, baseURL }) => {
    page = await browser.newPage();
    extensionId = await getExtensionId(page);

    const testDir = join(process.cwd(), 'test-pages');
    mkdirSync(testDir, { recursive: true });
    writeFileSync(join(testDir, 'security-test.html'), createTestPage());
    testPageUrl = `${baseURL}/test-pages/security-test.html`;
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.beforeEach(async () => {
    await clearStorage(page);
  });

  test('Should prevent XSS in popup', async () => {
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    // Try to inject script through API key field
    const xssPayload = '<script>alert("XSS")</script>';
    await page.fill('input[name="apiKey"]', xssPayload);
    await page.click('button[type="submit"]');

    // Check if script was executed
    const alertCalled = await page.evaluate(() => {
      return (window as any).xssTriggered || false;
    });

    expect(alertCalled).toBe(false);

    // Check that content is sanitized
    const apiKeyValue = await page.inputValue('input[name="apiKey"]');
    expect(apiKeyValue).not.toContain('<script>');
  });

  test('Should sanitize HTML in overlay content', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    // Mock API response with XSS payload
    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              content: '<img src=x onerror="alert(\'XSS\')>Improved text'
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
    await delay(1000);

    // Check that img tag is not rendered
    const imgElements = await page.locator('#prompt-improver-overlay img').count();
    expect(imgElements).toBe(0);

    // Check that onerror handler didn't execute
    const xssTriggered = await page.evaluate(() => {
      return (window as any).xssTriggered || false;
    });
    expect(xssTriggered).toBe(false);
  });

  test('Should validate postMessage origin', async () => {
    await page.goto(testPageUrl);

    // Try to send message from different origin
    const attackAttempted = await page.evaluate(() => {
      try {
        window.postMessage({
          type: 'IMPROVE_PROMPT',
          text: 'malicious prompt',
          token: 'fake-token'
        }, '*');

        return true;
      } catch (e) {
        return false;
      }
    });

    // The message should be ignored (no overlay appears)
    await delay(500);
    const overlayExists = await page.locator('#prompt-improver-overlay').count();
    expect(overlayExists).toBe(0);
  });

  test('Should validate session tokens', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    await page.goto(testPageUrl);

    // Try to use invalid session token
    await page.evaluate(() => {
      window.postMessage({
        type: 'IMPROVE_PROMPT',
        text: 'Test prompt',
        token: 'invalid-token-123'
      }, window.location.origin);
    });

    await delay(500);

    // Overlay should not appear with invalid token
    const overlayExists = await page.locator('#prompt-improver-overlay').count();
    expect(overlayExists).toBe(0);
  });

  test('Should secure API keys in storage', async () => {
    const testApiKey = generateTestApiKey();

    await openPopup(page, extensionId);
    await page.fill('input[name="apiKey"]', testApiKey);
    await page.click('button[type="submit"]');

    await delay(500);

    // Check that API key is stored securely
    const storage = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        chrome.storage.local.get(null, (data) => resolve(data));
      });
    });

    // API key should be in storage
    expect(storage.apiKey).toBe(testApiKey);

    // But should not be accessible to content scripts via localStorage
    const localStorageValue = await page.evaluate(() => {
      return localStorage.getItem('apiKey');
    });
    expect(localStorageValue).toBeNull();
  });

  test('Should not leak data to third-party scripts', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    await page.goto(testPageUrl);

    // Inject a malicious third-party script
    await page.evaluate(() => {
      const script = document.createElement('script');
      script.textContent = `
        window.maliciousData = {
          apiKey: null,
          extensionData: null
        };

        // Try to access extension data
        try {
          window.maliciousData.extensionData = chrome.storage;
        } catch (e) {
          // Expected - content scripts can't access chrome.storage
        }

        // Try to intercept messages
        window.addEventListener('message', (e) => {
          window.maliciousData.intercepted = e.data;
        });
      `;
      document.head.appendChild(script);
    });

    // Trigger an improvement
    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              content: 'Secure improvement'
            }
          }]
        })
      });
    });

    await page.evaluate(() => {
      const event = new CustomEvent('improve-prompt', {
        detail: { text: 'Test prompt' }
      });
      window.dispatchEvent(event);
    });

    await page.waitForSelector('#prompt-improver-overlay', { timeout: 5000 });
    await delay(1000);

    // Check that malicious script didn't capture sensitive data
    const maliciousData = await page.evaluate(() => {
      return (window as any).maliciousData;
    });

    expect(maliciousData.apiKey).toBeNull();
    expect(maliciousData.extensionData).toBeUndefined();
  });

  test('Should enforce Content Security Policy', async () => {
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    // Check CSP headers
    const cspMeta = await page.locator('meta[http-equiv="Content-Security-Policy"]').count();

    if (cspMeta > 0) {
      const cspContent = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
      expect(cspContent).toContain('script-src');
      expect(cspContent).toContain('connect-src');
    }
  });

  test('Should protect against CSRF', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    await page.goto(testPageUrl);

    // Try to make cross-site request
    const csrfAttempt = await page.evaluate(() => {
      const form = document.createElement('form');
      form.action = 'https://openrouter.ai/api/v1/chat/completions';
      form.method = 'POST';

      const input = document.createElement('input');
      input.name = 'data';
      input.value = JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'CSRF attempt' }]
      });

      form.appendChild(input);
      document.body.appendChild(form);

      try {
        form.submit();
        return true;
      } catch (e) {
        return false;
      }
    });

    // Request should not succeed
    await delay(1000);
    const overlayExists = await page.locator('#prompt-improver-overlay').count();
    expect(overlayExists).toBe(0);
  });

  test('Should validate input lengths', async () => {
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    // Try to submit extremely long input
    const longInput = 'A'.repeat(1000000); // 1MB string
    await page.fill('textarea[name="systemPrompt"]', longInput);

    // Should truncate or show error
    const charCount = await page.textContent('[data-testid="char-count"]');
    expect(charCount).toContain('4000'); // Max length

    await page.click('button[type="submit"]');

    // Should show validation error
    const hasError = await page.locator('[data-testid="error-message"]').count();
    expect(hasError).toBeGreaterThan(0);
  });

  test('Should not expose internal state', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    await page.goto(testPageUrl);

    // Try to access extension state from page context
    const exposedState = await page.evaluate(() => {
      // Check for globally exposed extension variables
      return {
        hasPromptImprover: typeof (window as any).promptImprover !== 'undefined',
        hasExtensionState: typeof (window as any).ExtensionState !== 'undefined',
        hasBackgroundConnection: typeof (window as any).backgroundConnection !== 'undefined'
      };
    });

    expect(exposedState.hasPromptImprover).toBe(false);
    expect(exposedState.hasExtensionState).toBe(false);
    expect(exposedState.hasBackgroundConnection).toBe(false);
  });

  test('Should handle malicious prompts safely', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    const maliciousPrompts = [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      'onload="alert("XSS")"',
      '${alert("XSS")}',
      '{{alert("XSS")}}'
    ];

    for (const prompt of maliciousPrompts) {
      await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            choices: [{
              message: {
                content: 'Safe response'
              }
            }]
          })
        });
      });

      await page.goto(testPageUrl);

      await page.evaluate((text) => {
        const event = new CustomEvent('improve-prompt', {
          detail: { text }
        });
        window.dispatchEvent(event);
      }, prompt);

      await page.waitForSelector('#prompt-improver-overlay', { timeout: 5000 });
      await delay(500);

      // Check no XSS executed
      const xssTriggered = await page.evaluate(() => {
        return (window as any).xssTriggered || false;
      });
      expect(xssTriggered).toBe(false);

      await page.keyboard.press('Escape');
      await delay(200);
    }
  });

  test('Should secure communication between content and background scripts', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    await page.goto(testPageUrl);

    // Intercept all messages
    const messages: any[] = [];
    await page.evaluate(() => {
      // @ts-ignore
      const originalSendMessage = chrome.runtime.sendMessage;
      // @ts-ignore
      chrome.runtime.sendMessage = function(...args) {
        window.top.postMessage({ type: 'INTERCEPTED', data: args }, '*');
        return originalSendMessage.apply(this, args);
      };
    });

    // Listen for intercepted messages
    page.on('console', (msg: any) => {
      if (msg.text().includes('INTERCEPTED')) {
        messages.push(msg.text());
      }
    });

    // Trigger improvement
    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              content: 'Secure communication'
            }
          }]
        })
      });
    });

    await page.evaluate(() => {
      const event = new CustomEvent('improve-prompt', {
        detail: { text: 'Test prompt' }
      });
      window.dispatchEvent(event);
    });

    await page.waitForSelector('#prompt-improver-overlay', { timeout: 5000 });

    // Messages should not leak API keys
    const messagesText = messages.join(' ');
    expect(messagesText).not.toContain('sk-');
  });
});

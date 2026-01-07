/**
 * Helper utilities for loading and testing Chrome extensions with Playwright
 */

export interface ExtensionInfo {
  id: string;
  name: string;
  path: string;
}

/**
 * Get the extension ID from the loaded extensions page
 */
export async function getExtensionId(page: any): Promise<string> {
  await page.goto('chrome://extensions/');
  await page.waitForTimeout(1000); // Wait for extensions to load

  // Get extension ID from the page
  const extensionId = await page.evaluate(() => {
    const extensions = document.querySelector('extensions-manager');
    // @ts-ignore - Chrome API
    const items = extensions?.extensionsList || [];
    const promptImprover = items.find((ext: any) =>
      ext.name.includes('Prompt Improver')
    );
    return promptImprover?.id || '';
  });

  if (!extensionId) {
    throw new Error('Extension not found. Ensure it is loaded.');
  }

  return extensionId;
}

/**
 * Navigate to the extension popup page
 */
export async function openPopup(page: any, extensionId: string): Promise<void> {
  await page.goto(`chrome-extension://${extensionId}/ui/popup/popup.html`);
  await page.waitForLoadState('networkidle');
}

/**
 * Get extension background page context
 */
export async function getBackgroundPage(page: any, extensionId: string): Promise<any> {
  const backgroundPage = await page.context().newPage();
  await backgroundPage.goto(`chrome-extension://${extensionId}/_generated_background_page.html`);
  return backgroundPage;
}

/**
 * Set extension storage data
 */
export async function setStorageData(page: any, data: any): Promise<void> {
  await page.evaluate((storageData) => {
    return new Promise((resolve) => {
      // @ts-ignore - Chrome API
      chrome.storage.local.set(storageData, () => resolve(true));
    });
  }, data);
}

/**
 * Get extension storage data
 */
export async function getStorageData(page: any): Promise<any> {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      // @ts-ignore - Chrome API
      chrome.storage.local.get(null, (data) => resolve(data));
    });
  });
}

/**
 * Clear all extension storage
 */
export async function clearStorage(page: any): Promise<void> {
  await page.evaluate(() => {
    return new Promise((resolve) => {
      // @ts-ignore - Chrome API
      chrome.storage.local.clear(() => resolve(true));
    });
  });
}

/**
 * Mock OpenRouter API responses
 */
export async function mockOpenRouterAPI(page: any, mockResponse: any): Promise<void> {
  await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponse)
    });
  });
}

/**
 * Wait for overlay to appear
 */
export async function waitForOverlay(page: any): Promise<any> {
  return await page.waitForSelector('#prompt-improver-overlay', { timeout: 5000 });
}

/**
 * Get overlay content
 */
export async function getOverlayContent(page: any): Promise<any> {
  return await page.evaluate(() => {
    const overlay = document.querySelector('#prompt-improver-overlay');
    if (!overlay) return null;

    const originalText = overlay?.querySelector('.original-text')?.textContent || '';
    const improvedText = overlay?.querySelector('.improved-text')?.textContent || '';
    const isVisible = overlay?.checkVisibility() || false;

    return { originalText, improvedText, isVisible };
  });
}

/**
 * Select text on a page
 */
export async function selectText(page: any, selector: string): Promise<void> {
  await page.click(selector);
  await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (element) {
      const range = document.createRange();
      range.selectNodeContents(element);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, selector);
}

/**
 * Trigger context menu
 */
export async function triggerContextMenu(page: any): Promise<void> {
  await page.keyboard.down('Shift');
  await page.mouse.rightClick(100, 100);
  await page.keyboard.up('Shift');
}

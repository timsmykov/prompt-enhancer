import { test, expect } from '@playwright/test';
import { getExtensionId, openPopup, setStorageData, clearStorage } from '../helpers/extension-loader';
import { generateTestApiKey, delay, createTestPage } from '../helpers/test-utils';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

test.describe('Performance Audit (Lighthouse)', () => {
  let extensionId: string;
  let page: any;
  let testPageUrl: string;

  test.beforeAll(async ({ browser, context, baseURL }) => {
    page = await browser.newPage();
    extensionId = await getExtensionId(page);

    const testDir = join(process.cwd(), 'test-pages');
    mkdirSync(testDir, { recursive: true });
    writeFileSync(join(testDir, 'performance-test.html'), createTestPage());
    testPageUrl = `${baseURL}/test-pages/performance-test.html`;
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.beforeEach(async () => {
    await clearStorage(page);
  });

  test('Popup should load quickly (< 1s)', async () => {
    const startTime = Date.now();

    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(1000);
  });

  test('Popup should have small bundle size', async () => {
    await openPopup(page, extensionId);
    await page.waitForLoadState('networkidle');

    // Get resource sizes
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map((r: any) => ({
        name: r.name,
        size: r.transferSize
      }));
    });

    let totalSize = 0;
    resources.forEach((r: any) => {
      if (r.name.includes('popup')) {
        totalSize += r.size;
      }
    });

    // Total should be under 100KB
    expect(totalSize).toBeLessThan(100 * 1024);
  });

  test('Overlay should appear quickly', async () => {
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
              content: 'Quick improvement'
            }
          }]
        })
      });
    });

    await page.goto(testPageUrl);

    const startTime = Date.now();

    await page.evaluate(() => {
      const event = new CustomEvent('improve-prompt', {
        detail: { text: 'Test prompt' }
      });
      window.dispatchEvent(event);
    });

    await page.waitForSelector('#prompt-improver-overlay', { timeout: 5000 });

    const overlayTime = Date.now() - startTime;

    expect(overlayTime).toBeLessThan(500);
  });

  test('Typing animation should maintain 60fps', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto',
      typingSpeed: 10
    });

    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              content: 'A'.repeat(500) // Long text to test animation
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

    // Monitor frame rate during animation
    const frameMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frameCount = 0;
        let lastTime = performance.now();
        const frames: number[] = [];

        const measureFrame = () => {
          const now = performance.now();
          const fps = 1000 / (now - lastTime);
          frames.push(fps);
          lastTime = now;
          frameCount++;

          if (frameCount < 60) {
            requestAnimationFrame(measureFrame);
          } else {
            const avgFps = frames.reduce((a, b) => a + b, 0) / frames.length;
            resolve(avgFps);
          }
        };

        requestAnimationFrame(measureFrame);
      });
    });

    expect(frameMetrics).toBeGreaterThan(55); // Allow some variance
  });

  test('Should not leak memory during multiple operations', async () => {
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
              content: 'Memory test improvement'
            }
          }]
        })
      });
    });

    await page.goto(testPageUrl);

    // Get initial memory
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // Perform multiple operations
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => {
        const event = new CustomEvent('improve-prompt', {
          detail: { text: 'Test prompt' }
        });
        window.dispatchEvent(event);
      });

      await page.waitForSelector('#prompt-improver-overlay', { timeout: 5000 });
      await delay(1000);
      await page.keyboard.press('Escape');
      await delay(200);
    }

    // Get final memory
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // Memory growth should be minimal (< 50MB)
    const memoryGrowth = finalMemory - initialMemory;
    expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024);
  });

  test('API requests should timeout appropriately', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    // Mock slow API
    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      // Delay response by 20 seconds
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            choices: [{
              message: {
                content: 'Delayed response'
              }
            }]
          })
        });
      }, 20000);
    });

    await page.goto(testPageUrl);

    const startTime = Date.now();

    await page.evaluate(() => {
      const event = new CustomEvent('improve-prompt', {
        detail: { text: 'Test prompt' }
      });
      window.dispatchEvent(event);
    });

    // Should timeout within REQUEST_TIMEOUT_MS (15000ms)
    await page.waitForSelector('[data-testid="error-message"]', { timeout: 20000 });

    const timeoutTime = Date.now() - startTime;

    expect(timeoutTime).toBeGreaterThan(14000);
    expect(timeoutTime).toBeLessThan(18000);
  });

  test('Should handle concurrent requests efficiently', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    let requestCount = 0;
    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      requestCount++;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              content: `Concurrent ${requestCount}`
            }
          }]
        })
      });
    });

    await page.goto(testPageUrl);

    const startTime = Date.now();

    // Fire 5 requests concurrently
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        page.evaluate(() => {
          const event = new CustomEvent('improve-prompt', {
            detail: { text: 'Test prompt' }
          });
          window.dispatchEvent(event);
        })
      );
      await delay(100);
    }

    await Promise.all(promises);
    await delay(2000);

    const totalTime = Date.now() - startTime;

    // Should complete in reasonable time (< 5s for 5 requests)
    expect(totalTime).toBeLessThan(5000);
    expect(requestCount).toBe(5);
  });

  test('Storage operations should be fast', async () => {
    const iterations = 100;
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();

      await page.evaluate((data) => {
        return new Promise((resolve) => {
          // @ts-ignore
          chrome.storage.local.set(data, () => resolve(true));
        });
      }, { test: `iteration-${i}` });

      times.push(Date.now() - startTime);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const maxTime = Math.max(...times);

    // Average should be < 50ms
    expect(avgTime).toBeLessThan(50);
    // Max should be < 200ms
    expect(maxTime).toBeLessThan(200);
  });

  test('Should have minimal impact on host page performance', async () => {
    await page.goto(testPageUrl);

    // Measure page performance without extension
    const baselineFPS = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frames = 0;
        let startTime = performance.now();

        const measure = () => {
          frames++;
          if (performance.now() - startTime >= 1000) {
            resolve(frames);
          } else {
            requestAnimationFrame(measure);
          }
        };

        requestAnimationFrame(measure);
      });
    });

    // Load extension
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    // Measure with extension
    const withExtensionFPS = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frames = 0;
        let startTime = performance.now();

        const measure = () => {
          frames++;
          if (performance.now() - startTime >= 1000) {
            resolve(frames);
          } else {
            requestAnimationFrame(measure);
          }
        };

        requestAnimationFrame(measure);
      });
    });

    // FPS should not drop significantly (< 10%)
    const fpsDrop = (baselineFPS - withExtensionFPS) / baselineFPS;
    expect(fpsDrop).toBeLessThan(0.1);
  });

  test('Should efficiently handle large text selections', async () => {
    await setStorageData(page, {
      apiKey: generateTestApiKey(),
      model: 'openrouter/auto'
    });

    const largeText = 'A'.repeat(10000); // 10k characters

    await page.route('**://openrouter.ai/api/v1/chat/completions', (route: any) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              content: 'Large text improvement'
            }
          }]
        })
      });
    });

    await page.goto(testPageUrl);

    const startTime = Date.now();

    await page.evaluate((text) => {
      const event = new CustomEvent('improve-prompt', {
        detail: { text }
      });
      window.dispatchEvent(event);
    }, largeText);

    await page.waitForSelector('#prompt-improver-overlay', { timeout: 10000 });

    const processingTime = Date.now() - startTime;

    expect(processingTime).toBeLessThan(2000);
  });
});

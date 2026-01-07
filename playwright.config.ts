import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Chrome Extension E2E testing
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // Chrome extensions don't support parallel testing well
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker to avoid extension conflicts
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: 'chrome-extension://*/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false, // Extensions require headed mode
    contextOptions: {
      permissions: ['storage'],
      ignoreHTTPSErrors: true
    }
  },
  projects: [
    {
      name: 'chromium-extension',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // Use Chrome instead of Chromium for extension support
        launchOptions: {
          args: [
            `--disable-extensions-except=/Users/timsmykov/Desktop/worktree-testing/extension`,
            `--load-extension=/Users/timsmykov/Desktop/worktree-testing/extension`
          ]
        }
      },
    },
  ],
  // WebServer configuration for local testing
  webServer: {
    command: 'npx http-server . -p 8080',
    port: 8080,
    reuseExistingServer: !process.env.CI,
  },
});

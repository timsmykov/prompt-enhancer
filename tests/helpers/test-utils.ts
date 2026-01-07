/**
 * Utility functions for testing
 */

/**
 * Generate a random API key for testing
 */
export function generateTestApiKey(): string {
  return `sk-test-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Generate a random session token
 */
export function generateTestToken(): string {
  return 'test-token-' + Math.random().toString(36).substring(2, 15);
}

/**
 * Wait for a specific condition
 */
export async function waitForCondition(
  condition: () => boolean,
  timeout = 5000,
  interval = 100
): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (condition()) return;
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Delay for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock console methods
 */
export function mockConsole(): {
  log: jest.Mock;
  error: jest.Mock;
  warn: jest.Mock;
  restore: () => void;
} {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  const logMock = jest.fn();
  const errorMock = jest.fn();
  const warnMock = jest.fn();

  console.log = logMock;
  console.error = errorMock;
  console.warn = warnMock;

  return {
    log: logMock,
    error: errorMock,
    warn: warnMock,
    restore: () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    }
  };
}

/**
 * Create a mock Chrome API
 */
export function createMockChromeAPI() {
  return {
    storage: {
      local: {
        get: jest.fn((keys, callback) => {
          const result = {};
          callback?.(result);
          return Promise.resolve(result);
        }),
        set: jest.fn((items, callback) => {
          callback?.();
          return Promise.resolve();
        }),
        clear: jest.fn((callback) => {
          callback?.();
          return Promise.resolve();
        })
      }
    },
    runtime: {
      sendMessage: jest.fn(),
      onMessage: {
        addListener: jest.fn(),
        removeListener: jest.fn()
      }
    }
  };
}

/**
 * Create a test page with content
 */
export function createTestPage(): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Test Page</title>
      </head>
      <body>
        <h1>Test Page for Prompt Improver</h1>
        <p id="test-text-1">This is a simple prompt that needs improvement.</p>
        <p id="test-text-2">Write a function to sort an array.</p>
        <div id="test-text-3" contenteditable="true">
          Create a web page with good design.
        </div>
      </body>
    </html>
  `;
}

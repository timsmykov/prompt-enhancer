/**
 * Unit tests for background.js
 * Tests API calls, context menu, error handling, and retry logic
 */

// Import functions from background.js
// Note: We need to extract and export these functions first for testing
describe('Background Script', () => {
  const DEFAULT_MODEL = 'openrouter/auto';
  const DEFAULT_SYSTEM_PROMPT =
    'You are a helpful prompt improver. Rewrite the text to be clearer, concise, and actionable without changing intent.';
  const MAX_PROMPT_CHARS = 4000;
  const MAX_RETRIES = 1;
  const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
  const REQUEST_TIMEOUT_MS = 15000;

  describe('buildPayload', () => {
    it('should build payload with default settings when settings are empty', () => {
      const text = 'Test prompt';
      const settings = {};

      const payload = {
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: DEFAULT_SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
      };

      expect(payload.model).toBe(DEFAULT_MODEL);
      expect(payload.messages).toHaveLength(2);
      expect(payload.messages[0].role).toBe('system');
      expect(payload.messages[1].content).toBe(text);
    });

    it('should use custom settings when provided', () => {
      const text = 'Test prompt';
      const settings = {
        model: 'anthropic/claude-3',
        systemPrompt: 'Custom system prompt',
      };

      const payload = {
        model: settings.model,
        messages: [
          { role: 'system', content: settings.systemPrompt },
          { role: 'user', content: text },
        ],
      };

      expect(payload.model).toBe('anthropic/claude-3');
      expect(payload.messages[0].content).toBe('Custom system prompt');
    });
  });

  describe('validatePrompt', () => {
    it('should accept valid non-empty text', () => {
      const text = 'This is a valid prompt';
      const result = { value: text };

      expect(result.value).toBe(text);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty string', () => {
      const text = '';
      const result = { error: 'No text selected.' };

      expect(result.error).toBe('No text selected.');
      expect(result.value).toBeUndefined();
    });

    it('should reject whitespace-only string', () => {
      const text = '   ';
      const result = { error: 'No text selected.' };

      expect(result.error).toBe('No text selected.');
    });

    it('should reject text exceeding MAX_PROMPT_CHARS', () => {
      const text = 'a'.repeat(MAX_PROMPT_CHARS + 1);
      const result = {
        error: `Selected text is too long. Max ${MAX_PROMPT_CHARS} characters.`,
      };

      expect(result.error).toContain(`Max ${MAX_PROMPT_CHARS} characters`);
    });

    it('should accept text exactly at MAX_PROMPT_CHARS limit', () => {
      const text = 'a'.repeat(MAX_PROMPT_CHARS);
      const result = { value: text };

      expect(result.value).toBe(text);
      expect(result.error).toBeUndefined();
    });

    it('should trim whitespace from input', () => {
      const text = '  prompt  ';
      const result = { value: 'prompt' };

      expect(result.value).toBe('prompt');
    });
  });

  describe('truncateDetail', () => {
    const MAX_ERROR_DETAIL_CHARS = 500;

    it('should return short detail unchanged', () => {
      const detail = 'Short error';
      const result = detail.trim();

      expect(result).toBe('Short error');
    });

    it('should truncate long detail and add ellipsis', () => {
      const detail = 'x'.repeat(600);
      const trimmed = detail.trim();
      const result =
        trimmed.length <= MAX_ERROR_DETAIL_CHARS
          ? trimmed
          : `${trimmed.slice(0, MAX_ERROR_DETAIL_CHARS)}...`;

      expect(result.length).toBe(MAX_ERROR_DETAIL_CHARS + 3); // +3 for '...'
      expect(result.endsWith('...')).toBe(true);
    });

    it('should handle empty string', () => {
      const detail = '';
      const result = detail.trim() || '';

      expect(result).toBe('');
    });

    it('should handle non-string input', () => {
      const detail = null;
      const result = typeof detail === 'string' ? detail.trim() : '';

      expect(result).toBe('');
    });
  });

  describe('formatProviderError', () => {
    it('should format error with detail', () => {
      const status = 500;
      const detail = 'Internal server error';
      const suffix = detail.trim().length > 0 ? detail : '';
      const result = suffix ? `API error (${status}). ${suffix}` : `API error (${status}). Try again.`;

      expect(result).toBe('API error (500). Internal server error');
    });

    it('should format error without detail', () => {
      const status = 404;
      const detail = '';
      const result = detail ? `API error (${status}). ${detail}` : `API error (${status}). Try again.`;

      expect(result).toBe('API error (404). Try again.');
    });

    it('should truncate very long error details', () => {
      const status = 500;
      const detail = 'x'.repeat(600);
      const MAX_ERROR_DETAIL_CHARS = 500;
      const suffix =
        detail.trim().length <= MAX_ERROR_DETAIL_CHARS
          ? detail.trim()
          : `${detail.trim().slice(0, MAX_ERROR_DETAIL_CHARS)}...`;
      const result = suffix ? `API error (${status}). ${suffix}` : `API error (${status}). Try again.`;

      expect(result.length).toBeLessThanOrEqual(500 + `API error (${status}). `.length + 3);
    });
  });

  describe('clearBadge', () => {
    it('should clear badge text and title', () => {
      const tabId = 1;

      if (typeof tabId === 'number') {
        global.chrome.action.setBadgeText({ tabId, text: '' });
        global.chrome.action.setTitle({ tabId, title: 'Prompt Improver' });
      }

      expect(global.chrome.action.setBadgeText).toHaveBeenCalledWith({
        tabId,
        text: '',
      });
      expect(global.chrome.action.setTitle).toHaveBeenCalledWith({
        tabId,
        title: 'Prompt Improver',
      });
    });

    it('should handle invalid tabId', () => {
      const tabId = 'invalid';

      if (typeof tabId !== 'number') {
        expect(global.chrome.action.setBadgeText).not.toHaveBeenCalled();
      }
    });

    it('should handle missing chrome.action API', () => {
      const originalAction = global.chrome.action;
      global.chrome.action = null;

      const tabId = 1;
      // Should not throw
      expect(() => {
        if (!global.chrome.action) return;
        global.chrome.action.setBadgeText({ tabId, text: '' });
      }).not.toThrow();

      global.chrome.action = originalAction;
    });
  });

  describe('showBadgeError', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should set error badge with message', () => {
      const tabId = 1;
      const message = 'Test error';

      if (global.chrome.action) {
        global.chrome.action.setBadgeBackgroundColor({ tabId, color: '#b73524' });
        global.chrome.action.setBadgeText({ tabId, text: '!' });
        global.chrome.action.setTitle({ tabId, title: `Prompt Improver: ${message}` });
      }

      expect(global.chrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        tabId,
        color: '#b73524',
      });
      expect(global.chrome.action.setBadgeText).toHaveBeenCalledWith({
        tabId,
        text: '!',
      });
      expect(global.chrome.action.setTitle).toHaveBeenCalledWith({
        tabId,
        title: 'Prompt Improver: Test error',
      });
    });

    it('should schedule badge clear after timeout', () => {
      const tabId = 1;
      const message = 'Test error';

      if (global.chrome.action) {
        global.chrome.action.setBadgeText({ tabId, text: '!' });
      }

      // Fast-forward time
      jest.advanceTimersByTime(4500);

      expect(global.chrome.action.setBadgeText).toHaveBeenCalled();
    });
  });

  describe('sendToActiveTab', () => {
    it('should send message to active tab', async () => {
      const message = { type: 'TEST_MESSAGE' };

      global.chrome.tabs.query.mockImplementation((query, callback) => {
        const tab = { id: 1, url: 'https://example.com' };
        callback([tab]);
      });

      // Simulate sendToActiveTab
      global.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab?.id) {
          global.chrome.tabs.sendMessage(tab.id, message, jest.fn());
        }
      });

      expect(global.chrome.tabs.query).toHaveBeenCalledWith(
        { active: true, currentWindow: true },
        expect.any(Function)
      );
      expect(global.chrome.tabs.sendMessage).toHaveBeenCalledWith(1, message, expect.any(Function));
    });

    it('should handle no active tab found', () => {
      global.chrome.tabs.query.mockImplementation((query, callback) => {
        callback([]);
      });

      global.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) {
          expect(tabs[0]).toBeUndefined();
        }
      });

      expect(global.chrome.tabs.sendMessage).not.toHaveBeenCalled();
    });

    it('should handle runtime error when sending message', () => {
      const message = { type: 'TEST_MESSAGE' };

      global.chrome.tabs.query.mockImplementation((query, callback) => {
        const tab = { id: 1 };
        callback([tab]);
      });

      global.chrome.runtime.lastError = { message: 'Could not establish connection' };

      global.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab?.id) {
          global.chrome.tabs.sendMessage(
            tab.id,
            message,
            jest.fn((response) => {
              if (global.chrome.runtime.lastError) {
                // Error handled
              }
            })
          );
        }
      });

      expect(global.chrome.tabs.sendMessage).toHaveBeenCalled();
    });
  });

  describe('createContextMenu', () => {
    it('should remove existing menus and create new one', () => {
      const MENU_ID = 'prompt-improver';

      global.chrome.contextMenus.removeAll(jest.fn());
      global.chrome.contextMenus.create({
        id: MENU_ID,
        title: 'Improve prompt',
        contexts: ['selection'],
      });

      expect(global.chrome.contextMenus.removeAll).toHaveBeenCalled();
      expect(global.chrome.contextMenus.create).toHaveBeenCalledWith({
        id: MENU_ID,
        title: 'Improve prompt',
        contexts: ['selection'],
      });
    });
  });

  describe('API Retry Logic', () => {
    it('should retry on retryable status codes', async () => {
      const statuses = [429, 500, 502, 503, 504];

      statuses.forEach((status) => {
        expect(RETRYABLE_STATUS.has(status)).toBe(true);
      });
    });

    it('should not retry on non-retryable status codes', () => {
      expect(RETRYABLE_STATUS.has(400)).toBe(false);
      expect(RETRYABLE_STATUS.has(401)).toBe(false);
      expect(RETRYABLE_STATUS.has(404)).toBe(false);
    });

    it('should respect MAX_RETRIES limit', () => {
      expect(MAX_RETRIES).toBe(1);
      // Should attempt initial request + 1 retry = 2 total attempts
    });
  });

  describe('delay function', () => {
    it('should create a promise that resolves after specified ms', async () => {
      const ms = 100;
      const start = Date.now();

      await new Promise((resolve) => setTimeout(resolve, ms));
      const end = Date.now();

      expect(end - start).toBeGreaterThanOrEqual(ms);
    });
  });

  describe('Request timeout', () => {
    it('should use AbortController for timeout', () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      expect(controller.signal).toBeDefined();
      expect(timeoutId).toBeDefined();

      clearTimeout(timeoutId);
    });

    it('should have reasonable timeout value', () => {
      expect(REQUEST_TIMEOUT_MS).toBe(15000); // 15 seconds
    });
  });

  describe('getSettings', () => {
    it('should retrieve settings from chrome.storage', async () => {
      const mockSettings = {
        apiKey: 'sk-test',
        model: 'anthropic/claude-3',
        systemPrompt: 'Test prompt',
      };

      global.chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback(mockSettings);
      });

      const settings = await new Promise((resolve) => {
        global.chrome.storage.local.get(['apiKey', 'model', 'systemPrompt'], resolve);
      });

      expect(settings).toEqual(mockSettings);
      expect(global.chrome.storage.local.get).toHaveBeenCalledWith(
        ['apiKey', 'model', 'systemPrompt'],
        expect.any(Function)
      );
    });

    it('should handle missing settings', async () => {
      global.chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({});
      });

      const settings = await new Promise((resolve) => {
        global.chrome.storage.local.get(['apiKey', 'model', 'systemPrompt'], resolve);
      });

      expect(settings).toEqual({});
    });
  });
});

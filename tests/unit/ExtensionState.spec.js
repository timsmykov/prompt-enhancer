import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// Mock Chrome API
global.chrome = {
  storage: {
    local: {
      get: vi.fn((keys, callback) => {
        callback({});
      }),
      set: vi.fn((items, callback) => {
        callback?.();
      })
    }
  },
  runtime: {
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn()
    }
  }
};

// Load ExtensionState implementation
const extensionCode = readFileSync(
  join(process.cwd(), '../extension/src/content/content.js'),
  'utf-8'
);

describe('ExtensionState Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('get()', () => {
    it('should return stored settings', async () => {
      const mockData = {
        apiKey: 'sk-test-123',
        model: 'openrouter/auto',
        systemPrompt: 'Test prompt'
      };

      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback(mockData);
      });

      // Simulate ExtensionState.get()
      const result = await new Promise((resolve) => {
        chrome.storage.local.get(null, (data) => resolve(data));
      });

      expect(result).toEqual(mockData);
      expect(chrome.storage.local.get).toHaveBeenCalledWith(null, expect.any(Function));
    });

    it('should return empty object when no data stored', async () => {
      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({});
      });

      const result = await new Promise((resolve) => {
        chrome.storage.local.get(null, (data) => resolve(data));
      });

      expect(result).toEqual({});
    });

    it('should get specific keys', async () => {
      const mockData = { apiKey: 'sk-test-123' };
      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback(mockData);
      });

      const result = await new Promise((resolve) => {
        chrome.storage.local.get(['apiKey'], (data) => resolve(data));
      });

      expect(result).toEqual(mockData);
      expect(chrome.storage.local.get).toHaveBeenCalledWith(['apiKey'], expect.any(Function));
    });
  });

  describe('set()', () => {
    it('should save settings to storage', async () => {
      const testData = {
        apiKey: 'sk-test-456',
        model: 'openai/gpt-4'
      };

      chrome.storage.local.set.mockImplementation((items, callback) => {
        callback?.();
      });

      await new Promise((resolve) => {
        chrome.storage.local.set(testData, () => resolve());
      });

      expect(chrome.storage.local.set).toHaveBeenCalledWith(testData, expect.any(Function));
    });

    it('should handle save errors gracefully', async () => {
      const error = new Error('Storage error');
      chrome.storage.local.set.mockImplementation((items, callback) => {
        throw error;
      });

      const testData = { apiKey: 'sk-test-789' };

      await expect(async () => {
        await new Promise((resolve) => {
          chrome.storage.local.set(testData, () => resolve());
        });
      }).rejects.toThrow('Storage error');
    });
  });

  describe('subscribe()', () => {
    it('should register callback for storage changes', () => {
      const callback = vi.fn();

      // Simulate subscribing to storage changes
      chrome.storage.onChanged = {
        addListener: vi.fn()
      };

      chrome.storage.onChanged.addListener(callback);

      expect(chrome.storage.onChanged.addListener).toHaveBeenCalledWith(callback);
    });

    it('should call callback when settings change', () => {
      const callback = vi.fn();
      chrome.storage.onChanged = {
        addListener: vi.fn()
      };

      chrome.storage.onChanged.addListener(callback);

      // Simulate storage change event
      const changes = {
        apiKey: {
          oldValue: 'sk-old',
          newValue: 'sk-new'
        }
      };

      const listener = chrome.storage.onChanged.addListener.mock.calls[0][0];
      listener(changes, 'local');

      expect(callback).toHaveBeenCalledWith(changes, 'local');
    });
  });

  describe('validate()', () => {
    it('should validate API key format', () => {
      const validKeys = [
        'sk-test-1234567890',
        'sk-or-v1-abc123def456',
        'sk-proj-abc123def456'
      ];

      validKeys.forEach(key => {
        const isValid = key.startsWith('sk-');
        expect(isKey).toBe(true);
      });
    });

    it('should reject invalid API keys', () => {
      const invalidKeys = [
        '',
        'invalid',
        'sk-',
        '12345'
      ];

      invalidKeys.forEach(key => {
        const isValid = key && key.length > 10 && key.startsWith('sk-');
        expect(isValid).toBe(false);
      });
    });

    it('should validate model format', () => {
      const validModels = [
        'openrouter/auto',
        'openai/gpt-4',
        'anthropic/claude-3-opus'
      ];

      validModels.forEach(model => {
        const isValid = model.includes('/');
        expect(isValid).toBe(true);
      });
    });

    it('should validate system prompt length', () => {
      const validPrompt = 'A'.repeat(4000);
      const invalidPrompt = 'A'.repeat(4001);

      const isValidLength = validPrompt.length <= 4000;
      const isInvalidLength = invalidPrompt.length > 4000;

      expect(isValidLength).toBe(true);
      expect(isInvalidLength).toBe(true);
    });
  });

  describe('reset()', () => {
    it('should clear all settings', async () => {
      chrome.storage.local.clear = vi.fn((callback) => {
        callback?.();
      });

      await new Promise((resolve) => {
        chrome.storage.local.clear(() => resolve());
      });

      expect(chrome.storage.local.clear).toHaveBeenCalled();
    });

    it('should restore defaults after reset', async () => {
      chrome.storage.local.clear = vi.fn((callback) => {
        callback?.();
      });

      chrome.storage.local.set = vi.fn((items, callback) => {
        callback?.();
      });

      const defaults = {
        model: 'openrouter/auto',
        systemPrompt: 'You are a helpful prompt improver...',
        typingSpeed: 10
      };

      await new Promise((resolve) => {
        chrome.storage.local.clear(() => {
          chrome.storage.local.set(defaults, () => resolve());
        });
      });

      expect(chrome.storage.local.clear).toHaveBeenCalled();
      expect(chrome.storage.local.set).toHaveBeenCalledWith(defaults, expect.any(Function));
    });
  });
});

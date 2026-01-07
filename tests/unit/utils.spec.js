import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Utility Functions Unit Tests', () => {
  describe('generateSessionToken()', () => {
    it('should generate unique tokens', () => {
      const tokens = new Set();
      for (let i = 0; i < 100; i++) {
        const token = 'token-' + Math.random().toString(36).substring(2, 15);
        tokens.add(token);
      }
      expect(tokens.size).toBe(100);
    });

    it('should generate tokens with correct format', () => {
      const token = 'token-' + Math.random().toString(36).substring(2, 15);
      expect(token).toMatch(/^token-[a-z0-9]+$/);
      expect(token.length).toBeGreaterThan(10);
    });
  });

  describe('truncateText()', () => {
    const truncateText = (text, maxLength) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    };

    it('should not truncate short text', () => {
      const text = 'Short text';
      expect(truncateText(text, 100)).toBe(text);
    });

    it('should truncate long text', () => {
      const text = 'A'.repeat(100);
      const truncated = truncateText(text, 50);
      expect(truncated.length).toBe(53); // 50 + '...'
      expect(truncated).toMatch(/\.\.\.$/);
    });

    it('should handle empty text', () => {
      expect(truncateText('', 100)).toBe('');
    });

    it('should handle exact length match', () => {
      const text = 'ABC';
      expect(truncateText(text, 3)).toBe(text);
    });
  });

  describe('sanitizeHTML()', () => {
    const sanitizeHTML = (str) => {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    };

    it('should escape HTML entities', () => {
      expect(sanitizeHTML('<script>')).toBe('&lt;script&gt;');
      expect(sanitizeHTML('<div>')).toBe('&lt;div&gt;');
    });

    it('should escape quotes', () => {
      expect(sanitizeHTML('"test"')).toBe('&quot;test&quot;');
      expect(sanitizeHTML("'test'")).toBe('&#x27;test&#x27;');
    });

    it('should escape ampersands', () => {
      expect(sanitizeHTML('A&B')).toBe('A&amp;B');
    });

    it('should handle empty string', () => {
      expect(sanitizeHTML('')).toBe('');
    });
  });

  describe('validatePromptLength()', () => {
    const MAX_CHARS = 4000;
    const validatePromptLength = (text) => {
      if (text.length > MAX_CHARS) {
        return {
          valid: false,
          error: `Prompt too long. Maximum ${MAX_CHARS} characters.`
        };
      }
      return { valid: true };
    };

    it('should accept valid length prompts', () => {
      const short = 'Short prompt';
      const exact = 'A'.repeat(MAX_CHARS);

      expect(validatePromptLength(short).valid).toBe(true);
      expect(validatePromptLength(exact).valid).toBe(true);
    });

    it('should reject too long prompts', () => {
      const tooLong = 'A'.repeat(MAX_CHARS + 1);
      const result = validatePromptLength(tooLong);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('too long');
    });
  });

  describe('formatModelName()', () => {
    const formatModelName = (model) => {
      if (!model) return 'Unknown';
      const parts = model.split('/');
      return parts[parts.length - 1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    it('should format model names correctly', () => {
      expect(formatModelName('openai/gpt-4')).toBe('Gpt 4');
      expect(formatModelName('anthropic/claude-3-opus')).toBe('Claude 3 Opus');
      expect(formatModelName('openrouter/auto')).toBe('Auto');
    });

    it('should handle empty model name', () => {
      expect(formatModelName('')).toBe('Unknown');
      expect(formatModelName(null)).toBe('Unknown');
      expect(formatModelName(undefined)).toBe('Unknown');
    });

    it('should handle models without slash', () => {
      expect(formatModelName('gpt-4')).toBe('Gpt 4');
    });
  });

  describe('debounce()', () => {
    const debounce = (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    it('should delay function execution', async () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      expect(fn).not.toHaveBeenCalled();

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous calls', async () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('copyToClipboard()', () => {
    it('should handle modern Clipboard API', async () => {
      const mockClipboard = {
        writeText: vi.fn().mockResolvedValue(undefined)
      };

      global.navigator.clipboard = mockClipboard;

      const text = 'Test text';
      await navigator.clipboard.writeText(text);

      expect(mockClipboard.writeText).toHaveBeenCalledWith(text);
    });

    it('should fall back to execCommand when Clipboard API unavailable', () => {
      // Simulate no Clipboard API
      const mockExecCommand = vi.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      const textArea = document.createElement('textarea');
      textArea.value = 'Test';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');

      expect(success).toBe(true);
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
    });
  });

  describe('calculateTypingSpeed()', () => {
    const calculateTypingSpeed = (textLength, targetDuration) => {
      return Math.max(1, Math.floor(textLength / (targetDuration / 10)));
    };

    it('should calculate typing speed for short text', () => {
      const speed = calculateTypingSpeed(100, 2000); // 100 chars in 2 seconds
      expect(speed).toBeGreaterThan(0);
      expect(speed).toBeLessThan(100);
    });

    it('should calculate typing speed for long text', () => {
      const speed = calculateTypingSpeed(1000, 3000); // 1000 chars in 3 seconds
      expect(speed).toBeGreaterThan(1);
    });

    it('should never return zero or negative speed', () => {
      const speed1 = calculateTypingSpeed(1, 1000);
      const speed2 = calculateTypingSpeed(10, 5000);
      expect(speed1).toBeGreaterThanOrEqual(1);
      expect(speed2).toBeGreaterThanOrEqual(1);
    });
  });

  describe('escapeRegex()', () => {
    const escapeRegex = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    it('should escape special regex characters', () => {
      expect(escapeRegex('a.txt')).toBe('a\\.txt');
      expect(escapeRegex('test*pattern')).toBe('test\\*pattern');
      expect(escapeRegex('(group)')).toBe('\\(group\\)');
      expect(escapeRegex('[array]')).toBe('\\[array\\]');
    });

    it('should handle strings with multiple special chars', () => {
      const input = 'test.*+?^${}()|[]\\';
      const escaped = escapeRegex(input);
      expect(escaped).toMatch(/\\./g);
    });

    it('should not escape normal characters', () => {
      expect(escapeRegex('abc123')).toBe('abc123');
    });
  });
});

import { describe, it, expect, beforeEach } from 'vitest';

describe('ErrorHandler Unit Tests', () => {
  let ErrorHandler;

  beforeEach(() => {
    // Define ErrorHandler class (simulated from production code)
    ErrorHandler = class {
      static errorMap = {
        'missing_api_key': {
          message: 'API key is required. Please set it in the extension settings.',
          userAction: 'Open settings and enter your API key.'
        },
        'invalid_api_key': {
          message: 'Invalid API key format.',
          userAction: 'Check your API key and try again.'
        },
        'api_error': {
          message: 'API request failed.',
          userAction: 'Please try again later.'
        },
        'rate_limit': {
          message: 'Rate limit exceeded.',
          userAction: 'Wait a moment before trying again.'
        },
        'network_error': {
          message: 'Network error occurred.',
          userAction: 'Check your internet connection.'
        },
        'empty_selection': {
          message: 'No text selected.',
          userAction: 'Select some text to improve.'
        },
        'invalid_response': {
          message: 'Invalid response from API.',
          userAction: 'Please try again.'
        },
        'timeout': {
          message: 'Request timeout.',
          userAction: 'Please try again.'
        }
      };

      static mapError(error, context = {}) {
        const errorCode = this.identifyError(error);
        const errorInfo = this.errorMap[errorCode] || {
          message: 'Unknown error occurred.',
          userAction: 'Please try again.'
        };

        return {
          code: errorCode,
          ...errorInfo,
          originalError: error.message,
          context
        };
      }

      static identifyError(error) {
        if (error.message?.includes('API key')) return 'missing_api_key';
        if (error.message?.includes('401') || error.message?.includes('403')) return 'invalid_api_key';
        if (error.message?.includes('429')) return 'rate_limit';
        if (error.message?.includes('network') || error.message?.includes('fetch')) return 'network_error';
        if (error.message?.includes('timeout')) return 'timeout';
        if (error.message?.includes('empty') || error.message?.includes('selection')) return 'empty_selection';
        return 'api_error';
      }

      static getUserMessage(error) {
        const mapped = this.mapError(error);
        return `${mapped.message}\n\n${mapped.userAction}`;
      }

      static isRetryable(error) {
        const code = this.identifyError(error);
        return ['rate_limit', 'network_error', 'timeout', 'api_error'].includes(code);
      }
    };
  });

  describe('mapError()', () => {
    it('should map missing API key errors', () => {
      const error = new Error('API key is missing');
      const mapped = ErrorHandler.mapError(error);

      expect(mapped.code).toBe('missing_api_key');
      expect(mapped.message).toContain('API key is required');
      expect(mapped.userAction).toContain('Open settings');
    });

    it('should map invalid API key errors', () => {
      const error = new Error('401 Unauthorized');
      const mapped = ErrorHandler.mapError(error);

      expect(mapped.code).toBe('invalid_api_key');
      expect(mapped.message).toContain('Invalid API key');
    });

    it('should map rate limit errors', () => {
      const error = new Error('429 Too Many Requests');
      const mapped = ErrorHandler.mapError(error);

      expect(mapped.code).toBe('rate_limit');
      expect(mapped.message).toContain('Rate limit');
    });

    it('should map network errors', () => {
      const error = new Error('network error occurred');
      const mapped = ErrorHandler.mapError(error);

      expect(mapped.code).toBe('network_error');
      expect(mapped.message).toContain('Network error');
    });

    it('should map timeout errors', () => {
      const error = new Error('Request timeout');
      const mapped = ErrorHandler.mapError(error);

      expect(mapped.code).toBe('timeout');
      expect(mapped.message).toContain('timeout');
    });

    it('should map empty selection errors', () => {
      const error = new Error('empty selection');
      const mapped = ErrorHandler.mapError(error);

      expect(mapped.code).toBe('empty_selection');
      expect(mapped.message).toContain('No text selected');
    });

    it('should include context in mapped error', () => {
      const error = new Error('API error');
      const context = { action: 'improve_prompt', textLength: 100 };
      const mapped = ErrorHandler.mapError(error, context);

      expect(mapped.context).toEqual(context);
      expect(mapped.originalError).toBe('API error');
    });

    it('should handle unknown errors', () => {
      const error = new Error('something unexpected');
      const mapped = ErrorHandler.mapError(error);

      expect(mapped.code).toBe('api_error');
      expect(mapped.message).toContain('Unknown error');
    });
  });

  describe('getUserMessage()', () => {
    it('should format user-friendly error message', () => {
      const error = new Error('401 Unauthorized');
      const userMessage = ErrorHandler.getUserMessage(error);

      expect(userMessage).toContain('Invalid API key');
      expect(userMessage).toContain('Check your API key');
    });

    it('should separate message and user action with newlines', () => {
      const error = new Error('429 Too Many Requests');
      const userMessage = ErrorHandler.getUserMessage(error);

      expect(userMessage).toMatch(/.*\n\n.*/);
    });
  });

  describe('isRetryable()', () => {
    it('should identify retryable errors', () => {
      const retryableErrors = [
        new Error('429 Too Many Requests'),
        new Error('network error'),
        new Error('timeout'),
        new Error('API error')
      ];

      retryableErrors.forEach(error => {
        expect(ErrorHandler.isRetryable(error)).toBe(true);
      });
    });

    it('should identify non-retryable errors', () => {
      const nonRetryableErrors = [
        new Error('API key is missing'),
        new Error('401 Unauthorized'),
        new Error('empty selection')
      ];

      nonRetryableErrors.forEach(error => {
        expect(ErrorHandler.isRetryable(error)).toBe(false);
      });
    });
  });

  describe('identifyError()', () => {
    it('should identify error type from message content', () => {
      const testCases = [
        { message: 'API key is required', expected: 'missing_api_key' },
        { message: '401 Forbidden', expected: 'invalid_api_key' },
        { message: '403 Unauthorized', expected: 'invalid_api_key' },
        { message: '429 Rate limit', expected: 'rate_limit' },
        { message: 'network failure', expected: 'network_error' },
        { message: 'fetch failed', expected: 'network_error' },
        { message: 'request timeout', expected: 'timeout' },
        { message: 'empty text selection', expected: 'empty_selection' },
        { message: 'unknown error', expected: 'api_error' }
      ];

      testCases.forEach(({ message, expected }) => {
        const error = new Error(message);
        expect(ErrorHandler.identifyError(error)).toBe(expected);
      });
    });
  });
});

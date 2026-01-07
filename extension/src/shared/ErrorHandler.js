/**
 * ErrorHandler - Centralized error handling for the extension
 * Provides user-friendly error messages and consistent error logging
 */

(() => {
  if (window.ErrorHandler) {
    return; // Already loaded
  }

  const ErrorHandler = {
    // Error categories for better handling
    ErrorCategory: {
      NETWORK: 'network',
      API: 'api',
      DOM: 'dom',
      PERMISSION: 'permission',
      VALIDATION: 'validation',
      UNKNOWN: 'unknown'
    },

    // User-friendly error messages
    errorMessages: {
      'Missing API key': 'Please add your OpenRouter API key in the extension settings.',
      'No text selected': 'Please select some text to improve.',
      'Selected text is too long': 'The selected text is too long. Please select a shorter text (max 4000 characters).',
      'Network error': 'Network error. Please check your internet connection.',
      'Request timed out': 'The request timed out. Please try again.',
      'API error': 'The API returned an error. Please try again.',
      'Background not available': 'Extension error: Background script not available.',
      'Cannot run on this page': 'This extension cannot run on this page.',
      'Failed to parse provider response': 'Invalid response from API. Please try again.',
      'No response content returned': 'The API returned no content. Please try again.',
      'Default': 'An error occurred. Please try again.'
    },

    /**
     * Categorize an error based on its properties
     */
    categorizeError(error) {
      if (!error) return this.ErrorCategory.UNKNOWN;

      if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        return this.ErrorCategory.NETWORK;
      }

      if (error.message?.includes('API') || error.message?.includes('provider')) {
        return this.ErrorCategory.API;
      }

      if (error.message?.includes('permission') || error.message?.includes('restricted')) {
        return this.ErrorCategory.PERMISSION;
      }

      if (error.message?.includes('selected') || error.message?.includes('text')) {
        return this.ErrorCategory.VALIDATION;
      }

      if (error instanceof DOMException || error instanceof TypeError) {
        return this.ErrorCategory.DOM;
      }

      return this.ErrorCategory.UNKNOWN;
    },

    /**
     * Get a user-friendly error message
     */
    getUserMessage(error) {
      if (!error) return this.errorMessages['Default'];

      const errorStr = error.message || error.toString();

      // Try exact match first
      if (this.errorMessages[errorStr]) {
        return this.errorMessages[errorStr];
      }

      // Try partial match
      for (const [key, message] of Object.entries(this.errorMessages)) {
        if (key !== 'Default' && errorStr.includes(key)) {
          return message;
        }
      }

      return this.errorMessages['Default'];
    },

    /**
     * Log error with context
     */
    log(context, error, category = null) {
      const errorCategory = category || this.categorizeError(error);
      const userMessage = this.getUserMessage(error);

      console.error(`[PromptImprover] ${context}:`, {
        error,
        category: errorCategory,
        userMessage,
        timestamp: Date.now()
      });

      return {
        error,
        category: errorCategory,
        userMessage,
        timestamp: Date.now()
      };
    },

    /**
     * Create a standardized error object
     */
    createError(message, category = null, originalError = null) {
      const error = new Error(message);
      error.category = category || this.ErrorCategory.UNKNOWN;
      error.originalError = originalError;
      error.timestamp = Date.now();
      return error;
    },

    /**
     * Check if a page is restricted (chrome://, about:, etc.)
     */
    isRestrictedPage() {
      const protocol = window.location.protocol;
      const restrictedProtocols = ['chrome:', 'chrome-extension:', 'about:', 'edge:', 'opera:'];
      return restrictedProtocols.includes(protocol);
    },

    /**
     * Validate that we can run on current page
     */
    validatePage() {
      if (this.isRestrictedPage()) {
        throw this.createError(
          'Cannot run on this page',
          this.ErrorCategory.PERMISSION
        );
      }

      if (!document.body) {
        throw this.createError(
          'Page not ready',
          this.ErrorCategory.DOM
        );
      }

      return true;
    },

    /**
     * Wrap an async function with error handling and retry logic
     */
    async withRetry(fn, maxRetries = 2, delayMs = 600) {
      let lastError;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await fn();
        } catch (error) {
          lastError = error;

          // Don't retry on certain errors
          if (error.category === this.ErrorCategory.PERMISSION ||
              error.category === this.ErrorCategory.VALIDATION) {
            throw error;
          }

          // Don't retry on last attempt
          if (attempt === maxRetries) {
            throw error;
          }

          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
        }
      }

      throw lastError;
    },

    /**
     * Safely execute a function and handle errors
     */
    safeExecute(fn, onError = null) {
      try {
        return fn();
      } catch (error) {
        this.log('safeExecute', error);
        if (onError) {
          return onError(error);
        }
        return null;
      }
    },

    /**
     * Safely execute an async function and handle errors
     */
    async safeExecuteAsync(fn, onError = null) {
      try {
        return await fn();
      } catch (error) {
        this.log('safeExecuteAsync', error);
        if (onError) {
          return onError(error);
        }
        return null;
      }
    }
  };

  window.ErrorHandler = ErrorHandler;
})();

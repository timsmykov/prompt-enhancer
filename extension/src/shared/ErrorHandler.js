/**
 * ErrorHandler - Centralized Error Handling and Recovery
 * Provides error boundaries, user-friendly messages, and recovery strategies
 * @version 1.0.0
 */

(() => {
  'use strict';

  /**
   * Error types and their user-facing messages
   */
  const ERROR_MESSAGES = {
    // Network errors
    NETWORK_ERROR: 'Network error. Please check your connection.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
    FETCH_ERROR: 'Failed to fetch data. Please try again.',

    // API errors
    API_KEY_MISSING: 'API key not configured. Please add it in Settings.',
    API_KEY_INVALID: 'API key is invalid. Please check your Settings.',
    API_ERROR: 'API error occurred. Please try again.',
    API_RATE_LIMIT: 'Rate limit exceeded. Please wait a moment.',
    API_UNAVAILABLE: 'Service unavailable. Please try again later.',

    // Validation errors
    VALIDATION_ERROR: 'Invalid input. Please check your input.',
    EMPTY_SELECTION: 'No text selected.',
    TEXT_TOO_LONG: 'Selected text is too long.',
    INVALID_URL: 'Invalid URL provided.',

    // Storage errors
    STORAGE_ERROR: 'Failed to save settings. Please try again.',
    STORAGE_QUOTA_EXCEEDED: 'Storage quota exceeded. Please clear some data.',

    // Extension errors
    PERMISSION_DENIED: 'Permission denied. Please check extension permissions.',
    CONTEXT_INVALID: 'Cannot run on this page.',
    TAB_CLOSED: 'Tab was closed.',
    CONTENT_SCRIPT_INJECT_FAILED: 'Failed to inject content script.',

    // Generic errors
    UNKNOWN_ERROR: 'An unexpected error occurred.',
    NOT_IMPLEMENTED: 'Feature not yet implemented.',
  };

  /**
   * Recovery strategies for different error types
   */
  const RECOVERY_STRATEGIES = {
    NETWORK_ERROR: 'retry',
    TIMEOUT_ERROR: 'retry',
    FETCH_ERROR: 'retry',
    API_RATE_LIMIT: 'delayed_retry',
    API_UNAVAILABLE: 'delayed_retry',
    STORAGE_ERROR: 'fallback',
    PERMISSION_DENIED: 'settings',
    CONTEXT_INVALID: 'close',
  };

  /**
   * Severity levels for errors
   */
  const ERROR_SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
  };

  /**
   * Map errors to severity levels
   */
  const ERROR_SEVERITY_MAP = {
    NETWORK_ERROR: ERROR_SEVERITY.MEDIUM,
    TIMEOUT_ERROR: ERROR_SEVERITY.MEDIUM,
    API_KEY_MISSING: ERROR_SEVERITY.HIGH,
    API_KEY_INVALID: ERROR_SEVERITY.HIGH,
    API_RATE_LIMIT: ERROR_SEVERITY.LOW,
    API_UNAVAILABLE: ERROR_SEVERITY.MEDIUM,
    EMPTY_SELECTION: ERROR_SEVERITY.LOW,
    TEXT_TOO_LONG: ERROR_SEVERITY.MEDIUM,
    PERMISSION_DENIED: ERROR_SEVERITY.HIGH,
    CONTEXT_INVALID: ERROR_SEVERITY.LOW,
    STORAGE_ERROR: ERROR_SEVERITY.MEDIUM,
    UNKNOWN_ERROR: ERROR_SEVERITY.HIGH,
  };

  /**
   * ErrorHandler Class
   */
  class ErrorHandler {
    constructor() {
      // Error log for debugging
      this._errorLog = [];
      this._maxLogSize = 100;
      // Listeners for error events
      this._listeners = new Map();
    }

    /**
     * Handle an error with automatic classification and recovery
     * @param {Error|Object|string} error - Error to handle
     * @param {Object} context - Additional context
     * @returns {Object} Handled error result
     */
    handle(error, context = {}) {
      const classified = this._classifyError(error, context);

      // Log error
      this._logError(classified);

      // Notify listeners
      this._notifyListeners(classified);

      // Determine recovery strategy
      const recovery = this._getRecoveryStrategy(classified);

      return {
        ...classified,
        recovery,
        canRetry: recovery === 'retry' || recovery === 'delayed_retry',
        canRecover: recovery !== 'close',
      };
    }

    /**
     * Classify error into known types
     * @private
     * @param {Error|Object|string} error - Raw error
     * @param {Object} context - Additional context
     * @returns {Object} Classified error
     */
    _classifyError(error, context) {
      let type = 'UNKNOWN_ERROR';
      let message = ERROR_MESSAGES.UNKNOWN_ERROR;
      let originalError = error;

      // Extract error information
      if (error instanceof Error) {
        originalError = {
          name: error.name,
          message: error.message,
          stack: error.stack,
        };
      } else if (typeof error === 'string') {
        originalError = { message: error };
      } else if (error && typeof error === 'object') {
        originalError = error;
      }

      // Classify based on error properties
      if (!error) {
        type = 'UNKNOWN_ERROR';
      } else if (error instanceof Error) {
        // Network errors
        if (error.name === 'AbortError') {
          type = 'TIMEOUT_ERROR';
        }
        // Check error message
        else if (error.message.includes('Failed to fetch')) {
          type = 'NETWORK_ERROR';
        } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
          type = 'TIMEOUT_ERROR';
        }
      } else if (typeof error === 'object') {
        // API errors
        if (error.status) {
          const status = error.status;
          if (status === 401 || status === 403) {
            type = 'API_KEY_INVALID';
          } else if (status === 429) {
            type = 'API_RATE_LIMIT';
          } else if (status >= 500) {
            type = 'API_UNAVAILABLE';
          } else if (status >= 400) {
            type = 'API_ERROR';
          }
        }
        // Check for error code/type
        else if (error.code) {
          if (error.code === 'PERMISSION_DENIED') {
            type = 'PERMISSION_DENIED';
          } else if (error.code === 'STORAGE_QUOTA_EXCEEDED') {
            type = 'STORAGE_QUOTA_EXCEEDED';
          }
        }
        // Check message
        else if (error.error) {
          if (error.error.includes('API key')) {
            type = 'API_KEY_INVALID';
          } else if (error.error.includes('rate limit')) {
            type = 'API_RATE_LIMIT';
          }
        }
      } else if (typeof error === 'string') {
        if (error.includes('API key')) {
          type = error.includes('missing') ? 'API_KEY_MISSING' : 'API_KEY_INVALID';
        } else if (error.includes('No text') || error.includes('empty')) {
          type = 'EMPTY_SELECTION';
        } else if (error.includes('too long')) {
          type = 'TEXT_TOO_LONG';
        } else if (error.includes('permission')) {
          type = 'PERMISSION_DENIED';
        } else if (error.includes('Cannot run')) {
          type = 'CONTEXT_INVALID';
        }
      }

      // Override with context if provided
      if (context.type) {
        type = context.type;
      }

      // Get user-friendly message
      message = ERROR_MESSAGES[type] || message;

      // Get severity
      const severity = ERROR_SEVERITY_MAP[type] || ERROR_SEVERITY.MEDIUM;

      return {
        type,
        message,
        severity,
        originalError,
        context,
        timestamp: Date.now(),
      };
    }

    /**
     * Get recovery strategy for error
     * @private
     * @param {Object} classifiedError - Classified error object
     * @returns {string} Recovery strategy
     */
    _getRecoveryStrategy(classifiedError) {
      return RECOVERY_STRATEGIES[classifiedError.type] || 'none';
    }

    /**
     * Log error for debugging
     * @private
     * @param {Object} classifiedError - Classified error object
     */
    _logError(classifiedError) {
      this._errorLog.push(classifiedError);

      // Trim log if too large
      if (this._errorLog.length > this._maxLogSize) {
        this._errorLog = this._errorLog.slice(-this._maxLogSize);
      }

      // Console log for debugging
      console.error('[ErrorHandler]', classifiedError.type, classifiedError.message);
    }

    /**
     * Notify all listeners of error
     * @private
     * @param {Object} classifiedError - Classified error object
     */
    _notifyListeners(classifiedError) {
      this._listeners.forEach((listener) => {
        try {
          listener(classifiedError);
        } catch (error) {
          console.error('[ErrorHandler] Listener error:', error);
        }
      });
    }

    /**
     * Subscribe to error events
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    onError(callback) {
      if (typeof callback !== 'function') {
        throw new TypeError('Callback must be a function');
      }

      const id = Symbol('listener');
      this._listeners.set(id, callback);

      return () => {
        this._listeners.delete(id);
      };
    }

    /**
     * Get user-friendly error message
     * @param {string|Error|Object} error - Error to format
     * @returns {string} User-friendly message
     */
    getMessage(error) {
      const classified = this._classifyError(error, {});
      return classified.message;
    }

    /**
     * Check if error is retryable
     * @param {string|Error|Object} error - Error to check
     * @returns {boolean} True if retryable
     */
    isRetryable(error) {
      const classified = this._classifyError(error, {});
      const strategy = this._getRecoveryStrategy(classified);
      return strategy === 'retry' || strategy === 'delayed_retry';
    }

    /**
     * Get recommended delay before retry (in ms)
     * @param {string|Error|Object} error - Error to check
     * @returns {number} Delay in milliseconds
     */
    getRetryDelay(error) {
      const classified = this._classifyError(error, {});
      const strategy = this._getRecoveryStrategy(classified);

      if (strategy === 'delayed_retry') {
        // Longer delay for rate limiting
        if (classified.type === 'API_RATE_LIMIT') {
          return 2000;
        }
        return 1000;
      }

      return 0;
    }

    /**
     * Get error log
     * @param {Object} options - Filter options
     * @returns {Array} Filtered error log
     */
    getErrorLog(options = {}) {
      let log = [...this._errorLog];

      if (options.severity) {
        log = log.filter(error => error.severity === options.severity);
      }

      if (options.type) {
        log = log.filter(error => error.type === options.type);
      }

      if (options.since) {
        log = log.filter(error => error.timestamp >= options.since);
      }

      if (options.limit) {
        log = log.slice(-options.limit);
      }

      return log;
    }

    /**
     * Clear error log
     */
    clearErrorLog() {
      this._errorLog = [];
    }

    /**
     * Create error boundary for async operations
     * @param {Function} fn - Async function to wrap
     * @param {Object} context - Error context
     * @returns {Function} Wrapped function
     */
    createBoundary(fn, context = {}) {
      return async (...args) => {
        try {
          return await fn(...args);
        } catch (error) {
          const handled = this.handle(error, context);
          throw handled;
        }
      };
    }

    /**
     * Wrap async function with automatic retry
     * @param {Function} fn - Async function to wrap
     * @param {Object} options - Retry options
     * @returns {Function} Wrapped function with retry
     */
    createRetryWrapper(fn, options = {}) {
      const {
        maxRetries = 3,
        retryDelay = 1000,
        backoffMultiplier = 2,
        context = {},
      } = options;

      return async (...args) => {
        let lastError;
        let delay = retryDelay;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            return await fn(...args);
          } catch (error) {
            lastError = error;
            const handled = this.handle(error, context);

            if (!handled.canRetry || attempt >= maxRetries) {
              throw handled;
            }

            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= backoffMultiplier;
          }
        }

        throw lastError;
      };
    }
  }

  // Create singleton instance
  const errorHandler = new ErrorHandler();

  // Export to global scope
  window.ErrorHandler = errorHandler;

  console.log('[ErrorHandler] Module loaded');
})();

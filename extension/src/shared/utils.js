/**
 * Utility Functions - Prompt Improver Extension
 * Common helper functions used across the extension
 * @version 1.0.0
 */

(() => {
  'use strict';

  /**
   * Debounce function calls
   * Delays function execution until after delay has elapsed since last call
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  function debounce(func, delay) {
    if (typeof func !== 'function') {
      throw new TypeError('First argument must be a function');
    }

    if (typeof delay !== 'number' || delay < 0) {
      throw new TypeError('Delay must be a positive number');
    }

    let timeoutId = null;

    return function debounced(...args) {
      const context = this;

      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }

  /**
   * Throttle function calls
   * Limits function execution to once per limit period
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  function throttle(func, limit) {
    if (typeof func !== 'function') {
      throw new TypeError('First argument must be a function');
    }

    if (typeof limit !== 'number' || limit < 0) {
      throw new TypeError('Limit must be a positive number');
    }

    let inThrottle = false;
    let lastResult = null;

    return function throttled(...args) {
      const context = this;

      if (!inThrottle) {
        inThrottle = true;
        lastResult = func.apply(context, args);

        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }

      return lastResult;
    };
  }

  /**
   * Generate unique identifier
   * @returns {string} UUID-like identifier
   */
  function generateId() {
    // Use crypto API for secure random values
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);

      // Convert to hex string
      const hex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');

      // Format as UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20, 32),
      ].join('-');
    }

    // Fallback: timestamp + random
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate short identifier
   * @returns {string} Short ID (8 characters)
   */
  function generateShortId() {
    // Use crypto API for secure random values
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(4);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Fallback: random string
    return Math.random().toString(36).substr(2, 8);
  }

  /**
   * Format timestamp as human-readable relative time
   * @param {number} timestamp - Unix timestamp in milliseconds
   * @returns {string} Relative time string (e.g., "2 minutes ago")
   */
  function timeago(timestamp) {
    if (typeof timestamp !== 'number' || timestamp < 0) {
      throw new TypeError('Timestamp must be a positive number');
    }

    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    // Future timestamps
    if (seconds < 0) {
      return 'just now';
    }

    // Less than a minute
    if (seconds < 60) {
      return 'just now';
    }

    // Minutes
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    // Hours
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }

    // Days
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }

    // Weeks
    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }

    // Months (approximate)
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }

    // Years
    const years = Math.floor(days / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }

  /**
   * Format timestamp as localized date/time string
   * @param {number} timestamp - Unix timestamp in milliseconds
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted date/time string
   */
  function formatDateTime(timestamp, options = {}) {
    if (typeof timestamp !== 'number' || timestamp < 0) {
      throw new TypeError('Timestamp must be a positive number');
    }

    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      return new Intl.DateTimeFormat(undefined, mergedOptions).format(new Date(timestamp));
    } catch (error) {
      console.error('[Utils] Date format error:', error);
      return new Date(timestamp).toLocaleString();
    }
  }

  /**
   * Truncate text to specified length
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @param {string} suffix - Suffix to add (default: "...")
   * @returns {string} Truncated text
   */
  function truncate(text, maxLength, suffix = '...') {
    if (typeof text !== 'string') {
      throw new TypeError('First argument must be a string');
    }

    if (typeof maxLength !== 'number' || maxLength < 0) {
      throw new TypeError('Max length must be a positive number');
    }

    if (text.length <= maxLength) {
      return text;
    }

    return text.slice(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} html - HTML string to escape
   * @returns {string} Escaped HTML
   */
  function escapeHtml(html) {
    if (typeof html !== 'string') {
      throw new TypeError('First argument must be a string');
    }

    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  /**
   * Deep clone object
   * @param {*} obj - Object to clone
   * @returns {*} Cloned object
   */
  function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }

    if (obj instanceof Array) {
      return obj.map(item => deepClone(item));
    }

    if (obj instanceof Object) {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }

  /**
   * Check if object is empty
   * @param {Object} obj - Object to check
   * @returns {boolean} True if empty
   */
  function isEmpty(obj) {
    if (obj === null || obj === undefined) {
      return true;
    }

    if (Array.isArray(obj) || typeof obj === 'string') {
      return obj.length === 0;
    }

    if (typeof obj === 'object') {
      return Object.keys(obj).length === 0;
    }

    return false;
  }

  /**
   * Sleep/delay for specified time
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  function sleep(ms) {
    if (typeof ms !== 'number' || ms < 0) {
      throw new TypeError('Delay must be a positive number');
    }

    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry async function with exponential backoff
   * @param {Function} fn - Async function to retry
   * @param {Object} options - Retry options
   * @returns {Promise<*>} Function result
   */
  async function retry(fn, options = {}) {
    const {
      maxRetries = 3,
      initialDelay = 1000,
      backoffMultiplier = 2,
      maxDelay = 10000,
    } = options;

    let lastError;
    let delay = initialDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (attempt >= maxRetries) {
          throw error;
        }

        // Wait before retry
        await sleep(Math.min(delay, maxDelay));
        delay *= backoffMultiplier;
      }
    }

    throw lastError;
  }

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} True if successful
   */
  async function copyToClipboard(text) {
    if (typeof text !== 'string') {
      throw new TypeError('First argument must be a string');
    }

    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // Fallback: execCommand (deprecated but widely supported)
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch (error) {
        document.body.removeChild(textArea);
        throw error;
      }
    } catch (error) {
      console.error('[Utils] Copy error:', error);
      return false;
    }
  }

  /**
   * Parse URL query parameters
   * @param {string} url - URL to parse
   * @returns {Object} Query parameters object
   */
  function parseQueryParams(url) {
    if (typeof url !== 'string') {
      throw new TypeError('First argument must be a string');
    }

    const params = {};
    const queryString = url.split('?')[1];

    if (!queryString) {
      return params;
    }

    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    });

    return params;
  }

  /**
   * Build URL query string
   * @param {Object} params - Query parameters object
   * @returns {string} Query string
   */
  function buildQueryString(params) {
    if (typeof params !== 'object' || params === null) {
      throw new TypeError('First argument must be an object');
    }

    const queryParts = Object.entries(params)
      .filter(([key, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(String(value));
        return `${encodedKey}=${encodedValue}`;
      });

    return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  }

  /**
   * Measure function execution time
   * @param {Function} fn - Function to measure
   * @param {string} label - Label for logging
   * @returns {*} Function result
   */
  async function measureTime(fn, label = 'Execution') {
    const start = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - start;
      console.log(`[Utils] ${label}: ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`[Utils] ${label} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  // Export all utilities
  window.Utils = {
    debounce,
    throttle,
    generateId,
    generateShortId,
    timeago,
    formatDateTime,
    truncate,
    escapeHtml,
    deepClone,
    isEmpty,
    sleep,
    retry,
    copyToClipboard,
    parseQueryParams,
    buildQueryString,
    measureTime,
  };

  console.log('[Utils] Module loaded');
})();

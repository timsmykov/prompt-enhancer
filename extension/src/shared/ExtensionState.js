/**
 * ExtensionState - Shared state management utilities
 * Provides consistent state handling across extension components
 */

(() => {
  if (window.ExtensionState) {
    return; // Already loaded
  }

  const ExtensionState = {
    /**
     * Safe storage getter with error handling
     */
    getStorage(keys, callback) {
      if (typeof chrome === 'undefined' || !chrome.storage?.local) {
        console.warn('[ExtensionState] Chrome storage not available');
        callback?.({});
        return Promise.resolve({});
      }

      return new Promise((resolve) => {
        chrome.storage.local.get(keys, (data) => {
          if (chrome.runtime.lastError) {
            console.error('[ExtensionState] Storage error:', chrome.runtime.lastError);
            callback?.({});
            resolve({});
            return;
          }
          callback?.(data);
          resolve(data);
        });
      });
    },

    /**
     * Safe storage setter with error handling
     */
    setStorage(items, callback) {
      if (typeof chrome === 'undefined' || !chrome.storage?.local) {
        console.warn('[ExtensionState] Chrome storage not available');
        callback?.();
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        chrome.storage.local.set(items, () => {
          if (chrome.runtime.lastError) {
            console.error('[ExtensionState] Storage error:', chrome.runtime.lastError);
          }
          callback?.();
          resolve();
        });
      });
    },

    /**
     * Generate cryptographically secure session token
     */
    createToken() {
      if (!crypto?.getRandomValues) {
        throw new Error('Cryptographically secure random number generation not available');
      }
      const values = new Uint32Array(8);
      crypto.getRandomValues(values);
      return Array.from(values, (value) => value.toString(16)).join('');
    },

    /**
     * Validate message token
     */
    isValidToken(messageToken, sessionToken) {
      return messageToken && sessionToken && messageToken === sessionToken;
    },

    /**
     * Format timestamp as relative time (timeago)
     */
    formatTimeago(timestamp) {
      if (!timestamp) return '';

      const now = Date.now();
      const diff = now - timestamp;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (seconds < 60) return 'just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;

      const date = new Date(timestamp);
      return date.toLocaleDateString();
    },

    /**
     * Debounce function execution
     */
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    /**
     * Throttle function execution
     */
    throttle(func, limit) {
      let inThrottle;
      return function executedFunction(...args) {
        if (!inThrottle) {
          func(...args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
  };

  window.ExtensionState = ExtensionState;
})();

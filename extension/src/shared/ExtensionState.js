/**
 * ExtensionState - Centralized State Management
 * Implements pub/sub pattern for cross-context communication
 * @version 1.0.0
 */

(() => {
  'use strict';

  /**
   * ExtensionState Class
   * Manages application state with publish/subscribe pattern
   * Works across background, content scripts, and popup
   */
  class ExtensionState {
    constructor() {
      // Private state store
      this._state = new Map();
      // Subscriber registry: Map<key, Set<callback>>
      this._subscribers = new Map();
      // Initialized flag
      this._initialized = false;
    }

    /**
     * Initialize state from chrome.storage
     * @returns {Promise<void>}
     */
    async init() {
      if (this._initialized) return;

      try {
        const items = await this._getStorage();
        Object.entries(items).forEach(([key, value]) => {
          this._state.set(key, value);
        });
        this._initialized = true;
        console.log('[ExtensionState] Initialized with', items);
      } catch (error) {
        console.error('[ExtensionState] Init error:', error);
        this._initialized = true;
      }
    }

    /**
     * Get value from state
     * @param {string} key - State key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} State value or default
     */
    get(key, defaultValue = undefined) {
      return this._state.has(key) ? this._state.get(key) : defaultValue;
    }

    /**
     * Set value in state and notify subscribers
     * @param {string} key - State key
     * @param {*} value - New value
     * @param {boolean} persist - Whether to persist to chrome.storage (default: true)
     * @returns {Promise<void>}
     */
    async set(key, value, persist = true) {
      const oldValue = this._state.get(key);
      this._state.set(key, value);

      if (persist) {
        try {
          await this._setStorage({ [key]: value });
        } catch (error) {
          console.error('[ExtensionState] Storage error:', error);
          // Revert state on storage error
          if (oldValue !== undefined) {
            this._state.set(key, oldValue);
          } else {
            this._state.delete(key);
          }
          throw error;
        }
      }

      // Notify subscribers
      this._notify(key, value, oldValue);
    }

    /**
     * Get multiple values from state
     * @param {string[]} keys - Array of state keys
     * @returns {Object} Object with key-value pairs
     */
    getMany(keys) {
      const result = {};
      keys.forEach(key => {
        result[key] = this.get(key);
      });
      return result;
    }

    /**
     * Set multiple values in state
     * @param {Object} values - Object with key-value pairs
     * @param {boolean} persist - Whether to persist to chrome.storage (default: true)
     * @returns {Promise<void>}
     */
    async setMany(values, persist = true) {
      const updates = [];
      const oldValues = {};

      // Store old values for potential rollback
      Object.keys(values).forEach(key => {
        oldValues[key] = this._state.get(key);
        this._state.set(key, values[key]);
        updates.push({ key, value: values[key], oldValue: oldValues[key] });
      });

      if (persist) {
        try {
          await this._setStorage(values);
        } catch (error) {
          console.error('[ExtensionState] Batch storage error:', error);
          // Revert all changes
          Object.entries(oldValues).forEach(([key, value]) => {
            if (value !== undefined) {
              this._state.set(key, value);
            } else {
              this._state.delete(key);
            }
          });
          throw error;
        }
      }

      // Notify subscribers for each key
      updates.forEach(({ key, value, oldValue }) => {
        this._notify(key, value, oldValue);
      });
    }

    /**
     * Subscribe to state changes
     * @param {string} key - State key to watch
     * @param {Function} callback - Callback function (newValue, oldValue) => void
     * @returns {Function} Unsubscribe function
     */
    subscribe(key, callback) {
      if (typeof callback !== 'function') {
        throw new TypeError('Callback must be a function');
      }

      if (!this._subscribers.has(key)) {
        this._subscribers.set(key, new Set());
      }

      this._subscribers.get(key).add(callback);

      // Return unsubscribe function
      return () => {
        const subscribers = this._subscribers.get(key);
        if (subscribers) {
          subscribers.delete(callback);
          if (subscribers.size === 0) {
            this._subscribers.delete(key);
          }
        }
      };
    }

    /**
     * Subscribe to multiple keys
     * @param {string[]} keys - Array of state keys to watch
     * @param {Function} callback - Callback function (key, newValue, oldValue) => void
     * @returns {Function} Unsubscribe function
     */
    subscribeMany(keys, callback) {
      const unsubscribers = keys.map(key =>
        this.subscribe(key, (newValue, oldValue) => callback(key, newValue, oldValue))
      );

      // Return combined unsubscribe function
      return () => unsubscribers.forEach(unsub => unsub());
    }

    /**
     * Check if key exists in state
     * @param {string} key - State key
     * @returns {boolean}
     */
    has(key) {
      return this._state.has(key);
    }

    /**
     * Delete key from state
     * @param {string} key - State key
     * @returns {Promise<void>}
     */
    async delete(key) {
      if (!this._state.has(key)) return;

      const oldValue = this._state.get(key);
      this._state.delete(key);

      try {
        await this._removeStorage(key);
      } catch (error) {
        console.error('[ExtensionState] Delete storage error:', error);
        this._state.set(key, oldValue);
        throw error;
      }

      this._notify(key, undefined, oldValue);
    }

    /**
     * Clear all state (use with caution)
     * @returns {Promise<void>}
     */
    async clear() {
      const oldState = new Map(this._state);
      this._state.clear();

      try {
        await this._clearStorage();
      } catch (error) {
        console.error('[ExtensionState] Clear storage error:', error);
        // Restore state
        this._state = oldState;
        throw error;
      }

      // Notify all subscribers
      oldState.forEach((oldValue, key) => {
        this._notify(key, undefined, oldValue);
      });
    }

    /**
     * Get all state as object
     * @returns {Object}
     */
    getAll() {
      return Object.fromEntries(this._state);
    }

    /**
     * Notify subscribers of state change
     * @private
     * @param {string} key - State key
     * @param {*} newValue - New value
     * @param {*} oldValue - Old value
     */
    _notify(key, newValue, oldValue) {
      const subscribers = this._subscribers.get(key);
      if (subscribers) {
        subscribers.forEach(callback => {
          try {
            callback(newValue, oldValue);
          } catch (error) {
            console.error('[ExtensionState] Subscriber error:', error);
          }
        });
      }
    }

    /**
     * Get items from chrome.storage.local
     * @private
     * @param {string[]} [keys] - Optional array of keys (default: all)
     * @returns {Promise<Object>}
     */
    _getStorage(keys = null) {
      return new Promise((resolve, reject) => {
        try {
          chrome.storage.local.get(keys || null, (items) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(items || {});
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    }

    /**
     * Set items in chrome.storage.local
     * @private
     * @param {Object} items - Object with key-value pairs
     * @returns {Promise<void>}
     */
    _setStorage(items) {
      return new Promise((resolve, reject) => {
        try {
          chrome.storage.local.set(items, () => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve();
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    }

    /**
     * Remove item from chrome.storage.local
     * @private
     * @param {string} key - Key to remove
     * @returns {Promise<void>}
     */
    _removeStorage(key) {
      return new Promise((resolve, reject) => {
        try {
          chrome.storage.local.remove(key, () => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve();
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    }

    /**
     * Clear chrome.storage.local
     * @private
     * @returns {Promise<void>}
     */
    _clearStorage() {
      return new Promise((resolve, reject) => {
        try {
          chrome.storage.local.clear(() => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve();
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    }

    /**
     * Static helper for direct storage access (no state management)
     * @param {string[]} keys - Array of keys to retrieve
     * @returns {Promise<Object>}
     */
    static async getStorage(keys) {
      return new Promise((resolve, reject) => {
        try {
          chrome.storage.local.get(keys, (items) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(items || {});
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    }

    /**
     * Static helper for direct storage write (no state management)
     * @param {Object} items - Object with key-value pairs
     * @returns {Promise<void>}
     */
    static async setStorage(items) {
      return new Promise((resolve, reject) => {
        try {
          chrome.storage.local.set(items, () => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve();
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    }
  }

  // Create singleton instance
  const extensionState = new ExtensionState();

  // Export to global scope
  window.ExtensionState = extensionState;

  console.log('[ExtensionState] Module loaded');
})();

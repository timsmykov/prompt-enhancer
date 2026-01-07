/**
 * StorageManager - Chrome Storage Wrapper with Caching
 * Provides efficient storage access with in-memory caching
 * @version 1.0.0
 */

(() => {
  'use strict';

  /**
   * Default storage keys and their defaults
   */
  const DEFAULT_VALUES = {
    apiKey: '',
    model: 'openrouter/auto',
    systemPrompt: 'You are a helpful prompt improver. Rewrite the text to be clearer, concise, and actionable without changing intent.',
    typingSpeed: 20,
    theme: 'system',
    history: [],
    historyEnabled: true,
    maxHistorySize: 100,
  };

  /**
   * Cache configuration
   */
  const CACHE_CONFIG = {
    enabled: true,
    ttl: 5000, // Time to live: 5 seconds
  };

  /**
   * StorageManager Class
   */
  class StorageManager {
    constructor() {
      // In-memory cache: Map<key, {value, timestamp}>
      this._cache = new Map();
      // Change listeners: Map<key, Set<callback>>
      this._listeners = new Map();
      // Initialize storage change listener
      this._initChangeListener();
    }

    /**
     * Initialize chrome.storage.onChanged listener
     * @private
     */
    _initChangeListener() {
      if (typeof chrome === 'undefined' || !chrome.storage) {
        return;
      }

      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== 'local') return;

        Object.entries(changes).forEach(([key, { oldValue, newValue }]) => {
          // Update cache
          this._updateCache(key, newValue);

          // Notify listeners
          this._notifyListeners(key, newValue, oldValue);
        });
      });
    }

    /**
     * Get single value from storage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {Promise<*>} Storage value or default
     */
    async get(key, defaultValue = null) {
      // Check cache first
      if (this._isCacheValid(key)) {
        return this._cache.get(key).value;
      }

      // Fetch from storage
      const items = await this._getStorage([key]);
      const value = items[key];

      // Use default if not found
      const finalValue = value !== undefined ? value : defaultValue;

      // Update cache
      this._updateCache(key, finalValue);

      return finalValue;
    }

    /**
     * Get multiple values from storage
     * @param {string[]} keys - Array of storage keys
     * @returns {Promise<Object>} Object with key-value pairs
     */
    async getMany(keys) {
      const result = {};
      const keysToFetch = [];

      // Check cache for each key
      keys.forEach(key => {
        if (this._isCacheValid(key)) {
          result[key] = this._cache.get(key).value;
        } else {
          keysToFetch.push(key);
        }
      });

      // Fetch missing keys from storage
      if (keysToFetch.length > 0) {
        const items = await this._getStorage(keysToFetch);
        Object.entries(items).forEach(([key, value]) => {
          result[key] = value;
          this._updateCache(key, value);
        });
      }

      return result;
    }

    /**
     * Get all values from storage
     * @returns {Promise<Object>} All storage items
     */
    async getAll() {
      const items = await this._getStorage(null);

      // Update cache
      Object.entries(items).forEach(([key, value]) => {
        this._updateCache(key, value);
      });

      return items;
    }

    /**
     * Set single value in storage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {Promise<void>}
     */
    async set(key, value) {
      await this._setStorage({ [key]: value });
      // Cache and listeners are updated via onChanged listener
    }

    /**
     * Set multiple values in storage
     * @param {Object} items - Object with key-value pairs
     * @returns {Promise<void>}
     */
    async setMany(items) {
      await this._setStorage(items);
      // Cache and listeners are updated via onChanged listener
    }

    /**
     * Remove value from storage
     * @param {string} key - Storage key
     * @returns {Promise<void>}
     */
    async remove(key) {
      await this._removeStorage([key]);
      // Cache and listeners are updated via onChanged listener
    }

    /**
     * Remove multiple values from storage
     * @param {string[]} keys - Array of storage keys
     * @returns {Promise<void>}
     */
    async removeMany(keys) {
      await this._removeStorage(keys);
      // Cache and listeners are updated via onChanged listener
    }

    /**
     * Clear all values from storage
     * @returns {Promise<void>}
     */
    async clear() {
      await this._clearStorage();
      // Cache and listeners are updated via onChanged listener
    }

    /**
     * Get bytes in use by specific keys
     * @param {string[]} keys - Array of storage keys
     * @returns {Promise<number>} Bytes in use
     */
    async getBytesInUse(keys) {
      if (typeof chrome === 'undefined' || !chrome.storage) {
        throw new Error('chrome.storage API not available');
      }

      return new Promise((resolve, reject) => {
        try {
          chrome.storage.local.getBytesInUse(keys, (bytes) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(bytes);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    }

    /**
     * Subscribe to storage changes
     * @param {string} key - Storage key to watch
     * @param {Function} callback - Callback function (newValue, oldValue) => void
     * @returns {Function} Unsubscribe function
     */
    onChange(key, callback) {
      if (typeof callback !== 'function') {
        throw new TypeError('Callback must be a function');
      }

      if (!this._listeners.has(key)) {
        this._listeners.set(key, new Set());
      }

      this._listeners.get(key).add(callback);

      // Return unsubscribe function
      return () => {
        const listeners = this._listeners.get(key);
        if (listeners) {
          listeners.delete(callback);
          if (listeners.size === 0) {
            this._listeners.delete(key);
          }
        }
      };
    }

    /**
     * Check if cache is valid for key
     * @private
     * @param {string} key - Storage key
     * @returns {boolean} True if cache is valid
     */
    _isCacheValid(key) {
      if (!CACHE_CONFIG.enabled) return false;
      if (!this._cache.has(key)) return false;

      const cached = this._cache.get(key);
      const age = Date.now() - cached.timestamp;
      return age < CACHE_CONFIG.ttl;
    }

    /**
     * Update cache for key
     * @private
     * @param {string} key - Storage key
     * @param {*} value - Value to cache
     */
    _updateCache(key, value) {
      if (!CACHE_CONFIG.enabled) return;

      this._cache.set(key, {
        value,
        timestamp: Date.now(),
      });
    }

    /**
     * Notify listeners of storage change
     * @private
     * @param {string} key - Storage key
     * @param {*} newValue - New value
     * @param {*} oldValue - Old value
     */
    _notifyListeners(key, newValue, oldValue) {
      const listeners = this._listeners.get(key);
      if (listeners) {
        listeners.forEach(callback => {
          try {
            callback(newValue, oldValue);
          } catch (error) {
            console.error('[StorageManager] Listener error:', error);
          }
        });
      }
    }

    /**
     * Get items from chrome.storage.local
     * @private
     * @param {string[]|null} keys - Array of keys (null for all)
     * @returns {Promise<Object>}
     */
    _getStorage(keys) {
      if (typeof chrome === 'undefined' || !chrome.storage) {
        throw new Error('chrome.storage API not available');
      }

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
      if (typeof chrome === 'undefined' || !chrome.storage) {
        throw new Error('chrome.storage API not available');
      }

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
     * Remove items from chrome.storage.local
     * @private
     * @param {string[]} keys - Array of keys to remove
     * @returns {Promise<void>}
     */
    _removeStorage(keys) {
      if (typeof chrome === 'undefined' || !chrome.storage) {
        throw new Error('chrome.storage API not available');
      }

      return new Promise((resolve, reject) => {
        try {
          chrome.storage.local.remove(keys, () => {
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
      if (typeof chrome === 'undefined' || !chrome.storage) {
        throw new Error('chrome.storage API not available');
      }

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
     * Clear cache
     */
    clearCache() {
      this._cache.clear();
    }

    /**
     * Get cache size
     * @returns {number} Number of cached items
     */
    getCacheSize() {
      return this._cache.size;
    }
  }

  // Create singleton instance
  const storageManager = new StorageManager();

  // Export to global scope
  window.StorageManager = storageManager;
  window.DEFAULT_VALUES = DEFAULT_VALUES;

  console.log('[StorageManager] Module loaded');
})();

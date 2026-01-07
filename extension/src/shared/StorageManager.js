/**
 * StorageManager - Atomic storage operations with error handling
 * Provides safe, atomic storage operations for Chrome extension
 */

(() => {
  if (window.StorageManager) {
    return; // Already loaded
  }

  const StorageManager = {
    STORAGE_VERSION: 1,
    STORAGE_KEYS: {
      SETTINGS: 'promptImprover_settings',
      TELEMETRY: 'promptImprover_telemetry',
      CACHE: 'promptImprover_cache',
      QUEUE: 'promptImprover_queue',
      VERSION: 'promptImprover_version'
    },

    /**
     * Get storage data with error handling
     * @param {string|string[]} keys - Storage key(s) to retrieve
     * @returns {Promise<Object>} Storage data
     */
    async get(keys) {
      return new Promise((resolve) => {
        if (typeof chrome === 'undefined' || !chrome.storage?.local) {
          console.warn('[StorageManager] Chrome storage not available');
          resolve({});
          return;
        }

        chrome.storage.local.get(keys, (data) => {
          if (chrome.runtime.lastError) {
            console.error('[StorageManager] Get error:', chrome.runtime.lastError);
            resolve({});
            return;
          }
          resolve(data || {});
        });
      });
    },

    /**
     * Set storage data atomically
     * @param {Object} items - Key-value pairs to store
     * @returns {Promise<boolean>} Success status
     */
    async set(items) {
      return new Promise((resolve) => {
        if (typeof chrome === 'undefined' || !chrome.storage?.local) {
          console.warn('[StorageManager] Chrome storage not available');
          resolve(false);
          return;
        }

        chrome.storage.local.set(items, () => {
          if (chrome.runtime.lastError) {
            console.error('[StorageManager] Set error:', chrome.runtime.lastError);
            resolve(false);
            return;
          }
          resolve(true);
        });
      });
    },

    /**
     * Remove storage data
     * @param {string|string[]} keys - Storage key(s) to remove
     * @returns {Promise<boolean>} Success status
     */
    async remove(keys) {
      return new Promise((resolve) => {
        if (typeof chrome === 'undefined' || !chrome.storage?.local) {
          console.warn('[StorageManager] Chrome storage not available');
          resolve(false);
          return;
        }

        chrome.storage.local.remove(keys, () => {
          if (chrome.runtime.lastError) {
            console.error('[StorageManager] Remove error:', chrome.runtime.lastError);
            resolve(false);
            return;
          }
          resolve(true);
        });
      });
    },

    /**
     * Clear all storage data
     * @returns {Promise<boolean>} Success status
     */
    async clear() {
      return new Promise((resolve) => {
        if (typeof chrome === 'undefined' || !chrome.storage?.local) {
          console.warn('[StorageManager] Chrome storage not available');
          resolve(false);
          return;
        }

        chrome.storage.local.clear(() => {
          if (chrome.runtime.lastError) {
            console.error('[StorageManager] Clear error:', chrome.runtime.lastError);
            resolve(false);
            return;
          }
          resolve(true);
        });
      });
    },

    /**
     * Get storage usage in bytes
     * @returns {Promise<number>} Bytes used
     */
    async getBytesInUse() {
      return new Promise((resolve) => {
        if (typeof chrome === 'undefined' || !chrome.storage?.local) {
          console.warn('[StorageManager] Chrome storage not available');
          resolve(0);
          return;
        }

        chrome.storage.local.getBytesInUse(null, (bytes) => {
          resolve(bytes || 0);
        });
      });
    },

    /**
     * Update storage with migration support
     * @param {Object} items - Key-value pairs to store
     * @param {number} version - Current storage version
     * @returns {Promise<boolean>} Success status
     */
    async updateWithMigration(items, version = this.STORAGE_VERSION) {
      try {
        // Check if migration needed
        const { promptImprover_version: currentVersion } = await this.get(
          this.STORAGE_KEYS.VERSION
        );

        if (currentVersion && currentVersion < version) {
          console.log(`[StorageManager] Migrating from v${currentVersion} to v${version}`);
          await this.migrate(currentVersion, version);
        }

        // Store version and data
        await this.set({
          ...items,
          [this.STORAGE_KEYS.VERSION]: version
        });

        return true;
      } catch (error) {
        console.error('[StorageManager] Migration error:', error);
        return false;
      }
    },

    /**
     * Migrate storage data between versions
     * @param {number} fromVersion - Current version
     * @param {number} toVersion - Target version
     * @returns {Promise<void>}
     */
    async migrate(fromVersion, toVersion) {
      console.log(`[StorageManager] Migration v${fromVersion} -> v${toVersion}`);

      // Example migration logic
      if (fromVersion < 1) {
        // Migrate old format to new format
        const oldData = await this.get(['apiKey', 'model', 'systemPrompt']);
        if (Object.keys(oldData).length > 0) {
          await this.set({
            [this.STORAGE_KEYS.SETTINGS]: {
              apiKey: oldData.apiKey || '',
              model: oldData.model || '',
              systemPrompt: oldData.systemPrompt || ''
            }
          });
        }
      }
    }
  };

  window.StorageManager = StorageManager;
})();

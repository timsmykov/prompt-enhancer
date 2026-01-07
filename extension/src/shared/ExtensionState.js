/**
 * ExtensionState - Shared state management
 */

(() => {
  if (window.ExtensionState) return;

  const ExtensionState = {
    getStorage(keys, callback) {
      if (typeof chrome === 'undefined' || !chrome.storage?.local) {
        callback?.({});
        return Promise.resolve({});
      }

      return new Promise((resolve) => {
        chrome.storage.local.get(keys, (data) => {
          if (chrome.runtime.lastError) {
            console.error('[ExtensionState] Error:', chrome.runtime.lastError);
            callback?.({});
            resolve({});
            return;
          }
          callback?.(data);
          resolve(data);
        });
      });
    },

    setStorage(items, callback) {
      if (typeof chrome === 'undefined' || !chrome.storage?.local) {
        callback?.();
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        chrome.storage.local.set(items, () => {
          if (chrome.runtime.lastError) {
            console.error('[ExtensionState] Error:', chrome.runtime.lastError);
          }
          callback?.();
          resolve();
        });
      });
    },

    createToken() {
      if (!crypto?.getRandomValues) {
        throw new Error('Crypto not available');
      }
      const values = new Uint32Array(8);
      crypto.getRandomValues(values);
      return Array.from(values, v => v.toString(16)).join('');
    },

    formatTimeago(timestamp) {
      if (!timestamp) return '';
      const diff = Date.now() - timestamp;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (seconds < 60) return 'just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return new Date(timestamp).toLocaleDateString();
    }
  };

  window.ExtensionState = ExtensionState;
})();

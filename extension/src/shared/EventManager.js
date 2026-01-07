/**
 * EventManager - Cross-Context Event Bus
 * Enables communication between background, content scripts, and popup
 * @version 1.0.0
 */

(() => {
  'use strict';

  /**
   * Event types for cross-context communication
   */
  const EventTypes = {
    // State events
    STATE_CHANGED: 'state:changed',

    // UI events
    OVERLAY_OPEN: 'ui:overlay:open',
    OVERLAY_CLOSE: 'ui:overlay:close',
    OVERLAY_RESIZE: 'ui:overlay:resize',
    POPUP_OPEN: 'ui:popup:open',
    POPUP_CLOSE: 'ui:popup:close',

    // Settings events
    SETTINGS_CHANGED: 'settings:changed',
    SETTINGS_RESET: 'settings:reset',
    API_KEY_UPDATED: 'settings:apikey:updated',

    // API events
    API_REQUEST_START: 'api:request:start',
    API_REQUEST_SUCCESS: 'api:request:success',
    API_REQUEST_ERROR: 'api:request:error',

    // Content events
    TEXT_SELECTED: 'content:text:selected',
    TEXT_REPLACED: 'content:text:replaced',
    TEXT_COPIED: 'content:text:copied',

    // History events
    HISTORY_ADDED: 'history:added',
    HISTORY_CLEARED: 'history:cleared',

    // Extension lifecycle
    EXTENSION_INSTALLED: 'extension:installed',
    EXTENSION_UPDATED: 'extension:updated',
    EXTENSION_READY: 'extension:ready',
  };

  /**
   * EventManager Class
   */
  class EventManager {
    constructor() {
      // Local event listeners: Map<eventType, Set<listener>>
      this._listeners = new Map();
      // Message listeners for cross-context communication
      this._messageListeners = new Map();
      // Event log for debugging
      this._eventLog = [];
      this._maxLogSize = 100;
      // Initialize message handling
      this._initMessageHandling();
    }

    /**
     * Initialize chrome.runtime message handling
     * @private
     */
    _initMessageHandling() {
      // Only listen if chrome.runtime is available
      if (typeof chrome === 'undefined' || !chrome.runtime) {
        return;
      }

      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (!message || !message.type || !message.type.startsWith('event:')) {
          return false;
        }

        const eventType = message.type.replace('event:', '');
        const eventData = message.data || {};

        // Emit locally
        this.emit(eventType, eventData, sender);

        // Return true to support async response
        return true;
      });
    }

    /**
     * Subscribe to local event
     * @param {string} eventType - Event type
     * @param {Function} callback - Callback function (data, sender) => void
     * @returns {Function} Unsubscribe function
     */
    on(eventType, callback) {
      if (typeof callback !== 'function') {
        throw new TypeError('Callback must be a function');
      }

      if (!this._listeners.has(eventType)) {
        this._listeners.set(eventType, new Set());
      }

      this._listeners.get(eventType).add(callback);

      // Return unsubscribe function
      return () => {
        const listeners = this._listeners.get(eventType);
        if (listeners) {
          listeners.delete(callback);
          if (listeners.size === 0) {
            this._listeners.delete(eventType);
          }
        }
      };
    }

    /**
     * Subscribe to event (one-time)
     * @param {string} eventType - Event type
     * @param {Function} callback - Callback function (data, sender) => void
     * @returns {Function} Unsubscribe function
     */
    once(eventType, callback) {
      const wrappedCallback = (data, sender) => {
        callback(data, sender);
        unsubscribe();
      };

      const unsubscribe = this.on(eventType, wrappedCallback);
      return unsubscribe;
    }

    /**
     * Emit local event
     * @param {string} eventType - Event type
     * @param {*} data - Event data
     * @param {Object} sender - Event sender (optional)
     */
    emit(eventType, data = null, sender = null) {
      // Log event
      this._logEvent(eventType, data, sender);

      const listeners = this._listeners.get(eventType);
      if (listeners) {
        listeners.forEach(listener => {
          try {
            listener(data, sender);
          } catch (error) {
            console.error(`[EventManager] Listener error for ${eventType}:`, error);
          }
        });
      }
    }

    /**
     * Broadcast event to all contexts
     * @param {string} eventType - Event type
     * @param {*} data - Event data
     */
    broadcast(eventType, data = null) {
      // Emit locally
      this.emit(eventType, data);

      // Broadcast to other contexts via chrome.runtime
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({
          type: `event:${eventType}`,
          data,
        }).catch(error => {
          // Ignore errors when no recipients
          if (error.message !== 'Could not establish connection') {
            console.error('[EventManager] Broadcast error:', error);
          }
        });
      }
    }

    /**
     * Send event to specific tab
     * @param {number} tabId - Tab ID
     * @param {string} eventType - Event type
     * @param {*} data - Event data
     * @returns {Promise<void>}
     */
    async sendToTab(tabId, eventType, data = null) {
      if (typeof chrome === 'undefined' || !chrome.tabs) {
        throw new Error('chrome.tabs API not available');
      }

      return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, {
          type: `event:${eventType}`,
          data,
        }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
    }

    /**
     * Send event to active tab
     * @param {string} eventType - Event type
     * @param {*} data - Event data
     * @returns {Promise<void>}
     */
    async sendToActiveTab(eventType, data = null) {
      if (typeof chrome === 'undefined' || !chrome.tabs) {
        throw new Error('chrome.tabs API not available');
      }

      return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }

          const tab = tabs[0];
          if (!tab) {
            reject(new Error('No active tab found'));
            return;
          }

          this.sendToTab(tab.id, eventType, data)
            .then(resolve)
            .catch(reject);
        });
      });
    }

    /**
     * Send event to background script
     * @param {string} eventType - Event type
     * @param {*} data - Event data
     * @returns {Promise<*>} Response from background
     */
    async sendToBackground(eventType, data = null) {
      if (typeof chrome === 'undefined' || !chrome.runtime) {
        throw new Error('chrome.runtime API not available');
      }

      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          type: `event:${eventType}`,
          data,
        }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
    }

    /**
     * Remove all listeners for event type
     * @param {string} eventType - Event type
     */
    off(eventType) {
      this._listeners.delete(eventType);
    }

    /**
     * Remove all listeners
     */
    removeAllListeners() {
      this._listeners.clear();
    }

    /**
     * Get listener count for event type
     * @param {string} eventType - Event type
     * @returns {number} Listener count
     */
    listenerCount(eventType) {
      const listeners = this._listeners.get(eventType);
      return listeners ? listeners.size : 0;
    }

    /**
     * Check if event has listeners
     * @param {string} eventType - Event type
     * @returns {boolean} True if has listeners
     */
    hasListeners(eventType) {
      return this.listenerCount(eventType) > 0;
    }

    /**
     * Create event channel for specific feature
     * @param {string} namespace - Feature namespace
     * @returns {Object} Event channel API
     */
    createChannel(namespace) {
      const prefix = `${namespace}:`;

      return {
        on: (eventType, callback) => this.on(prefix + eventType, callback),
        once: (eventType, callback) => this.once(prefix + eventType, callback),
        emit: (eventType, data) => this.emit(prefix + eventType, data),
        broadcast: (eventType, data) => this.broadcast(prefix + eventType, data),
        off: (eventType) => this.off(prefix + eventType),
      };
    }

    /**
     * Log event for debugging
     * @private
     * @param {string} eventType - Event type
     * @param {*} data - Event data
     * @param {Object} sender - Event sender
     */
    _logEvent(eventType, data, sender) {
      this._eventLog.push({
        type: eventType,
        data,
        sender: sender ? { tab: sender.tab, id: sender.id } : null,
        timestamp: Date.now(),
      });

      // Trim log if too large
      if (this._eventLog.length > this._maxLogSize) {
        this._eventLog = this._eventLog.slice(-this._maxLogSize);
      }
    }

    /**
     * Get event log
     * @param {Object} options - Filter options
     * @returns {Array} Filtered event log
     */
    getEventLog(options = {}) {
      let log = [...this._eventLog];

      if (options.type) {
        log = log.filter(event => event.type === options.type);
      }

      if (options.since) {
        log = log.filter(event => event.timestamp >= options.since);
      }

      if (options.limit) {
        log = log.slice(-options.limit);
      }

      return log;
    }

    /**
     * Clear event log
     */
    clearEventLog() {
      this._eventLog = [];
    }
  }

  // Create singleton instance
  const eventManager = new EventManager();

  // Export to global scope
  window.EventManager = eventManager;
  window.EventTypes = EventTypes;

  console.log('[EventManager] Module loaded');
})();

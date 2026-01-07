/**
 * EventManager - Centralized event handling with validation
 * Provides robust message passing and event management
 */

(() => {
  if (window.EventManager) {
    return; // Already loaded
  }

  const EventManager = {
    // Message type registry
    messageTypes: new Set([
      'OPEN_OVERLAY',
      'IMPROVE_PROMPT',
      'CLOSE_OVERLAY',
      'SHOW_ERROR',
      'SHOW_SUCCESS',
      'UPDATE_SETTINGS',
      'GET_QUEUE_POSITION',
      'CANCEL_REQUEST'
    ]),

    // Request ID counter
    requestIdCounter: 0,

    // Pending requests map
    pendingRequests: new Map(),

    /**
     * Generate unique request ID
     * @returns {string} Unique request identifier
     */
    generateRequestId() {
      return `req_${Date.now()}_${++this.requestIdCounter}`;
    },

    /**
     * Validate message structure
     * @param {Object} message - Message to validate
     * @returns {boolean} Valid status
     */
    validateMessage(message) {
      if (!message || typeof message !== 'object') {
        console.warn('[EventManager] Invalid message: not an object');
        return false;
      }

      if (!message.type || typeof message.type !== 'string') {
        console.warn('[EventManager] Invalid message: missing or invalid type');
        return false;
      }

      if (!this.messageTypes.has(message.type)) {
        console.warn(`[EventManager] Unknown message type: ${message.type}`);
        return false;
      }

      return true;
    },

    /**
     * Validate message with token
     * @param {Object} message - Message to validate
     * @param {string} sessionToken - Session token to compare
     * @returns {boolean} Valid status
     */
    validateMessageWithToken(message, sessionToken) {
      if (!this.validateMessage(message)) {
        return false;
      }

      // For messages requiring token validation
      if (message.token !== undefined) {
        if (!sessionToken || message.token !== sessionToken) {
          console.warn('[EventManager] Invalid token in message');
          return false;
        }
      }

      return true;
    },

    /**
     * Send message to content script
     * @param {number} tabId - Target tab ID
     * @param {Object} message - Message to send
     * @returns {Promise<Object>} Response
     */
    async sendToTab(tabId, message) {
      return new Promise((resolve, reject) => {
        if (!tabId || typeof tabId !== 'number') {
          reject(new Error('Invalid tab ID'));
          return;
        }

        if (!this.validateMessage(message)) {
          reject(new Error('Invalid message structure'));
          return;
        }

        chrome.tabs.sendMessage(tabId, message, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }

          if (!response || typeof response !== 'object') {
            reject(new Error('Invalid response'));
            return;
          }

          resolve(response);
        });
      });
    },

    /**
     * Send message to active tab
     * @param {Object} message - Message to send
     * @returns {Promise<Object>} Response
     */
    async sendToActiveTab(message) {
      return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }

          const tab = tabs[0];
          if (!tab?.id) {
            reject(new Error('No active tab found'));
            return;
          }

          this.sendToTab(tab.id, message)
            .then(resolve)
            .catch(reject);
        });
      });
    },

    /**
     * Register pending request
     * @param {string} requestId - Request ID
     * @param {Object} metadata - Request metadata
     */
    registerRequest(requestId, metadata) {
      this.pendingRequests.set(requestId, {
        ...metadata,
        timestamp: Date.now()
      });
    },

    /**
     * Unregister pending request
     * @param {string} requestId - Request ID
     */
    unregisterRequest(requestId) {
      this.pendingRequests.delete(requestId);
    },

    /**
     * Get pending request
     * @param {string} requestId - Request ID
     * @returns {Object|null} Request metadata
     */
    getRequest(requestId) {
      return this.pendingRequests.get(requestId) || null;
    },

    /**
     * Clean up old pending requests
     * @param {number} maxAge - Maximum age in milliseconds
     */
    cleanupOldRequests(maxAge = 60000) {
      const now = Date.now();
      for (const [id, request] of this.pendingRequests.entries()) {
        if (now - request.timestamp > maxAge) {
          this.pendingRequests.delete(id);
        }
      }
    }
  };

  // Clean up old requests every minute
  setInterval(() => {
    EventManager.cleanupOldRequests();
  }, 60000);

  window.EventManager = EventManager;
})();

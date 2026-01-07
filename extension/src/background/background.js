/**
 * Background Service Worker - Prompt Improver Extension
 * Enhanced with retry logic, queuing, telemetry, and caching
 */

// Import shared modules
importScripts(
  '../shared/ExtensionState.js',
  '../shared/StorageManager.js',
  '../shared/EventManager.js',
  'TelemetryManager.js',
  'RequestQueue.js',
  'CacheManager.js',
  'APIHandler.js'
);

(() => {
  'use strict';

  // Constants
  const MENU_ID = 'prompt-improver';
  const BADGE_ERROR_TIMEOUT_MS = 4500;

  // =====================================================
  // UI HELPERS
  // =====================================================

  /**
   * Clear badge from extension icon
   * @param {number} tabId - Tab ID
   */
  const clearBadge = (tabId) => {
    if (!chrome.action || typeof tabId !== 'number') return;
    chrome.action.setBadgeText({ tabId, text: '' });
    chrome.action.setTitle({ tabId, title: 'Prompt Improver' });
  };

  /**
   * Show error badge
   * @param {number} tabId - Tab ID
   * @param {string} message - Error message
   */
  const showBadgeError = (tabId, message) => {
    if (!chrome.action) return;
    chrome.action.setBadgeBackgroundColor({ tabId, color: '#b73524' });
    chrome.action.setBadgeText({ tabId, text: '!' });
    chrome.action.setTitle({ tabId, title: `Prompt Improver: ${message}` });
    setTimeout(() => clearBadge(tabId), BADGE_ERROR_TIMEOUT_MS);
  };

  /**
   * Show processing badge
   * @param {number} tabId - Tab ID
   */
  const showBadgeProcessing = (tabId) => {
    if (!chrome.action) return;
    chrome.action.setBadgeBackgroundColor({ tabId, color: '#4a90e2' });
    chrome.action.setBadgeText({ tabId, text: '...' });
    chrome.action.setTitle({ tabId, title: 'Prompt Improver: Processing...' });
  };

  // =====================================================
  // SETTINGS MANAGEMENT
  // =====================================================

  /**
   * Get user settings from storage
   * @returns {Promise<Object>} Settings object
   */
  const getSettings = async () => {
    try {
      const data = await StorageManager.get(['apiKey', 'model', 'systemPrompt']);
      return {
        apiKey: data.apiKey || '',
        model: data.model || '',
        systemPrompt: data.systemPrompt || ''
      };
    } catch (error) {
      console.error('[Background] Error loading settings:', error);
      return { apiKey: '', model: '', systemPrompt: '' };
    }
  };

  // =====================================================
  // CONTEXT MENU
  // =====================================================

  /**
   * Create context menu
   */
  const createContextMenu = () => {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: MENU_ID,
        title: 'Improve prompt',
        contexts: ['selection']
      });
    });
  };

  // =====================================================
  // REQUEST HANDLING
  // =====================================================

  /**
   * Handle improve prompt request
   * @param {string} text - Selected text
   * @param {number} tabId - Tab ID
   * @returns {Promise<Object>} Result or error
   */
  const handleImprovePrompt = async (text, tabId) => {
    const requestId = EventManager.generateRequestId();

    try {
      // Record request start
      if (typeof TelemetryManager !== 'undefined') {
        await TelemetryManager.recordRequestStart(requestId, { tabId });
      }

      // Show processing badge
      showBadgeProcessing(tabId);

      // Get settings
      const settings = await getSettings();

      // Add to queue
      const result = await RequestQueue.add(async () => {
        return await APIHandler.call(text, settings, { requestId, tabId });
      }, { id: requestId, tabId });

      // Record success or error
      if (typeof TelemetryManager !== 'undefined') {
        if (result.error) {
          await TelemetryManager.recordError(requestId, {
            errorType: result.errorType || 'unknown',
            errorMessage: result.error
          });
        } else {
          await TelemetryManager.recordSuccess(requestId, {
            responseTime: result.responseTime,
            model: settings.model
          });
        }
      }

      // Clear badge
      clearBadge(tabId);

      return result;

    } catch (error) {
      console.error('[Background] Request failed:', error);

      // Record error
      if (typeof TelemetryManager !== 'undefined') {
        await TelemetryManager.recordError(requestId, {
          errorType: 'exception',
          errorMessage: error.message
        });
      }

      // Show error badge
      showBadgeError(tabId, 'Request failed');

      return {
        error: 'Failed to process request. Please try again.',
        errorType: 'exception'
      };
    }
  };

  // =====================================================
  // MESSAGE HANDLING
  // =====================================================

  /**
   * Handle runtime messages
   */
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Validate message
    if (!EventManager.validateMessage(message)) {
      console.warn('[Background] Invalid message received');
      sendResponse({ error: 'Invalid message' });
      return true;
    }

    const tabId = sender.tab?.id;

    // Handle message types
    switch (message.type) {
      case 'IMPROVE_PROMPT':
        if (!tabId) {
          sendResponse({ error: 'Invalid tab' });
          return true;
        }

        // Handle async response
        handleImprovePrompt(message.text, tabId)
          .then(result => sendResponse(result))
          .catch(error => sendResponse({ error: error.message }));

        return true; // Keep message channel open

      case 'GET_QUEUE_POSITION':
        const position = RequestQueue.getPosition(message.requestId);
        sendResponse({ position });
        return false;

      case 'CANCEL_REQUEST':
        const cancelled = RequestQueue.cancel(message.requestId);
        sendResponse({ cancelled });
        return false;

      case 'GET_TELEMETRY':
        if (typeof TelemetryManager !== 'undefined') {
          TelemetryManager.getData()
            .then(data => sendResponse({ data }))
            .catch(error => sendResponse({ error: error.message }));
          return true;
        }
        sendResponse({ data: null });
        return false;

      case 'CLEAR_CACHE':
        if (typeof CacheManager !== 'undefined') {
          CacheManager.clear();
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false });
        }
        return false;

      case 'GET_CACHE_STATS':
        if (typeof CacheManager !== 'undefined') {
          const stats = CacheManager.getStats();
          sendResponse({ stats });
        } else {
          sendResponse({ stats: null });
        }
        return false;

      default:
        console.warn(`[Background] Unknown message type: ${message.type}`);
        sendResponse({ error: 'Unknown message type' });
        return false;
    }
  });

  // =====================================================
  // CONTEXT MENU HANDLERS
  // =====================================================

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== MENU_ID) return;
    if (!tab?.id) return;

    // Send message to content script
    EventManager.sendToTab(tab.id, { type: 'OPEN_OVERLAY' })
      .catch(error => {
        console.error('[Background] Error opening overlay:', error);
        showBadgeError(tab.id, 'Cannot run on this page');
      });
  });

  // =====================================================
  // INSTALLATION & STARTUP
  // =====================================================

  chrome.runtime.onInstalled.addListener(() => {
    console.log('[Background] Extension installed/updated');
    createContextMenu();

    // Initialize telemetry
    if (typeof TelemetryManager !== 'undefined') {
      TelemetryManager.init().catch(error => {
        console.error('[Background] Failed to initialize telemetry:', error);
      });
    }
  });

  chrome.runtime.onStartup?.addListener(() => {
    console.log('[Background] Extension started');
    createContextMenu();
  });

  // =====================================================
  // CLEANUP
  // =====================================================

  // Clean up old requests periodically
  setInterval(() => {
    EventManager.cleanupOldRequests();
  }, 60000);

  // Log telemetry stats periodically (for debugging)
  setInterval(async () => {
    if (typeof TelemetryManager !== 'undefined') {
      const telemetry = await TelemetryManager.getData();
      console.log('[Background] Telemetry stats:', {
        totalRequests: telemetry.totalRequests,
        successRate: await TelemetryManager.getSuccessRate(),
        avgResponseTime: await TelemetryManager.getAverageResponseTime()
      });
    }
  }, 300000); // Every 5 minutes

  console.log('[Background] Background service worker initialized');

})();

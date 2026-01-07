/**
 * Content Script - Improved selection capture and text replacement
 * Features:
 * - Enhanced selection capture (inputs, contenteditable, shadow DOM)
 * - Undo support for replacements
 * - Caret position preservation
 * - Large replacement confirmation
 * - Better error handling
 * - Memory leak prevention via EventManager
 */

(() => {
  'use strict';

  // ============================================
  // Configuration
  // ============================================

  const CONFIG = {
    DEBUG_MODE: false,
    LARGE_REPLACEMENT_THRESHOLD: 1000,
    OVERLAY_WIDTH: 360,
    OVERLAY_HEIGHT: 520,
    OVERLAY_Z_INDEX: 2147483647,
    MAX_SELECTION_LENGTH: 4000
  };

  // ============================================
  // Logger
  // ============================================

  const logger = {
    log: (...args) => {
      if (CONFIG.DEBUG_MODE) console.log('[PromptImprover Content]', ...args);
    },
    warn: (...args) => console.warn('[PromptImprover Content]', ...args),
    error: (...args) => console.error('[PromptImprover Content]', ...args),
  };

  // ============================================
  // State Management
  // ============================================

  const state = {
    overlayFrame: null,
    overlayStyle: null,
    overlayReady: false,
    overlayToken: null,
    overlayMetrics: null,
    pendingSelectionText: '',
    savedSelectionInfo: null,
    undoStack: [],
    eventManager: null,
    mutationObserver: null,
    resizeHandler: null,
    isCleaningUp: false
  };

  // ============================================
  // Wait for shared utilities to load
  // ============================================

  const waitForUtils = (callback, maxWait = 1000) => {
    const startTime = Date.now();

    const check = () => {
      if (window.ErrorHandler && window.EventManager && window.PromptUtils && window.ExtensionState) {
        callback();
        return;
      }

      if (Date.now() - startTime > maxWait) {
        logger.error('Shared utilities failed to load');
        return;
      }

      setTimeout(check, 50);
    };

    check();
  };

  // ============================================
  // Selection Capture (Enhanced)
  // ============================================

  /**
   * Capture the current selection with support for:
   * - INPUT/TEXTAREA elements
   * - Contenteditable elements
   * - Shadow DOM
   * - Regular DOM selection
   */
  const captureSelection = () => {
    state.savedSelectionInfo = null;

    // Validate page first
    if (ErrorHandler.isRestrictedPage()) {
      throw ErrorHandler.createError(
        'Cannot run on this page',
        ErrorHandler.ErrorCategory.PERMISSION
      );
    }

    // Use PromptUtils to get selection info
    const selectionInfo = PromptUtils.getSelectionInfo();

    if (!selectionInfo.isValid) {
      throw ErrorHandler.createError(
        'No text selected',
        ErrorHandler.ErrorCategory.VALIDATION
      );
    }

    // Validate text length
    const validation = PromptUtils.validateTextLength(
      selectionInfo.text,
      CONFIG.MAX_SELECTION_LENGTH
    );

    if (!validation.valid) {
      throw ErrorHandler.createError(
        validation.error,
        ErrorHandler.ErrorCategory.VALIDATION
      );
    }

    state.savedSelectionInfo = selectionInfo;

    // Set up mutation observer for dynamic content (SPAs)
    setupMutationObserver();

    logger.log('Selection captured:', selectionInfo);
  };

  /**
   * Get the selected text
   */
  const getSelectionText = () => {
    if (!state.savedSelectionInfo) {
      return '';
    }

    return state.savedSelectionInfo.text || '';
  };

  // ============================================
  // Mutation Observer for Dynamic Content
  // ============================================

  /**
   * Set up mutation observer to track DOM changes
   * This helps maintain selection accuracy in SPAs
   */
  const setupMutationObserver = () => {
    if (state.mutationObserver) {
      state.mutationObserver.disconnect();
    }

    // Only observe if we have a DOM selection
    if (!state.savedSelectionInfo || state.savedSelectionInfo.type !== 'dom') {
      return;
    }

    try {
      const targetNode = state.savedSelectionInfo.startContainer?.getRootNode()?.body;

      if (!targetNode) {
        return;
      }

      state.mutationObserver = new MutationObserver((mutations) => {
        // Check if our selection is still valid
        if (!PromptUtils.isSelectionValid(state.savedSelectionInfo)) {
          logger.warn('Selection invalidated by DOM mutation');
          // Don't auto-close, just warn user
        }
      });

      state.mutationObserver.observe(targetNode, {
        childList: true,
        subtree: true,
        characterData: true
      });

      logger.log('Mutation observer set up');
    } catch (error) {
      logger.error('Failed to set up mutation observer:', error);
    }
  };

  /**
   * Disconnect mutation observer
   */
  const disconnectMutationObserver = () => {
    if (state.mutationObserver) {
      state.mutationObserver.disconnect();
      state.mutationObserver = null;
      logger.log('Mutation observer disconnected');
    }
  };

  // ============================================
  // Text Replacement with Undo Support
  // ============================================

  /**
   * Save current state to undo stack
   */
  const saveToUndoStack = () => {
    if (!state.savedSelectionInfo) {
      return;
    }

    const undoState = {
      selectionInfo: JSON.parse(JSON.stringify(state.savedSelectionInfo)),
      timestamp: Date.now()
    };

    // For DOM selections, we need to clone the range
    if (state.savedSelectionInfo.type === 'dom' && state.savedSelectionInfo.range) {
      undoState.selectionInfo.range = state.savedSelectionInfo.range.cloneRange();
    }

    state.undoStack.push(undoState);

    // Limit stack size
    if (state.undoStack.length > 10) {
      state.undoStack.shift();
    }

    logger.log('Saved to undo stack, stack size:', state.undoStack.length);
  };

  /**
   * Replace the selected text with new text
   * Supports undo and preserves caret position
   */
  const replaceSelectionText = (text, skipConfirmation = false) => {
    if (!state.savedSelectionInfo) {
      logger.warn('No saved selection to replace');
      return false;
    }

    // Check for large replacement
    const isLargeReplacement = text.length > CONFIG.LARGE_REPLACEMENT_THRESHOLD;

    if (isLargeReplacement && !skipConfirmation) {
      // Send confirmation request to overlay
      sendToOverlay({
        type: 'CONFIRM_REPLACEMENT',
        originalLength: state.savedSelectionInfo.text.length,
        newLength: text.length,
        preview: PromptUtils.truncate(text, 200)
      });
      return false;
    }

    // Save current state for undo
    saveToUndoStack();

    // Perform replacement
    try {
      if (state.savedSelectionInfo.type === 'input') {
        return replaceInputText(text);
      } else if (state.savedSelectionInfo.type === 'dom') {
        return replaceDOMText(text);
      }
    } catch (error) {
      logger.error('Replacement failed:', error);
      sendToOverlay({
        type: 'SHOW_ERROR',
        message: ErrorHandler.getUserMessage(error)
      });
      return false;
    }

    return false;
  };

  /**
   * Replace text in input/textarea element
   */
  const replaceInputText = (text) => {
    const { element, start, end } = state.savedSelectionInfo;

    if (!element?.isConnected) {
      throw ErrorHandler.createError(
        'Input element no longer available',
        ErrorHandler.ErrorCategory.DOM
      );
    }

    const value = element.value || '';
    element.value = `${value.slice(0, start)}${text}${value.slice(end)}`;

    // Set caret position at end of replacement
    const caret = start + text.length;
    element.setSelectionRange(caret, caret);

    // Focus the element
    element.focus();

    // Dispatch input event for any listeners
    element.dispatchEvent(new Event('input', { bubbles: true }));

    logger.log('Input text replaced');
    return true;
  };

  /**
   * Replace text in DOM (contenteditable or regular selection)
   */
  const replaceDOMText = (text) => {
    const { range } = state.savedSelectionInfo;

    if (!range) {
      throw ErrorHandler.createError(
        'No valid range for replacement',
        ErrorHandler.ErrorCategory.DOM
      );
    }

    // Check if range is still valid
    try {
      range.deleteContents();
    } catch (error) {
      throw ErrorHandler.createError(
        'Selection is no longer valid',
        ErrorHandler.ErrorCategory.DOM
      );
    }

    // Insert new text
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    // Collapse range to end and set selection
    range.collapse(false);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // For contenteditable, try to enable undo with execCommand
    if (PromptUtils.isContentEditable(range.startContainer?.parentElement)) {
      try {
        // Note: execCommand is deprecated but still widely supported
        // This enables browser's native undo (Ctrl+Z)
        document.execCommand('insertText', false, text);
      } catch (e) {
        logger.warn('execCommand failed, using manual replacement');
      }
    }

    logger.log('DOM text replaced');
    return true;
  };

  /**
   * Undo the last replacement
   */
  const undoReplacement = () => {
    if (state.undoStack.length === 0) {
      logger.warn('Nothing to undo');
      return false;
    }

    const lastState = state.undoStack.pop();

    try {
      // Restore the original selection
      if (lastState.selectionInfo.range) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(lastState.selectionInfo.range);
      } else if (lastState.selectionInfo.element) {
        const { element, start, end } = lastState.selectionInfo;
        if (element?.isConnected) {
          element.focus();
          element.setSelectionRange(start, end);
        }
      }

      logger.log('Undo successful');
      return true;
    } catch (error) {
      logger.error('Undo failed:', error);
      return false;
    }
  };

  // ============================================
  // Overlay Management
  // ============================================

  /**
   * Send a message to the overlay
   */
  const sendToOverlay = (payload) => {
    if (!state.overlayFrame?.contentWindow) {
      logger.warn('Overlay frame not available');
      return;
    }

    const extensionOrigin = chrome.runtime.getURL('').replace(/\/$/, '');

    state.overlayFrame.contentWindow.postMessage(
      { ...payload, token: state.overlayToken },
      extensionOrigin
    );

    logger.log('Sent to overlay:', payload.type);
  };

  /**
   * Get overlay frame dimensions
   */
  const getOverlayMetrics = () => {
    if (!state.overlayFrame) return null;

    const rect = state.overlayFrame.getBoundingClientRect();

    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  /**
   * Ensure overlay metrics exist
   */
  const ensureOverlayMetrics = () => {
    if (state.overlayMetrics) return state.overlayMetrics;
    state.overlayMetrics = getOverlayMetrics();
    return state.overlayMetrics;
  };

  /**
   * Apply overlay metrics to frame
   */
  const applyOverlayMetrics = () => {
    if (!state.overlayFrame || !state.overlayMetrics) return;

    state.overlayFrame.style.left = `${state.overlayMetrics.left}px`;
    state.overlayFrame.style.top = `${state.overlayMetrics.top}px`;
    state.overlayFrame.style.width = `${state.overlayMetrics.width}px`;
    state.overlayFrame.style.height = `${state.overlayMetrics.height}px`;
    state.overlayFrame.style.right = 'auto';
    state.overlayFrame.style.bottom = 'auto';
  };

  /**
   * Handle window resize (debounced)
   */
  const handleWindowResize = PromptUtils.debounce(() => {
    if (!state.overlayFrame || !state.overlayReady) return;

    state.overlayMetrics = getOverlayMetrics();

    if (state.overlayMetrics) {
      sendToOverlay({ type: 'OVERLAY_FRAME', frame: state.overlayMetrics });
    }
  }, 150);

  /**
   * Create and inject the overlay iframe
   */
  const ensureOverlay = () => {
    if (state.overlayFrame) {
      logger.log('Overlay already exists');
      return;
    }

    if (!document.body || !document.head) {
      logger.log('DOM not ready, waiting for DOMContentLoaded');

      state.eventManager?.add(document, 'DOMContentLoaded', ensureOverlay, { once: true });

      return;
    }

    logger.log('Creating overlay iframe');

    // Create iframe
    state.overlayFrame = document.createElement('iframe');
    state.overlayFrame.src = chrome.runtime.getURL('src/ui/overlay/overlay.html');
    state.overlayFrame.className = 'prompt-improver-frame';
    state.overlayFrame.setAttribute('title', 'Prompt Improver');
    state.overlayFrame.setAttribute('aria-label', 'Prompt Improver Overlay');

    // Create styles
    state.overlayStyle = document.createElement('style');

    state.overlayStyle.textContent = `
      .prompt-improver-frame {
        position: fixed;
        inset: auto 24px 24px auto;
        width: ${CONFIG.OVERLAY_WIDTH}px;
        height: ${CONFIG.OVERLAY_HEIGHT}px;
        border: none;
        z-index: ${CONFIG.OVERLAY_Z_INDEX};
        border-radius: 20px;
        box-shadow: 0 24px 60px rgba(24, 16, 12, 0.3);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @media (max-width: 600px) {
        .prompt-improver-frame {
          inset: 12px;
          width: auto;
          height: calc(100% - 24px);
        }
      }

      .prompt-improver-frame.slide-over {
        transform: translateX(100%);
      }
    `;

    // Add load listener before appendChild
    state.eventManager?.add(state.overlayFrame, 'load', () => {
      logger.log('Overlay iframe loaded successfully');
      state.overlayReady = true;
      state.overlayMetrics = getOverlayMetrics();

      sendToOverlay({
        type: 'OVERLAY_INIT',
        text: state.pendingSelectionText,
        frame: state.overlayMetrics,
      });
    });

    // Add error handler
    state.eventManager?.add(state.overlayFrame, 'error', (err) => {
      logger.error('Overlay iframe error:', err);
      ErrorHandler.log('Overlay Load', err, ErrorHandler.ErrorCategory.DOM);
    });

    // Add resize handler using EventManager
    state.eventManager?.add(window, 'resize', handleWindowResize);

    // Inject into DOM
    document.head.appendChild(state.overlayStyle);
    document.body.appendChild(state.overlayFrame);

    logger.log('Overlay injected');
  };

  /**
   * Close and clean up the overlay
   */
  const closeOverlay = () => {
    if (state.isCleaningUp) {
      logger.warn('Already cleaning up');
      return;
    }

    state.isCleaningUp = true;

    logger.log('Closing overlay');

    // Disconnect mutation observer
    disconnectMutationObserver();

    // Remove iframe and style
    state.overlayFrame?.remove();
    state.overlayStyle?.remove();

    // Clean up event manager
    if (state.eventManager) {
      state.eventManager.cleanup();
      state.eventManager = null;
    }

    // Reset state
    state.overlayFrame = null;
    state.overlayStyle = null;
    state.overlayReady = false;
    state.overlayToken = null;
    state.overlayMetrics = null;
    state.savedSelectionInfo = null;
    state.pendingSelectionText = '';
    state.resizeHandler = null;
    state.isCleaningUp = false;

    // Keep undoStack for potential undo operations

    logger.log('Overlay closed and cleaned up');
  };

  // ============================================
  // Message Handling
  // ============================================

  /**
   * Handle messages from overlay and extension
   */
  const handleWindowMessage = (event) => {
    const extensionOrigin = chrome.runtime.getURL('').replace(/\/$/, '');

    // Verify source
    const isFromOurOverlay = state.overlayFrame?.contentWindow &&
                              event.source === state.overlayFrame.contentWindow;
    const isValidSource = isFromOurOverlay || event.origin === extensionOrigin;

    if (!isValidSource) {
      return;
    }

    // Additional security check
    if (state.overlayFrame && event.source === window) {
      return;
    }

    const data = event.data;

    if (!data) return;

    // Handle token echo
    if (data.type === 'OVERLAY_INIT' && data.token) {
      if (!state.overlayToken) {
        state.overlayToken = data.token;
        logger.log('Token initialized');
      }
      return;
    }

    // Handle overlay actions
    if (data.type === 'OVERLAY_ACTION') {
      // Validate token
      if (!data.token || data.token !== state.overlayToken) {
        logger.error('Token validation failed');
        return;
      }

      switch (data.action) {
        case 'replace':
          replaceSelectionText(data.text || '');
          break;

        case 'replaceConfirmed':
          // User confirmed large replacement
          replaceSelectionText(data.text || '', true);
          break;

        case 'undo':
          undoReplacement();
          break;

        case 'close':
          closeOverlay();
          break;

        case 'position':
          if (state.overlayFrame) {
            const metrics = ensureOverlayMetrics();
            if (!metrics) return;

            if (Number.isFinite(data.left)) {
              metrics.left = data.left;
            }
            if (Number.isFinite(data.top)) {
              metrics.top = data.top;
            }

            applyOverlayMetrics();
          }
          break;

        case 'resize':
          if (state.overlayFrame) {
            const metrics = ensureOverlayMetrics();
            if (!metrics) return;

            if (Number.isFinite(data.width)) {
              metrics.width = data.width;
            }
            if (Number.isFinite(data.height)) {
              metrics.height = data.height;
            }

            applyOverlayMetrics();
          }
          break;
      }
    }
  };

  /**
   * Handle messages from background script
   */
  const handleRuntimeMessage = (message) => {
    if (message?.type !== 'OPEN_OVERLAY') return;

    try {
      // Validate page
      ErrorHandler.validatePage();

      // Capture selection
      captureSelection();

      // Get selected text
      state.pendingSelectionText = getSelectionText();

      // Generate new token for security
      state.overlayToken = ExtensionState.createToken();

      // Create overlay
      ensureOverlay();

      // Send text if overlay is ready
      if (state.overlayReady) {
        sendToOverlay({ type: 'SELECTION_TEXT', text: state.pendingSelectionText });
      }
    } catch (error) {
      // Handle error gracefully
      const errorInfo = ErrorHandler.log('Open Overlay', error);

      // Show error to user (if possible)
      if (state.overlayReady) {
        sendToOverlay({
          type: 'SHOW_ERROR',
          message: errorInfo.userMessage
        });
      } else {
        // Fallback to badge error
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tab = tabs[0];
          if (tab?.id && chrome.action) {
            chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: '#b73524' });
            chrome.action.setBadgeText({ tabId: tab.id, text: '!' });
            chrome.action.setTitle({
              tabId: tab.id,
              title: `Prompt Improver: ${errorInfo.userMessage}`
            });

            setTimeout(() => {
              chrome.action.setBadgeText({ tabId: tab.id, text: '' });
            }, 4500);
          }
        });
      }
    }
  };

  // ============================================
  // Initialization
  // ============================================

  /**
   * Initialize the content script
   */
  const initialize = () => {
    logger.log('Initializing content script');

    // Check for restricted pages
    if (ErrorHandler.isRestrictedPage()) {
      logger.log('Restricted page detected, skipping initialization');
      return;
    }

    // Create event manager
    state.eventManager = new EventManager();

    // Add message listeners
    state.eventManager.add(window, 'message', handleWindowMessage);
    chrome.runtime.onMessage.addListener(handleRuntimeMessage);

    // Add cleanup on page unload
    state.eventManager.add(window, 'beforeunload', () => {
      closeOverlay();
    });

    logger.log('Content script initialized');
  };

  // Wait for shared utilities and initialize
  waitForUtils(() => {
    initialize();
  });

})();

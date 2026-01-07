/**
 * Utils - Shared utility functions for the extension
 * DOM helpers, validation, text processing, etc.
 */

(() => {
  if (window.PromptUtils) {
    return; // Already loaded
  }

  const PromptUtils = {
    /**
     * DOM Helpers
     */

    /**
     * Check if element is contenteditable
     */
    isContentEditable(element) {
      if (!element) return false;
      return element.isContentEditable || element.getAttribute('contenteditable') === 'true';
    },

    /**
     * Check if element is in a shadow DOM
     */
    isInShadowDOM(element) {
      if (!element) return false;
      return !!element.getRootNode()?.host;
    },

    /**
     * Get the active element, traversing shadow DOM if necessary
     */
    getActiveElement() {
      let active = document.activeElement;

      // Traverse into shadow DOMs
      while (active?.shadowRoot?.activeElement) {
        active = active.shadowRoot.activeElement;
      }

      return active;
    },

    /**
     * Check if element is an input or textarea
     */
    isInputOrTextarea(element) {
      if (!element) return false;
      const tagName = element.tagName?.toUpperCase();
      return tagName === 'INPUT' || tagName === 'TEXTAREA';
    },

    /**
     * Check if element is valid for text selection
     */
    isValidElementType(element) {
      if (!element) return false;

      // Input/textarea elements
      if (this.isInputOrTextarea(element)) {
        return true;
      }

      // Contenteditable elements
      if (this.isContentEditable(element)) {
        return true;
      }

      // Regular body elements (for Selection API)
      return true;
    },

    /**
     * Find the shadow root containing an element
     */
    getShadowRoot(element) {
      if (!element) return null;

      const root = element.getRootNode();

      // Check if it's a shadow root (has a host property)
      if (root?.host) {
        return root;
      }

      return null;
    },

    /**
     * Selection Helpers
     */

    /**
     * Get detailed selection information
     */
    getSelectionInfo() {
      const active = this.getActiveElement();

      // Input/textarea selection
      if (this.isInputOrTextarea(active)) {
        return {
          type: 'input',
          element: active,
          text: active.value.slice(active.selectionStart, active.selectionEnd),
          start: active.selectionStart,
          end: active.selectionEnd,
          isValid: active.selectionStart !== active.selectionEnd
        };
      }

      // DOM selection
      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const text = selection.toString();

        return {
          type: 'dom',
          selection,
          range: range.cloneRange(),
          text,
          startOffset: range.startOffset,
          endOffset: range.endOffset,
          startContainer: range.startContainer,
          endContainer: range.endContainer,
          isValid: text.length > 0
        };
      }

      return {
        type: 'none',
        isValid: false
      };
    },

    /**
     * Check if selection is still valid (element still connected)
     */
    isSelectionValid(selectionInfo) {
      if (!selectionInfo) return false;

      if (selectionInfo.type === 'input') {
        return selectionInfo.element?.isConnected;
      }

      if (selectionInfo.type === 'dom') {
        if (!selectionInfo.range) return false;

        try {
          // Check if range is still valid
          const testRange = selectionInfo.range.cloneRange();
          return testRange.startContainer?.isConnected || false;
        } catch (e) {
          return false;
        }
      }

      return false;
    },

    /**
     * Restore a selection
     */
    restoreSelection(selectionInfo) {
      if (!selectionInfo) return false;

      if (selectionInfo.type === 'input') {
        const { element, start, end } = selectionInfo;

        if (!element?.isConnected) return false;

        try {
          element.focus();
          element.setSelectionRange(start, end);
          return true;
        } catch (e) {
          console.error('[PromptUtils] Failed to restore input selection:', e);
          return false;
        }
      }

      if (selectionInfo.type === 'dom') {
        const { range } = selectionInfo;

        if (!range) return false;

        try {
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          return true;
        } catch (e) {
          console.error('[PromptUtils] Failed to restore DOM selection:', e);
          return false;
        }
      }

      return false;
    },

    /**
     * Text Helpers
     */

    /**
     * Truncate text to max length with ellipsis
     */
    truncate(text, maxLength, suffix = '...') {
      if (!text || typeof text !== 'string') return '';

      if (text.length <= maxLength) return text;

      return text.slice(0, maxLength - suffix.length) + suffix;
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHTML(text) {
      if (!text || typeof text !== 'string') return '';

      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    /**
     * Strip markdown formatting (bold, italic)
     */
    stripMarkdown(text) {
      if (!text || typeof text !== 'string') return '';

      return text
        .replace(/\*\*([^*]+?)\*\*/g, '$1')   // Remove **bold**
        .replace(/__([^_]+?)__/g, '$1')       // Remove __bold__
        .replace(/\*([^*]+?)\*/g, '$1')       // Remove *italic*
        .replace(/_([^_]+?)_/g, '$1')         // Remove _italic_
        .trim();
    },

    /**
     * Count words in text
     */
    countWords(text) {
      if (!text || typeof text !== 'string') return 0;

      const trimmed = text.trim();
      if (!trimmed) return 0;

      return trimmed.split(/\s+/).length;
    },

    /**
     * Validation Helpers
     */

    /**
     * Check if current page is restricted
     */
    isRestrictedPage() {
      const protocol = window.location.protocol;
      const restrictedProtocols = ['chrome:', 'chrome-extension:', 'about:', 'edge:', 'opera:'];
      return restrictedProtocols.includes(protocol);
    },

    /**
     * Validate text length
     */
    validateTextLength(text, maxLength = 4000) {
      if (!text || typeof text !== 'string') {
        return { valid: false, error: 'No text provided' };
      }

      const trimmed = text.trim();

      if (!trimmed) {
        return { valid: false, error: 'No text selected' };
      }

      if (trimmed.length > maxLength) {
        return {
          valid: false,
          error: `Text is too long. Maximum ${maxLength} characters.`
        };
      }

      return { valid: true, text: trimmed };
    },

    /**
     * Performance Helpers
     */

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
    },

    /**
     * Request animation frame with timeout
     */
    rafTimeout(callback, timeoutMs = 1000) {
      return new Promise((resolve, reject) => {
        const rafId = requestAnimationFrame(() => {
          try {
            resolve(callback());
          } catch (error) {
            reject(error);
          }
        });

        setTimeout(() => {
          cancelAnimationFrame(rafId);
          reject(new Error('RAF timeout'));
        }, timeoutMs);
      });
    },

    /**
     * Math Helpers
     */

    /**
     * Clamp a number between min and max
     */
    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    },

    /**
     * Linear interpolation
     */
    lerp(start, end, t) {
      return start * (1 - t) + end * t;
    },

    /**
     * Generate a unique ID
     */
    generateId() {
      return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    },

    /**
     * Format bytes to human readable string
     */
    formatBytes(bytes) {
      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }
  };

  window.PromptUtils = PromptUtils;
})();

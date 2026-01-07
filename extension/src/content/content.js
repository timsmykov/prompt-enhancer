(() => {
  // Logger utility with environment-aware logging
  const DEBUG_MODE = false; // Set via build flag or environment variable

  const logger = {
    log: (...args) => { if (DEBUG_MODE) console.log('[PromptImprover]', ...args); },
    warn: (...args) => console.warn('[PromptImprover]', ...args),
    error: (...args) => console.error('[PromptImprover]', ...args),
  };

  let overlayFrame = null;
  let overlayStyle = null;
  let overlayReady = false;
  let overlayToken = null;
  let overlayMetrics = null;
  let pendingSelectionText = '';
  let savedRange = null;
  let savedInput = null;
  let savedOffsets = null;
  let resizeHandler = null;

  const createToken = () => {
    if (!crypto?.getRandomValues) {
      throw new Error('Cryptographically secure random number generation not available. Extension cannot function securely.');
    }
    const values = new Uint32Array(8); // 256-bit entropy (increased from 4)
    crypto.getRandomValues(values);
    return Array.from(values, (value) => value.toString(16)).join('');
  };

  const captureSelection = () => {
    savedRange = null;
    savedInput = null;
    savedOffsets = null;

    const active = document.activeElement;
    if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT')) {
      savedInput = active;
      savedOffsets = {
        start: active.selectionStart ?? 0,
        end: active.selectionEnd ?? 0,
      };
      return;
    }

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedRange = selection.getRangeAt(0).cloneRange();
    }
  };

  const getSelectionText = () => {
    const active = document.activeElement;
    if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT')) {
      const start = active.selectionStart ?? 0;
      const end = active.selectionEnd ?? 0;
      return active.value?.slice(start, end) || '';
    }

    const selection = window.getSelection();
    return selection?.toString() || '';
  };

  const replaceSelectionText = (text) => {
    if (savedInput && savedOffsets && savedInput.isConnected) {
      const value = savedInput.value || '';
      savedInput.value = `${value.slice(0, savedOffsets.start)}${text}${value.slice(
        savedOffsets.end
      )}`;
      const caret = savedOffsets.start + text.length;
      savedInput.setSelectionRange(caret, caret);
      return;
    }

    if (!savedRange || typeof savedRange.deleteContents !== 'function') return;
    try {
      savedRange.deleteContents();
      savedRange.insertNode(document.createTextNode(text));
      savedRange.collapse(false);
    } catch (error) {
      // Ignore if the range is no longer valid.
    }
  };

  const sendToOverlay = (payload) => {
    if (!overlayFrame?.contentWindow) return;
    const extensionOrigin = chrome.runtime.getURL('').replace(/\/$/, '');
    overlayFrame.contentWindow.postMessage(
      { ...payload, token: overlayToken },
      extensionOrigin
    );
  };

  const getOverlayMetrics = () => {
    if (!overlayFrame) return null;
    const rect = overlayFrame.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  const ensureOverlayMetrics = () => {
    if (overlayMetrics) return overlayMetrics;
    overlayMetrics = getOverlayMetrics();
    return overlayMetrics;
  };

  const applyOverlayMetrics = () => {
    if (!overlayFrame || !overlayMetrics) return;
    overlayFrame.style.left = `${overlayMetrics.left}px`;
    overlayFrame.style.top = `${overlayMetrics.top}px`;
    overlayFrame.style.width = `${overlayMetrics.width}px`;
    overlayFrame.style.height = `${overlayMetrics.height}px`;
    overlayFrame.style.right = 'auto';
    overlayFrame.style.bottom = 'auto';
  };

  // Resize handler - added only when overlay is created
  const createResizeHandler = () => {
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
    }
    resizeHandler = () => {
      if (!overlayFrame || !overlayReady) return;
      overlayMetrics = getOverlayMetrics();
      if (overlayMetrics) {
        sendToOverlay({ type: 'OVERLAY_FRAME', frame: overlayMetrics });
      }
    };
    window.addEventListener('resize', resizeHandler);
  };

  const ensureOverlay = () => {
    if (overlayFrame) {
      logger.log('Overlay already exists');
      return;
    }
    if (!document.body || !document.head) {
      logger.log('DOM not ready, waiting for DOMContentLoaded');
      document.addEventListener('DOMContentLoaded', ensureOverlay, {
        once: true,
      });
      return;
    }
    logger.log('Creating overlay iframe');
    overlayFrame = document.createElement('iframe');
    overlayFrame.src = chrome.runtime.getURL('src/ui/overlay/overlay.html');
    overlayFrame.className = 'prompt-improver-frame';
    overlayFrame.setAttribute('title', 'Prompt improver');
    overlayFrame.setAttribute('aria-label', 'Prompt improver');

    overlayStyle = document.createElement('style');
    overlayStyle.textContent = `
      .prompt-improver-frame {
        position: fixed;
        inset: auto 24px 24px auto;
        width: 360px;
        height: 520px;
        border: none;
        z-index: 2147483647;
        border-radius: 20px;
        box-shadow: 0 24px 60px rgba(24, 16, 12, 0.3);
      }

      @media (max-width: 600px) {
        .prompt-improver-frame {
          inset: 12px;
          width: auto;
          height: calc(100% - 24px);
        }
      }
    `;

    // Add load listener BEFORE appendChild to avoid race condition
    overlayFrame.addEventListener('load', () => {
      logger.log('Overlay iframe loaded successfully');
      overlayReady = true;
      overlayMetrics = getOverlayMetrics();
      sendToOverlay({
        type: 'OVERLAY_INIT',
        text: pendingSelectionText,
        frame: overlayMetrics,
      });
    });

    overlayFrame.onerror = (err) => {
      logger.error('Overlay iframe error:', err);
    };

    // Create and add resize handler when overlay is created
    createResizeHandler();

    document.head.appendChild(overlayStyle);
    document.body.appendChild(overlayFrame);
  };

  const closeOverlay = () => {
    overlayFrame?.remove();
    overlayStyle?.remove();
    overlayFrame = null;
    overlayStyle = null;
    overlayReady = false;
    overlayToken = null;
    overlayMetrics = null;
    savedRange = null;
    savedInput = null;
    savedOffsets = null;
    pendingSelectionText = '';

    // Remove resize listener to prevent memory leak
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      resizeHandler = null;
    }
  };

  window.addEventListener('message', (event) => {
    const extensionOrigin = chrome.runtime.getURL('').replace(/\/$/, '');

    // For messages from our overlay iframe, event.origin is the page's origin (not extension)
    // So we use event.source verification instead for iframe messages
    const isFromOurOverlay = overlayFrame?.contentWindow && event.source === overlayFrame.contentWindow;

    // Accept messages from our overlay (iframe) OR from extension pages
    const isValidSource = isFromOurOverlay || event.origin === extensionOrigin;
    if (!isValidSource) {
      return;
    }

    // ADDITIONAL GUARD: If we have an overlay and message is from postMessage, check source more carefully
    if (overlayFrame && event.source === window) {
      return;
    }

    if (event.data?.type === 'OVERLAY_INIT' && event.data.token) {
      // Verify this is our token echoed back
      if (!overlayToken) {
        overlayToken = event.data.token;
      }
      return;
    }
    if (event.data?.type !== 'OVERLAY_ACTION') return;

    if (!event.data.token || event.data.token !== overlayToken) {
      logger.error('Token validation failed');
      return;
    }

    if (event.data.action === 'replace') {
      replaceSelectionText(event.data.text || '');
    }
    if (event.data.action === 'close') {
      closeOverlay();
    }
    if (event.data.action === 'position' && overlayFrame) {
      const metrics = ensureOverlayMetrics();
      if (!metrics) return;
      if (Number.isFinite(event.data.left)) {
        metrics.left = event.data.left;
      }
      if (Number.isFinite(event.data.top)) {
        metrics.top = event.data.top;
      }
      applyOverlayMetrics();
    }
    if (event.data.action === 'resize' && overlayFrame) {
      const metrics = ensureOverlayMetrics();
      if (!metrics) return;
      if (Number.isFinite(event.data.width)) {
        metrics.width = event.data.width;
      }
      if (Number.isFinite(event.data.height)) {
        metrics.height = event.data.height;
      }
      applyOverlayMetrics();
    }
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== 'OPEN_OVERLAY') return;
    captureSelection();
    pendingSelectionText = getSelectionText();
    // Always generate new token to prevent race conditions with old messages
    overlayToken = createToken();
    ensureOverlay();
    if (overlayReady) {
      sendToOverlay({ type: 'SELECTION_TEXT', text: pendingSelectionText });
    }
  });
})();

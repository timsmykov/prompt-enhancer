(() => {
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
    if (crypto?.getRandomValues) {
      const values = new Uint32Array(4);
      crypto.getRandomValues(values);
      return Array.from(values, (value) => value.toString(16)).join('');
    }
    return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
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

    if (!savedRange) return;
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
    overlayFrame.contentWindow.postMessage(
      { ...payload, token: overlayToken },
      '*'
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

  const ensureOverlay = () => {
    if (overlayFrame) {
      console.log('[PromptImprover] Overlay already exists');
      return;
    }
    if (!document.body || !document.head) {
      console.log('[PromptImprover] DOM not ready, waiting for DOMContentLoaded');
      document.addEventListener('DOMContentLoaded', ensureOverlay, {
        once: true,
      });
      return;
    }
    console.log('[PromptImprover] Creating overlay iframe...');
    overlayFrame = document.createElement('iframe');
    overlayFrame.src = chrome.runtime.getURL('src/ui/overlay/overlay.html');
    overlayFrame.className = 'prompt-improver-frame';
    overlayFrame.setAttribute('title', 'Prompt improver');
    overlayFrame.setAttribute('aria-label', 'Prompt improver');

    overlayFrame.onload = () => {
      console.log('[PromptImprover] Overlay iframe loaded successfully');
    };

    overlayFrame.onerror = (err) => {
      console.log('[PromptImprover] Overlay iframe error:', err);
    };

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

    document.head.appendChild(overlayStyle);
    document.body.appendChild(overlayFrame);

    overlayFrame.addEventListener('load', () => {
      overlayReady = true;
      overlayMetrics = getOverlayMetrics();
      sendToOverlay({
        type: 'OVERLAY_INIT',
        text: pendingSelectionText,
        frame: overlayMetrics,
      });
    });
  };

  const closeOverlay = () => {
    // Remove resize listener to prevent memory leak
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      resizeHandler = null;
    }

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
  };

  chrome.runtime.onMessage.addListener((message) => {
    console.log('[PromptImprover] Content script received:', message);
    if (message?.type !== 'OPEN_OVERLAY') return;
    captureSelection();
    pendingSelectionText = getSelectionText();
    console.log('[PromptImprover] Selected text:', pendingSelectionText);
    // Always generate new token to prevent race conditions with old messages
    overlayToken = createToken();
    ensureOverlay();
    if (overlayReady) {
      sendToOverlay({ type: 'SELECTION_TEXT', text: pendingSelectionText });
    }
  });

  window.addEventListener('message', (event) => {
    if (event.data?.type === 'OVERLAY_INIT' && event.data.token) {
      // Accept token from overlay's initial handshake
      overlayToken = event.data.token;
      return;
    }
    if (event.data?.type !== 'OVERLAY_ACTION') return;
    if (!overlayToken || event.data.token !== overlayToken) return;

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

  // Create resize handler once to avoid memory leaks
  resizeHandler = () => {
    if (!overlayFrame || !overlayReady) return;
    overlayMetrics = getOverlayMetrics();
    if (overlayMetrics) {
      sendToOverlay({ type: 'OVERLAY_FRAME', frame: overlayMetrics });
    }
  };
  window.addEventListener('resize', resizeHandler);
})();

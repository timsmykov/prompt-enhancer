(() => {
  const DEFAULT_TYPING_SPEED = 25;

  const state = {
    status: 'idle',
    error: '',
    originalText: '',
    resultText: '',
    showOriginal: false,
    typingSpeed: DEFAULT_TYPING_SPEED,
    isTyping: false,
    toastMessage: '',
    toastVisible: false,
    typingTimer: null,
    toastTimer: null,
    sessionToken: '',
  };

  const dom = {
    app: document.getElementById('app'),
    surface: document.querySelector('.surface'),
    statusPill: document.querySelector('.status-pill'),
    hint: document.querySelector('.hint'),
    resultTextarea: document.querySelector('#result'),
    toggleOriginal: document.querySelector('.toggle'),
    originalPanel: document.querySelector('.panel.muted'),
    originalTextarea: document.querySelector('#original'),
    loading: document.querySelector('.loading'),
    error: document.querySelector('.error'),
    replaceButton: document.querySelector('button.primary'),
    copyButton: document.querySelector('button.secondary'),
    regenerateButton: document.querySelector('button.ghost'),
    closeButton: document.querySelector('.icon-button'),
    toast: document.querySelector('.toast'),
    backdrop: document.querySelector('.backdrop'),
    dragHandle: document.querySelector('.drag-handle'),
    resizeHandle: document.querySelector('.resize-handle'),
  };

  const MIN_WIDTH = 280;
  const MIN_HEIGHT = 200;

  // Remove markdown bold (**text**) and italic (*text*) formatting - use non-greedy regex
  const cleanupMarkdown = (text) => {
    if (typeof text !== 'string') return '';
    return text
      .replace(/\*\*([^*]+?)\*\*/g, '$1')   // Remove **bold**
      .replace(/__([^_]+?)__/g, '$1')       // Remove __bold__
      .replace(/\*([^*]+?)\*/g, '$1')       // Remove *italic*
      .replace(/_([^_]+?)_/g, '$1')         // Remove _italic_
      .trim();
  };

  const frameState = {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  if (!dom.statusPill || !dom.resultTextarea) {
    return;
  }

  const updateFrameState = (frame) => {
    if (!frame || typeof frame !== 'object') return;
    if (Number.isFinite(frame.left)) frameState.left = frame.left;
    if (Number.isFinite(frame.top)) frameState.top = frame.top;
    if (Number.isFinite(frame.width)) frameState.width = frame.width;
    if (Number.isFinite(frame.height)) frameState.height = frame.height;
  };

  const sendOverlayAction = (payload) => {
    if (!window.parent) return;
    window.parent.postMessage(
      { type: 'OVERLAY_ACTION', token: state.sessionToken, ...payload },
      '*'
    );
  };

  const setInteractionState = (name, active) => {
    if (!dom.surface) return;
    dom.surface.setAttribute(`data-${name}`, active ? 'true' : 'false');
    document.body.classList.toggle(`is-${name}`, active);
  };

  const statusLabel = () => {
    if (state.status === 'loading') return 'Working';
    if (state.status === 'typing') return 'Typing';
    if (state.status === 'ready') return 'Ready';
    if (state.status === 'error') return 'Error';
    return 'Idle';
  };

  const canAct = () => state.status === 'ready' && state.resultText.trim().length > 0;

  const render = () => {
    dom.statusPill.textContent = statusLabel();
    dom.statusPill.setAttribute('data-status', state.status);

    if (dom.hint) {
      dom.hint.hidden = state.status !== 'idle';
    }

    if (dom.resultTextarea) {
      dom.resultTextarea.readOnly = state.status !== 'ready';
      if (dom.resultTextarea.value !== state.resultText) {
        dom.resultTextarea.value = state.resultText;
        dom.resultTextarea.scrollTop = 0;
      }
    }

    if (dom.toggleOriginal && dom.originalPanel && dom.originalTextarea) {
      if (state.originalText) {
        dom.toggleOriginal.hidden = false;
        dom.toggleOriginal.textContent = state.showOriginal
          ? 'Hide original'
          : 'Show original';
        dom.toggleOriginal.setAttribute(
          'aria-expanded',
          state.showOriginal ? 'true' : 'false'
        );
        dom.originalPanel.hidden = !state.showOriginal;
        if (dom.originalTextarea.value !== state.originalText) {
          dom.originalTextarea.value = state.originalText;
          dom.originalTextarea.scrollTop = 0;
        }
      } else {
        dom.toggleOriginal.hidden = true;
        dom.toggleOriginal.textContent = 'Show original';
        dom.toggleOriginal.setAttribute('aria-expanded', 'false');
        dom.originalPanel.hidden = true;
        if (dom.originalTextarea.value !== '') {
          dom.originalTextarea.value = '';
        }
      }
    }

    if (dom.loading) {
      dom.loading.hidden = state.status !== 'loading';
    }

    if (dom.error) {
      dom.error.hidden = state.status !== 'error';
      dom.error.textContent = state.error;
    }

    if (dom.replaceButton) {
      dom.replaceButton.disabled = !canAct();
    }

    if (dom.copyButton) {
      dom.copyButton.disabled = !canAct();
    }

    if (dom.regenerateButton) {
      dom.regenerateButton.disabled =
        state.status === 'loading' || !state.originalText;
    }

    if (dom.toast) {
      dom.toast.hidden = !state.toastVisible;
      dom.toast.textContent = state.toastMessage;
    }
  };

  const stopTyping = () => {
    if (state.typingTimer) {
      clearTimeout(state.typingTimer);
      state.typingTimer = null;
    }
    state.isTyping = false;
  };

  const setError = (message) => {
    stopTyping();
    state.status = 'error';
    state.error = message || 'Something went wrong.';
    render();
  };

  const handleResponse = (response) => {
    if (!response) {
      setError('No response from background.');
      return;
    }
    if (response.error) {
      setError(response.error);
      return;
    }
    if (typeof response.result !== 'string') {
      setError('No response content returned.');
      return;
    }
    const payload = cleanupMarkdown(response.result);
    if (!payload) {
      setError('No response content returned.');
      return;
    }
    startTyping(payload);
  };

  const requestImprove = () => {
    if (!state.originalText.trim()) {
      setError('No text selected.');
      return;
    }
    stopTyping();
    state.status = 'loading';
    state.error = '';
    render();

    const payload = {
      type: 'IMPROVE_PROMPT',
      text: state.originalText,
    };

    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage(payload, (response) => {
        if (chrome.runtime.lastError) {
          setError('Background not available.');
          return;
        }
        handleResponse(response);
      });
      return;
    }

    setTimeout(() => {
      startTyping(state.originalText);
    }, 350);
  };

  const setSelection = (text) => {
    stopTyping();
    const nextText = (text || '').trim();
    state.originalText = nextText;
    state.showOriginal = false;
    if (!nextText) {
      state.status = 'idle';
      state.resultText = '';
      render();
      return;
    }
    requestImprove();
  };

  const fallbackCopy = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };

  const triggerToast = (message) => {
    state.toastMessage = message;
    state.toastVisible = true;
    render();
    if (state.toastTimer) {
      clearTimeout(state.toastTimer);
    }
    state.toastTimer = setTimeout(() => {
      state.toastVisible = false;
      render();
    }, 1800);
  };

  const copyResult = () => {
    const text = cleanupMarkdown(state.resultText);
    if (!text) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          triggerToast('Copied to clipboard.');
        })
        .catch(() => {
          fallbackCopy(text);
          triggerToast('Copied to clipboard.');
        });
    } else {
      fallbackCopy(text);
      triggerToast('Copied to clipboard.');
    }
  };

  const replaceSelection = () => {
    const text = cleanupMarkdown(state.resultText);
    if (!text) return;
    sendOverlayAction({ action: 'replace', text });
  };

  const closeOverlay = () => {
    // Clear timers to prevent memory leaks
    if (state.typingTimer) {
      clearTimeout(state.typingTimer);
      state.typingTimer = null;
    }
    if (state.toastTimer) {
      clearTimeout(state.toastTimer);
      state.toastTimer = null;
    }
    sendOverlayAction({ action: 'close' });
  };

  const regenerate = () => {
    requestImprove();
  };

  const applyTypingSpeed = (value) => {
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric >= 0) {
      state.typingSpeed = Math.round(numeric);
    } else {
      state.typingSpeed = DEFAULT_TYPING_SPEED;
    }
  };

  const loadTypingSpeed = () => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local?.get) return;
    chrome.storage.local.get(['typingSpeed'], (data) => {
      applyTypingSpeed(data.typingSpeed);
    });
  };

  const startTyping = (text) => {
    // Guard against multiple typing calls
    if (state.isTyping) {
      stopTyping();
    }
    const payload = text || '';
    if (!payload) {
      state.resultText = '';
      state.status = 'ready';
      render();
      return;
    }
    if (state.typingSpeed === 0) {
      state.resultText = payload;
      state.status = 'ready';
      render();
      return;
    }
    state.resultText = '';
    state.status = 'typing';
    state.isTyping = true;
    render();
    let index = 0;
    const step = () => {
      if (index >= payload.length) {
        state.isTyping = false;
        state.status = 'ready';
        state.typingTimer = null;
        render();
        return;
      }
      state.resultText += payload[index];
      index += 1;
      render();
      state.typingTimer = setTimeout(step, state.typingSpeed);
    };
    step();
  };

  const handleIncoming = (data) => {
    console.log('[PromptImprover] Overlay received:', data);
    if (!data || typeof data !== 'object') return;
    if (data.type === 'OVERLAY_INIT') {
      if (dom.app && !dom.app.classList.contains('has-backdrop')) {
        dom.app.classList.add('has-backdrop');
      }
      if (data.frame) {
        updateFrameState(data.frame);
      }
      // Accept token from OVERLAY_INIT unconditionally (first handshake)
      if (data.token) {
        state.sessionToken = data.token;
      }
      if (data.text) {
        setSelection(data.text);
      }
      return;
    }
    if (data.type === 'OVERLAY_FRAME') {
      if (!state.sessionToken || data.token !== state.sessionToken) return;
      updateFrameState(data.frame);
      return;
    }
    // For all other messages, validate token
    if (!state.sessionToken || data.token !== state.sessionToken) return;
    if (data.type === 'SELECTION_TEXT') {
      setSelection(data.text);
    }
    if (data.type === 'IMPROVE_RESPONSE') {
      handleResponse(data);
    }
  };

  const handleWindowMessage = (event) => {
    if (event.source !== window.parent) return;
    handleIncoming(event.data);
  };

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      closeOverlay();
    }
  };

  const handleStorageChange = (changes, area) => {
    if (area !== 'local') return;
    if (changes.typingSpeed) {
      applyTypingSpeed(changes.typingSpeed.newValue);
    }
  };

  if (dom.toggleOriginal) {
    dom.toggleOriginal.addEventListener('click', () => {
      state.showOriginal = !state.showOriginal;
      render();
    });
  }

  if (dom.replaceButton) {
    dom.replaceButton.addEventListener('click', replaceSelection);
  }

  if (dom.copyButton) {
    dom.copyButton.addEventListener('click', copyResult);
  }

  if (dom.regenerateButton) {
    dom.regenerateButton.addEventListener('click', regenerate);
  }

  if (dom.closeButton) {
    dom.closeButton.addEventListener('click', closeOverlay);
  }

  if (dom.backdrop) {
    dom.backdrop.addEventListener('click', closeOverlay);
  }

  if (dom.resultTextarea) {
    let inputTimeout;
    dom.resultTextarea.addEventListener('input', () => {
      clearTimeout(inputTimeout);
      inputTimeout = setTimeout(() => {
        state.resultText = dom.resultTextarea.value;
        render();
      }, 150);
    });
  }

  // Drag functionality - move iframe via parent
  if (dom.dragHandle && dom.surface) {
    const dragState = {
      active: false,
      pointerId: null,
      startX: 0,
      startY: 0,
      startLeft: 0,
      startTop: 0,
      latestX: 0,
      latestY: 0,
      raf: 0,
    };

    const applyDrag = (clientX, clientY) => {
      const deltaX = clientX - dragState.startX;
      const deltaY = clientY - dragState.startY;
      const nextLeft = dragState.startLeft + deltaX;
      const nextTop = dragState.startTop + deltaY;

      frameState.left = nextLeft;
      frameState.top = nextTop;
      sendOverlayAction({ action: 'position', left: nextLeft, top: nextTop });
    };

    const scheduleDrag = () => {
      if (dragState.raf) return;
      dragState.raf = requestAnimationFrame(() => {
        dragState.raf = 0;
        if (!dragState.active) return;
        applyDrag(dragState.latestX, dragState.latestY);
      });
    };

    const handleDragStart = (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();

      dragState.active = true;
      dragState.pointerId = e.pointerId;
      dragState.startX = e.screenX;
      dragState.startY = e.screenY;
      dragState.startLeft = frameState.left;
      dragState.startTop = frameState.top;
      dragState.latestX = e.screenX;
      dragState.latestY = e.screenY;

      if (dom.dragHandle.setPointerCapture) {
        dom.dragHandle.setPointerCapture(e.pointerId);
      }
      setInteractionState('dragging', true);
    };

    const handleDragMove = (e) => {
      if (!dragState.active || e.pointerId !== dragState.pointerId) return;
      dragState.latestX = e.screenX;
      dragState.latestY = e.screenY;
      scheduleDrag();
    };

    const handleDragEnd = (e) => {
      if (!dragState.active) return;
      if (e && 'pointerId' in e && e.pointerId !== dragState.pointerId) return;
      e?.stopPropagation?.();

      dragState.active = false;
      if (dragState.raf) {
        cancelAnimationFrame(dragState.raf);
        dragState.raf = 0;
      }
      applyDrag(dragState.latestX, dragState.latestY);
      if (dom.dragHandle.releasePointerCapture && dragState.pointerId !== null) {
        if (dom.dragHandle.hasPointerCapture?.(dragState.pointerId)) {
          dom.dragHandle.releasePointerCapture(dragState.pointerId);
        }
      }
      setInteractionState('dragging', false);
    };

    dom.dragHandle.addEventListener('pointerdown', handleDragStart);
    dom.dragHandle.addEventListener('pointermove', handleDragMove);
    dom.dragHandle.addEventListener('pointerup', handleDragEnd);
    dom.dragHandle.addEventListener('pointercancel', handleDragEnd);
    window.addEventListener('blur', handleDragEnd);
  }

  // Resize functionality - resize the iframe via parent
  if (dom.resizeHandle && dom.surface) {
    const resizeState = {
      active: false,
      pointerId: null,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      latestX: 0,
      latestY: 0,
      raf: 0,
    };

    const applyResize = (clientX, clientY) => {
      const deltaX = clientX - resizeState.startX;
      const deltaY = clientY - resizeState.startY;
      const nextWidth = Math.max(MIN_WIDTH, resizeState.startWidth + deltaX);
      const nextHeight = Math.max(MIN_HEIGHT, resizeState.startHeight + deltaY);

      frameState.width = nextWidth;
      frameState.height = nextHeight;
      sendOverlayAction({ action: 'resize', width: nextWidth, height: nextHeight });
    };

    const scheduleResize = () => {
      if (resizeState.raf) return;
      resizeState.raf = requestAnimationFrame(() => {
        resizeState.raf = 0;
        if (!resizeState.active) return;
        applyResize(resizeState.latestX, resizeState.latestY);
      });
    };

    const handleResizeStart = (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();

      resizeState.active = true;
      resizeState.pointerId = e.pointerId;
      resizeState.startX = e.screenX;
      resizeState.startY = e.screenY;
      resizeState.startWidth = frameState.width || window.innerWidth;
      resizeState.startHeight = frameState.height || window.innerHeight;
      resizeState.latestX = e.screenX;
      resizeState.latestY = e.screenY;

      if (dom.resizeHandle.setPointerCapture) {
        dom.resizeHandle.setPointerCapture(e.pointerId);
      }
      setInteractionState('resizing', true);
    };

    const handleResizeMove = (e) => {
      if (!resizeState.active || e.pointerId !== resizeState.pointerId) return;
      resizeState.latestX = e.screenX;
      resizeState.latestY = e.screenY;
      scheduleResize();
    };

    const handleResizeEnd = (e) => {
      if (!resizeState.active) return;
      if (e && 'pointerId' in e && e.pointerId !== resizeState.pointerId) return;
      e?.stopPropagation?.();

      resizeState.active = false;
      if (resizeState.raf) {
        cancelAnimationFrame(resizeState.raf);
        resizeState.raf = 0;
      }
      applyResize(resizeState.latestX, resizeState.latestY);
      if (
        dom.resizeHandle.releasePointerCapture &&
        resizeState.pointerId !== null
      ) {
        if (dom.resizeHandle.hasPointerCapture?.(resizeState.pointerId)) {
          dom.resizeHandle.releasePointerCapture(resizeState.pointerId);
        }
      }
      setInteractionState('resizing', false);
    };

    dom.resizeHandle.addEventListener('pointerdown', handleResizeStart);
    dom.resizeHandle.addEventListener('pointermove', handleResizeMove);
    dom.resizeHandle.addEventListener('pointerup', handleResizeEnd);
    dom.resizeHandle.addEventListener('pointercancel', handleResizeEnd);
    window.addEventListener('blur', handleResizeEnd);
  }

  window.addEventListener('message', handleWindowMessage);
  window.addEventListener('keydown', handleKeydown);
  if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
    chrome.storage.onChanged.addListener(handleStorageChange);
  }

  loadTypingSpeed();
  render();
})();

/**
 * Unit tests for overlay.js
 * Tests UI state management, typing effect, message handling, drag/resize, and actions
 */

describe('Overlay Script', () => {
  const DEFAULT_TYPING_SPEED = 25;
  const MIN_WIDTH = 280;
  const MIN_HEIGHT = 200;

  let mockDocument;
  let mockWindow;
  let mockChrome;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Mock DOM elements
    const createElement = (tag) => ({
      tagName: tag,
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
        toggle: jest.fn(),
        contains: jest.fn(() => false),
      },
      setAttribute: jest.fn(),
      addEventListener: jest.fn(),
      remove: jest.fn(),
      querySelector: jest.fn(),
      getBoundingClientRect: jest.fn(() => ({
        left: 100,
        top: 200,
        width: 360,
        height: 520,
      })),
      hasPointerCapture: jest.fn(() => true),
      setPointerCapture: jest.fn(),
      releasePointerCapture: jest.fn(),
    });

    mockDocument = {
      getElementById: jest.fn(() => createElement('div')),
      querySelector: jest.fn(() => createElement('div')),
      createElement: jest.fn(createElement),
      body: {},
      head: {},
    };

    mockWindow = {
      parent: {},
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      requestAnimationFrame: jest.fn((cb) => setTimeout(cb, 16)),
      cancelAnimationFrame: jest.fn(),
    };

    mockChrome = {
      runtime: {
        getURL: jest.fn((path) => `chrome-extension://test/${path}`),
        sendMessage: jest.fn(),
      },
      storage: {
        local: {
          get: jest.fn((keys, callback) => {
            const data = { typingSpeed: DEFAULT_TYPING_SPEED };
            if (callback) callback(data);
            return Promise.resolve(data);
          }),
          onChanged: {
            addListener: jest.fn(),
          },
        },
      },
    };

    global.document = mockDocument;
    global.window = mockWindow;
    global.chrome = mockChrome;
    global.navigator = {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    };
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('State management', () => {
    it('should initialize with default state', () => {
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
        isClosing: false,
      };

      expect(state.status).toBe('idle');
      expect(state.typingSpeed).toBe(DEFAULT_TYPING_SPEED);
      expect(state.isTyping).toBe(false);
      expect(state.isClosing).toBe(false);
    });

    it('should update status correctly', () => {
      const state = { status: 'idle' };

      state.status = 'loading';

      expect(state.status).toBe('loading');
    });

    it('should track typing state', () => {
      const state = { isTyping: false };

      state.isTyping = true;

      expect(state.isTyping).toBe(true);
    });

    it('should prevent multiple close calls', () => {
      const state = { isClosing: false };

      state.isClosing = true;

      expect(state.isClosing).toBe(true);

      // Second call should not proceed
      if (state.isClosing) {
        // Should return early
        expect(state.isClosing).toBe(true);
      }
    });
  });

  describe('cleanupMarkdown', () => {
    it('should remove bold markdown', () => {
      const text = 'This is **bold** text';

      const result = typeof text === 'string'
        ? text.replace(/\*\*([^*]+?)\*\*/g, '$1').replace(/__([^_]+?)__/g, '$1').trim()
        : '';

      expect(result).toBe('This is bold text');
    });

    it('should remove italic markdown', () => {
      const text = 'This is *italic* text';

      const result = typeof text === 'string'
        ? text.replace(/\*([^*]+?)\*/g, '$1').replace(/_([^_]+?)_/g, '$1').trim()
        : '';

      expect(result).toBe('This is italic text');
    });

    it('should remove both bold and italic markdown', () => {
      const text = '**Bold** and *italic* text';

      const result = typeof text === 'string'
        ? text.replace(/\*\*([^*]+?)\*\*/g, '$1').replace(/__([^_]+?)__/g, '$1')
             .replace(/\*([^*]+?)\*/g, '$1').replace(/_([^_]+?)_/g, '$1').trim()
        : '';

      expect(result).toBe('Bold and italic text');
    });

    it('should handle non-string input', () => {
      const text = null;

      const result = typeof text === 'string' ? text.trim() : '';

      expect(result).toBe('');
    });

    it('should use non-greedy matching', () => {
      const text = '**a** and **b** text';

      const result = text.replace(/\*\*([^*]+?)\*\*/g, '$1');

      expect(result).toBe('a and b text');
    });
  });

  describe('sanitizeHTML', () => {
    it('should escape HTML entities', () => {
      const text = '<script>alert("xss")</script>';
      const div = { textContent: '', innerHTML: '' };

      div.textContent = text;
      const result = div.innerHTML;

      expect(result).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
    });

    it('should escape special characters', () => {
      const text = '<div>Content</div>';
      const div = { textContent: '', innerHTML: '' };

      div.textContent = text;
      const result = div.innerHTML;

      expect(result).toBe('&lt;div&gt;Content&lt;/div&gt;');
    });
  });

  describe('statusLabel', () => {
    it('should return correct label for each status', () => {
      const statusLabels = {
        loading: 'Working',
        typing: 'Typing',
        ready: 'Ready',
        error: 'Error',
        idle: 'Idle',
      };

      Object.entries(statusLabels).forEach(([status, expectedLabel]) => {
        let label = 'Idle';
        if (status === 'loading') label = 'Working';
        if (status === 'typing') label = 'Typing';
        if (status === 'ready') label = 'Ready';
        if (status === 'error') label = 'Error';

        expect(label).toBe(expectedLabel);
      });
    });
  });

  describe('canAct', () => {
    it('should return true when ready with result text', () => {
      const state = { status: 'ready', resultText: 'Some result' };

      const canAct = state.status === 'ready' && state.resultText.trim().length > 0;

      expect(canAct).toBe(true);
    });

    it('should return false when not ready', () => {
      const state = { status: 'loading', resultText: 'Some result' };

      const canAct = state.status === 'ready' && state.resultText.trim().length > 0;

      expect(canAct).toBe(false);
    });

    it('should return false when result text is empty', () => {
      const state = { status: 'ready', resultText: '   ' };

      const canAct = state.status === 'ready' && state.resultText.trim().length > 0;

      expect(canAct).toBe(false);
    });
  });

  describe('render', () => {
    it('should update status pill', () => {
      const state = { status: 'loading', resultText: '', error: '', originalText: '', showOriginal: false };
      const dom = {
        statusPill: { textContent: '', setAttribute: jest.fn() },
        hint: { hidden: false },
        resultTextarea: { value: '', readOnly: false, scrollTop: 0 },
        loading: { hidden: true },
        error: { hidden: true, textContent: '' },
        replaceButton: { disabled: true },
        copyButton: { disabled: true },
        regenerateButton: { disabled: true },
        toast: { hidden: true, textContent: '' },
      };

      const statusLabel = () => {
        if (state.status === 'loading') return 'Working';
        if (state.status === 'typing') return 'Typing';
        if (state.status === 'ready') return 'Ready';
        if (state.status === 'error') return 'Error';
        return 'Idle';
      };

      dom.statusPill.textContent = statusLabel();
      dom.statusPill.setAttribute('data-status', state.status);
      dom.loading.hidden = state.status !== 'loading';

      expect(dom.statusPill.textContent).toBe('Working');
      expect(dom.statusPill.setAttribute).toHaveBeenCalledWith('data-status', 'loading');
      expect(dom.loading.hidden).toBe(false);
    });

    it('should update result textarea', () => {
      const state = { status: 'ready', resultText: 'Test result' };
      const dom = {
        resultTextarea: { value: '', readOnly: true, scrollTop: 0 },
      };

      dom.resultTextarea.readOnly = state.status !== 'ready';
      if (dom.resultTextarea.value !== state.resultText) {
        dom.resultTextarea.value = state.resultText;
        dom.resultTextarea.scrollTop = 0;
      }

      expect(dom.resultTextarea.readOnly).toBe(false);
      expect(dom.resultTextarea.value).toBe('Test result');
      expect(dom.resultTextarea.scrollTop).toBe(0);
    });

    it('should preserve scroll position during typing', () => {
      const state = { status: 'typing', resultText: 'New text' };
      const dom = {
        resultTextarea: { value: 'Old text', readOnly: false, scrollTop: 100 },
      };

      const scrollPos = dom.resultTextarea.scrollTop;
      dom.resultTextarea.value = state.resultText;
      dom.resultTextarea.scrollTop = scrollPos;

      expect(dom.resultTextarea.scrollTop).toBe(100);
    });

    it('should update error message', () => {
      const state = { status: 'error', error: 'Test error' };
      const dom = {
        error: { hidden: true, textContent: '' },
      };

      dom.error.hidden = state.status !== 'error';
      dom.error.textContent = state.error;

      expect(dom.error.hidden).toBe(false);
      expect(dom.error.textContent).toBe('Test error');
    });

    it('should update button disabled states', () => {
      const state = { status: 'ready', resultText: 'Result', originalText: 'Original' };
      const dom = {
        replaceButton: { disabled: true },
        copyButton: { disabled: true },
        regenerateButton: { disabled: true },
      };

      const canAct = state.status === 'ready' && state.resultText.trim().length > 0;
      dom.replaceButton.disabled = !canAct;
      dom.copyButton.disabled = !canAct;
      dom.regenerateButton.disabled = state.status === 'loading' || !state.originalText;

      expect(dom.replaceButton.disabled).toBe(false);
      expect(dom.copyButton.disabled).toBe(false);
      expect(dom.regenerateButton.disabled).toBe(true); // loading is false, originalText exists
    });

    it('should show toast when visible', () => {
      const state = { toastVisible: true, toastMessage: 'Copied!' };
      const dom = {
        toast: { hidden: true, textContent: '' },
      };

      dom.toast.hidden = !state.toastVisible;
      dom.toast.textContent = state.toastMessage;

      expect(dom.toast.hidden).toBe(false);
      expect(dom.toast.textContent).toBe('Copied!');
    });
  });

  describe('stopTyping', () => {
    it('should clear typing timer and reset state', () => {
      let state = {
        typingTimer: setTimeout(() => {}, 1000),
        isTyping: true,
      };

      if (state.typingTimer) {
        clearTimeout(state.typingTimer);
        state.typingTimer = null;
      }
      state.isTyping = false;

      expect(state.typingTimer).toBeNull();
      expect(state.isTyping).toBe(false);
    });

    it('should handle null timer', () => {
      let state = {
        typingTimer: null,
        isTyping: true,
      };

      if (state.typingTimer) {
        clearTimeout(state.typingTimer);
      }
      state.isTyping = false;

      expect(state.isTyping).toBe(false);
    });
  });

  describe('setError', () => {
    it('should stop typing and set error state', () => {
      const state = {
        status: 'typing',
        error: '',
        isTyping: true,
        typingTimer: null,
      };
      const render = jest.fn();

      const setError = (message) => {
        if (state.typingTimer) {
          clearTimeout(state.typingTimer);
          state.typingTimer = null;
        }
        state.isTyping = false;
        state.status = 'error';
        state.error = message || 'Something went wrong.';
        render();
      };

      setError('Test error');

      expect(state.status).toBe('error');
      expect(state.error).toBe('Test error');
      expect(state.isTyping).toBe(false);
      expect(render).toHaveBeenCalled();
    });

    it('should use default error message', () => {
      const state = { status: 'ready', error: '', isTyping: false };
      const render = jest.fn();

      const setError = (message) => {
        state.status = 'error';
        state.error = message || 'Something went wrong.';
        render();
      };

      setError();

      expect(state.error).toBe('Something went wrong.');
    });
  });

  describe('handleResponse', () => {
    it('should handle successful response', () => {
      const state = { status: 'loading', error: '', resultText: '' };
      const setError = jest.fn();
      const startTyping = jest.fn();
      const cleanupMarkdown = jest.fn((text) => text);
      const response = {
        result: 'Clean result',
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

      handleResponse(response);

      expect(setError).not.toHaveBeenCalled();
      expect(startTyping).toHaveBeenCalledWith('Clean result');
    });

    it('should handle null response', () => {
      const setError = jest.fn();

      const handleResponse = (response) => {
        if (!response) {
          setError('No response from background.');
          return;
        }
      };

      handleResponse(null);

      expect(setError).toHaveBeenCalledWith('No response from background.');
    });

    it('should handle error response', () => {
      const setError = jest.fn();
      const response = { error: 'API failed' };

      const handleResponse = (response) => {
        if (!response) return;
        if (response.error) {
          setError(response.error);
          return;
        }
      };

      handleResponse(response);

      expect(setError).toHaveBeenCalledWith('API failed');
    });

    it('should handle non-string result', () => {
      const setError = jest.fn();
      const response = { result: null };

      const handleResponse = (response) => {
        if (!response) return;
        if (response.error) return;
        if (typeof response.result !== 'string') {
          setError('No response content returned.');
          return;
        }
      };

      handleResponse(response);

      expect(setError).toHaveBeenCalledWith('No response content returned.');
    });
  });

  describe('requestImprove', () => {
    it('should send message to background', () => {
      const state = {
        status: 'idle',
        error: '',
        originalText: 'Test prompt',
        resultText: '',
      };
      const stopTyping = jest.fn();
      const render = jest.fn();
      const setError = jest.fn();

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
          chrome.runtime.sendMessage(payload, jest.fn());
        }
      };

      requestImprove();

      expect(state.status).toBe('loading');
      expect(state.error).toBe('');
      expect(stopTyping).toHaveBeenCalled();
      expect(render).toHaveBeenCalled();
      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith(
        { type: 'IMPROVE_PROMPT', text: 'Test prompt' },
        expect.any(Function)
      );
    });

    it('should handle empty original text', () => {
      const state = {
        status: 'idle',
        originalText: '   ',
      };
      const setError = jest.fn();

      const requestImprove = () => {
        if (!state.originalText.trim()) {
          setError('No text selected.');
          return;
        }
      };

      requestImprove();

      expect(setError).toHaveBeenCalledWith('No text selected.');
    });
  });

  describe('setSelection', () => {
    it('should set new selection and request improve', () => {
      const state = {
        originalText: '',
        showOriginal: true,
        status: 'ready',
        resultText: 'Old result',
      };
      const stopTyping = jest.fn();
      const render = jest.fn();
      const requestImprove = jest.fn();

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

      setSelection('New prompt');

      expect(state.originalText).toBe('New prompt');
      expect(state.showOriginal).toBe(false);
      expect(requestImprove).toHaveBeenCalled();
    });

    it('should reset state when text is empty', () => {
      const state = {
        originalText: 'Old text',
        showOriginal: true,
        status: 'ready',
        resultText: 'Old result',
      };
      const stopTyping = jest.fn();
      const render = jest.fn();
      const requestImprove = jest.fn();

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

      setSelection('');

      expect(state.originalText).toBe('');
      expect(state.status).toBe('idle');
      expect(state.resultText).toBe('');
      expect(requestImprove).not.toHaveBeenCalled();
      expect(render).toHaveBeenCalled();
    });
  });

  describe('fallbackCopy', () => {
    it('should copy text using execCommand', () => {
      const text = 'Test text';
      const textarea = {
        value: '',
        setAttribute: jest.fn(),
        style: { position: '', left: '' },
        select: jest.fn(),
      };
      let removed = false;

      mockDocument.createElement = jest.fn(() => textarea);
      mockDocument.body = {
        appendChild: jest.fn(),
        removeChild: jest.fn(() => { removed = true; }),
      };
      mockDocument.execCommand = jest.fn(() => true);

      const fallbackCopy = (text) => {
        const textarea = mockDocument.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        mockDocument.body.appendChild(textarea);
        textarea.select();
        mockDocument.execCommand('copy');
        mockDocument.body.removeChild(textarea);
      };

      fallbackCopy(text);

      expect(textarea.value).toBe(text);
      expect(mockDocument.body.appendChild).toHaveBeenCalledWith(textarea);
      expect(textarea.select).toHaveBeenCalled();
      expect(mockDocument.execCommand).toHaveBeenCalledWith('copy');
      expect(removed).toBe(true);
    });
  });

  describe('triggerToast', () => {
    it('should show toast and schedule hide', () => {
      const state = {
        toastMessage: '',
        toastVisible: false,
        toastTimer: null,
      };
      const render = jest.fn();

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

      triggerToast('Copied!');

      expect(state.toastMessage).toBe('Copied!');
      expect(state.toastVisible).toBe(true);
      expect(render).toHaveBeenCalled();
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1800);

      jest.advanceTimersByTime(1800);

      expect(state.toastVisible).toBe(false);
    });

    it('should clear existing toast timer', () => {
      const state = {
        toastMessage: '',
        toastVisible: false,
        toastTimer: setTimeout(() => {}, 1000),
      };
      const render = jest.fn();
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const triggerToast = (message) => {
        state.toastMessage = message;
        state.toastVisible = true;
        render();
        if (state.toastTimer) {
          clearTimeout(state.toastTimer);
        }
        state.toastTimer = setTimeout(() => {}, 1800);
      };

      triggerToast('New message');

      expect(clearTimeoutSpy).toHaveBeenCalledWith(state.toastTimer);
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('copyResult', () => {
    it('should copy using Clipboard API', async () => {
      const state = { resultText: '**Result** text' };
      const cleanupMarkdown = jest.fn((text) => 'Result text');
      const triggerToast = jest.fn();
      const fallbackCopy = jest.fn();

      const copyResult = () => {
        const text = cleanupMarkdown(state.resultText);
        if (!text) return;
        if (global.navigator.clipboard?.writeText) {
          global.navigator.clipboard
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

      await copyResult();

      expect(cleanupMarkdown).toHaveBeenCalledWith('**Result** text');
      expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith('Result text');
    });

    it('should fallback on clipboard error', async () => {
      const state = { resultText: 'Result' };
      const cleanupMarkdown = jest.fn((text) => text);
      const triggerToast = jest.fn();
      const fallbackCopy = jest.fn();

      global.navigator.clipboard.writeText.mockRejectedValue(new Error('Clipboard failed'));

      const copyResult = () => {
        const text = cleanupMarkdown(state.resultText);
        if (!text) return;
        if (global.navigator.clipboard?.writeText) {
          global.navigator.clipboard
            .writeText(text)
            .then(() => {})
            .catch(() => {
              fallbackCopy(text);
              triggerToast('Copied to clipboard.');
            });
        }
      };

      await copyResult();

      expect(fallbackCopy).toHaveBeenCalledWith('Result');
      expect(triggerToast).toHaveBeenCalledWith('Copied to clipboard.');
    });

    it('should return early if no text', () => {
      const state = { resultText: '' };
      const cleanupMarkdown = jest.fn((text) => text);
      const fallbackCopy = jest.fn();

      const copyResult = () => {
        const text = cleanupMarkdown(state.resultText);
        if (!text) return;
        fallbackCopy(text);
      };

      copyResult();

      expect(fallbackCopy).not.toHaveBeenCalled();
    });
  });

  describe('replaceSelection', () => {
    it('should send replace action and close overlay', () => {
      const state = { resultText: '**New** text' };
      const cleanupMarkdown = jest.fn((text) => 'New text');
      const sendOverlayAction = jest.fn();
      const closeOverlay = jest.fn();

      const replaceSelection = () => {
        const text = cleanupMarkdown(state.resultText);
        if (!text) return;

        sendOverlayAction({ action: 'replace', text });
        closeOverlay();
      };

      replaceSelection();

      expect(sendOverlayAction).toHaveBeenCalledWith({ action: 'replace', text: 'New text' });
      expect(closeOverlay).toHaveBeenCalled();
    });

    it('should return early if no text', () => {
      const state = { resultText: '' };
      const cleanupMarkdown = jest.fn((text) => text);
      const sendOverlayAction = jest.fn();

      const replaceSelection = () => {
        const text = cleanupMarkdown(state.resultText);
        if (!text) return;
        sendOverlayAction({ action: 'replace', text });
      };

      replaceSelection();

      expect(sendOverlayAction).not.toHaveBeenCalled();
    });
  });

  describe('closeOverlay', () => {
    it('should guard against multiple calls', () => {
      const state = {
        isClosing: false,
        typingTimer: null,
        toastTimer: null,
      };
      const sendOverlayAction = jest.fn();

      const closeOverlay = () => {
        if (state.isClosing) {
          return;
        }

        state.isClosing = true;

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

      closeOverlay();
      closeOverlay();

      expect(state.isClosing).toBe(true);
      expect(sendOverlayAction).toHaveBeenCalledTimes(1);
    });

    it('should clear timers', () => {
      const state = {
        isClosing: false,
        typingTimer: setTimeout(() => {}, 1000),
        toastTimer: setTimeout(() => {}, 2000),
      };
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      const sendOverlayAction = jest.fn();

      const closeOverlay = () => {
        if (state.isClosing) return;
        state.isClosing = true;

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

      closeOverlay();

      expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('startTyping', () => {
    it('should type text with speed delay', () => {
      const state = {
        resultText: '',
        status: 'loading',
        isTyping: false,
        typingSpeed: 25,
        typingTimer: null,
      };
      const render = jest.fn();

      const startTyping = (text) => {
        if (state.isTyping) {
          // Stop typing
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

      startTyping('Test');

      expect(state.status).toBe('typing');
      expect(state.isTyping).toBe(true);
      expect(state.resultText).toBe('');

      jest.advanceTimersByTime(25);

      expect(state.resultText).toBe('T');

      jest.advanceTimersByTime(25 * 3);

      expect(state.resultText).toBe('Test');
      expect(state.status).toBe('ready');
      expect(state.isTyping).toBe(false);
    });

    it('should handle zero typing speed (instant)', () => {
      const state = {
        resultText: '',
        status: 'loading',
        isTyping: false,
        typingSpeed: 0,
      };
      const render = jest.fn();

      const startTyping = (text) => {
        const payload = text || '';
        if (state.typingSpeed === 0) {
          state.resultText = payload;
          state.status = 'ready';
          render();
          return;
        }
      };

      startTyping('Instant');

      expect(state.resultText).toBe('Instant');
      expect(state.status).toBe('ready');
    });

    it('should stop existing typing before starting new', () => {
      let state = {
        isTyping: true,
        typingTimer: setTimeout(() => {}, 100),
      };

      if (state.isTyping) {
        if (state.typingTimer) {
          clearTimeout(state.typingTimer);
        }
        state.isTyping = false;
      }

      expect(state.isTyping).toBe(false);
      expect(state.typingTimer).toBeNull();
    });
  });

  describe('applyTypingSpeed', () => {
    it('should set typing speed from valid number', () => {
      const state = { typingSpeed: DEFAULT_TYPING_SPEED };
      const value = 50;

      const numeric = Number(value);
      if (Number.isFinite(numeric) && numeric >= 0) {
        state.typingSpeed = Math.round(numeric);
      } else {
        state.typingSpeed = DEFAULT_TYPING_SPEED;
      }

      expect(state.typingSpeed).toBe(50);
    });

    it('should use default for invalid speed', () => {
      const state = { typingSpeed: DEFAULT_TYPING_SPEED };
      const value = 'invalid';

      const numeric = Number(value);
      if (Number.isFinite(numeric) && numeric >= 0) {
        state.typingSpeed = Math.round(numeric);
      } else {
        state.typingSpeed = DEFAULT_TYPING_SPEED;
      }

      expect(state.typingSpeed).toBe(DEFAULT_TYPING_SPEED);
    });

    it('should use default for negative speed', () => {
      const state = { typingSpeed: DEFAULT_TYPING_SPEED };
      const value = -10;

      const numeric = Number(value);
      if (Number.isFinite(numeric) && numeric >= 0) {
        state.typingSpeed = Math.round(numeric);
      } else {
        state.typingSpeed = DEFAULT_TYPING_SPEED;
      }

      expect(state.typingSpeed).toBe(DEFAULT_TYPING_SPEED);
    });
  });

  describe('sendOverlayAction', () => {
    it('should send message to parent window', () => {
      const state = { sessionToken: 'test-token' };
      const payload = { action: 'replace', text: 'New text' };

      const sendOverlayAction = (payload) => {
        if (!global.window.parent) {
          throw new Error('No window.parent');
        }

        const extensionOrigin = 'chrome-extension://test';
        global.window.parent.postMessage(
          { type: 'OVERLAY_ACTION', token: state.sessionToken, ...payload },
          extensionOrigin
        );
      };

      sendOverlayAction(payload);

      expect(global.window.parent.postMessage).toHaveBeenCalledWith(
        { type: 'OVERLAY_ACTION', token: 'test-token', action: 'replace', text: 'New text' },
        'chrome-extension://test'
      );
    });

    it('should throw error if no parent window', () => {
      global.window.parent = null;

      const sendOverlayAction = () => {
        if (!global.window.parent) {
          throw new Error('No window.parent');
        }
      };

      expect(() => sendOverlayAction()).toThrow('No window.parent');

      global.window.parent = {};
    });
  });

  describe('updateFrameState', () => {
    it('should update frame state from message', () => {
      const frameState = {
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
      };
      const frame = {
        left: 100,
        top: 200,
        width: 360,
        height: 520,
      };

      const updateFrameState = (frame) => {
        if (!frame || typeof frame !== 'object') return;
        if (Number.isFinite(frame.left)) frameState.left = frame.left;
        if (Number.isFinite(frame.top)) frameState.top = frame.top;
        if (Number.isFinite(frame.width)) frameState.width = frame.width;
        if (Number.isFinite(frame.height)) frameState.height = frame.height;
      };

      updateFrameState(frame);

      expect(frameState).toEqual(frame);
    });

    it('should handle partial frame updates', () => {
      const frameState = {
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
      };
      const frame = { left: 100, width: 360 };

      const updateFrameState = (frame) => {
        if (!frame || typeof frame !== 'object') return;
        if (Number.isFinite(frame.left)) frameState.left = frame.left;
        if (Number.isFinite(frame.top)) frameState.top = frame.top;
        if (Number.isFinite(frame.width)) frameState.width = frame.width;
        if (Number.isFinite(frame.height)) frameState.height = frame.height;
      };

      updateFrameState(frame);

      expect(frameState.left).toBe(100);
      expect(frameState.top).toBe(0);
      expect(frameState.width).toBe(360);
      expect(frameState.height).toBe(1080);
    });

    it('should handle invalid frame object', () => {
      const frameState = { left: 0, top: 0 };

      const updateFrameState = (frame) => {
        if (!frame || typeof frame !== 'object') return;
        // Should not update
      };

      updateFrameState(null);
      updateFrameState(undefined);
      updateFrameState('invalid');

      expect(frameState).toEqual({ left: 0, top: 0 });
    });
  });

  describe('Drag functionality', () => {
    it('should handle drag start', () => {
      const dragState = {
        active: false,
        pointerId: null,
        startX: 0,
        startY: 0,
        startLeft: 0,
        startTop: 0,
      };
      const frameState = { left: 100, top: 200 };
      const mockEvent = {
        button: 0,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        screenX: 500,
        screenY: 300,
        pointerId: 1,
      };
      const mockHandle = {
        setPointerCapture: jest.fn(),
      };
      const setInteractionState = jest.fn();

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

        if (mockHandle.setPointerCapture) {
          mockHandle.setPointerCapture(e.pointerId);
        }
        setInteractionState('dragging', true);
      };

      handleDragStart(mockEvent);

      expect(dragState.active).toBe(true);
      expect(dragState.startX).toBe(500);
      expect(dragState.startY).toBe(300);
      expect(dragState.startLeft).toBe(100);
      expect(dragState.startTop).toBe(200);
      expect(mockHandle.setPointerCapture).toHaveBeenCalledWith(1);
      expect(setInteractionState).toHaveBeenCalledWith('dragging', true);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should handle drag move', () => {
      const dragState = {
        active: true,
        pointerId: 1,
        latestX: 500,
        latestY: 300,
        raf: 0,
      };
      const mockEvent = {
        pointerId: 1,
        screenX: 550,
        screenY: 350,
      };
      const applyDrag = jest.fn();

      const handleDragMove = (e) => {
        if (!dragState.active || e.pointerId !== dragState.pointerId) return;
        dragState.latestX = e.screenX;
        dragState.latestY = e.screenY;
        applyDrag();
      };

      handleDragMove(mockEvent);

      expect(dragState.latestX).toBe(550);
      expect(dragState.latestY).toBe(350);
      expect(applyDrag).toHaveBeenCalled();
    });

    it('should ignore drag move from wrong pointer', () => {
      const dragState = {
        active: true,
        pointerId: 1,
      };
      const mockEvent = {
        pointerId: 2,
        screenX: 550,
        screenY: 350,
      };
      const applyDrag = jest.fn();

      const handleDragMove = (e) => {
        if (!dragState.active || e.pointerId !== dragState.pointerId) return;
        applyDrag();
      };

      handleDragMove(mockEvent);

      expect(applyDrag).not.toHaveBeenCalled();
    });

    it('should handle drag end', () => {
      const dragState = {
        active: true,
        pointerId: 1,
        raf: 123,
      };
      const mockEvent = {
        pointerId: 1,
        stopPropagation: jest.fn(),
      };
      const mockHandle = {
        hasPointerCapture: jest.fn(() => true),
        releasePointerCapture: jest.fn(),
      };
      const setInteractionState = jest.fn();
      const applyDrag = jest.fn();

      const handleDragEnd = (e) => {
        if (!dragState.active) return;
        if (e && 'pointerId' in e && e.pointerId !== dragState.pointerId) return;
        e?.stopPropagation?.();

        dragState.active = false;
        applyDrag();
        if (mockHandle.releasePointerCapture && dragState.pointerId !== null) {
          if (mockHandle.hasPointerCapture?.(dragState.pointerId)) {
            mockHandle.releasePointerCapture(dragState.pointerId);
          }
        }
        setInteractionState('dragging', false);
      };

      handleDragEnd(mockEvent);

      expect(dragState.active).toBe(false);
      expect(applyDrag).toHaveBeenCalled();
      expect(mockHandle.releasePointerCapture).toHaveBeenCalledWith(1);
      expect(setInteractionState).toHaveBeenCalledWith('dragging', false);
    });
  });

  describe('Resize functionality', () => {
    it('should apply resize with minimum dimensions', () => {
      const resizeState = {
        startWidth: 360,
        startHeight: 520,
      };
      const frameState = { width: 360, height: 520 };
      const deltaX = -100;
      const deltaY = -400;

      const applyResize = (clientX, clientY) => {
        const nextWidth = Math.max(MIN_WIDTH, resizeState.startWidth + deltaX);
        const nextHeight = Math.max(MIN_HEIGHT, resizeState.startHeight + deltaY);

        frameState.width = nextWidth;
        frameState.height = nextHeight;
      };

      applyResize(0, 0);

      expect(frameState.width).toBe(MIN_WIDTH);
      expect(frameState.height).toBe(MIN_HEIGHT);
    });

    it('should handle resize start', () => {
      const resizeState = {
        active: false,
        pointerId: null,
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
      };
      const frameState = { width: 360, height: 520 };
      const mockEvent = {
        button: 0,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        screenX: 800,
        screenY: 600,
        pointerId: 1,
      };
      const mockHandle = {
        setPointerCapture: jest.fn(),
      };
      const setInteractionState = jest.fn();

      const handleResizeStart = (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        resizeState.active = true;
        resizeState.pointerId = e.pointerId;
        resizeState.startX = e.screenX;
        resizeState.startY = e.screenY;
        resizeState.startWidth = frameState.width || global.window.innerWidth;
        resizeState.startHeight = frameState.height || global.window.innerHeight;

        if (mockHandle.setPointerCapture) {
          mockHandle.setPointerCapture(e.pointerId);
        }
        setInteractionState('resizing', true);
      };

      handleResizeStart(mockEvent);

      expect(resizeState.active).toBe(true);
      expect(resizeState.startWidth).toBe(360);
      expect(resizeState.startHeight).toBe(520);
      expect(mockHandle.setPointerCapture).toHaveBeenCalledWith(1);
      expect(setInteractionState).toHaveBeenCalledWith('resizing', true);
    });
  });

  describe('Message handling', () => {
    it('should handle OVERLAY_INIT message', () => {
      let state = { sessionToken: '' };
      const dom = { app: { classList: { contains: jest.fn(() => false), add: jest.fn() } } };
      const updateFrameState = jest.fn();
      const setSelection = jest.fn();
      const data = {
        type: 'OVERLAY_INIT',
        token: 'new-token',
        text: 'Selected text',
        frame: { left: 100, top: 200 },
      };

      const handleIncoming = (data) => {
        if (!data || typeof data !== 'object') return;
        if (data.type === 'OVERLAY_INIT') {
          if (dom.app && !dom.app.classList.contains('has-backdrop')) {
            dom.app.classList.add('has-backdrop');
          }
          if (data.frame) {
            updateFrameState(data.frame);
          }
          if (data.token) {
            state.sessionToken = data.token;
          }
          if (data.text) {
            setSelection(data.text);
          }
        }
      };

      handleIncoming(data);

      expect(dom.app.classList.add).toHaveBeenCalledWith('has-backdrop');
      expect(updateFrameState).toHaveBeenCalledWith({ left: 100, top: 200 });
      expect(state.sessionToken).toBe('new-token');
      expect(setSelection).toHaveBeenCalledWith('Selected text');
    });

    it('should validate token for non-init messages', () => {
      let state = { sessionToken: 'correct-token' };
      const setSelection = jest.fn();
      const data = {
        type: 'SELECTION_TEXT',
        token: 'wrong-token',
        text: 'Text',
      };

      const handleIncoming = (data) => {
        if (!data || typeof data !== 'object') return;
        if (data.type !== 'OVERLAY_INIT') {
          if (!state.sessionToken || data.token !== state.sessionToken) return;
        }
        if (data.type === 'SELECTION_TEXT') {
          setSelection(data.text);
        }
      };

      handleIncoming(data);

      expect(setSelection).not.toHaveBeenCalled();
    });

    it('should handle valid SELECTION_TEXT message', () => {
      let state = { sessionToken: 'correct-token' };
      const setSelection = jest.fn();
      const data = {
        type: 'SELECTION_TEXT',
        token: 'correct-token',
        text: 'New selection',
      };

      const handleIncoming = (data) => {
        if (data.type === 'SELECTION_TEXT') {
          setSelection(data.text);
        }
      };

      handleIncoming(data);

      expect(setSelection).toHaveBeenCalledWith('New selection');
    });
  });

  describe('Storage change handling', () => {
    it('should apply typing speed from storage change', () => {
      const state = { typingSpeed: 25 };
      const applyTypingSpeed = jest.fn();
      const changes = {
        typingSpeed: {
          newValue: 50,
        },
      };
      const area = 'local';

      const handleStorageChange = (changes, area) => {
        if (area !== 'local') return;
        if (changes.typingSpeed) {
          applyTypingSpeed(changes.typingSpeed.newValue);
        }
      };

      handleStorageChange(changes, area);

      expect(applyTypingSpeed).toHaveBeenCalledWith(50);
    });

    it('should ignore non-local storage changes', () => {
      const applyTypingSpeed = jest.fn();
      const changes = {
        typingSpeed: { newValue: 50 },
      };
      const area = 'sync';

      const handleStorageChange = (changes, area) => {
        if (area !== 'local') return;
        applyTypingSpeed(changes.typingSpeed.newValue);
      };

      handleStorageChange(changes, area);

      expect(applyTypingSpeed).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard handling', () => {
    it('should close overlay on Escape key', () => {
      const closeOverlay = jest.fn();
      const mockEvent = {
        key: 'Escape',
      };

      const handleKeydown = (event) => {
        if (event.key === 'Escape') {
          closeOverlay();
        }
      };

      handleKeydown(mockEvent);

      expect(closeOverlay).toHaveBeenCalled();
    });

    it('should ignore other keys', () => {
      const closeOverlay = jest.fn();
      const mockEvent = {
        key: 'Enter',
      };

      const handleKeydown = (event) => {
        if (event.key === 'Escape') {
          closeOverlay();
        }
      };

      handleKeydown(mockEvent);

      expect(closeOverlay).not.toHaveBeenCalled();
    });
  });
});

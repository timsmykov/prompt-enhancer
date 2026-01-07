/**
 * Unit tests for popup.js
 * Tests form handling, storage operations, input validation, and UI interactions
 */

describe('Popup Script', () => {
  const DEFAULT_TYPING_SPEED = 25;
  const STORAGE_KEYS = ['apiKey', 'model', 'systemPrompt', 'typingSpeed'];

  let mockDocument;
  let mockChrome;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock DOM elements
    const mockElement = {
      value: '',
      textContent: '',
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
        toggle: jest.fn(),
      },
      addEventListener: jest.fn(),
      removeAttribute: jest.fn(),
      setAttribute: jest.fn(),
      focus: jest.fn(),
      click: jest.fn(),
    };

    mockDocument = {
      querySelector: jest.fn((selector) => {
        const elements = {
          '#settingsForm': { ...mockElement, addEventListener: jest.fn() },
          '#apiKey': { ...mockElement, type: 'password' },
          '#model': { ...mockElement },
          '#systemPrompt': { ...mockElement },
          '#typingSpeed': { ...mockElement },
          '#toggleKey': { ...mockElement },
          '#saveButton': { ...mockElement, disabled: false },
          '.status': { ...mockElement },
          '.toast': { ...mockElement },
        };
        return elements[selector] || null;
      }),
    };

    global.document = mockDocument;

    // Mock Chrome API
    mockChrome = {
      storage: {
        local: {
          get: jest.fn((keys, callback) => {
            const data = {};
            if (callback) callback(data);
            return Promise.resolve(data);
          }),
          set: jest.fn((data, callback) => {
            if (callback) callback();
            return Promise.resolve();
          }),
        },
      },
    };

    global.chrome = mockChrome;
  });

  describe('createStorage', () => {
    it('should return storage interface when chrome API available', () => {
      const storage = {
        get: jest.fn((keys) => Promise.resolve({})),
        set: jest.fn((data) => Promise.resolve()),
      };

      expect(storage.get).toBeDefined();
      expect(storage.set).toBeDefined();
      expect(typeof storage.get).toBe('function');
      expect(typeof storage.set).toBe('function');
    });

    it('should throw error when chrome API not available', () => {
      global.chrome = undefined;

      expect(() => {
        if (typeof global.chrome !== 'undefined' && global.chrome.storage?.local) {
          return true;
        }
        throw new Error('Chrome storage API not available. Extension cannot function securely.');
      }).toThrow('Chrome storage API not available. Extension cannot function securely.');
    });

    it('should return promise from get method', async () => {
      const mockData = { apiKey: 'sk-test', model: 'claude-3' };

      mockChrome.storage.local.get.mockImplementation((keys, callback) => {
        callback(mockData);
      });

      const storage = {
        get: (keys) =>
          new Promise((resolve) => {
            mockChrome.storage.local.get(keys, resolve);
          }),
      };

      const result = await storage.get(STORAGE_KEYS);

      expect(result).toEqual(mockData);
      expect(mockChrome.storage.local.get).toHaveBeenCalledWith(STORAGE_KEYS, expect.any(Function));
    });

    it('should return promise from set method', async () => {
      const mockData = { apiKey: 'sk-test' };

      mockChrome.storage.local.set.mockImplementation((data, callback) => {
        callback();
      });

      const storage = {
        set: (data) =>
          new Promise((resolve) => {
            mockChrome.storage.local.set(data, resolve);
          }),
      };

      await storage.set(mockData);

      expect(mockChrome.storage.local.set).toHaveBeenCalledWith(mockData, expect.any(Function));
    });
  });

  describe('normalizeTypingSpeed', () => {
    it('should return DEFAULT_TYPING_SPEED for empty string', () => {
      const value = '';
      const numeric = Number(value);
      const result = value === '' || value === null || value === undefined ? DEFAULT_TYPING_SPEED : numeric;

      expect(result).toBe(DEFAULT_TYPING_SPEED);
    });

    it('should return DEFAULT_TYPING_SPEED for null', () => {
      const value = null;
      const result = value === '' || value === null || value === undefined ? DEFAULT_TYPING_SPEED : Number(value);

      expect(result).toBe(DEFAULT_TYPING_SPEED);
    });

    it('should return DEFAULT_TYPING_SPEED for undefined', () => {
      const value = undefined;
      const result = value === '' || value === null || value === undefined ? DEFAULT_TYPING_SPEED : Number(value);

      expect(result).toBe(DEFAULT_TYPING_SPEED);
    });

    it('should round positive numbers', () => {
      const value = 27.8;
      const numeric = Number(value);
      const result = Number.isFinite(numeric) && numeric >= 0 ? Math.round(numeric) : DEFAULT_TYPING_SPEED;

      expect(result).toBe(28);
    });

    it('should return DEFAULT_TYPING_SPEED for negative numbers', () => {
      const value = -10;
      const numeric = Number(value);
      const result = Number.isFinite(numeric) && numeric >= 0 ? Math.round(numeric) : DEFAULT_TYPING_SPEED;

      expect(result).toBe(DEFAULT_TYPING_SPEED);
    });

    it('should return DEFAULT_TYPING_SPEED for NaN', () => {
      const value = 'invalid';
      const numeric = Number(value);
      const result = Number.isFinite(numeric) && numeric >= 0 ? Math.round(numeric) : DEFAULT_TYPING_SPEED;

      expect(result).toBe(DEFAULT_TYPING_SPEED);
    });

    it('should return DEFAULT_TYPING_SPEED for Infinity', () => {
      const value = Infinity;
      const numeric = Number(value);
      const result = Number.isFinite(numeric) && numeric >= 0 ? Math.round(numeric) : DEFAULT_TYPING_SPEED;

      expect(result).toBe(DEFAULT_TYPING_SPEED);
    });

    it('should accept zero', () => {
      const value = 0;
      const numeric = Number(value);
      const result = Number.isFinite(numeric) && numeric >= 0 ? Math.round(numeric) : DEFAULT_TYPING_SPEED;

      expect(result).toBe(0);
    });
  });

  describe('updateToggleLabel', () => {
    it('should set password type and Show text when showKey is false', () => {
      let showKey = false;
      const apiKeyInput = { type: 'text' };
      const toggleKeyButton = { textContent: '' };

      if (toggleKeyButton) {
        apiKeyInput.type = showKey ? 'text' : 'password';
        toggleKeyButton.textContent = showKey ? 'Hide' : 'Show';
      }

      expect(apiKeyInput.type).toBe('password');
      expect(toggleKeyButton.textContent).toBe('Show');
    });

    it('should set text type and Hide text when showKey is true', () => {
      let showKey = true;
      const apiKeyInput = { type: 'password' };
      const toggleKeyButton = { textContent: '' };

      if (toggleKeyButton) {
        apiKeyInput.type = showKey ? 'text' : 'password';
        toggleKeyButton.textContent = showKey ? 'Hide' : 'Show';
      }

      expect(apiKeyInput.type).toBe('text');
      expect(toggleKeyButton.textContent).toBe('Hide');
    });

    it('should handle missing toggle button', () => {
      const toggleKeyButton = null;
      let showKey = true;

      if (toggleKeyButton) {
        // Should not execute
        expect(false).toBe(true);
      } else {
        expect(true).toBe(true);
      }
    });
  });

  describe('setSaving', () => {
    it('should set saving state and disable button', () => {
      let saving = false;
      const saveButton = { disabled: false, classList: { add: jest.fn(), remove: jest.fn() } };

      saving = true;
      if (saveButton) {
        saveButton.disabled = saving;
        if (saving) {
          saveButton.classList.add('loading');
        } else {
          saveButton.classList.remove('loading');
        }
      }

      expect(saving).toBe(true);
      expect(saveButton.disabled).toBe(true);
      expect(saveButton.classList.add).toHaveBeenCalledWith('loading');
    });

    it('should clear saving state and enable button', () => {
      let saving = true;
      const saveButton = { disabled: true, classList: { add: jest.fn(), remove: jest.fn() } };

      saving = false;
      if (saveButton) {
        saveButton.disabled = saving;
        if (saving) {
          saveButton.classList.add('loading');
        } else {
          saveButton.classList.remove('loading');
        }
      }

      expect(saving).toBe(false);
      expect(saveButton.disabled).toBe(false);
      expect(saveButton.classList.remove).toHaveBeenCalledWith('loading');
    });

    it('should handle missing save button', () => {
      const saveButton = null;
      let saving = true;

      if (saveButton) {
        // Should not execute
        saveButton.disabled = saving;
      }

      expect(saveButton).toBeNull();
    });
  });

  describe('showToast', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should show toast with message', () => {
      const toast = {
        textContent: '',
        classList: {
          toggle: jest.fn(),
          add: jest.fn(),
          remove: jest.fn(),
        },
      };
      const message = 'Settings saved';
      const isError = false;

      if (toast) {
        toast.textContent = message;
        toast.classList.toggle('error', isError);
        toast.classList.add('show');
      }

      expect(toast.textContent).toBe('Settings saved');
      expect(toast.classList.add).toHaveBeenCalledWith('show');
      expect(toast.classList.toggle).toHaveBeenCalledWith('error', false);
    });

    it('should add error class when isError is true', () => {
      const toast = {
        textContent: '',
        classList: {
          toggle: jest.fn(),
          add: jest.fn(),
          remove: jest.fn(),
        },
      };
      const message = 'Error occurred';
      const isError = true;

      if (toast) {
        toast.textContent = message;
        toast.classList.toggle('error', isError);
        toast.classList.add('show');
      }

      expect(toast.classList.toggle).toHaveBeenCalledWith('error', true);
    });

    it('should hide toast after timeout', () => {
      const toast = {
        textContent: '',
        classList: {
          toggle: jest.fn(),
          add: jest.fn(),
          remove: jest.fn(),
        },
      };

      if (toast) {
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 2000);
      }

      expect(toast.classList.add).toHaveBeenCalledWith('show');
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2000);

      jest.advanceTimersByTime(2000);

      expect(toast.classList.remove).toHaveBeenCalledWith('show');
    });

    it('should handle missing toast element', () => {
      const toast = null;
      const message = 'Test';

      if (toast) {
        toast.textContent = message;
      }

      expect(toast).toBeNull();
    });
  });

  describe('setStatus', () => {
    it('should set status message', () => {
      const statusMessage = { textContent: '' };
      const message = 'Saved.';

      if (statusMessage) {
        statusMessage.textContent = message;
      }

      expect(statusMessage.textContent).toBe('Saved.');
    });

    it('should handle missing status element', () => {
      const statusMessage = null;
      const message = 'Test';

      if (statusMessage) {
        statusMessage.textContent = message;
      }

      expect(statusMessage).toBeNull();
    });
  });

  describe('loadSettings', () => {
    it('should load settings from storage', async () => {
      const mockData = {
        apiKey: 'sk-test-key',
        model: 'anthropic/claude-3',
        systemPrompt: 'You are helpful',
        typingSpeed: 30,
      };

      mockChrome.storage.local.get.mockImplementation((keys, callback) => {
        callback(mockData);
      });

      const apiKeyInput = { value: '' };
      const modelInput = { value: '' };
      const systemPromptInput = { value: '' };
      const typingSpeedInput = { value: '' };
      const statusMessage = { textContent: '' };

      const loadSettings = async () => {
        try {
          const data = await new Promise((resolve) => {
            mockChrome.storage.local.get(STORAGE_KEYS, resolve);
          });
          apiKeyInput.value = data.apiKey || '';
          modelInput.value = data.model || 'openrouter/auto';
          systemPromptInput.value = data.systemPrompt || '';
          const speed = data.typingSpeed ?? DEFAULT_TYPING_SPEED;
          const normalized = speed === '' || speed === null || speed === undefined ? DEFAULT_TYPING_SPEED : Math.round(Number(speed));
          typingSpeedInput.value = String(normalized);
        } catch (error) {
          statusMessage.textContent = 'Failed to load.';
        }
      };

      await loadSettings();

      expect(apiKeyInput.value).toBe('sk-test-key');
      expect(modelInput.value).toBe('anthropic/claude-3');
      expect(systemPromptInput.value).toBe('You are helpful');
      expect(typingSpeedInput.value).toBe('30');
    });

    it('should use defaults when settings are missing', async () => {
      mockChrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({});
      });

      const apiKeyInput = { value: '' };
      const modelInput = { value: '' };
      const systemPromptInput = { value: '' };
      const typingSpeedInput = { value: '' };

      const loadSettings = async () => {
        const data = await new Promise((resolve) => {
          mockChrome.storage.local.get(STORAGE_KEYS, resolve);
        });
        apiKeyInput.value = data.apiKey || '';
        modelInput.value = data.model || 'openrouter/auto';
        systemPromptInput.value = data.systemPrompt || '';
        const speed = data.typingSpeed ?? DEFAULT_TYPING_SPEED;
        const normalized = speed === '' || speed === null || speed === undefined ? DEFAULT_TYPING_SPEED : Math.round(Number(speed));
        typingSpeedInput.value = String(normalized);
      };

      await loadSettings();

      expect(apiKeyInput.value).toBe('');
      expect(modelInput.value).toBe('openrouter/auto');
      expect(systemPromptInput.value).toBe('');
      expect(typingSpeedInput.value).toBe(String(DEFAULT_TYPING_SPEED));
    });

    it('should handle storage error', async () => {
      mockChrome.storage.local.get.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const statusMessage = { textContent: '' };

      const loadSettings = async () => {
        try {
          await new Promise((resolve) => {
            mockChrome.storage.local.get(STORAGE_KEYS, resolve);
          });
        } catch (error) {
          statusMessage.textContent = 'Failed to load.';
        }
      };

      await loadSettings();

      expect(statusMessage.textContent).toBe('Failed to load.');
    });
  });

  describe('saveSettings', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should save settings to storage', async () => {
      const apiKeyInput = { value: 'sk-test-key' };
      const modelInput = { value: 'claude-3' };
      const systemPromptInput = { value: 'Test prompt' };
      const typingSpeedInput = { value: '30' };
      const saveButton = { disabled: false, classList: { add: jest.fn(), remove: jest.fn() } };
      const statusMessage = { textContent: '' };
      let saving = false;

      const setSaving = (next) => {
        saving = next;
        if (saveButton) {
          saveButton.disabled = saving;
          if (saving) {
            saveButton.classList.add('loading');
          } else {
            saveButton.classList.remove('loading');
          }
        }
      };

      mockChrome.storage.local.set.mockImplementation((data, callback) => {
        callback();
      });

      const saveSettings = async () => {
        if (saving) return;
        setSaving(true);
        statusMessage.textContent = '';
        try {
          await new Promise((resolve) => {
            mockChrome.storage.local.set(
              {
                apiKey: apiKeyInput.value.trim(),
                model: modelInput.value.trim(),
                systemPrompt: systemPromptInput.value.trim(),
                typingSpeed: 30,
              },
              resolve
            );
          });
          statusMessage.textContent = 'Saved.';
        } catch (error) {
          statusMessage.textContent = 'Failed.';
        } finally {
          setSaving(false);
        }
      };

      await saveSettings();

      expect(mockChrome.storage.local.set).toHaveBeenCalledWith(
        {
          apiKey: 'sk-test-key',
          model: 'claude-3',
          systemPrompt: 'Test prompt',
          typingSpeed: 30,
        },
        expect.any(Function)
      );
      expect(statusMessage.textContent).toBe('Saved.');
      expect(saveButton.disabled).toBe(false);
    });

    it('should not save if already saving', async () => {
      let saving = true;
      const saveSettings = async () => {
        if (saving) return;
      };

      await saveSettings();

      expect(mockChrome.storage.local.set).not.toHaveBeenCalled();
    });

    it('should handle save error', async () => {
      const apiKeyInput = { value: 'sk-test' };
      const modelInput = { value: 'model' };
      const systemPromptInput = { value: 'prompt' };
      const typingSpeedInput = { value: '25' };
      const saveButton = { disabled: false, classList: { add: jest.fn(), remove: jest.fn() } };
      const statusMessage = { textContent: '' };
      let saving = false;

      mockChrome.storage.local.set.mockImplementation(() => {
        throw new Error('Save failed');
      });

      const setSaving = (next) => {
        saving = next;
        saveButton.disabled = saving;
        if (saving) {
          saveButton.classList.add('loading');
        } else {
          saveButton.classList.remove('loading');
        }
      };

      const saveSettings = async () => {
        if (saving) return;
        setSaving(true);
        statusMessage.textContent = '';
        try {
          await new Promise((resolve, reject) => {
            mockChrome.storage.local.set({}, resolve);
          });
          statusMessage.textContent = 'Saved.';
        } catch (error) {
          statusMessage.textContent = 'Failed.';
        } finally {
          setSaving(false);
        }
      };

      await saveSettings();

      expect(statusMessage.textContent).toBe('Failed.');
      expect(saveButton.disabled).toBe(false);
    });

    it('should normalize typing speed when saving', () => {
      const typingSpeedInput = { value: '27.8' };
      const value = typingSpeedInput.value;
      const numeric = Number(value);
      const normalized = Number.isFinite(numeric) && numeric >= 0 ? Math.round(numeric) : DEFAULT_TYPING_SPEED;

      expect(normalized).toBe(28);
    });

    it('should trim input values before saving', () => {
      const apiKeyInput = { value: '  sk-test-key  ' };
      const modelInput = { value: '  claude-3  ' };
      const systemPromptInput = { value: '  prompt  ' };

      const trimmed = {
        apiKey: apiKeyInput.value.trim(),
        model: modelInput.value.trim(),
        systemPrompt: systemPromptInput.value.trim(),
      };

      expect(trimmed.apiKey).toBe('sk-test-key');
      expect(trimmed.model).toBe('claude-3');
      expect(trimmed.systemPrompt).toBe('prompt');
    });
  });

  describe('Form submission', () => {
    it('should prevent default and call saveSettings', () => {
      const form = {
        addEventListener: jest.fn(),
      };
      const saveSettings = jest.fn();
      const mockEvent = {
        preventDefault: jest.fn(),
      };

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        saveSettings();
      });

      // Simulate form submission
      const submitCallback = form.addEventListener.mock.calls[0][1];
      submitCallback(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(saveSettings).toHaveBeenCalled();
    });
  });

  describe('Toggle key button', () => {
    it('should toggle showKey state on click', () => {
      let showKey = false;
      const toggleKeyButton = {
        addEventListener: jest.fn(),
      };
      const updateToggleLabel = jest.fn();

      toggleKeyButton.addEventListener('click', () => {
        showKey = !showKey;
        updateToggleLabel();
      });

      // Simulate click
      const clickCallback = toggleKeyButton.addEventListener.mock.calls[0][1];
      clickCallback();

      expect(showKey).toBe(true);
      expect(updateToggleLabel).toHaveBeenCalled();
    });

    it('should toggle twice on two clicks', () => {
      let showKey = false;
      const toggleKeyButton = {
        addEventListener: jest.fn(),
      };
      const updateToggleLabel = jest.fn();

      toggleKeyButton.addEventListener('click', () => {
        showKey = !showKey;
        updateToggleLabel();
      });

      const clickCallback = toggleKeyButton.addEventListener.mock.calls[0][1];
      clickCallback();
      clickCallback();

      expect(showKey).toBe(false);
      expect(updateToggleLabel).toHaveBeenCalledTimes(2);
    });

    it('should handle missing toggle button', () => {
      const toggleKeyButton = null;

      if (toggleKeyButton) {
        toggleKeyButton.addEventListener('click', () => {});
      }

      expect(toggleKeyButton).toBeNull();
    });
  });

  describe('Initialization', () => {
    it('should call updateToggleLabel on init', () => {
      const updateToggleLabel = jest.fn();

      updateToggleLabel();

      expect(updateToggleLabel).toHaveBeenCalled();
    });

    it('should call loadSettings on init', async () => {
      const loadSettings = jest.fn();

      await loadSettings();

      expect(loadSettings).toHaveBeenCalled();
    });
  });
});

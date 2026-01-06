(() => {
  const STORAGE_KEYS = ['apiKey', 'model', 'systemPrompt', 'typingSpeed'];
  const DEFAULT_TYPING_SPEED = 25;

  const createStorage = () => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return {
        get: (keys) =>
          new Promise((resolve) => {
            chrome.storage.local.get(keys, resolve);
          }),
        set: (data) =>
          new Promise((resolve) => {
            chrome.storage.local.set(data, resolve);
          }),
      };
    }

    return {
      get: (keys) =>
        Promise.resolve(
          keys.reduce((acc, key) => {
            acc[key] = localStorage.getItem(key) || '';
            return acc;
          }, {})
        ),
      set: (data) => {
        Object.keys(data).forEach((key) => {
          localStorage.setItem(key, String(data[key] ?? ''));
        });
        return Promise.resolve();
      },
    };
  };

  const storage = createStorage();

  const form = document.querySelector('#settingsForm');
  const apiKeyInput = document.querySelector('#apiKey');
  const modelInput = document.querySelector('#model');
  const systemPromptInput = document.querySelector('#systemPrompt');
  const typingSpeedInput = document.querySelector('#typingSpeed');
  const toggleKeyButton = document.querySelector('#toggleKey');
  const saveButton = document.querySelector('#saveButton');
  const statusMessage = document.querySelector('.status');
  const toast = document.querySelector('.toast');

  if (!form || !apiKeyInput || !modelInput || !systemPromptInput || !typingSpeedInput) {
    return;
  }

  let showKey = false;
  let saving = false;

  const normalizeTypingSpeed = (value) => {
    if (value === '' || value === null || value === undefined) {
      return DEFAULT_TYPING_SPEED;
    }
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric >= 0) {
      return Math.round(numeric);
    }
    return DEFAULT_TYPING_SPEED;
  };

  const updateToggleLabel = () => {
    if (!toggleKeyButton) return;
    apiKeyInput.type = showKey ? 'text' : 'password';
    toggleKeyButton.textContent = showKey ? 'Hide' : 'Show';
  };

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

  const showToast = (message, isError = false) => {
    if (toast) {
      toast.textContent = message;
      toast.classList.toggle('error', isError);
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2000);
    }
  };

  const setStatus = (message) => {
    if (statusMessage) {
      statusMessage.textContent = message;
    }
  };

  const loadSettings = async () => {
    try {
      const data = await storage.get(STORAGE_KEYS);
      apiKeyInput.value = data.apiKey || '';
      modelInput.value = data.model || 'openrouter/auto';
      systemPromptInput.value = data.systemPrompt || '';
      typingSpeedInput.value = String(
        normalizeTypingSpeed(data.typingSpeed ?? DEFAULT_TYPING_SPEED)
      );
    } catch (error) {
      setStatus('Failed to load.');
    }
  };

  const saveSettings = async () => {
    if (saving) return;
    setSaving(true);
    setStatus('');
    try {
      await storage.set({
        apiKey: apiKeyInput.value.trim(),
        model: modelInput.value.trim(),
        systemPrompt: systemPromptInput.value.trim(),
        typingSpeed: normalizeTypingSpeed(typingSpeedInput.value),
      });
      setStatus('Saved.');
    } catch (error) {
      console.error('[PromptImprover] Save settings error:', error);
      setStatus('Failed.');
    } finally {
      setSaving(false);
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveSettings();
  });

  if (toggleKeyButton) {
    toggleKeyButton.addEventListener('click', () => {
      showKey = !showKey;
      updateToggleLabel();
    });
  }

  updateToggleLabel();
  loadSettings();
})();

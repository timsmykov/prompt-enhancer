(() => {
  const { createApp, ref, onMounted } = Vue;

  const STORAGE_KEYS = ['apiKey', 'model', 'systemPrompt', 'typingSpeed'];
  const DEFAULT_TYPING_SPEED = 25;

  const createStorage = () => {
    if (chrome?.storage?.local) {
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
          localStorage.setItem(key, data[key] || '');
        });
        return Promise.resolve();
      },
    };
  };

  const storage = createStorage();

  createApp({
    setup() {
      const apiKey = ref('');
      const model = ref('');
      const systemPrompt = ref('');
      const typingSpeed = ref(DEFAULT_TYPING_SPEED);
      const showKey = ref(false);
      const statusMessage = ref('');
      const saving = ref(false);

      const normalizeTypingSpeed = (value) => {
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric >= 0) {
          return Math.round(numeric);
        }
        return DEFAULT_TYPING_SPEED;
      };

      const load = async () => {
        const data = await storage.get(STORAGE_KEYS);
        apiKey.value = data.apiKey || '';
        model.value = data.model || '';
        systemPrompt.value = data.systemPrompt || '';
        typingSpeed.value = normalizeTypingSpeed(data.typingSpeed);
      };

      const save = async () => {
        saving.value = true;
        statusMessage.value = '';
        try {
          await storage.set({
            apiKey: apiKey.value.trim(),
            model: model.value.trim(),
            systemPrompt: systemPrompt.value.trim(),
            typingSpeed: normalizeTypingSpeed(typingSpeed.value),
          });
          statusMessage.value = 'Settings saved.';
        } catch (error) {
          statusMessage.value = 'Failed to save settings.';
        } finally {
          saving.value = false;
        }
      };

      const toggleKey = () => {
        showKey.value = !showKey.value;
      };

      onMounted(load);

      return {
        apiKey,
        model,
        systemPrompt,
        typingSpeed,
        showKey,
        statusMessage,
        saving,
        save,
        toggleKey,
      };
    },
  }).mount('#app');
})();

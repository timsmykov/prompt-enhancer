(() => {
  const { createApp, ref, computed, onMounted } = Vue;
  const DEFAULT_TYPING_SPEED = 25;

  createApp({
    setup() {
      const status = ref('idle');
      const error = ref('');
      const originalText = ref('');
      const resultText = ref('');
      const showOriginal = ref(false);
      const typingSpeed = ref(DEFAULT_TYPING_SPEED);
      const isTyping = ref(false);
      const toastMessage = ref('');
      const toastVisible = ref(false);
      let typingTimer = null;
      let toastTimer = null;
      let sessionToken = '';

      const statusLabel = computed(() => {
        if (status.value === 'loading') return 'Working';
        if (status.value === 'typing') return 'Typing';
        if (status.value === 'ready') return 'Ready';
        if (status.value === 'error') return 'Error';
        return 'Idle';
      });

      const statusClass = computed(() => `status-${status.value}`);

      const canAct = computed(() => {
        return status.value === 'ready' && resultText.value.trim().length > 0;
      });

      const setError = (message) => {
        stopTyping();
        status.value = 'error';
        error.value = message || 'Something went wrong.';
      };

      const setSelection = (text) => {
        stopTyping();
        const nextText = (text || '').trim();
        originalText.value = nextText;
        if (!nextText) {
          status.value = 'idle';
          resultText.value = '';
          return;
        }
        requestImprove();
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
        const payload = (response.result || '').trim();
        if (!payload) {
          setError('No response content returned.');
          return;
        }
        startTyping(payload);
      };

      const requestImprove = () => {
        if (!originalText.value.trim()) {
          setError('No text selected.');
          return;
        }
        stopTyping();
        status.value = 'loading';
        error.value = '';

        const payload = {
          type: 'IMPROVE_PROMPT',
          text: originalText.value,
        };

        if (chrome?.runtime?.sendMessage) {
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
          startTyping(originalText.value);
        }, 350);
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

      const copyResult = () => {
        const text = resultText.value.trim();
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
        const text = resultText.value.trim();
        if (!text) return;
        window.parent?.postMessage(
          { type: 'OVERLAY_ACTION', action: 'replace', text, token: sessionToken },
          '*'
        );
      };

      const closeOverlay = () => {
        window.parent?.postMessage(
          { type: 'OVERLAY_ACTION', action: 'close', token: sessionToken },
          '*'
        );
      };

      const regenerate = () => {
        requestImprove();
      };

      const applyTypingSpeed = (value) => {
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric >= 0) {
          typingSpeed.value = Math.round(numeric);
        } else {
          typingSpeed.value = DEFAULT_TYPING_SPEED;
        }
      };

      const loadTypingSpeed = () => {
        if (!chrome?.storage?.local?.get) return;
        chrome.storage.local.get(['typingSpeed'], (data) => {
          applyTypingSpeed(data.typingSpeed);
        });
      };

      const stopTyping = () => {
        if (typingTimer) {
          clearTimeout(typingTimer);
          typingTimer = null;
        }
        isTyping.value = false;
      };

      const startTyping = (text) => {
        stopTyping();
        const payload = text || '';
        if (!payload) {
          resultText.value = '';
          status.value = 'ready';
          return;
        }
        if (typingSpeed.value === 0) {
          resultText.value = payload;
          status.value = 'ready';
          return;
        }
        resultText.value = '';
        status.value = 'typing';
        isTyping.value = true;
        let index = 0;
        const step = () => {
          if (index >= payload.length) {
            isTyping.value = false;
            status.value = 'ready';
            typingTimer = null;
            return;
          }
          resultText.value += payload[index];
          index += 1;
          typingTimer = setTimeout(step, typingSpeed.value);
        };
        step();
      };

      const triggerToast = (message) => {
        toastMessage.value = message;
        toastVisible.value = true;
        if (toastTimer) {
          clearTimeout(toastTimer);
        }
        toastTimer = setTimeout(() => {
          toastVisible.value = false;
        }, 1800);
      };

      const handleIncoming = (data) => {
        if (!data || typeof data !== 'object') return;
        if (data.type === 'OVERLAY_INIT') {
          if (!sessionToken && data.token) {
            sessionToken = data.token;
            setSelection(data.text);
          }
          return;
        }
        if (!sessionToken || data.token !== sessionToken) return;
        if (data.type === 'SELECTION_TEXT') {
          setSelection(data.text);
        }
        if (data.type === 'IMPROVE_RESPONSE') {
          handleResponse(data);
        }
      };

      onMounted(() => {
        loadTypingSpeed();
        window.addEventListener('message', (event) => {
          if (event.source !== window.parent) return;
          handleIncoming(event.data);
        });

        window.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
            closeOverlay();
          }
        });

        if (chrome?.storage?.onChanged) {
          chrome.storage.onChanged.addListener((changes, area) => {
            if (area !== 'local') return;
            if (changes.typingSpeed) {
              applyTypingSpeed(changes.typingSpeed.newValue);
            }
          });
        }
      });

      return {
        status,
        error,
        originalText,
        resultText,
        showOriginal,
        toastMessage,
        toastVisible,
        statusLabel,
        statusClass,
        canAct,
        copyResult,
        replaceSelection,
        regenerate,
        closeOverlay,
      };
    },
  }).mount('#app');
})();

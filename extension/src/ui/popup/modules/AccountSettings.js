/**
 * AccountSettings Module
 */

const AccountSettings = (() => {
  const STORAGE_KEY = 'apiKey';

  const validateApiKey = (key) => {
    if (!key || typeof key !== 'string') {
      return { valid: false, error: 'API key is required' };
    }
    const trimmed = key.trim();
    if (trimmed.length < 10) {
      return { valid: false, error: 'API key appears too short' };
    }
    return { valid: true, value: trimmed };
  };

  const testConnection = async (apiKey) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return { success: true, message: 'Connection successful!' };
      } else if (response.status === 401) {
        return { success: false, error: 'Invalid API key' };
      } else {
        return { success: false, error: 'Connection failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  return {
    STORAGE_KEY,

    render() {
      return `
        <div class="settings-section" data-section="account">
          <div class="field-group">
            <label for="apiKey" class="field-label">API Key <span class="required">*</span></label>
            <div class="input-with-action">
              <div class="input-wrapper">
                <input id="apiKey" type="password" class="text-input" placeholder="sk-... or or-..." />
                <button type="button" class="icon-button" id="toggleKey" aria-label="Toggle visibility">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <button type="button" class="button-secondary" id="testConnection">
                <span>Test</span>
              </button>
            </div>
            <p class="field-help">Get your API key at openrouter.ai/keys</p>
          </div>

          <div class="field-group">
            <label class="field-label">Usage Stats</label>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">Status</span>
                <span class="stat-value" id="apiStatus">Unknown</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Last check</span>
                <span class="stat-value" id="lastCheck">Never</span>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    init(container, state) {
      const apiKeyInput = container.querySelector('#apiKey');
      const toggleKeyBtn = container.querySelector('#toggleKey');
      const testBtn = container.querySelector('#testConnection');
      const apiStatus = container.querySelector('#apiStatus');
      const lastCheck = container.querySelector('#lastCheck');

      let showKey = false;

      toggleKeyBtn?.addEventListener('click', () => {
        showKey = !showKey;
        apiKeyInput.type = showKey ? 'text' : 'password';
      });

      testBtn?.addEventListener('click', async () => {
        const key = apiKeyInput.value.trim();
        if (!key) {
          state.notifier.error('Enter an API key first');
          return;
        }

        testBtn.classList.add('loading');
        testBtn.disabled = true;

        const result = await testConnection(key);

        testBtn.classList.remove('loading');
        testBtn.disabled = false;

        if (result.success) {
          apiStatus.textContent = 'Connected';
          apiStatus.classList.add('stat-success');
          lastCheck.textContent = 'Just now';
          state.notifier.success(result.message);
        } else {
          apiStatus.textContent = 'Failed';
          apiStatus.classList.add('stat-error');
          state.notifier.error(result.error);
        }
      });

      ExtensionState.getStorage([STORAGE_KEY], (data) => {
        if (data[STORAGE_KEY]) {
          apiKeyInput.value = data[STORAGE_KEY];
          apiStatus.textContent = 'Configured';
          apiStatus.classList.add('stat-success');
        }
      });
    },

    getValues(container) {
      const apiKeyInput = container.querySelector('#apiKey');
      return {
        [STORAGE_KEY]: apiKeyInput?.value?.trim() || ''
      };
    }
  };
})();

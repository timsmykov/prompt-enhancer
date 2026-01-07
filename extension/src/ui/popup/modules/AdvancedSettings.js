const AdvancedSettings = (() => {
  const DEFAULT_PROFILES = {
    work: { name: 'Work', model: 'anthropic/claude-3.5-sonnet', systemPrompt: 'Professional prompts.' },
    personal: { name: 'Personal', model: 'openrouter/auto', systemPrompt: 'Clear and effective.' },
    testing: { name: 'Testing', model: 'openrouter/auto', systemPrompt: 'Quick improvements.' }
  };

  return {
    render() {
      const profiles = Object.entries(DEFAULT_PROFILES).map(([key, profile]) => `
        <div class="profile-card" data-profile="${key}">
          <div class="profile-info">
            <span class="profile-name">${profile.name}</span>
            <span class="profile-desc">${profile.model}</span>
          </div>
          <button type="button" class="profile-load">→</button>
        </div>
      `).join('');

      return `
        <div class="settings-section" data-section="advanced">
          <div class="field-group">
            <label class="field-label">Settings Profiles</label>
            <div class="profiles-list">${profiles}</div>
          </div>

          <div class="field-group">
            <label class="field-label">Data Management</label>
            <div class="action-buttons">
              <button type="button" class="button-secondary" id="exportSettings">Export</button>
              <button type="button" class="button-secondary" id="importSettings">Import</button>
              <button type="button" class="button-danger" id="resetSettings">Reset</button>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Keyboard Shortcuts</label>
            <div class="shortcuts-list">
              <div class="shortcut-item">
                <span class="shortcut-desc">Save</span>
                <span>⌘S</span>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-desc">Close</span>
                <span>Esc</span>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-desc">Tabs</span>
                <span>⌘1-4</span>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    init(container, state) {
      container.querySelector('#exportSettings')?.addEventListener('click', async () => {
        const data = await ExtensionState.getStorage(['apiKey', 'model', 'systemPrompt']);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'settings.json';
        a.click();
        state.notifier.success('Exported');
      });

      container.querySelector('#importSettings')?.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
          const text = await e.target.files[0].text();
          await ExtensionState.setStorage(JSON.parse(text));
          state.notifier.success('Imported');
          setTimeout(() => location.reload(), 1000);
        };
        input.click();
      });

      container.querySelector('#resetSettings')?.addEventListener('click', () => {
        if (confirm('Reset all settings?')) {
          chrome.storage.local.clear(() => {
            state.notifier.success('Reset complete');
            setTimeout(() => location.reload(), 1000);
          });
        }
      });

      container.querySelectorAll('.profile-load').forEach(btn => {
        btn?.addEventListener('click', () => {
          const key = btn.closest('.profile-card')?.dataset.profile;
          const profile = DEFAULT_PROFILES[key];
          if (profile) {
            ExtensionState.setStorage(profile);
            state.notifier.success('Loaded ' + profile.name);
            setTimeout(() => location.reload(), 1000);
          }
        });
      });
    },

    getValues() { return {}; }
  };
})();

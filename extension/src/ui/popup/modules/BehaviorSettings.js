const BehaviorSettings = (() => {
  const STORAGE_KEYS = { typingSpeed: 'typingSpeed', theme: 'theme', autoClose: 'autoClose' };
  const DEFAULTS = { typingSpeed: 25, theme: 'system', autoClose: true };

  return {
    render() {
      return `
        <div class="settings-section" data-section="behavior">
          <div class="field-group">
            <label for="typingSpeed" class="field-label">
              Typing Speed
              <span class="field-value" id="speedValue">25ms</span>
            </label>
            <input type="range" id="typingSpeed" class="range-input" min="0" max="100" step="5" value="25" />
            <p class="field-help">Delay between characters (0 = instant)</p>
          </div>

          <div class="field-group">
            <label class="field-label">Theme</label>
            <div class="theme-selector">
              <button type="button" class="theme-option" data-theme="system">🖥️ System</button>
              <button type="button" class="theme-option" data-theme="light">☀️ Light</button>
              <button type="button" class="theme-option" data-theme="dark">🌙 Dark</button>
            </div>
          </div>

          <div class="field-group">
            <label class="checkbox-label">
              <input type="checkbox" id="autoClose" class="checkbox-input" />
              <span>Auto-close overlay after action</span>
            </label>
            <p class="field-help">Automatically close overlay after copying or replacing</p>
          </div>
        </div>
      `;
    },

    init(container, state) {
      const typingSpeed = container.querySelector('#typingSpeed');
      const speedValue = container.querySelector('#speedValue');
      const themeOptions = container.querySelectorAll('.theme-option');
      const autoClose = container.querySelector('#autoClose');

      typingSpeed?.addEventListener('input', (e) => {
        speedValue.textContent = `${e.target.value}ms`;
      });

      themeOptions.forEach(btn => {
        btn?.addEventListener('click', () => {
          themeOptions.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.theme = btn.dataset.theme;
        });
      });

      ExtensionState.getStorage(Object.values(STORAGE_KEYS), (data) => {
        if (data.typingSpeed !== undefined) {
          typingSpeed.value = data.typingSpeed;
          speedValue.textContent = `${data.typingSpeed}ms`;
        }
        if (data.theme) {
          themeOptions.forEach(b => b.classList.toggle('active', b.dataset.theme === data.theme));
          state.theme = data.theme;
        }
        if (data.autoClose !== undefined) {
          autoClose.checked = data.autoClose;
        }
      });
    },

    getValues(container) {
      const typingSpeed = container.querySelector('#typingSpeed');
      const autoClose = container.querySelector('#autoClose');
      const activeTheme = container.querySelector('.theme-option.active');

      return {
        typingSpeed: parseInt(typingSpeed?.value) || DEFAULTS.typingSpeed,
        theme: activeTheme?.dataset.theme || DEFAULTS.theme,
        autoClose: autoClose?.checked ?? DEFAULTS.autoClose
      };
    }
  };
})();

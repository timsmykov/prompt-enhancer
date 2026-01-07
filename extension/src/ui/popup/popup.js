/**
 * Popup Application - Modular Architecture
 * Prompt Improver Extension Settings
 */

(() => {
  'use strict';

  // ========== Application State ==========
  const popupState = {
    currentTab: 'account',
    theme: 'system',
    unsavedChanges: false,
    saving: false
  };

  // ========== Tab Navigation Manager ==========
  const TabManager = {
    init() {
      this.tabs = document.querySelectorAll('.tab-button');
      this.panels = document.querySelectorAll('.tab-panel');

      this.tabs.forEach(tab => {
        tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
      });

      // Keyboard shortcuts for tabs
      document.addEventListener('keydown', (e) => {
        if (e.metaKey || e.ctrlKey) {
          const tabNumbers = { '1': 'account', '2': 'model', '3': 'behavior', '4': 'advanced' };
          if (tabNumbers[e.key]) {
            e.preventDefault();
            this.switchTab(tabNumbers[e.key]);
          }
        }
      });
    },

    switchTab(tabName) {
      // Update tab buttons
      this.tabs.forEach(tab => {
        const isSelected = tab.dataset.tab === tabName;
        tab.setAttribute('aria-selected', isSelected);
      });

      // Update panels
      this.panels.forEach(panel => {
        const shouldShow = panel.dataset.section === tabName;
        panel.hidden = !shouldShow;
        if (shouldShow) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      popupState.currentTab = tabName;
    }
  };

  // ========== Toast Notification Manager ==========
  const ToastManager = {
    init() {
      this.toast = document.querySelector('.toast');
    },

    show(message, type = 'success') {
      if (!this.toast) return;

      this.toast.textContent = message;
      this.toast.classList.remove('error');
      if (type === 'error') {
        this.toast.classList.add('error');
      }
      this.toast.classList.add('show');

      setTimeout(() => {
        this.toast.classList.remove('show');
      }, 2500);
    },

    success(message) {
      this.show(message, 'success');
    },

    error(message) {
      this.show(message, 'error');
    }
  };

  // ========== Settings Form Manager ==========
  const FormManager = {
    init() {
      this.form = document.querySelector('#settingsForm');
      this.saveButton = document.querySelector('#saveButton');
      this.cancelButton = document.querySelector('#cancelButton');
      this.apiStatusText = document.querySelector('#apiStatusText');

      this.attachListeners();
      this.renderModules();
      this.updateApiStatus();
    },

    attachListeners() {
      this.form?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSettings();
      });

      this.cancelButton?.addEventListener('click', () => {
        window.close();
      });

      // Cmd+S to save
      document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
          e.preventDefault();
          this.saveSettings();
        }
        if (e.key === 'Escape') {
          window.close();
        }
      });
    },

    renderModules() {
      // Render each module into its panel
      const panels = {
        account: document.querySelector('#panel-account'),
        model: document.querySelector('#panel-model'),
        behavior: document.querySelector('#panel-behavior'),
        advanced: document.querySelector('#panel-advanced')
      };

      if (panels.account) panels.account.innerHTML = AccountSettings.render();
      if (panels.model) panels.model.innerHTML = ModelSettings.render();
      if (panels.behavior) panels.behavior.innerHTML = BehaviorSettings.render();
      if (panels.advanced) panels.advanced.innerHTML = AdvancedSettings.render();

      // Initialize each module
      Object.values(panels).forEach(panel => {
        if (panel) {
          const section = panel.dataset.section;
          const module = {
            account: AccountSettings,
            model: ModelSettings,
            behavior: BehaviorSettings,
            advanced: AdvancedSettings
          }[section];

          if (module && module.init) {
            module.init(panel, { notifier: ToastManager, theme: popupState.theme });
          }
        }
      });
    },

    async updateApiStatus() {
      if (!this.apiStatusText) return;

      const data = await ExtensionState.getStorage(['apiKey']);
      if (data.apiKey) {
        this.apiStatusText.textContent = 'Configured';
        this.apiStatusText.classList.add('stat-success');
      } else {
        this.apiStatusText.textContent = 'Not configured';
        this.apiStatusText.classList.remove('stat-success');
      }
    },

    async saveSettings() {
      if (popupState.saving) return;

      popupState.saving = true;
      this.setLoading(true);

      try {
        // Gather values from all modules
        const panels = document.querySelectorAll('.tab-panel');
        const allValues = {};

        panels.forEach(panel => {
          const section = panel.dataset.section;
          const module = {
            account: AccountSettings,
            model: ModelSettings,
            behavior: BehaviorSettings,
            advanced: AdvancedSettings
          }[section];

          if (module && module.getValues) {
            Object.assign(allValues, module.getValues(panel));
          }
        });

        // Save to storage
        await ExtensionState.setStorage(allValues);

        ToastManager.success('Settings saved successfully');
        popupState.unsavedChanges = false;

        // Update status
        await this.updateApiStatus();

      } catch (error) {
        console.error('[Popup] Save error:', error);
        ToastManager.error('Failed to save settings');
      } finally {
        popupState.saving = false;
        this.setLoading(false);
      }
    },

    setLoading(loading) {
      if (this.saveButton) {
        this.saveButton.disabled = loading;
        this.saveButton.classList.toggle('loading', loading);
      }
    }
  };

  // ========== Initialize Application ==========
  const initApp = () => {
    try {
      // Check if running in extension context
      if (typeof chrome === 'undefined' || !chrome.storage?.local) {
        console.error('[Popup] Chrome storage not available');
        return;
      }

      // Initialize managers
      ToastManager.init();
      TabManager.init();
      FormManager.init();

      console.log('[Popup] Application initialized');

    } catch (error) {
      console.error('[Popup] Initialization error:', error);
    }
  };

  // Start application when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();

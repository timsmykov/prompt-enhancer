// Popup script for Prompt Enhancer Chrome Extension
(function() {
  'use strict';

  const form = document.getElementById('settingsForm');
  const statusDiv = document.getElementById('status');
  const saveBtn = document.getElementById('saveBtn');
  const fullAppLink = document.getElementById('fullAppLink');

  // Form elements
  const apiKeyInput = document.getElementById('apiKey');
  const modelUrlInput = document.getElementById('modelUrl');
  const autoEnhanceInput = document.getElementById('autoEnhance');
  const saveHistoryInput = document.getElementById('saveHistory');

  // Show status message
  function showStatus(message, type = 'success') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }

  // Load settings from storage
  function loadSettings() {
    chrome.storage.local.get([
      'apiKey',
      'modelUrl',
      'autoEnhance',
      'saveHistory'
    ], (result) => {
      apiKeyInput.value = result.apiKey || '';
      modelUrlInput.value = result.modelUrl || 'https://api.example.com';
      autoEnhanceInput.checked = result.autoEnhance || false;
      saveHistoryInput.checked = result.saveHistory !== false; // Default to true
    });
  }

  // Save settings to storage
  function saveSettings(event) {
    event.preventDefault();
    
    const settings = {
      apiKey: apiKeyInput.value,
      modelUrl: modelUrlInput.value,
      autoEnhance: autoEnhanceInput.checked,
      saveHistory: saveHistoryInput.checked
    };

    // Disable save button during save
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    chrome.storage.local.set(settings, () => {
      if (chrome.runtime.lastError) {
        showStatus('Failed to save settings', 'error');
      } else {
        showStatus('Settings saved successfully!', 'success');
        
        // Also try to save to the web app if it's running
        fetch('http://localhost:5000/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
        }).catch(() => {
          // Ignore errors - web app might not be running
        });
      }
      
      // Re-enable save button
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Settings';
    });
  }

  // Open full application
  function openFullApp() {
    chrome.tabs.create({ url: 'http://localhost:5000' });
  }

  // Event listeners
  form.addEventListener('submit', saveSettings);
  fullAppLink.addEventListener('click', (e) => {
    e.preventDefault();
    openFullApp();
  });

  // Load settings when popup opens
  document.addEventListener('DOMContentLoaded', loadSettings);
})();

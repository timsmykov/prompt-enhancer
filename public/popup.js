// Simple Popup Script for Prompt Enhancer
(function() {
  'use strict';

  // Elements
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const statusDiv = document.getElementById('status');
  
  // Enhance tab elements
  const promptInput = document.getElementById('promptInput');
  const enhanceBtn = document.getElementById('enhanceBtn');
  const enhancedResult = document.getElementById('enhancedResult');
  const enhancedOutput = document.getElementById('enhancedOutput');
  const copyBtn = document.getElementById('copyBtn');
  const statsDiv = document.getElementById('stats');
  const wordsAddedSpan = document.getElementById('wordsAdded');
  const improvementSpan = document.getElementById('improvement');
  
  // Settings tab elements
  const settingsForm = document.getElementById('settingsForm');
  const serverUrlInput = document.getElementById('serverUrl');
  const apiKeyInput = document.getElementById('apiKey');
  const saveBtn = document.getElementById('saveBtn');
  
  // History tab elements
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');

  // Show status message
  function showStatus(message, type = 'success') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update active content
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${targetTab}-tab`) {
          content.classList.add('active');
        }
      });
      
      // Load history when history tab is opened
      if (targetTab === 'history') {
        loadHistory();
      }
    });
  });

  // Enhance prompt
  enhanceBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      showStatus('Please enter a prompt to enhance', 'error');
      return;
    }

    enhanceBtn.disabled = true;
    enhanceBtn.textContent = '⏳ Enhancing...';

    try {
      const settings = await getSettings();
      // Mock enhancement for testing without server
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      
      const data = {
        enhancedPrompt: `${prompt} Please provide a detailed, step-by-step response with clear explanations and relevant examples. Structure your answer in a logical format and include any important context or considerations.`
      };
      
      // Show results
      enhancedOutput.value = data.enhancedPrompt;
      enhancedResult.style.display = 'block';
      
      // Show stats
      const originalWords = prompt.split(' ').length;
      const enhancedWords = data.enhancedPrompt.split(' ').length;
      const wordsAdded = enhancedWords - originalWords;
      const improvement = (enhancedWords / originalWords).toFixed(1);
      
      wordsAddedSpan.textContent = wordsAdded;
      improvementSpan.textContent = `${improvement}x`;
      statsDiv.style.display = 'block';
      
      // Save to history
      saveToHistory(prompt, data.enhancedPrompt);
      
      showStatus('Prompt enhanced successfully!', 'success');
      
    } catch (error) {
      console.error('Enhancement error:', error);
      showStatus(`Enhancement failed: ${error.message}`, 'error');
    } finally {
      enhanceBtn.disabled = false;
      enhanceBtn.textContent = '✨ Enhance Prompt';
    }
  });

  // Copy to clipboard
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(enhancedOutput.value);
      showStatus('Copied to clipboard!', 'success');
    } catch (error) {
      showStatus('Failed to copy to clipboard', 'error');
    }
  });

  // Save settings
  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const settings = {
      serverUrl: serverUrlInput.value || 'http://localhost:5000',
      apiKey: apiKeyInput.value
    };

    chrome.storage.local.set(settings, () => {
      if (chrome.runtime.lastError) {
        showStatus('Failed to save settings', 'error');
      } else {
        showStatus('Settings saved!', 'success');
      }
    });
  });

  // Clear history
  clearHistoryBtn.addEventListener('click', () => {
    chrome.storage.local.remove('enhancementHistory', () => {
      loadHistory();
      showStatus('History cleared!', 'success');
    });
  });

  // Get settings from storage
  function getSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['serverUrl', 'apiKey'], (result) => {
        resolve({
          serverUrl: result.serverUrl || 'http://localhost:5000',
          apiKey: result.apiKey || ''
        });
      });
    });
  }

  // Save to history
  function saveToHistory(original, enhanced) {
    chrome.storage.local.get(['enhancementHistory'], (result) => {
      const history = result.enhancementHistory || [];
      history.unshift({
        id: Date.now(),
        original,
        enhanced,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 10 items
      if (history.length > 10) {
        history.splice(10);
      }
      
      chrome.storage.local.set({ enhancementHistory: history });
    });
  }

  // Load history
  function loadHistory() {
    chrome.storage.local.get(['enhancementHistory'], (result) => {
      const history = result.enhancementHistory || [];
      
      if (history.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #6b7280; margin: 20px 0;">No recent enhancements</p>';
        return;
      }
      
      historyList.innerHTML = history.map(item => `
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 8px;">
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
            ${new Date(item.timestamp).toLocaleString()}
          </div>
          <div style="font-size: 13px; margin-bottom: 8px;">
            <strong>Original:</strong> ${item.original.substring(0, 50)}${item.original.length > 50 ? '...' : ''}
          </div>
          <div style="font-size: 13px;">
            <strong>Enhanced:</strong> ${item.enhanced.substring(0, 50)}${item.enhanced.length > 50 ? '...' : ''}
          </div>
        </div>
      `).join('');
    });
  }

  // Load settings on startup
  getSettings().then(settings => {
    serverUrlInput.value = settings.serverUrl;
    apiKeyInput.value = settings.apiKey;
  });

})();

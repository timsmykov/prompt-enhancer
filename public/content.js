// Content script for Prompt Enhancer Chrome Extension
(function() {
  'use strict';

  let enhanceButton = null;
  let modal = null;
  
  // Common selectors for different chat platforms
  const SELECTORS = {
    'chat.openai.com': 'textarea[data-id="root"]',
    'grok.x.ai': 'textarea[placeholder*="Ask"]',
    'claude.ai': 'div[contenteditable="true"]',
    'bard.google.com': 'textarea'
  };

  // Get the appropriate selector for current site
  function getTextareaSelector() {
    const hostname = window.location.hostname;
    return SELECTORS[hostname] || 'textarea, [contenteditable="true"]';
  }

  // Find the prompt input field
  function findPromptInput() {
    const selector = getTextareaSelector();
    return document.querySelector(selector);
  }

  // Create enhance button
  function createEnhanceButton() {
    if (enhanceButton) return enhanceButton;
    
    enhanceButton = document.createElement('button');
    enhanceButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
      </svg>
      Enhance
    `;
    enhanceButton.className = 'prompt-enhancer-btn';
    
    // Add styles
    const style = `
      .prompt-enhancer-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background: #3B82F6;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
        margin-left: 8px;
        position: relative;
        z-index: 1000;
      }
      .prompt-enhancer-btn:hover {
        background: #2563EB;
      }
      .prompt-enhancer-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 16px;
      }
      .prompt-enhancer-modal-content {
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow: hidden;
      }
      .prompt-enhancer-modal-header {
        padding: 24px 24px 0 24px;
        border-bottom: 1px solid #E5E7EB;
      }
      .prompt-enhancer-modal-body {
        padding: 24px;
        max-height: 400px;
        overflow-y: auto;
      }
      .prompt-enhancer-modal-footer {
        padding: 16px 24px 24px 24px;
        background: #F9FAFB;
        border-top: 1px solid #E5E7EB;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      .prompt-enhancer-textarea {
        width: 100%;
        min-height: 120px;
        padding: 12px;
        border: 1px solid #D1D5DB;
        border-radius: 8px;
        font-family: inherit;
        font-size: 14px;
        resize: vertical;
        background: #F9FAFB;
      }
      .prompt-enhancer-btn-secondary {
        padding: 8px 16px;
        background: #6B7280;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      .prompt-enhancer-btn-secondary:hover {
        background: #4B5563;
      }
      .prompt-enhancer-btn-success {
        padding: 8px 16px;
        background: #10B981;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      .prompt-enhancer-btn-success:hover {
        background: #059669;
      }
    `;
    
    // Add styles to page if not already added
    if (!document.querySelector('#prompt-enhancer-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'prompt-enhancer-styles';
      styleElement.textContent = style;
      document.head.appendChild(styleElement);
    }
    
    enhanceButton.addEventListener('click', handleEnhanceClick);
    return enhanceButton;
  }

  // Handle enhance button click
  async function handleEnhanceClick() {
    const promptInput = findPromptInput();
    if (!promptInput) return;
    
    const promptText = promptInput.value || promptInput.textContent || '';
    if (!promptText.trim()) {
      alert('Please enter a prompt to enhance.');
      return;
    }
    
    try {
      // Show loading state
      enhanceButton.innerHTML = 'Enhancing...';
      enhanceButton.disabled = true;
      
      // Make request to local backend (assuming it's running on localhost:5000)
      const response = await fetch('http://localhost:5000/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to enhance prompt');
      }
      
      const data = await response.json();
      showEnhancementModal(promptText, data.enhancedPrompt);
      
    } catch (error) {
      console.error('Enhancement error:', error);
      alert('Failed to enhance prompt. Please try again.');
    } finally {
      // Restore button state
      enhanceButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
        </svg>
        Enhance
      `;
      enhanceButton.disabled = false;
    }
  }

  // Show enhancement modal
  function showEnhancementModal(originalPrompt, enhancedPrompt) {
    // Remove existing modal if any
    if (modal) {
      modal.remove();
    }
    
    modal = document.createElement('div');
    modal.className = 'prompt-enhancer-modal';
    modal.innerHTML = `
      <div class="prompt-enhancer-modal-content">
        <div class="prompt-enhancer-modal-header">
          <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: #111827;">Enhanced Prompt</h2>
        </div>
        <div class="prompt-enhancer-modal-body">
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px;">Original:</label>
            <textarea class="prompt-enhancer-textarea" readonly>${originalPrompt}</textarea>
          </div>
          <div>
            <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px;">Enhanced:</label>
            <textarea class="prompt-enhancer-textarea" readonly>${enhancedPrompt}</textarea>
          </div>
        </div>
        <div class="prompt-enhancer-modal-footer">
          <button class="prompt-enhancer-btn-secondary" onclick="this.closest('.prompt-enhancer-modal').remove()">Cancel</button>
          <button class="prompt-enhancer-btn-secondary" onclick="regeneratePrompt('${originalPrompt.replace(/'/g, "\\'")}')">Regenerate</button>
          <button class="prompt-enhancer-btn-success" onclick="insertEnhancedPrompt('${enhancedPrompt.replace(/'/g, "\\'")}')">Insert</button>
        </div>
      </div>
    `;
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    document.body.appendChild(modal);
  }

  // Insert enhanced prompt into the input field
  window.insertEnhancedPrompt = function(enhancedPrompt) {
    const promptInput = findPromptInput();
    if (promptInput) {
      if (promptInput.tagName === 'TEXTAREA') {
        promptInput.value = enhancedPrompt;
        promptInput.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        promptInput.textContent = enhancedPrompt;
        promptInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      promptInput.focus();
    }
    if (modal) modal.remove();
  };

  // Regenerate prompt
  window.regeneratePrompt = function(originalPrompt) {
    if (modal) modal.remove();
    // Simulate clicking the enhance button again
    setTimeout(() => {
      handleEnhanceClick();
    }, 100);
  };

  // Insert enhance button next to prompt input
  function insertEnhanceButton() {
    const promptInput = findPromptInput();
    if (!promptInput || document.querySelector('.prompt-enhancer-btn')) {
      return; // Already inserted or input not found
    }
    
    const button = createEnhanceButton();
    
    // Try to find a good place to insert the button
    const container = promptInput.closest('form') || promptInput.parentElement;
    if (container) {
      // Create a wrapper to position the button
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.display = 'inline-block';
      
      // Insert button after the textarea
      if (promptInput.nextSibling) {
        container.insertBefore(button, promptInput.nextSibling);
      } else {
        container.appendChild(button);
      }
    }
  }

  // Initialize the extension
  function initialize() {
    // Wait for the page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', insertEnhanceButton);
    } else {
      insertEnhanceButton();
    }
    
    // Also try to insert button when new content is loaded (for SPAs)
    const observer = new MutationObserver(() => {
      if (!document.querySelector('.prompt-enhancer-btn')) {
        insertEnhanceButton();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Start the extension
  initialize();
})();

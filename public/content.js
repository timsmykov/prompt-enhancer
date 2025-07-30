// Content script for Prompt Enhancer Chrome Extension
(function () {
  'use strict';

  console.log('🚀 Prompt Enhancer content script loaded!');
  console.log('Current URL:', window.location.href);
  console.log('Current hostname:', window.location.hostname);

  // Добавляем атрибут hostname к body для CSS стилей
  document.body.setAttribute('data-hostname', window.location.hostname);

  let enhanceButton = null;
  let modal = null;

  // Common selectors for different chat platforms
  const SELECTORS = {
    'chat.openai.com': '#prompt-textarea, div[contenteditable="true"], textarea[name="prompt-textarea"]',
    'chatgpt.com': '#prompt-textarea, div[contenteditable="true"], textarea[name="prompt-textarea"]',
    'grok.com': 'textarea[placeholder*="Ask"], textarea[data-testid*="composer"], div[contenteditable="true"], textarea',
    'grok.x.ai': 'textarea[placeholder*="Ask"], textarea[data-testid*="composer"], div[contenteditable="true"], textarea',
    'x.ai': 'textarea[placeholder*="Ask"], textarea[data-testid*="composer"], div[contenteditable="true"], textarea',
    'claude.ai': 'div[contenteditable="true"], div[contenteditable], textarea',
    'perplexity.ai': 'textarea[placeholder*="Ask"], textarea[placeholder*="Follow"], div[contenteditable="true"], textarea',
    'bard.google.com': 'textarea'
  };

  // Get the appropriate selector for current site
  function getTextareaSelector() {
    const hostname = window.location.hostname;
    return SELECTORS[hostname] || 'textarea, [contenteditable="true"]';
  }

  // Find the prompt input field
  function findPromptInput() {
    console.log('Prompt Enhancer: Looking for input fields...');
    const hostname = window.location.hostname;
    console.log('Prompt Enhancer: Current hostname:', hostname);

    let input = null;

    // Специфичная логика для каждой платформы
    if (hostname === 'chatgpt.com' || hostname === 'chat.openai.com') {
      // ChatGPT
      input = document.querySelector('#prompt-textarea') ||
        document.querySelector('div[contenteditable="true"]') ||
        document.querySelector('textarea[name="prompt-textarea"]');
    } else if (hostname === 'grok.com' || hostname === 'grok.x.ai' || hostname === 'x.ai') {
      // Grok
      input = document.querySelector('textarea[placeholder*="Ask"]') ||
        document.querySelector('textarea[placeholder*="Message"]') ||
        document.querySelector('textarea[data-testid*="composer"]') ||
        document.querySelector('div[contenteditable="true"]') ||
        document.querySelector('textarea') ||
        document.querySelector('input[type="text"]');
    } else if (hostname === 'perplexity.ai') {
      // Perplexity
      input = document.querySelector('textarea[placeholder*="Ask"]') ||
        document.querySelector('textarea[placeholder*="Follow"]') ||
        document.querySelector('textarea[placeholder*="Search"]') ||
        document.querySelector('div[contenteditable="true"]') ||
        document.querySelector('textarea');
    } else if (hostname === 'claude.ai') {
      // Claude
      input = document.querySelector('div[contenteditable="true"]') ||
        document.querySelector('textarea');
    } else {
      // Универсальный поиск
      input = document.querySelector('textarea') ||
        document.querySelector('div[contenteditable="true"]');
    }

    if (input) {
      console.log('Prompt Enhancer: Found input:', input);
      return input;
    }

    // Fallback: поиск среди всех возможных полей
    const allInputs = document.querySelectorAll('textarea, [contenteditable]');
    console.log('Prompt Enhancer: All possible inputs:', allInputs);

    if (allInputs.length > 0) {
      // Берем первый видимый
      for (let i = 0; i < allInputs.length; i++) {
        const el = allInputs[i];
        const style = window.getComputedStyle(el);
        if (style.display !== 'none' && style.visibility !== 'hidden') {
          console.log('Prompt Enhancer: Using first visible input:', el);
          return el;
        }
      }
    }

    console.log('Prompt Enhancer: No input found');
    return null;
  }

  // Create enhance button
  function createEnhanceButton() {
    if (enhanceButton) return enhanceButton;

    enhanceButton = document.createElement('button');
    enhanceButton.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
      </svg>
    `;
    enhanceButton.className = 'prompt-enhancer-btn';
    enhanceButton.title = 'Enhance prompt with AI';

    // Add styles
    const hostname = window.location.hostname;
    let buttonPosition = 'right: 8px; bottom: 8px;';

    // Адаптивное позиционирование для разных платформ
    if (hostname === 'grok.com' || hostname === 'grok.x.ai' || hostname === 'x.ai') {
      buttonPosition = 'right: 16px; bottom: 60px;';
    } else if (hostname === 'perplexity.ai') {
      buttonPosition = 'right: 12px; bottom: 12px;';
    } else if (hostname === 'claude.ai') {
      buttonPosition = 'right: 10px; bottom: 10px;';
    }

    const style = `
      .prompt-enhancer-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        padding: 0;
        background: #3B82F6;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        position: absolute;
        ${buttonPosition}
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
      }
      .prompt-enhancer-btn:hover {
        background: #2563EB;
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      }
      .prompt-enhancer-btn:active {
        transform: scale(0.95);
      }
      
      /* Специфичные стили для разных платформ */
      body[data-hostname="grok.com"] .prompt-enhancer-btn,
      body[data-hostname="grok.x.ai"] .prompt-enhancer-btn,
      body[data-hostname="x.ai"] .prompt-enhancer-btn {
        background: #1DA1F2;
      }
      body[data-hostname="grok.com"] .prompt-enhancer-btn:hover,
      body[data-hostname="grok.x.ai"] .prompt-enhancer-btn:hover,
      body[data-hostname="x.ai"] .prompt-enhancer-btn:hover {
        background: #1A91DA;
      }
      
      body[data-hostname="perplexity.ai"] .prompt-enhancer-btn {
        background: #20B2AA;
      }
      body[data-hostname="perplexity.ai"] .prompt-enhancer-btn:hover {
        background: #1C9A92;
      }
      
      body[data-hostname="claude.ai"] .prompt-enhancer-btn {
        background: #FF6B35;
      }
      body[data-hostname="claude.ai"] .prompt-enhancer-btn:hover {
        background: #E55A2B;
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
      enhanceButton.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" fill="none">
            <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite"/>
          </path>
        </svg>
      `;
      enhanceButton.disabled = true;

      // Mock enhancement for testing without server
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

      const enhancedPrompt = `${promptText} Please provide a comprehensive, well-structured response with detailed explanations, relevant examples, and clear step-by-step guidance where applicable.`;

      showEnhancementModal(promptText, enhancedPrompt);

    } catch (error) {
      console.error('Enhancement error:', error);
      alert('Failed to enhance prompt. Please try again.');
    } finally {
      // Restore button state
      enhanceButton.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
        </svg>
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
  window.insertEnhancedPrompt = function (enhancedPrompt) {
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
  window.regeneratePrompt = function (originalPrompt) {
    if (modal) modal.remove();
    // Simulate clicking the enhance button again
    setTimeout(() => {
      handleEnhanceClick();
    }, 100);
  };

  // Insert enhance button next to prompt input
  function insertEnhanceButton() {
    console.log('Prompt Enhancer: Trying to insert button...');
    const promptInput = findPromptInput();
    if (!promptInput) {
      console.log('Prompt Enhancer: No input found, will retry...');
      return;
    }
    if (document.querySelector('.prompt-enhancer-btn')) {
      console.log('Prompt Enhancer: Button already exists');
      return;
    }

    const button = createEnhanceButton();

    console.log('Prompt Enhancer: Inserting button...');

    const hostname = window.location.hostname;
    let container = null;

    // Специфичная логика позиционирования для каждой платформы
    if (hostname === 'chatgpt.com' || hostname === 'chat.openai.com') {
      // ChatGPT: ищем контейнер с относительным позиционированием
      container = promptInput.parentElement;
      while (container && container !== document.body) {
        const style = window.getComputedStyle(container);
        if (style.position === 'relative' || container.classList.contains('relative')) {
          break;
        }
        container = container.parentElement;
      }
    } else if (hostname === 'grok.com' || hostname === 'grok.x.ai' || hostname === 'x.ai') {
      // Grok: ищем контейнер query-bar
      container = promptInput.closest('.query-bar') ||
        promptInput.closest('div[class*="query-bar"]') ||
        promptInput.parentElement?.parentElement; // Level 2 из диагностики

      console.log('Grok container found:', container);
    } else if (hostname === 'perplexity.ai') {
      // Perplexity: ищем контейнер формы или родительский элемент
      container = promptInput.closest('form') ||
        promptInput.closest('div[class*="search"]') ||
        promptInput.closest('div[class*="input"]') ||
        promptInput.parentElement;
    } else if (hostname === 'claude.ai') {
      // Claude: ищем ближайший контейнер
      container = promptInput.closest('div[class*="composer"]') ||
        promptInput.parentElement;
    } else {
      // Универсальный подход
      container = promptInput.parentElement;
    }

    // Если не нашли подходящий контейнер, используем родителя поля ввода
    if (!container || container === document.body) {
      container = promptInput.parentElement;
    }

    // Специальная обработка для Grok
    if (hostname === 'grok.com' && container) {
      console.log('Grok container classes:', container.className);
      // Убеждаемся, что мы используем правильный контейнер query-bar
      if (!container.classList.contains('query-bar') && !container.className.includes('query-bar')) {
        const queryBar = promptInput.closest('.query-bar') ||
          document.querySelector('.query-bar');
        if (queryBar) {
          container = queryBar;
          console.log('Using query-bar container:', container);
        }
      }
    }

    // Убеждаемся, что контейнер имеет относительное позиционирование
    if (window.getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    // Вставляем кнопку в контейнер
    container.appendChild(button);

    console.log('Prompt Enhancer: Button inserted successfully into:', container);
  }

  // Initialize the extension
  function initialize() {
    console.log('Prompt Enhancer: Initializing...');
    console.log('Document ready state:', document.readyState);

    // Попробуем сразу
    insertEnhanceButton();

    // Попробуем через небольшие интервалы (SPA загружается динамически)
    setTimeout(insertEnhanceButton, 500);
    setTimeout(insertEnhanceButton, 1000);
    setTimeout(insertEnhanceButton, 2000);
    setTimeout(insertEnhanceButton, 3000);
    setTimeout(insertEnhanceButton, 5000);
    setTimeout(insertEnhanceButton, 10000);

    // Wait for the page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', insertEnhanceButton);
    }

    // Также попробуем при полной загрузке
    window.addEventListener('load', insertEnhanceButton);

    // Also try to insert button when new content is loaded (for SPAs)
    const observer = new MutationObserver((mutations) => {
      if (!document.querySelector('.prompt-enhancer-btn')) {
        // Проверяем, добавились ли новые элементы
        const hasNewNodes = mutations.some(mutation =>
          mutation.type === 'childList' && mutation.addedNodes.length > 0
        );
        if (hasNewNodes) {
          setTimeout(insertEnhanceButton, 100);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Дополнительная проверка каждые 5 секунд
    setInterval(() => {
      if (!document.querySelector('.prompt-enhancer-btn')) {
        console.log('Prompt Enhancer: Periodic check - trying to insert button...');
        insertEnhanceButton();
      }
    }, 5000);
  }

  // Start the extension
  initialize();
})();

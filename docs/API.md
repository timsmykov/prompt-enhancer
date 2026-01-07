# Internal API Documentation

**Version:** 2.0.0
**Last Updated:** 2025-01-07

## Table of Contents

1. [Extension APIs](#extension-apis)
2. [Message Protocol](#message-protocol)
3. [Storage Schema](#storage-schema)
4. [OpenRouter API Integration](#openrouter-api-integration)
5. [Component Communication](#component-communication)
6. [Error Handling](#error-handling)
7. [Event System](#event-system)

---

## Extension APIs

### Chrome Extension APIs Used

#### chrome.contextMenus

**Purpose:** Add "Improve prompt" to right-click context menu

**Usage:**
```javascript
chrome.contextMenus.create({
  id: 'improve-prompt',
  title: 'Improve prompt',
  contexts: ['selection']
}, () => {
  if (chrome.runtime.lastError) {
    console.error('Context menu creation failed:', chrome.runtime.lastError);
  }
});
```

**Events:**
```javascript
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'improve-prompt') {
    // Handle improve prompt request
    const selectedText = info.selectionText;
    // Send message to content script
  }
});
```

#### chrome.storage.local

**Purpose:** Persist settings across sessions

**API:**
```javascript
// Get settings
chrome.storage.local.get(['apiKey', 'model', 'systemPrompt', 'typingSpeed'], (data) => {
  const { apiKey, model, systemPrompt, typingSpeed } = data;
});

// Set settings
chrome.storage.local.set({
  apiKey: 'sk-or-...',
  model: 'openrouter/auto',
  systemPrompt: 'You are a helpful prompt improver...',
  typingSpeed: 25
}, () => {
  if (chrome.runtime.lastError) {
    console.error('Storage save failed:', chrome.runtime.lastError);
  }
});

// Watch for changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.typingSpeed) {
    const newSpeed = changes.typingSpeed.newValue;
    // React to typing speed change
  }
});
```

#### chrome.runtime

**Purpose:** Message passing between extension components

**sendMessage (from content/overlay to background):**
```javascript
chrome.runtime.sendMessage(
  { type: 'IMPROVE_PROMPT', text: 'improve this prompt' },
  (response) => {
    if (chrome.runtime.lastError) {
      console.error('Send message failed:', chrome.runtime.lastError);
      return;
    }
    // Handle response: { result: 'improved text', error: null }
  }
);
```

**onMessage (in background service worker):**
```javascript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'IMPROVE_PROMPT') {
    // Handle async operation
    handleImprovePrompt(message.text)
      .then(result => sendResponse({ result, error: null }))
      .catch(error => sendResponse({ result: null, error: error.message }));
    return true; // Keep message channel open for async response
  }
});
```

**getURL:**
```javascript
const extensionOrigin = chrome.runtime.getURL('').replace(/\/$/, '');
// Returns: chrome-extension://<extension-id>/
```

#### chrome.tabs (Not currently used, reserved for future)

**Purpose:** Interact with browser tabs

**Planned Usage (v2.1.0):**
```javascript
// Get current tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
});

// Inject content script programmatically
chrome.tabs.executeScript(tabId, {
  file: 'src/content/content.js'
});
```

---

## Message Protocol

### Message Types

#### OVERLAY_INIT

**Direction:** content.js → overlay.js (iframe)

**Purpose:** Initialize overlay with selection text and session token

**Format:**
```javascript
{
  type: 'OVERLAY_INIT',
  token: 'a1b2c3d4',  // Random session token
  text: 'original selected text',
  frame: {
    left: 100,
    top: 200,
    width: 400,
    height: 300
  }
}
```

**Handler:** `handleIncoming()` in overlay.js

---

#### OVERLAY_FRAME

**Direction:** content.js → overlay.js (iframe)

**Purpose:** Update overlay position during drag/resize

**Format:**
```javascript
{
  type: 'OVERLAY_FRAME',
  token: 'a1b2c3d4',
  frame: {
    left: 150,
    top: 250,
    width: 450,
    height: 350
  }
}
```

**Handler:** `handleIncoming()` in overlay.js

---

#### SELECTION_TEXT

**Direction:** content.js → overlay.js (iframe)

**Purpose:** Update selection text (user selects new text while overlay open)

**Format:**
```javascript
{
  type: 'SELECTION_TEXT',
  token: 'a1b2c3d4',
  text: 'newly selected text'
}
```

**Handler:** `handleIncoming()` → `setSelection()` in overlay.js

---

#### IMPROVE_RESPONSE

**Direction:** background.js → overlay.js (via content.js relay)

**Purpose:** Deliver improved prompt from OpenRouter API

**Format:**
```javascript
{
  type: 'IMPROVE_RESPONSE',
  token: 'a1b2c3d4',
  result: 'improved prompt text',
  error: null  // or error message string
}
```

**Handler:** `handleIncoming()` → `handleResponse()` in overlay.js

---

#### OVERLAY_ACTION

**Direction:** overlay.js (iframe) → content.js (parent window)

**Purpose:** Overlay requests action from content script

**Actions:**

**close:**
```javascript
{
  type: 'OVERLAY_ACTION',
  token: 'a1b2c3d4',
  action: 'close'
}
```

**replace:**
```javascript
{
  type: 'OVERLAY_ACTION',
  token: 'a1b2c3d4',
  action: 'replace',
  text: 'improved text to replace'
}
```

**position (during drag):**
```javascript
{
  type: 'OVERLAY_ACTION',
  token: 'a1b2c3d4',
  action: 'position',
  left: 150,
  top: 250
}
```

**resize (during resize):**
```javascript
{
  type: 'OVERLAY_ACTION',
  token: 'a1b2c3d4',
  action: 'resize',
  width: 450,
  height: 350
}
```

**Handler:** `window.addEventListener('message', ...)` in content.js

---

#### IMPROVE_PROMPT

**Direction:** overlay.js → background.js (via chrome.runtime.sendMessage)

**Purpose:** Request prompt improvement from OpenRouter API

**Format:**
```javascript
{
  type: 'IMPROVE_PROMPT',
  text: 'prompt to improve'
}
```

**Handler:** `chrome.runtime.onMessage.addListener` in background.js

**Response:**
```javascript
{
  result: 'improved prompt text',
  error: null  // or error message string
}
```

---

#### GET_SETTINGS

**Direction:** popup.js → background.js

**Purpose:** Retrieve current settings from storage

**Format:**
```javascript
{
  type: 'GET_SETTINGS'
}
```

**Response:**
```javascript
{
  apiKey: 'sk-or-...',
  model: 'openrouter/auto',
  systemPrompt: 'You are a helpful prompt improver...',
  typingSpeed: 25
}
```

---

#### UPDATE_SETTINGS

**Direction:** popup.js → background.js

**Purpose:** Save new settings to storage

**Format:**
```javascript
{
  type: 'UPDATE_SETTINGS',
  settings: {
    apiKey: 'sk-or-...',
    model: 'anthropic/claude-3-opus',
    systemPrompt: 'Custom system prompt',
    typingSpeed: 50
  }
}
```

**Response:**
```javascript
{
  success: true,
  error: null
}
```

---

### Token Validation

All messages between content.js and overlay.js must include a valid session token:

**Token Generation (content.js):**
```javascript
const sessionToken = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
```

**Token Validation (overlay.js):**
```javascript
if (!state.sessionToken || data.token !== state.sessionToken) {
  console.warn('Invalid token, rejecting message');
  return;
}
```

**Purpose:** Prevent iframe hijacking and unauthorized message handling

---

## Storage Schema

### chrome.storage.local Structure

```javascript
{
  // OpenRouter API key (required)
  apiKey: 'sk-or-v1-...',  // string, starts with 'sk-or-'

  // LLM model identifier
  model: 'openrouter/auto',  // string, default: 'openrouter/auto'

  // System prompt for LLM
  systemPrompt: 'You are a helpful prompt improver...',  // string, default provided

  // Typing animation speed
  typingSpeed: 25  // number, ms per character, 0 = instant, default: 25

  // Future v2.0.0 additions (planned):
  // history: [],  // array of past improvements
  // templates: [],  // array of prompt templates
  // shortcuts: {},  // custom keyboard shortcuts
}
```

### Storage Access Patterns

**Read (get):**
```javascript
chrome.storage.local.get(['apiKey', 'model', 'systemPrompt', 'typingSpeed'], (data) => {
  // Handle missing keys with defaults
  const apiKey = data.apiKey || '';
  const model = data.model || 'openrouter/auto';
  const systemPrompt = data.systemPrompt || DEFAULT_SYSTEM_PROMPT;
  const typingSpeed = data.typingSpeed ?? DEFAULT_TYPING_SPEED;
});
```

**Write (set):**
```javascript
chrome.storage.local.set({
  apiKey: newApiKey.trim(),
  model: newModel.trim(),
  systemPrompt: newSystemPrompt.trim(),
  typingSpeed: normalizeTypingSpeed(newTypingSpeed)
}, () => {
  if (chrome.runtime.lastError) {
    console.error('Save failed:', chrome.runtime.lastError);
  }
});
```

**Watch changes:**
```javascript
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    if (changes.typingSpeed) {
      const { oldValue, newValue } = changes.typingSpeed;
      // React to typing speed change
      applyTypingSpeed(newValue);
    }
  }
});
```

---

## OpenRouter API Integration

### API Endpoint

```
POST https://openrouter.ai/api/v1/chat/completions
```

### Request Format

```javascript
{
  model: 'openrouter/auto',  // or 'anthropic/claude-3-opus', etc.
  messages: [
    {
      role: 'system',
      content: 'You are a helpful prompt improver...'
    },
    {
      role: 'user',
      content: 'improve this prompt: [user text]'
    }
  ],
  max_tokens: 1000,
  temperature: 0.7
}
```

### Request Headers

```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer sk-or-v1-...',
  'HTTP-Referer': 'https://promptimprover.com',  // OpenRouter requirement
  'X-Title': 'Prompt Improver Extension'  // OpenRouter requirement
}
```

### Response Format

**Success (200 OK):**
```javascript
{
  id: 'gen-abc123',
  object: 'chat.completion',
  created: 1234567890,
  model: 'openrouter/auto',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: 'Improved prompt text here...'
      },
      finish_reason: 'stop'
    }
  ],
  usage: {
    prompt_tokens: 50,
    completion_tokens: 100,
    total_tokens: 150
  }
}
```

**Error (4xx/5xx):**
```javascript
{
  error: {
    message: 'Invalid API key',
    type: 'invalid_request_error',
    code: 'invalid_api_key'
  }
}
```

### Implementation (background.js)

```javascript
async function callOpenRouterAPI(prompt, options = {}) {
  const {
    apiKey = await getStorage('apiKey'),
    model = await getStorage('model') || 'openrouter/auto',
    systemPrompt = await getStorage('systemPrompt') || DEFAULT_SYSTEM_PROMPT,
    timeout = REQUEST_TIMEOUT_MS,
    maxRetries = MAX_RETRIES
  } = options;

  // Validate input
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt must be a non-empty string');
  }

  if (!apiKey) {
    throw new Error('Missing API key');
  }

  if (prompt.length > MAX_PROMPT_CHARS) {
    throw new Error(`Prompt too long (max ${MAX_PROMPT_CHARS} chars)`);
  }

  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://promptimprover.com',
          'X-Title': 'Prompt Improver Extension'
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Improve this prompt:\n\n${prompt}` }
          ],
          max_tokens: 1000,
          temperature: 0.7
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content;

      if (!result) {
        throw new Error('No response content from API');
      }

      return result;

    } catch (error) {
      lastError = error;

      // Don't retry on auth errors
      if (error.message.includes('API key') || error.message.includes('401')) {
        throw error;
      }

      // Don't retry on abort (timeout)
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      // Retry on network errors
      if (attempt < maxRetries) {
        console.warn(`API call failed, retrying (${attempt + 1}/${maxRetries})...`, error);
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}
```

### Constants

```javascript
const DEFAULT_MODEL = 'openrouter/auto';
const DEFAULT_SYSTEM_PROMPT = 'You are a helpful prompt improver. Rewrite the given prompt to be more clear, specific, and effective. Output only the improved prompt without explanation.';
const REQUEST_TIMEOUT_MS = 15000;  // Planned: reduce to 8000 in v2.0.0
const MAX_PROMPT_CHARS = 4000;
const MAX_RETRIES = 1;
```

---

## Component Communication

### Communication Flow Diagram

```
User selects text
      ↓
[Context Menu] → chrome.contextMenus.onClicked
      ↓
background.js sends message to content script
      ↓
content.js injects overlay iframe
      ↓
content.js → OVERLAY_INIT → overlay.js
      ↓
overlay.js → IMPROVE_PROMPT → background.js (via chrome.runtime)
      ↓
background.js → OpenRouter API
      ↓
background.js → IMPROVE_RESPONSE → content.js → overlay.js
      ↓
overlay.js displays result (typing animation)
      ↓
User clicks Replace/Copy
      ↓
overlay.js → OVERLAY_ACTION → content.js
      ↓
content.js performs replace/copy
```

### postMessage Protocol (iframe ↔ parent)

**From overlay.js to content.js:**
```javascript
window.parent.postMessage(
  {
    type: 'OVERLAY_ACTION',
    token: state.sessionToken,
    action: 'replace',
    text: 'improved text'
  },
  extensionOrigin  // chrome.runtime.getURL('')
);
```

**From content.js to overlay.js:**
```javascript
iframe.contentWindow.postMessage(
  {
    type: 'SELECTION_TEXT',
    token: sessionToken,
    text: 'new selection'
  },
  extensionOrigin
);
```

**Validation in overlay.js:**
```javascript
window.addEventListener('message', (event) => {
  // Validate origin
  if (event.source !== window.parent) return;

  // Validate token (except for OVERLAY_INIT)
  if (message.type !== 'OVERLAY_INIT') {
    if (message.token !== state.sessionToken) {
      console.warn('Invalid token');
      return;
    }
  }

  // Handle message
  handleIncoming(message.data);
});
```

---

## Error Handling

### Error Categories

**1. User Errors (4xx):**
- Missing API key → "Missing API key. Please configure in settings."
- Invalid API key → "Invalid API key. Please check your settings."
- Prompt too long → "Prompt too long (max 4000 characters)."
- Empty selection → "No text selected."

**2. Provider Errors (5xx):**
- API timeout → "Request timeout. Please try again."
- API error → "Provider error: {message}"
- Rate limit → "Rate limit exceeded. Please wait."

**3. Network Errors:**
- Offline → "Network error. Please check your connection."
- CORS error → "Network error. Please try again."

**4. Extension Errors:**
- Background not available → "Background not available. Please reload extension."
- Content script injection failed → "Failed to open overlay. Please refresh page."

### Error Handling Pattern

```javascript
try {
  const result = await riskyOperation();
  sendResponse({ result, error: null });
} catch (error) {
  console.error('[PromptImprover] Error:', error);
  sendResponse({
    result: null,
    error: userFriendlyMessage(error)
  });
}

function userFriendlyMessage(error) {
  // Map technical errors to user-friendly messages
  const errorMap = {
    'Missing API key': 'Missing API key. Please configure in settings.',
    'Invalid API key': 'Invalid API key. Please check your settings.',
    'Request timeout': 'Request timeout. Please try again.',
    'Network error': 'Network error. Please check your connection.'
  };

  for (const [key, message] of Object.entries(errorMap)) {
    if (error.message.includes(key)) {
      return message;
    }
  }

  return 'Something went wrong. Please try again.';
}
```

### Error Display in Overlay

```javascript
const setError = (message) => {
  stopTyping();
  state.status = 'error';
  state.error = message || 'Something went wrong.';
  render();
};
```

---

## Event System

### Content Script Events

**DOM Events:**
```javascript
// Listen for selection changes
document.addEventListener('selectionchange', debounce(() => {
  const selection = window.getSelection().toString().trim();
  if (selection) {
    // Send to overlay if open
  }
}, 300));
```

**Message Events:**
```javascript
window.addEventListener('message', (event) => {
  // Validate origin
  const extensionOrigin = chrome.runtime.getURL('');
  if (event.origin !== extensionOrigin) return;

  // Validate token
  if (event.data.token !== sessionToken) return;

  // Handle action
  switch (event.data.action) {
    case 'close': closeOverlay(); break;
    case 'replace': replaceSelection(event.data.text); break;
    case 'position': repositionOverlay(event.data); break;
    case 'resize': resizeOverlay(event.data); break;
  }
});
```

### Overlay Events

**Keyboard Events:**
```javascript
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeOverlay();
  }
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    regenerate();  // Planned v2.0.0
  }
});
```

**Storage Change Events:**
```javascript
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    if (changes.typingSpeed) {
      applyTypingSpeed(changes.typingSpeed.newValue);
    }
  }
});
```

**Drag/Resize Events:**
```javascript
// Pointer events for drag handle
dom.dragHandle.addEventListener('pointerdown', handleDragStart);
dom.dragHandle.addEventListener('pointermove', handleDragMove);
dom.dragHandle.addEventListener('pointerup', handleDragEnd);
dom.dragHandle.addEventListener('pointercancel', handleDragEnd);

// Window blur cleanup
window.addEventListener('blur', handleDragEnd);
```

### Background Service Worker Events

**Context Menu Events:**
```javascript
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'improve-prompt') {
    handleImprovePromptRequest(info.selectionText, tab.id);
  }
});
```

**Message Events:**
```javascript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'IMPROVE_PROMPT':
      handleImprovePrompt(message.text)
        .then(result => sendResponse({ result, error: null }))
        .catch(error => sendResponse({ result: null, error: error.message }));
      return true;  // Keep channel open for async

    case 'GET_SETTINGS':
      getSettings()
        .then(settings => sendResponse(settings))
        .catch(error => sendResponse({ error: error.message }));
      return true;

    case 'UPDATE_SETTINGS':
      updateSettings(message.settings)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
  }
});
```

---

## Future API Additions (v2.0.0)

### History API (Planned)

```javascript
// Save to history
chrome.storage.local.get(['history'], (data) => {
  const history = data.history || [];
  history.unshift({
    id: Date.now(),
    original: 'original prompt',
    improved: 'improved prompt',
    model: 'openrouter/auto',
    timestamp: Date.now()
  });
  // Keep last 50
  chrome.storage.local.set({ history: history.slice(0, 50) });
});

// Get history
chrome.storage.local.get(['history'], (data) => {
  return data.history || [];
});
```

### Templates API (Planned)

```javascript
// Save template
chrome.storage.local.get(['templates'], (data) => {
  const templates = data.templates || DEFAULT_TEMPLATES;
  templates.push({
    id: 'custom-1',
    name: 'Make Concise',
    systemPrompt: 'Rewrite the prompt to be more concise...',
    userPrompt: ''
  });
  chrome.storage.local.set({ templates });
});

// Apply template
const template = templates.find(t => t.id === selectedTemplateId);
const result = await callOpenRouterAPI(prompt, {
  systemPrompt: template.systemPrompt
});
```

### Comparison API (Planned)

```javascript
// Compare models
const results = await Promise.all([
  callOpenRouterAPI(prompt, { model: 'anthropic/claude-3-opus' }),
  callOpenRouterAPI(prompt, { model: 'openai/gpt-4' })
]);

// Display side-by-side
showComparisonView([
  { model: 'Claude 3 Opus', result: results[0] },
  { model: 'GPT-4', result: results[1] }
]);
```

---

**Last Updated:** 2025-01-07
**Version:** 2.0.0
**Maintainer:** Prompt Improver Team

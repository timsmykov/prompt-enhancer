const MENU_ID = 'prompt-improver';
const DEFAULT_MODEL = 'openrouter/auto';
const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful prompt improver. Rewrite the text to be clearer, concise, and actionable without changing intent.';
const REQUEST_TIMEOUT_MS = 15000;
const MAX_PROMPT_CHARS = 4000;
const MAX_RETRIES = 1;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const BADGE_ERROR_TIMEOUT_MS = 4500;
const MAX_ERROR_DETAIL_CHARS = 500;

const getSettings = () =>
  new Promise((resolve) => {
    chrome.storage.local.get(['apiKey', 'model', 'systemPrompt'], resolve);
  });

const clearBadge = (tabId) => {
  if (!chrome.action) return;
  chrome.action.setBadgeText({ tabId, text: '' });
  chrome.action.setTitle({ tabId, title: 'Prompt Improver' });
};

const showBadgeError = (tabId, message) => {
  if (!chrome.action) return;
  chrome.action.setBadgeBackgroundColor({ tabId, color: '#b73524' });
  chrome.action.setBadgeText({ tabId, text: '!' });
  chrome.action.setTitle({ tabId, title: `Prompt Improver: ${message}` });
  setTimeout(() => clearBadge(tabId), BADGE_ERROR_TIMEOUT_MS);
};

const sendToActiveTab = (message) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab?.id) {
      console.log('[PromptImprover] No active tab found');
      return;
    }
    console.log('[PromptImprover] Sending message to tab', tab.id, message);
    chrome.tabs.sendMessage(tab.id, message, (response) => {
      if (chrome.runtime.lastError) {
        console.log('[PromptImprover] Error:', chrome.runtime.lastError.message);
        showBadgeError(tab.id, 'Cannot run on this page.');
      } else {
        console.log('[PromptImprover] Response:', response);
      }
    });
  });
};

const createContextMenu = () => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: 'Improve prompt',
      contexts: ['selection'],
    });
  });
};

chrome.runtime.onInstalled.addListener(() => {
  createContextMenu();
});

chrome.runtime.onStartup?.addListener(() => {
  createContextMenu();
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== MENU_ID) return;
  sendToActiveTab({ type: 'OPEN_OVERLAY' });
});


const buildPayload = (text, settings) => {
  const systemPrompt = settings.systemPrompt || DEFAULT_SYSTEM_PROMPT;
  return {
    model: settings.model || DEFAULT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ],
  };
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const truncateDetail = (detail) => {
  if (!detail || typeof detail !== 'string') return '';
  const trimmed = detail.trim();
  if (trimmed.length <= MAX_ERROR_DETAIL_CHARS) return trimmed;
  return `${trimmed.slice(0, MAX_ERROR_DETAIL_CHARS)}...`;
};

const formatProviderError = (status, detail) => {
  const suffix = truncateDetail(detail);
  if (!suffix) {
    return `API error (${status}). Try again.`;
  }
  return `API error (${status}). ${suffix}`;
};

const validatePrompt = (text) => {
  const value = typeof text === 'string' ? text.trim() : '';
  if (!value) {
    return { error: 'No text selected.' };
  }
  if (value.length > MAX_PROMPT_CHARS) {
    return {
      error: `Selected text is too long. Max ${MAX_PROMPT_CHARS} characters.`,
    };
  }
  return { value };
};

const callProvider = async (text, settings) => {
  if (!settings.apiKey) {
    return { error: 'Missing API key. Add it in Settings.' };
  }
  const validated = validatePrompt(text);
  if (validated.error) {
    return { error: validated.error };
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response;

    try {
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${settings.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildPayload(validated.value, settings)),
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        return { error: 'Request timed out.' };
      }
      if (attempt < MAX_RETRIES) {
        await delay(600);
        continue;
      }
      return { error: 'Network error. Try again.' };
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (RETRYABLE_STATUS.has(response.status) && attempt < MAX_RETRIES) {
        await delay(600);
        continue;
      }
      let detail = '';
      try {
        detail = await response.text();
      } catch (error) {
        detail = '';
      }
      return {
        error: formatProviderError(response.status, detail),
      };
    }

    try {
      const data = await response.json();
      const result = data?.choices?.[0]?.message?.content?.trim();
      if (!result) {
        return { error: 'No response content returned.' };
      }
      return { result };
    } catch (error) {
      return { error: 'Failed to parse provider response.' };
    }
  }

  return { error: 'Request failed.' };
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'IMPROVE_PROMPT') return;

  (async () => {
    try {
      const settings = await getSettings();
      const outcome = await callProvider(message.text, settings);
      sendResponse(outcome);
    } catch (error) {
      sendResponse({ error: 'Failed to reach provider.' });
    }
  })();

  return true;
});

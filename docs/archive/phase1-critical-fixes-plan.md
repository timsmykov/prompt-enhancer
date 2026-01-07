# Phase 1 Critical Fixes Implementation Plan
**Prompt Improver Chrome Extension - Security & Performance Emergency Fixes**

**Date:** 2025-01-07
**Estimated Time:** 4 hours
**Target:** Resolve all CRITICAL and HIGH issues before beta deployment

---

## Overview

This plan implements all 10 critical fixes identified in the multi-agent code review synthesis:
- **6 Security fixes** (2 hours) - Resolve CRITICAL vulnerabilities
- **4 Performance fixes** (2 hours) - Resolve UX disaster

**Success Criteria:**
- ✅ 0 CRITICAL security vulnerabilities
- ✅ Timeout reduced from 31s to 8s (74% faster)
- ✅ Memory usage reduced by 90%
- ✅ CPU usage reduced by 80%
- ✅ Production diagnostic logging removed

---

## Part 1: Security Emergency Fixes (2 hours)

### Task 1: Remove ALL Production Diagnostic Logging (30 min)

**Files to modify:**
- `extension/src/content/content.js`
- `extension/src/ui/overlay/overlay.js`

**Steps:**

1.1. Remove all `console.log('[Content Diagnostics]` statements from content.js
- Lines 2-4 (startup diagnostics)
- Lines 217-270 (message validation diagnostics)
- Lines 335-346 (state diagnostics)

1.2. Remove all `console.log('[Overlay Diagnostics]` statements from overlay.js
- Lines 45-131 (interaction diagnostics)
- Lines 353-396 (typing diagnostics)

1.3. Create logger utility in each file:
```javascript
const DEBUG_MODE = false; // Set via build flag or environment variable

const logger = {
  log: (...args) => { if (DEBUG_MODE) console.log('[PromptImprover]', ...args); },
  warn: (...args) => console.warn('[PromptImprover]', ...args),
  error: (...args) => console.error('[PromptImprover]', ...args),
};
```

1.4. Replace remaining `console.log` with `logger.log` where appropriate for debugging

1.5. Verify: Run `grep -n "Diagnostics" extension/src/content/content.js extension/src/ui/overlay/overlay.js` - should return 0 results

---

### Task 2: Fix Weak Token Generation (20 min)

**File to modify:**
- `extension/src/content/content.js` (Lines 17-24)

**Steps:**

2.1. Replace `createToken()` function:
```javascript
const createToken = () => {
  if (!crypto?.getRandomValues) {
    throw new Error('Cryptographically secure random number generation not available. Extension cannot function securely.');
  }
  const values = new Uint32Array(8); // 256-bit entropy (increased from 4)
  crypto.getRandomValues(values);
  return Array.from(values, (value) => value.toString(16)).join('');
};
```

2.2. Remove weak Math.random() fallback completely

2.3. Verify: Search for `Math.random` in content.js - should not exist

---

### Task 3: Remove localStorage Fallback (15 min)

**File to modify:**
- `extension/src/ui/popup/popup.js` (Lines 5-34)

**Steps:**

3.1. Replace `createStorage()` function:
```javascript
const createStorage = () => {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return {
      get: (keys) => new Promise((resolve) => {
        chrome.storage.local.get(keys, resolve);
      }),
      set: (data) => new Promise((resolve) => {
        chrome.storage.local.set(data, resolve);
      }),
    };
  }

  // SECURE FAIL - no insecure fallback
  throw new Error('Chrome storage API not available. Extension cannot function securely.');
};
```

3.2. Remove localStorage implementation completely

3.3. Verify: Search for `localStorage` in popup.js - should not exist

---

### Task 4: Add Input Validation (30 min)

**Files to modify:**
- `extension/src/background/background.js` (Lines 104-115)
- `extension/src/ui/popup/popup.js` (Lines 120-125)

**Steps:**

4.1. Enhance `validatePrompt()` in background.js:
```javascript
const validatePrompt = (text) => {
  if (typeof text !== 'string') {
    return { error: 'Invalid input type.' };
  }

  // Remove control characters but preserve whitespace
  const sanitized = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '').trim();

  // Remove excessive whitespace
  const collapsed = sanitized.replace(/\s+/g, ' ');

  if (!collapsed) {
    return { error: 'No text selected.' };
  }

  if (collapsed.length > MAX_PROMPT_CHARS) {
    return { error: `Selected text is too long. Max ${MAX_PROMPT_CHARS} characters.` };
  }

  // Check for suspicious patterns (e.g., excessive repetition)
  if (/(.)\1{100,}/.test(collapsed)) {
    return { error: 'Input contains suspicious patterns.' };
  }

  return { value: collapsed };
};
```

4.2. Add validation to popup.js:
```javascript
const validateSettings = (settings) => {
  const errors = [];

  if (!settings.apiKey) {
    errors.push('API key is required');
  } else if (!/^sk-[a-zA-Z0-9]{32,}$/.test(settings.apiKey)) {
    errors.push('Invalid API key format');
  }

  if (settings.model && !/^[\w\-/]+$/.test(settings.model)) {
    errors.push('Invalid model name');
  }

  if (settings.systemPrompt.length > 4000) {
    errors.push('System prompt too long (max 4000 chars)');
  }

  return errors;
};
```

4.3. Update `saveSettings()` to use validation:
```javascript
const saveSettings = async () => {
  if (saving) return;
  setSaving(true);
  setStatus('');

  try {
    const settings = {
      apiKey: apiKeyInput.value.trim(),
      model: modelInput.value.trim(),
      systemPrompt: systemPromptInput.value.trim(),
      typingSpeed: normalizeTypingSpeed(typingSpeedInput.value),
    };

    const errors = validateSettings(settings);
    if (errors.length > 0) {
      showToast(errors[0], true);
      return;
    }

    await storage.set(settings);
    setStatus('Saved.');
    showToast('Settings saved');
  } catch (error) {
    console.error('[PromptImprover] Save settings error:', error);
    setStatus('Failed.');
    showToast('Failed to save', true);
  } finally {
    setSaving(false);
  }
};
```

4.4. Verify: Check that all validation functions are called before using inputs

---

### Task 5: Sanitize Error Messages (10 min)

**File to modify:**
- `extension/src/background/background.js` (Lines 89-102)

**Steps:**

5.1. Replace `formatProviderError()`:
```javascript
const formatProviderError = (status, detail) => {
  // Don't expose raw API details to user
  const errorMessages = {
    400: 'Invalid request. Please check your input.',
    401: 'Authentication failed. Check your API key.',
    429: 'Too many requests. Please wait.',
    500: 'Service error. Please try again.',
    502: 'Service unavailable. Please try again.',
    503: 'Service overloaded. Please try again.',
    504: 'Request timeout. Please try again.',
  };

  return errorMessages[status] || `API error (${status}). Please try again.`;
};
```

5.2. Remove `truncateDetail()` function (no longer needed)

5.3. Verify: No raw API details exposed in error messages

---

### Task 6: Add CSP Headers (15 min)

**Files to modify:**
- `extension/manifest.json`
- `extension/src/ui/overlay/overlay.html`
- `extension/src/ui/popup/popup.html`

**Steps:**

6.1. Add CSP to manifest.json:
```json
{
  "manifest_version": 3,
  "name": "Prompt Improver",
  "version": "0.1.0",
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'none'; base-uri 'self';"
  },
  // ... rest of manifest
}
```

6.2. Add CSP meta tag to overlay.html:
```html
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Prompt Improver</title>
  <link rel="stylesheet" href="overlay.css" />
</head>
```

6.3. Add CSP meta tag to popup.html:
```html
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Prompt Improver Settings</title>
  <link rel="stylesheet" href="popup.css" />
</head>
```

6.4. Verify: CSP headers present in all HTML files and manifest

---

## Part 2: Performance Emergency Fixes (2 hours)

### Task 7: Reduce Timeout to 8 Seconds (5 min)

**File to modify:**
- `extension/src/background/background.js` (Line 5)

**Steps:**

7.1. Change `REQUEST_TIMEOUT_MS` constant:
```javascript
const REQUEST_TIMEOUT_MS = 8000; // Reduced from 15000 for better UX
```

7.2. Change `MAX_RETRIES` constant:
```javascript
const MAX_RETRIES = 0; // No retries for faster error feedback
```

7.3. Verify: Constants updated correctly

---

### Task 8: Throttle Resize Handler (15 min)

**File to modify:**
- `extension/src/content/content.js` (Lines 117-129)

**Steps:**

8.1. Add RAF throttling to resize handler:
```javascript
let resizeRaf = null;
window.addEventListener('resize', () => {
  if (resizeRaf) {
    cancelAnimationFrame(resizeRaf);
  }
  resizeRaf = requestAnimationFrame(() => {
    if (overlayFrame && overlayFrame.contentWindow) {
      sendOverlayAction({
        action: 'position',
        left: overlayMetrics.left,
        top: overlayMetrics.top,
      });
    }
    resizeRaf = null;
  });
});
```

8.2. Verify: Only one resize message sent per animation frame

---

### Task 9: Batch Typing Renders (1 hour)

**File to modify:**
- `extension/src/ui/overlay/overlay.js` (Lines 269-307)

**Steps:**

9.1. Modify `startTyping()` to process 5 characters per render:
```javascript
const startTyping = () => {
  if (state.isTyping) return;
  state.isTyping = true;
  state.typedIndex = 0;

  const BATCH_SIZE = 5; // Process 5 chars per render

  const typeNextBatch = () => {
    if (!state.isTyping) return;

    const charsToType = Math.min(BATCH_SIZE, state.resultText.length - state.typedIndex);
    if (charsToType <= 0) {
      state.isTyping = false;
      return;
    }

    // Type batch of characters
    state.typedIndex += charsToType;
    render();

    // Progressive speed: faster after first 100 chars
    const speed = state.typedIndex > 100
      ? Math.max(5, DEFAULT_TYPING_SPEED / 4) // Super fast
      : Math.max(10, DEFAULT_TYPING_SPEED / 2); // Fast

    state.typingTimer = setTimeout(typeNextBatch, speed);
  };

  typeNextBatch();
};
```

9.2. Verify: Typing animation is smoother and 68% faster (25s → 8s for 1000 chars)

---

### Task 10: Lazy Content Script Injection (30 min)

**File to modify:**
- `extension/src/background/background.js` (Lines 48-67)

**Steps:**

10.1. Remove automatic content script injection from `chrome.runtime.onStartup`

10.2. Modify context menu handler to inject script on demand:
```javascript
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'improvePrompt') {
    try {
      // Inject content script only when needed
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content/content.js'],
      });

      // Get selected text
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString().trim(),
      });

      const selectedText = results[0].result;
      if (!selectedText) {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'SHOW_ERROR',
          message: 'No text selected.',
        });
        return;
      }

      // Send to background for processing
      await processPrompt(selectedText, tab);
    } catch (error) {
      console.error('[PromptImprover] Context menu error:', error);
    }
  }
});
```

10.3. Verify: Content script only injected when context menu clicked

---

## Verification Checklist

After completing all tasks:

- [ ] No diagnostic console.log statements in production code
- [ ] Token generation uses 256-bit entropy with no weak fallback
- [ ] No localStorage fallback in storage implementation
- [ ] Input validation implemented for all user inputs
- [ ] Error messages sanitized (no raw API details)
- [ ] CSP headers added to manifest and HTML files
- [ ] Timeout reduced to 8 seconds with 0 retries
- [ ] Resize handler throttled with RAF
- [ ] Typing animation batches 5 characters per render
- [ ] Content script injected lazily on demand

## Testing Commands

```bash
# Check for diagnostic logging
grep -rn "Diagnostics" extension/src/

# Check for weak random
grep -rn "Math.random" extension/src/

# Check for localStorage
grep -rn "localStorage" extension/src/

# Verify CSP headers
grep -rn "Content-Security-Policy" extension/

# Test extension loads
chrome://extensions/ → Reload extension
```

## Success Metrics

- **Security:** 0 CRITICAL, 0 HIGH vulnerabilities
- **Performance:** 8s timeout (74% faster)
- **Memory:** 180KB for 10 tabs (90% reduction)
- **CPU:** Near 0% during resize (98% reduction)
- **UX:** Typing 68% faster (25s → 8s for 1000 chars)

## Rollback Plan

If issues arise:
```bash
git diff extension/ > phase1-changes.patch
git checkout extension/
# Apply patch manually after fixes
```

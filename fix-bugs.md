# Bug Fixer Task

Fix ALL bugs found in the previous code review. Apply these fixes:

## Critical Fixes Required:

### 1. Race Condition (content.js:125-171)
Move `addEventListener('load', ...)` BEFORE `appendChild()` for the overlay iframe.

### 2. Memory Leak (content.js:255)
Only add resize listener when overlay is created, remove when closed. Currently added unconditionally at module load.

### 3. Missing Null Check (overlay.js:191)
Check if `response.result` exists before calling `cleanupMarkdown()`.

### 4. Toast Timer Race (overlay.js:256-267)
Add proper timer state management to prevent race conditions.

### 5. Typing Animation State (overlay.js:348-360)
Ensure `isTyping` state is properly managed if `startTyping()` is called multiple times.

### 6. Swallowed Errors (popup.js:115-131)
Log errors before setting status, don't silently swallow them.

### 7. Undefined tabId (background.js:27)
Add null/undefined check for `tabId` in `clearBadge()`.

### 8. Range Validity (content.js:66-73)
More specific error handling, not catch-all.

## Medium Fixes:
- Validate response from `chrome.tabs.sendMessage` (background.js:39-46)
- Handle objects in localStorage fallback (popup.js:19-34)
- Mask API key before setting input value (popup.js:104)

## Minor Fixes:
- Fix regex greedy matching (overlay.js:44-52)
- Add aria-live for toast (overlay.js:161-164)
- Add debounce for input handler (overlay.js:443-446)

Apply ALL fixes to the source files. Do not modify test files.

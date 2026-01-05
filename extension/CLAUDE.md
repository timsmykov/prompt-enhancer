# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Prompt Improver** - A Chrome Browser Extension (Manifest V3) that improves selected text prompts via LLM. User selects text → clicks "Improve prompt" in context menu → sees improved result → can Replace or Copy.

## Commands

**Load Extension in Chrome:**
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/` folder (not the project root)

**Run Tests:**
```bash
npm test           # Run all Playwright tests
npm run test:popup # Run popup-specific tests
npm run test:overlay # Run overlay-specific tests
```

No build step required - this is a vanilla JS project with Vue 2 runtime (CSP-compatible).

## Architecture

```
extension/             → Production-ready extension (load this in Chrome)
  ├── manifest.json    → Extension config (permissions, entry points)
  ├── README.md        → Extension README
  ├── src/
  │   ├── background/  → Context menu, OpenRouter API calls, error handling
  │   ├── content/     → Selection capture, overlay injection, text replacement
  │   └── ui/
  │       ├── overlay/ → Draggable/resizable iframe overlay (Vue 2)
  │       └── popup/   → Settings dialog (Vue 2)
  └── vendor/          → Vue 2.7.16 runtime (CSP-compatible)

src/                   → Source files (mirrored to extension/)
docs/                  → Documentation
tests/                 → Playwright tests
.claude/               → Claude Code agent configurations
```

## Key Patterns

- **IIFE wrappers** on all scripts to avoid global scope pollution
- **Session tokens** via `crypto.getRandomValues()` for overlay security
- **Network calls** stay in `background.js` (content scripts can't make HTTPS)
- **Fallback copy** using `document.execCommand` when Clipboard API unavailable
- **Settings** stored in `chrome.storage.local`
- **Vue 2 Options API** for CSP compatibility (no eval in extension)

## Constants (background.js)

```
DEFAULT_MODEL = 'openrouter/auto'
DEFAULT_SYSTEM_PROMPT = 'You are a helpful prompt improver...'
REQUEST_TIMEOUT_MS = 15000
MAX_PROMPT_CHARS = 4000
MAX_RETRIES = 1
```

## Overlay Features

- **Draggable**: Grab the top area to move the overlay anywhere on screen
- **Resizable**: Grab the bottom-right corner to resize (min 280x200px)
- **Backdrop click**: Click outside to close
- **Escape key**: Close overlay
- **Typing effect**: Configurable speed (0 = instant)

## Development Notes

- Use plain JavaScript + Vue 2 Options API (no bundler, no TypeScript)
- Update `docs/current_status.md` and `docs/changelog.md` on behavior changes
- Handle error states: missing API key, empty selection, API errors, restricted pages
- Run `npm test` before committing to verify tests pass

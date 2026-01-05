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

No build step required - this is a vanilla JS project with Vue 3 runtime.

## Architecture

```
extension/             → Production-ready extension (load this in Chrome)
  ├── manifest.json    → Extension config (permissions, entry points)
  ├── src/
  │   ├── background/  → Context menu, OpenRouter API calls, error handling
  │   ├── content/     → Selection capture, overlay injection, text replacement
  │   └── ui/
  │       ├── overlay/ → Vue 3 overlay (typing effect, Replace/Copy actions)
  │       └── popup/   → Vue 3 settings (API key, model, system prompt, typing speed)
  └── vendor/          → Vue 3 runtime (no build, CDN-style)

src/                   → Source files (synced to extension/)
docs/                  → Documentation
tests/                 → Playwright tests
```

## Key Patterns

- **IIFE wrappers** on all scripts to avoid global scope pollution
- **Session tokens** via `crypto.getRandomValues()` for overlay security
- **Network calls** stay in `background.js` (content scripts can't make HTTPS)
- **Fallback copy** using `document.execCommand` when Clipboard API unavailable
- **Settings** stored in `chrome.storage.local`

## Constants (background.js)

```
DEFAULT_MODEL = 'openrouter/auto'
DEFAULT_SYSTEM_PROMPT = 'You are a helpful prompt improver...'
REQUEST_TIMEOUT_MS = 15000
MAX_PROMPT_CHARS = 4000
MAX_RETRIES = 1
```

## Development Notes

- Use plain JavaScript + Vue 3 runtime (no bundler, no TypeScript)
- Update `docs/current_status.md` and `docs/changelog.md` on behavior changes
- Handle error states: missing API key, empty selection, API errors, restricted pages

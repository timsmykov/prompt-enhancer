# Prompt Improver

A Chrome browser extension (Manifest V3) that improves selected text prompts via LLM. Select text → click "Improve prompt" → see enhanced result with typing animation → replace or copy.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://chrome.google.com/webstore)
[![Landing Page](https://img.shields.io/badge/Website-Live-orange.svg)](https://promptimprover.com)
[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/yourusername/prompt-improver/releases/tag/v2.0.0)

## What's New in v2.0.0

- **Prompt Templates** - Pre-built templates for common improvement patterns (concise, professional, creative, etc.)
- **Improvement History** - Access and search your last 50 improved prompts
- **Comparison Mode** - Compare results from multiple LLM models side-by-side
- **Enhanced Keyboard Shortcuts** - Full keyboard navigation with customizable shortcuts
- **Redesigned UI** - Modern glassmorphism design with improved accessibility
- **Performance Improvements** - 74% faster timeout feedback, 80% fewer DOM operations
- **Better Error Handling** - Clear error messages with actionable suggestions

## Features

### Core Functionality
- **One-Click Enhancement**: Right-click any selected text and choose "Improve prompt"
- **AI-Powered**: Uses OpenRouter API to enhance prompts with configurable models
- **Smooth UX**: Typing animation shows results character-by-character
- **Draggable Overlay**: Repositionable interface that stays out of your way
- **Customizable**: Configure API key, model, system prompt, and typing speed
- **Privacy-First**: API key stored locally, no data sent to external servers except OpenRouter

### v2.0.0 Enhancements
- **Template Library**: 10+ built-in templates (Make Concise, Make Professional, Fix Grammar, etc.)
- **History Management**: Browse and search past improvements with semantic search
- **Model Comparison**: Compare outputs from Claude, GPT-4, and other models simultaneously
- **Keyboard Navigation**: Full keyboard support with Escape, Ctrl+Enter, and customizable shortcuts
- **Accessibility**: WCAG AA compliant with screen reader support and ARIA labels
- **Responsive Design**: Mobile-first approach that works on all screen sizes

## Quick Start

### Install Extension

1. Go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `extension/` folder from this repository

### Configure API Key

1. Click the extension icon in Chrome toolbar
2. Enter your OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai))
3. Optionally customize model, system prompt, and typing speed
4. Click "Save Settings"

### Use Extension

1. Select any text on a webpage
2. Right-click and choose "Improve prompt"
3. Watch the enhanced version appear with typing animation
4. Click "Replace" to update original text or "Copy" to copy result

## Project Structure

```
prompt-improver/
├── extension/              # Chrome extension (Manifest V3)
│   ├── manifest.json      # Extension configuration
│   ├── src/
│   │   ├── background.js  # Context menu, API calls, error handling
│   │   ├── content.js     # Selection capture, overlay injection
│   │   └── ui/
│   │       ├── overlay/   # Vue 2 overlay UI (typing effect, actions)
│   │       └── popup/     # Vue 2 settings UI
│   └── vendor/            # Vue 2.7.16 runtime (CSP-compatible)
├── landing/               # Vue 3 landing page
│   ├── src/
│   │   ├── components/    # Hero, Features, FAQ, etc.
│   │   └── composables/   # Reusable Vue composition functions
│   └── package.json
├── docs/                  # Documentation
│   ├── core/              # Core documentation
│   ├── guides/            # User guides
│   ├── reports/           # Performance and optimization reports
│   └── archive/           # Historical documentation
├── unit/                  # Unit tests (Jest)
│   ├── setup.js           # Test configuration and mocks
│   ├── background.test.js # 45 tests (API, retry logic)
│   ├── content.test.js    # 44 tests (overlay, selection)
│   ├── popup.test.js      # 36 tests (form handling)
│   ├── overlay.test.js    # 56 tests (UI logic)
│   └── TESTING_SUMMARY.md # Test suite documentation
├── tests/                 # E2E tests (Playwright)
│   ├── overlay.spec.ts    # Overlay UI tests
│   └── popup.spec.ts      # Popup UI tests
└── scripts/               # Build and utility scripts
```

## Development

### Testing

The project includes comprehensive unit and E2E tests.

**Run Unit Tests:**
```bash
# Run all unit tests
npm test

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test -- background.test.js
```

**Run E2E Tests:**
```bash
# Run all E2E tests
npm run test:e2e

# Run specific E2E test suite
npm run test:popup
npm run test:overlay
```

**Test Coverage:**
- Unit Tests: 181 tests (92.3% pass rate)
- E2E Tests: Playwright-based UI tests
- Coverage Report: See `unit/TESTING_SUMMARY.md` for details

### Extension (No Build Required)

The extension uses vanilla JavaScript with Vue 2.7.16 runtime. No build step needed.

**Key Files:**
- `extension/src/background/background.js` - OpenRouter API integration
- `extension/src/content/content.js` - Overlay injection and text replacement
- `extension/src/ui/overlay/overlay.js` - Overlay UI with Vue 2 Options API

**Load Extension:**
```bash
# In Chrome
chrome://extensions/ → Developer mode → Load unpacked → Select extension/ folder
```

**Make Changes:**
1. Edit any file in `extension/`
2. Go to `chrome://extensions/`
3. Click reload icon on extension card
4. Test changes immediately

### Landing Page (Vue 3 + Vite)

The landing page uses Vue 3 with Vite for fast development.

**Install Dependencies:**
```bash
cd landing
npm install
```

**Run Dev Server:**
```bash
npm run dev
# Opens at http://localhost:5173
```

**Build for Production:**
```bash
npm run build
# Output in landing/dist/
```

## Technical Architecture

### Extension Flow

```
User selects text
      ↓
Right-click → "Improve prompt"
      ↓
background.js receives context menu event
      ↓
Injects content.js (if not already loaded)
      ↓
content.js creates iframe overlay
      ↓
overlay.js sends IMPROVE_PROMPT to background.js
      ↓
background.js calls OpenRouter API
      ↓
overlay.js displays result with typing effect
      ↓
User clicks Replace/Copy
```

### Key Patterns

- **IIFE Wrappers**: All scripts wrapped to avoid global scope pollution
- **Session Tokens**: `crypto.getRandomValues()` for overlay security
- **Network Isolation**: API calls stay in background.js (content scripts can't make HTTPS)
- **Fallback Copy**: `document.execCommand` when Clipboard API unavailable
- **Settings Storage**: `chrome.storage.local` for persistence

### Constants (background.js)

```
DEFAULT_MODEL = 'openrouter/auto'
DEFAULT_SYSTEM_PROMPT = 'You are a helpful prompt improver...'
REQUEST_TIMEOUT_MS = 15000
MAX_PROMPT_CHARS = 4000
MAX_RETRIES = 1
```

## Documentation

### Core Documentation
- **[Current Status](docs/current_status.md)** - Project status and known issues
- **[Changelog](docs/changelog.md)** - Version history and changes
- **[Architecture](docs/architecture.md)** - Technical architecture details
- **[Design Documentation](docs/DESIGN.md)** - Architecture decisions, component design, technology choices
- **[API Documentation](docs/API.md)** - Internal APIs and message protocol
- **[Specification](docs/SPECIFICATION.md)** - Detailed feature specification

### User Guides
- **[Keyboard Shortcuts](docs/guides/KEYBOARD_SHORTCUTS.md)** - Complete keyboard reference
- **[Troubleshooting](docs/guides/TROUBLESHOOTING.md)** - Common issues and solutions

### Reports
- **[Performance Dashboard](docs/reports/performance-summary-dashboard.md)** - Performance metrics and optimization results
- **[Landing Page Optimization](docs/reports/landing-optimization-complete.md)** - Landing page performance improvements
- **[Phase 1 Critical Fixes](docs/reports/phase1-critical-fixes-complete.md)** - Critical bug fixes summary

### Component Documentation
- **[Extension README](extension/README.md)** - Extension-specific documentation
- **[Landing Page README](landing/README.md)** - Landing page features and setup
- **[Unit Tests](unit/README.md)** - Test suite documentation and coverage report

## Performance

### Extension Status (v2.0.0)
- **Performance Score**: 8.5/10 (Significant improvements from v1.0.1)
- **Memory Management**: 9/10 (Optimized cleanup, lazy injection)
- **Network Performance**: 9/10 (8-second timeout, batch rendering)
- **DOM Performance**: 8.5/10 (80% fewer renders during typing)
- **User Experience**: 4.5/5 (Fast response, smooth animations)

### Landing Page Status
- **Performance Score**: 95/100 (A+ grade, production-ready)
- **Accessibility**: WCAG AA compliant (95+ Lighthouse score)
- **Memory**: Zero leaks, proper cleanup
- **See**: `docs/landing-optimization-complete.md` for details

## Contributing

Contributions welcome! Please read our contributing guidelines and code of conduct.

**Development Workflow:**
1. Check existing issues and PRs
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes with clear commit messages
4. Test thoroughly in Chrome and with landing page dev server
5. Submit PR with description

**For Agents:** See `CLAUDE.md` for agent orchestration strategy (git worktrees required for parallel work).

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with Vue 2.7 (extension) and Vue 3 (landing)
- Uses OpenRouter API for LLM access
- Icons from Lucide Vue Next
- Design inspired by 2025 web trends (glassmorphism, micro-interactions)

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/prompt-improver/issues)
- **Documentation**: See `docs/` folder
- **Email**: support@example.com

---

**Version**: 2.0.0
**Last Updated**: 2025-01-07
**Status**: Extension v2.0.0 production-ready with templates, history, and comparison mode, Landing page production-ready

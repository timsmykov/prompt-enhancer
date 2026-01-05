# Changelog

All notable changes to the Prompt Improver extension.

## [Unreleased]

### Fixed
- Fixed critical memory leaks and race conditions in overlay lifecycle
- Memory leak: Removed resize listener on closeOverlay to prevent orphaned handlers
- Memory leak: Cleared typingTimer and toastTimer on close to prevent orphaned timeouts
- Memory leak: Cleared pendingSelectionText on close to prevent stale state
- Race condition: Always generate new session token on each overlay open for security
- First-load bug: Fixed token validation in OVERLAY_INIT to prevent SELECTION_TEXT rejection

## [1.0.0] - 2026-01-06

### Added
- Draggable overlay: grab top area to move overlay anywhere on screen
- Resizable overlay: grab bottom-right corner to resize (min 280x200px)
- Frame state management for position/size sync between iframe and parent
- Pointer Events with requestAnimationFrame for smooth 60fps drag/resize
- Overlay metrics tracking (left, top, width, height)
- Flexbox layout for proper content sizing in overlay
- User-select prevention during drag/resize operations
- `data-resizing` and `data-dragging` attributes for visual feedback
- Playwright test suite (12 tests passing)
- Claude Code agent configurations (.claude/agents/)

### Changed
- Replaced options page with popup-based settings (click toolbar icon)
- Migrated from Vue 3 Composition API to Vue 2 Options API for CSP compatibility
- Moved all extension files to `extension/` folder for clean Chrome loading
- Separated development files (tests, docs, configs) from production extension
- Refactored overlay messaging with session token validation

### Fixed
- Auto-close on resize end by stopping event propagation
- Race condition in overlay metrics handling
- Console errors from Vue loading in restricted contexts

### Removed
- Duplicate options page (replaced with popup)
- Unused src/ui/options/ directory

## [0.5.0] - 2026-01-05

### Added
- Initial MVP overlay UI with Vue 3 runtime
- Context menu integration ("Improve prompt")
- OpenRouter API integration
- Typing effect for result display
- Configurable typing speed (0 = instant)
- Copy to clipboard functionality
- Replace selected text functionality
- Regenerate prompt functionality
- Error handling for API calls, missing API key, empty selection
- Settings page (API key, model, system prompt, typing speed)
- Chrome storage for settings persistence
- Badge error for restricted pages (chrome://, Web Store)

### Changed
- Simplified project structure with extension/ folder
- Cleaned up unnecessary files

## Architecture

- **extension/**: Production-ready extension (load in Chrome)
- **src/**: Source files (mirrored to extension/)
- **tests/**: Playwright tests
- **docs/**: Documentation

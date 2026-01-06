# Changelog

## Unreleased

## [1.0.1] - 2026-01-06
### Fixed
- **Overlay button functionality**: Close (×) and Replace buttons now work correctly. Fixed by (1) reordering event listeners in content.js so `window.addEventListener('message', ...)` is registered before `chrome.runtime.onMessage.addListener` to ensure proper token synchronization, and (2) improving token validation logic to check `event.data.token` existence first.
- **Textarea scroll during generation**: Users can now scroll the result textarea during text typing animation. Fixed by preserving scroll position during typing state instead of resetting to top on every render.
- **postMessage origin validation**: Fixed iframe-to-parent communication by using `event.source` verification instead of relying on `event.origin` which returns the page's origin, not the extension origin.

## v1.0.0 - Initial Release
- Initial documentation scaffold.
- Added MVP overlay and options UI layout with Vue 3 runtime.
- Implemented manifest, content script injection, context menu, and OpenRouter API wiring.
- Improved overlay selection handling, close/escape UX, and copy feedback.
- Added timeouts, retries, and prompt length validation to provider calls.
- Added typing effect for results and configurable typing speed in settings.
- Hardened overlay messaging with session token checks.
- Added toolbar click to open Options and badge error for restricted pages.
- Set toolbar click to open Options UI in a tab.
- Normalized provider error formatting and truncated API error details.

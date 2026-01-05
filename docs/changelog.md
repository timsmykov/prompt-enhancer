# Changelog

## Unreleased
- Organized extension files into `extension/` folder for cleaner Chrome loading.
- Separated development files (tests, docs, configs) from production extension.
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

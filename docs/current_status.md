# Current Status

## Summary
- Extension files organized in `extension/` folder for clean Chrome loading.
- MVP overlay/options UI wired to background and content scripts.
- Overlay now preserves selection for Replace, supports close/escape, and shows copy feedback.
- Background API calls now include timeouts, retries, and input validation.
- Added typing effect for improved text with configurable speed in Settings.
- Overlay messaging now includes a session token to prevent spoofing.
- Toolbar icon now opens Options in a tab; restricted pages show a badge error.

## Project Structure
- `extension/` - Production-ready extension (load this folder in Chrome)
- `src/` - Source files (mirrored in extension/)
- `docs/` - Documentation
- `tests/` - Playwright tests

## In Progress
- None.

## Next Steps
- Frontend: manual test the overlay flow end-to-end in Chrome.
- Frontend: verify selection replacement across inputs and contenteditable fields.
- Frontend: verify badge error on restricted pages (chrome://, Web Store).
- Frontend: verify toolbar icon opens Options page reliably.
- Add small QA checklist for MVP release.

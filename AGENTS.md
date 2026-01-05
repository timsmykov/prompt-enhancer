# AGENTS Instructions

## Scope
This repository is a browser extension MVP. Agents should keep changes minimal and aligned with the current MVP docs.

## Goals
- Keep the codebase simple, readable, and dependency‑light.
- Preserve the MVP flow: select text → improve → replace/copy.
- Update documentation in `docs/` as features evolve.

## Architecture Sources
- Architecture: `docs/architecture.md`
- Specification: `SPECIFICATION.md`
- Current status: `docs/current_status.md`

## Development Rules
- Use plain JavaScript (ES6+) and Vue 3 runtime (no build step).
- Avoid adding frameworks or heavy dependencies.
- Keep network calls in `src/background/background.js`.
- Use `chrome.storage.local` for settings only.
- Always handle error states: missing key, empty selection, API error.

## Files and Responsibilities
- `manifest.json`: extension metadata and permissions.
- `src/background/background.js`: API calls, provider logic, error handling.
- `src/content/content.js`: overlay injection and text replacement.
- `src/ui/overlay/*`: user interaction and display.
- `src/ui/options/*`: settings UI and persistence.

## Documentation Updates
When changing behavior, update:
- `docs/current_status.md` (summary + next steps)
- `docs/changelog.md` (unreleased changes)

## Git Hygiene
- Do not remove existing files unless explicitly asked.
- Keep commits small and descriptive.
- Avoid committing system files (`.DS_Store`).

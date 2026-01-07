# Project Structure Overview

Complete overview of the Prompt Improver extension project structure and organization.

## Directory Structure

```
prompt-improver/
├── extension/                    # Chrome Browser Extension
│   ├── manifest.json            # Extension manifest (Manifest V3)
│   ├── src/
│   │   ├── background.js        # Service worker (API calls, context menu)
│   │   ├── content.js           # Content script (overlay injection, selection)
│   │   └── ui/
│   │       ├── overlay/         # Overlay UI (Vue 2)
│   │       │   ├── overlay.html
│   │       │   ├── overlay.css
│   │       │   └── overlay.js
│   │       └── popup/           # Settings popup (Vue 2)
│   │           ├── popup.html
│   │           ├── popup.css
│   │           └── popup.js
│   └── vendor/                  # Vue 2.7.16 runtime
│       └── vue.global.prod.js
│
├── landing/                      # Vue 3 Landing Page
│   ├── src/
│   │   ├── components/          # Vue components
│   │   │   ├── Hero.vue
│   │   │   ├── Features.vue
│   │   │   ├── HowItWorks.vue
│   │   │   ├── BeforeAfter.vue
│   │   │   ├── Testimonials.vue
│   │   │   ├── FAQ.vue
│   │   │   ├── FinalCTA.vue
│   │   │   ├── Footer.vue
│   │   │   ├── LiveDemo.vue
│   │   │   └── LoadingSpinner.vue
│   │   ├── composables/         # Vue composition functions
│   │   ├── App.vue
│   │   └── main.js
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── docs/                         # Documentation
│   ├── README.md                # Documentation index
│   ├── current_status.md        # Project status and metrics
│   ├── changelog.md             # Version history
│   ├── architecture.md          # Technical architecture
│   ├── DESIGN.md                # Design decisions
│   ├── API.md                   # Internal API documentation
│   ├── SPECIFICATION.md         # Feature specification
│   ├── guides/                  # User guides
│   │   ├── README.md
│   │   ├── KEYBOARD_SHORTCUTS.md
│   │   └── TROUBLESHOOTING.md
│   ├── reports/                 # Performance reports
│   │   ├── README.md
│   │   ├── performance-summary-dashboard.md
│   │   ├── landing-optimization-complete.md
│   │   ├── landing-optimization-plan.md
│   │   └── phase1-critical-fixes-complete.md
│   └── archive/                 # Historical documentation
│       ├── README.md
│       └── *.md                 # Historical reports
│
├── unit/                         # Unit Tests (Jest)
│   ├── README.md                # Test documentation
│   ├── TESTING_SUMMARY.md       # Comprehensive test report
│   ├── setup.js                 # Test configuration and mocks
│   ├── background.test.js       # 45 tests (API, retry logic)
│   ├── content.test.js          # 44 tests (overlay, selection)
│   ├── popup.test.js            # 36 tests (form handling)
│   └── overlay.test.js          # 56 tests (UI logic)
│
├── tests/                        # E2E Tests (Playwright)
│   ├── overlay.spec.ts          # Overlay UI tests
│   └── popup.spec.ts            # Popup UI tests
│
├── scripts/                      # Build and utility scripts
│
├── .gitignore                   # Git ignore rules
├── .claude/                      # Claude Code agents
├── .auto-claude/                 # Auto-claude data
├── jest.config.js               # Jest configuration
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Root package.json
├── package-lock.json            # Dependency lock file
├── CLAUDE.md                    # Claude Code instructions
├── README.md                    # Project README
└── .mcp.json                    # MCP configuration
```

## File Organization Principles

### 1. **Clear Separation of Concerns**
- `extension/` - Browser extension code
- `landing/` - Marketing website
- `unit/` - Unit tests
- `tests/` - E2E tests
- `docs/` - All documentation

### 2. **Documentation Structure**
- **Core docs** (in `docs/` root) - Architecture, API, specification
- **Guides** (in `docs/guides/`) - User-facing documentation
- **Reports** (in `docs/reports/`) - Performance and optimization reports
- **Archive** (in `docs/archive/`) - Historical documentation

### 3. **Testing Organization**
- `unit/` - Jest-based unit tests for JavaScript modules
- `tests/` - Playwright-based E2E tests for UI components
- Clear separation between unit and integration tests

### 4. **Configuration Files**
- Root level - Project-wide config (package.json, jest.config.js)
- Component level - Component-specific config (landing/vite.config.js)

## Key Files by Purpose

### Development Setup
- `package.json` - Dependencies and scripts
- `README.md` - Project overview and quick start
- `CLAUDE.md` - Agent orchestration rules

### Extension Files
- `extension/manifest.json` - Extension configuration
- `extension/src/background.js` - API integration
- `extension/src/content.js` - Overlay management
- `extension/src/ui/overlay/overlay.js` - Overlay UI logic
- `extension/src/ui/popup/popup.js` - Settings UI logic

### Landing Page Files
- `landing/src/App.vue` - Root Vue component
- `landing/src/main.js` - App entry point
- `landing/vite.config.js` - Vite configuration
- `landing/package.json` - Landing page dependencies

### Testing Files
- `jest.config.js` - Jest configuration
- `playwright.config.ts` - Playwright configuration
- `unit/setup.js` - Test mocks and setup
- `unit/*.test.js` - Unit test suites
- `tests/*.spec.ts` - E2E test suites

### Documentation Files
- `docs/architecture.md` - Technical architecture
- `docs/API.md` - Internal API documentation
- `docs/SPECIFICATION.md` - Feature specification
- `docs/guides/TROUBLESHOOTING.md` - User troubleshooting guide
- `unit/TESTING_SUMMARY.md` - Test suite documentation

## Naming Conventions

### Directories
- **Lowercase** with hyphens: `landing-page/`, `test-results/`
- **Plural** for collections: `components/`, `tests/`, `guides/`
- **Descriptive** names: `extension/`, `documentation/`, `scripts/`

### Files
- **Lowercase** with hyphens: `background.js`, `overlay.spec.ts`
- **Descriptive** names: `KEYBOARD_SHORTCUTS.md`, `TESTING_SUMMARY.md`
- **Component files** use PascalCase for Vue: `Hero.vue`, `Features.vue`
- **Test files** match source: `background.test.js`, `overlay.spec.ts`

### Documentation
- **UPPERCASE** for major guides: `README.md`, `DESIGN.md`, `API.md`
- **kebab-case** for specific docs: `keyboard-shortcuts.md`, `troubleshooting.md`
- **Dates** in archived reports: `performance-audit-report-2025-01-07.md`

## Git Strategy

### Tracked Files
- Source code (extension/, landing/)
- Tests (unit/, tests/)
- Documentation (docs/, README.md)
- Configuration (*.json, *.config.js, .gitignore)

### Ignored Files
- Dependencies (node_modules/)
- Build artifacts (dist/, build/, coverage/)
- Test artifacts (test-results/, playwright-report/)
- Environment files (.env, .env.local)
- IDE files (.vscode/, .idea/)
- OS files (.DS_Store, Thumbs.db)
- Auto-generated files (*.log, .cache/)

## Adding New Files

### When Adding Source Code
1. Place in appropriate directory (`extension/`, `landing/`)
2. Follow naming conventions
3. Add corresponding tests in `unit/` or `tests/`
4. Update documentation if needed

### When Adding Tests
1. Unit tests go in `unit/` with `.test.js` extension
2. E2E tests go in `tests/` with `.spec.ts` extension
3. Update `unit/README.md` or `TESTING_SUMMARY.md`

### When Adding Documentation
1. Core docs in `docs/` root
2. User guides in `docs/guides/`
3. Reports in `docs/reports/`
4. Update `docs/README.md`

## Quick Reference

| What You Want to Do | Where to Look |
|---------------------|---------------|
| Install extension | `README.md` → Quick Start |
| Configure API key | `docs/guides/TROUBLESHOOTING.md` |
| Understand architecture | `docs/architecture.md` |
| Add new feature | `CLAUDE.md` → Development Workflow |
| Run tests | `README.md` → Development → Testing |
| Fix a bug | `docs/guides/TROUBLESHOOTING.md` |
| Review API docs | `docs/API.md` |
| Check performance | `docs/reports/performance-summary-dashboard.md` |
| View test coverage | `unit/TESTING_SUMMARY.md` |

## Maintenance

### Regular Updates
- `docs/current_status.md` - Update as project progresses
- `docs/changelog.md` - Add entries for each change
- `README.md` - Keep quick start current

### Archive Strategy
- Move outdated reports to `docs/archive/`
- Keep archive organized by date
- Update `docs/archive/README.md`

### Documentation Standards
- Clear, concise language
- Code examples where helpful
- Up-to-date information
- Cross-references to related docs

---

**Last Updated**: 2025-01-07
**Project Version**: 2.0.0
**Status**: Production-ready

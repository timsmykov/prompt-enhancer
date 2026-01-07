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

No build step required - this is a vanilla JS project with Vue 2.7.16 runtime (CSP-compatible).

## Architecture

```
manifest.json          → Extension config (permissions, entry points)
├── background.js      → Context menu, OpenRouter API calls, error handling
├── content.js         → Selection capture, overlay injection, text replacement
├── ui/
│   ├── overlay/       → Vue 2 overlay (typing effect, Replace/Copy actions)
│   └── popup/         → Vue 2 settings (API key, model, system prompt, typing speed)
└── vendor/            → Vue 2.7.16 runtime (no build, CDN-style)
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

- Use plain JavaScript + Vue 2 Options API (no bundler, no TypeScript)
- Update `docs/current_status.md` and `docs/changelog.md` on behavior changes
- Handle error states: missing API key, empty selection, API errors, restricted pages

## Agent Orchestration Strategy

**CRITICAL RULE: ALWAYS use git worktrees when launching multiple agents in parallel!**

### When to Create Git Worktrees

**MANDATORY: Create separate git worktrees BEFORE launching agents when:**
1. **Multiple agents will MODIFY files** (even different files)
2. **Agents work on different components/modules** (e.g., Hero, Features, FAQ)
3. **Any risk of file conflicts** (editing same files, shared dependencies)
4. **Agents need write access** to codebase

**NOT NEEDED: Worktrees optional when:**
1. **Read-only operations** (code-reviewer, security-auditor, vue-planner)
2. **Separate output files** (docs-writer, changelog-agent)
3. **Single agent only** (no parallel execution)

### Worktree Creation Workflow

**STEP 1: Create feature branches**
```bash
git checkout -b feature/component-a
git checkout -b feature/component-b
git checkout -b feature/component-c
```

**STEP 2: Create worktrees**
```bash
git worktree add ../worktree-a feature/component-a
git worktree add ../worktree-b feature/component-b
git worktree add ../worktree-c feature/component-c
```

**STEP 3: Launch agents in parallel (ONE message)**
```
Task(agent-type) → Task description
  → Working directory: ../worktree-a

Task(agent-type) → Task description
  → Working directory: ../worktree-b

Task(agent-type) → Task description
  → Working directory: ../worktree-c
```

**STEP 4: After agents complete**
```bash
# Merge all worktrees
git checkout main
git merge feature/component-a
git merge feature/component-b
git merge feature/component-c

# Cleanup worktrees
git worktree remove ../worktree-a
git worktree remove ../worktree-b
git worktree remove ../worktree-c
```

### Complete Example

**User Request:** "Build landing page with Hero, Features, FAQ components"

**Execution:**
```bash
# 1. Create branches
git checkout -b feature/landing-hero
git checkout -b feature/landing-features
git checkout -b feature/landing-faq

# 2. Create worktrees
git worktree add ../worktree-hero feature/landing-hero
git worktree add ../worktree-features feature/landing-features
git worktree add ../worktree-faq feature/landing-faq

# 3. Launch agents IN ONE MESSAGE
Task(vue-expert) → Build Hero.vue component with typing animation
  → Working directory: ../worktree-hero

Task(vue-expert) → Build Features.vue component with grid layout
  → Working directory: ../worktree-features

Task(vue-expert) → Build FAQ.vue component with accordion
  → Working directory: ../worktree-faq

# 4. After completion, merge
git checkout main
git merge feature/landing-hero
git merge feature/landing-features
git merge feature/landing-faq

# 5. Cleanup
git worktree remove ../worktree-hero
git worktree remove ../worktree-features
git worktree remove ../worktree-faq
```

### Agent Selection Guide

| Task | Agent | Worktree Needed? |
|------|-------|------------------|
| **Vue components** | vue-expert | ✅ YES (if parallel) |
| **CSS styling** | css-stylist | ✅ YES (if parallel) |
| **JavaScript logic** | javascript-pro | ✅ YES (if parallel) |
| **Bug fixing** | tester-debugger | ✅ YES (if parallel) |
| **Code review** | code-reviewer | ❌ No (read-only) |
| **Security audit** | security-auditor | ❌ No (read-only) |
| **Documentation** | docs-writer | ⚠️ Optional (separate files) |
| **Testing** | frontend-tester | ⚠️ Optional (if tests don't conflict) |

### Non-Negotiable Rules

1. **Multiple agents modifying files? → CREATE WORKTREES**
2. **ALWAYS launch parallel agents in ONE message**
3. **Each agent gets its own worktree**
4. **Never run multiple agents in same directory**
5. **Merge worktrees after completion**
6. **Cleanup worktrees after merge**

**Why This Matters:**
- ❌ Without worktrees: File conflicts, race conditions, broken state
- ✅ With worktrees: Clean parallel execution, 3-5x faster, zero conflicts

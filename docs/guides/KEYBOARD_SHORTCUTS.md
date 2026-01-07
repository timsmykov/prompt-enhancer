# Keyboard Shortcuts Reference

**Version:** 2.0.0  
**Last Updated:** 2025-01-07

## Table of Contents

1. [Overlay Shortcuts](#overlay-shortcuts)
2. [Popup Shortcuts](#popup-shortcuts)
3. [Context Menu Shortcuts](#context-menu-shortcuts)
4. [Conflicting Shortcuts](#conflicting-shortcuts)
5. [Customization](#customization)

---

## Overlay Shortcuts

The overlay is the main interface where you view and interact with improved prompts.

### Global Shortcuts

| Shortcut | Action | Availability |
|----------|--------|--------------|
| `Escape` | Close overlay | Always available |
| `Ctrl/Cmd + .` | Toggle focus between original and result | When both panels visible |

### Action Shortcuts

| Shortcut | Action | Availability |
|----------|--------|--------------|
| `Ctrl/Cmd + Enter` | Regenerate improvement | When status is ready/error |
| `Ctrl/Cmd + Shift + C` | Copy result to clipboard | When result is ready |
| `Ctrl/Cmd + Shift + R` | Replace original text | When result is ready |
| `Ctrl/Cmd + H` | Toggle original panel | When original text exists |

### Navigation Shortcuts

| Shortcut | Action | Availability |
|----------|--------|--------------|
| `Tab` | Focus next button | Always available |
| `Shift + Tab` | Focus previous button | Always available |
| `Space` / `Enter` | Activate focused button | When button is focused |

---

## Popup Shortcuts

The popup (settings window) is accessed by clicking the extension icon in the Chrome toolbar.

### Form Navigation

| Shortcut | Action | Availability |
|----------|--------|--------------|
| `Tab` | Focus next form field | Always available |
| `Shift + Tab` | Focus previous form field | Always available |
| `Enter` | Submit form (save settings) | When any field is focused |
| `Escape` | Close popup | Always available |

---

## Conflicting Shortcuts

We intentionally avoid shortcuts that conflict with popular applications and browser defaults.

### Avoided Shortcuts

| Shortcut | Reason | Alternative |
|----------|--------|-------------|
| `Ctrl/Cmd + S` | Standard "Save" in many apps | Use `Enter` in popup |
| `Ctrl/Cmd + W` | Closes tab/window | Use `Escape` in overlay |
| `Ctrl/Cmd + N` | Opens new window/tab | Not used |
| `Ctrl/Cmd + T` | Opens new tab | Not used |

---

## Customization

### Planned Customization (v2.1.0)

We plan to add keyboard shortcut customization in a future release.

**Settings Location:**  
Popup → Advanced → Keyboard Shortcuts

**Customization Options:**
- Remap all overlay shortcuts
- Disable specific shortcuts
- Create custom shortcut combinations
- Import/export shortcut profiles

---

## Accessibility Notes

### Screen Reader Support

All keyboard shortcuts are announced to screen readers:
- Focus Indicators: Visual focus rings on all interactive elements
- ARIA Labels: All buttons have descriptive aria-label attributes
- Status Announcements: Status changes announced via aria-live regions
- Keyboard Traps: None - you can always exit with Escape

### Keyboard-Only Usage

The entire extension can be used without a mouse:
1. Select text → Hold `Shift` + Arrow keys
2. Open context menu → `Shift + F10`
3. Navigate to "Improve prompt" → Arrow keys + `Enter`
4. Close overlay → `Escape`
5. Copy result → `Ctrl/Cmd + Shift + C`
6. Replace text → `Ctrl/Cmd + Shift + R`

---

## Tips and Tricks

### Power User Shortcuts

**Rapid Workflow:**
1. Select text → `Shift + F10` → `I` → `Enter`
2. Wait for improvement → `Ctrl/Cmd + Shift + R` (replace)
3. Continue working

**Comparison Workflow:**
1. Improve prompt → `Ctrl/Cmd + H` (show original)
2. Compare side-by-side → `Tab` between panels
3. `Escape` to close

### Keyboard Shortcut Mnemonics

- **H** → **H**ide/Show original
- **R** → **R**egenerate
- **C** → **C**opy
- **Escape** → Escape from overlay
- **Enter** → Submit form / Regenerate

---

**Last Updated:** 2025-01-07  
**Version:** 2.0.0  
**Maintainer:** Prompt Improver Team

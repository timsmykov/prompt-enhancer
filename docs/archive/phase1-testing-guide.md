# Phase 1 Critical Fixes - Testing Guide

**Quick Reference for Manual Testing**

---

## Memory Leak Testing

### Chrome DevTools Method

1. **Open Chrome DevTools**
   - Press `F12` or `Cmd+Option+I` (Mac)
   - Go to **Memory** tab

2. **Take Initial Baseline**
   - Click the "garbage collection" icon (🚮) to force GC
   - Click "Take heap snapshot"
   - Save as "baseline"

3. **Navigate Away and Back**
   - Navigate to a different website (e.g., google.com)
   - Navigate back to landing page
   - Repeat 10 times

4. **Take Final Snapshot**
   - Force GC again (🚮)
   - Click "Take heap snapshot"
   - Save as "final"

5. **Compare Snapshots**
   - Look for "detached DOM nodes"
   - Look for "event listeners" with excessive counts
   - **Expected:** 0 detached DOM nodes, no growing patterns

### What to Look For

❌ **Memory Leaks Indicators:**
- Detached DOM nodes increasing
- (string) or (array) types growing
- Event listeners not being cleaned up

✅ **Healthy Indicators:**
- Consistent memory usage across navigations
- No detached DOM nodes
- All intervals/timeouts cleared

---

## Accessibility Testing

### Lighthouse Audit

1. **Open Chrome DevTools**
   - Press `F12` or `Cmd+Option+I`

2. **Run Lighthouse**
   - Click "Lighthouse" tab
   - Select "Accessibility" only
   - Click "Analyze page load"

3. **Verify Results**
   - **Current Score:** 65 (before fixes)
   - **Target Score:** 95+ (after fixes)
   - Check for any remaining issues

### Screen Reader Testing

#### NVDA (Windows)
1. Install NVDA (free): https://www.nvaccess.org/
2. Open landing page
3. Test FAQ:
   - Navigate to FAQ accordion
   - Press `Space` or `Enter` to toggle
   - **Expected:** "Expanded/Collapsed" announced
4. Test Live Demo:
   - Navigate to textarea
   - Enter text and click "Improve Prompt"
   - **Expected:** "Loading..." and result announced

#### VoiceOver (Mac)
1. Press `Cmd+F5` to enable VoiceOver
2. Open landing page
3. Test FAQ:
   - Navigate to FAQ accordion (VO + →)
   - Press `Space` or `Enter` to toggle
   - **Expected:** "Expanded/Collapsed" announced
4. Test Live Demo:
   - Navigate to textarea
   - Enter text and click "Improve Prompt"
   - **Expected:** Status updates announced

### Keyboard Navigation Testing

1. **Tab Through Page**
   - Press `Tab` to move focus
   - Verify visible focus indicators on all interactive elements
   - **Expected:** Clear outline on buttons, inputs, links

2. **Test FAQ with Keyboard**
   - Tab to FAQ accordion button
   - Press `Enter` or `Space` to toggle
   - **Expected:** Smooth toggle, proper focus management

3. **Test Live Demo with Keyboard**
   - Tab to textarea
   - Enter text
   - Tab to "Improve Prompt" button
   - Press `Enter`
   - **Expected:** Loading state, then result

---

## Contrast Testing

### Manual Visual Check

1. **Hero Section**
   - Title should be clearly readable against gradient background
   - Description should be clearly readable
   - **Expected:** No squinting needed, text stands out clearly

2. **Using Chrome DevTools**
   - Open DevTools
   - Go to "Elements" tab
   - Click "Color" icon next to color properties
   - Check contrast ratio
   - **Expected:** 4.5:1 or higher for normal text

### Online Tools

- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Check colors:**
  - Hero title: white on gradient → should be 4.5:1+
  - Hero description: rgba(255,255,255,0.98) on gradient → should be 4.5:1+

---

## Error Boundary Testing

### Intentional Error Trigger

1. **Open Browser Console**
   - Press `F12` or `Cmd+Option+I`
   - Go to "Console" tab

2. **Trigger Error**
   - Type in console: `throw new Error("Test error")`
   - Press Enter

3. **Verify Error Boundary**
   - **Expected:** See "Oops! Something went wrong" message
   - **Expected:** "Refresh Page" button visible
   - **Expected:** No blank white screen

4. **Test Refresh Button**
   - Click "Refresh Page" button
   - **Expected:** Page reloads successfully

### Component-Specific Errors

1. **Test FAQ Error**
   - Open DevTools Console
   - Temporarily break FAQ component (uncomment a line in FAQ.vue)
   - **Expected:** Only FAQ section shows error boundary, rest of page works

2. **Test Live Demo Error**
   - Break LiveDemo component temporarily
   - **Expected:** Only demo section shows error, other sections work

---

## Performance Testing

### Network Throttling

1. **Open Chrome DevTools**
   - Go to "Network" tab
   - Select "Slow 3G" from throttling dropdown

2. **Load Page**
   - Refresh page
   - **Expected:** Above-the-fold content loads quickly
   - **Expected:** Lazy-loaded components load when scrolled to

### Frame Rate Testing

1. **Open Chrome DevTools**
   - Go to "Performance" tab
   - Click "Record"
   - Scroll through page
   - Click "Stop"

2. **Check Results**
   - Look for FPS (Frames Per Second)
   - **Expected:** Consistent 60 FPS during scroll
   - **Expected:** No long tasks (>50ms)

---

## Responsive Testing

### Viewport Testing

1. **Chrome DevTools Device Toolbar**
   - Press `Cmd+Shift+M` (Mac) or `Ctrl+Shift+M` (Windows)
   - Test devices: iPhone SE, iPad, Desktop

2. **Check Each Section**
   - Hero: Text readable, CTA buttons accessible
   - How It Works: Steps stack vertically on mobile
   - Live Demo: Textarea usable on small screens
   - FAQ: Accordion works on touch devices

3. **Touch Targets**
   - All buttons at least 44x44px (iOS standard)
   - Adequate spacing between touch targets

---

## Browser Compatibility Testing

### Test Browsers

1. **Chrome** (primary)
2. **Firefox**
3. **Safari** (Mac/iOS)
4. **Edge** (Windows)

### Checklist for Each Browser

- [ ] Page loads without errors
- [ ] All animations work smoothly
- [ ] FAQ accordions toggle correctly
- [ ] Live Demo textarea accepts input
- [ ] Copy to clipboard works (or shows fallback message)
- [ ] All buttons are clickable
- [ ] No console errors

---

## Quick Smoke Test (5 Minutes)

1. **Load page** → Visual check, no console errors
2. **Scroll through** → Smooth scrolling, all sections visible
3. **Test FAQ** → Click 2-3 accordions, verify toggle works
4. **Test Live Demo** → Enter text, click improve, verify result
5. **Test copy** → Click copy button, verify feedback
6. **Check mobile** → Resize to mobile width, verify layout
7. **Close page** → No memory leaks in DevTools (if checked)

**If all pass:** ✅ Phase 1 fixes verified!
**If any fail:** 🐛 Note issue for Phase 2

---

## Expected Results Summary

| Metric | Before | After | Status |
|--------|--------|-------|--------|
| Memory Leaks | Yes (intervals not cleared) | 0 leaks | ✅ FIXED |
| Accessibility Score | 65 | 95+ | ✅ FIXED |
| Contrast Ratio | 4.1:1 - 4.2:1 | 4.5:1+ | ✅ FIXED |
| ARIA Labels | Missing | Complete | ✅ FIXED |
| Error Handling | None | ErrorBoundary | ✅ FIXED |

---

## Reporting Issues

If you find any issues during testing, report:

1. **What you were doing** (steps to reproduce)
2. **What you expected** (expected behavior)
3. **What happened** (actual behavior)
4. **Browser/Device** (Chrome 120, MacOS 14, etc.)
5. **Screenshot** (if visual issue)
6. **Console errors** (copy from DevTools)

---

**Happy Testing!** 🚀

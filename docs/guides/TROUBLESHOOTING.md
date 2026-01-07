# Troubleshooting Guide

**Version:** 2.0.0  
**Last Updated:** 2025-01-07

## Table of Contents

1. [Quick Diagnostics](#quick-diagnostics)
2. [Common Issues](#common-issues)
3. [Error Messages](#error-messages)
4. [Debug Mode](#debug-mode)
5. [Known Issues](#known-issues)
6. [Getting Help](#getting-help)

---

## Quick Diagnostics

Before diving into specific issues, run these quick checks:

### Diagnostic Checklist

- [ ] Extension icon visible in Chrome toolbar?
- [ ] "Improve prompt" appears in context menu?
- [ ] API key configured in settings?
- [ ] Internet connection working?
- [ ] OpenRouter API accessible?

### Quick Test

1. Select any text on a webpage
2. Right-click → "Improve prompt"
3. Check if overlay appears

**Result:**
- ✅ Overlay appears → See specific issue below
- ❌ No overlay → See "Extension Not Working" section
- ❌ "Improve prompt" missing → See "Context Menu Issues" section

---

## Common Issues

### Extension Not Working

**Symptoms:**
- No overlay appears when using "Improve prompt"
- Context menu option missing
- Extension icon not visible

**Solutions:**

1. **Check Extension Status**
   - Go to `chrome://extensions/`
   - Find "Prompt Improver" → Ensure enabled

2. **Reload Extension**
   - Go to `chrome://extensions/`
   - Click reload icon 🔄 on Prompt Improver card
   - Try again

3. **Check Permissions**
   - Go to `chrome://extensions/`
   - Click "Details" for Prompt Improver
   - Verify permissions: "Read and change data on all websites"

4. **Reinstall Extension**
   - Remove extension → Load unpacked → Select extension/ folder

---

### API Key Issues

**Symptoms:**
- "Missing API key" error
- "Invalid API key" error
- 401 Unauthorized errors

**Solutions:**

1. **Get API Key**
   - Visit [openrouter.ai](https://openrouter.ai)
   - Sign up / Log in
   - Copy API key from settings

2. **Enter API Key Correctly**
   - Click extension icon in toolbar
   - Paste API key (starts with `sk-or-`)
   - Ensure no extra spaces
   - Click "Save Settings"

3. **Verify API Key Valid**
   - Test key at [openrouter.ai/keys](https://openrouter.ai/keys)
   - Check key hasn't expired
   - Ensure key has credits/balance

---

### Overlay Not Appearing

**Symptoms:**
- "Improve prompt" works but no overlay
- Page flashes but nothing happens
- Overlay appears but immediately closes

**Solutions:**

1. **Check Restricted Pages**
   - Overlay doesn't work on: `chrome://`, `chrome-extension://`, Web Store
   - Test on regular webpage (e.g., wikipedia.org)

2. **Check Content Script Injection**
   - Open DevTools (F12) → Console
   - Select text → Right-click → "Improve prompt"
   - Look for: `[PromptImprover]` logs

3. **Check for CSP Conflicts**
   - Some sites block iframes
   - Look for CSP errors in console
   - Try on different website

---

### Typing Animation Issues

**Symptoms:**
- Typing too slow/fast
- Typing stutters
- Typing stops midway

**Solutions:**

1. **Adjust Typing Speed**
   - Click extension icon
   - Change "Typing Speed" setting
   - 0 = instant, 25 = default, 100 = very slow

2. **Check for Performance Issues**
   - Close other tabs
   - Check CPU usage in Task Manager
   - Disable heavy browser extensions

---

## Error Messages

### "Missing API key"

**Cause:** No API key configured

**Solution:**
1. Click extension icon
2. Enter OpenRouter API key
3. Save settings

---

### "Invalid API key"

**Cause:** API key format incorrect or key expired

**Solution:**
1. Verify key starts with `sk-or-`
2. Check for extra spaces/characters
3. Test key at [openrouter.ai](https://openrouter.ai)
4. Generate new key if needed

---

### "Background not available"

**Cause:** Service worker crashed or not loaded

**Solution:**
1. Go to `chrome://extensions/`
2. Click "Service worker" link under Prompt Improver
3. Check for errors in service worker console
4. Reload extension

---

### "Request timeout"

**Cause:** OpenRouter API took too long (>8 seconds)

**Solution:**
1. Check internet connection
2. Try again (temporary network issue)
3. Check OpenRouter status
4. Reduce prompt length (max 4000 chars)

---

### "Provider error"

**Cause:** OpenRouter API returned error

**Solution:**
1. Check error details in overlay
2. Verify API key has credits
3. Check model name (default: `openrouter/auto`)
4. Try simpler prompt

---

### "No text selected"

**Cause:** Empty selection when overlay opened

**Solution:**
1. Select text before right-clicking
2. Don't click away before "Improve prompt"
3. Ensure text is selectable (not in disabled input)

---

## Debug Mode

### Enable Debug Logging

**Method 1: Chrome Console**
1. Open any webpage
2. Open DevTools (F12) → Console tab
3. Select text → "Improve prompt"
4. Look for `[PromptImprover]` logs

**Method 2: Service Worker Console**
1. Go to `chrome://extensions/`
2. Find "Prompt Improver"
3. Click "Service worker" link
4. Check console for errors

### Debug Information to Collect

When reporting issues, include:

1. **Browser Info:**
   - Chrome version: `chrome://version/`
   - OS: Windows/Mac/Linux version
   - Extension version: `chrome://extensions/` → Prompt Improver

2. **Console Errors:**
   - Screenshot of console
   - Full error text
   - Stack traces

3. **Steps to Reproduce:**
   - What you did
   - What you expected
   - What actually happened

4. **Settings:**
   - Model: `openrouter/auto` or custom?
   - Typing speed: What value?
   - Any custom settings?

---

## Known Issues

### v2.0.0 Known Limitations

1. **Performance:**
   - Typing animation can be slow for long responses (>1000 chars)
   - Memory usage increases with multiple overlays (cleanup on close)
   - 8-second timeout can feel slow for complex prompts

2. **Compatibility:**
   - Doesn't work on `chrome://` pages
   - Doesn't work on Chrome Web Store
   - May conflict with websites with strict CSP
   - Doesn't work in PDFs

3. **UX:**
   - Only one overlay at a time
   - No undo/redo for replace action
   - Comparison mode can be slow on low-end devices

---

## Getting Help

### Self-Service Resources

1. **Documentation:**
   - [README.md](../README.md) - Project overview
   - [DESIGN.md](./DESIGN.md) - Technical design
   - [KEYBOARD_SHORTCUTS.md](./KEYBOARD_SHORTCUTS.md) - Keyboard reference

2. **GitHub Issues:**
   - Search existing issues
   - Check for known issues
   - Subscribe to issue updates

3. **Changelog:**
   - [changelog.md](./changelog.md) - Version history and fixes

### Community Support

1. **Discussions:**
   - GitHub Discussions
   - Ask questions, share tips

2. **Contributing:**
   - See CONTRIBUTING.md for guidelines
   - Submit bug reports with details
   - Submit pull requests for fixes

### Professional Support

**Email:** support@example.com  
**Response Time:** 1-2 business days

**Include in your message:**
- Chrome version and OS
- Extension version
- Detailed issue description
- Steps to reproduce
- Console errors (screenshots)

---

**Last Updated:** 2025-01-07  
**Version:** 2.0.0  
**Maintainer:** Prompt Improver Team

# 🔧 Prompt Enhancer Chrome Extension

A Chrome extension that enhances AI prompts with one click across multiple platforms.

## ✨ Features

- **Universal Compatibility** - Works with ChatGPT, Claude, Grok, Perplexity, and more
- **One-Click Enhancement** - Floating button appears next to input fields
- **Smart Detection** - Automatically finds prompt input areas
- **Modal Preview** - Shows original vs enhanced prompts before applying
- **Local Processing** - No data sent to external servers
- **Settings Panel** - Customizable options and preferences

## 🏗️ File Structure

```
extension/
├── manifest.json        # Extension configuration and permissions
├── content.js          # Main logic for detecting and enhancing prompts
├── popup.html          # Extension popup interface
├── popup.js            # Popup functionality and settings
├── popup.css           # Popup styling
└── README.md           # This file
```

## 🎯 Supported Platforms

| Platform | URL Pattern | Status |
|----------|-------------|--------|
| ChatGPT | `chat.openai.com/*`, `chatgpt.com/*` | ✅ Active |
| Claude | `claude.ai/*` | ✅ Active |
| Grok | `grok.x.ai/*`, `x.ai/*` | ✅ Active |
| Perplexity | `perplexity.ai/*` | ✅ Active |
| Google Bard | `bard.google.com/*` | ✅ Active |

## 🚀 Installation

### Development Mode
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" button
4. Select the `extension/` folder
5. The extension will be installed and active

### Production (Chrome Web Store)
1. Package the extension folder
2. Submit to Chrome Web Store
3. Wait for review and approval
4. Users can install from the store

## 🔧 How It Works

### 1. Content Script Injection
The extension injects `content.js` into supported AI platforms:

```javascript
// Automatically detects input fields
function findPromptInput() {
  const selectors = {
    'chatgpt.com': '#prompt-textarea, div[contenteditable="true"]',
    'claude.ai': 'div[contenteditable="true"], textarea',
    // ... more platforms
  };
  return document.querySelector(selectors[hostname]);
}
```

### 2. Button Insertion
A floating enhancement button is added next to detected input fields:

```javascript
function createEnhanceButton() {
  const button = document.createElement('button');
  button.className = 'prompt-enhancer-btn';
  button.innerHTML = '✨'; // Sparkle icon
  return button;
}
```

### 3. Prompt Enhancement
When clicked, the extension enhances the prompt:

```javascript
async function enhancePrompt(originalPrompt) {
  // Add structure, context, and clarity
  const enhanced = `${originalPrompt} Please provide a comprehensive, 
    well-structured response with detailed explanations...`;
  return enhanced;
}
```

### 4. Modal Display
Shows a comparison modal before applying changes:

```javascript
function showEnhancementModal(original, enhanced) {
  // Create modal with before/after comparison
  // Allow user to accept, reject, or regenerate
}
```

## ⚙️ Configuration

### Manifest.json
```json
{
  "manifest_version": 3,
  "name": "Prompt Enhancer",
  "version": "1.0.0",
  "permissions": ["activeTab", "storage"],
  "host_permissions": [
    "*://chat.openai.com/*",
    "*://claude.ai/*",
    // ... more platforms
  ]
}
```

### Content Script Matching
```json
"content_scripts": [{
  "matches": [
    "*://chat.openai.com/*",
    "*://claude.ai/*",
    "*://grok.x.ai/*",
    "*://perplexity.ai/*"
  ],
  "js": ["content.js"],
  "run_at": "document_end"
}]
```

## 🎨 Styling

### Platform-Specific Styles
The extension adapts to each platform's design:

```css
/* ChatGPT styling */
body[data-hostname="chatgpt.com"] .prompt-enhancer-btn {
  background: #10a37f;
}

/* Claude styling */
body[data-hostname="claude.ai"] .prompt-enhancer-btn {
  background: #ff6b35;
}
```

### Responsive Design
```css
.prompt-enhancer-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: absolute;
  right: 8px;
  bottom: 8px;
  transition: all 0.2s ease;
}
```

## 🔍 Detection Logic

### Input Field Detection
```javascript
const SELECTORS = {
  'chat.openai.com': '#prompt-textarea, div[contenteditable="true"]',
  'claude.ai': 'div[contenteditable="true"], textarea',
  'grok.x.ai': 'textarea[placeholder*="Ask"], div[contenteditable="true"]',
  'perplexity.ai': 'textarea[placeholder*="Ask"], textarea'
};
```

### Dynamic Content Handling
```javascript
// Handle SPA navigation and dynamic content
const observer = new MutationObserver((mutations) => {
  if (!document.querySelector('.prompt-enhancer-btn')) {
    insertEnhanceButton();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

## 📊 Features

### Popup Interface
- **Enhancement History** - View recent enhancements
- **Settings Panel** - Configure behavior and preferences
- **Statistics** - Track usage and improvements
- **Help & Support** - Documentation and contact info

### Enhancement Options
- **Basic Enhancement** - Add structure and clarity
- **Detailed Enhancement** - Include examples and context
- **Professional Enhancement** - Formal tone and comprehensive details
- **Creative Enhancement** - Encourage innovative responses

### Storage & Sync
```javascript
// Store user preferences
chrome.storage.local.set({
  enhancementStyle: 'detailed',
  autoEnhance: false,
  showStats: true
});
```

## 🛠️ Development

### Local Testing
```bash
# Load extension in Chrome
# Navigate to supported AI platform
# Test enhancement functionality
# Check console for errors
```

### Debugging
```javascript
console.log('🚀 Prompt Enhancer loaded');
console.log('Current URL:', window.location.href);
console.log('Input found:', promptInput);
```

### Error Handling
```javascript
try {
  const enhanced = await enhancePrompt(original);
  showEnhancementModal(original, enhanced);
} catch (error) {
  console.error('Enhancement failed:', error);
  showErrorMessage('Enhancement failed. Please try again.');
}
```

## 🔒 Privacy & Security

- **Local Processing** - All enhancement happens in the browser
- **No Data Collection** - User prompts are never transmitted
- **Minimal Permissions** - Only requests necessary permissions
- **Open Source** - Code is transparent and auditable

## 📈 Performance

- **Lightweight** - < 50KB total size
- **Fast Loading** - Minimal impact on page load
- **Efficient Detection** - Smart input field finding
- **Memory Optimized** - Clean up unused resources

## 🚀 Future Enhancements

- [ ] **Custom Templates** - User-defined enhancement patterns
- [ ] **AI Integration** - Connect with external AI services
- [ ] **Team Sharing** - Collaborative prompt libraries
- [ ] **Analytics Dashboard** - Detailed usage insights
- [ ] **Multi-language Support** - International localization

## 🐛 Troubleshooting

### Common Issues
1. **Button not appearing** - Check if platform is supported
2. **Enhancement not working** - Verify input field detection
3. **Modal not showing** - Check for JavaScript errors
4. **Styling issues** - Inspect CSS conflicts

### Debug Mode
Enable debug logging in the console:
```javascript
localStorage.setItem('prompt_enhancer_debug', 'true');
```

---

**Ready for production!** This extension provides a seamless enhancement experience across all major AI platforms.
# 🚀 Prompt Enhancer

**Enhance your AI prompts in seconds** - A Chrome extension that automatically improves your prompts to get better responses from AI assistants.

![Prompt Enhancer Demo](https://via.placeholder.com/800x400/0f0f0f/10b981?text=Prompt+Enhancer+Demo)

## ✨ Features

- **⚡ One-Click Enhancement** - Improve prompts instantly with a single click
- **🌐 Universal Support** - Works with ChatGPT, Claude, Grok, Perplexity, and more
- **🔒 Privacy First** - All processing happens locally in your browser
- **🎨 Clean Interface** - Seamlessly integrates with existing AI platforms
- **🆓 Completely Free** - No subscriptions, no hidden fees

## 🏗️ Project Structure

```
PromptEnhancer/
├── 📁 landing-page/          # Modern dark-themed landing page
│   ├── index.html           # Main landing page
│   ├── styles.css           # Dark mode styling
│   └── script.js            # Interactive functionality
├── 📁 extension/            # Chrome extension files
│   ├── manifest.json        # Extension configuration
│   ├── content.js           # Main extension logic
│   ├── popup.html           # Extension popup interface
│   ├── popup.js             # Popup functionality
│   └── popup.css            # Popup styling
├── 📁 docs/                 # Documentation
└── 📁 .kiro/               # Development specs and tasks
```

## 🌐 Landing Page

The landing page features a **modern dark theme** with:

- **Sleek Design** - Professional dark mode interface
- **Realistic Mockup** - ChatGPT-style interface demonstration
- **Responsive Layout** - Optimized for all devices
- **Interactive Elements** - Smooth animations and hover effects
- **Waitlist Integration** - Email collection for early access

### 🎨 Design Features
- **Color Scheme**: Deep blacks with emerald green accents (#10b981)
- **Typography**: Inter font family for modern readability
- **Animations**: Subtle hover effects and smooth transitions
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Accessibility**: High contrast support and keyboard navigation

## 🔧 Chrome Extension

The extension provides:

- **Smart Integration** - Automatically detects AI chat interfaces
- **One-Click Enhancement** - Floating button appears next to input fields
- **Modal Preview** - Shows original vs enhanced prompts
- **Platform Support** - Works across multiple AI services
- **Local Processing** - No data sent to external servers

### 🎯 Supported Platforms
- ChatGPT (chat.openai.com, chatgpt.com)
- Claude (claude.ai)
- Grok (grok.x.ai, x.ai)
- Perplexity (perplexity.ai)
- Google Bard (bard.google.com)

## 🚀 Quick Start

### Landing Page Development
```bash
cd landing-page
python3 -m http.server 3000
# Visit http://localhost:3000
```

### Extension Development
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension/` folder
4. The extension will be installed and ready to use

## 📱 Deployment

### Landing Page
- **Replit**: Upload the `landing-page/` folder
- **Vercel**: Connect to GitHub and deploy
- **Netlify**: Drag and drop the folder
- **GitHub Pages**: Push to repository and enable Pages

### Extension
- **Chrome Web Store**: Package the `extension/` folder and submit
- **Development**: Load unpacked for testing

## 🛠️ Development

### Prerequisites
- Modern web browser
- Python 3 (for local server)
- Chrome browser (for extension testing)

### Setup
```bash
git clone <repository-url>
cd PromptEnhancer
```

### Landing Page
```bash
cd landing-page
python3 -m http.server 8000
```

### Extension Testing
1. Load the extension in Chrome developer mode
2. Visit any supported AI platform
3. Test the enhancement functionality

## 📋 Features Roadmap

- [ ] **Advanced Enhancement Options** - Multiple enhancement styles
- [ ] **Custom Templates** - User-defined prompt templates
- [ ] **Analytics Dashboard** - Usage statistics and insights
- [ ] **Team Collaboration** - Shared prompt libraries
- [ ] **API Integration** - Connect with external AI services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: timofeysmykov@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/timsmykov/prompt-enhancer/issues)
- **X (Twitter)**: [@timsmykov](https://x.com/timsmykov)

## 🙏 Acknowledgments

- **Design Inspiration**: Modern SaaS landing pages
- **UI Framework**: Custom CSS with Inter font
- **Icons**: Custom SVG icons
- **Color Palette**: Emerald green accent with dark theme

---

**Made with ❤️ for the AI community**

*Enhance your AI prompts in seconds and get better responses every time.*
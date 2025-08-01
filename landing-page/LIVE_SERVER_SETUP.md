# Live Server Setup for Prompt Enhancer Landing Page

This landing page is optimized to work exclusively with VS Code Live Server extension.

## 🚀 Quick Start

1. **Open VS Code** in the `landing-page` directory
2. **Install Live Server extension** if not already installed
3. **Right-click on `index.html`** → "Open with Live Server"
4. **View at** `http://127.0.0.1:5501` or `http://localhost:5501`

## ✅ What's Optimized for Live Server

- **Component Loading**: Optimized fetch with cache busting
- **Script Filtering**: Automatically filters out Live Server debugging scripts
- **Sequential Loading**: Components load one by one for better Live Server compatibility
- **Enhanced Error Handling**: Live Server specific error messages
- **Auto-reload Compatible**: Works seamlessly with Live Server's hot reload

## 🔧 Live Server Settings

The `.vscode/settings.json` contains optimized Live Server configuration:
- Port: 5501
- Auto-browser opening
- Proper file watching
- Chrome as default browser

## 📁 Component Structure

All components are in the `components/` directory and are loaded dynamically:
- `hero.html` - Hero section
- `social-proof.html` - Social proof section  
- `testimonials.html` - Testimonials
- `before-after.html` - Before/After comparison
- `benefits.html` - Benefits section
- `pricing.html` - Pricing plans
- `how-it-works.html` - How it works
- `waitlist.html` - Waitlist signup
- `faq.html` - FAQ section
- `footer.html` - Footer
- `scripts.html` - JavaScript includes

## 🐛 Debugging

If components don't load:
1. Check browser console for errors
2. Ensure Live Server is running on port 5501
3. Look for "Live Server Component Loader initialized" message
4. Verify all component files exist in `components/` directory

## 🔄 Hot Reload

The component loader automatically:
- Filters out Live Server injection scripts
- Handles cache busting for fresh content
- Maintains component state during reloads
- Preserves debugging information

No Python server or other local server needed - Live Server handles everything!

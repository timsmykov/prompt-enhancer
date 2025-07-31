# 🚀 Deployment Guide

Complete deployment instructions for both the landing page and Chrome extension.

## 🌐 Landing Page Deployment

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from landing-page folder
cd landing-page
vercel

# Follow prompts to configure deployment
```

**Benefits:**
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Git integration
- ✅ Custom domains
- ✅ Analytics included

### Option 2: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy from landing-page folder
cd landing-page
netlify deploy

# For production deployment
netlify deploy --prod
```

**Benefits:**
- ✅ Drag & drop deployment
- ✅ Form handling
- ✅ Split testing
- ✅ Edge functions

### Option 3: GitHub Pages
1. Push code to GitHub repository
2. Go to repository Settings → Pages
3. Select source branch (main)
4. Set folder to `/landing-page`
5. Save and wait for deployment

**Benefits:**
- ✅ Free hosting
- ✅ Custom domains
- ✅ Automatic deployments
- ✅ GitHub integration

### Option 4: Replit
1. Create new Replit project
2. Upload `landing-page/` folder contents
3. Run with Python HTTP server:
```bash
python3 -m http.server 3000
```
4. Use the provided URL for sharing

**Benefits:**
- ✅ Instant deployment
- ✅ No setup required
- ✅ Collaborative editing
- ✅ Built-in hosting

## 🔧 Chrome Extension Deployment

### Development Testing
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/` folder
5. Test on supported platforms

### Chrome Web Store Submission

#### 1. Prepare Extension Package
```bash
cd extension
zip -r prompt-enhancer-extension.zip .
```

#### 2. Create Developer Account
- Visit [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- Pay one-time $5 registration fee
- Verify your identity

#### 3. Upload Extension
- Click "New Item"
- Upload the ZIP file
- Fill out store listing details

#### 4. Store Listing Requirements
```yaml
Name: "Prompt Enhancer"
Summary: "Enhance your AI prompts in seconds"
Description: |
  Prompt Enhancer is a Chrome extension that automatically 
  improves your AI prompts with one click. Works with ChatGPT, 
  Claude, Grok, Perplexity, and other AI platforms.
  
  Features:
  • One-click prompt enhancement
  • Works across multiple AI platforms
  • Privacy-focused (local processing)
  • Clean, intuitive interface
  • Completely free to use

Category: "Productivity"
Language: "English"
```

#### 5. Required Assets
- **Icon 16x16**: `icon-16.png`
- **Icon 48x48**: `icon-48.png`
- **Icon 128x128**: `icon-128.png`
- **Screenshots**: 1280x800 or 640x400
- **Promotional Images**: 440x280

#### 6. Privacy Policy
Required for extensions that handle user data:
```markdown
# Privacy Policy for Prompt Enhancer

## Data Collection
Prompt Enhancer does not collect, store, or transmit any user data.

## Local Processing
All prompt enhancement happens locally in your browser.

## Permissions
- activeTab: To detect and enhance prompts on AI platforms
- storage: To save user preferences locally

## Contact
For questions: support@promptenhancer.com
```

#### 7. Submission Process
1. Upload extension package
2. Complete store listing
3. Submit for review
4. Wait 1-7 days for approval
5. Extension goes live automatically

## 📊 Analytics Setup

### Landing Page Analytics

#### Google Analytics 4
```html
<!-- Add to index.html <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Plausible Analytics (Privacy-focused)
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### Extension Analytics
```javascript
// In popup.js or content.js
function trackEvent(eventName, properties) {
  // Use Chrome extension analytics
  chrome.runtime.sendMessage({
    type: 'analytics',
    event: eventName,
    properties: properties
  });
}
```

## 🔒 Security Considerations

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               font-src https://fonts.gstatic.com;">
```

### Extension Security
- Use `manifest_version: 3`
- Minimize permissions
- Validate all inputs
- Use HTTPS for external requests

## 🌍 Domain Setup

### Custom Domain Configuration
1. Purchase domain (e.g., promptenhancer.com)
2. Configure DNS records:
```
Type: CNAME
Name: www
Value: your-deployment-url.vercel.app

Type: A
Name: @
Value: 76.76.19.61 (Vercel IP)
```

### SSL Certificate
Most hosting providers (Vercel, Netlify) provide automatic HTTPS.

## 📈 Performance Optimization

### Landing Page
```bash
# Optimize images
npm install -g imagemin-cli
imagemin images/* --out-dir=images/optimized

# Minify CSS
npm install -g clean-css-cli
cleancss -o styles.min.css styles.css

# Minify JavaScript
npm install -g terser
terser script.js -o script.min.js
```

### Extension
- Keep bundle size under 2MB
- Optimize images and icons
- Minify JavaScript files
- Remove unused code

## 🔄 CI/CD Pipeline

### GitHub Actions for Landing Page
```yaml
# .github/workflows/deploy.yml
name: Deploy Landing Page
on:
  push:
    branches: [main]
    paths: ['landing-page/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./landing-page
```

### Automated Extension Testing
```yaml
name: Test Extension
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test Extension
        run: |
          cd extension
          # Run extension tests
          npm test
```

## 📋 Pre-Launch Checklist

### Landing Page
- [ ] All links work correctly
- [ ] Form submission works
- [ ] Mobile responsive design
- [ ] Fast loading speed (< 3s)
- [ ] SEO meta tags complete
- [ ] Analytics tracking active
- [ ] SSL certificate active
- [ ] Custom domain configured

### Chrome Extension
- [ ] Works on all supported platforms
- [ ] No console errors
- [ ] Proper error handling
- [ ] Privacy policy created
- [ ] Store listing complete
- [ ] Screenshots and icons ready
- [ ] Permissions minimized
- [ ] Code reviewed and tested

## 🎯 Launch Strategy

### Soft Launch
1. Deploy to staging environment
2. Test with small user group
3. Gather feedback and iterate
4. Fix any critical issues

### Public Launch
1. Deploy to production
2. Submit extension to Chrome Web Store
3. Announce on social media
4. Reach out to AI communities
5. Monitor analytics and feedback

### Post-Launch
1. Monitor error rates
2. Collect user feedback
3. Plan feature updates
4. Scale infrastructure as needed

---

**Ready to launch!** Follow this guide for a smooth deployment process.
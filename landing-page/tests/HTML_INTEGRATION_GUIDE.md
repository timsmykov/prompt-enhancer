# HTML Components Integration Guide

## Overview
The landing page is built using a modular component system where each section is loaded dynamically by the main `index.html` file. This ensures clean separation of concerns and maintainable code.

## Main Structure

### index.html
The main entry point that:
- Loads the comprehensive CSS bundle (`css/index.css`)
- Contains component placeholders
- Loads the component loader system (`js/loader.js`)

### Component Files and Their JavaScript Dependencies

| Component | HTML File | JavaScript File | Description |
|-----------|-----------|----------------|-------------|
| Hero | `hero.html` | `hero.js` | Main landing section with typing animation and mockup |
| Social Proof | `social-proof.html` | `animations.js` | Stats, achievements, and user metrics |
| Testimonials | `testimonials.html` | `testimonials.js` | User reviews with hover effects |
| Before/After | `before-after.html` | `animations.js` | Prompt comparison examples |
| Benefits | `benefits.html` | `animations.js` | Feature highlight cards |
| Pricing | `pricing.html` | `pricing.js` | Pricing plans with interactive buttons |
| How It Works | `how-it-works.html` | `animations.js` | Step-by-step process |
| Waitlist | `waitlist.html` | `waitlist.js` | Email signup form |
| FAQ | `faq.html` | `faq.js` | Collapsible question/answer section |
| Footer | `footer.html` | `footer.js` | Footer links and sticky CTA |
| Scripts | `scripts.html` | `page-init.js`, `animations.js` | Loading overlay and core initialization |

## CSS Architecture

### Main CSS Files
- `css/index.css` - Central import file for all stylesheets
- `css/base.css` - Reset, typography, and base styles
- `css/components.css` - Reusable UI components (buttons, forms)
- `css/hero.css` - Hero section specific styles
- `css/mockup.css` - Browser mockup and chat interface
- `css/sections.css` - General section layouts
- `css/social-proof.css` - Stats and metrics styling
- `css/footer.css` - Footer and sticky CTA styles
- `css/animations.css` - Keyframes and transitions
- `css/loading.css` - Loading overlay styles
- `css/waitlist.css` - Form success message styles
- `css/responsive.css` - Mobile and tablet breakpoints

## JavaScript Architecture

### Core Scripts
- `js/loader.js` - Component loading system
- `js/page-init.js` - Page initialization and loading overlay
- `js/animations.js` - Scroll animations and counter effects

### Component Scripts
- `js/hero.js` - Hero section functionality (typing animation, mockup interaction)
- `js/faq.js` - FAQ collapse/expand functionality
- `js/footer.js` - Sticky CTA and scroll-to-waitlist function
- `js/waitlist.js` - Form submission handling
- `js/pricing.js` - Pricing card interactions
- `js/testimonials.js` - Testimonial hover effects and rotation

## Loading Process

1. **HTML Structure**: `index.html` loads with component placeholders
2. **CSS Loading**: All styles are loaded via `css/index.css` imports
3. **Component Loading**: `js/loader.js` fetches and injects HTML components
4. **Script Execution**: Component scripts are executed after HTML injection
5. **Initialization**: Global animations and page features are initialized
6. **Ready State**: `componentsReady` event is fired for final setup

## Best Practices Implemented

### Separation of Concerns
- ✅ HTML structure separated from styles and behavior
- ✅ CSS organized by feature and responsiveness
- ✅ JavaScript modularized by component functionality

### Performance
- ✅ CSS imports minimize HTTP requests
- ✅ Deferred script loading prevents render blocking
- ✅ Component-based loading allows for lazy loading potential

### Maintainability
- ✅ Each component is self-contained
- ✅ Clear naming conventions for files and functions
- ✅ Consistent event handling patterns

### Accessibility
- ✅ Semantic HTML structure
- ✅ Proper ARIA attributes where needed
- ✅ Keyboard navigation support for interactive elements

## Development Guidelines

### Adding New Components
1. Create HTML file in `components/` directory
2. Add corresponding CSS in appropriate stylesheet
3. Create JavaScript file if interactivity is needed
4. Add component to loader configuration
5. Test integration with existing components

### Modifying Existing Components
1. Edit HTML structure in component file
2. Update styles in relevant CSS file
3. Modify JavaScript behavior in component script
4. Test cross-component functionality

## Testing Checklist

- [ ] All components load without errors
- [ ] JavaScript functionality works across components
- [ ] CSS styles apply correctly
- [ ] Mobile responsiveness is maintained
- [ ] Loading overlay displays and hides properly
- [ ] Interactive elements respond to user input
- [ ] Form submissions work correctly
- [ ] Scroll animations trigger appropriately

# CSS Organization

This directory contains the modularized CSS files for the Prompt Enhancer landing page, organized for better maintainability and development workflow.

## File Structure

### `index.css`
Main entry point that imports all other CSS modules. This is the file referenced in the HTML.

### `base.css` 
Foundation styles including:
- CSS reset and normalize
- Typography (fonts, headings, text styles)
- Layout utilities (container, section-title, gradient-text)
- Scrollbar styling
- Accessibility features (focus indicators, reduced motion, high contrast)

### `components.css`
Reusable UI components:
- Button styles (primary, secondary, hover states)
- Sticky CTA (call-to-action)
- Form elements (inputs, groups, validation states)
- Enhanced ChatGPT integration styles

### `hero.css`
Hero section specific styles:
- Hero layout and background
- Hero content, title, subtitle, description
- Hero buttons and stats
- Trust indicators and benefits
- Platform logos scroll section
- Typing animation effects

### `mockup.css`
Browser mockup and chat interface:
- Browser window styling (header, dots, URL bar)
- Chat interface layout
- ChatGPT-style input area
- Message bubbles and avatars
- Prompt enhancer bar
- Extension bar styling
- Interactive states and animations

### `sections.css`
Main page sections:
- Benefits section (grid, cards, icons)
- How It Works (steps, numbered circles)
- Waitlist section (form, success states)
- FAQ section (collapsible questions)
- Pricing section (cards, features, badges)

### `social-proof.css`
Social proof and testimonials:
- Stats grids and cards
- Achievement badges
- Usage statistics with charts
- User categories
- Testimonials grid
- Before/After comparison
- Interactive demo section

### `footer.css`
Footer specific styles:
- Footer layout and background
- Navigation links
- Social media links
- Copyright and branding

### `animations.css`
All animations and keyframes:
- General animations (fadeInUp, float, slideIn)
- Button animations (pulse, glow, hover effects)
- Text animations (blink, typing cursor)
- Scroll animations
- Loading states and spinners
- Parallax and advanced effects

### `responsive.css`
Mobile and tablet responsive design:
- Tablet breakpoints (1024px and below)
- Mobile breakpoints (768px and below)
- Small mobile (480px and below)
- Landscape phone optimizations
- Touch device adaptations
- Print styles
- Accessibility preferences (reduced motion, high contrast)

## Benefits of This Structure

1. **Maintainability**: Easy to find and modify specific components
2. **Modularity**: Changes to one section don't affect others
3. **Performance**: Selective loading possible for different pages
4. **Collaboration**: Multiple developers can work on different files
5. **Debugging**: Easier to identify source of styling issues
6. **Scalability**: Easy to add new sections or components

## Development Workflow

When working on the landing page:

1. **Layout changes**: Edit `base.css`
2. **Button or form updates**: Edit `components.css`
3. **Hero section tweaks**: Edit `hero.css`
4. **Chat interface changes**: Edit `mockup.css`
5. **New page sections**: Edit `sections.css` or `social-proof.css`
6. **Animation updates**: Edit `animations.css`
7. **Mobile responsiveness**: Edit `responsive.css`
8. **Footer changes**: Edit `footer.css`

## File Size Comparison

- **Before**: Single 2500+ line `styles.css` file
- **After**: 9 organized files averaging 200-400 lines each

This organization makes the codebase much more manageable and maintainable for future development.

# Tests Directory

This directory contains all test files, debugging tools, and technical documentation for the Prompt Enhancer landing page.

## Test Files

### HTML Test Files
- `test.html` - Original test page
- `test-functionality.html` - Functionality testing page
- `debug.html` - Debug interface for troubleshooting
- `validation-report.html` - HTML/CSS validation results

### JavaScript Test Files
- `js/test-hero.js` - Hero section functionality testing script
  - Tests typing animation
  - Tests button functionality 
  - Tests element detection
  - Provides console debugging output

## Documentation

### Technical Documentation
- `JAVASCRIPT_CSS_FIX.md` - JavaScript and CSS troubleshooting guide
- `HTML_INTEGRATION_GUIDE.md` - Guide for integrating HTML components
- `CLEAN_MODULAR_SYSTEM.md` - Documentation of the modular component system

## Usage

### Running Tests
To include the hero test script in your page for debugging:
```html
<script src="tests/js/test-hero.js"></script>
```

### Viewing Test Pages
- Open any `.html` file in this directory with Live Server
- Check browser console for debugging output
- Use the debug.html page for comprehensive troubleshooting

## Notes
- All test files have been moved here to keep the main project structure clean
- Test scripts are not included in the production build
- Debug output is available in browser console when test scripts are loaded

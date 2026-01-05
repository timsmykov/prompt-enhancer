# Extension Build

This folder contains the complete Chrome extension ready to load.

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select this `extension/` folder

## Files

- `manifest.json` - Extension configuration
- `src/background/` - Background service worker
- `src/content/` - Content script for page interaction
- `src/ui/overlay/` - Overlay UI for showing results
- `src/ui/popup/` - Settings popup UI
- `vendor/` - Vue 3 runtime

No build step required - this is vanilla JavaScript.

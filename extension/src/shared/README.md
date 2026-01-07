# Foundation Layer - Prompt Improver Extension

This directory contains shared infrastructure and utilities for the Prompt Improver Chrome extension.

## Architecture

The foundation layer provides:

1. **State Management** - `ExtensionState.js`
2. **Error Handling** - `ErrorHandler.js`
3. **Event System** - `EventManager.js`
4. **Storage Management** - `StorageManager.js`
5. **Utility Functions** - `utils.js`
6. **Design Tokens** - `design-tokens.css`

## File Descriptions

### ExtensionState.js

Centralized state management with pub/sub pattern. Works across all extension contexts (background, content scripts, popup).

**Features:**
- Get/set values with automatic persistence
- Subscribe to state changes
- Batch operations
- Static helpers for direct storage access

**Usage:**
```javascript
// Get value
const apiKey = await ExtensionState.get('apiKey');

// Set value (persists to chrome.storage)
await ExtensionState.set('apiKey', 'sk-...');

// Subscribe to changes
const unsubscribe = ExtensionState.subscribe('apiKey', (newValue, oldValue) => {
  console.log('API key changed:', newValue);
});

// Batch operations
await ExtensionState.setMany({ apiKey, model, systemPrompt });
```

### ErrorHandler.js

Centralized error handling with user-friendly messages and recovery strategies.

**Features:**
- Automatic error classification
- User-friendly error messages
- Recovery strategy mapping
- Error boundaries for async operations
- Automatic retry with exponential backoff

**Usage:**
```javascript
// Handle error
const handled = ErrorHandler.handle(error);
console.log(handled.message); // User-friendly message
console.log(handled.canRetry); // Check if retryable
console.log(handled.recovery); // Recovery strategy

// Create error boundary
const safeFn = ErrorHandler.createBoundary(async () => {
  // Code that might throw
});

// Create retry wrapper
const retryableFn = ErrorHandler.createRetryWrapper(fetchData, {
  maxRetries: 3,
  retryDelay: 1000,
});
```

### EventManager.js

Cross-context event bus for communication between extension contexts.

**Features:**
- Local event emission
- Broadcast to all contexts
- Send to specific tab
- One-time listeners
- Event channels (namespaced)

**Usage:**
```javascript
// Subscribe to event
EventManager.on(EventTypes.SETTINGS_CHANGED, (data) => {
  console.log('Settings changed:', data);
});

// Emit event locally
EventManager.emit(EventTypes.SETTINGS_CHANGED, { apiKey: 'sk-...' });

// Broadcast to all contexts
EventManager.broadcast(EventTypes.API_REQUEST_START, { text: '...' });

// Send to active tab
await EventManager.sendToActiveTab('SHOW_OVERLAY', { ... });

// Create namespaced channel
const settingsChannel = EventManager.createChannel('settings');
settingsChannel.on('changed', (data) => { ... });
```

### StorageManager.js

Chrome storage wrapper with in-memory caching for efficient access.

**Features:**
- Get/set/remove operations
- In-memory caching (5-second TTL)
- Change listeners
- Bytes-in-use tracking
- Batch operations

**Usage:**
```javascript
// Get value (cached)
const apiKey = await StorageManager.get('apiKey', '');

// Get multiple values
const settings = await StorageManager.getMany(['apiKey', 'model']);

// Set value
await StorageManager.set('apiKey', 'sk-...');

// Subscribe to changes
StorageManager.onChange('apiKey', (newValue, oldValue) => {
  console.log('API key changed:', newValue);
});
```

### utils.js

Common utility functions used across the extension.

**Functions:**

#### debounce(fn, delay)
Delays function execution until after delay has elapsed since last call.

```javascript
const debouncedSearch = Utils.debounce(search, 300);
input.addEventListener('input', debouncedSearch);
```

#### throttle(fn, limit)
Limits function execution to once per limit period.

```javascript
const throttledScroll = Utils.throttle(handleScroll, 100);
window.addEventListener('scroll', throttledScroll);
```

#### generateId()
Generate unique identifier (UUID format).

```javascript
const id = Utils.generateId(); // "550e8400-e29b-41d4-a716-446655440000"
```

#### timeago(timestamp)
Format timestamp as human-readable relative time.

```javascript
const timeStr = Utils.timeago(Date.now() - 3600000); // "1 hour ago"
```

#### formatDateTime(timestamp, options)
Format timestamp as localized date/time string.

```javascript
const dateStr = Utils.formatDateTime(Date.now()); // "Jan 1, 2025, 12:00 PM"
```

#### truncate(text, maxLength, suffix)
Truncate text to specified length.

```javascript
const short = Utils.truncate('Very long text', 10); // "Very lo..."
```

#### escapeHtml(html)
Escape HTML to prevent XSS.

```javascript
const safe = Utils.escapeHtml('<script>alert("xss")</script>');
```

#### deepClone(obj)
Deep clone an object.

```javascript
const cloned = Utils.deepComplex(original);
```

#### isEmpty(obj)
Check if object is empty.

```javascript
Utils.isEmpty(null); // true
Utils.isEmpty(''); // true
Utils.isEmpty([]); // true
```

#### sleep(ms)
Sleep/delay for specified time.

```javascript
await Utils.sleep(1000); // Wait 1 second
```

#### retry(fn, options)
Retry async function with exponential backoff.

```javascript
await Utils.retry(fetchData, { maxRetries: 3, initialDelay: 1000 });
```

#### copyToClipboard(text)
Copy text to clipboard with fallback support.

```javascript
await Utils.copyToClipboard('Text to copy');
```

#### parseQueryParams(url) / buildQueryString(params)
Parse and build URL query strings.

```javascript
const params = Utils.parseQueryParams('https://example.com?foo=bar&baz=qux');
const query = Utils.buildQueryString({ foo: 'bar', baz: 'qux' });
```

#### measureTime(fn, label)
Measure function execution time.

```javascript
const result = await Utils.measureTime(fetchData, 'Fetch API');
```

### design-tokens.css

Design system tokens for consistent styling across the extension.

**Includes:**
- Color system (Solarized-inspired)
- Typography (system fonts, modular scale)
- Spacing (4px base unit)
- Border radius
- Shadows (layered for depth)
- Transitions (spring-like feel)
- Animation keyframes
- Dark mode support
- Reduced motion support

**Usage:**
```css
/* Import in component CSS */
@import './design-tokens.css';

/* Use tokens */
.button {
  background: var(--color-primary);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  transition: background var(--transition-base);
}
```

## Integration

To use the foundation layer in your extension files:

### In HTML files (popup/overlay)

```html
<!-- Load foundation modules first -->
<script src="shared/utils.js"></script>
<script src="shared/ErrorHandler.js"></script>
<script src="shared/EventManager.js"></script>
<script src="shared/StorageManager.js"></script>
<script src="shared/ExtensionState.js"></script>

<!-- Load your component scripts -->
<script src="ui/popup/popup.js"></script>
```

### In CSS files

```css
/* Import design tokens */
@import './shared/design-tokens.css';

/* Use tokens in component styles */
```

### In JavaScript files

All modules are available on the global scope:

```javascript
// Use ExtensionState
const apiKey = await ExtensionState.get('apiKey');

// Use ErrorHandler
try {
  await riskyOperation();
} catch (error) {
  const handled = ErrorHandler.handle(error);
  console.error(handled.message);
}

// Use EventManager
EventManager.broadcast('custom:event', { data: '...' });

// Use StorageManager
const settings = await StorageManager.getMany(['apiKey', 'model']);

// Use Utils
const debouncedFn = Utils.debounce(handleInput, 300);
const id = Utils.generateId();
```

## Testing

A test file is provided at `tests.html`. Open it in a browser to verify foundation layer functionality:

```bash
open extension/src/shared/tests.html
```

## CSP Compatibility

All foundation modules are CSP-compliant:
- No `eval()` or `Function()` constructor
- No inline scripts (all in external files)
- No unsafe-inline styles
- Uses IIFE pattern to avoid global scope pollution

## Browser Compatibility

Tested on:
- Chrome 88+ (Manifest V3)
- Edge 88+
- Other Chromium-based browsers

## Performance Considerations

- **Caching**: StorageManager uses 5-second cache TTL
- **Debouncing**: Use Utils.debounce for frequent events (input, resize)
- **Throttling**: Use Utils.throttle for scroll/drag events
- **Memory**: EventManager and ErrorHandler auto-limit log size (100 items)

## Future Enhancements

Potential additions:
- Analytics/telemetry module
- Performance monitoring
- Offline queue for failed API calls
- Local-first data persistence
- Web Worker support for heavy operations

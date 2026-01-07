# Background Service Worker - Architecture Documentation

## Overview

The background service worker has been significantly enhanced with production-ready features including retry logic, request queuing, telemetry tracking, and response caching.

## Architecture

```
background.js (Main Entry)
    ├─> StorageManager.js (Atomic storage operations)
    ├─> EventManager.js (Message validation & handling)
    ├─> TelemetryManager.js (Usage metrics)
    ├─> RequestQueue.js (Sequential request processing)
    ├─> CacheManager.js (Response caching)
    └─> APIHandler.js (OpenRouter API calls with retry)
```

## Key Features

### 1. Enhanced Error Handling

**Error Mapping:**
- 400: Invalid request
- 401: Invalid API key
- 403: Access forbidden
- 404: Model not found
- 429: Rate limit exceeded
- 500/502/503/504: API server errors

**Retry Logic:**
- Max retries: 3 (increased from 1)
- Exponential backoff: 1s, 2s, 4s, 8s (max 10s)
- Jitter: Random 0-1s added to prevent thundering herd
- Retryable status codes: 408, 429, 500, 502, 503, 504

**Timeout Handling:**
- Default timeout: 15 seconds
- Configurable per request
- Automatic retry on timeout

### 2. Request Queuing

**Features:**
- Sequential processing (max 1 concurrent)
- Queue position tracking
- Request cancellation support
- Promise-based API
- Automatic queue position updates to UI

**Usage:**
```javascript
// Add request to queue
const result = await RequestQueue.add(async () => {
  return await APIHandler.call(text, settings);
}, { tabId });

// Cancel request
RequestQueue.cancel(requestId);

// Get queue position
const position = RequestQueue.getPosition(requestId);
```

### 3. Telemetry Tracking

**Metrics Collected:**
- Total requests made
- Success/error rates
- Average response time
- Request history (last 100)
- Errors by type
- Daily statistics

**Storage:**
- Stored in `chrome.storage.local`
- Key: `promptImprover_telemetry`
- Includes request history and daily stats

**Usage:**
```javascript
// Get telemetry data
const telemetry = await TelemetryManager.getData();

// Get success rate
const rate = await TelemetryManager.getSuccessRate();

// Get average response time
const avgTime = await TelemetryManager.getAverageResponseTime();

// Reset telemetry
await TelemetryManager.reset();
```

### 4. Response Caching

**Features:**
- LRU (Least Recently Used) eviction
- Configurable TTL (default: 1 hour)
- Key based on prompt + model + system prompt
- Max cache size: 100 entries
- Automatic expiration cleanup

**Usage:**
```javascript
// Get cached response
const cached = CacheManager.get(prompt, settings);

// Set cache entry
CacheManager.set(prompt, settings, response, ttl);

// Invalidate cache entry
CacheManager.invalidate(prompt, settings);

// Clear all cache
CacheManager.clear();

// Get cache statistics
const stats = CacheManager.getStats();
```

### 5. Storage Management

**Features:**
- Atomic storage operations
- Error handling
- Migration support
- Version tracking
- Quota management

**Usage:**
```javascript
// Get data
const data = await StorageManager.get(['apiKey', 'model']);

// Set data
await StorageManager.set({ apiKey: 'xxx' });

// Update with migration
await StorageManager.updateWithMigration(data, version);

// Get bytes in use
const bytes = await StorageManager.getBytesInUse();
```

### 6. Event Management

**Features:**
- Message validation
- Request ID generation
- Pending request tracking
- Token validation
- Automatic cleanup

**Usage:**
```javascript
// Generate request ID
const requestId = EventManager.generateRequestId();

// Validate message
if (EventManager.validateMessage(message)) {
  // Process message
}

// Send to tab
await EventManager.sendToTab(tabId, { type: 'OPEN_OVERLAY' });

// Register pending request
EventManager.registerRequest(requestId, metadata);

// Cleanup old requests
EventManager.cleanupOldRequests();
```

## Message Protocol

### From Content Script

**IMPROVE_PROMPT**
```javascript
chrome.runtime.sendMessage({
  type: 'IMPROVE_PROMPT',
  text: 'selected text'
}, (response) => {
  if (response.error) {
    // Handle error
  } else {
    // Handle result
    console.log(response.result);
  }
});
```

**GET_QUEUE_POSITION**
```javascript
chrome.runtime.sendMessage({
  type: 'GET_QUEUE_POSITION',
  requestId: 'req_xxx'
}, (response) => {
  console.log('Position:', response.position);
});
```

**CANCEL_REQUEST**
```javascript
chrome.runtime.sendMessage({
  type: 'CANCEL_REQUEST',
  requestId: 'req_xxx'
}, (response) => {
  console.log('Cancelled:', response.cancelled);
});
```

**GET_TELEMETRY**
```javascript
chrome.runtime.sendMessage({
  type: 'GET_TELEMETRY'
}, (response) => {
  console.log('Telemetry:', response.data);
});
```

**CLEAR_CACHE**
```javascript
chrome.runtime.sendMessage({
  type: 'CLEAR_CACHE'
}, (response) => {
  console.log('Cleared:', response.success);
});
```

**GET_CACHE_STATS**
```javascript
chrome.runtime.sendMessage({
  type: 'GET_CACHE_STATS'
}, (response) => {
  console.log('Stats:', response.stats);
});
```

### From Background to Content Script

**OPEN_OVERLAY**
```javascript
chrome.tabs.sendMessage(tabId, {
  type: 'OPEN_OVERLAY'
});
```

**GET_QUEUE_POSITION** (push update)
```javascript
chrome.tabs.sendMessage(tabId, {
  type: 'GET_QUEUE_POSITION',
  position: 1,
  total: 3
});
```

## Error Handling Flow

```
User Action
    ↓
Validate Prompt
    ↓ (invalid)
→ Return validation error
    ↓ (valid)
Check Cache
    ↓ (hit)
→ Return cached response
    ↓ (miss)
Add to Queue
    ↓
Execute API Call
    ↓ (success)
Record Telemetry → Cache Response → Return Result
    ↓ (retryable error)
Calculate Backoff Delay
    ↓
Retry (max 3 attempts)
    ↓ (all retries failed)
Record Error Telemetry → Return Error
```

## Performance Optimizations

1. **Caching:** Reduces redundant API calls for identical prompts
2. **Queuing:** Prevents overwhelming the API with concurrent requests
3. **Exponential Backoff:** Reduces server load during errors
4. **Request Compression:** Compresses large payloads (placeholder for future)
5. **Automatic Cleanup:** Prevents memory leaks from old requests/cache

## Debugging

**Console Logs:**
```javascript
// Enable verbose logging
localStorage.setItem('debug', 'true');

// View telemetry
chrome.runtime.sendMessage({ type: 'GET_TELEMETRY' });

// View cache stats
chrome.runtime.sendMessage({ type: 'GET_CACHE_STATS' });
```

**Chrome Extension Storage:**
1. Go to `chrome://extensions/`
2. Find "Prompt Improver"
3. Click "Service worker" link
4. In DevTools: Application → Storage → Local Storage

## Manifest V3 Compliance

- Uses `importScripts()` for module loading
- No `eval()` or dynamic code generation
- CSP-friendly
- Service worker lifecycle aware
- Persistent background context

## Future Enhancements

1. **Streaming Responses:** Implement streaming for real-time results
2. **Request Compression:** Add gzip compression for large payloads
3. **Offline Queue:** Queue requests when offline, sync when online
4. **Advanced Telemetry:** Export telemetry data for analysis
5. **Cache Persistence:** Persist cache across browser restarts
6. **Batch Requests:** Combine multiple prompts into single API call

## Testing

**Manual Testing:**
```javascript
// Test error handling
chrome.runtime.sendMessage({
  type: 'IMPROVE_PROMPT',
  text: ''
});
// Expected: { error: 'No text selected.' }

// Test queue
chrome.runtime.sendMessage({
  type: 'IMPROVE_PROMPT',
  text: 'test prompt 1'
});
chrome.runtime.sendMessage({
  type: 'IMPROVE_PROMPT',
  text: 'test prompt 2'
});
// Expected: Sequential processing

// Test cache
chrome.runtime.sendMessage({
  type: 'IMPROVE_PROMPT',
  text: 'test prompt'
});
// Wait for completion, then:
chrome.runtime.sendMessage({
  type: 'IMPROVE_PROMPT',
  text: 'test prompt'
});
// Expected: Instant response from cache
```

## Migration Notes

**From Old Background.js:**
- MAX_RETRIES: 1 → 3
- Added exponential backoff
- Added request queuing
- Added telemetry tracking
- Added response caching
- Enhanced error messages
- Added request ID tracking

**Storage Migration:**
Handled automatically by `StorageManager.updateWithMigration()`

## Files Modified

1. `/extension/src/background/background.js` - Main entry point
2. `/extension/src/background/APIHandler.js` - API call handling
3. `/extension/src/background/TelemetryManager.js` - Telemetry tracking
4. `/extension/src/background/RequestQueue.js` - Request queuing
5. `/extension/src/background/CacheManager.js` - Response caching
6. `/extension/src/shared/StorageManager.js` - Storage operations
7. `/extension/src/shared/EventManager.js` - Message handling

## Backward Compatibility

- Existing message protocol maintained
- New message types are additive
- Storage format backward compatible
- Graceful fallback for missing modules

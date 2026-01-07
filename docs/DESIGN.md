# Design Documentation

**Version:** 2.0.0  
**Last Updated:** 2025-01-07

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Design Principles](#design-principles)
3. [Component Architecture](#component-architecture)
4. [State Management](#state-management)
5. [Design System](#design-system)
6. [Technology Choices](#technology-choices)
7. [Performance Considerations](#performance-considerations)
8. [Security Architecture](#security-architecture)
9. [Accessibility Design](#accessibility-design)
10. [Extension Points](#extension-points)

---

## Architecture Overview

The Prompt Improver extension follows a **message-passing architecture** with clear separation of concerns between background scripts, content scripts, and UI components.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Chrome Browser                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐      ┌──────────────┐                     │
│  │   Popup UI   │      │  Context     │                     │
│  │  (Settings)  │◄────►│   Menu       │                     │
│  └──────────────┘      └──────┬───────┘                     │
│         ▲                      │                             │
│         │                      ▼                             │
│         │              ┌──────────────┐                     │
│         │              │  Background  │                     │
│         │              │  Service     │◄────┐               │
│         │              │  Worker      │     │               │
│         │              └──────┬───────┘     │               │
│         │                     │             │               │
│         │         ┌───────────┴───────────┐ │               │
│         │         │                       │ │               │
│         │         ▼                       ▼ │               │
│         │  ┌──────────────┐      ┌──────────┴─┐            │
│         └─►│  Content     │      │   Overlay  │            │
│            │  Script      │◄────►│   (iframe) │            │
│            └──────────────┘      └────────────┘            │
│                   ▲                      │                  │
│                   │                      │                  │
│            ┌──────┴───────┐      ┌──────┴───────┐          │
│            │  Web Page    │      │   Vue 2.7    │          │
│            │  (DOM)       │      │   Runtime    │          │
│            └──────────────┘      └──────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  OpenRouter API  │
                    │  (External LLM)  │
                    └──────────────────┘
```

---

## Design Principles

### 1. Security First
- **Token-Based Authentication**: Session tokens prevent unauthorized iframe communication
- **Origin Validation**: All postMessage calls validate origin
- **No eval()**: CSP-compatible Vue 2.7 runtime
- **Local Storage**: API keys stored in chrome.storage.local

### 2. Performance Optimization
- **Lazy Loading**: Content script injected only when needed
- **RequestAnimationFrame**: Smooth drag/resize without blocking
- **Debounced Input**: 150ms debounce on textarea input
- **Batched DOM Updates**: Minimize reflows during typing animation

### 3. User Experience
- **Non-Blocking**: Async operations with proper error handling
- **Visual Feedback**: Loading states, toast notifications, status indicators
- **Keyboard Support**: Escape to close, Ctrl/Cmd+Enter to regenerate
- **Draggable Interface**: Overlay stays out of user's way

---

## Component Architecture

### Background Service Worker
**Responsibilities:**
- Context menu registration and handling
- OpenRouter API communication
- Error handling and retries
- Settings storage coordination

### Content Script
**Responsibilities:**
- Overlay iframe injection and positioning
- Selection capture and preservation
- Text replacement in DOM
- Message routing between overlay and background

### Overlay UI (Vue 2.7)
**Responsibilities:**
- User interface rendering
- Typing animation
- Drag and resize handling
- State management

---

## State Management

### Local Component State

Each component maintains its own state object with properties like status, error, originalText, resultText, typingSpeed, etc.

### Shared State (chrome.storage.local)

Settings persisted across sessions: apiKey, model, systemPrompt, typingSpeed

---

## Design System

### Color Palette
- Primary: #2563eb (blue-600)
- Secondary: #6b7280 (gray-500)
- Success: #10b981 (green-500)
- Error: #ef4444 (red-500)

### Typography
- Primary: System fonts (San Francisco, Segoe UI, Roboto)
- Code: Monospace (SF Mono, Monaco, Cascadia Code)

---

## Technology Choices

### Vue 2.7.16 (Options API Runtime)
- CSP compatibility (no eval())
- Smaller runtime footprint (~70KB gzipped)
- Proven stability in extension environments

### Chrome Extension Manifest V3
- Service worker instead of background page
- Modern async/await support
- Improved security model

### OpenRouter API
- Unified API for multiple LLM providers
- No provider lock-in
- Simple REST API

---

## Performance Considerations

### Typing Animation Optimization
- Current: One render() call per character
- Planned: Batch character updates (10-20 chars per frame)

### Memory Management
- Clear all timers on close
- Release pointer capture
- Cancel RAF

### Network Optimization
- Timeout: 8 seconds (reduced from 15s)
- Debounce rapid requests (300ms)
- Abort previous request on regenerate

---

## Security Architecture

### Session Token Protocol
Token generation using crypto.getRandomValues() prevents iframe hijacking.

### Origin Validation
All postMessage calls validate against chrome.runtime.getURL()

### API Key Protection
- Stored locally in chrome.storage.local
- Only sent to OpenRouter via HTTPS
- Toggle visibility in settings

---

## Accessibility Design

### Keyboard Navigation
- Escape: Close overlay
- Ctrl/Cmd+Enter: Regenerate
- Tab: Navigate buttons
- Space/Enter: Activate focused button

### Screen Reader Support
- ARIA labels on all buttons
- aria-live regions for status announcements
- Focus management

### Color Contrast
WCAG AA compliant (4.5:1 minimum for normal text)

---

**Last Updated:** 2025-01-07  
**Version:** 2.0.0  
**Maintainer:** Prompt Improver Team

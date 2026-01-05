# Архитектура

## Обзор

Prompt Improver — это Chrome Browser Extension (Manifest V3), который использует Vue 2.7 для UI и работает напрямую с OpenRouter API без бэкенда.

## Структура проекта

```
project-root/
├── extension/              → Production-ready extension (load this in Chrome)
│   ├── manifest.json       → Extension configuration
│   ├── README.md           → Extension-specific documentation
│   ├── src/
│   │   ├── background/
│   │   │   └── background.js    → Context menu, API calls
│   │   ├── content/
│   │   │   └── content.js       → Selection, overlay injection, replacement
│   │   └── ui/
│   │       ├── overlay/
│   │       │   ├── overlay.html → Vue 2 app container
│   │       │   ├── overlay.css  → Styles + drag/resize handles
│   │       │   └── overlay.js   → Vue 2 app: typing, actions, drag/resize
│   │       └── popup/
│   │           ├── popup.html   → Settings Vue 2 app
│   │           ├── popup.css    → Styles
│   │           └── popup.js     → Settings logic
│   └── vendor/
│       └── vue.global.prod.js   → Vue 2.7.16 CSP-compatible
│
├── src/                    → Source files (mirrored to extension/)
├── docs/                   → Documentation
│   ├── architecture.md     → This file
│   ├── changelog.md        → Version history
│   └── current_status.md   → Current development state
├── tests/                  → Playwright tests
│   ├── popup.spec.ts       → Popup UI tests
│   └── overlay.spec.ts     → Overlay UI tests
├── .claude/                → Claude Code agent configs
├── CLAUDE.md               → Claude Code instructions
├── SPECIFICATION.md        → Project specification
└── package.json            → npm scripts + Playwright config
```

## Компоненты

### Background Script (background.js)

**Ответственность:**
- Регистрация контекстного меню "Improve prompt"
- Обработка клика по иконке тулбара (открытие popup)
- API вызовы к OpenRouter
- Обработка ошибок и таймаутов

**Ключевые функции:**
```
- onInstalled: Создать контекстное меню
- onCommand: Обработать "open-popup" или "improve-selection"
- onContextMenu: Отправить OPEN_OVERLAY в active tab
- fetchImprovedPrompt: Вызов OpenRouter API
  - Headers: Authorization (Bearer API key)
  - Body: model, messages (system + user prompt)
  - Timeout: 15 seconds
  - Retry: 1 attempt
```

### Content Script (content.js)

**Ответственность:**
- Получение сообщения OPEN_OVERLAY
- Создание iframe overlay
- Коммуникация parent ↔ iframe
- Замена выделенного текста

**Архитектура iframe:**
```
content.js создаёт <iframe> с chrome.runtime.getURL('src/ui/overlay/overlay.html')
iframe margin: inset: auto 24px 24px auto (правый нижний угол)

Parent ↔ Iframe коммуникация:
- postMessage с sessionToken для безопасности
- OVERLAY_INIT: передача текста и метрик фрейма
- OVERLAY_ACTION: replace, close, position, resize
```

### Overlay UI (overlay.js)

**Ответственность:**
- Vue 2 приложение с Options API
- Drag & resize функциональность
- Typing effect для результата
- Действия: Replace, Copy, Regenerate

**State:**
```javascript
{
  status: 'idle' | 'loading' | 'typing' | 'ready' | 'error',
  originalText: string,
  resultText: string,
  typingSpeed: number,  // ms per char, 0 = instant
  sessionToken: string  // для защиты от XSS
}
```

**Drag & Resize (Pointer Events + RAF):**
```
Drag: pointerdown на .drag-handle → pointermove с RAF → postMessage position
Resize: pointerdown на .resize-handle → pointermove с RAF → postMessage resize
event.stopPropagation() для предотвращения закрытия по backdrop
```

### Popup UI (popup.js)

**Ответственность:**
- Настройки расширения
- Сохранение в chrome.storage.local

**Настройки:**
```javascript
{
  apiKey: string,
  model: string,           // default: 'openrouter/auto'
  systemPrompt: string,    // default: 'You are a helpful prompt improver...'
  typingSpeed: number      // default: 25, 0 = instant
}
```

## Data Flow

```
1. Пользователь выделяет текст
2. Контекстное меню → background.js
3. background.js → chrome.tabs.sendMessage → content.js
4. content.js создаёт iframe overlay
5. iframe → OVERLAY_INIT + SELECTION_TEXT → overlay.js
6. overlay.js → IMPROVE_PROMPT → background.js
7. background.js → OpenRouter API → IMPROVE_RESPONSE → overlay.js
8. overlay.js → startTyping() → отображение результата
9. Пользователь нажимает Replace:
   overlay.js → OVERLAY_ACTION(replace) → content.js
10. content.js → replaceSelectionText() → DOM update
```

## Security

- **Session Tokens**: Каждый overlay сеанс получает уникальный токен
- **Message Validation**: Проверка токена при каждом postMessage
- **CSP Compatible**: Vue 2 без eval, никаких inline scripts
- **Input Sanitization**: Проверка длины, валидация API key

## Тестирование

**Playwright Tests:**
```
tests/
├── popup.spec.ts    → 5 тестов popup UI
└── overlay.spec.ts  → 7 тестов overlay UI

Запуск: npm test (все тесты)
       npm run test:popup
       npm run test:overlay
```

## Ограничения

- **CSP страницы**: Сайты с строгим CSP могут блокировать iframe
- ** textarea/input**: Замена работает только при активном элементе
- **Cross-origin**: postMessage между iframe и parent проверяет source

## Спецификация проекта

### 1. Назначение
Проект — браузерное расширение для Chrome (Manifest V3) для улучшения выделенных текстовых промптов через LLM. Пользователь выделяет текст на странице, запускает улучшение из контекстного меню, получает переработанный вариант с эффектом печати и может заменить исходный текст или скопировать результат.

### 2. Для кого
- Специалисты по контенту, маркетологи, аналитики и продакт-менеджеры
- Пользователи, регулярно пишущие промпты для LLM
- Люди, работающие в браузере и нуждающиеся в быстрых правках выделенного текста

### 3. Функциональные сценарии

#### Основной сценарий (MVP)
1. Пользователь выделяет текст на странице
2. Вызывает "Improve prompt" из контекстного меню
3. Открывается draggable/resizable оверлей
4. В фоне отправляется запрос к LLM провайдеру
5. Результат выводится с эффектом печати
6. Пользователь выбирает: Replace / Copy / Regenerate

#### Сценарий настроек
1. Клик по иконке расширения в тулбаре
2. Открывается popup с настройками
3. Пользователь вводит: API ключ, модель, системный промпт, скорость печати
4. Настройки сохраняются в chrome.storage.local

### 4. Стек и инструменты
- **Frontend UI**: Vue 2.7 (Options API), CSS, HTML
- **Extension**: Chrome Manifest V3, background service worker, content script
- **UI Components**: Popup (settings), Overlay (iframe с drag/resize)
- **Хранение**: chrome.storage.local
- **LLM провайдер**: OpenRouter (HTTPS запросы из background.js)
- **Тестирование**: Playwright

### 5. Основные компоненты

| Компонент | Файл | Ответственность |
|-----------|------|-----------------|
| Background | background.js | Контекстное меню, API вызовы, ошибки |
| Content | content.js | Открытие overlay, замена текста |
| Overlay UI | overlay.html/css/js | Drag/resize, typing effect, actions |
| Popup UI | popup.html/css/js | Настройки (API ключ, модель, промпт) |
| Vendor | vendor/vue.global.prod.js | Vue 2.7 runtime |

### 6. Коммуникация между компонентами

```
Context Menu → background.js → content.js → overlay.js → background.js → OpenRouter API
                                                                      ↓
                                                            overlay.js (result)
                                                                      ↓
                                                            content.js (replace)
```

### 7. Пользовательский поток

```
Выделить текст
      ↓
Контекстное меню → "Improve prompt"
      ↓
content.js создаёт iframe overlay
      ↓
overlay.js отправляет IMPROVE_PROMPT в background
      ↓
background.js делает API запрос к OpenRouter
      ↓
background.js возвращает IMPROVE_RESPONSE
      ↓
overlay.js показывает результат (typing effect)
      ↓
Пользователь: Replace / Copy / Regenerate / Close
```

### 8. Технические ограничения
- Максимальная длина промпта: 4000 символов
- Таймаут API запроса: 15 секунд
- Минимальный размер overlay: 280x200px
- Vue 2 для CSP совместимости (без eval)

### 9. Нефункциональные требования
- Мгновенное открытие overlay (iframe инъекция)
- Плавный drag и resize (RAF, Pointer Events)
- Понятные сообщения об ошибках
- Защита от XSS через session tokens
- Работа на большинстве сайтов (кроме защищённых CSP)

### 10. Будущие улучшения (после MVP)
- Поддержка нескольких провайдеров (Anthropic, Google, etc.)
- История улучшений
- Шаблоны промптов
- Прокси-сервер для защиты API ключей
- Синхронизация настроек между устройствами

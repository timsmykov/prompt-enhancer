## Обзор проекта
MVP‑расширение: пользователь выделяет текст → через контекстное меню вызывает улучшение → видит результат в оверлее и может заменить/скопировать. Стек: Vue 3 для UI, чистый Node.js не нужен на MVP (работаем напрямую с API провайдера).

## Архитектура
### Структура директорий
```
manifest.json
src/
  background/
    background.js        # вызов API провайдера
  content/
    content.js           # открытие оверлея и замена текста
  ui/
    overlay/
      overlay.html
      overlay.css
      overlay.js         # Vue: вывод и действия
    options/
      options.html
      options.css
      options.js         # Vue: ключ, модель, системный промпт
vendor/
  vue.global.prod.js
```

### Frontend компоненты
- OverlayApp: статус, результат, Replace/Copy/Regenerate.
- OptionsApp: ввод API‑ключа, модели, системного промпта.
- Content script: открытие оверлея и замена выделенного текста.

### Backend endpoints
| Метод | Путь | Описание | Тело запроса | Ответ |
| --- | --- | --- | --- | --- |
| — | — | Backend в MVP не используется | — | — |

### Data flow и интеграция
- Контекстное меню → background.js отправляет OPEN_OVERLAY в content script.
- content.js открывает iframe‑оверлей → overlay.js вызывает IMPROVE_PROMPT в background.
- background.js делает запрос к провайдеру и возвращает результат.
- overlay.js показывает результат и позволяет Replace/Copy.
- Настройки храним в chrome.storage.local.

## Roadmap реализации
1. Frontend-vue-developer: минимальный оверлей (вывод результата, Replace/Copy/Regenerate).
2. Frontend-vue-developer: страница настроек (API‑ключ, модель, системный промпт).
3. Frontend-vue-developer: content script (инъекция, замена выделения).
4. Web-backend-node: пропускаем в MVP.

## Рекомендации
- Держать только один провайдер на MVP (например, OpenRouter) для снижения сложности.
- Ограничить длину текста и показать понятную ошибку при пустом выделении.
- Минимальные таймауты и обработка ошибок API.

Теперь можно запустить backend-node-developer для реализации /api/improve

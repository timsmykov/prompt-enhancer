# MCP Browser Use - Полный Анализ и План Исправления

**Дата**: 2025-01-06, 9:15 PM GMT+3
**Цель**: Настроить правильную интеграцию MCP Browser Use для автоматического тестирования расширения

---

## КРИТИЧЕСКАЯ ПРОБЛЕМА: Неправильный пакет установлен!

### Текущая ситуация

**Установлено**: `uvx browser-use --mcp` (официальный browser-use v0.11.2)
**Настроено в агентах**: `mcp__browser-use__*` low-level инструменты
**Нужно по инструкции Saik0s**: `mcp-server-browser-use` с high-level инструментами

---

## Два разных MCP проекта - НЕ путать!

### 1. Официальный browser-use (browser-use/browser-use)

**Репозиторий**: https://github.com/browser-use/browser-use
**Пакет**: `browser-use`
**Команда MCP**: `uvx --from 'browser-use[cli]' browser-use --mcp`
**Документация**: https://docs.browser-use.com/customize/integrations/mcp-server

**MCP Tools (Low-Level)**:
```
- browser_navigate
- browser_click
- browser_type
- browser_get_state
- browser_scroll
- browser_go_back
- browser_list_tabs
- browser_switch_tab
- browser_close_tab
- browser_extract_content
- retry_with_browser_use_agent
```

**Переменные окружения**:
```bash
OPENAI_API_KEY         # для OpenAI
ANTHROPIC_API_KEY      # для Anthropic
BROWSER_USE_HEADLESS   # show browser window
```

**Статус**: ❌ НЕ УСТАНОВЛЕН (команда `--mcp` не существует в версии 0.11.2!)

---

### 2. Saik0s MCP Server (Saik0s/mcp-browser-use)

**Репозиторий**: https://github.com/Saik0s/mcp-browser-use
**Пакет**: `mcp-server-browser-use`
**Команда MCP**: `uvx mcp-server-browser-use@latest`

**MCP Tools (High-Level)**:
```
- run_browser_agent      # один инструмент для всего
- run_deep_research      # для исследований
```

**Переменные окружения** (с префиксом `MCP_`):
```bash
# LLM Settings
MCP_LLM_PROVIDER                    # openai, anthropic, google, etc.
MCP_LLM_MODEL_NAME                  # gpt-4.1, claude-3.5-sonnet, etc.
MCP_LLM_ANTHROPIC_API_KEY          # API ключ для Anthropic
MCP_LLM_OPENAI_API_KEY             # API ключ для OpenAI
MCP_LLM_TEMPERATURE                # 0.0-2.0

# Browser Settings
MCP_BROWSER_HEADLESS                # true/false
MCP_BROWSER_USE_OWN_BROWSER         # true = подключиться к вашему Chrome
MCP_BROWSER_CDP_URL                 # http://localhost:9222
MCP_BROWSER_WINDOW_WIDTH            # 1280
MCP_BROWSER_WINDOW_HEIGHT           # 1080

# Agent Settings
MCP_AGENT_TOOL_MAX_STEPS            # 100
MCP_AGENT_TOOL_USE_VISION           # true
MCP_AGENT_TOOL_HISTORY_PATH         # /path/to/history

# Server Settings
MCP_SERVER_LOGGING_LEVEL            # DEBUG, INFO, ERROR
MCP_SERVER_LOG_FILE                 # /path/to/log
```

**CLI команды** (дополнительные возможности):
```bash
mcp-browser-cli run-browser-agent "Task description" -e .env
mcp-browser-cli run-deep-research "Research topic" -e .env
```

**Статус**: ✅ Это то, что нужно по вашей инструкции!

---

## Текущая конфигурация - ПРОБЛЕМЫ

### ~/.claude.json (текущее, НЕВЕРНОЕ)

```json
"browser-use": {
  "command": "uvx",
  "args": [
    "browser-use",           # ❌ НЕВЕРНЫЙ ПАКЕТ!
    "--mcp"                  # ❌ ЭТА КОМАНДА НЕ СУЩЕСТВУЕТ!
  ],
  "env": {
    "MCP_BROWSER_USE_OWN_BROWSER": "true",
    "MCP_BROWSER_CDP_URL": "http://localhost:9222",
    "ANTHROPIC_API_KEY": "fc7d20e878e44ff3b0b39eaab6fa6c8a.Tiyb7SZKIE7z6EDA",
    "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic"
  }
}
```

**Проблемы**:
1. ❌ Пакет `browser-use` не имеет команды `--mcp`
2. ❌ Переменные окружения НЕ используют префикс `MCP_`
3. ❌ API ключ настроен как для официального browser-use, а не для Saik0s
4. ❌ MCP сервер НЕ запускается (нет процесса)

### Агенты (.claude/agents/*.md)

**6 агентов используют инструменты**:
- supervisor.md
- security-auditor.md
- code-reviewer.md
- frontend-tester.md
- bug-investigator.md (4 упоминания)
- tester-debugger.md

**Инструменты в конфигурации**:
```yaml
tools:
  - mcp__browser-use__browser_navigate
  - mcp__browser-use__browser_click
  - mcp__browser-use__browser_type
  - mcp__browser-use__browser_get_state
  - mcp__browser-use__browser_list_tabs
  - mcp__browser-use__browser_switch_tab
  - mcp__browser-use__browser_close_tab
  - mcp__browser-use__browser_extract_content
  - mcp__browser-use__retry_with_browser_use_agent
```

**Проблемы**:
1. ❌ Это low-level инструменты от официального browser-use
2. ❌ Saik0s/mcp-browser-use предоставляет `run_browser_agent` (ОДИН инструмент)
3. ❌ Агенты не смогут работать с Saik0s MCP сервером!

---

## План исправления

### Вариант A: Использовать официальный browser-use (НЕ РЕКОМЕНДУЕТСЯ)

**Проблемы**:
- ❌ Команда `--mcp` не существует в установленной версии 0.11.2
- ❌ Нужна другая версия или установка через git
- ❌ Low-level инструменты (требуют много шагов)
- ❌ НЕ соответствует вашей инструкции Saik0s

**Если всё же хотите**:
```bash
# Установить из develop ветки (где может быть --mcp)
uvx --from 'git+https://github.com/browser-use/browser-use.git@develop#egg=browser-use' browser-use --mcp
```

### Вариант B: Использовать Saik0s mcp-browser-use (РЕКОМЕНДУЕТСЯ) ✅

**Шаг 1: Установить правильный пакет**

```bash
# Установить Playwright browsers (один раз)
uvx --from mcp-server-browser-use@latest python -m playwright install

# Проверить, что пакет работает
uvx mcp-server-browser-use@latest --help
```

**Шаг 2: Обновить ~/.claude.json**

```json
{
  "mcpServers": {
    "browser-use": {
      "command": "uvx",
      "args": ["mcp-server-browser-use@latest"],
      "env": {
        // LLM Provider (используем Z.AI через Anthropic)
        "MCP_LLM_PROVIDER": "anthropic",
        "MCP_LLM_MODEL_NAME": "claude-sonnet-4-20250514",
        "MCP_LLM_ANTHROPIC_API_KEY": "fc7d20e878e44ff3b0b39eaab6fa6c8a.Tiyb7SZKIE7z6EDA",
        "MCP_LLM_BASE_URL": "https://api.z.ai/api/anthropic",

        // Browser Settings (подключение к вашему Chrome)
        "MCP_BROWSER_USE_OWN_BROWSER": "true",
        "MCP_BROWSER_CDP_URL": "http://localhost:9222",
        "MCP_BROWSER_HEADLESS": "false",

        // Agent Settings
        "MCP_AGENT_TOOL_MAX_STEPS": "50",
        "MCP_AGENT_TOOL_USE_VISION": "true",

        // Debug Logging
        "MCP_SERVER_LOGGING_LEVEL": "DEBUG",
        "MCP_SERVER_LOG_FILE": "/tmp/mcp-browser-use.log"
      }
    }
  }
}
```

**Шаг 3: Создать .env файл для тестирования**

```bash
# /Users/timsmykov/Desktop/Extention for prompts/.env.mcp-browser-use

# LLM Provider
MCP_LLM_PROVIDER=anthropic
MCP_LLM_MODEL_NAME=claude-sonnet-4-20250514
MCP_LLM_ANTHROPIC_API_KEY=fc7d20e878e44ff3b0b39eaab6fa6c8a.Tiyb7SZKIE7z6EDA
MCP_LLM_BASE_URL=https://api.z.ai/api/anthropic
MCP_LLM_TEMPERATURE=0.0

# Browser (connect to your Chrome)
MCP_BROWSER_USE_OWN_BROWSER=true
MCP_BROWSER_CDP_URL=http://localhost:9222
MCP_BROWSER_HEADLESS=false
MCP_BROWSER_WINDOW_WIDTH=1920
MCP_BROWSER_WINDOW_HEIGHT=1080

# Agent
MCP_AGENT_TOOL_MAX_STEPS=50
MCP_AGENT_TOOL_USE_VISION=true
MCP_AGENT_TOOL_HISTORY_PATH=/tmp/browser-agent-history

# Server
MCP_SERVER_LOGGING_LEVEL=DEBUG
MCP_SERVER_LOG_FILE=/tmp/mcp-browser-use-debug.log
```

**Шаг 4: Обновить агентов для работы с `run_browser_agent`**

Изменить инструменты во всех агентах с:
```yaml
tools:
  - mcp__browser-use__browser_navigate
  - mcp__browser-use__browser_click
  - mcp__browser-use__browser_type
  - mcp__browser-use__browser_get_state
  - mcp__browser-use__browser_list_tabs
  - mcp__browser-use__browser_switch_tab
  - mcp__browser-use__browser_close_tab
  - mcp__browser-use__browser_extract_content
  - mcp__browser-use__retry_with_browser_use_agent
```

На:
```yaml
tools:
  - mcp__browser-use__run_browser_agent
  - mcp__browser-use__run_deep_research
```

**Или использовать wildcard**:
```yaml
tools:
  - mcp__browser-use__*
```

**Шаг 5: Создать скрипт запуска Chrome**

```bash
#!/usr/bin/env bash
# scripts/chrome-with-extension.sh

set -euo pipefail

EXT_PATH="/Users/timsmykov/Desktop/Extention for prompts/extension"
PROFILE="${HOME}/.chrome-browser-use"
PORT="9222"

# Убить существующие Chrome процессы
pkill -9 "Google Chrome" || true
sleep 2

# Запустить Chrome с расширением
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port="${PORT}" \
  --user-data-dir="${PROFILE}" \
  --load-extension="${EXT_PATH}" \
  --disable-extensions-except="${EXT_PATH}" \
  > /tmp/chrome-browser-use.log 2>&1 &

echo "Chrome started with extension on port ${PORT}"
echo "Waiting for Chrome to be ready..."
sleep 3

# Проверить, что Chrome доступен
if curl -s "http://localhost:${PORT}/json/version" > /dev/null; then
  echo "✅ Chrome is ready on port ${PORT}"
else
  echo "❌ Chrome failed to start on port ${PORT}"
  exit 1
fi
```

**Шаг 6: Проверить установку**

```bash
# 1. Запустить Chrome
./scripts/chrome-with-extension.sh

# 2. Проверить MCP сервер
uvx mcp-server-browser-use@latest --help

# 3. Протестировать через CLI
mcp-browser-cli run-browser-agent "Open http://example.com and tell me the title" \
  --env-file .env.mcp-browser-use

# 4. Перезапустить Claude Code
# 5. Проверить доступность инструментов в Claude Code
```

---

## Сравнение подходов

### Официальный browser-use (Low-Level)

**Плюсы**:
- ✅ Официально поддерживается
- ✅ Fine-grained контроль
- ✅ Подходит для сложных сценариев

**Минусы**:
- ❌ Много шагов для простых задач
- ❌ Команда `--mcp` не работает в версии 0.11.2
- ❌ Не соответствует вашей инструкции

### Saik0s mcp-browser-use (High-Level) ✅

**Плюсы**:
- ✅ Один инструмент `run_browser_agent` для всего
- ✅ Естественный язык для управления
- ✅ Поддержка множества LLM провайдеров
- ✅ CDP подключение к вашему браузеру
- ✅ CLI для тестирования вне Claude Code
- ✅ Визуализация (история, GIF)
- ✅ Гибкая конфигурация через env

**Минусы**:
- ⚠️ Неофициальный форк (но активно развивается)
- ⚠️ Требует обновления конфигов агентов

---

## Рекомендуемый порядок действий

### Сегодня (сейчас):

1. ✅ **Прочитать этот анализ** - вы здесь!
2. ⏳ **Решить: какой вариант использовать** (рекомендую Saik0s)
3. ⏳ **Создать .env.mcp-browser-use** файл
4. ⏳ **Создать scripts/chrome-with-extension.sh**

### Если выбираете Saik0s (РЕКОМЕНДУЕТСЯ):

5. ⏳ **Установить Playwright browsers**
   ```bash
   uvx --from mcp-server-browser-use@latest python -m playwright install
   ```

6. ⏳ **Обновить ~/.claude.json** с правильной конфигурацией
7. ⏳ **Обновить все агенты** (заменить инструменты на `run_browser_agent`)
8. ⏳ **Перезапустить Claude Code**
9. ⏳ **Протестировать** через CLI и затем в Claude Code

### Проверка работоспособности:

10. ⏳ **Запустить Chrome** через скрипт
11. ⏳ **Проверить CDP**: `curl http://localhost:9222/json/version`
12. ⏳ **Протестировать CLI**: `mcp-browser-cli run-browser-agent "..."`
13. ⏳ **В Claude Code**: попросить использовать `run_browser_agent`
14. ⏳ **Проверить расширение**: открыть chrome://extensions/

---

## Следующие шаги

**Жду вашего решения**:

1. Использовать **Saik0s mcp-browser-use** (рекомендуется) ✅
2. Использовать **официальный browser-use** (сложно, не соответствует инструкции)
3. Исследовать **другие варианты**

После выбора - готов выполнить установку и настройку!

---

## Дополнительные ресурсы

- **Saik0s GitHub**: https://github.com/Saik0s/mcp-browser-use
- **Официальный browser-use**: https://docs.browser-use.com/customize/integrations/mcp-server
- **Chrome CDP Docs**: https://chromedevtools.github.io/devtools-protocol/
- **MCP Protocol**: https://modelcontextprotocol.io/

---

**Создано**: 2025-01-06 at 9:15 PM GMT+3
**Статус**: Ожидает решения пользователя

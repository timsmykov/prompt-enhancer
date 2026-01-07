#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
EXTENSION_DIR="${EXTENSION_DIR:-$ROOT_DIR/extension}"
CHROME_BIN="${CHROME_BIN:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PROFILE_DIR="${PROFILE_DIR:-$HOME/.browser-use/chrome-profile}"
PROFILE_NAME="${PROFILE_NAME:-Default}"
CDP_PORT="${CDP_PORT:-9222}"
CDP_URL="${MCP_BROWSER_CDP_URL:-http://127.0.0.1:${CDP_PORT}}"
AUTO_START_CHROME="${BROWSER_USE_AUTO_START_CHROME:-0}"

cdp_ready() {
  curl -sf "$CDP_URL/json/version" >/dev/null 2>&1
}

if ! cdp_ready && [ "$AUTO_START_CHROME" = "1" ]; then
  if [ ! -x "$CHROME_BIN" ]; then
    echo "Chrome binary not found at $CHROME_BIN" >&2
    echo "Set CHROME_BIN to your Chrome executable path." >&2
    exit 1
  fi

  if [ ! -d "$EXTENSION_DIR" ]; then
    echo "Extension directory not found: $EXTENSION_DIR" >&2
    exit 1
  fi

  mkdir -p "$PROFILE_DIR"
  "$CHROME_BIN" \
    --remote-debugging-port="$CDP_PORT" \
    --remote-allow-origins="*" \
    --user-data-dir="$PROFILE_DIR" \
    --profile-directory="$PROFILE_NAME" \
    --load-extension="$EXTENSION_DIR" \
    --disable-extensions-except="$EXTENSION_DIR" \
    --auto-open-devtools-for-tabs \
    --no-first-run \
    --no-default-browser-check \
    about:blank >/dev/null 2>&1 &

  for _ in {1..30}; do
    if cdp_ready; then
      break
    fi
    sleep 0.5
  done
fi

if [ -n "${BROWSER_USE_LOGGING_LEVEL:-}" ]; then
  export BROWSER_USE_LOGGING_LEVEL
fi

if ! cdp_ready; then
  echo "Chrome with the extension is not running at $CDP_URL" >&2
  echo "Start Chrome manually, or set BROWSER_USE_AUTO_START_CHROME=1 to auto-start." >&2
  exit 1
fi

if [ -n "${BROWSER_USE_MODEL:-}" ]; then
  exec uvx --from 'browser-use[cli]' browser-use --mcp --model "$BROWSER_USE_MODEL" --cdp-url "$CDP_URL"
fi

exec uvx --from 'browser-use[cli]' browser-use --mcp --cdp-url "$CDP_URL"

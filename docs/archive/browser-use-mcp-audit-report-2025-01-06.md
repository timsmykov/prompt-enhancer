# MCP Browser Use Configuration Audit Report

**Date**: 2025-01-06
**Time**: 8:45 PM GMT+3
**Purpose**: Verify MCP Browser Use setup according to official Saik0s/mcp-browser-use instructions
**Goal**: Fully automated interaction between Claude Code and Google Chrome via MCP Browser Use

---

## Executive Summary

**STATUS**: ❌ **CRITICAL CONFIGURATION MISMATCH DETECTED**

Current setup uses the **wrong MCP server package**. The configuration is using the Python `browser-use` library's MCP server instead of the official `mcp-server-browser-use` from Saik0s/mcp-browser-use.

**Impact**:
- ❌ CLI commands unavailable (`mcp-server-browser-use status`, `tools`, `config`, `call`)
- ❌ Web UI not accessible (should be at http://localhost:8383)
- ❌ Dashboard not accessible (should be at http://localhost:8383/dashboard)
- ❌ GLM-4.7 not configured (using ANTHROPIC API instead of OpenAI protocol)
- ❌ Browser parameters not configurable via CLI
- ⚠️ Chrome CDP is working (port 9222 accessible) but not properly integrated

---

## Current Configuration (INCORRECT)

### MCP Server Configuration in ~/.claude.json

```json
"browser-use": {
  "command": "uvx",
  "args": [
    "browser-use",
    "--mcp"
  ],
  "env": {
    "MCP_BROWSER_USE_OWN_BROWSER": "true",
    "MCP_BROWSER_CDP_URL": "http://localhost:9222",
    "ANTHROPIC_API_KEY": "fc7d20e878e44ff3b0b39eaab6fa6c8a.Tiyb7SZKIE7z6EDA",
    "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic"
  }
}
```

### Problems Identified

1. **Wrong Package**: Using `uvx browser-use --mcp` (Python browser-use library)
   - **Should be**: Plugin-installed `mcp-server-browser-use` from Saik0s/mcp-browser-use

2. **Wrong LLM Provider**: Configured for Anthropic API
   - **Current**: `ANTHROPIC_API_KEY` + `ANTHROPIC_BASE_URL`
   - **Should be**: `OPENAI_API_KEY` + `OPENAI_BASE_URL` (for GLM-4.7 via OpenAI protocol)

3. **Missing GLM-4.7 Configuration**: Not configured at all
   - **Should set**: `llm.provider=openai`, `llm.model_name=GLM-4.7`

4. **Missing Browser Configuration**: Browser parameters hardcoded in env
   - **Should configure via CLI**: `browser.cdp_url`, `browser.user_data_dir`, `browser.headless`, `agent.max_steps`

5. **No CLI Tools Available**: Commands not found
   - ❌ `mcp-server-browser-use status`
   - ❌ `mcp-server-browser-use tools`
   - ❌ `mcp-server-browser-use config set`
   - ❌ `mcp-server-browser-use call run_browser_agent`

---

## What IS Working

### ✅ Chrome CDP Endpoint

```
$ curl http://localhost:9222/json/version
{
   "Browser": "Chrome/143.0.7499.170",
   "Protocol-Version": "1.3",
   "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...",
   "V8-Version": "14.3.127.17",
   "WebKit-Version": "537.36",
   "webSocketDebuggerUrl": "ws://localhost:9222/devtools/browser/..."
}
```

**Status**: ✅ Chrome is running with remote debugging enabled on port 9222

### ✅ Chrome Instances Running

Multiple Chrome instances detected in background:
- Shell 2136db: `--user-data-dir=/Users/timsmykov/.chrome-debug-profile`
- Shell a95c52: `--user-data-dir=/Users/timsmykov/.chrome-with-extension-profile`
- Shell 5250ad: `--user-data-dir=/Users/timsmykov/.chrome-with-extension-profile`

**Extension Path**: `/Users/timsmykov/Desktop/Extention for prompts/extension`
**Status**: ✅ Extension is being loaded via `--load-extension` flag

---

## Required Configuration (According to Instructions)

### 1. MCP Server Installation

**Correct Command**:
```bash
/plugin install browser-use/mcp-browser-use
```

**What This Provides**:
- Web UI at http://localhost:8383
- Dashboard at http://localhost:8383/dashboard
- CLI commands: `mcp-server-browser-use status`, `tools`, `config`, `call`
- Daemon that auto-starts with Claude Code
- Proper configuration management

### 2. GLM-4.7 Configuration

**Required Settings**:
```bash
mcp-server-browser-use config set -k llm.provider -v openai
mcp-server-browser-use config set -k llm.model_name -v GLM-4.7
export OPENAI_API_KEY="YOUR_GLM_KEY"
export OPENAI_BASE_URL="https://api.z.ai/api/coding/paas/v4"
```

**Why**: GLM-4.7 uses OpenAI-compatible protocol via Z.AI API endpoint

### 3. Browser Configuration

**Required Settings**:
```bash
mcp-server-browser-use config set -k browser.cdp_url -v http://localhost:9222
mcp-server-browser-use config set -k browser.user_data_dir -v ~/.chrome-browser-use
mcp-server-browser-use config set -k browser.headless -v false
mcp-server-browser-use config set -k agent.max_steps -v 30
```

**Why**: Enables connection to already-running Chrome with extension loaded

### 4. Chrome Startup Script

**Required**: `scripts/chrome-with-extension.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

EXT_DIST_ABS="/Users/timsmykov/Desktop/Extention for prompts/extension"
PROFILE_ABS="${HOME}/.chrome-browser-use"
PORT="9222"

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port="${PORT}" \
  --user-data-dir="${PROFILE_ABS}" \
  --load-extension="${EXT_DIST_ABS}" \
  --disable-extensions-except="${EXT_DIST_ABS}"
```

**Purpose**: Ensures Chrome starts with correct profile and extension every time

---

## Verification Checklist (From Instructions)

### Current Status vs Required

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| 1 | MCP server installed (`/plugin install`) | ❌ FAIL | CLI commands not found |
| 2 | Web UI accessible (localhost:8383) | ❌ FAIL | Port not listening |
| 3 | Dashboard accessible (localhost:8383/dashboard) | ❌ FAIL | Port not listening |
| 4 | GLM-4.7 configured (provider=openai) | ❌ FAIL | Using ANTHROPIC instead |
| 5 | GLM-4.7 model set | ❌ FAIL | Not configured |
| 6 | OPENAI_API_KEY set | ❌ FAIL | Using ANTHROPIC_API_KEY |
| 7 | OPENAI_BASE_URL set | ❌ FAIL | Using ANTHROPIC_BASE_URL |
| 8 | browser.cdp_url configured | ⚠️ PARTIAL | Set in env, not via config |
| 9 | browser.user_data_dir configured | ⚠️ PARTIAL | Using wrong profile |
| 10 | browser.headless=false | ❌ FAIL | Not configured |
| 11 | agent.max_steps=30 | ❌ FAIL | Not configured |
| 12 | Chrome running on port 9222 | ✅ PASS | CDP endpoint accessible |
| 13 | Extension loaded | ⚠️ PARTIAL | Loaded but wrong profile |
| 14 | chrome-with-extension.sh script | ❌ FAIL | Does not exist |
| 15 | Test `run_browser_agent` call | ❌ FAIL | Command not available |

**Pass Rate**: 1/15 (6.7%)

---

## Remediation Plan

### Phase 1: Remove Incorrect Configuration

1. Remove current browser-use MCP configuration from ~/.claude.json
2. Kill any running uvx browser-use processes

### Phase 2: Install Correct MCP Server

1. Install via plugin: `/plugin install browser-use/mcp-browser-use`
2. Verify installation with: `mcp-server-browser-use status`
3. Check Web UI: http://localhost:8383
4. Check Dashboard: http://localhost:8383/dashboard

### Phase 3: Configure GLM-4.7

1. Set provider: `mcp-server-browser-use config set -k llm.provider -v openai`
2. Set model: `mcp-server-browser-use config set -k llm.model_name -v GLM-4.7`
3. Get GLM API key from Z.AI
4. Export environment variables:
   ```bash
   export OPENAI_API_KEY="[YOUR_GLM_KEY]"
   export OPENAI_BASE_URL="https://api.z.ai/api/coding/paas/v4"
   ```

### Phase 4: Configure Browser Parameters

1. Set CDP URL: `mcp-server-browser-use config set -k browser.cdp_url -v http://localhost:9222`
2. Set user data dir: `mcp-server-browser-use config set -k browser.user_data_dir -v ~/.chrome-browser-use`
3. Set headless: `mcp-server-browser-use config set -k browser.headless -v false`
4. Set max steps: `mcp-server-browser-use config set -k agent.max_steps -v 30`

### Phase 5: Create Chrome Startup Script

1. Create `scripts/chrome-with-extension.sh` with proper macOS path
2. Make executable: `chmod +x scripts/chrome-with-extension.sh`
3. Test script starts Chrome with extension

### Phase 6: End-to-End Test

1. Kill all existing Chrome instances
2. Run startup script
3. Verify Chrome accessible: `curl http://localhost:9222/json/version`
4. Test MCP connection: `mcp-server-browser-use status`
5. Run test task:
   ```bash
   mcp-server-browser-use call run_browser_agent \
     task="Open http://example.com and report the page title"
   ```
6. Verify full automation with extension

---

## Critical Issues Summary

### High Priority (Blocking)

1. **Wrong MCP Server Package**
   - **Impact**: All CLI commands unavailable, no Web UI/dashboard
   - **Fix**: Remove uvx browser-use, install mcp-server-browser-use plugin

2. **GLM-4.7 Not Configured**
   - **Impact**: Using wrong LLM provider (Anthropic instead of GLM-4.7)
   - **Fix**: Reconfigure to use OpenAI protocol with Z.AI endpoint

### Medium Priority (Operational)

3. **Browser Configuration Hardcoded**
   - **Impact**: Cannot modify settings without editing env vars
   - **Fix**: Use proper config CLI commands

4. **No Standardized Startup Script**
   - **Impact**: Manual Chrome startup, inconsistent profiles
   - **Fix**: Create scripts/chrome-with-extension.sh

### Low Priority (Optimization)

5. **Multiple Chrome Profiles**
   - **Impact**: Confusion about which profile to use
   - **Fix**: Standardize on ~/.chrome-browser-use

---

## Recommended Next Steps

**Immediate Actions**:

1. ✅ **Audit completed** - This report documents all issues
2. ⏳ **User approval needed** - Decide whether to proceed with remediation
3. ⏳ **Backup current config** - Save working ~/.claude.json before changes
4. ⏳ **Execute remediation** - Follow 6-phase plan above
5. ⏳ **Verify automation** - Test full workflow with extension

**Questions for User**:

1. Do you want me to proceed with the full remediation?
2. Do you have a GLM API key from Z.AI, or do you need help getting one?
3. Should I kill all existing Chrome instances and start fresh with the correct profile?
4. Do you want the Chrome startup script in a specific location?

---

## Appendix: Reference Links

- **Official MCP Server**: https://github.com/Saik0s/mcp-browser-use
- **Z.AI Documentation**: https://docs.z.ai/devpack/tool/others
- **Browser-Use Python Library** (currently installed by mistake): https://github.com/browser-use/browser-use

---

**Report Generated**: 2025-01-06 at 8:45 PM GMT+3
**Configuration Version**: Current (incorrect) setup
**Target Configuration**: Saik0s/mcp-browser-use with GLM-4.7

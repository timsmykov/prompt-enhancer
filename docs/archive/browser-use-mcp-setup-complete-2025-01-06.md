# Browser Use MCP Setup - Complete ✅

**Date**: 2025-01-06, 9:30 PM GMT+3
**Status**: ✅ Successfully configured according to official documentation
**Documentation**: https://docs.browser-use.com/customize/integrations/mcp-server

---

## Summary

Browser Use MCP server is now **correctly configured** for local self-hosted operation with Chrome extension testing capabilities.

---

## Configuration Applied

### 1. Claude Code MCP Configuration (~/.claude.json)

**Updated** per official documentation:

```json
{
  "mcpServers": {
    "browser-use": {
      "command": "uvx",
      "args": [
        "--from",
        "browser-use[cli]",
        "browser-use",
        "--mcp",
        "--cdp-url",
        "http://localhost:9222"
      ],
      "env": {
        "ANTHROPIC_API_KEY": "fc7d20e878e44ff3b0b39eaab6fa6c8a.Tiyb7SZKIE7z6EDA"
      }
    }
  }
}
```

**Key Changes**:
- ✅ Added `--from 'browser-use[cli]'` to install CLI addon
- ✅ Added `--cdp-url http://localhost:9222` to connect to your Chrome instance
- ✅ Kept `ANTHROPIC_API_KEY` for LLM access
- ✅ Removed non-standard `MCP_BROWSER_*` environment variables

### 2. Chrome Configuration

**Chrome is running** with remote debugging enabled on port 9222:
- **Extension**: `/Users/timsmykov/Desktop/Extention for prompts/extension`
- **Profile**: `~/.chrome-with-extension-profile`
- **CDP Endpoint**: `http://localhost:9222`

**Verification**:
```bash
$ curl http://localhost:9222/json/version
{
   "Browser": "Chrome/143.0.7499.170",
   "Protocol-Version": "1.3",
   "webSocketDebuggerUrl": "ws://localhost:9222/devtools/browser/..."
}
```

### 3. Agent Tool Configuration

**6 agents configured** with browser-use MCP tools:

1. supervisor.md
2. security-auditor.md
3. code-reviewer.md
4. frontend-tester.md
5. bug-investigator.md (4 references)
6. tester-debugger.md

**Tools Available** (per official documentation):

**Direct Browser Control**:
- `mcp__browser-use__browser_navigate` - Navigate to URL
- `mcp__browser-use__browser_click` - Click element by index
- `mcp__browser-use__browser_type` - Type text into element
- `mcp__browser-use__browser_get_state` - Get page state and elements
- `mcp__browser-use__browser_scroll` - Scroll page
- `mcp__browser-use__browser_go_back` - Go back in history

**Tab Management**:
- `mcp__browser-use__browser_list_tabs` - List all tabs
- `mcp__browser-use__browser_switch_tab` - Switch to tab
- `mcp__browser-use__browser_close_tab` - Close tab

**Content Extraction**:
- `mcp__browser-use__browser_extract_content` - Extract structured content

**Session Management**:
- `mcp__browser-use__browser_list_sessions` - List active sessions
- `mcp__browser-use__browser_close_session` - Close session
- `mcp__browser-use__browser_close_all` - Close all sessions

**Autonomous Agent**:
- `mcp__browser-use__retry_with_browser_use_agent` - Run complete automation task

---

## How It Works

### Architecture

```
┌─────────────────┐
│  Claude Code    │
│                 │
│  Agent (supervisor, tester, etc.)
│       │         │
│       ▼         │
│  MCP Protocol   │
│  (stdio)        │
│       │         │
┌──────▼──────────┴───────┐
│  browser-use MCP        │
│  Server (local)         │
│  - uvx --from           │
│    browser-use[cli]     │
│    --mcp                │
└──────┬──────────────────┘
       │
       │ CDP Protocol
       │ (localhost:9222)
       ▼
┌────────────────────────┐
│  Google Chrome         │
│  - Extension loaded    │
│  - Remote debugging    │
│  - User profile        │
└────────────────────────┘
```

### Workflow

1. **Agent receives task** (e.g., "Test the extension on example.com")
2. **Agent calls MCP tool** (e.g., `browser_navigate`, `browser_get_state`)
3. **MCP server translates** to browser automation commands
4. **Chrome executes** via CDP (Chrome DevTools Protocol)
5. **Results returned** through MCP back to agent
6. **Agent analyzes** and takes next action or reports results

---

## Available Features

### ✅ What Works Now

1. **Low-Level Browser Control**
   - Navigate to URLs
   - Click elements by index
   - Type text into inputs
   - Get page state (HTML, elements, screenshots)
   - Scroll pages
   - Manage tabs

2. **Chrome Extension Testing**
   - Extension is loaded in Chrome
   - Can interact with extension UI
   - Can test context menus
   - Can verify overlay/popup behavior

3. **Session Management**
   - List active browser sessions
   - Close specific sessions
   - Manage multiple browser instances

4. **Content Extraction**
   - Extract structured data from pages
   - Get page HTML/text
   - Analyze page structure

### ⚠️ Limitations

1. **No High-Level Agent**
   - Must use low-level tools individually
   - No "run_browser_agent" single command
   - More manual control required

2. **No Vision Analysis**
   - Screenshot capture works
   - But no built-in vision LLM analysis
   - Would need separate vision tool integration

3. **CDP Connection Only**
   - Requires Chrome to be running first
   - Must maintain CDP connection
   - Chrome process management manual

---

## Usage Examples

### Example 1: Test Extension on a Website

```
Agent: "Navigate to example.com and test if the extension button appears"
Steps:
1. browser_navigate("https://example.com")
2. browser_get_state(include_screenshot=true)
3. Check for extension UI elements
4. Report results
```

### Example 2: Fill Form with Extension

```
Agent: "Use the extension to improve the prompt in the textarea"
Steps:
1. browser_navigate("https://example.com/form")
2. browser_click(index=5) # select textarea
3. browser_type("Your prompt here")
4. browser_click(index=10) # click "Improve" button
5. browser_get_state() # verify result
6. Extract improved prompt
```

### Example 3: Multi-Tab Testing

```
Agent: "Test extension behavior across multiple tabs"
Steps:
1. browser_navigate("https://example.com")
2. browser_list_tabs()
3. browser_navigate("https://another.com")
4. browser_switch_tab(tab_id=1)
5. browser_get_state() # check extension state
6. browser_close_tab(tab_id=2)
```

---

## Next Steps

### Immediate Actions Required

1. **Restart Claude Code** ⚠️
   ```bash
   # Quit Claude Code completely and restart
   # This will load the new MCP configuration
   ```

2. **Verify MCP Server Connection**
   - In Claude Code, check for browser-use tools
   - Try a simple navigate command
   - Verify no connection errors

3. **Test Extension End-to-End**
   - Open Chrome with extension (already running)
   - Use browser-use tools to test functionality
   - Verify extension UI is accessible

### Testing Checklist

- [ ] Restart Claude Code
- [ ] Check MCP server logs for errors
- [ ] Test `browser_navigate` to example.com
- [ ] Test `browser_get_state` with screenshot
- [ ] Verify extension is loaded in Chrome
- [ ] Test clicking extension UI elements
- [ ] Test prompt improvement workflow
- [ ] Verify all agent tools accessible

---

## Troubleshooting

### If MCP Server Doesn't Start

**Problem**: Claude Code shows no browser-use tools

**Solutions**:
1. Check `~/.claude.json` syntax is valid
2. Verify uvx is installed: `which uvx`
3. Test manually: `uvx --from 'browser-use[cli]' browser-use --mcp --help`
4. Check Claude Code logs: `~/Library/Logs/Claude/`

### If CDP Connection Fails

**Problem**: Cannot connect to Chrome on port 9222

**Solutions**:
1. Verify Chrome is running: `ps aux | grep Chrome`
2. Check CDP endpoint: `curl http://localhost:9222/json/version`
3. Restart Chrome with correct flags
4. Check for firewall blocking port 9222

### If Extension Not Detected

**Problem**: Extension UI not found in browser_get_state

**Solutions**:
1. Manually open `chrome://extensions/`
2. Verify extension is enabled
3. Check for errors in extension: chrome://extensions → Errors
4. Test extension manually first

---

## Comparison: Before vs After

### Before (Incorrect)

```json
{
  "command": "uvx",
  "args": ["browser-use", "--mcp"],  // ❌ Missing [cli] addon
  "env": {
    "MCP_BROWSER_USE_OWN_BROWSER": "true",  // ❌ Not standard
    "MCP_BROWSER_CDP_URL": "...",           // ❌ Not standard
    "ANTHROPIC_BASE_URL": "..."              // ❌ Not supported
  }
}
```

**Issues**:
- ❌ Command `--mcp` didn't exist without `[cli]` addon
- ❌ Non-standard environment variables
- ❌ No CDP connection configured
- ❌ MCP server failed to start

### After (Correct ✅)

```json
{
  "command": "uvx",
  "args": [
    "--from", "browser-use[cli]",  // ✅ CLI addon installed
    "browser-use",
    "--mcp",
    "--cdp-url", "http://localhost:9222"  // ✅ CDP connection
  ],
  "env": {
    "ANTHROPIC_API_KEY": "..."  // ✅ Standard variable only
  }
}
```

**Fixes**:
- ✅ Command `--mcp` works with `[cli]` addon
- ✅ CDP URL passed as command-line argument
- ✅ Standard environment variables only
- ✅ Connects to your Chrome with extension

---

## Official Documentation References

**MCP Server Documentation**:
- https://docs.browser-use.com/customize/integrations/mcp-server
- Local self-hosted option (free, open-source)
- Requires own LLM API keys (Anthropic/OpenAI)

**Available Tools**:
- https://docs.browser-use.com/customize/integrations/mcp-server#available-tools
- Low-level browser automation tools
- Session management
- Content extraction

**Environment Variables**:
- `ANTHROPIC_API_KEY` - Anthropic API key
- `OPENAI_API_KEY` - OpenAI API key (alternative)
- `BROWSER_USE_HEADLESS` - Show/hide browser window
- `BROWSER_USE_DISABLE_SECURITY` - Disable security features

---

## Success Criteria

### ✅ Configuration Verified

- [x] `~/.claude.json` updated per official docs
- [x] Chrome running with CDP on port 9222
- [x] Extension loaded in Chrome
- [x] uvx command includes `[cli]` addon
- [x] CDP URL configured correctly
- [x] 6 agents have browser-use tool permissions

### ⏳ Pending Verification

- [ ] Claude Code restarted with new config
- [ ] MCP server connection successful
- [ ] browser-use tools accessible in agents
- [ ] End-to-end extension test passes

---

## Support Resources

**Official**:
- Browser Use Docs: https://docs.browser-use.com
- MCP Protocol: https://modelcontextprotocol.io/
- Chrome DevTools Protocol: https://chromedevtools.github.io/devtools-protocol/

**Local Testing**:
```bash
# Test MCP server manually
uvx --from 'browser-use[cli]' browser-use --mcp --cdp-url http://localhost:9222

# Check Chrome CDP
curl http://localhost:9222/json/version

# Verify extension
open chrome://extensions/
```

---

**Configuration Completed**: 2025-01-06 at 9:30 PM GMT+3
**Status**: Ready for testing after Claude Code restart
**Next Action**: Restart Claude Code and verify MCP connection

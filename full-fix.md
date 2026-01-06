# Bug Fixer - YOLO Mode

Apply ALL bug fixes and make a git commit when done.

## CRITICAL FIXES (content.js):

1. **Race Condition (lines ~130-171)**: Move load listener BEFORE appendChild
2. **Memory Leak (line ~255)**: Remove unconditional resize listener; add only when overlay created
3. **Range Validity (lines ~66-73)**: Add specific type checks before try block

## CRITICAL FIXES (overlay.js):

4. **Null Check (line ~191)**: Check response.result before cleanupMarkdown
5. **Toast Timer (lines ~256-267)**: Track currentToastTimer properly
6. **Typing State (lines ~327-361)**: Add guard against multiple typing calls
7. **Regex (lines ~44-52)**: Use non-greedy regex (.+?)
8. **Aria-live (lines ~161-164)**: Add aria-live="polite" to toast
9. **Debounce (lines ~443-446)**: Add debounce for input handler

## MEDIUM FIXES (popup.js):

10. **Error Logging (lines ~127-131)**: Log errors before setting status
11. **localStorage (lines ~27-30)**: Handle objects properly
12. **API Key (line ~104)**: Mask API key value

## MEDIUM FIXES (background.js):

13. **tabId (lines ~17-21)**: Add null check
14. **Message Validation (lines ~39-46)**: Validate response properly

## INSTRUCTIONS:
1. Apply ALL fixes to src/ files AND extension/src/ files (keep in sync)
2. Run `npm test` to verify nothing broke
3. Make a git commit with message: "fix: resolve 14 bugs (race condition, memory leak, security, etc.)"
4. Use `--dangerously-skip-permissions` automatically approved

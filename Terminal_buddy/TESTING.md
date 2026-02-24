# Terminal Buddy - Testing Guide

> **Last Updated:** 2026-02-24
> **Status:** ✅ All core systems working

---

## Quick Test

```bash
cd /home/dylaroo/projects/Terminal_buddy/terminal-buddy/buddy-app
npm run tauri dev
```

The app will open in a new window showing:
- **Timeline view** with your terminal session history
- **System health** sidebar (CPU/RAM/Disk)
- **Command cards** with Explain/Re-run/Add Note buttons

---

## What's Working ✅

| Component | Status | Notes |
|-----------|--------|-------|
| **Daemon** | ✅ Working | All 6 unit tests pass |
| **MCP Protocol** | ✅ Working | Handshake complete, tools responding |
| **Sessions List** | ✅ Working | Real data from SQLite |
| **Command History** | ✅ Working | Real data from SQLite |
| **System Health** | ✅ Working | Live CPU/RAM/Disk stats |
| **Run Command** | ✅ Working | Executes via PTY |
| **Search** | ✅ Working | Full-text search with optional query |
| **Explain** | ⚠️ Stub | Returns placeholder (needs LLM backend) |

---

## Test Data

Sample data has been inserted into the database:

**Sessions:**
- "Morning dev session" (2 commands)
- "Git operations" (2 commands, still running)

**Commands:**
- `npm install` (Morning session)
- `git status` (Morning session)
- `cargo build --release` (Git operations)
- `npm run build` (Git operations)

**Database Location:**
```
~/.local/share/terminal-buddy/sessions.db
```

---

## Architecture Flow

```
React UI (App.tsx)
    ↓ getSessions(), getHistory()
tauri-mcp.ts
    ↓ invoke('get_sessions'), invoke('get_history')
lib.rs (Tauri backend)
    ↓ call_mcp_tool_safe()
mcp_client.rs
    ↓ JSON-RPC over stdio
buddy-daemon (MCP server)
    ↓ tool handlers (buddy_sessions, buddy_history, etc.)
SQLite (sessions.db)
    ↓ returns data
```

---

## Recent Fixes (2026-02-24)

### 1. TypeScript Build Errors
- **Issue:** Missing UI components, unused imports
- **Fix:** Removed unused `CommandCard.tsx`, prefixed unused variables with `_`
- **Result:** Clean build (1,735 modules, 219KB JS)

### 2. MCP Handshake Missing `initialized` Notification
- **Issue:** Daemon expected `initialized` notification after `initialize` response
- **Fix:** Added `send_notification()` method in `mcp_client.rs`
- **Result:** MCP connection now completes successfully

### 3. `buddy_history` Required Query Field
- **Issue:** Daemon required `query` parameter, but UI wanted to get recent commands without search
- **Fix:** Made `query: Option<String>` in `HistorySearchParams`
- **Result:** Can now list recent commands OR search with a query

---

## Known Limitations

| Feature | Status | Notes |
|---------|--------|-------|
| `buddy_explain` | Stub | Returns placeholder text (needs LLM integration) |
| `buddy_ask` | Stub | Returns placeholder text (needs LLM integration) |
| Voice Input | Not Implemented | Task 9 - whisper-rs integration |
| Terminal Pane | Not Implemented | Task 8 - xterm.js integration |
| Onboarding Wizard | Mock Only | Task 7 - auto-closes after 5s |

---

## Next Steps

1. **Implement LLM Backend** for `buddy_explain` and `buddy_ask`
2. **Terminal Pane** (xterm.js) - Task 8
3. **Voice Input** (whisper-rs) - Task 9
4. **Onboarding Wizard** - Task 7 (save preferences)
5. **Memvid Canvas SDK** - Timeline visualization

---

## Troubleshooting

### Port 1420 already in use
```bash
lsof -ti:1420 | xargs kill -9
```

### Daemon not found
The app looks for the daemon in this order:
1. `$BUDDY_DAEMON_PATH` (env var)
2. Same directory as the app binary
3. `../../target/release/buddy-daemon` (dev mode)
4. `buddy-daemon` (on `$PATH`)

### Clean database
```bash
rm ~/.local/share/terminal-buddy/sessions.db
# Daemon will recreate it on next run
```

---

**All systems operational!** 🚀

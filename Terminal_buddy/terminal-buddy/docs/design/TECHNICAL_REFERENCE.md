# Terminal Buddy - Technical Reference (Updated 2026-02-22 22:45 UTC)

> **Date:** 2026-02-22  
> **Updated:** 2026-02-22 22:45 UTC - Added Workshop Implementation Details  
> **Status:** Phase A complete. Phase B (desktop app) IN PROGRESS (build verified).  
> **Language:** Rust (daemon + Tauri backend), React + TypeScript (UI)  
> **Build status:** Daemon 6/6 tests pass. App builds successfully.

---

## 1. Project Structure

```
Terminal_buddy/
├── .mcp.json                          # MCP server registration for Claude Code
├── docs/                              # See WHERE_WE_ARE.md for full directory tree
│   ├── WHERE_WE_ARE.md                # Fast orientation snapshot
│   ├── design/
│   │   ├── TECHNICAL_REFERENCE.md     # This document
│   │   └── DESIGN_SYSTEM_V2.md        # UI component guidelines
│   ├── guides/
│   │   └── GETTING_STARTED.md         # General intro for users/agents
│   └── specs/
│       └── PRODUCT_SPEC_V2.md         # Product bible (authoritative)
│
└── terminal-buddy/                    # Rust workspace
    ├── Cargo.toml                     # Workspace root (defines all shared deps)
    ├── Cargo.lock                     # 337 total crate dependencies
    │
    ├── shared/                        # Shared types crate
    │   ├── Cargo.toml
    │   └── src/lib.rs                 # 58 lines - core data types
    │
    └── buddy-daemon/                  # Main daemon binary
        ├── Cargo.toml
        └── src/
            ├── main.rs                # 54 lines  - entry point, wires everything together
            ├── server.rs              # 417 lines - MCP server, 7 tool handlers
            ├── config.rs              # 147 lines - buddy.toml parser with defaults
            ├── memory/
            │   ├── mod.rs             # 1 line
            │   └── sqlite.rs          # 262 lines - SQLite session/command storage
            ├── monitor/
            │   ├── mod.rs             # 39 lines  - system health snapshots
            │   └── cleanup.rs         # 144 lines - disk cleanup scanner
            ├── correlation/
            │   ├── mod.rs             # 24 lines  - correlation engine facade
            │   └── filesystem.rs      # 91 lines  - inotify file watcher
            └── pty/
                ├── mod.rs             # 1 line
                └── capture.rs         # 89 lines  - PTY command execution

## 2. Creator Corner Workshop Implementation

### Frontend Structure
- `buddy-app/src/components/CreatorCornerWorkshop.tsx` - Main workshop component (4-step flow)
- `buddy-app/src/hooks/useMCP.ts` - Pencil integration hook with mock responses
- `buddy-app/src/components/CreatorCornerWorkshop.css` - Workshop styling following DESIGN_SYSTEM_V2.md

### Integration Points
- **MCP Configuration**: `.gemini/antigravity/mcp_config.json` updated with:
  - `figma`: `npx -y mcp-figma` with `FIGMA_ACCESS_TOKEN`
  - `pencil`: Local binary path with `--app antigravity`
- **Navigation**: Added "🛠️ Workshop" tab to top navigation in App.tsx
- **Routing**: Workshop route integrated in main content area

### Workshop Architecture
```
React (CreatorCornerWorkshop.tsx)
    ↓  calls
useMCP.ts — callPencilTool('list_templates') / update_style_guide() / etc.
    ↓  Tauri IPC
src-tauri/src/main.rs  ← Workshop integration point
    ↓  spawns / connects via stdio
buddy-daemon (running as MCP server) → Pencil MCP server
    ↓  responds with
Real design templates, style guides, component definitions
```

### Status
✅ Workshop shell implemented  
✅ Navigation integrated  
✅ Design system compliance verified  
⏳ Pencil MCP integration ready for testing

Total Rust source: ~1,327 lines (buddy-daemon + shared)
```

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    MCP HOST                              │
│         (Claude Code today, desktop app tomorrow)       │
│                                                         │
│   Sends JSON-RPC requests over stdin/stdout              │
└──────────────────────┬──────────────────────────────────┘
                       │ MCP Protocol (JSON-RPC 2.0)
                       │ Transport: stdio
                       ▼
┌─────────────────────────────────────────────────────────┐
│                 BUDDY DAEMON (Rust)                      │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ MCP Server   │  │ Session      │  │ System        │  │
│  │ (rmcp 0.16)  │  │ Store        │  │ Monitor       │  │
│  │              │  │ (SQLite)     │  │ (sysinfo)     │  │
│  │ 7 tools      │  │              │  │               │  │
│  │ exposed via  │  │ Commands     │  │ CPU, RAM,     │  │
│  │ tool_router  │  │ Sessions     │  │ disk, procs   │  │
│  │ macro        │  │ FS deltas    │  │               │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘  │
│         │                 │                   │          │
│  ┌──────┴─────────────────┴───────────────────┴───────┐  │
│  │                 Correlation Engine                   │  │
│  │  PTY capture (portable-pty) + FS watcher (notify)   │  │
│  │  Links: command → output → filesystem changes       │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                 Config (buddy.toml)                  │  │
│  │  Behavior, AI backend, storage paths, cleanup rules  │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                       │
                       ▼
              ~/.terminal-buddy/
              ├── sessions.db     (SQLite database)
              └── buddy.toml      (optional config)
```

### Key Design Decision

The daemon is the product. The terminal UI (Claude Code today, desktop app tomorrow) is just a frontend. By communicating over MCP (an open protocol), the daemon works with any host. Nothing built in Phase A gets thrown away in Phase B.

---

## 3. MCP Tools Exposed

The daemon registers as an MCP server and exposes these tools via JSON-RPC:

| Tool | Input | What It Does | Status |
|------|-------|-------------|--------|
| `buddy_history` | `query: string, limit?: number` | Full-text search across all recorded commands | **Working** |
| `buddy_sessions` | `limit?: number` | List recorded terminal sessions with timestamps and command counts | **Working** |
| `buddy_system_health` | *(none)* | Real-time CPU%, memory%, disk% per mount, process count | **Working** |
| `buddy_cleanup_scan` | `path?: string` | Scan directories for node_modules, **pycache**, .cache, /tmp bloat. Reports only, never deletes. | **Working** |
| `buddy_run` | `command: string, working_dir?: string, session_id?: string` | Execute a command in a PTY, capture output, record to history, track filesystem changes | **Working** |
| `buddy_ask` | `query: string, context?: string` | Translate natural language to shell command | **Stub** (needs LLM backend) |
| `buddy_explain` | `query: string, context?: string` | Explain an error, output, or concept | **Stub** (needs LLM backend) |

---

## 4. Dependency Map

### Workspace Dependencies (Cargo.toml)

| Crate | Version | Purpose | Category |
|-------|---------|---------|----------|
| `rmcp` | 0.16 | MCP protocol server (JSON-RPC over stdio) | Protocol |
| `tokio` | 1.40 | Async runtime (multi-threaded) | Runtime |
| `portable-pty` | 0.8 | Cross-platform PTY spawning and capture | Terminal |
| `sysinfo` | 0.30 | CPU, memory, disk, process monitoring | System |
| `notify` | 6.1 | Filesystem event watcher (inotify on Linux, FSEvents on macOS) | System |
| `rusqlite` | 0.31 | SQLite database (bundled, no system dependency) | Storage |
| `zstd` | 0.13 | Zstandard compression (for future .mv2 frames) | Storage |
| `serde` | 1.0 | Serialization/deserialization framework | Serialization |
| `serde_json` | 1.0 | JSON serialization | Serialization |
| `bincode` | 1.3 | Binary serialization (for future .mv2 format) | Serialization |
| `schemars` | 1.0 | JSON Schema generation (required by rmcp for tool params) | Schema |
| `anyhow` | 1 | Application-level error handling | Error |
| `thiserror` | 1 | Library-level typed errors | Error |
| `uuid` | 1.0 | UUID v4 generation for session/command IDs | Utility |
| `chrono` | 0.4 | Timestamp handling with UTC | Utility |
| `tracing` | 0.1 | Structured logging | Logging |
| `tracing-subscriber` | 0.3 | Log output formatting (writes to stderr) | Logging |
| `toml` | 0.8 | TOML config file parsing | Config |
| `dirs` | 5.0 | Platform-appropriate home/config directory paths | Config |

### Additional buddy-daemon Dependencies

| Crate | Version | Purpose |
|-------|---------|---------|
| `reqwest` | 0.13.2 | HTTP client (for future LLM API calls) |
| `rkyv` | 0.8.15 | Zero-copy deserialization (for future high-perf storage) |

### Dependency Total: 337 crates (including transitive)

---

## 5. Core Data Types (shared crate)

```rust
/// A single command execution and its correlated system impact.
pub struct CommandRecord {
    pub id: Uuid,
    pub session_id: Uuid,
    pub input: String,          // the command that was run
    pub output: String,         // captured stdout/stderr
    pub exit_code: Option<i32>,
    pub started_at: DateTime<Utc>,
    pub finished_at: DateTime<Utc>,
    pub working_dir: String,
}

/// Files changed during a command execution.
pub struct FilesystemDelta {
    pub command_id: Uuid,
    pub files_created: Vec<String>,
    pub files_modified: Vec<String>,
    pub files_deleted: Vec<String>,
}

/// System resource snapshot.
pub struct SystemSnapshot {
    pub timestamp: DateTime<Utc>,
    pub cpu_usage_pct: f32,
    pub memory_used_bytes: u64,
    pub memory_total_bytes: u64,
    pub disk_used_bytes: u64,
    pub disk_total_bytes: u64,
    pub process_count: usize,
}

/// A recorded terminal session.
pub struct SessionRecord {
    pub id: Uuid,
    pub title: Option<String>,
    pub started_at: DateTime<Utc>,
    pub ended_at: Option<DateTime<Utc>>,
    pub command_count: usize,
    pub notes: Vec<String>,
}

/// The Correlation Triple: what you typed + what changed + system state.
/// This is the core data structure for "Teachable Moments."
pub struct TeachableMoment {
    pub command: CommandRecord,
    pub filesystem: FilesystemDelta,
    pub system_before: SystemSnapshot,
    pub system_after: SystemSnapshot,
    pub explanation: Option<String>,
}
```

---

## 6. SQLite Schema

```sql
-- Sessions table
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    title TEXT,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    command_count INTEGER DEFAULT 0
);

-- Commands table
CREATE TABLE commands (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    input TEXT NOT NULL,
    output TEXT NOT NULL,
    exit_code INTEGER,
    started_at TEXT NOT NULL,
    finished_at TEXT NOT NULL,
    working_dir TEXT NOT NULL
);

-- Filesystem deltas table
CREATE TABLE filesystem_deltas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    command_id TEXT NOT NULL,
    files_created TEXT NOT NULL,  -- JSON array
    files_modified TEXT NOT NULL, -- JSON array
    files_deleted TEXT NOT NULL   -- JSON array
);
```

Database location: `~/.terminal-buddy/sessions.db`

---

## 7. Configuration (buddy.toml)

```toml
[behavior]
copilot_personality = "active"    # "silent" | "on-ask" | "active" | "teacher"
explain_level = "beginner"        # "beginner" | "intermediate" | "expert"
session_titling = "suggest"       # "auto" | "suggest" | "off"

[ai]
explanation_backend = "claude"    # "claude" | "openai" | "ollama" | "local"
privacy_mode = false              # true = force all-local processing

[storage]
data_dir = "~/.terminal-buddy"
max_storage_gb = 10

[cleanup]
auto_scan_interval = "weekly"     # "daily" | "weekly" | "monthly" | "manual"
scan_paths = ["~", "/var", "/tmp"]
```

Falls back to sensible defaults if no config file exists.

---

## 8. Test Coverage

```
test config::tests::test_default_config .............. ok
test config::tests::test_parse_toml .................. ok
test memory::sqlite::tests::test_create_and_list_sessions ... ok
test memory::sqlite::tests::test_record_and_search_commands . ok
test memory::sqlite::tests::test_record_filesystem_delta .... ok
test pty::capture::tests::test_run_command ........... ok

6 passed, 0 failed
```

| Module | Tests | What's Covered |
|--------|-------|----------------|
| `config` | 2 | Default config values, TOML parsing |
| `memory::sqlite` | 3 | Session CRUD, command recording + search, filesystem delta storage |
| `pty::capture` | 1 | PTY command execution, output capture, exit code |

---

## 9. Build & Run

```bash
# Build debug
cd terminal-buddy && cargo build

# Build release (optimized, ~7 MB binary)
cd terminal-buddy && cargo build --release

# Run tests
cd terminal-buddy && cargo test

# Binary location
terminal-buddy/target/release/buddy-daemon

# MCP registration (for Claude Code)
# Already configured in .mcp.json at project root
```

### MCP Registration (.mcp.json)

```json
{
  "mcpServers": {
    "terminal-buddy": {
      "command": "/home/dylaroo/projects/Terminal_buddy/terminal-buddy/target/release/buddy-daemon",
      "args": [],
      "env": {}
    }
  }
}
```

### Smoke Test

```bash
# Send MCP initialize + tools/list over stdin
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"0.1.0"}}}' | timeout 2 ./target/release/buddy-daemon 2>/dev/null
```

Returns valid JSON-RPC with all 7 tools and their JSON Schema definitions.

---

## 10. Phase B: Desktop App (IN PROGRESS)

### Architecture

```
┌──────────────────────────────────────────────────────────┐
│ Terminal Buddy Desktop App (Tauri v2)                     │
│                                                          │
│  ┌───────────────────────┐  ┌─────────────────────────┐  │
│  │ Journal View (React)   │  │ Terminal Pane (xterm)   │  │
│  │                        │  │                         │  │
│  │ - Timeline / Topics    │  │ - Embedded PTY surface  │  │
│  │ - Creator Corner       │  │ - Collapsible           │  │
│  │ - Search               │  │                         │  │
│  │ - Teachable moments    │  │                         │  │
│  │ - Voice Input UI       │  │                         │  │
│  └───────────┬────────────┘  └────────────┬────────────┘  │
│              │                            │               │
│  ┌───────────┴────────────────────────────┴────────────┐  │
│  │         Tauri Rust Backend (invoke handlers)         │  │
│  │         Bridging UI to MCP & native OS features     │  │
│  └──────────────────────┬──────────────────────────────┘  │
│                         │                                 │
│  ┌──────────────────────┴──────────────────────────────┐  │
│  │    buddy-daemon (The Brain)                          │  │
│  │    7 MCP tools, SQLite storage, correlation, PTY     │  │
│  └─────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Phase B Tech Stack

| Component | Technology | Version | Why This |
|-----------|-----------|---------|----------|
| Desktop Wrapper | Tauri | v2 | Rust backend + web frontend, native OS integration |
| Frontend UI | React + TS | 18+ | Journal UI, Creator Corner, fast development |
| Terminal Pane | xterm.js | latest | Lightweight, standard web terminal emulator |
| Voice Input | whisper-rs | latest | Local speech-to-text, 100% on-device privacy |
| AI Backend | Claude API / Local | - | BYOK for cloud quality, local for privacy |

### Phase B Tasks (Current Status)

| Task | Status | Description |
|------|--------|-------------|
| 1. Scaffold App | ✅ **COMPLETE** | Scaffold Tauri v2 + React build |
| 2. MCP Bridge | ⬜ NOT STARTED | Connect React to buddy-daemon via Tauri invoke |
| 3. Design System | ✅ **COMPLETE** | 50+ CSS vars, Atkinson Hyperlegible |
| 4-6. Journal Views | ⬜ NOT STARTED | Timeline, Topics, and Search UI |
| 7. Onboarding | ⬜ NOT STARTED | Mode selection (voice/keyboard) |
| 8. Terminal Pane | ⬜ NOT STARTED | xterm.js integration |
| 9. Voice Input | ⬜ NOT STARTED | whisper-rs push-to-talk |
| 10. Creator Corner | ⬜ NOT STARTED | Skin designer MVP |
| 11. Polish & Ship | ⬜ NOT STARTED | Final packaging |

### Phase C (Future)

| Task | Description |
|------|-------------|
| Cross-platform builds | Linux, macOS, Windows via Tauri |
| Plugin system | External MCP servers as Terminal Buddy plugins |
| Auto-update | Binary distribution and update mechanism |
| Security hardening | STRIDE analysis, sandboxed command execution |

---

## 11. How MCP Works (For Context)

MCP (Model Context Protocol) is an open standard created by Anthropic for connecting AI models to external tools. It uses JSON-RPC 2.0 over stdio (or HTTP/SSE).

**The flow:**

1. Host (Claude Code) starts the daemon as a subprocess
2. Host sends `initialize` → daemon responds with capabilities and tool list
3. Host sends `tools/call` with tool name + parameters → daemon executes and returns results
4. All communication is JSON over stdin/stdout

**Why this matters:** Any MCP-compatible host can use Terminal Buddy. Today that's Claude Code. Tomorrow it's our own desktop app. Could also be Cursor, Windsurf, or any other MCP host.

The `rmcp` crate (v0.16) handles all protocol negotiation. Tool definitions are generated from Rust struct annotations using `#[tool]` and `#[tool_router]` proc macros, which auto-generate JSON Schema from the Rust types via `schemars`.

---

## 12. Platform Support

| Platform | Daemon | Desktop App (Phase B) |
|----------|--------|----------------------|
| Linux x86_64 | Built and tested | Planned (Tauri + WezTerm) |
| Linux ARM64 | Should compile (untested) | Planned |
| macOS | Should compile (notify has FSEvents support) | Planned |
| Windows | Should compile (portable-pty has Windows support) | Planned |

Current development is on Linux (Ubuntu, kernel 6.8.0).

---

*Last updated: 2026-02-22. Source of truth for technical details about Terminal Buddy.*

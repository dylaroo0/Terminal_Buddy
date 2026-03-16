# Terminal Buddy - Architecture Design

> **Status:** APPROVED
> **Author:** Roo (Claude Opus 4.6) + dylaroo
> **Date:** 2026-02-22
> **Supersedes:** Previous GPUI-only and MCP-App-only approaches
> **Reference Docs:** `TERMINAL_BUDDY_MASTER_SPEC.md`, `TERMINAL_BUDDY_BMAD_TEAM_PLAN.md`, `SPEC_VS_TEAM_PLAN_COMPARISON.md`

---

## 1. What Terminal Buddy Is

An AI-powered terminal assistant that **understands what your commands did to your computer, explains it in plain English, and remembers everything.**

The primary user is dyslexic and new to CS. They need to:
- **Speak** commands in plain English instead of typing cryptic syntax
- **See** what happened to their computer after each command
- **Go back later** and learn from what they did
- **Get help** cleaning up, troubleshooting, and understanding their system

For power users, Terminal Buddy is:
- A permanent, searchable "black box" of every terminal session
- System-level correlation (kernel logs + filesystem + process trees) for every command
- AI-powered troubleshooting grounded in actual system data, not guesses

---

## 2. Core Architectural Decision: Build the Brain First

### The Insight

The intelligence layer (Buddy Daemon) is the product. The terminal it connects to is just a front-end. By building the daemon as an **MCP server**, it works with any terminal:

- **Phase A:** Claude Code plugin (immediate, daily use)
- **Phase B:** Custom WezTerm-based desktop terminal (the full vision)
- **Phase C:** Any MCP-compatible host (Cursor, Windsurf, web UI, etc.)

### Why This Order

1. **Speed:** MCP server in Claude Code can be functional in weeks, not months
2. **Data accumulation:** Session history starts recording immediately
3. **Zero waste:** The MCP server built for Phase A IS the same server Phase B uses
4. **Risk reduction:** Validate the intelligence features before investing in custom terminal UI
5. **Daily use:** dylaroo uses Claude Code every day - gets value immediately

---

## 3. Architecture

### Phase A: Buddy Daemon as MCP Server (Claude Code Plugin)

```
Claude Code (or any MCP host)
┌─────────────────────────────────────────┐
│ Terminal (built-in)                      │
│ $ docker-compose up                     │
│ Error: port 8080 already in use         │
└──────────┬──────────────────────────────┘
           │ PTY output captured
           ▼
┌─────────────────────────────────────────┐
│ BUDDY DAEMON (Rust MCP Server)          │
│                                         │
│ ┌─────────────┐  ┌──────────────────┐   │
│ │ Correlation  │  │ Memvid Writer    │   │
│ │ Engine       │  │ (.mv2 + SQLite)  │   │
│ │ 3-stream:    │  │                  │   │
│ │ · terminal   │  │ Session history  │   │
│ │ · filesystem │  │ Semantic search  │   │
│ │ · kernel log │  │ Vector embeddings│   │
│ └─────────────┘  └──────────────────┘   │
│                                         │
│ ┌─────────────┐  ┌──────────────────┐   │
│ │ AI Command  │  │ System Monitor   │   │
│ │ Translator  │  │ + Cleanup Mode   │   │
│ │ English →   │  │                  │   │
│ │ shell cmds  │  │ CPU, disk, procs │   │
│ └─────────────┘  └──────────────────┘   │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ MCP Server Interface                │ │
│ │ Tools:                              │ │
│ │ · buddy.ask          (voice/text)   │ │
│ │ · buddy.run          (with approval)│ │
│ │ · buddy.explain      (last command) │ │
│ │ · buddy.history      (search)       │ │
│ │ · buddy.system_health              │ │
│ │ · buddy.cleanup_scan               │ │
│ │ · buddy.session_list               │ │
│ │ · buddy.teachable_moment           │ │
│ │                                     │ │
│ │ Resources:                          │ │
│ │ · Session history data              │ │
│ │ · System snapshots                  │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Phase B: Custom Terminal (WezTerm Fork + Buddy Panel)

```
┌─────────────────────────────────────────────────────────────┐
│ Terminal Buddy Desktop                                       │
│                                                              │
│ ┌────────────────────────┐  ┌──────────────────────────────┐│
│ │ WezTerm Terminal        │  │ Buddy Panel                  ││
│ │ (GPU, 120FPS, tabs,     │  │                              ││
│ │  panes, Lua config)     │  │ Voice/Chat Input             ││
│ │                         │  │ "Clean up old Docker stuff"  ││
│ │ Commands execute here   │  │                              ││
│ │ - type or let Buddy     │  │ AI Response + Approval       ││
│ │   drive for you         │  │ "I'll run 3 commands..."     ││
│ │                         │  │ [Approve] [Edit] [Cancel]    ││
│ │                         │  │                              ││
│ │                         │  │ Session History Browser      ││
│ │                         │  │ System Health Dashboard      ││
│ │                         │  │ Teachable Moment Panel       ││
│ │                         │  │ Cleanup Suggestions          ││
│ │                         │  │                              ││
│ │                         │  │ (Memvid Canvas components)   ││
│ └────────────────────────┘  └──────────────────────────────┘│
│              ↕                            ↕                  │
│ ┌───────────────────────────────────────────────────────────┐│
│ │ SAME Buddy Daemon (MCP Server) from Phase A              ││
│ └───────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Key:** The daemon is identical in both phases. Phase B just adds a better front-end around it.

---

## 4. The Buddy Daemon - Core Components

### 4.1 Correlation Engine (The "Why Behind Commands")

When any command completes, the daemon captures three data streams and links them:

| Stream | What It Captures | Source |
|--------|-----------------|--------|
| **Terminal** | stdout/stderr output | PTY reader |
| **Filesystem** | Files created/modified/deleted | `notify` crate (inotify/FSEvents) |
| **System Logs** | Kernel/OS logs from the exact timestamp window | journalctl / macOS Unified Logging |

These three streams, correlated by command ID and timestamp, produce a **Teachable Moment** - a plain-English explanation grounded in real system data.

### 4.2 Memvid Writer (Session Memory)

Hybrid storage: SQLite for metadata + .mv2 binary for raw frame data.

- **SQLite:** Session titles, timestamps, tags, command index, search index
- **.mv2:** Compressed terminal state snapshots, system deltas, vector embeddings
- **Append target:** < 5ms per frame
- **Capture interval:** Every 100ms or on command completion
- **Vector embeddings:** 1536-dim, generated locally for semantic search

### 4.3 AI Command Translator

The core accessibility feature. Converts plain English to shell commands:

```
User says: "I need to free up disk space, there's a bunch of
           old Docker stuff and some node_modules I don't need"

Buddy responds:
  "I'll clean up Docker and find large node_modules. Here's my plan:

   1. docker system prune -a        (removes unused containers/images)
   2. docker volume prune            (removes unused volumes)
   3. find ~ -name node_modules -type d -maxdepth 4
      (finds node_modules to review - won't delete without approval)

   Want me to run these? [Approve All] [Step by Step] [Edit] [Cancel]"
```

- Multi-command understanding (one request = multiple commands)
- Always shows what it will do BEFORE running
- User approves, edits, or cancels
- Everything recorded to Memvid for later learning

### 4.4 System Monitor + Cleanup Mode

Continuous background monitoring:

- CPU, memory, disk usage trends across sessions
- Process tree tracking (what's running, what started when)
- Package inventory (what's installed, when, last used)

**Cleanup Mode:** Buddy scans for:
- Unused packages/dependencies
- Old Docker containers/images/volumes
- Orphaned node_modules
- Large temp files
- Stale git branches
- Unused pip/npm/cargo packages

Presents findings as suggestions with explanations, never auto-deletes.

### 4.5 Voice Engine (Phase 3)

Local speech-to-text via whisper.cpp:

- Push-to-talk (configurable hotkey)
- All transcription happens on-device (privacy-first)
- Voice feedback option (Buddy speaks explanations aloud)
- Optional always-on wake word ("hey buddy")

---

## 5. MCP Server Interface

### Tools

| Tool | Type | Description |
|------|------|-------------|
| `buddy.ask` | Interactive | Send natural language request, get command plan back |
| `buddy.run` | Execute | Execute approved command(s) in terminal (requires user confirmation) |
| `buddy.explain` | Read-only | Get Teachable Moment for last/specific command |
| `buddy.history` | Read-only | Search session history by date, topic, or semantic query |
| `buddy.session_list` | Read-only | List all sessions with titles and dates |
| `buddy.system_health` | Read-only | Current system state (CPU, disk, memory, processes) |
| `buddy.cleanup_scan` | Read-only | Scan for cleanup opportunities |
| `buddy.get_screen` | Read-only | Current terminal screen contents |
| `buddy.search` | Read-only | Semantic search across all .mv2 history |
| `buddy.add_note` | Write | Add learning note to a session |

### Resources

| Resource | Description |
|----------|-------------|
| `buddy://sessions` | Session history data |
| `buddy://system` | System snapshot data |
| `buddy://config` | buddy.toml configuration |

---

## 6. Technology Stack

### Buddy Daemon (Rust)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Async Runtime | `tokio` 1.x | All async I/O |
| MCP Server | `rmcp` or custom | MCP protocol implementation |
| PTY | `portable-pty` 0.8 | Cross-platform PTY management |
| VTE Parsing | `wezterm-term` | Terminal escape sequence parsing |
| File Watching | `notify` | Filesystem change detection |
| System Info | `sysinfo` 0.30 | CPU, memory, process monitoring |
| Kernel Logs | `libsystemd` | journalctl access (Linux) |
| Storage | `rusqlite` 0.31 | SQLite for metadata/search |
| Serialization | `serde` + `bincode` | .mv2 frame serialization |
| Compression | `zstd` | Frame compression |
| Error Handling | `anyhow` + `thiserror` | Structured error types |

### Phase B: Custom Terminal

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Terminal Engine | WezTerm fork | GPU rendering, VTE, multiplexer |
| Buddy Panel | Memvid Canvas React | Dashboard, search, chat, timeline |
| Desktop Wrapper | Tauri | Native window + web panel |
| Configuration | Lua (WezTerm) + `buddy.toml` | Terminal config + Buddy config |

---

## 7. Configuration (buddy.toml)

```toml
[appearance]
theme = "dyslexia-dark"
font_family = "OpenDyslexic"
font_size = 16

[behavior]
copilot_personality = "active"    # "silent" | "on-ask" | "active" | "teacher"
explain_level = "beginner"        # "beginner" | "intermediate" | "expert"
session_titling = "suggest"       # "auto" | "suggest" | "off"
teachable_moments = "inline"      # "inline" | "panel" | "voice-only" | "off"

[voice]
push_to_talk_key = "RightCtrl"
voice_feedback = true
voice_speed = 1.0

[ai]
transcription = "local"           # "local" (whisper) | cloud STT
explanation_backend = "claude"    # "local" | "claude" | "openai" | "gemini" | "ollama"
privacy_mode = false              # true = force all-local

[storage]
memvid_path = "~/.terminal-buddy/history.mv2"
sqlite_path = "~/.terminal-buddy/sessions.db"
max_storage_gb = 10

[cleanup]
auto_scan_interval = "weekly"     # "daily" | "weekly" | "monthly" | "manual"
scan_paths = ["~", "/var", "/tmp"]
```

---

## 8. Phased Roadmap

### Phase A: MCP Server Plugin (Target: Working in Claude Code)

**Goal:** Buddy Daemon running as MCP server, usable in Claude Code daily.

| Task | Description |
|------|-------------|
| Cargo project setup | Rust workspace for buddy-daemon |
| PTY capture | Hook into shell session, capture input/output |
| Correlation Engine v1 | Terminal output + filesystem delta (2 of 3 streams) |
| Memvid Writer v1 | SQLite + .mv2 basic recording |
| Session management | Start/stop sessions, auto-title via AI |
| MCP Server | Expose core tools (ask, explain, history, system_health) |
| AI Command Translation | English -> shell commands with approval flow |
| System Monitor v1 | Basic CPU/disk/memory tracking |
| buddy.toml parser | Configuration system |
| Claude Code integration | Install as MCP server, test daily use |

**Acceptance:** dylaroo can speak a request in Claude Code, Buddy translates it to commands, executes with approval, and the session is recorded and searchable.

### Phase B: Custom Desktop Terminal

**Goal:** WezTerm fork with integrated Buddy Panel.

| Task | Description |
|------|-------------|
| WezTerm fork | Fork, rebrand, customize |
| Buddy Panel UI | Memvid Canvas React components in Tauri side panel |
| Deep PTY integration | Buddy hooks directly into WezTerm's PTY layer |
| Correlation Engine v2 | Add kernel log stream (3rd stream) |
| Voice Engine | whisper.cpp local STT integration |
| Skin system | Dyslexia-first default + power user skin |
| Cleanup Mode | Full package/dependency scanning and suggestions |
| Timeline scrubbing | Visual replay of past sessions |
| RAG Chat | "What did I do with Docker last Tuesday?" |

**Acceptance:** Full desktop app with WezTerm terminal + Buddy Panel, voice input, session history with timeline scrubbing, cleanup suggestions.

### Phase C: Polish & Ship

| Task | Description |
|------|-------------|
| Security hardening | STRIDE analysis, command confirmation flow |
| Cross-platform | Linux, macOS, Windows builds |
| Plugin system | External MCP servers as Terminal Buddy plugins |
| Neovim plugin | Optional editor embedding |
| Release pipeline | Binary distribution, auto-update |

---

## 9. What We Keep from Gemini's Scaffold

The existing code in `terminal-buddy/` is a starting point but needs significant rework:

- **Keep:** Cargo workspace structure, dependency choices (tokio, portable-pty, serde, anyhow)
- **Keep:** The idea of xterm.js for web-based fallback (useful for Phase C web UI option)
- **Rework:** PtyRunner needs to be async (currently synchronous/blocking)
- **Rework:** No MCP server exists yet - this is the core of Phase A
- **Drop:** The local-echo xterm.js UI is not needed for Phase A (Claude Code has its own terminal)

---

## 10. Open Decisions (To Be Resolved During Implementation)

| Decision | Options | Default |
|----------|---------|---------|
| MCP server crate | `rmcp` vs custom implementation | Evaluate both |
| Embedding model for semantic search | Local (sentence-transformers) vs API | Local first |
| AI explanation backend | Claude API vs local LLM | Claude API (quality matters for accessibility) |
| WezTerm fork timing | Start during Phase A or wait | Wait for Phase B |
| Memvid Canvas version | Current npm vs fork | Current npm packages |

---

*This design was produced by synthesizing the Master Spec (762 lines), Team Plan (399 lines), Comparison Doc (577 lines), Memvid Canvas docs, and extensive discussion with dylaroo about the core vision and accessibility requirements.*

# Terminal Buddy Handoff Document

> **Document Status:** HISTORICAL SCAFFOLD (Phase A now complete)
> **Author:** Gemini 3.1 Pro (initial scaffold), updated by Roo (Claude Opus 4.6)
> **Date:** 2026-02-22
> **Superseded By:** `docs/plans/2026-02-22-terminal-buddy-architecture-design.md`
> **Still Useful For:** Understanding the project's evolution from scaffold to working MCP server

---

## What Gemini 3.1 Pro Scaffolded

1. **Cargo Workspace** at `terminal-buddy/`:
   - `daemon/` — Tokio-based backend with a basic `PtyRunner` using `portable-pty`
   - `ui/` — Tauri dependency + `web/` directory with xterm.js + WebGL addon
   - `shared/` — IPC and common structures (placeholder only)
   - Fixed `rustix` compilation errors by upgrading `alacritty_terminal` to v0.25.1

2. **Web UI** at `terminal-buddy/ui/web/`:
   - xterm.js with `@xterm/addon-fit` and `@xterm/addon-webgl` for GPU rendering
   - Custom branding, dark mode gradients, dummy input handling
   - Local echo only — not wired to the PTY backend

3. **Documentation Alignment:**
   - Synthesized Master Spec and Team Plan into a unified architectural vision
   - Established 4-Phase roadmap and "Philosophy of Choice" principle

## What Changed After Review

The architecture was **significantly revised** after collaborative design with dylaroo:

- **GPUI sidecar approach:** Dropped
- **MCP App as terminal:** Reframed — MCP App is for the intelligence panel, not the terminal itself
- **New strategy:** "Plugin First" — build the Buddy Daemon as a Rust MCP server that works as a Claude Code plugin (Phase A), then wrap it in a WezTerm-based desktop terminal (Phase B)
- **AI command translation:** Core feature — user speaks English, AI translates to shell commands with approval flow

## Current Architecture (Approved)

See: `docs/plans/2026-02-22-terminal-buddy-architecture-design.md`

**Phase A:** Buddy Daemon as Rust MCP server binary (Claude Code plugin) — **COMPLETE**
**Phase B:** WezTerm fork with integrated Buddy Panel (desktop terminal) — PLANNED

The daemon IS the product. Terminal frontends are interchangeable.

---

## Phase A Implementation — COMPLETE (2026-02-22)

Implementation plan: `docs/plans/2026-02-22-phase-a-buddy-daemon-mcp-server.md`

### What Was Built

**Workspace:** `terminal-buddy/` with 2 crates:
- `buddy-daemon/` — Rust MCP server binary (6.4MB release)
- `shared/` — Correlation triple type system (CommandRecord, SystemSnapshot, FilesystemDelta)

**4 MCP Tools exposed via stdio:**
| Tool | Purpose |
|------|---------|
| `buddy_history` | Search past commands by keyword |
| `buddy_sessions` | List recent terminal sessions |
| `buddy_system_health` | CPU, memory, disk, process count |
| `buddy_cleanup_scan` | Non-destructive disk space suggestions |

**Infrastructure components:**
- **SQLite storage** (`memory/sqlite.rs`) — Sessions, commands, filesystem deltas, full-text search
- **System monitor** (`monitor/mod.rs`) — sysinfo-based snapshots for correlation triples
- **Cleanup scanner** (`monitor/cleanup.rs`) — Finds node_modules, caches, /tmp bloat
- **Filesystem watcher** (`correlation/filesystem.rs`) — notify-based file change tracking
- **Config parser** (`config.rs`) — buddy.toml with sensible zero-config defaults
- **MCP server** (`server.rs`) — rmcp 0.16.0 with declarative `#[tool]` macros

**Test coverage:** 5 passing tests (SQLite CRUD, config parsing)

**Claude Code registration:** `.mcp.json` at project root — picks up on next session start

### Key Technical Decisions

- **rmcp 0.16.0** with `schemars 1.0` (not 0.8!) for JSON Schema generation
- **sysinfo 0.30** API: `sys.global_cpu_info().cpu_usage()` (not `global_cpu_usage()`)
- **Hybrid sync/async** in filesystem watcher: `Arc<Mutex<>>` with `blocking_lock()` in notify callbacks
- **Config uses `#[serde(default)]`** at every struct level for progressive customization

### Binary Location

```
terminal-buddy/target/release/buddy-daemon
```

### What's Next (Phase B)

1. PTY capture integration (portable-pty) — intercept shell commands for real session recording
2. Correlation engine — link commands → filesystem changes → system snapshots
3. WezTerm-based desktop terminal with embedded Buddy Panel
4. AI command translation: natural language → shell commands with approval flow

## Existing Scaffold Status

The original Gemini scaffold code was **replaced** during Phase A restructure:

- `daemon/` → Replaced by `buddy-daemon/` (MCP server architecture)
- `ui/` → Preserved for Phase B reference (xterm.js + WebGL)
- `shared/` → Rebuilt with correlation triple types

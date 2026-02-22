# Terminal Buddy — BMAD Team & Module Plan

> **Status:** DRAFT — Ready for collaborative review  
> **Author:** dylaroo + Antigravity (Gemini)  
> **Date:** 2026-02-22  
> **Purpose:** Share with Claude Code co-builder to finalize team structure, task breakdown, and module build plan  
> **Reference:** `TERMINAL_BUDDY_MASTER_SPEC.md` (14-section consolidated spec in this same folder)

---

## 1. What Terminal Buddy Is (30-Second Summary)

A **next-generation terminal emulator** built in Rust that:

- Correlates what you typed with what your computer *actually did* (kernel logs, file system changes, process activity)
- Explains it in plain language — out loud if you want (voice-first accessibility)
- Records everything in persistent session history (Memvid `.mv2` format)
- Exposes itself as an **MCP App** so the UI is modular, swappable, and embeddable in any MCP host (Claude Desktop, Cursor, etc.)

**Core design constraint:** Built for a dyslexic creator who learns by hearing and seeing, not by reading dense text. Accessibility is the primary design driver, not an add-on.

---

## 2. Architecture Decision: MCP App as the UI Layer

After reviewing the MCP Apps SDK (`@modelcontextprotocol/ext-apps`), the architecture is:

```
┌──────────────────────────────────────────────────┐
│  Rust Daemon (Process B — always running)        │
│  ├── PTY Manager (portable-pty)                  │
│  ├── Correlation Engine (kernel + fs + logs)     │
│  ├── Memvid Writer (.mv2 session history)        │
│  ├── Voice Engine (whisper.cpp, local STT)       │
│  └── MCP Server (exposes tools + resources)      │
└─────────────────┬────────────────────────────────┘
                  │ MCP Protocol (stdio or HTTP)
                  │
┌─────────────────▼────────────────────────────────┐
│  MCP App UI (iframe — swappable skins)           │
│  ├── Canvas Dashboard (system state, timeline)   │
│  ├── Session History Browser (cards, search)     │
│  ├── Teachable Moment Panel (explanations)       │
│  └── Terminal Grid (120 FPS GPU-rendered)         │
│                                                  │
│  Runs inside: Claude Desktop, Cursor,            │
│  or standalone Electron/Tauri wrapper            │
└──────────────────────────────────────────────────┘
```

**Why MCP App:**

- UI is a swappable iframe — anyone can build their own skin
- Dyslexia mode = one skin (big fonts, voice hints, minimal text)
- Power user mode = different skin (dense data, keyboard-driven)
- Same daemon underneath — modular by architecture, not by convention
- The real SDK exists locally at `/Documents/mcpApps/ext-apps` with working examples

**Key SDK patterns we'll use:**

- `registerAppTool` + `registerAppResource` — daemon exposes tools, serves the bundled HTML UI
- `ontoolinputpartial` — streaming terminal output into the UI as it runs
- `onhostcontextchanged` — inherit Claude Desktop's fonts/theme (dyslexia font if set)
- `callServerTool` — UI calls daemon directly without going through the LLM
- `requestDisplayMode("fullscreen")` — Canvas Dashboard goes fullscreen

---

## 3. The Team (5 Agents)

### 🏗️ Agent 1: Terminal Architect

| Field | Value |
|-------|-------|
| **ID** | `tb-architect` |
| **Role** | System design ownership — Sidecar pattern, IPC protocol, MCP tool surface, Memvid format |
| **Based on** | `agents/architect.md` from Genesis Forge |
| **Owns** | Architecture Decision Records, `docs/architecture.md`, technology stack decisions |

**Assigned Skills (from 107-skill pool):**

- `architecture-patterns` — Clean Architecture, Hexagonal, DDD for daemon design
- `rust-async-patterns` — Tokio runtime, async boundaries, spawn_blocking rules
- `api-design-principles` — MCP tool surface design (which tools to expose, naming, safety)
- `memory-safety-patterns` — Ownership model, bounds checking (Rust core)

**Custom Skills Needed (not in pool — must create):**

- `terminal-emulator-architecture` — PTY/VTE internals, Line Discipline, escape sequences
- `mcp-app-architecture` — Tool + Resource pattern, iframe lifecycle, host integration

---

### 🦀 Agent 2: Daemon Engineer (Rust Dev)

| Field | Value |
|-------|-------|
| **ID** | `tb-rust-dev` |
| **Role** | Core daemon implementation — PTY, Correlation Engine, Memvid writer, voice bridge |
| **Based on** | `agents/dev.ide.md` from Genesis Forge |
| **Owns** | `daemon/` crate, `shared/` crate, all system-level Rust code |

**Assigned Skills:**

- `rust-async-patterns` — Tokio, futures, proper error handling
- `memory-safety-patterns` — Zero `.unwrap()`, no GC pauses, frame-perfect
- `error-handling-patterns` — `anyhow` + `thiserror`, graceful error surfacing to UI
- `debugging-strategies` — Systematic debugging, profiling, root cause analysis

**Custom Skills Needed:**

- `pty-management` — portable-pty, VTE parsing, canonical/raw mode switching
- `system-correlation` — inotify, journalctl parsing, PID-to-timestamp matching
- `whisper-cpp-integration` — Local STT, push-to-talk, audio capture

---

### 🎨 Agent 3: MCP App Crafter (UI Dev)

| Field | Value |
|-------|-------|
| **ID** | `tb-ui-dev` |
| **Role** | Canvas Dashboard, Session History Browser, all visual UI as MCP App iframes |
| **Based on** | `agents/design-architect.md` from Genesis Forge |
| **Owns** | `gui/` crate (or `ui/` directory), all HTML/CSS/JS for the MCP App |

**Assigned Skills:**

- `react-state-management` — Zustand/Jotai for UI state (or Vanilla JS if simpler)
- `wcag-audit-patterns` — WCAG 2.2 accessibility audits (dyslexia is a hard requirement)
- `screen-reader-testing` — NVDA, JAWS, VoiceOver compatibility
- `tailwind-design-system` — Design system (or pure CSS — TBD)

**Custom Skills Needed:**

- `mcp-app-development` — Already exists at `/Documents/mcpApps/ext-apps/plugins/mcp-apps/skills/create-mcp-app/SKILL.md`
- `dyslexia-first-design` — OpenDyslexic font, spatial layouts, voice hints, big tap targets

---

### 🔒 Agent 4: Security Guardian (Sentinel)

| Field | Value |
|-------|-------|
| **ID** | `tb-sentinel` |
| **Role** | Security model, privilege escalation controls, MCP tool guarding |
| **Based on** | `agents/sentinel.md` from Genesis Forge |
| **Owns** | Security architecture, `docs/security-model.md`, MCP permission system |

**Assigned Skills:**

- `auth-implementation-patterns` — JWT, sessions, RBAC for MCP tool access
- `stride-analysis-patterns` — STRIDE threat modeling for terminal + MCP surface
- `sast-configuration` — Static analysis for Rust code (clippy + cargo-audit)
- `secrets-management` — Secure handling of tokens, API keys if LLM integration added
- `attack-tree-construction` — Map threat scenarios for `terminal.run_command` MCP tool

**Critical Responsibility:**  
`terminal.run_command` via MCP **must require explicit user confirmation**. No MCP client can silently execute shell commands. This is non-negotiable.

---

### 🧪 Agent 5: Build & Ship (DevOps/QA)

| Field | Value |
|-------|-------|
| **ID** | `tb-devops` |
| **Role** | CI/CD, cross-platform builds, testing infrastructure, release pipeline |
| **Based on** | `agents/devops-pe.ide.md` from Genesis Forge |
| **Owns** | `.github/workflows/`, test infrastructure, release process |

**Assigned Skills:**

- `github-actions-templates` — CI/CD for Rust workspace (cargo test, clippy, fmt)
- `e2e-testing-patterns` — Playwright/Cypress for MCP App UI testing
- `deployment-pipeline-design` — Multi-stage pipeline (lint → test → build → release)
- `debugging-strategies` — Cross-platform debugging (Linux, macOS, Windows)

---

## 4. MCP Tools the Daemon Exposes

These are the MCP tools that make Terminal Buddy an MCP server:

| Tool | Category | Description | Safety |
|------|----------|-------------|--------|
| `terminal.get_screen` | Read-only | Current visible terminal output as text | ✅ Safe |
| `terminal.get_session_history` | Read-only | Query past sessions by date or semantic search | ✅ Safe |
| `terminal.get_teachable_moment` | Read-only | Full Correlation Engine report for any past command | ✅ Safe |
| `terminal.get_system_snapshot` | Read-only | Current CPU/disk/process/network state | ✅ Safe |
| `terminal.add_note` | Write | Append educational note to any session | ⚠️ Low risk |
| `terminal.run_command` | Execute | Run a shell command in active session | 🔴 Requires user confirmation |
| `terminal.search_history` | Read-only | Semantic search across all `.mv2` history | ✅ Safe |

**Phase 2-3 rollout:** Start with read-only tools only. Add `run_command` only with full security model in place.

---

## 5. Module YAML (Draft)

```yaml
id: terminal-buddy
name: "Terminal Buddy: The Cognitive Terminal"
version: 0.1.0
type: stand-alone
description: >
  Next-generation terminal emulator with kernel-level correlation,
  voice-first accessibility, persistent session memory (Memvid),
  and MCP App UI layer for modular, swappable interfaces.
author: "dylaroo"
tags: ["terminal", "rust", "accessibility", "mcp-apps", "voice", "dyslexia"]

dependencies:
  system:
    - rustc >= 1.80
    - cargo
    - whisper.cpp (local STT)
  rust_crates:
    - gpui (Zed's GPU renderer)
    - portable-pty
    - tokio (full features)
    - alacritty_terminal
    - sysinfo
    - interprocess
    - bincode
    - serde
    - anyhow
    - thiserror
  mcp_sdk:
    - "@modelcontextprotocol/ext-apps"
    - "@modelcontextprotocol/sdk"

agents:
  - id: tb-architect
    name: "Terminal Architect"
    icon: "🏗️"
    description: "System design, Sidecar pattern, MCP tool surface, Memvid format"
    skills:
      - architecture-patterns
      - rust-async-patterns
      - api-design-principles
      - memory-safety-patterns
    custom_skills:
      - terminal-emulator-architecture
      - mcp-app-architecture

  - id: tb-rust-dev
    name: "Daemon Engineer"
    icon: "🦀"
    description: "Core Rust implementation — PTY, Correlation Engine, Memvid, voice"
    skills:
      - rust-async-patterns
      - memory-safety-patterns
      - error-handling-patterns
      - debugging-strategies
    custom_skills:
      - pty-management
      - system-correlation
      - whisper-cpp-integration

  - id: tb-ui-dev
    name: "MCP App Crafter"
    icon: "🎨"
    description: "Canvas Dashboard, Session History, all UI as MCP App iframes"
    skills:
      - react-state-management
      - wcag-audit-patterns
      - screen-reader-testing
      - tailwind-design-system
    custom_skills:
      - mcp-app-development  # Already exists in SDK
      - dyslexia-first-design

  - id: tb-sentinel
    name: "Security Guardian"
    icon: "🔒"
    description: "Security model, privilege controls, MCP tool safety"
    skills:
      - auth-implementation-patterns
      - stride-analysis-patterns
      - sast-configuration
      - secrets-management
      - attack-tree-construction

  - id: tb-devops
    name: "Build & Ship"
    icon: "🧪"
    description: "CI/CD, cross-platform builds, testing, release pipeline"
    skills:
      - github-actions-templates
      - e2e-testing-patterns
      - deployment-pipeline-design
      - debugging-strategies

workflows:
  - id: tb-phase1
    name: "Phase 1: Foundation"
    description: "PTY + GPU renderer + IPC — the terminal that works"
    tasks:
      - "[ ] Cargo workspace setup (gui, daemon, shared crates)"
      - "[ ] PTY wrapper with portable-pty"
      - "[ ] Basic GPUI window rendering terminal grid"
      - "[ ] IPC between daemon and GUI (Unix Domain Sockets)"
      - "[ ] SystemSnapshot struct + inotify file-watcher"
      - "[ ] journalctl parser (async stream with backpressure)"
      - "[ ] Basic Memvid .mv2 frame writer"
      - "[ ] CI pipeline (cargo fmt + clippy + test on every PR)"

  - id: tb-phase2
    name: "Phase 2: Intelligence"
    description: "Correlation Engine + Teachable Moments + Session History"
    tasks:
      - "[ ] Correlation Engine: match Shell PID to system log timestamps"
      - "[ ] Filesystem delta capture (pre/post command snapshots)"
      - "[ ] Teachable Moment synthesis (combine stdout + fs delta + kernel logs)"
      - "[ ] Session History Browser UI (MCP App iframe)"
      - "[ ] Session auto-titling (AI-proposed, user-confirmed)"
      - "[ ] Educational notes system (per-session annotations)"
      - "[ ] MCP Server: expose get_screen + get_session_history tools"

  - id: tb-phase3
    name: "Phase 3: Voice & MCP App"
    description: "Voice input, full MCP App UI, Canvas Dashboard"
    tasks:
      - "[ ] Whisper.cpp integration (local STT, push-to-talk)"
      - "[ ] Voice Copilot (plain-language command translation)"
      - "[ ] Canvas Dashboard as MCP App (system state visualization)"
      - "[ ] MCP App host styling integration (dyslexia font inheritance)"
      - "[ ] Fullscreen mode for Canvas Dashboard"
      - "[ ] MCP Server: expose get_teachable_moment + search_history"
      - "[ ] Plugin system (external MCP servers as plugins)"

  - id: tb-phase4
    name: "Phase 4: Polish & Ship"
    description: "Security hardening, cross-platform, Neovim embedding"
    tasks:
      - "[ ] Security audit (STRIDE analysis on MCP tool surface)"
      - "[ ] terminal.run_command with explicit user confirmation flow"
      - "[ ] Cross-platform testing (Linux, macOS, Windows)"
      - "[ ] Neovim embedding (optional)"
      - "[ ] Customization system (buddy.toml — themes, hotkeys, Copilot personality)"
      - "[ ] Plugin hot-reload"
      - "[ ] Release pipeline + binary distribution"
```

---

## 6. Custom Skills to Create

These don't exist in the 107-skill pool and need to be written for this project:

| Skill | Agent | What It Covers |
|-------|-------|---------------|
| `terminal-emulator-architecture` | Architect | PTY/PTS internals, VTE compatibility, Line Discipline modes, escape sequence handling |
| `mcp-app-architecture` | Architect | Tool + Resource pattern, iframe lifecycle, host context, streaming partial input |
| `pty-management` | Rust Dev | portable-pty API, spawn_command, reader/writer split, canonical vs raw mode |
| `system-correlation` | Rust Dev | inotify watchers, journalctl -f parsing, PID-to-timestamp matching, SystemSnapshot diffing |
| `whisper-cpp-integration` | Rust Dev | whisper-rs bindings, audio capture, push-to-talk hotkey, local model loading |
| `dyslexia-first-design` | UI Dev | OpenDyslexic font, spatial layouts, voice hints, big tap targets, reduced cognitive load |
| `mcp-app-development` | UI Dev | **Already exists** — `/Documents/mcpApps/ext-apps/plugins/mcp-apps/skills/create-mcp-app/SKILL.md` |

---

## 7. Open Questions for Co-Builder

These need to be decided before the full task breakdown:

1. **GPU renderer choice:** `gpui` (from Zed) vs building on `wgpu` directly? gpui is powerful but underdocumented and tightly coupled to Zed's codebase. Risk assessment needed.

2. **MCP App framework for UI:** React (has `useApp` hook from SDK) vs Vanilla JS (simpler, no build step)? The dyslexia-first skin might be simple enough for Vanilla JS.

3. **Neovim embedding priority:** Is this Phase 4 or cut entirely? It adds significant complexity for a niche feature.

4. **Standalone wrapper:** When running outside Claude Desktop/Cursor, the MCP App UI needs a wrapper. Tauri (Rust-based) vs Electron? Tauri is the natural fit given the Rust stack.

5. **Voice Copilot AI backend:** Local LLM (llama.cpp) vs API (Claude/Gemini)? The spec says "local first" but local LLMs may not match the quality needed for plain-language explanations.

6. **Session History storage:** SQLite (simple, proven) vs custom `.mv2` Memvid binary format? Could use SQLite for metadata + `.mv2` for raw frame data.

---

## 8. How to Use This Document

**For Claude Code co-builder:**

1. Read `TERMINAL_BUDDY_MASTER_SPEC.md` for the full technical specification (14 sections)
2. Read this file for the team structure, skill assignments, and phased task breakdown
3. Review the Open Questions (Section 7) and propose answers
4. Expand each Phase into detailed stories with acceptance criteria
5. Create the custom skills listed in Section 6
6. Generate the final `module.yaml` for Genesis Forge integration

**For dylaroo:**

- This is the starting point, not the final plan
- Review the team roles and tell me if any agent is missing or wrong
- The Open Questions need your input — especially GPU renderer and voice backend choices
- Once the co-builder has reviewed, we finalize and start Phase 1

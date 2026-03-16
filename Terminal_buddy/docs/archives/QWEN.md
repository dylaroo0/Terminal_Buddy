# Terminal Buddy — Project Context

> **Last Updated:** 2026-02-24
> **Phase:** Phase B — Desktop Application (Tauri v2 + React 18+)
> **Tech Stack:** Rust (daemon), Tauri v2, React 18+, TypeScript, SQLite, Memvid

---

## Project Overview

**Terminal Buddy** is "a journal for your terminal that explains itself" — a searchable, explainable, accessible memory layer for everything you've ever done in a shell.

### The Problem
- Terminal commands are cryptic and errors are useless
- No memory of past sessions or commands
- Built for experts, hostile to beginners and neurodivergent users

### The Solution
A **journal-style interface** that:
- Records every command with context (stdout, stderr, exit codes)
- Correlates terminal output with filesystem changes and system logs
- Provides plain-language explanations via an "Explain" button
- Supports voice input (100% on-device via local Whisper)
- Uses accessibility-first design (WCAG AAA, Atkinson Hyperlegible font)

### Architecture: "Three Surfaces, One Brain"

```
┌──────────────────────────────────┐
│  UI LAYER (Pluggable)            │  ← The "skin"
│  Tauri v2 + React 18+           │
│  Journal · Creator Corner        │
│  Voice · Accessibility-first     │
└──────────────┬───────────────────┘
               │ MCP (JSON-RPC over stdio)
               ▼
┌──────────────────────────────────┐
│  BUDDY DAEMON (Rust)             │  ← The "brain"
│  ├─ 7 MCP Tools                  │
│  ├─ Correlation Engine           │
│  ├─ SQLite + Memvid Storage      │
│  ├─ PTY Capture                  │
│  ├─ Filesystem Watcher           │
│  └─ System Monitor               │
└──────────────┬───────────────────┘
               ▼
         ~/.terminal-buddy/
         ├── sessions.db
         └── buddy.toml
```

**Distribution Strategy:**
| Surface | Technology | Status |
|---------|-----------|--------|
| **Tauri App** | Tauri v2 + React | Phase B (primary focus) |
| **MCP App** | HTML/JS iframe (`ext-apps/`) | Phase B.5 (discovery) |
| **VS Code Extension** | Extension API | Phase C (future) |

---

## Current Status

### Phase A: The Brain — ✅ COMPLETE

The Rust daemon is built, tested, and working with **7 production-ready MCP tools**:

| Tool | Status | Purpose |
|------|--------|---------|
| `buddy_history` | ✅ Working | Full-text search across commands |
| `buddy_sessions` | ✅ Working | List sessions with timestamps |
| `buddy_system_health` | ✅ Working | CPU/RAM/disk/process monitoring |
| `buddy_cleanup_scan` | ✅ Working | Scan for bloat (report only) |
| `buddy_run` | ✅ Working | PTY execute + capture + record |
| `buddy_ask` | ✅ Working | LLM: natural language → shell command |
| `buddy_explain` | ✅ Working | LLM: plain-language explanations |

**LLM Backend:** Multi-provider support (OpenRouter, Anthropic/Claude, Google/Gemini) with live API key validation.

### Phase B: The Skin — 🔧 IN PROGRESS

Building the standalone desktop app with Tauri v2 + React.

| Task | Status | Notes |
|------|--------|-------|
| 1. Scaffold Tauri v2 App | ✅ COMPLETE | Build verified |
| 2. Connect to daemon via MCP | ✅ COMPLETE | Tauri IPC + stdio JSON-RPC |
| 3. Design System Implementation | ✅ COMPLETE | 50+ CSS vars, WCAG AAA |
| 4. Journal View — Timeline | ✅ COMPLETE | Live data, date grouping, explanation modal |
| 5. Journal View — Topics | 🟡 PARTIAL | Placeholder panel exists |
| 6. Journal View — Search | ✅ COMPLETE | Modular panel, searches commands + sessions |
| 7. Onboarding Wizard | ✅ COMPLETE | 3-step wizard with API key validation |
| 8. Terminal Pane (xterm.js) | ✅ COMPLETE (V1) | Original TerminalPane works |
| 8b. Terminal Pane V2 (PTY) | 🟡 IN PROGRESS | TerminalV2.tsx created |
| 9. Voice Input (whisper-rs) | ⬜ NOT STARTED | Unblocked |
| 10. Creator Corner MVP | 🟡 STARTED | Panel architecture done |
| 11. Polish & Package | ⬜ NOT STARTED | Depends on all above |

**Progress:** 6/11 tasks COMPLETE, 2 in progress

---

## Building and Running

### Prerequisites

- **Rust** (stable) — https://rustup.rs/
- **Node.js** (18+) — https://nodejs.org/
- **Tauri v2 prerequisites** — https://v2.tauri.app/start/prerequisites/

### Build the Daemon (Phase A)

```bash
cd terminal-buddy/buddy-daemon
cargo build --release
# Binary: terminal-buddy/target/release/buddy-daemon
```

### Build the Desktop App (Phase B)

```bash
cd terminal-buddy/buddy-app
npm install
npm run build
# Output: terminal-buddy/buddy-app/dist/
```

### Development Mode

```bash
# Terminal Buddy daemon (in one terminal)
cd terminal-buddy/buddy-daemon
cargo run --release

# Desktop app (in another terminal)
cd terminal-buddy/buddy-app
npm run dev
```

### Use as MCP Plugin (Claude Code)

Terminal Buddy works as an MCP server inside Claude Code automatically:

```bash
cd Terminal_buddy
# The .mcp.json handles registration automatically
# Talk to Claude naturally:
# "What was that docker command I ran last week?"
# "Is my computer running slow?"
# "My disk is getting full, what can I clean up?"
```

### Testing

```bash
# Run daemon tests
cd terminal-buddy/buddy-daemon
cargo test

# Test frontend build
cd terminal-buddy/buddy-app
npm run build

# Full integration test
# 1. Start daemon: cargo run --release
# 2. Start app: npm run dev
# 3. Verify Journal Timeline loads with data
# 4. Test Explain button with LLM backend
```

See [`TESTING.md`](TESTING.md) for comprehensive testing guide.

---

## Key Configuration

### buddy.toml (User Config)

Location: `~/.config/terminal-buddy/buddy.toml`

```toml
[behavior]
copilot_personality = "active"
explain_level = "beginner"
session_titling = "suggest"
teachable_moments = "inline"

[ai]
provider = "openrouter"  # or "claude" or "gemini"
# model = "anthropic/claude-sonnet-4-5"
privacy_mode = false

[storage]
data_dir = "~/.terminal-buddy"
max_storage_gb = 10

[cleanup]
auto_scan_interval = "weekly"
scan_paths = ["~"]
```

See [`buddy.toml.example`](buddy.toml.example) for full configuration reference.

### MCP Registration

The `.mcp.json` file registers Terminal Buddy as an MCP server in Claude Code:

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

---

## Project Structure

```
Terminal_buddy/
├── README.md                      ← Product overview
├── DOCS_INDEX.md                  ← Documentation entry point
├── PROJECT_STATUS.md              ← Current phase/task tracker
├── TESTING.md                     ← Testing guide
├── buddy.toml.example             ← Configuration template
├── .mcp.json                      ← MCP server registration
│
├── terminal-buddy/                ← Rust workspace
│   ├── Cargo.toml                 ← Workspace root
│   ├── shared/                    ← Shared types crate
│   ├── buddy-daemon/              ← MCP server (Phase A ✅)
│   │   ├── src/
│   │   │   ├── server.rs          ← 7 MCP tools
│   │   │   ├── llm/               ← Multi-provider LLM client
│   │   │   ├── memory/            ← SQLite + Memvid storage
│   │   │   ├── correlation/       ← Correlation engine
│   │   │   ├── pty/               ← PTY capture
│   │   │   └── monitor/           ← System monitoring
│   │   └── Cargo.toml
│   └── buddy-app/                 ← Tauri v2 desktop app (Phase B 🔧)
│       ├── src/
│       │   ├── App.tsx            ← Journal interface
│       │   ├── components/
│       │   │   ├── Panel*.tsx     ← Modular panel system
│       │   │   ├── CommandCard.tsx
│       │   │   ├── OnboardingWizard.tsx
│       │   │   ├── TerminalV2.tsx ← PTY-backed terminal
│       │   │   └── ...
│       │   ├── utils/
│       │   │   └── tauri-mcp.ts   ← MCP bridge
│       │   └── contexts/
│       │       └── VoiceTerminalContext.ts
│       ├── src-tauri/             ← Tauri Rust backend
│       ├── package.json
│       └── index.html
│
├── ext-apps/                      ← MCP App SDK (Claude Desktop plugin)
│   ├── .claude-plugin/
│   │   └── marketplace.json       ← Plugin registry config
│   └── src/
│
├── docs/                          ← Comprehensive documentation
│   ├── specs/                     ← Product specifications
│   ├── design/                    ← Design system & technical reference
│   ├── plans/                     ← Architecture & phase plans
│   ├── guides/                    ← User-facing documentation
│   ├── references/                ← External refs, SDK docs
│   └── logs/                      ← Session logs
│
├── skills/                        ← BMAD skills ecosystem
│   ├── bmad-know-it-all/          ← Comprehensive BMAD assistant
│   ├── skill-creator/             ← Skill creation tools
│   └── ui-ux-pro-max-skill/       ← Design intelligence skill
│
└── _bmad/                         ← BMAD Method configuration
    ├── _config/
    ├── bmm/                       ← BMad Method module
    └── core/                      ← Core framework
```

---

## Development Conventions

### Code Style

**Rust (Daemon):**
- Use `anyhow` for error handling, `thiserror` for custom errors
- Async with `tokio` runtime
- Tracing for logging (`tracing` + `tracing-subscriber`)
- Serde for serialization
- All MCP tools use `rmcp` crate with `#[tool]` macros

**TypeScript/React (Frontend):**
- React 19 with functional components and hooks
- TypeScript strict mode
- Lucide React for icons (replaced emojis)
- Radix UI primitives for accessibility
- Tailwind CSS v4 for styling
- No inline styles — use CSS custom properties

### CSS Architecture

50+ CSS custom properties in `App.css` for theming:

```css
:root {
  /* Backgrounds */
  --tb-bg-deep: #0F172A;
  --tb-bg-surface: #1E293B;
  --tb-bg-elevated: #334155;
  
  /* Colors */
  --tb-primary: #3B82F6;
  --tb-success: #22C55E;
  --tb-warning: #F59E0B;
  --tb-error: #EF4444;
  
  /* Typography */
  --tb-font-ui: 'Atkinson Hyperlegible', sans-serif;
  --tb-font-mono: 'JetBrains Mono', monospace;
  
  /* 40+ more variables... */
}
```

### Testing Practices

**Daemon:**
- Unit tests for each MCP tool
- Integration tests for correlation engine
- Run with `cargo test`

**Frontend:**
- Build verification: `npm run build`
- TypeScript strict checking
- Manual testing of UI flows

### Commit Conventions

- Clear, descriptive commit messages
- Reference tasks/issues when applicable
- Separate breaking changes with `BREAKING CHANGE:` footer

---

## Accessibility

Terminal Buddy was born from the needs of a dyslexic creator. Accessibility is the foundation, not an afterthought.

| Feature | Implementation |
|---------|---------------|
| **Atkinson Hyperlegible** | Default font — designed by Braille Institute |
| **WCAG AAA Contrast** | 15.4:1 primary text ratio |
| **Voice Input** | Local Whisper, 100% on-device |
| **Command Cards** | Structured cards over raw text |
| **Focus Mode** | Dims background during explanations |
| **Reduced Motion** | Respects `prefers-reduced-motion` |
| **Full Keyboard Nav** | Radix UI primitives, visible focus states |
| **Colorblind-Safe** | Icons + text alongside colors |

**Core accessibility features are never gated behind paywall.**

---

## Key Files (Quick Reference)

| What | Location |
|------|----------|
| **Start here** | `DOCS_INDEX.md` |
| **Product spec** | `docs/specs/PRODUCT_SPEC_V2.md` |
| **Design system** | `docs/design/DESIGN_SYSTEM_V2.md` |
| **Phase B plan** | `docs/plans/2026-02-22-phase-b-parallel-execution-plan.md` |
| **Testing guide** | `TESTING.md` |
| **Getting started** | `docs/guides/GETTING_STARTED.md` |
| **Strategic deep-dive** | `docs/guides/Terminal Buddy: A Strategic Deep-Dive...` |
| **Working binary** | `terminal-buddy/target/release/buddy-daemon` |
| **Frontend source** | `terminal-buddy/buddy-app/src/` |
| **MCP registration** | `.mcp.json` |
| **Config template** | `buddy.toml.example` |

---

## Common Commands

### Build & Run

```bash
# Build daemon (release)
cd terminal-buddy/buddy-daemon && cargo build --release

# Build app (production)
cd terminal-buddy/buddy-app && npm run build

# Run daemon (dev)
cd terminal-buddy/buddy-daemon && cargo run --release

# Run app (dev)
cd terminal-buddy/buddy-app && npm run dev
```

### Testing

```bash
# Test daemon
cd terminal-buddy/buddy-daemon && cargo test

# Verify frontend build
cd terminal-buddy/buddy-app && npm run build
```

### Configuration

```bash
# Copy config template
cp buddy.toml.example ~/.config/terminal-buddy/buddy.toml

# Edit config
nano ~/.config/terminal-buddy/buddy.toml
```

---

## BMAD Integration

This project uses the **BMAD Method** (Breakthrough Method of Agile AI Driven Development) for AI-driven development with specialized agents and guided workflows.

### Installed Modules

- **BMM (BMAD Method)** — Agile development framework
- **Skills Architecture** — Custom skills for domain-specific tasks

### Available Skills

Located in `skills/`:

| Skill | Purpose |
|-------|---------|
| `bmad-know-it-all/` | Comprehensive BMAD assistant for troubleshooting and workflow guidance |
| `skill-creator/` | Tools for creating new skills (`init_skill.py`, `package_skill.py`) |
| `ui-ux-pro-max-skill/` | Design intelligence skill (50+ styles) |

### Using BMAD

```bash
# Install BMAD (if not already installed)
npx bmad-method install

# Access BMAD help in Claude Code
/bmad-help

# Run BMAD workflows
/bmad-bmm-create-prd
/bmad-bmm-create-architecture
/bmad-bmm-dev-story
```

See `skills/bmad-know-it-all/README.md` for comprehensive BMAD guidance.

---

## Known Issues

| Issue | Severity | Notes |
|-------|----------|-------|
| LLM features need API key | 🟡 Medium | Set `OPENROUTER_API_KEY` or configure in `buddy.toml` |
| Memvid Canvas SDK not imported | 🟡 Medium | Needed for timeline visualization |
| No real terminal integration yet | 🟡 Medium | Task 8 - xterm.js terminal pane (V1 works, V2 in progress) |
| Note button is no-op | 🟢 Low | Needs `buddy_add_note` daemon tool |
| Panel drag-and-drop not implemented | 🟢 Low | Panels show/hide/minimize, not yet draggable |
| Topics panel is placeholder | 🟢 Low | Needs `buddy_topics` daemon tool |

---

## Next Priorities

1. **Task 5: Topics View** — Group sessions by auto-detected subject
2. **Task 8b: Terminal Pane V2** — Complete PTY output streaming
3. **Task 9: Voice Input** — whisper-rs integration
4. **Task 10: Creator Corner** — Template system and drag-and-drop
5. **Memvid Canvas SDK** — Import for timeline visualization

---

## Getting Help

- **Documentation:** Start at [`DOCS_INDEX.md`](DOCS_INDEX.md)
- **Testing Guide:** [`TESTING.md`](TESTING.md)
- **BMAD Help:** `/bmad-help` in Claude Code
- **BMAD Troubleshooting:** `skills/bmad-know-it-all/scripts/skill-troubleshooter.py`

---

*This file provides context for AI assistants working on Terminal Buddy. It is automatically loaded to ensure consistent understanding of the project's architecture, status, and conventions.*

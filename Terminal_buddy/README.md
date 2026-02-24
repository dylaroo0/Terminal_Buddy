<div align="center">

<!-- Replace with your actual banner image -->
<!-- ![Terminal Buddy Banner](assets/terminal-buddy-banner.png) -->

# Terminal Buddy

### A journal for your terminal that explains itself.

A searchable, explainable, accessible memory layer for everything you've ever done in a shell.

[![Phase A](https://img.shields.io/badge/Phase_A-Complete-22C55E?style=flat-square)](#current-status)
[![Phase B](https://img.shields.io/badge/Phase_B-In_Progress-3B82F6?style=flat-square)](#current-status)
[![Built with Rust](https://img.shields.io/badge/Daemon-Rust-dea584?style=flat-square&logo=rust)](#tech-stack)
[![Tauri v2](https://img.shields.io/badge/Desktop-Tauri_v2-FFC131?style=flat-square&logo=tauri)](#tech-stack)
[![License](https://img.shields.io/badge/License-Open_Core-purple?style=flat-square)](#license)
[![Accessibility](https://img.shields.io/badge/A11y-WCAG_AAA-00A86B?style=flat-square)](#accessibility)

<!-- If you have a NotebookLM video, uncomment and update: -->
<!-- [![Watch the overview](assets/video-thumbnail.png)](https://youtube.com/watch?v=YOUR_VIDEO_ID) -->

</div>

---

## The Problem

The terminal is one of the most powerful tools on a computer — and one of the most hostile.

- **Commands are cryptic.** `chmod 755`, `grep -rn`, `docker system prune -a` — memorize or fail.
- **Errors are useless.** When something breaks, you get a wall of text that helps nobody.
- **There's no memory.** You can't search "what did I do last Tuesday?" There's no undo. No safety net.
- **It's built for experts.** If you're new to programming, neurodivergent, or just not a terminal power user, it feels like being handed the controls of an airplane with no labels.

For over forty years, we've accepted the blinking cursor as a law of nature — a passive display surface that treats every failure as a user error.

**Terminal Buddy says: enough.**

---

## The Solution

Terminal Buddy is the first terminal that **learns with you**. Not another AI wrapper that guesses from error text — a terminal that understands what actually happened on your machine.

<!-- Replace with actual screenshot -->
<!-- ![Journal View](assets/journal-view.png) -->

```
┌──────────────────────────────────────────────────────────────┐
│  TERMINAL BUDDY                                   [mic] [gear]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [ Timeline ]    [ Topics ]    [ Search ]                    │
│  ============================================================│
│                                                              │
│  ──── February 22, 2026 ────                                 │
│                                                              │
│  ┌─ Fix CI Pipeline ─────────────────────────────────────┐   │
│  │ 9:18 AM · $ npm install --legacy-peer-deps         ✓  │   │
│  │ added 123 packages, found 0 vulnerabilities           │   │
│  │ [💡 Explain]  [📝 Note]  [🔄 Re-run]                 │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─ 9:25 AM · $ docker-compose up                     ✗  ─┐ │
│  │ Error: Port 8080 already in use                        │ │
│  │                                                        │ │
│  │ EXPLANATION                                            │ │
│  │ "Nginx is already holding port 8080.                   │ │
│  │  Run sudo lsof -i :8080 to confirm."                   │ │
│  │                                                        │ │
│  │ YOUR NOTE: "Fixed by killing the old nginx process"    │ │
│  │ [💡 Explain]  [📝 Note]  [🔄 Re-run]                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  [▲ Expand Terminal]                                         │
│  $ _                                                         │
└──────────────────────────────────────────────────────────────┘
```

---

## Key Features

### Journal, Not Terminal
Your primary view is a **notebook** — sessions organized by date and topic, not a wall of scrolling text. Every command becomes a searchable card with context.

### Explain Button
One click turns any command into a **plain-language learning moment**. Terminal Buddy doesn't guess from error text — it correlates three streams of real data:

| Stream | What It Captures |
|--------|-----------------|
| **Terminal** | stdout, stderr, exit codes |
| **System** | Filesystem deltas, PIDs, port bindings |
| **Logs** | Kernel/OS logs filtered to the exact timestamp |

Because it knows *which process held a port* or *which permission was denied*, its explanations are technically authoritative.

### Voice Input
Talk to your terminal instead of typing. All voice processing happens **100% on-device** via local Whisper — no cloud, no data leaving your machine.

### Session Memory
Every session is automatically titled, tagged by topic, and searchable forever.
- "What was that git command I ran last week?" — found instantly.
- "Show me everything about the MCP server" — grouped by topic.

### Creator Corner
Design your own experience. Fonts, colors, layouts, voice profiles — all customizable with live preview. Save templates. Share with the community. Every customization has a **"Reset to Accessible Default"** button.

### System Health
CPU, memory, disk — always available. Cleanup suggestions when things get bloated (`node_modules`, `.cache`, old builds). **Never deletes anything without your explicit approval.**

---

## Architecture

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

**Three surfaces, one brain:**

| Surface | Technology | Status |
|---------|-----------|--------|
| **Standalone App** | Tauri v2 + React | Phase B (primary) |
| **MCP App** | Embedded iframe in Claude Desktop / Cursor | Planned |
| **VS Code Extension** | Editor sidebar | Future |

The daemon doesn't care which surface talks to it. MCP is the universal protocol. Build once, ship everywhere.

---

## MCP Tools

| Tool | Status | What It Does |
|------|--------|-------------|
| `buddy_history` | Working | Search past commands by keyword, time, or exit code |
| `buddy_sessions` | Working | List sessions — auto-titled chapters of terminal usage |
| `buddy_system_health` | Working | CPU, memory, disk, running processes |
| `buddy_cleanup_scan` | Working | Find safe-to-delete files (caches, temp, old builds) |
| `buddy_run` | Working | Execute with PTY capture — records input + output + filesystem changes |
| `buddy_explain` | Stub | Plain-language command explanation (needs LLM backend) |
| `buddy_ask` | Stub | Natural language to shell command translation |

**5 production-ready tools. 6 automated tests pass. Release binary: 6.4 MB.**

---

## Accessibility

Terminal Buddy was born from the needs of a dyslexic creator. Accessibility isn't bolted on — **it's the foundation.**

| Feature | Implementation |
|---------|---------------|
| **Atkinson Hyperlegible** | Default font — designed by the Braille Institute for legibility. `b/d`, `p/q`, `I/l/1` are visually distinct. |
| **WCAG AAA Contrast** | 15.4:1 primary text ratio. High contrast OLED dark theme. |
| **Voice as a Peer** | Not an "accessibility mode." Voice input via local Whisper is a primary interaction method. |
| **Command Cards** | Structured cards over raw text — reduces cognitive load. |
| **Focus Mode** | Dims background during AI explanations. |
| **Reduced Motion** | Respects `prefers-reduced-motion` globally. |
| **Full Keyboard Nav** | Radix UI primitives, visible focus states, logical tab order. |
| **Colorblind-Safe** | Icons + text alongside every color indicator. |

> **Core accessibility features are never gated behind a paywall.**

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Daemon** | Rust | Fast, safe, 6.4 MB binary, tiny memory footprint |
| **Desktop App** | Tauri v2 | Native wrapper — much lighter than Electron |
| **Frontend** | React 18+ / TypeScript | Rich interactive components |
| **Build** | Vite | Fast dev server, optimized production builds |
| **Styling** | Tailwind CSS 4 + 50+ CSS custom properties | Full theming via Creator Corner |
| **Components** | Radix UI | Keyboard navigation, focus management, a11y primitives |
| **Icons** | Lucide React | Consistent, lightweight, MIT |
| **Storage** | SQLite + Memvid (.mv2) | Reliable, embedded, no server needed |
| **Voice** | whisper.cpp / whisper-rs | Local speech-to-text, zero cloud dependency |
| **Protocol** | MCP (Model Context Protocol) | Open standard for AI tool communication |
| **Fonts** | Atkinson Hyperlegible + JetBrains Mono | Accessibility-first typography |

**Everything runs locally on your machine.** No cloud dependency required.

---

## Current Status

### Phase A: The Brain — Complete

The Rust daemon is built, tested, and working. 5 production-ready MCP tools, PTY capture, filesystem correlation, system monitoring — all done.

### Phase B: The Skin — In Progress

Building the standalone desktop app with Tauri v2 + React.

| Task | Status |
|------|--------|
| Scaffold Tauri v2 App | Done |
| Design System (50+ CSS variables, WCAG AAA) | Done |
| Connect UI to daemon via MCP bridge | Next |
| Journal View — Timeline | Pending |
| Journal View — Topics | Pending |
| Journal View — Search | Pending |
| Onboarding Wizard | Pending |
| Terminal Pane (xterm.js) | Pending |
| Voice Input (whisper-rs) | Pending |
| Creator Corner MVP | Pending |
| Polish & Package (Linux/macOS/Windows) | Pending |

### Phase C: The Platform — Planned

VS Code extension, MCP App iframe for Claude Desktop/Cursor, community template hub.

---

## Who Is This For?

| You | Your Pain | What Terminal Buddy Gives You |
|-----|-----------|------------------------------|
| **Learning Dev** | "I don't know what commands do and I'm afraid to break things" | Explain button, command approval cards, voice input |
| **Power User with ADHD** | "I ran something last Tuesday that fixed the build but I can't find it" | Semantic session search, auto-titled topics, timeline scrubbing |
| **Accessibility-First Org** | "We need accessible tooling for our engineering team" | Full accessibility defaults, audit logs, centralized config |

---

## Timeline & Roadmap

### Phase A: The Brain — Complete ✅

**Q4 2025 - Q1 2026**

The Rust daemon is built, tested, and working. 5 production-ready MCP tools, PTY capture, filesystem correlation, system monitoring — all done.

### Phase B: The Skin — In Progress 🔧

**Q1 - Q2 2026**

Building the standalone desktop app with Tauri v2 + React.

| Milestone | Target | Status |
|-----------|--------|--------|
| Scaffold Tauri v2 App | Feb 2026 | ✅ Done |
| Design System (50+ CSS variables, WCAG AAA) | Feb 2026 | ✅ Done |
| Connect UI to daemon via MCP bridge | Mar 2026 | 🔜 Next |
| Journal View — Timeline | Mar 2026 | ⏳ Pending |
| Journal View — Topics | Mar 2026 | ⏳ Pending |
| Journal View — Search | Mar 2026 | ⏳ Pending |
| Onboarding Wizard | Mar 2026 | ⏳ Pending |
| Terminal Pane (xterm.js) | Mar 2026 | ⏳ Pending |
| Voice Input (whisper-rs) | Apr 2026 | ⏳ Pending |
| Creator Corner MVP | Apr 2026 | ⏳ Pending |
| Polish & Package (Linux/macOS/Windows) | May 2026 | ⏳ Pending |

### Phase C: The Platform — Planned 📋

**Q3 - Q4 2026**

| Milestone | Target | Description |
|-----------|--------|-------------|
| VS Code Extension | Q3 2026 | Editor sidebar integration |
| MCP App iframe | Q3 2026 | Claude Desktop / Cursor plugin |
| Community Template Hub | Q4 2026 | Share & discover templates |
| LLM Explanations | Q4 2026 | Plain-language command explanations |

---

## Project Outline

```
Terminal_buddy/
├── README.md                      ← You are here
├── DOCS_INDEX.md                  ← Documentation entry point
├── PROJECT_STATUS.md              ← Current phase/task tracker
├── .mcp.json                      ← MCP server registration
│
├── terminal-buddy/                ← Rust workspace
│   ├── buddy-daemon/              ← The brain (Phase A ✅)
│   │   └── src/server.rs          ← 7 MCP tools
│   ├── buddy-app/                 ← The skin (Phase B 🔧)
│   │   ├── src/App.tsx            ← Journal interface
│   │   └── src-tauri/             ← Tauri Rust backend
│   └── shared/                    ← Shared Rust types
│
├── ext-apps/                      ← MCP App SDK (Claude Desktop plugin)
├── docs/                          ← Comprehensive documentation
│   ├── specs/                     ← Product specifications
│   ├── design/                    ← Design system & technical reference
│   ├── plans/                     ← Architecture & phase plans
│   └── guides/                    ← User-facing documentation
│
└── assets/                        ← Images and media for README
```

---

## Getting Started

### Prerequisites

- [Rust](https://rustup.rs/) (stable)
- [Node.js](https://nodejs.org/) (18+)
- [Tauri v2 prerequisites](https://v2.tauri.app/start/prerequisites/)

### Build the Daemon

```bash
cd terminal-buddy/buddy-daemon
cargo build --release
```

### Build the Desktop App

```bash
cd terminal-buddy/buddy-app
npm install
npm run build
```

### Use as MCP Plugin (Claude Code)

Terminal Buddy works as an MCP server inside Claude Code right now. Just open the project:

```bash
cd Terminal_buddy
# The .mcp.json handles registration automatically
# Talk to Claude naturally:
# "What was that docker command I ran last week?"
# "Is my computer running slow?"
# "My disk is getting full, what can I clean up?"
```

---

## Project Structure

```
Terminal_buddy/
├── README.md                      ← You are here
├── DOCS_INDEX.md                  ← Documentation entry point
├── PROJECT_STATUS.md              ← Current phase/task tracker
├── .mcp.json                      ← MCP server registration
│
├── terminal-buddy/                ← Rust workspace
│   ├── buddy-daemon/              ← The brain (Phase A ✅)
│   │   └── src/server.rs          ← 7 MCP tools
│   ├── buddy-app/                 ← The skin (Phase B 🔧)
│   │   ├── src/App.tsx            ← Journal interface
│   │   └── src-tauri/             ← Tauri Rust backend
│   └── shared/                    ← Shared Rust types
│
├── ext-apps/                      ← MCP App SDK (Claude Desktop plugin)
├── docs/                          ← Comprehensive documentation
│   ├── specs/                     ← Product specifications
│   ├── design/                    ← Design system & technical reference
│   ├── plans/                     ← Architecture & phase plans
│   └── guides/                    ← User-facing documentation
│
└── assets/                        ← Images and media for README
```

---

## The Vision

> *"You're not building 'another terminal.' You're building the first terminal that learns with you — and that's a category nobody owns yet."*

Terminal Buddy turns the terminal from a tool you have to learn into **a tool that learns with you.** Every session builds your searchable history. Every error becomes a teaching moment. Every command is explained before and after it runs.

Terminals should remember. Commands should be explainable. Accessibility isn't optional.

**Personalization without complexity.** The terminal adapts to you, not the other way around.

---

## Competitive Landscape

| Product | What It Does | What It Lacks |
|---------|-------------|---------------|
| iTerm / WezTerm / Alacritty | Display text fast | No memory, no explanation, no accessibility |
| Warp | AI-powered terminal | Cloud-dependent, no correlated data |
| Fig (AWS) | Terminal autocomplete | No journal, no session memory |
| GitHub Copilot CLI | AI suggestions | No history, no explanation, no standalone |
| **Terminal Buddy** | **Journal + Explain + Correlate + Accessibility** | **New category** |

### The Moat

1. **Correlated memory** — Memvid + filesystem watching + semantic search = data flywheel
2. **Accessibility-first defaults** — First-mover in uncontested space
3. **Local-first architecture** — Privacy as feature, not limitation
4. **Template ecosystem** — Creator Corner + community = network effects

---

## Deep Dive: Correlated Computing

For the full technical and strategic picture, read the deep-dive:

**[Terminal Buddy: A Strategic Deep-Dive into the Next Generation of Correlated Computing](docs/guides/Terminal%20Buddy%3A%20A%20Strategic%20Deep-Dive%20into%20the%20Next%20Generation%20of%20Correlated%20Computing)**

Key concepts covered:

- **The Correlation Triple** — How three data streams (terminal output, filesystem deltas, kernel logs) create technically authoritative explanations
- **Memvid (.mv2) Flight Recorder** — Binary snapshots every 100ms enabling 120 FPS timeline scrubbing and semantic search
- **Cognitive Performance Engineering** — Why designing for neurodivergence creates a superior product for *all* developers
- **MCP Dual Role** — How Terminal Buddy functions as both an MCP Server (exposing tools) and MCP Client (consuming context)
- **The Discovery Funnel** — Multi-surface distribution strategy from zero-install iframe to full standalone app

---

## Documentation

| Document | Description |
|----------|-------------|
| [DOCS_INDEX.md](DOCS_INDEX.md) | Single entry point for all docs |
| [Product Spec v2](docs/specs/PRODUCT_SPEC_V2.md) | Primary product reference (844 lines) |
| [Strategic Deep-Dive](docs/guides/Terminal%20Buddy%3A%20A%20Strategic%20Deep-Dive%20into%20the%20Next%20Generation%20of%20Correlated%20Computing) | Correlation Engine, MCP architecture, monetization |
| [Design System v2](docs/design/DESIGN_SYSTEM_V2.md) | Colors, fonts, layout, components |
| [Getting Started](docs/guides/GETTING_STARTED.md) | User-facing guide for MCP tools |
| [Architecture Design](docs/plans/2026-02-22-terminal-buddy-architecture-design.md) | Technical architecture decisions |

---

## License

Open Core model. Daemon + basic UI are open source. Premium features (LLM-powered explanations, advanced search, community templates) are paid.

Core accessibility features are **never** gated behind a paywall.

---

<div align="center">

*Built by [Dylaroo](https://github.com/Dylaroo). Daemon written in Rust. Desktop app coming soon.*

**Designed for focus. Built for humans.**

</div>

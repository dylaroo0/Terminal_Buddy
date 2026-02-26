# Terminal Buddy — Where We Are

> **Last Updated:** 2026-02-22T19:26:00-08:00
> **Phase:** B — Desktop App (Tauri v2 + React 18+)
> **Phase A:** ✅ COMPLETE — buddy-daemon Rust MCP server (6/6 tests passing)
> **Phase B:** 🔧 IN PROGRESS — 2/11 tasks complete, build verified

*This document is the fast-orientation snapshot for any agent or human picking up this project.
For the full task list: see `PROJECT_STATUS.md`. For all docs: see `DOCS_INDEX.md`.*

---

## 🗺️ Where Things Actually Live

```
~/projects/Terminal_buddy/                    ← PROJECT ROOT
│
├── DOCS_INDEX.md                             ← START HERE — index of all docs
├── PROJECT_STATUS.md                         ← Current task checklist + known issues
├── WHERE_WE_ARE.md                           ← This file — fast orientation snapshot
├── .mcp.json                                 ← Registers buddy-daemon with Claude Desktop
│
├── terminal-buddy/                           ← Rust workspace (the actual product)
│   │
│   ├── buddy-daemon/                         ← ✅ PHASE A COMPLETE — "The Brain"
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── main.rs                       ← MCP server entry point
│   │       ├── server.rs                     ← Tool handlers (7 MCP tools)
│   │       ├── config.rs                     ← Daemon configuration
│   │       ├── memory/
│   │       │   ├── mod.rs                    ← Memory abstraction layer
│   │       │   └── sqlite.rs                 ← SQLite storage (commands, sessions)
│   │       ├── pty/
│   │       │   ├── mod.rs                    ← PTY management
│   │       │   └── capture.rs                ← Terminal output capture
│   │       ├── monitor/
│   │       │   ├── mod.rs                    ← System health monitoring
│   │       │   └── cleanup.rs                ← Session cleanup
│   │       └── correlation/
│   │           ├── mod.rs                    ← Session correlation
│   │           └── filesystem.rs             ← File activity tracking
│   │
│   ├── buddy-app/                            ← 🔧 PHASE B — "The Skin" (Tauri UI)
│   │   ├── package.json                      ← npm deps (lucide-react, @tauri-apps/api)
│   │   ├── index.html                        ← Entry point (has anti-flash-dark script)
│   │   ├── src-tauri/
│   │   │   └── Cargo.toml                    ← Tauri Rust backend (invoke handlers go here)
│   │   └── src/
│   │       ├── main.tsx                      ← React entry (imports index.css)
│   │       ├── index.css                     ← Created this session — re-exports App.css
│   │       ├── App.tsx                       ← ✅ Compiled — Journal + Creator Corner UI
│   │       ├── App.css                       ← ✅ Compiled — 50+ CSS vars, design system
│   │       ├── assets/
│   │       │   └── react.svg
│   │       ├── config/
│   │       │   └── schema.ts                 ← User preferences schema (font, TTS, etc.)
│   │       └── utils/
│   │           ├── tauri-mcp.ts              ← 🎯 Production MCP calls via Tauri invoke()
│   │           └── mcp.ts                    ← Mock fallback client (dev/testing)
│   │
│   ├── shared/                               ← Shared Rust types (daemon + app)
│   │   └── Cargo.toml
│   │
│   └── daemon/                               ← (Legacy/alternate daemon entry)
│       └── Cargo.toml
│
├── ext-apps/                                 ← MCP App SDK — iframe for Claude Desktop
│   ├── src/                                  ← MCP App surface source
│   ├── docs/                                 ← SDK docs
│   └── package.json
│
├── Genisis_Forge_/                           ← ⚠️ Reference only — NOT product code
│   ├── agents/meta-orchestrator.md           ← Meta-Orchestrator agent definition
│   ├── workflows/                            ← Genesis workflow definitions
│   │   └── project-onboarding.yaml          ← The 6-step Genesis Protocol workflow
│   └── SESSION_ACCOMPLISHMENTS.md            ← Genesis session log (with review appended)
│
└── docs/                                     ← All project documentation
    ├── specs/
    │   └── PRODUCT_SPEC_V2.md               ← 📖 Product bible — 844 lines — AUTHORITATIVE
    ├── plans/
    │   ├── 2026-02-22-phase-b-parallel-execution-plan.md  ← 4-workstream Phase B plan
    │   ├── 2026-02-22-party-mode-session-handoff.md       ← Product vision record
    │   └── 2026-02-22-phase-b-handoff.md                  ← Original Phase B handoff (archived)
    ├── design/
    │   └── DESIGN_SYSTEM_V2.md              ← Visual language spec (OLED, Atkinson, WCAG AAA)
    ├── guides/
    │   ├── 2026-02-22_qwen-plan-summary-card.md        ← Quick-ref product summary card
    │   ├── 2026-02-22_gemini-product-spec-v2.md        ← Gemini's product spec generation
    │   └── Why Your Terminal Is Finally Growing a Brain ← Blog article draft
    ├── logs/
    │   └── 2026-02-22_DOC-AUDIT-SESSION-HANDOFF.md    ← Doc audit session handoff
    ├── references/
    │   ├── SESSION_ACCOMPLISHMENTS.md                  ← Phase B kickoff + Genesis session log
    │   └── DOCS_INDEX.md                               ← (Legacy copy — use root DOCS_INDEX.md)
    └── historical/                                     ← Archived/superseded docs
```

---

## 📊 Current Task Status

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Scaffold Tauri v2 App | ✅ **COMPLETE** | Build verified 2026-02-22 |
| 2 | Connect to buddy-daemon (MCP bridge) | ⬜ NOT STARTED | **← DO THIS NEXT** |
| 3 | Design System Implementation | ✅ **COMPLETE** | 50+ CSS vars, compiled |
| 4 | Journal View — Timeline | ⬜ NOT STARTED | Blocked by Task 2 |
| 5 | Journal View — Topics | ⬜ NOT STARTED | Blocked by Task 4 |
| 6 | Journal View — Search | ⬜ NOT STARTED | Blocked by Task 4 |
| 7 | Onboarding Wizard | ⬜ NOT STARTED | Unblocked — can start now |
| 8 | Terminal Pane (xterm.js) | ⬜ NOT STARTED | Blocked by Task 2 |
| 9 | Voice Input (whisper-rs) | ⬜ NOT STARTED | Unblocked — can start now |
| 10 | Creator Corner MVP | ⬜ NOT STARTED | Unblocked — can start now |
| 11 | Polish & Package | ⬜ NOT STARTED | Last |

**2/11 complete. Build passes. Critical gate cleared.**

---

## 🚦 What's Unblocked RIGHT NOW

These tasks have no dependencies and can start immediately:

| Task | File to create/edit | What it needs |
|------|--------------------|----|
| **Task 2 (MCP bridge)** | `buddy-app/src-tauri/src/main.rs` | Rust `invoke()` handlers that spawn daemon + call MCP tools |
| Task 7 (Onboarding) | `buddy-app/src/components/Onboarding.tsx` | Standalone modal component |
| Task 9 (Voice input) | Rust crate in `buddy-daemon/` | Add `whisper-rs` dep, push-to-talk over MCP |
| Task 10 (Creator Corner) | `buddy-app/src/components/CreatorCorner.tsx` | Skin designer + template schema |

> **Task 2 is the critical path.** Until the MCP bridge is done, the app shows mock data. Everything real depends on it.

---

## 🧠 The Architecture in One Diagram

```
User
 │
 ├── Tauri App (buddy-app/)           ← Primary UI surface
 │    ├── React frontend (App.tsx)
 │    └── Tauri Rust backend          ← invoke() handlers
 │              │
 │              └── buddy-daemon      ← MCP server (stdio)
 │                   ├── PTY capture
 │                   ├── SQLite memory
 │                   ├── Session correlation
 │                   └── 7 MCP tools exposed
 │
 ├── MCP App (ext-apps/)              ← Future: iframe in Claude Desktop
 │    └── Same React components, different wrapper
 │
 └── VS Code Extension                ← Future: Phase C
```

---

## 🏗️ The 4 Workstreams (Parallel Execution Plan)

Detailed plan: `docs/plans/2026-02-22-phase-b-parallel-execution-plan.md`

| Workstream | Focus | Agent | Status |
|-----------|-------|-------|--------|
| WS1 — Plumbing | MCP bridge, config schema | Claude | 🔧 Tasks 1✅ 3✅, Task 2 next |
| WS2 — Looks | Radix UI components, typography | Gemini | ⬜ Unblocked |
| WS3 — Product | Journal views (real data), Onboarding | Qwen/Claude | ⬜ Blocked by WS1 Task 2 |
| WS4 — Brain+Voice | MCP v1.1, whisper-rs, Memvid Canvas | Claude | ⬜ Partially unblocked |

---

## 📝 Key Decisions (Don't Revisit These)

These were locked in the Party Mode session and Product Spec v2:

| Decision | What it is |
|----------|------------|
| **Journal-first paradigm** | Primary UI is a notebook, NOT a raw terminal |
| **Sessions as atomic unit** | Work organized by focus periods, not commands |
| **Topics as tags** | Sessions can belong to multiple topics (not folders) |
| **Accessibility-first** | Atkinson Hyperlegible default, WCAG AAA, voice = peer to keyboard |
| **Local-first + BYOK** | No cloud AI by default; users bring their own API keys |
| **MCP API v1.0 frozen** | Tool signatures are locked — don't change them during UI dev |
| **One brain, multiple skins** | buddy-daemon is the product; Tauri/MCP App/VS Code are surfaces |
| **Creator Corner** | Users design skins, package `.buddy-template` files, share community hub |

---

## 🔑 Key Files to Know

| File | Why it matters |
|------|---------------|
| `DOCS_INDEX.md` | Master index of all docs with status tags |
| `PROJECT_STATUS.md` | Task checklist, known issues, next steps |
| `docs/specs/PRODUCT_SPEC_V2.md` | The product bible — source of truth for features |
| `docs/plans/2026-02-22-phase-b-parallel-execution-plan.md` | The build plan |
| `terminal-buddy/buddy-app/src/utils/tauri-mcp.ts` | Where MCP calls will flow through |
| `terminal-buddy/buddy-app/src-tauri/src/main.rs` | Where Task 2 work happens |
| `terminal-buddy/buddy-daemon/src/server.rs` | The 7 MCP tools already built in Phase A |

---

## 🚫 Files That Are NOT The Product

Don't confuse these with product code:

| Folder/File | What it actually is |
|-------------|---------------------|
| `Genisis_Forge_/` | Reference copy of Genesis module — not shipped |
| `docs/references/DOCS_INDEX.md` | Old copy — use root `DOCS_INDEX.md` |
| `terminal-buddy/daemon/` | Legacy alternate daemon structure — ignore |
| `terminal-buddy/buddy-app/src/utils/mcp.ts` | Mock fallback only — production uses `tauri-mcp.ts` |

---

*Last build: `npm run build` ✅ — 1,732 modules, 206KB JS, 9.65KB CSS, built in 2.94s*
*Updated: 2026-02-22T19:26:00-08:00*

# Terminal Buddy — Documentation Index

> **Last Updated:** 2026-02-25 18:30
> **Project Phase:** Phase B — Desktop App (Tauri v2 + React 18+)
> **Phase A Status:** ✅ COMPLETE (all 7 MCP tools live!)
> **Phase 1A Status:** ✅ COMPLETE — Deep System Health (buddy_system_health enhanced + buddy_system_health_json)
> **Phase B Status:** 🔧 IN PROGRESS — Tasks 1, 2, 3, 4, 7, 8 & 8b ✅ COMPLETE. Terminal Pane V2 (PTY-backed) built with hook-based architecture, WCAG AAA accessibility, output capture for daemon. Build passes. Awaiting `buddy_add_output` MCP tool in daemon for full journaling integration. Next: Task 5 (Topics) or Task 6 (Search).

---

## 🚨 START HERE

**New to the project? Read these in order:**

1. **[WHERE_WE_ARE.md](docs/WHERE_WE_ARE.md)** - Project orientation (5 min read)
2. **[PROJECT_MEMORY.md](docs/PROJECT_MEMORY.md)** - What we've built & what's next (10 min read)
3. **[DOCUMENT_ORGANIZATION_PLAN.md](docs/DOCUMENT_ORGANIZATION_PLAN.md)** - How docs are organized (5 min read)
4. **[PRODUCT_SPEC_V2.md](docs/specs/PRODUCT_SPEC_V2.md)** - Product specification (30 min read)

**Working on a specific feature?** → See [docs/modules/](docs/modules/) for module docs

**Lost?** → Check [WHERE_WE_ARE.md](docs/WHERE_WE_ARE.md)

**Want the quick summary?** → [SUMMARY_CARD_POST_PHASE_1A.md](docs/guides/SUMMARY_CARD_POST_PHASE_1A.md)

---

## 🚨 START HERE

**New to the project? Read these in order:**

1. **[WHERE_WE_ARE.md](docs/WHERE_WE_ARE.md)** - Project orientation (5 min read)
2. **[PROJECT_MEMORY.md](docs/PROJECT_MEMORY.md)** - What we've built & what's next (10 min read)
3. **[DOCUMENT_ORGANIZATION_PLAN.md](docs/DOCUMENT_ORGANIZATION_PLAN.md)** - How docs are organized (5 min read)
4. **[PRODUCT_SPEC_V2.md](docs/specs/PRODUCT_SPEC_V2.md)** - Product specification (30 min read)

**Working on a specific feature?** → See [docs/modules/](docs/modules/) for module docs

**Lost?** → Check [WHERE_WE_ARE.md](docs/WHERE_WE_ARE.md)

---

## 🏷️ The Product

> **"A journal for your terminal that explains itself."**

A searchable, explainable, accessible memory layer for everything you've ever done in a shell.

---

## 📄 Active Documents (Current & Canonical)

These are the **only** documents you need. Each has one canonical location.

### Specs

| Document | Location | Status |
|----------|----------|--------|
| **Product Spec v2** | `docs/specs/PRODUCT_SPEC_V2.md` | ✅ ACTIVE — Primary product reference (844 lines) |
| **Terminal Features Blueprint** | `docs/specs/SPEC_TERMINAL_FEATURES.md` | ✅ ACTIVE — Master terminal emulator spec (PINNED) |
| **Terminal Pane Module Spec** | `docs/modules/terminal-pane-module.md` | ✅ ACTIVE — Module architecture, hooks, accessibility (NEW) |
| Master Spec (Correlation Engine) | `docs/specs/2026-01_TERMINAL_BUDDY_MASTER_SPEC.md` | 📦 REFERENCE — Phase A-era spec, superseded by Product Spec v2 for product vision |

### Plans

| Document | Location | Status |
|----------|----------|--------|
| **Terminal V2 Progress** | `docs/plans/TERMINAL-V2-PROGRESS.md` | ✅ ACTIVE — Terminal V2 implementation progress |
| **Terminal Implementation** | `docs/plans/TERMINAL-IMPLEMENTATION.md` | ✅ ACTIVE — Implementation guide with code examples |
| **Deep System Health Implementation** | `docs/plans/DEEP_SYSTEM_HEALTH_IMPLEMENTATION.md` | ✅ ACTIVE — Phase 1A architecture (NEW!) |
| Terminal Blueprint | `docs/plans/TERMINAL-BLUEPRINT.md` | 📦 REFERENCE — Original terminal research |

### Design

| Document | Location | Status |
|----------|----------|--------|
| **Design System v2** | `docs/design/DESIGN_SYSTEM_V2.md` | ✅ ACTIVE — Canonical design reference |
| Design System v1 | `docs/design/DESIGN_SYSTEM.md` | ⚠️ SUPERSEDED by v2 — kept for reference only |
| Technical Reference | `docs/design/TECHNICAL_REFERENCE.md` | ✅ ACTIVE — Architecture, data types, build instructions |

### Plans

| Document | Location | Status |
|----------|----------|--------|
| **Parallel Execution Plan** | `docs/plans/2026-02-22-phase-b-parallel-execution-plan.md` | ✅ ACTIVE — 4-workstream Phase B plan (WS1–WS4) |
| **Party Mode Session Handoff** | `docs/plans/2026-02-22-party-mode-session-handoff.md` | ✅ ACTIVE — Product vision, key decisions, agent assignments |
| Phase B Handoff | `docs/plans/2026-02-22-phase-b-handoff.md` | 📦 REFERENCE — Original 11-task list (superseded by parallel plan) |
| Architecture Design | `docs/plans/2026-02-22-terminal-buddy-architecture-design.md` | ✅ ACTIVE — Technical architecture decisions |
| Phase A Plan | `docs/plans/2026-02-22-phase-a-buddy-daemon-mcp-server.md` | ✅ COMPLETE — Preserved as record |

### Guides

| Document | Location | Status |
|----------|----------|--------|
| Getting Started | `docs/guides/GETTING_STARTED.md` | ✅ ACTIVE — User-facing guide for current MCP tools |
| Terminal Buddy Overview | `docs/guides/TERMINAL_BUDDY_OVERVIEW.md` | ✅ ACTIVE — Shareable project overview |

### Modules

| Document | Location | Status |
|----------|----------|--------|
| **Terminal Pane Module** | `terminal-buddy/buddy-app/src/modules/terminal-pane/` | ✅ ACTIVE — Module registration, `TerminalPanel.tsx`, hooks |
| `useTerminalTheme` | `terminal-buddy/buddy-app/src/components/hooks/useTerminalTheme.ts` | ✅ ACTIVE — CSS var sync, WCAG AAA, reduced-motion (NEW) |
| `useTerminalOutput` | `terminal-buddy/buddy-app/src/components/hooks/useTerminalOutput.ts` | ✅ ACTIVE — Debounced output capture for daemon (NEW) |

### References

| Document | Location | Status |
|----------|----------|--------|
| **Testing Guide** | `TESTING.md` | ✅ ACTIVE — How to test the app, what's working, troubleshooting |
| **Summary Card (Post-Phase 1A)** | `docs/guides/SUMMARY_CARD_POST_PHASE_1A.md` | ✅ ACTIVE — Quick summary of what's working (NEW!) |
| Summary Card ("Put on your wall") | `docs/guides/2026-02-22_SUMMARY_CARD.md` | ✅ ACTIVE — Product pitch, architecture, monetization, moat |
| Qwen Plan Summary | `docs/guides/2026-02-22_qwen-plan-summary-card.md` | ✅ ACTIVE — Quick-reference summary |
| Blog Article | `docs/guides/Why Your Terminal Is Finally Growing a Brain...` | ✅ ACTIVE — Marketing/vision article |
| **Strategic Deep-Dive** | `docs/guides/Terminal Buddy: A Strategic Deep-Dive into the Next Generation of Correlated Computing` | ✅ ACTIVE — Investor/strategic overview (Correlation Engine, MCP architecture, monetization) |
| Session Accomplishments | `docs/references/SESSION_ACCOMPLISHMENTS.md` | 📋 LOG — Genesis session output (with user review appended) |
| Memvid Canvas SDK Ref | `docs/references/REF_MEMVID_CANVAS_SDK.md` | ✅ REFERENCE — SDK docs for future integration |
| **BMAD Genesis + Superpowers Integration** | `docs/references/BMAD_GENESIS_SUPERPOWERS_INTEGRATION.md` | ✅ ACTIVE — Agent + skills workflow (NEW!) |
| **Superpowers Integration** | `docs/references/TERMINAL_BUDDY_SUPERPOWERS_INTEGRATION.md` | ✅ ACTIVE — Superpowers workflow guide (NEW!) |

### Logs

| Document | Location | Status |
|----------|----------|--------|
| **7:30 PM Handoff** | `docs/logs/2026-02-22_1930-HANDOFF.md` | 📌 ACTIVE — Next agent start here |
| 7:30 PM Session Log | `docs/logs/2026-02-22_1930-SESSION-LOG.md` | 📋 LOG — Build verification session record |
| Doc Audit Handoff | `docs/logs/2026-02-22_DOC-AUDIT-SESSION-HANDOFF.md` | 📋 LOG — Evening doc audit session |
| BMAD Party Mode Session | `docs/logs/2026-02-22-BMAD-PARTY-MODE-SESSION.md` | 📋 LOG — Session where Product Spec v2 was created |
| Full Session Transcript | `docs/logs/2026-02-22-FULL-SESSION-TRANSCRIPT.md` | 📋 LOG — Complete transcript |

### Historical (Archived — Do Not Use as Source of Truth)

| Document | Location | Notes |
|----------|----------|-------|
| Gemini Scaffold Handoff | `docs/historical/2026-02-22_HANDOFF_GEMINI_SCAFFOLD.md` | Early scaffold session by Gemini |
| Spec vs Team Plan Comparison | `docs/historical/2026-02-22_SPEC_VS_TEAM_PLAN_COMPARISON.md` | Resolved — decisions captured in Product Spec v2 |
| BMAD Team Plan | `docs/historical/2026-02-22_TERMINAL_BUDDY_BMAD_TEAM_PLAN.md` | Merged into Product Spec v2 |
| Handoff to Next Agent | `docs/historical/HANDOFF_TO_NEXT_AGENT.md` | One-time handoff doc, safe to archive |

---

## ⚠️ Known Duplicates & Superseded Files

| File | Issue | Resolution |
|------|-------|------------|
| `terminal-buddy/docs/UI_UX_DESIGN_SYSTEM.md` | **Outdated early scaffold** — uses Inter font, wrong pattern | ❌ SUPERSEDED by `docs/design/DESIGN_SYSTEM_V2.md` |
| `docs/design/DESIGN_SYSTEM.md` (v1) | **Superseded** — v2 adds journal layout, pre-delivery checklist, implementation notes | ⚠️ Kept as reference, not source of truth |
| `terminal-buddy/buddy-app/README.md` | **Tauri default README** — auto-generated boilerplate | ℹ️ Low priority, can leave as-is |
| `Genisis_Forge_/SESSION_ACCOMPLISHMENTS.md` | **Genesis session output** — belongs in `docs/references/` | Already copied to `docs/references/` |

---

## 📂 Project Structure

```
Terminal_buddy/
├── DOCS_INDEX.md              ← YOU ARE HERE
├── PROJECT_STATUS.md          ← Current phase/task status
├── docs/WHERE_WE_ARE.md       ← File map + orientation (start here if lost)
├── .mcp.json                  ← MCP server registration for Claude Code
│
├── docs/
│   ├── specs/                 ← Product specifications
│   ├── design/                ← Design system & technical reference
│   ├── plans/                 ← Architecture & phase plans
│   ├── guides/                ← User-facing documentation
│   ├── references/            ← External refs, SDK docs, session logs
│   ├── logs/                  ← Session logs & transcripts
│   └── historical/            ← Archived/superseded documents
│
├── terminal-buddy/            ← Rust workspace
│   ├── Cargo.toml             ← Workspace root
│   ├── shared/                ← Shared types crate
│   ├── buddy-daemon/          ← MCP server binary (Phase A ✅)
│   └── buddy-app/             ← Tauri v2 desktop app (Phase B 🔧)
│       ├── src/               ← React frontend
│       ├── src-tauri/         ← Tauri Rust backend
│       └── index.html
│
├── ext-apps/                  ← MCP Apps SDK (for Claude Desktop plugin)
│   ├── .claude-plugin/        ← Plugin marketplace config
│   ├── examples/              ← SDK examples
│   ├── src/                   ← SDK source
│   └── specification/         ← MCP Apps spec
│
├── ui-ux-pro-max-skill/       ← Design intelligence skill (50+ styles)
│
└── archive/                   ← Old project files (DO NOT REFERENCE)
```

---

## 🚀 Phase B Task Tracker

| # | Task | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 1 | Scaffold Tauri v2 App | Architect | ✅ COMPLETE | Build verified |
| 2 | Connect to buddy-daemon via MCP | Architect | ✅ COMPLETE | Tauri IPC + stdio JSON-RPC client done |
| 3 | Design System Implementation | UX Designer | ✅ COMPLETE | CSS vars, fonts, Radix UI setup |
| 4 | Journal View — Timeline | Frontend Dev | ✅ COMPLETE | Live data, date grouping, explanation modal, error states |
| 5 | Journal View — Topics | Frontend Dev | ⬜ NOT STARTED | Unblocked by Task 4 |
| 6 | Journal View — Search | Frontend Dev | ⬜ NOT STARTED | Unblocked by Task 4 |
| 7 | Onboarding Wizard | UX + Dev | ✅ COMPLETE | 3-step wizard + API key validation |
| 8 | Terminal Pane (xterm.js) | Frontend Dev | ✅ COMPLETE (V1) | Original TerminalPane.tsx works |
| 8b | Terminal Pane V2 (PTY-backed) | **Terry (Terminal Specialist)** | ✅ **COMPLETE** | Build passes. Features: PTY spawn/write/kill, theme sync (WCAG AAA), `aria-live` announcements, reduced-motion support, keyboard shortcuts, output capture hook. Awaiting `buddy_add_output` MCP tool in daemon. |
| 9 | Voice Input (whisper-rs) | Architect | ⬜ NOT STARTED | Depends on Task 1 |
| 10 | Creator Corner MVP | Dev + UX | 🟡 STARTED | Mock UI + template schema done |
| 11 | Polish & Package | All | ⬜ NOT STARTED | Depends on all |

**Critical Path:** Task 5 (Topics) → Task 6 (Search) → Task 11 (Polish)
**Unblocked NOW:** Tasks 5, 6, 9, 10 (Topics, Search, Voice, Creator Corner)

---

## 🔑 Key Decisions (Locked)

- **Daemon is DONE** — do not modify `buddy-daemon/` unless fixing a bug or adding LLM providers
- **UI never talks to SQLite directly** — always through MCP tools
- **Journal-first paradigm** — primary UI is notebook, not raw terminal
- **Atkinson Hyperlegible + JetBrains Mono** — canonical fonts (not Inter, not Lexend)
- **Three surfaces, one brain** — Tauri app, MCP App (Claude Desktop), VS Code extension

---

## 🔗 External Resources

| Resource | Location |
|----------|----------|
| Genesis Project DNA | `~/_bmad-output/genesis/planning/terminal_buddy_dna.json` |
| Genesis Team Structure | `~/_bmad-output/genesis/teams/terminal_buddy_team.yaml` |
| Genesis Report | `~/_bmad-output/genesis/planning/terminal_buddy_GENESIS_REPORT.md` |
| MCP Apps SDK | `ext-apps/` — SDK for building MCP App iframe surface |
| MCP App Marketplace Config | `ext-apps/.claude-plugin/marketplace.json` — Plugin registry |
| **Superpowers Workflow** | `superpowers/` — Skills-based development workflow (NEW!) |
| **Superpowers README** | `superpowers/README.md` — How to use skills (NEW!) |
| Memvid Canvas SDK Ref | `docs/references/REF_MEMVID_CANVAS_SDK.md` — `@memvid/canvas-react` |
| Blog Article | `docs/references/Why Your Terminal Is Finally Growing a Brain...` |
| BMAD Workflows | `~/_bmad/` — Agent definitions and workflows |
| **BMAD Genesis + Superpowers** | `docs/references/BMAD_GENESIS_SUPERPOWERS_INTEGRATION.md` — Agent + skills integration (NEW!) |

---

*This is the single entry point for all Terminal Buddy documentation.*
*When in doubt, start here.*
*Last audited: 2026-02-25 18:30 — Phase 1A Deep System Health ✅ COMPLETE, Superpowers Integration ✅ ACTIVE*

---

## 🎉 Phase 1A Deep System Health Completion (2026-02-25)

**Owner:** Qwen Code (with BMAD Superpowers workflow)
**Status:** ✅ Build passes, ready for testing

### What Was Built

| Component | Location | Description |
|-----------|----------|-------------|
| **DeepSystemSnapshot** | `buddy-daemon/src/monitor/mod.rs` | Process, port, service, package, boot item tracking |
| **ProcessInfo** | `buddy-daemon/src/monitor/mod.rs` | Detailed process info (PID, CPU%, RAM%, parent) |
| **PortInfo** | `buddy-daemon/src/monitor/mod.rs` | Network port + owning process |
| **ServiceInfo** | `buddy-daemon/src/monitor/mod.rs` | Systemd service status |
| **PackageInfo** | `buddy-daemon/src/monitor/mod.rs` | Installed packages (apt, cargo, npm, pip) |
| **buddy_system_health** | `buddy-daemon/src/server.rs` | Enhanced with deep awareness |
| **buddy_system_health_json** | `buddy-daemon/src/server.rs` | Structured JSON output (NEW!) |

### Features Implemented

- ✅ Top 10 processes by CPU + RAM
- ✅ Open network ports with process owners
- ✅ Running/enabled systemd services
- ✅ Recently installed packages
- ✅ Boot items (systemd + cron)
- ✅ Uptime, hostname, kernel version
- ✅ Human-readable + JSON output formats

### Build Status

```bash
cd buddy-daemon
cargo build --release
# ✅ Compiles successfully
```

### Testing

```bash
# Run daemon
./target/release/buddy-daemon

# Call via MCP client
> "What's running on my computer?"
```

### Documentation

- `docs/plans/DEEP_SYSTEM_HEALTH_IMPLEMENTATION.md` — Full architecture
- `docs/guides/SUMMARY_CARD_POST_PHASE_1A.md` — Quick summary
- `docs/references/BMAD_GENESIS_SUPERPOWERS_INTEGRATION.md` — Agent + skills workflow
- `docs/references/TERMINAL_BUDDY_SUPERPOWERS_INTEGRATION.md` — Superpowers guide

---

## 🎉 Terminal Pane V2 Completion Summary (2026-02-25)

**Owner:** Terry (Terminal Emulator Specialist)  
**Status:** ✅ Build passes, ready for QA handoff

### What Was Built

| Component | Location | Description |
|-----------|----------|-------------|
| **TerminalPanel.tsx** | `src/components/TerminalV2.tsx` | PTY-backed terminal with theme sync, output capture, accessibility |
| `useTerminalTheme` | `src/components/hooks/useTerminalTheme.ts` | Syncs with CSS vars, respects `prefers-reduced-motion`, returns `TerminalTheme` |
| `useTerminalOutput` | `src/components/hooks/useTerminalOutput.ts` | Debounced (100ms) output capture, forwards to `buddy_add_output` |
| Module scaffold | `src/modules/terminal-pane/` | Directory created, ready for registration |

### Features Implemented

- ✅ PTY spawn/write/kill via Tauri commands
- ✅ Theme sync with `--tb-*` CSS variables (WCAG AAA compliant)
- ✅ Reduced-motion support (cursor blink disabled when `prefers-reduced-motion: reduce`)
- ✅ `aria-live="polite"` announcements for command start/finish/interrupt/clear
- ✅ Keyboard shortcuts: Ctrl+C (interrupt), Ctrl+L (clear), Ctrl+Shift+C/V (copy/paste)
- ✅ Output capture hook (debounced 100ms) → `invoke('buddy_add_output')`
- ✅ Build passes (`npm run build` succeeds)

### Pending Integration

- ⚠️ `buddy_add_output` MCP tool must be implemented in `buddy-daemon` to complete journaling
- ⚠️ Module registration in `registry` (Creator Corner integration)
- ⚠️ QA validation (WCAG audit, cross-platform testing)

### Handoff Status

**Ready for:** Vera (Voice Specialist) → Can now integrate voice input with working terminal  
**Next QA:** Quinn (QA Engineer) → Accessibility audit pending  
**Blocker:** None — unblocked for Voice integration

---

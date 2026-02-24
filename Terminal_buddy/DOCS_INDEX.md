# Terminal Buddy — Documentation Index

> **Last Updated:** 2026-02-24T02:30:00-08:00
> **Project Phase:** Phase B — Desktop App (Tauri v2 + React 18+)
> **Phase A Status:** ✅ COMPLETE (all 7 MCP tools live!)
> **Phase B Status:** 🔧 IN PROGRESS — Tasks 1, 2, 3, 4 & 7 ✅ COMPLETE. Journal Timeline live with real data. Next: Task 5 (Topics) or Task 8 (Terminal Pane).

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
| Master Spec (Correlation Engine) | `docs/specs/2026-01_TERMINAL_BUDDY_MASTER_SPEC.md` | 📦 REFERENCE — Phase A-era spec, superseded by Product Spec v2 for product vision |

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

### References

| Document | Location | Status |
|----------|----------|--------|
| **Testing Guide** | `TESTING.md` | ✅ ACTIVE — How to test the app, what's working, troubleshooting |
| Summary Card ("Put on your wall") | `docs/guides/2026-02-22_SUMMARY_CARD.md` | ✅ ACTIVE — Product pitch, architecture, monetization, moat |
| Qwen Plan Summary | `docs/guides/2026-02-22_qwen-plan-summary-card.md` | ✅ ACTIVE — Quick-reference summary |
| Blog Article | `docs/guides/Why Your Terminal Is Finally Growing a Brain...` | ✅ ACTIVE — Marketing/vision article |
| **Strategic Deep-Dive** | `docs/guides/Terminal Buddy: A Strategic Deep-Dive into the Next Generation of Correlated Computing` | ✅ ACTIVE — Investor/strategic overview (Correlation Engine, MCP architecture, monetization) |
| Session Accomplishments | `docs/references/SESSION_ACCOMPLISHMENTS.md` | 📋 LOG — Genesis session output (with user review appended) |
| Memvid Canvas SDK Ref | `docs/references/REF_MEMVID_CANVAS_SDK.md` | ✅ REFERENCE — SDK docs for future integration |

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
| 8 | Terminal Pane (xterm.js) | Frontend Dev | ⬜ NOT STARTED | Unblocked by Task 2 |
| 9 | Voice Input (whisper-rs) | Architect | ⬜ NOT STARTED | Depends on Task 1 |
| 10 | Creator Corner MVP | Dev + UX | 🟡 STARTED | Mock UI + template schema done |
| 11 | Polish & Package | All | ⬜ NOT STARTED | Depends on all |

**Critical Path:** Task 8 (Terminal Pane) → Task 11 (Polish)
**Unblocked NOW:** Tasks 5, 6, 8 (Topics, Search, Terminal Pane)

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
| Memvid Canvas SDK Ref | `docs/references/REF_MEMVID_CANVAS_SDK.md` — `@memvid/canvas-react` |
| Blog Article | `docs/references/Why Your Terminal Is Finally Growing a Brain...` |
| BMAD Workflows | `~/_bmad/` — Agent definitions and workflows |

---

*This is the single entry point for all Terminal Buddy documentation.*  
*When in doubt, start here.*  
*Last audited: 2026-02-22T18:15:00-08:00*

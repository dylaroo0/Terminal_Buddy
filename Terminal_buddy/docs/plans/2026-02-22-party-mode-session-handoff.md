# Terminal Buddy — Party Mode Session Handoff

> **Date:** February 22, 2026  
> **Session Type:** Product Vision + Architecture Finalization + Phase B Kickoff  
> **Facilitator:** BMad Master  
> **User:** Dylaroo  
> **Created:** 2026-02-22 (evening)  
> **Status:** ✅ Phase A Complete | 🚀 Phase B Ready to Start  

*This is the permanent record of the BMAD Party Mode session that finalized the product vision. For the actionable build plan derived from this session, see [`2026-02-22-phase-b-parallel-execution-plan.md`](./2026-02-22-phase-b-parallel-execution-plan.md).*

---

## 🎯 What We Accomplished

### 1. Product Vision Locked

> **"A journal for your terminal that explains itself."**

Terminal Buddy is not another terminal emulator. It is a **second brain for your shell** — a persistent, searchable, explainable memory layer that turns every command into a learning moment.

**The Wedge (60-second moment):**  
User opens Terminal Buddy → sees session history organized by topic → clicks [Explain] on a command from last Tuesday → hears: *"This fixed the Docker port conflict by killing the old nginx process"* → 💡 *"I can never go back to a dumb terminal."*

### 2. Core Concepts Defined

| Concept | What It Means |
|---------|--------------|
| **Sessions** | Atomic unit — focused work periods, not individual commands |
| **Journal** | Notebook-style UI (Timeline + Topics + Search views) |
| **Explain** | One button turns any command into plain-language learning |
| **Creator Corner** | Design your UI, save templates, share with community |
| **Personalization without complexity** | One-click setup, deep customization optional |

### 3. Architecture Finalized

```
┌─────────────────────────────────────┐
│  TERMINAL BUDDY (Product)           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ BUDDY DAEMON (Rust, MCP)    │   │ ← The "brain" — stable API v1.0
│  │ • Memvid storage (.mv2+SQLite)│  │ • Never changes interface
│  │ • Correlation engine         │  │ • Open-core candidate
│  │ • System monitor             │  │
│  └──────────┬──────────────────┘   │
│             │ MCP (stdio)           │
│             ▼                       │
│  ┌─────────────────────────────┐   │
│  │ UI LAYER (Pluggable)         │  │ ← The "skin" — customizable
│  │ • Default: Tauri v2 + React  │  │ • Creator Corner
│  │ • Journal primary view       │  │ • Theme system
│  │ • Accessibility-first        │  │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Three UI Surfaces (One Brain):**

| Surface | Technology | Purpose |
|---------|-----------|---------|
| **Tauri App** | Tauri v2 + React 18+ | Standalone product (Phase B primary) |
| **MCP App** | HTML/JS iframe (`ext-apps/`) | Embedded in Claude Desktop/Cursor (discovery) |
| **VS Code Extension** | Future | Editor integration |

### 4. Accessibility First-Class (Not Bolted On)

**Default `buddy.toml` — "Designed for Focus" Skin:**

```toml
[appearance]
theme = "dyslexia-dark"
font_family = "Atkinson Hyperlegible"  # or OpenDyslexic, Lexend
font_size = 18
line_height = 1.8
letter_spacing = 0.05em

[interaction]
default_input = "hybrid"
push_to_talk = "RightCtrl"
confirm_before_run = true
visual_command_cards = true

[feedback]
text_to_speech = true
tts_provider = "local"  # or "elevenlabs", "quen"
error_icons = true
focus_mode = true
```

**Principles:**

- ✅ Dyslexia-friendly fonts + generous spacing + high contrast by default
- ✅ Voice is peer to keyboard — always available, always primary
- ✅ Command cards over raw text — structured visuals reduce cognitive load
- ✅ Colorblind-safe icons + colors
- ✅ Full keyboard navigation (Radix UI)
- ✅ `prefers-reduced-motion` respected
- ✅ **Core accessibility features never gated behind paywall**

### 5. Creator Corner Defined

A dedicated space where users design, customize, and share their experience:

- 🎨 **Design a UI Skin** — fonts, colors, spacing, layout with live preview
- 🧩 **Build a Component** — new panels, widgets, interactions
- 📦 **Package a Template** — save setup to share or reuse
- 🌐 **Browse Community Templates** — discover what others made

**Template System Flow:**

```
Create (visual editor) → Save as .buddy-template → Share (local/community/direct) → Install
```

**Safety Net:** Every customization has a "Reset to Accessible Default" button.

### 6. Session Classification System

**Auto-Titling (Two Tiers):**

| Tier | Method | When Used |
|------|--------|-----------|
| **Heuristic** (default) | Working directory + most-modified files + error patterns | Always, instant, private |
| **LLM-Assisted** (optional) | Pass command summary to user's configured LLM | If user enables in config |

**Auto-Grouping:** Topics are **tags, not folders** — a session can belong to multiple topics.

**Data Model (SQLite):**

```sql
sessions (id, auto_title, user_title, working_directory, command_count, ...)
topics (id, name, created_at)
session_topics (session_id, topic_id)  -- many-to-many
notes (id, session_id, command_id?, content, created_at)
```

### 7. MCP API v1.0 — FROZEN

These tools are the stable contract. UI changes freely; these do not.

| Tool | Status | Description |
|------|--------|-------------|
| `buddy_history` | ✅ Working | Query command history with filters |
| `buddy_sessions` | ✅ Working | List and search sessions |
| `buddy_system_health` | ✅ Working | CPU, RAM, disk, process info |
| `buddy_cleanup_scan` | ✅ Working | Find cleanup opportunities |
| `buddy_run` | ✅ Working | Execute command with PTY capture |
| `buddy_ask` | 🟡 Stub | Natural language to command translation (needs LLM) |
| `buddy_explain` | 🟡 Stub | Plain-language command explanation (needs LLM) |

### 8. Phase B Build Plan (11 Tasks)

| Task | Name | Description | Owner |
|------|------|-------------|-------|
| 1 | **Scaffold Tauri v2 App** | React + TypeScript. Install Radix UI, Tailwind, Lucide. Build config schema with JSON Schema from day one. | Claude |
| 2 | **Connect to buddy-daemon via MCP** | Tauri backend spawns daemon. Wire MCP stdio. Test with `buddy_system_health` and `buddy_sessions`. | Claude |
| 3 | **Design System Implementation** | Fonts (Atkinson Hyperlegible, JetBrains Mono, OpenDyslexic). Tailwind config. CSS variable theme system (50+ properties). Every component accepts theme props. | Gemini |
| 4 | **Journal View — Timeline** | Primary view: sessions by date. Command cards with Explain / Re-run / Add Note. | Qwen |
| 5 | **Journal View — Topics** | Sessions grouped by subject. Collapsible folders. Rename/re-tag. | Qwen |
| 6 | **Journal View — Search** | Semantic search bar. Results as command cards. Date and topic filters. | Qwen |
| 7 | **Onboarding Wizard** | First-run: interaction mode, font, TTS. "Use Recommended Setup" one-click path. Saves to buddy.toml. | Gemini |
| 8 | **Terminal Pane (MVP)** | Collapsible terminal at bottom. xterm.js in Tauri. Connect to shell. Pipe to daemon. | Claude |
| 9 | **Voice Input (whisper-rs)** | Push-to-talk (RightCtrl). Local processing only. | Claude |
| 10 | **Creator Corner MVP** | Visual editor for fonts/colors/layout. Live preview. Local template save/load/export. | Qwen |
| 11 | **Polish & Package** | Code signing, auto-updater, icon, Linux/macOS/Windows builds. | Claude |

---

## 🔑 Key Decisions Made

| Decision | Rationale |
|----------|-----------|
| Journal is primary view, not terminal | Journal-first reduces cognitive load; makes product unique |
| Sessions are atomic unit | Matches how humans think: "I was fixing Docker" not "I ran 17 commands" |
| Topics are tags, not folders | Flat data model; sessions can belong to multiple topics |
| Freeze MCP API v1.0 | Stable contract for UI development; add new tools in v1.1 |
| Defer plugin API | Build 3 internal plugins first, extract boundary later |
| Build for ADHD Power User first | Best feedback loop; knows what they want, vocal, tells you when wrong |
| Creator Corner as own section | Not just settings — empowerment; enables network effects |
| Three UI surfaces | Tauri (standalone), MCP App (discovery), VS Code (future) — one brain, multiple skins |
| Memvid Canvas for visual engine | Drop-in React components for search, chat, timeline |
| "Designed for focus" marketing angle | Wider appeal than "designed for disability" |
| Never gate accessibility behind paywall | Core ethical principle; unanimous agreement |

---

## 📁 Reference Documents

| Document | Location | Purpose |
|----------|----------|---------|
| **Product Spec v2** | `docs/specs/2026-02-22-PRODUCT_SPEC_V2.md` | ✅ ACTIVE — primary product reference (844 lines) |
| **Parallel Execution Plan** | `docs/plans/2026-02-22-phase-b-parallel-execution-plan.md` | ✅ ACTIVE — 4-workstream build plan |
| Phase B Handoff | `docs/plans/2026-02-22-phase-b-handoff.md` | Task list reference |
| Architecture Design | `docs/plans/2026-02-22-terminal-buddy-architecture-design.md` | Architecture diagrams |
| Design System v2 | `docs/design/DESIGN_SYSTEM_V2.md` | Colors, fonts, layout, components |
| Technical Reference | `docs/design/TECHNICAL_REFERENCE.md` | Tech stack, dependencies, data types |
| Product Overview | `docs/guides/TERMINAL_BUDDY_OVERVIEW.md` | Non-technical shareable overview |
| Session Log | `docs/logs/2026-02-22-BMAD-PARTY-MODE-SESSION.md` | Full transcript of this session |

---

## 🚀 Immediate Next Step (For Next Session)

**Start Phase B — Verify Tauri scaffold build, then begin Task 2 (MCP Bridge).**

```bash
# Gate: verify build first
cd /home/dylaroo/projects/Terminal_buddy/terminal-buddy/buddy-app
npm run build

# If green: Task 1 & 3 COMPLETE. Start Task 2:
# Wire Tauri Rust backend to spawn buddy-daemon and call MCP tools.
```

**Success Criteria for Task 2:**

- [ ] `buddy_system_health` called from React, real data displayed
- [ ] `buddy_sessions` called from React, session list displayed
- [ ] No SQLite direct calls from UI (always via MCP)
- [ ] Git commit: `feat: wire Tauri backend to buddy-daemon via MCP stdio`

---

## 💬 Quotes Worth Keeping

> *"You're not building 'another terminal.' You're building the first terminal that learns with you — and that's a category nobody owns yet."* — Victor

> *"That first-run moment IS the wedge."* — Sally

> *"A journal for your terminal that explains itself."* — John

> *"Personalization without complexity."* — Dylaroo (Brand Principle)

> *"Terminals should remember. Commands should be explainable. Accessibility isn't optional."* — The Manifesto

> *"This isn't just viable. It's necessary."* — Victor

---

## 🏁 Session Metadata

```
Date: February 22, 2026
Facilitator: BMad Master
User: Dylaroo
Agents Contributing: Victor (Innovation), Winston (Architecture),
                     Sally (UX), John (Product), Sophia (Storyteller)
Output: Product Spec v2 (16 sections, 844 lines)
Status: APPROVED — Ready for Phase B
```

---

> *Put this on the wall.*  
> *This session produced the definitive product vision for Terminal Buddy.*  
> *Built with you, for everyone.* 🎯

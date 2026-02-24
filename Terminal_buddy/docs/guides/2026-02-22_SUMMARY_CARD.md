# 🎯 Terminal Buddy — Summary Card
*Put this on your wall*

---

## 🏷️ The Product
> **"A journal for your terminal that explains itself."**

A searchable, explainable, accessible memory layer for everything you've ever done in a shell.

---

## ✨ The Wedge (60-Second Moment)
```
You open Terminal Buddy →
See your session history organized by topic →
Click [Explain] on a command from last Tuesday →
Hear: "This fixed the Docker port conflict by killing the old nginx process" →
💡 "I can never go back to a dumb terminal"
```

---

## 🧠 Core Concepts
| Concept | What It Means |
|---------|--------------|
| **Sessions** | Atomic unit — not commands, but focused work periods |
| **Journal** | Notebook-style UI (Timeline + Topics + Search views) |
| **Explain** | One button turns any command into plain-language learning |
| **Creator Corner** | Design your UI, save templates, share with community |
| **Personalization without complexity** | One-click setup, deep customization optional |

---

## 🎨 First-Run Onboarding
```
[ Welcome to Terminal Buddy 👋 ]

How do you want to interact?
○ 🎤 Voice-first  ○ ⌨️ Keyboard-first  ○ 🔀 Hybrid

Reading comfort?
○ OpenDyslexic  ○ Lexend  ○ System default

TTS Voice?
○ Built-in (free)  ○ ElevenLabs (your key)  ○ Quen (your key)

[ Use Recommended Setup ]   [ Customize → ]
```
*Under 5 seconds to get started. All choices changeable later.*

---

## 🏗️ Architecture (Locked)
```
┌─────────────────────┐
│ BUDDY DAEMON (Rust) │ ← The "brain" — stable MCP API v1.0
│ • Memvid storage    │
│ • Correlation engine│
│ • Session classifier│
└────────┬────────────┘
         │ MCP (stdio)
         ▼
┌─────────────────────┐
│ UI LAYER (Pluggable)│ ← The "skin" — customizable
│ • Tauri v2 + React  │
│ • Journal primary   │
│ • Creator Corner    │
│ • Accessibility-first│
└─────────────────────┘
```

**Three surfaces, one brain:**
- 🖥️ **Tauri App** — Standalone desktop product
- 🪟 **MCP App** — Embedded iframe in Claude Desktop/Cursor
- 🔌 **VS Code Extension** — Future

---

## ♿ Accessibility (First-Class)
- ✅ OpenDyslexic / Lexend / Atkinson Hyperlegible defaults
- ✅ Voice input as peer to keyboard (not an "accessibility mode")
- ✅ Command cards over raw text output
- ✅ Focus mode: dim terminal during explanations
- ✅ Colorblind-safe icons + colors
- ✅ Full keyboard navigation (Radix UI)
- ✅ `prefers-reduced-motion` respected
- ✅ **Core accessibility features never gated behind paywall**

---

## 💰 Monetization (Ethical)
| Tier | Price | What's Included |
|------|-------|----------------|
| **Free** | $0 | Journal, Explain (heuristic), voice input, accessibility defaults, Creator Corner (local) |
| **Pro** | $8/mo | LLM-powered titles/explanations, advanced semantic search, custom themes, community templates |
| **Enterprise** | $20/seat/mo | SSO, audit logs, centralized config, team Memvid sync |

*Open Core model. BYOK for cloud AI/TTS = zero API cost to us.*

---

## 🚀 Phase B Build Plan (11 Tasks)
1. Scaffold Tauri v2 App + config schema (JSON Schema from day one)
2. Connect to buddy-daemon via MCP stdio
3. Design System: fonts, CSS variables, Radix UI
4. Journal View — Timeline mode
5. Journal View — Topics mode
6. Journal View — Semantic Search
7. Onboarding Wizard (one-click recommended path)
8. Terminal Pane MVP (collapsible, xterm.js)
9. Voice Input (whisper-rs, push-to-talk)
10. Creator Corner MVP (visual editor + local templates)
11. Polish & Package (Linux/macOS/Windows)

---

## 🛡️ Competitive Moat (4 Pillars)
1. **Correlated memory** — Memvid + filesystem + semantic search = data flywheel
2. **Accessibility-first defaults** — First-mover in uncontested space
3. **Local-first architecture** — Privacy as feature, not limitation
4. **Template ecosystem** — Creator Corner + community = network effects

---

## 💬 Key Quotes
> *"You're not building 'another terminal.' You're building the first terminal that learns with you — and that's a category nobody owns yet."* — Victor

> *"That first-run moment IS the wedge."* — Sally

> *"A journal for your terminal that explains itself."* — John

> *"Personalization without complexity."* — Dylaroo (Brand Principle)

> *"Terminals should remember. Commands should be explainable. Accessibility isn't optional."* — The Manifesto

---

## 📄 Reference Documents
| Document | Location |
|----------|----------|
| **Product Spec v2** (ACTIVE) | `docs/specs/2026-02-22-PRODUCT_SPEC_V2.md` |
| Master Spec (Correlation Engine) | `docs/specs/2026-01_TERMINAL_BUDDY_MASTER_SPEC.md` |
| Phase B Handoff | `docs/plans/2026-02-22-phase-b-handoff.md` |
| Architecture Design | `docs/plans/2026-02-22-terminal-buddy-architecture-design.md` |
| Session Log | `docs/logs/2026-02-22-BMAD-PARTY-MODE-SESSION.md` |
| Design System v2 | `docs/design/DESIGN_SYSTEM_V2.md` |

---

## 🎉 Session Metadata
```
Date: February 22, 2026
Facilitator: BMad Master
User: Dylaroo
Agents: 25 (full BMAD roster)
Key Contributors: Victor, Winston, Sally, John, Sophia
Output: Product Spec v2 (16 sections, 764 lines)
Status: APPROVED — Ready for Phase B Task 1
```

---

> *This isn't just viable. It's necessary.*  
> *Built with you, for everyone.* 🎯

*Print this. Frame it. Start building.*

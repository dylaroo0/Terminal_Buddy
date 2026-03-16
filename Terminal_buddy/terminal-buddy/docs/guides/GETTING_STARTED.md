# Terminal Buddy — Getting Started

> **Last Updated:** 2026-02-22T19:45:00-08:00  
> **Phase A:** ✅ COMPLETE — Buddy Daemon (Rust MCP server)  
> **Phase B:** 🔧 IN PROGRESS — Desktop App (Tauri v2 + React)

---

## What Is Terminal Buddy?

**"A journal for your terminal that explains itself."**

Terminal Buddy is a searchable, explainable, accessible memory layer for everything you've ever done in a shell. It watches your terminal sessions, correlates commands with system changes, and gives you a beautiful journal UI to browse, search, and understand your work.

It works in **three ways** (one brain, multiple skins):

| Surface | Status | What it is |
|---------|--------|-----------|
| **MCP Plugin** (Claude Code) | ✅ Working now | Invisible helper — Claude uses buddy tools automatically |
| **Desktop App** (Tauri) | 🔧 Building now | Standalone journal app with full UI |
| **MCP App** (iframe) | 🔮 Planned | Embedded inside Claude Desktop / Cursor for zero-install discovery |

---

## What It Can Do RIGHT NOW

Terminal Buddy's **buddy-daemon** exposes **7 MCP tools**. Phase A is complete — all core tools work (6/6 tests pass).

### The 7 Tools

| Tool | What it does | Status |
|------|-------------|--------|
| `buddy_history` | Search your past commands by keyword, time, or exit code | ✅ Working |
| `buddy_sessions` | List work sessions (auto-titled chapters of your terminal usage) | ✅ Working |
| `buddy_system_health` | Check CPU, memory, disk, and running processes | ✅ Working |
| `buddy_cleanup_scan` | Find safe-to-delete files (caches, temp, old builds) — **never deletes anything** | ✅ Working |
| `buddy_run` | Execute a command with PTY capture (records input + output) | ✅ Working |
| `buddy_explain` | Get a plain-language explanation of what a command did | ⚠️ Stub (needs LLM backend) |
| `buddy_ask` | Ask questions about your terminal history | ⚠️ Stub (needs LLM backend) |

### How to Use It (MCP Plugin Mode)

**Just talk to Claude naturally.** You don't type special commands.

> "What was that docker command I ran last week?"  
→ Claude searches your history with `buddy_history`

> "Is my computer running slow?"  
→ Claude checks with `buddy_system_health`

> "My disk is getting full, what can I clean up?"  
→ Claude scans with `buddy_cleanup_scan`

> "Run `npm test` and capture the output"  
→ Claude uses `buddy_run` to execute and record

> "What was I working on Tuesday?"  
→ Claude lists sessions with `buddy_sessions`

---

## The Desktop App (Phase B — Building Now)

Phase B is a **standalone Tauri v2 + React app** — a full journal interface for your terminal.

### What It Will Look Like

- **Journal View** — Your terminal history organized as a notebook, not raw text
  - **Timeline** — Sessions listed chronologically with command cards
  - **Topics** — Sessions tagged by project/language/tool
  - **Search** — Semantic search across everything
- **Creator Corner** — Design custom UI skins, package templates, share with others
- **Terminal Pane** — Collapsible embedded terminal at the bottom
- **Onboarding Wizard** — Pick your interaction mode (voice/keyboard/hybrid), font, and TTS provider

### Current Build Status

```
✅ Tauri scaffold — built and compiling
✅ Design System CSS — 50+ custom properties, Atkinson Hyperlegible font, WCAG AAA
✅ Journal UI coded — Timeline, Topics, Search views (mock data)
⬜ MCP bridge — Connecting UI to buddy-daemon (Task 2 — NEXT)
⬜ Real data — Replacing mocks with live MCP calls
⬜ Voice input — Local Whisper, push-to-talk
⬜ Creator Corner — Skin designer + template system
```

---

## Where Things Live on Your Computer

```
~/projects/Terminal_buddy/
├── .mcp.json                    ← Tells Claude Code about buddy-daemon
├── terminal-buddy/
│   ├── buddy-daemon/            ← ✅ The brain (Rust MCP server)
│   │   └── src/server.rs        ← The 7 MCP tools
│   └── buddy-app/               ← 🔧 The UI (Tauri + React)
│       ├── src/App.tsx           ← Journal interface
│       └── src/App.css           ← Design system
└── docs/
    ├── WHERE_WE_ARE.md          ← Full file map + orientation
    ├── specs/PRODUCT_SPEC_V2.md ← Product bible (844 lines)
    └── guides/                  ← You are here
```

---

## Accessibility — Built In, Not Bolted On

Terminal Buddy is **designed for focus** — specifically for users with dyslexia, ADHD, and anyone who wants a calmer terminal experience.

| Feature | What it does |
|---------|-------------|
| **Atkinson Hyperlegible** | Default font — makes b/d, p/q, I/l/1 visually distinct |
| **1.8 line height** | Reduces visual crowding in dense logs |
| **WCAG AAA contrast** | High contrast dark theme, no eye strain |
| **Voice-as-a-Peer** | Voice input via local Whisper — 100% on-device, private |
| **Focus Mode** | Dims background during AI explanations |
| **Reduced Motion** | Respects `prefers-reduced-motion` OS setting |
| **Creator Corner** | Users can customize everything and share "Dyslexia-Friendly Dark" templates |

---

## The Bigger Picture

| Phase | Name | Status | What it builds |
|-------|------|--------|---------------|
| **A** | The Brain | ✅ **COMPLETE** | Rust daemon, 7 MCP tools, SQLite memory, PTY capture |
| **B** | The Skin | 🔧 **IN PROGRESS** | Desktop app (Tauri v2 + React), journal UI, Creator Corner, voice |
| **C** | The Platform | 🔮 Planned | VS Code extension, MCP App iframe, community template hub |

Everything built in Phase A carries forward. Nothing gets thrown away.

---

## FAQ

**Q: Do I need to install anything?**  
A: If you're in the Terminal Buddy project in Claude Code, it's already set up. The `.mcp.json` file handles registration automatically. For the desktop app, you'll need to build it: `cd terminal-buddy/buddy-app && npm run build`.

**Q: Will it slow down my computer?**  
A: No. The daemon is a 7MB Rust binary. It only runs when Claude Code is open in this project (or when you launch the desktop app).

**Q: Can it break anything?**  
A: No. The cleanup scanner only *suggests* — it never deletes. The other tools just read information. `buddy_run` executes commands you ask for, same as typing them yourself.

**Q: I said something about my system and Claude didn't use Terminal Buddy. Why?**  
A: Claude uses its judgment about when to call tools. Be specific: "use buddy to check my system health" or "search my terminal history for docker commands."

**Q: What about privacy?**  
A: Everything is local-first. No data leaves your machine. Voice uses on-device Whisper. If you want cloud AI features (like ElevenLabs TTS), you bring your own API key (BYOK).

---

*For the full product spec: `docs/specs/PRODUCT_SPEC_V2.md`*  
*For current task status: `PROJECT_STATUS.md`*  
*For file map + orientation: `docs/WHERE_WE_ARE.md`*

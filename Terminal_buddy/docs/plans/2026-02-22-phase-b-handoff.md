# Phase B Handoff - Terminal Buddy Desktop App

> **Date:** 2026-02-22
> **Status:** Ready to begin Phase B
> **Phase A:** COMPLETE (daemon compiles, 6/6 tests pass, MCP server working)
> **Context:** 82% used - creating handoff for next session/agent

---

## What's Done (Phase A)

The buddy-daemon is a working Rust MCP server exposing 7 tools over stdio:

| Tool | Status |
|------|--------|
| `buddy_history` | Working |
| `buddy_sessions` | Working |
| `buddy_system_health` | Working |
| `buddy_cleanup_scan` | Working |
| `buddy_run` | Working (PTY capture) |
| `buddy_ask` | Stub (needs LLM) |
| `buddy_explain` | Stub (needs LLM) |

- Binary: `terminal-buddy/target/release/buddy-daemon` (7.0 MB)
- Tests: 6/6 passing
- MCP registration: `.mcp.json` at project root
- Source: ~1,327 lines of Rust

---

## What's Next (Phase B) - The Desktop App

### Architecture Decision (CONFIRMED)

```
Tauri v2 (Rust backend + React frontend)
    │
    ├── Buddy Panel (React + Radix UI + Tailwind)
    │   ├── Voice input bar (whisper-rs)
    │   ├── Command approval cards
    │   ├── Timeline scrubber / session history
    │   ├── System health dashboard
    │   └── Semantic search (sqlite-vec)
    │
    ├── Terminal Pane (embed wezterm-term or alacritty_terminal crate)
    │   └── DO NOT fork WezTerm - embed the library only
    │
    └── buddy-daemon (already built, connects via MCP stdio)
```

### Key Decisions Made

1. **DO NOT fork WezTerm** - embed `wezterm-term` or `alacritty_terminal` crate inside Tauri
2. **Tauri v2** for desktop wrapper (not Electron)
3. **React + TypeScript** for UI (best accessibility ecosystem)
4. **Radix UI** primitives for keyboard nav / focus management
5. **Atkinson Hyperlegible** font for UI (dyslexia-optimized)
6. **JetBrains Mono** for terminal text
7. **sqlite-vec** for semantic search inside existing SQLite
8. **whisper-rs** for local voice input
9. **Dark OLED theme** as default (WCAG AAA, `#0F172A` background)
10. **Build Buddy Panel FIRST, terminal engine LAST**

---

## Task Plan (Phase B)

### Task 1: Scaffold Tauri v2 App
- `npm create tauri-app@latest` with React + TypeScript
- Set up project structure inside `terminal-buddy/buddy-app/`
- Add to workspace in `terminal-buddy/Cargo.toml`
- Install: `@modelcontextprotocol/sdk`, `@radix-ui/react-*`, `tailwindcss`, `lucide-react`
- Verify empty app builds and opens a window

### Task 2: Connect to buddy-daemon via MCP
- Tauri Rust backend spawns `buddy-daemon` as child process
- Use `@modelcontextprotocol/sdk` in React to talk to daemon via Tauri commands
- Test: call `buddy_system_health` from React UI and display result
- Test: call `buddy_sessions` and display list

### Task 3: Design System Implementation
- Import Atkinson Hyperlegible + JetBrains Mono fonts
- Set up Tailwind config with design system colors (see `docs/DESIGN_SYSTEM.md`)
- Create CSS variable theme system for future skin swapping
- Implement `prefers-reduced-motion` media query globally
- Set up Radix UI primitives

### Task 4: Buddy Panel - System Health Dashboard
- Real-time CPU/RAM/Disk bars with color coding
- Auto-refresh on interval
- Cleanup scan button that calls `buddy_cleanup_scan`
- Collapsible panel section

### Task 5: Buddy Panel - Session History
- List sessions from `buddy_sessions`
- Expand session to see commands from `buddy_history`
- Visual indicators: green check (success), red X (failure)
- Timestamps, exit codes, working directory
- Click to expand full output

### Task 6: Buddy Panel - Command Approval Card
- When daemon suggests a command, show structured card
- Command in monospace, explanation in body font
- Three buttons: Approve / Edit / Cancel
- Calls `buddy_run` on approve
- Shows filesystem delta after execution

### Task 7: Buddy Panel - Search
- Search bar that calls `buddy_history` with query
- Results displayed as command cards
- Future: wire up sqlite-vec for semantic search

### Task 8: Terminal Pane (MVP)
- Embed xterm.js in Tauri webview as initial terminal
- Connect to system shell via Tauri's shell API
- Pipe PTY output to buddy-daemon for recording
- Split layout: terminal left (65%), buddy panel right (35%)
- Resizable divider

### Task 9: Voice Input (whisper-rs)
- Add whisper-rs to Tauri Rust backend
- Push-to-talk hotkey (RightCtrl)
- Stream transcription to chat input
- Local processing only, no cloud

### Task 10: Polish & Package
- Tauri code signing and auto-updater
- Application icon and branding
- First-run onboarding flow
- buddy.toml skin/theme configuration
- Build for Linux (primary), macOS, Windows

---

## Reference Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Architecture Design | `docs/plans/2026-02-22-terminal-buddy-architecture-design.md` | Full architecture with diagrams |
| Phase A Plan | `docs/plans/2026-02-22-phase-a-buddy-daemon-mcp-server.md` | Completed daemon build plan |
| Design System | `docs/DESIGN_SYSTEM.md` | Colors, fonts, layout, components, accessibility rules |
| Technical Reference | `docs/TECHNICAL_REFERENCE.md` | Full tech stack, dependencies, source tree, data types |
| Product Overview | `docs/TERMINAL_BUDDY_OVERVIEW.md` | Non-technical shareable overview |
| Getting Started | `docs/GETTING_STARTED.md` | User-facing guide for current state |
| Gemini Analysis | `chat-Memory Log Terminal Design.txt` | Product analysis, WezTerm embed recommendation |
| UI/UX Skill | `my-skills/skills/ui-ux-pro-max/` | Design intelligence for UI work |

---

## For the Next Agent

1. Read `docs/DESIGN_SYSTEM.md` first - it has all visual decisions locked in
2. Read `docs/TECHNICAL_REFERENCE.md` for the full tech stack and data types
3. The daemon is DONE. Don't modify it unless something breaks.
4. Start with Task 1 (Tauri scaffold) and work sequentially
5. The UI should NEVER talk to SQLite directly - always go through MCP tools
6. Use the `ui-ux-pro-max` skill for any design questions
7. Test accessibility at every step (keyboard nav, contrast, font readability)

---

*This handoff was created at 82% context usage to ensure continuity across sessions.*

# Terminal Buddy: Master Feature Blueprint

**Version:** 1.0 (Phase B - UI Construction)  
**Scope:** Core Emulator Functions + Terminal Buddy Unique Features  
**Architecture:** Tauri v2 (UI) ↔ MCP ↔ Rust Daemon (PTY)  
**Status:** 📌 PINNED SPEC - Reference for all terminal implementation

---

## 1. Core Terminal Emulation (The Engine)

*These are the non-negotiable basics. If these fail, it is not a terminal.*

| Feature | Description | Implementation Note | Status |
| :--- | :--- | :--- | :--- |
| **PTY Lifecycle** | Start, Stop, Restart, Kill session. | Daemon manages PTY; UI sends signals. | ❌ |
| **Text Rendering** | Render ANSI colors (0-255), bold, italic, underline, dim. | Use `xterm.js` with `CanvasAddon` for performance. | ✅ |
| **Cursor** | Visible block/line/underscore cursor. Blinking option. | Must be high contrast (WCAG AAA). | ✅ |
| **Scrollback** | Infinite (or configurable) scroll history buffer. | Sync scrollback with Daemon's `Memvid` storage. | ✅ |
| **Reflow** | Text wraps correctly when window resizes. | `xterm.js` handles this; ensure Daemon resizes PTY too. | ⚠️ |
| **Bell** | Visual flash (and optional sound) on `\x07`. | Accessibility: Prefer visual flash over sound. | ❌ |
| **Link Detection** | URLs in output are clickable (Ctrl+Click). | Use `WebLinksAddon`. | ✅ |
| **Working Dir** | Track current directory (OSC 7). | Needed for "Session Memory" context. | ❌ |

---

## 2. Input & Control Signals (The Keys)

*Users expect these keys to work exactly like every other terminal. Do not remap these unless explicitly requested in Settings.*

| Shortcut | Signal/Action | Description | Status |
| :--- | :--- | :--- | :--- |
| **Ctrl + C** | `SIGINT` | Interrupt current command. **(Critical)** | ❌ |
| **Ctrl + D** | `EOF` | Exit shell / Close session. | ❌ |
| **Ctrl + Z** | `SIGTSTP` | Suspend process (background). | ❌ |
| **Ctrl + L** | `Clear` | Clear screen (keep scrollback). | ❌ |
| **Ctrl + A** | `Home` | Move cursor to start of line. | ❌ |
| **Ctrl + E** | `End` | Move cursor to end of line. | ❌ |
| **Ctrl + U** | `Kill Line` | Delete from cursor to start of line. | ❌ |
| **Ctrl + K** | `Kill Line` | Delete from cursor to end of line. | ❌ |
| **Ctrl + W** | `Kill Word` | Delete previous word. | ❌ |
| **Arrow Keys** | `ANSI` | Navigate history / cursor movement. | ❌ |
| **Tab** | `Tab` | Autocomplete (shell dependent). | ❌ |
| **Shift + PgUp** | `Scroll` | Scroll buffer up. | ❌ |
| **Shift + PgDn** | `Scroll` | Scroll buffer down. | ❌ |
| **Ctrl + Shift + C** | `Copy` | Copy selected text to clipboard. | ❌ |
| **Ctrl + Shift + V** | `Paste` | Paste from clipboard to terminal. | ❌ |
| **Ctrl + Shift + F** | `Search` | Open find-in-buffer dialog. | ❌ |

---

## 3. UI Layout & Navigation (The Skin)

*Standard terminal window chrome. Must be accessible (keyboard navigable).*

| Element | Function | Accessibility Requirement | Status |
| :--- | :--- | :--- | :--- |
| **Title Bar** | Shows current session name/dir. | Draggable (Tauri default). | ⚠️ |
| **Tab Bar** | Switch between multiple sessions. | `role="tablist"`, arrow key nav. | ❌ |
| **New Tab Button** | `+` icon. Opens new shell session. | Visible focus state. | ❌ |
| **Close Tab Button** | `×` icon on each tab. | Confirm if process running? (Configurable). | ❌ |
| **Split Pane (Horiz)** | `Ctrl + Shift + D`. Split screen horizontally. | Focus moves logically between panes. | ❌ |
| **Split Pane (Vert)** | `Ctrl + Shift + H`. Split screen vertically. | Focus moves logically between panes. | ❌ |
| **Zoom Pane** | `Ctrl + Shift + X`. Maximize current pane. | Return to normal view easily. | ❌ |
| **Toolbar** | Quick access to Copy, Paste, Clear, Settings. | Icons must have `aria-label`. | ❌ |
| **Status Bar** | Shows PID, CWD, Exit Code, System Health. | High contrast, readable font. | ❌ |
| **Sidebar (Journal)** | Toggle Journal view (Terminal Buddy Unique). | Collapsible to save space. | ⚠️ |

---

## 4. Clipboard & Text Manipulation

*Handling text safely and predictably.*

| Feature | Description | Status |
| :--- | :--- | :--- |
| **Mouse Selection** | Click+Drag to select text. Double-click word. Triple-click line. | ❌ |
| **Right-Click Menu** | Context menu: Copy, Paste, Select All, Inspect Element. | ❌ |
| **Paste Protection** | Warn if pasting multi-line or sudo command (Configurable). | ❌ |
| **Trim Whitespace** | Option to trim trailing spaces when copying. | ❌ |
| **Copy as HTML/RTF** | Preserve colors when pasting outside terminal. | ❌ |
| **Search Highlight** | Highlight all matches when searching buffer. | ❌ |

---

## 5. Settings & Configuration (The "Creator Corner")

*Based on your README, this is customizable. These are the base options needed.*

| Category | Options | Status |
| :--- | :--- | :--- |
| **Appearance** | Theme (Dark/Light/High Contrast), Font Family, Font Size, Line Height, Cursor Style, Cursor Blink. | ⚠️ |
| **Behavior** | Confirm Close, Copy on Select, Click to Focus, Scroll on Output. | ❌ |
| **Shell** | Default Shell (`/bin/bash`, `/bin/zsh`, `powershell`), Login Shell, Env Variables. | ❌ |
| **Accessibility** | **Reduce Motion**, **Dyslexia Font (Atkinson)**, **Screen Reader Mode**, **High Contrast Mode**. | ⚠️ |
| **Keys** | Remap any shortcut (except core safety ones). | ❌ |
| **Profiles** | Save sets of settings (e.g., "Work", "Personal", "Low Vision"). | ❌ |

---

## 6. Accessibility (WCAG AAA - Non-Negotiable)

*Per your README, this is the foundation. Not an addon.*

| Feature | Requirement | Status |
| :--- | :--- | :--- |
| **Focus States** | Every interactive element must have a visible focus ring (2px+). | ⚠️ |
| **Keyboard Nav** | Full navigation without mouse (Tab, Shift+Tab, Arrows, Enter, Escape). | ⚠️ |
| **Color Contrast** | Text vs Background must be ≥ 7:1 (AAA). | ✅ |
| **Font Legibility** | Default to **Atkinson Hyperlegible**. Distinguish `0/O`, `1/l/I`. | ⚠️ |
| **Screen Reader** | ARIA labels on all buttons. Live regions for terminal output (`aria-live="polite"`). | ❌ |
| **Reduced Motion** | Respect `prefers-reduced-motion`. No flashing animations. | ⚠️ |
| **Error Identification** | Errors must be identified in text, not just color (e.g., icon + red text). | ⚠️ |

---

## 7. Terminal Buddy Unique Features (The "Brain")

*These are your differentiators. They must integrate seamlessly with the basics above.*

| Feature | Function | Integration Point | Status |
| :--- | :--- | :--- | :--- |
| **Journal View** | Timeline of commands, not just scrollback. | Sidebar toggle. Clicking a journal entry loads context. | ⚠️ |
| **Explain Button** | One-click explanation of last command/error. | Appears in UI when exit code ≠ 0. | ❌ |
| **Voice Input** | Speak commands instead of typing. | Mic icon in toolbar. Uses `whisper-rs`. | ❌ |
| **Session Memory** | Auto-save sessions with tags/topics. | Daemon handles storage; UI displays tags. | ⚠️ |
| **System Health** | CPU/Ram/Disk widget. | Status bar or Sidebar widget. | ❌ |
| **Cleanup Scan** | Suggest files to delete. | Modal dialog triggered by Health widget. | ❌ |
| **Re-run Command** | Click to execute a past command again. | Journal card action button. | ❌ |
| **Note Taking** | Attach text notes to specific commands. | Journal card action button. | ❌ |

---

## 8. Implementation Checklist (Tauri + React + xterm.js)

*For your developers. Use this to tick off tasks.*

### Core Setup
- [ ] **Setup xterm.js:** Install `@xterm/xterm`, `@xterm/addon-fit`, `@xterm/addon-web-links`, `@xterm/addon-search`, `@xterm/addon-canvas`
- [ ] **Tauri Window:** Configure `tauri.conf.json` for resizable window, hidden title bar (custom UI), or native title bar
- [ ] **PTY Bridge:** Ensure Rust Daemon sends `stdout` → React Component → `term.write()`
- [ ] **Input Bridge:** Ensure React Component `term.onData()` → Rust Daemon → `pty.write()`
- [ ] **Resize Handler:** Window resize event → `fitAddon.fit()` → Send new rows/cols to Daemon

### Input & Control
- [ ] **Clipboard:** Use Tauri Clipboard API (`@tauri-apps/plugin-clipboard-manager`) for secure copy/paste
- [ ] **Shortcuts:** Use `react-hotkeys-hook` or similar, but ensure they don't conflict with xterm.js built-ins
- [ ] **Ctrl+C:** Send SIGINT to shell process
- [ ] **Ctrl+L:** Clear terminal screen
- [ ] **Arrow Keys:** Command history navigation

### Accessibility
- [ ] **Accessibility Audit:** Run `axe-core` on the UI. Test with VoiceOver/NVDA
- [ ] **Focus Rings:** 2px+ visible focus on all interactive elements
- [ ] **ARIA Labels:** All buttons have descriptive labels
- [ ] **Live Regions:** Terminal output uses `aria-live="polite"`
- [ ] **Reduced Motion:** Respect `prefers-reduced-motion`

### Performance & Reliability
- [ ] **Performance:** Ensure rendering stays at 60fps even with heavy output (use `CanvasAddon`)
- [ ] **Error Handling:** If Daemon crashes, UI shows friendly "Reconnect" button, not white screen
- [ ] **Memory Management:** Clean up terminal instances on unmount

---

## Priority Legend

| Symbol | Priority | Meaning |
| :--- | :--- | :--- |
| ✅ | Done | Fully implemented and working |
| ⚠️ | Partial | Implemented but incomplete/buggy |
| ❌ | Missing | Not implemented |

---

## How to Use This Blueprint

1. **Pin it:** This document is the single source of truth for terminal features
2. **Reference it:** When building the UI, check off items in Section 8
3. **Defend it:** If anyone asks "Why do we need a clear button?", point to **Section 2 (Ctrl+L)** and **Section 3 (Toolbar)**. It is standard expectation.
4. **Prioritize:**
   - **P0 (Must Have):** Sections 1, 2, 6 (Core, Keys, A11y)
   - **P1 (Should Have):** Sections 3, 4, 5 (UI, Clipboard, Settings)
   - **P2 (Unique Value):** Section 7 (Journal, Voice, Explain)

---

**You are building something new, but the foundation must be rock-solid. This list ensures the foundation is standard, so you can focus on the innovation (Journal/Memory).**

# Terminal Implementation — Reality Check

**Date:** 2026-02-24  
**Problem:** Terminal UI exists but doesn't work (no PTY backend)  
**Solution:** Follow the blueprint, implement in priority order

---

## What's Working ✅

- xterm.js rendering (colors, cursor, scrollback)
- UI component (TerminalPane.tsx)
- Theme (WCAG AAA compliant)
- Web links addon (clickable URLs)

---

## What's Broken ❌

| Issue | Why It Matters | Fix |
|-------|---------------|-----|
| **No PTY backend** | Can't run actual commands | Add `pty` crate to daemon, spawn shell |
| **Ctrl+C doesn't work** | Can't cancel commands | Handle in xterm.js → send SIGINT via MCP |
| **No Clear button** | Basic terminal hygiene | Add toolbar with Clear action |
| **No Copy/Paste** | Can't move text in/out | Use Tauri clipboard API |
| **Working dir hardcoded** | Session memory broken | Track OSC 7 or shell prompts |
| **No keyboard shortcuts** | Muscle memory fails | Implement standard bindings |

---

## The Spec (Pinned)

**`docs/specs/SPEC_TERMINAL_FEATURES.md`** — Complete feature list with:
- Core terminal emulation (ANSI, cursor, scrollback)
- Input/control signals (Ctrl+C, Ctrl+L, arrows, etc.)
- UI layout (toolbar, tabs, splits, status bar)
- Clipboard handling
- Accessibility (WCAG AAA)
- Terminal Buddy unique features (Journal, Explain, Voice)

**If it's not in the spec, it's not being built.**

---

## Implementation Order (P0 First)

### P0 — Terminal Doesn't Work Without These
1. **PTY Integration** — Spawn actual shell (bash/zsh)
2. **Input/Output Bridge** — xterm.js ↔ MCP ↔ daemon
3. **Ctrl+C** — Send SIGINT
4. **Copy/Paste** — Ctrl+Shift+C/V
5. **Clear** — Ctrl+L + toolbar button

### P1 — Usability
1. Working directory tracking
2. Command history (Up/Down arrows)
3. Toolbar (Clear, Copy, Paste, Split)
4. Keyboard shortcuts (all standard bindings)
5. Resize handling (window → PTY)

### P2 — Polish
1. Tabs (multiple sessions)
2. Split panes
3. Search scrollback
4. Status bar (PID, CWD, exit code)
5. Mouse click-to-focus

---

## Code to Write

### 1. Daemon Side (Rust)

```rust
// buddy-daemon/src/terminal.rs
use ptyprocess::PtyProcess;
use std::sync::{Arc, Mutex};

pub struct TerminalSession {
    id: Uuid,
    pty: PtyProcess,
    shell: String,
    cwd: String,
}

impl TerminalSession {
    pub fn spawn(shell: &str, cwd: &str) -> Result<Self> {
        let pty = PtyProcess::new(shell, cwd)?;
        Ok(Self {
            id: Uuid::new_v4(),
            pty,
            shell: shell.to_string(),
            cwd: cwd.to_string(),
        })
    }
    
    pub fn write(&mut self, input: &[u8]) -> Result<()> {
        self.pty.write(input)
    }
    
    pub fn resize(&mut self, cols: u16, rows: u16) -> Result<()> {
        self.pty.resize(cols, rows)
    }
    
    pub fn kill(&mut self) -> Result<()> {
        self.pty.kill()
    }
}
```

### 2. Tauri Commands (Rust)

```rust
// buddy-daemon/src/main.rs
#[tauri::command]
fn terminal_spawn(shell: String, cwd: String) -> Result<String, String> {
    let session = TerminalSession::spawn(&shell, &cwd)?;
    SESSIONS.lock().unwrap().insert(session.id, session);
    Ok(session.id.to_string())
}

#[tauri::command]
fn terminal_write(session_id: String, input: String) -> Result<(), String> {
    SESSIONS.lock().unwrap()
        .get_mut(&session_id)
        .ok_or("Session not found")?
        .write(input.as_bytes())?;
    Ok(())
}

#[tauri::command]
fn terminal_resize(session_id: String, cols: u16, rows: u16) -> Result<(), String> {
    SESSIONS.lock().unwrap()
        .get_mut(&session_id)
        .ok_or("Session not found")?
        .resize(cols, rows)?;
    Ok(())
}
```

### 3. UI Side (React)

```tsx
// TerminalPane.tsx - Fix input handling
term.onData((data) => {
  // Send to daemon via Tauri
  invoke('terminal_write', { sessionId, input: data });
});

// Handle resize
const resize = () => {
  const { cols, rows } = fitAddonRef.current!.terminal;
  invoke('terminal_resize', { sessionId, cols, rows });
};
```

---

## Dependencies to Add

```toml
# buddy-daemon/Cargo.toml
[dependencies]
ptyprocess = "0.3"
nix = { version = "0.27", features = ["term", "poll"] }
```

```json
// buddy-app/package.json
{
  "dependencies": {
    "@xterm/xterm": "^5.3.0",
    "@xterm/addon-fit": "^0.8.0",
    "@xterm/addon-web-links": "^0.9.0",
    "@xterm/addon-search": "^0.12.0",
    "@xterm/addon-canvas": "^0.4.0",
    "@tauri-apps/plugin-clipboard-manager": "^2.0.0"
  }
}
```

---

## Testing Checklist

After implementation, verify:

- [ ] Open terminal, type `ls` → see output
- [ ] Press Ctrl+C during `sleep 10` → cancels
- [ ] Press Ctrl+L → screen clears
- [ ] Select text, Ctrl+Shift+C → copies
- [ ] Ctrl+Shift+V → pastes
- [ ] Resize window → text reflows
- [ ] Run `vim` → works (full PTY)
- [ ] Run `top` → updates (real-time output)
- [ ] Press Up arrow → command history

---

## When Done

Terminal will:
1. ✅ Spawn actual shell
2. ✅ Execute commands
3. ✅ Handle all standard shortcuts
4. ✅ Copy/paste properly
5. ✅ Clear screen
6. ✅ Track working directory
7. ✅ Support all ANSI escape sequences

**Then** we add Journal, Explain, Voice, etc.

---

**Bottom line:** The blueprint is done. The spec is pinned. Just follow it.

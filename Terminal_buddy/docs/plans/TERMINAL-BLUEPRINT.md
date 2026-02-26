# Terminal Buddy - Terminal Emulator Blueprint

> **Based on:** xterm, VT100, ANSI specs + modern terminals (Alacritty, WezTerm, Kitty)  
> **Date:** 2026-02-24  
> **Status:** Implementation Plan

---

## Essential Terminal Components

### 1. Core Terminal Features (Non-Negotiable)

| Feature | Status | Priority | Implementation |
|---------|--------|----------|----------------|
| **PTY (Pseudo Terminal)** | ❌ Missing | P0 | Use `pty` crate, spawn shell properly |
| **ANSI Escape Sequences** | ⚠️ Partial | P0 | xterm.js handles this ✅ |
| **Cursor Control** | ❌ Missing | P0 | Move cursor, hide/show, blink |
| **Scrollback Buffer** | ✅ 10k lines | P0 | xterm.js built-in |
| **TrueColor (24-bit)** | ✅ Supported | P0 | Theme has 256 colors |
| **Font Ligatures** | ⚠️ Config | P1 | JetBrains Mono supports |
| **Unicode/Emoji** | ✅ Supported | P0 | xterm.js handles |
| **Mouse Support** | ❌ Missing | P1 | Click to focus, drag select |
| **Copy/Paste** | ❌ Missing | P0 | Ctrl+Shift+C/V, OSC 52 |
| **Clear Screen** | ❌ Missing | P0 | `Ctrl+L` or Clear button |
| **Working Directory** | ⚠️ Hardcoded | P0 | Track actual shell dir |

---

### 2. UI Components (What Users See)

```
┌────────────────────────────────────────────────────────────┐
│  [📖 Journal]  [✨ Creator]  [🛠️ Workshop]    [🔍] [⚙️]   │ ← Top Bar
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─ Timeline ──────────────────────────────────────────┐   │
│  │                                                      │   │
│  │  ──── February 24, 2026 ────                        │   │
│  │                                                      │   │
│  │  ┌─ Fix CI Pipeline ─────────────────────────────┐  │   │
│  │  │ 9:18 AM · $ npm install                    ✓  │  │   │
│  │  │ [💡 Explain] [📝 Note] [🔄 Re-run]           │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─ Terminal ───────────────────────────────────────────┐   │
│  │ 🚀 Terminal Buddy                              [─][□][×]│ ← Terminal Header
│  │ ────────────────────────────────────────────────────   │
│  │ 📁 ~/projects/Terminal_buddy                           │ ← Working Dir
│  │                                                         │
│  │ $ npm install                                           │
│  │ added 123 packages in 2.3s                              │
│  │                                                         │
│  │ $ _                                                      │ ← Cursor
│  │                                                         │
│  │ [Clear] [Copy] [Paste] [Split] [Settings]              │ ← Toolbar
│  └──────────────────────────────────────────────────────────┘
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

### 3. Terminal Toolbar (Critical Actions)

| Button | Icon | Action | Shortcut |
|--------|------|--------|----------|
| **Clear** | 🗑️ | Clear screen, keep scrollback | `Ctrl+L` |
| **Copy** | 📋 | Copy selected text | `Ctrl+Shift+C` |
| **Paste** | 📌 | Paste from clipboard | `Ctrl+Shift+V` |
| **Split Horizontal** | ⬌ | Split pane horizontally | `Ctrl+Shift+H` |
| **Split Vertical** | ⬍ | Split pane vertically | `Ctrl+Shift+V` |
| **New Tab** | ➕ | New shell session | `Ctrl+Shift+T` |
| **Search** | 🔍 | Search scrollback | `Ctrl+Shift+F` |
| **Settings** | ⚙️ | Terminal preferences | `Ctrl+,` |

---

### 4. Shell Integration (What's Actually Running)

**Current Problem:** Terminal is not connected to a real shell!

**Solution:** Spawn actual shell process via PTY:

```rust
// buddy-daemon/src/pty.rs
use ptyprocess::PtyProcess;
use std::io::{Read, Write};

pub struct TerminalSession {
    pty: PtyProcess,
    reader: std::thread::JoinHandle<()>,
}

impl TerminalSession {
    pub fn new(shell: &str, working_dir: &str) -> Result<Self> {
        let mut pty = PtyProcess::new(shell, working_dir)?;
        
        // Spawn reader thread (stdout → UI)
        let reader = {
            let mut reader = pty.get_reader();
            std::thread::spawn(move || {
                let mut buf = [0u8; 4096];
                loop {
                    if let Ok(n) = reader.read(&mut buf) {
                        if n == 0 { break; }
                        // Send to UI via channel
                    }
                }
            })
        };
        
        Ok(Self { pty, reader })
    }
    
    pub fn write(&mut self, input: &[u8]) -> Result<()> {
        self.pty.write(input)
    }
    
    pub fn resize(&mut self, cols: u16, rows: u16) -> Result<()> {
        self.pty.resize(cols, rows)
    }
}
```

---

### 5. Input Handling (Keyboard)

| Key | Action |
|-----|--------|
| `Enter` (`\r`) | Execute command |
| `Backspace` (`\x7F`) | Delete char left |
| `Delete` | Delete char right |
| `Ctrl+C` | Send SIGINT (cancel) |
| `Ctrl+D` | Send EOF (exit shell) |
| `Ctrl+L` | Clear screen |
| `Ctrl+U` | Clear line |
| `Ctrl+K` | Clear to end of line |
| `Ctrl+A` / `Home` | Move to line start |
| `Ctrl+E` / `End` | Move to line end |
| `Ctrl+W` | Delete word |
| `Alt+B` | Move back word |
| `Alt+F` | Move forward word |
| `Up/Down` | Command history |
| `Left/Right` | Move cursor |

---

### 6. Visual Design (Terminal-Specific)

#### Dimensions
- **Font Size:** 14-16px (configurable)
- **Line Height:** 1.4 (monospace)
- **Cell Size:** `font_size * 1.4` height, `font_size * 0.6` width
- **Padding:** 8px around terminal
- **Scrollback:** 10,000 lines minimum

#### Colors (ANSI 256 + TrueColor)
```css
/* Terminal-specific theme */
.terminal {
  --term-black: #1E293B;
  --term-red: #EF4444;
  --term-green: #22C55E;
  --term-yellow: #F59E0B;
  --term-blue: #3B82F6;
  --term-magenta: #8B5CF6;
  --term-cyan: #06B6D4;
  --term-white: #F1F5F9;
  --term-bright-black: #475569;
  --term-bright-red: #F87171;
  --term-bright-green: #4ADE80;
  --term-bright-yellow: #FBBF24;
  --term-bright-blue: #60A5FA;
  --term-bright-magenta: #A78BFA;
  --term-bright-cyan: #22D3EE;
  --term-bright-white: #FFFFFF;
}
```

---

### 7. Performance Requirements

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Input Latency** | <16ms (60 FPS) | ❌ Unknown | Need benchmark |
| **Scroll Performance** | 60 FPS | ❌ Unknown | Need benchmark |
| **Memory Usage** | <100MB idle | ❌ Unknown | Need benchmark |
| **Startup Time** | <2s | ❌ Unknown | Need benchmark |
| **Render Rate** | 60 FPS | ❌ Unknown | Need benchmark |

---

### 8. Missing Features (Priority Order)

**P0 (Must Have - Terminal is Broken Without):**
1. ✅ PTY integration (spawn real shell)
2. ✅ Copy/Paste (Ctrl+Shift+C/V)
3. ✅ Clear screen (Ctrl+L + button)
4. ✅ Working directory tracking
5. ✅ Command history (Up/Down arrows)

**P1 (Should Have - Usability):**
1. Split panes (horizontal/vertical)
2. Tabs (multiple sessions)
3. Search scrollback
4. Mouse click-to-focus
5. URL clickable links (OSC 8)

**P2 (Nice to Have - Polish):**
1. Ligatures
2. Sixel graphics
3. GPU acceleration
4. Transparency
5. Background images

---

### 9. Implementation Plan

#### Phase 1: Fix Core Terminal (1-2 hours)
```bash
# 1. Add PTY dependency
cd terminal-buddy/buddy-daemon
cargo add ptyprocess
cargo add nix  # for process control

# 2. Create pty.rs module
# 3. Expose Tauri commands:
#    - terminal_spawn(shell: String, cwd: String)
#    - terminal_write(session_id: String, input: String)
#    - terminal_resize(session_id: String, cols: u16, rows: u16)
#    - terminal_kill(session_id: String)
```

#### Phase 2: UI Toolbar (30 min)
```tsx
// Add to TerminalPane.tsx
<TerminalToolbar
  onClear={() => term.clear()}
  onCopy={() => navigator.clipboard.writeText(term.getSelection())}
  onPaste={async () => term.paste(await navigator.clipboard.readText())}
  onSplitH={() => /* split horizontal */}
  onSplitV={() => /* split vertical */}
/>
```

#### Phase 3: Keyboard Shortcuts (30 min)
```tsx
// Global keyboard handler
useShortcuts({
  'ctrl+l': () => term.clear(),
  'ctrl+shift+c': () => copySelection(),
  'ctrl+shift+v': () => pasteFromClipboard(),
  'ctrl+shift+t': () => newTab(),
});
```

---

### 10. Reference Implementations

| Terminal | Language | What to Copy |
|----------|----------|--------------|
| **Alacritty** | Rust | GPU rendering, minimal design |
| **WezTerm** | Rust | PTY handling, tabs, splits |
| **Kitty** | Python/C | Graphics protocol, kittens |
| **Ghostty** | Zig | Modern architecture, SIMD |
| **Warp** | Rust | Input handling, blocks |

**GitHub Repos to Study:**
- https://github.com/alacritty/alacritty
- https://github.com/wez/wezterm
- https://github.com/kovidgoyal/kitty
- https://github.com/ghostty-org/ghostty

---

## Next Steps

1. **Stop Tauri dev** (it's broken anyway)
2. **Add PTY support** to daemon
3. **Fix TerminalPane.tsx** with real shell connection
4. **Add toolbar** with Clear/Copy/Paste buttons
5. **Test with actual commands**

**This is the blueprint. No more guessing.**

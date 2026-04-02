# Design References — UI/UX Research for Task 5/6

**Status:** Ready for Sally to create 3 design options  
**Last Updated:** 2025-01-27

---

## FOUND REFERENCES

### ✅ VS Code — Theme System
**Type:** Customization/Theme Systems  
**URL:** https://code.visualstudio.com/docs/getstarted/themes

**Key Pattern:**
- `Ctrl+K Ctrl+T` opens live-preview theme picker (arrow keys preview without applying)
- `workbench.colorCustomizations` for granular UI color overrides
- OS-aware auto-switching (light/dark/high contrast detection)
- Theme-specific overrides using `[ThemeName]` syntax
- Extension marketplace integration for theme discovery

**Why It Matters for Task 5/6:**
Shows how to make theme selection feel instant and reversible. The live preview pattern removes fear of "messing up" settings. The JSON configuration approach gives power users control while the GUI picker serves casual users.

**Screenshot:** See report.html or source files

---

### ✅ tmux — Pane Layout System
**Type:** Modular/Resizable Panels  
**URL:** https://github.com/tmux/tmux/wiki/Getting-Started

**Key Pattern:**
- **5 Preset Layouts:** even-horizontal, even-vertical, main-horizontal, main-vertical, tiled
- **Zoom Mode:** `Ctrl+B Z` toggles single pane fullscreen (perfect for focus)
- **Mouse + Keyboard:** Resize via drag or arrow keys
- **Session/Window/Pane Hierarchy:** Persistent workspaces with detachable sessions

**Why It Matters for Task 5/6:**
The 5 preset layouts cover 95% of use cases without overwhelming users. The zoom feature is crucial for accessibility — users can focus on one task without losing their overall layout. The prefix-key pattern (`Ctrl+B`) keeps shortcuts organized.

**Screenshot:** See source files

---

### ✅ Atkinson Hyperlegible Font Family
**Type:** Accessibility-First Design  
**URL:** https://www.brailleinstitute.org/freefont/

**Key Pattern:**
- **3 Variants:** Regular (2019), Next (2025 - variable weights), Mono (for code/terminals)
- **Design Focus:** Letterform distinction (B/8, O/0, I/l/1 are clearly different)
- **Recognition:** Fast Company Innovation Award, Cooper Hewitt Smithsonian collection
- **Free:** Personal and commercial use

**Why It Matters for Task 5/6:**
The Mono variant is PERFECT for terminal/data display panels. Designed specifically for low vision but benefits everyone (reduces eye strain). The variable weight system (Next) allows fine-tuning without switching fonts.

**Screenshot:** Available on Braille Institute site

---

### ✅ kitty — GPU Terminal
**Type:** Rich Terminal UX  
**URL:** https://sw.kovidgoyal.net/kitty/

**Key Pattern:**
- **GPU Acceleration:** Smooth rendering even with heavy output
- **Images in Terminal:** `icat` kitten displays images/GIFs inline
- **Window Management:** Tabs + splits + layouts + broadcast mode
- **Interactive Themes:** `kitten themes` for live theme browsing
- **Remote Control:** Scriptable via remote control protocol

**Why It Matters for Task 5/6:**
Shows how terminal UX can be modern and visual (not just text). The image display capability could be relevant for data visualization. The theme system demonstrates how to make customization discoverable.

**Screenshot:** See kitty documentation

---

### ✅ Alacritty — Minimal Terminal
**Type:** Rich Terminal UX  
**URL:** https://github.com/alacritty/alacritty

**Key Pattern:**
- **Sensible Defaults:** Works immediately, no config required
- **TOML Configuration:** Modern, readable config format
- **Performance Focus:** "Fastest terminal emulator" goal
- **XDG Compliance:** Standard config paths

**Why It Matters for Task 5/6:**
Demonstrates the "minimal" design philosophy — everything works out of the box, customization is additive. The TOML format is more readable than JSON for non-technical users.

---

### ✅ Grafana — Dashboard Architecture
**Type:** Real-Time Data Display  
**URL:** https://grafana.com/

**Key Pattern:**
- **Panel System:** Independent visualization units (graphs, gauges, tables, logs)
- **Time Controls:** Drag-to-zoom, auto-refresh (5s intervals), multiple time zones
- **Variables:** Dynamic filtering without rebuilding dashboards
- **Layout Grid:** Responsive, draggable panels

**Why It Matters for Task 6 (Split Panes):**
The panel architecture is exactly what you need for split-pane data display. Each panel is self-contained but shares time context. The zoom/pan interactions are industry standard for time-series data.

**Screenshot:** See report.html

---

### ✅ bottom (btm) — System Monitor
**Type:** Real-Time Data Display  
**URL:** https://github.com/ClementTsang/bottom

**Key Pattern:**
- **Widget System:** CPU, RAM, Network, Disk, Temps, Battery as separate widgets
- **Time Zoom:** Zoom in/out on graphs to inspect time ranges
- **Themes:** Built-in themes (Gruvbox, etc.) + custom configs
- **Cross-Platform:** Linux, macOS, Windows

**Why It Matters for Task 6:**
Shows how to display multiple metrics in a terminal-constrained space. The widget layout system (arrange, resize, show/hide) maps directly to panel management needs.

---

### ✅ Notion — Sidebar Patterns
**Type:** Modular/Resizable Panels  
**URL:** https://www.notion.com/help/navigate-with-the-sidebar

**Key Pattern:**
- **Resizable Width:** Drag right edge to resize
- **Focus Mode:** `Cmd/Ctrl + \` toggles sidebar visibility
- **Collapsible Sections:** Teamspaces expand/collapse
- **Workspace Switcher:** Click workspace name to switch contexts

**Why It Matters for Task 5/6:**
The focus mode shortcut is an accessibility win — instant declutter. The resizable sidebar pattern is expected behavior now. Collapsible sections prevent information overload.

---

### ✅ Slack — Sidebar Customization
**Type:** Modular/Resizable Panels  
**URL:** https://slack.com/help/articles/212596808-Adjust-your-sidebar-preferences

**Key Pattern:**
- **Custom Sections:** Organize channels/DMs/apps into user-defined groups
- **Preferences:** Choose what appears at top of sidebar
- **Sorting Options:** Alphabetical, unread first, etc.

**Why It Matters for Task 5/6:**
Shows how to balance structure (default organization) with user control (custom sections). The "choose what appears at top" pattern lets users prioritize what matters to them.

---

### ✅ iTerm2 — Terminal Features
**Type:** Rich Terminal UX  
**URL:** https://iterm2.com/

**Key Pattern:**
- **Split Panes:** Horizontal/vertical splits with drag-to-resize
- **Hotkey Window:** Quake-style dropdown terminal (global shortcut)
- **Search:** Regex support in scrollback
- **Instant Replay:** Rewind terminal output

**Why It Matters for Task 5/6:**
The split pane implementation is polished and intuitive. The hotkey window shows how to make a tool instantly accessible without breaking workflow.

---

## ALREADY COLLECTED (From Previous)

### ✅ Anti-Gravity
**Type:** Side nav + components  
**Status:** Previously collected  
**Use for:** Option 1 (Minimal & Clean) inspiration

### ✅ system-monitor-server
**Type:** Metrics visualization  
**Status:** Previously collected  
**Use for:** Option 2 (Rich & Accessible) data viz patterns

### ✅ rich-master
**Type:** Typography  
**Status:** Previously collected  
**Use for:** Option 2 (Rich & Accessible) font handling

### ✅ nvim/yazi/atuin/ez-stack
**Type:** Terminal patterns  
**Status:** Previously collected  
**Use for:** Terminal UX reference, keyboard navigation

---

## FOR SALLY: 3 Design Directions

### Option 1: Minimal & Clean
**Inspired by:** Anti-Gravity minimalism + Alacritty "sensible defaults"  
**Fonts:** Single monospace (Cascadia Code, SF Mono, or Atkinson Mono)  
**Panels:** Collapsed by default, click to expand, no resize handles visible until hover  
**Themes:** Light/Dark only (2 presets, auto-detect OS)  
**Configuration:** TOML file for power users, minimal GUI  
**Best for:** Power users, screen real estate focused, "just works" philosophy

**Key References:**
- Alacritty (sensible defaults)
- Anti-Gravity (minimal components)
- nvim (keyboard-first)

---

### Option 2: Rich & Accessible
**Inspired by:** rich-master typography + Atkinson fonts + system-monitor-server viz  
**Fonts:** 
- Primary: Atkinson Hyperlegible Next (variable weights)
- Terminal/Code: Atkinson Hyperlegible Mono
- UI: Atkinson Hyperlegible Regular
**Panels:** Visible by default, clearly labeled, collapsible with animation  
**Themes:** High Contrast + Light + Dark (3 presets)  
**Customization:**
- Font size slider (14px-24px)
- Bold/italic toggles per context
- Letter-spacing adjustment
- Line-height options
**Best for:** Accessibility-first, neurodiverse users, readable at distance, inclusivity

**Key References:**
- Atkinson Hyperlegible fonts (Braille Institute)
- rich-master (typography patterns)
- system-monitor-server (data viz)

---

### Option 3: Modular & Extensible
**Inspired by:** VS Code customization + Slack sidebar + tmux layouts  
**Fonts:** Variable font system (choose family, weight 100-900, width, size)  
**Panels:**
- 5 preset layouts (tmux style: even-horizontal, even-vertical, main-horizontal, main-vertical, tiled)
- Drag to reorder
- Resize with visible handles
- Hide/show individually
- **Zoom mode:** Focus on single panel (fullscreen toggle)
**Themes:**
- Full color picker
- Preset library (12+ curated themes)
- Import/export custom themes
- Community theme sharing
**Settings:**
- Save custom layout presets
- Shareable configs (JSON/TOML)
- Per-workspace layouts
**Best for:** Creators, people who like to customize, multi-monitor setups

**Key References:**
- VS Code (theme system, customization)
- tmux (5 preset layouts, zoom mode)
- Slack (sidebar customization)
- Grafana (panel architecture)
- kitty (extensibility)

---

## Design Decision Flow

```
┌──────────────────────────────┐
│ Here are 3 directions:       │
│ 1. Minimal                   │
│ 2. Accessible                │
│ 3. Modular                   │
└────────────────┬─────────────┘
                 │
        ✅ (You Pick)
                 │
    ┌────────────┼────────────┐
    │            │            │
   "Pick 1"   "Blend       "Try a
             these"       different
                          direction"
    │            │            │
    ✅          ✅            ↻
   Build       Build      (Sally creates
              adjusted    new option)
```

**Light touch. Your call. No BS.**

---

## References Location

- **This file:** `/home/dylaroo/Documents/research-ui-references/DESIGN_REFERENCES.md`
- **Full research:** `/home/dylaroo/Documents/research-ui-references/report.html`
- **PDF version:** `/home/dylaroo/Documents/research-ui-references/report.pdf`
- **Source files:** Referenced sites (VS Code docs, tmux wiki, etc.)

---

## Next Steps

1. ✅ **Done:** Research gathered
2. ✅ **Done:** Formatted using template
3. ⏳ **Sally:** Create 3 design options based on references above
4. ⏳ **You:** Pick direction (or blend, or iterate)
5. ⏳ **Build:** Start implementation

**Ready for Sally to work her magic!** 🎨

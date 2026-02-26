# Terminal Buddy: Power User Edition — Feature Priorities

> **Target User:** Experienced developer, 10+ years, lives in terminal, wants speed + history + correlation
> **Design Principle:** Dense, fast, keyboard-first, zero friction

---

## Priority Matrix

```
                    HIGH IMPACT
                        │
    ┌───────────────────┼───────────────────┐
    │   MVP CORE        │   KILLER FEATURES │
    │   (Build First)   │   (Differentiate) │
    │                   │                   │
    │  • Fast search    │  • System         │
    │  • Session list   │    correlation    │
    │  • Command replay │  • Timeline canvas│
    │  • Raw output     │  • Diff view      │
    │                   │                   │
────┼───────────────────┼───────────────────┼──── LOW EFFORT
    │                   │                   │
    │   NICE TO HAVE    │   MOON SHOTS      │
    │   (Later)         │   (Future)        │
    │                   │                   │
    │  • Themes         │  • AI predictions │
    │  • Custom keybinds│  • Auto-fix       │
    │  • Export formats │  • Team sync      │
    │                   │                   │
    └───────────────────┼───────────────────┘
                        │
                    LOW IMPACT
```

---

## MVP CORE — Build First (Week 1-2)

### 1. **Blazing Fast Search** 🔥
**Priority:** P0 — Absolute must-have

**What:**
- Full-text search across ALL sessions
- Fuzzy matching (search "dockr cntnr" → finds "docker container")
- Filter by: date, exit code, directory, duration
- Regex support for power users
- Instant results as you type (<50ms)

**Why:**
- This is THE core value prop
- Power users lose time finding old commands
- Existing tools (history, fzf) don't have context

**Daemon Support:** ✅ `buddy_history` already exists

**UI Requirements:**
- Single keystroke to open (`Cmd/Ctrl+K`)
- Overlay panel, doesn't navigate away
- Keyboard navigation (arrow keys, Enter to select)
- Show: command, timestamp, exit code, directory
- Preview output on hover

**Effort:** Low (daemon exists, need UI)

---

### 2. **Session Timeline (List View)** 📋
**Priority:** P0 — Core navigation

**What:**
- Chronological list of all sessions
- Group by: Today, Yesterday, This Week, Older
- Each session shows: start time, command count, duration, working directory
- Click to expand session details
- Keyboard shortcuts: `j/k` navigation, `Enter` to open

**Why:**
- Users need to browse history visually
- Context switching awareness ("what was I doing Tuesday?")
- Foundation for all other features

**Daemon Support:** ✅ `buddy_sessions` already exists

**UI Requirements:**
- Dense layout (3-4 lines per session max)
- Collapsible groups
- Badge for sessions with errors
- Show git branch if in repo

**Effort:** Low (daemon exists, need UI)

---

### 3. **Command Replay** ⚡
**Priority:** P0 — Instant value

**What:**
- Re-run any historical command with one key
- Option to edit before running
- Copy to clipboard
- Run in new session or current

**Why:**
- Massive time saver
- "That deploy command from last week"
- Reduces cognitive load (don't need to remember)

**Daemon Support:** ✅ `buddy_run` exists

**UI Requirements:**
- `R` to replay from search results
- `E` to edit then run
- `C` to copy to clipboard
- Toast notification when copied

**Effort:** Low (daemon exists, wiring)

---

### 4. **Raw Output View** 📄
**Priority:** P0 — Power user preference

**What:**
- Show full stdout/stderr without simplification
- Collapsible sections for long output
- Syntax highlighting for known formats (JSON, SQL, stack traces)
- Copy button for entire output or selection

**Why:**
- Power users want the real thing
- No "command cards" or simplified views
- They know how to read terminal output

**UI Requirements:**
- Monospace font (JetBrains Mono, Fira Code)
- Collapsible long output (>100 lines)
- Auto-detect JSON, SQL, stack traces
- Click-drag to select + copy

**Effort:** Low (pure UI)

---

## KILLER FEATURES — Differentiate (Week 3-5)

### 5. **System Correlation Engine** 🧠
**Priority:** P1 — This is the magic

**What:**
- Show what changed on the system after each command:
  - Files created/modified/deleted
  - New processes started
  - System log entries
  - Network connections opened
- Correlate errors across sessions
- "Show me everything that changed before this broke"

**Why:**
- No other tool does this
- Debugging superpower
- Answers "what did I change?" instantly

**Daemon Support:** 🟡 Partial (filesystem watcher exists, needs enhancement)

**UI Requirements:**
- Side panel showing file changes
- Color-coded: green (created), yellow (modified), red (deleted)
- Click file to see diff
- Timeline view with system events

**Effort:** High (daemon work + UI)

---

### 6. **Visual Timeline Canvas** 🎨
**Priority:** P1 — "Futuristic" factor

**What:**
- Zoomable timeline of all activity
- See sessions as blocks on a time axis
- Color by: project (directory), success/failure, duration
- Drag to select time range
- Filter by project, date, command type

**Why:**
- Visual pattern recognition
- "I was working on auth all last week"
- Feels cutting-edge
- Memvid integration (already in project!)

**Daemon Support:** 🟡 Memvid exists, needs integration

**UI Requirements:**
- Canvas-based rendering (not DOM)
- Pinch to zoom, drag to pan
- Hover for session preview
- Click to open session
- Filter chips at top

**Effort:** High (Memvid SDK + UI)

---

### 7. **File Diff View** 🔀
**Priority:** P1 — Debugging superpower

**What:**
- See exactly what changed on disk after a command
- Side-by-side diff (before/after)
- For: config files, source code, dotfiles
- Integration with `git diff` for repos

**Why:**
- "What did that migration script change?"
- Audit trail for compliance
- Undo mental model ("reverse that change")

**Daemon Support:** ❌ Needs new daemon tool

**UI Requirements:**
- Diff viewer component (like GitHub diff)
- Toggle: all files / only changed / only text
- Click file to expand diff
- Copy diff button

**Effort:** Medium-High (new daemon feature + UI)

---

## NICE TO HAVE — Later (Week 6+)

### 8. **Themes & Customization** 🎨
**Priority:** P2

- Dark mode variants (Gruvbox, Dracula, Nord)
- Font selection
- Density settings (compact/comfortable)
- Layout presets

**Effort:** Low (CSS vars already exist)

---

### 9. **Custom Keybindings** ⌨️
**Priority:** P2

- Remap all shortcuts
- Vim mode (j/k navigation standard)
- Emacs mode
- Profiles (export/import)

**Effort:** Medium (need keybinding system)

---

### 10. **Export Formats** 📤
**Priority:** P2

- Export session as: Markdown, PDF, JSON
- Share with team
- Include: commands, output, timestamps, file changes
- Redact sensitive data option

**Effort:** Medium (export logic)

---

### 11. **Project Auto-Detection** 📁
**Priority:** P2

- Auto-group sessions by git repo
- Show project dashboard
- "Last 10 sessions in this repo"
- Project-specific history

**Effort:** Medium (git detection + grouping)

---

## MOON SHOTS — Future (Months)

### 12. **AI Predictions** 🔮
**Priority:** P3 — Experimental

- "You're running a migration, want me to back up first?"
- "This command looks like it'll delete files, confirm?"
- Auto-suggest fixes for common errors
- Pattern detection ("you always run X after Y")

**Daemon Support:** ❌ Needs ML/prediction layer

**Effort:** Very High

---

### 13. **Auto-Fix Suggestions** 🛠️
**Priority:** P3

- Error → known fix mapping
- "This error usually means X, try: [suggested command]"
- One-click apply fix
- Learn from community patterns

**Daemon Support:** 🟡 `buddy_explain` exists, needs enhancement

**Effort:** High

---

### 14. **Team Sync** 👥
**Priority:** P3

- Shared team history (opt-in)
- "How did Sarah deploy last time?"
- Team command templates
- Onboarding playbooks

**Daemon Support:** ❌ Needs multi-user architecture

**Effort:** Very High (multi-user + sync + permissions)

---

## Build Order Recommendation

### Phase 1: MVP (Week 1-2)
1. Fast search overlay
2. Session timeline list
3. Command replay
4. Raw output view

**Goal:** Usable product with core value prop

---

### Phase 2: Killer Features (Week 3-5)
5. System correlation (file changes)
6. Visual timeline canvas
7. File diff view

**Goal:** Differentiate from every other tool

---

### Phase 3: Polish (Week 6-7)
8. Themes
9. Keybindings
10. Export
11. Project detection

**Goal:** Feel complete and polished

---

### Phase 4: Moon Shots (Later)
12-14. AI features, team sync

**Goal:** Push boundaries of what's possible

---

## What Exists Already (Terminal Buddy Daemon)

| Feature | Daemon Tool | Status |
|---------|-------------|--------|
| Search | `buddy_history` | ✅ Ready |
| Sessions | `buddy_sessions` | ✅ Ready |
| Run commands | `buddy_run` | ✅ Ready |
| Explain | `buddy_explain` | ✅ Ready |
| System health | `buddy_system_health` | ✅ Ready |
| Filesystem watch | (partial) | 🟡 Needs work |
| File diffs | ❌ | Not built |
| Correlation | (partial) | 🟡 Needs work |

---

## UI Components Needed (New)

| Component | Priority | Complexity |
|-----------|----------|------------|
| SearchOverlay | P0 | Low |
| SessionList | P0 | Low |
| CommandCard (raw mode) | P0 | Low |
| FileDiffViewer | P1 | Medium |
| TimelineCanvas | P1 | High |
| SystemChangesPanel | P1 | Medium |
| ThemeSelector | P2 | Low |
| KeybindingConfig | P2 | Medium |
| ExportDialog | P2 | Low |

---

## Success Metrics

### MVP Success (Phase 1)
- [ ] Search returns results in <50ms
- [ ] Can replay any historical command
- [ ] Can find "that docker command from 3 weeks ago"
- [ ] Power user can navigate entirely with keyboard

### Killer Feature Success (Phase 2)
- [ ] User can see what files changed after a command
- [ ] Visual timeline shows patterns at a glance
- [ ] Can diff before/after for any session

### Polish Success (Phase 3)
- [ ] Themes feel premium
- [ ] Keybindings are muscle memory
- [ ] Export is shareable

---

## Next Steps

1. **Pick Phase 1 features** to start with
2. **Design the search overlay** — what should it look like?
3. **Design the session list** — dense, keyboard-first
4. **Wire up replay** — connect to `buddy_run`

**What do you want to build first?**

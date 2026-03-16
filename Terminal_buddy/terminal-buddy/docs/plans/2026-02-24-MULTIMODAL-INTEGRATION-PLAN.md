# Multimodal Integration Plan

**Date:** 2026-02-24  
**Status:** Planning → Implementation  
**Priority:** P0 (Core Vision)

---

## Vision Summary

Terminal Buddy is a **dual-layer command center**:

### Layer 1: Interaction (Terminal Pane)
- Standard terminal functions (PTY I/O, Ctrl+C, copy/paste)
- Ephemeral - clears when session ends
- Powered by xterm.js + Tauri

### Layer 2: Memory (Journal Pane)
- Persistent command history with context
- Searchable, explainable, annotatable
- Powered by buddy-daemon + SQLite + Memvid

### Multimodal Features Bridge Both Layers:
- 🎙️ **Voice** → Executes in terminal, logs to journal
- 👁️ **Visual pop-ups** → Explain errors, show context
- 🧩 **Modular panels** → Arrange both layers your way
- 🎨 **Color-coded topics** → Organize journal visually

**Key insight:** You're not rebuilding a terminal. You're building a **time-traveling, self-explaining journal that *also* runs commands**.

See: `docs/architecture/MEMORY-LAYER-ARCHITECTURE.md`

---

## Implementation Status

### ✅ Phase 1: Foundation (COMPLETE)

| Component | Status | Files |
|-----------|--------|-------|
| PTY Terminal | ✅ Complete | `TerminalV2.tsx`, `terminal.rs` |
| Journal Timeline | ✅ Complete | `JournalWhiteboard.tsx`, `CommandCard.tsx` |
| Modular Panels | ✅ Complete | `Panel.tsx`, `PanelManager.tsx` |
| Search View | ✅ Complete | `SearchView.tsx` |
| Design System | ✅ Complete | `DESIGN_SYSTEM_V2.md`, `App.css` |

### 🟡 Phase 2: Multimodal Features (CURRENT)

| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Mouse Wheel Scrolling | P0 | ⬜ Not Started | Both terminal + journal panes |
| Voice Command MVP | P0 | ⬜ Not Started | whisper-rs integration |
| Color-Coded Topics | P1 | ⬜ Not Started | Topic groups with icons |
| Visual Pop-ups/Toasts | P1 | ⬜ Not Started | Non-blocking notifications |
| Panel Drag-and-Drop | P1 | ⬜ Not Started | react-grid-layout |
| System Health Widget | P2 | ⬜ Not Started | CPU/RAM/Disk status bar |
| Explanation Pop-ups | P2 | ⬜ Not Started | Card expansion (not modal) |

### ⬜ Phase 3: Creator Corner (FUTURE)

| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| Layout Templates | P2 | ⬜ Not Started | Save/load panel layouts |
| Voice Widget Styles | P3 | ⬜ Not Started | Icon vs. waveform |
| Custom Color Palettes | P3 | ⬜ Not Started | User-defined topic colors |
| Template Marketplace | P3 | ⬜ Not Started | Share layouts |

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Tauri App Window                        │
├─────────────────────────────────────────────────────────────┤
│  Title Bar: [Session Name]              [Mic] [Health] [⚙️] │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┬─────────────────────────────────────────┐ │
│  │              │                                         │ │
│  │   Journal    │           Terminal Pane                 │ │
│  │   Pane       │           (xterm.js)                    │ │
│  │   (Timeline) │                                         │ │
│  │              │                                         │ │
│  ├──────────────┤                                         │ │
│  │   Search     │                                         │ │
│  │   Panel      │                                         │ │
│  │              │                                         │ │
│  └──────────────┴─────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Status Bar: [CWD] [PID] [Exit Code] [CPU 12%] [RAM 4.2GB] │
└─────────────────────────────────────────────────────────────┘
```

**All panels are:**
- Show/Hide toggleable
- Minimizable
- Draggable (future)
- Keyboard navigable

---

## Next Implementation Steps

### Step 1: Mouse Wheel Scrolling (P0 - 1-2 hours)

**Why first:** Basic interaction, blocks testing everything else.

**Files to modify:**
- `TerminalV2.tsx` - Already works (xterm.js native)
- `JournalWhiteboard.tsx` - Add `onWheel` handler
- `Panel.tsx` - Ensure `overflowY: 'auto'`

**Acceptance criteria:**
- [ ] Mouse wheel scrolls journal pane smoothly
- [ ] Mouse wheel scrolls terminal buffer
- [ ] Scroll position persists when switching topics
- [ ] `Shift + PgUp/PgDn` works in both panes
- [ ] Scrollbar visible, draggable, high-contrast

---

### Step 2: Voice Command MVP (P0 - 2-3 days)

**Why second:** Core differentiator, mentioned in README.

**Architecture:**
```
User speaks → whisper-rs (Daemon) → Text → MCP → Tauri → Terminal
```

**Files to create:**
- `buddy-daemon/src/voice/mod.rs` - Whisper-rs wrapper
- `buddy-daemon/src/voice/listener.rs` - Continuous listening loop
- `buddy-app/src/hooks/useVoice.ts` - React hook for voice state
- `buddy-app/src/components/VoiceWidget.tsx` - Mic button + visual feedback

**Tauri commands:**
- `voice_start_listening()` - Begin capture
- `voice_stop_listening()` - Stop capture
- `voice_get_status()` - Ready/Listening/Error

**Acceptance criteria:**
- [ ] Mic icon in title bar
- [ ] Push-to-talk (hold Space) or wake word
- [ ] Live transcription bubble near cursor
- [ ] Command executes after recognition
- [ ] Visual feedback (pulse when listening)
- [ ] Privacy mode toggle (mic off)

---

### Step 3: Color-Coded Topics (P1 - 1-2 days)

**Why third:** Organizes journal visually, high user value.

**Files to modify:**
- `buddy-daemon/src/memory/topics.rs` - Auto-detect topics
- `buddy-app/src/components/TopicsView.tsx` - Replace placeholder
- `buddy-app/src/components/CommandCard.tsx` - Add colored left border

**Color mapping (default):**
| Color | Topic | Icon |
|-------|-------|------|
| Blue | Backend | `⚙️` |
| Green | DevOps | `🚀` |
| Purple | Frontend | `🎨` |
| Orange | Git | `📦` |
| Red | Bugfix | `🐛` |
| Cyan | Database | `🗄️` |

**Acceptance criteria:**
- [ ] Sessions auto-grouped by topic
- [ ] Each topic has color + icon (not color-only)
- [ ] Click topic to filter journal
- [ ] Manual topic assignment override
- [ ] Colorblind-safe palette

---

### Step 4: Visual Pop-ups & Toasts (P1 - 1-2 days)

**Why fourth:** Non-blocking feedback improves UX.

**Files to create:**
- `buddy-app/src/components/ToastProvider.tsx` - Toast notifications
- `buddy-app/src/components/ExplanationCard.tsx` - Expandable explanation
- `buddy-app/src/hooks/useToast.ts` - Toast hook

**Toast types:**
| Type | Duration | Example |
|------|----------|---------|
| Success | 2s | "Copied to clipboard" |
| Error | 5s | "Command failed with exit code 1" |
| Warning | 5s | "This deletes 500 files" |
| Info | 3s | "Session saved" |

**Acceptance criteria:**
- [ ] Toast appears bottom-right (configurable position)
- [ ] Auto-dismisses (configurable duration)
- [ ] Respects `prefers-reduced-motion` (fade, no slide)
- [ ] Explanation expands inline (not modal)
- [ ] Focus trap when explanation open

---

### Step 5: Panel Drag-and-Drop (P1 - 2-3 days)

**Why fifth:** Creator Corner foundation.

**Dependencies:**
```bash
npm install react-grid-layout
```

**Files to modify:**
- `App.tsx` - Grid layout wrapper
- `Panel.tsx` - Draggable handles
- `buddy-app/src/state/layout.ts` - Store layout state

**Acceptance criteria:**
- [ ] Drag panels to reorder
- [ ] Resize panels (drag edges)
- [ ] Save layout to config
- [ ] Reset to default button
- [ ] Keyboard navigation (arrow keys to move)

---

## Accessibility Checklist (WCAG AAA)

Every feature above must pass:

- [ ] **Color contrast ≥ 7:1** (foreground vs background)
- [ ] **Focus states visible** (2px+ outline)
- [ ] **Keyboard navigable** (Tab, Enter, Escape)
- [ ] **Screen reader labels** (aria-label on all buttons)
- [ ] **Reduced motion support** (`prefers-reduced-motion`)
- [ ] **Color independence** (icons + color, not color-only)
- [ ] **44px touch targets** (for touch screens)

---

## Testing Strategy

### Manual Testing Checklist

For each feature:

1. **Mouse interaction** - Does it work with mouse?
2. **Keyboard interaction** - Can I do it without a mouse?
3. **Screen reader** - Does NVDA/VoiceOver announce it correctly?
4. **Reduced motion** - Does it respect the setting?
5. **High contrast** - Is it readable in high contrast mode?

### Automated Testing

```bash
# Run accessibility audit
npm run axe

# Run TypeScript checks
npm run build

# Run Rust tests
cd buddy-daemon && cargo test
```

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Build time | < 15s | `npm run build` + `cargo build` |
| Input latency | < 16ms (60fps) | React DevTools profiler |
| Scroll FPS | 60fps | Chrome DevTools Performance tab |
| Voice recognition | > 95% accuracy | Manual test with 20 commands |
| Accessibility score | 100/100 | Lighthouse + axe-core |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| whisper-rs performance | High | Use quantized models, cache results |
| Drag-and-drop complexity | Medium | Start with react-grid-layout (don't build custom) |
| Color topic auto-detection | Medium | Start with manual assignment, add ML later |
| Voice privacy concerns | High | Document "100% local" clearly, no cloud fallback |

---

## Open Questions

1. **Wake word vs push-to-talk:** Which is default? (Recommendation: Push-to-talk default, wake word optional)
2. **Topic auto-detection:** Rule-based or ML-based? (Recommendation: Start rule-based on command names)
3. **Layout storage:** SQLite or TOML config? (Recommendation: SQLite for multiple layouts, TOML for default)

---

## Next Action

**Start with Step 1: Mouse Wheel Scrolling** (1-2 hours)

This unblocks testing all other features and is a prerequisite for good UX.

**After completion, move to Step 2: Voice Command MVP** (2-3 days)

This is the core differentiator mentioned in the README.

---

*This plan integrates:*
- *SPEC_TERMINAL_FEATURESfeb24.md (terminal foundation)*
- *Voice/Visual/Modularity blueprint (multimodal features)*
- *PROJECT_STATUS.md (current state)*
- *README.md (vision)*

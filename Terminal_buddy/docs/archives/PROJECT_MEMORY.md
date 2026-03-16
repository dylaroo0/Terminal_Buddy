# Project Memory

**Created:** 2026-02-24  
**Purpose:** Never forget what we've built or what's next  
**Update:** End of every day

---

## 🎯 What We're Building

**Terminal Buddy** - A session history for your terminal that explains itself.

> "A second brain for everything you've ever done in a shell."

---

## ✅ What We've Built (Don't Forget)

### Phase A: Buddy Daemon (COMPLETE)
- ✅ MCP server with 7 tools
- ✅ Memvid .mv2 storage format
- ✅ Correlation engine (command + filesystem + system logs)
- ✅ Session classification
- ✅ SQLite database

### Phase B: Desktop App (IN PROGRESS)

**Completed Tasks:**
- ✅ **Task 1:** Tauri v2 + React scaffold
- ✅ **Task 2:** MCP connection (Tauri → Daemon)
- ✅ **Task 3:** Design System v2 (CSS variables, fonts, Radix UI)
- ✅ **Task 4:** Session Timeline view (live data, date grouping)
- ✅ **Task 7:** Onboarding wizard (3-step, API key validation)
- ✅ **Task 8:** Terminal Pane (xterm.js, collapsible)
- ✅ **Modular Panel System:** Resizable panels with drag handles

**Key Features Working:**
- Session history with real data from daemon
- Command cards with Explain/Re-run/Add Note
- Collapsible terminal at bottom
- Theme system with CSS variables
- Onboarding flow

---

## 🚧 What We're Building Next

### This Week (Feb 24-28)

**Priority 1: Task 5 - Topics View**
- Group sessions by auto-detected subject
- Collapsible topic folders
- Rename/re-tag functionality
- **ETA:** 2-3 days
- **Status:** ⬜ NOT STARTED

**Priority 2: Task 6 - Search View**
- Semantic search across all sessions
- Memvid Canvas integration
- Date and topic filters
- **ETA:** 2-3 days
- **Status:** ⬜ NOT STARTED

### Next Week (Mar 1-7)

**Priority 3: Task 9 - Voice Input**
- Push-to-talk (RightCtrl)
- whisper-rs in daemon
- Local processing
- **ETA:** 3-4 days
- **Status:** ⬜ NOT STARTED

**Priority 4: Task 10 - Creator Corner MVP**
- Theme editor (fonts, colors, spacing)
- Layout editor (drag-and-drop)
- Template save/load
- **ETA:** 3-4 days
- **Status:** 🟡 STARTED (mock UI exists)

---

## 🔒 Key Decisions (Locked - Don't Change)

### Architecture
- **Daemon is DONE** - Don't modify unless fixing a bug
- **UI never talks to SQLite directly** - Always via MCP tools
- **Three surfaces, one brain:** Tauri app, MCP App (iframe), VS Code extension
- **Module system:** All features are registrable modules

### Design
- **Session-first paradigm** - Journal is primary, terminal embedded
- **Fonts:** Atkinson Hyperlegible + JetBrains Mono (NOT Inter, NOT Lexend)
- **Accessibility:** WCAG AAA, dyslexia-friendly defaults
- **CSS variables:** 50+ custom properties for theming

### Product
- **Free tier:** Core accessibility features never gated
- **Pro ($8/mo):** LLM features, advanced search, custom themes
- **Enterprise ($20/seat):** SSO, audit logs, team sync

---

## 📦 Module System

**Core Modules (Required):**
1. **Session** (`session`) - Timeline, Topics, Search views
2. **Terminal Pane** (`terminal-pane`) - xterm.js emulator
3. **Creator Corner** (`creator-corner`) - Customization engine
4. **Component Registry** (`component-registry`) - Module management

**Planned Modules:**
5. Voice Input (`voice-input`)
6. Theme System (`theme-system`)
7. Onboarding (`onboarding`)
8. MCP App (`mcp-app`)
9. System Health (`system-health`)

**Documentation:** `docs/modules/MODULES.md`

---

## 🎨 Design System

**Colors:**
- Background: `#0F172A` (dark, OLED-friendly)
- Text: `#F0F0F0` (high contrast)
- Accent: TBD

**Fonts:**
- UI: Atkinson Hyperlegible (18px default)
- Code: JetBrains Mono (14px default)
- Accessible: OpenDyslexic (optional)

**CSS Variables:** 50+ properties in `DESIGN_SYSTEM_V2.md`

---

## 🔧 Current Tech Stack

**Frontend:**
- Tauri v2
- React 18+
- TypeScript
- Radix UI
- Tailwind CSS
- xterm.js

**Backend:**
- Rust (buddy-daemon)
- MCP protocol (stdio)
- SQLite + Memvid .mv2
- whisper-rs (planned)

**Tools:**
- Storybook (component dev)
- Vitest (testing)

---

## 📊 Current Status

| Area | Status | Next Step |
|------|--------|-----------|
| Daemon | ✅ COMPLETE | Don't touch |
| App Shell | ✅ COMPLETE | Add more modules |
| Session Timeline | ✅ COMPLETE | Task 5: Topics |
| Terminal Pane | ✅ COMPLETE | Enhance later |
| Onboarding | ✅ COMPLETE | Test with users |
| Topics View | ⬜ TODO | START THIS |
| Search View | ⬜ TODO | After Topics |
| Voice Input | ⬜ TODO | After Search |
| Creator Corner | 🟡 STARTED | Finish MVP |

---

## 🚧 Current Blockers

**None!** We're unblocked and ready to build.

---

## ❓ Open Questions

### Need Answers Soon:
1. Who is the UX Lead? (Human or AI agent)
2. Who is the Dev Lead? (Human or AI agent)
3. Who maintains documentation?
4. Should we use BMAD agents for team roles?

### Design Decisions Pending:
1. Topics view grouping algorithm (heuristic vs LLM)
2. Search ranking factors
3. Creator Corner template sharing mechanism

### Technical Decisions Pending:
1. Voice push-to-talk keybinding (default: RightCtrl)
2. TTS provider options (local vs ElevenLabs vs Quen)
3. Module lazy-loading strategy

---

## 📅 Recent Accomplishments

### Today (2026-02-24)
- Created comprehensive module documentation (4 docs)
- Organized docs/modules/ folder
- Corrected "Journal" to "Session" terminology
- Created DOCUMENT_ORGANIZATION_PLAN.md

### Yesterday (2026-02-23)
- Terminal Pane V2 complete
- Modular panel system working
- Resizable panels with drag handles

### This Week
- Design System v2 finalized
- Onboarding wizard complete
- Session Timeline with live data

---

## 📚 Essential Documents (Read These First)

1. **WHERE_WE_ARE.md** - Project orientation
2. **PRODUCT_SPEC_V2.md** - Product specification
3. **DESIGN_SYSTEM_V2.md** - Design reference
4. **MODULES.md** - Module documentation
5. **DOCS_INDEX.md** - Full document index

---

## 🔄 Daily Update Checklist

End each day, update this file:
- [ ] What did we build today?
- [ ] What's blocked?
- [ ] What's tomorrow's priority?
- [ ] Any new decisions made?
- [ ] Archive old session logs (keep last 3 days)

---

*Last updated: 2026-02-24*  
*Next update: End of day tomorrow*

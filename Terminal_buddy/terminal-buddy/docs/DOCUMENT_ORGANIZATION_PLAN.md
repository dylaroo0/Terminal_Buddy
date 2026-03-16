# Document Organization Plan

**Created:** 2026-02-24  
**Priority:** CRITICAL  
**Status:** READY TO IMPLEMENT

---

## The Problem

You're right - we have:
- ✅ **Too many documents** scattered across the project
- ✅ **No clear organization** for what to read first
- ✅ **Missing memory/context** about what's been decided
- ✅ **No prioritization** of what to build first
- ✅ **Document teams needed** but not yet organized

---

## The Solution: 3-Layer System

### Layer 1: CORE DOCS (Read These First)
**Purpose:** Single source of truth. What you need to know RIGHT NOW.

| Document | Location | Owner | Priority |
|----------|----------|-------|----------|
| **WHERE_WE_ARE.md** | `docs/WHERE_WE_ARE.md` | You | 🔴 READ FIRST |
| **Product Spec v2** | `docs/specs/PRODUCT_SPEC_V2.md` | Product Team | 🔴 ESSENTIAL |
| **Phase B Tasks** | `DOCS_INDEX.md` (bottom section) | You | 🔴 ESSENTIAL |
| **Design System v2** | `docs/design/DESIGN_SYSTEM_V2.md` | UX Team | 🟡 IMPORTANT |
| **Module Docs** | `docs/modules/MODULES.md` | Dev Team | 🟡 IMPORTANT |

**Rule:** If it's not in this list, you don't need it for current work.

---

### Layer 2: WORKING DOCS (Active Development)
**Purpose:** Current work in progress. Updated daily.

#### Specs (Being Written)
- [ ] `docs/specs/SPEC_VOICE_INPUT.md` - Voice input spec
- [ ] `docs/specs/SPEC_ONBOARDING.md` - Onboarding flow spec
- [ ] `docs/specs/SPEC_CREATOR_CORNER.md` - Creator Corner spec

#### Plans (Active Tasks)
- [ ] `docs/plans/TASK-5-TOPICS.md` - Topics view implementation
- [ ] `docs/plans/TASK-6-SEARCH.md` - Search view implementation
- [ ] `docs/plans/TASK-9-VOICE.md` - Voice input implementation
- [ ] `docs/plans/TASK-10-CREATOR-CORNER.md` - Creator Corner implementation

#### Architecture (Being Designed)
- [ ] `docs/architecture/MEMORY-CONTEXT.md` - Memory context system
- [ ] `docs/architecture/MODULE-SYSTEM.md` - Module registry system
- [ ] `docs/architecture/THEME-SYSTEM.md` - CSS variable theme system

---

### Layer 3: REFERENCE DOCS (As Needed)
**Purpose:** Historical context, detailed references, session logs.

#### References (Read When Needed)
- `docs/references/REF_MEMVID_CANVAS_SDK.md` - Memvid integration
- `docs/modules/*.md` - Module documentation (4 docs)
- `docs/guides/GETTING_STARTED.md` - User guide

#### Session Logs (Historical)
- `docs/logs/2026-02-24_*.md` - Today's sessions
- `docs/logs/2026-02-22_*.md` - Phase B planning sessions
- `docs/historical/` - Archived/superseded docs

---

## Immediate Actions (This Week)

### 1. Create Document Teams 📋

**You need 3 people (or AI agents) for these roles:**

| Role | Responsibility | Who |
|------|---------------|-----|
| **Product Owner** | Maintains Product Spec, prioritizes tasks | You |
| **UX Lead** | Design system, onboarding, Creator Corner | _To assign_ |
| **Dev Lead** | Module docs, architecture, implementation | _To assign_ |
| **Doc Keeper** | Organizes docs, archives old, updates index | _To assign_ |

**Action:** Assign these roles (can be AI agents for now).

---

### 2. Archive Old Documents 🗄️

**Move these to `docs/archive/`:**

```bash
# Voice-hud folder (old voice experiments)
mv docs/voice-hud/ docs/archive/voice-hud-2026-02/

# Old session logs (keep only last 3 days)
mv docs/logs/2026-02-22_* docs/archive/logs/february-22/
mv docs/logs/2026-02-23_* docs/archive/logs/february-23/

# Historical duplicates
mv docs/historical/* docs/archive/historical/

# Old requirements
mv docs/requirements/ docs/archive/requirements-february/

# Architecture docs (merge into one)
mv docs/architecture/* docs/archive/architecture-drafts/
```

**Keep only:**
- Last 3 days of session logs
- Current active specs
- Module docs (these are good)

---

### 3. Create Memory/Context System 🧠

**You asked for this specifically.** Here's the system:

#### A. Project Memory File
**Location:** `docs/PROJECT_MEMORY.md`

**Contents:**
```markdown
# Project Memory

## What We've Built (Don't Forget)
- ✅ Phase A: Buddy Daemon with 7 MCP tools
- ✅ Phase B Tasks 1-4: Scaffold, MCP connection, Design System, Timeline
- ✅ Phase B Tasks 7-8: Onboarding, Terminal Pane

## What We're Building Next
- ⬜ Task 5: Topics view
- ⬜ Task 6: Search view
- ⬜ Task 9: Voice input
- ⬜ Task 10: Creator Corner

## Key Decisions (Locked)
- Journal-first paradigm (now called Session)
- Atkinson Hyperlegible + JetBrains Mono fonts
- Daemon never modified unless bug fix
- UI never talks to SQLite directly (always via MCP)

## Current Blockers
- None right now!

## Open Questions
- Who will be UX Lead?
- Who will be Dev Lead?
```

#### B. Context Files Per Module
**Location:** `docs/modules/[module]/CONTEXT.md`

Each module gets a context file with:
- What it does (1 sentence)
- Current status
- Next steps
- Who's working on it

#### C. Daily Context Capture
**Location:** `docs/logs/YYYY-MM-DD_CONTEXT.md`

End each day with:
```markdown
## What We Did Today
- Completed X
- Started Y
- Blocked on Z

## What's Next Tomorrow
- Finish Y
- Start A
- Unblock Z

## Decisions Made
- Decision 1
- Decision 2
```

---

### 4. Build Priority List 🎯

**What to build first (in order):**

### Week 1 (Feb 24-28): Foundation
```
✅ DONE: Task 1 - Scaffold Tauri v2
✅ DONE: Task 2 - MCP connection
✅ DONE: Task 3 - Design System
✅ DONE: Task 4 - Timeline view
✅ DONE: Task 7 - Onboarding
✅ DONE: Task 8 - Terminal Pane

⬜ NEXT: Task 5 - Topics view (2-3 days)
⬜ THEN: Task 6 - Search view (2-3 days)
```

### Week 2 (Mar 1-7): Enhanced Features
```
⬜ Task 9 - Voice input (3-4 days)
⬜ Task 10 - Creator Corner MVP (3-4 days)
```

### Week 3 (Mar 8-14): Polish
```
⬜ Task 11 - Polish & Package (5 days)
```

---

## Document Workflow

### How to Add a New Document

1. **Ask:** Is this in Layer 1, 2, or 3?
2. **If Layer 1:** Must be approved by you
3. **If Layer 2:** Create in correct folder, add to DOCS_INDEX
4. **If Layer 3:** Create, no approval needed

### How to Archive a Document

1. **Check:** Has this been superseded?
2. **Check:** Is this older than 7 days?
3. **If yes to either:** Move to `docs/archive/YYYY-MM/`
4. **Update:** DOCS_INDEX.md to mark as archived

### Daily Doc Maintenance

**End of day checklist:**
- [ ] Update PROJECT_MEMORY.md with today's progress
- [ ] Move old session logs to archive (keep last 3 days)
- [ ] Update DOCS_INDEX.md if anything changed
- [ ] Create tomorrow's context file

---

## Folder Structure (Final)

```
Terminal_buddy/
├── DOCS_INDEX.md              ← Main entry point
├── docs/
│   ├── WHERE_WE_ARE.md        ← START HERE
│   ├── PROJECT_MEMORY.md      ← Memory/context (NEW)
│   │
│   ├── specs/                 ← Product specs (Layer 1)
│   │   ├── PRODUCT_SPEC_V2.md ← THE spec
│   │   └── SPEC_*.md          ← Feature specs
│   │
│   ├── modules/               ← Module docs (Layer 1)
│   │   ├── MODULES.md         ← Index
│   │   ├── session-module.md
│   │   ├── terminal-pane-module.md
│   │   ├── creator-corner-module.md
│   │   └── component-registry-module.md
│   │
│   ├── design/                ← Design system (Layer 1)
│   │   ├── DESIGN_SYSTEM_V2.md
│   │   └── TECHNICAL_REFERENCE.md
│   │
│   ├── plans/                 ← Active plans (Layer 2)
│   │   ├── TASK-5-TOPICS.md
│   │   ├── TASK-6-SEARCH.md
│   │   └── *.md
│   │
│   ├── architecture/          ← Architecture (Layer 2)
│   │   └── *.md
│   │
│   ├── guides/                ← User guides (Layer 3)
│   │   └── *.md
│   │
│   ├── references/            ← References (Layer 3)
│   │   └── *.md
│   │
│   ├── logs/                  ← Session logs (Layer 3)
│   │   └── YYYY-MM-DD_*.md    ← Keep last 3 days only
│   │
│   └── archive/               ← Archived docs
│       ├── logs/
│       ├── historical/
│       └── YYYY-MM/
```

---

## Next Steps (In Order)

1. **✅ TODAY:** Create PROJECT_MEMORY.md
2. **✅ TODAY:** Archive old documents (voice-hud, old logs)
3. **✅ TODAY:** Update DOCS_INDEX.md with this plan
4. **⬜ TOMORROW:** Assign document team roles
5. **⬜ THIS WEEK:** Create Task 5 & 6 plans
6. **⬜ THIS WEEK:** Implement Topics view (Task 5)
7. **⬜ NEXT WEEK:** Implement Search view (Task 6)

---

## Questions to Answer

Before we proceed, you need to decide:

1. **Who is UX Lead?** (Human or AI agent)
2. **Who is Dev Lead?** (Human or AI agent)
3. **Who is Doc Keeper?** (Can be you for now)
4. **What AI agents should be on the team?** (BMAD agents?)

---

*This plan addresses your concerns about organization, memory/context, and prioritization. Start with the "Immediate Actions" section.*

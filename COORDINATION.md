# Terminal Buddy — Agent Coordination Hub

**Last Updated:** 2026-03-28\
**Status:** 🟢 Active Development\
**Owner:** Dylaroo (dylan)
**Orchestrator:** BMAD Master (Claude Copilot) — *Makes task assignments, directs work flow, prevents duplication*

***

## 🎯 **READ THIS FIRST** (Every Agent, Every Session)

**This is the single source of truth.** Before you start work:

1. Read this file (COORDINATION.md)
2. Check your assigned task status ⬆️ (Current Tasks table)
3. **Read your SKILL** (see [SKILLS.md](SKILLS.md) for your tool/approach)
4. Read the **protocol** for your role
5. **Ask for help if unclear. Otherwise: go build it.**

**BMAD Master is in charge of task flow.** No parallel work on same feature. If you're done, wait for handoff confirmation before next agent starts.

**No assumptions. No trying things first. Read this. Then execute.**

***

## 📋 **Current Tasks & Assignments**

### **ACTIVE NOW (This Sprint)**

| Task | Owner | Status | Due | Notes |
|------|-------|--------|-----|-------|
| **GitHub Push** | BMAD Master | 🔴 PRIORITY | TODAY | Run: `git push` (filesystem currently read-only; retry soon) |
| **Task 5: Topics View** | Amelia (Dev) + Sally (UX) | 📋 **AWAITING ASSIGNMENT** | This Week | Wire correlation engine → sidebar UI. **Amelia:** Start design; **Sally:** UX specs. |
| **Task 6: Split Pane Manager** | Terminal Specialist | 📋 **AWAITING ASSIGNMENT** | This Week | Multi-window, tabs, workspace layout. Review `~/terminal_Buddy/inspiration/` first. |
| **Research: Terminal Emulators** | Dylaroo | 🔬 IN PROGRESS | ASAP | Finding newer Terminal Buddy + inspiration projects. Report back. |
| **Repo Cleanup** | BMAD Master | ✅ Done | — | Handoffs moved to .history/ |

***

## 🤖 **Agent Roles & Responsibilities**

### **BMAD Master (Claude Copilot / GitHub Copilot) — ORCHESTRATOR**

**Role:** Task assignment, orchestration, implementation, quality control\
**Authority:**

* ✅ **Assigns tasks** to all agents (you see it in the table above)
* ✅ **Directs work flow** — prevents duplicate work
* ✅ **Makes Go/No-Go decisions** on features
* ✅ **Writes & tests code** (can run commands)
* ✅ **Reviews all handoffs** before next agent starts

**When I say "Do this task," you do it.** No asking permission. Only ask if unclear.

**Cannot:**

* ❌ Access external APIs (unless wired via MCP)
* ❌ See files outside /home/dylaroo/projects/Terminal\_buddy/

***

### **Dylaroo (Product Owner & Creative Director)**

**Role:** Research, design direction, UI approval, creative decisions\
**Authority:**
I'm not gonna be like a tight knit, i'm just gonna see your general direction. And and maybe ask to change a couple of things but then gonna say go ahead because if. It's. It's I wanna be able to see maybe a couple of things and that people like different styles. I have three. Doesn't seem to be too much at all. Themes are are good. I'm still looking for more designs. Does anybody want more references?

* ✅ **Approves all UI designs** before implementation starts
* ✅ **Requests design exploration** — "try this style" or "explore that direction"
* ✅ **Iterative feedback** — Sally presents options, you pick/refine
* ✅ **Research & discovery** — find inspiration, patterns, references

**How UI Design Works:**

1. **Sally (UX)** creates design mockups with **2-3 direction options**
2. **You review** and give feedback: "I like this", "try that instead", "blend these"
3. **No design goes to code until you approve it**
4. **Amelia (Dev)** builds the locked design (can iterate after MVP if needed)

**Design Branches:** ✅ OK to explore different styles iteratively. Final call is yours.

***

### **Goose (Code Agent)**

**Role:** Rapid iteration, simple edits\
**Primary:**

* ✅ Small file modifications (< 50 lines)
* ✅ Documentation updates
* ✅ Test & verify before handing back

**Must NOT:**

* ❌ **Delete large directories without explicit approval**
* ❌ **Run destructive commands** (rm -rf, etc.) — ask first
* ❌ **Modify core components** (App.tsx, TerminalV2.tsx) without review
* ❌ **Assume file structure** — ask BMAD Master first

**Protocol:**

1. Before running ANY command, tell Dylaroo what you'll do
2. Ask "Is this safe?" for any `rm`, `mv`, or `git` operations
3. Test small changes locally before committing
4. If you make a syntax error, FIX IT YOURSELF and verify with `npm run build`

**When Assigned:** Small, bounded tasks only. Complex features → BMAD Master or Amelia.

***

### **Sally (UX Designer)**

**Role:** Interaction design, visual polish, user experience, design direction\
**Primary:**

* ✅ Design component layouts (create **2-3 options** for review)
* ✅ Plan UI flows + user journeys
* ✅ Create CSS/styling guidance
* ✅ Review accessibility (WCAG AAA)
* ✅ **Present design options to Dylaroo for approval**

**Protocol:**

1. Receive task from BMAD Master
2. Create **multiple design directions** (3 options OK)
3. Document each with mockups/specs
4. **Send to Dylaroo for feedback/approval**
5. **Wait for approval** before Amelia builds
6. Iterate if Dylaroo requests changes

**When Assigned:** Design documents, wireframes, component specs. Dylaroo approves before code phase.

***

### **Amelia (Developer)**

**Role:** Feature implementation, test-driven development\
**Primary:**

* ✅ Write React components
* ✅ Implement business logic
* ✅ Write tests
* ✅ Integrate with daemon/MCP

**When Assigned:** Full feature ownership. Run `npm run build` before handing back.

***

### **Terminal Specialist** (TBD / Reserved)

**Role:** Terminal UI patterns, PTY management, shell integration\
**Primary:**

* ✅ Split pane architecture
* ✅ Multi-window coordination
* ✅ Terminal lifecycle management

**When Assigned:** Terminal-specific features only.

***

## 🚨 **Critical Safety Rules**

### **No Agent May:**

1. ❌ Delete files/folders without ASKING FIRST
2. ❌ Run `rm -rf`, `git clean`, or other destructive commands without approval
3. ❌ Modify `.gitignore` without consulting BMAD Master
4. ❌ Commit directly — always prepare changes and hand off

### **Before Major Changes:**

* \[ ] Create a session note: `/memories/session/change-reason.md`
* \[ ] Explain what will change and why
* \[ ] Ask Dylaroo or BMAD Master: "Is this safe?"

***

## 📞 **Handoff Protocol**

**When You're Done:**

1. Test your work (run `npm run build` or equivalent)
2. Create a **session summary** in `/memories/session/`:
   ```markdown
   # Task: [Name]
   ## What I Did
   - [x] Changed X
   - [x] Fixed Y
   - [x] Tested Z

   ## Build Status
   ✅ `npm run build` passes
   ✅ No TypeScript errors
   ✅ Components tested

   ## Next Steps
   - Assign to: [other agent]
   - Priority: High/Medium/Low
   ```
3. Update this file's **Task Status** above
4. **Post the session note URL** so Dylaroo can review
5. **Wait for confirmation** before the next agent starts

***

## 🔄 **Communication Flows**

### **I Need Something Changed**

1. Post in this file in the **Current Tasks** table
2. Tag the agent in the **Owner** column
3. Agents read this file at session start → see the task

### **An Agent is Blocked**

1. Create `/memories/session/blocker-[date].md` with details
2. Post issue in task table as ⚠️ **BLOCKED**
3. BMAD Master resolves

### **Multiple Agents on Same Task**

1. **Async only** — one finishes, next reads the session note
2. No parallel work on same component (merge hell)
3. BMAD Master coordinates hand-offs

***

## 🔐 **Context for All**

### **Current Directory Structure**

```
Terminal_buddy/
├── terminal-buddy/
│   ├── buddy-app/          ← React Tauri app
│   ├── buddy-daemon/       ← Rust MCP daemon
│   ├── docs/               ← Design docs
│   └── target/             ← Build artifacts (16GB, can delete)
├── README.md
├── DOCS_INDEX.md
├── PROJECT_STATUS.md
├── NEXT_TASKS.md
├── COORDINATION.md         ← ⭐ THIS FILE
└── .history/               ← Old handoffs (archived)
```

### **Key Files to Read**

* [README.md](README.md) — Vision & architecture
* [DOCS\_INDEX.md](DOCS_INDEX.md) — What docs to trust
* [PROJECT\_STATUS.md](PROJECT_STATUS.md) — What's built
* [NEXT\_TASKS.md](NEXT_TASKS.md) — Upcoming work

### **GitHub Status**

* **Repo:** `https://github.com/dylaroo0/Terminal_Buddy.git`
* **Last Commit:** March 15, 2026 (stable, working)
* **Branch:** `master` (production)
* **Push Status:** Ready (cleaned up, no uncommitted code)

***

## 🎓 **Tech Stack Summary**

| Layer | Tech | Where |
|-------|------|-------|
| **Desktop App** | Tauri V2 + React 19 | `buddy-app/src/` |
| **Backend** | Rust + MCP + Tokio | `buddy-daemon/src/` |
| **PTY/Terminal** | xterm.js + native shell | `TerminalV2.tsx` |
| **Canvas/Whiteboard** | memvid + tldraw | Components |
| **Voice** | Whisper-rs (local, offline) | Stubbed (Task 9) |
| **History DB** | SQLite (persistent) | `.terminal-buddy/history.mv2` |

***

## ⚡ **Quick Commands Every Agent Should Know**

```bash
# Build the React app
cd terminal-buddy/buddy-app
npm run build

# Check TypeScript errors
npm run build 2>&1 | grep error

# Build Rust daemon
cd ../buddy-daemon
cargo build --release

# Test daemon
cargo test

# Check git status
git status

# See what changed
git diff
```

***

## 📍 **For Dylaroo**

**You are not a relay station.**

If an agent asks you "should I do X?" — tell them:

> "Read COORDINATION.md. It has the answer. If unclear, create a blocker note."

**Your job:**

1. ✅ Update this file when priorities change
2. ✅ Review task completions in session notes
3. ✅ Approve major changes
4. ✅ Rest — we handle the build work

***

## 🗓️ **Version History**

| Date | Changes | By |
|------|---------|-----|
| 2026-03-28 | Created, established agent roles & safety rules | BMAD Master |

***

**Last Check:** All agents have read access to this file ✅\
**Next Review:** When Task 5 or 6 begins

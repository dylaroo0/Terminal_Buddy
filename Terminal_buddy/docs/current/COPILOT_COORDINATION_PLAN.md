# 🎯 Copilot Coordination Plan

> **Created:** 2026-02-26
> **Status:** Active
> **For:** Grok (Dashboard Copilot), Qwen (BMAD Master), dylaroo (Visionary)

---

## 👥 **ROLES & RESPONSIBILITIES**

### **dylaroo (The Visionary)**
- **What You Do:** Set direction, approve designs, make decisions
- **Communication Style:** Natural conversation, whiteboard sketches
- **Current Focus:** Dashboard design, library showcase, staying involved in every step

### **Qwen Code (BMAD Master)**
- **Role:** Master Task Executor + Workflow Orchestrator
- **What I Do:** Coordinate agents, manage workflows, ensure quality, technical architecture
- **Location:** `_bmad/core/agents/bmad-master.md`
- **Skills:** BMAD Method, Superpowers skills, technical implementation
- **Current Task:** Coordinate with Grok, ensure he reads right documents, manage Dashboard build

### **Grok (Dashboard Copilot)**
- **Role:** Dashboard Master / UI/UX Specialist
- **What He Does:** Dashboard visual design, user experience, interface implementation
- **Current Priority:** System Cleanup Dashboard (Tier 1)
- **Needs:** Clear direction on what documents to read, what to build

---

## 📚 **WHAT GROK MUST READ (In Order)**

### **Priority 0: The Absolute Essentials (Read RIGHT NOW)**
| # | Document | Why | Time |
|---|----------|-----|------|
| 0a | [`README.md`](../../README.md) | **Elevator pitch** — What is Terminal Buddy, the vision, key features | 10 min |
| 0b | [`PROJECT_STATUS.md`](../../PROJECT_STATUS.md) | **Current state** — What's done (7/11 tasks), what's next, build commands | 10 min |

### **Priority 1: Essential Context (Read SECOND)**
| # | Document | Why | Time |
|---|----------|-----|------|
| 1 | [`docs/current/DECISION_CARD.md`](DECISION_CARD.md) | 3 decisions pending from dylaroo | 5 min |
| 2 | [`docs/current/DEFINITIVE_STATUS.md`](DEFINITIVE_STATUS.md) | What's actually done (Phase 1A ✅) | 10 min |
| 3 | [`docs/current/GEMINI_HANDOFF_COMPLETE.md`](GEMINI_HANDOFF_COMPLETE.md) | Complete handoff package | 10 min |
| 4 | [`HANDOFF_DOCUMENT.md`](../../HANDOFF_DOCUMENT.md) | Whiteboard integration, current state | 10 min |

### **Priority 2: Design Resources (Read SECOND)**
| # | Document | Why | Time |
|---|----------|-----|------|
| 5 | [`docs/design/DESIGN_SYSTEM_V2.md`](docs/design/DESIGN_SYSTEM_V2.md) | Canonical design system (WCAG AAA) | 15 min |
| 6 | [`docs/specs/PRODUCT_SPEC_V2.md`](docs/specs/PRODUCT_SPEC_V2.md) | Product requirements | 20 min |
| 7 | [`docs/specs/BEACON_WHITEBOARD_SPEC.md`](docs/specs/BEACON_WHITEBOARD_SPEC.md) | Whiteboard communication system | 10 min |

### **Priority 3: Technical Context (Read THIRD)**
| # | Document | Why | Time |
|---|----------|-----|------|
| 8 | [`QWEN.md`](../../QWEN.md) | Project architecture, build commands | 15 min |
| 9 | [`PROJECT_STATUS.md`](../../PROJECT_STATUS.md) | Task tracker, what's in progress | 10 min |
| 10 | [`terminal-buddy/buddy-app/src/App.tsx`](terminal-buddy/buddy-app/src/App.tsx) | Current UI implementation | 20 min |

---

## 🎯 **GROK'S FIRST TASK: System Cleanup Dashboard**

### **What We're Building**
Visual dashboard showing:
- Real-time process monitoring (CPU/RAM)
- "What can I safely delete?" recommendations
- Service management (enable/disable)
- One-click cleanup actions
- Historical trends (optional)

### **Data Source**
Already exists! Phase 1A Deep System Health provides:
```bash
$ buddy_system_health
- Top CPU/RAM processes
- Open ports with process owners
- Running/enabled systemd services
- Recently installed packages
- Boot items
```

### **Design Method: TBD (Waiting on dylaroo's decision)**
**Option A:** Whiteport sketch-to-code (dylaroo draws on whiteboard, AI converts)
**Option B:** Text-based design with Qwen guiding
**Option C:** Hybrid (sketch with Grok, Qwen adds technical details)

**Status:** ⏳ Waiting for dylaroo to decide

---

## 📋 **COMMUNICATION LOG (Living Document)**

### **2026-02-26 — Session Start**
**Participants:** dylaroo, Qwen, Grok

**What Happened:**
- dylaroo realized Grok was reading wrong documents
- Qwen assigned as copilot coordinator
- Created this coordination plan
- Whiteboard/Beacon system identified for communication

**Decisions Made:**
1. ✅ Qwen coordinates with Grok
2. ✅ Grok reads documents in priority order (above)
3. ✅ Beacon Whiteboard Spec found (`BEACON_WHITEBOARD_SPEC.md`)
4. ⏳ Dashboard design method: **PENDING dylaroo's decision**

**Action Items:**
| Who | What | Status |
|-----|------|--------|
| **dylaroo** | Decide dashboard design method (A/B/C) | ⏳ PENDING |
| **dylaroo** | Rank dashboard content priorities | ⏳ PENDING |
| **Grok** | Read Priority 1 documents (1-4) | ⏳ PENDING |
| **Qwen** | Coordinate workflow, ensure Grok stays on track | 🟡 IN PROGRESS |

---

## 🚦 **BEACON COMMUNICATION SYSTEM**

### **How We Communicate**
Instead of relying on documents being read, we use **The Beacon**:

**Location:** `_bmad-output/BEACON.json`

**Protocol:**
```json
{
  "status": "red",  // 🟢 green | 🟡 yellow | 🔴 red
  "priority": 1,    // 1 = high, 2 = medium, 3 = low
  "title": "Decision Needed",
  "content": "Brief summary",
  "timestamp": "2026-02-26T11:26:00Z",
  "beep": true
}
```

**Traffic Light Meaning:**
- 🟢 **Green:** No new notes, all good
- 🟡 **Yellow:** New informational notes (read when convenient)
- 🔴 **Red:** Action required / High priority (read NOW)

### **How to Use**
1. When Qwen or Grok needs dylaroo's attention → Update BEACON.json
2. When dylaroo has decisions → Update BEACON.json
3. Visual indicator in VS Code sidebar (future: audio beep)

**Implementation:** See `BEACON_WHITEBOARD_SPEC.md` for VS Code extension plan

---

## 🎨 **DASHBOARD DESIGN DECISIONS (Pending)**

### **Decision 1: Design Method**
How should we design the System Cleanup Dashboard?

- [ ] **A) Whiteport Sketch** — dylaroo draws on whiteboard, photo → code
- [ ] **B) Dashboard Master** — Text-based design with Qwen
- [ ] **C) Both** — Sketch layout (with Grok), Qwen technical details

**dylaroo's Choice:** ___

---

### **Decision 2: Dashboard Content Priority**
What's MOST important? (Rank top 3)

- [ ] Real-time process monitoring
- [ ] "What can I safely delete?" recommendations
- [ ] Historical trends
- [ ] One-click cleanup actions
- [ ] Phantom/orphaned resource detection
- [ ] Service management

**dylaroo's Ranking:**
1. ___
2. ___
3. ___

---

### **Decision 3: Next Feature After Dashboard**
What should we build AFTER dashboard?

- [ ] **Tier 2: Correlation Engine** — Track command → system effects
- [ ] **Tier 3: Phantom Detection** — Find orphaned resources
- [ ] **Voice Input** — whisper-rs integration
- [ ] **Creator Corner** — Template system, drag-and-drop

**dylaroo's Choice:** ___

---

## 📍 **WHERE EVERYTHING IS**

### **Project Structure**
```
Terminal_buddy/
├── docs/current/
│   ├── DECISION_CARD.md              ← 3 decisions for dylaroo
│   ├── DEFINITIVE_STATUS.md          ← What's done, what's next
│   ├── GEMINI_HANDOFF_COMPLETE.md    ← Complete handoff package
│   └── COPILOT_COORDINATION_PLAN.md  ← YOU ARE HERE
│
├── docs/design/
│   └── DESIGN_SYSTEM_V2.md           ← Canonical design system
│
├── docs/specs/
│   ├── PRODUCT_SPEC_V2.md            ← Product requirements
│   └── BEACON_WHITEBOARD_SPEC.md     ← Communication system
│
├── terminal-buddy/
│   ├── buddy-daemon/                 ← Rust daemon (Phase A ✅)
│   │   └── src/monitor/mod.rs        ← Deep System Health
│   └── buddy-app/                    ← Tauri React app (Phase B 🔧)
│       └── src/App.tsx               ← Current UI
│
├── dashboard-development-framework-main/  ← Dashboard agents
│   └── agents/
│       ├── dashboard-master.md       ← Dashboard Master agent
│       └── ui-designer.md            ← UI/UX Designer agent
│
└── whiteport-sketch-to-code-bmad-expansion-main/  ← Whiteport
    └── Method/
        └── 03-sketch-to-spec.md      ← Sketch-to-code workflow
```

---

## 🚀 **IMMEDIATE NEXT STEPS**

### **For Grok (Dashboard Copilot):**
1. ✅ **Read this document** (you're doing it now!)
2. ⏳ **Read Priority 1 docs** (DECISION_CARD, DEFINITIVE_STATUS, GEMINI_HANDOFF, HANDOFF_DOCUMENT)
3. ⏳ **Wait for dylaroo's decisions** on design method + content priorities
4. ⏳ **Once decisions made:** Start dashboard design

### **For dylaroo (Visionary):**
1. ⏳ **Decide dashboard design method** (A/B/C)
2. ⏳ **Rank dashboard content priorities** (top 3)
3. ⏳ **Share decisions** → Update BEACON.json or tell Qwen/Grok directly

### **For Qwen (BMAD Master):**
1. ✅ **Created coordination plan** — Done!
2. ⏳ **Ensure Grok reads right docs** — Monitor progress
3. ⏳ **Wait for dylaroo's decisions** — Then activate appropriate workflow
4. ⏳ **Coordinate dashboard build** — Technical architecture, integration

---

## 💬 **QUESTIONS? COMMENTS?**

### **If Grok Has Questions:**
- **About what to read:** Check Priority 1 list above
- **About what to build:** Wait for dylaroo's decisions
- **About technical details:** Ask Qwen, check `QWEN.md`

### **If dylaroo Has Questions:**
- **About the project:** Ask Qwen or Grok
- **About decisions:** Qwen can explain trade-offs
- **About design:** Grok can show examples

### **If Qwen Has Questions:**
- **About workflow:** Check `_bmad/core/agents/bmad-master.md`
- **About Superpowers:** Check `superpowers/README.md`

---

## 🎉 **LET'S MAKE SOMETHING AMAZING!**

**dylaroo** brings the vision.
**Grok** brings the UI/UX expertise.
**Qwen** brings the technical architecture.

**Together, we build Terminal Buddy.** 🚀

---

*Created: 2026-02-26 by Qwen Code — BMAD Master & Workflow Orchestrator*

*Last Updated: 2026-02-26 — Initial creation*

*Next Update: After dylaroo's decisions or Grok's document review*

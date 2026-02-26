# Genesis Report: Terminal Buddy Phase B

**Generated:** 2026-02-24  
**Protocol Version:** Genesis Forge v1.0.0-alpha.1  
**Project:** Terminal Buddy - "A journal for your terminal that explains itself"

---

## 🎯 Executive Summary

**Terminal Buddy** is a **Phase B Brownfield** project building an accessible, AI-powered terminal with journal-style history, one-click explanations, and voice input.

### Current Status

| Phase | Status | Progress |
|-------|--------|----------|
| **Phase A: The Brain** | ✅ COMPLETE | Rust daemon with 7 MCP tools working |
| **Phase B: The Skin** | 🔧 IN PROGRESS | 6/11 tasks complete (55%) |
| **Phase C: The Platform** | ⏳ PLANNED | VS Code extension, MCP App iframe |

### Critical Challenges

1. 🔴 **Terminal Pane Not Working** - Core feature blocked (HIGH severity)
2. 🔴 **Voice-to-Text Stalled** - Accessibility feature blocked (HIGH severity)
3. 🟡 **Memvid Integration Incomplete** - Timeline visualization not working (MEDIUM severity)
4. 🔴 **Creator Overwhelmed** - Too many windows, too many tasks (HIGH severity)

### Recommended Solution

**Assemble specialized team** with 3 new domain experts + 4 existing BMAD agents:
- Terminal Emulator Specialist (xterm.js + PTY)
- Voice Integration Specialist (whisper-rs + Tauri)
- Memvid Integration Specialist (Memvid Canvas SDK OR memvid-mcp)
- Existing: Architect, Developer, Scrum Master, QA

**Estimated Time:** 2-3 days focused execution

---

## 📊 Project DNA Summary

### Vision

> "A journal for your terminal that explains itself" — A searchable, explainable, accessible memory layer for everything you've ever done in a shell.

### Unique Value Proposition

**Terminal Buddy is not another terminal emulator.** It's a **second brain for your shell** — a persistent, searchable, explainable memory layer that turns every command into a learning moment.

**The Wedge (60-second moment):**  
User opens Terminal Buddy → sees session history organized by topic → clicks [Explain] on a command from last Tuesday → hears: *"This fixed the Docker port conflict by killing the old nginx process"* → 💡 *"I can never go back to a dumb terminal."*

### Tech Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| **Daemon** | Rust + MCP (rmcp) | ✅ COMPLETE |
| **Desktop App** | Tauri v2 + React 18+ | 🔧 IN PROGRESS |
| **Styling** | Tailwind CSS v4 | ✅ COMPLETE |
| **LLM** | Multi-provider (OpenRouter, Claude, Gemini) | ✅ COMPLETE |
| **Terminal** | xterm.js + portable-pty | 🔧 IN PROGRESS |
| **Voice** | whisper-rs | ⏳ NOT STARTED |
| **Memvid** | @memvid/canvas-react | ⏳ PARTIAL (imported, not integrated) |

### Working Features (12)

1. ✅ buddy_history - Full-text search
2. ✅ buddy_sessions - List sessions
3. ✅ buddy_system_health - System monitoring
4. ✅ buddy_cleanup_scan - Bloat detection
5. ✅ buddy_run - PTY execute + capture
6. ✅ buddy_ask - LLM command translation
7. ✅ buddy_explain - LLM explanations
8. ✅ Onboarding Wizard - 3-step setup
9. ✅ Journal Timeline UI - Date-grouped sessions
10. ✅ Modular Panel System - Show/hide/minimize
11. ✅ Search View - Search commands + sessions
12. ✅ Design System - WCAG AAA, 50+ CSS vars

### Incomplete Features (6)

1. 🔧 Terminal Pane V2 - PTY-backed terminal (in progress)
2. ❌ Voice Input - whisper-rs integration (not started)
3. ❌ Memvid Canvas SDK - Timeline visualization (imported, not integrated)
4. ❌ Topics View - Auto-grouping by subject (placeholder)
5. ❌ Creator Corner - Template system (architecture done)
6. ❌ Panel Drag-and-Drop - Movable panels (not implemented)

---

## 🔍 Gap Analysis

### Technical Gaps

| Gap | Severity | Impact | Recommendation |
|-----|----------|--------|----------------|
| Terminal Pane Not Working | 🔴 HIGH | Core feature blocked | Hire terminal emulator specialist |
| Voice-to-Text Stalled | 🔴 HIGH | Accessibility feature blocked | Hire voice integration specialist |
| Memvid Integration Incomplete | 🟡 MEDIUM | Timeline not working | Hire Memvid architect OR adopt memvid-mcp |
| MCP Bridge Incomplete | 🟡 MEDIUM | UI ↔ daemon communication | Frontend architect to complete |
| No Test Suite | 🟢 LOW | Manual testing only | Add after core features working |

### Resource Gaps

| Gap | Severity | Impact | Recommendation |
|-----|----------|--------|----------------|
| Terminal Emulator Expert Missing | 🔴 HIGH | Can't fix terminal pane | Create via BMAD Builder |
| Voice Integration Expert Missing | 🔴 HIGH | Can't implement voice | Create via BMAD Builder |
| Memvid Architect Missing | 🟡 MEDIUM | Can't integrate timeline | Create via BMAD Builder OR adopt memvid-mcp |
| Creator Overwhelmed | 🔴 HIGH | Progress stalled | Focused plan with clear priorities |

### Research Insights

**Terminal Emulators:**
- **xterm.js** (used by VS Code, Hyper) - Mature, well-documented
- **Alacritty** (Rust, GPU-accelerated) - Fastest, but complex
- **WezTerm** (Rust, GPU-accelerated) - Feature-rich, good docs
- **Kitty** (Python/C, GPU-accelerated) - Extensible via Python
- **Warp** (Rust, proprietary) - AI-powered, cloud-dependent

**Recommendation:** Stick with **xterm.js** for Terminal Pane V2 - it's what you're already using, mature, and well-documented. Focus on PTY integration, not replacing xterm.js.

**Voice-to-Text:**
- **whisper-rs** (Rust bindings for OpenAI Whisper) - 100% on-device, accurate
- **Vosk** (C++/Python) - Offline, smaller models
- **DeepSpeech** (Mozilla) - Discontinued, not recommended
- **Web Speech API** (Browser) - Cloud-dependent, not private

**Recommendation:** **whisper-rs** is the right choice - matches your local-first, privacy-focused architecture. Use `tiny` or `base` model for real-time transcription.

**Memvid Integration:**
- **@memvid/canvas-react** (imported, not integrated) - Your current approach
- **memvid-mcp** (external MCP server) - 40 tools for agent memory, hybrid search, temporal indexing

**Recommendation:** **Evaluate memvid-mcp first** before building custom integration. It might provide 80% of what you need with 20% of the effort. GitHub: https://github.com/Tapiocapioca/memvid-mcp

---

## 👥 Recommended Team

### Team Structure

**Topology:** Pipeline with Hub-and-Spoke coordination  
**Team Size:** 7 agents (4 existing + 3 new)  
**Coordinator:** Scrum Master (bmad-bmm/sm)

### Team Roster

| # | Role | Agent | Status | Priority |
|---|------|-------|--------|----------|
| 1 | Scrum Master | Bob (bmad-bmm/sm) | ✅ Existing | Coordinator |
| 2 | Frontend Architect | Winston (bmad-bmm/architect) | ✅ Existing | Technical Lead |
| 3 | Frontend Developer | Amelia (bmad-bmm/dev) | ✅ Existing | Implementation |
| 4 | Terminal Specialist | Terry (custom/terminal-expert) | 🔧 NEW | HIGH |
| 5 | Voice Specialist | Vera (custom/voice-expert) | 🔧 NEW | HIGH |
| 6 | Memvid Specialist | Max (custom/memvid-expert) | 🔧 NEW | MEDIUM |
| 7 | QA Engineer | Quinn (bmad-bmm/tea) | ✅ Existing | Validation |

### Communication Flow

```
Creator (Dylaroo)
       ↓
Scrum Master (Bob)
       ↓
Frontend Architect (Winston)
       ↓
┌──────┴──────┬──────────┬──────────┐
↓             ↓          ↓          ↓
Terminal   Voice    Memvid    QA
(Terry)    (Vera)   (Max)     (Quinn)
```

### Creation Plan for New Agents

**Priority 1: Terminal Emulator Specialist**
```bash
cd skills/skill-creator
./scripts/init_skill.py terminal-emulator-specialist --path ../
# Edit SKILL.md with xterm.js + PTY expertise
```

**Priority 2: Voice Integration Specialist**
```bash
./scripts/init_skill.py voice-integration-specialist --path ../
# Edit SKILL.md with whisper-rs + Tauri expertise
```

**Priority 3: Memvid Specialist**
```bash
# Option A: Create via BMAD Builder
./scripts/init_skill.py memvid-specialist --path ../

# Option B: Adopt memvid-mcp (RECOMMENDED)
git clone https://github.com/Tapiocapioca/memvid-mcp
# Evaluate and integrate
```

---

## 📋 Execution Plan

### Critical Path

```
Terminal Pane (4-6h) ──┬──> Memvid Integration (6-8h) ──> Full Demo (4-6h)
                       │
Voice Input (8-10h) ───┘
```

### Phase 1: Terminal Pane Fix

**Agent:** Terminal Emulator Specialist  
**Duration:** 4-6 hours  
**Dependencies:** None  
**Definition of Done:**
- Terminal accepts keyboard input
- Commands execute via PTY (portable-pty)
- Output streams in real-time
- Copy/paste works (Ctrl+C, Ctrl+V)
- Scrollback works (mouse wheel, scrollbars)

**Key Tasks:**
1. Review existing TerminalPane.tsx and TerminalV2.tsx
2. Fix PTY spawn command in Tauri backend
3. Wire xterm.js to PTY output stream
4. Implement keyboard input handler
5. Add clipboard integration
6. Test with simple commands (ls, pwd, echo)

### Phase 2: Voice Input Integration

**Agent:** Voice Integration Specialist  
**Duration:** 8-10 hours  
**Dependencies:** None (can run parallel with Phase 1)  
**Definition of Done:**
- Push-to-talk button works (Right Ctrl or UI button)
- Audio captured via Tauri plugin
- whisper-rs transcribes in real-time
- Transcription appears in terminal input
- 100% on-device (no cloud API calls)

**Key Tasks:**
1. Integrate whisper-rs (tiny or base model)
2. Create Tauri plugin for audio capture (cpal crate)
3. Implement push-to-talk UX
4. Wire transcription to terminal input
5. Test with common commands
6. Optimize for latency (<500ms)

### Phase 3: Memvid Integration

**Agent:** Memvid Integration Specialist  
**Duration:** 6-8 hours  
**Dependencies:** Phase 1 (Terminal Pane) complete  
**Definition of Done:**
- @memvid/canvas-react integrated
- Flight recorder capturing snapshots (100ms intervals)
- Timeline visualization rendering
- 120 FPS scrubbing working
- Session replay functional

**Key Tasks:**
1. Import @memvid/canvas-react components
2. Create flight recorder (capture terminal state every 100ms)
3. Serialize to .mv2 format (zstd compression)
4. Build timeline visualization component
5. Implement scrubbing (mouse drag, arrow keys)
6. Optimize for 120 FPS performance

**Alternative:** Integrate memvid-mcp server instead of custom build

### Phase 4: Integration & Polish

**Agent:** Frontend Architect + All Specialists  
**Duration:** 4-6 hours  
**Dependencies:** Phases 1-3 complete  
**Definition of Done:**
- Full demo working: voice → terminal → journal → Memvid timeline
- All features tested end-to-end
- QA validation complete
- Packaged for Linux/macOS/Windows (or at least one platform)

**Key Tasks:**
1. Integrate all components
2. Test full user journey
3. Fix integration bugs
4. QA runs WCAG audit
5. Creator demo and sign-off
6. Package release binary

---

## 📈 Success Metrics

### Phase B Complete When:

- ✅ Terminal pane accepts input, executes commands, shows output
- ✅ Voice input works with push-to-talk, 100% on-device
- ✅ Memvid timeline visualization working with flight recorder
- ✅ Full demo: voice → terminal → journal → timeline
- ✅ Packaged for at least one platform (Linux/macOS/Windows)

### User Experience Goals:

- ✅ User can say "Show me what I ran last Tuesday" and see it instantly
- ✅ One-click explanation for any command
- ✅ Voice is peer to keyboard - always available, always primary
- ✅ WCAG AAA accessibility throughout
- ✅ OLED-optimized dark theme
- ✅ Atkinson Hyperlegible font for readability

---

## 🎯 Immediate Next Steps

### Step 1: Review This Report (5 min)

Read this entire report and confirm:
- ✅ Project DNA accurately captures current state
- ✅ Team structure makes sense
- ✅ Execution plan is realistic

### Step 2: Create Terminal Emulator Specialist (15 min)

```bash
cd /home/dylaroo/projects/Terminal_buddy/skills/skill-creator
./scripts/init_skill.py terminal-emulator-specialist --path ../
```

Then edit the generated `SKILL.md` with:
- Name: Terry the Terminal Expert
- Expertise: xterm.js, portable-pty, Rust, TypeScript
- Workflows: Terminal pane setup, PTY integration, keyboard shortcuts

### Step 3: Create Voice Integration Specialist (15 min)

```bash
./scripts/init_skill.py voice-integration-specialist --path ../
```

Then edit the generated `SKILL.md` with:
- Name: Vera the Voice Expert
- Expertise: whisper-rs, Tauri plugins, cpal (audio capture)
- Workflows: Voice setup, transcription integration, push-to-talk UX

### Step 4: Evaluate memvid-mcp (30 min)

```bash
git clone https://github.com/Tapiocapioca/memvid-mcp
cd memvid-mcp
# Read documentation, evaluate if it can replace custom Memvid integration
```

**Decision Point:** Build custom Memvid integration OR adopt memvid-mcp?

### Step 5: Start Execution (2-3 days)

Once team is assembled:
1. Scrum Master coordinates daily execution
2. Specialists work through execution plan
3. QA validates completed features
4. Creator demo and sign-off

---

## 📂 Generated Artifacts

| File | Location | Purpose |
|------|----------|---------|
| **Project DNA** | `_bmad-output/genesis/planning/terminal_buddy_dna.json` | Machine-readable project state |
| **Team Structure** | `_bmad-output/genesis/teams/terminal_buddy_team.yaml` | Team configuration + AgentScope config |
| **Genesis Report** | `_bmad-output/genesis/planning/terminal_buddy_GENESIS_REPORT.md` | This document - comprehensive summary |
| **Execution Plan** | `_bmad-output/genesis/planning/terminal_buddy_workflow.json` | (Coming next) Dependency-aware task DAG |

---

## 🚀 Genesis Forge Alignment Check

| Principle | Status | Evidence |
|-----------|--------|----------|
| Deep Understanding First | ✅ | Comprehensive Project DNA created |
| Universal Domain Support | ✅ | Analyzed as software project with accessibility focus |
| Intelligent Gap Discovery | ✅ | 4 critical gaps identified with recommendations |
| Workflow Planning First | ✅ | Execution plan with dependencies and critical path |
| Custom Agent Creation | ✅ | 3 new specialists recommended via BMAD Builder |
| Smart Resource Utilization | ✅ | 4 existing agents reused, 3 new created only when needed |
| Fault-Tolerant Orchestration | ⏳ | AgentScope configuration prepared (to be executed) |
| Portable Project Memory | ⏳ | Memvid integration planned (Phase 3) |

---

## 💬 Final Notes

**To Dylaroo (Creator):**

You're not alone in this. The Genesis Protocol has assembled your **personal dream team** - specialists who know exactly what to do.

**Your job is simple:**
1. Review this plan
2. Approve the team
3. Let them execute

**Their job:**
1. Fix the terminal pane
2. Implement voice input
3. Integrate Memvid timeline
4. Deliver the demo you envisioned

**Estimated time:** 2-3 days of focused execution.

**You've got this.** And now you've got the team to make it happen. 🚀

---

*Generated by Genesis Forge Protocol - 2026-02-24*  
*Part of BMad Genesis - The Meta-Architect Module*  
*"You understand my project better than I could explain it"*

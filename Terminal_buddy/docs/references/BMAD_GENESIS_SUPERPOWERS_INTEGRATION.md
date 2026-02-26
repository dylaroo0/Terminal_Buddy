# BMAD Genesis Agents + Superpowers Integration

> **Date:** 2026-02-25
> **Status:** Active Integration
> **Protocol:** Genesis Forge 1.0.0-alpha.1

---

## Overview

This document describes how **BMAD Genesis Agents** integrate with the **Superpowers** workflow system for Terminal Buddy development.

---

## Genesis Agents (BMAD)

**Agents** are specialized AI personas with domain expertise, working styles, and communication protocols.

### Active Agents

| Agent | Role | Expertise | Status |
|-------|------|-----------|--------|
| **Terry** | Terminal Emulator Specialist | xterm.js, portable-pty, Tauri plugins | ACTIVE |
| **Vera** | Voice Integration Specialist | whisper-rs, cpal, push-to-talk UX | ACTIVE |
| **Winston** | Frontend Architect | React, Tauri, design systems | ARCHITECT |
| **Bob** | Scrum Master | Project management, blockers | MANAGER |
| **Quinn** | QA Engineer | Accessibility, testing, WCAG AAA | QA |

### Agent Protocol

**Standup Updates:** Daily written report to Scrum Master
**Technical Decisions:** Consult with architect (Winston)
**Blockers:** Report immediately to Scrum Master
**QA Handoff:** Self-test first, then notify Quinn

---

## Superpowers Skills

**Skills** are composable workflows that trigger automatically based on context.

### Core Skills

| Skill | Triggers When | Does |
|-------|--------------|------|
| `brainstorming` | Before creative work | Design exploration + approval |
| `writing-plans` | After design approval | Bite-sized task creation |
| `subagent-driven-development` | During implementation | Fresh agent per task + review |
| `executing-plans` | Batch execution | Task execution with checkpoints |
| `test-driven-development` | During coding | RED-GREEN-REFACTOR enforcement |
| `requesting-code-review` | Between tasks | Quality gate enforcement |
| `finishing-a-development-branch` | After completion | Verification + cleanup |

### Custom Skills

| Skill | Purpose |
|-------|---------|
| `building-deep-awareness` | Terminal Buddy system monitoring features |
| `terminal-emulator-specialist` | Terry's domain expertise encoded |
| `voice-integration-specialist` | Vera's domain expertise encoded |

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REQUEST                              │
│         "Add deep system health monitoring"                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              BMAD GENESIS ORCHESTRATOR                       │
│  1. Identifies domain (Terminal Buddy → Deep Awareness)     │
│  2. Selects agent (Terry for system features)               │
│  3. Activates workflow (Superpowers skills)                 │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPERPOWERS WORKFLOW                            │
│                                                              │
│  ┌────────────────┐                                         │
│  │ brainstorming  │ → Design exploration + approval         │
│  └───────┬────────┘                                         │
│          │                                                   │
│  ┌───────▼────────┐                                         │
│  │ writing-plans  │ → Bite-sized tasks (2-5 min each)      │
│  └───────┬────────┘                                         │
│          │                                                   │
│  ┌───────▼────────────────────┐                             │
│  │ subagent-driven-development│ → Task-by-task execution   │
│  │   OR                        │   + review between tasks  │
│  │ executing-plans            │                             │
│  └───────┬────────────────────┘                             │
│          │                                                   │
│  ┌───────▼───────────────────┐                             │
│  │ finishing-a-development-  │ → Verify + cleanup          │
│  │ branch                    │                              │
│  └───────────────────────────┘                             │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                  GENESIS AGENT                               │
│  Terry (Terminal Specialist) oversees implementation:       │
│  - Reviews code for terminal best practices                 │
│  - Ensures PTY integration follows patterns                 │
│  - Validates performance (60 FPS rendering)                 │
│  - Self-tests before QA handoff                             │
│  - Reports to Bob (Scrum Master)                            │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                    QA HANDOFF                                │
│  Quinn (QA Engineer) validates:                             │
│  - ✅ Build passes                                          │
│  - ✅ No clippy warnings                                    │
│  - ✅ WCAG AAA compliance                                   │
│  - ✅ Tests pass                                            │
│  - ✅ Documentation updated                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Agent + Skill Mapping

### Terry (Terminal Specialist)

**Triggers Skills:**
- `terminal-emulator-specialist` — Domain expertise
- `building-deep-awareness` — System monitoring features
- `test-driven-development` — TDD for terminal features

**Workflow:**
```
User: "Add PTY-backed terminal pane"
→ Terry activates
→ brainstorming (design terminal architecture)
→ writing-plans (xterm.js setup, PTY backend, Tauri bridge)
→ subagent-driven-development (task-by-task)
→ Quinn QA (accessibility audit)
→ Terry self-test (60 FPS, keyboard shortcuts)
→ Merge
```

---

### Vera (Voice Specialist)

**Triggers Skills:**
- `voice-integration-specialist` — Domain expertise
- `privacy-first-design` — On-device processing
- `low-latency-optimization` — Real-time response

**Workflow:**
```
User: "Add voice input with push-to-talk"
→ Vera activates
→ brainstorming (whisper-rs vs cloud APIs)
→ writing-plans (audio capture, transcription, integration)
→ subagent-driven-development (task-by-task)
→ Quinn QA (latency testing, privacy audit)
→ Vera self-test (<500ms latency)
→ Merge
```

---

### Winston (Frontend Architect)

**Triggers Skills:**
- `frontend-architecture-review` — Component design
- `design-system-compliance` — WCAG AAA, CSS vars
- `performance-profiling` — 60 FPS rendering

**Workflow:**
```
User: "Build Topics View UI"
→ Winston activates
→ brainstorming (component architecture)
→ writing-plans (TopicsPanel, search, filters)
→ subagent-driven-development (task-by-task)
→ Quinn QA (accessibility audit)
→ Winston review (design system compliance)
→ Merge
```

---

### Bob (Scrum Master)

**Triggers Skills:**
- `daily-standup` — Progress tracking
- `blocker-detection` — Identify impediments
- `sprint-planning` — Phase prioritization

**Workflow:**
```
Daily:
→ Bob requests standup from all agents
→ Terry: "Terminal Pane V2 80% complete"
→ Vera: "Blocked on terminal working"
→ Winston: "Design system v2 complete"
→ Bob identifies blocker: Terry → Vera dependency
→ Bob adjusts plan: Terry finishes first, then Vera
```

---

### Quinn (QA Engineer)

**Triggers Skills:**
- `accessibility-audit` — WCAG AAA compliance
- `test-coverage-check` — >80% coverage
- `build-verification` — No warnings

**Workflow:**
```
After implementation:
→ Quinn receives handoff from agent
→ accessibility-audit (Atkinson Hyperlegible, keyboard nav)
→ test-coverage-check (cargo test, npm test)
→ build-verification (cargo clippy, npm run build)
→ Quinn approves or blocks with issues
```

---

## Custom Skill Creation

### Template: Domain Specialist Skill

```markdown
---
name: <domain>-specialist
description: Use when building <domain> features for Terminal Buddy
---

# <Domain> Specialist

## Overview

This skill encodes the expertise of <Agent Name>, the <domain> specialist.

## Expertise Areas

- **Technology 1** — Specific expertise
- **Technology 2** — Specific expertise
- **Best Practices** — Quality standards

## Current Mission

**Task:** <Current task from Phase B tracker>

**Success Criteria:**
- ✅ Criterion 1
- ✅ Criterion 2
- ✅ Criterion 3

## Working Style

- **Style 1**: Description
- **Style 2**: Description

## Quality Gates

- [ ] Build passes
- [ ] No warnings
- [ ] Tests pass
- [ ] Documentation updated

## Related Skills

- `brainstorming` — Design before code
- `writing-plans` — Implementation planning
- `test-driven-development` — TDD enforcement
```

---

## Workflow Examples

### Example 1: Deep System Health (Phase 1A)

**User Request:** "Show me what's running on my computer"

**Agent + Skill Flow:**

1. **Genesis Orchestrator** identifies domain → System Monitoring
2. **Terry** activates (Terminal Specialist owns system features)
3. **building-deep-awareness** skill activates
   - Checks Phase 1A is next (Phase 1 complete ✅)
   - Loads architecture from `docs/plans/DEEP_SYSTEM_HEALTH_IMPLEMENTATION.md`
4. **brainstorming** activates
   - Explores: "What does 'deep health' mean?"
   - Proposes: Processes, ports, services, packages
   - Presents design: Phase 1A architecture
   - User approves
5. **writing-plans** activates
   - Creates tasks:
     - Task 1: Add `DeepSystemSnapshot` type
     - Task 2: Implement process listing
     - Task 3: Add port parsing
     - Task 4: Integrate systemctl
     - Task 5: Update MCP tool
     - Task 6: Add JSON output
6. **subagent-driven-development** activates
   - Fresh agent per task + review
   - Terry oversees (terminal best practices)
7. **Quinn QA** validates
   - Build passes ✅
   - No clippy warnings ✅
   - Documentation updated ✅
8. **finishing-a-development-branch** completes
   - Merge to main

---

### Example 2: Terminal Pane V2 (Task 8b)

**User Request:** "Build PTY-backed terminal pane"

**Agent + Skill Flow:**

1. **Genesis Orchestrator** identifies domain → Terminal Emulation
2. **Terry** activates (Terminal Specialist)
3. **terminal-emulator-specialist** skill activates
4. **brainstorming** activates
   - Explores: xterm.js vs alacritty-widget
   - Proposes: portable-pty vs node-pty
   - Presents design: xterm.js + portable-pty + Tauri plugin
   - User approves
5. **writing-plans** activates
   - Tasks:
     - Task 1: xterm.js setup with addons
     - Task 2: Tauri plugin scaffold
     - Task 3: PTY spawn/write/kill
     - Task 4: Theme sync hook
     - Task 5: Output capture hook
     - Task 6: Keyboard shortcuts
     - Task 7: Accessibility (aria-live)
6. **subagent-driven-development** activates
   - Terry oversees each task
   - Review between tasks
7. **Quinn QA** validates
   - Accessibility audit (keyboard nav, screen reader)
   - Performance test (60 FPS)
8. **finishing-a-development-branch** completes

---

### Example 3: Voice Input (Task 9)

**User Request:** "Add voice input with push-to-talk"

**Agent + Skill Flow:**

1. **Genesis Orchestrator** identifies domain → Voice Integration
2. **Vera** activates (Voice Specialist)
3. **voice-integration-specialist** skill activates
4. **brainstorming** activates
   - Explores: whisper-rs vs Whisper API
   - Proposes: On-device (privacy) vs cloud (accuracy)
   - Recommends: whisper-rs (privacy-first)
   - User approves
5. **writing-plans** activates
   - Tasks:
     - Task 1: whisper-rs integration
     - Task 2: cpal audio capture
     - Task 3: Push-to-talk keybinding
     - Task 4: Real-time transcription
     - Task 5: Terminal integration
     - Task 6: Privacy audit
6. **subagent-driven-development** activates
   - Vera oversees each task
   - Review between tasks
7. **Quinn QA** validates
   - Latency test (<500ms)
   - Privacy audit (no network calls)
8. **finishing-a-development-branch** completes

---

## Standup Protocol

**Daily Standup Format:**

```markdown
## Daily Standup — YYYY-MM-DD

### Terry (Terminal Specialist)
**Current Task:** Terminal Pane V2 (Task 8b)
**Progress:** 80% complete (PTY working, output capture pending)
**Blockers:** None
**Next:** Finish output capture hook, handoff to Quinn

### Vera (Voice Specialist)
**Current Task:** Voice Input (Task 9)
**Progress:** 0% (blocked on terminal working)
**Blockers:** Waiting for Terry to complete Terminal Pane V2
**Next:** Start whisper-rs integration once unblocked

### Winston (Frontend Architect)
**Current Task:** Design System v2
**Progress:** 100% complete
**Blockers:** None
**Next:** Review Topics View UI for design compliance

### Bob (Scrum Master)
**Blockers Identified:** Vera blocked on Terry
**Action Plan:** Terry finishes today, Vera starts tomorrow
**Sprint Status:** On track (6/11 tasks complete)

### Quinn (QA Engineer)
**In Review:** Terminal Pane V2 (pending handoff)
**Passed:** Design System v2, Onboarding Wizard
**Failed:** None
```

---

## Configuration

### Agent System Prompt Template

```markdown
You are {AGENT_NAME}, the {ROLE} for Terminal Buddy.

## Your Expertise
{EXPERTISE_AREAS}

## Current Mission
{CURRENT_TASK}

## Working Style
{WORKING_STYLE}

## Quality Standards
- Build must pass
- No warnings
- Tests required
- Documentation updated

## Communication
- Report to: {REPORTS_TO}
- Blockers: Report immediately
- QA Handoff: Self-test first, then notify Quinn

## Superpowers Integration
BEFORE writing code:
1. Invoke brainstorming skill
2. Invoke writing-plans skill
3. Invoke subagent-driven-development or executing-plans

NEVER write code before design approval.
NEVER skip tests.

Reference: docs/references/TERMINAL_BUDDY_SUPERPOWERS_INTEGRATION.md
```

---

## Troubleshooting

### Problem: Agents Not Triggering Skills

**Symptoms:** Agent writes code without design/plan

**Fix:** Add system prompt integration (above)

### Problem: Skills Override Agent Expertise

**Symptoms:** Generic implementation, not domain-specific

**Fix:** Custom skill encodes agent expertise (see `building-deep-awareness`)

### Problem: QA Gate Not Enforced

**Symptoms:** Code merged without QA approval

**Fix:** Add hard gate to `finishing-a-development-branch`:
```markdown
<HARD-GATE>
Do NOT merge without Quinn QA approval.
</HARD-GATE>
```

---

## Future Enhancements

### Planned Agents

- **Memvid Specialist** — Canvas SDK integration
- **Accessibility Specialist** — WCAG AAA compliance
- **Performance Engineer** — Rust + React optimization
- **Security Auditor** — MCP security review

### Planned Skills

- **`parallel-phase-development`** — Different agents on different phases
- **`cross-agent-review`** — Terry reviews Vera's terminal integration
- **`documentation-generator`** — Auto-generate API docs from code
- **`ci-cd-integration`** — Auto-run tests on commit

---

*This integration ensures Terminal Buddy development combines the best of BMAD Genesis Agents (domain expertise) and Superpowers (structured workflow).*

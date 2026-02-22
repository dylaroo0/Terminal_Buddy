# Phase 1: Discovery System Architecture

**Status:** Design Phase  
**Last Updated:** January 5, 2026

---

## Overview

Phase 1 is the foundation of Genesis. It creates deep project understanding before any workflows or teams are built. The output is a **Project DNA** document that captures everything needed for subsequent phases.

## Core Principle

> "Users should say: You understand my project better than I could explain it."

This isn't a quick questionnaire. It's a comprehensive discovery engagement.

---

## System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Discovery Engine                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Questionnaire│  │   Domain    │  │   Research  │         │
│  │   Engine    │  │  Detector   │  │   Engine    │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         └────────────────┼────────────────┘                 │
│                          │                                  │
│                   ┌──────▼──────┐                           │
│                   │ Gap Discovery│                          │
│                   │    Engine   │                           │
│                   └──────┬──────┘                           │
│                          │                                  │
│                   ┌──────▼──────┐                           │
│                   │  Validation │                           │
│                   │    Loop     │                           │
│                   └──────┬──────┘                           │
│                          │                                  │
│                   ┌──────▼──────┐                           │
│                   │ Project DNA │                           │
│                   │  Generator  │                           │
│                   └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Discovery Flow

### Stage 1: Initial Discovery

**Goal:** Understand the basics and detect domain.

**Questions:**
1. What domain/industry is this project in?
2. What's the core vision? (User's own words)
3. What exists vs. what needs building?
4. Ultimate success criteria?
5. Who initiated and why?

**Output:** Domain detection triggers domain-specific questionnaire.

### Stage 2: Stakeholder Analysis

**Goal:** Map everyone involved in the project.

**Stakeholders to identify:**
- **End Users** - Demographics, needs, pain points
- **Decision Makers** - Authority, priorities
- **Funding Source** - Budget constraints
- **Beneficiaries** - Beyond direct users
- **Gatekeepers** - Legal, compliance, approvals

### Stage 3: Domain-Specific Deep Dive

**Goal:** Gather domain-specific requirements.

Each domain has a custom questionnaire:
- `software.yaml` - Tech stack, architecture, security
- `music_production.yaml` - Audio framework, plugins, pedagogy
- `manufacturing.yaml` - Quality standards, compliance
- `therapy_counseling.yaml` - Methods, privacy, licensing

### Stage 4: Research & Gap Discovery

**Goal:** Find what the user doesn't know they're missing.

**Research triggers:**
- Industry best practices
- Competitive analysis
- Regulatory landscape
- Required specialist types
- Common pitfalls

**Gap triggers:**
- Rule-based conditions from questionnaires
- Cross-reference checks
- Compliance requirements
- Scale implications

### Stage 5: Validation Loop

**Goal:** Ensure understanding before proceeding.

```
┌──────────────────────────────────────────────┐
│                                              │
│   Generate Understanding Summary             │
│              │                               │
│              ▼                               │
│   Present to User                            │
│              │                               │
│              ▼                               │
│   ┌─────────────────────────┐                │
│   │  User Response:         │                │
│   │  ✅ "Yes, you GET it"   │───────────────►│ PROCEED
│   │  🔄 "Not quite..."      │───┐            │
│   │  ❓ "Let me think..."   │──┐│            │
│   └─────────────────────────┘  ││            │
│                                ││            │
│              ◄─────────────────┘│            │
│   Clarify and Update            │            │
│              │                  │            │
│              ▼                  │            │
│   ◄─────────────────────────────┘            │
│   Pause (return later)                       │
│                                              │
└──────────────────────────────────────────────┘
```

**This may take multiple sessions - THAT'S OKAY.**

### Stage 6: Project DNA Output

**Goal:** Comprehensive machine + human readable document.

---

## Project DNA Schema

The Project DNA is stored as JSON with these sections:

```json
{
  "metadata": { "project_id", "name", "version", "status" },
  "domain": { "primary", "secondary", "industry", "context" },
  "vision": { "core_vision", "problem", "solution", "success_criteria" },
  "stakeholders": { "end_users", "decision_makers", "funding", "gatekeepers" },
  "requirements": { "functional", "non_functional", "technical", "constraints" },
  "current_state": { "exists", "needs_building", "completion_%" },
  "gaps": { "identified", "acknowledged", "deferred" },
  "research_findings": { "best_practices", "competitive", "regulatory" },
  "risks": [ { "description", "likelihood", "impact", "mitigation" } ],
  "recommendations": { "specialists_needed", "workflows", "methodologies" }
}
```

Full schema: `src/core/project_dna_schema.json`

---

## Gap Discovery Rules

Gaps are discovered through:

### 1. Questionnaire Triggers

Each questionnaire has `gap_triggers`:

```yaml
gap_triggers:
  - condition: "security_requirements contains HIPAA and sensitive_data not contains Health"
    gap: "HIPAA selected but health data not identified - verify classification"
```

### 2. Cross-Domain Checks

Universal gaps that apply regardless of domain:
- Missing risk assessment
- Vague success criteria
- Resource/skill gaps
- Timeline concerns

### 3. Research-Driven Discovery

Web search finds what user didn't know:
- "Your competitors all have X"
- "This domain requires Y certification"
- "At your scale, you'll hit Z bottleneck"

---

## Research Integration

### When to Research

- Domain detected → Industry best practices
- Compliance mentioned → Regulatory requirements
- Scale defined → Infrastructure patterns
- Competitors mentioned → Competitive analysis

### Research Queries

```yaml
research_triggers:
  - condition: "tech_stack.backend contains Rust"
    research: "Rust backend patterns, async runtime options"
    
  - condition: "security_requirements contains SOC 2"
    research: "SOC 2 compliance requirements, audit preparation"
```

### Rate Limiting

- Max queries per domain: 10
- Delay between queries: 1 second
- Cache results for reuse

---

## User Experience

### Communication Style

- Short, clear sentences
- Voice-optimized responses
- Direct answers first
- No unnecessary elaboration
- Progress indicators

### Checkpoint Pattern

Each major stage ends with a checkpoint:

```
"Based on what you've shared, here's my understanding..."

[Summary]

Does this capture your project?
- ✅ Yes, proceed
- 🔄 Not quite - here's what you missed
- ❓ I need to think about this
```

### Multi-Session Support

- Project DNA persists between sessions
- Can resume at any stage
- Memvid stores full context

---

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Discovery Engine | ✅ Scaffolded | Core structure in place |
| Questionnaire Loader | ✅ Implemented | Loads YAML templates |
| Domain Detector | 🔄 Basic | Keyword matching |
| Gap Triggers | 🔄 Basic | Simplified evaluation |
| Research Engine | ❌ Not started | Needs web search integration |
| Validation Loop | ❌ Not started | Needs interactive flow |
| Project DNA Generator | ✅ Implemented | Schema and export working |

---

## Next Steps

1. **Implement proper rule engine** for gap trigger evaluation
2. **Build research engine** with web search integration
3. **Create validation loop** with interactive prompts
4. **Test with real project** (BRIDGIE or D.I.C.E.)
5. **Iterate based on results**

---

## Files

```
src/
├── phases/
│   └── discovery.py          # Main discovery engine
├── core/
│   └── project_dna_schema.json  # JSON schema
templates/
└── questionnaires/
    ├── universal.yaml        # All-domain questionnaire
    ├── software.yaml         # Software domain
    └── music_production.yaml # Music production domain
```

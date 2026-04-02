# Terminal Buddy — UI Design Approval Workflow

**Status:** Locked & Ready\
**Date:** 2026-03-28\
**Stakeholder:** Dylaroo (Creative Director)

***

## **The Process (Task 5 & 6)**

```
┌─────────────────────────────────────────────────────────────────┐
│ BMAD MASTER: "Sally, design the [Task 5/6] UI"                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ✓
                     │
┌────────────────────▼────────────────────────────────────────────┐
│ SALLY: Create 2-3 Design Direction Options                      │
│ ─────────────────────────────────────────────────────────────   │
│ Option A: Topics sidebar (minimalist, focused)                  │
│ Option B: Topics panel (expanded, rich metadata)                │
│ Option C: Hybrid (collapsible, adaptive)                        │
│                                                                  │
│ Include: mockups, CSS specs, accessibility notes               │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ✓ (saves options to docs or images)
                     │
┌────────────────────▼────────────────────────────────────────────┐
│ DYLAROO: Light-Touch Review (5 min max)                         │
│ ─────────────────────────────────────────────────────────────   │
│ See 3 directions, quick feedback:                               │
│                                                                  │
│ ✅ "I like Option B" → GO AHEAD                                │
│ ✅ "Option A, but make the font bigger" → Sally tweaks → GO    │
│ ✅ "Blend B + C" → Sally adjusts → GO                          │
│ ✅ "Show me something different" → Sally creates new → review  │
│                                                                  │
│ NOT: "Remake this 5 times"                                     │
│ NOT: Micro-managing every detail                               │
│ YES: General direction + maybe 1-2 tweaks                     │
│                                                                  │
│ Decision time: ~5 minutes.                                     │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ✓ (you say "go ahead")
                     │
┌────────────────────▼────────────────────────────────────────────┐
│ AMELIA: Build & Test                                            │
│ ─────────────────────────────────────────────────────────────   │
│ Implement approved design in React                              │
│ Run `npm run build`, verify accessibility                       │
│ Create component per Sally's specs                              │
│ Hand off with screenshot/demo                                   │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ✓
                     │
┌────────────────────▼────────────────────────────────────────────┐
│ BMAD MASTER: Verify Implementation                              │
│ ─────────────────────────────────────────────────────────────   │
│ ✓ Matches design spec                                           │
│ ✓ Tests pass                                                    │
│ ✓ Accessibility OK                                              │
│ ✓ Ready for merge/demo                                          │
└─────────────────────────────────────────────────────────────────┘
```

***

## **Key Rules**

| Rule | Why | Who |
|------|-----|-----|
| **Sally creates 3 options** | Dylaroo sees real choices (not 1 locked path) | Sally |
| **Dylaroo light-touch review** | See general direction, maybe 1-2 tweaks, then "go" | Dylaroo |
| **No micro-managing** | Prevent endless iteration, trust the process | Dylaroo |
| **Iterate on design, not code** | Mockups are cheap; refactoring is expensive | Dylaroo + Sally |
| **Iterate fast** | If "try something different" → Sally redoes in <1 hour | Sally |
| **Amelia builds locked design** | No surprises, clear specs, builds once | Amelia |
| **Document each option** | Sally explains *why* each direction | Sally |

***

## **Next Design Assignments** (When BMAD Master releases them)

### **Task 5: Topics View**

**Status:** 📋 Awaiting assignment\
**Designer:** Sally\
**Timeline:**

1. Sally creates 3 design options: minimalist / rich / adaptive
2. Dylaroo reviews + picks direction
3. Amelia implements

### **Task 6: Split Pane Manager**

**Status:** 📋 Awaiting assignment\
**Designer:** Sally\
**Key Reference:** `system-monitor-server/` (real-time metrics visualization)
**Timeline:**

1. Sally researches split pane patterns (nvim, yazi, system-monitor)
2. Creates 3 options: terminal-centric / balanced / metrics-focused
3. Dylaroo reviews + decides
   Well, I mean, it's. Let's see what it looks like right on. Everything looks like it's really solid square. Is there any like shape? More shape, just a slight shape to any of them? There were angle. Or is that leader?

***

## **How to Provide Feedback** (Light Touch)

When Dylaroo reviews options:

### **Fast Feedback Examples**

```
✅ "I like Option B. Go ahead."

✅ "Option A but make fonts bigger"

✅ "Blend B + C. That works."

✅ "Show me something different" 
   (Sally creates 1 new option, you'll review quick)
```

**NOT:**

```
❌ Detailed breakdowns
❌ "Fix this, change that, modify these"
❌ Back-and-forth for hours
```

### **Template** (if you want to be detailed)

```markdown
## Feedback on Task [X]

**Pick:** Option [A/B/C]  
**Tweaks:** [List 1-2 small changes if any]  
**Notes:** [Optional: any thoughts]

→ **Go ahead**
```

That's it. 5 minutes. Done.

***

## **If You Want Iteration**

Say: "Show me something different"\
→ Sally makes 1 new option in <1 hour\
→ You review again (same process)\
→ Lock it

**Fast. Not endless.**

***

## **Iterating After MVP**

**Rule:** Once Amelia implements, design is locked for MVP.\
**But:** After MVP ships, you can iterate → "let's try a different approach next sprint"

This keeps us moving without endless rework. ✅

***

## Who Sees What

| Document | Dylaroo | Sally | Amelia | BMAD Master |
|----------|---------|-------|--------|-------------|
| Design options (mockups) | 👀 Reviews | 📝 Creates | — | — |
| Approved design spec | 👀 Approved | 📙 Reference | 👀 Builds to spec | ✓ Verifies |
| Implementation | 👀 Demos | 📚 Reviews | 📝 Code | ✓ Tests |

***

**Status:** ✅ Locked & ready for Task 5/6 assignment

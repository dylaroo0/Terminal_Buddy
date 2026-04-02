# Terminal Buddy — Agent Skills Catalog

**Date:** 2026-03-28\
**Status:** 🎓 Skills Library Available\
**Location:** `/.agents/skills/` (79 agent skill directories)

***

## **What Are Skills?**

Each agent (Amelia, Sally, Terminal Specialist) has **specialized tools** called **SKILL.md** files.

These contain:

* **Purpose:** What the agent can do
* **How to use it:** Step-by-step usage
* **Best practices:** Patterns that work
* **Examples:** Real-world scenarios

***

## **How to Access Skills**

### **For Agents (During Task Assignment)**

When BMAD Master assigns you a task:

1. Check `/home/dylaroo/projects/Terminal_buddy/.agents/skills/[YOUR-SKILL]/SKILL.md`
2. Read the full skill documentation
3. Follow the patterns outlined

### **For Documentation**

Skills are available in:

* `/.agents/skills/[skill-name]/SKILL.md` — Core skill documentation
* `/ext-apps/plugins/mcp-apps/skills/` — MCP-specific skills
* `/playground/skills/` — Experimental skills

***

## **Available Agent Skills** (Sample)

### **BMAD Master Skills**

* `bmad-agent-bmad-master/SKILL.md` — Orchestration, task assignment, design review

### **Developer Skills** (Amelia)

* `bmad-agent-mmm-dev/SKILL.md` — Feature implementation, TDD
* `bmad-agent-mmm-code-review/SKILL.md` — Code quality, testing

### **UX Designer Skills** (Sally)

* `bmad-agent-mmm-ux-designer/SKILL.md` — Interaction design, accessibility
* `bmad-agent-cis-design-thinking/SKILL.md` — Design exploration, user research

### **Product/Project Skills**

* `bmad-agent-mmm-pm/SKILL.md` — Requirements, PRD creation
* `bmad-agent-mmm-analyst/SKILL.md` — Market research, competitive analysis
* `bmad-agent-mmm-architect/SKILL.md` — System design, scalability

### **Specialist Skills**

* `bmad-agent-cis-storyteller/SKILL.md` — Narrative, communication
* `bmad-agent-cis-brainstorming-coach/SKILL.md` — Ideation, creativity
* `bmad-agent-cis-innovation-strategist/SKILL.md` — Disruptive thinking

### **Testing & Quality**

* `bmad-agent-tea-tea/SKILL.md` — Test architecture, quality assurance
* `bmad-agent-tea-ddd/SKILL.md` — Domain-driven design

### **MCP Apps Skills**

* `/ext-apps/plugins/mcp-apps/skills/create-mcp-app/SKILL.md` — Building MCP applications
* `/ext-apps/plugins/mcp-apps/skills/migrate-oai-app/SKILL.md` — Migrating OpenAI apps

***

## **When Skills Are Used**

| Situation | Example Skill |
|-----------|---------------|
| Task needs design exploration | Sally uses `bmad-agent-cis-design-thinking/SKILL.md` |
| Feature needs TDD approach | Amelia uses `bmad-agent-mmm-dev/SKILL.md` |
| Need market/competitive research | Marketing specialist uses `bmad-agent-mmm-analyst/SKILL.md` |
| Building new MCP app | Dev uses `create-mcp-app/SKILL.md` |

***

## **How BMAD Master Uses Skills**

When I assign a task, I reference the skill:

```markdown
## Task Assignment

**Assignee:** Amelia (Developer)  
**Task:** Implement Task 5 (Topics View)  
**Use Skill:** `bmad-agent-mmm-dev/SKILL.md`  
**Expected Outcome:** React component, tests passing, documented

---

## What To Do

1. Read your SKILL.md (TDD approach)
2. Create component using React best practices
3. Write tests first
4. Build feature incrementally
5. Verify `npm run build` passes
6. Hand off with demo + screenshot
```

***

## **Finding Skills** (Quick Commands)

```bash
# List all available skills
ls /home/dylaroo/projects/Terminal_buddy/.agents/skills/

# Read a specific skill
cat /home/dylaroo/projects/Terminal_buddy/.agents/skills/bmad-agent-mmm-dev/SKILL.md

# Count total skills
ls /home/dylaroo/projects/Terminal_buddy/.agents/skills/ | wc -l

# Find skills by name pattern
ls /home/dylaroo/projects/Terminal_buddy/.agents/skills/ | grep "ux-designer"
```

***

## **Next Steps** (When Tasks Start)

1. **Task 5 Assignment** ⏳
   * Sally reads: `bmad-agent-mmm-ux-designer/SKILL.md`
   * Amelia reads: `bmad-agent-mmm-dev/SKILL.md`
   * Both follow their skill's best practices

2. **Task 6 Assignment** ⏳
   * Terminal Specialist reads: Relevant architecture skill
   * Sally reads: UX/design skill
   * Amelia reads: Dev skill

3. **Ongoing** ✅
   * All agents reference their skills during work
   * BMAD Master reviews against skill standards

***

## **Anti-Gravity UI Reference**

Found in: `/home/dylaroo/Documents/copy-of-anti-gravity-copilot.zip`\
**Key Files to Review:**

* `App.tsx` — Main app layout + routing
* `/components/` — Reusable components (buttons, cards, panels)
* `/services/` — Business logic, API calls
* `/utils/` — Helper functions

**UI Patterns to Steal:**

* Side navigation (vs. top nav) ✅
* Collapsible panels
* Card-based layouts
* Service architecture

**Sally:** Use this as a reference when creating Task 5/6 design options.

***

## **Status: ✅ Skills Library is Alive**

All agents have access to **79+ specialized skills**.\
No agent starts blind.\
Every task has a playbook.

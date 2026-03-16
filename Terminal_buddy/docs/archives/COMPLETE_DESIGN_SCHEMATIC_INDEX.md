# Terminal Buddy — Complete Design Schematic Index

> **Created:** 2026-02-25
> **Purpose:** Master map of ALL design resources, schematics, and agents
> **Status:** ACTIVE — Continuously updated

---

## 🎯 **HOW TO USE THIS INDEX**

When you want to **build something**, find the category, then:
1. **Pick the agent** (who builds it)
2. **Read the schematic** (how it works)
3. **Use the components** (what to build with)
4. **Follow the patterns** (best practices)

---

## 📐 **DESIGN AGENTS (Who Builds What)**

| Agent | Name | Icon | Use For | Location |
|-------|------|------|---------|----------|
| **Dashboard Architect** | Alex | 🏗️ | Technical architecture, data flows, tech stack | `dashboard-development-framework-main/agents/dashboard-architect.md` |
| **UI/UX Designer** | Sarah | 🎨 | Visual design, mockups, component library | `dashboard-development-framework-main/agents/ui-designer.md` |
| **Dashboard Master** | — | 🧙 | Universal executor, runs any dashboard task | `dashboard-development-framework-main/agents/dashboard-master.md` |
| **Dashboard Orchestrator** | — | 🎭 | Workflow coordination, guidance | `dashboard-development-framework-main/agents/dashboard-orchestrator.md` |
| **Dashboard QA** | — | 🔍 | Testing, validation, quality assurance | `dashboard-development-framework-main/agents/dashboard-qa.md` |
| **Terminal Specialist** | Terry | — | Terminal emulator, PTY, xterm.js | `_bmad-output/genesis/agents/terminal-specialist.md` |
| **Voice Specialist** | Vera | — | Voice input, whisper-rs, audio | `_bmad-output/genesis/agents/voice-specialist.md` |

---

## 📊 **TIERS OF AWARENESS (Progressive Vision)**

### **Tier 1: Surface** ✅ COMPLETE
**What:** Basic system monitoring
**Agent:** Dashboard Master
**Schematic:** `docs/plans/DEEP_SYSTEM_HEALTH_IMPLEMENTATION.md`
**Components:** System health panel, process lists

**What it shows:**
- Top 10 CPU processes
- Top 10 RAM processes
- Open network ports
- Running services
- Recently installed packages
- Boot items

**Commands:**
```bash
buddy_system_health
buddy_system_health_json
```

---

### **Tier 2: Correlation** 🔧 PLANNED
**What:** Connect commands to effects
**Agent:** Dashboard Architect + Terminal Specialist
**Schematic:** `docs/specs/2026-01_TERMINAL_BUDDY_MASTER_SPEC.md` (Correlation Engine section)
**Components:** Timeline with before/after, filesystem delta viewer

**What it shows:**
- Command → Filesystem changes
- Command → System log correlation
- Command → Process tree changes
- "Before vs After" snapshots

---

### **Tier 3: Phantom Detection** 👻 NOT STARTED
**What:** Find orphaned/unused resources
**Agent:** Dashboard Master + Data Integrator
**Schematic:** [TO BE CREATED]
**Components:** Phantom detector, cleanup recommendations

**What it finds:**
- Orphaned processes (parent exited)
- Zombie config files (~/.config from uninstalled apps)
- Unused services (haven't used in 30 days)
- Dependency chains
- "You installed X 4 months ago, never used since"

---

### **Tier 4: Oracle** 🔮 FUTURE
**What:** Predictive intelligence from patterns
**Agent:** Dashboard Architect + AI Integration
**Schematic:** `docs/specs/MEMVID_INTEGRATION_GUIDE.md`
**Components:** Pattern recognition, predictive alerts

**What it predicts:**
- "You run `docker system prune` every Monday, want automation?"
- "Your disk fills up every 2 weeks. Want proactive cleanup?"
- "Every time you `npm install`, you get 500 warnings."

---

## 🎨 **VISUAL DESIGN RESOURCES**

### **Design Systems**

| Name | Status | Location |
|------|--------|----------|
| **Terminal Buddy Design System v2** | ✅ ACTIVE | `docs/design/DESIGN_SYSTEM_V2.md` |
| Design System v1 | ⚠️ SUPERSEDED | `docs/design/DESIGN_SYSTEM.md` |
| Dashboard Mockup (HTML) | ✅ EXISTS | `terminal-buddy-dashboard-mockup.html` |

### **Component Libraries**

| Library | Framework | Location |
|---------|-----------|----------|
| **UI Component Library Database** | Multi-framework | `data/ui-component-library.md` |
| React Components | React | `data/ui-component-library.md` (React section) |
| Vue Components | Vue.js | `data/ui-component-library.md` (Vue section) |
| Svelte Components | Svelte | `data/ui-component-library.md` (Svelte section) |

### **Integration Patterns**

| Pattern Category | Count | Location |
|------------------|-------|----------|
| **Integration Patterns Database** | 100+ patterns | `data/integration-patterns-database.md` |
| Dependency Integration | 3 patterns | `data/integration-patterns-database.md` |
| Code Enhancement | 3 patterns | `data/integration-patterns-database.md` |
| AI Integration | 3 patterns | `data/integration-patterns-database.md` |
| Cloud-Native | 3 patterns | `data/integration-patterns-database.md` |
| Security | 3 patterns | `data/integration-patterns-database.md` |
| Performance | 3 patterns | `data/integration-patterns-database.md` |

---

## 🏗️ **ARCHITECTURE SCHEMATICS**

### **Current Architecture**

| Schematic | Status | Location |
|-----------|--------|----------|
| **Terminal Blueprint** | ✅ COMPLETE | `docs/plans/TERMINAL-BLUEPRINT.md` |
| **Deep System Health Implementation** | ✅ COMPLETE | `docs/plans/DEEP_SYSTEM_HEALTH_IMPLEMENTATION.md` |
| **Frontend Architecture Template** | 📋 TEMPLATE | `megabmadadd/agents/templates/front-end-architecture-tmpl.md` |
| **Product Spec v2** | ✅ ACTIVE | `docs/specs/PRODUCT_SPEC_V2.md` |
| **Master Spec (Phase A)** | 📦 REFERENCE | `docs/specs/2026-01_TERMINAL_BUDDY_MASTER_SPEC.md` |

### **Architecture Diagrams**

```
┌─────────────────────────────────────────────────────────────┐
│                    TERMINAL BUDDY                           │
│                  "Three Surfaces, One Brain"                │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   Tauri App      │      │   MCP App        │      │   VS Code Ext    │
│   (Desktop)      │      │   (Claude)       │      │   (Editor)       │
└────────┬─────────┘      └────────┬─────────┘      └────────┬─────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                         ┌────────▼────────┐
                         │  BUDDY DAEMON   │
                         │  (Rust MCP)     │
                         │  • 7+ Tools     │
                         │  • Correlation  │
                         │  • SQLite       │
                         │  • Memvid       │
                         └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │  ~/.terminal-   │
                         │     buddy/      │
                         │  • sessions.db  │
                         │  • buddy.toml   │
                         └─────────────────┘
```

---

## 🧩 **UI COMPONENTS (What You Can Build)**

### **From Dashboard Development Framework**

| Component | Agent | Task Command | Template |
|-----------|-------|--------------|----------|
| **Requirements Doc** | Dashboard Master | `*requirements` | `dashboard-requirements-tmpl.yaml` |
| **Architecture Doc** | Dashboard Architect | `*create` | `dashboard-architecture-tmpl.yaml` |
| **Mockup** | UI/UX Designer | `*mockup` | `dashboard-mockup-tmpl.yaml` |
| **Component Spec** | UI/UX Designer | `*components` | `component-specification-tmpl.yaml` |
| **Data Integration** | Data Integrator | `*integrate` | `data-integration-tmpl.yaml` |
| **Deployment Spec** | Dashboard Architect | `*deploy` | `deployment-specification-tmpl.yaml` |
| **Test Plan** | Dashboard QA | `*test` | `test-plan-tmpl.yaml` |

### **From Terminal Blueprint**

| Component | Status | Location |
|-----------|--------|----------|
| **Terminal Pane V2** | ✅ COMPLETE | `terminal-buddy/buddy-app/src/components/TerminalV2.tsx` |
| **System Health Panel** | ✅ COMPLETE | `terminal-buddy/buddy-app/src/components/SystemHealthPanel.tsx` |
| **Journal Timeline** | ✅ COMPLETE | `terminal-buddy/buddy-app/src/App.tsx` (Timeline view) |
| **Search Panel** | ✅ COMPLETE | `terminal-buddy/buddy-app/src/components/SearchView.tsx` |
| **Topics Panel** | 📋 PLACEHOLDER | `terminal-buddy/buddy-app/src/components/TopicsPanel.tsx` |
| **Creator Corner** | 🟡 IN PROGRESS | `terminal-buddy/buddy-app/src/components/CreatorCorner.tsx` |

---

## 🎯 **QUICK START: Building Your System Cleanup Dashboard**

### **Step 1: Activate the Right Agent**

For **System Cleanup Dashboard**, start with:

```bash
# Option A: Dashboard Master (universal executor)
@dashboard-master
*requirements

# Option B: Dashboard Architect (technical design)
@dashboard-architect
*create

# Option C: UI/UX Designer (visual mockup)
@ui-designer
*mockup
```

### **Step 2: Use Existing Data**

Your dashboard will show data from:

```rust
// Source: terminal-buddy/buddy-daemon/src/monitor/mod.rs
DeepSystemSnapshot {
    top_cpu_processes: Vec<ProcessInfo>,
    top_memory_processes: Vec<ProcessInfo>,
    open_ports: Vec<PortInfo>,
    running_services: Vec<ServiceInfo>,
    recently_installed_packages: Vec<PackageInfo>,
    boot_items: Vec<BootItem>,
}
```

### **Step 3: Pick a Visual Style**

From `docs/design/DESIGN_SYSTEM_V2.md`:

```css
:root {
  --tb-bg-deep: #0F172A;
  --tb-bg-surface: #1E293B;
  --tb-primary: #3B82F6;
  --tb-success: #22C55E;
  --tb-warning: #F59E0B;
  --tb-error: #EF4444;
  --tb-font-ui: 'Atkinson Hyperlegible', sans-serif;
  --tb-font-mono: 'JetBrains Mono', monospace;
}
```

### **Step 4: Build Components**

Use the **UI Component Library** (`data/ui-component-library.md`):

```tsx
// Example: System Health Card
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

<Card className="system-health">
  <CardHeader>
    <h3>System Health</h3>
  </CardHeader>
  <CardContent>
    <div className="metric">
      <span>CPU</span>
      <Badge variant={cpu > 80 ? 'error' : 'success'}>
        {cpu}%
      </Badge>
    </div>
    {/* More metrics... */}
  </CardContent>
</Card>
```

---

## 📋 **CHECKLISTS (Quality Assurance)**

| Checklist | Use For | Location |
|-----------|---------|----------|
| **Dashboard Requirements** | Requirements gathering | `dashboard-development-framework-main/checklists/dashboard-requirements-checklist.md` |
| **Dashboard Architecture** | Technical design review | `dashboard-development-framework-main/checklists/dashboard-architecture-checklist.md` |
| **Component Development** | Building components | `dashboard-development-framework-main/checklists/component-development-checklist.md` |
| **UI Design** | Visual design review | `dashboard-development-framework-main/checklists/ui-design-checklist.md` |
| **Accessibility** | WCAG compliance | `dashboard-development-framework-main/checklists/accessibility-checklist.md` |
| **Deployment Readiness** | Pre-launch check | `dashboard-development-framework-main/checklists/deployment-readiness-checklist.md` |

---

## 🚀 **NEXT STEPS**

### **For System Cleanup Dashboard:**

1. **Answer Progressive Vision Questions** (in `docs/plans/PROGRESSIVE_VISION_QA.md` if created)
2. **Activate Dashboard Master** → `*requirements`
3. **Review existing data** → `buddy_system_health` output
4. **Design mockup** → UI/UX Designer `*mockup`
5. **Build components** → Follow component library patterns
6. **Test & deploy** → QA checklist

### **For Long-Term Vision (Tiers 2-4):**

1. **Create Phantom Detection spec** → Dashboard Architect
2. **Design Correlation Engine UI** → Dashboard Architect + Terminal Specialist
3. **Plan Oracle (Predictive)** → Dashboard Architect + AI Integration patterns
4. **Integrate Memvid Canvas** → Follow `docs/specs/MEMVID_INTEGRATION_GUIDE.md`

---

## 📍 **FILE LOCATIONS (Quick Reference)**

| What | Where |
|------|-------|
| **All Design Agents** | `dashboard-development-framework-main/agents/` |
| **All Tasks** | `dashboard-development-framework-main/tasks/` |
| **All Templates** | `dashboard-development-framework-main/templates/` |
| **All Checklists** | `dashboard-development-framework-main/checklists/` |
| **UI Components** | `data/ui-component-library.md` |
| **Integration Patterns** | `data/integration-patterns-database.md` |
| **Terminal Blueprint** | `docs/plans/TERMINAL-BLUEPRINT.md` |
| **Design System v2** | `docs/design/DESIGN_SYSTEM_V2.md` |
| **Product Spec v2** | `docs/specs/PRODUCT_SPEC_V2.md` |
| **Deep System Health** | `docs/plans/DEEP_SYSTEM_HEALTH_IMPLEMENTATION.md` |

---

*Last updated: 2026-02-25 — Complete design schematic index created*

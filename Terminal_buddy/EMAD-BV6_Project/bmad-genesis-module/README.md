# BMad Genesis: The Architect 🎬

**Version:** 1.0.0-alpha.1  
**Type:** Custom Stand Alone Module for BMAD v6  
**Purpose:** Meta-architect that builds agent teams and workflows from project descriptions

---

## Overview

Genesis is a self-replicating system architect - a "meta-team" that analyzes projects and constructs the optimal agent teams needed to execute them. Instead of manually selecting agents and workflows, Genesis automatically:

1. **Analyzes** your project (or idea) to extract "Project DNA"
2. **Builds** a custom agent team matched to your needs
3. **Weaves** executable workflows with dependency tracking
4. **Validates** market fit and GTM strategy

### Why Genesis?

- **Solves the Cold Start Problem** - No more guessing which agents to use
- **Fault-Tolerant Execution** - Uses AgentScope for automatic retries and error handling
- **Portable Memory** - Stores project context in .mp4 files (via Memvid) you can commit to git
- **Minimum Viable Teams** - Hires only the agents you actually need

---

## The Genesis Squad

Genesis operates via four specialized agents:

### 🔍 The Deep Auditor
- **Role:** Project Analysis
- **Analyzes:** Tech stack, maturity, gaps, risks
- **Forces:** Binary decisions when ambiguity blocks progress
- **Output:** Project DNA JSON

### 👷 The Team Builder
- **Role:** Agent Team Construction
- **Designs:** Communication topology (Hub-Spoke, Pipeline, Mesh)
- **Optimizes:** Minimum viable team with clear roles
- **Output:** Team Structure YAML

### 🕸️ The Workflow Weaver
- **Role:** Execution Planning
- **Creates:** Dependency-aware task graphs (DAGs)
- **Enables:** Parallel execution where possible
- **Output:** Execution Plan JSON

### 🚀 The Growth Strategist
- **Role:** Market Validation
- **Analyzes:** Product-market fit, target audience
- **Plans:** Go-to-market strategy and channels
- **Output:** Marketing Plan Markdown

---

## Technology Stack

### Core Dependencies
- **AgentScope** - Fault-tolerant multi-agent orchestration
- **Memvid** - Video-based memory storage (portable, git-committable)
- **BMAD v6** - Base framework and agent infrastructure

### Key Features
- **No Database Required** - All memory in .mp4 files
- **Git-Friendly** - Commit project context alongside code
- **Fault Tolerance** - Auto-retry failed tasks with exponential backoff
- **Parallel Execution** - Run independent tasks simultaneously

---

## Installation

### Prerequisites
- BMAD v6.0.0-alpha.20 or higher
- Python 3.10+
- Node.js 18+ (for BMAD)

### Install Genesis Module

1. **Copy module to BMAD custom content folder:**
   ```bash
   cp -r bmad-genesis-module /home/yourusername/_bmad/custom/
   ```

2. **Install dependencies:**
   ```bash
   cd /home/yourusername/_bmad/custom/bmad-genesis-module
   pip install agentscope memvid pyyaml --break-system-packages
   ```

3. **Register with BMAD:**
   ```bash
   npx bmad-method@alpha add-module custom/bmad-genesis-module
   ```

4. **Verify installation:**
   ```bash
   npx bmad-method@alpha list-modules
   # Should show: genesis (1.0.0-alpha.1)
   ```

---

## Usage

### Quick Start

```bash
# Start Genesis Orchestrator
npx bmad-method genesis

# Or directly analyze a project
npx bmad-method genesis-analyze ./my-project
```

### Complete Workflow

1. **Project Analysis:**
   ```bash
   *genesis-analyze
   # Provide project path or description
   # Outputs: _bmad-output/genesis/planning/my-project_dna.json
   ```

2. **Team Generation:**
   ```bash
   *genesis-team
   # Uses Project DNA to build team
   # Outputs: _bmad-output/genesis/teams/my-project_team.yaml
   ```

3. **Workflow Creation:**
   ```bash
   *genesis-workflow
   # Creates execution plan
   # Outputs: _bmad-output/genesis/planning/my-project_workflow.json
   ```

4. **Full Genesis Protocol:**
   ```bash
   *genesis-onboarding
   # Runs all steps: Analyze → Build → Weave → Strategize
   ```

---

## Directory Structure

```
bmad-genesis-module/
├── module.yaml              # Module configuration
├── README.md                # This file
├── agents/                  # The Genesis Squad
│   ├── auditor.md          # Deep Auditor agent
│   ├── team-builder.md     # Team Builder agent
│   ├── workflow-weaver.md  # Workflow Weaver agent
│   └── strategist.md       # Growth Strategist agent
├── workflows/               # Workflow definitions
│   ├── project-onboarding.yaml
│   ├── analyze-project.yaml
│   └── generate-team.yaml
└── lib/                     # Integration code
    ├── agentscope_bridge.py   # AgentScope integration
    └── memvid_store.py        # Memvid memory storage
```

---

## Output Structure

Genesis creates organized output in your BMAD workspace:

```
_bmad-output/genesis/
├── planning/                    # Analysis & planning
│   ├── my-project_dna.json     # Project DNA
│   ├── my-project_workflow.json # Execution plan
│   └── my-project_marketing.md  # GTM strategy
├── teams/                       # Team configurations
│   └── my-project_team.yaml    # Agent team structure
└── memory/                      # Memvid storage
    └── my-project_memory.mp4   # Portable project context
```

---

## Example: Analyzing a React + Python Project

### Input
```bash
*genesis-analyze
> Path: ./my-ml-dashboard
```

### Output: Project DNA
```json
{
  "project_name": "ml_dashboard",
  "maturity": "Brownfield",
  "core_stack": ["React", "Python", "FastAPI"],
  "detected_files": ["src/App.jsx", "api/main.py"],
  "missing_roles": ["DevOps Engineer", "QA Engineer"],
  "risk_factors": ["No tests", "No CI/CD"],
  "critical_gaps": [
    {
      "gap": "No database configured",
      "choice_required": "PostgreSQL (relational, ACID) or MongoDB (flexible)?",
      "impact": "Critical - blocks data persistence"
    }
  ]
}
```

### Generated Team
```yaml
team:
  name: "ml_dashboard_squad"
  topology: "pipeline"
  members:
    - role: "backend_developer"
      agent_id: "bmad-core/python-dev"
      focus: ["FastAPI", "PostgreSQL"]
    - role: "frontend_developer"
      agent_id: "bmad-core/react-dev"
      focus: ["React", "TypeScript"]
    - role: "devops_engineer"
      agent_id: "bmad-core/devops"
      focus: ["Docker", "AWS"]
```

---

## Advanced Features

### Memvid Memory
Project context stored as video - portable and version-controllable:

```bash
# Memory file location
_bmad-output/genesis/memory/my-project_memory.mp4

# Commit to git
git add _bmad-output/genesis/memory/my-project_memory.mp4
git commit -m "Add project context memory"
```

### AgentScope Integration
Fault-tolerant execution with automatic retries:

```python
# Configured in workflows
retry_limit: 3  # Failed tasks retry 3 times
fallback_agent: "senior_developer"  # Switch to senior if junior fails
```

### Custom Agent Registry
Extend with your own agents:

```yaml
# In team-builder configuration
custom_agents:
  - role: "my_custom_agent"
    agent_id: "custom/my-agent"
    capabilities: ["specialized_task"]
```

---

## Troubleshooting

### Genesis not found in BMAD
```bash
# Verify installation
npx bmad-method list-modules

# Re-register if needed
npx bmad-method add-module custom/bmad-genesis-module
```

### AgentScope import error
```bash
pip install agentscope --break-system-packages
```

### Memvid not encoding files
```bash
# Check Python version
python --version  # Should be 3.10+

# Reinstall memvid
pip uninstall memvid
pip install memvid --break-system-packages
```

---

## Roadmap

### v1.0.0 (Stable)
- [ ] Complete workflow validation
- [ ] UI for project analysis
- [ ] Integration with BMad Builder (BoMB)

### v1.1.0 (Enhanced)
- [ ] Multi-project memory sharing
- [ ] Pattern recognition from past projects
- [ ] Auto-optimization based on execution metrics

### v2.0.0 (Intelligence)
- [ ] Self-improving team recommendations
- [ ] Budget-aware team sizing
- [ ] Cross-project learning

---

## Contributing

Genesis is open for contribution! Key areas:

1. **New Agent Roles** - Add specialized agents for specific domains
2. **Workflow Patterns** - Contribute proven workflow templates
3. **Memory Optimization** - Improve Memvid encoding efficiency
4. **AgentScope Pipelines** - New execution topologies

---

## License

MIT License - See LICENSE file

---

## Credits

- **Created by:** dylaroo
- **Framework:** BMAD v6 by BMad Code
- **Orchestration:** AgentScope
- **Memory:** Memvid
- **Inspiration:** The vision of self-replicating agent teams

---

## Support

- **Issues:** https://github.com/dylaroo/bmad-genesis/issues
- **Docs:** https://github.com/dylaroo/bmad-genesis/wiki
- **BMAD Community:** https://github.com/bmad-code-org/BMAD-METHOD

---

*Genesis: Building the builders since 2026* 🎬

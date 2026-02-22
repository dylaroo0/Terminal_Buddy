# Genesis Quick Start Guide

**Get from zero to running Genesis in 5 minutes.**

---

## 1. Installation (2 minutes)

```bash
# Download Genesis module
cd ~/Downloads/bmad-genesis-module

# Run installation script
./install.sh

# Verify installation
ls ~/

_bmad/custom/genesis
```

**Troubleshooting:**
- If `install.sh` won't run: `chmod +x install.sh`
- If Python version error: Install Python 3.10+
- If BMAD not found: Run `npx bmad-method@alpha install` first

---

## 2. Your First Project Analysis (3 minutes)

### Option A: Analyze Existing Project

```bash
# Navigate to your project
cd ~/my-react-app

# Start Genesis
npx bmad-method genesis

# Run analysis
*genesis-analyze
> Path: .
```

### Option B: Describe New Idea

```bash
# Start Genesis
npx bmad-method genesis

# Run onboarding
*genesis-onboarding
> Project path: none
> Describe your idea: A dashboard that monitors ML models in production
```

---

## 3. Review Outputs

Genesis creates structured outputs:

```bash
# View Project DNA
cat _bmad-output/genesis/planning/my-project_dna.json

# View Team Structure
cat _bmad-output/genesis/teams/my-project_team.yaml

# View Execution Plan
cat _bmad-output/genesis/planning/my-project_workflow.json

# View Genesis Report (summary)
cat _bmad-output/genesis/planning/my-project_GENESIS_REPORT.md
```

---

## 4. Next Steps

### Execute the Workflow

```bash
# Use AgentScope to execute the plan
*genesis-execute my-project
```

### Modify Team

```bash
# Edit team structure
*genesis-team --edit my-project

# Regenerate team
*genesis-team my-project
```

### Export for Sharing

```bash
# Export all artifacts
*genesis-export my-project

# Creates: my-project-genesis.zip
```

---

## Common Workflows

### Solo Developer Starting MVP

```bash
*genesis-analyze ./my-mvp
# Review team → likely 2-3 agents
*genesis-execute my-mvp
```

### Team Planning Large Project

```bash
*genesis-onboarding
# Describe complex project
# Review team → likely 5-8 agents
# Share team structure with team
# Assign agents to team members
```

### Consultant Analyzing Client Project

```bash
*genesis-analyze ./client-codebase
# Export DNA + Team + Workflow
# Present to client
```

---

## Command Reference

### Main Commands
- `*genesis` - Start Genesis Orchestrator
- `*genesis-analyze` - Analyze project only
- `*genesis-team` - Generate team only
- `*genesis-onboarding` - Full workflow

### Agent Commands (within *genesis)
- `*auditor` - Transform into Deep Auditor
- `*builder` - Transform into Team Builder
- `*weaver` - Transform into Workflow Weaver
- `*strategist` - Transform into Growth Strategist

### Utility Commands
- `*genesis-export` - Export all artifacts
- `*genesis-clean` - Clear old outputs
- `*genesis-stats` - Show usage statistics

---

## Tips & Tricks

### Tip 1: Use Memvid Memory
```bash
# Memory is stored as video
ls _bmad-output/genesis/memory/

# Commit to git
git add _bmad-output/genesis/memory/*.mp4
git commit -m "Add project context"
```

### Tip 2: Iterate on Team
```bash
# Generate team
*genesis-team

# Not happy? Modify DNA and regenerate
# Edit: _bmad-output/genesis/planning/project_dna.json
*genesis-team --force
```

### Tip 3: Parallel Execution
```bash
# Workflow Weaver automatically parallelizes
# Check execution plan for parallel groups
cat _bmad-output/genesis/planning/project_workflow.json | grep parallel_group
```

---

## What's Next?

- **Read full docs:** `cat ~/_ bmad/custom/genesis/README.md`
- **Explore agents:** `ls ~/_ bmad/custom/genesis/agents/`
- **Join community:** https://github.com/bmad-code-org/BMAD-METHOD

---

## Need Help?

- **Logs:** `~/_bmad-output/genesis/logs/`
- **Issues:** https://github.com/dylaroo/bmad-genesis/issues
- **BMAD Docs:** https://github.com/bmad-code-org/BMAD-METHOD

---

*Happy building! 🎬*

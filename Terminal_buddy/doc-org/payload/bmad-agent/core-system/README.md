# Forge Documentation & Organization System

> **Reviewed & Consolidated:** 2026-02-25
> **Type:** Universal Project Organization Agent

## Overview
This folder defines the **Forge-wide** documentation + organization backbone: universal agents and standards that are **always active** across projects.

## Documentation Manager

### Purpose
A universal project organization agent that ensures:
- ✅ **Session Continuity**: Timestamped logs, handoffs, zero context loss
- ✅ **Documentation Quality**: Zero 404s, consistent standards, no duplicates
- ✅ **Autonomous Operation**: Works efficiently without bottlenecking users
- ✅ **Professional Standards**: Enterprise-grade documentation across all projects

### Components

#### 1. [documentation-manager.md](documentation-manager.md)
**The Persona** - Core identity, competencies, and operational protocol

**Key Features**:
- Auto-manages session logs with timestamps
- Maintains PROJECT_STATUS.md in real-time
- Generates handoff summaries for continuity
- Detects and flags duplicates/404s
- Works autonomously with minimal communication overhead

#### 2. [documentation-manager-tasks.md](documentation-manager-tasks.md)
**The Tasks** - Specific workflows and deliverables

**Primary Tasks**:
1. Session Initialization & Management (auto-execute)
2. Repository Documentation Audit
3. PROJECT_STATUS.md Maintenance
4. Quality Assurance & Standards Enforcement
5. Repository Consolidation & Organization
6. Template & Standards Management

#### 3. [organization-standards.md](organization-standards.md)
**The Standards** - Rules, formats, and conventions

**Covers**:
- File naming conventions (timestamps, kebab-case)
- Folder structure standards
- Timestamp formats (ISO 8601)
- Markdown formatting rules
- Session log structure
- PROJECT_STATUS.md format
- Quality assurance checklists
- Communication protocols

### Auto-Activation
The Documentation Manager is configured via your BMAD/EMAD config (commonly `bmad-agent/bmad-config.json`) to:
- ✅ Auto-activate on every project
- ✅ Run at session start/end
- ✅ Monitor continuously during work
- ✅ Integrate with BMAD/EMAD/Forge personas and workflows

### Integration with Forge Team
Works alongside all team personas:
- **PM (John)**: Track deliverables, status reports
- **Architect (Fred)**: Maintain technical docs
- **Design Architect (Jane)**: Organize UI/UX docs
- **All Members**: Document outputs, enforce standards

## Usage

### For New Projects
1. Documentation Manager auto-activates
2. Creates initial folder structure
3. Initializes SESSION_TEMPLATE, HANDOFF_TEMPLATE
4. Sets up PROJECT_STATUS.md
5. Ready to work with full session tracking

### For Existing Projects
1. Runs audit on first activation
2. Identifies gaps and issues
3. Flags duplicates for review
4. Brings project to standards compliance
5. Maintains ongoing quality

### For AI Agents
When you (an AI agent) work on a project:
1. **Session Start**: Read PROJECT_STATUS.md + last HANDOFF.md
2. **During Work**: Let Documentation Manager track changes
3. **Session End**: Documentation Manager auto-generates summary
4. **Next Session**: Full context available automatically

## Success Metrics
- ✅ 100% session continuity (no lost context)
- ✅ Zero missing timestamps
- ✅ PROJECT_STATUS always current
- ✅ Zero 404 errors
- ✅ No user bottlenecks
- ✅ Enterprise-grade documentation quality

## Version History
- **v1.0.0** (2026-01-07T00:00:00Z): Initial creation with enhanced DocQA integration
- **v1.0.1** (2026-01-07T00:00:00Z): Rename framing to Forge + enforce ISO timestamps

---

**Maintained By**: Documentation Manager (always-on)

**Created**: 2026-01-07T00:00:00Z
**Last Updated**: 2026-01-07T00:00:00Z

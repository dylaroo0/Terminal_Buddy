# Documentation Manager - Core Tasks

## Task 1: Session Initialization & Management
**Objective**: Automatically manage session continuity and documentation

**Auto-Execute on Session Start**:
1. **Create Session Log**
   - Generate: `session-logs/YYYY-MM-DD_HH-mm_description.md`
   - Use SESSION_TEMPLATE.md as base
   - Add timestamp and initial context
   
2. **Load Context**
   - Read PROJECT_STATUS.md for current state
   - Review last HANDOFF.md for continuity
   - Check todo.md for pending work
   
3. **Prepare Workspace**
   - Verify documentation structure exists
   - Ensure all core folders present (session-logs/, technical/, product/, etc.)
   - Ready to track session activities

**During Session**:
1. **Track Changes**
   - Log every file created/modified with timestamp
   - Record decisions and discussions
   - Update PROJECT_STATUS.md in real-time
   
2. **Monitor Quality**
   - Flag 404 errors when found
   - Note duplicate content for review
   - Detect missing timestamps

**Auto-Execute on Session End**:
1. **Finalize Session Log**
   - Complete all sections
   - List all deliverables
   - Document next steps
   
2. **Generate Handoff**
   - Create/update HANDOFF.md with latest summary
   - Include context for next session
   - Update PROJECT_STATUS.md with final state

**Deliverable**: Complete session documentation with full continuity

---

## Task 2: Repository Documentation Audit
**Objective**: Comprehensive audit of documentation structure and quality

**Workflow**:
1. **Branch Structure Analysis**
   - Identify all branches and purposes
   - Assess Git workflow compliance
   - Document consolidation opportunities

2. **Documentation Inventory**
   - Scan all documentation directories
   - Create comprehensive file inventory
   - Map documentation structure
   - Identify categories and gaps

3. **Link Validation & 404 Detection**
   - Extract all links from documentation
   - Test each link for validity
   - Create prioritized list of issues
   - Auto-fix where possible

4. **Timestamp Verification**
   - Check all session logs have timestamps
   - Verify file creation dates documented
   - Flag missing timestamps

5. **Duplicate Content Detection**
   - Scan for similar/duplicate content
   - Flag redundant documentation
   - Suggest consolidation strategies
   - Report to user (don't block)

6. **Quality Assessment**
   - Evaluate completeness against standards
   - Generate quality score
   - Create improvement recommendations

**Deliverable**: Documentation Audit Report with actionable items

---

## Task 3: PROJECT_STATUS.md Maintenance
**Objective**: Keep project status always current and accurate

**Workflow**:
1. **Real-Time Updates**
   - Update as work progresses during session
   - Reflect completion of deliverables
   - Track blockers and open questions
   
2. **Status Synchronization**
   - Sync with session logs
   - Integrate handoff summaries
   - Maintain consistency with todo.md

3. **Content Structure**
   - Current project phase
   - Active work streams
   - Recent completions
   - Next priorities
   - Known issues
   
4. **Timestamp Management**
   - Last updated timestamp
   - Phase completion dates
   - Milestone tracking

**Deliverable**: Always-current PROJECT_STATUS.md

---

## Task 4: Quality Assurance & Standards Enforcement
**Objective**: Maintain documentation quality autonomously

**Workflow**:
1. **Automated Checks** (Run Silently)
   - Link validation
   - Cross-reference integrity
   - Timestamp presence
   - File naming conventions
   - Markdown formatting consistency

2. **Issue Detection**
   - 404 errors → Fix immediately or flag
   - Missing timestamps → Add when possible
   - Duplicates → Flag for user review
   - Broken links → Report with location

3. **Standards Compliance**
   - Enforce file naming: `kebab-case.md`
   - Session logs: `YYYY-MM-DD_HH-mm_description.md`
   - Folder structure: Maintain established hierarchy
   - Markdown: Consistent formatting

4. **Reporting** (Concise)
   - Brief status: "Scanned 47 files, found 2 issues, fixed 1, flagged 1 duplicate"
   - Don't interrupt workflow
   - Log findings in session log

**Deliverable**: High-quality documentation with minimal user intervention

---

## Task 5: Repository Consolidation & Organization
**Objective**: Clean repository structure with zero data loss

**Workflow**:
1. **Pre-Consolidation Safety**
   - Create backup references
   - Document current state
   - Plan merge strategy
   - Ensure rollback possible

2. **Content Analysis**
   - Identify unique content in each location
   - Map overlaps and conflicts
   - Determine authoritative sources
   - Plan preservation strategy

3. **Branch Management**
   - Implement main/develop/feature structure
   - Configure branch protection
   - Establish merge policies

4. **Content Consolidation**
   - Merge valuable content systematically
   - Resolve conflicts preserving all data
   - Validate integrity after consolidation
   - Update all references

5. **Verification**
   - Confirm zero data loss
   - Validate all links
   - Test documentation accessibility
   - Update PROJECT_STATUS.md

**Deliverable**: Professional repository structure with complete documentation

---

## Task 6: Template & Standards Management
**Objective**: Maintain reusable templates and documentation standards

**Workflow**:
1. **Template Library**
   - SESSION_TEMPLATE.md
   - HANDOFF_TEMPLATE.md
   - Project root files (PROJECT_STATUS, CHANGELOG, etc.)
   - Document type templates

2. **Standards Documentation**
   - File naming conventions
   - Folder structure guidelines
   - Markdown formatting rules
   - Timestamp formats

3. **Quality Checklists**
   - Session completion checklist
   - Handoff requirements
   - Documentation audit criteria

4. **Continuous Improvement**
   - Track what works well
   - Update templates based on usage
   - Refine standards as needed

**Deliverable**: Comprehensive template library for project consistency

---

## Success Criteria for All Tasks
- ✅ Session continuity: 100%
- ✅ Timestamps: All session logs and critical files
- ✅ PROJECT_STATUS accuracy: Always current
- ✅ 404 errors: Zero
- ✅ Duplicate content: Flagged and tracked
- ✅ User bottlenecks: None (work autonomously)
- ✅ Documentation quality: Enterprise-grade

---

**Version**: 1.0.1

**Created**: 2026-01-07T00:00:00Z
**Last Updated**: 2026-01-07T00:00:00Z

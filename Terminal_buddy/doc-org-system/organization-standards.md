# Documentation Manager - Standards & Protocols

## File Naming Conventions

### Session Logs
**Format**: `YYYY-MM-DD_HH-mm_description.md`

**Examples**:
- `2026-01-07_14-30_architecture-review.md`
- `2026-01-07_09-15_new-session.md`
- `2026-01-06_17-42_memvid-integration-discussion.md`

**Rules**:
- Always use 24-hour time format
- Use kebab-case for description
- Keep description short but meaningful
- Store in `session-logs/` folder

### Handoff Documents
**Format**: `YYYY-MM-DD_HANDOFF.md` or `YYYY-MM-DD_handoff.md`

**Location**: `session-logs/`

**Purpose**: End-of-day or end-of-session summary for continuity

### Project Root Files
**Standard Names** (always present):
- `PROJECT_STATUS.md` - Current project state
- `CHANGELOG.md` - Version history and changes
- `README.md` - Project overview
- `todo.md` - Task tracking
- `.gitignore` - Git exclusions

### Documentation Files
**Format**: `kebab-case-descriptive-name.md`

**Examples**:
- `technical-architecture.md`
- `api-documentation.md`
- `user-guide.md`
- `deployment-guide.md`

---

## Folder Structure Standards

### Required Root-Level Folders
```
project-root/
├── session-logs/          ← All session documentation
├── technical/             ← Technical specs, architecture
├── product/               ← Product docs, roadmaps
├── marketing/             ← Marketing content
├── bmad-agent/           ← BMAD system files
│   ├── core-system/       ← Universal documentation manager
│   ├── personas/          ← Team member personas
│   ├── tasks/             ← Task definitions
│   ├── templates/         ← Reusable templates
│   ├── checklists/        ← Quality checklists
│   └── data/              ← Knowledge base
└── assets/                ← Images, diagrams, etc.
```

### Folder Naming
- Use `kebab-case` for all folders
- Keep names concise and descriptive
- Group related content logically

---

## Timestamp Formats

### ISO 8601 Standard
**Full timestamp**: `YYYY-MM-DDTHH:mm:ss.sssZ`
**Example**: `2026-01-07T14:30:45.123Z`

**Date only**: `YYYY-MM-DD`
**Example**: `2026-01-07`

**Time only**: `HH:mm UTC`
**Example**: `14:30 UTC`

### Usage Guidelines
- Session logs: Use date + time in filename
- Document headers: Use full ISO 8601 with timezone
- Status updates: Use `YYYY-MM-DD HH:mm UTC`
- Git commits: Rely on Git's automatic timestamps

---

## Markdown Formatting Standards

### Headers
- Use `#` for title (H1) - one per document
- Use `##` for main sections (H2)
- Use `###` for subsections (H3)
- Use `####` for sub-subsections (H4) - rarely needed

### Lists
- Use `-` for unordered lists (not `*` or `+`)
- Use `1.` for ordered lists (auto-numbering)
- Indent nested lists with 2 spaces

### Code Blocks
```markdown
Use triple backticks with language identifier:
```python
def example():
    return "formatted code"
```
```

### Links
- Internal: `[Link Text](relative/path/file.md)`
- External: `[Link Text](https://example.com)`
- Headers: `[Link Text](#header-anchor)`

### Emphasis
- **Bold**: `**important text**`
- *Italic*: `*emphasized text*`
- `Code`: `` `inline code` ``

### Status Indicators
- ✅ Complete
- 🚧 In Progress
- 🟡 Pending
- ❌ Blocked
- 🟢 Active
- 🔴 Critical

---

## Session Log Structure

### Required Sections
1. **Header** - Title, date, time, participants, session type
2. **Session Summary** - Brief context and overview
3. **Key Discussion Points** - Main topics with timestamps
4. **Files Modified/Created** - All changes documented
5. **Deliverables & Outcomes** - What was completed
6. **Next Steps** - Action items and priorities
7. **Context for Next Session** - Continuity information

### Template Location
`session-logs/SESSION_TEMPLATE.md`

---

## PROJECT_STATUS.md Structure

### Required Sections
1. **Current Phase** - Where the project is now
2. **Recent Completions** - Last 5-7 days of work
3. **Active Work Streams** - Ongoing efforts with status
4. **Next Priorities** - What's coming up
5. **Known Issues** - Blockers and challenges
6. **Last Updated** - Timestamp of last change

### Update Frequency
- Real-time during active sessions
- End of every session (guaranteed)
- After major milestones

---

## Quality Assurance Checklist

### Session Start
- [ ] Session log created with timestamp
- [ ] PROJECT_STATUS.md reviewed
- [ ] Last HANDOFF.md reviewed
- [ ] Context loaded and ready

### During Session
- [ ] All file changes tracked
- [ ] Timestamps added to new files
- [ ] Links validated as created
- [ ] Duplicates flagged if found
- [ ] PROJECT_STATUS updated in real-time

### Session End
- [ ] Session log completed (all sections)
- [ ] Deliverables documented
- [ ] Next steps clearly defined
- [ ] HANDOFF summary generated
- [ ] PROJECT_STATUS.md finalized
- [ ] All timestamps current

### Weekly Maintenance
- [ ] Full link validation scan
- [ ] Duplicate content review
- [ ] Documentation audit
- [ ] Template updates if needed
- [ ] Standards compliance check

---

## Communication Protocol

### When to Report Issues
**Report immediately** (but don't block):
- Critical 404 errors
- Data loss risk
- Security concerns

**Flag for review** (non-blocking):
- Duplicate content found
- Outdated information detected
- Missing documentation noticed
- Inconsistent formatting

**Fix silently**:
- Missing timestamps (when obvious)
- Broken internal links (when target exists)
- Formatting inconsistencies
- File naming issues

### Report Format
**Concise**: "Scanned 47 files: fixed 3 links, flagged 2 duplicates in /docs"

**Not verbose**: ❌ "I'm now going to scan your files for quality issues. I found several problems that I think we should address. Let me explain each one..."

---

## Integration Points

### With BMAD Personas
- **PM (John)**: Provide status reports, track deliverables
- **Architect (Fred)**: Maintain technical documentation
- **Design Architect (Jane)**: Organize UI/UX documentation
- **All Team Members**: Ensure their outputs are documented

### With Git Workflow
- Auto-generate `.gitignore` if missing
- Respect branch structure (main/develop/feature)
- Document all major commits in CHANGELOG.md

### With Development Tools
- Compatible with VS Code, Cursor, other IDEs
- Markdown preview-friendly formatting
- Mermaid diagram support
- CI/CD integration ready

---

## Success Metrics

### Session Continuity
- ✅ 100% of sessions have timestamped logs
- ✅ Zero context loss between sessions
- ✅ Handoff summaries always generated

### Documentation Quality
- ✅ 0 broken internal links
- ✅ 0 missing timestamps on session logs
- ✅ PROJECT_STATUS accuracy: 100%
- ✅ All files follow naming conventions

### Efficiency
- ✅ No user bottlenecks
- ✅ Issues fixed autonomously when possible
- ✅ Concise, actionable reporting

---

**Version**: 1.0.1

**Created**: 2026-01-07T00:00:00Z
**Last Updated**: 2026-01-07T00:00:00Z
**Maintained By**: Documentation Manager

# Terminal Buddy — Coordinated Development Plan

> **Date:** 2026-02-25
> **Status:** ACTIVE
> **Purpose:** Divide work across Claude Code, Qwen Code, and Gemini to avoid duplication

---

## Tool Territory Map

### Qwen Code — The Brain (Rust Daemon)

**Files:** `terminal-buddy/buddy-daemon/src/`, `terminal-buddy/shared/src/`

**Current work (Phase 1A):**
- Expanded `SystemMonitor` with `DeepSystemSnapshot` (DONE)
  - Top 10 processes by CPU + RAM
  - Open network ports with owning process
  - Running systemd services
  - Recently installed packages (apt, cargo, npm)
  - Boot items (systemd, cron)
  - Hostname, uptime, kernel version
- Wire `deep_snapshot()` into `buddy_system_health` MCP tool as structured JSON
- Add `buddy_history_range(from, to)` for date-range queries
- Add `buddy_import_shell_history()` for shell history import

**Future work:**
- Package installation tracking over time
- Service/port change detection
- Smarter cleanup (orphaned packages, Docker prune candidates)
- Vector embeddings for semantic search (candle-transformers)
- Event graph / causal chains (petgraph)

### Claude Code — The Face (React/TypeScript Frontend)

**Files:** `terminal-buddy/buddy-app/src/`, `docs/`, project-level files

**Current work:**
- Widget registry system (modular, composable dashboard)
- System awareness widgets (ProcessViewer, PortMonitor, ServiceStatus, etc.)
- Workspaces view (renamed from "Topics" — session grouping by project/activity)
- Wire frontend to Qwen's expanded daemon APIs
- Layout presets (Overview, Journal Focus, System Admin, Developer, Minimal)

**Future work:**
- Drag-and-drop widget placement (react-grid-layout)
- Widget settings/configuration per-widget
- Memvid Canvas deep integration
- Voice input (Task 9)

### Gemini — The Designer (Pencil/Figma)

**Tools:** Pencil MCP, Figma MCP

**Current work:**
- Creator Corner UI designs and mockups
- Template editor with live preview
- Drag-and-drop layout builder
- Community template browser

**Future work:**
- Design system refinements
- Component library designs
- Mobile-responsive layouts

---

## Shared Contract

The interface between brain (Qwen) and face (Claude) is:

| File | Owner | Purpose |
|------|-------|---------|
| `terminal-buddy/shared/src/lib.rs` | Qwen | Shared Rust types (structs, enums) |
| `terminal-buddy/buddy-app/src/utils/tauri-mcp.ts` | Claude | TypeScript API bridge matching daemon types |

**Protocol:** When Qwen adds/changes a daemon tool or type, update `QWEN.md` with the new signature. Claude reads that to build matching UI.

---

## Naming Decision

**"Topics" is renamed to "Workspaces"** — groups sessions by project/activity/working directory. More intuitive than "Topics" for terminal work.

---

## Data Contract: DeepSystemSnapshot

Qwen's daemon returns structured JSON (not formatted text):

```json
{
  "timestamp": "2026-02-25T09:51:00Z",
  "cpu_usage_pct": 58.2,
  "memory_used_bytes": 12560000000,
  "memory_total_bytes": 17179869184,
  "memory_usage_pct": 73.1,
  "disk_used_bytes": 158913789952,
  "disk_total_bytes": 511101108224,
  "disk_usage_pct": 31.1,
  "process_count": 287,
  "top_cpu_processes": [
    { "pid": 14523, "name": "chrome", "cpu_usage": 12.3, "memory_bytes": 2147483648, "memory_percent": 12.5, "status": "running" }
  ],
  "top_memory_processes": [...],
  "open_ports": [
    { "port": 3000, "protocol": "tcp", "process_name": "node", "state": "LISTEN" }
  ],
  "running_services": [
    { "name": "docker", "status": "running", "enabled": true }
  ],
  "recently_installed_packages": [
    { "name": "ripgrep", "version": "14.1.0", "package_type": "cargo" }
  ],
  "boot_items": [
    { "name": "docker", "item_type": "systemd", "enabled": true }
  ],
  "hostname": "dylaroo-desktop",
  "uptime_seconds": 280920,
  "kernel_version": "6.8.0-101-generic"
}
```

---

## Widget Registry Architecture

Each UI widget is a self-contained React component registered in a central registry:

```typescript
interface WidgetDefinition {
  id: string;
  name: string;
  icon: LucideIcon;
  component: React.ComponentType<WidgetProps>;
  category: 'journal' | 'system' | 'terminal' | 'tools';
  defaultSize: { cols: number; rows: number };
  minSize: { cols: number; rows: number };
  refreshInterval?: number;
}
```

**Available widgets:**
- Journal Timeline (journal)
- Workspaces / folder tree (journal)
- Search (journal)
- System Health gauges (system)
- Process Viewer table (system)
- Port Monitor (system)
- Service Status badges (system)
- Cleanup Dashboard (system)
- Terminal (terminal)
- Memvid Canvas (tools)

**Layout presets** are saved widget arrangements:
- Overview: all 6 core widgets in 3x2 grid
- Journal Focus: large journal + small health/terminal
- System Admin: health + processes + ports + services + terminal
- Developer: terminal (large) + journal + processes + health
- Minimal: journal + health only

---

## Visual Mockup

Interactive HTML mockup at: `terminal-buddy-dashboard-mockup.html`
Open in browser to see layout presets and widget designs.

---

## Phase B Task Updates

| Task | Status | Owner |
|------|--------|-------|
| 5. Workspaces View (was Topics) | Next up | Claude |
| 9. Voice Input | After widgets | Claude |
| 10. Creator Corner MVP | In design | Gemini |
| 11. Polish & Package | After all | All |
| NEW: Widget Registry | Next up | Claude |
| NEW: Deep System Health | Building | Qwen |
| NEW: Date-Range History | Planned | Qwen |
| NEW: Shell History Import | Planned | Qwen |

---

*This plan is the coordination contract between all three AI tools working on Terminal Buddy.*

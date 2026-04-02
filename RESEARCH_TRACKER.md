# Terminal Emulator Research Tracker

**Dylaroo's Hunt for Terminal UI Patterns**\
**Date:** 2026-03-28

## 🎯 What We're Looking For

1. **Newer Terminal Buddy version** — might have split panes / tabs already built
2. **System monitoring deep dives** — MCP apps that show real-time metrics
3. **Terminal UI superpowers** — rich, interactive patterns for navigating/controlling the system
4. **Power command sheets** — reference for awesome terminal commands

***

## 📍 Found So Far

### ✅ In Current Repo

| Project | Location | Purpose | Status | Why It Matters |
|---------|----------|---------|--------|----------------|
| **system-monitor-server** ⭐ | `/ext-apps/examples/system-monitor-server/` | Real-time: CPU (per-core chart) + Memory (bar gauge) | 📖 **KEY REF** | Pattern for Task 6: show system impact of commands in split pane |
| **rich-master** | `/rich-master/` | Terminal typography, tables, layouts | 📚 Ref library | Typography + data visualization patterns |
| **excalidraw sketches** | `/Terminal_buddy/.excalidraw-copilot/` | Past design whiteboarding | 📋 Archive | Context on past design decisions |

### 📂 In `~/terminal_Buddy/inspiration/`

| Project | Purpose | To Review |
|---------|---------|-----------|
| **atuin** | Command history + search + metadata | ✅ Has power commands |
| **yazi** | Multi-pane file navigator | ✅ Split pane patterns |
| **nvim** | Neovim config + window management | ✅ Pane layout ideas |
| **ez-stack** | Tab management | ✅ Tab patterns |
| **system-monitor-main** | System monitoring dashboard | ✅ Metrics UI |

***

## 🔍 Still Hunting

* \[ ] **Power commands sheet** — Check: `/home/dylaroo/Downloads/terminal-buddy-index.docx`
* \[ ] **tmux-powerline patterns** — Found in `/home/dylaroo/Downloads/tmux-powerline-main/` (styling for prompts)
* \[ ] **claude-tui commands** — In `/home/dylaroo/Downloads/claude-tui-main/`
* \[ ] **Newer Terminal Buddy** — You found one earlier; need to locate path
* \[ ] **Other system monitoring patterns** — check system-monitor-server + ~/terminal\_Buddy/inspiration/system-monitors/

***

## 📝 Next Steps

1. **Review system-monitor-server** — check what MCP patterns it uses
2. **Scan ~/terminal\_Buddy/inspiration/** — look for split pane + metadata patterns
3. **Find that Terminal MCP app** — you know where it should be
4. **Locate power commands sheet** — might be in Desktop, Downloads, or Docs

***

## 🎓 What We'll Do With This

Once you have the reference projects cataloged:

1. **BMAD Master** will analyze patterns (split panes, tabs, metadata display)
2. **Terminal Specialist** will design the split pane architecture
3. **Sally** will spec the UX
4. **Amelia** will implement Task 5 & 6

# Terminal Buddy Project Anchor
> **Created:** 2026-02-26
> **Purpose:** Prevent IDE from hijacking project when moving between screens
> **Status:** ACTIVE - This file anchors the project root

---

## Project Identity

This is the **Terminal Buddy** project repository. The canonical project root is:
```
/home/dylaroo/projects/Terminal_buddy/
```

### Critical Directories
- `terminal-buddy/` - Main workspace (Rust + Tauri)
- `e.Front-end-Deposit-Resources/` - Front-end resources
- `memvid-main/` - Memvid memory engine
- `data/excalidraw-mcp-0.3.2/` - Excalidraw whiteboard MCP

### IDE Configuration
- **VSCode**: Add to `.vscode/settings.json`:
  ```json
  {
    "files.watcherExclude": {
      "**/node_modules/**": true,
      "**/.git/**": true,
      "**/target/**": true
    },
    "typescript.preferences.includePackageJsonAutoImports": "auto"
  }
  ```

- **Claude Desktop**: Use this as project root
- **Antigravity IDE**: Set workspace to this directory

---

## Anti-Gravity IDE Fix

The issue you described (IDE switching projects when moving between screens) is caused by:
- IDE auto-detecting git repositories  
- Workspace root confusion
- Multiple project directories in same parent folder

### Solution: Create Project Boundary

Add this to your shell profile (`~/.bashrc` or `~/.zshrc`):
```bash
# Terminal Buddy Project Anchor
export TERMINAL_BUDDY_ROOT="/home/dylaroo/projects/Terminal_buddy"
cd "$TERMINAL_BUDDY_ROOT" && echo "✅ Terminal Buddy project anchored"
```

Then run:
```bash
source ~/.bashrc
```

---

## Quick Whiteboard Launch

Since you want to draw the Gazebo RIGHT NOW, here's how:

### Option 1: Local Excalidraw MCP (Fastest)
```bash
cd /home/dylaroo/projects/Terminal_buddy/data/excalidraw-mcp-0.3.2
npm install
npm run dev
```

### Option 2: Use Existing tldraw
The buddy-app already has tldraw installed! Once the app is running, I'll help you add a whiteboard tab.

---

## Success Criteria

✅ IDE stops hijacking project when moving between screens  
✅ Whiteboard available for Gazebo drawing  
✅ Traffic light notifications working  
✅ Communication logs visible

**What's your priority?** Let me execute it NOW.
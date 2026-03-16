# Terminal Buddy Modules

**Status:** ACTIVE  
**Last Updated:** 2026-02-24  
**Based on:** PRODUCT_SPEC_V2.md

---

## Overview

Terminal Buddy uses a **modular architecture** where each feature is a self-contained module that registers itself with the Component Registry. Modules can be enabled/disabled via Creator Corner and are arranged in a flexible layout system.

---

## Core Modules (Required)

These modules are always enabled and form the foundation of Terminal Buddy:

### 1. **Session Module** (`session`)
**Location:** `buddy-app/src/modules/session/`  
**Purpose:** Primary interface - session history organized by date and subject  
**Views:** Timeline, Topics, Search  
**Key Features:**
- Session-based history (not individual commands)
- Auto-titling and topic grouping
- Command cards with Explain/Re-run/Add Note actions
- Memvid Canvas integration for semantic search

📄 [Documentation](./session-module.md)

---

### 2. **Terminal Pane Module** (`terminal-pane`)
**Location:** `buddy-app/src/modules/terminal-pane/`  
**Purpose:** Interactive terminal emulator (xterm.js)  
**Key Features:**
- Full VT100/ANSI terminal emulation
- PTY integration via Tauri backend
- Output capture for daemon correlation
- Collapsible/resizeable layout (35% height default)
- Theme synchronization with CSS variables

📄 [Documentation](./terminal-pane-module.md)

---

### 3.NOT A MODULE!!! A WORKSHOP! **Creator Corner Module** (`creator-corner`)
**Location:** `buddy-app/src/modules/creator-corner/`  
**Purpose:** Customization engine - design, customize, and share your experience  
**Editors:**
- Theme Editor (fonts, colors, spacing with WCAG checking)
- Layout Editor (drag-and-drop module positions)
- Component Editor (enable/disable components)
- Template Editor (save, share, install templates)
I have an idea brewing of having different spaces, and in a kind of a gazebo shape, and having each kind of section of the gazebo will have different building materials, like like rust, or Python, and Go, and but they'll have color, only one color schemes like yellow and red in that area.Of that one, so they, and then it goes around in a big circle where the whole spectrum of colors are, but the blocks will be only the Python blocks will only be in that color, but then it could be just kind of a fun. It's a work in progress because I was trying to learn about this stuff.So I think it could be fun.?DYLAROOFEB 26
📄 [Documentation](./creator-corner-module.md)

---

### 4. **weird name?? i dont know what it means??Component Registry Module** (`component-registry`)
**Location:** `buddy-app/src/modules/registry/`  
**Purpose:** Central nervous system - module registration and management  
**Key Features:**
- Module registration with metadata
- Discovery system (query by capability)
- Lifecycle management (enable/disable)
- JSON Schema validation for all configs
- Dependency resolution

📄 [Documentation](./component-registry-module.md)

---

## Planned Modules

These modules are specified but not yet documented:

### 5. **Voice Input Module** (`voice-input`)   WITH SUMMERIZER !
**Status:** Planned  
**Purpose:** Voice-to-text input via whisper-rs  
**Key Features:**
- Push-to-talk (configurable keybinding)
- Local processing (whisper-rs in daemon)
- Voice command recognition
- TTS integration for explanations

---

### 6. **Theme System Module** (`theme-system`)
**Status:** Planned  
**Purpose:** CSS variable theme management  
**Key Features:**
- 50+ CSS custom properties
- Theme presets (Dyslexia Dark/Light, High Contrast, etc.)
- WCAG AAA contrast checking
- Live theme preview
- Template export/import

---

### 7. **Onboarding Module** (`onboarding`)
**Status:** Planned  
**Purpose:** First-run wizard  
**Key Features:**
- Interaction mode selection (voice/keyboard/hybrid)
- Font and accessibility preferences
- TTS provider setup
- One-click "Use Recommended Setup" path
- Links to Creator Corner for deep customization

---

### 8. **MCP App Module** (`mcp-app`)Excalidraw MCP App Server
**Status:** Planned  
**Purpose:** iframe distribution (embedded in Claude/Cursor)  
**Key Features:**
- Same React components as standalone app
- Journal view (timeline + topics + search)
- Session history browsing
- Explain button on past commands
- No terminal pane (host has one)

---

### 9. **System Health Module** (`system-health`)
**Status:** Planned  
**Purpose:** System monitoring dashboard  
**Key Features:**
- CPU, memory, disk usage
- Process monitoring
- Cleanup suggestions
- Historical trends

---

### 10. **Voice Output Module** (`voice-output`)
**Status:** Planned  
**Purpose:** Text-to-speech for explanations  
**Key Features:**
- Multiple TTS providers (local, ElevenLabs, Quen)
- Voice selection and customization
- Speed/pitch control
- Automatic explanation narration

---

## Module Architecture

### Registration Pattern

Each module registers itself with the Component Registry:
??? SEEE NO DIAGRAM?
```typescript
// modules/session/index.ts
import { registry } from '../registry';
import { SessionPanel } from './SessionPanel';

registry.register({
  id: 'session',
  name: 'Session History',
  description: 'Timeline and topics of your terminal history',
  component: SessionPanel,
  icon: BookOpenIcon,
  allowedRegions: ['left', 'center'],
  requiresDaemon: true,
  requiresVoice: false,
  configSchema: { /* JSON Schema */ },
  defaultConfig: { /* defaults */ }
});
```

### Module Lifecycle

```
Register → Enable → Configure → Render → Disable → Unregister
```

1. **Register** - Module adds itself to registry
2. **Enable** - User enables module via Creator Corner
3. **Configure** - User customizes module settings
4. **Render** - Module component appears in layout
5. **Disable** - User disables module (if no dependents)
6. **Unregister** - Module removes itself (rare)

### Layout System

Modules are arranged in regions:

```
+------------------+------------------+
|                  |                  |
|    Left          |    Center        |
|  (Session)       |  (Main content)  |
|                  |                  |
+------------------+------------------+
|                  |
|    Bottom        |ANYWAY USER WANTS MANNY TERMINALSSS !! MAYBE 
|  (Terminal)      |
|                  |
+------------------+
```

**Regions:**
- `left` - Left sidebar (Session, Topics)
- `right` - Right sidebar (System Health, Notes)
- `bottom` - Bottom panel (Terminal, Voice)
- `center` - Main content area
- `floating` - Floating panels (overlays, modals)

---

## Module Dependencies

```
Component Registry (core - no dependencies)
    ↓
Session (depends on: none)
Terminal Pane (depends on: none)
Creator Corner (depends on: Component Registry)
Theme System (depends on: none)
    ↓
Voice Input (depends on: Terminal Pane)
Voice Output (depends on: Session)
System Health (depends on: none)
    ↓
Onboarding (depends on: all core modules)
MCP App (depends on: Session, Theme System)
```

---

## Creating New Modules

### Step 1: Scaffold Module

```bash
mkdir -p buddy-app/src/modules/my-module/{components,hooks,utils}
```

### Step 2: Create Module Registration

```typescript
// modules/my-module/index.ts
import { registry } from '../registry';
import { MyModulePanel } from './MyModulePanel';

registry.register({
  id: 'my-module',
  name: 'My Module',
  description: 'What my module does',
  component: MyModulePanel,
  icon: MyIcon,
  allowedRegions: ['right'],
  requiresDaemon: false,
  requiresVoice: false,
  configSchema: { /* JSON Schema */ },
  defaultConfig: { /* defaults */ }
});
```

### Step 3: Build Component

```tsx
// modules/my-module/MyModulePanel.tsx
export function MyModulePanel({ config }: MyModulePanelProps) {
  return (
    <div className="my-module-panel">
      {/* Module content */}
    </div>
  );
}
```

### Step 4: Add to Creator Corner

Module automatically appears in Creator Corner's component editor.

### Step 5: Test in Storybook DID WE? I WANT TO SOON!

```tsx
// modules/my-module/MyModulePanel.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof MyModulePanel> = {
  component: MyModulePanel,
};

export default meta;
type Story = StoryObj<typeof MyModulePanel>;

export const Default: Story = {
  args: {
    config: {
      /* default config */
    }
  }
};
```

---

## Module Best Practices

### DO:
- ✅ Give modules descriptive names and IDs
- ✅ Provide JSON Schema for all config options
- ✅ Include defaultConfig values
- ✅ Specify allowedRegions accurately
- ✅ List all dependencies
- ✅ Write Storybook stories
- ✅ Test accessibility (WCAG AAA)
- ✅ Use CSS variables for theming

### DON'T:
- ❌ Access SQLite directly (use MCP tools)
- ❌ Import other module components directly (use registry)
- ❌ Hardcode theme values (use CSS variables)
- ❌ Skip config validation
- ❌ Forget to specify dependencies
- ❌ Ignore accessibility requirements

---

## Module Configuration Storage

All module configuration is stored in:

**Local:** `~/.terminal-buddy/buddy.toml`  
**Daemon:** SQLite (via MCP tools)

### Config Schema

```typescript
{
  appearance: { /* theme settings */ },
  interaction: { /* input mode, hotkeys */ },
  components: { /* enabled/disabled modules */ },
  layout: { /* module positions */ },
  voice: { /* TTS settings */ },
  sessions: { /* session behavior */ }
}
```

---

## Related Documentation

- [PRODUCT_SPEC_V2.md](../specs/PRODUCT_SPEC_V2.md) - Product specification
- [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) - Design system reference
- [TECHNICAL_REFERENCE.md](../TECHNICAL_REFERENCE.md) - Tech stack and dependencies
- [MEMVID_CANVAS_SDK.md](../REF_MEMVID_CANVAS_SDK.md) - Memvid Canvas integration

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-24 | Initial module documentation (Session, Terminal Pane, Creator Corner, Component Registry) |

---

*Module documentation follows the PRODUCT_SPEC_V2.md specification. Each module document provides detailed implementation guidance.*

# Terminal Pane Module

**Module ID:** `terminal-pane`  
**Status:** Core (Required)  
**Location:** `buddy-app/src/modules/terminal-pane/`

---

## 1. Overview

The Terminal Pane module provides the **actual terminal emulation** in Terminal Buddy. It's a collapsible, resizable pane that embeds xterm.js within the Journal-focused UI.

### 1.1 Purpose

The Terminal Pane module provides:
- **Full terminal emulation** via xterm.js (VT100/ANSI sequences)
- **PTY integration** via Tauri's Rust backend
- **Output capture** for correlation with the daemon
- **Collapsible/resizeable** layout (35% height default)
- **Focus mode** - expand to full-screen when needed

### 1.2 Key Principle

> "The terminal is dumb - just a renderer. All state and intelligence lives in the daemon."

The Terminal Pane is **not** the primary interface. It's a tool within the Journal. Users spend most of their time in the Journal view, not the terminal.

---

## 2. Architecture

### 2.1 Module Structure

```
modules/terminal-pane/
├── index.ts                    # Module registration
├── TerminalPanel.tsx           # Main panel component
├── hooks/
│   ├── usePTY.ts               # PTY connection management
│   ├── useTerminalOutput.ts    # Output capture for daemon
│   └── useTerminalTheme.ts     # Theme synchronization
├── utils/
│   ├── pty-bridge.ts           # Tauri command bridge
│   └── output-parser.ts        # Parse terminal output for correlation
└── stories/
    └── TerminalPanel.stories.tsx
```

### 2.2 Dependencies

| Dependency | Purpose |
|------------|---------|
| `xterm` | Terminal emulation core |
| `xterm-addon-fit` | Auto-fit to container |
| `xterm-addon-web-links` | Clickable URLs |
| `xterm-addon-search` | Search within terminal |
| `@tauri-apps/api` | Tauri commands for PTY |
| `buddy-daemon` (via MCP) | Output correlation |

### 2.3 Data Flow

```
┌─────────────────┐
│  TerminalPanel  │
│   (xterm.js)    │
└────────┬────────┘
         │ Tauri Commands
         v
┌─────────────────┐
│  Tauri Backend  │
│   (Rust)        │
└────────┬────────┘
         │ stdio
         v
┌─────────────────┐
│   Shell (bash, │
│   zsh, fish)   │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Buddy Daemon   │
│  (output stream │
│   for correla-  │
│   tion)         │
└─────────────────┘
```

---

## 3. Module Registration

### 3.1 Registration Code

```typescript
// modules/terminal-pane/index.ts
import { registry } from '../registry';
import { TerminalPanel } from './TerminalPanel';
import { TerminalIcon } from 'lucide-react';

registry.register({
  id: 'terminal-pane',
  name: 'Terminal',
  description: 'Interactive terminal emulator',
  component: TerminalPanel,
  icon: TerminalIcon,
  
  // Where it can live in the layout
  allowedRegions: ['bottom', 'center', 'floating'],
  
  // Requirements
  requiresDaemon: true,
  requiresVoice: false,
  
  // Config schema for Creator Corner
  configSchema: {
    type: 'object',
    properties: {
      defaultHeight: { 
        type: 'number', 
        default: 35,
        description: 'Default height as percentage of viewport'
      },
      collapsedByDefault: { 
        type: 'boolean',
        default: false,
        description: 'Start collapsed on app launch'
      },
      shell: { 
        type: 'string',
        enum: ['bash', 'zsh', 'fish', 'powershell'],
        default: 'bash',
        description: 'Default shell to spawn'
      },
      fontSize: {
        type: 'number',
        default: 14,
        description: 'Terminal font size'
      },
      cursorBlink: {
        type: 'boolean',
        default: true,
        description: 'Blinking cursor'
      },
      scrollback: {
        type: 'number',
        default: 10000,
        description: 'Number of lines to keep in scrollback'
      }
    }
  }
});
```

---

## 4. Implementation

### 4.1 Main Component

```tsx
// modules/terminal-pane/TerminalPanel.tsx
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { useEffect, useRef, useState } from 'react';
import { usePTY } from './hooks/usePTY';
import { useTerminalOutput } from './hooks/useTerminalOutput';

interface TerminalPanelProps {
  config: TerminalConfig;
  onOutput?: (output: string) => void;
}

export function TerminalPanel({ config, onOutput }: TerminalPanelProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const { ptyId, sendToPTY } = usePTY(config.shell);
  
  // Capture output for daemon correlation
  useTerminalOutput(terminal, onOutput);
  
  useEffect(() => {
    if (!terminalRef.current) return;
    
    // Initialize xterm.js
    terminal.current = new Terminal({
      fontSize: config.fontSize,
      cursorBlink: config.cursorBlink,
      scrollback: config.scrollback,
      theme: getTerminalTheme(config.theme),
      fontFamily: 'JetBrains Mono, monospace',
      allowProposedApi: true,
    });
    
    // Add addons
    fitAddon.current = new FitAddon();
    terminal.current.loadAddon(fitAddon.current);
    terminal.current.loadAddon(new WebLinksAddon());
    
    // Open in DOM
    terminal.current.open(terminalRef.current);
    fitAddon.current.fit();
    
    // Handle input
    terminal.current.onData(data => {
      sendToPTY(data);
    });
    
    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.current?.fit();
    });
    resizeObserver.observe(terminalRef.current);
    
    return () => {
      terminal.current?.dispose();
      resizeObserver.disconnect();
    };
  }, []);
  
  // Apply theme changes
  useEffect(() => {
    if (terminal.current) {
      terminal.current.options.theme = getTerminalTheme(config.theme);
    }
  }, [config.theme]);
  
  return (
    <div className="terminal-panel" data-height={config.defaultHeight}>
      <div className="terminal-header">
        <span className="terminal-title">Terminal</span>
        <button 
          onClick={() => sendToPTY('\x03')}
          aria-label="Interrupt current command"
        >
          <StopIcon />
        </button>
        <button 
          onClick={() => sendToPTY('\x0c')}
          aria-label="Clear terminal"
        >
          <TrashIcon />
        </button>
      </div>
      <div ref={terminalRef} className="terminal-body" />
    </div>
  );
}

function getTerminalTheme(theme: string) {
  return {
    background: getCSSVariable(`--tb-${theme}-bg`),
    foreground: getCSSVariable(`--tb-${theme}-fg`),
    cursor: getCSSVariable(`--tb-${theme}-cursor`),
    selection: getCSSVariable(`--tb-${theme}-selection`),
    // ... color palette
  };
}
```

### 4.2 PTY Bridge (Tauri Commands)

```rust
// src-tauri/src/pty.rs
use tauri::command;
use tokio::sync::mpsc;
use portable_pty::{CommandBuilder, NativePtySystem, PtySize, PtySystem};
use std::sync::Arc;

#[derive(Clone)]
pub struct PtyState {
    pub pty_id: String,
    pub writer: Arc<dyn std::io::Write + Send + Sync>,
    pub reader: mpsc::Receiver<String>,
}

#[command]
pub async fn pty_spawn(shell: String) -> Result<String, String> {
    let pty_system = NativePtySystem::default();
    
    let cmd = CommandBuilder::new_shell();
    let pair = pty_system
        .openpty(PtySize {
            rows: 24,
            cols: 80,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|e| e.to_string())?;
    
    let mut child = pair
        .slave
        .spawn_command(cmd)
        .map_err(|e| e.to_string())?;
    
    let (tx, rx) = mpsc::channel(100);
    
    // Read output in background
    let mut reader = pair.master.try_clone_reader().map_err(|e| e.to_string())?;
    tokio::spawn(async move {
        let mut buf = [0u8; 8192];
        loop {
            match reader.read(&mut buf) {
                Ok(0) => break,
                Ok(n) => {
                    if let Ok(s) = String::from_utf8(buf[..n].to_vec()) {
                        let _ = tx.send(s).await;
                    }
                }
                Err(_) => break,
            }
        }
    });
    
    let pty_id = uuid::Uuid::new_v4().to_string();
    
    // Store state
    // ... implementation details
    
    Ok(pty_id)
}

#[command]
pub async fn pty_write(pty_id: String, data: String) -> Result<(), String> {
    // Write to PTY
    // ... implementation
    Ok(())
}

#[command]
pub async fn pty_resize(
    pty_id: String, 
    cols: u16, 
    rows: u16
) -> Result<(), String> {
    // Resize PTY
    // ... implementation
    Ok(())
}
```

### 4.3 Output Capture for Daemon

```typescript
// hooks/useTerminalOutput.ts
export function useTerminalOutput(
  terminal: RefObject<Terminal>,
  onOutput?: (output: string) => void
) {
  useEffect(() => {
    if (!terminal.current) return;
    
    let outputBuffer = '';
    let debounceTimer: NodeJS.Timeout;
    
    const parser = terminal.current.registerParser({
      hook: (data: string) => {
        outputBuffer += data;
        
        // Debounce output capture (100ms)
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (outputBuffer.trim()) {
            onOutput?.(outputBuffer);
            outputBuffer = '';
          }
        }, 100);
      },
      priority: 1,
    });
    
    return () => {
      parser.dispose();
      clearTimeout(debounceTimer);
    };
  }, [terminal, onOutput]);
}
```

---

## 5. Layout Integration

### 5.1 Collapsible Pane

```tsx
// TerminalPanel.tsx - collapse/expand
export function TerminalPanel({ config }: TerminalPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(config.collapsedByDefault);
  const [height, setHeight] = useState(config.defaultHeight);
  
  return (
    <div 
      className={`terminal-panel ${isCollapsed ? 'collapsed' : ''}`}
      style={{ height: isCollapsed ? 'auto' : `${height}%` }}
    >
      <div 
        className="terminal-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="terminal-title">
          {isCollapsed ? '▶ Terminal' : '▼ Terminal'}
        </span>
        <div className="terminal-actions">
          <button onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}>
            {isCollapsed ? <MaximizeIcon /> : <MinimizeIcon />}
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <>
          <div ref={terminalRef} className="terminal-body" />
          <div 
            className="terminal-resize-handle"
            onMouseDown={startResize}
          />
        </>
      )}
    </div>
  );
}
```

### 5.2 Drag-to-Resize

```typescript
// hooks/useResize.ts
export function useResize(
  initialHeight: number,
  onChange: (height: number) => void
) {
  const [isResizing, setIsResizing] = useState(false);
  
  const startResize = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    const startY = e.clientY;
    const startHeight = initialHeight;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = startY - e.clientY;
      const deltaPercent = (deltaY / window.innerHeight) * 100;
      const newHeight = Math.max(10, Math.min(80, startHeight + deltaPercent));
      onChange(newHeight);
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [initialHeight, onChange]);
  
  return { isResizing, startResize };
}
```

---

## 6. Theme Integration

### 6.1 CSS Variable Synchronization

```typescript
// hooks/useTerminalTheme.ts
export function useTerminalTheme(themeName: string) {
  const [theme, setTheme] = useState<TerminalTheme>({
    background: '#0a0a0a',
    foreground: '#f0f0f0',
    cursor: '#ffffff',
    // ... colors
  });
  
  useEffect(() => {
    // Read CSS variables and apply to terminal
    const updateTheme = () => {
      const styles = getComputedStyle(document.documentElement);
      setTheme({
        background: styles.getPropertyValue(`--tb-${themeName}-bg`).trim(),
        foreground: styles.getPropertyValue(`--tb-${themeName}-fg`).trim(),
        cursor: styles.getPropertyValue(`--tb-${themeName}-cursor`).trim(),
        selection: styles.getPropertyValue(`--tb-${themeName}-selection`).trim(),
        black: styles.getPropertyValue(`--tb-${themeName}-black`).trim(),
        red: styles.getPropertyValue(`--tb-${themeName}-red`).trim(),
        green: styles.getPropertyValue(`--tb-${themeName}-green`).trim(),
        yellow: styles.getPropertyValue(`--tb-${themeName}-yellow`).trim(),
        blue: styles.getPropertyValue(`--tb-${themeName}-blue`).trim(),
        magenta: styles.getPropertyValue(`--tb-${themeName}-magenta`).trim(),
        cyan: styles.getPropertyValue(`--tb-${themeName}-cyan`).trim(),
        white: styles.getPropertyValue(`--tb-${themeName}-white`).trim(),
      });
    };
    
    updateTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
    
    return () => observer.disconnect();
  }, [themeName]);
  
  return theme;
}
```

### 6.2 Theme Presets

```typescript
// themes/terminal-themes.ts
export const TERMINAL_THEMES: Record<string, TerminalTheme> = {
  'dyslexia-dark': {
    background: '#0F172A',
    foreground: '#F0F0F0',
    cursor: '#FFFFFF',
    // High contrast, WCAG AAA
  },
  'dyslexia-light': {
    background: '#FFFFFF',
    foreground: '#1A1A1A',
    cursor: '#000000',
    // Light mode, high contrast
  },
  'high-contrast': {
    background: '#000000',
    foreground: '#FFFFFF',
    cursor: '#FFFF00',
    // Maximum contrast
  },
  'oceanic': {
    background: '#1B2B34',
    foreground: '#D8DEE9',
    cursor: '#FFCC00',
    // Soothing blue tones
  },
};
```

---

## 7. Storybook Integration

### 7.1 Stories

```tsx
// stories/TerminalPanel.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TerminalPanel } from '../TerminalPanel';

const meta: Meta<typeof TerminalPanel> = {
  component: TerminalPanel,
  argTypes: {
    config: {
      control: 'object',
    },
    theme: {
      control: 'select',
      options: ['dyslexia-dark', 'dyslexia-light', 'high-contrast', 'oceanic'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TerminalPanel>;

export const Default: Story = {
  args: {
    config: {
      defaultHeight: 35,
      collapsedByDefault: false,
      shell: 'bash',
      fontSize: 14,
      cursorBlink: true,
      scrollback: 10000,
      theme: 'dyslexia-dark',
    },
  },
};

export const Collapsed: Story = {
  args: {
    ...Default.args,
    config: {
      ...Default.args.config,
      collapsedByDefault: true,
    },
  },
};

export const FullScreen: Story = {
  args: {
    config: {
      defaultHeight: 100,
      collapsedByDefault: false,
      shell: 'zsh',
      fontSize: 16,
      theme: 'oceanic',
    },
  },
};

export const WithOutput: Story = {
  args: {
    ...Default.args,
    // Simulate terminal output
    initialOutput: '$ cargo build\nCompiling...\nOK Compiled (42s)\n$ ',
  },
};
```

---

## 8. Accessibility

### 8.1 Requirements

- **Keyboard navigation** - Tab through terminal controls
- **Screen reader announcements** - Announce command completion
- **High contrast** - WCAG AAA for terminal colors
- **Reduced motion** - Respect `prefers-reduced-motion` for cursor blink
- **Focus indicators** - Clear focus ring when terminal is focused

### 8.2 Implementation

```tsx
// TerminalPanel.tsx - accessibility features
export function TerminalPanel({ config }: TerminalPanelProps) {
  return (
    <div 
      className="terminal-panel"
      role="application"
      aria-label="Terminal emulator"
      aria-live="polite"
      aria-atomic={false}
    >
      <div className="terminal-header">
        <h2 className="terminal-title">Terminal</h2>
        <button
          onClick={onInterrupt}
          aria-label="Interrupt current command (Ctrl+C)"
          className="icon-button"
        >
          <StopIcon aria-hidden="true" />
        </button>
        <button
          onClick={onClear}
          aria-label="Clear terminal screen"
          className="icon-button"
        >
          <TrashIcon aria-hidden="true" />
        </button>
      </div>
      
      <div 
        ref={terminalRef} 
        className="terminal-body"
        tabIndex={0}
        aria-label="Terminal input area. Type commands here."
      />
      
      {/* Screen reader announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        className="sr-only"
      >
        {statusMessage}
      </div>
    </div>
  );
}
```

---

## 9. Performance

### 9.1 Optimization Strategies

- **Debounced output capture** - 100ms buffer to reduce MCP calls
- **Virtual scrolling** - For large scrollback buffers
- **WebGL renderer** - xterm.js WebGL addon for better performance
- **Worker threads** - Parse output in background thread
- **Lazy initialization** - Don't initialize terminal until panel is visible

### 9.2 Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Terminal spawn time | < 200ms | Time to interactive |
| Input latency | < 16ms | Keypress to render |
| Output capture | < 100ms | Output to daemon |
| Resize performance | 60fps | FPS during resize |
| Scroll performance | 60fps | FPS during scrollback |

---

## 10. Creator Corner Integration

### 10.1 Configurable Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `defaultHeight` | number | 35 | Default height percentage |
| `collapsedByDefault` | boolean | false | Start collapsed |
| `shell` | enum | bash | Default shell |
| `fontSize` | number | 14 | Terminal font size |
| `cursorBlink` | boolean | true | Blinking cursor |
| `scrollback` | number | 10000 | Scrollback buffer size |
| `theme` | enum | dyslexia-dark | Color theme |

### 10.2 Live Preview

```tsx
// In Creator Corner
<TerminalPanel
  config={{
    defaultHeight: 40,
    shell: 'zsh',
    fontSize: 16,
    theme: 'oceanic'
  }}
  previewMode={true}
  sampleOutput="$ npm install\nInstalling packages...\nDone in 5.2s"
/>
```

---

## 11. Testing

### 11.1 Unit Tests

```tsx
// TerminalPanel.test.tsx
import { render, screen } from '@testing-library/react';
import { TerminalPanel } from './TerminalPanel';

describe('TerminalPanel', () => {
  it('renders terminal container', () => {
    render(<TerminalPanel config={defaultConfig} />);
    expect(screen.getByLabelText('Terminal emulator')).toBeInTheDocument();
  });
  
  it('shows interrupt button', () => {
    render(<TerminalPanel config={defaultConfig} />);
    expect(screen.getByLabelText('Interrupt current command')).toBeInTheDocument();
  });
  
  it('collapses when clicked', () => {
    // ... test implementation
  });
  
  it('resizes on drag', () => {
    // ... test implementation
  });
});
```

### 11.2 Integration Tests

- PTY spawn and communication
- Output capture and daemon correlation
- Theme synchronization with CSS variables
- Layout persistence across sessions

---

## 12. Future Enhancements

### 12.1 Planned Features

- **Multiple terminals** - Tabbed terminal interface
- **Split panes** - Multiple terminals in split view
- **Session restore** - Restore terminal state on app relaunch
- **Custom shell commands** - Pre-configured command buttons
- **Terminal sharing** - Share terminal session URL

### 12.2 Stretch Goals

- **Integrated AI assistant** - Inline command suggestions
- **Command palette** - Quick command search and execution
- **Recording/playback** - Record terminal sessions for tutorials
- **Collaborative terminals** - Multi-user terminal sessions

---

## 13. Related Modules

- **Session** - Primary view where terminal is embedded
- **Voice Input** - Voice commands for terminal control
- **Creator Corner** - Terminal appearance customization
- **Component Registry** - Module registration

---

## 14. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-24 | Initial module specification |

---

*This module document follows the PRODUCT_SPEC_V2.md specification. For implementation details, see the source code in `buddy-app/src/modules/terminal-pane/`.*

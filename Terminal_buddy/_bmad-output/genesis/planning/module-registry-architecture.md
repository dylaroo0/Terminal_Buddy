# Module Registry Architecture Design

**Generated:** 2026-02-24  
**Phase:** Phase B - Week 1  
**Status:** Ready for Implementation  
**Architect:** Winston (bmad-bmm/architect)

---

## 🎯 Design Goal

Create a modular component architecture where UI features "stick together" dynamically based on user configuration, with Storybook as the development and presentation layer.

---

## 1. Core Architecture Principles

### 1.1 Separation of Concerns

```
┌─────────────────────────────────────────────────────────┐
│  COMPONENT LAYER (Atomic UI building blocks)            │
│  - CommandCard, SearchBar, Timeline, etc.               │
│  - Stateless, reusable, tested in Storybook             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  MODULE LAYER (Self-contained features)                 │
│  - Journal Module, Terminal Module, Voice Module        │
│  - Composed of components, registered in registry       │
│  - Has config schema, allowed regions, dependencies     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  REGISTRY LAYER (Module system core)                    │
│  - Central registry of all available modules            │
│  - Filters by enabled config, validates dependencies    │
│  - Provides module metadata to Creator Corner           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  LAYOUT LAYER (Dynamic arrangement)                     │
│  - Arranges enabled modules by region                   │
│  - Supports drag-drop reordering                        │
│  - Persists to daemon config via MCP                    │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Module Definition Interface

```typescript
// src/registry/types.ts

/** Where a module can be placed in the UI */
export type ModuleRegion = 
  | 'left'      // Left sidebar (Journal, Topics, Search)
  | 'right'     // Right sidebar (System Health, Notes)
  | 'bottom'    // Bottom panel (Terminal, Voice, Console)
  | 'center'    // Main content area (Canvas, Dashboard)
  | 'floating'; // Floating panel (Voice widget, Notifications)

/** Configuration schema for Creator Corner */
export interface ModuleConfigSchema {
  type: 'object';
  properties: Record<string, {
    type: 'string' | 'number' | 'boolean' | 'array';
    enum?: string[];
    default?: any;
    description?: string;
  }>;
}

/** Self-describing module */
export interface BuddyModule {
  /** Unique identifier (kebab-case) */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Description for Creator Corner */
  description: string;
  
  /** React component to render */
  component: React.ComponentType<{ moduleConfig?: any }>;
  
  /** Icon for module controls */
  icon: React.ComponentType<{ className?: string }>;
  
  /** Where this module can be placed */
  allowedRegions: ModuleRegion[];
  
  /** Default region if not specified */
  defaultRegion: ModuleRegion;
  
  /** Module requires daemon connection */
  requiresDaemon?: boolean;
  
  /** Module requires specific feature */
  requiresFeature?: 'voice' | 'memvid' | 'filesystem';
  
  /** Configuration schema for Creator Corner */
  configSchema?: ModuleConfigSchema;
  
  /** Default configuration values */
  defaultConfig?: Record<string, any>;
  
  /** Module dependencies (other module IDs) */
  dependencies?: string[];
  
  /** Module version (for updates) */
  version: string;
  
  /** Author (for community modules) */
  author?: string;
}
```

---

## 2. Registry Implementation

### 2.1 Central Registry Class

```typescript
// src/registry/ModuleRegistry.ts

import { BuddyModule, ModuleRegion } from './types';

interface UserLayout {
  left: string[];      // Module IDs
  right: string[];
  bottom: string[];
  center: string[];
  floating: string[];
}

interface UserConfig {
  enabledModules: string[];  // Module IDs
  layout: UserLayout;
  moduleConfigs: Record<string, any>;  // Per-module config
}

class ModuleRegistry {
  private modules = new Map<string, BuddyModule>();
  private config: UserConfig | null = null;

  /**
   * Register a module
   * Call this in each module's index.ts
   */
  register(module: BuddyModule): void {
    if (this.modules.has(module.id)) {
      console.warn(`Module ${module.id} already registered, overwriting`);
    }
    this.modules.set(module.id, module);
    console.log(`[ModuleRegistry] Registered: ${module.name} (${module.id})`);
  }

  /**
   * Get all registered modules
   */
  getAllModules(): BuddyModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get a specific module by ID
   */
  getModule(id: string): BuddyModule | undefined {
    return this.modules.get(id);
  }

  /**
   * Set user configuration (loaded from daemon via MCP)
   */
  setConfig(config: UserConfig): void {
    this.config = config;
  }

  /**
   * Get enabled modules filtered by region
   */
  getEnabledModules(region?: ModuleRegion): BuddyModule[] {
    if (!this.config) {
      // Return all modules if no config loaded (dev mode)
      return this.getAllModules();
    }

    const enabledIds = new Set(this.config.enabledModules);
    let modules = this.getAllModules().filter(m => enabledIds.has(m.id));

    if (region) {
      modules = modules.filter(m => m.allowedRegions.includes(region));
    }

    return modules;
  }

  /**
   * Get modules for a specific region based on user layout
   */
  getModulesForRegion(region: ModuleRegion): BuddyModule[] {
    if (!this.config) {
      return this.getEnabledModules(region);
    }

    const moduleIds = this.config.layout[region] || [];
    return moduleIds
      .map(id => this.modules.get(id))
      .filter((m): m is BuddyModule => m !== undefined);
  }

  /**
   * Validate module dependencies
   */
  validateDependencies(moduleId: string): boolean {
    const module = this.modules.get(moduleId);
    if (!module?.dependencies) return true;

    const enabledIds = new Set(this.config?.enabledModules || []);
    return module.dependencies.every(dep => enabledIds.has(dep));
  }

  /**
   * Get module config
   */
  getModuleConfig(moduleId: string): any {
    return this.config?.moduleConfigs[moduleId] || 
           this.modules.get(moduleId)?.defaultConfig;
  }
}

// Export singleton instance
export const moduleRegistry = new ModuleRegistry();
```

### 2.2 Module Registration Pattern

Each module registers itself:

```typescript
// src/modules/journal/index.ts

import { moduleRegistry } from '../../registry/ModuleRegistry';
import { JournalPanel } from './JournalPanel';
import { BookOpenIcon } from 'lucide-react';

moduleRegistry.register({
  id: 'journal',
  name: 'Session Journal',
  description: 'Timeline and topics of your terminal history',
  component: JournalPanel,
  icon: BookOpenIcon,
  allowedRegions: ['left', 'center'],
  defaultRegion: 'left',
  requiresDaemon: true,
  version: '1.0.0',
  configSchema: {
    type: 'object',
    properties: {
      defaultView: {
        type: 'string',
        enum: ['timeline', 'topics', 'search'],
        default: 'timeline',
        description: 'Default view when opening journal'
      },
      autoGroup: {
        type: 'boolean',
        default: true,
        description: 'Automatically group sessions by date'
      }
    }
  },
  defaultConfig: {
    defaultView: 'timeline',
    autoGroup: true
  }
});

export { JournalPanel };
```

---

## 3. App Shell Architecture

### 3.1 Dynamic Layout Shell

```typescript
// src/App.tsx

import React, { useEffect, useState } from 'react';
import { moduleRegistry } from './registry/ModuleRegistry';
import { ModuleRegion } from './registry/types';
import { useMcpConfig } from './hooks/useMcpConfig';

function App() {
  const config = useMcpConfig(); // Load from daemon via MCP
  const [layoutReady, setLayoutReady] = useState(false);

  useEffect(() => {
    if (config) {
      moduleRegistry.setConfig(config);
      setLayoutReady(true);
    }
  }, [config]);

  if (!layoutReady) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen flex flex-col bg-deep">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar 
          region="left" 
          modules={moduleRegistry.getModulesForRegion('left')} 
        />

        {/* Center Content */}
        <MainArea 
          modules={moduleRegistry.getModulesForRegion('center')} 
        />

        {/* Right Sidebar */}
        <Sidebar 
          region="right" 
          modules={moduleRegistry.getModulesForRegion('right')} 
        />
      </div>

      {/* Bottom Panel */}
      <BottomPanel 
        modules={moduleRegistry.getModulesForRegion('bottom')} 
      />

      {/* Floating Widgets */}
      <FloatingWidgets 
        modules={moduleRegistry.getModulesForRegion('floating')} 
      />

      {/* Creator Corner (Settings Panel) */}
      <CreatorCorner />
    </div>
  );
}

export default App;
```

### 3.2 Region Components

```typescript
// src/layout/Sidebar.tsx

import React from 'react';
import { BuddyModule } from '../registry/types';

interface SidebarProps {
  region: 'left' | 'right';
  modules: BuddyModule[];
}

export function Sidebar({ region, modules }: SidebarProps) {
  if (modules.length === 0) return null;

  return (
    <aside className={`sidebar sidebar-${region} w-80 flex flex-col border-r border-surface`}>
      {modules.map(module => {
        const ModuleComponent = module.component;
        const config = moduleRegistry.getModuleConfig(module.id);
        
        return (
          <div key={module.id} className="flex-1 overflow-hidden">
            <ModuleComponent moduleConfig={config} />
          </div>
        );
      })}
    </aside>
  );
}
```

```typescript
// src/layout/BottomPanel.tsx

import React, { useState } from 'react';
import { BuddyModule } from '../registry/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BottomPanelProps {
  modules: BuddyModule[];
}

export function BottomPanel({ modules }: BottomPanelProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [panelHeight, setPanelHeight] = useState(35); // percentage

  if (modules.length === 0) return null;

  return (
    <div 
      className="bottom-panel border-t border-surface"
      style={{ height: `${panelHeight}%` }}
    >
      {/* Module Tabs */}
      <div className="flex border-b border-surface">
        {modules.map(module => {
          const Icon = module.icon;
          return (
            <button
              key={module.id}
              className={`px-4 py-2 flex items-center gap-2 ${
                expandedModule === module.id ? 'bg-surface' : ''
              }`}
              onClick={() => setExpandedModule(module.id)}
            >
              <Icon className="w-4 h-4" />
              {module.name}
            </button>
          );
        })}
      </div>

      {/* Module Content */}
      <div className="flex-1 overflow-hidden">
        {modules.map(module => {
          const ModuleComponent = module.component;
          const config = moduleRegistry.getModuleConfig(module.id);
          
          return (
            <div
              key={module.id}
              className={`h-full ${
                expandedModule === module.id ? 'block' : 'hidden'
              }`}
            >
              <ModuleComponent moduleConfig={config} />
            </div>
          );
        })}
      </div>

      {/* Resize Handle */}
      <div 
        className="resize-handle cursor-ns-resize h-2 bg-surface"
        onMouseDown={(e) => {
          // Implement drag-to-resize logic
        }}
      >
        <ChevronUp className="w-3 h-3 mx-auto" />
      </div>
    </div>
  );
}
```

---

## 4. Storybook Integration

### 4.1 Storybook Configuration

```typescript
// .storybook/main.ts

import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../src/components/**/*.stories.@(ts|tsx)',
    '../src/modules/**/*.stories.@(ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    {
      name: '@storybook/addon-controls',
      options: {
        hideNoControlsWarning: true,
      },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
```

### 4.2 Component Story Pattern

```typescript
// src/components/CommandCard.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { CommandCard } from './CommandCard';
import { fn } from '@storybook/test';

const meta: Meta<typeof CommandCard> = {
  component: CommandCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Displays a terminal command with output, timestamp, and action buttons.',
      },
    },
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['dyslexia-dark', 'dyslexia-light', 'high-contrast'],
    },
    exitCode: {
      control: 'number',
      description: 'Command exit code (0 = success)',
    },
  },
  args: {
    onExplain: fn(),
    onAddNote: fn(),
    onReRun: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    command: 'cargo build --release',
    output: 'Compiling buddy-daemon v0.1.0...\nFinished release [optimized] target(s)',
    timestamp: '2026-02-24T14:30:00Z',
    exitCode: 0,
    duration: 12.5,
    theme: 'dyslexia-dark',
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    command: 'docker-compose up',
    output: 'Error: Port 8080 already in use',
    exitCode: 1,
    theme: 'dyslexia-dark',
  },
};

export const LongOutput: Story = {
  args: {
    ...Default.args,
    command: 'npm install',
    output: Array(50).fill('added 123 packages').join('\n'),
    theme: 'dyslexia-dark',
  },
};
```

### 4.3 Module Story Pattern

```typescript
// src/modules/journal/JournalPanel.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { JournalPanel } from './JournalPanel';
import { moduleRegistry } from '../../registry/ModuleRegistry';

const meta: Meta<typeof JournalPanel> = {
  component: JournalPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main journal view with timeline, topics, and search tabs.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof JournalPanel>;

export const Default: Story = {
  args: {
    moduleConfig: {
      defaultView: 'timeline',
      autoGroup: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-screen">
        <Story />
      </div>
    ),
  ],
};

export const TopicsView: Story = {
  args: {
    moduleConfig: {
      defaultView: 'topics',
      autoGroup: true,
    },
  },
};
```

---

## 5. Creator Corner Implementation

### 5.1 Creator Corner Component

```typescript
// src/modules/creator-corner/CreatorCorner.tsx

import React, { useState } from 'react';
import { moduleRegistry } from '../../registry/ModuleRegistry';
import { BuddyModule } from '../../registry/types';
import { Settings, Palette, Layout, Save } from 'lucide-react';

type CreatorTab = 'components' | 'theme' | 'layout' | 'save';

export function CreatorCorner() {
  const [activeTab, setActiveTab] = useState<CreatorTab>('components');
  const [isOpen, setIsOpen] = useState(false);
  const modules = moduleRegistry.getAllModules();

  return (
    <>
      {/* Creator Corner Toggle */}
      <button
        className="fixed bottom-4 right-4 p-4 bg-primary rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Creator Corner Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 bg-surface border border-border rounded-lg shadow-xl">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <TabButton 
              icon={Palette} 
              label="Components" 
              active={activeTab === 'components'}
              onClick={() => setActiveTab('components')}
            />
            <TabButton 
              icon={Layout} 
              label="Layout" 
              active={activeTab === 'layout'}
              onClick={() => setActiveTab('layout')}
            />
            <TabButton 
              icon={Save} 
              label="Save" 
              active={activeTab === 'save'}
              onClick={() => setActiveTab('save')}
            />
          </div>

          {/* Tab Content */}
          <div className="p-4 h-96 overflow-y-auto">
            {activeTab === 'components' && (
              <ComponentsTab modules={modules} />
            )}
            {activeTab === 'layout' && (
              <LayoutTab modules={modules} />
            )}
            {activeTab === 'save' && (
              <SaveTab />
            )}
          </div>
        </div>
      )}
    </>
  );
}
```

### 5.2 Components Tab (Module Toggles)

```typescript
// src/modules/creator-corner/ComponentsTab.tsx

import React from 'react';
import { BuddyModule } from '../../registry/types';
import { moduleRegistry } from '../../registry/ModuleRegistry';

interface ComponentsTabProps {
  modules: BuddyModule[];
}

export function ComponentsTab({ modules }: ComponentsTabProps) {
  const config = moduleRegistry.getConfig();
  const enabledModules = new Set(config?.enabledModules || []);

  const toggleModule = (moduleId: string) => {
    const newEnabled = new Set(enabledModules);
    if (newEnabled.has(moduleId)) {
      newEnabled.delete(moduleId);
    } else {
      newEnabled.add(moduleId);
    }
    
    // Save to daemon via MCP
    mcpCall('buddy_update_config', {
      enabledModules: Array.from(newEnabled),
    });
  };

  return (
    <div className="space-y-2">
      <h3 className="font-bold mb-4">Enable/Disable Modules</h3>
      
      {modules.map(module => {
        const Icon = module.icon;
        const isEnabled = enabledModules.has(module.id);
        
        return (
          <div 
            key={module.id}
            className="flex items-center justify-between p-3 bg-deep rounded"
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <div>
                <div className="font-medium">{module.name}</div>
                <div className="text-sm text-secondary">
                  {module.description}
                </div>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isEnabled}
                onChange={() => toggleModule(module.id)}
              />
              <div className="w-11 h-6 bg-border peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:bg-primary"></div>
            </label>
          </div>
        );
      })}
    </div>
  );
}
```

---

## 6. MCP Integration

### 6.1 Config Loading Hook

```typescript
// src/hooks/useMcpConfig.ts

import { useState, useEffect } from 'react';
import { mcpCall } from '../utils/mcp';

interface McpConfig {
  enabledModules: string[];
  layout: {
    left: string[];
    right: string[];
    bottom: string[];
    center: string[];
    floating: string[];
  };
  moduleConfigs: Record<string, any>;
}

export function useMcpConfig(): McpConfig | null {
  const [config, setConfig] = useState<McpConfig | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const result = await mcpCall('buddy_get_config', {});
        setConfig(result);
      } catch (error) {
        console.error('Failed to load config from daemon:', error);
        // Use defaults
        setConfig({
          enabledModules: ['journal', 'terminal', 'search'],
          layout: {
            left: ['journal'],
            right: [],
            bottom: ['terminal'],
            center: ['search'],
            floating: [],
          },
          moduleConfigs: {},
        });
      }
    }

    loadConfig();
  }, []);

  return config;
}
```

### 6.2 MCP Tool: buddy_get_config

Add to your daemon (`buddy-daemon/src/server.rs`):

```rust
#[derive(Debug, Deserialize, JsonSchema)]
pub struct GetConfigParams {}

#[derive(Debug, Serialize, JsonSchema)]
pub struct GetConfigResult {
    pub enabled_modules: Vec<String>,
    pub layout: LayoutConfig,
    pub module_configs: serde_json::Value,
}

#[tool]
pub async fn buddy_get_config(
    &self,
    _params: Parameters<GetConfigParams>,
) -> Result<CallToolResult, anyhow::Error> {
    // Load from ~/.config/terminal-buddy/buddy.toml
    let config = load_config()?;
    
    Ok(CallToolResult {
        content: vec![Content::text(serde_json::to_string(&config)?)],
    })
}
```

---

## 7. Implementation Checklist

### Phase 1: Foundation (Week 1)

- [ ] Install Storybook: `npx storybook@latest init`
- [ ] Create `src/registry/types.ts`
- [ ] Create `src/registry/ModuleRegistry.ts`
- [ ] Export registry singleton from `src/registry/index.ts`
- [ ] Create first component: `src/components/CommandCard.tsx`
- [ ] Create first story: `src/components/CommandCard.stories.tsx`
- [ ] Run Storybook: `npm run storybook`

### Phase 2: Core Modules (Week 2)

- [ ] Create Journal module: `src/modules/journal/`
- [ ] Register Journal in registry
- [ ] Create Terminal module (xterm.js wrapper)
- [ ] Register Terminal in registry
- [ ] Create Search module (Memvid Canvas integration)
- [ ] Register Search in registry

### Phase 3: App Shell (Week 3)

- [ ] Implement `src/App.tsx` with dynamic layout
- [ ] Create `src/layout/Sidebar.tsx`
- [ ] Create `src/layout/BottomPanel.tsx`
- [ ] Wire MCP config loading
- [ ] Test with Journal + Terminal modules

### Phase 4: Creator Corner (Week 4)

- [ ] Create `src/modules/creator-corner/CreatorCorner.tsx`
- [ ] Implement Components tab
- [ ] Implement Layout tab (drag-drop)
- [ ] Implement Save tab (export template)
- [ ] Wire MCP config updates

---

## 8. Next Steps

1. **Review this design** with Winston (Architect)
2. **Start Phase 1** - Install Storybook, create registry
3. **Build CommandCard** - First component + story
4. **Test in Storybook** - Verify component renders
5. **Move to Phase 2** - Create Journal module

---

*Generated by Genesis Forge - Frontend Architect (Winston)*
*Ready for implementation in terminal-buddy/buddy-app*

# Component Registry Module

**Module ID:** `component-registry`  
**Status:** Core (Required)  
**Location:** `buddy-app/src/modules/registry/`

---

## 1. Overview

The Component Registry is the **central nervous system** of Terminal Buddy's modular architecture. It manages module registration, discovery, enabling/disabling, and lifecycle management.

### 1.1 Purpose

The Component Registry provides:
- **Module registration** - Modules register themselves with metadata
- **Discovery system** - Query available modules by capability
- **Lifecycle management** - Enable/disable modules dynamically
- **Configuration schema** - JSON Schema for all module settings
- **Dependency resolution** - Handle module requirements

### 1.2 Key Principle

> "Modules that stick together. Each module describes itself, the registry manages them all."

The registry enables Creator Corner's "enable/disable components" feature and provides the foundation for the modular architecture.

---

## 2. Architecture

### 2.1 Module Structure

```
modules/registry/
├── index.ts                    # Main registry export
├── Registry.ts                 # Registry class definition
├── types.ts                    # TypeScript types
├── schema.ts                   # JSON Schema definitions
├── hooks/
│   ├── useRegistry.ts          # Registry access hook
│   └── useModuleConfig.ts      # Module configuration hook
└── utils/
    ├── schema-validator.ts     # Validate config against schema
    └── dependency-resolver.ts  # Resolve module dependencies
```

### 2.2 Core Types

```typescript
// types.ts
export interface BuddyModule {
  /** Unique identifier for the module */
  id: string;
  
  /** Human-readable name */
  name: string;
  
  /** Description of what the module does */
  description: string;
  
  /** React component to render */
  component: React.ComponentType<any>;
  
  /** Icon component for UI representation */
  icon: React.ComponentType<any>;
  
  /** Where this module can be placed in the layout */
  allowedRegions: ('left' | 'right' | 'bottom' | 'center' | 'floating')[];
  
  /** Whether the module requires the daemon to be running */
  requiresDaemon: boolean;
  
  /** Whether the module requires voice input capabilities */
  requiresVoice: boolean;
  
  /** Other modules this module depends on */
  dependencies?: string[];
  
  /** JSON Schema for module configuration */
  configSchema?: JSONSchema7;
  
  /** Default configuration values */
  defaultConfig?: Record<string, any>;
  
  /** Module metadata */
  metadata?: {
    version: string;
    author: string;
    license: string;
    tags: string[];
  };
}

export interface ModuleRegistryConfig {
  enabledModules: string[];
  layout: {
    left: string[];
    right: string[];
    bottom: string[];
    center: string[];
    floating: string[];
  };
  moduleConfigs: Record<string, Record<string, any>>;
}
```

### 2.3 Registry Class

```typescript
// Registry.ts
class ModuleRegistry {
  private modules = new Map<string, BuddyModule>();
  private config: ModuleRegistryConfig;
  private static instance: ModuleRegistry;
  
  private constructor() {
    this.config = {
      enabledModules: [],
      layout: {
        left: [],
        right: [],
        bottom: [],
        center: [],
        floating: [],
      },
      moduleConfigs: {},
    };
  }
  
  /**
   * Get singleton instance
   */
  static getInstance(): ModuleRegistry {
    if (!ModuleRegistry.instance) {
      ModuleRegistry.instance = new ModuleRegistry();
    }
    return ModuleRegistry.instance;
  }
  
  /**
   * Register a module
   */
  register(module: BuddyModule): void {
    if (this.modules.has(module.id)) {
      throw new Error(`Module ${module.id} is already registered`);
    }
    
    // Validate config schema if provided
    if (module.configSchema) {
      validateSchema(module.configSchema);
    }
    
    this.modules.set(module.id, module);
  }
  
  /**
   * Get a module by ID
   */
  getModule(id: string): BuddyModule | undefined {
    return this.modules.get(id);
  }
  
  /**
   * Get all registered modules
   */
  getAllModules(): BuddyModule[] {
    return Array.from(this.modules.values());
  }
  
  /**
   * Get enabled modules
   */
  getEnabledModules(): BuddyModule[] {
    return this.config.enabledModules
      .map(id => this.modules.get(id))
      .filter((m): m is BuddyModule => Boolean(m));
  }
  
  /**
   * Enable a module
   */
  enableModule(id: string): void {
    const module = this.modules.get(id);
    if (!module) {
      throw new Error(`Module ${id} not found`);
    }
    
    // Check dependencies
    if (module.dependencies) {
      for (const depId of module.dependencies) {
        if (!this.config.enabledModules.includes(depId)) {
          throw new Error(
            `Module ${id} requires ${depId} to be enabled first`
          );
        }
      }
    }
    
    if (!this.config.enabledModules.includes(id)) {
      this.config.enabledModules.push(id);
      this.persistConfig();
    }
  }
  
  /**
   * Disable a module
   */
  disableModule(id: string): void {
    // Check if other enabled modules depend on this one
    const dependents = this.getDependents(id);
    if (dependents.length > 0) {
      throw new Error(
        `Cannot disable ${id}: ${dependents.join(', ')} depend(s) on it`
      );
    }
    
    this.config.enabledModules = this.config.enabledModules.filter(
      moduleId => moduleId !== id
    );
    this.persistConfig();
  }
  
  /**
   * Get modules that depend on a given module
   */
  getDependents(moduleId: string): string[] {
    const dependents: string[] = [];
    for (const [id, module] of this.modules.entries()) {
      if (module.dependencies?.includes(moduleId)) {
        dependents.push(id);
      }
    }
    return dependents;
  }
  
  /**
   * Get module configuration
   */
  getModuleConfig<T = Record<string, any>>(moduleId: string): T {
    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module ${moduleId} not found`);
    }
    
    return {
      ...module.defaultConfig,
      ...this.config.moduleConfigs[moduleId],
    } as T;
  }
  
  /**
   * Update module configuration
   */
  updateModuleConfig(moduleId: string, config: Record<string, any>): void {
    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module ${moduleId} not found`);
    }
    
    // Validate against schema
    if (module.configSchema) {
      validateConfig(config, module.configSchema);
    }
    
    this.config.moduleConfigs[moduleId] = {
      ...this.config.moduleConfigs[moduleId],
      ...config,
    };
    this.persistConfig();
  }
  
  /**
   * Get modules allowed in a specific region
   */
  getModulesForRegion(region: string): BuddyModule[] {
    return this.getEnabledModules().filter(module =>
      module.allowedRegions.includes(region as any)
    );
  }
  
  /**
   * Search modules by tag or keyword
   */
  searchModules(query: string): BuddyModule[] {
    const queryLower = query.toLowerCase();
    return this.getAllModules().filter(module => {
      const tags = module.metadata?.tags || [];
      return (
        module.name.toLowerCase().includes(queryLower) ||
        module.description.toLowerCase().includes(queryLower) ||
        tags.some(tag => tag.toLowerCase().includes(queryLower))
      );
    });
  }
  
  /**
   * Persist configuration to daemon
   */
  private async persistConfig(): Promise<void> {
    try {
      await mcp.call('buddy_save_config', {
        config: this.config,
      });
    } catch (error) {
      console.error('Failed to persist config:', error);
    }
  }
  
  /**
   * Load configuration from daemon
   */
  async loadConfig(): Promise<void> {
    try {
      const result = await mcp.call('buddy_load_config', {});
      this.config = result.config;
    } catch (error) {
      console.error('Failed to load config:', error);
      // Use defaults
    }
  }
}

// Export singleton
export const registry = ModuleRegistry.getInstance();
```

---

## 3. Module Registration Example

### 3.1 Journal Module Registration

```typescript
// modules/journal/index.ts
import { registry } from '../registry';
import { JournalPanel } from './JournalPanel';
import { BookOpenIcon } from 'lucide-react';

registry.register({
  id: 'journal',
  name: 'Session Journal',
  description: 'Timeline and topics of your terminal history',
  component: JournalPanel,
  icon: BookOpenIcon,
  allowedRegions: ['left', 'center'],
  requiresDaemon: true,
  requiresVoice: false,
  dependencies: [],
  configSchema: {
    type: 'object',
    properties: {
      defaultView: { 
        type: 'string', 
        enum: ['timeline', 'topics', 'search'],
        default: 'timeline'
      },
      autoGroup: { 
        type: 'boolean',
        default: true
      },
      showSystemImpact: {
        type: 'boolean',
        default: true
      }
    }
  },
  defaultConfig: {
    defaultView: 'timeline',
    autoGroup: true,
    showSystemImpact: true
  },
  metadata: {
    version: '1.0.0',
    author: 'Terminal Buddy Team',
    license: 'MIT',
    tags: ['core', 'journal', 'history']
  }
});
```

### 3.2 Terminal Pane Module Registration

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
  allowedRegions: ['bottom', 'center', 'floating'],
  requiresDaemon: true,
  requiresVoice: false,
  dependencies: [],
  configSchema: {
    type: 'object',
    properties: {
      defaultHeight: { 
        type: 'number', 
        default: 35
      },
      shell: { 
        type: 'string',
        enum: ['bash', 'zsh', 'fish', 'powershell'],
        default: 'bash'
      },
      fontSize: {
        type: 'number',
        default: 14
      }
    }
  },
  defaultConfig: {
    defaultHeight: 35,
    shell: 'bash',
    fontSize: 14
  },
  metadata: {
    version: '1.0.0',
    author: 'Terminal Buddy Team',
    license: 'MIT',
    tags: ['core', 'terminal', 'emulator']
  }
});
```

---

## 4. Hooks

### 4.1 useRegistry Hook

```typescript
// hooks/useRegistry.ts
export function useRegistry() {
  const [modules, setModules] = useState<BuddyModule[]>([]);
  const [enabledModules, setEnabledModules] = useState<BuddyModule[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadModules() {
      await registry.loadConfig();
      setModules(registry.getAllModules());
      setEnabledModules(registry.getEnabledModules());
      setLoading(false);
    }
    loadModules();
  }, []);
  
  return {
    modules,
    enabledModules,
    loading,
    enableModule: (id: string) => {
      registry.enableModule(id);
      setEnabledModules(registry.getEnabledModules());
    },
    disableModule: (id: string) => {
      registry.disableModule(id);
      setEnabledModules(registry.getEnabledModules());
    },
    getModuleConfig: (id: string) => registry.getModuleConfig(id),
    updateModuleConfig: (id: string, config: any) => {
      registry.updateModuleConfig(id, config);
      setEnabledModules(registry.getEnabledModules());
    },
  };
}
```

### 4.2 useModuleConfig Hook

```typescript
// hooks/useModuleConfig.ts
export function useModuleConfig<T = Record<string, any>>(moduleId: string) {
  const [config, setConfig] = useState<T>(() => 
    registry.getModuleConfig<T>(moduleId)
  );
  
  const updateConfig = useCallback((newConfig: Partial<T>) => {
    registry.updateModuleConfig(moduleId, newConfig);
    setConfig(registry.getModuleConfig<T>(moduleId));
  }, [moduleId]);
  
  return {
    config,
    updateConfig,
  };
}
```

---

## 5. JSON Schema System

### 5.1 Base Schema

```typescript
// schema.ts
export const BuddyConfigSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    appearance: {
      type: 'object',
      properties: {
        theme: { type: 'string' },
        font_family: { type: 'string' },
        font_size: { type: 'number' },
        line_height: { type: 'number' },
        letter_spacing: { type: 'string' },
      }
    },
    interaction: {
      type: 'object',
      properties: {
        default_input: { 
          type: 'string', 
          enum: ['voice', 'keyboard', 'hybrid'] 
        },
        push_to_talk: { type: 'string' },
        confirm_before_run: { type: 'boolean' },
      }
    },
    components: {
      type: 'object',
      properties: {
        enabled: { 
          type: 'array', 
          items: { type: 'string' } 
        },
        disabled: { 
          type: 'array', 
          items: { type: 'string' } 
        },
      }
    },
    voice: {
      type: 'object',
      properties: {
        tts_provider: { 
          type: 'string',
          enum: ['local', 'elevenlabs', 'quen']
        },
        voice_id: { type: 'string' },
        speed: { type: 'number' },
        pitch: { type: 'number' },
      }
    },
    sessions: {
      type: 'object',
      properties: {
        auto_title: { type: 'boolean' },
        auto_group_topics: { type: 'boolean' },
      }
    },
  }
};
```

### 5.2 Schema Validator

```typescript
// utils/schema-validator.ts
import Ajv from 'ajv';

const ajv = new Ajv();

export function validateSchema(schema: JSONSchema7): void {
  // Validate the schema itself
  const validateSchemaFn = ajv.compile(schema);
  if (!validateSchemaFn({})) {
    throw new Error('Invalid JSON Schema');
  }
}

export function validateConfig(
  config: Record<string, any>, 
  schema: JSONSchema7
): void {
  const validate = ajv.compile(schema);
  const valid = validate(config);
  
  if (!valid) {
    throw new Error(
      `Invalid configuration: ${validate.errors?.map(e => e.message).join(', ')}`
    );
  }
}
```

---

## 6. App Shell Integration

### 6.1 Dynamic Layout Rendering

```tsx
// App.tsx
function App() {
  const { enabledModules, getModuleConfig } = useRegistry();
  
  // Filter modules by region
  const leftModules = enabledModules.filter(m => 
    m.allowedRegions.includes('left')
  );
  const centerModules = enabledModules.filter(m => 
    m.allowedRegions.includes('center')
  );
  const bottomModules = enabledModules.filter(m => 
    m.allowedRegions.includes('bottom')
  );

  return (
    <div className="app-shell">
      {/* Left sidebar */}
      <Sidebar region="left" className="sidebar-left">
        {leftModules.map(module => (
          <module.component 
            key={module.id}
            config={getModuleConfig(module.id)}
          />
        ))}
      </Sidebar>
      
      {/* Center - Main content area */}
      <MainArea region="center">
        {centerModules.map(module => (
          <module.component 
            key={module.id}
            config={getModuleConfig(module.id)}
          />
        ))}
      </MainArea>
      
      {/* Bottom panel */}
      <BottomPanel region="bottom">
        {bottomModules.map(module => (
          <module.component 
            key={module.id}
            config={getModuleConfig(module.id)}
          />
        ))}
      </BottomPanel>
    </div>
  );
}
```

---

## 7. Dependency Resolution

### 7.1 Dependency Resolver

```typescript
// utils/dependency-resolver.ts
export function resolveDependencies(
  moduleId: string,
  registry: ModuleRegistry
): string[] {
  const module = registry.getModule(moduleId);
  if (!module) {
    throw new Error(`Module ${moduleId} not found`);
  }
  
  const dependencies: string[] = [];
  
  function collectDeps(id: string) {
    const mod = registry.getModule(id);
    if (!mod || !mod.dependencies) return;
    
    for (const depId of mod.dependencies) {
      if (!dependencies.includes(depId)) {
        dependencies.push(depId);
        collectDeps(depId);
      }
    }
  }
  
  collectDeps(moduleId);
  return dependencies;
}

export function getEnableOrder(
  moduleIds: string[],
  registry: ModuleRegistry
): string[] {
  const order: string[] = [];
  const visited = new Set<string>();
  
  function visit(moduleId: string) {
    if (visited.has(moduleId)) return;
    visited.add(moduleId);
    
    const module = registry.getModule(moduleId);
    if (module?.dependencies) {
      for (const depId of module.dependencies) {
        visit(depId);
      }
    }
    
    order.push(moduleId);
  }
  
  for (const id of moduleIds) {
    visit(id);
  }
  
  return order;
}
```

---

## 8. Testing

### 8.1 Unit Tests

```typescript
// Registry.test.ts
import { registry } from './Registry';

describe('ModuleRegistry', () => {
  beforeEach(() => {
    // Clear registry for each test
    registry.clear();
  });
  
  it('registers a module', () => {
    const mockModule = {
      id: 'test-module',
      name: 'Test Module',
      description: 'A test module',
      component: () => null,
      icon: () => null,
      allowedRegions: ['center'],
      requiresDaemon: false,
      requiresVoice: false,
    };
    
    registry.register(mockModule);
    expect(registry.getModule('test-module')).toBe(mockModule);
  });
  
  it('enables a module', () => {
    // ... test implementation
  });
  
  it('prevents disabling a module with dependents', () => {
    // ... test implementation
  });
  
  it('validates config against schema', () => {
    // ... test implementation
  });
  
  it('resolves dependencies correctly', () => {
    // ... test implementation
  });
});
```

---

## 9. Performance

### 9.1 Optimization Strategies

- **Lazy module loading** - Load module code only when enabled
- **Memoized queries** - Cache getEnabledModules() results
- **Batch config updates** - Debounce multiple config changes
- **Code splitting** - Split modules into separate chunks

### 9.2 Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Module registration | < 10ms | Time to register all modules |
| Config load | < 100ms | Time to load config from daemon |
| Enable/disable | < 50ms | Time to toggle module state |
| Config validation | < 10ms | Time to validate config against schema |

---

## 10. Future Enhancements

### 10.1 Planned Features

- **Hot module reloading** - Update modules without app restart
- **Module marketplace** - Install third-party modules
- **Module versioning** - Track and update module versions
- **Module analytics** - Track which modules are most used

### 10.2 Stretch Goals

- **Module sandboxing** - Isolate module execution for security
- **Module composition** - Combine multiple modules into one
- **Module templates** - Scaffold new modules quickly
- **Module testing framework** - Standardized module testing

---

## 11. Related Modules

- **Session** - Registered as a module
- **Terminal Pane** - Registered as a module
- **Creator Corner** - Uses registry to enable/disable components
- **Theme System** - Module configuration storage

---

## 12. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-24 | Initial module specification |

---

*This module document follows the PRODUCT_SPEC_V2.md specification. For implementation details, see the source code in `buddy-app/src/modules/registry/`.*

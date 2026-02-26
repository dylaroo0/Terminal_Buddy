# Creator Corner Module

**Module ID:** `creator-corner`  
**Status:** Core (Required)  
**Location:** `buddy-app/src/modules/creator-corner/`

---

## 1. Overview

Creator Corner is the **customization engine** of Terminal Buddy. It's not just "settings" - it's an empowerment space where users design, customize, and share their Terminal Buddy experience.

### 1.1 Purpose

Creator Corner provides:
- **Visual theme editor** - fonts, colors, spacing with live preview
- **Component builder** - enable/disable/reorder UI components
- **Layout designer** - drag-and-drop module positions
- **Template system** - save, share, and install configuration presets
- **Community hub** - browse and install community-created templates

### 1.2 Key Principle

> "Personalization without complexity. The terminal adapts to you, not the other way around."

Creator Corner makes deep customization accessible. Every change has a live preview. Every customization has a "Reset to Accessible Default" button.

---

## 2. Architecture

### 2.1 Module Structure

```
modules/creator-corner/
├── index.ts                    # Module registration
├── CreatorCorner.tsx           # Main component
├── editors/
│   ├── ThemeEditor.tsx         # Visual theme customization
│   ├── LayoutEditor.tsx        # Module layout builder
│   ├── ComponentEditor.tsx     # Enable/disable components
│   └── TemplateEditor.tsx      # Save/export templates
├── components/
│   ├── LivePreview.tsx         # Real-time preview pane
│   ├── ColorPicker.tsx         # WCAG-aware color picker
│   ├── FontSelector.tsx        # Accessible font selection
│   ├── LayoutGrid.tsx          # Drag-and-drop layout
│   └── TemplateCard.tsx        # Template display card
├── hooks/
│   ├── useThemeConfig.ts       # Theme state management
│   ├── useLayoutConfig.ts      # Layout state management
│   ├── useTemplates.ts         # Template CRUD operations
│   └── useWCAGChecker.ts       # Accessibility validation
├── utils/
│   ├── template-validator.ts   # Validate template schema
│   ├── css-variable-generator.ts # Generate CSS from config
│   └── template-export.ts      # Export .buddy-template files
└── stories/
    ├── ThemeEditor.stories.tsx
    ├── LayoutEditor.stories.tsx
    └── CreatorCorner.stories.tsx
```

### 2.2 Dependencies

| Dependency | Purpose |
|------------|---------|
| `@radix-ui/*` | Accessible UI primitives |
| `react-grid-layout` | Drag-and-drop layout builder |
| `@memvid/canvas-react` | Template storage and retrieval |
| `buddy-daemon` (via MCP) | Config persistence |
| `tailwindcss` | CSS variable generation |

### 2.3 Data Flow

```
┌──────────────────┐
│  CreatorCorner   │
└─────────┬────────┘
          │
          v
┌──────────────────┐
│  Config Editors  │
│  (Theme, Layout, │
│   Components)    │
└─────────┬────────┘
          │
          v
┌──────────────────┐
│  Live Preview    │
│  (real-time)     │
└─────────┬────────┘
          │
          v
┌──────────────────┐
│  Template Save   │
│  (local or       │
│   community)     │
└─────────┬────────┘
          │
          v
┌──────────────────┐
│  buddy.toml      │
│  + CSS Variables │
└──────────────────┘
```

---

## 3. Module Registration

### 3.1 Registration Code

```typescript
// modules/creator-corner/index.ts
import { registry } from '../registry';
import { CreatorCorner } from './CreatorCorner';
import { SparklesIcon } from 'lucide-react';

registry.register({
  id: 'creator-corner',
  name: 'Creator Corner',
  description: 'Design, customize, and share your Terminal Buddy experience',
  component: CreatorCorner,
  icon: SparklesIcon,
  
  // Where it can live in the layout
  allowedRegions: ['center', 'floating'],
  
  // Requirements
  requiresDaemon: false,
  requiresVoice: false,
  
  // Config schema for Creator Corner (meta!)
  configSchema: {
    type: 'object',
    properties: {
      showAdvanced: { 
        type: 'boolean',
        default: false,
        description: 'Show advanced customization options'
      },
      defaultEditor: { 
        type: 'string',
        enum: ['theme', 'layout', 'components', 'templates'],
        default: 'theme',
        description: 'Default editor tab on open'
      },
      autoSave: {
        type: 'boolean',
        default: true,
        description: 'Automatically save changes'
      }
    }
  }
});
```

---

## 4. Main Interface

### 4.1 Creator Corner Layout

```
+--------------------------------------------------+
|  CREATOR CORNER                     [ Journal ]  |
+--------------------------------------------------+
|                                                    |
|  What do you want to create?                       |
|                                                    |
|  +------------------+  +------------------+        |
|  | [icon]           |  | [icon]           |        |
|  | Design a UI Skin |  | Build a          |        |
|  | fonts, colors,   |  | Component        |        |
|  | spacing, layout  |  | new panel,       |        |
|  |                  |  | widget, or       |        |
|  |                  |  | interaction      |        |
|  +------------------+  +------------------+        |
|                                                    |
|  +------------------+  +------------------+        |
|  | [icon]           |  | [icon]           |        |
|  | Package a        |  | Browse Community |        |
|  | Template         |  | Templates        |        |
|  | save your setup  |  | see what others  |        |
|  | to share or      |  | have made        |        |
|  | reuse            |  |                  |        |
|  +------------------+  +------------------+        |
|                                                    |
|             [ Start Creating ]                     |
+--------------------------------------------------+
```

### 4.2 Implementation

```tsx
// modules/creator-corner/CreatorCorner.tsx
export function CreatorCorner({ config }: CreatorCornerProps) {
  const [activeEditor, setActiveEditor] = useState<'theme' | 'layout' | 'components' | 'templates'>('theme');
  
  return (
    <div className="creator-corner">
      <header className="creator-header">
        <h1>Creator Corner</h1>
        <nav className="creator-nav">
          <button 
            onClick={() => setActiveEditor('theme')}
            className={activeEditor === 'theme' ? 'active' : ''}
          >
            Design a UI Skin
          </button>
          <button 
            onClick={() => setActiveEditor('layout')}
            className={activeEditor === 'layout' ? 'active' : ''}
          >
            Build a Component
          </button>
          <button 
            onClick={() => setActiveEditor('components')}
            className={activeEditor === 'components' ? 'active' : ''}
          >
            Package a Template
          </button>
          <button 
            onClick={() => setActiveEditor('templates')}
            className={activeEditor === 'templates' ? 'active' : ''}
          >
            Browse Community
          </button>
        </nav>
      </header>
      
      <main className="creator-main">
        {activeEditor === 'theme' && <ThemeEditor />}
        {activeEditor === 'layout' && <LayoutEditor />}
        {activeEditor === 'components' && <ComponentEditor />}
        {activeEditor === 'templates' && <TemplateBrowser />}
      </main>
    </div>
  );
}
```

---

## 5. Theme Editor

### 5.1 Purpose

Visual editor for fonts, colors, spacing with live preview and WCAG contrast checking.

### 5.2 Implementation

```tsx
// editors/ThemeEditor.tsx
export function ThemeEditor() {
  const [config, setConfig] = useThemeConfig();
  const [wcagLevel, setWcagLevel] = useState<'AAA' | 'AA' | 'fail'>('AAA');
  
  return (
    <div className="theme-editor">
      <div className="editor-controls">
        <section className="control-group">
          <h3>Font Family</h3>
          <FontSelector
            value={config.fontFamily}
            onChange={(font) => setConfig({ ...config, fontFamily: font })}
            options={[
              { value: 'OpenDyslexic', label: 'OpenDyslexic (extra readable)' },
              { value: 'Atkinson Hyperlegible', label: 'Atkinson Hyperlegible (balanced)' },
              { value: 'Lexend', label: 'Lexend (modern accessible)' },
              { value: 'JetBrains Mono', label: 'JetBrains Mono (traditional)' },
              { value: 'system-ui', label: 'System default' },
            ]}
          />
        </section>
        
        <section className="control-group">
          <h3>Font Size</h3>
          <Slider
            value={config.fontSize}
            min={12}
            max={32}
            step={1}
            onChange={(size) => setConfig({ ...config, fontSize: size })}
            renderThumb={(value) => `${value}px`}
          />
        </section>
        
        <section className="control-group">
          <h3>Line Height</h3>
          <Slider
            value={config.lineHeight}
            min={1.0}
            max={2.5}
            step={0.1}
            onChange={(height) => setConfig({ ...config, lineHeight: height })}
            renderThumb={(value) => `${value}x`}
          />
        </section>
        
        <section className="control-group">
          <h3>Letter Spacing</h3>
          <Slider
            value={config.letterSpacing}
            min={0}
            max={0.2}
            step={0.01}
            onChange={(spacing) => setConfig({ ...config, letterSpacing: `${spacing}em` })}
            renderThumb={(value) => `${value}em`}
          />
        </section>
        
        <section className="control-group">
          <h3>Color Palette</h3>
          <ColorPicker
            label="Background"
            value={config.backgroundColor}
            onChange={(color) => {
              setConfig({ ...config, backgroundColor: color });
              setWcagLevel(checkWCAG(color, config.textColor));
            }}
            showContrastRatio={true}
          />
          <ColorPicker
            label="Text Color"
            value={config.textColor}
            onChange={(color) => {
              setConfig({ ...config, textColor: color });
              setWcagLevel(checkWCAG(config.backgroundColor, color));
            }}
            showContrastRatio={true}
          />
          
          {wcagLevel !== 'AAA' && (
            <div className="wcag-warning" role="alert">
              <WarningIcon />
              <span>
                Contrast ratio is {wcagLevel === 'AA' ? 'AA' : 'below AA'}. 
                Consider higher contrast for better accessibility.
              </span>
            </div>
          )}
        </section>
        
        <section className="control-group">
          <h3>Preview</h3>
          <div className="theme-preview" style={getPreviewStyles(config)}>
            <code>$ cargo build --release</code>
            <pre>Compiling buddy-daemon v0.1.0...</pre>
            <p className="sample-text">
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        </section>
      </div>
      
      <div className="editor-actions">
        <button onClick={() => setConfig(getAccessibleDefaults())}>
          Reset to Accessible Default
        </button>
        <button onClick={() => saveTemplate(config)}>
          Save as Template
        </button>
      </div>
    </div>
  );
}
```

### 5.3 WCAG Contrast Checker

```typescript
// hooks/useWCAGChecker.ts
export function useWCAGChecker() {
  const checkContrast = useCallback((bg: string, fg: string) => {
    const lum1 = getLuminance(bg);
    const lum2 = getLuminance(fg);
    const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    
    if (ratio >= 7.0) return { level: 'AAA', ratio };
    if (ratio >= 4.5) return { level: 'AA', ratio };
    return { level: 'fail', ratio };
  }, []);
  
  return { checkContrast };
}

function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
```

---

## 6. Layout Editor

### 6.1 Purpose

Drag-and-drop builder for module positions and sizes.

### 6.2 Implementation

```tsx
// editors/LayoutEditor.tsx
import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function LayoutEditor() {
  const [layout, setLayout] = useLayoutConfig();
  const modules = registry.getEnabledModules();
  
  return (
    <div className="layout-editor">
      <div className="editor-instructions">
        <h3>Arrange Your Layout</h3>
        <p>Drag modules to reposition. Resize by dragging corners.</p>
      </div>
      
      <div className="layout-preview">
        <ResponsiveGridLayout
          className="layout-grid"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768 }}
          cols={{ lg: 12, md: 10, sm: 6 }}
          rowHeight={50}
          onLayoutChange={(newLayout) => {
            setLayout(newLayout);
          }}
          draggableHandle=".drag-handle"
        >
          {modules.map(module => (
            <div 
              key={module.id} 
              className="module-preview"
              data-module={module.id}
            >
              <div className="drag-handle">
                <GripIcon />
                <span>{module.name}</span>
              </div>
              <module.component previewMode={true} />
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
      
      <div className="editor-actions">
        <button onClick={() => setLayout(getDefaultLayout())}>
          Reset to Default
        </button>
        <button onClick={() => saveLayout(layout)}>
          Save Layout
        </button>
      </div>
    </div>
  );
}
```

### 6.3 Layout Schema

```typescript
// types/layout.ts
export interface LayoutConfig {
  lg: LayoutItem[];
  md?: LayoutItem[];
  sm?: LayoutItem[];
}

export interface LayoutItem {
  i: string; // module ID
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
}

export function getDefaultLayout(): LayoutConfig {
  return {
    lg: [
      { i: 'journal', x: 0, y: 0, w: 8, h: 12, minW: 6, minH: 8 },
      { i: 'terminal-pane', x: 8, y: 0, w: 4, h: 6, minW: 3, minH: 4 },
      { i: 'system-health', x: 8, y: 6, w: 4, h: 6, minW: 3, minH: 4 },
    ],
  };
}
```

---

## 7. Component Editor

### 7.1 Purpose

Enable/disable individual UI components and widgets.

### 7.2 Implementation

```tsx
// editors/ComponentEditor.tsx
export function ComponentEditor() {
  const [enabledComponents, setEnabledComponents] = useState<string[]>([]);
  const allComponents = registry.getAllComponents();
  
  return (
    <div className="component-editor">
      <div className="editor-instructions">
        <h3>Enable/Disable Components</h3>
        <p>Toggle components on or off. Disabled components won't appear in your layout.</p>
      </div>
      
      <div className="component-list">
        {allComponents.map(component => (
          <div 
            key={component.id} 
            className="component-item"
          >
            <div className="component-info">
              <component.icon />
              <div>
                <h4>{component.name}</h4>
                <p>{component.description}</p>
              </div>
            </div>
            
            <Switch
              checked={enabledComponents.includes(component.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setEnabledComponents([...enabledComponents, component.id]);
                } else {
                  setEnabledComponents(enabledComponents.filter(id => id !== component.id));
                }
              }}
              aria-label={`Enable ${component.name}`}
            />
          </div>
        ))}
      </div>
      
      <div className="editor-actions">
        <button onClick={() => setEnabledComponents(getDefaultComponents())}>
          Reset to Defaults
        </button>
        <button onClick={() => saveComponentConfig(enabledComponents)}>
          Save Configuration
        </button>
      </div>
    </div>
  );
}
```

---

## 8. Template System

### 8.1 Template Schema

```typescript
// types/template.ts
export interface BuddyTemplate {
  name: string;
  description: string;
  version: string;
  author: string;
  
  appearance: {
    theme: string;
    font_family: string;
    font_size: number;
    line_height: number;
    letter_spacing: string;
    background: string;
    text_color: string;
    // ... other appearance settings
  };
  
  interaction: {
    default_input: 'voice' | 'keyboard' | 'hybrid';
    push_to_talk: string;
    confirm_before_run: boolean;
    // ... other interaction settings
  };
  
  components: {
    enabled: string[];
    disabled: string[];
  };
  
  layout: {
    lg: LayoutItem[];
    md?: LayoutItem[];
    sm?: LayoutItem[];
  };
  
  voice: {
    tts_provider: 'local' | 'elevenlabs' | 'quen';
    voice_id: string;
    speed: number;
    pitch: number;
  };
}
```

### 8.2 Template Export

```typescript
// utils/template-export.ts
export function exportTemplate(config: BuddyTemplate): Blob {
  const json = JSON.stringify(config, null, 2);
  return new Blob([json], { type: 'application/json' });
}

export function downloadTemplate(config: BuddyTemplate, filename: string) {
  const blob = exportTemplate(config);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.buddy-template`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importTemplate(file: File): Promise<BuddyTemplate> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const template = JSON.parse(e.target?.result as string);
        validateTemplate(template); // throws if invalid
        resolve(template);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
}
```

### 8.3 Template Browser

```tsx
// editors/TemplateBrowser.tsx
export function TemplateBrowser() {
  const [templates, setTemplates] = useState<BuddyTemplate[]>([]);
  const [filter, setFilter] = useState<'all' | 'accessibility' | 'power-user' | 'minimal'>('all');
  
  return (
    <div className="template-browser">
      <div className="browser-header">
        <h3>Community Templates</h3>
        <div className="browser-filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'accessibility' ? 'active' : ''}
            onClick={() => setFilter('accessibility')}
          >
            Accessibility-focused
          </button>
          <button 
            className={filter === 'power-user' ? 'active' : ''}
            onClick={() => setFilter('power-user')}
          >
            Power user
          </button>
          <button 
            className={filter === 'minimal' ? 'active' : ''}
            onClick={() => setFilter('minimal')}
          >
            Minimal
          </button>
        </div>
      </div>
      
      <div className="template-grid">
        {templates
          .filter(t => filter === 'all' || t.tags?.includes(filter))
          .map(template => (
            <TemplateCard
              key={`${template.author}-${template.name}`}
              template={template}
              onPreview={() => openPreview(template)}
              onInstall={() => installTemplate(template)}
            />
          ))}
      </div>
    </div>
  );
}
```

---

## 9. Storybook Integration

### 9.1 Stories

```tsx
// stories/CreatorCorner.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CreatorCorner } from '../CreatorCorner';

const meta: Meta<typeof CreatorCorner> = {
  component: CreatorCorner,
  argTypes: {
    activeEditor: {
      control: 'select',
      options: ['theme', 'layout', 'components', 'templates'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CreatorCorner>;

export const ThemeEditor: Story = {
  args: {
    activeEditor: 'theme',
  },
};

export const LayoutEditor: Story = {
  args: {
    activeEditor: 'layout',
  },
};

export const ComponentEditor: Story = {
  args: {
    activeEditor: 'components',
  },
};

export const TemplateBrowser: Story = {
  args: {
    activeEditor: 'templates',
  },
};
```

---

## 10. Accessibility

### 10.1 Requirements

- **Full keyboard navigation** - All editors usable without mouse
- **Screen reader support** - ARIA labels on all controls
- **High contrast mode** - WCAG AAA for editor UI
- **Focus indicators** - Clear focus rings
- **Plain language** - "Make text easier to read" not "Adjust letter-spacing"

### 10.2 Implementation

```tsx
// editors/ThemeEditor.tsx - accessibility
export function ThemeEditor() {
  return (
    <div className="theme-editor">
      <h1 id="theme-editor-title">Design a UI Skin</h1>
      
      <section aria-labelledby="font-section">
        <h2 id="font-section">Font Family</h2>
        <FontSelector
          aria-describedby="font-description"
          // ...
        />
        <p id="font-description" className="sr-only">
          Choose a font for your terminal. OpenDyslexic is recommended for readability.
        </p>
      </section>
      
      <section aria-labelledby="color-section">
        <h2 id="color-section">Color Palette</h2>
        <ColorPicker
          aria-label="Background color"
          aria-describedby="bg-contrast"
          // ...
        />
        <div id="bg-contrast" role="status" aria-live="polite">
          Contrast ratio: 12.5:1 (WCAG AAA)
        </div>
      </section>
      
      <button 
        onClick={onReset}
        aria-label="Reset all settings to accessible defaults"
      >
        Reset to Accessible Default
      </button>
    </div>
  );
}
```

---

## 11. Creator Corner UX Principles

### 11.1 Progressive Disclosure

Show only the most important options first. "Advanced" toggles reveal deeper controls.

```tsx
<section>
  <h3>Font Settings</h3>
  <FontFamilySelector />
  <FontSizeSlider />
  
  <button 
    onClick={() => setShowAdvanced(!showAdvanced)}
    aria-expanded={showAdvanced}
  >
    {showAdvanced ? 'Hide' : 'Show'} Advanced
  </button>
  
  {showAdvanced && (
    <>
      <LetterSpacingSlider />
      <FontWeightSelector />
      <FontSmoothingToggle />
    </>
  )}
</section>
```

### 11.2 Live Preview

Every change shows a live preview pane. No guesswork.

```tsx
<div className="editor-with-preview">
  <div className="editor-controls">
    {/* Controls */}
  </div>
  
  <div className="preview-pane">
    <h4>Live Preview</h4>
    <div className="preview-content" style={livePreviewStyles}>
      <code>$ cargo build --release</code>
      <pre>Compiling buddy-daemon v0.1.0...</pre>
      <p>The quick brown fox jumps over the lazy dog.</p>
    </div>
  </div>
</div>
```

### 11.3 Plain Language

"Make text easier to read" not "Adjust letter-spacing CSS property."

```tsx
<Slider
  label="Make text easier to read"
  description="More space between letters improves readability for some users"
  value={letterSpacing}
  onChange={setLetterSpacing}
  min={0}
  max={0.2}
  step={0.01}
  renderThumb={(value) => `${(value * 100).toFixed(0)}%`}
/>
```

### 11.4 One-Click Reset

"Undo this change" and "Reset to accessible default" always visible.

```tsx
<div className="editor-actions">
  <button onClick={onUndo} disabled={!canUndo}>
    Undo
  </button>
  <button onClick={onResetToDefaults}>
    Reset to Accessible Default
  </button>
  <button onClick={onSave} className="primary">
    Save Changes
  </button>
</div>
```

---

## 12. Testing

### 12.1 Unit Tests

```tsx
// editors/ThemeEditor.test.tsx
import { render, screen } from '@testing-library/react';
import { ThemeEditor } from './ThemeEditor';

describe('ThemeEditor', () => {
  it('renders font family selector', () => {
    render(<ThemeEditor />);
    expect(screen.getByLabelText('Font Family')).toBeInTheDocument();
  });
  
  it('shows WCAG contrast warning for low contrast', () => {
    // ... test implementation
  });
  
  it('resets to accessible defaults when clicked', () => {
    // ... test implementation
  });
});
```

### 12.2 Integration Tests

- Template save/load/export/import
- Layout persistence across sessions
- CSS variable generation and application
- Community template installation

---

## 13. Future Enhancements

### 13.1 Planned Features

- **Voice-guided creation** - "Hey Buddy, help me make a template"
- **AI-powered suggestions** - "Based on your usage, try this layout"
- **Template versioning** - Track changes to templates over time
- **A/B testing** - Try two templates and see which works better
- **Template analytics** - See how many people installed your template

### 13.2 Stretch Goals

- **Collaborative editing** - Co-create templates with friends
- **Template marketplace** - Paid templates with revenue share
- **Animated transitions** - Smooth theme switching
- **Context-aware templates** - Different templates for different projects

---

## 14. Related Modules

- **Session** - Customizable appearance via Creator Corner
- **Terminal Pane** - Theme and layout customization
- **Component Registry** - Component discovery and enabling
- **Theme System** - CSS variable generation

---

## 15. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-24 | Initial module specification |

---

*This module document follows the PRODUCT_SPEC_V2.md specification. For implementation details, see the source code in `buddy-app/src/modules/creator-corner/`.*

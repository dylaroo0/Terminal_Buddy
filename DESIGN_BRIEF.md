# Terminal Buddy — UI Design Direction & Constraints

**Date:** 2026-03-28\
**Locked By:** Dylaroo\
**Status:** 🔴 CRITICAL DESIGN BRIEF

***

## **CORE LAYOUT CONSTRAINTS** (Non-negotiable)

### **Primary Layout**

```
┌─────────────────────────────────────────────┐
│  [Thin Top Bar]  (minimal height)           │  ← Thin, controls only
├──────────────────┬──────────────────────────┤
│                  │                          │
│  Side Panel      │   Terminal Area          │
│  (Modular)       │   (Main Content)         │
│  • Topics        │                          │
│  • Search        │                          │
│  • Metadata      │                          │
│  [Toggleable]    │                          │
│                  │                          │
└──────────────────┴──────────────────────────┘
```

### **Design Philosophy**

* ✅ **Side panel is primary navigation** — not top
* ✅ **Top bar is minimal** — controls, buttons, status only
* ✅ **Side panel is modular** — can be hidden, resized, rearranged
* ✅ **Fully customizable** — fonts, colors, layout preferences
* ✅ **Progressive disclosure** — show what user needs, hide the rest
* ✅ **Built for extensibility** — room to grow without major rework

### **Think Ahead: Extensibility Requirements**

> Design with future features in mind. Don't lock us into a corner.

**For Sally to keep in mind during architecture:**

* **Movable/draggable panels** — Use position-agnostic component structure
  * Architecture: Panel wrapper should accept position state (top, left, right, bottom, float)
  * Not hardcoded to one layout
  * CSS: Use CSS Grid or Flexbox that adapts to panel reordering

* **Theme system** — Build theme infrastructure from day 1
  * Use CSS variables (--color-primary, --color-bg, --font-size-base, etc.)
  * Theme provider context (React Context API)
  * Easy to add new themes later without refactoring components

* **Proportional scaling** — Panels should scale relative to each other
  * Use `flex` layouts with dynamic ratios
  * Not fixed pixels
  * When user resizes one panel, others adjust proportionally

* **High contrast mode** — Plan for it in design
  * Use strong contrast ratios in base design (WCAG AAA)
  * Add `@media (prefers-contrast)` in CSS from the start
  * Not a bolt-on later

* **Plugin/extensible architecture** — Leave hooks for future
  * Component composition (slots, children rendering)
  * Custom context providers for user settings
  * Not monolithic components

**Example of "thinking ahead":**

```
GOOD: Panel component accepts { position, resizable, draggable, theme, size }
BAD: Panel component hardcoded to left side, fixed width, dark theme only
```

**This ensures:**

* MVP ships clean (features X, Y, Z)
* Phase 2 adds draggable panels (no refactor)
* Phase 3 adds theme customization (no refactor)
* All components stay flexible

***

## **CUSTOMIZATION REQUIREMENTS**

### Users Should Be Able To:

* \[ ] **Toggle side panel** (show/hide)
* \[ ] **Resize side panel** (drag edge)
* \[ ] **Choose fonts** (typeface, size, line-height)
* \[ ] **Choose theme** (dark/light/custom)
* \[ ] **Choose file system** (local, remote, hybrid)
* \[ ] **Rearrange panels** (Topics top, Search bottom, etc.)
* \[ ] **Save layout presets** (my layout, minimal, full-featured)

### Future Options:

* \[ ] Multi-theme support (Atkinson, system fonts, custom fonts)
* \[ ] Accessible typography options
* \[ ] Split pane orientations (horizontal/vertical)
* \[ ] Custom keybindings
* \[ ] Plugin architecture (extensible UI components)

***

## **TOP BAR** (Thin, Control-Focused)

```
┌────────────────────────────────────────────┐
│ [☰ Toggle] [Current Path] [⊙ Theme] [⚙]   │  ← Icons only, minimal text
└────────────────────────────────────────────┘
```

What goes here:

* ✅ Menu toggle (show/hide side panel)
* ✅ Breadcrumb or path indicator (minimal)
* ✅ Quick actions (theme, settings, help)
* ❌ NO clutter, NO long text

Height: **40px max**

***

## **SIDE PANEL** (Modular, Customizable)

### Structure (Examples — can be rearranged)

**Option A: Stacked (Default)**

```
┌─────────────────┐
│ 📌 Topics       │  ← Collapsible section
│  • Active       │
│  • Completed    │
├─────────────────┤
│ 🔍 Search       │  ← Collapsible section
│ [search box]    │
├─────────────────┤
│ ℹ️  Metadata    │  ← Collapsible section
│  • Host: ...    │
│  • Time: ...    │
└─────────────────┘
```

**Option B: Tabbed**

```
┌─────────────────┐
│  Topics | Search │  ← Click to switch
├─────────────────┤
│ [Content]       │
└─────────────────┘
```

**Option C: Hybrid (Collapse/Expand)**

```
┌─────────────────┐
│ [≡] Topics      │  ← Click ≡ to collapse
│  • Active       │
│ [≡] Search      │  ← Click ≡ to collapse
│ [search box]    │
└─────────────────┘
```

***

## **DESIGN GOALS (For Sally)**

When Sally creates design options:

1. **Modular component library**
   * SidePanel (container, resizable)
   * TopBar (thin, icon-based)
   * PanelSection (collapsible, reorderable)
   * CustomizationMenu (fonts, themes, layouts)

2. **Customization UI**
   * Settings page for: fonts, colors, layout
   * Preset layouts (Power User / Minimal / Full-Featured)
   * Live preview as user changes options

3. **Accessibility First**
   * Atkinson Hipster font support (dyslexic-friendly)
   * Configurable text size (14px–24px)
   * High contrast options (WCAG AAA)
   * Keyboard-navigable side panels

4. **Progressive Enhancement**
   * MVP: Fixed side panel + thin top bar
   * Phase 2: Resizable panels
   * Phase 3: Preset layouts
   * Phase 4: Plugin system (extensible)

***

## **FONTS TO EXPLORE** (Dylaroo's Research)

When you gather fonts:

* **Atkinson Hipster** (dyslexic accessibility)
* **System fonts** (Comic Sans for accessibility research? check actual options)
* **Monospace** (for code/terminal: JetBrains Mono, Cascadia, SF Mono)
* **Serif** (for labels: Inter, Roboto, Georgia)
* **Variable fonts** (customizable weight/width)

Sally will create **3 font system options**:

1. Minimal (1 monospace, 1 sans-serif)
2. Balanced (monospace + sans + serif)
3. Rich (variable fonts, multiple choices)

***

## **FILE SYSTEM OPTIONS** (For Later Research)

What you're looking for:

* **Local files** (currently implemented)
* **Remote SSH** (connect to servers)
* **Docker volumes** (inside containers)
* **IPFS/Blockchain** (distributed)
* **Custom handlers** (plugin architecture)

Sally will design **file system selector** in settings.

***

## **MVP vs Future Roadmap** (Build with Tomorrow in Mind)

### **MVP (Task 5 & 6 — Ship This)**

* ✅ Side panel with collapsible topics/search
* ✅ Thin top bar with minimal controls
* ✅ Basic customization (theme, font size)
* ✅ WCAG AAA accessible from day 1

### **Phase 2 (Later — Room Built In)**

* 🔮 Draggable/movable panels (architecture ready for this)
* 🔮 Full theme customization UI (CSS variables in place)
* 🔮 Proportional panel resizing (flex layouts, not fixed)
* 🔮 High contrast mode (media queries ready)

### **Phase 3+ (Way Later — Extensible)**

* 🔮 Plugin system (component hooks designed in)
* 🔮 Custom panel types (architecture supports this)
* 🔮 Advanced file system integration (hooks ready)
* 🔮 User-shared preset library

**Sally: Design components so Phase 2 features are a 1-sprint addition, not a refactor.**

***

## **TASK 6: SPLIT PANE MANAGER** (Critical Requirements)

### **Core Feature: Command Causality Tracing**

When a user runs a command, they see **real-time correlation** between the command and system impact:

```
Timeline View:
14:23 $ npm install
      ↓ CPU spikes 80% (3 cores maxed)
      ↓ Memory jumps 512MB → 2.1GB  
      ↓ Disk I/O heavy (node_modules writes)
      ↓ GPU: idle (this is CPU work)
14:27 ✓ Complete
```

**Metrics to capture (Priority Order):**
1. **CPU per-core** (stacked area chart or per-core bars)
2. **Memory** (bar gauge or line chart)
3. **GPU usage** (% active, CUDA jobs)
4. **Disk I/O** (read/write bytes/sec)
5. **Network** (optional — secondary)

**Architecture:** Timeline scrubber shows metrics tied to each command timestamp. User can hover/click commands to see their resource footprint.

### **Multiple Terminals Support**

* **MVP:** Single terminal pane (full width)
* **Phase 2:** Up to 4 terminal instances in one workspace
* **Color coding:** Each terminal spawns with distinct color (visual tab distinction)
* **Architecture:** PTY management must support isolated terminal sessions with metadata

Sally: Design for extensibility — pane manager should work for 1-4 terminals without rework.

***

## **DELIVERABLES FOR TASK 5 & 6**

### **Sally's Design Options** (3 directions)

**Option 1: Minimal & Clean**

* Thin top bar (style: flat, monochrome)
* Side panel: Topics only (collapsible)
* One font choice (Atkinson, 16px)
* Maximum screen space for terminal

**Option 2: Rich & Accessible**

* Thin top bar (style: icon + labels)
* Side panel: Topics + Search + Metadata (tabs)
* Font customization UI
* Contrast-first design

**Option 3: Modular & Extensible**

* Thin top bar (style: dynamic, theme-aware)
* Side panel: Stacked sections (all collapsible)
* Full customization menu (fonts, colors, layout)
* Plugin-ready architecture

***

## **NEXT STEPS**

1. ✅ **Dylaroo:** Gather fonts & inspiration (you're doing this)
2. ⏳ **BMAD Master:** Assign Sally to design (waiting)
3. ⏳ **Sally:** Create 3 options (design phase)
4. ⏳ **Dylaroo:** Review + pick direction (your call)
5. ⏳ **Amelia:** Build approved design (implementation)

***

## **Questions for Dylaroo**

* **Side panel width:** Default 250px? Resizable? Collapsed state?
* **Top bar height:** 40px OK? Include icons + text or icons only?
* **First priority:** Minimal (MVP) or Accessible (full-featured)?
* **Font system:** Just monospace or multiple typefaces?

**Answer when ready. Sally is waiting for these details.** 📍

***

## **UI REFERENCE: Anti-Gravity Project**

**Location:** `/home/dylaroo/Documents/copy-of-anti-gravity-copilot.zip`\
**Extracted:** `/tmp/anti-gravity-ref/`

**Why It's Useful:**

* ✅ Side-based navigation (matches our design direction)
* ✅ Modular component architecture
* ✅ Service-based business logic
* ✅ Proven UI patterns (buttons, cards, panels)

**For Sally to Review:**

* `App.tsx` — Main layout + routing pattern
* `/components/` — Reusable UI components
* `/services/` — How services are structured
* `/utils/` — Helper function patterns

Use this as a **reference for component structure**, not a copy-paste blueprint.

***

**END DESIGN BRIEF. Sally will create 3 options based on this locked direction.** ✅

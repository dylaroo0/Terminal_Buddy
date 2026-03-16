# Terminal Buddy - Design System v2.0 (Updated 2026-02-22 22:45 UTC)

> **Generated:** 2026-02-22  
> **Updated:** 2026-02-22 22:45 UTC - Added Creator Corner Workshop Section  
> **Source:** UI/UX Pro Max Skill + BMad Party Mode Consensus  
> **Status:** Implementation Ready

---

## Design Philosophy

**Terminal Buddy is for someone who finds the terminal intimidating.** The design must feel **safe, readable, and welcoming** — not like a hacker movie. Accessibility is not optional — it's the foundation.

### Core Principles

1. **Accessibility-First** — Dyslexia-friendly fonts, WCAG AAA contrast, keyboard navigation
2. **Journal, Not Terminal** — Notebook-style history, not a blinking cursor
3. **Explainable** — One button turns any command into a learning moment
4. **Local-First** — Privacy-respecting, no cloud dependency required

---

## Visual Style: Dark Mode OLED

| Attribute | Value |
|-----------|-------|
| **Style Name** | Vibrant & Block-based |
| **Keywords** | Bold, energetic, playful, block layout, geometric shapes, high color contrast, duotone, modern |
| **Best For** | Developer tools, accessibility-critical applications |
| **Performance** | ⚡ Good (OLED-optimized) |
| **Accessibility** | ✅ WCAG AAA compliant |

---

## Color Palette

| Role | Hex | Usage | Contrast Ratio |
|------|-----|-------|----------------|
| **Background (deep)** | `#0F172A` | Main app background | - |
| **Background (surface)** | `#1E293B` | Panels, cards, sidebar | - |
| **Background (elevated)** | `#334155` | Hover states, active items | - |
| **Primary** | `#3B82F6` | Action buttons, links, focus rings | 4.6:1 on bg-deep ✅ |
| **Primary (hover)** | `#2563EB` | Button hover, CTA | - |
| **Text (primary)** | `#F1F5F9` | Main text, headings | 15.4:1 on bg-deep ✅ |
| **Text (secondary)** | `#94A3B8` | Descriptions, timestamps | 6.5:1 on bg-deep ✅ |
| **Text (terminal)** | `#E2E8F0` | Terminal output text | - |
| **Success** | `#22C55E` | Exit code 0, healthy status | - |
| **Warning** | `#F59E0B` | Warnings, moderate disk usage | - |
| **Error** | `#EF4444` | Errors, failed commands | - |
| **Border** | `#334155` | Panel borders, dividers | - |

### Contrast Verification

All text meets **WCAG AAA** standards:
- Primary text on background: **15.4:1** (AAA requires 7:1)
- Secondary text on background: **6.5:1** (AA requires 4.5:1)
- Primary blue on background: **4.6:1** (AA requires 4.5:1)

---

## Typography

### Primary Choice: Atkinson Hyperlegible

| Role | Font | Weight | Size | Line Height |
|------|------|--------|------|-------------|
| UI headings | Atkinson Hyperlegible | 700 | 20-24px | 1.3 |
| UI body text | Atkinson Hyperlegible | 400 | 16px min | 1.6 |
| Terminal text | JetBrains Mono | 400 | 14-16px | 1.4 |
| Terminal bold | JetBrains Mono | 700 | 14-16px | 1.4 |
| Small labels | Atkinson Hyperlegible | 400 | 13-14px | 1.5 |

### Why Atkinson Hyperlegible?

Designed by the **Braille Institute** specifically for low-vision and dyslexic readers. Characters that are commonly confused (like `b/d`, `p/q`, `I/l/1`) are made visually distinct.

### CSS Import

```css
@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
```

### Typography Rules

- **Minimum body text:** 16px (never smaller for UI body text)
- **Line height:** 1.5-1.75 for body, 1.3 for headings
- **Line length:** 65-75 characters max per line
- **Letter spacing:** Slightly increased for body text (+0.01em)

---

## Layout: Notebook Journal

```
┌─────────────────────────────────────────────────────────────┐
│  TERMINAL BUDDY                         [Search] [Settings] │
│  [ 📖 Journal ]  [ ✨ Creator Corner ]  [ 🛠️ Workshop ]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [ Timeline ]  [ Topics ]  [ Search ]  ← Journal modes      │
│  ========================================================== │
```

## Creator Corner Workshop Design

The Creator Corner Workshop follows the same design principles but with enhanced interactivity:

### Workshop Navigation Pattern
- **Step indicator** with visual progress tracking
- **Live preview panel** showing real-time UI changes
- **Guided decision flow** (4 steps minimum)
- **Accessibility guardrails** preventing non-compliant choices

### Workshop Component Guidelines

| Component | Style Rules |
|-----------|-------------|
| **Template Cards** | `background: #1E293B`, `border: 1px solid #334155`, `border-radius: 8px`, `hover: background: #334155` |
| **Control Buttons** | `padding: 6px 12px`, `border-radius: 6px`, `active: background: #3B82F6`, `color: #F1F5F9` |
| **Preview Panel** | `background: #0F172A`, `border-radius: 8px`, `min-height: 300px` |
| **Step Indicator** | `dot: 24px × 24px`, `active: #3B82F6`, `completed: #3B82F6`, `line: #334155` |

### Workshop Typography

Same font system as main app:
- **Workshop headings**: Atkinson Hyperlegible 700, 20px
- **Step descriptions**: Atkinson Hyperlegible 400, 16px
- **Preview text**: JetBrains Mono 400, 14px
- **Button text**: Atkinson Hyperlegible 500, 14px

### Accessibility Requirements for Workshop

- **All interactive elements** must be keyboard navigable (Tab/Enter/Space)
- **Color contrast** must maintain WCAG AAA standards even when customizing
- **Font size minimum** of 16px for all user-facing text
- **Focus states** must be visible (2px blue outline: `#3B82F6`)
│                                                             │
│  Your Terminal Journal                         [+ New]      │
│                                                             │
│  ──── February 22, 2026 ────                                │
│                                                             │
│  ┌─ Fix CI Pipeline ──────────────────────────────────┐    │
│  │ 9:15 AM - 9:45 AM · 8 commands                     │    │
│  │                                                    │    │
│  │ ┌─ 9:18 AM · npm install --legacy-peer-deps ✓ ─┐ │    │
│  │ │ [💡 Explain] [📝 Note] [🔄 Re-run]           │ │    │
│  │ │ added 123 packages, found 0 vulnerabilities  │ │    │
│  │ └────────────────────────────────────────────────┘ │    │
│  │                                                    │    │
│  │ ┌─ 9:25 AM · git push origin main ✓ ─────────┐   │    │
│  │ │ [💡 Explain] [📝 Note] [🔄 Re-run]         │   │    │
│  │ │ To github.com:dylaroo/my-app.git           │   │    │
│  │ └────────────────────────────────────────────┘   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ──── February 21, 2026 ────                                │
│  ...                                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
│  [▲ Expand Terminal]  ← Collapsible pane (~35% height)      │
└─────────────────────────────────────────────────────────────┘
```

### Layout Rules

- **Top nav**: ONLY Journal + Creator Corner (2 options)
- **Journal modes**: Timeline / Topics / Search (inside Journal view)
- **Terminal pane**: Collapsible at bottom, NOT a top-level tab
- **NO System tab** — System health lives in Buddy Panel / command cards
- **Session-based organization:** Commands grouped by session, sessions by date
- **Command cards:** Each command shows input, output, status, and actions
- **Notebook metaphor:** Scroll like a journal, not a terminal buffer
- **48px+ gaps:** Between major sections for visual clarity

---

## Components

### Command Approval Card

```
┌─────────────────────────────────────┐
│  Buddy suggests:                     │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │ $ npm install --legacy-peer-deps│ │
│  └─────────────────────────────────┘ │
│                                      │
│  This bypasses the dependency         │
│  version conflict and installs       │
│  packages with older peer resolution.│
│                                      │
│  [Approve]  [Edit]  [Cancel]         │
│                                      │
└─────────────────────────────────────┘
```

- **Border-left accent:** 4px solid primary blue
- **Command shown:** Monospace on dark surface
- **Explanation:** Body font below
- **Three clear action buttons:** Approve (primary), Edit (outline), Cancel (ghost)

### Session History Item

```
┌─────────────────────────────────────┐
│  9:15 AM  $ npm install         ✗   │
│  Exit 1 · 3 files changed · 2.1s    │
└─────────────────────────────────────┘
```

- **Green dot/check** for success, red for failure
- **Timestamp, command, exit status** on one line
- **Metadata** (files changed, duration) in secondary text below
- **Click to expand** full output

### System Health Bar

```
CPU  ████░░░░░░  12%
RAM  ██████░░░░  45%
Disk ████████░░  67%   ⚠ cleanup available
```

- **Green** under 50%, **amber** 50-80%, **red** 80%+
- **Cleanup link** when disk is high

---

## Animation & Motion

| Element | Duration | Easing | Notes |
|---------|----------|--------|-------|
| Panel toggle (show/hide) | 200ms | ease-out | Slide in from right |
| Hover state transitions | 150ms | ease-out | Color/opacity changes only |
| Approval card appear | 250ms | ease-out | Fade + slide up |
| Section collapse/expand | 200ms | ease-out | Height transition |
| Loading skeleton | pulse | ease-in-out | For async data loading |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

All animations respect `prefers-reduced-motion`. No parallax, no scroll-jacking, no auto-playing animations.

---

## Icons

- **Icon set:** Lucide React (consistent, lightweight, MIT licensed)
- **Size:** 20x20px for UI, 16x16px for inline
- **NO emojis as icons** — always use SVG
- **Color:** inherit from text color (muted for decorative, primary for interactive)

---

## Interaction Rules

| Rule | Implementation |
|------|----------------|
| **Cursor pointer** | `cursor-pointer` on all clickable elements |
| **Hover feedback** | Background color shift or opacity change |
| **Focus rings** | 2px solid primary blue (`#3B82F6`) with 2px offset |
| **Tab order** | Matches visual order (top-to-bottom, left-to-right) |
| **Disabled states** | Opacity 50% + `cursor-not-allowed` during async operations |
| **Error messages** | Appear near the source of the problem |

---

## Accessibility Checklist

### CRITICAL (Must Have)

- [x] Font: Atkinson Hyperlegible (dyslexia-optimized)
- [x] Minimum 16px body text
- [x] WCAG AAA contrast ratios on all text
- [x] `prefers-reduced-motion` respected
- [x] Keyboard navigation with visible focus states
- [x] No color as sole indicator (icons + text alongside color)
- [x] `aria-label` on icon-only buttons
- [x] Form inputs with associated labels
- [x] Skip link to main content

### HIGH (Should Have)

- [ ] All images have alt text
- [x] Responsive: works at 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed elements
- [ ] Consistent max-width for containers

### MEDIUM (Nice to Have)

- [ ] Smooth transitions (150-300ms)
- [ ] Skeleton screens for async loading
- [ ] Error boundaries for React components

---

## Anti-Patterns to Avoid

| Don't | Why | Do Instead |
|-------|-----|------------|
| Flat design without depth | Hard to distinguish panels | Use subtle elevation (surface colors) |
| Text-heavy pages | Overwhelming, especially for dyslexic users | Break into cards, use whitespace |
| Neon glow effects | Eye strain, accessibility issues | Subtle color accents |
| Scale transforms on hover | Causes layout shift | Color/opacity transitions |
| Small text for metadata | Unreadable | Minimum 13px even for labels |
| Low-contrast borders | Invisible panel boundaries | Use `#334155` on `#0F172A` |
| Emoji as icons | Unprofessional, inconsistent | Use SVG icons (Lucide, Heroicons) |
| Remove focus outline | Keyboard users get lost | Use `focus:ring-2 focus:ring-blue-500` |

---

## Pre-Delivery Checklist

Before shipping any UI component, verify:

### Visual Quality

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Lucide)
- [ ] Hover states don't cause layout shift
- [ ] Use theme colors directly, not var() wrappers

### Interaction

- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover states provide clear visual feedback
- [ ] Transitions are smooth (150-300ms)
- [ ] Focus states visible for keyboard navigation

### Light/Dark Mode

- [ ] Dark mode text has sufficient contrast (4.5:1 minimum)
- [ ] Glass/transparent elements visible in both modes
- [ ] Borders visible in both modes

### Layout

- [ ] Floating elements have proper spacing from edges
- [ ] No content hidden behind fixed navbars
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile

### Accessibility

- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Color is not the only indicator
- [ ] `prefers-reduced-motion` respected
- [ ] Tab order matches visual order

---

## Implementation Notes

### React Performance

- Use `React.lazy` for code splitting heavy components
- Profile with React DevTools before optimizing
- Batch state updates (React 18 auto-batches)

### Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Atkinson Hyperlegible', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        slate: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          // ... rest of scale
        },
      },
    },
  },
}
```

### CSS Variables

```css
:root {
  --bg-deep: #0F172A;
  --bg-surface: #1E293B;
  --bg-elevated: #334155;
  --primary: #3B82F6;
  --primary-hover: #2563EB;
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
}
```

---

*This design system is the single source of truth for all Terminal Buddy UI work. Reference it before writing any frontend code.*

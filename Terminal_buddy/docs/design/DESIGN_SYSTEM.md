# Terminal Buddy - Design System

> Generated using ui-ux-pro-max skill, 2026-02-22
> Status: Design direction for Phase B (desktop app)

---

## Design Philosophy

Terminal Buddy is for someone who finds the terminal intimidating. The design must feel **safe, readable, and welcoming** - not like a hacker movie. Dark mode is essential (it's a terminal), but it should feel warm and approachable, not cold and techy.

---

## Style: Dark Mode (OLED) - Accessible Variant

We're going with **Dark Mode OLED** over Cyberpunk. Here's why:

| | Dark Mode OLED | Cyberpunk UI |
|---|---|---|
| Performance | Excellent | Moderate |
| Accessibility | WCAG AAA | Limited |
| Complexity | Low | Medium |
| Eye strain | Minimal | High (neon glow) |
| Fits our user | Yes (dyslexia-friendly) | No (visual noise) |

**Keywords:** Dark theme, high contrast, eye-friendly, night mode, clean, readable

---

## Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Background (deep) | Dark slate | `#0F172A` | Main app background |
| Background (surface) | Raised surface | `#1E293B` | Panels, cards, sidebar |
| Background (elevated) | Lighter surface | `#334155` | Hover states, active items |
| Primary | Blue | `#3B82F6` | Action buttons, links, focus rings |
| Primary (hover) | Darker blue | `#2563EB` | Button hover, CTA |
| Text (primary) | Light slate | `#F1F5F9` | Main text, headings |
| Text (secondary) | Muted | `#94A3B8` | Descriptions, timestamps |
| Text (terminal) | White | `#E2E8F0` | Terminal output text |
| Success | Green | `#22C55E` | Exit code 0, healthy status |
| Warning | Amber | `#F59E0B` | Warnings, moderate disk usage |
| Error | Red | `#EF4444` | Errors, failed commands |
| Border | Subtle | `#334155` | Panel borders, dividers |

### Contrast Ratios (verified against WCAG AA)

- Primary text (`#F1F5F9`) on background (`#0F172A`): **15.4:1** (AAA)
- Secondary text (`#94A3B8`) on background (`#0F172A`): **6.5:1** (AA)
- Primary blue (`#3B82F6`) on background (`#0F172A`): **4.6:1** (AA)

---

## Typography

### Primary Choice: Atkinson Hyperlegible + JetBrains Mono

| Role | Font | Weight | Size | Why |
|------|------|--------|------|-----|
| UI headings | Atkinson Hyperlegible | 700 | 20-24px | Designed for maximum legibility, dyslexia-friendly |
| UI body text | Atkinson Hyperlegible | 400 | 16px min | Same family, consistent, highly readable |
| Terminal text | JetBrains Mono | 400 | 14-16px | Best monospace for code, ligatures, clear zero/O distinction |
| Terminal bold | JetBrains Mono | 700 | 14-16px | For command input emphasis |
| Small labels | Atkinson Hyperlegible | 400 | 13-14px | Timestamps, metadata |

### Why These Fonts

**Atkinson Hyperlegible** was designed by the Braille Institute specifically for low-vision and dyslexic readers. Characters that are commonly confused (like `b/d`, `p/q`, `I/l/1`) are made visually distinct.

**JetBrains Mono** is the best monospace font for terminal use - clear character distinction, coding ligatures, and excellent readability at small sizes.

### CSS Import

```css
@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
```

### Tailwind Config

```js
fontFamily: {
  sans: ['Atkinson Hyperlegible', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

### Typography Rules

- **Minimum body text:** 16px (never smaller for UI body text)
- **Line height:** 1.5-1.75 for body, 1.3 for headings
- **Line length:** 65-75 characters max per line
- **Letter spacing:** Slightly increased for body text (+0.01em)

---

## Layout: Split Panel

```
+------------------------------------------+---------------------------+
|                                          |                           |
|  TERMINAL PANE                           |  BUDDY PANEL              |
|  (WezTerm engine)                        |  (React sidebar)          |
|                                          |                           |
|  Full terminal emulator                  |  ┌─ Chat Input ─────────┐ |
|  with tabs across the top                |  │ "What does this      │ |
|                                          |  │  error mean?"        │ |
|  $ npm install                           |  └───────────────────────┘ |
|  npm ERR! ERESOLVE                       |                           |
|  npm ERR! unable to resolve              |  ┌─ Buddy Response ─────┐ |
|                                          |  │ Two packages need     │ |
|                                          |  │ different React       │ |
|                                          |  │ versions. Try:        │ |
|                                          |  │                       │ |
|                                          |  │ npm install --legacy  │ |
|                                          |  │                       │ |
|                                          |  │ [Run] [Edit] [No]     │ |
|                                          |  └───────────────────────┘ |
|                                          |                           |
|                                          |  ┌─ Session History ────┐ |
|                                          |  │ 9:15 npm install  ✗  │ |
|                                          |  │ 9:10 git push     ✓  │ |
|                                          |  │ 9:05 cargo build  ✓  │ |
|                                          |  └───────────────────────┘ |
|                                          |                           |
|                                          |  ┌─ System ────────────┐  |
|                                          |  │ CPU 12% | RAM 45%   │  |
|                                          |  │ Disk 67% ████░░     │  |
|                                          |  └───────────────────────┘ |
+------------------------------------------+---------------------------+
|  [Tab 1: project]  [Tab 2: server]  [+]  |  [Chat] [History] [Sys]  |
+------------------------------------------+---------------------------+
```

### Layout Rules

- Terminal pane: ~65% width (resizable)
- Buddy panel: ~35% width (resizable, collapsible)
- Buddy panel can be toggled with a keyboard shortcut
- Panel sections are collapsible (chat, history, system)
- 48px+ gaps between major sections in Buddy Panel
- No content hidden behind fixed elements

---

## Components

### Command Approval Card

When Buddy suggests a command, show it in an approval card:

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

- Blue border-left accent on the card
- Command shown in monospace on dark surface
- Explanation in body font below
- Three clear action buttons
- Approve = primary blue, Edit = outline, Cancel = ghost/text

### Session History Item

```
┌─────────────────────────────────────┐
│  9:15 AM  $ npm install         ✗   │
│  Exit 1 · 3 files changed · 2.1s    │
└─────────────────────────────────────┘
```

- Green dot/check for success, red for failure
- Timestamp, command, exit status on one line
- Metadata (files changed, duration) in secondary text below
- Click to expand full output

### System Health Bar

```
CPU  ████░░░░░░  12%
RAM  ██████░░░░  45%
Disk ████████░░  67%   ⚠ cleanup available
```

- Green under 50%, amber 50-80%, red 80%+
- Cleanup link when disk is high

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
- **NO emojis as icons** - always use SVG
- **Color:** inherit from text color (muted for decorative, primary for interactive)

---

## Interaction Rules

- All clickable elements have `cursor-pointer`
- Visible focus rings on all interactive elements (2px blue outline)
- Tab order matches visual order
- Hover states provide clear visual feedback (background color shift)
- Buttons disabled during async operations with loading indicator
- Error messages appear near the source of the problem

---

## Accessibility Checklist

- [x] Font: Atkinson Hyperlegible (dyslexia-optimized)
- [x] Minimum 16px body text
- [x] WCAG AA contrast ratios on all text
- [x] `prefers-reduced-motion` respected
- [x] Keyboard navigation with visible focus states
- [x] No color as sole indicator (icons + text alongside color)
- [x] `aria-label` on icon-only buttons
- [x] Form inputs with associated labels
- [x] Responsive: works at 375px, 768px, 1024px, 1440px

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

---

*This design system guides all UI work for Terminal Buddy Phase B. Reference it before writing any frontend code.*

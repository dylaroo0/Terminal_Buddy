# Terminal Buddy — Design References Library

**Date:** 2026-03-28\
**Purpose:** Gathering inspiration + patterns for UI design\
**Status:** 🔍 Building reference collection

***

## **Design Reference Strategy**

### How It Works:

1. **Gather references** (UI patterns, terminal emulators, customization examples)
2. **Sally reviews** them while creating 3 design options
3. **You see 3 directions** (informed by best practices)
4. **You pick** (light feedback, maybe small tweaks)
5. **Amelia builds** (locked, no rework)

***

## **Found So Far** ✅

### **Anti-Gravity Project** (Side navigation pattern)

* **Path:** `/home/dylaroo/Documents/copy-of-anti-gravity-copilot.zip`
* **Key Pattern:** Side panel + minimal top bar
* **Components:** Modular services, reusable buttons/cards
* **For Sally:** Layout + component structure

### **system-monitor-server** (Real-time metrics visualization)

* **Path:** `/home/dylaroo/projects/Terminal_buddy/ext-apps/examples/system-monitor-server/`
* **Key Pattern:** Stacked area charts, bar gauges, live updates
* **For Sally:** Rich data visualization + customizable metrics display
* **Why:** Shows pattern for Task 6 split pane (terminal + metrics)

### **rich-master** (Typography & layout library)

* **Path:** `/home/dylaroo/projects/Terminal_buddy/rich-master/`
* **Key Pattern:** Beautiful terminal tables, progress bars, color schemes
* **For Sally:** Font options, accessibility patterns, data display
* **Why:** Reference for Atkinson font + readable typography

### **Terminal Emulator Inspiration** (~/terminal\_Buddy/inspiration/)

| Project | Pattern | For Task |
|---------|---------|----------|
| **nvim** | Split pane management | Task 6: pane layout |
| **yazi** | Multi-pane file navigator | Task 6: side panel navigation |
| **atuin** | Command history + search | Task 5: topics/search sidebar |
| **ez-stack** | Tab management | Task 6: tab UI |
| **system-monitors** | Real-time metrics | Task 6: metrics display |

***

## **Gathering More References** (In Progress)

### **What We're Looking For:**

**Category 1: Customization/Theme Systems**

* How other apps let users customize fonts/colors
* Settings UI patterns
* Preset layout storage
* Theme switcher examples

**Category 2: Modular/Resizable Panels**

* How VS Code handles side panels + resizing
* How Notion handles collapsible sections
* How Slack handles sidebar customization
* How tmux handles pane layouts

**Category 3: Accessibility-First Design**

* Atkinson Hipster font in action
* High contrast themes
* Keyboard navigation patterns
* Screen reader support

**Category 4: Rich Terminal UX**

* How iTerm2 customizes terminal appearance
* How kitty handles fonts + themes
* How alacritty does minimal + fast
* How wezterm handles modularity

**Category 5: Real-Time Data Display** (For Task 6 split panes)

* How Grafana displays metrics
* How htop shows system info
* How bottom visualizes performance
* How iotop shows I/O data

***

## **How to Add References**

**When you find a good design pattern:**

1. **Describe what you found**
   ```
   Name: [Project/App]
   Type: [Category above]
   URL/Path: [Link or location]
   Key Pattern: [What it does well]
   Why It Matters: [How it helps Task 5/6]
   Screenshot: [Optional: save to /docs/references/]
   ```

2. **Add to list below** (FOUND REFERENCES section)

3. **Sally reviews** before creating options

***

## **FOUND REFERENCES** (Add here as we discover)

✅ Anti-Gravity (side nav + components)\
✅ system-monitor-server (metrics viz)\
✅ rich-master (typography)\
✅ nvim/yazi/atuin/ez-stack (terminal patterns)

⏳ *More incoming...*

***

## **For Sally When Creating Options**

**3 Design Directions to Explore:**

**Option 1: Minimal & Clean**

* Inspired by: Anti-Gravity minimalism
* Fonts: Single monospace (Cascadia, SF Mono)
* Panels: Collapsed by default, click to expand
* Themes: Light/Dark (2 preset options)
* **Best for:** Power users, screen real estate focused

**Option 2: Rich & Accessible**

* Inspired by: rich-master typography, system-monitor-server data viz
* Fonts: Atkinson Hipster + serif combo (full accessibility)
* Panels: Visible by default, collapsible
* Themes: High contrast + light + dark (3 presets)
* Customization: Font size slider (14px-24px), bold/italic toggles
* **Best for:** Accessibility-first, neurodiverse users, readable at distance

**Option 3: Modular & Extensible**

* Inspired by: VS Code + Slack (customizable everything)
* Fonts: Variable font system (pick weight, width, size)
* Panels: Drag to reorder, resize, hide/show individually
* Themes: Full color picker + preset library
* Settings: Save custom layout presets, shareable configs
* **Best for:** Creators, people who like to customize

***

## **Design Decision Flow** (For You)

When Sally shows 3 options:

```
┌──────────────────────────────┐
│ Here are 3 directions:       │
│ 1. Minimal                   │
│ 2. Accessible                │
│ 3. Modular                   │
└────────────────┬─────────────┘
                 │
        ✅ (You Pick)
                 │
    ┌────────────┼────────────┐
    │            │            │
   "Pick 1"   "Blend       "Try a
             these"       different
                          direction"
    │            │            │
    ✅          ✅            ↻
   Build       Build      (Sally creates
              adjusted    new option)
```

**Light touch. Your call. No BS.**

***

## **References Location**

Keep all references organized:

* **Code examples:** `/tmp/anti-gravity-ref/`, extracted projects
* **Screenshots:** `/docs/references/` (create if needed)
* **Notes:** This file (DESIGN\_REFERENCES.md)

***

**Status: Ready to collect more references. Sally is building from these foundations.** 📚
---

## ✅ Research Complete!

Your team's UI/UX reference research is ready. Here's what I gathered:

### 📁 Deliverables
| File | Location |
|------|----------|
| **HTML Report** | `/home/dylaroo/Documents/research-ui-references/report.html` (open in your browser) |
| **PDF Report** | `/home/dylaroo/Documents/research-ui-references/report.pdf` |
| **Full Findings** | `/home/dylaroo/Documents/research-ui-references/findings.md` |

### 🔬 5 Categories Researched

1. **🎨 Theme Systems** — VS Code's live-preview picker (`Ctrl+K Ctrl+T`), OS sync, TOML configs
2. **📐 Modular Panels** — tmux's 5 preset layouts (even-horizontal, main-vertical, tiled, etc.), zoom mode, Notion/Slack sidebar patterns
3. **♿ Accessibility** — Atkinson Hyperlegible font family (3 variants: regular, Next, Mono), high contrast patterns
4. **💻 Terminal UX** — kitty (GPU + images), Alacritty (minimal/fast), WezTerm (modular), iTerm2
5. **📊 Real-Time Data** — Grafana's panel architecture, htop/bottom system monitors

### ✨ Key Takeaways for Your Team
- **Live theme preview** dramatically improves UX (VS Code pattern)
- **4-5 preset layouts** cover most use cases (tmux pattern)
- **Atkinson Hyperlegible Mono** is perfect for terminal/code accessibility
- **GPU acceleration** is becoming standard for terminals
- **Panel-based dashboards** (Grafana) work best for real-time data

The report is open and ready for your team to review! I kept the reference tabs (VS Code, kitty, Grafana, etc.) open in case you want to dive deeper into any specific tool.
## 📋 DESIGN_REFERENCES.md Created

**Location:** `/home/dylaroo/Documents/research-ui-references/DESIGN_REFERENCES.md`

### What I Added (9 New References):

| Name | Type | Best For |
|------|------|----------|
| **VS Code** | Theme System | Live preview picker, OS sync |
| **tmux** | Panels | 5 preset layouts, zoom mode |
| **Atkinson Font** | Accessibility | Dyslexia-friendly, perfect for terminal |
| **kitty** | Terminal UX | GPU acceleration, images in terminal |
| **Alacritty** | Terminal UX | "Sensible defaults" philosophy |
| **Grafana** | Data Display | Panel architecture for Task 6 |
| **bottom** | Data Display | Widget system layout |
| **Notion** | Panels | Focus mode shortcut |
| **Slack** | Panels | Custom sections |

### 3 Design Directions Documented:

1. **Option 1: Minimal** — Alacritty/anti-gravity inspired, "just works"
2. **Option 2: Accessible** — Atkinson fonts throughout, sliders for size/spacing
3. **Option 3: Modular** — VS Code + tmux, full customization

---

**Ready for Sally!** She now has all the references formatted properly to create your 3 design options. No more research needed — time to build. 🎯

Want me to do anything else with this, or are you good to hand it off?
https://sw.kovidgoyal.net/kitty/
https://grafana.com/https://htop.dev/
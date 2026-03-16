# Terminal Buddy - Product Specification v2

> **Date:** 2026-02-22
> **Status:** ACTIVE - Primary product reference
> **Supersedes:** `2026-01_TERMINAL_BUDDY_MASTER_SPEC.md` for product vision and UI direction
> **Master Spec remains authoritative for:** Correlation Engine internals, Memvid .mv2 format, Security Model, HAL
> **Origin:** BMAD Party Mode session - collaborative product design with full agent team

---

## 1. Product Identity

### Tagline

**"A journal for your terminal that explains itself."**

### One-Liner

Terminal Buddy is the first terminal that learns with you — a searchable, explainable, accessible journal for everything you've ever done in a shell.

### Category

**Second brain for the terminal.** Notion is a second brain for documents. Obsidian is a second brain for notes. Terminal Buddy is a second brain for everything you've ever done in a shell — a connected history log that records every session, organizes it by subject, and lets you search, annotate, and learn from your entire command-line life.

### Brand Principle

**Personalization without complexity.** The terminal adapts to you, not the other way around. One-click setup with sensible, accessible defaults. Deep customization available but never required. Modular and customizable at every layer.

### Origin Story

This project was born from a real need. The primary designer found the terminal hostile — walls of cryptic text, commands that fail with error messages requiring expert knowledge to decode, no memory between sessions, and an interface that assumes you already know what you're doing.

Terminal Buddy's first user is someone who needs to *actually communicate with the terminal* — not just throw text at it and hope for the best. Talk to it in plain English. Ask it what happened. Ask it how the computer is doing. This shapes every design decision. A feature that doesn't serve that user doesn't ship.

### What Terminal Buddy Is Not

- **Not a toy.** The underlying terminal is fully professional — multi-window, full PTY support, and real command execution. It handles everything a production terminal does.
- **Not a simplified "baby" terminal.** The goal is to make the real thing accessible — not to replace it with something weaker.
- **Not cloud-dependent or local-only.** Local processing (Whisper, local LLMs) ensures privacy, but users can plug in cloud APIs (Claude, OpenAI, OpenRouter) if their hardware isn't powerful enough. The choice is always the user's.

---

## 2. The Product Wedge

The first thing a user sees when they open Terminal Buddy is **not a blinking cursor.** It's a journal.

Organized by date. Organized by subject. Every session is automatically titled based on what you were doing — and you can accept, edit, or retitle it with a single click. Sessions that share a subject are grouped into topics, so you can pull up "everything I did with Docker" or "all my git work this week" without remembering when it happened.

The journal is an always-on history log. Every command, every file it touched, every system change — recorded, searchable, and annotatable. You can add your own notes to any session or command. You can ask for an educational explanation of what a command did. You can check how it affected your computer — did it finish? Did it break something? What files changed?

And you can do all of this in plain English. "What was that command from Tuesday?" "How is my system doing?" "Run through these setup steps for me."

**The 60-second moment:** A user opens Terminal Buddy, sees their session history organized into topics, clicks "Explain" on a command from last Tuesday, and hears (or reads) a plain-language breakdown of what that command did to their system.

That moment — "I can never go back to a dumb terminal" — is the wedge.

---

## 3. Core Concepts

### 3.1 Sessions Are the Atomic Unit

Not individual commands. **Sessions.**

A session is a period of terminal activity, usually focused on one task or subject. Terminal Buddy automatically:

1. **Records** everything in the session (commands, output, filesystem changes, system state)
2. **Detects the subject** based on commands run, files touched, directories visited
3. **Auto-titles it** with a natural-language summary (e.g., "Debugging PTY capture timeout" or "Setting up MCP server tools")
4. **Groups related sessions** into topics over time

Sessions are the chapters of your terminal journal. Commands are the sentences within them.

### 3.2 The Journal (Primary View)

Terminal Buddy's primary interface is a **notebook/journal**, not a traditional terminal with a sidebar. It's a journal that has a terminal embedded in it.

The journal has three viewing modes:

| View | Purpose | Best For |
|------|---------|----------|
| **Timeline** | Chronological, organized by date | "What did I do today?" |
| **Topics** | Grouped by auto-detected subject | "Show me everything about the MCP server" |
| **Search** | Semantic full-text search | "That build error from last week" |

### 3.3 Teachable Moments (Explain Button)

Every command entry in the journal has an **[Explain]** button. Pressing it triggers Terminal Buddy to:

1. Read the command's stdout/stderr
2. Check the filesystem delta (files created/modified/deleted)
3. Check system logs from that exact timestamp
4. Synthesize a plain-language explanation grounded in actual system data
5. Optionally speak the explanation aloud via configured TTS provider

This is not an AI guessing from error text. It's an AI explaining from **correlated kernel data.** That's what makes it trustworthy.

### 3.4 User Notes

Users can add their own annotations to any session or command. Voice or text. "This fixed the build issue from yesterday." "Remember to run this before deploying."

User notes transform command history into a **personal knowledge base.**

### 3.5 Creator Corner

A dedicated space within Terminal Buddy where users design, customize, and share their experience. Not just "settings" - it's **empowerment.**

- **Design a UI Skin** - fonts, colors, spacing, layout with live preview
- **Build a Component** - new panels, widgets, or interaction patterns
- **Package a Template** - save your setup to share or reuse
- **Browse Community Templates** - discover what others have made

Creator Corner is optional. Most users pick a template at onboarding and go. Power users dive in to customize or share. Every customization has a "Reset to Accessible Default" button.

---

## 4. The Three User Personas

| Persona | Pain Point | Terminal Buddy Value | Revenue Tier |
|---------|------------|---------------------|--------------|
| **"Learning Dev"** - bootcamp grad, overwhelmed by CLI | "I don't know what commands do and I'm afraid to break things" | Explain button, command approval cards, voice input | Free (viral growth) |
| **"Power User with ADHD"** - senior dev, 50 terminal tabs | "I ran something last Tuesday that fixed the build but I can't find it" | Semantic session search, auto-titled topics, timeline scrubbing | Pro ($8/mo - advanced Memvid search) |
| **"Accessibility-First Org"** - company with DEI mandates | "We need to provide accessible tooling for our engineering team" | Full accessibility defaults, audit logs, centralized config | Enterprise ($20/seat/mo) |

**Build for Persona 2 first.** They give the best feedback - they know what they want, they're vocal, and they'll tell you when you're wrong. Persona 1 is viral growth. Persona 3 is revenue.

---

## 5. UI Architecture

### 5.1 Top-Level Navigation

```
[ Journal ]    [ Creator Corner ]
```

Two primary spaces. Journal is where you work. Creator Corner is where you shape the tool.

### 5.2 Journal View - Timeline Mode (Default)

```
+--------------------------------------------------+
|  TERMINAL BUDDY                        [mic] [gear]|
+--------------------------------------------------+
|                                                    |
|  [ Timeline ]    [ Topics ]    [ Search ]          |
|  ================================================  |
|                                                    |
|  Feb 22, 2026                                      |
|  ------------------------------------------------  |
|                                                    |
|  +- 1:15 PM ------------------------------------+  |
|  | $ cargo build --release                       |  |
|  | OK Compiled buddy-daemon (42s)                |  |
|  | [files] Changed: target/release/buddy-daemon  |  |
|  |                                               |  |
|  | [Explain]  [Re-run]  [Add Note]               |  |
|  +-----------------------------------------------+  |
|                                                    |
|  +- 12:49 PM -----------------------------------+  |
|  | $ cargo test                                  |  |
|  | OK 6 tests passed                             |  |
|  | [files] No filesystem changes                 |  |
|  |                                               |  |
|  | [Explain]  [Re-run]  [Add Note]               |  |
|  +-----------------------------------------------+  |
|                                                    |
|  Feb 21, 2026                                      |
|  ------------------------------------------------  |
|  ...                                               |
|                                                    |
+--------------------------------------------------+
|  [search] Search history...          [date] [tag]  |
|  > Terminal                                        |
+--------------------------------------------------+
```

### 5.3 Journal View - Topics Mode

```
+--------------------------------------------------+
|                                                    |
|  [ Timeline ]    [ Topics ]    [ Search ]          |
|  ================================================  |
|                                                    |
|  [folder] Terminal Buddy Daemon (12 sessions)      |
|  +-- Feb 22 - "Phase A completion & tests"         |
|  +-- Feb 22 - "Documentation generation"           |
|  +-- Feb 21 - "MCP server tool wiring"             |
|  +-- Feb 20 - "PTY capture debugging"              |
|                                                    |
|  [folder] BMAD System (8 sessions)                 |
|  +-- Feb 22 - "Agent manifest review"              |
|  +-- Feb 19 - "Workflow engine refactor"            |
|  +-- ...                                           |
|                                                    |
|  [folder] Uncategorized (2 sessions)               |
|  +-- Feb 22 - "System updates & apt"               |
|  +-- Feb 18 - "SSH key setup"                      |
|                                                    |
+--------------------------------------------------+
```

### 5.4 Command Card (Expanded)

```
+-----------------------------------------------+
| $ docker-compose up                            |
| 1:15 PM - Feb 22, 2026                         |
+-----------------------------------------------+
| OUTPUT                                         |
| Error: Port 8080 already in use                |
|                                                |
| SYSTEM IMPACT                                  |
| [files] docker-compose.yml (read)              |
| [cpu] 45.2% spike                              |
| [process] No new processes                     |
|                                                |
| EXPLANATION (auto-generated)                   |
| "You can't start this because Nginx is         |
|  already holding port 8080. Run                |
|  sudo lsof -i :8080 to confirm."              |
|                                                |
| YOUR NOTES                                     |
| "Fixed by killing the old nginx process"       |
|                                                |
| [Re-run]  [Copy Command]  [Edit Note]          |
+-----------------------------------------------+
```

### 5.5 Terminal Pane

Collapsible pane at the bottom of the journal view (or expandable to full-screen). Always available but the journal is the hero.

```
+--------------------------------------------------+
|  JOURNAL VIEW (scrollable, ~65% height)            |
|  ...                                               |
+--------------------------------------------------+
|  [drag handle to resize]                           |
+--------------------------------------------------+
|  > TERMINAL (collapsible, ~35% height)             |
|  $ _                                               |
|                                                    |
+--------------------------------------------------+
```

The terminal is **dumb** - a renderer only. All state, history, and intelligence lives in the daemon and flows through MCP.

### 5.6 Creator Corner

```
+--------------------------------------------------+
|  TERMINAL BUDDY              [ Journal ] [ Creator ]|
+--------------------------------------------------+
|                                                    |
|  What do you want to create?                       |
|                                                    |
|  [icon] Design a UI Skin                           |
|     fonts, colors, spacing, layout                 |
|                                                    |
|  [icon] Build a Component                          |
|     new panel, widget, or interaction              |
|                                                    |
|  [icon] Package a Template                         |
|     save your setup to share or reuse              |
|                                                    |
|  [icon] Browse Community Templates                 |
|     see what others have made                      |
|                                                    |
|             [ Start Creating ]                     |
+--------------------------------------------------+
```

---

## 6. Onboarding (First Run)

### 6.1 The Philosophy

Personalization without complexity. One screen. Two paths. Under 5 seconds to get started.

### 6.2 First Launch Flow

```
+----------------------------------------------+
|  Welcome to Terminal Buddy                    |
|                                               |
|  How do you want to interact?                 |
|                                               |
|  ( ) Voice-first (recommended for             |
|      accessibility)                           |
|  ( ) Keyboard-first                           |
|  ( ) Hybrid                                   |
|                                               |
|  Choose your reading comfort:                 |
|                                               |
|  ( ) OpenDyslexic (extra readable)            |
|  ( ) Atkinson Hyperlegible (balanced)         |
|  ( ) Lexend (modern accessible)               |
|  ( ) System default                           |
|                                               |
|  Text-to-Speech voice:                        |
|                                               |
|  ( ) Built-in (free, local)                   |
|  ( ) ElevenLabs (bring your API key)          |
|  ( ) Quen (bring your API key)                |
|  ( ) None                                     |
|                                               |
|  [ Use Recommended Setup ]  [ Customize -> ]  |
|                                               |
+----------------------------------------------+
```

### 6.3 Key Design Decisions

- **"Use Recommended Setup"** - one click, sensible defaults, done. In the journal in under 5 seconds.
- **"Customize"** - for users who want to fine-tune. Same choices, more granularity. Links to Creator Corner for deep customization.
- **All choices changeable later** - settings are config values in buddy.toml. No data migration. Memory stays intact regardless of UI changes.
- **MCP makes this possible** - the brain (daemon) doesn't care about the skin (UI). Swap everything; history stays intact.

---

## 7. Creator Corner - The Customization Engine

### 7.1 What's Customizable

| Category | What You Can Change | How It's Exposed |
|----------|-------------------|-----------------|
| **Visual** | Font family, size, line height, letter spacing | Slider controls + live preview |
| **Color** | Theme palette (background, text, accent, status colors) | Color picker + WCAG AAA contrast checker |
| **Layout** | Panel positions, terminal split ratios, component visibility | Drag-and-drop layout builder |
| **Interaction** | Voice-first vs keyboard-first, push-to-talk key, confirmation flow | Toggle switches + keybinding editor |
| **Voice** | TTS provider (built-in, ElevenLabs, Quen), speed, pitch, language | Dropdown + audio preview |
| **Behavior** | Auto-titling, explanation detail level, focus mode triggers | Simple toggles with plain-English descriptions |
| **Components** | Add/remove journal widgets (timeline, system health, cleanup) | Component browser |
| **Workflow** | Custom command macros, approval presets, session auto-tagging rules | Visual rule builder (if-this-then-that style) |

**Accessibility safeguard:** Every customization has a "Reset to Accessible Default" button.

### 7.2 Template System: Create, Save, Share

**Step 1: Create** - Visual editor with live preview in Creator Corner. Choose a starting point:

- "Dyslexia-friendly default" (recommended)
- "Power user compact"
- "Blank canvas"

Adjust with sliders/toggles. See live preview update instantly. "Test with Sample Data" button to see it with real commands.

**Step 2: Save as Template**

```json
{
  "name": "Dyslexia Focus - Dark",
  "description": "High contrast, OpenDyslexic, voice-first, minimal visual noise",
  "version": "1.0",
  "author": "dylaroo",
  "appearance": {
    "theme": "dyslexia-dark",
    "font_family": "OpenDyslexic",
    "font_size": 18,
    "line_height": 1.8,
    "letter_spacing": "0.05em"
  },
  "interaction": {
    "default_input": "voice",
    "push_to_talk": "RightCtrl",
    "confirm_before_run": true
  },
  "components": {
    "enabled": ["timeline", "command_card", "explain_button"],
    "disabled": ["system_dashboard", "cleanup_suggestions"]
  },
  "voice": {
    "tts_provider": "elevenlabs",
    "voice_id": "default",
    "speed": 1.0
  }
}
```

**Step 3: Share (Optional)**

- **Local only** - template stays on your machine
- **Community share** - upload to Terminal Buddy Template Hub (opt-in)
- **Direct share** - export as `.buddy-template` file to send to a friend

**Step 4: Discover & Install**

```
+----------------------------------------------+
|  Community Templates                          |
|  ---                                          |
|  [search] Search templates...                 |
|                                               |
|  [filter] Accessibility-focused               |
|  [filter] Power user                          |
|  [filter] Minimal                             |
|  [filter] Colorful                            |
|                                               |
|  +- "Dyslexia Focus - Dark" ---------------+ |
|  | by dylaroo - 4.9 stars (128 installs)    | |
|  | High contrast, voice-first, OpenDyslexic | |
|  | [Preview] [Install]                      | |
|  +------------------------------------------+ |
|                                               |
|  +- "Power Dev - Compact" -----------------+ |
|  | by alex_codes - 4.7 stars (89 installs)  | |
|  | Dense info, keyboard shortcuts, system   | |
|  | dashboard always visible                 | |
|  | [Preview] [Install]                      | |
|  +------------------------------------------+ |
+----------------------------------------------+
```

### 7.3 Creator Corner UX Principles

Creator Corner must **reduce cognitive load**, not add to it. This benefits all users — not just those with specific accessibility needs.

1. **Progressive disclosure** - show only the most important options first. "Advanced" toggles reveal deeper controls.
2. **Visual preview** - every change shows a live preview pane. No guesswork.
3. **Plain language** - "Make text easier to read" not "Adjust letter-spacing CSS property."
4. **One-click reset** - "Undo this change" and "Reset to accessible default" always visible.
5. **Voice-guided creation** - "Hey Buddy, help me make a template" starts a conversational setup wizard.

### 7.4 Template Example Flow

```
1. Open Creator Corner -> "Design a UI Skin"
2. Choose starting point:
   - "Dyslexia-friendly default" (recommended)
   - "Power user compact"
   - "Blank canvas"
3. Adjust with sliders/toggles:
   - Font: [OpenDyslexic]  Size: [18 ---*--- 24]
   - Contrast: [High ---*--- Low] (WCAG AAA indicator)
   - Spacing: [Extra room ---*--- Compact]
4. Live preview updates instantly
5. Click "Save as Template" -> name it, add description
6. Optional: "Share with community" checkbox
7. Done! Template appears in your library
```

---

## 8. Session Classification System

### 8.1 Auto-Titling

When a session closes (or at configurable intervals):

**Heuristic approach (free, instant):**

- Working directory + most-modified file paths = project name
- Most distinctive command or error pattern = session summary
- Example: 80% of commands in `terminal-buddy/buddy-daemon/` -> "Terminal Buddy Daemon - [action summary]"

**LLM-assisted approach (richer, optional):**

- Pass command summary to configured LLM on session close
- Returns natural-language title: "Debugging PTY capture timeout on macOS"

### 8.2 Auto-Grouping into Topics

Topics are **tags, not folders.** A session can belong to multiple topics.

1. Extract project directory from session's working paths
2. Fuzzy-match against existing topic names
3. Create new topic if no match above threshold
4. User can always rename, re-tag, merge, or split topics

### 8.3 Data Model

```sql
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    started_at INTEGER NOT NULL,
    ended_at INTEGER,
    auto_title TEXT,
    user_title TEXT,           -- user override, takes precedence
    working_directory TEXT,
    command_count INTEGER DEFAULT 0
);

CREATE TABLE topics (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE TABLE session_topics (
    session_id TEXT REFERENCES sessions(id),
    topic_id TEXT REFERENCES topics(id),
    PRIMARY KEY (session_id, topic_id)
);

CREATE TABLE notes (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES sessions(id),
    command_id TEXT,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL
);
```

Titles are metadata. Topics are tags. Flat and queryable.

---

## 9. Technical Architecture

### 9.1 System Overview

```
+---------------------------------------------+
|  TERMINAL BUDDY (Product)                    |
|                                              |
|  +---------------------------------------+   |
|  | BUDDY DAEMON (Rust, MCP)              |   |
|  | - Memvid storage (.mv2 + SQLite)      |   |  <-- The "brain"
|  | - Correlation engine (3-stream)        |   |  Stable API contract
|  | - System monitor                      |   |  Open-core candidate
|  | - Session classifier                  |   |
|  +------------------+--------------------+   |
|                     | MCP (stdio)             |
|                     v                         |
|  +---------------------------------------+   |
|  | UI LAYER (Pluggable)                  |   |
|  | - Default: Tauri v2 + React           |   |  <-- The "skin"
|  | - Journal/Notebook primary view       |   |  Creator Corner
|  | - Accessibility-first defaults        |   |  Template system
|  | - Onboarding wizard                   |   |
|  | - Creator Corner                      |   |
|  +---------------------------------------+   |
+---------------------------------------------+
```

### 9.2 MCP API (v1.0 - FROZEN)

| Tool | Status | Description |
|------|--------|-------------|
| `buddy_history` | Working | Query command history with filters |
| `buddy_sessions` | Working | List and search sessions |
| `buddy_system_health` | Working | CPU, RAM, disk, process info |
| `buddy_cleanup_scan` | Working | Find cleanup opportunities |
| `buddy_run` | Working | Execute command with PTY capture |
| `buddy_ask` | Stub | Natural language to command translation |
| `buddy_explain` | Stub | Plain-language command explanation |

### 9.3 MCP API (v1.1 - Planned)

| Tool | Description |
|------|-------------|
| `buddy_session_classify` | Trigger auto-title and topic assignment |
| `buddy_topics` | List, create, rename, merge topics |
| `buddy_add_note` | Add user note to session or command |
| `buddy_search_semantic` | Semantic search across all sessions |
| `buddy_get_teachable_moment` | Full correlated explanation for a command |

### 9.4 Key Architecture Decisions

1. **Tauri v2** over Electron
2. **xterm.js** for terminal rendering in Tauri webview — no forking, no embedding native terminal libraries
3. **React + TypeScript** for UI
4. **Radix UI** for keyboard nav / focus management
5. **UI is dumb** - renderer only. State lives in daemon, flows through MCP
6. **Config schema from day one** - JSON Schema for all settings, used for validation, UI generation, and template compatibility
7. **CSS variables for all theming** - 50+ custom properties for full visual control
8. **Component registry** - each UI element registers itself, Creator Corner enables/disables/reorders

### 9.5 Creator Corner Technical Implementation

**Config Schema (source of truth):**

```typescript
export const BuddyConfigSchema = {
  appearance: { /* font, size, spacing, colors */ },
  interaction: { /* input mode, hotkeys, confirmations */ },
  components: { /* enabled/disabled widgets */ },
  voice: { /* tts provider, speed, pitch */ },
  sessions: { /* auto-title, grouping, notes behavior */ },
};
```

**CSS Variable Theme System:**

```css
:root {
  --tb-bg-primary: #0a0a0a;
  --tb-text-primary: #f0f0f0;
  --tb-font-family: 'OpenDyslexic', monospace;
  --tb-line-height: 1.8;
  --tb-letter-spacing: 0.05em;
  /* ... 50+ variables */
}
```

**Template Storage:**

- Local: `~/.terminal-buddy/templates/`
- Community hub: static JSON index + CDN (no backend, no accounts)
- Direct share: export as `.buddy-template` file

---

## 10. Accessibility (First-Class, Not Bolted On)

### 10.1 Default Configuration

```toml
[appearance]
theme = "dyslexia-dark"
font_family = "Atkinson Hyperlegible"
font_size = 18
line_height = 1.8
letter_spacing = 0.05em
background = "#0F172A"                   # Dark OLED, WCAG AAA

[interaction]
default_input = "hybrid"
push_to_talk = "RightCtrl"
confirm_before_run = true
visual_command_cards = true

[feedback]
text_to_speech = true
tts_provider = "local"                   # or "elevenlabs", "quen"
error_icons = true                       # colorblind-safe
focus_mode = true                        # dim background during explanations

[sessions]
auto_title = true
title_method = "heuristic"               # or "llm"
auto_group_topics = true
prompt_for_notes = "on_close"
```

### 10.2 Design Principles

- **Dyslexia-friendly by default** - accessible fonts, generous spacing, high contrast
- **Voice is a peer to keyboard** - always available, always primary
- **Command cards over raw text** - structured cards reduce cognitive load
- **Focus mode** - dim terminal during explanations
- **Colorblind-safe** - icons alongside colors for all status
- **Keyboard navigable** - full Radix UI focus management
- **prefers-reduced-motion** - respected globally

### 10.3 Marketing Angle

**"Designed for focus"** - not "designed for disability." Resonates with:

- Neurodivergent developers (dyslexia, ADHD)
- Senior engineers drowning in context switching
- Students learning CLI for the first time
- Anyone who wants a terminal that respects their attention

**Core accessibility features are never gated behind a paywall.**

---

## 11. Monetization

### 11.1 Principles

- Never gate core accessibility features
- Monetize enhancement, not inclusion
- Local-first = low infrastructure costs
- BYOK for cloud AI/TTS = zero API cost to us

### 11.2 Revenue Model

| Model | How It Works |
|-------|-------------|
| **Open Core** | Daemon + basic UI open source; premium features paid |
| **Theme Store** | Curated themes, voice packs, workflow templates |
| **Enterprise License** | SSO, audit logs, centralized config, Memvid sync |
| **Sponsorware** | Early access for GitHub sponsors |
| **Creator Revenue Share** | Optional: template creators earn when others install their templates |

### 11.3 Tiers

| Feature | Free | Pro ($8/mo) | Enterprise ($20/seat/mo) |
|---------|------|-------------|--------------------------|
| Journal with timeline/topics | Yes | Yes | Yes |
| Explain button (heuristic) | Yes | Yes | Yes |
| Accessibility defaults | Yes | Yes | Yes |
| Voice input (local whisper) | Yes | Yes | Yes |
| Creator Corner (local) | Yes | Yes | Yes |
| Semantic search | Basic | Advanced | Advanced |
| LLM-powered auto-titles | - | Yes | Yes |
| LLM-powered explanations | - | Yes | Yes |
| Custom themes | - | Yes | Yes |
| Premium TTS voices | - | Yes | Yes |
| Community template hub | - | Yes | Yes |
| Cloud template sync | - | Yes | Yes |
| SSO / SAML | - | - | Yes |
| Audit logs | - | - | Yes |
| Centralized admin config | - | - | Yes |
| Team Memvid sync | - | - | Yes |

---

## 12. Multi-Surface Distribution: MCP App + Memvid Canvas

### 12.1 Three UI Surfaces, One Brain

The daemon doesn't care which surface is talking to it. MCP is the universal protocol. Terminal Buddy ships on three surfaces:

```
                    BUDDY DAEMON (Rust, MCP)
                           |
              +------------+------------+
              |            |            |
              v            v            v
        TAURI APP     MCP APP      VS CODE
        (standalone)  (iframe)     EXTENSION
        Full product  Embedded in  Embedded in
        Journal +     Claude       editor
        Creator       Desktop,     sidebar
        Corner +      Cursor,
        Terminal       any host
```

| Surface | Technology | Use Case | Scope |
|---------|-----------|----------|-------|
| **Standalone App** | Tauri v2 + React | The full product. Journal, Creator Corner, terminal pane. | Phase B (primary) |
| **MCP App (iframe)** | HTML/JS served by daemon via `registerAppResource` | Embedded inside Claude Desktop or Cursor. Journal + search. No terminal pane needed (host has one). | Phase C |
| **VS Code Extension** | Webview panel | Sidebar journal inside the editor. Same React components. | Future |

### 12.2 MCP App as Distribution Channel

Every Claude Desktop and Cursor user can get Terminal Buddy's journal **inside their existing tool** with zero install. The daemon already runs as an MCP server - it just needs to serve its UI as an iframe resource.

**What the MCP App surface provides:**

- Journal view (timeline + topics + search)
- Session history browsing
- Explain button on any past command
- User notes
- System health dashboard

**What it does NOT provide** (standalone app only):

- Embedded terminal pane
- Creator Corner / template editor
- Full onboarding wizard
- Voice input (requires native audio access)

The MCP App is the **discovery funnel.** Users try the journal inside Claude Desktop, love it, upgrade to standalone for the full experience.

### 12.3 Memvid Canvas Integration

The `@memvid/canvas-react` SDK provides drop-in React components for search, chat, and dashboard interfaces powered by `.mv2` memory files. Terminal Buddy uses Memvid Canvas as the **visual engine** for:

| Canvas Component | Terminal Buddy Usage |
|-----------------|---------------------|
| **Semantic Search** | Powers journal search - "that build error from last week" |
| **RAG Chat** | Powers the Explain button - chat with history using correlated data |
| **Timeline Dashboard** | Powers visual timeline scrubber - replay sessions, see state changes |
| **Memory Statistics** | Powers system health view - storage, session counts, topic distribution |

**Integration approach:**

```tsx
import { SearchPanel } from '@memvid/canvas-react/components';

<SearchPanel
  apiBasePath="/api/canvas"
  memoryPath="~/.terminal-buddy/history.mv2"
  renderResult={(result) => <CommandCard command={result} />}
/>
```

The same Canvas components work in all three surfaces (Tauri, MCP App iframe, VS Code webview) because they're standard React.

### 12.4 Why This Matters

- **Same React components** in all three surfaces. Build once, ship everywhere.
- **MCP App = zero-friction discovery.** Try before you install.
- **Memvid Canvas = visual differentiator.** Semantic search + timeline scrubbing nobody else offers.
- **Community templates work everywhere.** A template from Creator Corner renders correctly in the MCP App iframe too.

---

## 13. Competitive Moat

Three things individually hard to copy, nearly impossible together:

1. **Correlated memory** - Memvid + filesystem watching + semantic search. Data flywheel: longer usage = more value = higher switching cost.
2. **Accessibility-first defaults** - competitors bolt it on later. We start there. Uncontested space.
3. **Local-first architecture** - privacy as feature, not limitation.

**Plus the new fourth moat:**

1. **Template ecosystem** - Creator Corner + community templates = network effects. Every template shared is marketing. Every template installed is retention.

### Competitive Landscape

| Product | What It Does | What It Lacks |
|---------|-------------|---------------|
| iTerm / WezTerm / Alacritty | Display text fast | No memory, no explanation, no accessibility |
| Warp | AI-powered terminal | Cloud-dependent, no correlated data |
| Fig (AWS) | Terminal autocomplete | No journal, no session memory |
| GitHub Copilot CLI | AI suggestions | No history, no explanation, no standalone |

---

## 14. Revised Phase B Build Plan

| Task | Name | Description |
|------|------|-------------|
| 1 | **Scaffold Tauri v2 App** | React + TypeScript. Project in `terminal-buddy/buddy-app/`. Install Radix UI, Tailwind, Lucide icons. **Build config schema with JSON Schema validation from day one.** |
| 2 | **Connect to buddy-daemon via MCP** | Tauri backend spawns daemon. Wire MCP stdio. Test with `buddy_system_health` and `buddy_sessions`. |
| 3 | **Design System Implementation** | Fonts (Atkinson Hyperlegible, JetBrains Mono, OpenDyslexic). Tailwind config. **CSS variable theme system (50+ properties).** Radix UI. Every component accepts theme props. |
| 4 | **Journal View - Timeline** | Primary view: sessions by date. Command cards with Explain / Re-run / Add Note. |
| 5 | **Journal View - Topics** | Sessions grouped by subject. Collapsible folders. Rename/re-tag. |
| 6 | **Journal View - Search** | Semantic search bar. Results as command cards. Date and topic filters. |
| 7 | **Onboarding Wizard** | First-run: interaction mode, font, TTS. "Use Recommended Setup" one-click path. Saves to buddy.toml. |
| 8 | **Terminal Pane (MVP)** | Collapsible terminal at bottom. xterm.js in Tauri. Connect to shell. Pipe to daemon. |
| 9 | **Voice Input (whisper-rs)** | Push-to-talk (RightCtrl). Local processing only. |
| 10 | **Creator Corner MVP** | Visual editor for fonts/colors/layout. Live preview. Local template save/load/export. |
| 11 | **Polish & Package** | Code signing, auto-updater, icon, Linux/macOS/Windows builds. |

### What Changed from Original Phase B

- **Tasks 4-6** - journal/notebook paradigm replaces old session history
- **Task 7 (Onboarding)** - elevated to own task with one-click path
- **Task 10 (Creator Corner)** - new task for visual customization editor
- **Plugin API removed** - deferred until after alpha
- **Config schema in Task 1** - foundational, not bolted on
- **CSS variables in Task 3** - theme system built early, Creator Corner leverages it

### What Did NOT Change

- Daemon is done. Don't modify unless something breaks.
- UI never talks to SQLite directly - always through MCP tools
- Tauri v2, React, Radix UI, Tailwind decisions locked
- Accessibility tested at every step

---

## 15. The Manifesto

Terminals should remember. Commands should be explainable. Accessibility isn't optional.

Terminal Buddy is the terminal you needed when you started - and the one thousands of neurodivergent developers, students, and career-changers would pay for.

It's not about replacing the terminal. It's about making it actually work for humans.

**Personalization without complexity.** The terminal adapts to you.

---

## 16. Reference Documents

| Document | Location | Status |
|----------|----------|--------|
| This spec | `docs/2026-02-22-PRODUCT_SPEC_V2.md` | ACTIVE - primary product reference |
| Master Spec v1 | `2026-01_TERMINAL_BUDDY_MASTER_SPEC.md` | Reference for Correlation Engine, Memvid, Security, HAL |
| Phase B Handoff | `docs/plans/2026-02-22-phase-b-handoff.md` | Task plan reference |
| Architecture Design | `docs/plans/2026-02-22-terminal-buddy-architecture-design.md` | Architecture diagrams |
| Design System | `docs/DESIGN_SYSTEM.md` | Colors, fonts, layout, components |
| Technical Reference | `docs/TECHNICAL_REFERENCE.md` | Tech stack, dependencies, data types |
| Product Overview | `docs/TERMINAL_BUDDY_OVERVIEW.md` | Non-technical shareable overview |
| Memvid Canvas SDK | `REF_MEMVID_CANVAS_SDK.md` | Third-party SDK for search, chat, dashboard components |

---

*Specification authored by BMAD Party Mode session (Feb 22, 2026) with contributions from: Victor (Innovation Strategy), Winston (Architecture), Sally (UX Design), John (Product Management), and BMad Master (Orchestration). Captured for Dylaroo.*

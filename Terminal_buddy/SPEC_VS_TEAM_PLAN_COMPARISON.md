# Terminal Buddy — Master Spec vs Team Plan: Full Comparison

> **Purpose:** Side-by-side analysis of the two foundational documents to produce one unified, cutting-edge, maximally customizable design.
> **Author:** Roo (Claude Opus 4.6) — Co-builder review
> **Date:** 2026-02-22
> **Inputs:** `TERMINAL_BUDDY_MASTER_SPEC.md` (Fred/dylaroo) + `TERMINAL_BUDDY_BMAD_TEAM_PLAN.md` (dylaroo + Antigravity/Gemini)

---

## The One Non-Negotiable: The Philosophy of Choice

> **This is the only locked-in principle. Everything else in this document is a recommendation, not a mandate.**

Terminal Buddy will **never force the user into a specific workflow or hardware trap**. While the core mainframe structure provides a robust foundation, everything else is entirely up to the user. Nothing is "stuck."

- **Hardware & API Agnostic:** No GPU? No problem. Weak CPU? Use a cloud API. The architecture is open to any external API or subscription service the user chooses. Local-first is the *default*, not the *requirement*.
- **Radically Customizable:** Every component is designed to be modular, updateable, cutting-edge, and completely customizable. If a user wants to swap the renderer, the AI backend, the UI skin, the voice engine, or the plugin system — the architecture permits it.
- **Universal Design:** Built from the ground up to adapt to different types of workers, designers, learners, and educators. Not one persona — all of them.

**What this means for every decision in this document:** When the comparison says "RECOMMENDATION," it means *default choice*. The user can always change it. When we say "use xterm.js" — that's the default skin. Someone else can build a GPUI skin, a Sixel skin, or a pure-text skin. When we say "use Claude API" — that's the default AI backend. The user can switch to Ollama, GPT, Gemini, or pure local inference. **Nothing is locked in except the ability to change everything.**

---

## Executive Summary

The **Master Spec** is the original technical bible — 774 lines, 14 sections, deeply detailed Rust architecture with GPUI rendering, Bincode IPC, and a custom two-process Sidecar pattern. It was written before MCP Apps existed as a viable UI layer.

The **Team Plan** is a strategic evolution — it accepts the Master Spec's core vision but makes one game-changing architectural pivot: **the UI becomes an MCP App iframe**, eliminating the need for a custom GPU renderer and making the entire UI layer swappable, skinnable, and embeddable in any MCP host.

**Both documents agree** on the core identity: a terminal that understands what happened, explains it in plain language, remembers everything, and puts accessibility first. The disagreements are all about *how* to deliver that vision — and under the Philosophy of Choice, multiple approaches can coexist as user-selectable options rather than forced decisions.

---

## 1. Architecture: The Big Divergence

### Master Spec: Two-Process Sidecar (GPUI + Daemon)

```
Process A: buddy-gui (Rust + GPUI)     Process B: buddy-daemon (Rust + Tokio)
├── 120 FPS terminal grid rendering     ├── PTY Manager
├── Multi-window layout                 ├── OS Sensors / Kernel Logs
├── Keyboard/mouse/voice capture        ├── Memvid Writer
└── GOLDEN RULE: NEVER BLOCKS           ├── AI Engine (Whisper + LLM)
         │                              └── JSON-RPC for Canvas Dashboard
         └── Bincode over Unix Socket ──┘
```

- Two Rust binaries communicating via zero-copy Bincode IPC
- GPUI (Zed's GPU framework) renders terminal grid at 120 FPS
- Canvas Dashboard is a *separate* React/Next.js app on localhost:3000
- All rendering is native GPU — no web technologies in the hot path

### Team Plan: MCP App Architecture (Daemon + iframe UI)

```
Rust Daemon (always running)            MCP App UI (iframe — swappable skins)
├── PTY Manager                         ├── Canvas Dashboard
├── Correlation Engine                  ├── Session History Browser
├── Memvid Writer                       ├── Teachable Moment Panel
├── Voice Engine                        └── Terminal Grid
└── MCP Server (tools + resources)
         │
         └── MCP Protocol (stdio/HTTP) ──┘
```

- One Rust daemon + web-based UI served as MCP App resource
- UI runs inside Claude Desktop, Cursor, or standalone Tauri wrapper
- Skins are swappable iframes — dyslexia mode vs power user mode
- Uses `@modelcontextprotocol/ext-apps` SDK patterns

### Comparison

| Dimension | Master Spec | Team Plan | Winner for Customizability |
|-----------|-------------|-----------|---------------------------|
| **Rendering** | GPUI (native GPU, 120 FPS guaranteed) | Web-based (xterm.js or WebGL in iframe) | **Team Plan** — skins are HTML/CSS, anyone can make one |
| **Performance ceiling** | Higher (native GPU, zero-copy IPC) | Lower (iframe overhead, WebView limits) | **Master Spec** — raw performance |
| **UI swappability** | None — one /monolithic GUI binary | Full — any HTML can be a skin | **Team Plan** — this is the killer feature |
| **Host embedding** | Standalone only | Claude Desktop, Cursor, Tauri, Electron, any MCP host | **Team Plan** — runs everywhere |
| **IPC protocol** | Bincode (binary, fast, internal) | MCP Protocol (JSON-RPC, standard, interoperable) | **Team Plan** — industry standard |
| **Build complexity** | Very high (GPUI is underdocumented, Zed-coupled) | Moderate (MCP SDK is documented, has examples) | **Team Plan** — lower risk |
| **Plugin architecture** | JSON-RPC plugin API + MCP (Section 13-14) | Everything is MCP — plugins = MCP servers | **Team Plan** — unified model |

### RECOMMENDATION: Team Plan Architecture

The MCP App approach is strictly better for customizability. The Master Spec's GPUI approach optimizes for raw performance at the cost of lock-in to a single rendering framework that's underdocumented and tightly coupled to Zed.

**However:** The 120 FPS guarantee matters for TUI apps (htop, vim, tmux). The Team Plan needs to address this — see Section 8 (Proposed Synthesis).

---

## 2. Feature-by-Feature Comparison

### 2.1 Core Terminal

| Feature | Master Spec | Team Plan | Gap? |
|---------|-------------|-----------|------|
| 120 FPS rendering | Explicit requirement, GPUI guarantees it | Claims "120 FPS GPU-rendered" in iframe but no technical path | **GAP** — Team Plan doesn't explain how iframe hits 120 FPS |
| Full VTE compatibility | alacritty_terminal v0.22 | Not mentioned explicitly | **GAP** — Team Plan assumes VTE works but doesn't specify the crate |
| Multi-window layout | Explicit, freely tiled | Not mentioned | **GAP** — MCP App iframes don't natively support multi-pane tiling |
| PTY management | portable-pty v0.8, detailed | portable-pty, mentioned | Aligned |
| Cross-platform | Linux, macOS, Windows from day 1 | Implied via MCP hosts + Tauri | Aligned |

### 2.2 Correlation Engine

| Feature | Master Spec | Team Plan | Gap? |
|---------|-------------|-----------|------|
| Three-stream correlation | Detailed (Terminal + Filesystem + Kernel Logs) | Mentioned as "kernel + fs + logs" | Aligned — Master Spec has more detail |
| EventCorrelator struct | Full Rust code provided | Referenced but not detailed | Aligned — use Master Spec's code |
| Teachable Moment API | Full JSON response format defined | Listed as MCP tool | Aligned |
| PID-to-timestamp matching | Specified at microsecond precision | Listed in custom skills | Aligned |

### 2.3 Memory Engine (Memvid)

| Feature | Master Spec | Team Plan | Gap? |
|---------|-------------|-----------|------|
| .mv2 frame format | Full Rust struct (frame_type, timestamp, data, embedding) | Referenced as ".mv2 session history" | Aligned — Master Spec has the detail |
| Append time target | < 5ms | Not specified | **GAP** — Team Plan should inherit this |
| Capture interval | Every 100ms or on command completion | Not specified | **GAP** |
| Vector embeddings | 1536-dim, generated locally | Not mentioned | **GAP** — critical for semantic search |
| State-diffing engine | Introspector struct with diff() method | Not detailed | **GAP** |
| Session History storage | .mv2 only | Open Question: SQLite + .mv2? | **CONFLICT** — needs resolution |

### 2.4 Voice & Control Plane

| Feature | Master Spec | Team Plan | Gap? |
|---------|-------------|-----------|------|
| Voice as primary input | Yes — peer to keyboard, not addon | Yes — "voice-first accessibility" | Aligned |
| Whisper.cpp local STT | whisper-rs Rust bindings, cpal for audio | whisper.cpp, listed as custom skill | Aligned |
| Push-to-talk | Right Ctrl default, remappable via buddy.toml | Not detailed | **GAP** |
| Command Mode | Hold hotkey → natural language → shell command | "Voice Copilot (plain-language command translation)" | Aligned |
| Fix Mode | "Why did that build fail?" → AI explains | Implied by Teachable Moments | Aligned |
| Pair Programming Mode | "Watch this and tell me when memory exceeds 2GB" | Not mentioned | **GAP** — cutting-edge feature, keep it |
| Neovim embedding | Phase 2, full nvim --embed RPC | Phase 4 (optional), Open Question | **CONFLICT** — priority differs |
| AI backend | "100% local, no cloud" (strict) | Open Question: local vs API | **CONFLICT** — needs resolution |

### 2.5 Canvas Dashboard

| Feature | Master Spec | Team Plan | Gap? |
|---------|-------------|-----------|------|
| Technology | Separate React/Next.js app on localhost:3000 | MCP App iframe, part of unified UI | **CONFLICT** — Team Plan is better |
| Timeline scrubbing | Explicit | Mentioned as "system state, timeline" | Aligned |
| RAG Chat | Explicit | Not mentioned in Team Plan | **GAP** |
| System Impact Visualization | Explicit | Implied | Aligned |
| Teachable Moment Review | Explicit | Explicit (own panel) | Aligned |

### 2.6 Security

| Feature | Master Spec | Team Plan | Gap? |
|---------|-------------|-----------|------|
| Sudo Handshake | One-time elevation for Observation Mode | Not mentioned | **GAP** |
| Linux Capabilities | CAP_DAC_READ_SEARCH, CAP_SYS_PTRACE | Not mentioned | **GAP** |
| Graceful Degradation | "Basic Emulator Mode" if sudo denied | Not mentioned | **GAP** |
| MCP tool guarding | terminal.run_command needs user confirmation | Explicit, non-negotiable | Aligned |
| STRIDE analysis | Not mentioned | Explicit (sentinel agent skill) | Team Plan adds value |

### 2.7 Customization & Plugins

| Feature | Master Spec | Team Plan | Gap? |
|---------|-------------|-----------|------|
| buddy.toml | Detailed: themes, fonts, opacity, blur, hotkeys, layouts, Copilot personality, session behavior | Phase 4 task: "Customization system (buddy.toml)" | **GAP** — Master Spec has the detail |
| Color schemes | Curated defaults (dark, high-contrast, dyslexia-friendly) | "Dyslexia mode = one skin" | Team Plan is more powerful (swappable skins > config file themes) |
| Font customization | OpenDyslexic, configurable face/size/spacing | "dyslexia font inheritance" via host context | Aligned differently — Team Plan inherits from host |
| Layout presets | Named layout arrangements | Not mentioned | **GAP** — important for customization |
| Plugin API | JSON-RPC over local socket | Everything is MCP servers | **CONFLICT** — Team Plan is better (unified) |
| Plugin hot-reload | Explicit | Phase 4 task | Aligned |
| Plugin capabilities | Explanation modes, sensors, analyzers, dashboard panels, AI providers | Implied by MCP server model | Master Spec has richer plugin examples |
| Copilot personality level | Silent → Active co-pilot, configurable | Not mentioned | **GAP** — cutting-edge customization |
| Educational notes behavior | Configurable: prompt after session, on demand, or off | Not mentioned | **GAP** |

### 2.8 MCP Integration

| Feature | Master Spec | Team Plan | Gap? |
|---------|-------------|-----------|------|
| TB as MCP Server | 6 tools defined | 7 tools defined (adds search_history) | Team Plan adds value |
| TB as MCP Client | Explicit — consume external MCP servers | Not mentioned | **GAP** |
| Plugins = MCP servers | Section 14.3 — explicit | Core architectural decision | Aligned |
| MCP App UI | Mentioned as future possibility (Section 14.4 note) | Core architectural decision | Team Plan executes what Master Spec hinted at |

---

## 3. Phased Roadmap Comparison

### Master Spec Phases (Original)

| Phase | Focus | Key Deliverable |
|-------|-------|----------------|
| **1: Iron Skeleton** | GPUI + VTE + PTY + 120 FPS | Terminal that renders htop correctly |
| **2: Control Plane** | Neovim embedding + voice input | Voice command in < 500ms |
| **3: System Connection** | Correlation Engine + Memvid | .mv2 logs without GUI stutter |
| **4: Visual Brain** | Canvas Dashboard (React/Next.js) | RAG chat on localhost:3000 |

### Team Plan Phases (Evolved)

| Phase | Focus | Key Deliverable |
|-------|-------|----------------|
| **1: Foundation** | PTY + GPU renderer + IPC + basic Memvid + CI | Working terminal with CI |
| **2: Intelligence** | Correlation Engine + Teachable Moments + Session History UI + MCP Server | Intelligence layer + first MCP tools |
| **3: Voice & MCP App** | Whisper + Canvas Dashboard as MCP App + Plugin system | Voice + full MCP App UI |
| **4: Polish & Ship** | Security + cross-platform + Neovim (optional) + buddy.toml + release | Production-ready |

### Key Differences

| Aspect | Master Spec | Team Plan |
|--------|-------------|-----------|
| Phase 1 scope | Narrower (just rendering) | Broader (adds Memvid, sensors, CI) |
| Neovim timing | Phase 2 (early) | Phase 4 (optional, late) |
| Voice timing | Phase 2 (early) | Phase 3 (later) |
| Correlation Engine | Phase 3 (late) | Phase 2 (earlier) |
| Canvas Dashboard | Phase 4 (separate app) | Phase 3 (integrated MCP App) |
| MCP Server | Not phased | Phase 2-3 (progressive rollout) |
| Customization (buddy.toml) | Not phased | Phase 4 |

### RECOMMENDATION

The Team Plan's phasing is better because:
- Correlation Engine in Phase 2 means the "killer feature" ships sooner
- MCP Server tools in Phase 2-3 means external AI integration is early
- Neovim in Phase 4 (optional) avoids premature complexity
- But: **buddy.toml should be Phase 2, not Phase 4** — customization is core to the vision

---

## 4. Team Structure Comparison

### Master Spec: No Team Defined
The Master Spec is a pure technical document — no agent team structure.

### Team Plan: 5 Agents

| Agent | Role | Based On |
|-------|------|----------|
| tb-architect | System design, IPC, MCP tool surface | architect.md |
| tb-rust-dev | Core Rust implementation | dev.ide.md |
| tb-ui-dev | MCP App UI, Canvas Dashboard | design-architect.md |
| tb-sentinel | Security, privilege controls | sentinel.md |
| tb-devops | CI/CD, testing, release | devops-pe.ide.md |

### My Earlier Proposal: 6 Core + Squads (15+ agents)
Overengineered. The Team Plan's 5-agent structure is the right size.

### RECOMMENDATION: Team Plan's 5 + 2 On-Call

Add two on-call agents from the consolidated Genesis Forge:
- **docqa** — Documentation quality across the growing spec/plan/architecture docs
- **chunky** — Task decomposition when any Phase task is too large for a single sprint

---

## 5. Conflicts Requiring Resolution

> **Guiding Principle:** Per Section 1.2 of the Master Spec, nothing is locked in. Every "resolution" below is a **recommended default** — the architecture must permit the user to swap to the alternative at any time.

### CONFLICT 1: GUI Rendering — Native GPU vs Web iframe

| | Master Spec | Team Plan |
|---|-------------|-----------|
| **Approach** | GPUI native GPU | MCP App iframe |
| **120 FPS** | Guaranteed by GPU pipeline | Unproven in iframe |
| **Customizability** | Low (single binary) | Maximum (swappable skins) |
| **Risk** | GPUI is underdocumented, Zed-coupled | xterm.js may not hit 120 FPS for complex TUIs |

**RESOLUTION — No conflict under Philosophy of Choice.** Both are valid rendering backends. The architecture supports swappable renderers:

- **Default skin:** MCP App iframe with xterm.js (WebGL mode) — maximum customizability, runs in any MCP host
- **Alternative skin:** Native GPUI or alacritty_terminal via Tauri — maximum performance for power users
- **User switches via:** `buddy.toml` renderer setting or skin selection at runtime

The daemon doesn't care what renders the output. It exposes MCP tools and resources. Any frontend that speaks MCP can be the UI. **Neither approach is rejected — both ship as options.**

### CONFLICT 2: AI Backend — Local Only vs Hybrid

| | Master Spec | Team Plan |
|---|-------------|-----------|
| **Position** | "100% local. No data leaves the machine." | Open Question: local vs API |

**RESOLUTION — No conflict under Philosophy of Choice.** The user decides:

```toml
[ai]
transcription = "local"           # Default: local Whisper (user can change to cloud STT)
explanation_backend = "claude"    # "local" | "claude" | "openai" | "gemini" | "ollama" | "custom"
privacy_mode = false              # true = force all-local, no exceptions
```

- **Default:** Local Whisper for transcription, Claude API for explanations (quality matters for accessibility)
- **Privacy mode:** One toggle forces everything local — respects the Master Spec's original vision
- **No GPU?** Use a cloud API. **Want total privacy?** Go full local. **Want the best quality?** Mix and match.
- **Even transcription is swappable** — if a user prefers a cloud STT service, that's their choice

### CONFLICT 3: Neovim Embedding — Phase 2 vs Phase 4 (Optional)

| | Master Spec | Team Plan |
|---|-------------|-----------|
| **Priority** | Phase 2 (core feature) | Phase 4 (optional) |

**RESOLUTION — Plugin, available whenever ready.** Neovim embedding ships as an MCP plugin, not a core dependency. The *default* build path prioritizes it for Phase 4, but the plugin architecture means it could be developed independently and installed at any time. Users who want Neovim don't wait for Phase 4 — they install the plugin when it's ready.

### CONFLICT 4: Session Storage — .mv2 Only vs SQLite + .mv2

| | Master Spec | Team Plan |
|---|-------------|-----------|
| **Approach** | Custom .mv2 binary only | Open Question: SQLite + .mv2? |

**RESOLUTION — Modular storage backend.** Default: SQLite for metadata + .mv2 for raw frame data. But the storage layer is abstracted behind a trait/interface:

- **Default:** SQLite + .mv2 hybrid (fast metadata queries + black box recording)
- **Alternative:** Pure .mv2 (single portable file, Master Spec's original vision)
- **Future:** PostgreSQL, cloud storage, or any backend someone writes a plugin for

The storage backend is configurable in `buddy.toml`. A user who wants the single-file portability of pure .mv2 can have it. A user who wants fast SQL queries gets SQLite. Nobody is forced.

### CONFLICT 5: Canvas Dashboard — Separate App vs Integrated MCP App

| | Master Spec | Team Plan |
|---|-------------|-----------|
| **Approach** | Standalone React/Next.js on localhost:3000 | MCP App iframe in the main UI |

**RESOLUTION — Both work, not mutually exclusive.** The Canvas Dashboard is built as an MCP App resource (Team Plan approach) which makes it embeddable in any host. But it can also be opened standalone via `requestDisplayMode("fullscreen")` or served on localhost:3000 for users who prefer a separate browser window. The dashboard doesn't know or care how it's hosted — it talks to the daemon via MCP tools either way.

---

## 6. Gaps to Fill (Features in One Doc but Missing from the Other)

### In Master Spec Only (Team Plan should adopt)

| Feature | Section | Why It Matters | Priority |
|---------|---------|----------------|----------|
| **Pair Programming Mode** | 7.1 | "Watch this and tell me when memory exceeds 2GB" — proactive AI monitoring | HIGH — cutting-edge differentiator |
| **Push-to-talk hotkey config** | 7.1 | Right Ctrl default, remappable in buddy.toml | HIGH — accessibility |
| **Copilot personality level** | 13.2 | Silent → Active, user-configurable | HIGH — maximum customization |
| **Layout presets** | 13.1 | Named multi-window arrangements | MEDIUM — power user feature |
| **Opacity and blur** | 13.1 | Visual customization | MEDIUM |
| **Educational notes behavior config** | 13.2 | Prompt/on-demand/off per user preference | MEDIUM |
| **Sudo Handshake** | 9.1 | One-time elevation for Observation Mode | HIGH — security model |
| **Linux Capabilities** | 9.2 | CAP_DAC_READ_SEARCH, CAP_SYS_PTRACE (not full root) | HIGH — security model |
| **Graceful Degradation** | 9.3 | "Basic Emulator Mode" without sudo | HIGH — accessibility |
| **HAL (Hardware Abstraction Layer)** | 3.3 | Structured sensor → source → implementation mapping | MEDIUM — good engineering |
| **Bincode IPC message types** | 4.2 | shared/ crate with typed messages | HIGH — needed for daemon↔UI |
| **Memvid append time target** | 6.2 | < 5ms per frame append | MEDIUM — performance |
| **Vector embedding generation** | 6.2 | 1536-dim, local, for semantic search | HIGH — powers search |
| **State-diffing engine** | 6.5 | Introspector struct with diff() method | HIGH — powers Correlation Engine |
| **RAG Chat** | 8 | Natural language queries on history | HIGH — killer feature |
| **TB as MCP Client** | 14.2 | Consume external MCP tools for richer explanations | HIGH — cutting-edge |
| **Plugin capability examples** | 13.3 | Explanation modes, sensors, analyzers, dashboard panels | MEDIUM — guides plugin developers |

### In Team Plan Only (Master Spec should adopt)

| Feature | Section | Why It Matters | Priority |
|---------|---------|----------------|----------|
| **MCP App UI architecture** | 2 | Swappable skins, embeddable in any MCP host | CRITICAL — the architectural pivot |
| **ontoolinputpartial streaming** | 2 | Stream terminal output into UI as it runs | HIGH — real-time UX |
| **onhostcontextchanged** | 2 | Inherit dyslexia fonts from host (Claude Desktop) | HIGH — accessibility |
| **callServerTool** | 2 | UI calls daemon directly, bypassing LLM | HIGH — performance |
| **requestDisplayMode("fullscreen")** | 2 | Canvas Dashboard goes fullscreen | MEDIUM |
| **terminal.search_history** | 4 | Semantic search MCP tool (7th tool, not in Master Spec) | HIGH |
| **BMAD agent team structure** | 3 | 5 agents with skill assignments | HIGH — project management |
| **Custom skills to create** | 6 | 6 domain-specific skills needed | HIGH — enables the team |
| **Module YAML** | 5 | Genesis Forge integration config | MEDIUM |
| **Phase 2-3 MCP tool rollout** | 4 | Read-only first, run_command only with security model | HIGH — safe rollout |
| **STRIDE analysis** | Agent 4 | Threat modeling for MCP tool surface | HIGH — security |

---

## 7. Customization Superpowers — What "Most Cutting Edge" Looks Like

Both documents value customization, but neither pushes it to the absolute limit. Here's what a maximally customizable Terminal Buddy looks like:

### Tier 1: Configuration (buddy.toml)

Everything in the Master Spec's Section 13, plus:

```toml
[appearance]
theme = "dyslexia-dark"          # or "hacker", "pastel", "solarized", custom
font_family = "OpenDyslexic"     # any installed font
font_size = 16
line_spacing = 1.6
opacity = 0.95
blur = 8
accent_color = "#FF6B6B"
cursor_style = "block"           # block, bar, underline
cursor_blink = true
animation_speed = 1.0            # 0 = no animations, 2 = double speed

[behavior]
copilot_personality = "active"   # "silent" | "on-ask" | "active" | "teacher"
session_titling = "suggest"      # "auto" | "suggest" | "off"
educational_notes = "on-demand"  # "always-prompt" | "on-demand" | "off"
teachable_moments = "inline"     # "inline" | "panel" | "voice-only" | "off"
explain_level = "beginner"       # "beginner" | "intermediate" | "expert"

[voice]
push_to_talk_key = "RightCtrl"
always_listening = false
voice_feedback = true            # Buddy speaks explanations aloud
voice_speed = 1.0
voice_personality = "friendly"   # "friendly" | "professional" | "casual"
wake_word = "hey buddy"         # optional always-on trigger

[ai]
transcription = "local"
explanation_backend = "claude"
privacy_mode = false
model_preference = "claude-sonnet-4-5-20250929"  # configurable model
context_window = "session"       # "session" | "project" | "all-history"

[layouts]
default = "single"
saved = ["dual-pane", "dashboard-focus", "minimal"]

[plugins]
auto_discover = true
plugin_dir = "~/.config/terminal-buddy/plugins/"
hot_reload = true
```

### Tier 2: Skins (MCP App Themes)

Beyond config — entirely different UIs:

| Skin | Target User | Description |
|------|-------------|-------------|
| **Dyslexia First** (default) | Primary user | Big fonts, spatial layout, voice hints, session cards with icons, minimal text |
| **Power Terminal** | Senior devs | Dense terminal grid, keyboard-driven, minimal chrome, system stats in statusbar |
| **Teacher Mode** | Learning CS | Every command gets an inline explanation, "what this does" tooltips, quiz mode |
| **Dashboard Mode** | System admins | System monitoring first, terminal second, graphs and timelines prominent |
| **Minimal** | Focus users | Just the terminal, nothing else, all features accessible via keyboard shortcuts |
| **Custom** | Anyone | Build your own — it's just HTML/CSS/JS served as an MCP App resource |

### Tier 3: Plugins (MCP Servers as Extensions)

The MCP plugin model means the ecosystem is unbounded:

| Plugin Category | Examples |
|-----------------|---------|
| **Explanation Modes** | "Explain like I'm 5", "Explain in Spanish", "Security-focused explanations" |
| **System Sensors** | GPU monitor, Docker container stats, network traffic analyzer |
| **Teachable Moment Analyzers** | Security audit (flag dangerous commands), performance hints, best practice suggestions |
| **Dashboard Panels** | Git history visualization, project dependency graph, live API monitoring |
| **AI Providers** | Ollama local, Claude, GPT, Gemini — swap via config |
| **Voice Extensions** | Custom wake words, multi-language support, voice macros |
| **Editor Integration** | Neovim plugin, VS Code bridge, JetBrains connector |

### Tier 4: Programmable (API + Scripting)

The most cutting-edge layer — user scripting:

| Feature | Description |
|---------|-------------|
| **Buddy Scripts** | User-defined automation scripts triggered by patterns (e.g., "when I run `docker-compose up` and it fails, automatically suggest port alternatives") |
| **Custom Correlators** | User-defined correlation rules beyond the default three streams |
| **Webhook Triggers** | Fire webhooks on events (session start, command fail, high CPU) |
| **MCP Tool Chaining** | Chain multiple MCP tools into workflows (get_screen → analyze → suggest_fix → run_command) |

---

## 8. Proposed Synthesis: The Unified Architecture

Taking the best of both documents and pushing toward maximum customizability:

```
┌──────────────────────────────────────────────────────────┐
│  RUST DAEMON (Process B — always running, headless)      │
│                                                          │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐  │
│  │ PTY Manager  │  │ Correlation   │  │ Memvid       │  │
│  │ portable-pty │  │ Engine        │  │ Writer       │  │
│  │ + alacritty  │  │ (3-stream)    │  │ (.mv2 + SQL) │  │
│  │ _terminal    │  │               │  │              │  │
│  └──────────────┘  └───────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐  │
│  │ Voice Engine │  │ AI Engine     │  │ Plugin       │  │
│  │ whisper-rs   │  │ (configurable │  │ Manager      │  │
│  │ cpal audio   │  │  backend)     │  │ (MCP client) │  │
│  └──────────────┘  └───────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │ MCP SERVER (tools + resources)                       ││
│  │ ├── terminal.get_screen                              ││
│  │ ├── terminal.get_session_history                     ││
│  │ ├── terminal.get_teachable_moment                    ││
│  │ ├── terminal.get_system_snapshot                     ││
│  │ ├── terminal.search_history                          ││
│  │ ├── terminal.add_note                                ││
│  │ ├── terminal.run_command (guarded)                   ││
│  │ └── registerAppResource (serves skin HTML)           ││
│  └──────────────────────────────────────────────────────┘│
└────────────────────────┬─────────────────────────────────┘
                         │ MCP Protocol
                         │ (stdio for Claude Desktop)
                         │ (HTTP for Tauri/standalone)
                         ▼
┌────────────────────────────────────────────────────────────┐
│  MCP APP UI (iframe — THE SKIN LAYER)                      │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Active Skin (user-selected, hot-swappable)          │   │
│  │                                                     │   │
│  │  ┌──────────┐ ┌────────────┐ ┌──────────────────┐  │   │
│  │  │ Terminal  │ │ Teachable  │ │ Session History  │  │   │
│  │  │ Grid     │ │ Moment     │ │ Browser          │  │   │
│  │  │ (xterm.js│ │ Panel      │ │ (cards, search)  │  │   │
│  │  │  WebGL)  │ │            │ │                  │  │   │
│  │  └──────────┘ └────────────┘ └──────────────────┘  │   │
│  │  ┌──────────────────────┐ ┌──────────────────────┐ │   │
│  │  │ Canvas Dashboard     │ │ RAG Chat Panel       │ │   │
│  │  │ (timeline, graphs)   │ │ (talk to history)    │ │   │
│  │  └──────────────────────┘ └──────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  Host: Claude Desktop | Cursor | Tauri (standalone)        │
│  Theme: Inherits from host via onhostcontextchanged        │
│  Config: buddy.toml overrides                              │
└────────────────────────────────────────────────────────────┘
                         │
                         │ Plugin MCP connections
                         ▼
┌────────────────────────────────────────────────────────────┐
│  PLUGIN ECOSYSTEM (each plugin = MCP server)               │
│                                                            │
│  ├── neovim-plugin (optional editor embedding)             │
│  ├── security-analyzer (flag dangerous commands)           │
│  ├── gpu-monitor (NVIDIA/AMD stats)                        │
│  ├── explain-simple (ELI5 mode)                            │
│  ├── voice-macros (custom voice commands)                  │
│  └── ... (any MCP server works as a plugin)                │
└────────────────────────────────────────────────────────────┘
```

### What This Synthesizes

| From Master Spec | From Team Plan | New (Neither Doc) |
|-----------------|----------------|-------------------|
| alacritty_terminal for VTE parsing | MCP App iframe architecture | Skin marketplace concept |
| Correlation Engine (3-stream) | Swappable skins | Programmable Buddy Scripts |
| Memvid .mv2 format | MCP protocol as plugin substrate | Tiered customization (config → skin → plugin → script) |
| buddy.toml customization | BMAD 5-agent team | Explain level (beginner/intermediate/expert) |
| Voice interaction modes (3) | Custom skills for project | AI backend as user config |
| HAL sensor abstraction | Phase 2-3 MCP tool rollout | Hybrid SQLite + .mv2 storage |
| Security model (capabilities) | STRIDE analysis | Plugin security sandbox |
| Pair Programming Mode | ontoolinputpartial streaming | Wake word ("hey buddy") |
| RAG Chat | callServerTool for direct calls | Voice macros plugin |
| Graceful Degradation | Module YAML for Genesis Forge | Custom correlator rules |

---

## 9. Recommended Unified Phase Plan

| Phase | Name | Key Deliverables | Customization Unlocked |
|-------|------|-----------------|----------------------|
| **1** | **Iron Skeleton** | Cargo workspace, PTY via portable-pty + alacritty_terminal, MCP server skeleton, basic xterm.js skin in Tauri, buddy.toml parser, CI pipeline | Theme switching, font config, basic buddy.toml |
| **2** | **The Brain** | Correlation Engine (3-stream), Memvid .mv2 writer + SQLite index, Session History, MCP tools (read-only), Teachable Moments, buddy.toml full config | Copilot personality, explain level, session behavior, educational notes config |
| **3** | **Voice & Skins** | Whisper.cpp local STT, voice interaction modes (Command/Fix/Pair), Canvas Dashboard as MCP App, skin system (dyslexia-first + power user), plugin system | Full skin swapping, voice config, plugin installation, AI backend selection |
| **4** | **Ship & Extend** | Security hardening (STRIDE + capabilities), cross-platform, Neovim plugin, plugin hot-reload, release pipeline, skin marketplace structure | Custom skins, custom plugins, Buddy Scripts, webhook triggers |

---

## 10. Final Verdict

| Dimension | Winner | Why |
|-----------|--------|-----|
| **Technical depth** | Master Spec | 774 lines of Rust architecture, code stubs, HAL design |
| **Strategic architecture** | Team Plan | MCP App pivot is game-changing for customizability |
| **Team structure** | Team Plan | 5 focused agents > no team definition |
| **Phasing** | Team Plan | Correlation Engine earlier, Neovim later |
| **Customization vision** | Master Spec | buddy.toml detail, plugin examples, personality levels |
| **MCP integration** | Team Plan | UI as MCP App, unified plugin model |
| **Security** | Both (complementary) | Master Spec has capabilities model, Team Plan has STRIDE |
| **Missing pieces** | Both | Master Spec lacks MCP App; Team Plan lacks 120 FPS path, RAG Chat, Pair Programming Mode |

**The unified document should be the Team Plan's architecture + the Master Spec's technical detail + the customization superpowers from Section 7 of this comparison.**

---

*This comparison was produced by reading both documents in full (774 + 399 lines = 1,173 lines of specification) and cross-referencing every feature, decision, and architectural choice.*

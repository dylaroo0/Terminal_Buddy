# Terminal Buddy — Master Design & Architecture Spec

> **Document Status:** FOUNDATIONAL REFERENCE
> **Superseded By:** `docs/plans/2026-02-22-terminal-buddy-architecture-design.md` for architecture decisions
> **Still Authoritative For:** Correlation Engine detail, Memvid .mv2 format, Security Model, HAL, buddy.toml spec
> **Created:** 2026-01 (consolidated from v1.0-v3.0 specs)
> **Lead Architect:** Fred
> **Core Language:** Rust 1.80+ (Stable)
> **Target Platforms:** Linux (X11/Wayland), macOS (AppKit/Metal), Windows (DirectX)
> **Document Version:** Consolidated from v1.0 → v3.0 specs + engineering briefs

---

## 🧭 Table of Contents

1. [Vision & Why It Exists](#1-vision--why-it-exists)
2. [Product Requirements (The "What")](#2-product-requirements-the-what)
3. [Foundation Spec (The "Metal")](#3-foundation-spec-the-metal)
4. [System Architecture (The "How")](#4-system-architecture-the-how)
5. [The Correlation Engine (The "Why Behind Commands")](#5-the-correlation-engine-the-why-behind-commands)
6. [Memory Engine — Memvid](#6-memory-engine--memvid)
7. [The Control Plane — Voice & Neovim](#7-the-control-plane--voice--neovim)
8. [The Canvas Dashboard](#8-the-canvas-dashboard)
9. [Security & Privilege Model](#9-security--privilege-model)
10. [Phased Roadmap](#10-phased-roadmap)
11. [Phase 1 Build Directives & Starter Templates](#11-phase-1-build-directives--starter-templates)
12. [Repository Standards & Professional Guidelines](#12-repository-standards--professional-guidelines)
13. [Modularity, Customization & Plugins](#13-modularity-customization--plugins)
14. [MCP Integration](#14-mcp-integration)

---

## 1. Vision & Why It Exists

Terminal Buddy is a **next-generation terminal emulator** built around a single core principle: **the terminal should understand what just happened, not just display it.**

Most terminal emulators are passive display surfaces — they show you text. Terminal Buddy taps directly into the OS kernel, file system, and system logs to **correlate what you typed with everything your computer actually did in response.** Then it explains it to you — in plain language, out loud if you want.

### 1.1 The Origin Story (Why This Was Built)

This project was born from a real need. The primary designer is dyslexic and new to computer science. Using a traditional terminal means confronting:

- Walls of cryptic text with no explanation
- Commands that fail silently or with error messages that require expert knowledge to decode
- No memory — each session starts with a blank slate, forcing the user to reconstruct context from scratch
- Interfaces that assume you already know what you're doing

Terminal Buddy's first user is someone who needs to **actually communicate with the terminal** — not just throw text at it and hope for the best. This shapes every design decision. **A feature that doesn't serve that user doesn't ship.**

### 1.2 The Philosophy of Choice (No Forced Constraints)

Terminal Buddy will **never force the user into a specific workflow or hardware trap**. While the core mainframe structure provides a robust foundation, everything else is entirely up to the user. We do not want to force anything to be "stuck."

- **Hardware & API Agnostic:** If your local machine lacks a powerful enough GPU for local AI, you are not locked out. The architecture is open to any external API or subscription service you choose.
- **Radically Customizable:** Every component is designed to be modular, updateable, cutting-edge, and completely customizable.
- **Universal Design:** It is built from the ground up to easily adapt its design to work for different types of workers, designers, learners, and educators.

### 1.3 The Session History — The "Living Logbook"

One of Terminal Buddy's most important features is the **Session History Browser** — a first-class UI that appears when you open the app, before you've even typed a command.

**How sessions work:**

- Every time you open Terminal Buddy, a new **named session** begins recording.
- Sessions are listed by **date and time**, like chapters in a journal.
- When a session ends (or at any point), Terminal Buddy **auto-generates a title** based on what you actually did — e.g., *"Fixed Nginx port conflict, updated docker-compose"* or *"Set up Python virtual environment for ml-project."*
- The AI proposes the title as a suggestion: *"How's this title? Save it?"* The user can accept it, edit it, or skip. Before you close a session, you get one last prompt to confirm or rename.
- Sessions are **browsable**: open the history panel, scroll through dates, click any session to review it.

**Inside a session, you can:**

- See a chronological log of every command run and its outcome
- Chat with the Copilot about what happened: *"Why did that command take so long?"*
- Add **educational notes** — personal annotations you write to your future self, explaining what you learned. These are saved permanently with the session.
- Review the AI's Teachable Moment explanations for any command that caused a system change
- See a timeline of exactly how your computer's state (files, CPU, disk, processes) changed during the session

**The key principle:** Most of the time, you're just getting the job done. The session log stays out of your way. But when you *want* to go back and understand what happened — or teach yourself something — it's all there, organized and searchable.

### 1.4 The Problem It Solves

When a command fails, you typically see a cryptic error on screen. What you *don't* see:

- Which kernel-level permission was denied
- Which other process was holding the port/file
- Which files were silently created or destroyed
- What the CPU and disk did during execution
- What the terminal session was doing *before* — the context that would make this failure make sense

Terminal Buddy surfaces all of this automatically. It calls these **"Teachable Moments."**

### 1.5 Who It's For

- **The person who is new to CS and/or has dyslexia** — the primary user. Needs plain-language explanations, strong voice input, and a system that remembers context.
- Developers debugging complex system-level failures who want a correlated view of what the OS actually did
- Users with RSI or other motor considerations — voice is a genuine alternative to typing, not an assistive afterthought
- Power users who want a permanent, semantically searchable "black box" of their machine's entire command history

### 1.6 What Terminal Buddy Is Not

- **Not a toy.** The underlying terminal is fully professional — multi-window, full VTE compatibility, 120 FPS rendering, Neovim embedding. It handles everything a production terminal does.
- **Not a simplified "baby" terminal.** The goal is to make the real thing accessible — not to replace it with something weaker.
- **Not exclusively cloud-dependent or local-only.** While local processing (Whisper, local LLMs) ensures privacy, users can effortlessly plug in cloud APIs (Claude, OpenAI) if their local hardware isn't powerful enough. The choice is always the user's.

---

## 2. Product Requirements (The "What")

### 2.1 Core Terminal Experiences

| Requirement | Description |
|---|---|
| **120 FPS rendering** | The terminal grid renders at 120 FPS, no exceptions. No dropped frames from AI or disk I/O. |
| **Full VTE compatibility** | `htop`, `tmux`, `vim`, and similar TUI apps must render correctly. |
| **Multi-window layout** | Open multiple terminal windows/panes, freely tiled, just like any professional terminal. |
| **Session History Browser** | Browse all past sessions by date, with auto-generated titles, searchable, annotatable. |
| **Persistent memory** | Terminal state survives crashes/reboots via Memvid `.mv2` log. |
| **Cross-platform** | Linux, macOS, Windows supported from day one. |
| **System Connection Tracking** | After every command, Terminal Buddy records what it did to the computer — files changed, processes spawned, CPU/disk impact — and links it back to that session. |

### 2.2 Cognitive Accessibility (First-Class)

Terminal Buddy is not a traditional terminal with accessibility bolted on. Accessibility is a **primary design constraint**, not a feature.

- **Voice Input as a Peer to Keyboard:** All keyboard input can be replaced by voice. Voice is not an accessibility "mode" — it's always running, always aware.
- **Dyslexia-Friendly Interface:** Spatial, visual layout that reduces cognitive load. No walls of undifferentiated text.
- **Plain-Language Error Explanations:** The AI "Buddy" translates system errors into human sentences, grounded in actual kernel data.
- **Session Context Memory:** The Copilot always knows what you've been doing. You never have to re-explain your situation.

> **User Story:** *"I'm dyslexic and new to computer science. I want to say 'Run the docker compose file in detached mode' and watch it happen — and if it fails, I want the terminal to tell me why in plain English, not show me a wall of error codes."*

### 2.3 The Session History Experience

The session log is the heart of the product for new and accessibility-focused users.

**Session Lifecycle:**

1. Open Terminal Buddy → Session automatically starts recording
2. Work normally — the log stays out of your way
3. On close (or anytime), AI proposes a session title based on what you did
4. User approves, edits, or skips the title
5. Session is saved, indexed, and searchable

**What you can do in History:**

- Browse sessions by date with their auto-titles
- Chat with Copilot about any past session: *"What was I doing on Tuesday with Python?"*
- Add personal **educational notes** to any session — written annotations that persist with the log
- Review the full timeline of system state changes for that session
- See Teachable Moment explanations for every command that had a system impact

### 2.4 The "Teachable Moment" Feature

The core technical differentiator. When any command completes, Terminal Buddy:

1. Captures the **terminal output** (stdout/stderr)
2. Captures the **filesystem delta** (files created/modified/deleted)
3. Captures the **kernel/OS logs** from the exact timestamp window of execution
4. Synthesizes all three into a human-readable explanation
5. Makes that explanation available on-screen, via voice, and permanently in the session log

---

## 3. Foundation Spec (The "Metal")

### 3.1 Why Rust (Non-Negotiable for the Daemon)

While the UI is rendered via web technologies (MCP App iframe), the core daemon is explicitly Rust. The reasons:

- No Garbage Collection pauses in system event processing
- Minimal memory footprint for background hooks
- Raw, predictable speed for PTY management and log correlation
- Respects battery life and CPU cycles

### 3.2 Core Dependencies

| Component | Technology | Purpose |
|---|---|---|
| **Rendering (UI)** | `xterm.js` (WebGL) + HTML/CSS | Renders terminal grid inside the MCP App iframe at 120 FPS. |
| **Fallback / Native** | `tauri` + `alacritty_terminal` | "Native mode" fallback for extreme power users who need raw GPU performance. |
| **MCP Integration** | `@modelcontextprotocol/ext-apps` | Allows the entire UI to be served as swappable skins within a host. |
| **Process/Shell** | `portable-pty` v0.8 (Rust) | Cross-platform pseudo-terminal shell spawning. |
| **Async Runtime** | `tokio` v1.40 (Rust) | Powers all I/O in the Daemon process. |
| **System Sensors** | `sysinfo` v0.30 / `procfs` | CPU, memory, process tree polling. |
| **Kernel Logs** | `libsystemd` bindings | Direct `journald` access on Linux. |
| **File Watching** | `notify` | Recursive, async `inotify`/`FSEvents` watcher. |
| **Network** | `net-stat` | Maps outbound connections/port bindings to the running CLI process. |
| **Voice Input** | `cpal` + `whisper.cpp` (local) | Low-latency microphone audio buffering and transcription. |
| **Memory Storage** | `rusqlite` + `.mv2` | SQLite for fast metadata/search, `.mv2` for raw binary frame blobs. |
| **Neovim Embedding** | `nvim-rs` | Embeds Neovim via `nvim --embed` RPC. |

### 3.3 Hardware Abstraction Layer (HAL)

This is the "nervous system" of Terminal Buddy — the layer that connects terminal activity to machine reality.

| Sensor | Source of Truth | Implementation |
|---|---|---|
| IO / Process Monitoring | `/proc/diskstats` (Linux) | `sysinfo` / `procfs` crates |
| System Logs | `journalctl` / macOS Unified Logging | `libsystemd` bindings / `security-framework` |
| File Changes | Kernel `inotify` / `FSEvents` | `notify` crate (recursive, async) |
| Network Connections | `netstat` / `/proc/net` | `net-stat` crate |

---

## 4. System Architecture (The "How")

### 4.1 The MCP App Architecture

Terminal Buddy uses a powerful decoupled architecture. The heavy lifting is done by a persistent Rust Daemon, while the entire UI is served as a swappable MCP App resource (iframe).

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
│  │ whisper.cpp  │  │ (configurable)│  │ Manager      │  │
│  └──────────────┘  └───────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │ MCP SERVER (tools + resources)                       ││
│  │ ├── terminal.get_screen                              ││
│  │ ├── terminal.run_command (guarded)                   ││
│  │ └── registerAppResource (serves skin HTML)           ││
│  └──────────────────────────────────────────────────────┘│
└────────────────────────┬─────────────────────────────────┘
                         │ MCP Protocol (stdio/HTTP)
                         ▼
┌────────────────────────────────────────────────────────────┐
│  MCP APP UI (iframe — THE SKIN LAYER)                      │
│                                                            │
│  Host: Claude Desktop | Cursor | Tauri (standalone fallback)│
│  Theme: Inherits from host via onhostcontextchanged        │
└────────────────────────────────────────────────────────────┘
```

### 4.2 UI Layer and IPC

The UI is built with web technologies (HTML/Canvas/xterm.js) and communicates with the Rust Daemon entirely over the Model Context Protocol (MCP).
This allows UI "skins" to be hot-swapped without recompiling the core application.
The iframe can invoke backend logic via `callServerTool` and receive real-time streams via `ontoolinputpartial`.

### 4.3 Cargo Workspace Structure

```
terminal-buddy/
├── Cargo.toml           # Workspace root
├── ui/                  # MCP App UI skins (HTML/JS/xterm.js)
└── daemon/              # Tokio + PTY backend
    └── src/
        ├── pty_runner.rs
        ├── log_pipe.rs
        ├── state_diff.rs
        ├── sensors.rs
        └── correlator/
            └── mod.rs
```

---

## 5. The Correlation Engine (The "Why Behind Commands")

This is the most critical technical component. The Correlation Engine links a specific `CommandID` to three distinct, asynchronous data streams — the **Correlation Triple.**

### 5.1 The Three Streams

| Stream | What It Captures | Why It Matters |
|---|---|---|
| **Stream A — Terminal** | Raw `stdout`/`stderr` | The visible "Result" |
| **Stream B — Filesystem/Process** | Delta in files and PIDs | The "Impact" on the system |
| **Stream C — System Logs** | Kernel/OS logs filtered by timestamp | The "Root Cause" |

### 5.2 Correlation Logic

```rust
pub struct EventCorrelator {
    pub command_id: uuid::Uuid,
    pub active_pid: u32,  // The root shell PID executing the command
    pub timestamp_range: (DateTime<Utc>, DateTime<Utc>),
}

impl EventCorrelator {
    /// Fetches OS logs matching the command's timestamp, filtered to the process tree
    pub fn fetch_and_filter_logs(&self) -> Result<Vec<OSLogEntry>, CorrelationError> {
        #[cfg(target_os = "linux")]
        let logs = query_journalctl(self.timestamp_range, self.active_pid);
        #[cfg(target_os = "macos")]
        let logs = query_unified_logging(self.timestamp_range, self.active_pid);
        logs
    }

    /// Synthesizes all streams into a single unified impact report
    pub fn generate_impact_report(&self) -> SystemImpact { /* ... */ }
}
```

### 5.3 The "Teachable Moment" API Response

When the Canvas UI or AI queries `GetTeachableMoment(command_id)`, it receives:

```json
{
  "command": "docker-compose up",
  "terminal_summary": "Error: Port 8080 already in use",
  "system_impact": {
    "files_modified": ["./docker-compose.yml"],
    "cpu_spike_pct": 45.2,
    "new_processes": []
  },
  "root_cause_logs": [
    {
      "source": "kernel",
      "level": "error",
      "message": "TCP: [::]:8080 bound by process 1290 (nginx)"
    }
  ],
  "buddy_explanation": "You can't start this because Nginx is already holding port 8080. Run `sudo lsof -i :8080` to confirm, then kill the process."
}
```

The key insight: **the AI's explanation is grounded in actual kernel data** — not the AI guessing from the visible error message. This is what makes it trustworthy.

---

## 6. Memory Engine — Memvid

### 6.1 What It Is

Memvid is the **"Black Box Flight Recorder"** for your developer machine. It continuously appends atomic "Reality Snapshots" to a single binary file: `history.mv2`.

We use a **hybrid storage model**: SQLite for fast indexing and metadata (session titles, timestamps, tags, command index), pointing to byte offsets in the `.mv2` raw binary blobs.

### 6.2 The `.mv2` Frame Structure

```rust
pub struct MemvidFrame {
    pub frame_type: u8,              // 0: Text Grid, 1: System Snapshot, 2: AI Correlation
    pub timestamp: u64,
    pub data: Vec<u8>,               // Zstd compressed payload (minimizes disk footprint)
    pub vector_embedding: [f32; 1536], // 1536-dim vector for semantic search, generated LOCALLY
}
```

Frames are appended in real-time. Append time target: **< 5ms.**

### 6.3 What Gets Captured

Every 100ms, or on command completion, the Daemon captures:

1. **TerminalState** — compressed delta of the visible text grid
2. **SystemImpact** — JSON blob of disk/CPU changes since the last snapshot
3. **Embedding** — local vector representation for semantic search

### 6.4 Why It's Powerful

- **Portability:** Your entire machine's "memory" is a single file you can move anywhere.
- **Semantic Search:** Search for *concepts* like "the time I fixed the database permissions" — not just exact text matches.
- **Timeline Scrubbing:** The Canvas Dashboard lets you replay and scrub through your session history visually.
- **Privacy-First:** Vector embeddings are generated locally. No data leaves your machine.

### 6.5 The State-Diffing Engine

```rust
pub struct Introspector {
    last_snap: SystemSnapshot,
}

impl Introspector {
    pub fn diff(&mut self, current: SystemSnapshot) -> Delta {
        Delta {
            disk_usage: current.disk_bytes - self.last_snap.disk_bytes,
            proc_spawned: current.pids.difference(&self.last_snap.pids),
        }
    }
}
```

---

## 7. The Control Plane — Voice & Neovim

### 7.1 Voice: The "Always-Aware Co-Pilot"

Voice input is **not an accessibility addon** — it is a primary input method, equal in priority to the keyboard.

**Privacy-First Pipeline:**

```
Mic → Local Whisper.cpp (Rust bindings) → Text → Local/Remote LLM → PTY Injection
```

Audio transcription is processed **100% on-device** via Whisper. No voice data ever touches a cloud.
However, the **Explanation Backend** is user-configurable (`local` | `claude` | `openai` | `gemini` | `ollama`), with an optional `privacy_mode` to force everything to remain local if the user prefers.

**Interaction Modes:**

| Mode | How to Trigger | What It Does |
|---|---|---|
| **Command Mode** | Hold hotkey, speak | "List all hidden files sorted by size" → runs `ls -laS` immediately |
| **Fix Mode** | "Why did that build fail?" | AI reads terminal error + kernel logs, explains in plain language |
| **Pair Programming Mode** | "Watch this and tell me when memory exceeds 2GB" | AI monitors execution and alerts proactively |

**Push-to-Talk:** Default is Right Ctrl. Fully remappable to any hardware interrupt via `buddy.toml`.

### 7.2 Neovim Embedding (Phase 4 / Optional)

We offer embedded Neovim using the `nvim --embed` RPC protocol as an **optional plugin** for power users (Phase 4).

**How it works:**

- Spawn `nvim --embed --headless`
- The UI implements the Neovim UI protocol and renders grid updates.
- 100% compatible with all existing Neovim plugins and configs.

---

## 8. The Canvas Dashboard

The Canvas Dashboard is **an integrated MCP App iframe** embedded directly within the UI layout.

**Key Features:**

- **Timeline Scrubbing:** Drag a slider to visually replay past terminal states
- **RAG Chat:** Ask questions about your history in natural language ("What was I doing with Docker last Tuesday?")
- **System Impact Visualization:** See exactly which files changed and CPU/disk activity for any past command
- **Teachable Moment Review:** Browse the AI-generated explanations for past command failures

**Architecture:** The Dashboard is an HTML/JS widget served by the daemon's MCP `registerAppResource`. It can be run as an integrated panel or expanded to full-screen mode via `requestDisplayMode("fullscreen")`.

---

## 9. Security & Privilege Model

Deep system introspection requires elevated privileges. Terminal Buddy strictly follows the **Principle of Least Privilege.**

### 9.1 The Sudo Handshake

On first run, Terminal Buddy prompts for `sudo` **once** to spawn the Sidecar in "Observation Mode."

### 9.2 Linux Capabilities (Not Full Root)

Instead of running the entire terminal as root (dangerous), the Sidecar uses Linux Capabilities selectively:

| Capability | Purpose |
|---|---|
| `CAP_DAC_READ_SEARCH` | Read system logs across user boundaries |
| `CAP_SYS_PTRACE` | Monitor other processes |

The actual shell where the user executes commands **drops back to standard user permissions immediately.**

### 9.3 Graceful Degradation

If the user denies elevated privileges, Terminal Buddy enters **"Basic Emulator Mode":**

- Deep system correlation is disabled
- Standard text rendering works normally
- Local file tracking within the working directory is retained

---

## 10. Phased Roadmap

Progression is **strictly gated** — earlier phase acceptance criteria must pass before the next phase begins. We follow a 4-phase rollout, balancing the core engine with progressive MCP features.

### Phase 1: The Iron Skeleton *(Current Target)*

**Goal:** A running, stable terminal UI powered by an MCP App with Rust Daemon connecting to a real PTY.

**Tasks:**

- Initialize Rust Cargo Workspace (`ui`, `daemon`, `shared`)
- Implement PTY management via `portable-pty` and `alacritty_terminal` for VTE parsing
- Build the MCP server skeleton and simple xterm.js WebGL skin (served via Tauri or Claude Desktop)
- CI pipeline setup

**Acceptance Criteria:** Typing `top` or `htop` in the MCP iframe UI renders correctly without significant overhead.

---

### Phase 2: The Brain

**Goal:** Enable system correlation, Memvid logging, and basic AI features.

**Tasks:**

- Correlation Engine (3-stream capturing of terminal, files, and kernel)
- Memvid `.mv2` writer + SQLite index
- First set of MCP tools (read-only queries like `get_screen`, `get_session_history`)
- Teachable Moments backend logic
- Full parsing and implementation of `buddy.toml` configuration

**Acceptance Criteria:** A command execution accurately logs system impact and translates into an accurate "Teachable Moment" explanation.

---

### Phase 3: Voice & Skins

**Goal:** Enable full voice interaction, the Canvas Dashboard, and the swappable skin system.

**Tasks:**

- `cpal` + `whisper.cpp` local integration
- Implement Voice modes (Command, Fix, Pair Programming)
- Canvas Dashboard as an MCP App UI element
- Multi-skin system (Dyslexia-first mode, Power User mode)
- Plugin system enablement

**Acceptance Criteria:** User holds hotkey, speaks a command, watches it execute, and the UI can be hot-swapped between completely different skins.

---

### Phase 4: Ship & Extend

**Goal:** Polish, harden security, and expand the ecosystem.

**Tasks:**

- Security hardening (STRIDE analysis, `terminal.run_command` user guardrails)
- Cross-platform packaging (Linux, macOS, Windows)
- Neovim plugin (optional)
- Plugin hot-reload and marketplace structure
- Release pipeline

**Acceptance Criteria:** The application is secure, stable, cross-compatible, and ready for production use.

---

## 11. Phase 1 Build Directives & Starter Templates

### 11.1 `Cargo.toml` (Root Workspace)

```toml
[workspace]
members = ["ui", "daemon", "shared"]
resolver = "2"

[workspace.dependencies]
# UI / Rendering
tauri = { version = "2.0.0-rc" }
alacritty_terminal = "0.22"

# Daemon / System
tokio = { version = "1.40", features = ["full"] }
portable-pty = "0.8"
sysinfo = "0.30"

# Memory Data & IPC
rusqlite = "0.31"
bincode = "1.3"
serde = { version = "1.0", features = ["derive"] }

# Error Handling
anyhow = "1"
thiserror = "1"
```

### 11.2 `daemon/src/pty_runner.rs` (Architectural Stub)

This demonstrates exactly where the MCP App IPC and Memory Logging intersect — the two most critical integration points.

```rust
use portable_pty::{CommandBuilder, NativePtySystem, PtySize, PtySystem};
use std::sync::mpsc::Sender;
use tokio::io::AsyncReadExt;

pub async fn spawn_sidecar_pty(ipc_sender: Sender<Vec<u8>>) -> anyhow::Result<()> {
    let pty_system = NativePtySystem::default();
    let pair = pty_system.openpty(PtySize {
        rows: 24,
        cols: 80,
        pixel_width: 0,
        pixel_height: 0,
    })?;

    let mut cmd = CommandBuilder::new(if cfg!(windows) { "cmd.exe" } else { "bash" });
    let _child = pair.slave.spawn_command(cmd)?;
    let mut reader = pair.master.try_clone_reader()?;

    // The Core Sidecar Loop
    tokio::task::spawn_blocking(move || {
        let mut buf = [0u8; 1024];
        while let Ok(n) = reader.read(&mut buf) {
            if n == 0 { break; }
            let output = buf[..n].to_vec();

            // 1. Send to Process A (GUI) for instant rendering
            let _ = ipc_sender.send(output.clone());

            // 2. TODO (Phase 3 Memory Integration):
            // memvid_writer.append_frame(output, current_sys_delta);
        }
    });

    Ok(())
}
```

### 11.3 Phase 1 File-Level Build Directives

| File | Task |
|---|---|
| `src/daemon/pty.rs` | Implement the PTY wrapper using `portable-pty` |
| `src/daemon/sensors.rs` | Implement `SystemSnapshot` struct and `inotify` file-watcher |
| `src/daemon/log_pipe.rs` | Async stream that parses `journalctl -f` into structured Rust enums. Include backpressure so log floods can't crash daemon. |
| `src/daemon/state_diff.rs` | Memory-mapped storage for pre/post-execution system states. Implement the diffing algorithm for system snapshots. |
| `src/ui/index.html` | Base HTML skeleton for the MCP App UI using xterm.js WebGL renderer |
| `src/memory/memvid.rs` | Bridge that pushes `BuddyMessage::SystemDelta` into the `.mv2` format |
| `src/correlator/mod.rs` | Match Shell PID to system log timestamps at microsecond precision |
| `src/ipc/socket.rs` | MCP Protocol binding over stdio/HTTP |

---

## 12. Repository Standards & Professional Guidelines

These apply from the **very first commit.**

### Error Handling

- **Never** use `.unwrap()` or `.expect()` in production paths.
- Use `anyhow` for application-layer errors.
- Use `thiserror` for library-layer error types.
- Return graceful errors to the GUI so the "Buddy" can explain crashes to the user in plain language.

### Formatting & Linting

- `cargo fmt` and `cargo clippy` must pass on every commit.
- Add `#![deny(clippy::unwrap_used)]` to `lib.rs` and `main.rs`.

### Asynchronous Boundaries

- **Never** execute heavy blocking I/O on the main Tokio runtime thread.
- **Never** block the GPUI render thread.
- Use `tokio::task::spawn_blocking` for all system-level reads (disk, logs, sensors).

### The Single Most Important Rule

The 120 FPS render must never drop. If in doubt about whether an operation should be in the GUI or the Daemon: **it goes in the Daemon.**

---

## 13. Modularity, Customization & Plugins

Terminal Buddy is built for individuals, not for a single type of user. The architecture is explicitly designed so that people can shape it to how *they* think and work.

### 13.1 Visual Customization

Every visual aspect of the terminal is configurable via `buddy.toml`:

- **Color schemes / themes** — ship with curated defaults (dark, high-contrast, dyslexia-friendly), fully overridable
- **Font face, size, and line spacing** — including support for OpenDyslexic and other accessibility fonts
- **Opacity and blur** — for users who prefer a less visually dominant terminal
- **Layout presets** — save preferred multi-window arrangements as named layouts
- **Accent colors** — for window borders, status indicators, and session timestamps

### 13.2 Behavioral Customization

- **Hotkey remapping:** Every keyboard shortcut (including Push-to-Talk) is user-addressable in `buddy.toml`
- **Voice Copilot personality level:** Choose how proactive the Buddy is — from silent (only speaks when asked) to active co-pilot (comments on system events)
- **Session auto-titling behavior:** Can be fully automatic, always ask, or disabled per user preference
- **Educational notes:** Can be set to prompt after every session, only on demand, or not at all

### 13.3 Plugin & Extension Architecture

Terminal Buddy exposes a stable **Plugin API** via JSON-RPC over a local socket. This means plugins can be written in any language.

**What plugins can do:**

- Add new Copilot explanation modes (e.g., a "Explain like I'm 5" plugin that rewrites all Buddy output in simpler language)
- Add new system sensors (e.g., GPU monitoring, custom hardware interfaces)
- Add new Teachable Moment analyzers (e.g., a security plugin that flags dangerous `rm -rf` patterns)
- Add new Canvas Dashboard panels (custom visualizations of `.mv2` history data)
- Integrate external AI providers if local inference isn't sufficient

**Plugin discovery:** Plugins live in `~/.config/terminal-buddy/plugins/`. They're auto-discovered on startup. No restart required to install a plugin — hot-reload is supported.

### 13.4 The Design Philosophy of Modularity

The terminal should fit the person, not the other way around.

For a brand-new CS learner with dyslexia, Terminal Buddy might run in maximum-assist mode: large fonts, proactive voice explanations, colorful session cards in the history browser.

For a senior engineer who just wants the 120 FPS terminal and the system correlation data, Terminal Buddy runs silently, gets out of the way, and logs everything in the background.

**Both are the same application.** The defaults are chosen for the person who needs the most support. Everything else is a preference.

---

## 14. MCP Integration

The **Model Context Protocol (MCP)** is an open standard for connecting AI systems with external tools and data sources. Terminal Buddy has a natural, two-directional relationship with MCP — and it should be treated as a first-class integration concern, not an afterthought.

### 14.1 Terminal Buddy as an MCP Server

The most powerful use: **Terminal Buddy exposes itself as an MCP server**, allowing any MCP-compatible AI host (Claude Desktop, custom agents, etc.) to directly interact with the terminal, session history, and system data.

**What this enables:**

| MCP Tool | What the AI Can Do |
|---|---|
| `terminal.run_command` | Execute a shell command in the active terminal session |
| `terminal.get_screen` | Read the current visible terminal output as text |
| `terminal.get_session_history` | Query past sessions, filtered by date or semantic search |
| `terminal.get_teachable_moment` | Retrieve the Correlation Engine's full cause-and-effect report for any past command |
| `terminal.add_note` | Append a note to any session in the history |
| `terminal.get_system_snapshot` | Get the current CPU/disk/process/network state of the machine |

**Why this matters:** With these tools, a user could open Claude Desktop and say:
> *"Look at my terminal session from yesterday, find where my Docker build failed, and tell me what to fix."*

Claude uses `get_session_history`, finds the session, calls `get_teachable_moment`, reads the kernel-correlated root cause, and gives a grounded answer — without the user needing to copy-paste anything.

This is a **zero-effort AI integration** because the data is already there in Memvid. MCP is just the door.

### 14.2 Terminal Buddy Copilot as an MCP Client

The Buddy's AI engine can act as an **MCP client**, consuming tools exposed by other servers to augment its explanations and assistance.

**Example external MCP tools the Copilot could consume:**

- **Filesystem MCP server** — for reading project files to give context-aware suggestions
- **GitHub MCP server** — to correlate a failing build with a recent commit or PR
- **Documentation MCP servers** — to look up official docs when explaining an error
- **Custom internal MCP servers** — if the user is in a corporate environment with internal tooling APIs

**How it works in practice:**
When you ask *"Why did `npm install` fail?"*, the Copilot doesn't just read the terminal output. It can check the `package.json` via the Filesystem MCP server, cross-reference the error with the npm registry, and give you a fully contextualized answer.

### 14.3 MCP as the Plugin Substrate

Rather than building a proprietary plugin API *and* MCP separately, Terminal Buddy's plugin architecture (Section 13) **is built on MCP**.

This means:

- Every Terminal Buddy plugin is just an MCP server the daemon connects to
- Plugins are language-agnostic by definition (MCP is JSON-RPC over stdio or HTTP)
- Existing MCP servers from the broader ecosystem work as Terminal Buddy plugins with zero modification
- The Plugin API surface is stable, documented, and not Terminal Buddy-specific

**Plugin lifecycle:**

1. User places an MCP server config in `~/.config/terminal-buddy/plugins/`
2. Daemon discovers and connects to the server at startup (or hot-reload on config change)
3. Exposed MCP tools become available to the Buddy Copilot and to Canvas Dashboard widgets

### 14.4 Design Considerations

> [!IMPORTANT]
> **Security:** MCP tools that can execute commands (`terminal.run_command`) must be guarded by explicit user-confirmation prompts. No MCP client should be able to silently run commands in the user's shell. This is a hard requirement, not a configuration option.

> [!NOTE]
> **MCP App GUI:** The MCP ecosystem is moving toward rich GUI integrations ("MCP Apps"). Terminal Buddy's Canvas Dashboard is a natural candidate to become the visual shell for MCP-powered interactions — displaying tool call results, session data, and system state in a rich, navigable UI alongside conversation with the Copilot.

> [!TIP]
> **Start small:** For Phase 2 or 3, implement `terminal.get_screen` and `terminal.get_session_history` as the first two MCP tools. These are read-only, safe, and immediately unlock powerful use cases for Claude Desktop integration.

---

*Document synthesized from: `temfull.pdf` (full PRD), `temTechBild.pdf` (expanded v3.0 tech spec), `Term1.pdf` (v1 tech build spec), `term2.pdf` (v2 spec), `term3.pdf` (v3 deep system integration), `termbest.pdf` (engineering brief / Phase 1 instructions)*

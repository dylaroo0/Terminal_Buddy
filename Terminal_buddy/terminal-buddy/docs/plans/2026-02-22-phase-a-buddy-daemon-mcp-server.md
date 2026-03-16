# Phase A: Buddy Daemon MCP Server - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Terminal Buddy Daemon as a Rust MCP server that runs as a Claude Code plugin, providing AI command translation, session recording, system monitoring, and teachable moments.

**Architecture:** A single Rust binary (`buddy-daemon`) that speaks MCP over stdio. It hooks into the user's shell via PTY interception, captures command input/output, correlates with filesystem and system log changes, records everything to Memvid (.mv2 + SQLite), and exposes tools for an AI to translate natural language into shell commands with user approval.

**Tech Stack:** Rust 1.80+, `rmcp` (official MCP Rust SDK), `tokio`, `portable-pty`, `notify`, `sysinfo`, `rusqlite`, `serde`, `zstd`, `anyhow`/`thiserror`

---

## Project Structure (Target)

```
terminal-buddy/
├── Cargo.toml                    # Workspace root
├── buddy-daemon/                 # Main MCP server binary (NEW - replaces daemon/)
│   ├── Cargo.toml
│   └── src/
│       ├── main.rs               # Entry point: MCP server over stdio
│       ├── server.rs             # MCP tool definitions (#[tool] macros)
│       ├── pty/
│       │   ├── mod.rs            # PTY manager (async, tokio)
│       │   └── capture.rs        # Command boundary detection + output capture
│       ├── correlation/
│       │   ├── mod.rs            # EventCorrelator: links command → impact
│       │   ├── filesystem.rs     # File watcher (notify crate)
│       │   └── syslog.rs         # journalctl/macOS log parser
│       ├── memory/
│       │   ├── mod.rs            # Session manager
│       │   ├── memvid.rs         # .mv2 frame writer
│       │   ├── sqlite.rs         # SQLite metadata store
│       │   └── search.rs         # Session search (text + semantic)
│       ├── monitor/
│       │   ├── mod.rs            # System health monitor
│       │   └── cleanup.rs        # Cleanup scanner
│       └── config.rs             # buddy.toml parser
├── shared/                       # Shared types
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs                # CorrelationTriple, MemvidFrame, SessionRecord, etc.
└── tests/
    └── integration/
        ├── mcp_tools_test.rs     # MCP tool integration tests
        └── pty_capture_test.rs   # PTY capture tests
```

---

## Task 1: Restructure Workspace + Dependencies

**Files:**
- Modify: `terminal-buddy/Cargo.toml`
- Create: `terminal-buddy/buddy-daemon/Cargo.toml`
- Create: `terminal-buddy/buddy-daemon/src/main.rs`
- Modify: `terminal-buddy/shared/Cargo.toml`
- Modify: `terminal-buddy/shared/src/lib.rs`

**Step 1: Update workspace Cargo.toml**

Replace the existing workspace root to point to the new crates:

```toml
[workspace]
members = ["buddy-daemon", "shared"]
resolver = "2"

[workspace.dependencies]
# MCP Server
rmcp = { version = "0.16", features = ["server", "transport-io"] }

# Async Runtime
tokio = { version = "1.40", features = ["full"] }

# PTY Management
portable-pty = "0.8"

# System Monitoring
sysinfo = "0.30"
notify = { version = "6.1", features = ["macos_fsevent"] }

# Storage
rusqlite = { version = "0.31", features = ["bundled"] }
zstd = "0.13"

# Serialization
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
bincode = "1.3"

# Schema generation (required by rmcp)
schemars = "0.8"

# Error Handling
anyhow = "1"
thiserror = "1"

# Utilities
uuid = { version = "1.0", features = ["v4"] }
chrono = { version = "0.4", features = ["serde"] }
tracing = "0.1"
tracing-subscriber = "0.3"
toml = "0.8"
dirs = "5.0"
```

**Step 2: Create buddy-daemon/Cargo.toml**

```toml
[package]
name = "buddy-daemon"
version = "0.1.0"
edition = "2021"

[[bin]]
name = "buddy-daemon"
path = "src/main.rs"

[dependencies]
shared = { path = "../shared" }
rmcp = { workspace = true }
tokio = { workspace = true }
portable-pty = { workspace = true }
sysinfo = { workspace = true }
notify = { workspace = true }
rusqlite = { workspace = true }
zstd = { workspace = true }
serde = { workspace = true }
serde_json = { workspace = true }
schemars = { workspace = true }
anyhow = { workspace = true }
thiserror = { workspace = true }
uuid = { workspace = true }
chrono = { workspace = true }
tracing = { workspace = true }
tracing-subscriber = { workspace = true }
toml = { workspace = true }
dirs = { workspace = true }
```

**Step 3: Create minimal main.rs**

```rust
use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt()
        .with_writer(std::io::stderr)
        .init();

    tracing::info!("Terminal Buddy Daemon starting...");

    // MCP server will be wired here in Task 3
    Ok(())
}
```

**Step 4: Update shared crate**

`shared/Cargo.toml`:
```toml
[package]
name = "shared"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { workspace = true }
chrono = { workspace = true }
uuid = { workspace = true }
```

`shared/src/lib.rs`:
```rust
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// A single command execution and its correlated system impact.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommandRecord {
    pub id: Uuid,
    pub session_id: Uuid,
    pub input: String,
    pub output: String,
    pub exit_code: Option<i32>,
    pub started_at: DateTime<Utc>,
    pub finished_at: DateTime<Utc>,
    pub working_dir: String,
}

/// Files changed during a command execution.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FilesystemDelta {
    pub command_id: Uuid,
    pub files_created: Vec<String>,
    pub files_modified: Vec<String>,
    pub files_deleted: Vec<String>,
}

/// System resource snapshot.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemSnapshot {
    pub timestamp: DateTime<Utc>,
    pub cpu_usage_pct: f32,
    pub memory_used_bytes: u64,
    pub memory_total_bytes: u64,
    pub disk_used_bytes: u64,
    pub disk_total_bytes: u64,
    pub process_count: usize,
}

/// A recorded terminal session.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionRecord {
    pub id: Uuid,
    pub title: Option<String>,
    pub started_at: DateTime<Utc>,
    pub ended_at: Option<DateTime<Utc>>,
    pub command_count: usize,
    pub notes: Vec<String>,
}

/// The Correlation Triple: terminal output + filesystem delta + system logs.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeachableMoment {
    pub command: CommandRecord,
    pub filesystem: FilesystemDelta,
    pub system_before: SystemSnapshot,
    pub system_after: SystemSnapshot,
    pub explanation: Option<String>,
}
```

**Step 5: Verify it compiles**

Run: `cd /home/dylaroo/projects/Terminal_buddy/terminal-buddy && cargo check`
Expected: Compiles with no errors (warnings OK)

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: restructure workspace for buddy-daemon MCP server

Replaces the old daemon/ui/shared structure with buddy-daemon as the
primary MCP server binary. Adds rmcp, notify, rusqlite, and other
Phase A dependencies. Defines core shared types: CommandRecord,
FilesystemDelta, SystemSnapshot, SessionRecord, TeachableMoment."
```

---

## Task 2: SQLite Session Storage

**Files:**
- Create: `buddy-daemon/src/memory/mod.rs`
- Create: `buddy-daemon/src/memory/sqlite.rs`

**Step 1: Write test for SQLite store**

Create `buddy-daemon/src/memory/sqlite.rs`:

```rust
use anyhow::Result;
use chrono::Utc;
use rusqlite::Connection;
use shared::{CommandRecord, FilesystemDelta, SessionRecord, SystemSnapshot};
use uuid::Uuid;

pub struct SessionStore {
    conn: Connection,
}

impl SessionStore {
    pub fn open(path: &str) -> Result<Self> {
        let conn = Connection::open(path)?;
        let store = Self { conn };
        store.init_tables()?;
        Ok(store)
    }

    pub fn open_in_memory() -> Result<Self> {
        let conn = Connection::open_in_memory()?;
        let store = Self { conn };
        store.init_tables()?;
        Ok(store)
    }

    fn init_tables(&self) -> Result<()> {
        self.conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                title TEXT,
                started_at TEXT NOT NULL,
                ended_at TEXT,
                command_count INTEGER DEFAULT 0
            );
            CREATE TABLE IF NOT EXISTS commands (
                id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                input TEXT NOT NULL,
                output TEXT NOT NULL,
                exit_code INTEGER,
                started_at TEXT NOT NULL,
                finished_at TEXT NOT NULL,
                working_dir TEXT NOT NULL,
                FOREIGN KEY (session_id) REFERENCES sessions(id)
            );
            CREATE TABLE IF NOT EXISTS filesystem_deltas (
                command_id TEXT PRIMARY KEY,
                files_created TEXT NOT NULL,
                files_modified TEXT NOT NULL,
                files_deleted TEXT NOT NULL,
                FOREIGN KEY (command_id) REFERENCES commands(id)
            );
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (session_id) REFERENCES sessions(id)
            );
            CREATE INDEX IF NOT EXISTS idx_commands_session ON commands(session_id);
            CREATE INDEX IF NOT EXISTS idx_commands_started ON commands(started_at);"
        )?;
        Ok(())
    }

    pub fn create_session(&self) -> Result<SessionRecord> {
        let session = SessionRecord {
            id: Uuid::new_v4(),
            title: None,
            started_at: Utc::now(),
            ended_at: None,
            command_count: 0,
            notes: vec![],
        };
        self.conn.execute(
            "INSERT INTO sessions (id, title, started_at) VALUES (?1, ?2, ?3)",
            (&session.id.to_string(), &session.title, &session.started_at.to_rfc3339()),
        )?;
        Ok(session)
    }

    pub fn end_session(&self, session_id: &Uuid, title: Option<&str>) -> Result<()> {
        let now = Utc::now().to_rfc3339();
        self.conn.execute(
            "UPDATE sessions SET ended_at = ?1, title = ?2 WHERE id = ?3",
            (&now, &title, &session_id.to_string()),
        )?;
        Ok(())
    }

    pub fn record_command(&self, cmd: &CommandRecord) -> Result<()> {
        self.conn.execute(
            "INSERT INTO commands (id, session_id, input, output, exit_code, started_at, finished_at, working_dir)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            (
                &cmd.id.to_string(),
                &cmd.session_id.to_string(),
                &cmd.input,
                &cmd.output,
                &cmd.exit_code,
                &cmd.started_at.to_rfc3339(),
                &cmd.finished_at.to_rfc3339(),
                &cmd.working_dir,
            ),
        )?;
        self.conn.execute(
            "UPDATE sessions SET command_count = command_count + 1 WHERE id = ?1",
            (&cmd.session_id.to_string(),),
        )?;
        Ok(())
    }

    pub fn record_filesystem_delta(&self, delta: &FilesystemDelta) -> Result<()> {
        self.conn.execute(
            "INSERT INTO filesystem_deltas (command_id, files_created, files_modified, files_deleted)
             VALUES (?1, ?2, ?3, ?4)",
            (
                &delta.command_id.to_string(),
                &serde_json::to_string(&delta.files_created)?,
                &serde_json::to_string(&delta.files_modified)?,
                &serde_json::to_string(&delta.files_deleted)?,
            ),
        )?;
        Ok(())
    }

    pub fn list_sessions(&self, limit: usize) -> Result<Vec<SessionRecord>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, title, started_at, ended_at, command_count
             FROM sessions ORDER BY started_at DESC LIMIT ?1"
        )?;
        let sessions = stmt.query_map([limit], |row| {
            let id_str: String = row.get(0)?;
            let title: Option<String> = row.get(1)?;
            let started_str: String = row.get(2)?;
            let ended_str: Option<String> = row.get(3)?;
            let count: usize = row.get(4)?;
            Ok(SessionRecord {
                id: Uuid::parse_str(&id_str).unwrap_or_default(),
                title,
                started_at: DateTime::parse_from_rfc3339(&started_str)
                    .map(|dt| dt.with_timezone(&Utc))
                    .unwrap_or_else(|_| Utc::now()),
                ended_at: ended_str.and_then(|s|
                    DateTime::parse_from_rfc3339(&s).ok().map(|dt| dt.with_timezone(&Utc))
                ),
                command_count: count,
                notes: vec![],
            })
        })?.collect::<Result<Vec<_>, _>>()?;
        Ok(sessions)
    }

    pub fn search_commands(&self, query: &str, limit: usize) -> Result<Vec<CommandRecord>> {
        let pattern = format!("%{query}%");
        let mut stmt = self.conn.prepare(
            "SELECT id, session_id, input, output, exit_code, started_at, finished_at, working_dir
             FROM commands WHERE input LIKE ?1 OR output LIKE ?1
             ORDER BY started_at DESC LIMIT ?2"
        )?;
        let cmds = stmt.query_map(rusqlite::params![&pattern, limit], |row| {
            let id_str: String = row.get(0)?;
            let sid_str: String = row.get(1)?;
            let started_str: String = row.get(5)?;
            let finished_str: String = row.get(6)?;
            Ok(CommandRecord {
                id: Uuid::parse_str(&id_str).unwrap_or_default(),
                session_id: Uuid::parse_str(&sid_str).unwrap_or_default(),
                input: row.get(2)?,
                output: row.get(3)?,
                exit_code: row.get(4)?,
                started_at: DateTime::parse_from_rfc3339(&started_str)
                    .map(|dt| dt.with_timezone(&Utc)).unwrap_or_else(|_| Utc::now()),
                finished_at: DateTime::parse_from_rfc3339(&finished_str)
                    .map(|dt| dt.with_timezone(&Utc)).unwrap_or_else(|_| Utc::now()),
                working_dir: row.get(7)?,
            })
        })?.collect::<Result<Vec<_>, _>>()?;
        Ok(cmds)
    }
}

use chrono::DateTime;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_and_list_sessions() {
        let store = SessionStore::open_in_memory().unwrap();
        let s1 = store.create_session().unwrap();
        let s2 = store.create_session().unwrap();
        store.end_session(&s1.id, Some("First session")).unwrap();

        let sessions = store.list_sessions(10).unwrap();
        assert_eq!(sessions.len(), 2);
        assert_eq!(sessions[0].id, s2.id); // most recent first
    }

    #[test]
    fn test_record_and_search_commands() {
        let store = SessionStore::open_in_memory().unwrap();
        let session = store.create_session().unwrap();
        let cmd = CommandRecord {
            id: Uuid::new_v4(),
            session_id: session.id,
            input: "docker-compose up".to_string(),
            output: "Error: port 8080 already in use".to_string(),
            exit_code: Some(1),
            started_at: Utc::now(),
            finished_at: Utc::now(),
            working_dir: "/home/user/project".to_string(),
        };
        store.record_command(&cmd).unwrap();

        let results = store.search_commands("docker", 10).unwrap();
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].input, "docker-compose up");

        // Verify session command count updated
        let sessions = store.list_sessions(10).unwrap();
        assert_eq!(sessions[0].command_count, 1);
    }

    #[test]
    fn test_record_filesystem_delta() {
        let store = SessionStore::open_in_memory().unwrap();
        let session = store.create_session().unwrap();
        let cmd_id = Uuid::new_v4();
        let cmd = CommandRecord {
            id: cmd_id,
            session_id: session.id,
            input: "touch newfile.txt".to_string(),
            output: String::new(),
            exit_code: Some(0),
            started_at: Utc::now(),
            finished_at: Utc::now(),
            working_dir: "/tmp".to_string(),
        };
        store.record_command(&cmd).unwrap();

        let delta = FilesystemDelta {
            command_id: cmd_id,
            files_created: vec!["/tmp/newfile.txt".to_string()],
            files_modified: vec![],
            files_deleted: vec![],
        };
        store.record_filesystem_delta(&delta).unwrap();
        // No panic = success
    }
}
```

Create `buddy-daemon/src/memory/mod.rs`:
```rust
pub mod sqlite;
```

**Step 2: Run tests**

Run: `cd /home/dylaroo/projects/Terminal_buddy/terminal-buddy && cargo test -p buddy-daemon`
Expected: 3 tests pass

**Step 3: Commit**

```bash
git add buddy-daemon/src/memory/
git commit -m "feat: add SQLite session storage with tests

SessionStore handles sessions, commands, filesystem deltas, and
text search. All operations tested with in-memory SQLite."
```

---

## Task 3: MCP Server with Core Tools

**Files:**
- Create: `buddy-daemon/src/server.rs`
- Modify: `buddy-daemon/src/main.rs`

**Step 1: Implement MCP server with tools**

Create `buddy-daemon/src/server.rs`:

```rust
use anyhow::Result;
use rmcp::handler::server::tool::ToolCallContext;
use rmcp::model::{CallToolResult, Content, ServerCapabilities, ServerInfo};
use rmcp::schemars::JsonSchema;
use rmcp::tool;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;

use crate::memory::sqlite::SessionStore;

/// Terminal Buddy MCP Server
pub struct BuddyServer {
    store: Arc<Mutex<SessionStore>>,
}

#[derive(Debug, Deserialize, JsonSchema)]
pub struct HistorySearchParams {
    /// Search query to find in command history
    pub query: String,
    /// Maximum number of results to return (default: 20)
    pub limit: Option<usize>,
}

#[derive(Debug, Deserialize, JsonSchema)]
pub struct SessionListParams {
    /// Maximum number of sessions to return (default: 20)
    pub limit: Option<usize>,
}

#[derive(Debug, Deserialize, JsonSchema)]
pub struct ExplainParams {
    /// The command to explain (if empty, explains the last command)
    pub command: Option<String>,
}

#[derive(Debug, Deserialize, JsonSchema)]
pub struct SystemHealthParams {}

impl BuddyServer {
    pub fn new(store: SessionStore) -> Self {
        Self {
            store: Arc::new(Mutex::new(store)),
        }
    }
}

#[tool(tool_box)]
impl BuddyServer {
    #[tool(
        name = "buddy_history",
        description = "Search Terminal Buddy's session history. Find past commands by keyword, see what you did on a specific day, or search for errors you encountered."
    )]
    async fn history(
        &self,
        #[tool(param)] params: HistorySearchParams,
    ) -> Result<CallToolResult, rmcp::Error> {
        let store = self.store.lock().await;
        let limit = params.limit.unwrap_or(20);
        let results = store.search_commands(&params.query, limit)
            .map_err(|e| rmcp::Error::internal_error(e.to_string(), None))?;

        if results.is_empty() {
            return Ok(CallToolResult::success(vec![Content::text(
                format!("No commands found matching '{}'", params.query),
            )]));
        }

        let mut output = format!("Found {} commands matching '{}':\n\n", results.len(), params.query);
        for cmd in &results {
            output.push_str(&format!(
                "  [{time}] $ {input}\n    Exit: {exit}  Dir: {dir}\n    Output: {output}\n\n",
                time = cmd.started_at.format("%Y-%m-%d %H:%M:%S"),
                input = cmd.input,
                exit = cmd.exit_code.map(|c| c.to_string()).unwrap_or("?".into()),
                dir = cmd.working_dir,
                output = cmd.output.chars().take(200).collect::<String>(),
            ));
        }
        Ok(CallToolResult::success(vec![Content::text(output)]))
    }

    #[tool(
        name = "buddy_sessions",
        description = "List recent Terminal Buddy sessions. Shows session titles, dates, and command counts."
    )]
    async fn sessions(
        &self,
        #[tool(param)] params: SessionListParams,
    ) -> Result<CallToolResult, rmcp::Error> {
        let store = self.store.lock().await;
        let limit = params.limit.unwrap_or(20);
        let sessions = store.list_sessions(limit)
            .map_err(|e| rmcp::Error::internal_error(e.to_string(), None))?;

        if sessions.is_empty() {
            return Ok(CallToolResult::success(vec![Content::text(
                "No sessions recorded yet. Start using Terminal Buddy to build history!".to_string(),
            )]));
        }

        let mut output = format!("Recent sessions ({}):\n\n", sessions.len());
        for s in &sessions {
            let title = s.title.as_deref().unwrap_or("(untitled)");
            let ended = s.ended_at.map(|t| t.format("%H:%M").to_string())
                .unwrap_or("ongoing".into());
            output.push_str(&format!(
                "  {date} {start}-{end}  [{cmds} cmds]  {title}\n",
                date = s.started_at.format("%Y-%m-%d"),
                start = s.started_at.format("%H:%M"),
                end = ended,
                cmds = s.command_count,
                title = title,
            ));
        }
        Ok(CallToolResult::success(vec![Content::text(output)]))
    }

    #[tool(
        name = "buddy_system_health",
        description = "Check current system health: CPU usage, memory, disk space, and running processes. Use this to understand how your computer is doing."
    )]
    async fn system_health(
        &self,
        #[tool(param)] _params: SystemHealthParams,
    ) -> Result<CallToolResult, rmcp::Error> {
        use sysinfo::System;

        let mut sys = System::new_all();
        sys.refresh_all();

        let cpu = sys.global_cpu_usage();
        let mem_used = sys.used_memory();
        let mem_total = sys.total_memory();
        let mem_pct = (mem_used as f64 / mem_total as f64) * 100.0;

        let disks = sysinfo::Disks::new_with_refreshed_list();
        let mut disk_info = String::new();
        for disk in disks.list() {
            let total = disk.total_space();
            let available = disk.available_space();
            let used_pct = ((total - available) as f64 / total as f64) * 100.0;
            disk_info.push_str(&format!(
                "  {mount}: {used_pct:.1}% used ({avail} GB free of {total} GB)\n",
                mount = disk.mount_point().display(),
                avail = available / 1_073_741_824,
                total = total / 1_073_741_824,
            ));
        }

        let procs = sys.processes().len();

        let output = format!(
            "System Health:\n\n\
             CPU:      {cpu:.1}%\n\
             Memory:   {mem_pct:.1}% ({mem_used} GB / {mem_total} GB)\n\
             Processes: {procs}\n\n\
             Disks:\n{disk_info}",
            mem_used = mem_used / 1_073_741_824,
            mem_total = mem_total / 1_073_741_824,
        );

        Ok(CallToolResult::success(vec![Content::text(output)]))
    }
}

#[rmcp::tool(tool_box)]
impl rmcp::handler::server::ServerHandler for BuddyServer {
    fn get_info(&self) -> ServerInfo {
        ServerInfo {
            name: "terminal-buddy".into(),
            version: "0.1.0".into(),
        }
    }
}
```

**Step 2: Wire up main.rs**

```rust
mod memory;
mod server;

use anyhow::Result;
use rmcp::ServiceExt;
use rmcp::transport::io::stdio;
use server::BuddyServer;

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt()
        .with_writer(std::io::stderr)
        .init();

    tracing::info!("Terminal Buddy Daemon starting...");

    // Determine storage path
    let data_dir = dirs::data_dir()
        .unwrap_or_else(|| std::path::PathBuf::from("."))
        .join("terminal-buddy");
    std::fs::create_dir_all(&data_dir)?;

    let db_path = data_dir.join("sessions.db");
    let store = memory::sqlite::SessionStore::open(
        db_path.to_str().unwrap_or("sessions.db")
    )?;

    let server = BuddyServer::new(store);

    tracing::info!("MCP server ready on stdio");
    let service = server.serve(stdio()).await?;
    service.waiting().await?;

    Ok(())
}
```

**Step 3: Verify it compiles**

Run: `cd /home/dylaroo/projects/Terminal_buddy/terminal-buddy && cargo check -p buddy-daemon`
Expected: Compiles (warnings OK, no errors)

NOTE: The `rmcp` API may differ slightly from what's documented. If compilation fails, check the `rmcp` docs at https://docs.rs/rmcp/latest and adjust the `#[tool]` macro usage, `ServerHandler` trait, and `serve`/`stdio` imports accordingly. The structure and intent remain the same - only the exact API surface may need tweaking.

**Step 4: Commit**

```bash
git add buddy-daemon/src/server.rs buddy-daemon/src/main.rs
git commit -m "feat: add MCP server with buddy_history, buddy_sessions, buddy_system_health tools

Three initial MCP tools exposed over stdio. Uses rmcp crate with
#[tool] macros. Stores sessions in SQLite at ~/.local/share/terminal-buddy/"
```

---

## Task 4: System Monitor (sysinfo)

**Files:**
- Create: `buddy-daemon/src/monitor/mod.rs`
- Create: `buddy-daemon/src/monitor/cleanup.rs`

**Step 1: Implement system monitor**

Create `buddy-daemon/src/monitor/mod.rs`:

```rust
pub mod cleanup;

use anyhow::Result;
use shared::SystemSnapshot;
use chrono::Utc;
use sysinfo::System;

pub struct SystemMonitor {
    sys: System,
}

impl SystemMonitor {
    pub fn new() -> Self {
        let mut sys = System::new_all();
        sys.refresh_all();
        Self { sys }
    }

    pub fn snapshot(&mut self) -> SystemSnapshot {
        self.sys.refresh_all();

        let disks = sysinfo::Disks::new_with_refreshed_list();
        let (disk_used, disk_total) = disks.list().iter().fold((0u64, 0u64), |acc, d| {
            (acc.0 + (d.total_space() - d.available_space()), acc.1 + d.total_space())
        });

        SystemSnapshot {
            timestamp: Utc::now(),
            cpu_usage_pct: self.sys.global_cpu_usage(),
            memory_used_bytes: self.sys.used_memory(),
            memory_total_bytes: self.sys.total_memory(),
            disk_used_bytes: disk_used,
            disk_total_bytes: disk_total,
            process_count: self.sys.processes().len(),
        }
    }
}
```

**Step 2: Implement cleanup scanner**

Create `buddy-daemon/src/monitor/cleanup.rs`:

```rust
use anyhow::Result;
use std::path::{Path, PathBuf};
use std::fs;

#[derive(Debug)]
pub struct CleanupSuggestion {
    pub path: PathBuf,
    pub size_bytes: u64,
    pub category: String,
    pub description: String,
}

/// Scan for cleanup opportunities. Non-destructive - only reports.
pub fn scan_cleanup(home: &Path) -> Result<Vec<CleanupSuggestion>> {
    let mut suggestions = Vec::new();

    // Check for node_modules directories
    scan_pattern(home, "node_modules", 3, &mut suggestions,
        "npm cache", "Unused node_modules directory");

    // Check common cache locations
    let cache_dirs = [
        (home.join(".cache"), "System cache"),
        (home.join(".npm/_cacache"), "npm cache"),
        (home.join(".cargo/registry/cache"), "Cargo cache"),
    ];
    for (path, desc) in &cache_dirs {
        if path.exists() {
            if let Ok(size) = dir_size(path) {
                if size > 100_000_000 { // > 100MB
                    suggestions.push(CleanupSuggestion {
                        path: path.clone(),
                        size_bytes: size,
                        category: "cache".to_string(),
                        description: format!("{desc} ({:.1} GB)", size as f64 / 1_073_741_824.0),
                    });
                }
            }
        }
    }

    // Check /tmp for old files
    if let Ok(entries) = fs::read_dir("/tmp") {
        let mut tmp_size = 0u64;
        for entry in entries.flatten() {
            if let Ok(meta) = entry.metadata() {
                tmp_size += meta.len();
            }
        }
        if tmp_size > 500_000_000 { // > 500MB
            suggestions.push(CleanupSuggestion {
                path: PathBuf::from("/tmp"),
                size_bytes: tmp_size,
                category: "temp".to_string(),
                description: format!("Temp files ({:.1} GB)", tmp_size as f64 / 1_073_741_824.0),
            });
        }
    }

    suggestions.sort_by(|a, b| b.size_bytes.cmp(&a.size_bytes));
    Ok(suggestions)
}

fn scan_pattern(base: &Path, name: &str, max_depth: usize, out: &mut Vec<CleanupSuggestion>,
    category: &str, description: &str)
{
    fn walk(dir: &Path, name: &str, depth: usize, max_depth: usize, out: &mut Vec<CleanupSuggestion>,
        category: &str, description: &str)
    {
        if depth > max_depth { return; }
        let Ok(entries) = fs::read_dir(dir) else { return };
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                if entry.file_name() == name {
                    if let Ok(size) = dir_size(&path) {
                        if size > 50_000_000 { // > 50MB
                            out.push(CleanupSuggestion {
                                path: path.clone(),
                                size_bytes: size,
                                category: category.to_string(),
                                description: format!("{description} ({:.1} MB)", size as f64 / 1_048_576.0),
                            });
                        }
                    }
                } else {
                    walk(&path, name, depth + 1, max_depth, out, category, description);
                }
            }
        }
    }
    walk(base, name, 0, max_depth, out, category, description);
}

fn dir_size(path: &Path) -> Result<u64> {
    let mut size = 0u64;
    if path.is_dir() {
        for entry in fs::read_dir(path)? {
            let entry = entry?;
            let meta = entry.metadata()?;
            if meta.is_dir() {
                size += dir_size(&entry.path()).unwrap_or(0);
            } else {
                size += meta.len();
            }
        }
    }
    Ok(size)
}
```

**Step 2: Verify it compiles**

Run: `cargo check -p buddy-daemon`
Expected: Compiles

**Step 3: Commit**

```bash
git add buddy-daemon/src/monitor/
git commit -m "feat: add system monitor and cleanup scanner

SystemMonitor captures CPU/memory/disk snapshots. Cleanup scanner
finds large node_modules, caches, and temp files. Non-destructive."
```

---

## Task 5: Filesystem Watcher (Correlation Engine v1)

**Files:**
- Create: `buddy-daemon/src/correlation/mod.rs`
- Create: `buddy-daemon/src/correlation/filesystem.rs`

**Step 1: Implement filesystem watcher**

Create `buddy-daemon/src/correlation/filesystem.rs`:

```rust
use anyhow::Result;
use notify::{Config, Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use std::path::PathBuf;
use std::sync::Arc;
use tokio::sync::Mutex;
use shared::FilesystemDelta;
use uuid::Uuid;

#[derive(Debug, Clone)]
struct FileEvent {
    path: PathBuf,
    kind: FileEventKind,
}

#[derive(Debug, Clone)]
enum FileEventKind {
    Created,
    Modified,
    Deleted,
}

pub struct FilesystemWatcher {
    events: Arc<Mutex<Vec<FileEvent>>>,
    _watcher: RecommendedWatcher,
}

impl FilesystemWatcher {
    pub fn new(watch_path: &str) -> Result<Self> {
        let events: Arc<Mutex<Vec<FileEvent>>> = Arc::new(Mutex::new(Vec::new()));
        let events_clone = events.clone();

        let mut watcher = notify::recommended_watcher(move |res: Result<Event, notify::Error>| {
            if let Ok(event) = res {
                let kind = match event.kind {
                    EventKind::Create(_) => Some(FileEventKind::Created),
                    EventKind::Modify(_) => Some(FileEventKind::Modified),
                    EventKind::Remove(_) => Some(FileEventKind::Deleted),
                    _ => None,
                };
                if let Some(kind) = kind {
                    let mut events = events_clone.blocking_lock();
                    for path in event.paths {
                        events.push(FileEvent { path, kind: kind.clone() });
                    }
                }
            }
        })?;

        watcher.watch(std::path::Path::new(watch_path), RecursiveMode::Recursive)?;

        Ok(Self {
            events,
            _watcher: watcher,
        })
    }

    /// Drain collected events since last call and return as a FilesystemDelta.
    pub async fn drain_delta(&self, command_id: Uuid) -> FilesystemDelta {
        let mut events = self.events.lock().await;
        let mut created = Vec::new();
        let mut modified = Vec::new();
        let mut deleted = Vec::new();

        for event in events.drain(..) {
            let path_str = event.path.display().to_string();
            match event.kind {
                FileEventKind::Created => created.push(path_str),
                FileEventKind::Modified => modified.push(path_str),
                FileEventKind::Deleted => deleted.push(path_str),
            }
        }

        // Deduplicate
        created.sort();
        created.dedup();
        modified.sort();
        modified.dedup();
        deleted.sort();
        deleted.dedup();

        FilesystemDelta {
            command_id,
            files_created: created,
            files_modified: modified,
            files_deleted: deleted,
        }
    }
}
```

Create `buddy-daemon/src/correlation/mod.rs`:
```rust
pub mod filesystem;
```

**Step 2: Verify it compiles**

Run: `cargo check -p buddy-daemon`
Expected: Compiles

**Step 3: Commit**

```bash
git add buddy-daemon/src/correlation/
git commit -m "feat: add filesystem watcher for correlation engine

Uses notify crate to track file creates/modifies/deletes during
command execution. Drains events into FilesystemDelta per command."
```

---

## Task 6: Config Parser (buddy.toml)

**Files:**
- Create: `buddy-daemon/src/config.rs`

**Step 1: Implement config**

```rust
use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct BuddyConfig {
    pub behavior: BehaviorConfig,
    pub ai: AiConfig,
    pub storage: StorageConfig,
    pub cleanup: CleanupConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct BehaviorConfig {
    pub copilot_personality: String,
    pub explain_level: String,
    pub session_titling: String,
    pub teachable_moments: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct AiConfig {
    pub explanation_backend: String,
    pub privacy_mode: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct StorageConfig {
    pub data_dir: String,
    pub max_storage_gb: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct CleanupConfig {
    pub auto_scan_interval: String,
    pub scan_paths: Vec<String>,
}

impl Default for BuddyConfig {
    fn default() -> Self {
        Self {
            behavior: BehaviorConfig::default(),
            ai: AiConfig::default(),
            storage: StorageConfig::default(),
            cleanup: CleanupConfig::default(),
        }
    }
}

impl Default for BehaviorConfig {
    fn default() -> Self {
        Self {
            copilot_personality: "active".into(),
            explain_level: "beginner".into(),
            session_titling: "suggest".into(),
            teachable_moments: "inline".into(),
        }
    }
}

impl Default for AiConfig {
    fn default() -> Self {
        Self {
            explanation_backend: "claude".into(),
            privacy_mode: false,
        }
    }
}

impl Default for StorageConfig {
    fn default() -> Self {
        let data_dir = dirs::data_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("terminal-buddy")
            .display()
            .to_string();
        Self {
            data_dir,
            max_storage_gb: 10,
        }
    }
}

impl Default for CleanupConfig {
    fn default() -> Self {
        Self {
            auto_scan_interval: "weekly".into(),
            scan_paths: vec!["~".into()],
        }
    }
}

impl BuddyConfig {
    pub fn load() -> Result<Self> {
        let config_dir = dirs::config_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("terminal-buddy");

        let config_path = config_dir.join("buddy.toml");
        if config_path.exists() {
            let content = std::fs::read_to_string(&config_path)?;
            Ok(toml::from_str(&content)?)
        } else {
            Ok(Self::default())
        }
    }

    pub fn data_dir(&self) -> PathBuf {
        PathBuf::from(&self.storage.data_dir)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_config() {
        let config = BuddyConfig::default();
        assert_eq!(config.behavior.explain_level, "beginner");
        assert_eq!(config.ai.explanation_backend, "claude");
        assert!(!config.ai.privacy_mode);
    }

    #[test]
    fn test_parse_toml() {
        let toml_str = r#"
[behavior]
copilot_personality = "teacher"
explain_level = "expert"

[ai]
privacy_mode = true
"#;
        let config: BuddyConfig = toml::from_str(toml_str).unwrap();
        assert_eq!(config.behavior.copilot_personality, "teacher");
        assert_eq!(config.behavior.explain_level, "expert");
        assert!(config.ai.privacy_mode);
        // Defaults still work for unspecified fields
        assert_eq!(config.ai.explanation_backend, "claude");
    }
}
```

**Step 2: Run tests**

Run: `cargo test -p buddy-daemon`
Expected: All tests pass (sqlite + config)

**Step 3: Commit**

```bash
git add buddy-daemon/src/config.rs
git commit -m "feat: add buddy.toml config parser with sensible defaults

Supports behavior, ai, storage, and cleanup config sections.
Falls back to defaults when config file is absent or partial."
```

---

## Task 7: Wire Everything Together + Claude Code Integration

**Files:**
- Modify: `buddy-daemon/src/main.rs`
- Modify: `buddy-daemon/src/server.rs` (add cleanup + config tools)

**Step 1: Add remaining MCP tools to server.rs**

Add these tools to the `#[tool(tool_box)] impl BuddyServer` block:

```rust
    #[tool(
        name = "buddy_cleanup_scan",
        description = "Scan your system for cleanup opportunities: old caches, unused node_modules, temp files. Shows what can be safely removed to free disk space."
    )]
    async fn cleanup_scan(
        &self,
        #[tool(param)] _params: SystemHealthParams, // reuse empty params
    ) -> Result<CallToolResult, rmcp::Error> {
        let home = dirs::home_dir().unwrap_or_default();
        let suggestions = crate::monitor::cleanup::scan_cleanup(&home)
            .map_err(|e| rmcp::Error::internal_error(e.to_string(), None))?;

        if suggestions.is_empty() {
            return Ok(CallToolResult::success(vec![Content::text(
                "Your system looks clean! No major cleanup opportunities found.".to_string(),
            )]));
        }

        let total_bytes: u64 = suggestions.iter().map(|s| s.size_bytes).sum();
        let mut output = format!(
            "Cleanup Opportunities ({:.1} GB total):\n\n",
            total_bytes as f64 / 1_073_741_824.0
        );

        for s in &suggestions {
            output.push_str(&format!(
                "  [{cat}] {desc}\n    Path: {path}\n\n",
                cat = s.category,
                desc = s.description,
                path = s.path.display(),
            ));
        }

        output.push_str("Note: These are suggestions only. Nothing has been deleted.");
        Ok(CallToolResult::success(vec![Content::text(output)]))
    }
```

**Step 2: Update main.rs with config loading**

Update `main.rs` to load config and pass to server:

```rust
mod config;
mod correlation;
mod memory;
mod monitor;
mod server;

use anyhow::Result;
use rmcp::ServiceExt;
use rmcp::transport::io::stdio;

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt()
        .with_writer(std::io::stderr)
        .init();

    tracing::info!("Terminal Buddy Daemon v0.1.0 starting...");

    let config = config::BuddyConfig::load()?;
    let data_dir = config.data_dir();
    std::fs::create_dir_all(&data_dir)?;

    let db_path = data_dir.join("sessions.db");
    let store = memory::sqlite::SessionStore::open(
        db_path.to_str().unwrap_or("sessions.db")
    )?;

    tracing::info!("Storage: {}", data_dir.display());

    let server = server::BuddyServer::new(store);

    tracing::info!("MCP server ready on stdio");
    let service = server.serve(stdio()).await?;
    service.waiting().await?;

    Ok(())
}
```

**Step 3: Build the binary**

Run: `cd /home/dylaroo/projects/Terminal_buddy/terminal-buddy && cargo build -p buddy-daemon`
Expected: Compiles and produces `target/debug/buddy-daemon`

**Step 4: Test the binary starts**

Run: `echo '{"jsonrpc":"2.0","method":"initialize","id":1,"params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"0.1"}}}' | timeout 3 ./target/debug/buddy-daemon 2>/dev/null || true`
Expected: Some JSON response (MCP initialization) or clean timeout

**Step 5: Register as Claude Code MCP server**

Run: `claude mcp add terminal-buddy /home/dylaroo/projects/Terminal_buddy/terminal-buddy/target/debug/buddy-daemon`

This adds Terminal Buddy as an MCP server in Claude Code. The tools `buddy_history`, `buddy_sessions`, `buddy_system_health`, and `buddy_cleanup_scan` will be available.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: Terminal Buddy MCP server ready for Claude Code

Complete Phase A MVP: 4 MCP tools (history, sessions, system_health,
cleanup_scan), SQLite session storage, config parser, filesystem
watcher, system monitor. Registered as Claude Code MCP server."
```

---

## Task 8: Integration Test

**Files:**
- Create: `terminal-buddy/tests/integration/mcp_smoke_test.rs`

**Step 1: Write a smoke test**

```rust
//! Smoke test: verify the buddy-daemon binary starts and responds to MCP initialize.

use std::process::{Command, Stdio};
use std::io::Write;

#[test]
fn test_buddy_daemon_mcp_initialize() {
    let mut child = Command::new(env!("CARGO_BIN_EXE_buddy-daemon"))
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .expect("Failed to start buddy-daemon");

    let stdin = child.stdin.as_mut().expect("Failed to open stdin");
    let init_msg = r#"{"jsonrpc":"2.0","method":"initialize","id":1,"params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"0.1"}}}"#;
    writeln!(stdin, "{init_msg}").expect("Failed to write");
    drop(child.stdin.take()); // Close stdin to signal EOF

    let output = child.wait_with_output().expect("Failed to wait");
    let stdout = String::from_utf8_lossy(&output.stdout);

    // Should contain a valid JSON-RPC response
    assert!(
        stdout.contains("\"result\"") || stdout.contains("serverInfo"),
        "Expected MCP initialize response, got: {stdout}"
    );
}
```

**Step 2: Run integration test**

Run: `cargo test -p buddy-daemon --test mcp_smoke_test`
Expected: PASS

**Step 3: Run all tests**

Run: `cargo test --workspace`
Expected: All tests pass

**Step 4: Commit**

```bash
git add tests/
git commit -m "test: add MCP smoke test for buddy-daemon initialization"
```

---

## Summary

| Task | What It Builds | Key Files |
|------|---------------|-----------|
| 1 | Workspace + dependencies + shared types | Cargo.toml, shared/src/lib.rs |
| 2 | SQLite session storage with tests | memory/sqlite.rs |
| 3 | MCP server with 3 tools (history, sessions, system_health) | server.rs, main.rs |
| 4 | System monitor + cleanup scanner | monitor/mod.rs, cleanup.rs |
| 5 | Filesystem watcher for correlation | correlation/filesystem.rs |
| 6 | buddy.toml config parser | config.rs |
| 7 | Wire everything + Claude Code registration | main.rs, server.rs |
| 8 | Integration smoke test | tests/integration/ |

**After all 8 tasks:** Terminal Buddy is a working MCP server in Claude Code with session history, system health monitoring, and cleanup scanning. The correlation engine captures filesystem changes. The foundation is ready for Phase A.2 (AI command translation, voice) and Phase B (WezTerm desktop terminal).

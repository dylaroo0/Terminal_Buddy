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

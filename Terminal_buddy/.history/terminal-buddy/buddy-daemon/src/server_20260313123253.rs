use rmcp::handler::server::tool::ToolRouter;
use rmcp::handler::server::wrapper::Parameters;
use rmcp::model::{CallToolResult, Implementation, ServerCapabilities, ServerInfo};
use rmcp::schemars::JsonSchema;
use rmcp::{tool, tool_handler, tool_router, ServerHandler};
use serde::Deserialize;
use std::path::PathBuf;
use std::sync::Arc;
use tokio::sync::Mutex;

use crate::correlation::CorrelationEngine;
use crate::llm::LlmClient;
use crate::memory::sqlite::SessionStore;
use crate::monitor::{cleanup, DeepSystemSnapshot, SystemMonitor};
use crate::pty::capture::run_command_in_pty;
use shared::CommandRecord;
use uuid::Uuid;

/// Format duration in seconds to human-readable string
fn format_duration(seconds: u64) -> String {
    let days = seconds / 86400;
    let hours = (seconds % 86400) / 3600;
    let mins = (seconds % 3600) / 60;
    let secs = seconds % 60;

    if days > 0 {
        format!("{}d {}h {}m {}s", days, hours, mins, secs)
    } else if hours > 0 {
        format!("{}h {}m {}s", hours, mins, secs)
    } else if mins > 0 {
        format!("{}m {}s", mins, secs)
    } else {
        format!("{}s", secs)
    }
}

#[derive(Debug, Deserialize, JsonSchema)]
pub struct HistorySearchParams {
    /// Search query to find in command history (optional - omit to get recent commands)
    pub query: Option<String>,
    /// Maximum number of results to return (default: 20)
    pub limit: Option<usize>,
}

#[derive(Debug, Deserialize, JsonSchema)]
pub struct SessionListParams {
    /// Maximum number of sessions to return (default: 20)
    pub limit: Option<usize>,
}

#[derive(Debug, Deserialize, JsonSchema)]
pub struct CleanupScanParams {
    /// Directory to scan for cleanup opportunities (default: home directory)
    pub path: Option<String>,
}

#[derive(Debug, Deserialize, JsonSchema)]
pub struct AskParams {
    /// Natural language request to translate into a shell command
    pub query: String,
    /// Optional context about what you're trying to achieve
    pub context: Option<String>,
}

#[derive(Debug, Deserialize, JsonSchema)]
pub struct RunParams {
    /// The shell command to execute
    pub command: String,
    /// Working directory (defaults to current)
    pub working_dir: Option<String>,
    /// Session ID to attach this run to (optional)
    pub session_id: Option<String>,
}

#[derive(Debug, Deserialize, JsonSchema)]
pub struct ExplainParams {
    /// The error message, command output, or concept to explain
    pub query: String,
    /// Optional context to help with the explanation
    pub context: Option<String>,
}

#[derive(Debug, Deserialize, JsonSchema)]
pub struct AddOutputParams {
    /// The output/content to add to the journal/session
    pub content: String,
    /// The session ID to associate with (optional)
    pub session_id: Option<String>,
}

#[derive(Debug, Deserialize, JsonSchema)]
pub struct EmptyParams {}

/// Terminal Buddy MCP Server
pub struct BuddyServer {
    store: Arc<Mutex<SessionStore>>,
    home_dir: PathBuf,
    system_monitor: Arc<Mutex<SystemMonitor>>,
    correlation_engine: Arc<CorrelationEngine>,
    llm: Option<Arc<dyn LlmClient>>,
    explain_level: String,
    tool_router: ToolRouter<Self>,
}

impl BuddyServer {
    pub fn new(
        store: SessionStore,
        system_monitor: SystemMonitor,
        correlation_engine: CorrelationEngine,
        llm: Option<Box<dyn LlmClient>>,
        explain_level: String,
    ) -> Self {
        let home_dir = dirs::home_dir().unwrap_or_else(|| PathBuf::from("."));
        Self {
            store: Arc::new(Mutex::new(store)),
            home_dir,
            system_monitor: Arc::new(Mutex::new(system_monitor)),
            correlation_engine: Arc::new(correlation_engine),
            llm: llm.map(|c| Arc::from(c)),
            explain_level,
            tool_router: Self::tool_router(),
        }
    }
}

#[tool_router]
impl BuddyServer {
    #[tool(
        name = "buddy_history",
        description = "Search Terminal Buddy's session history. Find past commands by keyword, see what you did on a specific day, or search for errors you encountered."
    )]
    async fn history(
        &self,
        Parameters(params): Parameters<HistorySearchParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        let store = self.store.lock().await;
        let limit = params.limit.unwrap_or(20);

        // If no query provided, get recent commands; otherwise search
        let results = if let Some(query) = &params.query {
            store
                .search_commands(query, limit)
                .map_err(|e| rmcp::ErrorData::internal_error(e.to_string(), None))?
        } else {
            // Get recent commands (search with empty query returns all)
            store
                .search_commands("", limit)
                .map_err(|e| rmcp::ErrorData::internal_error(e.to_string(), None))?
        };

        // Return structured JSON for UI consumption
        let json_output = serde_json::to_string(&serde_json::json!({
            "commands": results
        }))
        .unwrap_or_else(|_| r#"{"commands":[]}"#.to_string());

        Ok(CallToolResult::success(vec![rmcp::model::Content::text(
            json_output,
        )]))
    }

    #[tool(
        name = "buddy_sessions",
        description = "List recent Terminal Buddy sessions. Shows session titles, dates, and command counts."
    )]
    async fn sessions(
        &self,
        Parameters(params): Parameters<SessionListParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        let store = self.store.lock().await;
        let limit = params.limit.unwrap_or(20);
        let sessions = store
            .list_sessions(limit)
            .map_err(|e| rmcp::ErrorData::internal_error(e.to_string(), None))?;

        // Return structured JSON for UI consumption
        let json_output = serde_json::to_string(&serde_json::json!({
            "sessions": sessions
        }))
        .unwrap_or_else(|_| r#"{"sessions":[]}"#.to_string());

        Ok(CallToolResult::success(vec![rmcp::model::Content::text(
            json_output,
        )]))
    }

    #[tool(
        name = "buddy_system_health",
        description = "Check current system health: CPU usage, memory, disk space, and running processes. Use this to understand how your computer is doing."
    )]
    async fn system_health(
        &self,
        Parameters(_params): Parameters<EmptyParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        let mut monitor = self.system_monitor.lock().await;
        let snapshot = monitor.deep_snapshot();

        let mut output = format!(
            "🖥️  System Health — {}\n\n\
             ═══════════════════════════════════════\n\n\
             ⏱️  Uptime: {uptime}\n\
             🖥️  Hostname: {hostname}\n\
             🐧 Kernel: {kernel}\n\n\
             ═══════════════════════════════════════\n\n\
             📊 CPU:      {cpu:.1}%\n\n\
             📊 Memory:   {mem_pct:.1}% ({mem_used} GB / {mem_total} GB)\n\n\
             📊 Disk:     {disk_pct:.1}% ({disk_used} GB / {disk_total} GB)\n\n\
             📊 Processes: {procs} total\n",
            uptime = format_duration(snapshot.uptime_seconds),
            hostname = snapshot.hostname,
            kernel = snapshot.kernel_version,
            cpu = snapshot.cpu_usage_pct,
            mem_pct = snapshot.memory_usage_pct,
            mem_used = snapshot.memory_used_bytes / 1_073_741_824,
            mem_total = snapshot.memory_total_bytes / 1_073_741_824,
            disk_pct = snapshot.disk_usage_pct,
            disk_used = snapshot.disk_used_bytes / 1_073_741_824,
            disk_total = snapshot.disk_total_bytes / 1_073_741_824,
            procs = snapshot.process_count,
        );

        // Top CPU processes
        if !snapshot.top_cpu_processes.is_empty() {
            output.push_str("\n═══════════════════════════════════════\n");
            output.push_str("🔥 Top CPU Processes:\n\n");
            for (i, proc) in snapshot.top_cpu_processes.iter().take(5).enumerate() {
                output.push_str(&format!(
                    "  {}. {} (PID {}) — {:.1}% CPU, {:.1}% RAM\n",
                    i + 1,
                    proc.name,
                    proc.pid,
                    proc.cpu_usage,
                    proc.memory_percent
                ));
            }
        }

        // Top memory processes
        if !snapshot.top_memory_processes.is_empty() {
            output.push_str("\n═══════════════════════════════════════\n");
            output.push_str("📦 Top Memory Processes:\n\n");
            for (i, proc) in snapshot.top_memory_processes.iter().take(5).enumerate() {
                output.push_str(&format!(
                    "  {}. {} (PID {}) — {:.1}% RAM ({:.1} MB)\n",
                    i + 1,
                    proc.name,
                    proc.pid,
                    proc.memory_percent,
                    proc.memory_bytes as f64 / 1_048_576.0
                ));
            }
        }

        // Open ports
        if !snapshot.open_ports.is_empty() {
            output.push_str("\n═══════════════════════════════════════\n");
            output.push_str("🌐 Open Network Ports:\n\n");
            for port in &snapshot.open_ports {
                let owner = match (&port.pid, &port.process_name) {
                    (Some(pid), Some(name)) => format!(" → {} (PID {})", name, pid),
                    (Some(pid), None) => format!(" → PID {}", pid),
                    _ => String::new(),
                };
                output.push_str(&format!(
                    "  • {}:{} ({}) [{}]{}\n",
                    port.address, port.port, port.protocol, port.state, owner
                ));
            }
        }

        // Running services
        let running_services: Vec<_> = snapshot.running_services.iter()
            .filter(|s| s.status == "running")
            .collect();
        if !running_services.is_empty() {
            output.push_str("\n═══════════════════════════════════════\n");
            output.push_str("⚙️  Running Services:\n\n");
            for service in running_services.iter().take(10) {
                output.push_str(&format!("  • {}\n", service.name));
            }
            if running_services.len() > 10 {
                output.push_str(&format!("  ... and {} more\n", running_services.len() - 10));
            }
        }

        // Recently installed packages
        if !snapshot.recently_installed_packages.is_empty() {
            output.push_str("\n═══════════════════════════════════════\n");
            output.push_str("📦 Recently Installed Packages:\n\n");
            for pkg in &snapshot.recently_installed_packages {
                output.push_str(&format!(
                    "  • {} v{} ({})\n",
                    pkg.name, pkg.version, pkg.package_type
                ));
            }
        }

        // Boot items
        if !snapshot.boot_items.is_empty() {
            output.push_str("\n═══════════════════════════════════════\n");
            output.push_str("🚀 Boot Items (Systemd + Cron):\n\n");
            for item in snapshot.boot_items.iter().take(10) {
                output.push_str(&format!(
                    "  • [{}] {}\n",
                    item.item_type, item.name
                ));
            }
            if snapshot.boot_items.len() > 10 {
                output.push_str(&format!("  ... and {} more\n", snapshot.boot_items.len() - 10));
            }
        }

        Ok(CallToolResult::success(vec![rmcp::model::Content::text(
            output,
        )]))
    }

    #[tool(
        name = "buddy_system_health_json",
        description = "Get deep system health as structured JSON. Includes top processes, open ports, running services, installed packages, and boot items. Use this for programmatic access to system awareness data."
    )]
    async fn system_health_json(
        &self,
        Parameters(_params): Parameters<EmptyParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        let mut monitor = self.system_monitor.lock().await;
        let snapshot = monitor.deep_snapshot();

        let json_output = serde_json::to_string_pretty(&snapshot)
            .map_err(|e| rmcp::ErrorData::internal_error(e.to_string(), None))?;

        Ok(CallToolResult::success(vec![rmcp::model::Content::text(
            json_output,
        )]))
    }

    #[tool(
        name = "buddy_cleanup_scan",
        description = "Scan for disk space cleanup opportunities. Finds large node_modules, caches, and temp files that can be safely removed. Non-destructive: only reports, never deletes."
    )]
    async fn cleanup_scan(
        &self,
        Parameters(params): Parameters<CleanupScanParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        let scan_path = params
            .path
            .map(|p| {
                let expanded = if p.starts_with('~') {
                    self.home_dir.join(p.trim_start_matches("~/"))
                } else {
                    PathBuf::from(p)
                };
                expanded
            })
            .unwrap_or_else(|| self.home_dir.clone());

        let suggestions = cleanup::scan_cleanup(&scan_path)
            .map_err(|e| rmcp::ErrorData::internal_error(e.to_string(), None))?;

        if suggestions.is_empty() {
            return Ok(CallToolResult::success(vec![rmcp::model::Content::text(
                format!(
                    "No significant cleanup opportunities found in {}",
                    scan_path.display()
                ),
            )]));
        }

        let total_bytes: u64 = suggestions.iter().map(|s| s.size_bytes).sum();
        let mut output = format!(
            "Found {} cleanup opportunities ({:.1} GB total):\n\n",
            suggestions.len(),
            total_bytes as f64 / 1_073_741_824.0,
        );
        for s in &suggestions {
            output.push_str(&format!(
                "  [{cat}] {path}\n    {desc}\n\n",
                cat = s.category,
                path = s.path.display(),
                desc = s.description,
            ));
        }
        output.push_str("Note: These are suggestions only. Use rm -rf <path> to remove.");
        Ok(CallToolResult::success(vec![rmcp::model::Content::text(
            output,
        )]))
    }

    #[tool(
        name = "buddy_ask",
        description = "Translate a natural language request into a shell command."
    )]
    async fn ask(
        &self,
        Parameters(params): Parameters<AskParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        let Some(llm) = &self.llm else {
            return Ok(CallToolResult::success(vec![rmcp::model::Content::text(
                "No LLM API key configured. Set ANTHROPIC_API_KEY, GEMINI_API_KEY, or OPENROUTER_API_KEY \
                 environment variable, or add api_key to [ai] in ~/.config/terminal-buddy/buddy.toml"
                    .to_string(),
            )]));
        };

        let system = "You are a terminal command expert. Given a natural language request, \
            respond with the exact shell command to run, followed by a brief explanation. \
            Format your response as:\nCOMMAND: <the command>\nEXPLANATION: <brief explanation>";

        let user_msg = if let Some(ctx) = &params.context {
            format!("Request: {}\nContext: {}", params.query, ctx)
        } else {
            params.query.clone()
        };

        match llm.complete(system, &user_msg).await {
            Ok(response) => {
                Ok(CallToolResult::success(vec![rmcp::model::Content::text(response)]))
            }
            Err(e) => {
                tracing::error!("LLM call failed for buddy_ask: {}", e);
                Ok(CallToolResult::success(vec![rmcp::model::Content::text(
                    format!("LLM request failed: {}. Check your API key and network connection.", e),
                )]))
            }
        }
    }

    #[tool(
        name = "buddy_run",
        description = "Execute a shell command in the terminal buddy environment, capturing output and tracking history."
    )]
    async fn run_cmd(
        &self,
        Parameters(params): Parameters<RunParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        let wd = params
            .working_dir
            .unwrap_or_else(|| self.home_dir.display().to_string());

        let start_time = chrono::Utc::now();
        let cmd_output = run_command_in_pty(&params.command, &wd)
            .await
            .map_err(|e| rmcp::ErrorData::internal_error(e.to_string(), None))?;
        let end_time = chrono::Utc::now();

        let cmd_id = Uuid::new_v4();
        let session_id = params
            .session_id
            .and_then(|id| Uuid::parse_str(&id).ok())
            .unwrap_or_else(Uuid::new_v4);

        let record = CommandRecord {
            id: cmd_id,
            session_id,
            input: params.command.clone(),
            output: cmd_output.stdout.clone(),
            exit_code: Some(cmd_output.exit_code),
            started_at: start_time,
            finished_at: end_time,
            working_dir: wd.clone(),
        };

        let store = self.store.lock().await;
        // In a real scenario, we might want to attach this to an active session,
        // but for now we'll just insert the command and it will create a dummy session or use the provided one.
        store
            .record_command(&record)
            .map_err(|e| rmcp::ErrorData::internal_error(e.to_string(), None))?;
        drop(store);

        // Track filesystem impact
        let delta = self
            .correlation_engine
            .correlate_command_impact(cmd_id)
            .await;
        // Basic delay before correlating since FS events can take time. Wait, drain_delta drops events between last call and this point

        // Let's grab delta for the duration. Actually `run_command_in_pty` takes time, so events should've accumulated. We can just drain them.
        let mut result_text = format!(
            "Command executed. Exit code: {}\n\nOutput:\n{}",
            cmd_output.exit_code, cmd_output.stdout
        );

        if !delta.files_created.is_empty()
            || !delta.files_modified.is_empty()
            || !delta.files_deleted.is_empty()
        {
            result_text.push_str("\n\nFilesystem Impact:\n");
            if !delta.files_created.is_empty() {
                result_text.push_str(&format!("  Created: {} files\n", delta.files_created.len()));
            }
            if !delta.files_modified.is_empty() {
                result_text.push_str(&format!(
                    "  Modified: {} files\n",
                    delta.files_modified.len()
                ));
            }
            if !delta.files_deleted.is_empty() {
                result_text.push_str(&format!("  Deleted: {} files\n", delta.files_deleted.len()));
            }
        }
        if let Some(0) = record.exit_code {
            // success
        } else {
            result_text.push_str(
                "\n(Command failed. Use buddy_explain to ask for help diagnosing the issue.)",
            );
        }

        Ok(CallToolResult::success(vec![rmcp::model::Content::text(
            result_text,
        )]))
    }

    #[tool(
        name = "buddy_explain",
        description = "Get an AI explanation for an error message, command output, or concept."
    )]
    async fn explain(
        &self,
        Parameters(params): Parameters<ExplainParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        let Some(llm) = &self.llm else {
            let json_output = serde_json::to_string(&serde_json::json!({
                "explanation": "No LLM API key configured. Set ANTHROPIC_API_KEY, GEMINI_API_KEY, or OPENROUTER_API_KEY environment variable, or add api_key to [ai] in ~/.config/terminal-buddy/buddy.toml",
                "confidence": 0.0
            }))
            .unwrap_or_else(|_| r#"{"explanation":"No LLM configured","confidence":0.0}"#.to_string());
            return Ok(CallToolResult::success(vec![rmcp::model::Content::text(json_output)]));
        };

        let system = format!(
            "You are a friendly terminal expert helping a {} user. \
             Explain error messages, command outputs, and terminal concepts clearly and concisely. \
             When explaining errors, include what went wrong, why it happened, and how to fix it. \
             Keep responses focused and practical.",
            self.explain_level
        );

        let user_msg = if let Some(ctx) = &params.context {
            format!("Explain this:\n{}\n\nContext: {}", params.query, ctx)
        } else {
            format!("Explain this:\n{}", params.query)
        };

        match llm.complete(&system, &user_msg).await {
            Ok(response) => {
                let json_output = serde_json::to_string(&serde_json::json!({
                    "explanation": response,
                    "confidence": 1.0
                }))
                .unwrap_or_else(|_| r#"{"explanation":"Error formatting response","confidence":0.0}"#.to_string());
                Ok(CallToolResult::success(vec![rmcp::model::Content::text(json_output)]))
            }
            Err(e) => {
                tracing::error!("LLM call failed for buddy_explain: {}", e);
                let json_output = serde_json::to_string(&serde_json::json!({
                    "explanation": format!("LLM request failed: {}. Check your API key and network connection.", e),
                    "confidence": 0.0
                }))
                .unwrap_or_else(|_| r#"{"explanation":"LLM request failed","confidence":0.0}"#.to_string());
                Ok(CallToolResult::success(vec![rmcp::model::Content::text(json_output)]))
            }
        }
    }
}

#[tool_handler]
impl ServerHandler for BuddyServer {
    fn get_info(&self) -> ServerInfo {
        ServerInfo {
            protocol_version: Default::default(),
            capabilities: ServerCapabilities::builder().enable_tools().build(),
            server_info: Implementation {
                name: "terminal-buddy".into(),
                version: "0.1.0".into(),
                ..Default::default()
            },
            instructions: Some(
                "Terminal Buddy is an AI-powered terminal assistant. \
                 Use buddy_history to search past commands, buddy_sessions to list sessions, \
                 buddy_ask to translate natural language into commands, \
                 buddy_run to execute shell commands within the tracked environment, \
                 buddy_explain to get help with errors, \
                 and buddy_system_health to check your computer's status."
                    .into(),
            ),
            ..Default::default()
        }
    }
}

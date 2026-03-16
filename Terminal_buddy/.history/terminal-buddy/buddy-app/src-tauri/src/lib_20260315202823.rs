use serde_json::{json, Value};
use std::path::PathBuf;
use std::sync::Arc;
use tauri::{AppHandle, Manager, State};
use tokio::sync::Mutex;
use base64::Engine;

mod mcp_client;
use mcp_client::McpClient;

mod terminal;
use terminal::TerminalManager;

mod voice;
use voice::{VoiceState, voice_transcribe, voice_is_configured, voice_test_connection};

/// Application state containing the MCP client
pub struct AppState {
    pub mcp: Arc<Mutex<Option<McpClient>>>,
}

/// Initialize MCP client on app startup
pub async fn init_mcp_client(app_handle: &AppHandle) -> Result<(), String> {
    // Resolve daemon binary — check, in order:
    //   1. BUDDY_DAEMON_PATH env var (explicit override)
    //   2. Same directory as the running app binary
    //   3. Workspace release dir (dev mode: ../../../target/release/buddy-daemon)
    //   4. Bare name — rely on $PATH
    let daemon_path = std::env::var("BUDDY_DAEMON_PATH").ok().unwrap_or_else(|| {
        // Next to the running binary
        if let Ok(exe) = std::env::current_exe() {
            let sibling = exe.parent().unwrap_or(std::path::Path::new(".")).join("buddy-daemon");
            if sibling.exists() {
                return sibling.to_string_lossy().to_string();
            }
        }
        // Dev mode: workspace target/release
        let workspace_release =
            std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
                .join("../../target/release/buddy-daemon");
        if workspace_release.exists() {
            return workspace_release.canonicalize()
                .unwrap_or(workspace_release)
                .to_string_lossy()
                .to_string();
        }
        "buddy-daemon".to_string()
    });

    tracing::info!("Looking for buddy-daemon at: {}", daemon_path);

    // Check if daemon exists
    if !std::path::Path::new(&daemon_path).exists() {
        tracing::warn!("buddy-daemon not found at {}, using mock mode", daemon_path);
        return Ok(());
    }

    match McpClient::new(&daemon_path).await {
        Ok(client) => {
            let state = app_handle.state::<AppState>();
            let mut mcp = state.mcp.lock().await;
            *mcp = Some(client);
            tracing::info!("MCP client initialized successfully");
            Ok(())
        }
        Err(e) => {
            tracing::error!("Failed to initialize MCP client: {}", e);
            Err(format!("Failed to connect to buddy-daemon: {}", e))
        }
    }
}

/// Call MCP tool with mock fallback
async fn call_mcp_tool_safe(
    state: State<'_, AppState>,
    tool_name: &str,
    params: Value,
) -> Result<Value, String> {
    let mcp = state.mcp.lock().await;

    if let Some(client) = mcp.as_ref() {
        client
            .call_tool(tool_name, params)
            .await
            .map_err(|e| e.to_string())
    } else {
        // Mock mode - return sample data
        Ok(mock_tool_response(tool_name, params))
    }
}

/// Mock responses for when daemon is not available
fn mock_tool_response(tool_name: &str, _params: Value) -> Value {
    match tool_name {
        "buddy_sessions" => {
            json!({
                "sessions": [
                    {
                        "id": "sess-1",
                        "title": "Fix CI pipeline",
                        "started_at": "2026-02-22T09:15:00Z",
                        "ended_at": "2026-02-22T09:45:00Z",
                        "command_count": 8,
                        "notes": []
                    },
                    {
                        "id": "sess-2",
                        "title": "Deploy v2.1",
                        "started_at": "2026-02-22T12:30:00Z",
                        "ended_at": "2026-02-22T13:15:00Z",
                        "command_count": 12,
                        "notes": []
                    },
                    {
                        "id": "sess-3",
                        "title": "Debug memory leak",
                        "started_at": "2026-02-22T15:20:00Z",
                        "ended_at": null,
                        "command_count": 5,
                        "notes": ["possible event loop issue"]
                    }
                ]
            })
        }
        "buddy_history" => {
            json!({
                "commands": [
                    {
                        "id": "cmd-1",
                        "session_id": "sess-1",
                        "input": "npm install --legacy-peer-deps",
                        "output": "added 123 packages, and audited 145 packages in 2s\nfound 0 vulnerabilities",
                        "exit_code": 0,
                        "started_at": "2026-02-22T09:18:30Z",
                        "finished_at": "2026-02-22T09:20:15Z",
                        "working_dir": "/home/dylaroo/projects/my-app"
                    },
                    {
                        "id": "cmd-2",
                        "session_id": "sess-1",
                        "input": "git push origin main",
                        "output": "Counting objects: 12, Done.\nTo github.com:dylaroo/my-app.git",
                        "exit_code": 0,
                        "started_at": "2026-02-22T09:25:45Z",
                        "finished_at": "2026-02-22T09:26:30Z",
                        "working_dir": "/home/dylaroo/projects/my-app"
                    },
                    {
                        "id": "cmd-3",
                        "session_id": "sess-2",
                        "input": "cargo build --release",
                        "output": "Compiling buddy-daemon v0.1.0\nFinished release [optimized] target(s) in 42.34s",
                        "exit_code": 0,
                        "started_at": "2026-02-22T12:35:20Z",
                        "finished_at": "2026-02-22T12:42:15Z",
                        "working_dir": "/home/dylaroo/projects/Terminal_buddy/terminal-buddy"
                    }
                ]
            })
        }
        "buddy_system_health" => {
            json!({
                "cpu_usage_pct": 12.5,
                "memory_used_bytes": 48_318_382_080i64,
                "memory_total_bytes": 107_374_182_400i64,
                "disk_used_bytes": 536_870_912_000i64,
                "disk_total_bytes": 800_000_000_000i64,
                "process_count": 124,
                "timestamp": "2026-02-22T16:00:00Z"
            })
        }
        "buddy_explain" => {
            json!({
                "explanation": "This command was executed successfully. It completed without errors and made changes to your system.",
                "confidence": 0.85
            })
        }
        "buddy_run" => {
            json!({
                "id": "cmd-new",
                "input": _params.get("command").unwrap_or(&json!("")).as_str().unwrap_or(""),
                "output": "Command executed",
                "exit_code": 0,
                "started_at": chrono::Utc::now().to_rfc3339(),
                "finished_at": chrono::Utc::now().to_rfc3339(),
                "working_dir": "/home/dylaroo/projects"
            })
        }
        _ => json!({"error": "Unknown tool"}),
    }
}

// Tauri Commands

#[tauri::command]
async fn get_sessions(state: State<'_, AppState>, limit: Option<u32>) -> Result<Value, String> {
    call_mcp_tool_safe(state, "buddy_sessions", json!({ "limit": limit.unwrap_or(20) })).await
}

#[tauri::command]
async fn get_history(
    state: State<'_, AppState>,
    limit: Option<u32>,
    query: Option<String>,
) -> Result<Value, String> {
    let mut params = json!({});
    if let Some(l) = limit {
        params["limit"] = json!(l);
    }
    if let Some(q) = query {
        params["query"] = json!(q);
    }
    call_mcp_tool_safe(state, "buddy_history", params).await
}

#[tauri::command]
async fn get_system_health(state: State<'_, AppState>) -> Result<Value, String> {
    call_mcp_tool_safe(state, "buddy_system_health", json!({})).await
}

#[tauri::command]
async fn explain_command(
    state: State<'_, AppState>,
    command: String,
    output: Option<String>,
) -> Result<Value, String> {
    let mut params = json!({ "query": command });
    if let Some(o) = output {
        params["context"] = json!(o);
    }
    call_mcp_tool_safe(state, "buddy_explain", params).await
}

#[tauri::command]
async fn run_command(
    state: State<'_, AppState>,
    command: String,
    working_dir: Option<String>,
) -> Result<Value, String> {
    let mut params = json!({ "command": command });
    if let Some(dir) = working_dir {
        params["working_dir"] = json!(dir);
    }
    call_mcp_tool_safe(state, "buddy_run", params).await
}

#[tauri::command]
async fn check_daemon_status(state: State<'_, AppState>) -> Result<Value, String> {
    let mcp = state.mcp.lock().await;
    if mcp.is_some() {
        Ok(json!({ "connected": true, "mode": "live" }))
    } else {
        Ok(json!({ "connected": false, "mode": "mock" }))
    }
}

// --- Config management ---

fn config_path() -> PathBuf {
    dirs::config_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("terminal-buddy")
        .join("buddy.toml")
}

#[tauri::command]
async fn check_first_run() -> Result<Value, String> {
    let path = config_path();
    let exists = path.exists();
    Ok(json!({
        "first_run": !exists,
        "config_path": path.display().to_string()
    }))
}

#[tauri::command]
async fn load_config() -> Result<Value, String> {
    let path = config_path();
    if !path.exists() {
        return Ok(json!({
            "exists": false,
            "config": null
        }));
    }
    let content = std::fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let config: toml::Value = toml::from_str(&content).map_err(|e| e.to_string())?;
    // Convert toml::Value -> serde_json::Value
    let json_str = serde_json::to_string(&config).map_err(|e| e.to_string())?;
    let json_val: Value = serde_json::from_str(&json_str).map_err(|e| e.to_string())?;
    Ok(json!({
        "exists": true,
        "config": json_val
    }))
}

#[tauri::command]
async fn save_config(config: Value) -> Result<Value, String> {
    let path = config_path();

    // Ensure parent directory exists
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    // Convert JSON -> TOML string
    let toml_val: toml::Value =
        serde_json::from_value(config).map_err(|e| format!("Invalid config format: {}", e))?;
    let toml_str =
        toml::to_string_pretty(&toml_val).map_err(|e| format!("Failed to serialize: {}", e))?;

    std::fs::write(&path, &toml_str).map_err(|e| e.to_string())?;

    tracing::info!("Config saved to {}", path.display());
    Ok(json!({
        "success": true,
        "path": path.display().to_string()
    }))
}

#[tauri::command]
async fn test_api_key(provider: String, api_key: String) -> Result<Value, String> {
    // Quick validation: make a lightweight API call to verify the key works
    let client = reqwest::Client::new();

    let result = match provider.as_str() {
        "openrouter" => {
            let resp = client
                .get("https://openrouter.ai/api/v1/models")
                .header("Authorization", format!("Bearer {}", api_key))
                .send()
                .await
                .map_err(|e| e.to_string())?;
            resp.status().is_success()
        }
        "claude" => {
            // Anthropic: list models endpoint
            let resp = client
                .get("https://api.anthropic.com/v1/models")
                .header("x-api-key", &api_key)
                .header("anthropic-version", "2023-06-01")
                .send()
                .await
                .map_err(|e| e.to_string())?;
            resp.status().is_success()
        }
        "gemini" => {
            let url = format!(
                "https://generativelanguage.googleapis.com/v1beta/models?key={}",
                api_key
            );
            let resp = client.get(&url).send().await.map_err(|e| e.to_string())?;
            resp.status().is_success()
        }
        _ => return Err(format!("Unknown provider: {}", provider)),
    };

    Ok(json!({
        "valid": result,
        "provider": provider
    }))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize logging
    tracing_subscriber::fmt::init();
    
    // Load .env file for development
    let _ = dotenvy::dotenv();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .manage(AppState {
            mcp: Arc::new(Mutex::new(None)),
        })
        .manage(TerminalManager::new())
        .manage(VoiceState {
            api_key: std::env::var("GROQ_API_KEY").unwrap_or_default(),
        })
        .invoke_handler(tauri::generate_handler![
            get_sessions,
            get_history,
            get_system_health,
            explain_command,
            run_command,
            check_daemon_status,
            check_first_run,
            load_config,
            save_config,
            test_api_key,
            terminal::terminal_spawn,
            terminal::terminal_write,
            terminal::terminal_kill,
            terminal::terminal_resize,
            voice_transcribe,
            voice_is_configured,
            voice_test_connection,
        ])
        .setup(|app| {
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                let _ = init_mcp_client(&app_handle).await;
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

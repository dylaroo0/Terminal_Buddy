mod config;
mod correlation;
mod llm;
mod memory;
mod monitor;
mod pty;
mod server;

use std::path::PathBuf;

use anyhow::Result;
use rmcp::transport::io::stdio;
use rmcp::ServiceExt;

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt()
        .with_writer(std::io::stderr)
        .init();

    tracing::info!("Terminal Buddy Daemon v0.1.0 starting...");

    // Load config (uses defaults if no buddy.toml exists)
    let cfg = config::BuddyConfig::load()?;
    let data_dir = cfg.data_dir();
    std::fs::create_dir_all(&data_dir)?;

    let db_path = data_dir.join("sessions.db");
    let store = memory::sqlite::SessionStore::open(db_path.to_str().unwrap_or("sessions.db"))?;

    tracing::info!("Storage: {}", data_dir.display());

    let monitor = monitor::SystemMonitor::new();
    let correlation = correlation::CorrelationEngine::new(&data_dir.display().to_string())
        .unwrap_or_else(|_| {
            tracing::warn!(
                "Failed to initialize Correlation Engine for {}",
                data_dir.display()
            );
            // Fallback to watching something safe or current dir if needed, but erroring is okay given error is wrapped in unwrap_or_else.
            // Actually let's just create a new one pointing to current dir or return error.
            // In a real app we'd watch the project dir, here we'll just watch home dir
            let home = dirs::home_dir().unwrap_or_else(|| PathBuf::from("."));
            correlation::CorrelationEngine::new(&home.display().to_string())
                .expect("Failed to initialize Correlation Engine fallback")
        });

    // Initialize LLM client (None if no API key configured - graceful degradation)
    let llm_client = llm::create_client(&cfg.ai).unwrap_or_else(|e| {
        tracing::error!("Failed to create LLM client: {}", e);
        None
    });
    if llm_client.is_some() {
        tracing::info!("LLM provider: {}", cfg.ai.provider);
    }

    let server = server::BuddyServer::new(
        store,
        monitor,
        correlation,
        llm_client,
        cfg.behavior.explain_level.clone(),
    );

    tracing::info!("MCP server ready on stdio");
    let service = server.serve(stdio()).await?;
    service.waiting().await?;

    Ok(())
}

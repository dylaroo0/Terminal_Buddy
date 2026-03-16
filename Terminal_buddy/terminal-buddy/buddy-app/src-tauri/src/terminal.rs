//! Terminal PTY management for Tauri app
//!
//! This module provides Tauri commands for spawning and managing
//! PTY shell sessions with full duplex I/O.

use anyhow::Result;
use portable_pty::{CommandBuilder, NativePtySystem, PtySize, PtySystem};
use std::collections::HashMap;
use std::io::{Read, Write};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use tauri::{Emitter, State};
use uuid::Uuid;

/// Active terminal session with full duplex I/O
pub struct TerminalSession {
    pub id: String,
    pub shell: String,
    pub cwd: String,
    writer: Arc<Mutex<Box<dyn Write + Send>>>,
    pub running: Arc<AtomicBool>,
}

impl TerminalSession {
    /// Spawn a new shell session with reader thread
    pub fn spawn(app: tauri::AppHandle, shell: &str, cwd: &str) -> Result<Self> {
        let pty_system = NativePtySystem::default();

        // Build command
        let mut cmd = CommandBuilder::new(shell);
        cmd.cwd(std::path::PathBuf::from(cwd));

        // Set environment
        cmd.env("TERM", "xterm-256color");
        cmd.env("COLORTERM", "truecolor");

        // Spawn PTY
        let pair = pty_system
            .openpty(PtySize {
                rows: 24,
                cols: 80,
                pixel_width: 0,
                pixel_height: 0,
            })
            .map_err(|e| anyhow::anyhow!("Failed to open PTY: {}", e))?;

        let _child = pair
            .slave
            .spawn_command(cmd)
            .map_err(|e| anyhow::anyhow!("Failed to spawn shell: {}", e))?;

        let writer = pair
            .master
            .take_writer()
            .map_err(|e| anyhow::anyhow!("Failed to get writer: {}", e))?;

        let mut reader = pair
            .master
            .try_clone_reader()
            .map_err(|e| anyhow::anyhow!("Failed to get reader: {}", e))?;

        let session_id = Uuid::new_v4().to_string();
        let running = Arc::new(AtomicBool::new(true));
        let running_clone = running.clone();
        let session_id_clone = session_id.clone();
        let app_clone = app.clone();

        // Spawn reader thread - reads PTY output and emits events
        std::thread::spawn(move || {
            let mut buf = [0u8; 4096];
            while running_clone.load(Ordering::Relaxed) {
                match reader.read(&mut buf) {
                    Ok(0) => break, // EOF
                    Ok(n) => {
                        let output = String::from_utf8_lossy(&buf[..n]).to_string();
                        // Emit event to React
                        let _ = app_clone.emit(
                            "terminal-output",
                            TerminalOutput {
                                session_id: session_id_clone.clone(),
                                data: output,
                            },
                        );
                    }
                    Err(_) => break,
                }
            }
        });

        Ok(Self {
            id: session_id,
            shell: shell.to_string(),
            cwd: cwd.to_string(),
            writer: Arc::new(Mutex::new(writer)),
            running,
        })
    }

    /// Write input to PTY
    pub fn write(&self, input: &[u8]) -> Result<()> {
        let mut writer = self
            .writer
            .lock()
            .map_err(|_| anyhow::anyhow!("Lock poisoned"))?;
        writer
            .write_all(input)
            .map_err(|e| anyhow::anyhow!("Write failed: {}", e))?;
        writer
            .flush()
            .map_err(|e| anyhow::anyhow!("Flush failed: {}", e))?;
        Ok(())
    }
}

/// Terminal output event payload
#[derive(Clone, serde::Serialize)]
pub struct TerminalOutput {
    pub session_id: String,
    pub data: String,
}

/// Terminal session manager
pub struct TerminalManager {
    sessions: Arc<Mutex<HashMap<String, Arc<TerminalSession>>>>,
}

impl TerminalManager {
    pub fn new() -> Self {
        Self {
            sessions: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    /// Spawn a new terminal session
    pub fn spawn(&self, app: tauri::AppHandle, shell: &str, cwd: &str) -> Result<String> {
        let session = Arc::new(TerminalSession::spawn(app, shell, cwd)?);
        let id = session.id.clone();

        self.sessions
            .lock()
            .map_err(|_| anyhow::anyhow!("Lock poisoned"))?
            .insert(id.clone(), session);

        Ok(id)
    }

    /// Write to session
    pub fn write(&self, session_id: &str, input: &[u8]) -> Result<()> {
        let sessions = self
            .sessions
            .lock()
            .map_err(|_| anyhow::anyhow!("Lock poisoned"))?;

        let session = sessions
            .get(session_id)
            .ok_or_else(|| anyhow::anyhow!("Session not found"))?;

        session.write(input)
    }

    /// Kill session
    pub fn kill(&self, session_id: &str) -> Result<()> {
        let mut sessions = self
            .sessions
            .lock()
            .map_err(|_| anyhow::anyhow!("Lock poisoned"))?;

        if let Some(session) = sessions.get(session_id) {
            session.running.store(false, Ordering::Relaxed);
        }
        sessions.remove(session_id);
        Ok(())
    }
}

impl Default for TerminalManager {
    fn default() -> Self {
        Self::new()
    }
}

// Tauri Commands

#[tauri::command]
pub fn terminal_spawn(
    app: tauri::AppHandle,
    manager: State<TerminalManager>,
    shell: String,
    cwd: String,
) -> Result<String, String> {
    manager.spawn(app, &shell, &cwd).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn terminal_write(
    manager: State<TerminalManager>,
    session_id: String,
    input: String,
) -> Result<(), String> {
    manager
        .write(&session_id, input.as_bytes())
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn terminal_kill(manager: State<TerminalManager>, session_id: String) -> Result<(), String> {
    manager.kill(&session_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn terminal_resize(
    _manager: State<TerminalManager>,
    _session_id: String,
    _cols: u16,
    _rows: u16,
) -> Result<(), String> {
    // TODO: Implement resize
    // For now, just acknowledge
    Ok(())
}

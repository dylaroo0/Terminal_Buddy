//! Terminal PTY Session Manager
//!
//! Handles spawning and managing PTY shell sessions with proper
//! input/output handling, resize support, and signal handling.

use anyhow::{Context, Result};
use portable_pty::{CommandBuilder, NativePtySystem, PtySize, PtySystem};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use uuid::Uuid;

/// Active terminal session
pub struct TerminalSession {
    pub id: String,
    pub shell: String,
    pub cwd: String,
    writer: Box<dyn portable_pty::Writer + Send>,
    pub reader_handle: std::thread::JoinHandle<()>,
    pub running: Arc<std::sync::atomic::AtomicBool>,
    pub child: Box<dyn portable_pty::Child + Send>,
}

impl TerminalSession {
    /// Spawn a new shell session
    pub fn spawn(shell: &str, cwd: &str) -> Result<Self> {
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
            .context("Failed to open PTY")?;

        let child = pair
            .slave
            .spawn_command(cmd)
            .context("Failed to spawn shell")?;

        let writer = pair.master.take_writer().context("Failed to get writer")?;
        let reader = pair
            .master
            .try_clone_reader()
            .context("Failed to get reader")?;

        let session_id = Uuid::new_v4().to_string();
        let running = Arc::new(std::sync::atomic::AtomicBool::new(true));
        let running_clone = running.clone();

        // Spawn reader thread
        let reader_handle = std::thread::spawn(move || {
            let mut buf = [0u8; 4096];
            while running_clone.load(std::sync::atomic::Ordering::Relaxed) {
                match reader.read_exact(&mut buf) {
                    Ok(_) => {
                        // Data available - handled by MCP read endpoint
                        break;
                    }
                    Err(_) => break,
                }
            }
        });

        Ok(Self {
            id: session_id,
            shell: shell.to_string(),
            cwd: cwd.to_string(),
            writer,
            reader_handle,
            running,
            child,
        })
    }

    /// Write input to PTY
    pub fn write(&mut self, input: &[u8]) -> Result<()> {
        use std::io::Write;
        self.writer.write_all(input)?;
        self.writer.flush()?;
        Ok(())
    }

    /// Resize PTY
    pub fn resize(&mut self, cols: u16, rows: u16) -> Result<()> {
        self.child.set_size(PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        })?;
        Ok(())
    }

    /// Kill session
    pub fn kill(&mut self) {
        self.running
            .store(false, std::sync::atomic::Ordering::Relaxed);
        let _ = self.child.kill();
    }
}

/// Terminal session manager
#[derive(Default)]
pub struct TerminalManager {
    sessions: Arc<Mutex<HashMap<String, TerminalSession>>>,
}

impl TerminalManager {
    pub fn new() -> Self {
        Self {
            sessions: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    /// Spawn a new terminal session
    pub fn spawn(&self, shell: &str, cwd: &str) -> Result<String> {
        let session = TerminalSession::spawn(shell, cwd)?;
        let id = session.id.clone();

        self.sessions
            .lock()
            .map_err(|_| anyhow::anyhow!("Lock poisoned"))?
            .insert(id.clone(), session);

        Ok(id)
    }

    /// Get mutable reference to session
    pub fn get_mut(&self, session_id: &str) -> Option<std::sync::MutexGuard<'_, TerminalSession>> {
        // This is tricky with Mutex<HashMap> - need to restructure
        None
    }

    /// Write to session
    pub fn write(&self, session_id: &str, input: &[u8]) -> Result<()> {
        let mut sessions = self
            .sessions
            .lock()
            .map_err(|_| anyhow::anyhow!("Lock poisoned"))?;

        let session = sessions
            .get_mut(session_id)
            .ok_or_else(|| anyhow::anyhow!("Session not found"))?;

        session.write(input)
    }

    /// Kill session
    pub fn kill(&self, session_id: &str) -> Result<()> {
        let mut sessions = self
            .sessions
            .lock()
            .map_err(|_| anyhow::anyhow!("Lock poisoned"))?;

        if let Some(session) = sessions.get_mut(session_id) {
            session.kill();
            sessions.remove(session_id);
        }

        Ok(())
    }

    /// List all sessions
    pub fn list(&self) -> Vec<String> {
        self.sessions
            .lock()
            .map(|s| s.keys().cloned().collect())
            .unwrap_or_default()
    }
}

// Global terminal manager (lazy static)
use std::sync::OnceLock;

static TERMINAL_MANAGER: OnceLock<TerminalManager> = OnceLock::new();

pub fn get_terminal_manager() -> &'static TerminalManager {
    TERMINAL_MANAGER.get_or_init(TerminalManager::new)
}

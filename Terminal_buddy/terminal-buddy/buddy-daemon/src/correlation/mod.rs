pub mod filesystem;

use shared::FilesystemDelta;
use std::sync::Arc;
use tokio::sync::Mutex;
use uuid::Uuid;

pub struct CorrelationEngine {
    fs_watcher: Arc<Mutex<filesystem::FilesystemWatcher>>,
}

impl CorrelationEngine {
    pub fn new(watch_path: &str) -> anyhow::Result<Self> {
        let watcher = filesystem::FilesystemWatcher::new(watch_path)?;
        Ok(Self {
            fs_watcher: Arc::new(Mutex::new(watcher)),
        })
    }

    pub async fn correlate_command_impact(&self, command_id: Uuid) -> FilesystemDelta {
        let watcher = self.fs_watcher.lock().await;
        watcher.drain_delta(command_id).await
    }
}

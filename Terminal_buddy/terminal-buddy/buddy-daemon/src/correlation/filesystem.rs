use anyhow::Result;
use notify::{Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use shared::FilesystemDelta;
use std::path::PathBuf;
use std::sync::Arc;
use tokio::sync::Mutex;
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
                        events.push(FileEvent {
                            path,
                            kind: kind.clone(),
                        });
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

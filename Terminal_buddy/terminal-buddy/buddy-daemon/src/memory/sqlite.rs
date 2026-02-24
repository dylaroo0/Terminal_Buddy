use anyhow::Result;
use chrono::{DateTime, Utc};
use rusqlite::Connection;
use shared::{CommandRecord, FilesystemDelta, SessionRecord};
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
            CREATE INDEX IF NOT EXISTS idx_commands_started ON commands(started_at);",
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
            (
                &session.id.to_string(),
                &session.title,
                &session.started_at.to_rfc3339(),
            ),
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
             FROM sessions ORDER BY started_at DESC LIMIT ?1",
        )?;
        let sessions = stmt
            .query_map([limit], |row| {
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
                    ended_at: ended_str.and_then(|s| {
                        DateTime::parse_from_rfc3339(&s)
                            .ok()
                            .map(|dt| dt.with_timezone(&Utc))
                    }),
                    command_count: count,
                    notes: vec![],
                })
            })?
            .collect::<Result<Vec<_>, _>>()?;
        Ok(sessions)
    }

    pub fn search_commands(&self, query: &str, limit: usize) -> Result<Vec<CommandRecord>> {
        let pattern = format!("%{query}%");
        let mut stmt = self.conn.prepare(
            "SELECT id, session_id, input, output, exit_code, started_at, finished_at, working_dir
             FROM commands WHERE input LIKE ?1 OR output LIKE ?1
             ORDER BY started_at DESC LIMIT ?2",
        )?;
        let cmds = stmt
            .query_map(rusqlite::params![&pattern, limit], |row| {
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
                        .map(|dt| dt.with_timezone(&Utc))
                        .unwrap_or_else(|_| Utc::now()),
                    finished_at: DateTime::parse_from_rfc3339(&finished_str)
                        .map(|dt| dt.with_timezone(&Utc))
                        .unwrap_or_else(|_| Utc::now()),
                    working_dir: row.get(7)?,
                })
            })?
            .collect::<Result<Vec<_>, _>>()?;
        Ok(cmds)
    }
}

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

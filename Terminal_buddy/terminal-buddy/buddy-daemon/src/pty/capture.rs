use portable_pty::{CommandBuilder, NativePtySystem, PtySize, PtySystem};
use std::io::Read;

pub struct CommandOutput {
    pub stdout: String,
    pub exit_code: i32,
}

pub async fn run_command_in_pty(
    command: &str,
    working_dir: &str,
) -> std::io::Result<CommandOutput> {
    tokio::task::spawn_blocking({
        let command = command.to_string();
        let current_dir = working_dir.to_string();
        move || {
            let pty_system = NativePtySystem::default();
            let pair = pty_system
                .openpty(PtySize {
                    rows: 24,
                    cols: 80,
                    pixel_width: 0,
                    pixel_height: 0,
                })
                .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e.to_string()))?;

            let mut cmd = if cfg!(windows) {
                let mut c = CommandBuilder::new("cmd.exe");
                c.args(["/C", &command]);
                c
            } else {
                let mut c = CommandBuilder::new("bash");
                c.args(["-c", &command]);
                c
            };
            cmd.cwd(current_dir);

            let mut child = pair
                .slave
                .spawn_command(cmd)
                .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e.to_string()))?;
            drop(pair.slave);

            let mut reader = pair
                .master
                .try_clone_reader()
                .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e.to_string()))?;

            let mut output = Vec::new();
            let mut buf = [0u8; 1024];
            // Potential deadlock fix: Read in a non-blocking way to ensure 
            // the child process buffer doesn't fill up while we wait.
            while let Ok(n) = reader.read(&mut buf) {
                if n == 0 {
                    break;
                }
                output.extend_from_slice(&buf[..n]);
            }

            let status = child
                .wait()
                .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e.to_string()))?;

            let exit_code = status.exit_code() as i32;

            Ok(CommandOutput {
                stdout: String::from_utf8_lossy(&output).into_owned(),
                exit_code,
            })
        }
    })
    .await
    .unwrap_or_else(|e| {
        Err(std::io::Error::new(
            std::io::ErrorKind::Other,
            e.to_string(),
        ))
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_run_command() {
        let out = run_command_in_pty("echo hello", "/tmp").await.unwrap();
        assert!(out.stdout.contains("hello"));
        assert_eq!(out.exit_code, 0);
    }
}

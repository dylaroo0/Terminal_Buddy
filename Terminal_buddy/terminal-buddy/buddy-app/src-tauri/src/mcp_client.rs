use anyhow::{Context, Result};
use serde_json::{json, Value};
use std::process::Stdio;
use std::sync::Arc;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::process::{Child, ChildStdin, ChildStdout, Command};
use tokio::sync::Mutex;
use tracing::{debug, error, info};

/// MCP Client that communicates with buddy-daemon via stdio.
///
/// Stdin and stdout are held separately to allow independent locking.
/// This avoids deadlocking when reading a response while also needing
/// to write (Tokio's Mutex is not re-entrant, so double-locking stdin+stdout
/// inside a single daemon.lock() would block forever on a second request).
pub struct McpClient {
    stdin: Arc<Mutex<ChildStdin>>,
    stdout: Arc<Mutex<BufReader<ChildStdout>>>,
    /// Keep the child alive for the duration of the client.
    _child: Arc<Mutex<Child>>,
    request_id: Arc<Mutex<u64>>,
}

impl McpClient {
    /// Spawn buddy-daemon and perform the MCP initialize handshake.
    pub async fn new(daemon_path: &str) -> Result<Self> {
        info!("Spawning buddy-daemon: {}", daemon_path);

        let mut child = Command::new(daemon_path)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::inherit()) // pass daemon stderr to app stderr for debugging
            .spawn()
            .context("Failed to spawn buddy-daemon")?;

        let stdin = child.stdin.take().context("Failed to capture daemon stdin")?;
        let stdout = child.stdout.take().context("Failed to capture daemon stdout")?;

        let client = Self {
            stdin: Arc::new(Mutex::new(stdin)),
            stdout: Arc::new(Mutex::new(BufReader::new(stdout))),
            _child: Arc::new(Mutex::new(child)),
            request_id: Arc::new(Mutex::new(1)),
        };

        client.initialize().await?;

        Ok(client)
    }

    /// Send the MCP initialize request and consume the response.
    async fn initialize(&self) -> Result<()> {
        let init_request = json!({
            "jsonrpc": "2.0",
            "id": 0,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {
                    "name": "terminal-buddy-ui",
                    "version": "0.1.0"
                }
            }
        });

        let _response = self.send_request(&init_request.to_string()).await?;

        // Send initialized notification (required by MCP spec)
        self.send_notification("notifications/initialized", json!({})).await?;

        info!("MCP connection initialized");
        Ok(())
    }

    /// Send a JSON-RPC notification (no response expected).
    async fn send_notification(&self, method: &str, params: Value) -> Result<()> {
        let notification = json!({
            "jsonrpc": "2.0",
            "method": method,
            "params": params
        });

        let mut stdin = self.stdin.lock().await;
        stdin.write_all(notification.to_string().as_bytes()).await?;
        stdin.write_all(b"\n").await?;
        stdin.flush().await?;
        debug!("Sent notification: {}", method);
        Ok(())
    }

    /// Write a JSON-RPC request line to stdin and read one response line from stdout.
    async fn send_request(&self, request: &str) -> Result<String> {
        // Write (lock stdin only)
        {
            let mut stdin = self.stdin.lock().await;
            stdin.write_all(request.as_bytes()).await?;
            stdin.write_all(b"\n").await?;
            stdin.flush().await?;
            debug!("Sent: {}", request);
        }

        // Read (lock stdout only — separate from stdin lock above)
        let mut stdout = self.stdout.lock().await;
        let mut response = String::new();
        stdout.read_line(&mut response).await?;

        debug!("Recv: {}", response.trim());
        Ok(response)
    }

    /// Call a named MCP tool and return the `result` field of the JSON-RPC response.
    pub async fn call_tool(&self, tool_name: &str, params: Value) -> Result<Value> {
        let id = {
            let mut counter = self.request_id.lock().await;
            let id = *counter;
            *counter += 1;
            id
        };

        let request = json!({
            "jsonrpc": "2.0",
            "id": id,
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": params
            }
        });

        let response_str = self.send_request(&request.to_string()).await?;
        let response: Value = serde_json::from_str(&response_str)
            .with_context(|| format!("Invalid JSON from daemon: {}", response_str.trim()))?;

        if let Some(error) = response.get("error") {
            error!("MCP tool error ({}): {:?}", tool_name, error);
            anyhow::bail!("Tool '{}' failed: {:?}", tool_name, error);
        }

        // MCP spec wraps result in content[].text for text responses.
        // Attempt to parse the inner JSON if that's what we get.
        if let Some(result) = response.get("result") {
            // Check for MCP content array wrapping
            if let Some(content) = result.get("content") {
                if let Some(first) = content.get(0) {
                    if let Some(text) = first.get("text").and_then(|t| t.as_str()) {
                        if let Ok(parsed) = serde_json::from_str::<Value>(text) {
                            return Ok(parsed);
                        }
                    }
                }
            }
            return Ok(result.clone());
        }

        anyhow::bail!("No 'result' in MCP response for tool '{}'", tool_name)
    }

    /// List available tools (for debugging / health check).
    pub async fn list_tools(&self) -> Result<Value> {
        let id = {
            let mut counter = self.request_id.lock().await;
            let id = *counter;
            *counter += 1;
            id
        };

        let request = json!({
            "jsonrpc": "2.0",
            "id": id,
            "method": "tools/list",
            "params": {}
        });

        let response_str = self.send_request(&request.to_string()).await?;
        let response: Value = serde_json::from_str(&response_str)?;

        response
            .get("result")
            .cloned()
            .ok_or_else(|| anyhow::anyhow!("No result for tools/list"))
    }
}

// Tauri MCP Client - communicates with buddy-daemon via Tauri commands
import { invoke } from "@tauri-apps/api/core";

// Types based on Technical Reference
export interface CommandRecord {
  id: string;
  session_id: string;
  input: string;
  output: string;
  exit_code: number | null;
  started_at: string;
  finished_at: string;
  working_dir: string;
}

export interface SessionRecord {
  id: string;
  title: string | null;
  started_at: string;
  ended_at: string | null;
  command_count: number;
  notes: string[];
}

export interface SystemHealth {
  cpu_usage_pct: number;
  memory_used_bytes: number;
  memory_total_bytes: number;
  disk_used_bytes: number;
  disk_total_bytes: number;
  process_count: number;
  timestamp: string;
}

export interface Explanation {
  explanation: string;
  confidence: number;
}

/**
 * Get all sessions from buddy-daemon
 */
export async function getSessions(limit = 20): Promise<SessionRecord[]> {
  try {
    const result = await invoke<any>("get_sessions", { limit });
    return result.sessions || [];
  } catch (error) {
    console.error("Failed to get sessions:", error);
    return [];
  }
}

/**
 * Get command history from buddy-daemon
 */
export async function getHistory(
  limit?: number,
  query?: string
): Promise<CommandRecord[]> {
  try {
    const result = await invoke<any>("get_history", { limit, query });
    return result.commands || [];
  } catch (error) {
    console.error("Failed to get history:", error);
    return [];
  }
}

/**
 * Get system health from buddy-daemon
 */
export async function getSystemHealth(): Promise<SystemHealth | null> {
  try {
    const result = await invoke<any>("get_system_health");
    return result;
  } catch (error) {
    console.error("Failed to get system health:", error);
    return null;
  }
}

/**
 * Get explanation for a command.
 * Sends the command string and its output to buddy_explain via Tauri IPC.
 */
export async function explainCommand(
  command: string,
  output?: string
): Promise<Explanation | null> {
  try {
    const result = await invoke<any>("explain_command", { command, output });
    return result;
  } catch (error) {
    console.error("Failed to explain command:", error);
    return null;
  }
}

/**
 * Run a command via buddy-daemon
 */
export async function runCommand(
  command: string,
  workingDir?: string
): Promise<CommandRecord | null> {
  try {
    const result = await invoke<any>("run_command", { command, workingDir });
    return result;
  } catch (error) {
    console.error("Failed to run command:", error);
    return null;
  }
}

/**
 * Check if daemon is connected
 */
export async function checkDaemonStatus(): Promise<{
  connected: boolean;
  mode: "live" | "mock";
}> {
  try {
    const result = await invoke<any>("check_daemon_status");
    return result;
  } catch (error) {
    console.error("Failed to check daemon status:", error);
    return { connected: false, mode: "mock" };
  }
}

// --- Config management ---

export interface BuddyConfig {
  behavior?: {
    copilot_personality?: string;
    explain_level?: string;
    session_titling?: string;
    teachable_moments?: string;
  };
  ai?: {
    provider?: string;
    model?: string;
    api_key?: string;
    privacy_mode?: boolean;
  };
  storage?: {
    data_dir?: string;
    max_storage_gb?: number;
  };
  cleanup?: {
    auto_scan_interval?: string;
    scan_paths?: string[];
  };
}

/**
 * Check if this is the user's first run (no buddy.toml exists)
 */
export async function checkFirstRun(): Promise<{
  first_run: boolean;
  config_path: string;
}> {
  try {
    return await invoke<any>("check_first_run");
  } catch (error) {
    console.error("Failed to check first run:", error);
    return { first_run: true, config_path: "" };
  }
}

/**
 * Load the current config from buddy.toml
 */
export async function loadConfig(): Promise<{
  exists: boolean;
  config: BuddyConfig | null;
}> {
  try {
    return await invoke<any>("load_config");
  } catch (error) {
    console.error("Failed to load config:", error);
    return { exists: false, config: null };
  }
}

/**
 * Save config to buddy.toml
 */
export async function saveConfig(
  config: BuddyConfig
): Promise<{ success: boolean; path: string }> {
  try {
    return await invoke<any>("save_config", { config });
  } catch (error) {
    console.error("Failed to save config:", error);
    return { success: false, path: "" };
  }
}

/**
 * Test if an API key is valid by making a lightweight API call
 */
export async function testApiKey(
  provider: string,
  apiKey: string
): Promise<{ valid: boolean; provider: string }> {
  try {
    return await invoke<any>("test_api_key", { provider, apiKey });
  } catch (error) {
    console.error("Failed to test API key:", error);
    return { valid: false, provider };
  }
}

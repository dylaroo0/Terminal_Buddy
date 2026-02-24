// MCP (Model Context Protocol) communication utilities
// Based on Technical Reference: 7 tools exposed by buddy-daemon
// Note: Production calls go through tauri-mcp.ts (Tauri IPC). This file provides mock fallback.

export class MCPClient {
  constructor() {
    // Production uses Tauri IPC (tauri-mcp.ts). This class provides mock data for dev/testing.
  }

  // Simulate MCP tool calls for demo purposes
  // In real implementation, this would use Tauri's IPC or stdio communication

  async callTool<T>(toolName: string, params: Record<string, any> = {}): Promise<T> {
    // In production, this would communicate with the buddy-daemon via Tauri IPC
    // For now, return mock data based on tool name
    console.log(`Calling MCP tool: ${toolName} with params:`, params);

    // Mock responses based on Technical Reference
    switch (toolName) {
      case 'buddy_history':
        return this.mockHistory(params) as unknown as T;
      case 'buddy_sessions':
        return this.mockSessions(params) as unknown as T;
      case 'buddy_system_health':
        return this.mockSystemHealth() as unknown as T;
      case 'buddy_run':
        return this.mockRunCommand(params) as unknown as T;
      case 'buddy_explain':
        return this.mockExplain(params) as unknown as T;
      default:
        throw new Error(`Unknown MCP tool: ${toolName}`);
    }
  }

  private mockHistory(params: Record<string, any>) {
    const query = params.query || '';
    const limit = params.limit || 10;

    // Mock command history search
    const commands = [
      { id: 'cmd-1', input: 'npm install --legacy-peer-deps', exit_code: 0, started_at: '2026-02-22T09:18:30Z' },
      { id: 'cmd-2', input: 'git push origin main', exit_code: 0, started_at: '2026-02-22T09:25:45Z' },
      { id: 'cmd-3', input: 'cargo build --release', exit_code: 0, started_at: '2026-02-22T12:35:20Z' },
      { id: 'cmd-4', input: 'docker-compose up', exit_code: 1, started_at: '2026-02-22T14:20:15Z' },
    ];

    if (query) {
      return commands.filter(cmd =>
        cmd.input.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);
    }

    return commands.slice(0, limit);
  }

  private mockSessions(params: Record<string, any>) {
    const limit = params.limit || 5;

    return [
      { id: 'sess-1', title: 'Fix CI pipeline', started_at: '2026-02-22T09:15:00Z', ended_at: '2026-02-22T09:45:00Z', command_count: 8 },
      { id: 'sess-2', title: 'Deploy v2.1', started_at: '2026-02-22T12:30:00Z', ended_at: '2026-02-22T13:15:00Z', command_count: 12 },
      { id: 'sess-3', title: 'Debug memory leak', started_at: '2026-02-22T15:20:00Z', ended_at: null, command_count: 5 },
    ].slice(0, limit);
  }

  private mockSystemHealth() {
    return {
      cpu_usage_pct: 12,
      memory_used_bytes: 45 * 1024 * 1024 * 1024, // 45GB
      memory_total_bytes: 100 * 1024 * 1024 * 1024, // 100GB
      disk_used_bytes: 67 * 1024 * 1024 * 1024 * 1024, // 67TB
      disk_total_bytes: 100 * 1024 * 1024 * 1024 * 1024, // 100TB
      process_count: 124,
      timestamp: new Date().toISOString(),
    };
  }

  private mockRunCommand(params: Record<string, any>) {
    const command = params.command || 'echo "Hello World"';

    return {
      id: `cmd-${Date.now()}`,
      input: command,
      output: `Running: ${command}\nOutput: Command executed successfully`,
      exit_code: 0,
      started_at: new Date().toISOString(),
      finished_at: new Date(Date.now() + 1200).toISOString(),
      working_dir: '/home/dylaroo/projects/my-app',
    };
  }

  private mockExplain(params: Record<string, any>) {
    const query = params.query || '';

    return {
      explanation: `This command ${query} is used to perform system operations. It modifies the filesystem and may affect system performance. For more details, consult the documentation.`,
      confidence: 0.85,
    };
  }

  // Real implementation would use Tauri IPC
  // async callTauriTool(toolName: string, params: Record<string, any>): Promise<any> {
  //   return await invoke('call_mcp_tool', { toolName, params });
  // }
}

// Singleton instance
export const mcpClient = new MCPClient();
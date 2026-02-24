import { useState, useEffect } from 'react';

// Mock implementation - replace with actual Tauri IPC calls when ready
export function useMCP() {
  const [isConnected, setIsConnected] = useState(false);
  const [activeServer, setActiveServer] = useState<string | null>(null);

  // In a real implementation, this would connect to the MCP server
  useEffect(() => {
    // Simulate connection check
    const timer = setTimeout(() => {
      setIsConnected(true);
      setActiveServer('pencil');
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const callPencilTool = async <T>(tool: string, params?: Record<string, unknown>): Promise<T> => {
    // In real implementation, this would call:
    // return await invoke('mcp_call_tool', { server: 'pencil', tool, params });
    
    console.log(`Calling Pencil tool: ${tool}`, params);
    
    // Mock responses for workshop development
    if (tool === 'list_templates') {
      return {
        templates: [
          { id: 'minimal-focus', name: 'Minimal Focus', preview: '<div class="template-preview">Minimal template</div>' },
          { id: 'power-user', name: 'Power User', preview: '<div class="template-preview">Power user template</div>' },
          { id: 'dark-oled', name: 'Dark OLED', preview: '<div class="template-preview">OLED-optimized template</div>' },
        ]
      } as unknown as T;
    }
    
    if (tool === 'update_style_guide') {
      return {
        preview_html: `<div class="workshop-preview" style="background-color: #0F172A; color: #F1F5F9; padding: 20px;">
          <h3 style="margin-bottom: 16px;">Your Custom Terminal UI</h3>
          <div style="font-family: 'Atkinson Hyperlegible', sans-serif; font-size: ${params?.font_size_ui || 16}px;">
            $ npm install
            <br/>
            <span style="color: #22C55E;">✓ Command executed successfully</span>
          </div>
          <div style="margin-top: 16px; display: flex; gap: 8px;">
            <button style="background: #3B82F6; color: white; border: none; padding: 4px 8px; border-radius: 4px;">Explain</button>
            <button style="background: #1E293B; color: #94A3B8; border: 1px solid #334155; padding: 4px 8px; border-radius: 4px;">Re-run</button>
            <button style="background: #1E293B; color: #94A3B8; border: 1px solid #334155; padding: 4px 8px; border-radius: 4px;">Note</button>
          </div>
        </div>`
      } as unknown as T;
    }
    
    if (tool === 'export_template') {
      return {
        success: true,
        template_id: `template_${Date.now()}`,
        download_url: '#'
      } as unknown as T;
    }

    return {} as T;
  };

  return {
    isConnected,
    activeServer,
    callPencilTool,
    
    // Convenience wrappers
    listTemplates: () => callPencilTool('list_templates'),
    updateStyleGuide: (changes: any) => callPencilTool('update_style_guide', { changes }),
    generateComponent: (type: string, config: any) => 
      callPencilTool('generate_component', { type, config }),
    exportTemplate: (name: string) => 
      callPencilTool('export_template', { name, format: 'buddy-json' }),
  };
}
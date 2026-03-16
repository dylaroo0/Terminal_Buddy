// src/components/WhiteportAnalystMessage.tsx
import { AgentVoiceButton } from './AgentVoiceButton';

export function WhiteportAnalystMessage() {
  const message = "Hello! I'm Mary, your Whiteport Business Analyst. I can help you create product briefs, trigger maps, and facilitate collaborative workshops using the Whiteport method. Would you like to start with a product brief discovery session?";

  return (
    <div style={{
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: '#1E293B',
      margin: '16px 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px', marginRight: '8px' }}>📊</span>
        <strong>Mary (Whiteport Analyst)</strong>
      </div>
      <p style={{ color: '#F1F5F9', marginBottom: '12px' }}>{message}</p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <AgentVoiceButton 
          text={message}
          agentId="whiteport-analyst"
          label="Hear Mary"
        />
        <button style={{
          padding: '6px 12px',
          borderRadius: '20px',
          border: 'none',
          backgroundColor: '#64748B',
          color: '#F1F5F9',
          cursor: 'pointer'
        }}>
          📝 Copy
        </button>
      </div>
    </div>
  );
}
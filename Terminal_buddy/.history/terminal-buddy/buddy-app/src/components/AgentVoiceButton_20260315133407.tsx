// src/components/AgentVoiceButton.tsx
import { useState, useEffect } from 'react';

interface AgentVoiceButtonProps {
  text: string;
  agentId: string;
  voiceName?: string;
  label?: string;
}

// Agent voice profiles
const AGENT_VOICES: Record<string, string> = {
  'whiteport-analyst': 'Google UK English Female',
  'terminal-buddy': 'Google US English Male',
  'creator-corner': 'Google US English Female',
  'memvid-assistant': 'Google UK English Male',
  'default': 'Google US English'
};

export function AgentVoiceButton({ text, agentId, voiceName, label = 'Listen' }: AgentVoiceButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Get voice based on agent ID
  const effectiveVoiceName = voiceName || AGENT_VOICES[agentId] || AGENT_VOICES.default;

  // Load voices on mount
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => v.name.includes(effectiveVoiceName)) || voices[0];
      setVoice(selectedVoice || null);
    };

    loadVoices();
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [effectiveVoiceName]);

  const toggleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <button
      onClick={toggleSpeak}
      className={`agent-voice-button ${speaking ? 'speaking' : 'idle'}`}
      title={`${speaking ? 'Stop' : 'Hear'} ${agentId} speak`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '20px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        backgroundColor: speaking ? '#EF4444' : '#3B82F6',
        color: '#FFFFFF',
        boxShadow: speaking ? '0 0 0 3px rgba(239, 68, 68, 0.3)' : '0 0 0 3px transparent',
      }}
    >
      {speaking ? (
        <>
          <span>🔇</span>
          <span>Stop</span>
        </>
      ) : (
        <>
          <span>🔊</span>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

// Export for easy use
export default AgentVoiceButton;
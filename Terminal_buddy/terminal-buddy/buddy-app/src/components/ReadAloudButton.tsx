// src/components/ReadAloudButton.tsx
import { useState, useEffect } from 'react';

interface ReadAloudButtonProps {
  text: string;
  voiceName?: string;
  label?: string;
}

export function ReadAloudButton({ text, voiceName = 'Google US English', label = 'Listen' }: ReadAloudButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Load voices on mount
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => v.name.includes(voiceName)) || voices[0];
      setVoice(selectedVoice || null);
    };

    loadVoices();
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [voiceName]);

  const toggleSpeak = () => {
    if (speaking) {
      // Stop current speech
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      // Stop any current speech first (prevent overlap)
      window.speechSynthesis.cancel();
      
      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = 1.0; // Normal speed
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
      className={`read-aloud-button ${speaking ? 'speaking' : 'idle'}`}
      title={speaking ? 'Stop reading' : 'Read aloud'}
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

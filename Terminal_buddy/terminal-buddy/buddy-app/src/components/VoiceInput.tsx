/**
 * Simple Voice Input Component
 * 
 * Usage: Place next to any input field
 * - Click mic → speaks → text appears in connected input
 * 
 * Props:
 * - onTranscription: Callback with transcribed text
 * - placeholder: Input placeholder (optional)
 */

import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceTranscribe } from '../hooks/useVoiceTranscribe';
import './VoiceInput.css';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscription,
  // placeholder = 'Click mic and speak...',
  disabled = false,
}) => {
  const {
    isRecording,
    transcription,
    error,
    startRecording,
    isConfigured,
  } = useVoiceTranscribe();

  const [isListening, setIsListening] = useState(false);

  const handleToggle = async () => {
    if (isListening) {
      // Stop listening - transcription will come via useEffect
      setIsListening(false);
    } else {
      // Start listening
      if (!isConfigured) {
        alert('Voice not configured! Check GROQ_API_KEY in .env');
        return;
      }
      
      setIsListening(true);
      try {
        await startRecording(30000); // 30 second max
      } catch (err) {
        console.error('Failed to start recording:', err);
        setIsListening(false);
      }
    }
  };

  // When transcription completes, send to parent and reset
  React.useEffect(() => {
    if (transcription && !isRecording) {
      onTranscription(transcription);
      setIsListening(false);
    }
  }, [transcription, isRecording, onTranscription]);

  return (
    <div className="voice-input-container">
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`voice-input-btn ${isListening ? 'listening' : ''} ${!isConfigured ? 'disabled' : ''}`}
        title={isListening ? 'Stop recording' : 'Click to speak'}
        aria-label="Voice input"
      >
        {isListening ? (
          <Mic size={16} className="mic-pulse" />
        ) : (
          <Mic size={16} />
        )}
      </button>
      
      {error && (
        <div className="voice-input-error" title={error}>
          <MicOff size={14} />
        </div>
      )}
    </div>
  );
};

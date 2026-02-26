/**
 * Voice Widget - Push-to-Talk Voice Command Interface
 *
 * Features:
 * - Mic button in title bar
 * - Push-to-talk (hold Space) or click-to-toggle
 * - Live transcription bubble near cursor
 * - Visual feedback (pulse when listening)
 * - Privacy mode toggle
 * - Groq API backend for transcription
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, X, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useVoiceTranscribe } from '../hooks/useVoiceTranscribe';
import { useVoiceTerminal } from '../contexts/VoiceTerminalContext';
import './VoiceWidget.css';

export interface VoiceTranscription {
  id: string;
  text: string;
  timestamp: string;
  status: 'listening' | 'processing' | 'ready' | 'error' | 'executing';
  confidence?: number;
  errorMessage?: string;
}

interface VoiceWidgetProps {
  /** Show widget (default: true) */
  visible?: boolean;

  /** Privacy mode - disables mic */
  privacyMode?: boolean;

  /** Callback when voice command is confirmed */
  onCommandConfirm?: (command: string) => void;

  /** Callback when widget state changes */
  onStateChange?: (state: 'idle' | 'listening' | 'processing') => void;

  /** Execute command in terminal (optional) */
  executeInTerminal?: (command: string) => void;
}

export const VoiceWidget: React.FC<VoiceWidgetProps> = ({
  visible = true,
  privacyMode = false,
  onCommandConfirm,
  onStateChange,
}) => {
  // Use the voice transcription hook
  const {
    // isRecording,
    // error,
    // isLoading,
    transcription: hookTranscription,
    isConfigured,
    startRecording,
    stopRecording,
    // clearTranscription,
    checkConfiguration,
  } = useVoiceTranscribe();
  
  // Use terminal context for execution
  const { executeCommand } = useVoiceTerminal();
  
  // Widget state
  const [isListening, setIsListening] = useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState(privacyMode);
  const [transcriptions, setTranscriptions] = useState<VoiceTranscription[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({ x: 0, y: 0 });
  const [listeningStartTime, setListeningStartTime] = useState<number | null>(null);
  const [displayTranscription, setDisplayTranscription] = useState('');

  const widgetRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Check configuration on mount
  useEffect(() => {
    if (visible) {
      checkConfiguration().then((configured) => {
        console.log('[VoiceWidget] Voice configured:', configured);
      });
    }
  }, [visible, checkConfiguration]);

  // Start listening using the hook
  const startListening = useCallback(async () => {
    if (isPrivacyMode) {
      console.log('[VoiceWidget] Privacy mode enabled, not starting');
      return;
    }
    if (!isConfigured) {
      console.warn('[VoiceWidget] Voice not configured - no API key');
      alert('Voice not configured! Please check your Groq API key in .env file');
      return;
    }

    console.log('[VoiceWidget] Starting listening...');
    setIsListening(true);
    setListeningStartTime(Date.now());
    setDisplayTranscription(''); // Clear previous transcription
    onStateChange?.('listening');

    // Get current mouse position for bubble
    const handleMouseMove = (e: MouseEvent) => {
      setBubblePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Start recording with the hook
    try {
      await startRecording(60000); // 60 second max for toggle mode
      console.log('[VoiceWidget] startRecording called successfully');
    } catch (error) {
      console.error('[VoiceWidget] startRecording failed:', error);
      alert('Failed to start recording: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPrivacyMode, isConfigured, onStateChange, startRecording]);

  // Stop listening
  const stopListening = useCallback(() => {
    stopRecording();
    setIsListening(false);
    onStateChange?.('processing');
    setListeningStartTime(null);
  }, [stopRecording, onStateChange]);

  // Handle transcription complete from hook
  useEffect(() => {
    if (hookTranscription && !isListening) {
      setDisplayTranscription(hookTranscription);
      // Save to history
      if (hookTranscription.trim()) {
        const newTranscription: VoiceTranscription = {
          id: `voice-${Date.now()}`,
          text: hookTranscription,
          timestamp: new Date().toISOString(),
          status: 'ready',
          confidence: 0.9,
        };
        setTranscriptions(prev => [newTranscription, ...prev]);
      }
    }
  }, [hookTranscription, isListening]);

  // Toggle listening (click mode)
  const toggleListening = useCallback(() => {
    console.log('[VoiceWidget] Toggle called, isListening:', isListening);
    if (isListening) {
      console.log('[VoiceWidget] Stopping listening (toggle)');
      stopListening();
    } else {
      console.log('[VoiceWidget] Starting listening (toggle)');
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Handle keyboard shortcut (V key to toggle voice)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // V key toggles voice (like push-to-talk but toggle mode)
      if (e.key === 'v' && e.ctrlKey && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        console.log('[VoiceWidget] Ctrl+V pressed, toggling voice...');
        toggleListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleListening]);

  // Confirm and execute command
  const handleConfirm = (transcriptionItem: VoiceTranscription) => {
    transcriptionItem.status = 'executing';
    setTranscriptions(prev => 
      prev.map(t => t.id === transcriptionItem.id ? transcriptionItem : t)
    );
    
    onCommandConfirm?.(transcriptionItem.text);
    
    // Simulate execution complete
    setTimeout(() => {
      transcriptionItem.status = 'ready';
      setTranscriptions(prev => 
        prev.map(t => t.id === transcriptionItem.id ? transcriptionItem : t)
      );
    }, 2000);
  };

  // Delete transcription from history
  const handleDelete = (id: string) => {
    setTranscriptions(prev => prev.filter(t => t.id !== id));
  };

  // Retry transcription (re-listen)
  const handleRetry = () => {
    setDisplayTranscription('');
    startListening();
  };

  // Toggle privacy mode
  const togglePrivacyMode = () => {
    setIsPrivacyMode(!isPrivacyMode);
    if (isListening) {
      stopListening();
    }
  };

  if (!visible) return null;

  return (
    <div className="voice-widget-container" ref={widgetRef}>
      {/* Mic Button - Always visible */}
      <div className="voice-mic-button-wrapper">
        <button
          onClick={toggleListening}
          disabled={isPrivacyMode}
          className={`voice-mic-button ${isListening ? 'listening' : ''} ${isPrivacyMode ? 'disabled' : ''}`}
          title={isPrivacyMode ? 'Voice disabled (Privacy Mode)' : isListening ? 'Stop listening (or press Ctrl+V)' : 'Start voice command (Click or Ctrl+V)'}
          aria-label={isPrivacyMode ? 'Voice disabled' : isListening ? 'Stop listening' : 'Start voice command'}
        >
          {isPrivacyMode ? (
            <MicOff size={20} />
          ) : isListening ? (
            <Mic size={20} className="mic-pulse" />
          ) : (
            <Mic size={20} />
          )}
        </button>
        
        {/* Privacy mode toggle */}
        <button
          onClick={togglePrivacyMode}
          className="voice-privacy-toggle"
          title={isPrivacyMode ? 'Enable voice input' : 'Disable voice input (Privacy Mode)'}
          aria-label="Toggle privacy mode"
        >
          {isPrivacyMode ? '🔒' : '🔓'}
        </button>
        
        {/* History button */}
        {transcriptions.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="voice-history-toggle"
            title={`Show voice history (${transcriptions.length} commands)`}
            aria-label="Show voice history"
          >
            📋
            {transcriptions.length > 0 && (
              <span className="voice-history-badge">{transcriptions.length}</span>
            )}
          </button>
        )}
      </div>

      {/* Live Transcription Bubble - Appears when listening */}
      {isListening && (
        <div 
          className="voice-transcription-bubble" 
          ref={bubbleRef}
          style={{
            left: bubblePosition.x + 20,
            top: bubblePosition.y - 60,
          }}
        >
          <div className="voice-bubble-header">
            <div className="voice-bubble-status">
              <div className="voice-listening-indicator"></div>
              <span>Listening...</span>
            </div>
            <button
              onClick={stopListening}
              className="voice-bubble-close"
              aria-label="Stop listening"
            >
              <X size={14} />
            </button>
          </div>
          
          <div className="voice-bubble-content">
            {displayTranscription ? (
              <p className="voice-transcription-text">{displayTranscription}</p>
            ) : (
              <p className="voice-placeholder">Speak now...</p>
            )}
          </div>
          
          <div className="voice-bubble-footer">
            <span className="voice-bubble-hint">
              {listeningStartTime 
                ? `Listening for ${Math.floor((Date.now() - listeningStartTime) / 1000)}s`
                : ''}
            </span>
            <div className="voice-bubble-actions">
              <button
                onClick={handleRetry}
                className="voice-action-btn"
                title="Retry"
                aria-label="Retry voice command"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => {
                  stopListening();
                  if (displayTranscription.trim()) {
                    // Execute in terminal via context
                    const command = displayTranscription.trim();
                    executeCommand(command);
                    
                    // Save to history
                    const newItem: VoiceTranscription = {
                      id: `voice-${Date.now()}`,
                      text: command,
                      timestamp: new Date().toISOString(),
                      status: 'executing',
                      confidence: 0.9,
                    };
                    setTranscriptions(prev => [newItem, ...prev]);
                    
                    // Clear display
                    setDisplayTranscription('');
                  }
                }}
                className="voice-action-btn voice-action-confirm"
                title="Confirm and execute command"
                aria-label="Confirm and execute command"
              >
                <Check size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice History Panel */}
      {showHistory && (
        <div className="voice-history-panel">
          <div className="voice-history-header">
            <h3>Voice Commands</h3>
            <div className="voice-history-actions">
              <button
                onClick={() => setTranscriptions([])}
                className="voice-history-clear"
                disabled={transcriptions.length === 0}
              >
                Clear All
              </button>
              <button
                onClick={() => setShowHistory(false)}
                className="voice-history-close"
                aria-label="Close history"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          <div className="voice-history-list">
            {transcriptions.length === 0 ? (
              <div className="voice-history-empty">
                <Mic size={48} className="voice-empty-icon" />
                <p>No voice commands yet</p>
                <p className="voice-empty-hint">Hold Space and speak to add a command</p>
              </div>
            ) : (
              transcriptions.map((item) => (
                <div key={item.id} className={`voice-history-item status-${item.status}`}>
                  <div className="voice-item-header">
                    <div className="voice-item-status">
                      {item.status === 'executing' && <span className="status-executing">⏳</span>}
                      {item.status === 'ready' && (
                        <span className="status-ready" title={`Confidence: ${(item.confidence! * 100).toFixed(0)}%`}>
                          ✓
                        </span>
                      )}
                      {item.status === 'error' && <AlertCircle size={16} className="status-error" />}
                    </div>
                    <span className="voice-item-time">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="voice-item-text">{item.text}</p>
                  
                  <div className="voice-item-actions">
                    <button
                      onClick={() => handleConfirm(item)}
                      disabled={item.status === 'executing'}
                      className="voice-item-btn"
                      title="Execute command"
                    >
                      ▶️ Run
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="voice-item-btn voice-item-btn-danger"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Privacy Mode Banner */}
      {isPrivacyMode && (
        <div className="voice-privacy-banner">
          <MicOff size={16} />
          <span>Voice input disabled (Privacy Mode)</span>
          <button onClick={togglePrivacyMode}>Enable</button>
        </div>
      )}
    </div>
  );
};

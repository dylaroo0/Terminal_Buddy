/**
 * Hook for voice transcription using Groq API
 * 
 * Usage:
 * ```tsx
 * const { startRecording, isRecording, transcription, error } = useVoiceTranscribe();
 * ```
 */

import { useState, useCallback, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';

export function useVoiceTranscribe() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  /**
   * Check if voice is configured on mount
   */
  const checkConfiguration = useCallback(async () => {
    try {
      const configured = await invoke<boolean>('voice_is_configured');
      setIsConfigured(configured);
      return configured;
    } catch (err) {
      console.error('Failed to check voice configuration:', err);
      setIsConfigured(false);
      return false;
    }
  }, []);

  /**
   * Start recording from microphone
   * Uses browser MediaRecorder API
   * 
   * @param maxDurationMs - Maximum recording duration in ms (default: 30000)
   * @returns Stop function for manual control
   */
  const startRecording = useCallback(async (maxDurationMs: number = 30000) => {
    try {
      setError(null);
      console.log('[useVoiceTranscribe] Starting recording, maxDuration:', maxDurationMs, 'ms');

      // Request mic permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        }
      });
      console.log('[useVoiceTranscribe] Got microphone stream');

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        console.log('[useVoiceTranscribe] Data available, size:', e.data.size);
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onerror = (e) => {
        console.error('[useVoiceTranscribe] MediaRecorder error:', e.error);
        setError('Recording error: ' + (e.error?.message || 'Unknown error'));
      };

      mediaRecorder.onstop = async () => {
        console.log('[useVoiceTranscribe] MediaRecorder stopped, processing...');
        console.log('[useVoiceTranscribe] Chunks collected:', chunksRef.current.length);
        
        setIsLoading(true);
        setError(null);

        try {
          // Convert blob to base64
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          console.log('[useVoiceTranscribe] Audio blob size:', blob.size, 'bytes');

          if (blob.size === 0) {
            setError('No audio recorded');
            setIsLoading(false);
            return;
          }

          const arrayBuffer = await blob.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);

          // Convert to base64
          let binary = '';
          uint8Array.forEach((byte) => {
            binary += String.fromCharCode(byte);
          });
          const base64Audio = btoa(binary);
          console.log('[useVoiceTranscribe] Base64 length:', base64Audio.length);

          // Call Tauri command
          console.log('[useVoiceTranscribe] Calling voice_transcribe...');
          const result = await invoke<string>(
            'voice_transcribe',
            { audioData: base64Audio }
          );

          console.log('[useVoiceTranscribe] Transcription result:', result);

          setTranscription(result);
          setIsLoading(false);
        } catch (err) {
          console.error('[useVoiceTranscribe] Error:', err);
          const errorMessage = err instanceof Error ? err.message : 'Transcription failed';
          setError(errorMessage);
          setIsLoading(false);
        }
      };

      // Start recording - collect data every 250ms for better streaming
      mediaRecorder.start(250);
      console.log('[useVoiceTranscribe] MediaRecorder started, state:', mediaRecorder.state);
      setIsRecording(true);

      // Auto-stop after max duration
      setTimeout(() => {
        console.log('[useVoiceTranscribe] Auto-stopping recording');
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, maxDurationMs);

      // Return stop function
      return () => {
        console.log('[useVoiceTranscribe] Stop function called');
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (err) {
      console.error('[useVoiceTranscribe] Failed to start recording:', err);
      const errorMessage = err instanceof Error 
        ? `Mic error: ${err.message}` 
        : 'Could not access microphone';
      setError(errorMessage);
      setIsRecording(false);
      return () => {};
    }
  }, []);

  /**
   * Stop recording manually
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  /**
   * Clear transcription result and errors
   */
  const clearTranscription = useCallback(() => {
    setTranscription(null);
    setError(null);
    setIsLoading(false);
  }, []);

  /**
   * Test Groq API connection
   */
  const testConnection = useCallback(async () => {
    try {
      const result = await invoke<string>('voice_test_connection');
      return { success: true, message: result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection test failed';
      return { success: false, message: errorMessage };
    }
  }, []);

  return {
    isRecording,
    transcription,
    error,
    isLoading,
    isConfigured,
    startRecording,
    stopRecording,
    clearTranscription,
    checkConfiguration,
    testConnection,
  };
}

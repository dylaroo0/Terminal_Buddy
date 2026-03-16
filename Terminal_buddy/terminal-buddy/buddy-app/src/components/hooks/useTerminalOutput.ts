import { useEffect, useRef, useCallback } from 'react';

export function useTerminalOutput(
  onOutput?: (output: string) => void
) {
  const outputBufferRef = useRef<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const captureOutput = useCallback((data: string) => {
    if (!onOutput) return;

    outputBufferRef.current += data;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const buffer = outputBufferRef.current.trim();
      if (buffer) {
        onOutput(buffer);
        outputBufferRef.current = '';
      }
    }, 100);
  }, [onOutput]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return captureOutput;
}
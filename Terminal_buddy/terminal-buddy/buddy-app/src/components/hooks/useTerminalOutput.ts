import { useEffect, useRef } from 'react';

// Terminal is passed as RefObject; no need to import type here for build
// (TypeScript will infer from usage in TerminalV2.tsx)

export function useTerminalOutput(
  terminal: React.RefObject<any>, // relaxed typing for now
  onOutput?: (output: string) => void
) {
  const outputBufferRef = useRef<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!terminal.current || !onOutput) return;

    const parser = terminal.current.registerParser({
      hook: (data: string) => {
        outputBufferRef.current += data;

        // Debounce output capture (100ms) to avoid flooding daemon
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
      },
      priority: 1,
    });

    return () => {
      parser.dispose();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [terminal, onOutput]);
}
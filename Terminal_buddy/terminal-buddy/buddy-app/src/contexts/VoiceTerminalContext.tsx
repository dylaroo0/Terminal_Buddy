/**
 * Context for sharing terminal execution between VoiceWidget and TerminalPane
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface VoiceTerminalContextType {
  executeCommand: (command: string) => void;
  isExecuting: boolean;
  lastCommand: string | null;
}

const VoiceTerminalContext = createContext<VoiceTerminalContextType | undefined>(undefined);

export function VoiceTerminalProvider({ children }: { children: ReactNode }) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  const executeCommand = useCallback((command: string) => {
    console.log('[VoiceTerminal] Execute command:', command);
    setLastCommand(command);
    setIsExecuting(true);
    
    // Command will be picked up by TerminalPane via context
    // TerminalPane will execute and reset isExecuting
  }, []);

  return (
    <VoiceTerminalContext.Provider value={{ executeCommand, isExecuting, lastCommand }}>
      {children}
    </VoiceTerminalContext.Provider>
  );
}

export function useVoiceTerminal() {
  const context = useContext(VoiceTerminalContext);
  if (context === undefined) {
    throw new Error('useVoiceTerminal must be used within VoiceTerminalProvider');
  }
  return context;
}

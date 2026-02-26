import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { invoke } from '@tauri-apps/api/core';
import { X } from 'lucide-react';
// TODO: Re-import for voice execution
// import { useVoiceTerminal } from '../contexts/VoiceTerminalContext';

import 'xterm/css/xterm.css';

interface TerminalPaneProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TerminalPane: React.FC<TerminalPaneProps> = ({ isOpen, onClose }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const workingDir = '~';
  
  // TODO: Use voice terminal context when TerminalPane has PTY session
  // const { isExecuting: voiceExecuting, lastCommand } = useVoiceTerminal();
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    if (!isOpen || !terminalRef.current || xtermRef.current) return;

    // Initialize xterm.js
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'JetBrains Mono, monospace',
      theme: {
        background: '#0F172A',
        foreground: '#F1F5F9',
        cursor: '#22C55E',
        cursorAccent: '#0F172A',
        selectionBackground: 'rgba(59, 130, 246, 0.3)',
        black: '#1E293B',
        red: '#EF4444',
        green: '#22C55E',
        yellow: '#F59E0B',
        blue: '#3B82F6',
        magenta: '#8B5CF6',
        cyan: '#06B6D4',
        white: '#F1F5F9',
        brightBlack: '#475569',
        brightRed: '#F87171',
        brightGreen: '#4ADE80',
        brightYellow: '#FBBF24',
        brightBlue: '#60A5FA',
        brightMagenta: '#A78BFA',
        brightCyan: '#22D3EE',
        brightWhite: '#FFFFFF',
      },
      scrollback: 10000,
      tabStopWidth: 4,
    });

    // Add addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    
    term.open(terminalRef.current);
    fitAddon.fit();

    // Store refs
    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Welcome message
    term.writeln('\x1B[1;3;32m🚀 Terminal Buddy\x1B[0m');
    term.writeln('\x1B[2;37mType a command and press Enter to execute\x1B[0m');
    term.writeln('\x1B[2;37mWorking directory: \x1B[36m' + workingDir + '\x1B[0m');
    term.writeln('');
    term.write('\x1B[1;34m$ \x1B[0m');

    // Handle input
    let currentInput = '';
    term.onData((data) => {
      // Handle special keys
      if (data === '\r') {
        // Enter - execute command
        term.writeln('');
        executeCommand(currentInput.trim());
        currentInput = '';
      } else if (data === '\u007F') {
        // Backspace
        if (currentInput.length > 0) {
          currentInput = currentInput.slice(0, -1);
          term.write('\b \b');
        }
      } else if (data === '\x03') {
        // Ctrl+C
        term.writeln('^C');
        currentInput = '';
        term.write('\x1B[1;34m$ \x1B[0m');
      } else {
        // Regular character
        currentInput += data;
        term.write(data);
      }
    });

    // Handle resize
    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
    };
  }, [isOpen]);

  const executeCommand = async (cmd: string) => {
    if (!cmd || !xtermRef.current) return;

    setIsExecuting(true);

    try {
      // Call Tauri backend
      const result = await invoke('run_command', {
        command: cmd,
        workingDir: workingDir === '~' ? undefined : workingDir,
      });

      const output = result as { output?: string; exit_code?: number; error?: string };

      // Write output to terminal
      if (output.output) {
        xtermRef.current.writeln(output.output);
      }

      // Show exit code
      const exitCode = output.exit_code ?? -1;
      const exitColor = exitCode === 0 ? '\x1B[1;32m' : '\x1B[1;31m';
      xtermRef.current.writeln(`${exitColor}Exit code: ${exitCode}\x1B[0m`);

      // Show error if present
      if (output.error) {
        xtermRef.current.writeln(`\x1B[1;31mError: ${output.error}\x1B[0m`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      xtermRef.current.writeln(`\x1B[1;31mError: ${errorMessage}\x1B[0m`);
    } finally {
      setIsExecuting(false);
      xtermRef.current.write('\x1B[1;34m$ \x1B[0m');
    }
  };

  // Refit terminal when pane opens
  useEffect(() => {
    if (isOpen && fitAddonRef.current) {
      setTimeout(() => fitAddonRef.current?.fit(), 100);
    }
  }, [isOpen]);

  // TODO: Execute voice commands when TerminalPane has PTY session
  // useEffect(() => {
  //   if (voiceExecuting && lastCommand && xtermRef.current && sessionId) {
  //     const runVoiceCommand = async () => {
  //       try {
  //         // Write command to terminal
  //         xtermRef.current?.write(`\x1B[1;34m$ \x1B[0m${lastCommand}\r\n`);
  //         
  //         // Send to PTY
  //         await invoke('terminal_write', {
  //           sessionId,
  //           input: lastCommand + '\n'
  //         });
  //       } catch (error) {
  //         const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  //         xtermRef.current?.writeln(`\x1B[1;31mError: ${errorMessage}\x1B[0m`);
  //       }
  //     };
  //     
  //     runVoiceCommand();
  //   }
  // }, [voiceExecuting, lastCommand, sessionId]);

  if (!isOpen) return null;

  return (
    <div className="terminal-pane fixed bottom-0 left-0 right-0 h-96 bg-slate-900 border-t border-slate-700 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-green-400 font-mono text-sm">🚀 Terminal Buddy</span>
          <span className="text-slate-500 text-xs">|</span>
          <span className="text-cyan-400 font-mono text-xs">{workingDir}</span>
          {isExecuting && (
            <span className="text-yellow-400 text-xs animate-pulse">Executing...</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded"
          aria-label="Close terminal"
        >
          <X size={16} />
        </button>
      </div>

      {/* Terminal */}
      <div className="flex-1 overflow-hidden p-2">
        <div ref={terminalRef} className="h-full w-full" />
      </div>
    </div>
  );
};

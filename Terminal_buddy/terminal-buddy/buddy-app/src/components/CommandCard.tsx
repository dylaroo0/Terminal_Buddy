import React from 'react';
import { Lightbulb, StickyNote, RotateCcw } from 'lucide-react';
import type { CommandRecord } from '../utils/tauri-mcp';

interface CommandCardProps {
  command: CommandRecord;
  onExplain: (commandId: string) => void;
  onReRun: (commandInput: string) => void;
  onNote: (commandId: string) => void;
}

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusIcon = (exitCode: number | null): React.ReactElement => {
  if (exitCode === 0) return <span className="status-icon status-success">&#x2713;</span>;
  if (exitCode !== null) return <span className="status-icon status-error">&#x2717;</span>;
  return <span className="status-icon status-unknown">?</span>;
};

export const CommandCard: React.FC<CommandCardProps> = ({
  command,
  onExplain,
  onReRun,
  onNote,
}) => {
  return (
    <div className="command-card">
      <div className="command-header">
        <div className="command-meta">
          <span className="command-time">{formatTime(command.started_at)}</span>
          <code className="command-input">{command.input}</code>
          {getStatusIcon(command.exit_code)}
        </div>
        <div className="command-actions">
          <button
            onClick={() => onExplain(command.id)}
            className="action-btn explain"
            title="Explain this command"
          >
            <Lightbulb size={14} /> Explain
          </button>
          <button
            onClick={() => onNote(command.id)}
            className="action-btn"
            title="Add a note"
          >
            <StickyNote size={14} /> Note
          </button>
          <button
            onClick={() => onReRun(command.input)}
            className="action-btn"
            title="Re-run this command"
          >
            <RotateCcw size={14} /> Re-run
          </button>
        </div>
      </div>
      {command.output && (
        <div className="command-output">
          {command.output.substring(0, 300)}
          {command.output.length > 300 ? '...' : ''}
        </div>
      )}
    </div>
  );
};

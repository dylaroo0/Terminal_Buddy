import React from 'react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

interface SessionNode {
  id: string;
  title: string;
  date: string;
  duration: number;
  status: 'success' | 'error' | 'warning' | 'pending';
  commands: string[];
  filesChanged: string[];
}

interface JournalWhiteboardProps {
  sessions?: SessionNode[];
  onSessionSelect?: (sessionId: string) => void;
  className?: string;
}

export const JournalWhiteboard: React.FC<JournalWhiteboardProps> = ({ 
  sessions = [],
  onSessionSelect,
  className = ''
}) => {
  // Convert sessions to tldraw-compatible format for potential embedding
  const sessionNodes = sessions.map(session => ({
    id: `session-${session.id}`,
    type: 'session-node',
    x: Math.random() * 800 + 100,
    y: Math.random() * 600 + 100,
    width: 240,
    height: 120,
    rotation: 0,
    isLocked: false,
    isEditing: false,
    isHovered: false,
    isHighlighted: false,
    meta: {
      sessionId: session.id,
      title: session.title,
      date: session.date,
      duration: session.duration,
      status: session.status,
      commands: session.commands,
      filesChanged: session.filesChanged
    }
  }));

  return (
    <div className={`journal-whiteboard-container ${className}`} style={{ height: '100%', width: '100%' }}>
      <Tldraw
        // You can customize the editor here for journal-specific tools
        components={{
          // Custom toolbar items could be added here for journal-specific actions
        }}
      />
      
      {/* Overlay for session nodes (this would be integrated with tldraw's custom shapes) */}
      {sessions.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {sessions.map((session, index) => (
            <div
              key={session.id}
              className="session-node-overlay absolute cursor-pointer"
              style={{
                left: `${100 + (index % 3) * 300}px`,
                top: `${100 + Math.floor(index / 3) * 180}px`,
                width: '240px',
                height: '120px',
                background: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 100
              }}
              onClick={() => onSessionSelect?.(session.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    session.status === 'success' ? 'bg-emerald-500' :
                    session.status === 'error' ? 'bg-red-500' :
                    session.status === 'warning' ? 'bg-amber-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-white font-medium text-sm">{session.title}</span>
                </div>
                <span className="text-gray-400 text-xs">{session.duration}s</span>
              </div>
              <div className="text-gray-300 text-xs line-clamp-2">
                {session.commands[0] || 'No commands'}
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <span className="text-blue-400 text-xs font-medium">[Explain]</span>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-gray-400 text-xs">{new Date(session.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
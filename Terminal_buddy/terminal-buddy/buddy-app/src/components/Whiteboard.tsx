import React from 'react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

interface WhiteboardProps {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSave?: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onLoad?: (data: any) => void;
  mode?: 'journal' | 'workflow' | 'design';
}

export const Whiteboard: React.FC<WhiteboardProps> = ({
  className = '',
  mode = 'journal'
}) => {
  // Custom styling based on mode
  const getModeStyles = () => {
    switch (mode) {
      case 'workflow':
        return {
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          fontFamily: 'system-ui, sans-serif'
        };
      case 'design':
        return {
          backgroundColor: '#1e293b',
          color: '#f1f5f9',
          fontFamily: 'JetBrains Mono, monospace'
        };
      default: // journal
        return {
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          fontFamily: 'system-ui, sans-serif'
        };
    }
  };

  return (
    <div 
      className={`whiteboard-container ${className}`} 
      style={{ 
        height: '100%', 
        width: '100%',
        ...getModeStyles()
      }}
    >
      <Tldraw
        // Optional: customize toolbar for different modes
        components={{
          // You can customize the toolbar here for journal/workflow modes
        }}
        // Initial data can be loaded from session history
        // initialData={savedData}
        // onMount={(editor) => {
        //   if (onLoad) onLoad(editor);
        // }}
        // onChange={(editor) => {
        //   if (onSave) onSave(editor);
        // }}
      />
      
      {/* Mode indicator */}
      {mode === 'journal' && (
        <div className="absolute top-4 left-4 bg-gray-900/80 px-3 py-1 rounded-lg text-sm font-medium">
          📓 Endless Journal
        </div>
      )}
      {mode === 'workflow' && (
        <div className="absolute top-4 left-4 bg-blue-900/80 px-3 py-1 rounded-lg text-sm font-medium">
          🔄 Visual Workflow
        </div>
      )}
      {mode === 'design' && (
        <div className="absolute top-4 left-4 bg-purple-900/80 px-3 py-1 rounded-lg text-sm font-medium">
          🎨 Design Canvas
        </div>
      )}
    </div>
  );
};
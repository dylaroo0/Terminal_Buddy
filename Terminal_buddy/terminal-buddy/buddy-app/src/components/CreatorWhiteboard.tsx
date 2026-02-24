import React from 'react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

interface CreatorWhiteboardProps {
  className?: string;
  mode?: 'design' | 'workflow' | 'journal';
}

export const CreatorWhiteboard: React.FC<CreatorWhiteboardProps> = ({ 
  className = '', 
  mode = 'design'
}) => {
  // Mode-specific styling
  const getModeConfig = () => {
    switch (mode) {
      case 'workflow':
        return {
          backgroundColor: '#0f172a',
          title: 'Visual Workflow Builder',
          icon: '🔄'
        };
      case 'journal':
        return {
          backgroundColor: '#0f172a',
          title: 'Endless Journal Canvas',
          icon: '📓'
        };
      default: // design
        return {
          backgroundColor: '#1e293b',
          title: 'Design Canvas',
          icon: '🎨'
        };
    }
  };

  const config = getModeConfig();

  return (
    <div 
      className={`creator-whiteboard-container ${className}`} 
      style={{ 
        height: '100%', 
        width: '100%',
        backgroundColor: config.backgroundColor
      }}
    >
      <Tldraw
        // Custom toolbar configuration for Creator Corner
        components={{
          // We can add custom tools here for Terminal Buddy specific actions
        }}
      />
      
      {/* Mode header */}
      <div 
        className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900/80 px-4 py-2 rounded-lg flex items-center gap-2"
        style={{ backgroundColor: config.backgroundColor }}
      >
        <span className="text-xl">{config.icon}</span>
        <span className="text-white font-medium">{config.title}</span>
      </div>

      {/* Quick actions for Creator Corner */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
          title="AI Diagram (Excalidraw)"
        >
          ✨ AI
        </button>
        <button 
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
          title="Save Template"
        >
          💾 Save
        </button>
        <button 
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
          title="Import Template"
        >
          📥 Import
        </button>
      </div>
    </div>
  );
};
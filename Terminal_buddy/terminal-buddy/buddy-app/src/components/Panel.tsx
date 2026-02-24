import React from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import './Panel.css';

interface PanelProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  className?: string;
}

/**
 * Panel - Modular, movable container for UI components
 * 
 * This is the base container for all Terminal Buddy panels.
 * Each panel can be:
 * - Moved (future: drag-and-drop)
 * - Minimized/Collapsed
 * - Closed (hidden from layout)
 * - Resized (future)
 * 
 * Architecture note: Panels register themselves with the ComponentRegistry
 * and the LayoutEngine manages their positions. For now, positions are
 * hardcoded, but the panel structure supports future drag-and-drop.
 */
export const Panel: React.FC<PanelProps> = ({
  id,
  title,
  icon,
  children,
  onClose,
  onMinimize,
  isMinimized = false,
  className = '',
}) => {
  return (
    <div className={`panel ${className}`} data-panel-id={id}>
      <div className="panel-header">
        <div className="panel-title">
          {icon && <span className="panel-icon">{icon}</span>}
          <h3>{title}</h3>
        </div>
        <div className="panel-actions">
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="panel-btn"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="panel-btn"
              title="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      {!isMinimized && (
        <div className="panel-content">
          {children}
        </div>
      )}
    </div>
  );
};

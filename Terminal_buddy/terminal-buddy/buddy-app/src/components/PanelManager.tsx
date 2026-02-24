import React, { useState } from 'react';
import { Layout, Eye, EyeOff, ChevronDown, X, Minimize2, Maximize2 } from 'lucide-react';
import './PanelManager.css';

export interface PanelConfig {
  id: string;
  title: string;
  visible: boolean;
  minimized: boolean;
  order: number;
}

interface PanelManagerProps {
  panels: PanelConfig[];
  onToggleVisibility: (panelId: string) => void;
  onToggleMinimize: (panelId: string) => void;
}

/**
 * PanelManager - Dropdown menu to control which panels are visible
 * 
 * Users can:
 * - Show/hide any panel
 * - Minimize/expand panels
 * - See all available panels
 * - (Future) Reorder panels via drag-and-drop
 * 
 * This is the control layer for the modular UI.
 */
export const PanelManager: React.FC<PanelManagerProps> = ({
  panels,
  onToggleVisibility,
  onToggleMinimize,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const visibleCount = panels.filter(p => p.visible).length;

  return (
    <div className="panel-manager">
      <button
        className="panel-manager-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Manage panels"
      >
        <Layout size={18} />
        <span>View</span>
        <ChevronDown size={16} />
        {visibleCount < panels.length && (
          <span className="panel-badge">{visibleCount}/{panels.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="panel-manager-dropdown">
          <div className="panel-manager-header">
            <h4>Visible Panels</h4>
            <button onClick={() => setIsOpen(false)} className="close-btn">
              <X size={16} />
            </button>
          </div>
          
          <div className="panel-list">
            {panels
              .sort((a, b) => a.order - b.order)
              .map(panel => (
                <div
                  key={panel.id}
                  className={`panel-list-item ${panel.visible ? 'visible' : 'hidden'}`}
                >
                  <div className="panel-info">
                    <span className="panel-name">{panel.title}</span>
                    {panel.minimized && (
                      <span className="minimized-badge">(minimized)</span>
                    )}
                  </div>
                  <div className="panel-actions">
                    <button
                      onClick={() => onToggleMinimize(panel.id)}
                      className="icon-btn"
                      title={panel.minimized ? 'Expand' : 'Minimize'}
                      disabled={!panel.visible}
                    >
                      {panel.minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                    </button>
                    <button
                      onClick={() => onToggleVisibility(panel.id)}
                      className="icon-btn"
                      title={panel.visible ? 'Hide' : 'Show'}
                    >
                      {panel.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className="panel-manager-footer">
            <button
              className="reset-layout-btn"
              onClick={() => {
                // Reset all panels to visible
                panels.forEach(p => {
                  if (!p.visible) onToggleVisibility(p.id);
                  if (p.minimized) onToggleMinimize(p.id);
                });
              }}
            >
              Reset Layout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

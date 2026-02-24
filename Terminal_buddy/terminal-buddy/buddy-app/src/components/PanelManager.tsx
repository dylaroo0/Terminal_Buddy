import React, { useState, useEffect } from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { X, Minimize2, Maximize2, GripVertical } from 'lucide-react';
import './PanelManager.css';

export interface PanelConfig {
  id: string;
  title: string;
  visible: boolean;
  minimized: boolean;
  order: number;
  size?: number;
  position?: 'left' | 'right' | 'bottom';
}

interface PanelManagerProps {
  panels: PanelConfig[];
  onToggleVisibility: (panelId: string) => void;
  onToggleMinimize: (panelId: string) => void;
  onPanelResize?: (panelId: string, size: number) => void;
  children: React.ReactNode;
  terminalPanel?: React.ReactNode;
}

/**
 * PanelManager - Modular, resizable panel system
 *
 * Users can:
 * - Resize panels by dragging handles
 * - Minimize/expand panels
 * - Show/hide panels
 * - Save layout preferences (localStorage)
 *
 * Layout:
 * ┌─────────────────────────────────────────────┐
 * │  Main Content (Journal/Canvas/etc)          │
 * ├─────────────────────────────────────────────┤
 * │  Panel 1 (Timeline/Topics/Search)           │
 * ├─────────────────────────────────────────────┤
 * │  Terminal Pane (resizable)                  │
 * └─────────────────────────────────────────────┘
 */
export const PanelManager: React.FC<PanelManagerProps> = ({
  panels,
  onToggleVisibility,
  onToggleMinimize,
  onPanelResize,
  children,
  terminalPanel,
}) => {
  const [savedLayouts, setSavedLayouts] = useState<Record<string, number>>({});
  const [showPanelMenu, setShowPanelMenu] = useState(false);

  // Load saved layout from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('terminal-buddy-layout');
    if (saved) {
      try {
        setSavedLayouts(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved layout:', e);
      }
    }
  }, []);

  // Save layout to localStorage
  const saveLayout = (layout: Record<string, number>) => {
    setSavedLayouts(layout);
    localStorage.setItem('terminal-buddy-layout', JSON.stringify(layout));
  };

  const handleLayoutChange = (layout: { [panelId: string]: number }) => {
    saveLayout(layout);
    onPanelResize?.('bottom-panels', Object.values(layout).reduce((a, b) => a + b, 0) / Object.keys(layout).length);
  };

  // Get visible panels sorted by order
  const visiblePanels = panels
    .filter(p => p.visible && !p.minimized)
    .sort((a, b) => a.order - b.order);

  const hasMinimizedPanels = panels.some(p => p.minimized);
  const hasHiddenPanels = panels.some(p => !p.visible);

  return (
    <div className="panel-manager-modular">
      {/* Panel Menu Bar */}
      <div className="panel-menu-bar">
        <div className="panel-menu-left">
          <button
            className="panel-menu-btn"
            onClick={() => setShowPanelMenu(!showPanelMenu)}
            title="Manage panels"
          >
            <span className="menu-icon">▦</span>
            <span className="menu-text">View</span>
            {(hasHiddenPanels || hasMinimizedPanels) && (
              <span className="panel-badge">
                {visiblePanels.length}/{panels.length}
              </span>
            )}
          </button>
        </div>

        <div className="panel-menu-right">
          {hasMinimizedPanels && (
            <button
              className="panel-menu-btn"
              onClick={() => {
                panels.filter(p => p.minimized).forEach(p => onToggleMinimize(p.id));
              }}
              title="Restore all panels"
            >
              <Maximize2 size={14} />
              <span>Restore All</span>
            </button>
          )}
        </div>

        {/* Panel Menu Dropdown */}
        {showPanelMenu && (
          <div className="panel-menu-dropdown">
            <div className="panel-menu-header">
              <h4>Panels</h4>
              <button onClick={() => setShowPanelMenu(false)} className="close-btn">
                <X size={16} />
              </button>
            </div>

            <div className="panel-menu-list">
              {panels.sort((a, b) => a.order - b.order).map(panel => (
                <div
                  key={panel.id}
                  className={`panel-menu-item ${panel.visible ? 'visible' : 'hidden'}`}
                >
                  <span className="panel-name">{panel.title}</span>
                  <div className="panel-menu-actions">
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
                      {panel.visible ? '👁' : '👁‍🗨'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="panel-menu-footer">
              <button
                className="reset-layout-btn"
                onClick={() => {
                  localStorage.removeItem('terminal-buddy-layout');
                  setSavedLayouts({});
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

      {/* Main Content Area */}
      <div className="panel-manager-content">
        {children}
      </div>

      {/* Resizable Panel Area */}
      {visiblePanels.length > 0 || terminalPanel ? (
        <Group
          orientation="vertical"
          defaultLayout={{
            'bottom-panels': savedLayouts['bottom-panels'] || (terminalPanel ? 25 : 30),
            'terminal': savedLayouts['terminal'] || (terminalPanel ? 35 : 0),
          }}
          onLayoutChange={handleLayoutChange}
          className="panel-group-vertical"
        >
          {/* Bottom Panels (Timeline, Topics, Search, etc.) */}
          {visiblePanels.length > 0 && (
            <Panel
              id="bottom-panels"
              minSize={10}
              maxSize={60}
            >
              <div className="bottom-panels-container">
                {visiblePanels.map(panel => (
                  <div key={panel.id} className="bottom-panel">
                    <div className="bottom-panel-header">
                      <div className="bottom-panel-title">
                        <GripVertical size={14} className="drag-handle" />
                        <span>{panel.title}</span>
                      </div>
                      <div className="bottom-panel-actions">
                        <button
                          onClick={() => onToggleMinimize(panel.id)}
                          className="icon-btn"
                          title="Minimize"
                        >
                          <Minimize2 size={14} />
                        </button>
                        <button
                          onClick={() => onToggleVisibility(panel.id)}
                          className="icon-btn"
                          title="Close"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="bottom-panel-content">
                      {/* Panel content rendered by parent */}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {visiblePanels.length > 0 && terminalPanel && (
            <Separator
              className="panel-resize-handle"
              id="separator-1"
            >
              <div className="resize-handle-bar" />
            </Separator>
          )}

          {/* Terminal Pane */}
          {terminalPanel && (
            <Panel
              id="terminal"
              minSize={15}
              maxSize={60}
            >
              <div className="terminal-panel-container">
                {terminalPanel}
              </div>
            </Panel>
          )}
        </Group>
      ) : null}
    </div>
  );
};

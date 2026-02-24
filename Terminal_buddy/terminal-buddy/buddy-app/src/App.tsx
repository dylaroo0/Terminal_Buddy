import React, { useState, useEffect, useCallback } from 'react';
import { Settings, BookOpen, Calendar, Terminal, Sparkles, ChevronDown, ChevronUp, AlertCircle, RefreshCw } from 'lucide-react';
import './App.css';
import * as mcp from './utils/tauri-mcp';
import type { CommandRecord, SessionRecord, Explanation } from './utils/tauri-mcp';
import { CreatorCornerWorkshop } from './components/CreatorCornerWorkshop';
import { OnboardingWizard } from './components/OnboardingWizard';
import { CommandCard } from './components/CommandCard';
import { ExplanationModal } from './components/ExplanationModal';
import { SearchView } from './components/SearchView';
import { PanelManager, PanelConfig } from './components/PanelManager';
import { TopicsPanel } from './components/TopicsPanel';
import { CreatorCorner } from './components/CreatorCorner';
import { Whiteboard } from './components/Whiteboard';
import { JournalWhiteboard } from './components/JournalWhiteboard';

/** Group sessions by date string for the timeline view */
function groupSessionsByDate(sessions: SessionRecord[]): Map<string, SessionRecord[]> {
  const groups = new Map<string, SessionRecord[]>();
  for (const session of sessions) {
    const dateKey = new Date(session.started_at).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const existing = groups.get(dateKey) || [];
    existing.push(session);
    groups.set(dateKey, existing);
  }
  return groups;
}

const App: React.FC = () => {
  // Top-level navigation: Journal, Creator Corner, or Workshop
  const [activeView, setActiveView] = useState<'journal' | 'creator' | 'workshop'>('journal');

  // Panel state - modular, movable panels
  const [panels, setPanels] = useState<PanelConfig[]>([
    { id: 'timeline', title: 'Timeline', visible: true, minimized: false, order: 1 },
    { id: 'search', title: 'Search', visible: false, minimized: false, order: 2 },
    { id: 'topics', title: 'Topics', visible: false, minimized: false, order: 3 },
  ]);

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Data state
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [commands, setCommands] = useState<CommandRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [daemonMode, setDaemonMode] = useState<'live' | 'mock'>('mock');

  // Explanation modal state
  const [explanationData, setExplanationData] = useState<{
    commandInput: string;
    explanation: Explanation;
  } | null>(null);
  const [explanationLoading, setExplanationLoading] = useState(false);

  // Terminal pane state (collapsible at bottom)
  const [terminalPaneOpen, setTerminalPaneOpen] = useState(false);

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Load data from MCP
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [sessionData, commandData, status] = await Promise.all([
        mcp.getSessions(10),
        mcp.getHistory(50),
        mcp.checkDaemonStatus(),
      ]);

      setSessions(sessionData);
      setCommands(commandData);
      setDaemonMode(status.mode);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to connect to Terminal Buddy daemon. Is it running?');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Check if first run on mount
  useEffect(() => {
    const checkOnboarding = async () => {
      const { first_run } = await mcp.checkFirstRun();
      setShowOnboarding(first_run);
    };
    checkOnboarding();
  }, []);

  const handleExplain = async (commandId: string) => {
    const command = commands.find(c => c.id === commandId);
    if (!command) return;

    setExplanationData({
      commandInput: command.input,
      explanation: { explanation: '', confidence: 0 },
    });
    setExplanationLoading(true);

    try {
      const result = await mcp.explainCommand(command.input, command.output);
      if (result) {
        setExplanationData({
          commandInput: command.input,
          explanation: result,
        });
      }
    } catch (err) {
      console.error('Failed to explain:', err);
      setExplanationData({
        commandInput: command.input,
        explanation: { explanation: 'Failed to get explanation. Please try again.', confidence: 0 },
      });
    } finally {
      setExplanationLoading(false);
    }
  };

  const handleRunCommand = async (command: string) => {
    try {
      await mcp.runCommand(command);
      // Refresh data
      const [newSessions, newCommands] = await Promise.all([
        mcp.getSessions(10),
        mcp.getHistory(50),
      ]);
      setSessions(newSessions);
      setCommands(newCommands);
    } catch (err) {
      console.error('Failed to run:', err);
    }
  };

  const handleNote = (commandId: string) => {
    // TODO: Implement note adding (Task 4.1 — buddy_add_note)
    console.log('Add note for command:', commandId);
  };

  // Panel management
  const togglePanelVisibility = (panelId: string) => {
    setPanels(prev => prev.map(p => 
      p.id === panelId ? { ...p, visible: !p.visible } : p
    ));
  };

  const togglePanelMinimize = (panelId: string) => {
    setPanels(prev => prev.map(p => 
      p.id === panelId ? { ...p, minimized: !p.minimized } : p
    ));
  };

  // Group sessions by date for timeline
  const dateGroups = groupSessionsByDate(sessions);

  return (
    <div className="app-container">
      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingWizard onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Explanation Modal */}
      {explanationData && (
        <ExplanationModal
          commandInput={explanationData.commandInput}
          explanation={explanationData.explanation}
          loading={explanationLoading}
          onClose={() => setExplanationData(null)}
        />
      )}

      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-left">
          <h1 className="app-title">Terminal Buddy</h1>
          <span className={`connection-badge ${daemonMode}`}>
            {daemonMode === 'live' ? 'Live' : 'Demo'}
          </span>
        </div>
        <div className="nav-center">
          <button onClick={() => setActiveView('journal')} className={`nav-tab ${activeView === 'journal' ? 'active' : ''}`}>
            <BookOpen size={16} /> Journal
          </button>
          <button onClick={() => setActiveView('creator')} className={`nav-tab ${activeView === 'creator' ? 'active' : ''}`}>
            <Sparkles size={16} /> Creator Corner
          </button>
          <button onClick={() => setActiveView('workshop')} className={`nav-tab ${activeView === 'workshop' ? 'active' : ''}`}>
            <Settings size={16} /> Workshop
          </button>
        </div>
        <div className="nav-right">
          <PanelManager
            panels={panels}
            onToggleVisibility={togglePanelVisibility}
            onToggleMinimize={togglePanelMinimize}
          />
          <button className="icon-btn" title="Settings"><Settings className="icon" /></button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {activeView === 'journal' ? (
          <div className="journal-view">
            {/* Endless Whiteboard Journal */}
            <div className="whiteboard-journal">
              <JournalWhiteboard 
                sessions={[
                  {
                    id: 'sess-1',
                    title: 'Debugging PTY capture timeout',
                    date: '2026-02-22T13:15:00Z',
                    duration: 42,
                    status: 'success',
                    commands: ['cargo build --release', 'buddy-daemon --debug'],
                    filesChanged: ['target/release/buddy-daemon']
                  },
                  {
                    id: 'sess-2',
                    title: 'Documentation generation',
                    date: '2026-02-22T12:49:00Z',
                    duration: 18,
                    status: 'success',
                    commands: ['mdbook build'],
                    filesChanged: ['book/html/index.html']
                  },
                  {
                    id: 'sess-3',
                    title: 'Agent manifest review',
                    date: '2026-02-22T11:30:00Z',
                    duration: 25,
                    status: 'success',
                    commands: ['cat agent-manifest.yaml'],
                    filesChanged: []
                  },
                  {
                    id: 'sess-4',
                    title: 'System updates & apt',
                    date: '2026-02-21T16:20:00Z',
                    duration: 120,
                    status: 'success',
                    commands: ['sudo apt update && sudo apt upgrade'],
                    filesChanged: []
                  }
                ]}
                onSessionSelect={(sessionId) => console.log('Session selected:', sessionId)}
                className="journal-whiteboard"
              />
            </div>
            
            {/* Overlay Panels */}
            <div className="panel-overlay">
              {/* Timeline Panel - always visible as base */}
              {panels.find(p => p.id === 'timeline')?.visible && (
                <div className="timeline-panel">
                  {loading ? (
                    <div className="loading-state">
                      <div className="spinner"></div>
                      <p>Loading your terminal journal...</p>
                    </div>
                  ) : error ? (
                    <div className="error-state">
                      <AlertCircle className="error-icon" />
                      <h3>Connection Issue</h3>
                      <p>{error}</p>
                      <button onClick={loadData} className="primary-btn">
                        <RefreshCw size={16} /> Retry
                      </button>
                    </div>
                  ) : sessions.length > 0 ? (
                    Array.from(dateGroups.entries()).map(([dateLabel, dateSessions]) => (
                      <div key={dateLabel} className="session-group">
                        <div className="session-date-header">
                          <div className="date-marker"></div>
                          <h3>{dateLabel}</h3>
                        </div>

                        {dateSessions.map((session) => (
                          <div key={session.id} className="session-card">
                            <div className="session-header">
                              <div className="session-title-section">
                                <span className="session-title">{session.title || 'Untitled Session'}</span>
                                <span className="session-meta">{session.command_count} commands</span>
                              </div>
                              <span className="session-time">
                                {formatTime(session.started_at)} - {session.ended_at ? formatTime(session.ended_at) : 'Running'}
                              </span>
                            </div>

                            <div className="commands-list">
                              {commands
                                .filter(cmd => cmd.session_id === session.id)
                                .map((command) => (
                                  <CommandCard
                                    key={command.id}
                                    command={command}
                                    onExplain={handleExplain}
                                    onReRun={handleRunCommand}
                                    onNote={handleNote}
                                  />
                                ))}
                            </div>

                            {session.notes && session.notes.length > 0 && (
                              <div className="session-notes">
                                <h4>Notes</h4>
                                {session.notes.map((note, idx) => (
                                  <div key={idx} className="note-item">{note}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <BookOpen className="empty-icon" />
                      <h3>No Terminal History Yet</h3>
                      <p>Your terminal journal will appear here as you use Terminal Buddy</p>
                      <button onClick={() => handleRunCommand('echo "Hello Terminal Buddy!"')} className="primary-btn">Try a Command</button>
                    </div>
                  )}
                </div>
              )}

              {/* Search Panel */}
              {panels.find(p => p.id === 'search')?.visible && (
                <SearchView
                  onExplain={handleExplain}
                  onReRun={handleRunCommand}
                  onNote={handleNote}
                  onClose={() => togglePanelVisibility('search')}
                  onMinimize={() => togglePanelMinimize('search')}
                  isMinimized={panels.find(p => p.id === 'search')?.minimized}
                />
              )}

              {/* Topics Panel - implemented */}
              {panels.find(p => p.id === 'topics')?.visible && (
                <TopicsPanel 
                  topics={[
                    {
                      id: 'terminal-buddy-daemon',
                      name: 'Terminal Buddy Daemon',
                      lastActive: '2h ago',
                      sessions: [
                        {
                          id: 'sess-1',
                          title: 'Debugging PTY capture timeout',
                          date: '2026-02-22T13:15:00Z',
                          duration: 42,
                          status: 'success',
                          commands: ['cargo build --release', 'buddy-daemon --debug'],
                          filesChanged: ['target/release/buddy-daemon']
                        },
                        {
                          id: 'sess-2',
                          title: 'Documentation generation',
                          date: '2026-02-22T12:49:00Z',
                          duration: 18,
                          status: 'success',
                          commands: ['mdbook build'],
                          filesChanged: ['book/html/index.html']
                        }
                      ]
                    },
                    {
                      id: 'bmad-system',
                      name: 'BMAD System',
                      lastActive: '1d ago',
                      sessions: [
                        {
                          id: 'sess-3',
                          title: 'Agent manifest review',
                          date: '2026-02-22T11:30:00Z',
                          duration: 25,
                          status: 'success',
                          commands: ['cat agent-manifest.yaml'],
                          filesChanged: []
                        }
                      ]
                    },
                    {
                      id: 'uncategorized',
                      name: 'Uncategorized',
                      lastActive: '2d ago',
                      sessions: [
                        {
                          id: 'sess-4',
                          title: 'System updates & apt',
                          date: '2026-02-21T16:20:00Z',
                          duration: 120,
                          status: 'success',
                          commands: ['sudo apt update && sudo apt upgrade'],
                          filesChanged: []
                        }
                      ]
                    }
                  ]}
                  onTopicSelect={(topicId) => console.log('Topic selected:', topicId)}
                  onSessionSelect={(sessionId) => console.log('Session selected:', sessionId)}
                  visible={panels.find(p => p.id === 'topics')?.visible || false}
                />
              )}
            </div>
          </div>
        ) : activeView === 'workshop' ? (
          <CreatorCornerWorkshop />
        ) : (
          <CreatorCorner />
        )}
      </main>

      {/* Collapsible Terminal Pane at Bottom */}
      <div className={`terminal-pane ${terminalPaneOpen ? 'terminal-pane--open' : 'terminal-pane--closed'}`}>
        <button onClick={() => setTerminalPaneOpen(!terminalPaneOpen)} className="pane-toggle">
          {terminalPaneOpen ? <ChevronDown className="icon" /> : <ChevronUp className="icon" />}
          <span>{terminalPaneOpen ? 'Collapse Terminal' : 'Expand Terminal'}</span>
        </button>
        {terminalPaneOpen && (
          <div className="terminal-content">
            <div className="terminal-placeholder">
              <Terminal className="terminal-icon" />
              <h3>Terminal View</h3>
              <p>Terminal emulator (xterm.js) will be embedded here — Task 8</p>
              <p className="terminal-hint">Type commands or use voice input</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar, Filter, X, Clock, Tag } from 'lucide-react';
import * as mcp from '../utils/tauri-mcp';
import type { CommandRecord, SessionRecord } from '../utils/tauri-mcp';
import { CommandCard } from './CommandCard';
import { Panel } from './Panel';

interface SearchViewProps {
  onExplain: (commandId: string) => void;
  onReRun: (command: string) => void;
  onNote: (commandId: string) => void;
  onClose?: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

/**
 * SearchView — Semantic full-text search across terminal history
 * Searches: commands (input + output), session titles
 * Features:
 * - Debounced search input (300ms delay)
 * - Date range filter
 * - Topic filter (extracted from session titles)
 * - Results displayed as CommandCards with session context
 * - Empty and loading states
 */
export const SearchView: React.FC<SearchViewProps> = ({ onExplain, onReRun, onNote, onClose, onMinimize, isMinimized }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [commandResults, setCommandResults] = useState<CommandRecord[]>([]);
  const [sessionResults, setSessionResults] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search input (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load all sessions to extract topics for filter dropdown
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const allSessions = await mcp.getSessions(100);
        // Extract topics from session titles (simplified - in real impl, would use buddy_topics)
        const topics = new Set<string>();
        allSessions.forEach(session => {
          if (session.title) {
            topics.add(session.title);
          }
        });
        setAvailableTopics(Array.from(topics).slice(0, 20)); // Limit to top 20
      } catch (err) {
        console.error('Failed to load topics:', err);
      }
    };
    loadTopics();
  }, []);

  // Fetch search results when debounced query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setCommandResults([]);
        setSessionResults([]);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);

      try {
        // Search commands
        const commandData = await mcp.getHistory(100, debouncedQuery);
        
        // Search sessions (by title)
        const allSessions = await mcp.getSessions(100);
        const sessionData = allSessions.filter(s => 
          s.title?.toLowerCase().includes(debouncedQuery.toLowerCase())
        );

        setSessionResults(sessionData);
        
        // Apply date and topic filters to command results
        let filtered = commandData;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        if (dateFilter === 'today') {
          filtered = commandData.filter(cmd => new Date(cmd.started_at) >= today);
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = commandData.filter(cmd => new Date(cmd.started_at) >= weekAgo);
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = commandData.filter(cmd => new Date(cmd.started_at) >= monthAgo);
        }

        // Apply topic filter (match against session titles)
        if (topicFilter !== 'all') {
          const topicSessionIds = new Set(
            allSessions
              .filter(s => s.title === topicFilter)
              .map(s => s.id)
          );
          filtered = filtered.filter(cmd => topicSessionIds.has(cmd.session_id));
        }

        setCommandResults(filtered);
      } catch (err) {
        console.error('Search failed:', err);
        setCommandResults([]);
        setSessionResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, dateFilter, topicFilter]);

  // Focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Clear search
  const handleClear = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    searchInputRef.current?.focus();
  };

  // Format date label
  const formatDateLabel = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    if (date >= today) {
      return 'Today';
    } else if (date >= yesterday) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // Group results by date
  const groupResultsByDate = (commands: CommandRecord[]): Map<string, CommandRecord[]> => {
    const groups = new Map<string, CommandRecord[]>();
    for (const cmd of commands) {
      const dateKey = formatDateLabel(cmd.started_at);
      const existing = groups.get(dateKey) || [];
      existing.push(cmd);
      groups.set(dateKey, existing);
    }
    return groups;
  };

  const dateGroups = groupResultsByDate(commandResults);
  const totalResults = commandResults.length + sessionResults.length;

  return (
    <Panel
      id="search-panel"
      title="Search"
      icon={<Search size={18} />}
      onClose={onClose}
      onMinimize={onMinimize}
      isMinimized={isMinimized}
      className="search-panel"
    >
      {/* Search Bar */}
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commands, sessions, errors, files..."
            className="search-input"
          />
          {searchQuery && (
            <button onClick={handleClear} className="clear-search-btn">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="search-filters">
          <div className="filter-group">
            <Calendar size={14} />
            <span className="filter-label">Date:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
              className="filter-select"
            >
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="week">Past week</option>
              <option value="month">Past month</option>
            </select>
          </div>

          <div className="filter-group">
            <Tag size={14} />
            <span className="filter-label">Topic:</span>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All topics</option>
              {availableTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          {totalResults > 0 && (
            <div className="results-count">
              <Filter size={14} />
              <span>{totalResults} result{totalResults !== 1 ? 's' : ''}</span>
              {sessionResults.length > 0 && (
                <span className="results-breakdown">
                  ({sessionResults.length} session{sessionResults.length !== 1 ? 's' : ''}, {commandResults.length} command{commandResults.length !== 1 ? 's' : ''})
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="search-results">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching your terminal history...</p>
          </div>
        ) : hasSearched && totalResults > 0 ? (
          <div className="search-results-content">
            {/* Session Results */}
            {sessionResults.length > 0 && (
              <div className="search-section">
                <h3 className="search-section-title">Sessions</h3>
                <div className="session-results-list">
                  {sessionResults.map((session) => (
                    <div key={session.id} className="session-result-card">
                      <div className="session-result-title">{session.title}</div>
                      <div className="session-result-meta">
                        <Clock size={12} />
                        <span>{new Date(session.started_at).toLocaleDateString('en-US', { 
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}</span>
                        <span className="session-command-count">{session.command_count} commands</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Command Results */}
            {commandResults.length > 0 && (
              <div className="search-section">
                <h3 className="search-section-title">Commands</h3>
                {Array.from(dateGroups.entries()).map(([dateLabel, dateCommands]) => (
                  <div key={dateLabel} className="search-result-group">
                    <div className="search-result-date-header">
                      <Clock size={14} />
                      <h4>{dateLabel}</h4>
                    </div>
                    <div className="search-result-commands">
                      {dateCommands.map((command) => (
                        <CommandCard
                          key={command.id}
                          command={command}
                          onExplain={onExplain}
                          onReRun={onReRun}
                          onNote={onNote}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : hasSearched ? (
          <div className="empty-search-results">
            <Search className="empty-icon" />
            <h3>No results found</h3>
            <p>Try a different search term or adjust your filters</p>
          </div>
        ) : (
          <div className="search-placeholder">
            <Search className="empty-icon" />
            <h3>Search your terminal history</h3>
            <p>Find commands, sessions, errors, files, or any text from your past sessions</p>
            <div className="search-examples">
              <span className="example-label">Examples:</span>
              <code>docker-compose</code>
              <code>error: module not found</code>
              <code>cargo build</code>
              <code>Permission denied</code>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
};

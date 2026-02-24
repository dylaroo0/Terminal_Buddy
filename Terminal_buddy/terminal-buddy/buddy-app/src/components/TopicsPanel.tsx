import React, { useState, useEffect } from 'react';
import { ChevronRight, Folder, Terminal, Edit3, Merge, Trash2, Search, Filter } from 'lucide-react';

interface Session {
  id: string;
  title: string;
  date: string;
  duration: number;
  status: 'success' | 'error' | 'warning' | 'pending';
  commands: string[];
  filesChanged: string[];
}

interface Topic {
  id: string;
  name: string;
  sessions: Session[];
  lastActive: string;
}

interface TopicsPanelProps {
  topics: Topic[];
  onTopicSelect: (topicId: string) => void;
  onSessionSelect: (sessionId: string) => void;
  visible: boolean;
}

export const TopicsPanel: React.FC<TopicsPanelProps> = ({
  topics,
  onTopicSelect,
  onSessionSelect,
  visible
}) => {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Expand all topics by default
  useEffect(() => {
    const allTopicIds = new Set(topics.map(t => t.id));
    setExpandedTopics(allTopicIds);
  }, [topics]);

  const toggleExpand = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const filteredTopics = topics.filter(topic => 
    topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.sessions.some(session => 
      session.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'success': return 'bg-emerald-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (!visible) return null;

  return (
    <div className="topics-panel h-full flex flex-col">
      {/* Header */}
      <div className="topics-header border-b border-gray-700 bg-gray-900/50 px-4 py-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Folder className="w-5 h-5" />
          Topics
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
            />
          </div>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <Filter className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredTopics.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Folder className="w-12 h-12 mb-4 opacity-50" />
            <p>No topics found</p>
            <p className="text-sm mt-1">Try adjusting your search or create new sessions</p>
          </div>
        ) : (
          <div className="folder-tree space-y-1">
            {filteredTopics.map(topic => (
              <div key={topic.id} className="topic-folder">
                {/* Topic Header */}
                <div 
                  className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedTopic === topic.id ? 'bg-blue-900/30' : 'hover:bg-gray-700/50'
                  }`}
                  onClick={() => {
                    setSelectedTopic(topic.id);
                    onTopicSelect(topic.id);
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(topic.id);
                    }}
                    className="mr-2 p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    <ChevronRight 
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        expandedTopics.has(topic.id) ? 'rotate-90' : ''
                      }`} 
                    />
                  </button>
                  <div className="flex items-center flex-1">
                    <div className="flex items-center mr-3">
                      <Folder className="w-4 h-4 text-blue-400 mr-2" />
                      <span className="font-medium text-white">{topic.name}</span>
                    </div>
                    <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                      {topic.sessions.length}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <span className="mr-2">{topic.lastActive}</span>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(topic.sessions[0]?.status || 'pending')}`}></div>
                  </div>
                  <div className="flex items-center ml-2">
                    <button className="p-1 hover:bg-gray-700 rounded transition-colors" title="Rename">
                      <Edit3 className="w-3 h-3 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-700 rounded transition-colors" title="Merge">
                      <Merge className="w-3 h-3 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-700 rounded transition-colors" title="Delete">
                      <Trash2 className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Sessions (expanded) */}
                {expandedTopics.has(topic.id) && (
                  <div className="ml-6 space-y-1">
                    {topic.sessions.map(session => (
                      <div 
                        key={session.id} 
                        className="session-item p-2 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSessionSelect(session.id);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <Terminal className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-medium text-sm truncate">
                                {session.title}
                              </span>
                              <span className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`}></span>
                            </div>
                            <div className="flex items-center text-gray-400 text-xs gap-3">
                              <span>{new Date(session.date).toLocaleDateString()} • {new Date(session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              <span>{session.duration}s</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors">
                              [Explain]
                            </button>
                            <button className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded transition-colors">
                              [Re-run]
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="topics-footer border-t border-gray-700 bg-gray-900/50 px-4 py-3 flex items-center justify-between">
        <div className="text-gray-400 text-sm">
          {topics.length} topics • {topics.reduce((sum, t) => sum + t.sessions.length, 0)} sessions
        </div>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
          <span>+ Add Topic</span>
        </button>
      </div>
    </div>
  );
};
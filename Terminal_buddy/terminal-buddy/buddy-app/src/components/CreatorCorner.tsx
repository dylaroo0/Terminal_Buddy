import React, { useState, useEffect } from 'react';
import { Settings, Palette, Layout, Zap, Mic, User, Star, Download, Upload, Plus, X, Sparkles, Brain } from 'lucide-react';
import { CreatorWhiteboard } from './CreatorWhiteboard';

interface Template {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  rating: number;
  installs: number;
  previewUrl: string;
}

const creatorCornerCategories = [
  { id: 'visual', name: 'Visual Settings', icon: Palette },
  { id: 'layout', name: 'Layout Settings', icon: Layout },
  { id: 'interaction', name: 'Interaction Settings', icon: Zap },
  { id: 'behavior', name: 'Behavior Settings', icon: User },
  { id: 'voice', name: 'Voice Settings', icon: Mic },
  { id: 'components', name: 'Components', icon: Settings },
];

const sampleTemplates: Template[] = [
  {
    id: '1',
    name: 'Dyslexia Focus - Dark',
    description: 'High contrast, OpenDyslexic, voice-first, minimal visual noise',
    version: '1.0',
    author: 'dylaroo',
    rating: 4.9,
    installs: 128,
    previewUrl: '#'
  },
  {
    id: '2',
    name: 'Power Dev - Compact',
    description: 'Dense info, keyboard shortcuts, system dashboard always visible',
    version: '1.0',
    author: 'alex_codes',
    rating: 4.7,
    installs: 89,
    previewUrl: '#'
  }
];

export const CreatorCorner: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('visual');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [aiDiagramMode, setAiDiagramMode] = useState(false);

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setSelectedTemplate(null);
    setAiDiagramMode(false);
  };

  const currentTemplate = {
    name: 'Dyslexia Focus - Dark',
    description: 'High contrast, OpenDyslexic, voice-first, minimal visual noise',
    version: '1.0',
    author: 'dylaroo',
    appearance: {
      theme: 'dyslexia-dark',
      font_family: 'OpenDyslexic',
      font_size: 18,
      line_height: 1.8,
      letter_spacing: '0.05em',
      background_color: '#0f172a',
      primary_accent: '#38bdf8',
      text_primary: '#f8fafc',
      text_secondary: '#cbd5e1'
    },
    interaction: {
      default_input: 'voice',
      push_to_talk: 'RightCtrl',
      confirm_before_run: true
    }
  };

  return (
    <div className="creator-corner h-full flex flex-col">
      {/* Header */}
      <div className="creator-corner-header border-b border-gray-700 bg-gray-900/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Creator Corner</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              aiDiagramMode 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
            onClick={() => setAiDiagramMode(!aiDiagramMode)}
            title={aiDiagramMode ? "Back to Design Mode" : "AI Diagram Mode"}
          >
            {aiDiagramMode ? <Sparkles className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
            {aiDiagramMode ? 'Design Mode' : 'AI Diagram'}
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Start Creating
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Categories */}
        <div className="creator-category-nav w-64 bg-gray-900/50 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Categories</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {creatorCornerCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  activeCategory === category.id 
                    ? 'bg-blue-900/30 text-white' 
                    : 'hover:bg-gray-700/50 text-gray-300'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center Column - Live Preview */}
        <div className="creator-preview flex-1 flex flex-col">
          {/* Preview Header */}
          <div className="preview-header border-b border-gray-700 bg-gray-900/50 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {aiDiagramMode ? 'AI Diagram Generator' : 'Live Preview'}
            </h2>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                Test with Sample Data
              </button>
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                Save as Template
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-900/30">
            <div className="preview-container max-w-4xl mx-auto">
              {/* AI Diagram Mode */}
              {aiDiagramMode && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI-Powered Diagram Generation
                  </h3>
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-white mb-3">Generate Diagram From:</h4>
                        <div className="space-y-3">
                          <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-left transition-colors">
                            📋 Session History
                          </button>
                          <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-left transition-colors">
                            🧠 Command Sequence
                          </button>
                          <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-left transition-colors">
                            🏗️ System Architecture
                          </button>
                          <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-left transition-colors">
                            🔄 Workflow Flow
                          </button>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-3">Recent AI Diagrams:</h4>
                        <div className="space-y-3">
                          <div className="bg-gray-700/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-white font-medium">Docker Network Flow</span>
                            </div>
                            <p className="text-gray-400 text-sm">Generated from session: "Debugging PTY capture timeout"</p>
                          </div>
                          <div className="bg-gray-700/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <Layout className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-white font-medium">System Architecture</span>
                            </div>
                            <p className="text-gray-400 text-sm">Generated from session: "Agent manifest review"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Design Canvas Mode */}
              {!aiDiagramMode && (
                <>
                  {/* Creator Whiteboard Preview */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Design Canvas
                    </h3>
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <CreatorWhiteboard mode="design" className="h-96 rounded-lg overflow-hidden" />
                    </div>
                  </div>

                  {/* Journal View Preview */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Journal View
                    </h3>
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Settings className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">Debugging PTY capture timeout</h4>
                            <p className="text-gray-400 text-sm">Feb 22, 2026 • 1:15 PM • 42s</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded">Success</span>
                          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                            [Explain]
                          </button>
                          <button className="text-gray-400 hover:text-white text-sm font-medium">
                            [Re-run]
                          </button>
                        </div>
                      </div>
                      <div className="border-t border-gray-700 pt-4">
                        <p className="text-gray-300 mb-2">Command:</p>
                        <code className="block bg-gray-900/50 text-green-400 p-3 rounded-lg font-mono text-sm">
                          $ cargo build --release
                        </code>
                        <p className="text-gray-300 mt-2 mb-2">Output:</p>
                        <pre className="bg-gray-900/50 text-gray-200 p-3 rounded-lg font-mono text-sm whitespace-pre-wrap">
                          OK Compiled buddy-daemon (42s)
                          [files] Changed: target/release/buddy-daemon
                        </pre>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Template Management */}
        <div className="creator-template-management w-80 bg-gray-900/50 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Template Management</h3>
          </div>
          
          {/* Current Template Info */}
          <div className="p-4 border-b border-gray-700">
            <h4 className="font-medium text-white mb-2">{currentTemplate.name}</h4>
            <p className="text-gray-400 text-sm mb-3">{currentTemplate.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>v{currentTemplate.version}</span>
              <span>•</span>
              <span>{currentTemplate.author}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-b border-gray-700">
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Save as Template
              </button>
              <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                <X className="w-4 h-4" />
                Reset to Default
              </button>
              <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Import Template
              </button>
            </div>
          </div>

          {/* Community Templates */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-white">Community Templates</h4>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                Browse All
              </button>
            </div>
            
            <div className="space-y-4">
              {sampleTemplates.map(template => (
                <div 
                  key={template.id} 
                  className="template-card bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => handleTemplateClick(template)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Settings className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-white truncate">{template.name}</h5>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{template.description}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-300">{template.rating}</span>
                        </div>
                        <span className="text-gray-500 mx-2">•</span>
                        <span className="text-gray-400 text-sm">{template.installs} installs</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors">
                        Preview
                      </button>
                      <button className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded transition-colors">
                        Install
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewModalOpen && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Preview: {selectedTemplate.name}</h3>
              <button 
                onClick={closePreviewModal}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3">Template Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">Description</label>
                      <p className="text-white">{selectedTemplate.description}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">Version</label>
                      <p className="text-white">{selectedTemplate.version}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">Author</label>
                      <p className="text-white">{selectedTemplate.author}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">Rating</label>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white">{selectedTemplate.rating} stars</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-3">Preview</h4>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-medium">{selectedTemplate.name}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-gray-300">High contrast theme</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-300">OpenDyslexic font</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-300">Voice-first interface</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
              <button 
                onClick={closePreviewModal}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  // Install template logic would go here
                  closePreviewModal();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Install Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
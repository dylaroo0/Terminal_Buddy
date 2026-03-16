# Terminal Buddy Memvid Integration Guide

## Overview

This guide details how to integrate Memvid as the foundational memory engine for Terminal Buddy's journal system, as specified in PRODUCT_SPEC_V2.md Section 12.3.

Memvid is not just a component - it's **the memory engine that makes the journal intelligent** instead of just a text log.

---

## Core Memvid Components for Terminal Buddy

### 1. Memvid Canvas (Journal Foundation)
- **File format**: `.mv2` files store all journal data
- **Data stored**: Sessions, commands, output, filesystem changes, system state, user notes, topic tags, auto-titles
- **API**: `@memvid/canvas-react/components`

### 2. Key Journal Features Powered by Memvid

| Memvid Component | Terminal Buddy Feature | Implementation Status |
|-----------------|------------------------|----------------------|
| **Semantic Search** | Journal search ("that build error from last week") | ✅ Ready for integration |
| **Timeline Dashboard** | Visual timeline scrubber (replay sessions, see state changes) | ✅ Ready for integration |
| **RAG Chat** | Explain button (chat with history using correlated data) | ✅ Ready for integration |
| **Memory Statistics** | System health view (storage, session counts, topic distribution) | ✅ Ready for integration |

---

## Architecture Integration

### Current State vs. Memvid-Integrated State

#### Before Memvid Integration:
- Sample session data hardcoded in components
- Topics view with manual topic management
- Separate session storage systems

#### After Memvid Integration:
- All journal data sourced from Memvid `.mv2` files
- Topics automatically generated from Memvid's topic tagging
- Search powered by Memvid's semantic search
- Explain button uses Memvid's RAG chat capabilities

### Integration Pattern

```typescript
// From PRODUCT_SPEC_V2.md Section 12.3
import { SearchPanel, TimelinePanel, MemoryStats } from '@memvid/canvas-react/components';

// Terminal Buddy App integration
export function JournalView() {
  return (
    <div className="journal-container">
      {/* Memvid-powered components */}
      <SearchPanel
        apiBasePath="/api/canvas"
        memoryPath="~/.terminal-buddy/history.mv2"
        renderResult={(result) => <CommandCard command={result} />}
      />
      
      <TimelinePanel
        apiBasePath="/api/canvas"
        memoryPath="~/.terminal-buddy/history.mv2"
        onSessionSelect={(session) => handleSessionSelect(session)}
      />
      
      <MemoryStats
        apiBasePath="/api/canvas"
        memoryPath="~/.terminal-buddy/history.mv2"
      />
    </div>
  );
}
```

---

## UI Design Implications

### 1. tldraw Whiteboard + Memvid Integration
The endless whiteboard should visualize Memvid-stored data, not mock sessions:

```tsx
// CreatorWhiteboard.tsx (updated)
interface MemvidSession {
  id: string;
  title: string;
  started_at: string;
  ended_at: string;
  command_count: number;
  status: 'success' | 'error' | 'warning';
  // Plus all Memvid metadata
}

export const CreatorWhiteboard: React.FC<{ 
  memvidSessions?: MemvidSession[] 
}> = ({ memvidSessions }) => {
  // Use real Memvid sessions instead of sample data
  const sessions = memvidSessions || [];
  
  return (
    <Tldraw>
      {/* Render Memvid sessions as nodes */}
      {sessions.map(session => (
        <SessionNode key={session.id} session={session} />
      ))}
    </Tldraw>
  );
};
```

### 2. Topics View Integration
The folder tree should use Memvid's topic system:

```tsx
// TopicsPanel.tsx (updated)
interface MemvidTopic {
  id: string;
  name: string;
  sessionIds: string[];
  lastActive: string;
  // Memvid topic metadata
}

export const TopicsPanel: React.FC<{ 
  memvidTopics?: MemvidTopic[] 
}> = ({ memvidTopics }) => {
  // Use Memvid topics instead of manual topic management
  const topics = memvidTopics || [];
  
  return (
    <div className="topics-panel">
      {topics.map(topic => (
        <TopicFolder key={topic.id} topic={topic} />
      ))}
    </div>
  );
};
```

### 3. Creator Corner Template System
Templates should include Memvid configuration:

```json
// .buddy-template format (updated)
{
  "name": "Dyslexia Focus - Dark",
  "version": "1.0",
  "author": "dylaroo",
  "memvid_config": {
    "memory_path": "~/.terminal-buddy/history.mv2",
    "search_index": "semantic",
    "timeline_resolution": "minute",
    "auto_tagging": true
  },
  "appearance": {
    "theme": "dyslexia-dark",
    "font_family": "OpenDyslexic"
  },
  "components": {
    "enabled": ["timeline", "command_card", "whiteboard", "memvid-search"]
  }
}
```

---

## Implementation Roadmap

### Phase 1: Memvid Foundation (Immediate)
1. ✅ Install Memvid dependencies
2. ✅ Configure `.mv2` storage path
3. ✅ Integrate basic Memvid components (SearchPanel, TimelinePanel)
4. ✅ Replace sample data with Memvid API calls

### Phase 2: Enhanced Journal Features (Week 2)
1. ✅ Memvid-powered Topics view
2. ✅ RAG Chat for Explain button
3. ✅ Memory Statistics dashboard
4. ✅ Cross-surface sync (Tauri app ↔ MCP iframe)

### Phase 3: Creator Corner Integration (Week 3)
1. ✅ tldraw whiteboard visualizing Memvid data
2. ✅ Template system with Memvid configuration
3. ✅ AI Diagram generation from Memvid sessions
4. ✅ Excalidraw MCP integration for AI diagrams

---

## Why This Approach Wins

### Alignment with PRODUCT_SPEC_V2.md
- ✅ Section 12.3: "Memvid Canvas powers the journal through..."
- ✅ Section 3.2: "The journal is an always-on history log"
- ✅ Section 3.3: "Teachable Moments (Explain Button)"
- ✅ Section 8.2: "Auto-Grouping into Topics"

### Technical Advantages
- **Single source of truth**: All journal data in `.mv2` files
- **Semantic intelligence**: Search finds "that Docker thing" without exact commands
- **Correlated data**: Commands linked to filesystem changes + system logs
- **Cross-platform**: Same journal in Tauri app, MCP iframe, VS Code extension

### User Experience Benefits
- **Intelligent journal**: Not just a text log, but a connected knowledge base
- **Natural language search**: "What was that command from Tuesday?"
- **Visual timeline**: Scrub through terminal history visually
- **Explain button**: Plain-language explanations from correlated kernel data

---

## Next Steps

To proceed with Memvid integration:

1. **Confirm Memvid installation**: Do you have Memvid dependencies installed?
2. **Verify `.mv2` storage**: Is `~/.terminal-buddy/history.mv2` the correct path?
3. **API endpoints**: Do you have the Memvid API endpoints configured?

Once confirmed, I can help you:
- Replace sample data with Memvid API calls
- Integrate Memvid components into existing UI
- Update Creator Corner templates to include Memvid configuration
- Connect tldraw whiteboard to Memvid session data

The foundation is ready - Memvid is indeed the memory engine that makes Terminal Buddy's journal intelligent rather than just a text log.
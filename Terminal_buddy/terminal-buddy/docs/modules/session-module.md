# Session Module

**Module ID:** `session`  
**Status:** Core (Required)  
**Location:** `buddy-app/src/modules/session/`

---

## 1. Overview

The Session module is the **primary interface** for Terminal Buddy. It replaces the traditional terminal-first paradigm with a session/notebook paradigm where the terminal is embedded within a rich history and context system.

### 1.1 Purpose
deep research on better semantic search and recalling!!!!
The Session module provides:
- **Session-based history** organized by date and subject
- **Three viewing modes:** Timeline, Topics, and Search
- **Command cards** with Explain, Re-run, and Add Note actions
- **Auto-titling and topic grouping** powered by the daemon
- **User annotations** for building a personal knowledge base

### 1.2 Key Principle

> "history if fundemental on being civilized. ;)

The Session view is not a sidebar to the terminal. **The terminal is embedded in the Session view.** This inversion is the core product wedge.

---

## 2. Architecture

### 2.1 Module Structure

```
modules/session/
├── index.ts                    # Module registration
├── SessionPanel.tsx            # Main panel component
├── views/
│   ├── TimelineView.tsx        # Chronological view
│   ├── TopicsView.tsx          # Grouped by subject
│   └── SearchView.tsx          # Semantic search
├── components/
│   ├── CommandCard.tsx         # Individual command display
│   ├── SessionCard.tsx         # Session container
│   ├── ExplainPanel.tsx        # Explanation display
│   └── NoteEditor.tsx          # User note input/display
├── hooks/
│   ├── useSessions.ts          # Session data fetching
│   ├── useExplain.ts           # Explain button logic
│   └── useNotes.ts             # Note CRUD operations
└── stories/
    ├── CommandCard.stories.tsx
    ├── SessionCard.stories.tsx
    └── SessionPanel.stories.tsx
```

### 2.2 Dependencies

| Dependency | Purpose |
|------------|---------|
| `@memvid/canvas-react` | Semantic search, timeline dashboard |
| `buddy-daemon` (via MCP) | Session data, explanations, notes |
| `@radix-ui/*` | Accessible UI primitives |
| `tailwindcss` | Styling with CSS variables |

### 2.3 Data Flow

```
┌─────────────────┐
│  JournalPanel   │ add ons like sandbox
└────────┬────────┘
         │ MCP stdio
         v
┌─────────────────┐
│  Buddy Daemon   │
│  (MCP Server)   │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Memvid .mv2    │
│  + SQLite       │
└─────────────────┘
```

**Key:** The Journal(dot use Jurnal ) module **never** accesses SQLite directly. All data flows through MCP tools.

---

## 3. Module Registration

### 3.1 Registration Code

```typescript
// modules/session/index.ts
import { registry } from '../registry';
import { SessionPanel } from './SessionPanel';
import { BookOpenIcon } from 'lucide-react';

registry.register({
  id: 'session',
  name: 'Session History',
  description: 'Timeline and topics of your terminal history',
  component: SessionPanel,
  icon: BookOpenIcon,
  
  // Where it can live in the layout
  allowedRegions: ['left', 'center'],
  
  // Requirements
  requiresDaemon: true,
  requiresVoice: false,
  
  // Config schema for Creator Corner
  configSchema: {
    type: 'object',
    properties: {
      defaultView: { 
        type: 'string', 
        enum: ['timeline', 'topics', 'search'],
        default: 'timeline'
      },
      autoGroup: { 
        type: 'boolean',
        default: true,
        description: 'Automatically group sessions into topics'
      },
      showSystemImpact: {
        type: 'boolean',
        default: true,
        description: 'Show filesystem and system changes in command cards'
      },
      explainDetailLevel: {
        type: 'string',
        enum: ['brief', 'detailed', 'educational'],
        default: 'detailed'
      }
    }
  }
});
```

---

## 4. Views

### 4.1 Timeline View (Default)

**Purpose:** Chronological organization by date.

**Layout:**
```
+--------------------------------------------------+
|  [ Timeline ]    [ Topics ]  (project)   [ Search ] workspaces language.... more if choose to not locked in          |
|  ================================================  |
|                                                    |
|  Feb 22, 2026                                      |
|  ------------------------------------------------  |
|                                                    |
|  +- 1:15 PM ------------------------------------+  |
|  | $ cargo build --release                       |  |
|  | OK Compiled buddy-daemon (42s)                |  |
|  | [files] Changed: target/release/buddy-daemon  |  |
|  |                                               |  |
|  | [Explain]  [Re-run]  [Add Note]               |  |
|  +-----------------------------------------------+  |
|                                                    |
|  +- 12:49 PM -----------------------------------+  |
|  | $ cargo test                                  |  |
|  | OK 6 tests passed                             |  |
|  | [files] No filesystem changes                 |  |
|  |                                               |  |
|  | [Explain]  [Re-run]  [Add Note]               |  |
|  +-----------------------------------------------+  |
+--------------------------------------------------+
```

**Implementation:**
```tsx
// views/TimelineView.tsx
export function TimelineView() {
  const { sessions, loading } = useSessions();
  const groupedByDate = groupSessionsByDate(sessions);
  
  return (
    <div className="timeline-view">
      {Object.entries(groupedByDate).map(([date, dateSessions]) => (
        <section key={date} className="timeline-day">
          <h2 className="timeline-date">{formatDate(date)}</h2>
          {dateSessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </section>
      ))}
    </div>
  );
}
```

### 4.2 Topics View   

**Purpose:** Grouped by auto-detected subject.

**Layout:**
```
+--------------------------------------------------+
|                                                    |
|  [folder] Terminal Buddy Daemon (12 sessions)      |
|  +-- Feb 22 - "Phase A completion & tests"         |
|  +-- Feb 22 - "Documentation generation"           |
|  +-- Feb 21 - "MCP server tool wiring"             |
|  +-- Feb 20 - "PTY capture debugging"              |
|                                                    |
|  [folder] BMAD System (8 sessions)                 |
|  +-- Feb 22 - "Agent manifest review"              |
|  +-- Feb 19 - "Workflow engine refactor"           |
|  +-- ...                                           |
|                                                    |
|  [folder] Uncategorized (2 sessions)               |
|  +-- Feb 22 - "System updates & apt"               |
|  +-- Feb 18 - "SSH key setup"                      |
|                                                    |
+--------------------------------------------------+
```

**Implementation:**
```tsx
// views/TopicsView.tsx
export function TopicsView() {
  const { topics, sessions } = useTopics();
  
  return (
    <div className="topics-view">
      {topics.map(topic => (
        <TopicFolder 
          key={topic.id} 
          topic={topic}
          sessions={sessions.filter(s => s.topics.includes(topic.id))}
        />
      ))}
      <UncategorizedFolder 
        sessions={sessions.filter(s => s.topics.length === 0)}
      />
    </div>
  );
}
```

### 4.3 Search View

**Purpose:** Semantic full-text search powered by Memvid Canvas.

**Layout:**
```
+--------------------------------------------------+
|  [search] Search history...          [date] [tag]  |
+--------------------------------------------------+
|                                                    |
|  Results for "that build error from last week"     |
|                                                    |
|  +- Feb 15, 2:34 PM ----------------------------+  |
|  | $ cargo build                                 |  |
|  | Error: couldn't compile dependency            |  |
|  | [Explain] [Re-run] [Add Note]                 |  |
|  +-----------------------------------------------+  |
|                                                    |
|  +- Feb 14, 11:22 AM ---------------------------+  |
|  | $ npm install                                 |  |
|  | Error: EACCES permission denied               |  |
|  | [Explain] [Re-run] [Add Note]                 |  |
|  +-----------------------------------------------+  |
+--------------------------------------------------+
```

**Implementation:**
```tsx
// views/SearchView.tsx
import { SearchPanel } from '@memvid/canvas-react/components';

export function SearchView() {
  return (
    <div className="search-view">
      <SearchPanel
        apiBasePath="/api/canvas"
        memoryPath="~/.terminal-buddy/history.mv2"
        renderResult={(result) => (
          <CommandCard command={result} />
        )}
        filters={['date', 'topic', 'project']}
      />
    </div>
  );
}
```

---

## 5. Core Components

### 5.1 CommandCard

**Purpose:** Display individual command with context and actions.

**Props:**
```typescript
interface CommandCardProps {
  command: string;
  output: string;
  timestamp: number;
  sessionId: string;
  exitCode: number | null;
  filesystemChanges: FileChange[];
  systemImpact: SystemImpact;
  explanation?: Explanation;
  userNote?: string;
  theme?: ThemeName;
}
```

**Storybook Example:**
```tsx
// components/CommandCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CommandCard } from './CommandCard';

const meta: Meta<typeof CommandCard> = {
  component: CommandCard,
  argTypes: {
    theme: { 
      control: 'select', 
      options: ['dyslexia-dark', 'dyslexia-light', 'high-contrast'] 
    },
  }
};

export default meta;
type Story = StoryObj<typeof CommandCard>;

export const Default: Story = {
  args: {
    command: 'cargo build --release',
    output: 'Compiling buddy-daemon v0.1.0...\nOK Compiled (42s)',
    timestamp: Date.now(),
    sessionId: 'session-123',
    exitCode: 0,
    filesystemChanges: [
      { path: 'target/release/buddy-daemon', type: 'created' }
    ],
    systemImpact: { cpu: 45.2, memory: 128, processes: [] },
    theme: 'dyslexia-dark',
  }
};

export const WithError: Story = {
  args: {
    ...Default.args,
    command: 'docker-compose up',
    output: 'Error: Port 8080 already in use',
    exitCode: 1,
    explanation: {
      summary: 'Port conflict detected',
      detail: 'Nginx is already running on port 8080',
      suggestion: 'Run sudo lsof -i :8080 to confirm'
    }
  }
};

export const WithNote: Story = {
  args: {
    ...Default.args,
    userNote: 'This fixed the build issue from yesterday'
  }
};
```

### 5.2 SessionCard

**Purpose:** Container for all commands in a session.

**Props:**
```typescript
interface SessionCardProps {
  session: {
    id: string;
    startedAt: number;
    endedAt: number;
    autoTitle: string;
    userTitle?: string;
    workingDirectory: string;
    commands: Command[];
    topics: string[];
  };
  expanded?: boolean;
  onToggle?: () => void;
}
```

### 5.3 ExplainPanel

**Purpose:** Display AI-generated explanation with correlated data.

**Data Source:** MCP tool `buddy_explain` or `buddy_get_teachable_moment`

**Implementation:**
```tsx
// components/ExplainPanel.tsx
export function ExplainPanel({ commandId }: { commandId: string }) {
  const { explanation, loading, error } = useExplain(commandId);
  
  if (loading) return <ExplanationSkeleton />;
  if (error) return <ErrorDisplay error={error} />;
  
  return (
    <div className="explain-panel">
      <h3>What happened</h3>
      <p>{explanation.summary}</p>
      
      <h4>System impact</h4>
      <ul>
        {explanation.filesystemChanges.map(change => (
          <li key={change.path}>{change.type}: {change.path}</li>
        ))}
      </ul>
      
      <h4>Why it matters</h4>
      <p>{explanation.context}</p>
      
      {explanation.suggestion && (
        <>
          <h4>What to do next</h4>
          <p>{explanation.suggestion}</p>
        </>
      )}
    </div>
  );
}
```

---

## 6. MCP Integration

### 6.1 Required MCP Tools

| Tool | Purpose | Status |
|------|---------|--------|
| `buddy_sessions` | List and search sessions | Working |
| `buddy_history` | Query command history | Working |
| `buddy_explain` | Get command explanation | Stub |
| `buddy_add_note` | Add user note | Planned |
| `buddy_session_classify` | Auto-title and topic assignment | Planned |
| `buddy_topics` | List, create, rename, merge topics | Planned |
| `buddy_search_semantic` | Semantic search | Planned |

### 6.2 Example MCP Calls

```typescript
// hooks/useSessions.ts
export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchSessions() {
      const result = await mcp.call('buddy_sessions', {
        limit: 100,
        includeCommands: true,
        includeTopics: true
      });
      setSessions(result.sessions);
      setLoading(false);
    }
    fetchSessions();
  }, []);
  
  return { sessions, loading };
}

// hooks/useExplain.ts
export function useExplain(commandId: string) {
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [loading, setLoading] = useState(false);
  
  const explain = async () => {
    setLoading(true);
    const result = await mcp.call('buddy_explain', {
      commandId,
      detailLevel: 'detailed',
      includeSystemData: true
    });
    setExplanation(result.explanation);
    setLoading(false);
  };
  
  return { explanation, loading, explain };
}
```

---

## 7. Accessibility

### 7.1 Requirements

- **Full keyboard navigation** - Radix UI focus management
- **Screen reader support** - ARIA labels on all interactive elements
- **High contrast mode** - WCAG AAA compliance
- **Reduced motion** - Respect `prefers-reduced-motion`
- **Dyslexia-friendly fonts** - OpenDyslexic, Atkinson Hyperlegible, Lexend

### 7.2 Implementation

```tsx
// components/CommandCard.tsx (excerpt)
export function CommandCard({ command, explanation, theme }: CommandCardProps) {
  return (
    <article 
      className={`command-card theme-${theme}`}
      role="article"
      aria-label={`Command: ${command}`}
    >
      <div className="command-content">
        <code aria-label="Command executed">$ {command}</code>
        <pre aria-label="Command output">{output}</pre>
      </div>
      
      <div className="command-actions">
        <button
          onClick={onExplain}
          aria-label="Explain what this command did"
          aria-expanded={isExplainOpen}
        >
          <SparklesIcon aria-hidden="true" />
          Explain
        </button>
        
        <button
          onClick={onRerun}
          aria-label="Run this command again"
        >
          <RefreshIcon aria-hidden="true" />
          Re-run
        </button>
        
        <button
          onClick={onAddNote}
          aria-label="Add a note to this command"
          aria-pressed={hasNote}
        >
          <NoteIcon aria-hidden="true" />
          Add Note
        </button>
      </div>
      
      {explanation && (
        <ExplainPanel 
          explanation={explanation}
          role="region"
          aria-label="Command explanation"
        />
      )}
    </article>
  );
}
```

---

## 8. Testing

### 8.1 Unit Tests

```tsx
// components/CommandCard.test.tsx
import { render, screen } from '@testing-library/react';
import { CommandCard } from './CommandCard';

describe('CommandCard', () => {
  it('renders command and output', () => {
    render(
      <CommandCard
        command="cargo build"
        output="Compiled successfully"
        timestamp={Date.now()}
        sessionId="123"
        exitCode={0}
        filesystemChanges={[]}
        systemImpact={{ cpu: 10, memory: 64, processes: [] }}
      />
    );
    
    expect(screen.getByText('$ cargo build')).toBeInTheDocument();
    expect(screen.getByText('Compiled successfully')).toBeInTheDocument();
  });
  
  it('shows explain button', () => {
    // ... test implementation
  });
  
  it('displays explanation when provided', () => {
    // ... test implementation
  });
});
```

### 8.2 Storybook Tests

- Visual regression testing via Chromatic
- Accessibility testing via axe-storybook
- Theme switching tests
- Keyboard navigation tests

---

## 9. Creator Corner Integration

### 9.1 Configurable Properties

The Journal module exposes these properties to Creator Corner:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `defaultView` | enum | `timeline` | Default view on module load |
| `autoGroup` | boolean | `true` | Auto-group sessions into topics |
| `showSystemImpact` | boolean | `true` | Show filesystem/system changes |
| `explainDetailLevel` | enum | `detailed` | Brief, detailed, or educational |

### 9.2 Live Preview

Creator Corner provides a live preview of Journal configuration changes:

```tsx
// In Creator Corner
<JournalPanel 
  config={{
    defaultView: 'timeline',
    autoGroup: true,
    showSystemImpact: false,
    explainDetailLevel: 'brief'
  }}
  previewData={sampleSessions}
/>
```

---

## 10. Performance

### 10.1 Optimization Strategies

- **Virtual scrolling** for long session lists (react-window)
- **Lazy loading** of command details on expand
- **Memoization** of expensive computations (useMemo, useCallback)
- **Debounced search** to reduce MCP calls
- **Incremental loading** with cursor-based pagination

### 10.2 Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial load time | < 500ms | Time to first session rendered |
| Search response | < 200ms | MCP call to results displayed |
| Explain latency | < 2s | Button click to explanation shown |
| Scroll performance | 60fps | FPS during timeline scrubbing |

---

## 11. Future Enhancements

### 11.1 Planned Features

- **Session comparison** - Side-by-side diff of two sessions
- **Export to Markdown** - Export session as documentation
- **Session templates** - Save and replay common session patterns
- **Collaborative notes** - Share notes across team members
- **Session analytics** - Time spent, commands used, productivity insights

### 11.2 Stretch Goals

- **AI-powered insights** - "You run this command every Monday"
- **Automatic documentation** - Generate README from sessions
- **Session replay** - Watch session playback like a video
- **Integration with GitHub** - Link sessions to PRs/issues

---

## 12. Related Modules

- **Terminal Pane** - Embedded terminal in journal
- **Creator Corner** - Customization of Journal appearance
- **Voice Input** - Voice commands for Journal navigation
- **Component Registry** - Module registration and discovery

---

## 13. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-24 | Initial module specification |

---

*This module document follows the PRODUCT_SPEC_V2.md specification. For implementation details, see the source code in `buddy-app/src/modules/journal/`.*

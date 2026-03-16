# Tech Spec: "The Beacon" Whiteboard & Communication Extension

## Problem Statement
The user is experiencing a breakdown in knowledge persistence because "communication logs are not being read in the documents." There is a need for a high-visibility, "facing-out" interface that proactively notifies the user of new notes, decisions, or action items.

## Concept: The Beacon
A VS Code extension integrated with the **Terminal Buddy** ecosystem. It provides a dedicated Whiteboard View in the sidebar that acts as an "active noticeboard."

### Key Features
1.  **Facing-Out Whiteboard**: A persistent sidebar Webview.
2.  **Traffic Light Status**: 
    - 🟢 **Green**: No new notes.
    - 🟡 **Yellow**: New informational notes.
    - 🔴 **Red**: Action required / High Priority.
3.  **Audio Notification**: A configurable "beep" when status changes.
4.  **Auto-Sync**: Monitors `_bmad-output/BEACON.json`.

## Technical Implementation

### BEACON.json Protocol
```json
{
  "status": "red" | "yellow" | "green",
  "priority": 1 | 2 | 3,
  "title": "Decision Needed",
  "content": "Brief summary of the communication log segment.",
  "timestamp": "2026-02-26T11:26:00Z",
  "beep": true
}
```

### Extension Logic
- **FileSystemWatcher**: Listens for changes to `BEACON.json`.
- **StatusBarItem**: Updates background/icon color.
- **Webview**: Renders Markdown content.

## Immediate Action
1.  Initialize `extensions/terminal-buddy-beacon`.
2.  Create the file watcher service.
3.  Implement the "Beep" command.

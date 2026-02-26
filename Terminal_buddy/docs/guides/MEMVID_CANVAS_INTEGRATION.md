# Memvid Canvas Integration Guide

> **Date:** 2026-02-25
> **Status:** Integration Complete - Ready for Testing
> **SDK Version:** @memvid/canvas-react v2.0.146

---

## Overview

This guide explains how Memvid Canvas is integrated into Terminal Buddy to provide:
- **Semantic Search** - Search across terminal history with natural language
- **RAG Chat** - Chat with your terminal history using correlated data
- **Timeline Dashboard** - Visual timeline scrubbing and session replay
- **Memory Statistics** - Storage, session counts, topic distribution

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  TERMINAL BUDDY (Tauri + React)                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Frontend (Vite)                                │   │
│  │  - CanvasShell component                              │   │
│  │  - Journal View                                       │   │
│  │  - Creator Corner                                     │   │
│  └───────────────────┬──────────────────────────────────┘   │
│                      │ HTTP (localhost:3456)                 │
│  ┌───────────────────▼──────────────────────────────────┐   │
│  │  Canvas API Server (Node.js)                          │   │
│  │  - @memvid/canvas-server                              │   │
│  │  - /api/canvas/* endpoints                            │   │
│  └───────────────────┬──────────────────────────────────┘   │
│                      │                                       │
│  ┌───────────────────▼──────────────────────────────────┐   │
│  │  Buddy Daemon (Rust, MCP Server)                      │   │
│  │  - buddy_history                                      │   │
│  │  - buddy_sessions                                     │   │
│  │  - buddy_run                                          │   │
│  └───────────────────┬──────────────────────────────────┘   │
│                      │                                       │
│  ┌───────────────────▼──────────────────────────────────┐   │
│  │  ~/.terminal-buddy/                                   │   │
│  │  - history.mv2 (Memvid memory file)                   │   │
│  │  - sessions.db (SQLite)                               │   │
│  │  - buddy.toml (config)                                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Installation

### 1. Install Dependencies

```bash
cd terminal-buddy/buddy-app
npm install
```

This installs:
- `@memvid/canvas-react` - React components
- `@memvid/canvas-core` - Core engine and utilities
- `@memvid/canvas-server` - Server-side handlers

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API key:

```bash
# Choose one provider:
OPENROUTER_API_KEY=your_key_here      # Recommended (multiple models)
ANTHROPIC_API_KEY=your_key_here       # Claude
OPENAI_API_KEY=your_key_here          # GPT-4
GOOGLE_API_KEY=your_key_here          # Gemini
```

### 3. Configure Canvas Settings

The `.canvas-settings.json` file is already configured with:

```json
{
  "memoryPath": "~/.terminal-buddy/history.mv2",
  "llmProvider": "openrouter",
  "llmModel": "anthropic/claude-sonnet-4-5",
  "appName": "Terminal Buddy",
  "themeMode": "dark",
  "primaryColor": "#3B82F6"
}
```

---

## Running the Integration

### Start the Canvas Server

```bash
cd terminal-buddy/buddy-app
npm run canvas-server
```

You should see:
```
[Canvas Server] Configuration:
  Provider: openrouter
  Memory Path: /home/user/.terminal-buddy/history.mv2
  Port: 3456
[Canvas Server] Listening on http://localhost:3456
```

### Start the Tauri App

In a separate terminal:

```bash
cd terminal-buddy/buddy-app
npm run tauri dev
```

### Start the Buddy Daemon (if not running)

```bash
cd terminal-buddy/buddy-daemon
cargo run
```

---

## Canvas Components Used

### CanvasShell

The main Canvas application shell - provides the full Canvas experience:

```tsx
import { CanvasShell } from '@memvid/canvas-react/components';

<CanvasShell apiBasePath="http://localhost:3456/api/canvas" />
```

Features:
- Chat interface with memory context
- Search panel with semantic + lexical search
- Dashboard with memory statistics
- File upload for ingesting documents
- Settings panel for configuration

### Individual Components (Available for Custom Integration)

```tsx
import {
  ChatInput,
  ChatMessage,
  ChatMessages,
  Sources,
  SettingsPanel,
  SetupWizard,
  useCanvas
} from '@memvid/canvas-react/components';
```

---

## API Endpoints

The Canvas server exposes these endpoints at `http://localhost:3456/api/canvas/`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/canvas/chat` | POST | Chat with memory context (RAG) |
| `/api/canvas/search` | POST | Search documents (semantic + lexical) |
| `/api/canvas/memory` | GET | Memory info and stats |
| `/api/canvas/stats` | GET | Detailed statistics |
| `/api/canvas/settings` | GET/POST | Settings management |

---

## Data Flow

### 1. Terminal Session Recording

```
User runs command → Buddy Daemon (MCP) → Records to:
  - sessions.db (SQLite) - structured data
  - history.mv2 (Memvid) - semantic memory
```

### 2. Search Flow

```
User searches → Canvas React → Canvas Server → Memvid SDK
  → Semantic search in .mv2 file → Returns ranked results
```

### 3. Chat/Explain Flow

```
User asks question → Canvas React → Canvas Server
  → Retrieves context from .mv2 → LLM generates answer
  → Returns with citations
```

---

## Configuration

### Memory Path

The `.mv2` file location is configured in two places:

**1. `.canvas-settings.json`:**
```json
{
  "memoryPath": "~/.terminal-buddy/history.mv2"
}
```

**2. `buddy-daemon/src/config.rs`:**
```rust
pub struct StorageConfig {
    pub data_dir: String,
    pub memory_path: Option<String>,
}
```

### LLM Provider

Change the provider in `.canvas-settings.json`:

```json
{
  "llmProvider": "anthropic",  // or "openai", "google", "openrouter"
  "llmModel": "claude-sonnet-4-20250514"
}
```

### Theme Customization

Override CSS variables in `App.css`:

```css
:root {
  --canvas-primary: #3B82F6;
  --canvas-accent: #22C55E;
  --canvas-background: #0F172A;
  --canvas-surface: #1E293B;
  --canvas-border: #334155;
  --canvas-text: #F1F5F9;
  --canvas-muted: #94A3B8;
}
```

---

## Testing the Integration

### 1. Verify Canvas Server is Running

```bash
curl http://localhost:3456/api/canvas/stats
```

Expected response:
```json
{
  "status": "ok",
  "memoryPath": "/home/user/.terminal-buddy/history.mv2",
  "frames": 0,
  "size": 0
}
```

### 2. Test Search

```bash
curl -X POST http://localhost:3456/api/canvas/search \
  -H "Content-Type: application/json" \
  -d '{"query": "docker", "limit": 5}'
```

### 3. Test Chat

```bash
curl -X POST http://localhost:3456/api/canvas/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "What commands did I run today?"}]}'
```

### 4. Test in UI

1. Open Terminal Buddy app
2. Click "Canvas" in the top navigation
3. Try searching for a command
4. Try chatting with your history

---

## Troubleshooting

### Canvas Server Won't Start

**Error:** `Cannot find module '@memvid/canvas-server'`

**Solution:**
```bash
cd terminal-buddy/buddy-app
npm install
```

**Error:** `EADDRINUSE: address already in use :::3456`

**Solution:** Change the port in `canvas-server.js`:
```javascript
const PORT = process.env.CANVAS_PORT || 3457;  // Use different port
```

### API Calls Fail

**Error:** `Failed to fetch`

**Check:**
1. Canvas server is running: `curl http://localhost:3456/api/canvas/stats`
2. API key is set in `.env.local`
3. Memory file path exists

**Error:** `Missing API key`

**Solution:** Set the appropriate environment variable in `.env.local`:
```bash
OPENROUTER_API_KEY=sk-or-...
```

### Memory File Not Found

**Error:** `ENOENT: no such file or directory`

**Solution:** The `.mv2` file is created automatically on first use. Ensure:
1. `~/.terminal-buddy/` directory exists
2. App has write permissions

---

## Future Enhancements

### Phase 1: Basic Integration ✅ (Current)
- [x] Canvas server running
- [x] CanvasShell component integrated
- [x] Configuration files created

### Phase 2: Deep Integration (Next)
- [ ] Sync buddy-daemon sessions with Memvid .mv2 format
- [ ] Custom command card rendering in Canvas search results
- [ ] Timeline panel using Memvid's temporal navigation
- [ ] Explain button powered by Canvas RAG chat

### Phase 3: Advanced Features
- [ ] File upload to ingest documentation
- [ ] Custom dashboard widgets for terminal statistics
- [ ] Voice input integration with Canvas chat
- [ ] Community template sharing via Canvas

---

## References

- [Memvid Canvas SDK Reference](../../docs/references/REF_MEMVID_CANVAS_SDK.md)
- [Product Spec v2 - Section 12.3](../../docs/specs/PRODUCT_SPEC_V2.md#123-memvid-canvas-integration)
- [Memvid Documentation](https://docs.memvid.com/canvas)
- [npm: @memvid/canvas-react](https://www.npmjs.com/package/@memvid/canvas-react)

---

## Quick Start Commands

```bash
# 1. Install dependencies
cd terminal-buddy/buddy-app
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local and add your API key

# 3. Start Canvas server
npm run canvas-server

# 4. In another terminal, start Tauri app
npm run tauri dev

# 5. Click "Canvas" in the top navigation
```

---

*Last updated: 2026-02-24*

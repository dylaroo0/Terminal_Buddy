/**
 * Canvas API Server for Terminal Buddy
 * 
 * This standalone server provides the Canvas API endpoints for the Tauri app.
 * It uses @memvid/canvas-server to handle requests and connects to the .mv2 memory file.
 */

import { 
  createChatHandler,
  createRecallHandler,
  createMemoryHandler,
  createSearchHandler,
  createStatsHandler,
  createSettingsHandler
} from '@memvid/canvas-server/next';
import { loadSettings, getApiKey, resolvePath, createMemoryClient } from '@memvid/canvas-core';
import { createServer } from 'http';
import { parse } from 'url';

// Configuration
const PORT = process.env.CANVAS_PORT || 3456;
const basePath = process.cwd();

// Load settings
const settings = loadSettings(basePath);
const provider = settings?.llmProvider || 'openrouter';
const memoryPath = resolvePath(
  settings?.memoryPath || './data/history.mv2',
  basePath
);

console.log('[Canvas Server] Configuration:');
console.log(`  Provider: ${provider}`);
console.log(`  Memory Path: ${memoryPath}`);
console.log(`  Port: ${PORT}`);

// Canvas config
const canvasConfig = {
  llm: {
    provider,
    apiKey: getApiKey(provider) || process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY || '',
    model: settings?.llmModel || undefined,
  },
  memory: memoryPath,
};

// Create individual handlers
const handlers = {
  chat: createChatHandler({ config: canvasConfig, basePath }),
  recall: createRecallHandler({ config: canvasConfig, basePath }),
  memory: createMemoryHandler({ config: canvasConfig, basePath }),
  search: createSearchHandler({ config: canvasConfig, basePath }),
  stats: createStatsHandler({ config: canvasConfig, basePath }),
  settings: createSettingsHandler({ config: canvasConfig, basePath }),
};

// Create HTTP server
const server = createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`[Canvas Server] ${req.method} ${pathname}`);

  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // Convert Node.js request to Web API Request
    const body = await new Promise((resolve) => {
      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    });

    const webRequest = new Request(`http://localhost:${PORT}${req.url}`, {
      method: req.method,
      headers: new Headers(req.headers),
      body: req.method !== 'GET' && req.method !== 'HEAD' ? body : undefined,
    });

    // Route to appropriate handler based on path
    let response;
    const pathParts = pathname.split('/').filter(p => p);
    const lastPart = pathParts[pathParts.length - 1];
    
    console.log(`[Canvas Server] Routing to: ${lastPart}`);
    
    if (lastPart === 'chat' || pathname.includes('/chat')) {
      response = await handlers.chat(webRequest);
    } else if (lastPart === 'recall' || pathname.includes('/recall')) {
      response = await handlers.recall(webRequest);
    } else if (lastPart === 'memory' || pathname.includes('/memory')) {
      response = await handlers.memory(webRequest);
    } else if (lastPart === 'search' || pathname.includes('/search')) {
      response = await handlers.search(webRequest);
    } else if (lastPart === 'stats' || pathname.includes('/stats')) {
      response = await handlers.stats(webRequest);
    } else if (lastPart === 'settings' || pathname.includes('/settings')) {
      response = await handlers.settings(webRequest);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found', pathname }));
      return;
    }
    
    console.log(`[Canvas Server] Response status: ${response.status}`);
    
    // Send response
    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    
    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    
    res.end();
  } catch (error) {
    console.error('[Canvas Server] Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`[Canvas Server] Listening on http://localhost:${PORT}`);
  console.log(`[Canvas Server] API endpoints available at /api/canvas/*`);
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('[Canvas Server] Shutting down...');
  server.close(() => {
    console.log('[Canvas Server] Closed');
    process.exit(0);
  });
});

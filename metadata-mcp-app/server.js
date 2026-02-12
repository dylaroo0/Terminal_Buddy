#!/usr/bin/env node
// MCP Metadata Tagging Server
// Uses Linux xattrs (extended attributes) to tag files

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { execSync } from "child_process";

// Create MCP server
const server = new Server(
  {
    name: "metadata-tagger",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler("tools/list", async () => {
  return {
    tools: [
      {
        name: "tag_priority",
        description: "Tag a file with priority level (critical, high, medium, low)",
        inputSchema: {
          type: "object",
          properties: {
            filepath: {
              type: "string",
              description: "Full path to the file",
            },
            priority: {
              type: "string",
              enum: ["critical", "high", "medium", "low"],
              description: "Priority level",
            },
          },
          required: ["filepath", "priority"],
        },
      },
      {
        name: "tag_secret",
        description: "Add a secret note to a file (visible only to you)",
        inputSchema: {
          type: "object",
          properties: {
            filepath: {
              type: "string",
              description: "Full path to the file",
            },
            note: {
              type: "string",
              description: "Your secret note",
            },
          },
          required: ["filepath", "note"],
        },
      },
      {
        name: "read_metadata",
        description: "Read all metadata tags from a file",
        inputSchema: {
          type: "object",
          properties: {
            filepath: {
              type: "string",
              description: "Full path to the file",
            },
          },
          required: ["filepath"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "tag_priority") {
    try {
      execSync(`setfattr -n user.priority -v "${args.priority}" "${args.filepath}"`);
      return {
        content: [
          {
            type: "text",
            text: `✅ Tagged ${args.filepath} as ${args.priority}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Failed: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  if (name === "tag_secret") {
    try {
      execSync(`setfattr -n user.secret -v "${args.note}" "${args.filepath}"`);
      return {
        content: [
          {
            type: "text",
            text: `🔒 Secret note added to ${args.filepath}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Failed: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  if (name === "read_metadata") {
    try {
      const output = execSync(`getfattr -d "${args.filepath}" 2>/dev/null`).toString();
      const metadata = {};
      
      // Parse xattr output
      const lines = output.split('\n');
      for (const line of lines) {
        const match = line.match(/user\.(\w+)="(.+)"/);
        if (match) {
          metadata[match[1]] = match[2];
        }
      }

      return {
        content: [
          {
            type: "text",
            text: `📋 Metadata for ${args.filepath}:\n${JSON.stringify(metadata, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `No metadata found for ${args.filepath}`,
          },
        ],
      };
    }
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);

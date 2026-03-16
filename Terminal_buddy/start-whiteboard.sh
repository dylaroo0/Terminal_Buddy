#!/bin/bash
# Launch Terminal Buddy Whiteboard

echo "🚀 Starting Terminal Buddy Whiteboard..."

# Step 1: Start Excalidraw MCP server (background)
echo "📦 Starting Excalidraw MCP server..."
cd /home/dylaroo/projects/Terminal_buddy/data/excalidraw-mcp-0.3.2
npm install > /dev/null 2>&1 &
EXCALIDRAW_PID=$!

# Step 2: Start Buddy App
echo "💻 Starting Terminal Buddy app..."
cd /home/dylaroo/projects/Terminal_buddy/terminal-buddy/buddy-app
npm run dev > /dev/null 2>&1 &
BUDDY_PID=$!

echo "✅ Whiteboard ready in 10 seconds!"
echo "🎯 Open Creator Corner → Gazebo Whiteboard"
echo "🎨 Draw your gazebo with color zones!"
echo "🔔 Traffic light notifications enabled"

# Wait for services to start
sleep 10

echo "🎉 You can now draw the Gazebo! Press Ctrl+C to stop."

# Keep alive
wait $EXCALIDRAW_PID $BUDDY_PID
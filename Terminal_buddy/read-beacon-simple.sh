#!/bin/bash

# Terminal Buddy Beacon Reader (Simple Version)
# Reads the BEACON.json out loud
# Usage: ./read-beacon-simple.sh

BEACON_FILE="_bmad-output/BEACON.json"

echo "🔔 Reading Terminal Buddy Beacon..."
echo "===================================="
echo ""

# Just display the raw JSON for now
if [ -f "$BEACON_FILE" ]; then
    echo "✅ Beacon file found!"
    echo ""
    cat "$BEACON_FILE"
    echo ""
    echo ""
    echo "===================================="
    echo "📖 To hear this read out loud, install eSpeak:"
    echo "   sudo apt install espeak"
    echo ""
    echo "Then run:"
    echo "   espeak -v en \"$(cat $BEACON_FILE | grep -o '"content": "[^"]*"' | cut -d'"' -f4)\""
else
    echo "❌ Beacon file not found!"
fi

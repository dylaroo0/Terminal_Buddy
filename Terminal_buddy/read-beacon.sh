#!/bin/bash

# Terminal Buddy Beacon Reader
# Reads the BEACON.json out loud with text-to-speech
# Usage: ./read-beacon.sh

BEACON_FILE="_bmad-output/BEACON.json"

if [ ! -f "$BEACON_FILE" ]; then
    echo "❌ Beacon file not found at $BEACON_FILE"
    exit 1
fi

echo "🔔 Reading Terminal Buddy Beacon..."
echo ""

# Extract fields from JSON
STATUS=$(jq -r '.status' "$BEACON_FILE")
TITLE=$(jq -r '.title' "$BEACON_FILE")
CONTENT=$(jq -r '.content' "$BEACON_FILE")
AUDIO_NOTE=$(jq -r '.audioNote // empty' "$BEACON_FILE")
TIMESTAMP=$(jq -r '.timestamp' "$BEACON_FILE")

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Display status with color
case $STATUS in
    "red")
        echo -e "${RED}🔴 STATUS: RED (Action Required)${NC}"
        ;;
    "yellow")
        echo -e "${YELLOW}🟡 STATUS: Yellow (New Information)${NC}"
        ;;
    "green")
        echo -e "${GREEN}🟢 STATUS: Green (All Good)${NC}"
        ;;
esac

echo ""
echo "📋 **TITLE:** $TITLE"
echo ""
echo "💬 **MESSAGE:**"
echo "$CONTENT"
echo ""

if [ -n "$AUDIO_NOTE" ]; then
    echo "🔊 **AUDIO NOTE:**"
    echo "$AUDIO_NOTE"
    echo ""
fi

echo "⏰ **TIMESTAMP:** $TIMESTAMP"
echo ""

# Try to read it out loud using system TTS
echo "🔈 Reading out loud..."

# Check which TTS system is available
if command -v espeak &> /dev/null; then
    echo "Using eSpeak..."
    espeak -v en "$TITLE. $CONTENT"
elif command -v say &> /dev/null; then
    echo "Using macOS say..."
    say "$TITLE. $CONTENT"
elif command -v festival &> /dev/null; then
    echo "Using Festival..."
    echo "$TITLE. $CONTENT" | festival --tts
else
    echo "⚠️  No TTS system found. Install one of:"
    echo "   - eSpeak: sudo apt install espeak"
    echo "   - Festival: sudo apt install festival"
    echo "   - macOS: 'say' is built-in"
fi

echo ""
echo "✅ Beacon read complete!"

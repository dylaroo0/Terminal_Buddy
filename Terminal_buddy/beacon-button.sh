#!/bin/bash

# Terminal Buddy — One-Button Beacon Report
# Press this button to hear the team's latest report!
# Usage: ./beacon-button.sh

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║   🔔  TERMINAL BUDDY BEACON REPORT  🔔                ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Show the beacon
cat _bmad-output/BEACON.json | grep -E '"title"|"content"|"audioNote"' | sed 's/[{},"]//g'
echo ""
echo "════════════════════════════════════════════════════════"
echo ""
echo "📖 Full beacon: _bmad-output/BEACON.json"
echo "📋 Task list:  docs/current/TASK_LIST_2026-02-26.md"
echo ""
echo "🎉 Ready to build, dylaroo!"
echo ""

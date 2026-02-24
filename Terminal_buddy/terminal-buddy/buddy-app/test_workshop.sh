#!/bin/bash
# Test Creator Corner Workshop setup

echo "Testing Creator Corner Workshop setup..."

# Check files exist
if [ -f "/home/dylaroo/projects/Terminal_buddy/terminal-buddy/buddy-app/src/components/CreatorCornerWorkshop.tsx" ]; then
  echo "✓ CreatorCornerWorkshop.tsx created"
else
  echo "✗ CreatorCornerWorkshop.tsx missing"
  exit 1
fi

if [ -f "/home/dylaroo/projects/Terminal_buddy/terminal-buddy/buddy-app/src/hooks/useMCP.ts" ]; then
  echo "✓ useMCP.ts created"
else
  echo "✗ useMCP.ts missing"
  exit 1
fi

if [ -f "/home/dylaroo/projects/Terminal_buddy/terminal-buddy/buddy-app/src/components/CreatorCornerWorkshop.css" ]; then
  echo "✓ CreatorCornerWorkshop.css created"
else
  echo "✗ CreatorCornerWorkshop.css missing"
  exit 1
fi

# Check App.tsx modifications
if grep -q "🛠️ Workshop" /home/dylaroo/projects/Terminal_buddy/terminal-buddy/buddy-app/src/App.tsx; then
  echo "✓ Workshop button added to navigation"
else
  echo "✗ Workshop button not found in App.tsx"
  exit 1
fi

if grep -q "CreatorCornerWorkshop" /home/dylaroo/projects/Terminal_buddy/terminal-buddy/buddy-app/src/App.tsx; then
  echo "✓ Workshop route added to main content"
else
  echo "✗ Workshop route not found"
  exit 1
fi

echo ""
echo "🎉 Creator Corner Workshop is ready to go!"
echo "To test: Run your Terminal Buddy app and click the '🛠️ Workshop' tab"
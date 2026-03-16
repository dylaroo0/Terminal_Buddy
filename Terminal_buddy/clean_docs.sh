#!/bin/bash
echo "Sweeping documents into one clump..."
mkdir -p docs/archives

# Move all loose root .md files EXCEPT our core trackers
for f in *.md; do
  if [[ -f "$f" && "$f" != "README.md" && "$f" != "DOCS_INDEX.md" && "$f" != "PROJECT_STATUS.md" && "$f" != "NEXT_TASKS.md" && "$f" != "HANDOFF_2026_03_14.md" ]]; then
    mv "$f" docs/archives/
  fi
done

# Move all loose .md files inside the docs/ folder
for f in docs/*.md; do
  if [[ -f "$f" ]]; then
    mv "$f" docs/archives/
  fi
done

echo "Done! All old docs are safely clumped in docs/archives/."
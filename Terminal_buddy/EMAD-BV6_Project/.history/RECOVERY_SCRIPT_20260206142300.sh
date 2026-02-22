#!/bin/bash
# EMAD Recovery & Sync Script
# Created: 2026-02-06
# Purpose: Recover scattered docs and sync GitHub repos

set -e

echo "🔍 EMAD Recovery System"
echo "======================="
echo ""

# 1. RECOVER DOCUMENTS FROM TRASH
echo "📂 Step 1: Checking trash for recoverable files..."
TRASH_DIR="$HOME/.local/share/Trash/files"
RECOVERY_DIR="$HOME/Desktop/RECOVERED-$(date +%Y%m%d)"

if [ -d "$TRASH_DIR" ]; then
    FOLDER_COUNT=$(ls -d "$TRASH_DIR"/*/ 2>/dev/null | wc -l)
    echo "   Found $FOLDER_COUNT folders in trash"
    
    # Ask before recovering
    echo ""
    echo "Create recovery folder at: $RECOVERY_DIR"
    read -p "Recover these files? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        mkdir -p "$RECOVERY_DIR"
        cp -r "$TRASH_DIR"/* "$RECOVERY_DIR/" 2>/dev/null || true
        echo "   ✅ Files recovered to $RECOVERY_DIR"
    else
        echo "   ⏭️  Skipped recovery"
    fi
fi

# 2. TIMESTAMP AND ADD METADATA TO DOCUMENTS
echo ""
echo "📊 Step 2: Document inventory & timestamping..."
MD_COUNT=$(find ~/Desktop -type f -name "*.md" 2>/dev/null | wc -l)
TXT_COUNT=$(find ~/Desktop -type f -name "*.txt" 2>/dev/null | wc -l)
echo "   Markdown files: $MD_COUNT"
echo "   Text files: $TXT_COUNT"
echo "   Total documents: $((MD_COUNT + TXT_COUNT))"
echo ""

# Create timestamped metadata directory
METADATA_DIR="$HOME/Desktop/DOCUMENT_METADATA"
mkdir -p "$METADATA_DIR"

echo "🏷️  Adding timestamps and metadata..."
PROCESSED=0

# Process all markdown and text files
find ~/Desktop -type f \( -name "*.md" -o -name "*.txt" \) 2>/dev/null | while read -r file; do
    BASENAME=$(basename "$file")
    DIRNAME=$(dirname "$file")
    
    # Skip if already timestamped (contains pattern YYYY-MM-DD)
    if [[ "$BASENAME" =~ [0-9]{4}-[0-9]{2}-[0-9]{2} ]]; then
        continue
    fi
    
    # Get file modification time
    MOD_TIME=$(stat -c %y "$file" | cut -d' ' -f1)
    MOD_DATETIME=$(stat -c %y "$file" | cut -d'.' -f1)
    
    # Extract filename without extension
    FILENAME="${BASENAME%.*}"
    EXTENSION="${BASENAME##*.}"
    
    # Create new timestamped filename
    NEW_NAME="${FILENAME}_${MOD_TIME}.${EXTENSION}"
    NEW_PATH="${DIRNAME}/${NEW_NAME}"
    
    # Create metadata sidecar (JSON)
    METADATA_FILE="${METADATA_DIR}/${FILENAME}_${MOD_TIME}.meta.json"
    
    # Extract first line as title/summary
    FIRST_LINE=$(head -n 1 "$file" 2>/dev/null | sed 's/^#* *//' | cut -c1-100)
    FILE_SIZE=$(stat -c %s "$file")
    WORD_COUNT=$(wc -w < "$file" 2>/dev/null || echo "0")
    
    # Generate metadata JSON
    cat > "$METADATA_FILE" << METADATA_EOF
{
  "original_name": "$BASENAME",
  "timestamped_name": "$NEW_NAME",
  "path": "$file",
  "created": "$MOD_DATETIME",
  "modified": "$MOD_DATETIME",
  "size_bytes": $FILE_SIZE,
  "word_count": $WORD_COUNT,
  "type": "$EXTENSION",
  "title": "$FIRST_LINE",
  "tags": [],
  "projects": [],
  "status": "unprocessed"
}
METADATA_EOF
    
    # Rename file to include timestamp
    mv "$file" "$NEW_PATH" 2>/dev/null && {
        PROCESSED=$((PROCESSED + 1))
        echo "   ✓ $BASENAME → $NEW_NAME"
    }
done

echo ""
echo "   ✅ Processed $PROCESSED documents"
echo "   📁 Metadata stored in: $METADATA_DIR"

# 3. LIST YOUR GITHUB REPOS
echo ""
echo "🌐 Step 3: Fetching your GitHub repos..."
echo "   (This may take a minute for ~300 repos...)"

REPOS_FILE="$HOME/Desktop/MY_GITHUB_REPOS.txt"
gh repo list dylaroo0 --limit 500 --json name,url,updatedAt > "$REPOS_FILE.json" 2>&1 || {
    echo "   ⚠️  Could not fetch repos (check: gh auth status)"
    exit 1
}

# Convert JSON to readable list
cat "$REPOS_FILE.json" | jq -r '.[] | "\(.name) - \(.url)"' > "$REPOS_FILE"
REPO_COUNT=$(cat "$REPOS_FILE" | wc -l)

echo "   ✅ Found $REPO_COUNT repositories"
echo "   📝 List saved to: $REPOS_FILE"

# 4. CREATE SYNC DIRECTORY
echo ""
echo "📦 Step 4: Preparing sync location..."
SYNC_DIR="$HOME/Desktop/Projects/GITHUB-SYNC"
mkdir -p "$SYNC_DIR"
echo "   📁 Sync directory: $SYNC_DIR"

# 5. GENERATE CLONE SCRIPT
CLONE_SCRIPT="$HOME/Desktop/CLONE_ALL_REPOS.sh"
cat > "$CLONE_SCRIPT" << 'CLONE_EOF'
#!/bin/bash
# Auto-generated script to clone all your repos
# Run this when you're ready to sync everything

SYNC_DIR="$HOME/Desktop/Projects/GITHUB-SYNC"
mkdir -p "$SYNC_DIR"
cd "$SYNC_DIR"

echo "🔄 Cloning all repositories..."
echo "This will take a while..."
echo ""

CLONE_EOF

# Add clone commands
cat "$REPOS_FILE" | while read line; do
    REPO_NAME=$(echo "$line" | cut -d' ' -f1)
    REPO_URL=$(echo "$line" | cut -d' ' -f3)
    echo "gh repo clone $REPO_URL $REPO_NAME 2>&1 | tee -a clone_log.txt" >> "$CLONE_SCRIPT"
done

echo "" >> "$CLONE_SCRIPT"
echo 'echo "✅ Clone complete! Check clone_log.txt for any errors."' >> "$CLONE_SCRIPT"

chmod +x "$CLONE_SCRIPT"

echo "   ✅ Clone script created: $CLONE_SCRIPT"

# 6. SUMMARY
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ RECOVERY SETUP COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "What you have:"
echo "  • $((MD_COUNT + TXT_COUNT)) documents (now timestamped)"
echo "  • Metadata files: $METADATA_DIR"
echo "  • $REPO_COUNT GitHub repositories (dylaroo0)"
echo "  • $(ls -d $TRASH_DIR/*/ 2>/dev/null | wc -l) items in trash"
echo ""
echo "Next steps:"
echo "  1. Review recovered files: $RECOVERY_DIR"
echo "  2. Check document metadata: $METADATA_DIR"
echo "  3. View repo list: $REPOS_FILE"
echo "  4. When ready to sync all repos, run:"
echo "     bash $CLONE_SCRIPT"
echo ""
echo "⚠️  Note: Cloning ~300 repos will take 30-60 minutes"
echo "        and use several GB of disk space."
echo ""

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

# 2. COUNT YOUR DOCUMENTS
echo ""
echo "📊 Step 2: Document inventory..."
MD_COUNT=$(find ~/Desktop -type f -name "*.md" 2>/dev/null | wc -l)
TXT_COUNT=$(find ~/Desktop -type f -name "*.txt" 2>/dev/null | wc -l)
echo "   Markdown files: $MD_COUNT"
echo "   Text files: $TXT_COUNT"
echo "   Total documents: $((MD_COUNT + TXT_COUNT))"

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
echo "  • $((MD_COUNT + TXT_COUNT)) documents on Desktop"
echo "  • $REPO_COUNT GitHub repositories (dylaroo0)"
echo "  • $(ls -d $TRASH_DIR/*/ 2>/dev/null | wc -l) items in trash"
echo ""
echo "Next steps:"
echo "  1. Review recovered files: $RECOVERY_DIR"
echo "  2. Check repo list: $REPOS_FILE"
echo "  3. When ready to sync all repos, run:"
echo "     bash $CLONE_SCRIPT"
echo ""
echo "⚠️  Note: Cloning ~300 repos will take 30-60 minutes"
echo "        and use several GB of disk space."
echo ""

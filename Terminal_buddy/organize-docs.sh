#!/bin/bash

# Terminal Buddy — Document Organizer
# This script copies all essential documents to a "current" folder for easy sharing

echo "📦 Terminal Buddy — Document Organizer"
echo "======================================"
echo ""

# Create folder for current documents
mkdir -p docs/current

# Copy essential documents
echo "Copying essential documents..."

cp docs/DECISION_CARD.md docs/current/
echo "  ✅ DECISION_CARD.md"

cp docs/DEFINITIVE_STATUS.md docs/current/
echo "  ✅ DEFINITIVE_STATUS.md"

cp docs/COMPLETE_DESIGN_SCHEMATIC_INDEX.md docs/current/
echo "  ✅ COMPLETE_DESIGN_SCHEMATIC_INDEX.md"

cp docs/OFFICIAL_DOCUMENT_LIBRARY.md docs/current/
echo "  ✅ OFFICIAL_DOCUMENT_LIBRARY.md"

cp docs/WHERE_WE_ARE.md docs/current/
echo "  ✅ WHERE_WE_ARE.md"

cp docs/guides/TERMINAL_BUDDY_OVERVIEW.md docs/current/
echo "  ✅ TERMINAL_BUDDY_OVERVIEW.md"

cp docs/specs/PRODUCT_SPEC_V2.md docs/current/
echo "  ✅ PRODUCT_SPEC_V2.md"

cp docs/design/DESIGN_SYSTEM_V2.md docs/current/
echo "  ✅ DESIGN_SYSTEM_V2.md"

cp docs/GEMINI_HANDOFF_COMPLETE.md docs/current/
echo "  ✅ GEMINI_HANDOFF_COMPLETE.md"

cp docs/PARTY_MODE_PLANNING.md docs/current/
echo "  ✅ PARTY_MODE_PLANNING.md"

echo ""
echo "📦 Creating archive of all docs..."

# Create backup with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p "docs/archive/${TIMESTAMP}_full_backup"
cp -r docs/specs docs/archive/${TIMESTAMP}_full_backup/
cp -r docs/design docs/archive/${TIMESTAMP}_full_backup/
cp -r docs/plans docs/archive/${TIMESTAMP}_full_backup/
cp -r docs/guides docs/archive/${TIMESTAMP}_full_backup/
cp -r docs/modules docs/archive/${TIMESTAMP}_full_backup/
cp -r docs/references docs/archive/${TIMESTAMP}_full_backup/

echo "  ✅ Full backup created: docs/archive/${TIMESTAMP}_full_backup/"

echo ""
echo "✨ Complete! Documents organized:"
echo ""
echo "📁 docs/current/"
echo "   └── Essential documents for sharing with Gemini"
echo ""
echo "📁 docs/archive/${TIMESTAMP}_full_backup/"
echo "   └── Complete backup of all documentation"
echo ""
echo "🎯 Next steps:"
echo "   1. Review docs/current/ folder"
echo "   2. Share with Gemini"
echo "   3. Make decisions in DECISION_CARD.md"
echo ""

#!/bin/bash
# Genesis Module Installation Script
# For BMAD v6.0.0-alpha.20+

set -e  # Exit on error

echo "════════════════════════════════════════════════════════════════"
echo "  BMad Genesis v1.0.0-alpha.1 Installation"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Check if BMAD is installed
if [ ! -d "$HOME/_bmad" ]; then
    echo "❌ Error: BMAD not found at $HOME/_bmad"
    echo "   Please install BMAD v6 first:"
    echo "   npx bmad-method@alpha install"
    exit 1
fi

echo "✓ BMAD installation found"

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
required_version="3.10"

if python3 -c "import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)"; then
    echo "✓ Python $python_version (>= 3.10)"
else
    echo "❌ Error: Python 3.10+ required (found $python_version)"
    exit 1
fi

# Create custom modules directory if it doesn't exist
CUSTOM_DIR="$HOME/_bmad/custom"
if [ ! -d "$CUSTOM_DIR" ]; then
    echo "Creating custom modules directory..."
    mkdir -p "$CUSTOM_DIR"
fi

# Copy Genesis module
echo ""
echo "Installing Genesis module..."
MODULE_DIR="$CUSTOM_DIR/genesis"

if [ -d "$MODULE_DIR" ]; then
    echo "⚠ Warning: Genesis module already exists"
    read -p "Overwrite? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Installation cancelled"
        exit 0
    fi
    rm -rf "$MODULE_DIR"
fi

cp -r . "$MODULE_DIR"
echo "✓ Module files copied to $MODULE_DIR"

# Install Python dependencies
echo ""
echo "Installing Python dependencies..."
if command -v pip &> /dev/null; then
    pip install agentscope memvid pyyaml --break-system-packages 2>/dev/null || \
    pip install agentscope memvid pyyaml
    echo "✓ Dependencies installed"
else
    echo "❌ Error: pip not found. Please install manually:"
    echo "   pip install agentscope memvid pyyaml"
    exit 1
fi

# Create output directories
echo ""
echo "Creating output directories..."
mkdir -p "$HOME/_bmad-output/genesis/planning"
mkdir -p "$HOME/_bmad-output/genesis/teams"
mkdir -p "$HOME/_bmad-output/genesis/memory"
echo "✓ Output directories created"

# Verify installation
echo ""
echo "Verifying installation..."

if [ -f "$MODULE_DIR/module.yaml" ]; then
    echo "✓ module.yaml found"
else
    echo "❌ module.yaml missing"
    exit 1
fi

if [ -d "$MODULE_DIR/agents" ]; then
    echo "✓ Agents directory found"
else
    echo "❌ Agents directory missing"
    exit 1
fi

# Success message
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  ✨ Genesis Installation Complete!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📍 Installed to: $MODULE_DIR"
echo "📁 Outputs will go to: $HOME/_bmad-output/genesis/"
echo ""
echo "🚀 Next Steps:"
echo "   1. Start Genesis: npx bmad-method genesis"
echo "   2. Analyze a project: *genesis-analyze"
echo "   3. Read the docs: cat $MODULE_DIR/README.md"
echo ""
echo "📚 Documentation: https://github.com/dylaroo/bmad-genesis"
echo "🐛 Issues: https://github.com/dylaroo/bmad-genesis/issues"
echo ""
echo "Happy building! 🎬"
echo ""

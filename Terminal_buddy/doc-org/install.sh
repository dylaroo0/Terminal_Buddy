#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  ./install.sh /absolute/path/to/target-repo [--install-dir doc-org-system] [--config-path bmad-agent/bmad-config.json]
  ./install.sh /absolute/path/to/target-repo --no-config

What it does:
  - Copies the doc-org payload into a folder in the target repo (default: doc-org-system/)
  - Optionally merges/updates a BMAD/EMAD config file (default: bmad-agent/bmad-config.json)

Notes:
  - Requires: python3
  - If you want the legacy location, pass: --install-dir bmad-agent/core-system
USAGE
}

if [[ ${1:-} == "-h" || ${1:-} == "--help" || ${#} -lt 1 ]]; then
  usage
  exit 1
fi

target_repo="$1"
if [[ ! -d "$target_repo" ]]; then
  echo "Target repo not found: $target_repo" >&2
  exit 2
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Delegate parsing + copying + config merge to Python for cross-platform behavior.
python3 "$script_dir/install.py" "$@"

echo "Installed doc-org module into: $target_repo"

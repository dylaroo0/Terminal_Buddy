#!/usr/bin/env bash
set -euo pipefail

BOARD="/home/dylaroo/projects/Terminal_buddy/docs/current/TEAM_WHITEBOARD.md"
TS="$(date '+%Y-%m-%d %H:%M')"

usage() {
  cat <<'EOF'
Usage:
  whiteboard.sh checkin "done" "doing" "blocked" "need"
  whiteboard.sh set-active "task description"
  whiteboard.sh decide "decision text"

Examples:
  ./scripts/whiteboard.sh set-active "Verify journaling reliability end-to-end"
  ./scripts/whiteboard.sh decide "D-001 approved: impact tracking default OFF"
  ./scripts/whiteboard.sh checkin "Hook mapped" "Adding error state" "None" "Review after patch"
EOF
}

require_board() {
  if [[ ! -f "$BOARD" ]]; then
    echo "Board not found: $BOARD"
    exit 1
  fi
}

append_checkin() {
  local done="$1"
  local doing="$2"
  local blocked="$3"
  local need="$4"

  cat >> "$BOARD" <<EOF

### $TS — Manual Update
- Done: $done
- Doing: $doing
- Blocked: $blocked
- Need from Dylaroo: $need
EOF

  echo "Check-in appended to TEAM_WHITEBOARD.md"
}

set_active_task() {
  local task="$1"
  python3 - <<PY
from pathlib import Path
p = Path("$BOARD")
text = p.read_text()
needle = "- Active Task: **"
start = text.find(needle)
if start == -1:
    raise SystemExit("Active Task line not found")
line_end = text.find("\n", start)
new_line = f"- Active Task: **{task}**"
text = text[:start] + new_line + text[line_end:]
p.write_text(text)
print("Active Task updated")
PY
}

append_decision() {
  local decision="$1"
  cat >> "$BOARD" <<EOF

- $TS: $decision
EOF
  echo "Decision appended"
}

main() {
  require_board
  if [[ $# -lt 1 ]]; then
    usage
    exit 1
  fi

  case "$1" in
    checkin)
      [[ $# -eq 5 ]] || { usage; exit 1; }
      append_checkin "$2" "$3" "$4" "$5"
      ;;
    set-active)
      [[ $# -eq 2 ]] || { usage; exit 1; }
      set_active_task "$2"
      ;;
    decide)
      [[ $# -eq 2 ]] || { usage; exit 1; }
      append_decision "$2"
      ;;
    *)
      usage
      exit 1
      ;;
  esac
}

main "$@"

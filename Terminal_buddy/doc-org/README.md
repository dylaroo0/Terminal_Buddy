# Doc-Org Module (Portable)

This is a portable **documentation + organization** module you can install into:
- the main Forge repo (BMAD/EMAD + your design system), or
- any other standalone project (including creative writing projects)

It installs:
- the Documentation & Organization System into a top-level folder (default: `doc-org-system/`)
- an optional config merge into `bmad-agent/bmad-config.json` (idempotent)

## Install
Run from this folder:

- `./install.sh /absolute/path/to/target-repo`

Optional:
- Install somewhere else: `./install.sh /absolute/path/to/target-repo --install-dir documentation-org`
- Legacy install path: `./install.sh /absolute/path/to/target-repo --install-dir bmad-agent/core-system`
- Skip config changes: `./install.sh /absolute/path/to/target-repo --no-config`

Requirements:
- `python3`

## What’s included
- Core persona + standards + tasks (in `payload/bmad-agent/core-system/`)
- A small installer that copies the payload and merges config

---
Last Modified: 2026-01-15 22:58:56
File: /home/dylaroo/Desktop/The_Forge_System/doc-org/README.md
---

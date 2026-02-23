# Doc-Org Module (Portable)

This is a **portable documentation + organization module** you can drop into any project.
It wires up the Documentation Manager persona, session logs, and PROJECT_STATUS discipline — and optionally registers itself into a **BMAD** or **EMAD** agent config so the AI always knows where to find it.

---

## What gets installed

| Thing | Where it lands |
|---|---|
| Documentation Manager persona + tasks + standards | `doc-org-system/` (default) |
| BMAD/EMAD config entry | `bmad-agent/bmad-config.json` (merged, not overwritten) |

The install is **idempotent** — running it twice is safe.

---

## Requirements

- `python3` (3.8+)
- `bash` (or run `install.py` directly on Windows)

---

## Quick install (BMAD + EMAD method)

This is the recommended path when your project already has a `bmad-agent/` folder
(i.e., you are using the **BMAD** or **EMAD** agent system).

```bash
# 1. Clone or copy this doc-org folder into your project, then run:
cd /path/to/your-project/doc-org

# 2. Install into your project root — the script handles both the payload
#    copy AND the bmad-config.json merge in one shot.
./install.sh /absolute/path/to/your-project
```

After this you will have:

```
your-project/
├── doc-org-system/          ← Documentation Manager files land here
│   ├── documentation-manager.md
│   ├── documentation-manager-tasks.md
│   └── organization-standards.md
└── bmad-agent/
    └── bmad-config.json     ← Updated in-place (coreSystem entry added)
```

> **Note for this repo:** The Terminal Buddy project root is  
> `/home/dylaroo/projects/Terminal_buddy`  
> so the install command would be:
>
> ```bash
> ./install.sh /home/dylaroo/projects/Terminal_buddy
> ```

---

## Install options

### Change the install directory

By default the payload lands in `doc-org-system/`. Override with `--install-dir`:

```bash
# Custom folder name
./install.sh /path/to/project --install-dir documentation-org

# Legacy layout (inside bmad-agent/)
./install.sh /path/to/project --install-dir bmad-agent/core-system
```

### Skip the config merge (payload only)

If you don't use BMAD/EMAD and just want the docs files:

```bash
./install.sh /path/to/project --no-config
```

### Point to a non-default config file

```bash
./install.sh /path/to/project --config-path path/to/my-config.json
```

### Run the Python installer directly (cross-platform)

```bash
python3 install.py /absolute/path/to/project
python3 install.py /absolute/path/to/project --install-dir my-docs --no-config
```

---

## BMAD / EMAD config — what the merge does

The installer merges a `coreSystem.documentationManager` block into your
`bmad-agent/bmad-config.json`. After install it looks like this:

```json
{
  "coreSystem": {
    "documentationManager": {
      "enabled": true,
      "autoActivate": true,
      "priority": "always-on",
      "persona": "doc-org-system/documentation-manager.md",
      "tasks": "doc-org-system/documentation-manager-tasks.md",
      "standards": "doc-org-system/organization-standards.md"
    }
  },
  "recommendedAgents": ["documentation-manager", "..."],
  "features": {
    "sessionManagement": true,
    "timestampedLogs": true,
    "projectStatusTracking": true
  }
}
```

Existing keys are **not overwritten** — only new keys are added or the
`documentationManager` block is updated.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Target repo not found` | Pass an **absolute** path (starts with `/`) |
| Config not updating | Check that `bmad-agent/` folder exists in your target repo first |
| Want a fresh install | Delete `doc-org-system/` then re-run `install.sh` |
| Windows / no bash | Run `python3 install.py` directly |

---

## What's in the payload

```
payload/
└── bmad-agent/
    └── core-system/
        ├── documentation-manager.md        ← AI persona definition
        ├── documentation-manager-tasks.md  ← Task library
        └── organization-standards.md       ← Standards + conventions
```

Module version is tracked in `module.json`.

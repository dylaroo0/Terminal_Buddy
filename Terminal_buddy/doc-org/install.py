#!/usr/bin/env python3
import argparse
import json
import os
import shutil
import sys
from datetime import datetime, timezone


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def load_json(path: str):
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: str, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


def ensure_list_unique_front(lst, item: str):
    if lst is None:
        lst = []
    lst = [x for x in lst if x != item]
    return [item] + lst


def to_posix_path(path_str: str) -> str:
    return path_str.replace("\\", "/")


def copy_payload_dir(src_dir: str, dst_dir: str) -> None:
    if not os.path.isdir(src_dir):
        raise FileNotFoundError(f"Payload source not found: {src_dir}")

    os.makedirs(dst_dir, exist_ok=True)

    for root, dirs, files in os.walk(src_dir):
        rel_root = os.path.relpath(root, src_dir)
        rel_root = "" if rel_root == "." else rel_root
        target_root = os.path.join(dst_dir, rel_root)
        os.makedirs(target_root, exist_ok=True)

        for dirname in dirs:
            os.makedirs(os.path.join(target_root, dirname), exist_ok=True)

        for filename in files:
            src_path = os.path.join(root, filename)
            dst_path = os.path.join(target_root, filename)
            shutil.copy2(src_path, dst_path)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Install the doc-org module into a target repo (portable, idempotent)."
    )
    parser.add_argument("repo", help="Absolute path to the target repository")
    parser.add_argument(
        "--install-dir",
        default="doc-org-system",
        help=(
            "Where to install the module inside the repo (default: doc-org-system). "
            "Use 'bmad-agent/core-system' for legacy layout."
        ),
    )
    parser.add_argument(
        "--config-path",
        default="bmad-agent/bmad-config.json",
        help=(
            "Path to the BMAD/EMAD config file relative to repo root (default: bmad-agent/bmad-config.json). "
            "Ignored if --no-config is set."
        ),
    )
    parser.add_argument(
        "--no-config",
        action="store_true",
        help="Do not modify any config files; only copy the module payload.",
    )
    args = parser.parse_args()

    target_repo = args.repo
    install_dir = args.install_dir.strip().strip("/")

    script_dir = os.path.dirname(os.path.abspath(__file__))
    payload_src = os.path.join(script_dir, "payload", "bmad-agent", "core-system")
    payload_dst = os.path.join(target_repo, install_dir)

    copy_payload_dir(payload_src, payload_dst)

    if args.no_config:
        return 0

    config_path = args.config_path
    if not os.path.isabs(config_path):
        config_path = os.path.join(target_repo, config_path)

    cfg = load_json(config_path)
    if cfg is None:
        cfg = {
            "projectType": "unknown",
            "framework": "Unknown",
            "language": "Unknown",
            "complexity": "unknown",
            "recommendedMode": "documentation",
            "recommendedAgents": [],
            "autoActivateAgents": True,
            "enableRealTimeMonitoring": True,
            "features": {},
            "dependencies": [],
            "confidence": 0.5,
            "createdAt": utc_now_iso(),
            "version": "1.0.0",
        }

    cfg.setdefault("coreSystem", {})
    cfg["coreSystem"].setdefault("documentationManager", {})

    persona_path = to_posix_path(f"{install_dir}/documentation-manager.md")
    tasks_path = to_posix_path(f"{install_dir}/documentation-manager-tasks.md")
    standards_path = to_posix_path(f"{install_dir}/organization-standards.md")

    cfg["coreSystem"]["documentationManager"].update(
        {
            "enabled": True,
            "autoActivate": True,
            "priority": "always-on",
            "persona": persona_path,
            "tasks": tasks_path,
            "standards": standards_path,
        }
    )

    cfg["recommendedAgents"] = ensure_list_unique_front(cfg.get("recommendedAgents"), "documentation-manager")

    features = cfg.setdefault("features", {})
    features.setdefault("sessionManagement", True)
    features.setdefault("timestampedLogs", True)
    features.setdefault("projectStatusTracking", True)

    cfg["lastUpdated"] = utc_now_iso()

    save_json(config_path, cfg)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

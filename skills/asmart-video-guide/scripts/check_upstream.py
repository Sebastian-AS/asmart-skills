#!/usr/bin/env python3
"""Compare local public ASmart skills with GitHub, separating upstream changes from local edits."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from collections import defaultdict

REPO = "Sebastian-AS/asmart-skills"
SKILLS = ("asmart-audio", "asmart-video-guide", "asmart-video-production", "asmartdesign")
BASELINE_FILE = "references/upstream-baseline.json"


def github_json(url: str) -> dict:
    result = subprocess.run(
        ["curl", "--fail", "--silent", "--show-error", "--location", "--max-time", "15",
         "-H", "Accept: application/vnd.github+json", "-H", "User-Agent: asmart-skills-upstream-check/1", url],
        check=True, capture_output=True, text=True,
    )
    return json.loads(result.stdout)


def tree_for(revision: str) -> dict[str, str]:
    result = github_json(f"https://api.github.com/repos/{REPO}/git/trees/{revision}?recursive=1")
    if result.get("truncated"):
        raise RuntimeError(f"GitHub returned a truncated tree for {revision}")
    return {entry["path"]: entry["sha"] for entry in result.get("tree", []) if entry.get("type") == "blob"}


def blob_sha(path: Path) -> str:
    data = path.read_bytes()
    return hashlib.sha1(f"blob {len(data)}\0".encode() + data).hexdigest()


def local_tree(folder: Path) -> dict[str, str]:
    result = {}
    for path in folder.rglob("*"):
        if not path.is_file() or any(part in {".git", "__pycache__"} for part in path.relative_to(folder).parts):
            continue
        rel = path.relative_to(folder).as_posix()
        if rel != BASELINE_FILE:
            result[f"skills/{folder.name}/{rel}"] = blob_sha(path)
    return result


def compare_skill(name: str, folder: Path, latest: dict[str, str], baseline_trees: dict[str, dict[str, str]]) -> list[tuple[str, str]]:
    state_path = folder / BASELINE_FILE
    if not state_path.is_file():
        return [("NO BASELINE", f"{name}: add {BASELINE_FILE} to distinguish upstream edits from local changes")]
    state = json.loads(state_path.read_text(encoding="utf-8"))
    revision = state.get("revision")
    if not isinstance(revision, str) or len(revision) != 40:
        return [("INVALID BASELINE", f"{name}/{BASELINE_FILE}")]
    base = baseline_trees[revision]
    local = local_tree(folder)
    prefix = f"skills/{name}/"
    remote_now = {p: sha for p, sha in latest.items() if p.startswith(prefix) and not p.endswith("/" + BASELINE_FILE)}
    remote_base = {p: sha for p, sha in base.items() if p.startswith(prefix) and not p.endswith("/" + BASELINE_FILE)}
    paths = sorted(remote_now.keys() | remote_base.keys() | local.keys())
    results = []
    for path in paths:
        old, current, here = remote_base.get(path), remote_now.get(path), local.get(path)
        label = path.removeprefix(prefix)
        if old is None and current is not None:
            if here == current:
                continue
            results.append(("UPSTREAM NEW FILE", f"{name}/{label}"))
        elif old is not None and current is None:
            if here == old:
                results.append(("UPSTREAM REMOVED", f"{name}/{label} (review before deleting local copy)"))
            elif here is not None:
                results.append(("LOCAL COPY OF REMOVED FILE", f"{name}/{label}"))
        elif old == current:
            if here is None:
                results.append(("LOCAL MISSING BASELINE FILE", f"{name}/{label}"))
            elif here != old:
                results.append(("LOCAL CUSTOMIZATION OR UNPUBLISHED EDIT", f"{name}/{label}"))
        elif current is not None:
            if here == current:
                continue
            if here == old:
                results.append(("UPSTREAM UPDATE AVAILABLE", f"{name}/{label}"))
            else:
                results.append(("LOCAL/UPSTREAM CONFLICT", f"{name}/{label}"))
    return results


def refresh_bundle_manifest(skills_root: Path) -> None:
    manifest_path = skills_root.parent / "bundle-manifest.json"
    if not manifest_path.is_file():
        return
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    ignored = {"__pycache__", ".git", ".DS_Store"}
    manifest["files"] = {
        path.relative_to(skills_root.parent).as_posix(): hashlib.sha256(path.read_bytes()).hexdigest()
        for path in sorted(skills_root.rglob("*"))
        if path.is_file() and not any(part in ignored for part in path.relative_to(skills_root).parts)
    }
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Refreshed {manifest_path} hashes for {len(manifest['files'])} files.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--skills-root", required=True, type=Path, help="Directory containing the four skill folders")
    parser.add_argument("--accept-current", action="store_true", help="After reviewing results, advance baselines if no upstream changes remain unresolved")
    args = parser.parse_args()
    root = args.skills_root.expanduser().resolve()
    try:
        repo = github_json(f"https://api.github.com/repos/{REPO}")
        branch = repo["default_branch"]
        current_commit = github_json(f"https://api.github.com/repos/{REPO}/commits/{branch}")["sha"]
        current_tree = tree_for(current_commit)
        revisions = {current_commit}
        for name in SKILLS:
            state_path = root / name / BASELINE_FILE
            if state_path.is_file():
                state = json.loads(state_path.read_text(encoding="utf-8"))
                if state.get("revision"):
                    revisions.add(state["revision"])
        trees = {revision: current_tree if revision == current_commit else tree_for(revision) for revision in revisions}
    except (OSError, subprocess.CalledProcessError, KeyError, json.JSONDecodeError, RuntimeError) as exc:
        print(f"Unable to check {REPO}: {exc}", file=sys.stderr)
        print(f"Checked source: https://github.com/{REPO}", file=sys.stderr)
        return 2

    print(f"GitHub {REPO} {branch}: {current_commit}")
    print(f"Local skills root: {root}")
    all_results = []
    checked_folders = []
    present = 0
    for name in SKILLS:
        folder = root / name
        if not folder.is_dir():
            print(f"NOT INSTALLED: {name}")
            continue
        present += 1
        checked_folders.append(folder)
        results = compare_skill(name, folder, current_tree, trees)
        all_results.extend(results)
    if not present:
        print("No ASmart skill folders found at this path.")
        return 2
    if all_results:
        grouped = defaultdict(list)
        for status, path in all_results:
            grouped[status].append(path)
        for status in sorted(grouped):
            paths = grouped[status]
            print(f"{status}: {len(paths)}")
            for path in paths[:5]:
                print(f"  {path}")
            if len(paths) > 5:
                print(f"  … and {len(paths) - 5} more")
    else:
        print("SKILL FILES MATCH CURRENT UPSTREAM for all installed ASmart skills.")

    unresolved = {"UPSTREAM UPDATE AVAILABLE", "UPSTREAM NEW FILE", "UPSTREAM REMOVED", "LOCAL/UPSTREAM CONFLICT", "NO BASELINE", "INVALID BASELINE", "LOCAL MISSING BASELINE FILE", "LOCAL COPY OF REMOVED FILE"}
    if args.accept_current and any(status in unresolved for status, _ in all_results):
        print("Baseline not advanced: resolve the listed upstream changes or missing files first.")
        return 1
    if args.accept_current:
        for folder in checked_folders:
            marker = folder / BASELINE_FILE
            state = json.loads(marker.read_text(encoding="utf-8"))
            state["repository"] = f"https://github.com/{REPO}"
            state["revision"] = current_commit
            marker.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        refresh_bundle_manifest(root)
        print(f"Accepted upstream baseline {current_commit} for {len(checked_folders)} installed skills.")
        return 0
    if all_results and not any(status.startswith("UPSTREAM ") or status == "LOCAL/UPSTREAM CONFLICT" for status, _ in all_results):
        print("No newer upstream skill content detected; listed differences are local edits relative to the saved baseline.")
        return 0
    if all_results:
        print("Review upstream changes against the saved baseline. Keep local edits unless they are intentionally replaced; do not overwrite whole skill folders.")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

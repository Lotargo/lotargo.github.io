#!/usr/bin/env python3
"""Decode a staged base64 tar bundle into real repository assets."""

from __future__ import annotations

import argparse
import base64
import io
import shutil
import tarfile
from pathlib import Path


def safe_members(archive: tarfile.TarFile, root: Path):
    root = root.resolve()
    for member in archive.getmembers():
        target = (root / member.name).resolve()
        if root not in target.parents and target != root:
            raise ValueError(f"Unsafe archive path: {member.name}")
        if member.issym() or member.islnk():
            raise ValueError(f"Links are not allowed in asset bundles: {member.name}")
        yield member


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("bundle_dir", type=Path)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    args = parser.parse_args()

    bundle_dir = args.bundle_dir.resolve()
    root = args.root.resolve()
    parts = sorted(bundle_dir.glob("part-*.b64"))
    if not parts:
        raise SystemExit(f"No part-*.b64 files found in {bundle_dir}")
    if not (bundle_dir / "READY").exists():
        raise SystemExit(f"Missing READY marker in {bundle_dir}")

    encoded = b"".join(part.read_bytes().strip() for part in parts)
    archive_bytes = base64.b64decode(encoded, validate=True)

    with tarfile.open(fileobj=io.BytesIO(archive_bytes), mode="r:gz") as archive:
        members = list(safe_members(archive, root))
        archive.extractall(root, members=members, filter="data")

    expected = root / "blog" / "assets" / "visual-novel-ai-game" / "images"
    images = sorted(expected.glob("*.webp"))
    if len(images) != 7:
        raise SystemExit(f"Expected 7 Visual Novel images, found {len(images)}")

    shutil.rmtree(bundle_dir)
    print(f"Imported {len(images)} binary assets and removed {bundle_dir}")


if __name__ == "__main__":
    main()

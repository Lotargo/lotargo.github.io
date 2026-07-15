#!/usr/bin/env python3
"""Decode a staged base64 tar bundle into real repository assets."""

from __future__ import annotations

import argparse
import base64
import io
import shutil
import tarfile
from pathlib import Path


IMAGE_SUFFIXES = {".avif", ".webp", ".png", ".jpg", ".jpeg"}


def safe_members(archive: tarfile.TarFile, root: Path):
    root = root.resolve()
    for member in archive.getmembers():
        target = (root / member.name).resolve()
        if root not in target.parents and target != root:
            raise ValueError(f"Unsafe archive path: {member.name}")
        if member.issym() or member.islnk():
            raise ValueError(f"Links are not allowed in asset bundles: {member.name}")
        yield member


def read_encoded_bundle(bundle_dir: Path) -> bytes:
    single_bundle = bundle_dir / "bundle.b64"
    if single_bundle.exists():
        return single_bundle.read_bytes().strip()

    parts = sorted(bundle_dir.glob("part-*.b64"))
    if parts:
        return b"".join(part.read_bytes().strip() for part in parts)

    raise SystemExit(
        f"No bundle.b64 or part-*.b64 files found in {bundle_dir}"
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("bundle_dir", type=Path)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    args = parser.parse_args()

    bundle_dir = args.bundle_dir.resolve()
    root = args.root.resolve()
    encoded = read_encoded_bundle(bundle_dir)
    archive_bytes = base64.b64decode(encoded, validate=True)

    with tarfile.open(fileobj=io.BytesIO(archive_bytes), mode="r:gz") as archive:
        members = list(safe_members(archive, root))
        archive.extractall(root, members=members, filter="data")

    expected = root / "blog" / "assets" / "visual-novel-ai-game" / "images"
    images = sorted(
        path
        for path in expected.iterdir()
        if path.is_file() and path.suffix.lower() in IMAGE_SUFFIXES
    )
    if len(images) != 7:
        raise SystemExit(f"Expected 7 Visual Novel images, found {len(images)}")

    shutil.rmtree(bundle_dir)
    print(f"Imported {len(images)} binary assets and removed {bundle_dir}")


if __name__ == "__main__":
    main()

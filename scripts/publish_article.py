#!/usr/bin/env python3
"""Render, validate, pack, install, and import Article Bundles.

This is the high-level publishing CLI. It keeps manually authored legacy HTML
working, while Markdown-first bundles can declare `render.engine = markdown` or
simply omit the generated HTML file. In that case `article.html` is rebuilt
before validation, packing, or installation.
"""

from __future__ import annotations

import argparse
import base64
import json
import shutil
import sys
from pathlib import Path

from article_bundle import (
    BundleError,
    archive_directory,
    discover_staged_bundle,
    install_bundle,
    load_manifest,
    open_bundle,
)
from render_article import RenderError, render_bundle


class PublishError(RuntimeError):
    pass


def fail(message: str) -> "NoReturn":
    raise PublishError(message)


def read_raw_manifest(bundle_root: Path) -> dict:
    path = bundle_root / "article.json"
    if not path.is_file():
        fail("Bundle must contain article.json")
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"Cannot read article.json: {exc}")
    if not isinstance(value, dict):
        fail("article.json must contain a JSON object")
    return value


def prepare_bundle(bundle_root: Path, force: bool = False) -> Path:
    raw = read_raw_manifest(bundle_root)
    html_value = raw.get("html", "article.html")
    if not isinstance(html_value, str) or not html_value:
        fail("html must be a relative path")
    html_path = bundle_root / html_value
    should_render = force or "render" in raw or not html_path.is_file()
    if should_render:
        return render_bundle(bundle_root)
    return html_path


def render_command(args: argparse.Namespace) -> None:
    output = render_bundle(args.bundle_dir, args.template)
    print(f"Rendered article: {output}")


def validate_command(args: argparse.Namespace) -> None:
    with open_bundle(args.bundle) as root:
        prepare_bundle(root, force=args.render)
        manifest = load_manifest(root)
        print(f"Valid article bundle: {manifest.slug}")


def install_command(args: argparse.Namespace) -> None:
    with open_bundle(args.bundle) as root:
        prepare_bundle(root, force=args.render)
        manifest = load_manifest(root)
        install_bundle(manifest, args.root)
        print(f"Installed article bundle: {manifest.slug}")


def pack_command(args: argparse.Namespace) -> None:
    source = args.bundle_dir.resolve()
    prepare_bundle(source, force=args.render)
    manifest = load_manifest(source)
    data = archive_directory(source, args.archive_format)

    output = args.output.resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    if args.transport == "b64":
        output.write_text(base64.b64encode(data).decode("ascii") + "\n", encoding="ascii")
    else:
        output.write_bytes(data)
    print(f"Packed {manifest.slug}: {output}")


def import_staged_command(args: argparse.Namespace) -> None:
    staging_root = args.staging_root.resolve()
    if not staging_root.exists():
        if args.allow_empty:
            print(f"No staging directory: {staging_root}")
            return
        fail(f"Staging directory does not exist: {staging_root}")

    imported = 0
    for directory in sorted(path for path in staging_root.iterdir() if path.is_dir()):
        bundle = discover_staged_bundle(directory)
        if bundle is None:
            continue
        with open_bundle(bundle) as root:
            prepare_bundle(root)
            manifest = load_manifest(root)
            if manifest.slug != directory.name:
                fail(
                    f"Staging directory {directory.name} does not match bundle slug {manifest.slug}"
                )
            install_bundle(manifest, args.root)
            imported += 1
        shutil.rmtree(directory)
        print(f"Imported staged article: {manifest.slug}")

    if imported == 0 and not args.allow_empty:
        fail(f"No ready article bundles found in {staging_root}")
    print(f"Imported {imported} article bundle(s)")


def add_render_flag(parser: argparse.ArgumentParser) -> None:
    parser.add_argument(
        "--render",
        action="store_true",
        help="Force regeneration of HTML even for a legacy bundle without render config",
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    render = subparsers.add_parser("render", help="Render article.html from Markdown sources")
    render.add_argument("bundle_dir", type=Path)
    render.add_argument("--template", type=Path, default=None)
    render.set_defaults(func=render_command)

    validate = subparsers.add_parser("validate", help="Render when needed and validate a bundle")
    validate.add_argument("bundle", type=Path)
    add_render_flag(validate)
    validate.set_defaults(func=validate_command)

    install = subparsers.add_parser("install", help="Render and install a bundle into a checkout")
    install.add_argument("bundle", type=Path)
    install.add_argument("--root", type=Path, default=Path.cwd())
    add_render_flag(install)
    install.set_defaults(func=install_command)

    pack = subparsers.add_parser("pack", help="Render and pack an expanded bundle")
    pack.add_argument("bundle_dir", type=Path)
    pack.add_argument("--archive-format", choices=("zip", "tar.gz"), default="zip")
    pack.add_argument("--transport", choices=("binary", "b64"), default="binary")
    pack.add_argument("--output", type=Path, required=True)
    add_render_flag(pack)
    pack.set_defaults(func=pack_command)

    staged = subparsers.add_parser("import-staged", help="Render and import staged bundles")
    staged.add_argument("staging_root", type=Path)
    staged.add_argument("--root", type=Path, default=Path.cwd())
    staged.add_argument("--allow-empty", action="store_true")
    staged.set_defaults(func=import_staged_command)

    return parser


def main() -> int:
    args = build_parser().parse_args()
    try:
        args.func(args)
        return 0
    except (PublishError, BundleError, RenderError) as exc:
        print(f"publish-article: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())

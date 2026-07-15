#!/usr/bin/env python3
"""Validate, pack, and install article bundles for lotargo.github.io.

Supported inputs:
- expanded bundle directory;
- .zip;
- .tar.gz / .tgz;
- .b64 containing a base64-encoded ZIP or TAR.GZ archive.

The installed site remains plain static HTML, Markdown, and binary assets.
"""

from __future__ import annotations

import argparse
import base64
import io
import json
import re
import shutil
import sys
import tarfile
import tempfile
import zipfile
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any, Iterable


SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
SUPPORTED_ARCHIVES = (".zip", ".tar.gz", ".tgz", ".b64")
MAX_FILE_SIZE = 95 * 1024 * 1024
MAX_TOTAL_SIZE = 500 * 1024 * 1024
ALLOWED_ASSET_SUFFIXES = {
    ".avif", ".webp", ".png", ".jpg", ".jpeg", ".gif", ".svg",
    ".mp4", ".webm", ".mp3", ".ogg", ".wav", ".json", ".txt",
}


class BundleError(RuntimeError):
    pass


@dataclass(frozen=True)
class BundleManifest:
    raw: dict[str, Any]
    root: Path
    slug: str
    html_path: Path
    source_paths: dict[str, Path]
    assets_path: Path | None


class TemporaryBundle:
    def __init__(self, path: Path, temporary: tempfile.TemporaryDirectory[str] | None = None):
        self.path = path
        self.temporary = temporary

    def __enter__(self) -> Path:
        return self.path

    def __exit__(self, exc_type, exc, traceback) -> None:
        if self.temporary is not None:
            self.temporary.cleanup()


def fail(message: str) -> "NoReturn":
    raise BundleError(message)


def safe_relative_path(value: str, field: str) -> Path:
    path = Path(value)
    if path.is_absolute() or ".." in path.parts:
        fail(f"{field} must be a safe relative path: {value}")
    return path


def ensure_inside(root: Path, candidate: Path) -> Path:
    resolved_root = root.resolve()
    resolved_candidate = candidate.resolve()
    if resolved_candidate != resolved_root and resolved_root not in resolved_candidate.parents:
        fail(f"Path escapes bundle root: {candidate}")
    return resolved_candidate


def decode_base64_archive(path: Path) -> bytes:
    compact = re.sub(rb"\s+", b"", path.read_bytes())
    try:
        return base64.b64decode(compact, validate=True)
    except Exception as exc:  # noqa: BLE001
        fail(f"Invalid base64 bundle {path}: {exc}")


def safe_tar_members(archive: tarfile.TarFile, destination: Path) -> Iterable[tarfile.TarInfo]:
    destination = destination.resolve()
    for member in archive.getmembers():
        target = (destination / member.name).resolve()
        if target != destination and destination not in target.parents:
            fail(f"Unsafe TAR path: {member.name}")
        if member.issym() or member.islnk() or member.isdev():
            fail(f"Links and device files are forbidden: {member.name}")
        yield member


def safe_zip_members(archive: zipfile.ZipFile, destination: Path) -> Iterable[zipfile.ZipInfo]:
    destination = destination.resolve()
    for member in archive.infolist():
        target = (destination / member.filename).resolve()
        if target != destination and destination not in target.parents:
            fail(f"Unsafe ZIP path: {member.filename}")
        mode = member.external_attr >> 16
        if mode & 0o170000 == 0o120000:
            fail(f"Symbolic links are forbidden: {member.filename}")
        yield member


def extract_archive_bytes(data: bytes, destination: Path) -> None:
    stream = io.BytesIO(data)
    if zipfile.is_zipfile(stream):
        stream.seek(0)
        with zipfile.ZipFile(stream) as archive:
            members = list(safe_zip_members(archive, destination))
            archive.extractall(destination, members=members)
        return

    stream.seek(0)
    try:
        with tarfile.open(fileobj=stream, mode="r:*") as archive:
            members = list(safe_tar_members(archive, destination))
            archive.extractall(destination, members=members, filter="data")
        return
    except tarfile.TarError as exc:
        fail(f"Unsupported or damaged archive: {exc}")


def open_bundle(input_path: Path) -> TemporaryBundle:
    input_path = input_path.resolve()
    if input_path.is_dir():
        return TemporaryBundle(input_path)
    if not input_path.is_file():
        fail(f"Bundle does not exist: {input_path}")

    temporary = tempfile.TemporaryDirectory(prefix="article-bundle-")
    destination = Path(temporary.name)
    lower_name = input_path.name.lower()

    if lower_name.endswith(".b64"):
        data = decode_base64_archive(input_path)
    else:
        data = input_path.read_bytes()

    extract_archive_bytes(data, destination)
    root = normalize_bundle_root(destination)
    return TemporaryBundle(root, temporary)


def normalize_bundle_root(root: Path) -> Path:
    if (root / "article.json").is_file():
        return root
    children = [path for path in root.iterdir() if path.name != "__MACOSX"]
    directories = [path for path in children if path.is_dir()]
    files = [path for path in children if path.is_file()]
    if len(directories) == 1 and not files and (directories[0] / "article.json").is_file():
        return directories[0]
    return root


def load_manifest(bundle_root: Path) -> BundleManifest:
    manifest_path = bundle_root / "article.json"
    if not manifest_path.is_file():
        fail("Bundle must contain article.json at its root")

    try:
        raw = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"Cannot read article.json: {exc}")

    if raw.get("format_version") != 1:
        fail("article.json format_version must equal 1")

    slug = raw.get("slug")
    if not isinstance(slug, str) or not SLUG_RE.fullmatch(slug):
        fail("slug must use lowercase kebab-case")

    raw_date = raw.get("date")
    try:
        date.fromisoformat(raw_date)
    except (TypeError, ValueError):
        fail("date must use YYYY-MM-DD")

    html_rel = safe_relative_path(raw.get("html", "article.html"), "html")
    html_path = ensure_inside(bundle_root, bundle_root / html_rel)
    if not html_path.is_file() or html_path.suffix.lower() != ".html":
        fail(f"Rendered HTML is missing: {html_rel}")

    sources = raw.get("sources")
    if not isinstance(sources, dict) or not sources:
        fail("sources must map language codes to Markdown files")

    source_paths: dict[str, Path] = {}
    for language, value in sources.items():
        if not re.fullmatch(r"[a-z]{2}(?:-[A-Z]{2})?", language):
            fail(f"Invalid language code: {language}")
        if not isinstance(value, str):
            fail(f"Source path for {language} must be a string")
        source_rel = safe_relative_path(value, f"sources.{language}")
        source_path = ensure_inside(bundle_root, bundle_root / source_rel)
        if not source_path.is_file() or source_path.suffix.lower() != ".md":
            fail(f"Markdown source is missing for {language}: {source_rel}")
        source_paths[language] = source_path

    assets_path: Path | None = None
    assets_value = raw.get("assets", "assets")
    if assets_value is not None:
        if not isinstance(assets_value, str):
            fail("assets must be a relative directory path or null")
        assets_rel = safe_relative_path(assets_value, "assets")
        candidate = ensure_inside(bundle_root, bundle_root / assets_rel)
        if candidate.exists() and not candidate.is_dir():
            fail("assets must point to a directory")
        if candidate.is_dir():
            assets_path = candidate

    validate_post_metadata(raw.get("post"))
    validate_file_limits(bundle_root, assets_path)
    validate_html(html_path, slug)

    return BundleManifest(raw, bundle_root, slug, html_path, source_paths, assets_path)


def validate_localized(value: Any, field: str, required: bool = True) -> None:
    if value is None and not required:
        return
    if not isinstance(value, dict) or not value:
        fail(f"post.{field} must be a language map")
    for language, text in value.items():
        if not isinstance(language, str) or not isinstance(text, str) or not text.strip():
            fail(f"post.{field} contains an invalid localized value")


def validate_post_metadata(post: Any) -> None:
    if not isinstance(post, dict):
        fail("article.json must contain a post object")
    for field in ("type", "title", "shortTitle", "description"):
        validate_localized(post.get(field), field)
    validate_localized(post.get("notificationTitle"), "notificationTitle", required=False)
    validate_localized(post.get("notificationText"), "notificationText", required=False)
    if "notify" in post and not isinstance(post["notify"], bool):
        fail("post.notify must be true or false")


def validate_file_limits(bundle_root: Path, assets_path: Path | None) -> None:
    total_size = 0
    for path in bundle_root.rglob("*"):
        if not path.is_file():
            continue
        size = path.stat().st_size
        total_size += size
        if size > MAX_FILE_SIZE:
            fail(f"File exceeds GitHub's practical size limit: {path.relative_to(bundle_root)}")
    if total_size > MAX_TOTAL_SIZE:
        fail("Bundle is larger than the configured 500 MB limit")

    if assets_path:
        for path in assets_path.rglob("*"):
            if path.is_file() and path.suffix.lower() not in ALLOWED_ASSET_SUFFIXES:
                fail(f"Unsupported asset extension: {path.relative_to(bundle_root)}")


def validate_html(path: Path, slug: str) -> None:
    text = path.read_text(encoding="utf-8")
    required_fragments = (
        "<!doctype html>",
        "post-article",
        "../../assets/js/main.js",
        "../../assets/js/blog-post.js",
    )
    for fragment in required_fragments:
        if fragment.lower() not in text.lower():
            fail(f"Rendered HTML for {slug} is missing required fragment: {fragment}")


def build_post_entry(manifest: BundleManifest) -> dict[str, Any]:
    post = manifest.raw["post"]
    entry: dict[str, Any] = {
        "slug": manifest.slug,
        "date": manifest.raw["date"],
        "href": f"./{manifest.slug}.html",
        "url": f"./blog/posts/{manifest.slug}.html",
        "type": post["type"],
        "title": post["title"],
        "shortTitle": post["shortTitle"],
        "description": post["description"],
    }
    for field in ("notificationId", "notificationTitle", "notificationText", "notify"):
        if field in post:
            entry[field] = post[field]
    entry.setdefault("notify", False)
    return entry


def split_post_objects(array_body: str) -> list[str]:
    objects: list[str] = []
    depth = 0
    start: int | None = None
    quote: str | None = None
    escaped = False
    line_comment = False
    block_comment = False
    i = 0

    while i < len(array_body):
        char = array_body[i]
        next_char = array_body[i + 1] if i + 1 < len(array_body) else ""

        if line_comment:
            if char == "\n":
                line_comment = False
            i += 1
            continue
        if block_comment:
            if char == "*" and next_char == "/":
                block_comment = False
                i += 2
            else:
                i += 1
            continue
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            i += 1
            continue
        if char in ("'", '"', "`"):
            quote = char
            i += 1
            continue
        if char == "/" and next_char == "/":
            line_comment = True
            i += 2
            continue
        if char == "/" and next_char == "*":
            block_comment = True
            i += 2
            continue
        if char == "{":
            if depth == 0:
                start = i
            depth += 1
        elif char == "}":
            depth -= 1
            if depth < 0:
                fail("Malformed BLOG_POSTS array")
            if depth == 0 and start is not None:
                objects.append(array_body[start:i + 1].strip())
                start = None
        i += 1

    if depth != 0:
        fail("Malformed BLOG_POSTS array")
    return objects


def object_slug(js_object: str) -> str | None:
    match = re.search(r"(?:^|[,\s])(?:slug|\"slug\")\s*:\s*['\"]([^'\"]+)['\"]", js_object)
    return match.group(1) if match else None


def update_blog_manifest(path: Path, entry: dict[str, Any]) -> None:
    text = path.read_text(encoding="utf-8")
    marker = "window.BLOG_POSTS = ["
    start = text.find(marker)
    if start < 0:
        fail("Cannot find window.BLOG_POSTS in assets/js/blog-posts.js")
    body_start = start + len(marker)
    end = text.find("\n];", body_start)
    if end < 0:
        fail("Cannot find the end of window.BLOG_POSTS")

    objects = split_post_objects(text[body_start:end])
    rendered = json.dumps(entry, ensure_ascii=False, indent=2)
    rendered = "\n".join("  " + line for line in rendered.splitlines())

    replaced = False
    for index, current in enumerate(objects):
        if object_slug(current) == entry["slug"]:
            objects[index] = rendered.strip()
            replaced = True
            break
    if not replaced:
        objects.append(rendered.strip())

    new_body = "\n  " + ",\n  ".join(objects) + "\n"
    path.write_text(text[:body_start] + new_body + text[end:], encoding="utf-8")


def install_bundle(manifest: BundleManifest, repository_root: Path) -> None:
    repository_root = repository_root.resolve()
    posts_dir = repository_root / "blog" / "posts"
    content_dir = repository_root / "blog" / "content"
    assets_root = repository_root / "blog" / "assets"
    posts_manifest = repository_root / "assets" / "js" / "blog-posts.js"

    for required in (posts_dir, content_dir, assets_root, posts_manifest.parent):
        if not required.exists():
            fail(f"Repository structure is missing: {required}")

    shutil.copy2(manifest.html_path, posts_dir / f"{manifest.slug}.html")

    for old_source in content_dir.glob(f"{manifest.slug}.*.md"):
        old_source.unlink()
    for language, source_path in manifest.source_paths.items():
        shutil.copy2(source_path, content_dir / f"{manifest.slug}.{language}.md")

    installed_manifest = content_dir / f"{manifest.slug}.article.json"
    installed_manifest.write_text(
        json.dumps(manifest.raw, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    destination_assets = assets_root / manifest.slug
    if destination_assets.exists():
        shutil.rmtree(destination_assets)
    if manifest.assets_path:
        shutil.copytree(manifest.assets_path, destination_assets)

    update_blog_manifest(posts_manifest, build_post_entry(manifest))


def validate_command(args: argparse.Namespace) -> None:
    with open_bundle(args.bundle) as root:
        manifest = load_manifest(root)
        print(f"Valid article bundle: {manifest.slug}")


def install_command(args: argparse.Namespace) -> None:
    with open_bundle(args.bundle) as root:
        manifest = load_manifest(root)
        install_bundle(manifest, args.root)
        print(f"Installed article bundle: {manifest.slug}")


def archive_directory(source: Path, archive_format: str) -> bytes:
    if archive_format == "zip":
        output = io.BytesIO()
        with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
            for path in sorted(source.rglob("*")):
                if path.is_file():
                    archive.write(path, path.relative_to(source).as_posix())
        return output.getvalue()

    output = io.BytesIO()
    with tarfile.open(fileobj=output, mode="w:gz") as archive:
        for path in sorted(source.rglob("*")):
            archive.add(path, arcname=path.relative_to(source).as_posix(), recursive=False)
    return output.getvalue()


def pack_command(args: argparse.Namespace) -> None:
    source = args.bundle_dir.resolve()
    manifest = load_manifest(source)
    archive_format = args.archive_format
    data = archive_directory(source, archive_format)

    output = args.output.resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    if args.transport == "b64":
        output.write_text(base64.b64encode(data).decode("ascii") + "\n", encoding="ascii")
    else:
        output.write_bytes(data)
    print(f"Packed {manifest.slug}: {output}")


def discover_staged_bundle(directory: Path) -> Path | None:
    candidates = [
        directory / "bundle.zip",
        directory / "bundle.tar.gz",
        directory / "bundle.tgz",
        directory / "bundle.b64",
    ]
    existing = [path for path in candidates if path.is_file()]
    if len(existing) > 1:
        fail(f"Only one bundle transport is allowed in {directory}")
    if existing:
        return existing[0]
    if (directory / "READY").is_file() and (directory / "article.json").is_file():
        return directory
    return None


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


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    validate = subparsers.add_parser("validate", help="Validate a directory or archive")
    validate.add_argument("bundle", type=Path)
    validate.set_defaults(func=validate_command)

    install = subparsers.add_parser("install", help="Install a bundle into a repository checkout")
    install.add_argument("bundle", type=Path)
    install.add_argument("--root", type=Path, default=Path.cwd())
    install.set_defaults(func=install_command)

    pack = subparsers.add_parser("pack", help="Pack an expanded bundle")
    pack.add_argument("bundle_dir", type=Path)
    pack.add_argument("--archive-format", choices=("zip", "tar.gz"), default="zip")
    pack.add_argument("--transport", choices=("binary", "b64"), default="binary")
    pack.add_argument("--output", type=Path, required=True)
    pack.set_defaults(func=pack_command)

    staged = subparsers.add_parser("import-staged", help="Import all ready bundles in a staging root")
    staged.add_argument("staging_root", type=Path)
    staged.add_argument("--root", type=Path, default=Path.cwd())
    staged.add_argument("--allow-empty", action="store_true")
    staged.set_defaults(func=import_staged_command)

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    try:
        args.func(args)
        return 0
    except BundleError as exc:
        print(f"article-bundle: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())

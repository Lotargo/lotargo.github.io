#!/usr/bin/env python3
"""Publish Russian blog article announcements to a Telegram channel.

The script works with installed article files:

    blog/content/<slug>.article.json
    blog/content/<slug>.ru.md
    blog/assets/<slug>/*

It publishes a compact announcement, optionally using the first supported
Markdown image as a cover, and records Telegram message metadata in
blog/content/telegram-publications.json.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import mimetypes
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable, NoReturn

STATE_VERSION = 1
DEFAULT_SITE_URL = "https://lotargo.github.io"
STATE_RELATIVE_PATH = Path("blog/content/telegram-publications.json")
MANIFEST_SUFFIX = ".article.json"
SUPPORTED_PHOTO_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}
MARKDOWN_IMAGE_RE = re.compile(
    r"!\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+[\"'][^\"']*[\"'])?\s*\)"
)


class TelegramPublishError(RuntimeError):
    """Raised for invalid article data or Telegram API failures."""


@dataclass(frozen=True)
class ArticleAnnouncement:
    slug: str
    date: str
    title: str
    description: str
    article_url: str
    manifest_path: Path
    markdown_path: Path | None
    cover_path: Path | None
    source_hash: str


def fail(message: str) -> NoReturn:
    raise TelegramPublishError(message)


def read_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        fail(f"File does not exist: {path}")
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"Cannot read JSON from {path}: {exc}")
    if not isinstance(value, dict):
        fail(f"Expected a JSON object in {path}")
    return value


def localized(value: Any, language: str, field: str) -> str:
    if not isinstance(value, dict):
        fail(f"article.json field post.{field} must be a localized object")
    text = value.get(language)
    if not isinstance(text, str) or not text.strip():
        fail(f"article.json field post.{field}.{language} must be a non-empty string")
    return text.strip()


def normalize_chat_id(value: str) -> str:
    chat_id = value.strip().rstrip("/")
    for prefix in ("https://t.me/", "http://t.me/", "t.me/"):
        if chat_id.startswith(prefix):
            chat_id = "@" + chat_id[len(prefix):]
            break
    if not chat_id:
        fail("Telegram channel ID is empty")
    if not chat_id.startswith("@") and not chat_id.lstrip("-").isdigit():
        chat_id = "@" + chat_id
    return chat_id


def manifest_slug(path: Path) -> str:
    name = path.name
    if not name.endswith(MANIFEST_SUFFIX):
        fail(f"Manifest file must end with {MANIFEST_SUFFIX}: {path}")
    return name[: -len(MANIFEST_SUFFIX)]


def resolve_markdown_path(root: Path, slug: str, manifest: dict[str, Any]) -> Path | None:
    installed = root / "blog" / "content" / f"{slug}.ru.md"
    if installed.is_file():
        return installed

    sources = manifest.get("sources")
    if isinstance(sources, dict):
        ru_source = sources.get("ru")
        if isinstance(ru_source, str) and ru_source:
            candidate = (root / "blog" / "content" / ru_source).resolve()
            try:
                candidate.relative_to(root.resolve())
            except ValueError:
                fail(f"Russian source escapes repository root: {ru_source}")
            if candidate.is_file():
                return candidate
    return None


def extract_image_refs(markdown: str) -> list[str]:
    refs: list[str] = []
    for match in MARKDOWN_IMAGE_RE.finditer(markdown):
        value = (match.group(1) or match.group(2) or "").strip()
        if value:
            refs.append(value)
    return refs


def resolve_cover_path(
    root: Path,
    slug: str,
    markdown_path: Path | None,
) -> Path | None:
    if markdown_path is None:
        return None
    try:
        markdown = markdown_path.read_text(encoding="utf-8")
    except OSError as exc:
        fail(f"Cannot read Markdown source {markdown_path}: {exc}")

    for image_ref in extract_image_refs(markdown):
        if urllib.parse.urlparse(image_ref).scheme in {"http", "https"}:
            continue

        clean_ref = urllib.parse.unquote(image_ref.split("#", 1)[0].split("?", 1)[0])
        if clean_ref.startswith("assets/"):
            candidate = root / "blog" / "assets" / slug / clean_ref[len("assets/") :]
        else:
            candidate = markdown_path.parent / clean_ref

        candidate = candidate.resolve()
        try:
            candidate.relative_to(root.resolve())
        except ValueError:
            fail(f"Cover image escapes repository root: {image_ref}")

        if not candidate.is_file():
            print(f"Skipping missing Markdown image: {candidate}")
            continue
        if candidate.suffix.lower() not in SUPPORTED_PHOTO_SUFFIXES:
            print(
                "Skipping unsupported Telegram cover format: "
                f"{candidate.suffix or '<no extension>'}"
            )
            continue
        return candidate

    return None


def article_hash(
    manifest: dict[str, Any],
    title: str,
    description: str,
    cover_path: Path | None,
) -> str:
    digest = hashlib.sha256()
    stable = {
        "slug": manifest.get("slug"),
        "date": manifest.get("date"),
        "title": title,
        "description": description,
    }
    digest.update(json.dumps(stable, ensure_ascii=False, sort_keys=True).encode("utf-8"))
    if cover_path is not None:
        try:
            digest.update(cover_path.read_bytes())
        except OSError as exc:
            fail(f"Cannot hash cover image {cover_path}: {exc}")
    return "sha256:" + digest.hexdigest()


def load_announcement(root: Path, manifest_path: Path, site_url: str) -> ArticleAnnouncement:
    manifest = read_json(manifest_path)
    slug = manifest.get("slug")
    if not isinstance(slug, str) or not slug:
        fail(f"article.json has no valid slug: {manifest_path}")
    expected_slug = manifest_slug(manifest_path)
    if slug != expected_slug:
        fail(f"Manifest filename slug {expected_slug!r} does not match article slug {slug!r}")

    date = manifest.get("date")
    if not isinstance(date, str) or not date:
        fail(f"article.json has no valid date: {manifest_path}")

    post = manifest.get("post")
    if not isinstance(post, dict):
        fail(f"article.json has no post object: {manifest_path}")

    title = localized(post.get("title"), "ru", "title")
    description = localized(post.get("description"), "ru", "description")
    markdown_path = resolve_markdown_path(root, slug, manifest)
    cover_path = resolve_cover_path(root, slug, markdown_path)
    article_url = f"{site_url.rstrip('/')}/blog/posts/{slug}.html"

    return ArticleAnnouncement(
        slug=slug,
        date=date,
        title=title,
        description=description,
        article_url=article_url,
        manifest_path=manifest_path,
        markdown_path=markdown_path,
        cover_path=cover_path,
        source_hash=article_hash(manifest, title, description, cover_path),
    )


def build_text(article: ArticleAnnouncement) -> str:
    return (
        f"<b>{html.escape(article.title)}</b>\n\n"
        f"{html.escape(article.description)}\n\n"
        f"<i>{html.escape(article.date)}</i>"
    )


def build_keyboard(article_url: str) -> dict[str, Any]:
    return {
        "inline_keyboard": [
            [{"text": "Читать статью", "url": article_url}],
        ]
    }


def telegram_request_json(
    token: str,
    method: str,
    payload: dict[str, Any],
) -> dict[str, Any]:
    request = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/{method}",
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "lotargo-telegram-publisher/1.0",
        },
        method="POST",
    )
    return read_telegram_response(request, method)


def encode_multipart(
    fields: dict[str, str],
    file_field: str,
    file_path: Path,
) -> tuple[bytes, str]:
    boundary = "----lotargo-" + uuid.uuid4().hex
    chunks: list[bytes] = []
    for name, value in fields.items():
        chunks.extend(
            [
                f"--{boundary}\r\n".encode(),
                f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode(),
                value.encode("utf-8"),
                b"\r\n",
            ]
        )

    mime_type = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
    chunks.extend(
        [
            f"--{boundary}\r\n".encode(),
            (
                f'Content-Disposition: form-data; name="{file_field}"; '
                f'filename="{file_path.name}"\r\n'
            ).encode(),
            f"Content-Type: {mime_type}\r\n\r\n".encode(),
            file_path.read_bytes(),
            b"\r\n",
            f"--{boundary}--\r\n".encode(),
        ]
    )
    return b"".join(chunks), boundary


def telegram_request_photo(
    token: str,
    payload: dict[str, Any],
    photo_path: Path,
) -> dict[str, Any]:
    fields = {
        "chat_id": str(payload["chat_id"]),
        "caption": str(payload["caption"]),
        "parse_mode": str(payload["parse_mode"]),
        "reply_markup": json.dumps(payload["reply_markup"], ensure_ascii=False),
    }
    body, boundary = encode_multipart(fields, "photo", photo_path)
    request = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/sendPhoto",
        data=body,
        headers={
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "User-Agent": "lotargo-telegram-publisher/1.0",
        },
        method="POST",
    )
    return read_telegram_response(request, "sendPhoto")


def read_telegram_response(
    request: urllib.request.Request,
    method: str,
) -> dict[str, Any]:
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = json.load(response)
    except urllib.error.HTTPError as error:
        try:
            error_payload = json.loads(error.read().decode("utf-8"))
            description = error_payload.get("description", f"HTTP {error.code}")
        except (UnicodeDecodeError, json.JSONDecodeError):
            description = f"HTTP {error.code}"
        fail(f"Telegram {method} failed: {description}")
    except urllib.error.URLError as error:
        fail(f"Telegram API is unavailable: {error.reason}")
    except OSError as error:
        fail(f"Telegram {method} request failed: {error}")

    if not isinstance(payload, dict) or payload.get("ok") is not True:
        description = payload.get("description", "Telegram returned ok=false")
        fail(f"Telegram {method} rejected the request: {description}")
    result = payload.get("result")
    if not isinstance(result, dict):
        fail(f"Telegram {method} returned no message object")
    return result


def publish_announcement(
    token: str,
    chat_id: str,
    article: ArticleAnnouncement,
) -> dict[str, Any]:
    text = build_text(article)
    keyboard = build_keyboard(article.article_url)

    if article.cover_path is not None and len(text) <= 1024:
        return telegram_request_photo(
            token,
            {
                "chat_id": chat_id,
                "caption": text,
                "parse_mode": "HTML",
                "reply_markup": keyboard,
            },
            article.cover_path,
        )

    return telegram_request_json(
        token,
        "sendMessage",
        {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "HTML",
            "disable_web_page_preview": True,
            "reply_markup": keyboard,
        },
    )


def default_state() -> dict[str, Any]:
    return {"format_version": STATE_VERSION, "posts": {}}


def load_state(path: Path) -> dict[str, Any]:
    if not path.exists():
        return default_state()
    state = read_json(path)
    if state.get("format_version") != STATE_VERSION:
        fail(f"Unsupported Telegram publication state version in {path}")
    posts = state.get("posts")
    if not isinstance(posts, dict):
        fail(f"Telegram publication state has no posts object: {path}")
    return state


def save_state(path: Path, state: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(state, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def post_url(message: dict[str, Any]) -> str | None:
    message_id = message.get("message_id")
    chat = message.get("chat")
    if not isinstance(message_id, int) or not isinstance(chat, dict):
        return None
    username = chat.get("username")
    if not isinstance(username, str) or not username:
        return None
    return f"https://t.me/{username}/{message_id}"


def record_publication(
    state: dict[str, Any],
    article: ArticleAnnouncement,
    message: dict[str, Any],
) -> dict[str, Any]:
    posts = state["posts"]
    chat = message.get("chat") if isinstance(message.get("chat"), dict) else {}
    record = {
        "channel_id": chat.get("id"),
        "channel_username": chat.get("username"),
        "message_id": message.get("message_id"),
        "post_url": post_url(message),
        "source_hash": article.source_hash,
        "article_url": article.article_url,
    }
    posts[article.slug] = record
    return record


def select_manifests_from_changed_files(root: Path, paths: Iterable[str]) -> list[Path]:
    manifests: list[Path] = []
    seen: set[Path] = set()
    for raw in paths:
        value = raw.strip()
        if not value or not value.endswith(MANIFEST_SUFFIX):
            continue
        path = (root / value).resolve()
        try:
            path.relative_to(root.resolve())
        except ValueError:
            fail(f"Changed manifest path escapes repository root: {value}")
        if path.is_file() and path not in seen:
            manifests.append(path)
            seen.add(path)
    return manifests


def publish_articles(
    root: Path,
    manifests: list[Path],
    token: str | None,
    chat_id: str | None,
    site_url: str,
    dry_run: bool,
    force: bool,
) -> int:
    state_path = root / STATE_RELATIVE_PATH
    state = load_state(state_path)
    published = 0

    for manifest_path in manifests:
        article = load_announcement(root, manifest_path, site_url)
        existing = state["posts"].get(article.slug)
        if existing and not force:
            print(
                f"Skipping {article.slug}: it is already recorded as Telegram message "
                f"{existing.get('message_id', '<unknown>')}"
            )
            continue

        print(f"Article: {article.title}")
        print(f"URL: {article.article_url}")
        print(f"Cover: {article.cover_path or '<text-only>'}")
        print("Message preview:")
        print(build_text(article))

        if dry_run:
            print(f"Dry run: {article.slug} was not sent")
            continue

        if not token:
            fail("TELEGRAM_BOT_TOKEN is empty or unavailable")
        if not chat_id:
            fail("TELEGRAM_RU_CHAT_ID is empty or unavailable")

        message = publish_announcement(token, normalize_chat_id(chat_id), article)
        record = record_publication(state, article, message)
        save_state(state_path, state)
        published += 1

        print(f"Published {article.slug} as Telegram message {record.get('message_id')}")
        if record.get("post_url"):
            print(f"Post URL: {record['post_url']}")

    if not dry_run and published:
        save_state(state_path, state)
    print(f"Published {published} article announcement(s)")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument(
        "--site-url",
        default=os.environ.get("BLOG_SITE_URL", DEFAULT_SITE_URL),
    )
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--force", action="store_true")

    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--slug", help="Publish blog/content/<slug>.article.json")
    source.add_argument(
        "--changed-file-list",
        type=Path,
        help="Read changed repository paths and publish changed article manifests",
    )
    return parser


def main() -> int:
    args = build_parser().parse_args()
    root = args.root.resolve()

    try:
        if args.slug:
            manifests = [root / "blog" / "content" / f"{args.slug}{MANIFEST_SUFFIX}"]
        else:
            try:
                changed_paths = args.changed_file_list.read_text(encoding="utf-8").splitlines()
            except OSError as exc:
                fail(f"Cannot read changed-file list {args.changed_file_list}: {exc}")
            manifests = select_manifests_from_changed_files(root, changed_paths)

        if not manifests:
            print("No changed article manifests to publish")
            return 0

        return publish_articles(
            root=root,
            manifests=manifests,
            token=os.environ.get("TELEGRAM_BOT_TOKEN"),
            chat_id=os.environ.get("TELEGRAM_RU_CHAT_ID"),
            site_url=args.site_url,
            dry_run=args.dry_run,
            force=args.force,
        )
    except TelegramPublishError as exc:
        print(f"publish-telegram: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())

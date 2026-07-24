#!/usr/bin/env python3
"""Publish and update full Telegram article editions from installed Article Bundles.

The publisher prefers a dedicated Russian Telegram Markdown source installed as
`blog/content/<slug>.tg-RU.md` or one of the supported legacy aliases. Existing
Telegram posts are edited when their source hash changes. A new post is created
only for a new article, an explicit `--force` republish, or a presentation change
that Telegram cannot perform in place.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import re
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

from scripts import publish_telegram as legacy
from scripts.telegram_preview import (
    PROJECT_CAPTION_LIMIT,
    PROJECT_TEXT_LIMIT,
    markdown_to_visible_text,
)

TG_SOURCE_CANDIDATES = (
    "{slug}.tg-RU.md",
    "{slug}.telegram.ru.md",
    "{slug}.ru.tg.md",
)
PRESENTATIONS = {"link-preview", "photo-caption"}
FRONTMATTER_RE = re.compile(r"\A---\s*\n.*?\n---\s*(?:\n|\Z)", re.DOTALL)
IMAGE_LINE_RE = re.compile(r"^\s*!\[[^\]]*\]\([^)]*\)\s*$")
FENCE_RE = re.compile(r"^\s*```")
HEADING_RE = re.compile(r"^\s{0,3}(#{1,6})\s+(.+?)\s*$")
BLOCKQUOTE_RE = re.compile(r"^\s{0,3}>\s?(.*)$")
BULLET_RE = re.compile(r"^\s*[-+*]\s+(.+)$")
ORDERED_RE = re.compile(r"^\s*(\d+)[.)]\s+(.+)$")
MULTI_BLANK_RE = re.compile(r"\n{3,}")


class TelegramArticleError(RuntimeError):
    """Raised when a dedicated Telegram edition cannot be published."""


@dataclass(frozen=True)
class TelegramArticle:
    slug: str
    date: str
    title: str
    description: str
    article_url: str
    manifest_path: Path
    markdown_path: Path | None
    cover_path: Path | None
    telegram_path: Path | None
    presentation: str
    message_html: str
    visible_characters: int
    source_hash: str


def fail(message: str) -> "NoReturn":
    raise TelegramArticleError(message)


def _stash(store: list[str], value: str) -> str:
    store.append(value)
    return f"\u0000{len(store) - 1}\u0000"


def inline_markdown_to_html(value: str) -> str:
    """Convert the safe inline subset used by Telegram editions to Telegram HTML."""

    placeholders: list[str] = []

    def code_replace(match: re.Match[str]) -> str:
        return _stash(placeholders, f"<code>{html.escape(match.group(1))}</code>")

    def link_replace(match: re.Match[str]) -> str:
        label = html.escape(match.group(1))
        url = match.group(2).strip()
        if not re.match(r"^(?:https?://|mailto:)", url, re.IGNORECASE):
            return html.escape(match.group(0))
        return _stash(
            placeholders,
            f'<a href="{html.escape(url, quote=True)}">{label}</a>',
        )

    value = re.sub(r"`([^`\n]+)`", code_replace, value)
    value = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", link_replace, value)
    value = html.escape(value)

    value = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", value)
    value = re.sub(r"__(.+?)__", r"<b>\1</b>", value)
    value = re.sub(r"~~(.+?)~~", r"<s>\1</s>", value)
    value = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"<i>\1</i>", value)
    value = re.sub(r"(?<!_)_([^_\n]+)_(?!_)", r"<i>\1</i>", value)

    for index, replacement in enumerate(placeholders):
        value = value.replace(f"\u0000{index}\u0000", replacement)
    return value


def markdown_to_telegram_html(markdown: str) -> str:
    """Render a compact Markdown subset into one valid Telegram HTML message."""

    source = FRONTMATTER_RE.sub(
        "",
        markdown.replace("\r\n", "\n").replace("\r", "\n"),
        count=1,
    )

    output: list[str] = []
    code_lines: list[str] = []
    in_fence = False

    for raw_line in source.splitlines():
        if FENCE_RE.match(raw_line):
            if in_fence:
                output.append(
                    "<pre><code>"
                    + html.escape("\n".join(code_lines))
                    + "</code></pre>"
                )
                code_lines = []
                in_fence = False
            else:
                in_fence = True
            continue

        if in_fence:
            code_lines.append(raw_line)
            continue

        if IMAGE_LINE_RE.match(raw_line):
            continue

        stripped = raw_line.strip()
        if not stripped:
            output.append("")
            continue

        heading = HEADING_RE.match(raw_line)
        if heading:
            output.append(f"<b>{inline_markdown_to_html(heading.group(2))}</b>")
            continue

        quote = BLOCKQUOTE_RE.match(raw_line)
        if quote:
            output.append(
                f"<blockquote>{inline_markdown_to_html(quote.group(1))}</blockquote>"
            )
            continue

        bullet = BULLET_RE.match(raw_line)
        if bullet:
            output.append(f"• {inline_markdown_to_html(bullet.group(1))}")
            continue

        ordered = ORDERED_RE.match(raw_line)
        if ordered:
            output.append(
                f"{ordered.group(1)}. {inline_markdown_to_html(ordered.group(2))}"
            )
            continue

        output.append(inline_markdown_to_html(stripped))

    if in_fence:
        output.append(
            "<pre><code>" + html.escape("\n".join(code_lines)) + "</code></pre>"
        )

    rendered = "\n".join(output).strip()
    return MULTI_BLANK_RE.sub("\n\n", rendered)


def resolve_telegram_path(root: Path, slug: str) -> Path | None:
    content = root / "blog" / "content"
    for template in TG_SOURCE_CANDIDATES:
        candidate = content / template.format(slug=slug)
        if candidate.is_file():
            return candidate
    return None


def telegram_config(manifest: dict[str, Any]) -> dict[str, Any]:
    """Read the installed inline Telegram distribution settings."""

    distribution = manifest.get("distribution")
    if distribution is None:
        return {}
    if not isinstance(distribution, dict):
        fail("article.json distribution must be an object")

    telegram = distribution.get("telegram")
    if telegram is None:
        return {}
    if not isinstance(telegram, dict):
        fail("article.json distribution.telegram must be an object")

    config = telegram.get("ru")
    if config is None:
        return {}
    if not isinstance(config, dict):
        fail("article.json distribution.telegram.ru must be an object")
    return config


def resolve_configured_cover(
    root: Path,
    slug: str,
    config: dict[str, Any],
    default_cover: Path | None,
) -> Path | None:
    value = config.get("cover", "auto")
    if value is None or value is False:
        return None
    if value == "auto":
        return default_cover
    if not isinstance(value, str) or not value.strip():
        fail("distribution.telegram.ru.cover must be 'auto', null, or a relative path")

    relative = Path(value)
    if relative.is_absolute() or ".." in relative.parts:
        fail(f"Unsafe Telegram cover path: {value}")

    if value.startswith("assets/"):
        candidate = root / "blog" / "assets" / slug / value[len("assets/") :]
    else:
        candidate = root / "blog" / "assets" / slug / value

    candidate = candidate.resolve()
    assets_root = (root / "blog" / "assets" / slug).resolve()
    if candidate != assets_root and assets_root not in candidate.parents:
        fail(f"Telegram cover escapes article assets: {value}")
    if not candidate.is_file():
        fail(f"Configured Telegram cover does not exist: {value}")
    if candidate.suffix.lower() not in legacy.SUPPORTED_PHOTO_SUFFIXES:
        fail(f"Unsupported Telegram cover format: {candidate.suffix}")
    return candidate


def source_hash(
    manifest: dict[str, Any],
    telegram_text: str,
    presentation: str,
    cover_path: Path | None,
) -> str:
    digest = hashlib.sha256()
    digest.update(
        json.dumps(
            {
                "slug": manifest.get("slug"),
                "date": manifest.get("date"),
                "presentation": presentation,
                "telegram_text": telegram_text,
                "distribution": manifest.get("distribution"),
            },
            ensure_ascii=False,
            sort_keys=True,
        ).encode("utf-8")
    )
    if cover_path is not None:
        digest.update(cover_path.read_bytes())
    return "sha256:" + digest.hexdigest()


def load_article(root: Path, manifest_path: Path, site_url: str) -> TelegramArticle:
    manifest = legacy.read_json(manifest_path)
    slug = manifest.get("slug")
    if not isinstance(slug, str) or not slug:
        fail(f"article.json has no valid slug: {manifest_path}")

    expected_slug = legacy.manifest_slug(manifest_path)
    if slug != expected_slug:
        fail(
            f"Manifest filename slug {expected_slug!r} does not match article slug {slug!r}"
        )

    date = manifest.get("date")
    if not isinstance(date, str) or not date:
        fail(f"article.json has no valid date: {manifest_path}")

    post = manifest.get("post")
    if not isinstance(post, dict):
        fail(f"article.json has no post object: {manifest_path}")

    title = legacy.localized(post.get("title"), "ru", "title")
    description = legacy.localized(post.get("description"), "ru", "description")
    article_url = f"{site_url.rstrip('/')}/blog/posts/{slug}.html"
    markdown_path = legacy.resolve_markdown_path(root, slug, manifest)
    default_cover = legacy.resolve_cover_path(root, slug, markdown_path)
    telegram_path = resolve_telegram_path(root, slug)
    config = telegram_config(manifest)

    configured_presentation = config.get("presentation")
    if configured_presentation is not None and configured_presentation not in PRESENTATIONS:
        choices = ", ".join(sorted(PRESENTATIONS))
        fail(f"distribution.telegram.ru.presentation must be one of: {choices}")

    if telegram_path is None:
        telegram_source = (
            f"<b>{html.escape(title)}</b>\n\n"
            f"{html.escape(description)}\n\n"
            f"<i>{html.escape(date)}</i>"
        )
        visible_characters = len(title) + len(description) + len(date) + 4
        presentation = configured_presentation or "link-preview"
        cover_path = (
            resolve_configured_cover(root, slug, config, default_cover)
            if presentation == "photo-caption"
            else None
        )
        if presentation == "photo-caption" and cover_path is None:
            fail("photo-caption presentation requires a Telegram cover")
        return TelegramArticle(
            slug=slug,
            date=date,
            title=title,
            description=description,
            article_url=article_url,
            manifest_path=manifest_path,
            markdown_path=markdown_path,
            cover_path=cover_path,
            telegram_path=None,
            presentation=presentation,
            message_html=telegram_source,
            visible_characters=visible_characters,
            source_hash=source_hash(
                manifest,
                telegram_source,
                presentation,
                cover_path,
            ),
        )

    telegram_markdown = telegram_path.read_text(encoding="utf-8")
    visible_characters = len(markdown_to_visible_text(telegram_markdown))
    presentation = configured_presentation or "link-preview"
    cover_path = (
        resolve_configured_cover(root, slug, config, default_cover)
        if presentation == "photo-caption"
        else None
    )
    if presentation == "photo-caption" and cover_path is None:
        fail("photo-caption presentation requires a Telegram cover")

    project_limit = (
        PROJECT_CAPTION_LIMIT
        if presentation == "photo-caption"
        else PROJECT_TEXT_LIMIT
    )
    if visible_characters > project_limit:
        fail(
            f"Telegram edition {telegram_path.name} renders to "
            f"{visible_characters} characters, limit is {project_limit}"
        )

    message_html = markdown_to_telegram_html(telegram_markdown)
    if not message_html:
        fail(f"Telegram edition is empty after rendering: {telegram_path}")

    return TelegramArticle(
        slug=slug,
        date=date,
        title=title,
        description=description,
        article_url=article_url,
        manifest_path=manifest_path,
        markdown_path=markdown_path,
        cover_path=cover_path,
        telegram_path=telegram_path,
        presentation=presentation,
        message_html=message_html,
        visible_characters=visible_characters,
        source_hash=source_hash(
            manifest,
            telegram_markdown,
            presentation,
            cover_path,
        ),
    )


def build_keyboard(article_url: str) -> dict[str, Any]:
    return {
        "inline_keyboard": [
            [{"text": "Полная версия в блоге", "url": article_url}],
        ]
    }


def text_payload(chat_id: str, article: TelegramArticle) -> dict[str, Any]:
    return {
        "chat_id": chat_id,
        "text": article.message_html,
        "parse_mode": "HTML",
        "link_preview_options": {
            "is_disabled": False,
            "url": article.article_url,
            "prefer_large_media": True,
            "show_above_text": False,
        },
        "reply_markup": build_keyboard(article.article_url),
    }


def publish_article(
    token: str,
    chat_id: str,
    article: TelegramArticle,
) -> dict[str, Any]:
    if article.presentation == "photo-caption":
        if article.cover_path is None:
            fail("photo-caption publication has no cover")
        return legacy.telegram_request_photo(
            token,
            {
                "chat_id": chat_id,
                "caption": article.message_html,
                "parse_mode": "HTML",
                "reply_markup": build_keyboard(article.article_url),
            },
            article.cover_path,
        )

    return legacy.telegram_request_json(
        token,
        "sendMessage",
        text_payload(chat_id, article),
    )


def edit_photo_article(
    token: str,
    chat_id: str,
    message_id: int,
    article: TelegramArticle,
) -> dict[str, Any]:
    if article.cover_path is None:
        fail("photo-caption edit has no cover")

    media = {
        "type": "photo",
        "media": "attach://photo",
        "caption": article.message_html,
        "parse_mode": "HTML",
    }
    fields = {
        "chat_id": chat_id,
        "message_id": str(message_id),
        "media": json.dumps(media, ensure_ascii=False),
        "reply_markup": json.dumps(
            build_keyboard(article.article_url),
            ensure_ascii=False,
        ),
    }
    body, boundary = legacy.encode_multipart(
        fields,
        "photo",
        article.cover_path,
    )
    request = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/editMessageMedia",
        data=body,
        headers={
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "User-Agent": "lotargo-telegram-publisher/2.0",
        },
        method="POST",
    )
    return legacy.read_telegram_response(request, "editMessageMedia")


def edit_text_article(
    token: str,
    chat_id: str,
    message_id: int,
    article: TelegramArticle,
) -> dict[str, Any]:
    payload = text_payload(chat_id, article)
    payload["message_id"] = message_id
    return legacy.telegram_request_json(
        token,
        "editMessageText",
        payload,
    )


def delete_message(token: str, chat_id: str, message_id: int) -> None:
    payload = json.dumps(
        {"chat_id": chat_id, "message_id": message_id},
        ensure_ascii=False,
    ).encode("utf-8")
    request = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/deleteMessage",
        data=payload,
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "lotargo-telegram-publisher/2.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            result = json.load(response)
    except urllib.error.HTTPError as error:
        try:
            error_payload = json.loads(error.read().decode("utf-8"))
            description = error_payload.get("description", f"HTTP {error.code}")
        except (UnicodeDecodeError, json.JSONDecodeError):
            description = f"HTTP {error.code}"
        raise legacy.TelegramPublishError(
            f"Telegram deleteMessage failed: {description}"
        ) from error
    except urllib.error.URLError as error:
        raise legacy.TelegramPublishError(
            f"Telegram API is unavailable: {error.reason}"
        ) from error

    if not isinstance(result, dict) or result.get("ok") is not True:
        description = (
            result.get("description", "Telegram returned ok=false")
            if isinstance(result, dict)
            else "Telegram returned an invalid response"
        )
        raise legacy.TelegramPublishError(
            f"Telegram deleteMessage rejected the request: {description}"
        )


def publication_action(
    existing: dict[str, Any] | None,
    article: TelegramArticle,
    force: bool,
) -> str:
    if not existing:
        return "publish"
    if force:
        return "replace"
    if existing.get("source_hash") == article.source_hash:
        return "skip"
    old_presentation = existing.get("presentation", "link-preview")
    if old_presentation == "photo-caption" and article.presentation == "link-preview":
        return "replace"
    return "edit"


def existing_message_id(existing: dict[str, Any]) -> int:
    message_id = existing.get("message_id")
    if not isinstance(message_id, int):
        fail("Recorded Telegram publication has no valid message_id")
    return message_id


def edit_existing_article(
    token: str,
    chat_id: str,
    article: TelegramArticle,
    existing: dict[str, Any],
) -> dict[str, Any]:
    message_id = existing_message_id(existing)
    if article.presentation == "photo-caption":
        return edit_photo_article(token, chat_id, message_id, article)
    return edit_text_article(token, chat_id, message_id, article)


def replace_existing_article(
    token: str,
    chat_id: str,
    article: TelegramArticle,
    existing: dict[str, Any],
) -> dict[str, Any]:
    """Publish the replacement before removing the old message."""

    new_message = publish_article(token, chat_id, article)
    try:
        delete_message(token, chat_id, existing_message_id(existing))
    except legacy.TelegramPublishError as exc:
        print(
            f"::warning title=Old Telegram post was not deleted::{exc}",
            file=sys.stderr,
        )
    return new_message


def record_article(
    state: dict[str, Any],
    article: TelegramArticle,
    message: dict[str, Any],
    action: str,
) -> dict[str, Any]:
    record = legacy.record_publication(state, article, message)
    record["presentation"] = article.presentation
    record["telegram_source"] = (
        article.telegram_path.name if article.telegram_path else None
    )
    record["last_action"] = action
    return record


def publish_articles(
    root: Path,
    manifests: list[Path],
    token: str | None,
    chat_id: str | None,
    site_url: str,
    dry_run: bool,
    force: bool,
) -> int:
    state_path = root / legacy.STATE_RELATIVE_PATH
    state = legacy.load_state(state_path)
    counters = {"publish": 0, "edit": 0, "replace": 0, "skip": 0}

    for manifest_path in manifests:
        article = load_article(root, manifest_path, site_url)
        existing = state["posts"].get(article.slug)
        action = publication_action(existing, article, force)

        print(f"Article: {article.title}")
        print(f"URL: {article.article_url}")
        print(f"Telegram source: {article.telegram_path or '<legacy announcement>'}")
        print(
            f"Presentation: {article.presentation} "
            f"({article.visible_characters} visible characters)"
        )
        print(f"Cover: {article.cover_path or '<link preview>'}")
        print(f"Action: {action}")
        print("Message preview:")
        print(article.message_html)

        if action == "skip":
            counters["skip"] += 1
            print(
                f"Skipping {article.slug}: Telegram message "
                f"{existing.get('message_id', '<unknown>')} already matches source hash"
            )
            continue

        if dry_run:
            print(f"Dry run: {article.slug} would use action {action}")
            continue

        if not token:
            fail("TELEGRAM_BOT_TOKEN is empty or unavailable")
        if not chat_id:
            fail("TELEGRAM_RU_CHAT_ID is empty or unavailable")

        normalized_chat_id = legacy.normalize_chat_id(chat_id)

        if action == "publish":
            message = publish_article(token, normalized_chat_id, article)
        elif action == "replace":
            if not isinstance(existing, dict):
                fail("Cannot replace a Telegram post without publication state")
            message = replace_existing_article(
                token,
                normalized_chat_id,
                article,
                existing,
            )
        else:
            if not isinstance(existing, dict):
                fail("Cannot edit a Telegram post without publication state")
            try:
                message = edit_existing_article(
                    token,
                    normalized_chat_id,
                    article,
                    existing,
                )
            except legacy.TelegramPublishError as exc:
                print(
                    f"::warning title=Telegram edit failed; publishing replacement::{exc}",
                    file=sys.stderr,
                )
                message = replace_existing_article(
                    token,
                    normalized_chat_id,
                    article,
                    existing,
                )
                action = "replace"

        record = record_article(state, article, message, action)
        legacy.save_state(state_path, state)
        counters[action] += 1

        verb = {
            "publish": "Published",
            "edit": "Updated",
            "replace": "Replaced",
        }[action]
        print(
            f"{verb} {article.slug} as Telegram message "
            f"{record.get('message_id')}"
        )
        if record.get("post_url"):
            print(f"Post URL: {record['post_url']}")

    if not dry_run and any(counters[key] for key in ("publish", "edit", "replace")):
        legacy.save_state(state_path, state)

    print(
        "Telegram publication summary: "
        f"published={counters['publish']}, "
        f"updated={counters['edit']}, "
        f"replaced={counters['replace']}, "
        f"skipped={counters['skip']}"
    )
    return 0


def select_manifests_from_changed_files(
    root: Path,
    paths: Iterable[str],
) -> list[Path]:
    root = root.resolve()
    manifests: set[Path] = set()

    for raw in paths:
        value = raw.strip()
        if not value:
            continue
        normalized = value.replace("\\", "/")
        slug: str | None = None

        if normalized.startswith("blog/content/"):
            name = Path(normalized).name
            if name.endswith(legacy.MANIFEST_SUFFIX):
                slug = name[: -len(legacy.MANIFEST_SUFFIX)]
            elif "." in name:
                slug = name.split(".", 1)[0]
        elif normalized.startswith("blog/assets/"):
            parts = normalized.split("/")
            if len(parts) >= 3:
                slug = parts[2]

        if not slug:
            continue
        manifest = root / "blog" / "content" / f"{slug}{legacy.MANIFEST_SUFFIX}"
        if manifest.is_file():
            manifests.add(manifest.resolve())

    return sorted(manifests)


def select_manifests(root: Path, args: argparse.Namespace) -> list[Path]:
    if args.slug:
        path = root / "blog" / "content" / f"{args.slug}.article.json"
        if not path.is_file():
            fail(f"Installed article manifest does not exist: {path}")
        return [path.resolve()]

    changed_file_list = args.changed_file_list
    if changed_file_list is None or not changed_file_list.is_file():
        fail("--changed-file-list must point to an existing file")
    return select_manifests_from_changed_files(
        root,
        changed_file_list.read_text(encoding="utf-8").splitlines(),
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument(
        "--site-url",
        default=os.environ.get("BLOG_SITE_URL", legacy.DEFAULT_SITE_URL),
    )
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Republish as a new message even when publication state already exists",
    )
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--slug")
    source.add_argument("--changed-file-list", type=Path)
    return parser


def main() -> int:
    args = build_parser().parse_args()
    root = args.root.resolve()

    try:
        manifests = select_manifests(root, args)
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
    except (TelegramArticleError, legacy.TelegramPublishError, OSError) as exc:
        print(f"publish-telegram-article: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())

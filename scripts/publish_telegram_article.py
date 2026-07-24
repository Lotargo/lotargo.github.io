#!/usr/bin/env python3
"""Publish full Telegram article editions from installed Article Bundles.

The publisher prefers a dedicated Russian Telegram Markdown source installed as
`blog/content/<slug>.tg-RU.md` or `blog/content/<slug>.telegram.ru.md`.
When no Telegram edition exists, it falls back to the compact legacy
announcement.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

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
    cover_path = legacy.resolve_cover_path(root, slug, markdown_path)
    telegram_path = resolve_telegram_path(root, slug)

    if telegram_path is None:
        legacy_text = (
            f"<b>{html.escape(title)}</b>\n\n"
            f"{html.escape(description)}\n\n"
            f"<i>{html.escape(date)}</i>"
        )
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
            presentation="photo-caption"
            if cover_path is not None and len(legacy_text) <= 1024
            else "link-preview",
            message_html=legacy_text,
            visible_characters=len(title) + len(description) + len(date) + 4,
            source_hash=legacy.article_hash(manifest, title, description, cover_path),
        )

    telegram_markdown = telegram_path.read_text(encoding="utf-8")
    visible_characters = len(markdown_to_visible_text(telegram_markdown))
    presentation = (
        "photo-caption"
        if cover_path is not None and visible_characters <= PROJECT_CAPTION_LIMIT
        else "link-preview"
    )
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


def publish_article(
    token: str,
    chat_id: str,
    article: TelegramArticle,
) -> dict[str, Any]:
    keyboard = build_keyboard(article.article_url)

    if article.presentation == "photo-caption" and article.cover_path is not None:
        return legacy.telegram_request_photo(
            token,
            {
                "chat_id": chat_id,
                "caption": article.message_html,
                "parse_mode": "HTML",
                "reply_markup": keyboard,
            },
            article.cover_path,
        )

    return legacy.telegram_request_json(
        token,
        "sendMessage",
        {
            "chat_id": chat_id,
            "text": article.message_html,
            "parse_mode": "HTML",
            "link_preview_options": {
                "is_disabled": False,
                "url": article.article_url,
                "prefer_large_media": True,
                "show_above_text": False,
            },
            "reply_markup": keyboard,
        },
    )


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
    published = 0

    for manifest_path in manifests:
        article = load_article(root, manifest_path, site_url)
        existing = state["posts"].get(article.slug)
        if existing and not force:
            print(
                f"Skipping {article.slug}: it is already recorded as Telegram message "
                f"{existing.get('message_id', '<unknown>')}"
            )
            continue

        print(f"Article: {article.title}")
        print(f"URL: {article.article_url}")
        print(f"Telegram source: {article.telegram_path or '<legacy announcement>'}")
        print(
            f"Presentation: {article.presentation} "
            f"({article.visible_characters} visible characters)"
        )
        print(f"Cover: {article.cover_path or '<link preview>'}")
        print("Message preview:")
        print(article.message_html)

        if dry_run:
            print(f"Dry run: {article.slug} was not sent")
            continue

        if not token:
            fail("TELEGRAM_BOT_TOKEN is empty or unavailable")
        if not chat_id:
            fail("TELEGRAM_RU_CHAT_ID is empty or unavailable")

        message = publish_article(token, legacy.normalize_chat_id(chat_id), article)
        record = legacy.record_publication(state, article, message)
        record["presentation"] = article.presentation
        record["telegram_source"] = (
            article.telegram_path.name if article.telegram_path else None
        )
        legacy.save_state(state_path, state)
        published += 1

        print(f"Published {article.slug} as Telegram message {record.get('message_id')}")
        if record.get("post_url"):
            print(f"Post URL: {record['post_url']}")

    if not dry_run and published:
        legacy.save_state(state_path, state)
    print(f"Published {published} Telegram article(s)")
    return 0


def select_manifests(root: Path, args: argparse.Namespace) -> list[Path]:
    if args.slug:
        path = root / "blog" / "content" / f"{args.slug}.article.json"
        if not path.is_file():
            fail(f"Installed article manifest does not exist: {path}")
        return [path.resolve()]

    changed_file_list = args.changed_file_list
    if changed_file_list is None or not changed_file_list.is_file():
        fail("--changed-file-list must point to an existing file")
    return legacy.select_manifests_from_changed_files(
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
    parser.add_argument("--force", action="store_true")
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

#!/usr/bin/env python3
"""Validate optional Telegram article editions inside an Article Bundle."""

from __future__ import annotations

import html
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

PROJECT_TEXT_LIMIT = 3600
TELEGRAM_TEXT_HARD_LIMIT = 4096
PROJECT_CAPTION_LIMIT = 900
TELEGRAM_CAPTION_HARD_LIMIT = 1024
DISTRIBUTION_FILENAME = "distribution.json"
DEFAULT_SOURCES = {
    "ru": "content/telegram/ru.md",
    "en": "content/telegram/en.md",
}
PRESENTATION_LIMITS = {
    "link-preview": (PROJECT_TEXT_LIMIT, TELEGRAM_TEXT_HARD_LIMIT),
    "photo-caption": (PROJECT_CAPTION_LIMIT, TELEGRAM_CAPTION_HARD_LIMIT),
}
LANGUAGE_RE = re.compile(r"^[a-z]{2}(?:-[A-Z]{2})?$")
FRONTMATTER_RE = re.compile(r"\A---\s*\n.*?\n---\s*(?:\n|\Z)", re.DOTALL)
FENCED_CODE_RE = re.compile(r"```[^\n]*\n(.*?)\n```", re.DOTALL)
IMAGE_RE = re.compile(r"!\[[^\]]*\]\([^)]*\)")
LINK_RE = re.compile(r"\[([^\]]+)\]\((?:[^()]+|\([^)]*\))*\)")
AUTOLINK_RE = re.compile(r"<((?:https?://|mailto:)[^>]+)>")
HTML_TAG_RE = re.compile(r"<[^>]+>")
HEADING_RE = re.compile(r"^\s{0,3}#{1,6}\s+", re.MULTILINE)
BLOCKQUOTE_RE = re.compile(r"^\s{0,3}>\s?", re.MULTILINE)
LIST_RE = re.compile(r"^\s*(?:[-+*]|\d+[.)])\s+", re.MULTILINE)
EMPHASIS_RE = re.compile(r"(?<!\\)(?:\*\*|__|~~|\*|_|`)")
ESCAPED_MARKDOWN_RE = re.compile(r"\\([\\`*_{}\[\]()#+\-.!>])")
MULTI_BLANK_RE = re.compile(r"\n{3,}")


class TelegramPreviewError(RuntimeError):
    """Raised when a Telegram edition cannot be safely published."""

    def __init__(
        self,
        message: str,
        *,
        logical_path: str | None = None,
        title: str = "Telegram article rejected",
    ):
        super().__init__(message)
        self.logical_path = logical_path
        self.title = title

    @staticmethod
    def _escape(value: str) -> str:
        return (
            value.replace("%", "%25")
            .replace("\r", "%0D")
            .replace("\n", "%0A")
            .replace(":", "%3A")
            .replace(",", "%2C")
        )

    def github_annotation(self) -> str:
        metadata = [f"title={self._escape(self.title)}"]
        if self.logical_path:
            metadata.insert(0, f"file={self._escape(self.logical_path)}")
        return f"::error {','.join(metadata)}::{self._escape(str(self))}"


@dataclass(frozen=True)
class TelegramEdition:
    language: str
    source_path: Path
    logical_path: str
    presentation: str
    project_limit: int
    hard_limit: int
    rendered_characters: int


def _read_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise TelegramPreviewError(
            f"Cannot read {DISTRIBUTION_FILENAME}: {exc}",
            logical_path=DISTRIBUTION_FILENAME,
        ) from exc
    if not isinstance(value, dict):
        raise TelegramPreviewError(
            f"{DISTRIBUTION_FILENAME} must contain a JSON object",
            logical_path=DISTRIBUTION_FILENAME,
        )
    return value


def markdown_to_visible_text(markdown: str) -> str:
    """Approximate Telegram characters after entity parsing.

    Formatting markers and image references disappear, while visible link labels,
    code contents, list contents, and line breaks remain.
    """

    text = FRONTMATTER_RE.sub(
        "",
        markdown.replace("\r\n", "\n").replace("\r", "\n"),
    )
    text = FENCED_CODE_RE.sub(lambda match: match.group(1), text)
    text = IMAGE_RE.sub("", text)
    text = LINK_RE.sub(lambda match: match.group(1), text)
    text = AUTOLINK_RE.sub(lambda match: match.group(1), text)
    text = HTML_TAG_RE.sub("", text)
    text = HEADING_RE.sub("", text)
    text = BLOCKQUOTE_RE.sub("", text)
    text = LIST_RE.sub("• ", text)
    text = EMPHASIS_RE.sub("", text)
    text = ESCAPED_MARKDOWN_RE.sub(lambda match: match.group(1), text)
    text = html.unescape(text)
    text = "\n".join(line.rstrip() for line in text.splitlines()).strip()
    return MULTI_BLANK_RE.sub("\n\n", text)


def _safe_source_path(bundle_root: Path, source: str, field: str) -> Path:
    relative = Path(source)
    if relative.is_absolute() or ".." in relative.parts:
        raise TelegramPreviewError(
            f"{field} must be a safe relative path: {source}",
            logical_path=DISTRIBUTION_FILENAME,
        )
    resolved_root = bundle_root.resolve()
    resolved = (bundle_root / relative).resolve()
    if resolved != resolved_root and resolved_root not in resolved.parents:
        raise TelegramPreviewError(
            f"{field} escapes the Article Bundle: {source}",
            logical_path=DISTRIBUTION_FILENAME,
        )
    return resolved


def _edition_from_config(
    bundle_root: Path,
    language: str,
    config: dict[str, Any],
) -> TelegramEdition | None:
    enabled = config.get("enabled", True)
    if not isinstance(enabled, bool):
        raise TelegramPreviewError(
            f"telegram.{language}.enabled must be true or false",
            logical_path=DISTRIBUTION_FILENAME,
        )

    source = config.get(
        "source",
        DEFAULT_SOURCES.get(language, f"content/telegram/{language}.md"),
    )
    if not isinstance(source, str) or not source.strip():
        raise TelegramPreviewError(
            f"telegram.{language}.source must be a non-empty relative path",
            logical_path=DISTRIBUTION_FILENAME,
        )

    presentation = config.get("presentation", "link-preview")
    if presentation not in PRESENTATION_LIMITS:
        choices = ", ".join(sorted(PRESENTATION_LIMITS))
        raise TelegramPreviewError(
            f"telegram.{language}.presentation must be one of: {choices}",
            logical_path=DISTRIBUTION_FILENAME,
        )

    source_path = _safe_source_path(
        bundle_root,
        source,
        f"telegram.{language}.source",
    )
    if not source_path.is_file():
        if enabled:
            raise TelegramPreviewError(
                f"Enabled Telegram edition {language!r} is missing its Markdown source: {source}",
                logical_path=source,
            )
        return None
    if source_path.suffix.lower() != ".md":
        raise TelegramPreviewError(
            f"Telegram edition source must be a Markdown file: {source}",
            logical_path=source,
        )

    try:
        markdown = source_path.read_text(encoding="utf-8")
    except OSError as exc:
        raise TelegramPreviewError(
            f"Cannot read Telegram edition {source}: {exc}",
            logical_path=source,
        ) from exc

    visible_text = markdown_to_visible_text(markdown)
    rendered_characters = len(visible_text)
    project_limit, hard_limit = PRESENTATION_LIMITS[presentation]

    if rendered_characters == 0:
        raise TelegramPreviewError(
            f"Telegram edition {language!r} is empty after Markdown formatting is removed",
            logical_path=source,
        )

    if rendered_characters > project_limit:
        excess = rendered_characters - project_limit
        raise TelegramPreviewError(
            (
                f"Telegram edition {language!r} renders to {rendered_characters} characters, "
                f"but the project limit for {presentation!r} is {project_limit} "
                f"(Telegram hard limit: {hard_limit}). Shorten it by at least {excess} characters. "
                "The Article Bundle was rejected before deployment and nothing was published."
            ),
            logical_path=source,
            title=f"Telegram {language.upper()} edition is too long",
        )

    return TelegramEdition(
        language=language,
        source_path=source_path,
        logical_path=source,
        presentation=presentation,
        project_limit=project_limit,
        hard_limit=hard_limit,
        rendered_characters=rendered_characters,
    )


def validate_bundle_telegram_editions(bundle_root: Path) -> list[TelegramEdition]:
    """Validate Telegram editions, returning an empty list for legacy bundles."""

    distribution_path = bundle_root / DISTRIBUTION_FILENAME
    editions: list[TelegramEdition] = []

    if distribution_path.is_file():
        distribution = _read_json(distribution_path)
        if distribution.get("format_version") != 1:
            raise TelegramPreviewError(
                f"{DISTRIBUTION_FILENAME} format_version must equal 1",
                logical_path=DISTRIBUTION_FILENAME,
            )
        telegram = distribution.get("telegram")
        if not isinstance(telegram, dict) or not telegram:
            raise TelegramPreviewError(
                f"{DISTRIBUTION_FILENAME} must contain a non-empty telegram object",
                logical_path=DISTRIBUTION_FILENAME,
            )

        for language, config in telegram.items():
            if not isinstance(language, str) or not LANGUAGE_RE.fullmatch(language):
                raise TelegramPreviewError(
                    f"Invalid Telegram language code: {language!r}",
                    logical_path=DISTRIBUTION_FILENAME,
                )
            if not isinstance(config, dict):
                raise TelegramPreviewError(
                    f"telegram.{language} must be an object",
                    logical_path=DISTRIBUTION_FILENAME,
                )
            edition = _edition_from_config(bundle_root, language, config)
            if edition is not None:
                editions.append(edition)
        return editions

    for language, source in DEFAULT_SOURCES.items():
        if (bundle_root / source).is_file():
            edition = _edition_from_config(
                bundle_root,
                language,
                {
                    "enabled": True,
                    "source": source,
                    "presentation": "link-preview",
                },
            )
            if edition is not None:
                editions.append(edition)
    return editions

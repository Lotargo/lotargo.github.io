#!/usr/bin/env python3
"""Deterministic editorial checks for public Article Bundle prose."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

EM_DASH = "\u2014"


class EditorialRuleError(RuntimeError):
    """Raised when publication prose violates a deterministic house rule."""

    def __init__(
        self,
        message: str,
        *,
        logical_path: str | None = None,
        line: int | None = None,
        title: str = "Editorial rule rejected publication",
    ):
        super().__init__(message)
        self.logical_path = logical_path
        self.line = line
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
        if self.line is not None:
            metadata.insert(1 if self.logical_path else 0, f"line={self.line}")
        return f"::error {','.join(metadata)}::{self._escape(str(self))}"


def _reject_em_dash(text: str, logical_path: str) -> None:
    if EM_DASH not in text:
        return
    offset = text.index(EM_DASH)
    line = text.count("\n", 0, offset) + 1
    raise EditorialRuleError(
        (
            "Public prose must not contain the Unicode U+2014 em dash. "
            "Rewrite the sentence with clearer punctuation; if a dash is unavoidable, "
            "use '-' sparingly."
        ),
        logical_path=logical_path,
        line=line,
        title="Long dash is forbidden in publication text",
    )


def _walk_strings(value: Any, prefix: str = ""):
    if isinstance(value, str):
        yield prefix, value
        return
    if isinstance(value, dict):
        for key, child in value.items():
            child_prefix = f"{prefix}.{key}" if prefix else str(key)
            yield from _walk_strings(child, child_prefix)
        return
    if isinstance(value, list):
        for index, child in enumerate(value):
            child_prefix = f"{prefix}[{index}]"
            yield from _walk_strings(child, child_prefix)


def validate_bundle_editorial_rules(bundle_root: Path) -> None:
    """Validate deterministic house style rules for public bundle prose."""

    bundle_root = bundle_root.resolve()
    content_root = bundle_root / "content"

    if content_root.is_dir():
        for path in sorted(content_root.rglob("*.md")):
            logical = path.relative_to(bundle_root).as_posix()
            _reject_em_dash(path.read_text(encoding="utf-8"), logical)

    manifest_path = bundle_root / "article.json"
    if not manifest_path.is_file():
        return

    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return

    post = manifest.get("post") if isinstance(manifest, dict) else None
    if post is None:
        return

    for field, value in _walk_strings(post, "post"):
        if EM_DASH in value:
            raise EditorialRuleError(
                (
                    f"article.json field {field} contains the Unicode U+2014 em dash. "
                    "Rewrite the public metadata without a long dash."
                ),
                logical_path="article.json",
                title="Long dash is forbidden in publication metadata",
            )

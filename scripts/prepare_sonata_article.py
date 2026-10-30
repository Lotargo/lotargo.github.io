#!/usr/bin/env python3
"""Render the Sonata research article using the shared Markdown pipeline.

Run from any directory: python scripts/prepare_sonata_article.py
Sources: blog/content/sonata-learning-report.{ru,en,tg-RU}.md and .article.json.
This command only prepares local static files; it does not commit or publish.
"""

from __future__ import annotations

import hashlib
import json
import re
import shutil
import sys
import tempfile
from pathlib import Path

sys.dont_write_bytecode = True

from article_bundle import build_post_entry, load_manifest, update_blog_manifest
from render_article import render_bundle

ROOT = Path(__file__).resolve().parents[1]
SLUG = "sonata-learning-report"


def prepare_tables(document: str) -> str:
    counter = 0

    def wrap(match: re.Match[str]) -> str:
        nonlocal counter
        counter += 1
        label_id = f"research-table-{counter}"
        table = match.group(2).replace("<th>", '<th scope="col">')
        return (
            f'<p class="table-caption" id="{label_id}">{match.group(1)}</p>\n'
            f'<div class="research-table-scroll" role="region" tabindex="0" '
            f'aria-labelledby="{label_id}"><table aria-labelledby="{label_id}">'
            f"{table}</table></div>"
        )

    result = re.sub(
        r'<p class="table-caption">(.*?)</p>\s*<table>(.*?)</table>',
        wrap,
        document,
        flags=re.S,
    )
    if counter == 0 or "<table>" in result:
        raise ValueError("Every research table must have a .table-caption paragraph")
    return result


def prepare_diagrams(document: str) -> str:
    """Keep the wide vector as the full source and use a stacked layout on phones."""
    def responsive(match: re.Match[str]) -> str:
        base = match.group("base")
        language = base.rsplit("-", 1)[1]
        image = match.group("image")[:-1] + ' width="1600" height="1130">'
        return (
            '<figure class="post-figure post-figure--editorial sonata-architecture"'
            f' id="{language}-architecture-diagram"{match.group("attrs")}\n'
            '<picture>'
            f'<source media="(max-width: 680px)" type="image/svg+xml" '
            f'srcset="{base}-mobile.svg" width="800" height="2140">'
            f'{image}</picture>'
        )

    result, count = re.subn(
        r'<figure class="post-figure post-figure--editorial"(?P<attrs>[^>]*>)\s*'
        r'(?P<image><img[^>]*src="(?P<base>\.\./assets/sonata-learning-report/sonata-architecture-(?:ru|en))\.svg"[^>]*>)',
        responsive,
        document,
    )
    if count != 2:
        raise ValueError("Expected one architecture diagram in each language")
    return result


def main() -> None:
    content = ROOT / "blog" / "content"
    assets = ROOT / "blog" / "assets" / SLUG
    metadata = json.loads((content / f"{SLUG}.article.json").read_text(encoding="utf-8"))
    if metadata["post"].get("notify") is not False:
        raise ValueError("This article keeps site notifications disabled")
    checksum_path = assets / "artifact-checksums.json"
    files = sorted(path for path in assets.iterdir() if path.is_file() and path != checksum_path)
    checksums = {
        "format_version": 1,
        "report_date": metadata["date"],
        "scope": "Checksums of the files supplied with the article. Source code is private; no private repository revisions or source paths are included.",
        "artifacts": [
            {"file": path.name, "sha256": hashlib.sha256(path.read_bytes()).hexdigest(), "bytes": path.stat().st_size}
            for path in files
        ],
    }
    checksum_path.write_text(json.dumps(checksums, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with tempfile.TemporaryDirectory(prefix="sonata-article-") as temporary:
        bundle = Path(temporary)
        (bundle / "content").mkdir()
        (bundle / "article.json").write_text(json.dumps(metadata, ensure_ascii=False), encoding="utf-8")
        for language, relative_path in metadata["sources"].items():
            destination = bundle / relative_path
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(content / f"{SLUG}.{language}.md", destination)
        shutil.copytree(assets, bundle / "assets")
        generated = render_bundle(bundle, ROOT / "templates" / "research-article.html")
        document = prepare_tables(generated.read_text(encoding="utf-8"))
        generated.write_text(prepare_diagrams(document), encoding="utf-8")
        manifest = load_manifest(bundle)
        target = ROOT / "blog" / "posts" / f"{SLUG}.html"
        shutil.copy2(generated, target)
        update_blog_manifest(ROOT / "assets" / "js" / "blog-posts.js", build_post_entry(manifest))
    print(f"Prepared article: {target}")
    print(f"Preview: http://127.0.0.1:4173/blog/posts/{SLUG}.html?lang=ru")


if __name__ == "__main__":
    main()

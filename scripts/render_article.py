#!/usr/bin/env python3
"""Render a bilingual Lotargo blog article from Markdown sources.

The renderer consumes an expanded Article Bundle directory containing
`article.json` and Markdown sources. It writes the deterministic HTML artifact
declared by the manifest, usually `article.html`.
"""

from __future__ import annotations

import argparse
import copy
import html
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from string import Template
from typing import Any


class RenderError(RuntimeError):
    pass


DANGEROUS_TAGS = {
    "script", "iframe", "object", "embed", "form", "input", "button",
    "textarea", "select", "option", "style", "link", "meta", "base",
}
DANGEROUS_SCHEME_RE = re.compile(r"^\s*(?:javascript|vbscript|data\s*:\s*text/html)", re.I)
FRONTMATTER_RE = re.compile(r"\A---\s*\n.*?\n---\s*(?:\n|\Z)", re.S)
LEADING_H1_RE = re.compile(r"\A\s*#\s+[^\n]+(?:\n+|\Z)")
REMOTE_OR_ROOT_RE = re.compile(r"^(?:[a-z][a-z0-9+.-]*:|//|/|#)", re.I)


def fail(message: str) -> "NoReturn":
    raise RenderError(message)


def read_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"Cannot read {path}: {exc}")
    if not isinstance(value, dict):
        fail(f"{path} must contain a JSON object")
    return value


def safe_relative_path(value: Any, field: str) -> Path:
    if not isinstance(value, str) or not value:
        fail(f"{field} must be a non-empty relative path")
    path = Path(value)
    if path.is_absolute() or ".." in path.parts:
        fail(f"{field} must be a safe relative path: {value}")
    return path


def localized(value: Any, language: str, field: str) -> str:
    if not isinstance(value, dict):
        fail(f"post.{field} must be a language map")
    result = value.get(language) or value.get("en") or next(iter(value.values()), None)
    if not isinstance(result, str) or not result.strip():
        fail(f"post.{field} is missing text for {language}")
    return result.strip()


def strip_source_metadata(text: str) -> str:
    text = FRONTMATTER_RE.sub("", text, count=1)
    text = LEADING_H1_RE.sub("", text, count=1)
    return text.strip() + "\n"


def import_markdown_module():
    try:
        import markdown  # type: ignore
    except ImportError:
        fail(
            "Python-Markdown is required. Install publishing dependencies with "
            "`python -m pip install -r requirements-publishing.txt`."
        )
    return markdown


def tag_name(element: ET.Element) -> str:
    return element.tag.rsplit("}", 1)[-1].lower()


def validate_rendered_tree(root: ET.Element) -> None:
    for element in root.iter():
        tag = tag_name(element)
        if tag in DANGEROUS_TAGS:
            fail(f"Raw HTML tag <{tag}> is not allowed in generated articles")
        for name, value in element.attrib.items():
            lowered = name.lower()
            if lowered.startswith("on"):
                fail(f"Inline event attribute {name} is not allowed")
            if lowered in {"href", "src", "xlink:href"} and DANGEROUS_SCHEME_RE.match(value):
                fail(f"Unsafe URL scheme in {name}")


def article_asset_url(src: str, slug: str) -> str:
    value = src.strip()
    if REMOTE_OR_ROOT_RE.match(value) or value.startswith("../assets/"):
        return value
    if value.startswith("./"):
        value = value[2:]
    if value.startswith("assets/"):
        value = value[len("assets/"):]
        return f"../assets/{slug}/{value}"
    return value


def image_nodes(paragraph: ET.Element) -> list[ET.Element] | None:
    if tag_name(paragraph) != "p" or (paragraph.text or "").strip():
        return None
    children = list(paragraph)
    if not children:
        return None
    images: list[ET.Element] = []
    for child in children:
        if tag_name(child) != "img" or (child.tail or "").strip():
            return None
        images.append(child)
    return images


def prepare_image(image: ET.Element, slug: str, language: str) -> tuple[ET.Element, str]:
    result = copy.deepcopy(image)
    src = result.get("src", "").strip()
    if not src:
        fail("Markdown image is missing src")
    src = article_asset_url(src, slug)
    result.set("src", src)
    result.set("data-full-src", result.get("data-full-src", src))
    result.set("loading", result.get("loading", "lazy"))
    result.set("decoding", result.get("decoding", "async"))

    caption = (result.get("title") or result.get("alt") or "").strip()
    result.attrib.pop("title", None)
    if caption:
        result.set(f"data-caption-{language}", caption)
    return result, caption


def create_figure(
    image: ET.Element,
    caption: str,
    language: str,
    gallery_name: str,
    gallery_item: bool,
) -> ET.Element:
    figure = ET.Element("figure")
    figure.set("class", "post-gallery-item" if gallery_item else "post-figure post-figure--editorial")
    if not gallery_item:
        figure.set("data-gallery", gallery_name)
    figure.append(image)
    if caption:
        figcaption = ET.SubElement(figure, "figcaption")
        figcaption.set("data-lang-content", language)
        figcaption.text = caption
    return figure


def transform_images(root: ET.Element, slug: str, language: str) -> None:
    gallery_name = f"{slug}-{language}-images"
    children = list(root)
    output: list[ET.Element] = []
    index = 0

    while index < len(children):
        first_images = image_nodes(children[index])
        if first_images is None:
            output.append(children[index])
            index += 1
            continue

        block_images = list(first_images)
        index += 1
        while index < len(children):
            following = image_nodes(children[index])
            if following is None:
                break
            block_images.extend(following)
            index += 1

        prepared = [prepare_image(image, slug, language) for image in block_images]
        if len(prepared) == 1:
            image, caption = prepared[0]
            output.append(create_figure(image, caption, language, gallery_name, False))
            continue

        gallery = ET.Element("div")
        classes = ["post-gallery", "post-gallery--editorial"]
        if len(prepared) >= 3:
            classes.append("post-gallery--three")
        gallery.set("class", " ".join(classes))
        gallery.set("data-gallery", gallery_name)
        for image, caption in prepared:
            gallery.append(create_figure(image, caption, language, gallery_name, True))
        output.append(gallery)

    root[:] = output


def normalize_document(root: ET.Element, slug: str, language: str) -> None:
    validate_rendered_tree(root)

    for element in root.iter():
        tag = tag_name(element)
        if tag == "h1":
            element.tag = "h2"
        elif tag == "img":
            src = element.get("src")
            if src:
                element.set("src", article_asset_url(src, slug))

    for child in list(root):
        if tag_name(child) == "p" and " ".join(child.itertext()).strip():
            existing = child.get("class", "").strip()
            child.set("class", f"{existing} post-lead".strip())
            break

    transform_images(root, slug, language)


def render_markdown(text: str, slug: str, language: str) -> str:
    markdown = import_markdown_module()
    source = strip_source_metadata(text)
    fragment = markdown.markdown(
        source,
        extensions=["extra", "sane_lists", "toc"],
        output_format="xhtml",
    )
    try:
        root = ET.fromstring(f"<div>{fragment}</div>")
    except ET.ParseError as exc:
        fail(
            "Markdown produced HTML that cannot be normalized. Avoid raw HTML in source files: "
            f"{exc}"
        )

    normalize_document(root, slug, language)
    rendered = "\n".join(ET.tostring(child, encoding="unicode", method="html") for child in root)
    return "\n".join("        " + line if line else "" for line in rendered.splitlines())


def render_bundle(bundle_root: Path, template_path: Path | None = None) -> Path:
    bundle_root = bundle_root.resolve()
    manifest_path = bundle_root / "article.json"
    if not manifest_path.is_file():
        fail("Expanded bundle must contain article.json")
    manifest = read_json(manifest_path)

    slug = manifest.get("slug")
    if not isinstance(slug, str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
        fail("slug must use lowercase kebab-case")

    render_config = manifest.get("render", {})
    if render_config is None:
        render_config = {}
    if not isinstance(render_config, dict):
        fail("render must be an object")
    engine = render_config.get("engine", "markdown")
    if engine != "markdown":
        fail(f"Unsupported render engine: {engine}")
    template_name = render_config.get("template", "default")
    if template_name != "default":
        fail(f"Unsupported article template: {template_name}")

    sources = manifest.get("sources")
    if not isinstance(sources, dict):
        fail("sources must be a language map")
    for required_language in ("en", "ru"):
        if required_language not in sources:
            fail(f"Default bilingual template requires sources.{required_language}")

    bodies: dict[str, str] = {}
    for language in ("en", "ru"):
        source_rel = safe_relative_path(sources[language], f"sources.{language}")
        source_path = (bundle_root / source_rel).resolve()
        if bundle_root not in source_path.parents or not source_path.is_file():
            fail(f"Markdown source is missing for {language}: {source_rel}")
        bodies[language] = render_markdown(source_path.read_text(encoding="utf-8"), slug, language)

    post = manifest.get("post")
    if not isinstance(post, dict):
        fail("article.json must contain post metadata")

    if template_path is None:
        template_path = Path(__file__).resolve().parents[1] / "templates" / "article.html"
    if not template_path.is_file():
        fail(f"Article template does not exist: {template_path}")

    title_en = localized(post.get("title"), "en", "title")
    title_ru = localized(post.get("title"), "ru", "title")
    values = {
        "slug": html.escape(slug, quote=True),
        "date": html.escape(str(manifest.get("date", "")), quote=True),
        "title_en": html.escape(title_en, quote=True),
        "title_ru": html.escape(title_ru, quote=True),
        "description_en": html.escape(localized(post.get("description"), "en", "description"), quote=True),
        "type_en": html.escape(localized(post.get("type"), "en", "type"), quote=True),
        "type_ru": html.escape(localized(post.get("type"), "ru", "type"), quote=True),
        "body_en": bodies["en"],
        "body_ru": bodies["ru"],
    }

    template = Template(template_path.read_text(encoding="utf-8"))
    rendered = template.substitute(values).rstrip() + "\n"

    output_rel = safe_relative_path(manifest.get("html", "article.html"), "html")
    output_path = (bundle_root / output_rel).resolve()
    if bundle_root not in output_path.parents:
        fail("Rendered HTML path escapes bundle root")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(rendered, encoding="utf-8")
    return output_path


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("bundle_dir", type=Path, help="Expanded Article Bundle directory")
    parser.add_argument("--template", type=Path, default=None)
    return parser


def main() -> int:
    args = build_parser().parse_args()
    try:
        output = render_bundle(args.bundle_dir, args.template)
        print(f"Rendered article: {output}")
        return 0
    except RenderError as exc:
        print(f"render-article: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())

# Article Bundle Standard

This document defines the portable publication unit used by `lotargo.github.io`.

The standard now supports a complete Markdown-first flow:

```text
article.json + bilingual Markdown + assets
                    ↓
          deterministic HTML renderer
                    ↓
          bundle validation and import
                    ↓
             static GitHub Pages files
```

The public repository never serves Base64 wrappers or transport archives. After import it contains normal HTML, Markdown, AVIF/WebP/PNG/SVG, audio, video, and JSON files.

## Supported Transport Formats

An Article Bundle may be delivered as:

```text
expanded directory
bundle.zip
bundle.tar.gz
bundle.tgz
bundle.b64
```

`bundle.b64` contains a Base64-encoded ZIP or TAR.GZ archive. Base64 remains supported for tools that can transmit only text. ZIP or TAR.GZ is preferred when direct binary upload is available.

## Canonical Markdown-First Layout

```text
my-article/
├── article.json
├── content/
│   ├── en.md
│   └── ru.md
└── assets/
    ├── cover.avif
    ├── gallery-01.avif
    └── diagram.svg
```

`article.html` is generated before validation, packing, or installation. A generated bundle may therefore contain it, but authors do not need to create it manually.

Legacy bundles may still provide a hand-authored `article.html` and omit the `render` field.

## `article.json`

```json
{
  "format_version": 1,
  "slug": "my-article",
  "date": "2026-07-15",
  "html": "article.html",
  "render": {
    "engine": "markdown",
    "template": "default"
  },
  "sources": {
    "en": "content/en.md",
    "ru": "content/ru.md"
  },
  "assets": "assets",
  "post": {
    "notificationId": "2026-07-15-my-article",
    "type": {
      "en": "Development",
      "ru": "Разработка"
    },
    "title": {
      "en": "Full Article Title",
      "ru": "Полный заголовок статьи"
    },
    "shortTitle": {
      "en": "Short title",
      "ru": "Короткий заголовок"
    },
    "description": {
      "en": "Description for the blog index.",
      "ru": "Описание для индекса блога."
    },
    "notificationTitle": {
      "en": "New article",
      "ru": "Новая статья"
    },
    "notificationText": {
      "en": "Short notification text.",
      "ru": "Короткий текст уведомления."
    },
    "notify": true
  }
}
```

Machine-readable validation is defined in:

```text
schemas/article-bundle.schema.json
```

## Canonical Metadata

`article.json` is the source of truth for:

- slug;
- publication date;
- article category;
- English and Russian titles;
- index descriptions;
- notification data;
- rendering mode;
- source and asset paths.

Markdown frontmatter is tolerated and removed by the renderer, but it does not override `article.json`.

## Markdown Renderer

Install the publishing-only dependency:

```bash
python -m pip install -r requirements-publishing.txt
```

Render an expanded bundle:

```bash
python scripts/publish_article.py render ./my-article
```

The default renderer uses:

```text
scripts/render_article.py
templates/article.html
```

It generates:

- the complete article shell;
- metadata toolbar;
- canonical English and Russian H1 headings;
- bilingual `data-lang-content` blocks;
- site header and footer;
- fallback Previous/Next navigation;
- shared site scripts;
- editorial image figures and galleries.

The first Markdown H1 is removed because `post.title` supplies the canonical page title. The first normal paragraph becomes `.post-lead`.

Supported Markdown features include:

- headings;
- paragraphs;
- emphasis and links;
- ordered and unordered lists;
- blockquotes;
- tables;
- fenced code blocks;
- footnotes;
- standalone images.

Raw HTML should not be used for layout. Dangerous tags, event attributes, and unsafe URL schemes are rejected.

## Image Rendering

Use bundle-relative paths:

```md
![Main screen](assets/main-screen.avif "Main screen concept")
```

The installed HTML receives:

```text
../assets/<slug>/main-screen.avif
```

Rules:

- optional image title becomes the caption;
- alt text becomes the caption when no title is supplied;
- one standalone image becomes an editorial figure;
- consecutive standalone images become a responsive gallery;
- generated figures join the fullscreen lightbox;
- image placement follows the Markdown narrative order.

Example gallery:

```md
![Apartment](assets/apartment.avif "Evening apartment")

![Classroom](assets/classroom.avif "Daytime classroom")

![Park](assets/park.avif "Park at sunset")
```

Do not embed large raster images as Base64 in Markdown, HTML, or SVG.

## High-Level CLI

Use `scripts/publish_article.py` for new Markdown-first work.

Validate a directory or archive:

```bash
python scripts/publish_article.py validate ./my-article
python scripts/publish_article.py validate ./bundle.zip
python scripts/publish_article.py validate ./bundle.b64
```

Pack ZIP:

```bash
python scripts/publish_article.py pack ./my-article \
  --archive-format zip \
  --transport binary \
  --output ./bundle.zip
```

Pack TAR.GZ:

```bash
python scripts/publish_article.py pack ./my-article \
  --archive-format tar.gz \
  --transport binary \
  --output ./bundle.tar.gz
```

Pack Base64:

```bash
python scripts/publish_article.py pack ./my-article \
  --archive-format zip \
  --transport b64 \
  --output ./bundle.b64
```

Install into a local checkout:

```bash
python scripts/publish_article.py install ./bundle.zip --root .
```

The lower-level `scripts/article_bundle.py` remains available for legacy bundles that already contain final HTML.

## Automatic Rendering Rules

The high-level CLI regenerates HTML when:

- `article.json` contains a `render` object; or
- the declared HTML file is missing.

Use `--render` to force regeneration for a bundle without explicit render configuration:

```bash
python scripts/publish_article.py validate ./legacy-bundle --render
```

Generated HTML should not be treated as the primary editable source. Change Markdown or the shared template and render again.

## Installation Mapping

During installation:

```text
article.html
  -> blog/posts/<slug>.html

content/en.md
  -> blog/content/<slug>.en.md

content/ru.md
  -> blog/content/<slug>.ru.md

article.json
  -> blog/content/<slug>.article.json

assets/*
  -> blog/assets/<slug>/*
```

The importer inserts or updates the matching entry in:

```text
assets/js/blog-posts.js
```

This synchronizes the blog index, Previous/Next navigation, and landing-page notifications.

## CI Staging

Upload exactly one transport into:

```text
.article-import/<slug>/
```

Accepted names:

```text
bundle.zip
bundle.tar.gz
bundle.tgz
bundle.b64
```

An expanded bundle is accepted when it contains both:

```text
article.json
READY
```

The staging directory name must match the manifest slug.

The CI workflow installs dependencies, renders Markdown, validates the result, installs files, removes staging content, and commits the generated publication.

## Validation Rules

A bundle is rejected when:

- `article.json` is missing or invalid;
- slug is not lowercase kebab-case;
- date is not `YYYY-MM-DD`;
- English or Russian Markdown is missing;
- paths escape the bundle directory;
- archives contain links or device files;
- an individual file exceeds 95 MB;
- the expanded bundle exceeds 500 MB;
- assets use unsupported extensions;
- rendered HTML omits required site structure or scripts;
- Markdown produces unsafe or structurally invalid HTML.

## Supported Asset Types

```text
.avif .webp .png .jpg .jpeg .gif .svg
.mp4 .webm
.mp3 .ogg .wav
.json .txt
```

For significantly larger media, use external object storage and keep only posters or previews in the repository.

## Update Semantics

Publishing an existing slug updates the same article:

- HTML is regenerated or replaced;
- Markdown sources are replaced;
- article assets are replaced;
- installed manifest is replaced;
- matching `BLOG_POSTS` entry is replaced without duplication.

Use a new slug only for a separate publication.

## AI Contract

An AI assistant should normally produce only:

```text
article.json
content/en.md
content/ru.md
assets/*
```

It should then run the renderer and validator rather than assembling the article shell manually.

Before packaging, verify:

- metadata and slug;
- both translations;
- heading structure;
- image filenames and references;
- alt text and captions;
- no private repository links;
- no detached images before the title;
- desktop, mobile, theme, language, and lightbox behavior.

Operational instructions live in:

```text
instructions/skills/
```

No `AGENTS.md` file is required or expected.

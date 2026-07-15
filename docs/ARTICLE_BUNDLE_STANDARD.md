# Article Bundle Standard

This document defines the portable publication unit used by `lotargo.github.io`.

The goal is simple: an article prepared by a person, an AI assistant, a local script, or another editor should arrive as one predictable package. CI validates the package, installs ordinary static files, updates the blog manifest, and removes the temporary transport bundle.

The published repository does not serve Base64 blobs or archives. After import it contains normal HTML, Markdown, AVIF/WebP/PNG/SVG, audio, video, and JSON files.

## Supported Transport Formats

An article bundle may be delivered as:

```text
expanded directory
bundle.zip
bundle.tar.gz
bundle.tgz
bundle.b64
```

`bundle.b64` must contain a Base64-encoded ZIP or TAR.GZ archive. Base64 remains supported for tools that can only transmit text, but binary ZIP or TAR.GZ is preferred when direct binary upload is available.

## Canonical Bundle Layout

```text
my-article/
├── article.json
├── article.html
├── content/
│   ├── ru.md
│   └── en.md
└── assets/
    ├── cover.avif
    ├── gallery-01.avif
    └── diagram.svg
```

Only `article.json` must have a fixed name. Other paths are declared inside the manifest.

## `article.json`

```json
{
  "format_version": 1,
  "slug": "my-article",
  "date": "2026-07-15",
  "html": "article.html",
  "sources": {
    "ru": "content/ru.md",
    "en": "content/en.md"
  },
  "assets": "assets",
  "post": {
    "notificationId": "2026-07-15-my-article",
    "type": {
      "ru": "Разработка",
      "en": "Development"
    },
    "title": {
      "ru": "Полный заголовок статьи",
      "en": "Full article title"
    },
    "shortTitle": {
      "ru": "Короткий заголовок",
      "en": "Short title"
    },
    "description": {
      "ru": "Описание для индекса блога.",
      "en": "Description for the blog index."
    },
    "notificationTitle": {
      "ru": "Новая статья",
      "en": "New article"
    },
    "notificationText": {
      "ru": "Короткий текст уведомления.",
      "en": "Short notification text."
    },
    "notify": true
  }
}
```

The machine-readable schema is stored at:

```text
schemas/article-bundle.schema.json
```

## Installation Mapping

During installation the bundle is mapped to the repository:

```text
article.html
  -> blog/posts/<slug>.html

content/ru.md
  -> blog/content/<slug>.ru.md

content/en.md
  -> blog/content/<slug>.en.md

article.json
  -> blog/content/<slug>.article.json

assets/*
  -> blog/assets/<slug>/*
```

The importer also inserts or updates the matching entry in:

```text
assets/js/blog-posts.js
```

This keeps the blog index, Previous/Next navigation, and landing-page notifications synchronized.

## Staging Directory

For CI import, upload one transport file into:

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

An already-expanded bundle is also supported when its directory contains:

```text
article.json
READY
```

The staging directory name must exactly match the manifest `slug`.

## Validation Rules

The importer rejects a bundle when:

- `article.json` is missing or invalid;
- the slug is not lowercase kebab-case;
- the date is not `YYYY-MM-DD`;
- rendered HTML or declared Markdown sources are missing;
- paths escape the bundle directory;
- archives contain symlinks, hard links, or device files;
- an individual file exceeds 95 MB;
- the complete expanded bundle exceeds 500 MB;
- assets use an unsupported extension;
- the rendered article omits required site scripts and article structure.

## Supported Asset Types

```text
.avif .webp .png .jpg .jpeg .gif .svg
.mp4 .webm
.mp3 .ogg .wav
.json .txt
```

Large binary media should remain below GitHub's practical file limit. For significantly larger media, use external object storage and store only a poster or preview in the repository.

## CLI

Validate an expanded directory or transport archive:

```bash
python scripts/article_bundle.py validate ./my-article
python scripts/article_bundle.py validate ./bundle.zip
python scripts/article_bundle.py validate ./bundle.b64
```

Create a ZIP:

```bash
python scripts/article_bundle.py pack ./my-article \
  --archive-format zip \
  --transport binary \
  --output ./bundle.zip
```

Create TAR.GZ:

```bash
python scripts/article_bundle.py pack ./my-article \
  --archive-format tar.gz \
  --transport binary \
  --output ./bundle.tar.gz
```

Create a Base64 transport package:

```bash
python scripts/article_bundle.py pack ./my-article \
  --archive-format zip \
  --transport b64 \
  --output ./bundle.b64
```

Install directly into a local repository checkout:

```bash
python scripts/article_bundle.py install ./bundle.zip --root .
```

Import every ready package in the staging directory:

```bash
python scripts/article_bundle.py import-staged .article-import --root .
```

## Update Semantics

Publishing a bundle with an existing slug updates that article:

- rendered HTML is replaced;
- localized Markdown source files are replaced;
- the article asset directory is replaced;
- the installed article manifest is replaced;
- the matching `BLOG_POSTS` entry is replaced.

Use a new slug only when the publication should become a separate article.

## Source and Rendered Output

Markdown is the semantic source. HTML is the rendered publication artifact.

The Markdown may stay compact and readable, while the rendered page uses the shared design system, galleries, lightbox, responsive layout, localization, navigation, and article-specific components. Both are kept because they serve different purposes:

- Markdown is easy to write, review, translate, and regenerate;
- HTML is deterministic and immediately publishable by GitHub Pages.

## AI Usage

AI assistants should treat this standard as a strict output contract. They may draft and revise content freely, but before packaging they must validate filenames, paths, translations, alt text, captions, manifest metadata, article scripts, and asset references.

Operational instructions live in:

```text
instructions/skills/
```

No `AGENTS.md` file is required or expected for this repository.

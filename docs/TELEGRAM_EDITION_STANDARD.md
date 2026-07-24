# Telegram Article Edition Standard

This document defines the compact editorial version of a blog article prepared for Telegram.

The website remains the canonical full publication. Telegram receives a self-contained edition with simpler formatting and a link to the complete article, galleries, tables, code blocks, and other rich website content.

## Article Bundle layout

```text
article-bundle/
├── article.json
├── distribution.json
├── content/
│   ├── en.md
│   ├── ru.md
│   └── telegram/
│       ├── en.md
│       └── ru.md
└── assets/
```

Legacy Article Bundles without `distribution.json` and without `content/telegram/*.md` remain valid.

## `distribution.json`

```json
{
  "format_version": 1,
  "telegram": {
    "ru": {
      "enabled": true,
      "source": "content/telegram/ru.md",
      "presentation": "link-preview"
    },
    "en": {
      "enabled": false,
      "source": "content/telegram/en.md",
      "presentation": "link-preview"
    }
  }
}
```

Supported presentation modes:

- `link-preview`: a normal Telegram text post with a website link and preview;
- `photo-caption`: a short caption attached to an uploaded image.

When `distribution.json` is absent, existing files at `content/telegram/ru.md` and `content/telegram/en.md` are validated as `link-preview` editions.

## Length limits

The project intentionally rejects content before Telegram's hard API boundary.

| Mode | Project limit | Telegram hard limit |
|---|---:|---:|
| `link-preview` | 3600 characters | 4096 characters |
| `photo-caption` | 900 characters | 1024 characters |

The safety margin leaves room for generated footer text, links, and later formatting changes.

The validator counts visible text after removing Markdown formatting markers. Image references do not count as message text. Link labels, list text, quote text, and code contents do count.

## CI rejection behaviour

Validation runs inside the high-level `publish_article.py` flow. It therefore applies to:

```text
render
validate
pack
install
import-staged
```

An oversized Telegram edition is rejected before the Article Bundle is installed, committed, deployed, or sent to Telegram.

GitHub Actions receives a file annotation and an actionable message similar to:

```text
Telegram edition 'ru' renders to 3827 characters,
but the project limit for 'link-preview' is 3600
(Telegram hard limit: 4096).
Shorten it by at least 227 characters.
The Article Bundle was rejected before deployment and nothing was published.
```

The annotation points to the exact Markdown source, for example:

```text
content/telegram/ru.md
```

This makes the failure understandable to a person or another AI reviewing CI logs.

## Current rollout

The length guard and file contract are active. The current Telegram publisher still falls back to the article title and description until rendering and installation of the dedicated Telegram editions are connected in the next pipeline revision.

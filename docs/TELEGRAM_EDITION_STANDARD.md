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

## Mandatory image rule

Every new enabled Telegram article publication must attach at least one image.

- `presentation` must be `photo-caption`;
- `cover` must resolve to a local PNG, JPEG, or WebP file;
- `cover: "auto"` may reuse the first supported local image referenced by the article or Telegram Markdown;
- `cover: null` and `cover: false` are rejected;
- a missing or unsupported cover rejects the bundle before deployment or Telegram publication.

This is a hard validation rule, not an editorial recommendation. `link-preview` remains recognized only for legacy compatibility and must not be used for a new enabled edition declared through `distribution.json`.

## `distribution.json`

```json
{
  "format_version": 1,
  "telegram": {
    "ru": {
      "enabled": true,
      "source": "content/telegram/ru.md",
      "presentation": "photo-caption",
      "cover": "auto"
    },
    "en": {
      "enabled": false,
      "source": "content/telegram/en.md",
      "presentation": "photo-caption",
      "cover": "auto"
    }
  }
}
```

Supported presentation modes:

- `photo-caption`: the required mode for new enabled Telegram editions; a short caption attached to an uploaded image;
- `link-preview`: legacy compatibility only.

When `distribution.json` is absent, existing legacy files at `content/telegram/ru.md` and `content/telegram/en.md` remain valid for compatibility. New publications must declare `distribution.json` and satisfy the mandatory image rule.

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

An oversized Telegram edition or an enabled edition without a valid attached image is rejected before the Article Bundle is installed, committed, deployed, or sent to Telegram.

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

## Enforcement

The image requirement is enforced twice: during Article Bundle validation and again by the Telegram publisher. Calling the publisher directly therefore cannot bypass the rule.

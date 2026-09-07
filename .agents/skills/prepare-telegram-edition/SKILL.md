---
name: prepare-telegram-edition
description: Write and validate the compact Russian Telegram edition of a Lotargo blog article with a mandatory attached image.
---

# Prepare A Telegram Edition

The website is the canonical full publication. Telegram gets a self-contained compact edition with a link or button to the complete article.

## Mandatory image contract

Every Telegram article publication must attach at least one image.

For new editions:

- use `presentation: "photo-caption"`;
- provide `cover: "auto"` or an explicit local cover path;
- the cover must resolve to PNG, JPEG, or WebP;
- do not use `cover: null`, `cover: false`, or text-only publication;
- do not use `link-preview` for a new enabled edition.

If `cover: "auto"` is used, ensure the article or Telegram Markdown references at least one supported local image.

This rule is enforced by validation and again by the Telegram publisher.

## Editorial rules

The Telegram post must make sense even if the reader never opens the website. Compress the idea rather than copying the opening paragraphs of the article.

Prefer a strong opening, the central problem or result, one or two concrete details, and a natural reason to open the full article.

The project limit for `photo-caption` is 900 visible characters, below Telegram's 1024-character hard caption limit.

## Workflow

1. Create or update `content/telegram/ru.md`.
2. Set the Russian Telegram distribution to `photo-caption` and configure a cover.
3. Call `article_validate`.
4. Fix any image, length, or source errors.
5. After local installation, call `telegram_preview(<slug>)`.
6. Call `telegram_publish(confirm=true)` only after explicit user approval to publish externally.

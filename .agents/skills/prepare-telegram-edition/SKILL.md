---
name: prepare-telegram-edition
description: Write and validate the short Russian Telegram edition of a Lotargo blog article. Use when adapting a full article into a compact self-contained Telegram post with mandatory image attachment and verified source links.
---

# Prepare A Telegram Edition

Apply `editorial-style` and `source-grounding` while writing.

The website is the canonical full publication. Telegram gets a short self-contained article that is comfortable to read inside the app.

## Short-article contract

Do not copy the blog lead and do not reduce the publication to a one-line announcement.

Write a compact article with:

- a strong opening that gives the central point immediately;
- typically 3 to 6 short paragraphs;
- one main idea per paragraph;
- one or two concrete details that make the post useful on its own;
- a natural transition to the full article when more depth is available there.

Recommended target: about 500 to 800 visible characters.

Hard project limit for `photo-caption`: 900 visible characters.

Cut:

- long architecture walkthroughs;
- exhaustive feature lists;
- tables;
- long code blocks;
- repeated conclusions;
- context that is only useful after opening the full article.

## Mandatory image contract

Every new Telegram article publication must attach at least one image.

For new editions:

- use `presentation: "photo-caption"`;
- provide `cover: "auto"` or an explicit local cover path;
- the cover must resolve to PNG, JPEG, or WebP;
- do not use `cover: null`, `cover: false`, or text-only publication;
- do not use `link-preview` for a new enabled edition.

If `cover: "auto"` is used, ensure the article or Telegram Markdown references at least one supported local image.

## Sources and links

Every externally derived or reasonably disputable factual claim in the Telegram text must have a real source link.

Keep only sources needed by the short Telegram edition. Do not overload the caption with a bibliography.

Never invent a citation or URL. If a source cannot be verified, remove or qualify the claim.

Use descriptive Markdown link text rather than bare URLs where possible.

## Workflow

1. Create or update `content/telegram/ru.md`.
2. Set the Russian Telegram distribution to `photo-caption` and configure a cover.
3. Apply `editorial-style`.
4. Apply `source-grounding`.
5. Call `article_validate`.
6. Fix any image, length, punctuation, source, or link problems.
7. After local installation, call `telegram_preview(<slug>)`.
8. Call `telegram_publish(confirm=true)` only after explicit user approval to publish externally.

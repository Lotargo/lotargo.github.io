---
name: review-publication
description: Perform final editorial, source, visual, accessibility, and technical checks before a Lotargo blog or Telegram publication is considered complete.
---

# Review A Publication

Apply this after article installation and before declaring publication complete.

## Editorial audit

Apply `editorial-style` and confirm:

- no public-facing text contains the Unicode em dash `—`;
- the opening gives the important point early;
- paragraphs are compact and centered on one idea;
- headings form a coherent sequence;
- implemented features, experiments, and plans are clearly distinguished;
- there are no repeated conclusions, filler, or defensive disclaimers;
- Russian and English versions make the same substantive claims.

For Telegram, confirm the edition is a short self-contained article, not a copied lead or one-line announcement.

## Source audit

Apply `source-grounding` and confirm:

- externally derived or reasonably disputable factual claims have real source links;
- links point to pages that actually support the claims;
- primary or official sources are preferred when available;
- no source, URL, quotation, statistic, release, or benchmark was invented;
- quotes and numbers were checked against the source;
- dead, placeholder, generic, or irrelevant links are removed;
- verification is not claimed when it was not actually performed.

## Image audit

Confirm images appear near the text they support and do not expose private data.

For every new Telegram article publication, confirm at least one PNG, JPEG, or WebP image is attached through the `photo-caption` path.

## Technical audit

Run the publication validator and reject the bundle on any error.

Check:

- all expected assets exist;
- generated HTML contains required site scripts;
- no Base64 raster payload is embedded in published HTML or SVG;
- the article appears in the blog manifest;
- no staging or temporary files are unintentionally committed.

## Browser review

Review desktop and mobile layout when browser access is available.

Check:

- readable line length;
- no horizontal overflow;
- image and gallery behavior;
- captions and alt text;
- language switching;
- dark and light themes;
- Previous/Next navigation;
- fullscreen image behavior.

Do not claim visual verification if it was not actually performed.

## Completion report

State what was validated, what was visually checked, which publication method was used, and any limitation that remains.

---
name: review-publication
description: Perform final editorial, visual, accessibility, and technical checks for a blog publication.
---

# Review A Publication

Use this skill after article installation and before considering publication complete.

## Local Preview

Run from the repository root:

```bash
python -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/blog/
http://127.0.0.1:4173/blog/posts/<slug>.html
```

Use a cache-disabled server or hard refresh after changing JavaScript, CSS, or assets.

## Editorial Review

Confirm that:

- the title and lead appear before major illustrations;
- the opening explains why the article matters;
- headings form a coherent sequence;
- images appear near the paragraphs they support;
- implemented features and plans are clearly distinguished;
- there are no repeated conclusions or defensive disclaimers;
- private repository links and internal data are absent;
- Russian and English versions make the same substantive claims.

## Desktop Review

Check at approximately:

```text
1440 × 900
1920 × 1080
```

Verify:

- readable line length;
- balanced whitespace;
- gallery columns and captions;
- no stretched images;
- no horizontal overflow;
- Previous/Next navigation;
- header and footer alignment;
- dark and light themes.

## Mobile Review

Check at approximately:

```text
390 × 844
430 × 932
```

Verify:

- one-column galleries;
- readable headings and captions;
- touch targets are usable;
- no clipped code or media;
- language and theme buttons remain accessible;
- fullscreen images fit the viewport.

## Image Viewer Review

For every gallery:

1. open the first image by mouse or touch;
2. confirm the fullscreen source is sharp;
3. use Previous/Next buttons;
4. use `ArrowLeft` and `ArrowRight`;
5. close with `Escape`;
6. confirm focus returns to the original image;
7. switch language and confirm captions update;
8. verify the counter matches the gallery size.

## Technical Review

Check the browser console for errors and confirm:

- all assets return HTTP 200;
- no Base64 raster payload is embedded in published HTML/SVG;
- no missing CSS or JavaScript;
- `blog-post.js` loads once;
- the article appears in the blog index;
- Previous/Next links match chronological order;
- notifications appear only when `notify: true`;
- no staging bundle remains after CI import.

## Repository Review

Run:

```bash
git status --short
git diff --check
```

Inspect the changed-file list. Reject unrelated changes, temporary files, test binaries, generated cache files, and accidental private data.

## Public Deployment Review

After GitHub Pages updates, test the public article URL with a hard refresh. Do not rely only on a local copy because path case, caching, and deployment timing may differ.

## Completion Report

A useful completion report should state:

- article URL;
- transport or publication method used;
- number and format of assets;
- desktop/mobile checks performed;
- gallery/lightbox result;
- any limitation that remains.

Do not claim successful visual verification when it was not actually performed.

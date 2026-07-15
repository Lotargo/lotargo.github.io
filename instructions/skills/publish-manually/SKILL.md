---
name: publish-manually
description: Add or update a blog article directly in the repository without using the bundle importer.
---

# Publish An Article Manually

Use this skill when working through the GitHub web editor, a basic text editor, or another environment where the bundle CLI is unnecessary.

## Files To Create Or Update

For slug `my-article`:

```text
blog/posts/my-article.html
blog/content/my-article.ru.md
blog/content/my-article.en.md
blog/content/my-article.article.json
blog/assets/my-article/
assets/js/blog-posts.js
```

Only create languages that the article actually supports, but keep Russian and English together for normal portfolio publications.

## Procedure

1. Choose a stable lowercase kebab-case slug.
2. Write the Markdown source first.
3. Render or author the static HTML using the existing article structure and shared classes.
4. Store ordinary images in `blog/assets/<slug>/`.
5. Add one matching object to `window.BLOG_POSTS` in chronological order.
6. Include the standard scripts at the end of the page:

```html
<script src="../../assets/js/main.js"></script>
<script src="../../assets/js/blog-post.js"></script>
```

7. Keep a `.post-pagination` element; `blog-post.js` will normalize its links.
8. Preview the article locally.
9. Test both languages, mobile layout, image viewer, Previous/Next navigation, and the blog index.

## Article Manifest

Even in manual mode, keep `blog/content/<slug>.article.json`. It documents the article as a future-compatible bundle and makes later automated updates straightforward.

Follow:

```text
docs/ARTICLE_BUNDLE_STANDARD.md
schemas/article-bundle.schema.json
```

## Manual Manifest Update Rules

The article entry in `assets/js/blog-posts.js` must include:

```js
slug
date
href
url
type
title
shortTitle
description
notify
```

Optional notification fields:

```js
notificationId
notificationTitle
notificationText
```

Do not manually add cards to `blog/index.html`. Do not duplicate notifications in `assets/js/notifications.js`.

## Asset Rules

- use real `.avif`, `.webp`, `.png`, `.jpg`, or `.svg` files;
- do not hide raster images inside SVG or Base64 strings;
- use meaningful filenames;
- include useful alt text and concise captions;
- keep full-resolution files suitable for lightbox viewing;
- avoid scaling a small image beyond its native resolution.

## Updating Existing Content

When replacing an article asset set, remove stale files from `blog/assets/<slug>/`. Broken old references are worse than a slightly larger commit.

## Do Not

- do not edit unrelated posts;
- do not expose private repositories or secrets;
- do not add a defensive AI-generation disclaimer unless context truly requires it;
- do not add `AGENTS.md`.

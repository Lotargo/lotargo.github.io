# Lotargo GitHub Profile Landing

This repository contains the static GitHub Pages portfolio and publishing system for Lotargo.

Published site:

```text
https://lotargo.github.io
```

The public runtime remains static-first: plain HTML, CSS, JavaScript, Markdown source copies, and ordinary binary assets served by GitHub Pages. No backend or client-side framework is required.

For publishing, the repository now also includes an optional Article Bundle pipeline. A person or AI assistant can prepare one portable package, upload it to a staging directory, and let GitHub Actions validate and install the article as normal static files.

## Repository Structure

```text
index.html                         Main portfolio landing page
blog/index.html                    Blog index page
blog/posts/                        Rendered static HTML articles
blog/content/                      Markdown sources and installed article manifests
blog/assets/                       Per-article images, diagrams, audio, and video
assets/css/styles.css              Main visual system
assets/css/render-fixes.css        Rendering compatibility fixes
assets/css/image-viewer.css        Galleries and fullscreen image viewer
assets/js/main.js                  Theme, language, notifications, project cards
assets/js/projects.js              Project card manifest
assets/js/blog-posts.js            Shared blog metadata manifest
assets/js/blog-index.js            Blog index renderer
assets/js/blog-post.js             Article helpers and Previous/Next navigation
assets/js/image-viewer.js          Reusable lightbox and gallery navigation
assets/js/notifications.js         Notification builder from the blog manifest
scripts/article_bundle.py          Standard bundle validator, packer, and installer
scripts/import_asset_bundle.py     Legacy Base64 asset importer
schemas/article-bundle.schema.json Machine-readable bundle manifest schema
instructions/                      Task-specific human and AI publishing skills
docs/                              Publishing standards and project documentation
.article-import/                   Temporary CI staging directory, created when needed
PROFILE_README_SNIPPET.md          Snippet for the GitHub profile README
v0_PROMPT.md                       Historical reference prompt
```

## The Blog As A Publishing Engine

Markdown is treated as the semantic source of an article. Rendered HTML is the deterministic publication artifact.

A compact source document can become a full editorial page with:

- shared typography and spacing;
- dark and light themes;
- Russian and English content;
- responsive layouts;
- image galleries and fullscreen lightbox;
- Previous/Next navigation;
- blog index cards;
- landing-page notifications.

The design system stays in the site. The article source focuses on ideas, structure, images, captions, code, and evidence.

## Article Bundle Standard

A complete article can be transported as:

```text
expanded directory
bundle.zip
bundle.tar.gz
bundle.tgz
bundle.b64
```

Base64 remains supported for text-only tools. When normal binary upload is possible, ZIP or TAR.GZ is preferred.

Canonical expanded layout:

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

Full standard:

```text
docs/ARTICLE_BUNDLE_STANDARD.md
schemas/article-bundle.schema.json
```

## Automated Bundle Publishing

Upload one package to:

```text
.article-import/<slug>/bundle.zip
.article-import/<slug>/bundle.tar.gz
.article-import/<slug>/bundle.tgz
.article-import/<slug>/bundle.b64
```

The `Import article bundles` GitHub Actions workflow:

1. validates the transport and archive paths;
2. reads `article.json`;
3. installs rendered HTML into `blog/posts/`;
4. installs Markdown and the manifest into `blog/content/`;
5. installs normal binary assets into `blog/assets/<slug>/`;
6. inserts or updates the post in `assets/js/blog-posts.js`;
7. removes the temporary staging package;
8. commits the resulting static files.

The published site never serves the transport archive or Base64 wrapper.

## Article Bundle CLI

Validate:

```bash
python scripts/article_bundle.py validate ./my-article
python scripts/article_bundle.py validate ./bundle.zip
python scripts/article_bundle.py validate ./bundle.b64
```

Pack ZIP:

```bash
python scripts/article_bundle.py pack ./my-article \
  --archive-format zip \
  --transport binary \
  --output ./bundle.zip
```

Pack TAR.GZ:

```bash
python scripts/article_bundle.py pack ./my-article \
  --archive-format tar.gz \
  --transport binary \
  --output ./bundle.tar.gz
```

Pack Base64 for a text-only transport:

```bash
python scripts/article_bundle.py pack ./my-article \
  --archive-format zip \
  --transport b64 \
  --output ./bundle.b64
```

Install directly into a local checkout:

```bash
python scripts/article_bundle.py install ./bundle.zip --root .
```

## Publishing Skills

Human- and AI-readable task instructions live in:

```text
instructions/skills/
```

Available skills:

```text
publish-binary-bundle  Package and upload ZIP/TAR.GZ/TGZ/Base64
publish-with-cli       Work from a terminal or coding-agent checkout
publish-manually       Edit repository files without the importer
write-blog-article     Draft and structure the actual article
prepare-article-images Generate, export, name, and integrate visual assets
review-publication     Perform editorial, desktop, mobile, and lightbox QA
```

Start with:

```text
instructions/README.md
```

The repository intentionally does not use `AGENTS.md`. Task-specific skills provide narrower and more useful operational context.

## Blog Metadata Automation

`assets/js/blog-posts.js` is the runtime source of truth for static article metadata.

It drives:

- blog index cards;
- Previous/Next article navigation;
- landing-page notifications for posts with `notify: true`.

When using an Article Bundle, the importer updates this file automatically.

When publishing manually, add one entry to `window.BLOG_POSTS`. Do not manually duplicate cards in `blog/index.html` or notifications in `assets/js/notifications.js`.

Manual checklist:

```text
docs/ADDING_BLOG_ARTICLES.md
```

## Image Galleries

Blog images can open in a reusable fullscreen viewer with keyboard, touch, captions, counters, and gallery navigation.

Documentation:

```text
docs/IMAGE_GALLERIES.md
instructions/skills/prepare-article-images/SKILL.md
```

Store real binary images in the repository. Do not embed low-resolution raster images inside SVG or Base64 payloads in published HTML.

## Editing Project Cards

Project card data lives in:

```text
assets/js/projects.js
```

Each project entry can define:

```js
title
category
status
description
proof
stack
image
landingUrl
repoUrl
demoUrl
docsUrl
```

Project images are normally stored in:

```text
assets/img/
```

Use relative paths from the site root:

```js
image: "./assets/img/project-name.png"
```

## Local Preview And Testing

A local static server is better than opening HTML directly because it catches path, asset, caching, and browser-loading problems.

### Python

```powershell
python -m http.server 4173
```

Windows launcher:

```powershell
py -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/
http://127.0.0.1:4173/blog/
http://127.0.0.1:4173/blog/posts/<slug>.html
```

### Node.js

```powershell
npx --yes http-server . -p 4173 -c-1
```

The `-c-1` flag disables caching, which is useful when checking CSS, JavaScript, and image updates.

Use the full review procedure:

```text
instructions/skills/review-publication/SKILL.md
```

## Deployment Through GitHub Pages

1. Open repository Settings -> Pages.
2. Select `Deploy from a branch`.
3. Select `main` and `/ root`.
4. Save.
5. Open `https://lotargo.github.io` after the build finishes.

## Profile README Button

`PROFILE_README_SNIPPET.md` contains the badge/snippet intended for the `Lotargo/Lotargo` profile README. It points profile visitors to this landing page.

## Future Migration Note

`v0_PROMPT.md` is kept only as a reference in case this static page is ever rebuilt as a Next.js/Vercel project. The current site does not depend on it.

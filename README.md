# Lotargo GitHub Profile Landing

This repository contains the static GitHub Pages portfolio and publishing system for Lotargo.

Published site:

```text
https://lotargo.github.io
```

The public runtime remains static-first: plain HTML, CSS, JavaScript, Markdown source copies, and ordinary binary assets served by GitHub Pages. No backend or client-side framework is required.

The publishing toolchain can now take bilingual Markdown, metadata, and assets, generate deterministic article HTML, package the result, and install it through GitHub Actions.

## Repository Structure

```text
index.html                         Main portfolio landing page
blog/index.html                    Blog index page
blog/posts/                        Generated or legacy static HTML articles
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
scripts/render_article.py          Markdown-to-HTML renderer
scripts/publish_article.py         High-level render/validate/pack/install CLI
scripts/article_bundle.py          Low-level bundle validator and installer
scripts/import_asset_bundle.py     Legacy Base64 asset importer
templates/article.html             Shared bilingual article template
requirements-publishing.txt        Pinned publishing-only dependency
schemas/article-bundle.schema.json Machine-readable bundle manifest schema
instructions/                      Task-specific human and AI publishing skills
docs/                              Publishing standards and project documentation
.article-import/                   Temporary CI staging directory, created when needed
PROFILE_README_SNIPPET.md          Snippet for the GitHub profile README
v0_PROMPT.md                       Historical reference prompt
```

## The Blog As A Publishing Engine

Markdown is the semantic source of an article. HTML is a generated publication artifact.

```text
article.json + ru.md + en.md + assets
                  ↓
        deterministic renderer
                  ↓
       styled bilingual article.html
                  ↓
      bundle validation and import
                  ↓
        plain GitHub Pages output
```

The renderer applies the existing site design and automatically creates:

- the article shell, toolbar, header, footer, and metadata;
- Russian and English content blocks;
- the canonical H1 from `article.json`;
- a lead paragraph from the first Markdown paragraph;
- headings, lists, blockquotes, tables, fenced code, links, and footnotes;
- editorial figures from standalone Markdown images;
- lightbox galleries from consecutive standalone images;
- article asset URLs from simple `assets/<file>` Markdown paths;
- fallback Previous/Next navigation later normalized by the shared manifest.

A source file may still contain frontmatter or its own H1. The renderer removes those duplicate presentation elements and uses `article.json` as the canonical metadata source.

Legacy hand-authored HTML remains supported. A bundle is rendered automatically when it contains a `render` object or when its declared HTML file is missing.

## Install Publishing Dependencies

The dependency is used only by the publishing tools, not by the public website:

```bash
python -m pip install -r requirements-publishing.txt
```

The renderer uses the pinned Python-Markdown package with its maintained extensions for tables, fenced code, footnotes, attribute lists, and related Markdown features.

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

Canonical Markdown-first layout:

```text
my-article/
├── article.json
├── content/
│   ├── ru.md
│   └── en.md
└── assets/
    ├── cover.avif
    ├── gallery-01.avif
    └── diagram.svg
```

`article.html` is generated before validation, packing, or installation.

Minimal render configuration:

```json
{
  "html": "article.html",
  "render": {
    "engine": "markdown",
    "template": "default"
  }
}
```

Full standard and example:

```text
docs/ARTICLE_BUNDLE_STANDARD.md
schemas/article-bundle.schema.json
examples/article-bundle/
```

## Publishing CLI

Render an expanded bundle:

```bash
python scripts/publish_article.py render ./my-article
```

Render when needed and validate:

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

Pack Base64 for a text-only transport:

```bash
python scripts/publish_article.py pack ./my-article \
  --archive-format zip \
  --transport b64 \
  --output ./bundle.b64
```

Install directly into a local checkout:

```bash
python scripts/publish_article.py install ./bundle.zip --root .
```

The lower-level `scripts/article_bundle.py` remains available for legacy bundles that already contain final HTML and do not need rendering.

## Automated Bundle Publishing

Upload one package to:

```text
.article-import/<slug>/bundle.zip
.article-import/<slug>/bundle.tar.gz
.article-import/<slug>/bundle.tgz
.article-import/<slug>/bundle.b64
```

The `Import article bundles` GitHub Actions workflow:

1. installs the publishing dependency;
2. safely extracts the transport;
3. generates `article.html` from Markdown when required;
4. validates the rendered result and manifest;
5. installs HTML into `blog/posts/`;
6. installs Markdown and the manifest into `blog/content/`;
7. installs binary assets into `blog/assets/<slug>/`;
8. inserts or updates the article in `assets/js/blog-posts.js`;
9. removes the staging package;
10. commits the resulting static files.

The public site never serves the transport archive or Base64 wrapper.

## Markdown Image Rules

Use ordinary Markdown and keep images where they belong in the narrative:

```md
## Visual direction

The first screen should immediately feel like a game.

![Main screen concept](assets/main-screen.avif "Main screen concept")
```

One standalone image becomes an editorial figure. Consecutive standalone images become a responsive gallery:

```md
![Apartment](assets/apartment.avif "Evening apartment")

![Classroom](assets/classroom.avif "Daytime classroom")

![Park](assets/park.avif "Park at sunset")
```

The optional Markdown image title becomes the visible caption. When no title is supplied, alt text is used as the caption.

Store real binary images in the bundle. Do not embed large raster images as Base64 inside published HTML or SVG.

## Publishing Skills

Human- and AI-readable task instructions live in:

```text
instructions/skills/
```

Available skills:

```text
render-markdown-article Render Markdown into the shared bilingual article template
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

The repository intentionally does not use `AGENTS.md`. Task-specific skills provide narrower operational context.

## Blog Metadata Automation

`assets/js/blog-posts.js` is the runtime source of truth for static article metadata. It drives:

- blog index cards;
- Previous/Next article navigation;
- landing-page notifications for posts with `notify: true`.

The bundle importer updates this file automatically. Manual publishers add one entry to `window.BLOG_POSTS`; they do not duplicate cards in `blog/index.html` or notifications in `assets/js/notifications.js`.

Manual checklist:

```text
docs/ADDING_BLOG_ARTICLES.md
```

## Image Galleries

Blog images open in a reusable fullscreen viewer with keyboard controls, captions, counters, and gallery navigation.

Documentation:

```text
docs/IMAGE_GALLERIES.md
instructions/skills/prepare-article-images/SKILL.md
```

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

Project images are normally stored in `assets/img/` and use relative paths from the site root.

## Local Preview And Testing

A local static server catches path, asset, caching, and browser-loading problems.

```powershell
python -m http.server 4173
```

Windows launcher:

```powershell
py -m http.server 4173
```

Or Node.js:

```powershell
npx --yes http-server . -p 4173 -c-1
```

Open:

```text
http://127.0.0.1:4173/
http://127.0.0.1:4173/blog/
http://127.0.0.1:4173/blog/posts/<slug>.html
```

Use the full review procedure in `instructions/skills/review-publication/SKILL.md`.

## Deployment Through GitHub Pages

1. Open repository Settings -> Pages.
2. Select `Deploy from a branch`.
3. Select `main` and `/ root`.
4. Save.
5. Open `https://lotargo.github.io` after the build finishes.

## Profile README Button

`PROFILE_README_SNIPPET.md` contains the badge/snippet intended for the `Lotargo/Lotargo` profile README.

## Future Migration Note

`v0_PROMPT.md` is kept only as a historical reference. The current site does not depend on Next.js, Vite, Astro, Vercel, or another application framework.

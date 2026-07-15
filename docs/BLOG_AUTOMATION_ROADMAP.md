# Blog Automation Roadmap

This roadmap describes the evolution of the `lotargo.github.io` publishing system.

The guiding principle remains:

> Keep the public site static and GitHub Pages-friendly, while making article creation, asset delivery, validation, and publication increasingly difficult to break.

## Current Baseline

Implemented:

- static HTML/CSS/JavaScript runtime with no backend;
- bilingual Markdown sources in `blog/content/`;
- deterministic article HTML in `blog/posts/`;
- per-article binary assets in `blog/assets/<slug>/`;
- shared article metadata in `assets/js/blog-posts.js`;
- generated blog index cards;
- Previous/Next article navigation;
- landing-page notifications;
- reusable galleries and fullscreen image viewer;
- Article Bundle manifest and JSON Schema;
- ZIP, TAR.GZ, TGZ, Base64, and expanded-directory transports;
- safe bundle validation and installation;
- deterministic Markdown-to-HTML rendering;
- shared bilingual article template;
- automatic image figures, captions, and galleries;
- high-level publishing CLI;
- GitHub Actions rendering and import;
- automated renderer and bundle tests;
- task-specific skills for humans and AI assistants;
- manual, CLI, and CI publication routes.

Current standard:

```text
docs/ARTICLE_BUNDLE_STANDARD.md
schemas/article-bundle.schema.json
scripts/render_article.py
scripts/publish_article.py
templates/article.html
instructions/skills/
```

## Architectural Decision

Do not add a runtime API, database, server-side CMS, or framework migration merely to publish articles.

The preferred architecture is:

```text
article.json + Markdown + static assets
                  ↓
         deterministic renderer
                  ↓
       Article Bundle validation
                  ↓
       plain GitHub Pages output
```

Archives and Base64 are transport containers only. Readers receive ordinary static files.

## Completed Phase: Portable Article Bundles

The portable publication unit contains:

```text
article.json
content/en.md
content/ru.md
assets/*
```

`article.html` is generated before packaging or installation.

Completed properties:

- one package carries text, translations, metadata, and binary assets;
- CI rejects archive traversal, links, unsafe paths, and invalid manifests;
- installed assets are real files rather than embedded Base64 payloads;
- an existing slug updates idempotently;
- the shared blog manifest is updated automatically;
- staging transports are removed after import.

## Completed Phase: Deterministic Markdown Renderer

Implemented files:

```text
scripts/render_article.py
scripts/publish_article.py
templates/article.html
requirements-publishing.txt
```

The renderer:

- uses `article.json` as the canonical metadata source;
- removes duplicate frontmatter and the first source H1;
- creates English and Russian content blocks;
- turns the first paragraph into the article lead;
- supports headings, lists, blockquotes, tables, fenced code, links, and footnotes;
- turns standalone images into editorial figures;
- groups consecutive images into responsive lightbox galleries;
- rewrites bundle-relative asset paths;
- rejects dangerous HTML and inline event handlers;
- preserves compatibility with legacy hand-authored HTML.

The high-level CLI renders automatically when the manifest contains `render` or when the declared HTML file is absent.

## Completed Phase: Publishing Skills

Task instructions live under:

```text
instructions/skills/
```

They cover:

- Markdown article rendering;
- article writing;
- image preparation;
- binary bundle delivery;
- terminal workflows;
- manual publishing;
- final publication review.

The repository intentionally does not use `AGENTS.md`.

## Next Phase 1: Repository-Wide Validation

The current validator checks one publication during import. A repository-wide validator should additionally verify all existing articles.

Planned checks:

- unique slugs;
- chronological manifest order;
- matching HTML, Markdown, and article manifests;
- stale generated HTML;
- broken local links;
- missing image files;
- missing alt text;
- invalid article scripts or shell structure;
- oversized assets;
- private repository URLs in public content;
- orphaned files in `blog/assets/`.

Target command:

```bash
python scripts/publish_article.py validate-repository --root .
```

## Next Phase 2: Static Metadata Source

Goal: stop treating executable JavaScript as the easiest canonical format for tools to edit.

Possible canonical input:

```text
assets/data/blog-posts.json
```

Generated compatibility output:

```text
assets/js/blog-posts.js
```

Benefits:

- simpler schema validation;
- safer editing by AI assistants;
- deterministic sorting;
- easier RSS and sitemap generation;
- less JavaScript parsing in publishing tools.

The current runtime should remain unchanged until this path is proven stable.

## Next Phase 3: RSS, Sitemap, And `llms.txt`

Generate:

```text
sitemap.xml
rss.xml
llms.txt
```

All three should derive from the same article metadata source.

Recommended order:

1. sitemap;
2. RSS;
3. `llms.txt`.

## Next Phase 4: OpenGraph And Share Assets

Extend metadata with optional fields:

```text
ogImage
ogDescription
canonicalUrl
```

Rendered articles should support standard OpenGraph tags. Missing share images should warn rather than block publication.

## Next Phase 5: Asset Derivatives

The publishing tools may later generate:

```text
preview.avif
full.avif
mobile.avif
social-preview.avif
```

Potential checks:

- image dimensions;
- aspect ratios;
- file-size budgets;
- alpha-channel preservation;
- preview/full matching;
- visible compression artifacts.

The source image must never be silently replaced by a low-resolution derivative.

## Next Phase 6: Draft And Scheduled Publication

Possible future metadata:

```json
{
  "status": "draft",
  "publish_at": "2026-08-01T12:00:00Z"
}
```

Do not add scheduling until publication volume makes it useful.

## Next Phase 7: Editorial History

Possible lightweight provenance:

```text
created_by
updated_by
source_revision
asset_manifest
```

This must not expose private prompts, hidden reasoning, credentials, or private repository links.

## Explicit Non-Goals

- no backend CMS at the current scale;
- no database for article publication;
- no serverless API merely to write files;
- no required Next.js, Astro, Vite, React, or similar migration;
- no archive or Base64 payloads served to readers;
- no `AGENTS.md`;
- no automatic public release without validation and review;
- no claim that generated concepts are finished product screenshots.

## Recommended Next Work

1. Use the Markdown-first pipeline for the next real article.
2. Fix issues discovered through real publication rather than theoretical expansion.
3. Add repository-wide validation.
4. Move article metadata to static JSON only after validation needs it.
5. Add sitemap and RSS after metadata becomes fully deterministic.

The system now provides most practical properties of a small static CMS while preserving direct ownership of every published file.

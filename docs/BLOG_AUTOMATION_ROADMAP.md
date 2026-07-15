# Blog Automation Roadmap

This roadmap describes the evolution of the `lotargo.github.io` publishing system.

The guiding principle remains unchanged:

> Keep the public site static and GitHub Pages-friendly, while making article creation, asset delivery, validation, and publication increasingly difficult to break.

## Current Baseline

Implemented:

- static HTML/CSS/JavaScript runtime with no backend;
- Markdown source copies in `blog/content/`;
- rendered article HTML in `blog/posts/`;
- per-article binary assets in `blog/assets/<slug>/`;
- shared metadata in `assets/js/blog-posts.js`;
- generated blog index cards;
- Previous/Next article navigation;
- landing-page notifications;
- reusable image galleries and fullscreen viewer;
- Article Bundle manifest and JSON Schema;
- bundle transports through ZIP, TAR.GZ, TGZ, and Base64;
- Python CLI for validation, packing, installation, and staged imports;
- GitHub Actions bundle installation;
- automated bundle tests;
- task-specific publishing skills for humans and AI assistants;
- manual, CLI, and CI publication routes.

Current standard:

```text
docs/ARTICLE_BUNDLE_STANDARD.md
schemas/article-bundle.schema.json
scripts/article_bundle.py
instructions/skills/
```

## Architectural Decision

Do not add a runtime API, database, server-side CMS, or framework migration merely to publish articles.

The preferred architecture is:

```text
Markdown + rendered HTML + static assets
                ↓
Article Bundle contract
                ↓
CLI validation / CI installation
                ↓
plain GitHub Pages output
```

The archive or Base64 file is only a transport container. The public repository output remains ordinary static files.

## Completed Phase: Portable Article Bundles

The publication unit now contains:

```text
article.json
article.html
content/*.md
assets/*
```

Supported transports:

```text
expanded directory
ZIP
TAR.GZ / TGZ
Base64-wrapped ZIP or TAR.GZ
```

Completed properties:

- one package can carry article text, translations, HTML, metadata, and binary assets;
- CI validates paths and rejects archive traversal and links;
- installed assets are real files rather than Base64 embedded in HTML/SVG;
- an existing slug can be updated idempotently;
- the shared blog manifest is updated automatically;
- temporary staging files are removed after import.

## Completed Phase: Publishing Skills

Task-specific instructions live under:

```text
instructions/skills/
```

Current skills cover:

- binary bundle delivery;
- terminal and CLI workflows;
- manual repository editing;
- article writing;
- image preparation;
- final publication review.

The repository intentionally does not use `AGENTS.md`. Narrow task instructions are easier for an AI assistant to load and follow without inheriting irrelevant context.

## Next Phase 1: Deterministic Markdown Renderer

Goal: make the relationship between Markdown source and rendered HTML fully reproducible.

Current bundles already preserve both forms, but an AI assistant or editor still prepares `article.html` before packaging.

Possible implementation:

```text
scripts/render_article.py
or
scripts/build-blog.mjs
```

Inputs:

```text
article.json
content/ru.md
content/en.md
article template
```

Outputs:

```text
article.html
```

Required features:

- shared article header/footer;
- bilingual content blocks;
- headings, paragraphs, lists, code, and blockquotes;
- image figures and captions;
- gallery directives;
- article-specific optional CSS;
- deterministic output;
- compatibility with manually authored legacy articles.

Do not introduce a heavy framework merely for Markdown rendering.

## Next Phase 2: Full Blog Validation

The current bundle validator checks the publication being imported. A repository-wide validator should additionally check all existing articles.

Planned checks:

- unique slugs;
- chronological manifest order;
- matching HTML/source/manifest files;
- broken local links;
- missing image files;
- invalid Previous/Next runtime metadata;
- missing alt text;
- missing article scripts;
- oversized assets;
- private repository URLs in public content;
- orphaned files in `blog/assets/`;
- stale article manifests.

Target command:

```bash
python scripts/article_bundle.py validate-repository --root .
```

## Next Phase 3: Static Metadata Source

Goal: stop treating executable JavaScript as the easiest format for tools to modify.

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
- easier RSS and sitemap generation;
- deterministic sorting;
- less JavaScript parsing in tooling.

Migration should preserve the current runtime until the JSON path is proven stable.

## Next Phase 4: RSS, Sitemap, And `llms.txt`

Add generated static discovery files:

```text
rss.xml
sitemap.xml
llms.txt
```

Order:

1. sitemap;
2. RSS;
3. `llms.txt`.

All should derive from the same article metadata source.

## Next Phase 5: OpenGraph And Share Assets

Extend article metadata with optional fields:

```text
ogImage
ogDescription
canonicalUrl
```

Rendered articles should support:

```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:type" content="article" />
```

Missing OpenGraph images should produce a warning, not block publication.

## Next Phase 6: Asset Derivatives

For large source images, the publishing CLI may generate:

```text
preview.avif
full.avif
mobile.avif
social-preview.avif
```

Potential checks:

- dimensions;
- aspect ratios;
- file size budgets;
- alpha-channel preservation;
- visible compression artifacts;
- preview/full source matching.

The source image should never be silently replaced by a low-resolution derivative.

## Next Phase 7: Draft And Scheduled Publication

Possible future metadata:

```json
{
  "status": "draft",
  "publish_at": "2026-08-01T12:00:00Z"
}
```

A scheduled workflow could install or expose the article at the requested time while keeping the public runtime static.

Do not add this until regular publication volume makes scheduling useful.

## Next Phase 8: Editorial History

For larger articles, preserve lightweight provenance:

```text
created_by
updated_by
source_revision
asset_manifest
```

This should describe the publication process without exposing private prompts, hidden reasoning, credentials, or internal repository links.

## Explicit Non-Goals

- no backend CMS at the current scale;
- no database for article publication;
- no serverless API merely to write files;
- no required Next.js, Astro, Vite, or React migration;
- no archive or Base64 payloads served to readers;
- no `AGENTS.md`;
- no automatic publication without validation and review;
- no claim that generated concepts are finished product screenshots.

## Recommended Next Work

1. Use the new bundle standard for the next real article.
2. Fix issues discovered through real publication rather than theoretical expansion.
3. Add repository-wide validation.
4. Build deterministic Markdown rendering only after two or three bundle publications confirm the desired article conventions.
5. Add sitemap and RSS after metadata becomes fully deterministic.

The current system already provides most of the useful properties of a small static CMS while retaining direct ownership of every published file.

# Publishing Instructions

This directory contains task-specific instructions for people and AI assistants working with the portfolio and blog.

They are deliberately organized as small skills instead of one large repository-wide instruction file. There is no `AGENTS.md` in this project.

## Skill Index

```text
instructions/skills/
├── render-markdown-article/SKILL.md
├── publish-binary-bundle/SKILL.md
├── publish-with-cli/SKILL.md
├── publish-manually/SKILL.md
├── write-blog-article/SKILL.md
├── prepare-article-images/SKILL.md
└── review-publication/SKILL.md
```

## How To Choose A Skill

- Use `render-markdown-article` when Markdown and `article.json` should generate the final bilingual HTML page.
- Use `publish-binary-bundle` when the final delivery is one ZIP, TAR.GZ, TGZ, or Base64 package uploaded to `.article-import/<slug>/`.
- Use `publish-with-cli` when working in a local clone, terminal, CI sandbox, or coding agent with filesystem access.
- Use `publish-manually` when editing files directly through GitHub or a text editor without the bundle importer.
- Use `write-blog-article` when drafting or restructuring the article itself.
- Use `prepare-article-images` when generating, exporting, naming, compressing, or integrating visual assets.
- Use `review-publication` before pushing to `main` or after GitHub Pages deploys.

Several skills may be combined for one publication. The normal Markdown-first flow is:

```text
write-blog-article
        ↓
prepare-article-images
        ↓
render-markdown-article
        ↓
publish-binary-bundle or publish-with-cli
        ↓
review-publication
```

## Shared Rules

1. Keep Markdown as the semantic source and generated HTML as the deterministic publication artifact.
2. Use `scripts/publish_article.py` for Markdown-first rendering, validation, packing, and installation.
3. Never embed large raster images as Base64 inside Markdown, HTML, or SVG.
4. Use ordinary repository assets after import.
5. Preserve Russian and English versions when the article is bilingual.
6. Do not edit unrelated articles or project cards during publication.
7. Do not add `AGENTS.md`.
8. Do not expose private repository links or internal implementation details in public articles unless explicitly approved.
9. Validate the final page on desktop and mobile, including galleries and language switching.
10. Do not hand-edit generated HTML without also updating the Markdown source or deliberately marking the article as legacy HTML.

## Standards

The renderer and bundle contracts are defined in:

```text
docs/ARTICLE_BUNDLE_STANDARD.md
schemas/article-bundle.schema.json
templates/article.html
```

A copyable Markdown-first example lives in:

```text
examples/article-bundle/
```

The manual checklist remains in `docs/ADDING_BLOG_ARTICLES.md`, but new automated publications should follow the Markdown renderer, bundle standard, and these skills.

# Publishing Instructions

This directory contains task-specific instructions for people and AI assistants working with the portfolio and blog.

They are deliberately organized as small skills instead of one large repository-wide instruction file. There is no `AGENTS.md` in this project.

## Skill Index

```text
instructions/skills/
├── publish-binary-bundle/SKILL.md
├── publish-with-cli/SKILL.md
├── publish-manually/SKILL.md
├── write-blog-article/SKILL.md
├── prepare-article-images/SKILL.md
└── review-publication/SKILL.md
```

## How To Choose A Skill

- Use `publish-binary-bundle` when the final delivery is one ZIP, TAR.GZ, TGZ, or Base64 package uploaded to `.article-import/<slug>/`.
- Use `publish-with-cli` when working in a local clone, terminal, CI sandbox, or coding agent with filesystem access.
- Use `publish-manually` when editing files directly through GitHub or a text editor without the bundle importer.
- Use `write-blog-article` when drafting or restructuring the article itself.
- Use `prepare-article-images` when generating, exporting, naming, compressing, or integrating visual assets.
- Use `review-publication` before pushing to `main` or after GitHub Pages deploys.

Several skills may be combined for one publication. A normal AI-assisted flow is:

```text
write-blog-article
        ↓
prepare-article-images
        ↓
publish-binary-bundle or publish-with-cli
        ↓
review-publication
```

## Shared Rules

1. Keep Markdown as the semantic source and HTML as the deterministic published artifact.
2. Never embed large raster images as Base64 inside HTML or SVG.
3. Use ordinary repository assets after import.
4. Preserve Russian and English versions when the article is bilingual.
5. Do not edit unrelated articles or project cards during publication.
6. Do not add `AGENTS.md`.
7. Do not expose private repository links or internal implementation details in public articles unless explicitly approved.
8. Validate the final page on desktop and mobile, including gallery and language switching.

## Standards

The bundle contract is defined in:

```text
docs/ARTICLE_BUNDLE_STANDARD.md
schemas/article-bundle.schema.json
```

The legacy static checklist remains in `docs/ADDING_BLOG_ARTICLES.md`, but new automated work should follow the bundle standard and these skills.

---
name: publish-with-cli
description: Render, validate, pack, install, preview, and publish blog articles from a terminal or coding-agent workspace.
---

# Publish With The CLI

Use this skill when a local repository clone or writable sandbox is available.

## Preferred Workflow

```text
prepare article.json + Markdown + assets
        ↓
render deterministic HTML
        ↓
validate
        ↓
install into checkout
        ↓
preview locally
        ↓
review git diff
        ↓
commit and push
```

## Setup

```bash
python -m pip install -r requirements-publishing.txt
```

## Commands

Render an expanded bundle:

```bash
python scripts/publish_article.py render ./work/my-article
```

Render when needed and validate:

```bash
python scripts/publish_article.py validate ./work/my-article
```

Install it into the current checkout:

```bash
python scripts/publish_article.py install ./work/my-article --root .
```

Archives work directly:

```bash
python scripts/publish_article.py validate ./bundle.tar.gz
python scripts/publish_article.py install ./bundle.tar.gz --root .
```

Create transport packages:

```bash
python scripts/publish_article.py pack ./work/my-article \
  --archive-format zip \
  --transport binary \
  --output ./dist/bundle.zip

python scripts/publish_article.py pack ./work/my-article \
  --archive-format tar.gz \
  --transport binary \
  --output ./dist/bundle.tar.gz

python scripts/publish_article.py pack ./work/my-article \
  --archive-format zip \
  --transport b64 \
  --output ./dist/bundle.b64
```

The CLI regenerates HTML automatically when `article.json` contains `render` or when the declared HTML file is absent.

Use the lower-level `scripts/article_bundle.py` only for a deliberately legacy bundle that already contains final hand-authored HTML.

## Local Preview

From the repository root:

```bash
python -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/blog/
http://127.0.0.1:4173/blog/posts/<slug>.html
```

For Node.js:

```bash
npx --yes http-server . -p 4173 -c-1
```

## Required Checks Before Commit

Run:

```bash
git status --short
git diff --stat
git diff -- blog/posts/<slug>.html
git diff -- blog/content/<slug>.ru.md
git diff -- blog/content/<slug>.en.md
git diff -- blog/content/<slug>.article.json
git diff -- assets/js/blog-posts.js
```

Confirm that:

- only intended files changed;
- generated HTML matches the current Markdown;
- article metadata matches the page;
- all image paths resolve;
- no Base64 raster payloads remain in HTML or SVG;
- the article contains the normal site scripts;
- private links and secrets are absent;
- Russian and English content are both present;
- galleries, captions, themes, and language switching work.

## Updating An Existing Article

Reuse the same slug. The importer replaces:

- generated HTML;
- localized Markdown sources;
- installed `article.json`;
- the complete `blog/assets/<slug>/` directory;
- the corresponding `BLOG_POSTS` entry.

Do not create a second slug merely to fix wording or replace images.

## Git Practice

Use a clear commit message describing the article change and verification performed. Push directly to `main` when that is the agreed workflow. Do not create a PR when direct publication was explicitly requested.

## Completion Criteria

The article must pass `instructions/skills/review-publication/SKILL.md` before the task is considered finished.

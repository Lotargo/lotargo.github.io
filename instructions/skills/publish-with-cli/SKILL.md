---
name: publish-with-cli
description: Validate, pack, install, preview, and publish blog articles from a terminal or coding-agent workspace.
---

# Publish With The CLI

Use this skill when a local repository clone or writable sandbox is available.

## Preferred Workflow

```text
prepare expanded article bundle
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

## Commands

Validate an expanded bundle:

```bash
python scripts/article_bundle.py validate ./work/my-article
```

Install it into the current repository checkout:

```bash
python scripts/article_bundle.py install ./work/my-article --root .
```

Alternatively validate and install an archive directly:

```bash
python scripts/article_bundle.py validate ./bundle.tar.gz
python scripts/article_bundle.py install ./bundle.tar.gz --root .
```

Create transport packages:

```bash
python scripts/article_bundle.py pack ./work/my-article \
  --archive-format zip \
  --transport binary \
  --output ./dist/bundle.zip

python scripts/article_bundle.py pack ./work/my-article \
  --archive-format tar.gz \
  --transport binary \
  --output ./dist/bundle.tar.gz

python scripts/article_bundle.py pack ./work/my-article \
  --archive-format zip \
  --transport b64 \
  --output ./dist/bundle.b64
```

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
git diff -- assets/js/blog-posts.js
```

Confirm that:

- only intended files changed;
- article metadata matches the page;
- all image paths resolve;
- no Base64 raster payloads remain in HTML or SVG;
- the article contains the normal site scripts;
- private links and secrets are absent;
- Russian and English content are both present when declared.

## Updating An Existing Article

Reuse the same slug. The importer replaces:

- the rendered HTML;
- localized Markdown sources;
- the installed `article.json`;
- the complete `blog/assets/<slug>/` directory;
- the corresponding `BLOG_POSTS` entry.

Do not create a second slug merely to fix wording or replace images.

## Git Practice

Use a clear commit message such as:

```text
Publish article about <topic>
Update <slug> article assets
Revise <slug> article
```

Push directly to `main` only when that is the agreed workflow. Never create a PR automatically when the user explicitly requested direct publication.

## Completion Criteria

The article must pass `instructions/skills/review-publication/SKILL.md` before the task is considered finished.

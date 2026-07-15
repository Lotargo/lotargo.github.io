---
name: publish-binary-bundle
description: Prepare and deliver a complete blog article as ZIP, TAR.GZ, TGZ, or Base64 for CI import.
---

# Publish A Binary Article Bundle

Use this skill when an article, its Markdown sources, rendered HTML, metadata, and assets should be delivered as one package.

## Goal

Produce exactly one valid transport file for:

```text
.article-import/<slug>/
```

Accepted transport names:

```text
bundle.zip
bundle.tar.gz
bundle.tgz
bundle.b64
```

## Required Bundle Structure

```text
article.json
article.html
content/
  ru.md
  en.md
assets/
  ...ordinary binary assets...
```

The exact source and asset paths must match `article.json`.

## Transport Choice

Choose in this order:

1. `bundle.zip` for broad compatibility and ordinary binary upload.
2. `bundle.tar.gz` or `bundle.tgz` for Linux-first tooling and efficient packaging.
3. `bundle.b64` only when the transport channel accepts text but cannot upload binary files.

Base64 is a transport wrapper, not a publication format. Never leave Base64 image data inside the installed article.

## Procedure

1. Read `docs/ARTICLE_BUNDLE_STANDARD.md`.
2. Validate the slug, date, localized metadata, article paths, alt text, and image references.
3. Ensure `article.html` loads the normal site scripts.
4. Ensure every referenced asset exists inside `assets/`.
5. Validate the expanded bundle:

```bash
python scripts/article_bundle.py validate ./my-article
```

6. Pack the preferred transport:

```bash
python scripts/article_bundle.py pack ./my-article \
  --archive-format zip \
  --transport binary \
  --output ./bundle.zip
```

7. Validate the resulting transport again:

```bash
python scripts/article_bundle.py validate ./bundle.zip
```

8. Upload only the resulting transport file to `.article-import/<slug>/` and commit it to `main`.
9. Wait for the `Import article bundle` workflow.
10. Confirm that CI removed the temporary staging directory and committed ordinary files to `blog/posts/`, `blog/content/`, and `blog/assets/<slug>/`.

## Base64 Packaging

```bash
python scripts/article_bundle.py pack ./my-article \
  --archive-format zip \
  --transport b64 \
  --output ./bundle.b64
```

Do not manually concatenate Base64 chunks unless a tool enforces a message-size limit. When chunking is unavoidable, reconstruct one valid `bundle.b64` before uploading it to the staging directory.

## Do Not

- do not upload both ZIP and Base64 for the same staged article;
- do not place multiple bundle files in one slug directory;
- do not embed raster images inside SVG wrappers;
- do not store the temporary transport package permanently;
- do not publish links to private repositories without explicit approval;
- do not add `AGENTS.md`.

## Completion Criteria

The task is complete only when:

- CI succeeds;
- the staging package disappears;
- the article exists as ordinary HTML and Markdown;
- assets exist as ordinary binary files;
- the blog index and Previous/Next navigation include the article;
- the public page passes the review skill.

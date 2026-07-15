# Adding Blog Articles

This repository supports three publication routes:

1. Article Bundle through CI.
2. Direct installation through the CLI.
3. Manual repository editing.

The published result is always static HTML, Markdown source, ordinary binary assets, and one shared blog metadata entry.

## Choose A Route

### Article Bundle Through CI

Best for AI-assisted publication, tools with limited GitHub operations, and delivering a complete article as one artifact.

Read:

```text
docs/ARTICLE_BUNDLE_STANDARD.md
instructions/skills/publish-binary-bundle/SKILL.md
```

Upload one file to:

```text
.article-import/<slug>/bundle.zip
.article-import/<slug>/bundle.tar.gz
.article-import/<slug>/bundle.tgz
.article-import/<slug>/bundle.b64
```

GitHub Actions installs and commits the article automatically.

### CLI Installation

Best for local clones, coding agents, and sandboxes with terminal and filesystem access.

Read:

```text
instructions/skills/publish-with-cli/SKILL.md
```

Typical flow:

```bash
python scripts/article_bundle.py validate ./work/my-article
python scripts/article_bundle.py install ./work/my-article --root .
python -m http.server 4173
```

### Manual Publication

Best for small edits and environments where direct repository editing is simpler than packaging.

Read:

```text
instructions/skills/publish-manually/SKILL.md
```

## Installed Article Layout

For slug `my-article`:

```text
blog/posts/my-article.html
blog/content/my-article.ru.md
blog/content/my-article.en.md
blog/content/my-article.article.json
blog/assets/my-article/
```

Metadata is inserted or updated in:

```text
assets/js/blog-posts.js
```

## Source Of Truth

Markdown is the semantic source of the article. HTML is the deterministic publication artifact.

The shared runtime metadata manifest controls:

1. Blog index cards.
2. Previous/Next navigation.
3. Landing-page notifications for posts with `notify: true`.

Do not manually duplicate blog cards in `blog/index.html`. Do not duplicate article notifications in `assets/js/notifications.js`.

## Article Bundle Layout

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

Minimal `article.json`:

```json
{
  "format_version": 1,
  "slug": "my-article",
  "date": "2026-07-15",
  "html": "article.html",
  "sources": {
    "ru": "content/ru.md",
    "en": "content/en.md"
  },
  "assets": "assets",
  "post": {
    "type": {
      "ru": "Разработка",
      "en": "Development"
    },
    "title": {
      "ru": "Полный заголовок",
      "en": "Full title"
    },
    "shortTitle": {
      "ru": "Короткий заголовок",
      "en": "Short title"
    },
    "description": {
      "ru": "Описание для блога.",
      "en": "Blog description."
    },
    "notify": true
  }
}
```

Machine-readable schema:

```text
schemas/article-bundle.schema.json
```

## CLI Reference

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

Pack Base64:

```bash
python scripts/article_bundle.py pack ./my-article \
  --archive-format zip \
  --transport b64 \
  --output ./bundle.b64
```

Install:

```bash
python scripts/article_bundle.py install ./bundle.zip --root .
```

## Article Page Requirements

Each rendered HTML page must:

- use the standard site header and footer;
- contain `.post-article`;
- include a `.post-pagination` element;
- load the normal scripts at the end;
- use valid relative asset paths;
- place the title and lead before major illustrations.

Required scripts:

```html
<script src="../../assets/js/main.js"></script>
<script src="../../assets/js/blog-post.js"></script>
```

## Images And Galleries

Read:

```text
docs/IMAGE_GALLERIES.md
instructions/skills/prepare-article-images/SKILL.md
```

Use real binary assets in `blog/assets/<slug>/`. Do not embed low-resolution raster data in SVG or HTML.

For preview plus full-resolution viewing:

```html
<img
  src="preview.avif"
  data-full-src="full.avif"
  alt="Useful description"
/>
```

## Writing Instructions

Read:

```text
instructions/skills/write-blog-article/SKILL.md
```

Key rules:

- one H1;
- H2 for major sections;
- honest distinction between implemented work and plans;
- illustrations integrated near relevant text;
- no large defensive disclaimers;
- no private repository links unless explicitly approved;
- Russian and English versions should remain semantically aligned.

## Preview And Review

Start a local server:

```bash
python -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/blog/
http://127.0.0.1:4173/blog/posts/<slug>.html
```

Then follow:

```text
instructions/skills/review-publication/SKILL.md
```

Review desktop, mobile, both themes, both languages, image sharpness, fullscreen gallery navigation, console errors, and public GitHub Pages output.

## AI Instruction Layout

Task-specific instructions live in:

```text
instructions/skills/
```

This repository intentionally does not use `AGENTS.md`.

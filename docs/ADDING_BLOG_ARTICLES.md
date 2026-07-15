# Adding Blog Articles

This repository supports three publication routes:

1. Markdown-first Article Bundle through CI.
2. Direct rendering and installation through the CLI.
3. Manual repository editing for exceptional legacy cases.

The recommended path is now:

```text
article.json + content/en.md + content/ru.md + assets
                         ↓
              scripts/publish_article.py
                         ↓
                    article.html
                         ↓
             static GitHub Pages article
```

## Recommended Starting Point

Copy:

```text
examples/article-bundle/
```

Rename the working directory to the intended lowercase kebab-case slug.

## Bundle Layout

```text
my-new-article/
├── article.json
├── content/
│   ├── en.md
│   └── ru.md
└── assets/
    ├── cover.avif
    └── gallery-01.avif
```

`article.html` is generated. Do not create it manually unless the article deliberately uses the legacy HTML path.

## Minimum Checklist

1. Update `article.json`:

```json
{
  "format_version": 1,
  "slug": "my-new-article",
  "date": "2026-07-15",
  "html": "article.html",
  "render": {
    "engine": "markdown",
    "template": "default"
  },
  "sources": {
    "en": "content/en.md",
    "ru": "content/ru.md"
  },
  "assets": "assets",
  "post": {
    "type": {
      "en": "Development",
      "ru": "Разработка"
    },
    "title": {
      "en": "Full English Article Title",
      "ru": "Полный русский заголовок"
    },
    "shortTitle": {
      "en": "Short title",
      "ru": "Короткий заголовок"
    },
    "description": {
      "en": "Short description for the blog index.",
      "ru": "Короткое описание для индекса блога."
    },
    "notify": true
  }
}
```

2. Write both Markdown sources.

3. Put ordinary binary media into `assets/`.

4. Reference images from Markdown as:

```md
![Useful alt text](assets/image.avif "Visible caption")
```

5. Install publishing dependencies:

```bash
python -m pip install -r requirements-publishing.txt
```

6. Render and validate:

```bash
python scripts/publish_article.py render ./my-new-article
python scripts/publish_article.py validate ./my-new-article
```

7. Install into a local checkout for preview:

```bash
python scripts/publish_article.py install ./my-new-article --root .
```

8. Serve the site:

```bash
python -m http.server 4173
```

9. Check:

```text
http://127.0.0.1:4173/blog/
http://127.0.0.1:4173/blog/posts/my-new-article.html
```

10. Test desktop, mobile, both languages, both themes, image captions, and fullscreen gallery navigation.

## Automatic Image Layout

One standalone image becomes an editorial figure:

```md
![Main screen](assets/main-screen.avif "Main screen concept")
```

Consecutive standalone images become a gallery:

```md
![Apartment](assets/apartment.avif "Evening apartment")

![Classroom](assets/classroom.avif "Daytime classroom")

![Park](assets/park.avif "Park at sunset")
```

Place images near the paragraphs they illustrate. Do not put a detached gallery before the article title.

## Packaging

ZIP:

```bash
python scripts/publish_article.py pack ./my-new-article \
  --archive-format zip \
  --transport binary \
  --output ./bundle.zip
```

TAR.GZ:

```bash
python scripts/publish_article.py pack ./my-new-article \
  --archive-format tar.gz \
  --transport binary \
  --output ./bundle.tar.gz
```

Base64 transport:

```bash
python scripts/publish_article.py pack ./my-new-article \
  --archive-format zip \
  --transport b64 \
  --output ./bundle.b64
```

## CI Publication

Upload exactly one package into:

```text
.article-import/my-new-article/
```

Accepted names:

```text
bundle.zip
bundle.tar.gz
bundle.tgz
bundle.b64
```

The workflow renders Markdown when required, validates the result, installs static files, updates `assets/js/blog-posts.js`, removes the staging package, and commits the publication.

## What Is Automated

- Markdown-to-HTML rendering;
- bilingual article shell;
- title and lead placement;
- tables, code, blockquotes, lists, links, and footnotes;
- editorial image figures;
- responsive lightbox galleries;
- asset path rewriting;
- bundle validation;
- HTML, Markdown, manifest, and asset installation;
- blog index metadata;
- Previous/Next navigation metadata;
- landing-page notifications.

## What Still Requires Editorial Review

- clarity and factual accuracy;
- natural Russian and English text;
- image quality and relevance;
- visual rhythm;
- whether a generated-image note is necessary;
- privacy and public/private boundaries;
- browser verification after deployment.

## Legacy Manual HTML

Use manual HTML only when an article needs markup the default renderer cannot express.

A legacy bundle:

- contains final `article.html`;
- may omit `render`;
- still includes Markdown source copies where possible;
- can use the high-level CLI without forced rendering or the lower-level `scripts/article_bundle.py`.

Do not convert a normal article to legacy HTML merely to adjust spacing or image placement. Improve the shared renderer or Markdown structure instead.

## Source Of Truth

- `article.json` is canonical for metadata;
- Markdown is canonical for content;
- generated HTML is the published artifact;
- `assets/js/blog-posts.js` is the runtime metadata manifest and is updated by the importer.

Do not manually add blog cards to `blog/index.html` or duplicate notifications in `assets/js/notifications.js`.

## Related Instructions

```text
docs/ARTICLE_BUNDLE_STANDARD.md
instructions/skills/render-markdown-article/SKILL.md
instructions/skills/write-blog-article/SKILL.md
instructions/skills/prepare-article-images/SKILL.md
instructions/skills/review-publication/SKILL.md
```

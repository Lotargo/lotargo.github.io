# Render Markdown Article

Use this skill when an article should be generated from bilingual Markdown rather than assembled as HTML by hand.

## Goal

Produce a deterministic Lotargo blog article from:

```text
article.json
content/en.md
content/ru.md
assets/*
```

The output is:

```text
article.html
```

The generated HTML is a publication artifact. Markdown remains the editable semantic source.

## Required Setup

From the repository root:

```bash
python -m pip install -r requirements-publishing.txt
```

## Manifest Contract

Add the render configuration to `article.json`:

```json
{
  "html": "article.html",
  "render": {
    "engine": "markdown",
    "template": "default"
  },
  "sources": {
    "en": "content/en.md",
    "ru": "content/ru.md"
  }
}
```

The default template requires English and Russian sources.

## Render Command

```bash
python scripts/publish_article.py render ./path/to/bundle
```

Validation, packing, installation, and staged CI import also render automatically when:

- `article.json` contains `render`; or
- the declared HTML file does not exist.

## Markdown Rules

Write ordinary Markdown. Supported elements include:

- headings;
- paragraphs;
- emphasis and links;
- ordered and unordered lists;
- blockquotes;
- tables;
- fenced code blocks;
- footnotes;
- standalone images.

The canonical article title comes from `post.title` in `article.json`. A source H1 may be present, but the renderer removes the first H1 to prevent duplicate page titles.

The first normal paragraph becomes `.post-lead` automatically.

Do not use raw HTML for layout. The renderer rejects dangerous HTML elements and inline event handlers.

## Images

Use bundle-relative image paths:

```md
![Main screen](assets/main-screen.avif "Main screen concept")
```

The renderer changes this to the installed article path:

```text
../assets/<slug>/main-screen.avif
```

The Markdown image title becomes the visible caption. Alt text is used when no title is supplied.

One standalone image becomes an editorial figure. Consecutive standalone images become one responsive gallery and one fullscreen lightbox group:

```md
![Apartment](assets/apartment.avif "Evening apartment")

![Classroom](assets/classroom.avif "Daytime classroom")

![Park](assets/park.avif "Park at sunset")
```

Place images after the paragraphs they illustrate. Do not begin the article with a detached gallery unless the composition specifically requires it.

## Metadata And Frontmatter

`article.json` is canonical for:

- slug;
- date;
- article type;
- Russian and English titles;
- index descriptions;
- notification metadata.

YAML-like frontmatter in Markdown is tolerated and removed, but it is not used to build the page.

## Verification

Run:

```bash
python scripts/publish_article.py render ./path/to/bundle
python scripts/publish_article.py validate ./path/to/bundle
```

Then serve the repository locally and check:

- English and Russian switching;
- title and lead placement;
- heading hierarchy;
- tables and code blocks;
- image captions;
- gallery grouping;
- fullscreen navigation;
- desktop and mobile layout;
- no missing assets;
- no private repository links.

## Do Not

- do not hand-edit generated `article.html` as the primary source;
- do not embed raster images as Base64 in Markdown, HTML, or SVG;
- do not add `AGENTS.md`;
- do not expose private implementation details in public copy;
- do not move images above the title or outside the narrative without a deliberate reason.

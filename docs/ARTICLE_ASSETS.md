# Article Asset Pipeline

Blog images must be stored as real binary files in the repository. Do not embed production images as base64 inside HTML, CSS, JavaScript, or SVG wrappers.

## Folder convention

Each article that owns images receives a directory named after its slug:

```text
blog/assets/<article-slug>/
├── manifest.json
├── images/
│   └── *.avif
├── preview/         # optional for very large originals
└── full/            # optional for separate fullscreen originals
```

For reasonably sized images, one high-quality original-dimension AVIF in `images/` can serve both the article and the fullscreen viewer. Large photographs or lossless source files should use separate `preview/` and `full/` variants.

`manifest.json` records dimensions, purpose, checksums, and provenance.

## Article markup

```html
<figure class="post-gallery-item">
  <img
    src="../assets/example-article/images/screen.avif"
    data-full-src="../assets/example-article/images/screen.avif"
    width="1672"
    height="941"
    alt="Meaningful description"
    data-caption-en="English fullscreen caption"
    data-caption-ru="Русская подпись полноэкранного просмотра"
  />
  <figcaption data-lang-content="en">English article caption.</figcaption>
  <figcaption data-lang-content="ru">Русская подпись внутри статьи.</figcaption>
</figure>
```

Images sharing the same `data-gallery` value are navigated as one gallery.

## Binary import workflow

When the connected GitHub tool cannot upload binary files directly, use the repository-side importer:

```text
.asset-import/<bundle>/part-*.b64
.asset-import/<bundle>/READY
scripts/import_asset_bundle.py
.github/workflows/import-article-assets.yml
```

The bundle is split into ordered base64 text chunks. Creating `READY` starts the workflow, which validates and decodes the archive, extracts real binary files into the repository, removes the staging chunks, and commits the result.

This staging format is temporary. Published pages reference only the extracted binary assets.

## Rules

1. Preserve original dimensions unless a deliberate crop is documented.
2. Use high-quality AVIF, PNG, AVIF, or SVG according to the source material.
3. Use ASCII, kebab-case filenames.
4. Record whether the asset is original, generated, licensed, or third-party.
5. State AI generation clearly when readers could mistake a concept for a screenshot from an existing product.
6. Never use a private repository URL as the public continuation of an article. Publish selected results directly in the blog.
7. Keep article assets inside a slug-specific directory.
8. The browser must never reconstruct production images from base64 chunks at runtime.

## Visual Novel example

The `visual-novel-ai-game` article uses seven original-dimension 1672×941 AVIF concepts:

- one main-menu concept;
- three layered scene concepts;
- three cinematic scene concepts.

All seven were generated for the project and are opened directly from repository files by the lightbox.

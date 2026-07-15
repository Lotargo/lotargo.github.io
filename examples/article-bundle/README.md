# Example Article Bundle

Copy this directory when starting a new publication.

Then:

1. rename the working directory to the intended slug;
2. update `article.json`;
3. replace the Russian and English Markdown sources;
4. create `assets/` and set `article.json -> assets` to `"assets"` when media is needed;
5. render and validate the article;
6. pack the result into ZIP, TAR.GZ, or Base64 transport.

No hand-authored `article.html` is stored in this example. It is generated from Markdown:

```bash
python -m pip install -r requirements-publishing.txt

python scripts/publish_article.py render ./examples/article-bundle
python scripts/publish_article.py validate ./examples/article-bundle

python scripts/publish_article.py pack ./examples/article-bundle \
  --archive-format zip \
  --transport binary \
  --output ./bundle.zip
```

The renderer automatically:

- removes a duplicate source H1 because the canonical title comes from `article.json`;
- turns the first paragraph into the article lead;
- renders headings, lists, tables, blockquotes, fenced code, footnotes, and links;
- converts standalone Markdown images into editorial figures;
- groups consecutive standalone images into a lightbox gallery;
- rewrites `assets/image.avif` to the installed article asset path;
- creates English and Russian content blocks inside the shared site template.

This example intentionally has no assets, so `article.json` uses:

```json
"assets": null
```

Read the complete contract in `docs/ARTICLE_BUNDLE_STANDARD.md` and the renderer skill in `instructions/skills/render-markdown-article/SKILL.md`.

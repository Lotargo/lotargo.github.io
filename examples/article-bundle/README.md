# Example Article Bundle

Copy this directory when starting a new publication.

Then:

1. rename the working directory to the intended slug;
2. update `article.json`;
3. replace Russian and English Markdown sources;
4. replace `article.html` with the rendered article;
5. create `assets/` and set `article.json -> assets` to `"assets"` when media is needed;
6. validate and pack the result.

```bash
python scripts/article_bundle.py validate ./examples/article-bundle

python scripts/article_bundle.py pack ./examples/article-bundle \
  --archive-format zip \
  --transport binary \
  --output ./bundle.zip
```

This example intentionally has no assets, so `article.json` uses:

```json
"assets": null
```

Read the complete contract in `docs/ARTICLE_BUNDLE_STANDARD.md`.

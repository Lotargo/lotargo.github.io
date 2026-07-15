# Article Import Staging

Create one subdirectory per article slug:

```text
.article-import/<slug>/
```

Place exactly one supported transport file inside it:

```text
bundle.zip
bundle.tar.gz
bundle.tgz
bundle.b64
```

The directory name must match `article.json -> slug` inside the package.

An expanded bundle is also accepted when the directory contains both:

```text
article.json
READY
```

After a successful CI import, the slug directory is removed and the package contents are committed as ordinary files under:

```text
blog/posts/
blog/content/
blog/assets/<slug>/
```

Read:

```text
docs/ARTICLE_BUNDLE_STANDARD.md
instructions/skills/publish-binary-bundle/SKILL.md
```

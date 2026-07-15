from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from scripts.render_article import RenderError, render_bundle


class RenderArticleTests(unittest.TestCase):
    def create_bundle(self, root: Path) -> Path:
        bundle = root / "generated-article"
        (bundle / "content").mkdir(parents=True)
        (bundle / "assets").mkdir()
        for name in ("one.avif", "two.avif", "three.avif"):
            (bundle / "assets" / name).write_bytes(b"test")

        manifest = {
            "format_version": 1,
            "slug": "generated-article",
            "date": "2026-07-15",
            "html": "article.html",
            "render": {"engine": "markdown", "template": "default"},
            "sources": {"en": "content/en.md", "ru": "content/ru.md"},
            "assets": "assets",
            "post": {
                "type": {"en": "Development", "ru": "Разработка"},
                "title": {"en": "Generated Article", "ru": "Сгенерированная статья"},
                "shortTitle": {"en": "Generated", "ru": "Сгенерированная"},
                "description": {"en": "Rendered from Markdown.", "ru": "Собрана из Markdown."},
                "notify": False,
            },
        }
        (bundle / "article.json").write_text(
            json.dumps(manifest, ensure_ascii=False), encoding="utf-8"
        )
        (bundle / "content" / "en.md").write_text(
            """---
ignored: true
---
# Duplicate source title

The first paragraph becomes the article lead.

## Gallery section

![First concept](assets/one.avif "First caption")

![Second concept](assets/two.avif "Second caption")

![Third concept](assets/three.avif "Third caption")

| Item | State |
| --- | --- |
| Renderer | Ready |

```python
print("hello")
```
""",
            encoding="utf-8",
        )
        (bundle / "content" / "ru.md").write_text(
            """# Заголовок из исходника

Первый абзац становится лидом статьи.

## Раздел

> Markdown остаётся читаемым исходником.
""",
            encoding="utf-8",
        )
        return bundle

    def test_render_bilingual_article_with_gallery(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            bundle = self.create_bundle(Path(temporary))
            output = render_bundle(bundle)
            html = output.read_text(encoding="utf-8")

            self.assertIn('<article class="post-article" data-generated-from-markdown="true"', html)
            self.assertIn("<h1>Generated Article</h1>", html)
            self.assertIn("<h1>Сгенерированная статья</h1>", html)
            self.assertNotIn("Duplicate source title", html)
            self.assertIn('class="post-lead"', html)
            self.assertIn("post-gallery--three", html)
            self.assertIn("../assets/generated-article/one.avif", html)
            self.assertIn('data-full-src="../assets/generated-article/one.avif"', html)
            self.assertIn("First caption", html)
            self.assertIn("<table>", html)
            self.assertIn('class="language-python"', html)
            self.assertIn("../../assets/js/blog-post.js", html)

    def test_rejects_dangerous_raw_html(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            bundle = self.create_bundle(Path(temporary))
            (bundle / "content" / "en.md").write_text(
                "# Test\n\n<script>alert(1)</script>\n", encoding="utf-8"
            )
            with self.assertRaises(RenderError):
                render_bundle(bundle)


if __name__ == "__main__":
    unittest.main()

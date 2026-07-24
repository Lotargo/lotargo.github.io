import json
import tempfile
import unittest
from pathlib import Path

from scripts import publish_telegram as publisher


class TelegramPublisherTests(unittest.TestCase):
    def test_normalize_public_channel(self) -> None:
        self.assertEqual(
            publisher.normalize_chat_id("https://t.me/lotargo_blog/"),
            "@lotargo_blog",
        )
        self.assertEqual(
            publisher.normalize_chat_id("lotargo_blog"),
            "@lotargo_blog",
        )

    def test_extract_markdown_images(self) -> None:
        markdown = (
            "![SVG](assets/diagram.svg \"Diagram\")\n\n"
            "![Cover](assets/cover.png)\n"
        )
        self.assertEqual(
            publisher.extract_image_refs(markdown),
            ["assets/diagram.svg", "assets/cover.png"],
        )

    def test_load_announcement_uses_first_supported_cover(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            content = root / "blog" / "content"
            assets = root / "blog" / "assets" / "sample"
            content.mkdir(parents=True)
            assets.mkdir(parents=True)

            manifest = {
                "slug": "sample",
                "date": "2026-07-24",
                "post": {
                    "title": {"ru": "Заголовок"},
                    "description": {"ru": "Описание"},
                },
            }
            (content / "sample.article.json").write_text(
                json.dumps(manifest, ensure_ascii=False),
                encoding="utf-8",
            )
            (content / "sample.ru.md").write_text(
                "![Diagram](assets/diagram.svg)\n"
                "![Cover](assets/cover.png)\n",
                encoding="utf-8",
            )
            (assets / "diagram.svg").write_text("<svg/>", encoding="utf-8")
            (assets / "cover.png").write_bytes(b"\x89PNG\r\n\x1a\n")

            article = publisher.load_announcement(
                root,
                content / "sample.article.json",
                "https://example.test",
            )

            self.assertEqual(article.cover_path, assets / "cover.png")
            self.assertEqual(
                article.article_url,
                "https://example.test/blog/posts/sample.html",
            )
            self.assertIn("<b>Заголовок</b>", publisher.build_text(article))

    def test_changed_file_selection_ignores_non_manifests(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            content = root / "blog" / "content"
            content.mkdir(parents=True)
            manifest = content / "sample.article.json"
            manifest.write_text("{}", encoding="utf-8")

            selected = publisher.select_manifests_from_changed_files(
                root,
                [
                    "blog/content/sample.ru.md",
                    "blog/content/sample.article.json",
                    "assets/js/blog-posts.js",
                ],
            )

            self.assertEqual(selected, [manifest.resolve()])


if __name__ == "__main__":
    unittest.main()

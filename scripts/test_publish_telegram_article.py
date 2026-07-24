import json
import tempfile
import unittest
from pathlib import Path

from scripts import publish_telegram_article as publisher


class TelegramArticlePublisherTests(unittest.TestCase):
    def test_markdown_to_telegram_html(self) -> None:
        markdown = (
            "# Заголовок\n\n"
            "Текст с **жирным**, *курсивом* и `кодом`.\n\n"
            "- Первый пункт\n"
            "> Короткая цитата\n"
        )
        rendered = publisher.markdown_to_telegram_html(markdown)
        self.assertIn("<b>Заголовок</b>", rendered)
        self.assertIn("<b>жирным</b>", rendered)
        self.assertIn("<i>курсивом</i>", rendered)
        self.assertIn("<code>кодом</code>", rendered)
        self.assertIn("• Первый пункт", rendered)
        self.assertIn("<blockquote>Короткая цитата</blockquote>", rendered)

    def test_resolve_dedicated_telegram_source(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            content = root / "blog" / "content"
            content.mkdir(parents=True)
            source = content / "sample.tg-RU.md"
            source.write_text("# Telegram", encoding="utf-8")
            self.assertEqual(
                publisher.resolve_telegram_path(root, "sample"),
                source,
            )

    def test_load_article_uses_photo_caption_for_short_edition(self) -> None:
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
                "![Cover](assets/cover.png)\n\nПолная статья.",
                encoding="utf-8",
            )
            (content / "sample.tg-RU.md").write_text(
                "# Telegram-версия\n\nКороткий самостоятельный текст.",
                encoding="utf-8",
            )
            (assets / "cover.png").write_bytes(b"\x89PNG\r\n\x1a\n")

            article = publisher.load_article(
                root,
                content / "sample.article.json",
                "https://example.test",
            )

            self.assertEqual(article.presentation, "photo-caption")
            self.assertEqual(article.telegram_path, content / "sample.tg-RU.md")
            self.assertIn("<b>Telegram-версия</b>", article.message_html)


if __name__ == "__main__":
    unittest.main()

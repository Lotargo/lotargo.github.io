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

    def test_load_article_defaults_to_link_preview(self) -> None:
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

            self.assertEqual(article.presentation, "link-preview")
            self.assertIsNone(article.cover_path)
            self.assertEqual(article.telegram_path, content / "sample.tg-RU.md")

    def test_inline_distribution_can_enable_photo_caption(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            content = root / "blog" / "content"
            assets = root / "blog" / "assets" / "sample"
            content.mkdir(parents=True)
            assets.mkdir(parents=True)

            manifest = {
                "slug": "sample",
                "date": "2026-07-24",
                "distribution": {
                    "telegram": {
                        "ru": {
                            "presentation": "photo-caption",
                            "cover": "auto",
                        }
                    }
                },
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
            self.assertEqual(article.cover_path, assets / "cover.png")

    def test_publication_action_updates_changed_posts(self) -> None:
        article = publisher.TelegramArticle(
            slug="sample",
            date="2026-07-24",
            title="Заголовок",
            description="Описание",
            article_url="https://example.test/sample",
            manifest_path=Path("sample.article.json"),
            markdown_path=None,
            cover_path=None,
            telegram_path=Path("sample.tg-RU.md"),
            presentation="link-preview",
            message_html="<b>Текст</b>",
            visible_characters=5,
            source_hash="sha256:new",
        )

        self.assertEqual(
            publisher.publication_action(None, article, False),
            "publish",
        )
        self.assertEqual(
            publisher.publication_action(
                {"source_hash": "sha256:new", "presentation": "link-preview"},
                article,
                False,
            ),
            "skip",
        )
        self.assertEqual(
            publisher.publication_action(
                {"source_hash": "sha256:old", "presentation": "link-preview"},
                article,
                False,
            ),
            "edit",
        )
        self.assertEqual(
            publisher.publication_action(
                {"source_hash": "sha256:old", "presentation": "photo-caption"},
                article,
                False,
            ),
            "replace",
        )
        self.assertEqual(
            publisher.publication_action(
                {"source_hash": "sha256:new", "presentation": "link-preview"},
                article,
                True,
            ),
            "replace",
        )

    def test_explicit_cover_in_text_post_uses_one_image_preview(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            content = root / "blog" / "content"
            assets = root / "blog" / "assets" / "sample"
            content.mkdir(parents=True)
            assets.mkdir(parents=True)
            cover = assets / "cover image.png"
            cover.write_bytes(b"\x89PNG\r\n\x1a\n")
            manifest = {
                "slug": "sample",
                "date": "2026-10-29",
                "distribution": {
                    "telegram": {
                        "ru": {
                            "presentation": "link-preview",
                            "cover": "assets/cover image.png",
                        }
                    }
                },
                "post": {
                    "title": {"ru": "Заголовок"},
                    "description": {"ru": "Описание"},
                },
            }
            manifest_path = content / "sample.article.json"
            manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
            (content / "sample.ru.md").write_text("Полная статья.", encoding="utf-8")
            (content / "sample.tg-RU.md").write_text("Текст. " * 200, encoding="utf-8")

            article = publisher.load_article(root, manifest_path, "https://example.test/base")
            payload = publisher.text_payload("@example", article)

            self.assertEqual(article.cover_path, cover.resolve())
            self.assertGreater(article.visible_characters, publisher.PROJECT_CAPTION_LIMIT)
            self.assertEqual(payload["text"], article.message_html)
            self.assertEqual(
                payload["link_preview_options"]["url"],
                "https://example.test/base/blog/assets/sample/cover%20image.png",
            )
            self.assertTrue(payload["link_preview_options"]["show_above_text"])
            self.assertEqual(
                payload["reply_markup"]["inline_keyboard"][0][0]["url"],
                article.article_url,
            )
            self.assertNotIn("media", payload)

    def test_text_post_without_explicit_cover_keeps_article_preview(self) -> None:
        article = publisher.TelegramArticle(
            slug="sample",
            date="2026-10-29",
            title="Title",
            description="Description",
            article_url="https://example.test/blog/posts/sample.html",
            manifest_path=Path("sample.article.json"),
            markdown_path=None,
            cover_path=None,
            telegram_path=None,
            presentation="link-preview",
            message_html="Text",
            visible_characters=4,
            source_hash="sha256:test",
        )
        payload = publisher.text_payload("@example", article)
        self.assertEqual(payload["link_preview_options"]["url"], article.article_url)
        self.assertFalse(payload["link_preview_options"]["show_above_text"])

    def test_changed_assets_and_sources_select_manifest(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            content = root / "blog" / "content"
            assets = root / "blog" / "assets" / "sample"
            content.mkdir(parents=True)
            assets.mkdir(parents=True)
            manifest = content / "sample.article.json"
            manifest.write_text("{}", encoding="utf-8")

            selected = publisher.select_manifests_from_changed_files(
                root,
                [
                    "blog/content/sample.tg-RU.md",
                    "blog/content/sample.distribution.json",
                    "blog/assets/sample/cover.png",
                ],
            )

            self.assertEqual(selected, [manifest.resolve()])


if __name__ == "__main__":
    unittest.main()

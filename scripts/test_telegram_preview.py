import json
import tempfile
import unittest
from pathlib import Path

from scripts import telegram_preview as preview


class TelegramPreviewTests(unittest.TestCase):
    def make_bundle(
        self,
        root: Path,
        text: str,
        presentation: str = "photo-caption",
        with_cover: bool = True,
    ) -> Path:
        source = root / "content" / "telegram" / "ru.md"
        source.parent.mkdir(parents=True)
        source.write_text(text, encoding="utf-8")

        article_source = root / "content" / "ru.md"
        if with_cover:
            assets = root / "assets"
            assets.mkdir(parents=True)
            (assets / "cover.png").write_bytes(b"\x89PNG\r\n\x1a\n")
            article_source.write_text(
                "![Cover](assets/cover.png)\n\nПолная статья.",
                encoding="utf-8",
            )
        else:
            article_source.write_text(
                "Полная статья без изображения.",
                encoding="utf-8",
            )

        (root / "distribution.json").write_text(
            json.dumps(
                {
                    "format_version": 1,
                    "telegram": {
                        "ru": {
                            "enabled": True,
                            "source": "content/telegram/ru.md",
                            "presentation": presentation,
                            "cover": "auto",
                        }
                    },
                },
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )
        return source

    def test_markdown_length_counts_visible_text(self) -> None:
        text = (
            "# Заголовок\n\n"
            "**Жирный** [текст](https://example.test) ![img](a.png)"
        )
        self.assertEqual(
            preview.markdown_to_visible_text(text),
            "Заголовок\n\nЖирный текст",
        )

    def test_valid_photo_caption_with_cover(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.make_bundle(root, "# Заголовок\n\nКороткий текст.")
            editions = preview.validate_bundle_telegram_editions(root)
            self.assertEqual(len(editions), 1)
            self.assertEqual(editions[0].presentation, "photo-caption")

    def test_new_link_preview_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.make_bundle(
                root,
                "# Заголовок\n\nКороткий текст.",
                presentation="link-preview",
            )
            with self.assertRaises(preview.TelegramPreviewError) as caught:
                preview.validate_bundle_telegram_editions(root)
            self.assertIn("must be 'photo-caption'", str(caught.exception))

    def test_missing_cover_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.make_bundle(
                root,
                "# Заголовок\n\nКороткий текст.",
                with_cover=False,
            )
            with self.assertRaises(preview.TelegramPreviewError) as caught:
                preview.validate_bundle_telegram_editions(root)
            self.assertIn(
                "requires at least one attached image",
                str(caught.exception),
            )

    def test_photo_caption_uses_stricter_limit(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.make_bundle(root, "x" * 901)
            with self.assertRaises(preview.TelegramPreviewError) as caught:
                preview.validate_bundle_telegram_editions(root)
            self.assertIn(
                "project limit for 'photo-caption' is 900",
                str(caught.exception),
            )

    def test_enabled_source_must_exist(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "distribution.json").write_text(
                json.dumps(
                    {
                        "format_version": 1,
                        "telegram": {
                            "ru": {
                                "enabled": True,
                                "source": "content/telegram/ru.md",
                                "presentation": "photo-caption",
                                "cover": "auto",
                            }
                        },
                    }
                ),
                encoding="utf-8",
            )
            with self.assertRaises(preview.TelegramPreviewError) as caught:
                preview.validate_bundle_telegram_editions(root)
            self.assertIn(
                "missing its Markdown source",
                str(caught.exception),
            )

    def test_legacy_telegram_file_keeps_legacy_validation(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source = root / "content" / "telegram" / "ru.md"
            source.parent.mkdir(parents=True)
            source.write_text("Legacy text", encoding="utf-8")
            editions = preview.validate_bundle_telegram_editions(root)
            self.assertEqual(len(editions), 1)
            self.assertEqual(editions[0].presentation, "link-preview")


if __name__ == "__main__":
    unittest.main()

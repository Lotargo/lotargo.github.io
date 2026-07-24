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
        presentation: str = "link-preview",
    ) -> Path:
        source = root / "content" / "telegram" / "ru.md"
        source.parent.mkdir(parents=True)
        source.write_text(text, encoding="utf-8")
        (root / "distribution.json").write_text(
            json.dumps(
                {
                    "format_version": 1,
                    "telegram": {
                        "ru": {
                            "enabled": True,
                            "source": "content/telegram/ru.md",
                            "presentation": presentation,
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

    def test_valid_link_preview(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.make_bundle(root, "# Заголовок\n\nКороткий текст.")
            editions = preview.validate_bundle_telegram_editions(root)
            self.assertEqual(len(editions), 1)
            self.assertLess(
                editions[0].rendered_characters,
                preview.PROJECT_TEXT_LIMIT,
            )

    def test_over_project_limit_has_actionable_error(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.make_bundle(
                root,
                "я" * (preview.PROJECT_TEXT_LIMIT + 17),
            )
            with self.assertRaises(preview.TelegramPreviewError) as caught:
                preview.validate_bundle_telegram_editions(root)

            message = str(caught.exception)
            self.assertIn("3617 characters", message)
            self.assertIn("Shorten it by at least 17 characters", message)
            self.assertIn("nothing was published", message)

            annotation = caught.exception.github_annotation()
            self.assertIn("::error", annotation)
            self.assertIn("content/telegram/ru.md", annotation)

    def test_photo_caption_uses_stricter_limit(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.make_bundle(
                root,
                "x" * 901,
                presentation="photo-caption",
            )
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


if __name__ == "__main__":
    unittest.main()

import json
import tempfile
import unittest
from pathlib import Path

from scripts.editorial_rules import EditorialRuleError, validate_bundle_editorial_rules


class EditorialRuleTests(unittest.TestCase):
    def make_bundle(self, root: Path) -> Path:
        bundle = root / "article"
        (bundle / "content" / "telegram").mkdir(parents=True)
        (bundle / "content" / "ru.md").write_text(
            "# Заголовок\n\nКороткий абзац.",
            encoding="utf-8",
        )
        (bundle / "content" / "en.md").write_text(
            "# Title\n\nShort paragraph.",
            encoding="utf-8",
        )
        (bundle / "content" / "telegram" / "ru.md").write_text(
            "Короткая Telegram статья.",
            encoding="utf-8",
        )
        (bundle / "article.json").write_text(
            json.dumps(
                {
                    "post": {
                        "title": {"ru": "Заголовок", "en": "Title"},
                        "description": {"ru": "Описание", "en": "Description"},
                    }
                },
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )
        return bundle

    def test_clean_publication_passes(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            bundle = self.make_bundle(Path(temporary))
            validate_bundle_editorial_rules(bundle)

    def test_em_dash_in_markdown_is_rejected_with_path_and_line(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            bundle = self.make_bundle(Path(temporary))
            (bundle / "content" / "ru.md").write_text(
                "# Заголовок\n\nТекст\u2014с длинным тире.",
                encoding="utf-8",
            )
            with self.assertRaises(EditorialRuleError) as caught:
                validate_bundle_editorial_rules(bundle)

            self.assertEqual(caught.exception.logical_path, "content/ru.md")
            self.assertEqual(caught.exception.line, 3)
            self.assertIn("U+2014", str(caught.exception))
            self.assertIn("::error", caught.exception.github_annotation())

    def test_em_dash_in_public_metadata_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            bundle = self.make_bundle(Path(temporary))
            manifest_path = bundle / "article.json"
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
            manifest["post"]["description"]["ru"] = "Описание\u2014продолжение"
            manifest_path.write_text(
                json.dumps(manifest, ensure_ascii=False),
                encoding="utf-8",
            )

            with self.assertRaises(EditorialRuleError) as caught:
                validate_bundle_editorial_rules(bundle)

            self.assertEqual(caught.exception.logical_path, "article.json")
            self.assertIn("post.description.ru", str(caught.exception))


if __name__ == "__main__":
    unittest.main()

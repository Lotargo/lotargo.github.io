from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from scripts.article_bundle import (
    archive_directory,
    install_bundle,
    load_manifest,
    open_bundle,
)


ARTICLE_HTML = """<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Test</title></head>
<body>
  <main><article class="post-article"><h1>Test</h1></article></main>
  <script src="../../assets/js/main.js"></script>
  <script src="../../assets/js/blog-post.js"></script>
</body>
</html>
"""


class ArticleBundleTests(unittest.TestCase):
    def create_bundle(self, root: Path) -> Path:
        bundle = root / "test-article"
        (bundle / "content").mkdir(parents=True)
        (bundle / "assets").mkdir()
        (bundle / "article.html").write_text(ARTICLE_HTML, encoding="utf-8")
        (bundle / "content" / "ru.md").write_text("# Тест\n", encoding="utf-8")
        (bundle / "content" / "en.md").write_text("# Test\n", encoding="utf-8")
        (bundle / "assets" / "cover.webp").write_bytes(b"RIFF-test-webp")
        (bundle / "article.json").write_text(
            json.dumps(
                {
                    "format_version": 1,
                    "slug": "test-article",
                    "date": "2026-07-15",
                    "html": "article.html",
                    "sources": {
                        "ru": "content/ru.md",
                        "en": "content/en.md",
                    },
                    "assets": "assets",
                    "post": {
                        "type": {"ru": "Тест", "en": "Test"},
                        "title": {"ru": "Тестовая статья", "en": "Test article"},
                        "shortTitle": {"ru": "Тест", "en": "Test"},
                        "description": {"ru": "Описание", "en": "Description"},
                        "notify": True,
                    },
                },
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )
        return bundle

    def create_repository(self, root: Path) -> Path:
        repository = root / "repository"
        (repository / "blog" / "posts").mkdir(parents=True)
        (repository / "blog" / "content").mkdir()
        (repository / "blog" / "assets").mkdir()
        (repository / "assets" / "js").mkdir(parents=True)
        (repository / "assets" / "js" / "blog-posts.js").write_text(
            "window.BLOG_POSTS = [\n];\n\nwindow.BLOG_SITE_NOTIFICATIONS = [];\n",
            encoding="utf-8",
        )
        return repository

    def test_validate_and_install_expanded_bundle(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            bundle = self.create_bundle(root)
            repository = self.create_repository(root)
            manifest = load_manifest(bundle)
            install_bundle(manifest, repository)

            self.assertTrue((repository / "blog/posts/test-article.html").is_file())
            self.assertTrue((repository / "blog/content/test-article.ru.md").is_file())
            self.assertTrue((repository / "blog/content/test-article.en.md").is_file())
            self.assertTrue((repository / "blog/content/test-article.article.json").is_file())
            self.assertTrue((repository / "blog/assets/test-article/cover.webp").is_file())
            blog_posts = (repository / "assets/js/blog-posts.js").read_text(encoding="utf-8")
            self.assertIn('"slug": "test-article"', blog_posts)
            self.assertIn('"notify": true', blog_posts)

    def test_install_updates_existing_slug_without_duplicate_entry(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            bundle = self.create_bundle(root)
            repository = self.create_repository(root)
            manifest = load_manifest(bundle)

            install_bundle(manifest, repository)
            install_bundle(manifest, repository)

            blog_posts = (repository / "assets/js/blog-posts.js").read_text(encoding="utf-8")
            self.assertEqual(blog_posts.count('"slug": "test-article"'), 1)

    def test_zip_transport(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            bundle = self.create_bundle(root)
            archive = root / "bundle.zip"
            archive.write_bytes(archive_directory(bundle, "zip"))
            with open_bundle(archive) as extracted:
                self.assertEqual(load_manifest(extracted).slug, "test-article")

    def test_tar_gz_transport(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            bundle = self.create_bundle(root)
            archive = root / "bundle.tar.gz"
            archive.write_bytes(archive_directory(bundle, "tar.gz"))
            with open_bundle(archive) as extracted:
                self.assertEqual(load_manifest(extracted).slug, "test-article")

    def test_base64_transport(self) -> None:
        import base64

        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            bundle = self.create_bundle(root)
            archive_data = archive_directory(bundle, "zip")
            transport = root / "bundle.b64"
            transport.write_bytes(base64.b64encode(archive_data))
            with open_bundle(transport) as extracted:
                self.assertEqual(load_manifest(extracted).slug, "test-article")


if __name__ == "__main__":
    unittest.main()

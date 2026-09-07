import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILLS = (
    "editorial-style",
    "source-grounding",
    "write-blog-article",
    "prepare-telegram-edition",
    "review-publication",
)
NAME_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---\n"):
        raise AssertionError("SKILL.md must start with YAML frontmatter")
    end = text.find("\n---\n", 4)
    if end < 0:
        raise AssertionError("SKILL.md frontmatter is not closed")
    data: dict[str, str] = {}
    for raw in text[4:end].splitlines():
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        key, separator, value = raw.partition(":")
        if not separator:
            continue
        data[key.strip()] = value.strip()
    return data


class AgentSkillTests(unittest.TestCase):
    def test_canonical_skills_follow_portable_shape(self) -> None:
        for name in SKILLS:
            with self.subTest(skill=name):
                path = ROOT / ".agents" / "skills" / name / "SKILL.md"
                self.assertTrue(path.is_file(), path)
                text = path.read_text(encoding="utf-8")
                metadata = parse_frontmatter(text)

                self.assertEqual(metadata.get("name"), name)
                self.assertRegex(name, NAME_RE)
                description = metadata.get("description", "")
                self.assertTrue(description)
                self.assertLessEqual(len(description), 1024)
                self.assertLessEqual(
                    len(text.splitlines()),
                    500,
                    f"{name} should stay focused; move detail into references/supporting files",
                )

    def test_claude_mirrors_match_canonical_skills(self) -> None:
        for name in SKILLS:
            with self.subTest(skill=name):
                canonical = (
                    ROOT / ".agents" / "skills" / name / "SKILL.md"
                ).read_text(encoding="utf-8")
                claude = (
                    ROOT / ".claude" / "skills" / name / "SKILL.md"
                ).read_text(encoding="utf-8")
                self.assertEqual(canonical, claude)

    def test_claude_imports_repo_rules(self) -> None:
        agents = ROOT / "AGENTS.md"
        claude = ROOT / "CLAUDE.md"
        self.assertTrue(agents.is_file())
        self.assertTrue(claude.is_file())
        self.assertIn("@AGENTS.md", claude.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()

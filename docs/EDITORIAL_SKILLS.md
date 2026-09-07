# Editorial Skills Architecture

The publication workflow uses several small skills instead of one large writing prompt.

This follows the progressive-disclosure model used by current agent skill systems: the host initially sees a skill name and description, then loads the full instructions only when the skill is relevant.

## Why the rules are split

The canonical skills are:

```text
editorial-style
source-grounding
write-blog-article
prepare-telegram-edition
prepare-article-images
review-publication
```

Each skill has one primary job.

`write-blog-article` orchestrates article composition but does not duplicate the full style or sourcing policy.

`prepare-telegram-edition` owns Telegram-specific composition, length, and image rules.

`editorial-style` owns readability, voice, and punctuation.

`source-grounding` owns verification, attribution, and links.

This keeps skill descriptions precise, reduces unnecessary context, and makes the same rules reusable by different publication workflows.

## Agent-skill authoring basis

The design follows current official guidance:

- [OpenAI: Build skills](https://developers.openai.com/codex/skills/) recommends progressive disclosure, concise trigger descriptions, one focused job per skill, imperative inputs/outputs, and instruction-first skills unless deterministic scripts are needed.
- [Claude Code: Extend Claude with skills](https://code.claude.com/docs/en/slash-commands) recommends concise skill bodies and supporting files for detailed material, because invoked skill content remains in context.
- [OpenCode: Agent Skills](https://opencode.ai/docs/skills/) discovers repo-local `.agents/skills/<name>/SKILL.md` and loads skill bodies on demand.
- [Claude Code: project memory](https://code.claude.com/docs/en/memory) recommends keeping always-on project instructions concise and importing `AGENTS.md` through `CLAUDE.md` when a repository supports multiple coding agents.

## Editorial practice basis

The style layer adapts:

- [Google developer documentation style guide](https://developers.google.com/style/)
- [Google: accessible documentation](https://developers.google.com/style/accessibility)
- [Google: paragraph structure](https://developers.google.com/style/paragraph-structure)
- [Microsoft: scannable content](https://learn.microsoft.com/en-us/style-guide/scannable-content/)

The sourcing layer adapts:

- [Associated Press: News Values and Principles](https://www.ap.org/about/news-values-and-principles/news-values-introduction/)
- [Associated Press: Telling the Story](https://www.ap.org/about/news-values-and-principles/telling-the-story/)
- [Reuters Journalistic Standards](https://reutersagency.com/about/standards-values/)

These are used as practical foundations, not copied as a newsroom policy. Project-specific publishing rules take precedence.

## Always-on house rules

The root `AGENTS.md` contains only repository-wide rules that should apply to every public publication:

- no U+2014 em dash;
- no invented sources or links;
- external/disputable factual claims require real source links;
- Telegram editions are short self-contained articles and require an attached image.

Claude Code imports the same file through `CLAUDE.md` so the rules are not duplicated.

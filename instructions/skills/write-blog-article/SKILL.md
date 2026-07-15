---
name: write-blog-article
description: Draft, structure, translate, and revise Markdown-first technical or project-development articles for the Lotargo portfolio blog.
---

# Write A Blog Article

Use this skill for the semantic content of a publication. Do not begin with HTML styling. Begin with the idea, evidence, structure, and reader experience.

## Voice

Write in a direct first-person voice when the article describes personal development work, experiments, architectural decisions, or lessons learned.

The text should sound like a thoughtful practitioner, not a press release and not a corporate landing page.

Prefer:

- concrete decisions;
- honest current status;
- reasons behind architectural choices;
- limitations and unresolved questions;
- practical examples;
- what will be tested next.

Avoid:

- inflated claims;
- generic AI enthusiasm;
- excessive marketing language;
- repeated summaries of the same point;
- fake certainty about unfinished work;
- long defensive disclaimers;
- references to private source code unless public access was approved.

## Recommended Structure

```text
H1 title in the source, optional but useful for readability
lead paragraph
problem or motivation
central idea
first supporting illustration
architecture or implementation direction
additional illustrations near the relevant text
trade-offs and alternatives
current status
next steps
publication plan or conclusion
```

The title and lead must appear before any major image. The generated page uses the canonical title from `article.json`; the renderer removes the first Markdown H1 to avoid duplication.

## Markdown Contract

Use H2 headings for major sections. A source H1 is allowed but not required.

```md
# Full source title

Opening paragraph that explains why the article exists.

## First major section

Normal paragraphs.

> One central thesis, used sparingly.

![Concise alt text](assets/image.avif "Visible image caption")
```

Use `assets/<filename>` inside an Article Bundle. The renderer rewrites that path to the installed `blog/assets/<slug>/` location.

The first normal paragraph automatically becomes the visual lead. Use lists only where enumeration genuinely helps the reader.

Supported elements include:

- paragraphs and headings;
- emphasis and links;
- ordered and unordered lists;
- blockquotes;
- tables;
- fenced code blocks;
- footnotes;
- standalone images.

Do not write raw HTML for layout. The site template and renderer own presentation.

## Images Inside The Narrative

Images must support the section that discusses them. Do not place a large gallery before the title or make visual assets look detached from the article.

One standalone image becomes an editorial figure. Consecutive standalone images become a responsive gallery and fullscreen lightbox group.

A small note such as the following is enough when generated concepts need attribution:

```text
Иллюстрации ниже — ранние визуальные концепты, сгенерированные специально для этого проекта.
```

Do not frame it as a warning or legal defense.

## Bilingual Articles

Russian and English versions must express the same claims, but they do not need to be word-for-word translations.

Check:

- headings correspond;
- technical terms remain consistent;
- links and image order match;
- neither language contains extra claims absent from the other;
- titles are natural in each language;
- English does not read like literal machine translation.

The default renderer requires:

```text
content/en.md
content/ru.md
```

## Technical Accuracy

Distinguish clearly between:

- implemented behavior;
- prepared documentation;
- prototype plans;
- architectural hypotheses;
- long-term product ideas.

Use phrases such as “планируется”, “будет проверено”, and “рассматривается” where implementation does not exist yet.

## Public/Private Boundary

A public article may describe:

- product ideas;
- architecture at a useful conceptual level;
- screenshots and generated concepts;
- benchmark results approved for release;
- development decisions and failed approaches.

Do not publish:

- private repository links;
- API keys, tokens, or environment data;
- unpublished proprietary source code;
- personal data;
- vendor credentials;
- internal prompts or datasets not approved for publication.

## Completion Criteria

Before rendering, Markdown should already be coherent as plain text. Styling should improve the article, not rescue an unclear draft.

Then run:

```bash
python scripts/publish_article.py render ./path/to/bundle
python scripts/publish_article.py validate ./path/to/bundle
```

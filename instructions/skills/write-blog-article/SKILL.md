---
name: write-blog-article
description: Draft, structure, translate, and revise technical or project-development articles for the Lotargo portfolio blog.
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
H1 title
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

The title and lead must appear before any major image.

## Markdown Contract

Use one H1 and H2 headings for major sections.

```md
# Full article title

Opening paragraph that explains why the article exists.

## First major section

Normal paragraphs.

> One central thesis, used sparingly.

![Concise alt text](../assets/<slug>/image.avif)
```

Use lists only where the reader benefits from enumeration. Do not convert every paragraph into bullets.

## Images Inside The Narrative

Images must support the section that discusses them. Do not place a large gallery before the title or make visual assets look detached from the article.

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

Before rendering HTML, the Markdown should already be coherent when read as plain text. Styling should improve the article, not rescue an unclear draft.

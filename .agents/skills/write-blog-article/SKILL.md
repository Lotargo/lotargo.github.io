---
name: write-blog-article
description: Draft, structure, translate, and revise a Markdown-first technical or project-development article for the Lotargo portfolio blog. Use for the semantic article text, not HTML layout or publication transport.
---

# Write A Blog Article

This skill orchestrates article composition. Apply `editorial-style` for prose and `source-grounding` for research, factual claims, attribution, and links.

## Workflow

1. Establish the article's main question, result, or development story.
2. Gather the evidence needed for external factual claims.
3. Separate implemented behavior, current experiments, plans, hypotheses, and long-term ideas.
4. Draft the Russian article around one coherent narrative.
5. Place images after the text that introduces or explains them.
6. Adapt the English edition to the same substantive claims without literal translation.
7. Run a source audit.
8. Run an editorial pass.
9. Render and validate only after the Markdown works as plain text.

## Recommended article shape

Use this as a default, not a mandatory template:

```text
lead
problem or motivation
central idea
architecture or implementation
evidence / examples / visuals
trade-offs and alternatives
current status
what comes next
conclusion
```

Use H2 headings for major sections. The canonical page title comes from `article.json`.

## Technical accuracy

Make implementation state explicit.

Prefer wording equivalent to:

- implemented;
- tested;
- prototype;
- planned;
- being evaluated;
- hypothesis;
- future direction.

Do not describe plans as completed features.

## Public/private boundary

Do not publish:

- private repository links;
- credentials or environment data;
- proprietary source code not approved for release;
- personal data;
- internal prompts or datasets not approved for publication.

## Bilingual contract

Both editions must preserve:

- the same substantive claims;
- the same implementation status;
- equivalent source links;
- consistent terminology;
- the same visual order where the visuals support the same argument.

## Completion

Before rendering, apply:

- `editorial-style`;
- `source-grounding`;
- `prepare-article-images` when visual assets are present.

Then use the publishing engine or the existing CLI to render and validate.

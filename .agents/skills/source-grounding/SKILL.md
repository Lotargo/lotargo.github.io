---
name: source-grounding
description: Research, verify, attribute, and link factual claims for Lotargo blog and Telegram publications. Use whenever text relies on external facts, documentation, releases, benchmarks, quotes, or third-party claims.
---

# Source Grounding

Use this skill for factual support. Use `editorial-style` separately for prose style.

## Non-negotiable rules

- Never invent a source, URL, citation, author, publication, quote, release, version, statistic, benchmark, or date.
- Never create a plausible-looking link from memory.
- Never publish a placeholder citation as if it were real.
- If reliable support cannot be found, remove the claim or clearly state that it is unverified.

## What needs a link

Provide a real source link near the first relevant claim when the text relies on:

- external technical documentation;
- product behavior or limits;
- release notes or changelogs;
- laws, standards, specifications, or policies;
- statistics, benchmarks, prices, dates, or compatibility claims;
- third-party research, reporting, opinions, or quotations;
- any factual statement that could reasonably be disputed and was not established directly by the author's own work.

General first-person statements about the author's own design decisions do not require an external citation unless they also make an external factual claim.

## Source priority

Prefer sources in this order:

1. primary official documentation, specification, repository, release, paper, or first-party statement;
2. original data or direct source material;
3. high-quality secondary reporting or analysis when primary material is unavailable or context is needed.

Do not cite a search result snippet when the underlying page is available.

Do not link to a generic homepage if a specific page directly supports the claim.

## Linking

- Use descriptive Markdown link text.
- Put attribution close to the supported claim.
- Ensure the linked page actually supports the statement being made.
- For a long article, repeat attribution when the source relationship would otherwise become ambiguous.
- Preserve links in both language editions when the same claim appears in both.
- For Telegram, keep only the links needed to support the short edition's claims.

## Quotes and paraphrases

- Quote only text actually present in the source.
- Preserve the source's meaning and context.
- Prefer concise paraphrase when a quotation is unnecessary.
- Attribute quotations and externally derived material to the original source.

## Repository evidence

When discussing a public repository, prefer a direct link to the relevant repository, file, issue, release, commit, or documentation page.

When the evidence is private and cannot be linked publicly, do not fabricate public proof. Phrase it as the author's own project status or omit details that cannot be published.

## Final source audit

Before publication:

1. identify externally derived or disputable claims;
2. verify every associated URL opens the intended source;
3. confirm the source supports the exact claim;
4. remove dead, placeholder, generic, or invented links;
5. confirm quotes and numbers against the source;
6. if verification was not actually performed, do not claim that it was.

## Practice basis

These rules adapt established attribution and sourcing standards:

- [Associated Press: News Values and Principles](https://www.ap.org/about/news-values-and-principles/news-values-introduction/)
- [Associated Press: Telling the Story](https://www.ap.org/about/news-values-and-principles/telling-the-story/)
- [Reuters Journalistic Standards](https://reutersagency.com/about/standards-values/)
- [Google developer documentation: accessible links](https://developers.google.com/style/accessibility)
- [Microsoft Writing Style Guide: links and supporting information](https://learn.microsoft.com/en-us/style-guide/search-writing)

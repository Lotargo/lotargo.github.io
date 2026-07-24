# Static Blog to Telegram: Publishing Without a Backend

The blog already had a deterministic Article Bundle pipeline, so Telegram did not need a separate application server. It became another distribution adapter executed by GitHub Actions after an article is installed.

## The publishing path

The production flow now looks like this:

```text
Article Bundle
    ↓
Markdown renderer
    ↓
Static GitHub Pages files
    ↓
Telegram announcement
    ↓
Publication state and backlink
```

The Telegram publisher reads the installed article manifest and Russian Markdown source. It builds a compact announcement from the Russian title and description, then adds a button pointing to the canonical article page.

## Why this remains static-first

There is no always-on bot process, database server, admin panel, or queue worker. GitHub Actions provides the execution environment only when a publication event occurs.

The bot token stays in GitHub Secrets. The public channel identifier stays in an Actions variable. The repository itself stores only non-secret publication metadata.

## Duplicate protection

After Telegram accepts a post, the workflow records the message identifier, public post URL, article URL, and source hash in `telegram-publications.json`.

A normal retry sees the existing slug and skips it. This makes workflow restarts safe and prevents accidental duplicate announcements.

## Linking both directions

The Telegram message contains a button to the full article. Once the returned message identifier is saved, the article page can show a second link back to its Telegram publication and discussion thread.

That closes the distribution loop:

```text
Telegram announcement → full article → Telegram discussion
```

## The useful boundary

The first production version publishes a compact announcement rather than trying to reproduce every Markdown construct inside Telegram. This keeps the delivery path predictable while leaving room for later support for galleries, long-form splitting, and media groups.

The important part is already complete: one source article now feeds both the website and the Russian Telegram channel without introducing a second content system.

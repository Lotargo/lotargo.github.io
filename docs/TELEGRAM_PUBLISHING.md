# Telegram Blog Publishing

The repository publishes compact Russian-language article announcements to the public Telegram channel `@lotargo_blog`.

## Current production scope

The first production version publishes:

- the Russian article title;
- the Russian article description;
- the article date;
- an inline **Читать статью** button;
- the first supported Markdown image as a cover when it is a local PNG, JPEG, or WebP file.

SVG and AVIF images are skipped for now. When no supported cover is found, the publisher sends a text-only announcement.

The website remains the canonical source. Telegram receives an announcement rather than the full article.

## Required GitHub configuration

Repository secret:

```text
TELEGRAM_BOT_TOKEN
```

Repository variable:

```text
TELEGRAM_RU_CHAT_ID=@lotargo_blog
```

The bot must be a channel administrator with permission to publish messages. Edit and delete permissions are recommended.

## Automatic publishing

The workflow is:

```text
.github/workflows/publish-blog-to-telegram.yml
```

It runs when a file matching this pattern changes on `main`:

```text
blog/content/*.article.json
```

A newly installed Article Bundle therefore triggers Telegram publication after its generated site files have been committed.

The workflow uses the changed manifest list from the triggering commit. It does not scan and republish the entire historical blog.

## Publication state and duplicate protection

Successful publications are recorded in:

```text
blog/content/telegram-publications.json
```

Each record contains:

- Telegram channel ID and username;
- Telegram message ID;
- direct Telegram post URL;
- article URL;
- a source hash.

If a slug already exists in the state file, automatic publication skips it. This prevents an article edit or workflow retry from creating a second post under normal conditions.

The workflow commits the updated state file back to `main`.

## Manual dry run

Open:

```text
Actions -> Publish blog articles to Telegram -> Run workflow
```

Enter an existing article slug and leave `dry_run` enabled. The workflow will show the selected title, description, article URL, cover path, and rendered Telegram HTML without sending anything.

Equivalent local command:

```bash
python scripts/publish_telegram.py \
  --root . \
  --slug visual-novel-ai-game \
  --dry-run
```

## Manual publication

Run the same workflow with `dry_run` disabled.

By default, an already recorded slug is skipped. Enable `force` only when a deliberate second Telegram post is required. Forced publication sends a new post and replaces the stored state record for that slug.

## Smoke test and diagnostics

These workflows remain separate:

```text
Telegram integration check
Telegram channel smoke test
```

Use the integration check after changing the token, channel username, bot permissions, or linked discussion group.

Use the smoke test only to verify raw message delivery independently of Article Bundles.

## Current limitation

The article page does not yet display the Telegram post URL. The state file already stores that URL so the next interface phase can add:

- a Telegram channel button on the landing page;
- a subscription button on the blog page;
- a link from each article to its corresponding Telegram post.

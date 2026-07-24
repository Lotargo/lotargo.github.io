# Blog and Telegram Without a Separate Backend

Telegram is connected to the blog neither as a second CMS nor as an always-running service. It became another output of the existing Article Bundle pipeline: one topic is prepared once and then receives different editorial forms for the website and the channel.

## One source, two publishing forms

The website keeps complete Russian and English editions. They support large images, galleries, tables, code, responsive layout, and navigation between articles.

Telegram receives a separate edition. It is not an automatic cut from the first paragraphs, but an independent Markdown source adapted for reading inside a messenger.

> The Telegram edition should contain enough substance to be read without leaving the app, while the complete canonical version remains in the blog.

## The publication path

1. An Article Bundle contains the complete Russian and English article editions.
2. Optional `tg-RU` and `tg-EN` editions can be included for Telegram.
3. GitHub Actions validates the bundle structure, Markdown, Telegram text length, and required files.
4. The renderer creates the static HTML page and updates the blog index.
5. The Telegram publisher sends the prepared edition and adds a button to the complete article.
6. The returned `message_id` and public URL are stored in `telegram-publications.json`.
7. The article page gains a backlink to the Telegram publication and its discussion thread.

## Failure protection

The pipeline does not silently repair dangerous situations. A problem stops publication before deployment and before a Telegram message is sent.

The checks cover:

- the bot token and Telegram API access;
- the bot's channel membership and permissions to post, edit, and delete messages;
- the linked discussion group;
- Article Bundle validity and safe file paths;
- the recommended 3600-character limit for a text edition;
- the recommended 900-character limit for a photo caption;
- duplicate publication of an already recorded article slug.

When a Telegram edition is too long, GitHub Actions reports the language, rendered length, allowed limit, source path, and the exact number of characters that must be removed.

## Why the discussion group repeats the post

A linked Telegram group is not an independent comment feed. Every channel post is copied into the group automatically and becomes the root of its own discussion thread.

The duplication is therefore expected. The useful change is that the copied item is now a meaningful compact publication rather than a service-like notification.

## The boundary between both editions

The channel receives one standalone post with a cover or link preview, basic formatting, and one comment thread. The website keeps the complete canonical article.

This preserves a static-first architecture without a separate application server, while Telegram becomes a proper distribution channel instead of a second independent content-management system.

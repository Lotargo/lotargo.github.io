# Adding Blog Articles

This guide describes the current static publishing workflow for `lotargo.github.io`.

The site is static-first. There is no build step yet. Articles are still written as HTML pages, with optional Markdown/source copies in `blog/content/`. Automation is handled by a shared JavaScript manifest.

## Source of Truth

Article metadata lives in:

```text
assets/js/blog-posts.js
```

This manifest controls three things:

1. Blog index cards on `blog/index.html`.
2. Previous / Next navigation on every article page.
3. Landing-page notifications for posts with `notify: true`.

Do not manually add blog cards to `blog/index.html` and do not manually duplicate article notifications in `assets/js/notifications.js`.

## Folder Layout

```text
blog/posts/      Rendered article HTML files
blog/content/    Markdown/source copies for article content
blog/assets/     Article images, diagrams, hero banners
assets/js/       Shared manifests and rendering scripts
```

## Minimum Checklist

For a new article with slug `my-new-article`:

1. Create the rendered article page:

```text
blog/posts/my-new-article.html
```

2. Optional, but recommended: create source copies:

```text
blog/content/my-new-article.en.md
blog/content/my-new-article.ru.md
```

3. Add assets if needed:

```text
blog/assets/my-new-article.svg
blog/assets/my-new-article-mobile.svg
blog/assets/my-new-article-tablet.svg
```

4. Add one manifest entry in:

```text
assets/js/blog-posts.js
```

5. Preview locally:

```powershell
python -m http.server 4173
```

6. Check:

```text
http://127.0.0.1:4173/blog/
http://127.0.0.1:4173/blog/posts/my-new-article.html
```

7. Test language switching and Previous / Next navigation.

## Manifest Entry Template

Add new posts at the end of `window.BLOG_POSTS`. The array order is chronological: oldest first, newest last. This order is used for Previous / Next navigation.

```js
{
  slug: 'my-new-article',
  date: '2026-07-08',
  href: './my-new-article.html',
  url: './blog/posts/my-new-article.html',
  type: {
    en: 'Article category',
    ru: 'Категория статьи'
  },
  title: {
    en: 'Full English Article Title',
    ru: 'Полный русский заголовок статьи'
  },
  shortTitle: {
    en: 'Short title',
    ru: 'Короткий заголовок'
  },
  description: {
    en: 'Short English description for the blog index.',
    ru: 'Короткое русское описание для индекса блога.'
  },
  notificationTitle: {
    en: 'Optional notification title',
    ru: 'Опциональный заголовок уведомления'
  },
  notificationText: {
    en: 'Optional notification text.',
    ru: 'Опциональный текст уведомления.'
  },
  notify: true
}
```

## Field Rules

### `slug`

Must match the article HTML filename without `.html`.

```text
blog/posts/my-new-article.html -> slug: 'my-new-article'
```

### `href`

Path used from inside `blog/posts/` for Previous / Next navigation.

```js
href: './my-new-article.html'
```

### `url`

Path used from the landing page root for notifications.

```js
url: './blog/posts/my-new-article.html'
```

### `title`

Full title used on the blog index.

### `shortTitle`

Compact title used in Previous / Next navigation.

### `description`

Short summary used on the blog index.

### `notificationTitle` and `notificationText`

Optional. If omitted, notifications fall back to `shortTitle`, `title`, and `description`.

### `notify`

Use:

```js
notify: true
```

when the article should appear in the landing-page notification center.

Use:

```js
notify: false
```

for quiet archival posts.

## Article Page Requirements

Each article page should include the normal article scripts at the end:

```html
<script src="../../assets/js/main.js"></script>
<script src="../../assets/js/blog-post.js"></script>
```

`blog-post.js` loads `blog-posts.js` automatically and then normalizes Previous / Next navigation.

Each page should also keep a `post-pagination` element, even if the fallback links are stale. The JavaScript will replace it using the manifest.

```html
<nav class="post-pagination" aria-label="Post navigation" data-i18n-aria="post-pagination-aria">
  <span class="post-page-link is-disabled" aria-disabled="true">
    <span data-i18n="post-prev">Previous</span>
    <strong data-i18n="post-prev-none">No earlier post</strong>
  </span>
  <span class="post-page-link is-disabled" aria-disabled="true">
    <span data-i18n="post-next">Next</span>
    <strong data-i18n="post-next-none">No later post</strong>
  </span>
</nav>
```

## Responsive Hero Assets

For articles with hero banners, prefer a desktop/tablet/mobile split:

```html
<picture>
  <source media="(max-width: 640px)" srcset="../assets/article-mobile.svg" />
  <source media="(max-width: 1024px)" srcset="../assets/article-tablet.svg" />
  <img src="../assets/article.svg" alt="Article hero diagram" />
</picture>
```

Keep text inside SVGs large enough for mobile. Avoid tiny labels in the desktop asset if it will be reused on narrow screens.

## Current Automation Boundary

Automated now:

- blog index cards;
- Previous / Next navigation;
- article notifications.

Still manual for now:

- converting Markdown to HTML;
- generating the article HTML file;
- generating responsive hero assets;
- RSS/sitemap updates.

The next layer can be a real build script that reads Markdown frontmatter and generates HTML, the manifest, RSS, and sitemap automatically.

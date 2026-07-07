# Lotargo GitHub Profile Landing

This repository contains the static GitHub Pages landing page for Lotargo.

Published site:

```text
https://lotargo.github.io
```

The repository is intentionally static-first: plain HTML, CSS, and JavaScript served directly by GitHub Pages. There is no backend, package install, build step, or deployment script required for the current version.

## What This Repo Contains

```text
index.html                       Main portfolio landing page
blog/index.html                  Blog index page
blog/posts/                      Rendered static HTML articles
blog/content/                    Markdown/source copies for articles
blog/assets/                     Blog-specific images and SVG banners
assets/css/styles.css            Main visual system
assets/css/render-fixes.css      Rendering compatibility fixes
assets/js/main.js                Theme, language, notifications, project cards
assets/js/projects.js            Project card manifest
assets/js/blog-posts.js          Shared blog metadata manifest
assets/js/blog-index.js          Blog index renderer
assets/js/blog-post.js           Blog post helpers and prev/next navigation
assets/js/notifications.js       Notification builder from the blog manifest
assets/img/                      Landing/project images
docs/ADDING_BLOG_ARTICLES.md     Current blog publishing checklist
docs/BLOG_AUTOMATION_ROADMAP.md  Planned typing, validation, and CLI roadmap
PROFILE_README_SNIPPET.md        Snippet for the GitHub profile README
v0_PROMPT.md                     Historical reference prompt
```

## Blog Automation

The blog now uses `assets/js/blog-posts.js` as the first single source of truth for static article metadata.

That manifest drives:

- the blog index cards;
- `Previous / Next` navigation on article pages;
- landing-page notifications for posts with `notify: true`.

When adding a new article, do not manually edit:

```text
assets/js/notifications.js
assets/js/blog-post.js
blog/index.html post cards
```

Instead, add one entry to:

```text
assets/js/blog-posts.js
```

Current publishing checklist:

```text
docs/ADDING_BLOG_ARTICLES.md
```

Roadmap for typing, validation, CLI helpers, static data, RSS, sitemap, and future generation:

```text
docs/BLOG_AUTOMATION_ROADMAP.md
```

## Editing Project Cards

Project card data lives in:

```text
assets/js/projects.js
```

Each project entry can define:

```js
title
category
status
description
proof
stack
image
landingUrl
repoUrl
demoUrl
docsUrl
```

Images are stored in:

```text
assets/img/
```

Use relative image paths from the site root:

```js
image: "./assets/img/project-name.png"
```

## Local Preview And Testing

You can open `index.html` directly in a browser, but a local static server is better for checking paths, assets, browser behavior, and GitHub Pages-like loading.

### Python

From the repository root:

```powershell
python -m http.server 4173
```

If Windows uses the Python launcher:

```powershell
py -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173
```

Useful pages to check:

```text
http://127.0.0.1:4173/
http://127.0.0.1:4173/blog/
http://127.0.0.1:4173/blog/posts/<slug>.html
```

### Node.js

Using `npx`:

```powershell
npx --yes http-server . -p 4173 -c-1
```

Then open:

```text
http://127.0.0.1:4173
```

The `-c-1` flag disables caching, which is useful when checking CSS, JavaScript, and image changes.

## Deployment Through GitHub Pages

1. Go to repository Settings -> Pages.
2. Select `Deploy from a branch`.
3. Select `main` and `/ root`.
4. Save.
5. Open `https://lotargo.github.io` after the first build finishes.

## Profile README Button

`PROFILE_README_SNIPPET.md` contains the small badge/snippet intended for the `Lotargo/Lotargo` profile README. It points profile visitors to this landing page.

## Future Migration Note

`v0_PROMPT.md` is kept only as a reference in case this static page is ever rebuilt as a Next.js/Vercel project. The current site does not depend on it.

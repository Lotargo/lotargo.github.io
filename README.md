# Lotargo Profile Landing

Static brutalist portfolio landing for GitHub Pages.

Public URL after GitHub Pages is enabled:

```text
https://lotargo.github.io
```

## Files

```text
index.html
assets/css/styles.css
assets/js/projects.js
assets/js/main.js
PROFILE_README_SNIPPET.md
v0_PROMPT.md
```

## How to edit projects

Open:

```text
assets/js/projects.js
```

For every project you can edit:

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

To add screenshots later, put images into:

```text
assets/img/
```

Then set:

```js
image: "./assets/img/project-name.png"
```

The card will automatically use the monochrome-to-color hover reveal.

## Deploy through GitHub Pages

1. Go to repository Settings → Pages.
2. Select `Deploy from a branch`.
3. Select `main` and `/ root`.
4. Save.
5. Open `https://lotargo.github.io` after the first build finishes.

## v0 / Vercel direction

Use `v0_PROMPT.md` as a rebuild prompt if this static version later becomes a Next.js/Vercel project.

## Profile README button

Use `PROFILE_README_SNIPPET.md` in the `Lotargo/Lotargo` profile README.

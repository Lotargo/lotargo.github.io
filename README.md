# Lotargo Portfolio

Static brutalist portfolio for GitHub Pages.

```text
https://lotargo.github.io
```

The site is intentionally static: no build step, no package install, and no backend. It uses dark theme and English language by default, with light theme and Russian language available through toggles.

## Structure

```text
index.html
assets/css/styles.css
assets/js/projects.js
assets/js/main.js
assets/img/
PROFILE_README_SNIPPET.md
v0_PROMPT.md
```

## Edit Projects

Project data lives in:

```text
assets/js/projects.js
```

Each project can define:

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

Images live in:

```text
assets/img/
```

Use project image paths like:

```js
image: "./assets/img/project-name.png"
```

## Local Preview

You can open `index.html` directly, or run a static server:

```powershell
python -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173
```

## Deploy Through GitHub Pages

1. Go to repository Settings -> Pages.
2. Select `Deploy from a branch`.
3. Select `main` and `/ root`.
4. Save.
5. Open `https://lotargo.github.io` after the first build finishes.

## v0 / Vercel

`v0_PROMPT.md` is kept as a future migration guide. Use it if this static site later needs to be rebuilt as a Next.js/Vercel project.

## Profile README Button

Use `PROFILE_README_SNIPPET.md` in the `Lotargo/Lotargo` profile README.

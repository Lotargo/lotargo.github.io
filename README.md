# Lotargo GitHub Profile Landing

This repository contains the static landing page for the main GitHub profile:

```text
https://github.com/Lotargo
```

The published page is available at:

```text
https://lotargo.github.io
```

The purpose of this page is simple: give visitors one readable entry point into the projects, demos, repositories, and public evidence linked from the Lotargo GitHub profile. It is not a separate framework project, SaaS app, or generated showcase. It is a hand-maintained static GitHub Pages site.

## What This Repo Contains

```text
index.html
assets/css/styles.css
assets/js/projects.js
assets/js/main.js
assets/img/
PROFILE_README_SNIPPET.md
v0_PROMPT.md
```

There is no build step, package install, backend, or deployment script required for the current version. GitHub Pages serves the files directly from the repository root.

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

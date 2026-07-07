# Blog Automation Roadmap

This roadmap captures the intended evolution of the `lotargo.github.io` blog tooling.

The guiding principle is simple: keep the public site static and GitHub Pages-friendly, but make article publishing harder to break. The next improvements should add typed metadata, validation, and small CLI helpers before introducing any heavy build system.

## Current Baseline

Already implemented:

- `assets/js/blog-posts.js` is the shared article metadata manifest.
- `blog/index.html` renders article cards from the manifest through `assets/js/blog-index.js`.
- article pages normalize Previous / Next navigation through `assets/js/blog-post.js`.
- landing-page notifications are generated from the manifest through `assets/js/notifications.js`.
- `docs/ADDING_BLOG_ARTICLES.md` documents the current manual publishing workflow.

Current manual parts:

- writing article HTML;
- keeping optional Markdown source copies;
- generating responsive SVG/image assets;
- checking links and required fields by hand;
- RSS and sitemap updates.

## Decision: no real API layer yet

Do not add a server API, database, serverless routes, or backend CMS at this stage.

For this repository, the better next layer is:

```text
CLI + validation + static manifests
```

This keeps the site deployable as plain GitHub Pages while still giving us a safer authoring workflow.

A static data layer is allowed later, for example:

```text
assets/data/blog-posts.json
assets/data/projects.json
assets/data/site-updates.json
```

But it should remain static data, not a runtime backend.

## Phase 1: Lightweight typing for the manifest

Goal: make `assets/js/blog-posts.js` safer to edit without adding a build step.

Recommended implementation:

- add JSDoc typedefs directly in `assets/js/blog-posts.js`;
- optionally add `types/blog.d.ts` for editor support;
- keep runtime output as plain JavaScript.

Target shape:

```ts
type LangText = {
  en: string;
  ru: string;
};

type BlogPost = {
  slug: string;
  date: string;
  href: string;
  url: string;
  type: LangText;
  title: LangText;
  shortTitle?: LangText;
  description: LangText;
  notificationId?: string;
  notificationTitle?: LangText;
  notificationText?: LangText;
  notify: boolean;
};
```

Acceptance criteria:

- editors show autocomplete for article entries;
- obvious field mistakes such as `notifiy` are easier to catch;
- no build step is introduced;
- GitHub Pages still serves files directly.

## Phase 2: Blog validator CLI

Goal: catch broken article metadata before pushing.

Create:

```text
scripts/validate-blog.mjs
```

Add package script:

```json
{
  "scripts": {
    "blog:validate": "node scripts/validate-blog.mjs"
  }
}
```

The validator should check:

- every `slug` is unique;
- every `date` uses `YYYY-MM-DD`;
- every article has `title.en`, `title.ru`, `description.en`, `description.ru`;
- `notify` is a boolean;
- `href` equals `./<slug>.html`;
- `url` equals `./blog/posts/<slug>.html`;
- `blog/posts/<slug>.html` exists;
- article pages include `post-pagination`;
- article pages include `../../assets/js/main.js`;
- article pages include `../../assets/js/blog-post.js`;
- optional Markdown source files are reported as missing warnings, not hard errors;
- manifest order is chronological from oldest to newest.

Acceptance criteria:

- `npm run blog:validate` exits with non-zero code on broken required fields;
- warnings are visible but do not block publishing;
- validation output is short and readable.

## Phase 3: package.json and local workflow commands

Goal: standardize local commands without turning the repo into a framework project.

Create minimal `package.json`:

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "preview": "npx --yes http-server . -p 4173 -c-1",
    "blog:validate": "node scripts/validate-blog.mjs"
  }
}
```

No dependency lockfile is required at this phase unless we add real dependencies.

Acceptance criteria:

- `npm run preview` serves the site locally;
- `npm run blog:validate` validates the blog;
- README references the commands.

## Phase 4: New article CLI

Goal: reduce repetitive file creation.

Create:

```text
scripts/new-blog-post.mjs
```

Target command:

```bash
npm run blog:new -- my-new-article
```

The CLI should create:

```text
blog/posts/my-new-article.html
blog/content/my-new-article.en.md
blog/content/my-new-article.ru.md
```

Optional later flags:

```bash
npm run blog:new -- my-new-article --notify
npm run blog:new -- my-new-article --type "AI systems" --type-ru "AI системы"
```

The first version does not need to fully edit `assets/js/blog-posts.js`. It can print the manifest snippet to paste manually. Later it can insert the entry automatically.

Acceptance criteria:

- new article skeleton is created from the current post template;
- generated HTML includes header, footer, script includes, and fallback pagination;
- CLI refuses to overwrite existing files;
- validator passes after the user fills required metadata and content.

## Phase 5: JSON Schema validation

Goal: formalize metadata shape beyond JSDoc.

Create:

```text
schemas/blog-post.schema.json
```

Use it from `scripts/validate-blog.mjs`.

Possible validator options:

- custom lightweight validator with no dependencies;
- later: Ajv, if the schema grows enough to justify a dependency.

Acceptance criteria:

- metadata shape is documented as machine-readable schema;
- `BlogPost` fields are validated consistently;
- schema errors point to the failing `slug` and field name.

## Phase 6: Static data layer

Goal: separate data from runtime JavaScript while still serving a static site.

Introduce:

```text
assets/data/blog-posts.json
assets/data/site-notifications.json
```

Generate or maintain:

```text
assets/js/blog-posts.js
```

The runtime site can keep using the JS file for compatibility. The JSON files become cleaner inputs for scripts, agents, and future generators.

Acceptance criteria:

- JSON becomes the preferred source for scripts;
- JS manifest is either generated or kept in sync by validation;
- runtime behavior remains unchanged.

## Phase 7: RSS, sitemap, and llms.txt

Goal: make the site easier to index and easier for tools to understand.

Add generated or manually maintained:

```text
rss.xml
sitemap.xml
llms.txt
```

Recommended order:

1. `sitemap.xml`
2. `rss.xml`
3. `llms.txt`

Acceptance criteria:

- all public articles appear in sitemap;
- RSS includes newest posts first;
- `llms.txt` summarizes the site structure and key project/blog links.

## Phase 8: OpenGraph and article share assets

Goal: make links look better in Telegram, Discord, social previews, and search snippets.

For each article, support metadata fields:

```js
ogImage
ogDescription
```

Article pages should include:

```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:type" content="article" />
```

Acceptance criteria:

- article links have useful preview cards;
- missing `ogImage` is warned by the validator, not a hard error;
- default fallback image exists.

## Phase 9: Real static generator

Goal: stop writing article HTML by hand once the manual cost becomes annoying.

Possible build script:

```text
scripts/build-blog.mjs
```

Inputs:

```text
blog/content/*.en.md
blog/content/*.ru.md
assets/data/blog-posts.json
```

Outputs:

```text
blog/posts/*.html
blog/index.html
assets/js/blog-posts.js
rss.xml
sitemap.xml
llms.txt
```

This phase is intentionally later. Do not introduce it until manual HTML becomes a real bottleneck.

Acceptance criteria:

- Markdown frontmatter drives article metadata;
- generated HTML matches the current visual system;
- old manually written posts can still be migrated safely;
- build output is deterministic.

## Recommended implementation order

1. Add JSDoc types to `assets/js/blog-posts.js`.
2. Add `scripts/validate-blog.mjs`.
3. Add minimal `package.json` with `preview` and `blog:validate`.
4. Add `scripts/new-blog-post.mjs` skeleton generator.
5. Add JSON Schema if validation logic starts growing.
6. Move canonical data to `assets/data/*.json` only when scripts need it.
7. Add sitemap, RSS, and `llms.txt`.
8. Add OpenGraph fields and validator warnings.
9. Build a full static generator only after the manual article HTML workflow becomes too slow.

## Explicit non-goals for now

- no backend CMS;
- no database;
- no serverless API routes;
- no Next.js/Vite/Astro migration yet;
- no required TypeScript build step;
- no heavy dependency chain unless validation/generation becomes painful without it.

## Why this order

The profile site is already good enough as a public portfolio. The next work should reduce mistakes, not expand architecture for its own sake.

The best near-term upgrade is therefore validation and small CLI helpers. That gives most of the benefit of a CMS while preserving the simplicity of static GitHub Pages.

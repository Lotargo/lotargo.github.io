# v0 / Vercel Migration Guide

This repository is a static GitHub Pages portfolio. Keep this document as a future path for rebuilding the same concept as a Next.js project with v0 and deploying it on Vercel.

## When to Use This

Use this guide if you want:

- server-rendered or componentized Next.js pages;
- easier iteration through v0;
- Vercel previews for pull requests;
- future API routes, analytics, or dynamic project data.

Do not migrate just to publish the current site. The static version already works on GitHub Pages.

## Suggested v0 Workflow

1. Open v0 and create a new project.
2. Paste the prompt from the "v0 Rebuild Prompt" section below.
3. Ask v0 to generate a Next.js App Router implementation.
4. Keep project data in a separate file, similar to `assets/js/projects.js`.
5. Copy image assets from `assets/img/` into the generated app's `public/` directory.
6. Verify these current behavior details:
   - default state is dark theme and English language;
   - Russian language remains available through a toggle;
   - project previews stay aligned at full HD desktop widths;
   - light-theme hover overlay on images is subtle, not foggy;
   - landing buttons are filled pastel red and invert on hover.
7. Export or push the generated code to GitHub.
8. Import the repository in Vercel.
9. Deploy with the default Next.js settings.

## Vercel Notes

- Framework preset: `Next.js`.
- Build command: `next build`.
- Output directory: leave Vercel default.
- Node version: use the current Vercel default unless the generated app requires otherwise.
- Static image paths should be moved from `./assets/img/name.png` to `/name.png` or `/img/name.png`, depending on the generated `public/` layout.

## v0 Rebuild Prompt

```text
Create a brutalist personal AI engineering portfolio for Oleg Boyko / Lotargo as a Next.js App Router project.

Visual direction:
- black and white brutalist aesthetic
- default dark theme with English language
- optional light theme with a restrained hover overlay on project images
- Russian language toggle
- huge uppercase hero typography
- outline/fill text transition inspired by VOID Studio
- thin divider lines, high contrast, cinematic spacing
- monochrome project previews that become full-color on hover
- no agency/studio copy; this is a technical systems portfolio

Hero copy:
AI SYSTEMS
BUILT OUTSIDE
THE TEMPLATE

Subcopy:
Personal technical portfolio of Oleg Boyko / Lotargo — experimental AI systems, RAG/vector architecture, low-level runtime work, agentic tooling, and proof-oriented prototypes.

Sections:
1. Hero
2. Positioning / capabilities
3. Featured project links
4. Evidence / public boundary
5. Contact

Project cards must be data-driven and easy to edit. Each card should include:
- title
- category
- status
- description
- proof/evidence line
- stack
- landing URL
- repository URL
- optional demo URL
- optional docs URL
- optional image path

Important layout requirements:
- project cards render in a two-column grid on desktop and one column on smaller screens
- project preview images must stay aligned at full HD desktop widths
- do not rely on each card's individual fractional width for preview height
- landing buttons are filled pastel red by default and invert fill/text color on hover

Use these public project links:
- https://lotargo.github.io/public_sonata_ai_landing/
- https://github.com/Lotargo/public_sonata_ai_landing
- https://lotargo.github.io/Nexus_API_Balancer/
- https://github.com/Lotargo/Nexus_API_Balancer
- https://lotargo.github.io/Academic-Pipeline-Engine/
- https://github.com/Lotargo/Academic-Pipeline-Engine
- https://lotargo.github.io/css-server/
- https://github.com/Lotargo/css-server
- https://lotargo.github.io/ComfyUI-Meta-Viewer/
- https://github.com/Lotargo/ComfyUI-Meta-Viewer
- https://lotargo.github.io/Necromancer/
- https://github.com/Lotargo/Necromancer
```

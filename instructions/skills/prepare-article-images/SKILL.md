---
name: prepare-article-images
description: Generate, export, name, optimize, caption, and integrate images for portfolio blog articles.
---

# Prepare Article Images

Use this skill for concept art, screenshots, diagrams, charts, UI mockups, photographs, and gallery assets.

## Core Rule

Store images as real binary files. Never use a tiny raster image embedded in an SVG wrapper, and never leave Base64 raster payloads inside published HTML.

## Preferred Formats

Use:

- AVIF for high-quality photographic or generated artwork when browser compatibility is acceptable;
- WebP for broad modern compatibility;
- PNG for transparency, pixel-perfect UI, or lossless requirements;
- SVG for genuine vector diagrams and icons;
- JPEG only when existing tooling requires it.

Do not convert a raster image into SVG merely to bypass a binary upload limitation.

## Resolution

For wide article illustrations and fullscreen lightbox viewing:

```text
recommended width: 1600–2400 px
minimum practical width: 1280 px
common aspect ratio: 16:9
```

Do not claim that an upscaled low-resolution image is a high-resolution source. Preserve the best available original.

## Article And Fullscreen Sources

The image viewer supports a lightweight page preview and a separate full-resolution source:

```html
<img
  src="preview.avif"
  data-full-src="full.avif"
  alt="Description of the image"
/>
```

Use one file for both when it is already reasonably optimized.

## Naming

Use lowercase kebab-case filenames that describe content rather than generation order:

```text
main-menu.avif
layered-apartment.avif
layered-classroom.avif
cinematic-rainy-city.avif
memory-architecture.svg
```

Avoid:

```text
image1.png
final-final-2.png
output_00047.webp
```

## Generated Images

When visuals were generated specifically for the project, describe them naturally as concepts. A short note in the article is enough.

Do not repeatedly label every caption as “AI-generated” unless that distinction is materially important. Captions should primarily explain what the reader is seeing and why it matters.

Generated UI mockups often contain malformed text. Treat their text as visual placeholder content, not as reliable product copy. When exact text matters, rebuild the interface or overlay typography with ordinary HTML/SVG tools.

## Screenshots

Before publishing screenshots:

- remove tokens, email addresses, filesystem paths, and personal data;
- hide browser extensions and unrelated tabs;
- crop unnecessary desktop chrome;
- confirm that private repository names are safe to show;
- keep the original aspect ratio unless editorial cropping improves clarity.

## Alt Text

Alt text should describe the information conveyed by the image, not repeat the caption mechanically.

Good:

```text
Visual Novel gameplay concept showing a character sprite layered over an evening apartment background
```

Weak:

```text
Image
Beautiful screenshot
Concept number three
```

## Captions

Captions should connect the image to the surrounding argument:

```text
Вечерняя квартира: повторно используемая домашняя локация для обычного общения.
```

Avoid long technical disclaimers below every image.

## Gallery Rules

- group images that answer the same editorial question;
- normally use two or three columns on desktop and one on mobile;
- preserve a consistent aspect ratio within one gallery;
- keep captions similar in length;
- ensure every image opens in the fullscreen viewer;
- do not place a gallery before the article title and lead.

## Optimization

Optimize without visibly destroying detail. Inspect the image at 100% and in fullscreen before accepting compression.

Typical priorities:

1. no visible block artifacts or smeared text;
2. enough resolution for lightbox;
3. reasonable repository size;
4. correct color and transparency;
5. metadata removal where privacy matters.

## Completion Criteria

Every image must have:

- a meaningful filename;
- an existing repository path;
- sufficient native resolution;
- correct dimensions in HTML where practical;
- useful alt text;
- a concise caption when editorial context is needed;
- successful fullscreen viewing without blur caused by accidental thumbnail scaling.

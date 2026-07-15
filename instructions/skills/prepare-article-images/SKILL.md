---
name: prepare-article-images
description: Generate, export, name, optimize, caption, and integrate images for Markdown-first portfolio blog articles.
---

# Prepare Article Images

Use this skill for concept art, screenshots, diagrams, charts, UI mockups, photographs, and gallery assets.

## Core Rule

Store images as real binary files. Never use a tiny raster image embedded in an SVG wrapper, and never leave Base64 raster payloads inside published Markdown or HTML.

## Preferred Formats

Use:

- AVIF for high-quality photographic or generated artwork when browser compatibility is acceptable;
- WebP for broad modern compatibility;
- PNG for transparency, pixel-perfect UI, or lossless requirements;
- SVG for genuine vector diagrams and icons;
- JPEG only when existing tooling requires it.

Do not convert raster images into SVG merely to bypass a binary upload limitation.

## Resolution

For wide article illustrations and fullscreen lightbox viewing:

```text
recommended width: 1600–2400 px
minimum practical width: 1280 px
common aspect ratio: 16:9
```

Do not claim that an upscaled low-resolution image is a high-resolution source. Preserve the best available original.

## Bundle Placement

Put article media inside:

```text
<bundle>/assets/
```

Use lowercase kebab-case filenames:

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

## Markdown Integration

Use bundle-relative paths:

```md
![Visual Novel main screen](assets/main-menu.avif "Main screen concept")
```

The renderer converts this to an installed article asset path and creates an editorial figure with lightbox support.

The Markdown image title becomes the visible caption. When no title is supplied, alt text is used as the caption.

For ordinary articles, use one sufficiently optimized high-resolution file for both page display and fullscreen viewing. This avoids accidental thumbnail stretching and keeps Markdown simple.

A separate preview/full source remains possible through legacy/custom HTML, but it should be introduced only when the full asset is too heavy for normal page loading.

## Gallery Creation

Write consecutive standalone images:

```md
![Apartment](assets/layered-apartment.avif "Evening apartment")

![Classroom](assets/layered-classroom.avif "Daytime classroom")

![Park](assets/layered-park.avif "Park at sunset")
```

The renderer groups them into one responsive gallery and one fullscreen navigation group.

Rules:

- group images that answer the same editorial question;
- normally use two or three images per visual block;
- preserve a consistent aspect ratio within one gallery;
- keep captions similar in length;
- place galleries after the text that introduces them;
- do not place a gallery before the article title and lead.

## Generated Images

When visuals were generated specifically for the project, describe them naturally as concepts. A short note in the article is enough.

Do not repeatedly label every caption as “AI-generated” unless that distinction is materially important. Captions should primarily explain what the reader is seeing and why it matters.

Generated UI mockups often contain malformed text. Treat it as visual placeholder content, not reliable product copy. When exact text matters, rebuild the interface or overlay typography with ordinary HTML/SVG tools.

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

## Optimization

Optimize without visibly destroying detail. Inspect the image at 100% and in fullscreen before accepting compression.

Priorities:

1. no visible block artifacts or smeared text;
2. enough native resolution for lightbox;
3. reasonable repository size;
4. correct color and transparency;
5. metadata removal where privacy matters.

## Completion Criteria

Every image must have:

- a meaningful filename;
- an existing path inside the bundle;
- sufficient native resolution;
- useful alt text;
- a concise caption where editorial context is needed;
- correct placement in the Markdown narrative;
- successful fullscreen viewing without blur caused by accidental thumbnail scaling.

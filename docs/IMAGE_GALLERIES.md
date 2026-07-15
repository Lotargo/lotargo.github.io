# Image Galleries And Fullscreen Viewer

The portfolio now includes a reusable zero-dependency image viewer for blog articles.

## Files

```text
assets/js/image-viewer.js
assets/css/image-viewer.css
```

`assets/js/blog-post.js` loads both files automatically on article pages that contain supported images.

## Single Image

Images inside `.post-figure` work automatically:

```html
<figure class="post-figure">
  <img src="../assets/example.svg" alt="Example" />
  <figcaption>Example caption</figcaption>
</figure>
```

The image becomes keyboard-accessible and opens in the fullscreen viewer.

## Gallery

Use the same `data-gallery` value for images that should be navigated together:

```html
<div class="post-gallery" data-gallery="project-concepts">
  <figure class="post-gallery-item">
    <img
      src="../assets/screen-01.svg"
      alt="First screen"
      data-caption-en="English fullscreen caption"
      data-caption-ru="Русская подпись в полноэкранном режиме"
    />
    <figcaption data-lang-content="en">English card caption</figcaption>
    <figcaption data-lang-content="ru">Русская подпись карточки</figcaption>
  </figure>

  <figure class="post-gallery-item">
    <img src="../assets/screen-02.svg" alt="Second screen" />
    <figcaption>Second screen</figcaption>
  </figure>
</div>
```

A hero image can join the same gallery by placing the same attribute on its figure:

```html
<figure class="post-figure" data-gallery="project-concepts">
  <img src="../assets/hero.svg" alt="Project hero" />
</figure>
```

## Explicit Opt-In

An image outside the standard article components can use:

```html
<img src="image.svg" alt="Example" data-lightbox />
```

## Controls

- click or `Enter` / `Space` opens an image;
- `Escape` closes the viewer;
- `ArrowLeft` and `ArrowRight` navigate the active gallery;
- previous and next buttons are available on screen;
- captions follow the current RU/EN language;
- focus returns to the original image after closing;
- adjacent images are preloaded;
- the viewer adapts to mobile screens and reduced-motion settings.

## Large Assets

For a lightweight thumbnail and a separate full-resolution image, use:

```html
<img
  src="preview.webp"
  data-full-src="full-resolution.webp"
  alt="Large concept"
/>
```

The article renders the preview, while the viewer opens `data-full-src`.

(function () {
  if (window.__LOTARGO_IMAGE_VIEWER__) return;
  window.__LOTARGO_IMAGE_VIEWER__ = true;

  const labels = {
    en: {
      dialog: 'Image viewer',
      close: 'Close image viewer',
      previous: 'Previous image',
      next: 'Next image',
      open: 'Open image in fullscreen',
      counter: (index, total) => `${index} / ${total}`
    },
    ru: {
      dialog: 'Просмотр изображений',
      close: 'Закрыть просмотр изображения',
      previous: 'Предыдущее изображение',
      next: 'Следующее изображение',
      open: 'Открыть изображение на весь экран',
      counter: (index, total) => `${index} / ${total}`
    }
  };

  const allImages = Array.from(document.querySelectorAll('[data-lightbox], .post-figure img, [data-gallery] img'));
  if (!allImages.length) return;

  const groups = new Map();
  let generatedGroupId = 0;

  function language() {
    return document.documentElement.lang === 'ru' ? 'ru' : 'en';
  }

  function groupKey(image) {
    const gallery = image.closest('[data-gallery]');
    if (gallery) {
      if (!gallery.dataset.gallery) gallery.dataset.gallery = `gallery-${++generatedGroupId}`;
      return gallery.dataset.gallery;
    }
    return `single-${++generatedGroupId}`;
  }

  function captionFor(image) {
    const lang = language();
    const explicit = image.dataset[`caption${lang === 'ru' ? 'Ru' : 'En'}`];
    if (explicit) return explicit;

    const figure = image.closest('figure');
    if (!figure) return image.alt || '';
    const localized = figure.querySelector(`figcaption[data-lang-content="${lang}"]`);
    const fallback = figure.querySelector('figcaption');
    return (localized || fallback)?.textContent?.trim() || image.alt || '';
  }

  const records = allImages.map((image) => {
    const record = {
      image,
      src: image.dataset.fullSrc || image.currentSrc || image.src,
      alt: image.alt || '',
      group: groupKey(image)
    };
    if (!groups.has(record.group)) groups.set(record.group, []);
    groups.get(record.group).push(record);
    return record;
  });

  const viewer = document.createElement('div');
  viewer.className = 'image-viewer';
  viewer.hidden = true;
  viewer.setAttribute('aria-hidden', 'true');
  viewer.innerHTML = `
    <div class="image-viewer__backdrop" data-image-viewer-close></div>
    <section class="image-viewer__dialog" role="dialog" aria-modal="true">
      <header class="image-viewer__toolbar">
        <span class="image-viewer__counter" aria-live="polite"></span>
        <button class="image-viewer__close" type="button" data-image-viewer-close aria-label="Close">×</button>
      </header>
      <button class="image-viewer__nav image-viewer__nav--prev" type="button" aria-label="Previous">‹</button>
      <figure class="image-viewer__figure">
        <img class="image-viewer__image" alt="" />
        <figcaption class="image-viewer__caption"></figcaption>
      </figure>
      <button class="image-viewer__nav image-viewer__nav--next" type="button" aria-label="Next">›</button>
    </section>
  `;
  document.body.appendChild(viewer);

  const dialog = viewer.querySelector('.image-viewer__dialog');
  const modalImage = viewer.querySelector('.image-viewer__image');
  const caption = viewer.querySelector('.image-viewer__caption');
  const counter = viewer.querySelector('.image-viewer__counter');
  const closeButton = viewer.querySelector('.image-viewer__close');
  const previousButton = viewer.querySelector('.image-viewer__nav--prev');
  const nextButton = viewer.querySelector('.image-viewer__nav--next');

  let activeGroup = [];
  let activeIndex = 0;
  let returnFocus = null;

  function updateLabels() {
    const text = labels[language()];
    dialog.setAttribute('aria-label', text.dialog);
    closeButton.setAttribute('aria-label', text.close);
    previousButton.setAttribute('aria-label', text.previous);
    nextButton.setAttribute('aria-label', text.next);
  }

  function render() {
    const record = activeGroup[activeIndex];
    if (!record) return;

    modalImage.src = record.src;
    modalImage.alt = record.alt;
    caption.textContent = captionFor(record.image);

    const total = activeGroup.length;
    counter.textContent = labels[language()].counter(activeIndex + 1, total);
    previousButton.hidden = total < 2;
    nextButton.hidden = total < 2;

    const previous = activeGroup[(activeIndex - 1 + total) % total];
    const next = activeGroup[(activeIndex + 1) % total];
    [previous, next].forEach((item) => {
      if (!item || item === record) return;
      const preload = new Image();
      preload.src = item.src;
    });
  }

  function open(record, trigger) {
    activeGroup = groups.get(record.group) || [record];
    activeIndex = activeGroup.indexOf(record);
    returnFocus = trigger;
    updateLabels();
    render();
    viewer.hidden = false;
    viewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('image-viewer-open');
    requestAnimationFrame(() => viewer.classList.add('is-open'));
    closeButton.focus({ preventScroll: true });
  }

  function close() {
    if (viewer.hidden) return;
    viewer.classList.remove('is-open');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('image-viewer-open');
    window.setTimeout(() => {
      viewer.hidden = true;
      modalImage.removeAttribute('src');
      if (returnFocus) returnFocus.focus({ preventScroll: true });
    }, 180);
  }

  function step(direction) {
    if (activeGroup.length < 2) return;
    activeIndex = (activeIndex + direction + activeGroup.length) % activeGroup.length;
    render();
  }

  records.forEach((record) => {
    const image = record.image;
    const trigger = image.closest('button, a') || image;
    image.classList.add('image-viewer-trigger');

    if (trigger === image) {
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', labels[language()].open);
    }

    trigger.addEventListener('click', (event) => {
      if (trigger.tagName === 'A') event.preventDefault();
      open(record, trigger);
    });

    if (trigger === image) {
      trigger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open(record, trigger);
        }
      });
    }
  });

  viewer.querySelectorAll('[data-image-viewer-close]').forEach((node) => node.addEventListener('click', close));
  previousButton.addEventListener('click', () => step(-1));
  nextButton.addEventListener('click', () => step(1));

  document.addEventListener('keydown', (event) => {
    if (viewer.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') step(-1);
    if (event.key === 'ArrowRight') step(1);
  });

  new MutationObserver(() => {
    updateLabels();
    records.forEach(({ image }) => {
      if (image.getAttribute('role') === 'button') {
        image.setAttribute('aria-label', labels[language()].open);
      }
    });
    if (!viewer.hidden) render();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  updateLabels();
})();

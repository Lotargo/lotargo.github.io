(function () {
  const currentScript = document.currentScript;
  const scriptUrl = currentScript && currentScript.src ? currentScript.src : '../../assets/js/blog-post.js';
  const imageViewerVersion = '20260715-3';

  function loadScript(src, errorMessage) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (existing.dataset.loaded === 'true') {
          resolve();
          return;
        }
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error(errorMessage)), { once: true });
        return;
      }

      const script = document.createElement('script');
      const timeout = window.setTimeout(() => {
        script.remove();
        reject(new Error(errorMessage));
      }, 5000);

      script.src = src;
      script.async = true;
      script.onload = () => {
        window.clearTimeout(timeout);
        script.dataset.loaded = 'true';
        resolve();
      };
      script.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error(errorMessage));
      };
      document.head.appendChild(script);
    });
  }

  function loadRenderFixes() {
    if (document.querySelector('link[href$="render-fixes.css"]')) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('../css/render-fixes.css', scriptUrl).href;
    document.head.appendChild(link);
  }

  function loadImageViewer() {
    if (!document.querySelector('link[data-image-viewer-styles]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.dataset.imageViewerStyles = 'true';
      link.href = new URL(`../css/image-viewer.css?v=${imageViewerVersion}`, scriptUrl).href;
      document.head.appendChild(link);
    }

    if (!document.querySelector('[data-lightbox], .post-figure img, [data-gallery] img')) {
      return Promise.resolve();
    }

    return loadScript(
      new URL(`image-viewer.js?v=${imageViewerVersion}`, scriptUrl).href,
      'Failed to load image viewer'
    );
  }

  function patchVisualNovelArticleCopy() {
    if (!window.location.pathname.endsWith('/visual-novel-ai-game.html')) return;
    if (document.querySelector('[data-visual-novel-copy-patch]')) return;

    const copy = {
      en: {
        noteTitle: 'About the visuals',
        note: "Every illustration in this article was generated specifically for this project as an early concept asset. These are not screenshots, interface fragments, characters, or backgrounds taken from an existing third-party game. They are exploratory AI generations used to find the project's own visual language.",
        nextTitle: 'What happens next',
        nextOne: 'The first technical prototypes will compare a web-first desktop stack built around Tauri, Svelte, and a Canvas/WebGL scene layer with a more traditional game-engine route. The comparison will focus on character compositing, scene transitions, cinematic overlays, long dialogue sessions, local AI processes, and a future Steam build.',
        nextTwo: 'The visual pipeline will be tested separately: character LoRA consistency, background removal, alpha edges, chroma-key fallback, reusable sprite caching, complete CG generation, and transitions between layered and cinematic modes. The audio prototype will test seamless loops, ambience, character leitmotifs, and state-driven crossfades.',
        publishTitle: 'How development will be published',
        publish: 'The project repository will remain private. Public progress will appear periodically in this blog instead: interface iterations, architecture notes, generated concepts, short demonstrations, technical experiments, and conclusions from failed approaches. The goal is to show real progress without turning unfinished implementation details into a public codebase.'
      },
      ru: {
        noteTitle: 'О происхождении иллюстраций',
        note: 'Все изображения в этой статье были сгенерированы специально для проекта как ранние концепт-ассеты. Это не скриншоты, не элементы интерфейса, не персонажи и не фоны из готовой чужой игры. Генерации используются для поиска собственного визуального языка будущего продукта.',
        nextTitle: 'Что будет дальше',
        nextOne: 'Первые технические прототипы должны сравнить web-first desktop-стек на основе Tauri, Svelte и Canvas/WebGL-сцены с более традиционным вариантом на игровом движке. Сравнивать будем композицию персонажа, переходы между сценами, cinematic-overlay, длинные диалоги, локальные AI-процессы и возможность дальнейшего выпуска в Steam.',
        nextTwo: 'Визуальный pipeline будет проверяться отдельно: каноничность персонажа через LoRA, удаление фона, качество alpha-краёв, chroma key как запасной путь, кэширование спрайтов, цельные CG-генерации и переходы между составным и cinematic-режимами. Для аудио отдельно проверим бесшовные loops, ambience, лейтмотивы персонажей и crossfade, управляемый состоянием сцены.',
        publishTitle: 'Как будет публиковаться разработка',
        publish: 'Репозиторий проекта останется закрытым. Публичные результаты будут периодически выходить в этом блоге: итерации интерфейса, архитектурные заметки, сгенерированные концепты, короткие демонстрации, технические эксперименты и выводы из неудачных подходов. Так можно показывать реальный прогресс, не превращая незавершённые детали реализации в публичную кодовую базу.'
      }
    };

    ['en', 'ru'].forEach((lang) => {
      const blocks = Array.from(document.querySelectorAll(`[data-lang-content="${lang}"]`));
      const intro = blocks.find((block) => block.querySelector('h1'));
      const ending = blocks.find((block) => Array.from(block.querySelectorAll('h2')).some((heading) => /Current status|Текущий статус/.test(heading.textContent)));
      const text = copy[lang];

      if (intro) {
        const quote = intro.querySelector('blockquote');
        if (quote && !intro.querySelector('.post-note--generated')) {
          const note = document.createElement('aside');
          note.className = 'post-note post-note--generated';
          note.dataset.visualNovelCopyPatch = 'true';
          const title = document.createElement('strong');
          title.textContent = text.noteTitle;
          const paragraph = document.createElement('p');
          paragraph.textContent = text.note;
          note.append(title, paragraph);
          quote.insertAdjacentElement('afterend', note);
        }
      }

      if (ending) {
        const statusHeading = Array.from(ending.querySelectorAll('h2')).find((heading) => /Current status|Текущий статус/.test(heading.textContent));
        if (statusHeading && !ending.querySelector('[data-visual-novel-plans]')) {
          const fragment = document.createDocumentFragment();
          const nextHeading = document.createElement('h2');
          nextHeading.textContent = text.nextTitle;
          nextHeading.dataset.visualNovelPlans = 'true';
          const nextOne = document.createElement('p');
          nextOne.textContent = text.nextOne;
          const nextTwo = document.createElement('p');
          nextTwo.textContent = text.nextTwo;
          const publishHeading = document.createElement('h2');
          publishHeading.textContent = text.publishTitle;
          const publish = document.createElement('p');
          publish.textContent = text.publish;
          fragment.append(nextHeading, nextOne, nextTwo, publishHeading, publish);
          statusHeading.before(fragment);
        }

        ending.querySelectorAll('a[href*="github.com/Lotargo/visual-novel"]').forEach((link) => {
          const paragraph = link.closest('p');
          if (paragraph) paragraph.remove();
        });
      }
    });
  }

  function loadBlogPostsManifest() {
    if (Array.isArray(window.BLOG_POSTS)) return Promise.resolve();
    return loadScript(new URL('blog-posts.js', scriptUrl).href, 'Failed to load blog posts manifest');
  }

  function localized(value, lang) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value[lang] || value.en || '';
    }
    return value || '';
  }

  function normalizePostPagination() {
    const pagination = document.querySelector('.post-pagination');
    if (!pagination) return;

    const posts = Array.isArray(window.BLOG_POSTS) ? window.BLOG_POSTS : [];
    const currentFile = window.location.pathname.split('/').pop() || '';
    const currentSlug = currentFile.replace(/\.html$/, '');
    const currentIndex = posts.findIndex((post) => post.slug === currentSlug);
    if (currentIndex === -1) return;

    function addTitleNodes(container, post) {
      const title = post.shortTitle || post.title || post.slug;

      const enTitle = document.createElement('strong');
      enTitle.dataset.langContent = 'en';
      enTitle.textContent = localized(title, 'en');
      container.appendChild(enTitle);

      const ruTitle = document.createElement('strong');
      ruTitle.dataset.langContent = 'ru';
      ruTitle.textContent = localized(title, 'ru');
      container.appendChild(ruTitle);
    }

    function createEnabledLink(direction, post) {
      const link = document.createElement('a');
      link.className = 'post-page-link';
      link.href = post.href || `./${post.slug}.html`;

      const label = document.createElement('span');
      label.dataset.i18n = direction === 'prev' ? 'post-prev' : 'post-next';
      label.textContent = direction === 'prev' ? 'Previous' : 'Next';
      link.appendChild(label);

      addTitleNodes(link, post);
      return link;
    }

    function createDisabledLink(direction) {
      const node = document.createElement('span');
      node.className = 'post-page-link is-disabled';
      node.setAttribute('aria-disabled', 'true');

      const label = document.createElement('span');
      label.dataset.i18n = direction === 'prev' ? 'post-prev' : 'post-next';
      label.textContent = direction === 'prev' ? 'Previous' : 'Next';
      node.appendChild(label);

      const empty = document.createElement('strong');
      empty.dataset.i18n = direction === 'prev' ? 'post-prev-none' : 'post-next-none';
      empty.textContent = direction === 'prev' ? 'No earlier post' : 'No later post';
      node.appendChild(empty);
      return node;
    }

    pagination.replaceChildren(
      posts[currentIndex - 1] ? createEnabledLink('prev', posts[currentIndex - 1]) : createDisabledLink('prev'),
      posts[currentIndex + 1] ? createEnabledLink('next', posts[currentIndex + 1]) : createDisabledLink('next')
    );
  }

  loadRenderFixes();
  patchVisualNovelArticleCopy();
  loadImageViewer().catch(() => {});
  loadBlogPostsManifest().then(normalizePostPagination).catch(() => {});

  const memoryHero = document.querySelector('.memory-hero');
  if (memoryHero) {
    memoryHero.querySelectorAll('text').forEach((node) => {
      if (node.textContent.trim() === 'CLICKHOUSE') {
        node.setAttribute('x', '12');
        node.setAttribute('y', '318');
        node.setAttribute('style', 'font-size:13px;letter-spacing:.28em');
      }
    });
  }

  const mermaidBlocks = document.querySelectorAll('.mermaid');
  if (!mermaidBlocks.length) return;

  loadScript('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js', 'Failed to load Mermaid')
    .then(() => {
      if (!window.mermaid) return;
      window.mermaid.initialize({
        startOnLoad: true,
        theme: document.documentElement.dataset.theme === 'light' ? 'default' : 'dark'
      });
    })
    .catch(() => {
      mermaidBlocks.forEach((block) => {
        block.classList.add('mermaid-fallback');
      });
    });
})();

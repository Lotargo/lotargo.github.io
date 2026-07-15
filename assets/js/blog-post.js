(function () {
  const currentScript = document.currentScript;
  const scriptUrl = currentScript && currentScript.src ? currentScript.src : '../../assets/js/blog-post.js';
  const imageViewerVersion = '20260715-2';

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

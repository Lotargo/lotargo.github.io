(function () {
  function loadRenderFixes() {
    if (document.querySelector('link[href$="render-fixes.css"]')) return;

    const currentScript = document.currentScript;
    const scriptUrl = currentScript && currentScript.src ? currentScript.src : '../../assets/js/blog-post.js';
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('../css/render-fixes.css', scriptUrl).href;
    document.head.appendChild(link);
  }

  function normalizePostPagination() {
    const pagination = document.querySelector('.post-pagination');
    if (!pagination) return;

    const posts = [
      ['blog-launch', './blog-launch.html', 'How we added the blog and living updates', 'Как мы добавили блог и живые уведомления'],
      ['arithmetic-overfitting', './arithmetic-overfitting.html', 'When a Tiny Mamba Learns Arithmetic', 'Когда маленькая Mamba учится арифметике'],
      ['three-sprints', './three-sprints.html', '1000× Faster Backward Pass', '1000× быстрее backward pass'],
      ['logs-are-not-memory', './logs-are-not-memory.html', 'Logs ≠ Memory', 'Логи ≠ память'],
      ['gemini-safety-filter-layers', './gemini-safety-filter-layers.html', 'The Filter Matryoshka', 'Матрёшка фильтров']
    ];

    const currentFile = window.location.pathname.split('/').pop() || '';
    const currentSlug = currentFile.replace(/\.html$/, '');
    const currentIndex = posts.findIndex((post) => post[0] === currentSlug);
    if (currentIndex === -1) return;

    function addTitleNodes(container, post) {
      const enTitle = document.createElement('strong');
      enTitle.dataset.langContent = 'en';
      enTitle.textContent = post[2];
      container.appendChild(enTitle);

      const ruTitle = document.createElement('strong');
      ruTitle.dataset.langContent = 'ru';
      ruTitle.textContent = post[3];
      container.appendChild(ruTitle);
    }

    function createEnabledLink(direction, post) {
      const link = document.createElement('a');
      link.className = 'post-page-link';
      link.href = post[1];

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
  normalizePostPagination();

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

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const timeout = window.setTimeout(() => {
        script.remove();
        reject(new Error('Timed out loading Mermaid'));
      }, 5000);

      script.src = src;
      script.async = true;
      script.onload = () => {
        window.clearTimeout(timeout);
        resolve();
      };
      script.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error('Failed to load Mermaid'));
      };
      document.head.appendChild(script);
    });
  }

  loadScript('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js')
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

(function () {
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

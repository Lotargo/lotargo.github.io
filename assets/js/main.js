(function () {
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-js="theme-toggle"]');
  const themeLabel = document.querySelector('[data-js="theme-label"]');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function getInitialTheme() {
    try {
      const savedTheme = localStorage.getItem('lotargo-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch (error) {}

    return root.dataset.theme === 'light' ? 'light' : 'dark';
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    if (themeMeta) themeMeta.setAttribute('content', theme === 'light' ? '#f4f1e8' : '#000000');
    if (themeLabel) themeLabel.textContent = theme === 'light' ? 'Dark' : 'Light';
    if (themeToggle) themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);

    try {
      localStorage.setItem('lotargo-theme', theme);
    } catch (error) {}
  }

  setTheme(getInitialTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
    });
  }

  const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
  const grid = document.querySelector('[data-js="project-grid"]');
  const filters = document.querySelector('[data-js="filters"]');

  if (!grid || !filters) return;

  const categories = ['ALL', ...Array.from(new Set(projects.map((project) => project.category))).sort()];
  let activeCategory = 'ALL';

  function safeText(value) {
    return String(value ?? '').replace(/[&<>"]/g, (match) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;'
    }[match]));
  }

  function renderFilters() {
    filters.innerHTML = categories.map((category) => `
      <button class="filter-button ${category === activeCategory ? 'is-active' : ''}" type="button" data-category="${safeText(category)}">
        ${safeText(category)}
      </button>
    `).join('');
  }

  function link(label, url) {
    if (!url) return '';
    return `<a href="${safeText(url)}" target="_blank" rel="noreferrer">${safeText(label)}</a>`;
  }

  function renderProjects() {
    const visibleProjects = activeCategory === 'ALL'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

    grid.innerHTML = visibleProjects.map((project) => {
      const hasImage = !!project.image;
      const cardClass = hasImage ? 'project-card' : 'project-card no-visual';
      const visualHtml = hasImage
        ? `<a href="${safeText(project.landingUrl || project.repoUrl || '#')}" target="_blank" rel="noreferrer" class="project-visual has-image" style="background-image: url('${safeText(project.image)}')" aria-label="Visit ${safeText(project.title)} project website"></a>`
        : '';

      const showLanding = project.landingUrl &&
        (project.landingUrl !== project.repoUrl) &&
        !project.landingUrl.includes('github.com');

      const links = [
        showLanding ? link('Landing', project.landingUrl) : null,
        link('Repository', project.repoUrl),
        link('Demo', project.demoUrl),
        link('Docs', project.docsUrl)
      ].filter(Boolean).join('');

      return `
        <article class="${cardClass}" data-category="${safeText(project.category)}">
          ${visualHtml}
          <div class="card-body">
            <div class="card-top">
              <div class="card-meta">
                <span>${safeText(project.index || '00')}</span>
                <span>${safeText(project.category || 'SYSTEM')}</span>
              </div>
              <h3>${safeText(project.title)}</h3>
              <p>${safeText(project.description)}</p>
              <div class="card-status">${safeText(project.status)}</div>
              <div class="card-proof">Proof: ${safeText(project.proof)}</div>
              <div class="card-stack">Stack: ${safeText(project.stack)}</div>
            </div>
            <div class="card-links">${links}</div>
          </div>
        </article>
      `;
    }).join('');
  }

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-category]');
    if (!button) return;
    activeCategory = button.dataset.category;
    renderFilters();
    renderProjects();
  });

  renderFilters();
  renderProjects();
})();

(function () {
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
      const imageStyle = project.image ? `style="background-image: url('${safeText(project.image)}')"` : '';
      const imageClass = project.image ? 'project-visual has-image' : 'project-visual';
      const links = [
        link('Landing', project.landingUrl),
        link('Repository', project.repoUrl),
        link('Demo', project.demoUrl),
        link('Docs', project.docsUrl)
      ].filter(Boolean).join('');

      return `
        <article class="project-card" data-category="${safeText(project.category)}">
          <div class="${imageClass}" ${imageStyle} data-placeholder="Screenshot slot / add image later"></div>
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

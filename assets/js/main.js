(function () {
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-js="theme-toggle"]');
  const themeLabel = document.querySelector('[data-js="theme-label"]');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const langToggle = document.querySelector('[data-js="lang-toggle"]');
  const langLabel = document.querySelector('[data-js="lang-label"]');

  // 1. Translations dictionary
  const TRANSLATIONS = {
    en: {
      "skip-link": "Skip to projects",
      "nav-systems": "Systems",
      "nav-projects": "Projects",
      "nav-evidence": "Evidence",
      "nav-contact": "Contact",
      "hero-kicker-text": "AI / RAG / Runtime / Verification",
      "hero-line-1": "AI SYSTEMS",
      "hero-line-2": "BUILT OUTSIDE",
      "hero-line-3": "THE TEMPLATE",
      "hero-meta-desc": "Personal technical portfolio of <strong>Oleg Boyko / Lotargo</strong> – experimental AI systems, RAG/vector architecture, low-level runtime work, agentic tooling, and proof-oriented prototypes.",
      "hero-action-view": "View systems",
      "hero-action-github": "GitHub profile",
      "hero-footer-evidence": "Private core / public evidence",
      "hero-footer-static": "Static-first portfolio",
      "systems-label": "01 / positioning",
      "systems-title": "Not a template portfolio. A map of working systems.",
      "systems-lead": "The goal is to show architecture, interfaces, live demos, and technical constraints without exposing private core logic. Visual cards display system details, tech stacks, and active proof layers.",
      "path-label": "Recommended Path:",
      "cap-rag-span": "RAG",
      "cap-rag-title": "Semantic systems",
      "cap-rag-desc": "Retrieval, indexing, metadata flow, source-aware workflows, vector search, and document pipelines.",
      "cap-ai-span": "AI",
      "cap-ai-title": "Runtime experiments",
      "cap-ai-desc": "Custom AI-oriented runtimes, provider routing, low-level constraints, and non-standard execution paths.",
      "cap-lab-span": "LAB",
      "cap-lab-title": "Verification mindset",
      "cap-lab-desc": "Reports, reproducibility packs, explicit boundaries, failure modes, and honest public evidence.",
      "cap-ui-span": "UI",
      "cap-ui-title": "Interfaces that prove",
      "cap-ui-desc": "Landing pages, dashboards, local tools, demos, galleries, and inspection-first product shells.",
      "projects-label": "02 / selected systems",
      "projects-title": "Featured project links",
      "projects-lead": "Core systems, APIs, runtimes, and local toolsets with active repository links and live interfaces.",
      "evidence-label": "03 / public boundary",
      "evidence-title": "Closed source is fine. Empty claims are not.",
      "evidence-lead": "This portfolio is built around a simple split: private implementation can stay private, while public pages should show enough architecture, demos, screenshots, reports, and limits to make each project inspectable.",
      "evidence-p1": "Public landing or dossier for each serious project.",
      "evidence-p2": "Direct links to source repositories, live demos, and technical papers.",
      "evidence-p3": "Claim boundaries and status labels: public, prototype, closed-core, evidence archive.",
      "evidence-p4": "Visual proof layer with interactive screenshots and interface inspection.",
      "contact-label": "04 / contact",
      "contact-title": "Open the lab.",
      "contact-lead": "This page serves as the public entry point, map, and verification layer for the entire system suite.",
      "footer-title": "AI systems · RAG · runtimes · verification",
      "title": "Oleg Boyko / Lotargo – AI Systems Portfolio",
      "meta-desc": "Oleg Boyko / Lotargo – AI systems, RAG architecture, low-level runtime experiments, verification-friendly prototypes.",
      "og-title": "Oleg Boyko / Lotargo – AI Systems Portfolio",
      "og-desc": "Brutalist portfolio: AI systems, RAG architecture, runtime experiments, verification labs, and local-first tools.",
      "theme-light": "Light",
      "theme-dark": "Dark",
      "theme-aria-light": "Switch to light theme",
      "theme-aria-dark": "Switch to dark theme",
      "lang-btn": "RU",
      "lang-aria": "Switch to Russian language",
      "card-proof-label": "Proof: ",
      "card-stack-label": "Stack: ",
      "nav-aria": "Main navigation",
      "hero-title-aria": "AI systems built outside the template",
      "hero-actions-aria": "Primary actions",
      "path-aria": "Recommended path",
      "capabilities-aria": "Capabilities",
      "filters-aria": "Project filters"
    },
    ru: {
      "skip-link": "Перейти к проектам",
      "nav-systems": "Системы",
      "nav-projects": "Проекты",
      "nav-evidence": "Подтверждения",
      "nav-contact": "Контакты",
      "hero-kicker-text": "ИИ / RAG / Среды исполнения / Верификация",
      "hero-line-1": "ИИ-СИСТЕМЫ",
      "hero-line-2": "ВНЕ",
      "hero-line-3": "ШАБЛОНОВ",
      "hero-meta-desc": "Персональное техническое портфолио <strong>Олега Бойко / Lotargo</strong> – экспериментальные ИИ-системы, RAG/векторная архитектура, низкоуровневая работа со средами исполнения, агентные инструменты и прототипы, ориентированные на верификацию.",
      "hero-action-view": "Смотреть системы",
      "hero-action-github": "Профиль GitHub",
      "hero-footer-evidence": "Приватное ядро / публичные доказательства",
      "hero-footer-static": "Статическое портфолио",
      "systems-label": "01 / позиционирование",
      "systems-title": "Не шаблонное портфолио. Карта работающих систем.",
      "systems-lead": "Цель – показать архитектуру, интерфейсы, демо-версии и технические ограничения без раскрытия приватного кода ядра. Карточки содержат сведения о системах, стеках технологий и активных слоях подтверждения.",
      "path-label": "Рекомендуемый маршрут:",
      "cap-rag-span": "RAG",
      "cap-rag-title": "Семантические системы",
      "cap-rag-desc": "Поиск, индексация, потоки метаданных, контекстно-зависимые рабочие процессы, векторный поиск и конвейеры документов.",
      "cap-ai-span": "ИИ",
      "cap-ai-title": "Эксперименты со средами",
      "cap-ai-desc": "Специализированные среды исполнения для ИИ, маршрутизация провайдеров, низкоуровневые ограничения и нестандартные пути выполнения.",
      "cap-lab-span": "ЛАБ",
      "cap-lab-title": "Инженерия верификации",
      "cap-lab-desc": "Отчеты, пакеты воспроизводимости, четкие границы возможностей, режимы сбоев и честные публичные доказательства.",
      "cap-ui-span": "UI",
      "cap-ui-title": "Доказывающие интерфейсы",
      "cap-ui-desc": "Лендинги, дашборды, локальные инструменты, демонстрации, галереи и оболочки продуктов, спроектированные для аудита.",
      "projects-label": "02 / выбранные системы",
      "projects-title": "Ссылки на проекты",
      "projects-lead": "Основные системы, API, рантаймы и локальные инструменты со ссылками на репозитории и работающие интерфейсы.",
      "evidence-label": "03 / публичные границы",
      "evidence-title": "Закрытый исходный код – это нормально. Пустые заявления – нет.",
      "evidence-lead": "Это портфолио построено на простом разделении: приватная реализация может оставаться закрытой, но публичные страницы должны показывать достаточно архитектуры, демо-версий, скриншотов, отчетов и ограничений, чтобы каждый проект поддавался аудиту.",
      "evidence-p1": "Публичный лендинг или досье для каждого серьезного проекта.",
      "evidence-p2": "Прямые ссылки на исходный код репозиториев, демо-версии и технические статьи.",
      "evidence-p3": "Границы заявлений и статусы: public (публичный), prototype (прототип), closed-core (закрытое ядро), evidence archive (архив доказательств).",
      "evidence-p4": "Визуальный слой подтверждения с интерактивными скриншотами и инспекцией интерфейса.",
      "contact-label": "04 / контакты",
      "contact-title": "Открыть лабораторию.",
      "contact-lead": "Эта страница служит публичной точкой входа, картой и верификационным слоем для всего комплекса систем.",
      "footer-title": "ИИ-системы · RAG · среды исполнения · верификация",
      "title": "Олег Бойко / Lotargo – Портфолио ИИ-систем",
      "meta-desc": "Олег Бойко / Lotargo – ИИ-системы, RAG-архитектура, низкоуровневые эксперименты со средами исполнения, прототипы для верификации.",
      "og-title": "Олег Бойко / Lotargo – Портфолио ИИ-систем",
      "og-desc": "Бруталистское портфолио: ИИ-системы, RAG-архитектура, эксперименты со средами исполнения, лаборатории верификации.",
      "theme-light": "Светлая",
      "theme-dark": "Темная",
      "theme-aria-light": "Переключить на светлую тему",
      "theme-aria-dark": "Переключить на темную тему",
      "lang-btn": "EN",
      "lang-aria": "Переключить на английский язык",
      "card-proof-label": "Подтверждение: ",
      "card-stack-label": "Стек: ",
      "nav-aria": "Главная навигация",
      "hero-title-aria": "ИИ-системы, созданные вне шаблонов",
      "hero-actions-aria": "Основные действия",
      "path-aria": "Рекомендуемый маршрут",
      "capabilities-aria": "Направления",
      "filters-aria": "Фильтры проектов"
    }
  };

  const CATEGORY_LABELS = {
    ALL: { en: "ALL", ru: "ВСЕ" },
    AI: { en: "AI", ru: "ИИ" },
    INFRA: { en: "INFRA", ru: "ИНФРА" },
    AGENTIC: { en: "AGENTIC", ru: "АГЕНТЫ" },
    RUNTIME: { en: "RUNTIME", ru: "РАНТАЙМ" },
    UI: { en: "UI", ru: "UI" },
    VERIFY: { en: "VERIFY", ru: "ВЕРИФИКАЦИЯ" }
  };

  // 2. Language State and Switcher
  let currentLang = 'en';

  function getInitialLanguage() {
    try {
      const savedLang = localStorage.getItem('lotargo-lang');
      if (savedLang === 'en' || savedLang === 'ru') return savedLang;
    } catch (error) {}

    return 'en';
  }

  // 3. Theme Manager
  function getInitialTheme() {
    try {
      const savedTheme = localStorage.getItem('lotargo-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch (error) {}

    return 'dark';
  }

  function updateThemeLabel() {
    const theme = root.dataset.theme || 'dark';
    if (themeLabel) {
      themeLabel.textContent = theme === 'light' 
        ? TRANSLATIONS[currentLang]["theme-dark"] 
        : TRANSLATIONS[currentLang]["theme-light"];
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'light' 
        ? TRANSLATIONS[currentLang]["theme-aria-dark"] 
        : TRANSLATIONS[currentLang]["theme-aria-light"]);
    }
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    if (themeMeta) themeMeta.setAttribute('content', theme === 'light' ? '#f4f1e8' : '#000000');
    updateThemeLabel();

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

  // 4. Projects Core Rendering & Filters
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

  function getProp(obj, prop, lang) {
    const val = obj[prop];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      return val[lang] || val['en'] || '';
    }
    return val || '';
  }

  function renderFilters() {
    filters.innerHTML = categories.map((category) => {
      const labelObj = CATEGORY_LABELS[category] || { en: category, ru: category };
      const displayLabel = labelObj[currentLang] || labelObj['en'];
      return `
        <button class="filter-button ${category === activeCategory ? 'is-active' : ''}" type="button" data-category="${safeText(category)}">
          ${safeText(displayLabel)}
        </button>
      `;
    }).join('');
  }

  function link(label, url, className = '') {
    if (!url) return '';
    const classAttr = className ? ` class="${safeText(className)}"` : '';
    return `<a href="${safeText(url)}"${classAttr} target="_blank" rel="noreferrer">${safeText(label)}</a>`;
  }

  function renderProjects() {
    const visibleProjects = activeCategory === 'ALL'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

    grid.innerHTML = visibleProjects.map((project) => {
      const hasImage = !!project.image;
      const hasLongSingleWordTitle = project.title.length > 10 && !/\s/.test(project.title);
      const cardClass = [
        'project-card',
        hasImage ? '' : 'no-visual',
        hasLongSingleWordTitle ? 'long-title' : ''
      ].filter(Boolean).join(' ');
      const visualHtml = hasImage
        ? `<a href="${safeText(project.landingUrl || project.repoUrl || '#')}" target="_blank" rel="noreferrer" class="project-visual has-image" style="background-image: url('${safeText(project.image)}')" aria-label="Visit ${safeText(project.title)} project website"></a>`
        : '';

      const showLanding = project.landingUrl &&
        (project.landingUrl !== project.repoUrl) &&
        !project.landingUrl.includes('github.com');

      const landingText = currentLang === 'ru' ? 'Лендинг' : 'Landing';
      const repoText = currentLang === 'ru' ? 'Репозиторий' : 'Repository';
      const demoText = currentLang === 'ru' ? 'Демо' : 'Demo';
      const docsText = currentLang === 'ru' ? 'Документация' : 'Docs';

      const links = [
        showLanding ? link(landingText, project.landingUrl, 'btn-landing') : null,
        link(repoText, project.repoUrl),
        link(demoText, project.demoUrl),
        link(docsText, project.docsUrl)
      ].filter(Boolean).join('');

      const translatedStatus = getProp(project, 'status', currentLang);
      const translatedDesc = getProp(project, 'description', currentLang);
      const translatedProof = getProp(project, 'proof', currentLang);
      const translatedStack = getProp(project, 'stack', currentLang);

      const proofLabel = TRANSLATIONS[currentLang]["card-proof-label"];
      const stackLabel = TRANSLATIONS[currentLang]["card-stack-label"];

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
              <p>${safeText(translatedDesc)}</p>
              <div class="card-status">${safeText(translatedStatus)}</div>
              <div class="card-proof">${safeText(proofLabel)}${safeText(translatedProof)}</div>
              <div class="card-stack">${safeText(stackLabel)}${safeText(translatedStack)}</div>
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

  // 5. DOM Translation Engine
  function translatePage() {
    // 1. Set HTML lang attribute
    document.documentElement.setAttribute('lang', currentLang);

    // 2. Set metadata
    document.title = TRANSLATIONS[currentLang]["title"];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', TRANSLATIONS[currentLang]["meta-desc"]);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', TRANSLATIONS[currentLang]["og-title"]);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', TRANSLATIONS[currentLang]["og-desc"]);

    // 3. Elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (TRANSLATIONS[currentLang][key]) {
        el.textContent = TRANSLATIONS[currentLang][key];
      }
    });

    // 4. Elements with data-i18n-html
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (TRANSLATIONS[currentLang][key]) {
        el.innerHTML = TRANSLATIONS[currentLang][key];
      }
    });

    // 5. Elements with data-i18n-aria
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (TRANSLATIONS[currentLang][key]) {
        el.setAttribute('aria-label', TRANSLATIONS[currentLang][key]);
      }
    });

    // 6. Update theme toggle labels
    updateThemeLabel();

    // 7. Update language toggle button text and aria-label
    if (langLabel) langLabel.textContent = TRANSLATIONS[currentLang]["lang-btn"];
    if (langToggle) langToggle.setAttribute('aria-label', TRANSLATIONS[currentLang]["lang-aria"]);

    // 8. Re-render projects and filters to apply translated content
    renderFilters();
    renderProjects();
  }

  // 6. Language Toggle Setup
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'ru' : 'en';
      try {
        localStorage.setItem('lotargo-lang', currentLang);
      } catch (error) {}
      translatePage();
    });
  }

  // 7. Bootstrap i18n
  currentLang = getInitialLanguage();
  translatePage();
})();

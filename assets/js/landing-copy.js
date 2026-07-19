(function () {
  const COPY = {
    en: {
      "nav-evidence": "Approach",
      "hero-kicker-text": "AI / RAG / Agentic Systems / Runtime",
      "hero-line-1": "AI SYSTEMS",
      "hero-line-2": "ARCHITECTURE",
      "hero-line-3": "& PROTOTYPES",
      "hero-meta-desc": "Technical portfolio of <strong>Oleg Boyko / Lotargo</strong>: AI system architecture, RAG and document pipelines, agentic workflows, infrastructure services, custom runtimes, and research-driven prototypes.",
      "hero-footer-evidence": "Architecture / implementation / validation",
      "hero-footer-static": "Research to working systems",
      "systems-label": "01 / expertise",
      "systems-title": "Architecture, implementation, and technical validation.",
      "systems-lead": "The projects below cover the path from research hypothesis and system design to a working prototype, usable interface, and documented technical constraints.",
      "cap-rag-title": "Knowledge and retrieval systems",
      "cap-rag-desc": "RAG, indexing, metadata flows, vector search, source-aware workflows, and document processing pipelines.",
      "cap-ai-title": "AI infrastructure and runtimes",
      "cap-ai-desc": "Provider routing, service boundaries, local-first execution, custom runtimes, and performance-oriented implementation.",
      "cap-lab-title": "Reliability and evaluation",
      "cap-lab-desc": "Testing, reproducibility, failure analysis, benchmarks, explicit limitations, and verification-oriented engineering.",
      "cap-ui-title": "Product interfaces",
      "cap-ui-desc": "Landing pages, dashboards, local tools, demos, galleries, and interfaces for technically complex products.",
      "projects-title": "Selected projects",
      "projects-lead": "Working prototypes and public repositories across AI systems, infrastructure, agentic workflows, and developer tools.",
      "evidence-label": "03 / engineering approach",
      "evidence-title": "Technical ambition backed by inspectable work.",
      "evidence-lead": "For each project, I separate what is implemented, what is experimental, and what remains planned. Public materials include repositories, demos, architecture notes, screenshots, benchmarks, and known limitations.",
      "evidence-p1": "Project status, scope, and current limitations are stated explicitly.",
      "evidence-p2": "Repositories, live interfaces, and technical notes are linked where available.",
      "evidence-p3": "Architectural decisions, constraints, and implementation trade-offs are documented.",
      "evidence-p4": "Benchmarks and reproducibility materials are published when they materially support the result.",
      "contact-title": "Let’s discuss the system, not just the stack.",
      "contact-lead": "I am open to work on AI products, RAG and agentic systems, developer tools, infrastructure, and research-heavy prototypes. GitHub and selected project pages are linked below.",
      "footer-title": "AI systems · RAG · agentic workflows · infrastructure",
      "hero-title-aria": "AI systems architecture and working prototypes",
      "title": "Oleg Boyko / Lotargo - AI Systems Portfolio",
      "meta-desc": "Oleg Boyko / Lotargo: AI system architecture, RAG, agentic workflows, infrastructure, custom runtimes, and working technical prototypes.",
      "og-title": "Oleg Boyko / Lotargo - AI Systems Portfolio",
      "og-desc": "AI system architecture, RAG and document pipelines, agentic workflows, infrastructure services, custom runtimes, and working prototypes."
    },
    ru: {
      "nav-evidence": "Подход",
      "hero-kicker-text": "ИИ / RAG / Агентные системы / Рантаймы",
      "hero-line-1": "ИИ-СИСТЕМЫ",
      "hero-line-2": "АРХИТЕКТУРА",
      "hero-line-3": "И ПРОТОТИПЫ",
      "hero-meta-desc": "Техническое портфолио <strong>Олега Бойко / Lotargo</strong>: архитектура ИИ-систем, RAG и документные конвейеры, агентные пайплайны, инфраструктурные сервисы, собственные рантаймы и исследовательские прототипы.",
      "hero-footer-evidence": "Архитектура / реализация / проверка",
      "hero-footer-static": "От исследования к рабочей системе",
      "systems-label": "01 / специализация",
      "systems-title": "Архитектура, реализация и техническая проверка.",
      "systems-lead": "Проекты ниже показывают путь от исследовательской гипотезы и проектирования системы до рабочего прототипа, удобного интерфейса и документированных технических ограничений.",
      "cap-rag-title": "Системы знаний и поиска",
      "cap-rag-desc": "RAG, индексация, потоки метаданных, векторный поиск, работа с источниками и конвейеры обработки документов.",
      "cap-ai-title": "ИИ-инфраструктура и рантаймы",
      "cap-ai-desc": "Маршрутизация провайдеров, границы сервисов, локальное исполнение, собственные рантаймы и оптимизация производительности.",
      "cap-lab-title": "Надёжность и оценка",
      "cap-lab-desc": "Тестирование, воспроизводимость, анализ сбоев, бенчмарки, явные ограничения и инженерная верификация.",
      "cap-ui-title": "Продуктовые интерфейсы",
      "cap-ui-desc": "Лендинги, дашборды, локальные инструменты, демо, галереи и интерфейсы для технически сложных продуктов.",
      "projects-title": "Выбранные проекты",
      "projects-lead": "Рабочие прототипы и публичные репозитории в области ИИ-систем, инфраструктуры, агентных пайплайнов и инструментов разработчика.",
      "evidence-label": "03 / инженерный подход",
      "evidence-title": "Техническая амбициозность, подкреплённая доступными результатами.",
      "evidence-lead": "В каждом проекте я разделяю реализованную часть, экспериментальные решения и дальнейшие планы. Публичные материалы включают репозитории, демо, архитектурные заметки, скриншоты, бенчмарки и известные ограничения.",
      "evidence-p1": "Статус проекта, объём реализации и текущие ограничения указаны явно.",
      "evidence-p2": "Репозитории, работающие интерфейсы и технические материалы доступны по прямым ссылкам.",
      "evidence-p3": "Архитектурные решения, ограничения и компромиссы реализации документируются.",
      "evidence-p4": "Бенчмарки и материалы для воспроизведения публикуются там, где они действительно подтверждают результат.",
      "contact-title": "Обсудим задачу, а не только стек.",
      "contact-lead": "Открыт к работе над ИИ-продуктами, RAG и агентными системами, инструментами разработчика, инфраструктурой и исследовательскими прототипами. Ниже доступны GitHub и страницы выбранных проектов.",
      "footer-title": "ИИ-системы · RAG · агентные пайплайны · инфраструктура",
      "hero-title-aria": "Архитектура ИИ-систем и рабочие прототипы",
      "title": "Олег Бойко / Lotargo - Портфолио ИИ-систем",
      "meta-desc": "Олег Бойко / Lotargo: архитектура ИИ-систем, RAG, агентные пайплайны, инфраструктура, собственные рантаймы и рабочие технические прототипы.",
      "og-title": "Олег Бойко / Lotargo - Портфолио ИИ-систем",
      "og-desc": "Архитектура ИИ-систем, RAG и документные конвейеры, агентные пайплайны, инфраструктурные сервисы, собственные рантаймы и рабочие прототипы."
    }
  };

  function setMeta(selector, value) {
    const element = document.querySelector(selector);
    if (element && value) element.setAttribute('content', value);
  }

  function applyCopy() {
    const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';
    const copy = COPY[lang];

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      if (copy[key]) element.textContent = copy[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach((element) => {
      const key = element.getAttribute('data-i18n-html');
      if (copy[key]) element.innerHTML = copy[key];
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
      const key = element.getAttribute('data-i18n-aria');
      if (copy[key]) element.setAttribute('aria-label', copy[key]);
    });

    document.title = copy.title;
    setMeta('meta[name="description"]', copy['meta-desc']);
    setMeta('meta[property="og:title"]', copy['og-title']);
    setMeta('meta[property="og:description"]', copy['og-desc']);
  }

  applyCopy();

  const languageObserver = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.attributeName === 'lang')) {
      applyCopy();
    }
  });

  languageObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang']
  });
})();

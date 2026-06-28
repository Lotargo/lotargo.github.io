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
      "nav-blog": "Blog",
      "nav-evidence": "Evidence",
      "nav-contact": "Contact",
      "hero-kicker-text": "AI / RAG / Runtime / Verification",
      "hero-line-1": "AI SYSTEMS",
      "hero-line-2": "BUILT OUTSIDE",
      "hero-line-3": "THE TEMPLATE",
      "hero-meta-desc": "Personal technical portfolio of <strong>Oleg Boyko / Lotargo</strong> – experimental AI systems, RAG/vector architecture, low-level runtime work, agentic tooling, and proof-oriented prototypes.",
      "hero-action-view": "View systems",
      "hero-action-blog": "Read blog",
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
      "filters-aria": "Project filters",
      "notifications-title": "Updates",
      "notifications-empty": "No updates yet.",
      "notifications-open": "Open updates",
      "notifications-close": "Close updates",
      "notifications-count": "active",
      "blog-nav-home": "Home",
      "blog-nav-posts": "Posts",
      "blog-page-title": "Lotargo Blog",
      "blog-kicker": "Development notes / architecture / releases",
      "blog-title": "Lotargo Blog",
      "blog-intro": "Notes about AI systems, RAG architecture, runtime experiments, verification work, and the decisions behind public project pages.",
      "blog-posts-label": "01 / posts",
      "blog-posts-title": "Latest notes",
      "blog-posts-lead": "A static archive that can later grow from markdown sources into generated pages.",
      "blog-back-home": "Back home",
      "post-type-site": "Site architecture",
      "post-type-ai": "AI stability",
      "post-first-title": "How we added the blog and living updates",
      "post-first-page-title": "How we added the blog and living updates · Lotargo Blog",
      "post-first-desc": "A practical sample post with screenshots, markdown structure, Mermaid, and LaTeX for future technical notes.",
      "post-read-note": "Read note",
      "post-back-blog": "Back to blog",
      "post-first-lead": "This first article is both an update note and a reusable sample for future technical posts.",
      "post-first-p1": "We added a notification center to the landing page and a dedicated blog section with markdown sources, rendered HTML pages, and a place for post assets.",
      "post-img-notifications-alt": "Landing page with the notification panel open",
      "post-img-notifications-caption": "The landing page now has a static update feed that remembers viewed notifications.",
      "post-section-workflow": "Publishing workflow",
      "post-first-p2": "Instead of adding a protected admin panel, the blog uses a local publishing workflow: write markdown, preview locally, commit the finished version, and let GitHub Pages update the site.",
      "post-section-structure": "Blog structure",
      "post-first-p3": "Markdown source files live in <code>blog/content/</code>, rendered post pages live in <code>blog/posts/</code>, and images for future notes can live in <code>blog/assets/</code>.",
      "post-img-blog-alt": "Blog index page",
      "post-img-blog-caption": "The blog entry point keeps the same visual language as the landing page.",
      "post-section-latex": "LaTeX example",
      "post-first-p4": "Technical articles often need formulas. For example, the publishing cost can be described as:",
      "post-section-template": "What to copy next",
      "post-first-p5": "For a new post, create RU and EN markdown files, put images into the asset folder, preview the page locally, and commit the finished version.",
      "post-pagination-aria": "Post navigation",
      "post-prev": "Previous",
      "post-next": "Next",
      "post-prev-none": "No earlier post",
      "post-next-none": "No later post",
      "post-arith-title": "When a Tiny Mamba Learns Arithmetic",
      "post-arith-page-title": "When a Tiny Mamba Learns Arithmetic · Lotargo Blog",
      "post-arith-desc": "Stability, FPU overflows, plateaus, and exact-match failure modes in a small arithmetic overfit experiment.",
      "post-arith-lead": "A small arithmetic overfit test became a useful probe for recurrent stability, GPU overflows, and optimizer plateaus.",
      "metric-params": "parameters",
      "metric-samples": "samples",
      "metric-loss": "final loss",
      "metric-val-em": "validation EM",
      "post-arith-p1": "The target task was intentionally narrow: train a 6-layer Mamba-style model to overfit 1,000 no-carry two-digit addition examples. The model stayed stable in the final run and answered the sanity check 21+48=69, but exact-match accuracy exposed a deeper protocol problem.",
      "post-arith-runs-title": "Four runs, one stable path",
      "post-arith-runs-p": "Each run isolated a different failure mode: underutilization, recurrent expansion, optimizer overflow, and finally a stable but plateaued configuration.",
      "table-run": "Run",
      "table-outcome": "Outcome",
      "table-no": "No",
      "table-yes": "Yes",
      "run1-outcome": "Manually stopped",
      "run2-outcome": "FPU overflow at epoch 400",
      "run3-outcome": "NaN / FPU overflow",
      "run4-outcome": "Stable to epoch 1000",
      "post-arith-stability-title": "What stability meant",
      "post-arith-stability-p": "The diagonal state transition had to remain contracting. Without projection, the recurrent parameter drifted above zero and the scan became expanding. Clamping kept the state-space core stable, but it did not remove the need for a calmer optimizer.",
      "post-arith-plateau-title": "The plateau",
      "post-arith-plateau-p": "Most of the learning happened early. From epoch 200 to epoch 1000, the loss moved by only 0.0261 points.",
      "chart-loss-title": "Training loss by epoch",
      "post-arith-eval-title": "Why exact match stayed low",
      "post-arith-eval-p": "The model was not random. It often learned the shape of the answer, but exact match punished digit-level approximations and generation truncation as complete failures.",
      "chart-em-title": "Exact match accuracy",
      "chart-errors-title": "Observed error classes",
      "error-offbyone": "Off-by-one digit errors",
      "error-truncation": "Generation truncation",
      "error-noise": "Separator / token noise",
      "post-arith-next-title": "What changes next",
      "post-arith-next-p": "The next experiment should add scratchpad tokens, learning-rate decay on plateaus, a safer generation budget, and separate metrics for off-by-one and truncation errors."
    },
    ru: {
      "skip-link": "Перейти к проектам",
      "nav-systems": "Системы",
      "nav-projects": "Проекты",
      "nav-blog": "Блог",
      "nav-evidence": "Подтверждения",
      "nav-contact": "Контакты",
      "hero-kicker-text": "ИИ / RAG / Среды исполнения / Верификация",
      "hero-line-1": "ИИ-СИСТЕМЫ",
      "hero-line-2": "ВНЕ",
      "hero-line-3": "ШАБЛОНОВ",
      "hero-meta-desc": "Персональное техническое портфолио <strong>Олега Бойко / Lotargo</strong> – экспериментальные ИИ-системы, RAG/векторная архитектура, низкоуровневая работа со средами исполнения, агентные инструменты и прототипы, ориентированные на верификацию.",
      "hero-action-view": "Смотреть системы",
      "hero-action-blog": "Читать блог",
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
      "filters-aria": "Фильтры проектов",
      "notifications-title": "Обновления",
      "notifications-empty": "Пока нет обновлений.",
      "notifications-open": "Открыть обновления",
      "notifications-close": "Закрыть обновления",
      "notifications-count": "активных",
      "blog-nav-home": "Главная",
      "blog-nav-posts": "Посты",
      "blog-page-title": "Блог Lotargo",
      "blog-kicker": "Заметки о разработке / архитектура / релизы",
      "blog-title": "Блог Lotargo",
      "blog-intro": "Заметки об ИИ-системах, RAG-архитектуре, экспериментах со средами исполнения, верификации и решениях за публичными страницами проектов.",
      "blog-posts-label": "01 / посты",
      "blog-posts-title": "Последние заметки",
      "blog-posts-lead": "Статический архив, который позже можно вырастить из markdown-исходников в генерируемые страницы.",
      "blog-back-home": "На главную",
      "post-type-site": "Архитектура сайта",
      "post-type-ai": "Стабильность ИИ",
      "post-first-title": "Как мы добавили блог и живые уведомления",
      "post-first-page-title": "Как мы добавили блог и живые уведомления · Блог Lotargo",
      "post-first-desc": "Практический образец поста со скриншотами, markdown-структурой, Mermaid и LaTeX для будущих технических заметок.",
      "post-read-note": "Читать заметку",
      "post-back-blog": "Назад в блог",
      "post-first-lead": "Эта первая статья одновременно рассказывает об обновлении и служит шаблоном для будущих технических постов.",
      "post-first-p1": "Мы добавили центр уведомлений на главную страницу и отдельный раздел блога с markdown-исходниками, готовыми HTML-страницами и местом для ассетов постов.",
      "post-img-notifications-alt": "Лендинг с раскрытой панелью уведомлений",
      "post-img-notifications-caption": "На лендинге появился статический поток обновлений, который запоминает просмотренные уведомления.",
      "post-section-workflow": "Процесс публикации",
      "post-first-p2": "Вместо защищённой админки блог использует локальный процесс публикации: пишем markdown, смотрим локальный предпросмотр, коммитим готовую версию, а GitHub Pages обновляет сайт.",
      "post-section-structure": "Структура блога",
      "post-first-p3": "Markdown-исходники живут в <code>blog/content/</code>, готовые страницы постов — в <code>blog/posts/</code>, а изображения для будущих заметок могут лежать в <code>blog/assets/</code>.",
      "post-img-blog-alt": "Страница блога",
      "post-img-blog-caption": "Входная страница блога сохраняет тот же визуальный язык, что и лендинг.",
      "post-section-latex": "Пример LaTeX",
      "post-first-p4": "Техническим статьям часто нужны формулы. Например, стоимость публикации можно описать так:",
      "post-section-template": "Что копировать дальше",
      "post-first-p5": "Для нового поста создаём RU и EN markdown-файлы, кладём изображения в папку ассетов, проверяем страницу локально и коммитим готовую версию.",
      "post-pagination-aria": "Навигация по статьям",
      "post-prev": "Предыдущая",
      "post-next": "Следующая",
      "post-prev-none": "Нет более ранней статьи",
      "post-next-none": "Нет более поздней статьи",
      "post-arith-title": "Когда маленькая Mamba учится арифметике",
      "post-arith-page-title": "Когда маленькая Mamba учится арифметике · Блог Lotargo",
      "post-arith-desc": "Стабильность, FPU overflow, плато и exact-match ошибки в маленьком overfit-эксперименте по арифметике.",
      "post-arith-lead": "Небольшой arithmetic overfit стал полезным тестом рекуррентной стабильности, GPU overflow и плато оптимизатора.",
      "metric-params": "параметров",
      "metric-samples": "примеров",
      "metric-loss": "финальный loss",
      "metric-val-em": "validation EM",
      "post-arith-p1": "Задача специально была узкой: обучить 6-слойную Mamba-подобную модель на 1000 примерах сложения двухзначных чисел без переноса. Финальный запуск был стабильным и прошёл sanity-check 21+48=69, но exact-match показал более глубокую проблему протокола.",
      "post-arith-runs-title": "Четыре запуска и один стабильный путь",
      "post-arith-runs-p": "Каждый запуск изолировал свой режим отказа: недогруз GPU, расширяющийся рекуррентный scan, overflow оптимизатора и наконец стабильную, но застрявшую на плато конфигурацию.",
      "table-run": "Запуск",
      "table-outcome": "Итог",
      "table-no": "Нет",
      "table-yes": "Да",
      "run1-outcome": "Остановлен вручную",
      "run2-outcome": "FPU overflow на эпохе 400",
      "run3-outcome": "NaN / FPU overflow",
      "run4-outcome": "Стабильно до эпохи 1000",
      "post-arith-stability-title": "Что значила стабильность",
      "post-arith-stability-p": "Диагональный state transition должен был оставаться сжимающим. Без проекции рекуррентный параметр уходил выше нуля, и scan становился расширяющимся. Clamping стабилизировал state-space ядро, но не отменил необходимость в более спокойном оптимизаторе.",
      "post-arith-plateau-title": "Плато",
      "post-arith-plateau-p": "Основное обучение произошло рано. С 200 по 1000 эпоху loss изменился всего на 0.0261 пункта.",
      "chart-loss-title": "Training loss по эпохам",
      "post-arith-eval-title": "Почему exact match остался низким",
      "post-arith-eval-p": "Модель не отвечала случайно. Она часто схватывала форму ответа, но exact match считал digit-level приближения и truncation генерации полными ошибками.",
      "chart-em-title": "Exact match accuracy",
      "chart-errors-title": "Наблюдаемые классы ошибок",
      "error-offbyone": "Ошибки на одну цифру",
      "error-truncation": "Обрезанная генерация",
      "error-noise": "Шум разделителей / токенов",
      "post-arith-next-title": "Что меняется дальше",
      "post-arith-next-p": "Следующий эксперимент должен добавить scratchpad-токены, decay learning rate на плато, более безопасный бюджет генерации и отдельные метрики для off-by-one и truncation ошибок."
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

  // 4. Static notification center
  const notifications = Array.isArray(window.PORTFOLIO_NOTIFICATIONS) ? window.PORTFOLIO_NOTIFICATIONS : [];
  const notificationRoot = document.querySelector('[data-js="notifications"]');
  const notificationToggle = document.querySelector('[data-js="notification-toggle"]');
  const notificationPanel = document.querySelector('[data-js="notification-panel"]');
  const notificationBadge = document.querySelector('[data-js="notification-badge"]');
  const notificationCount = document.querySelector('[data-js="notification-count"]');
  const notificationList = document.querySelector('[data-js="notification-list"]');
  const seenNotificationKey = 'lotargo-seen-notifications';

  function getSeenNotificationIds() {
    try {
      const parsed = JSON.parse(localStorage.getItem(seenNotificationKey) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function setSeenNotificationIds(ids) {
    try {
      localStorage.setItem(seenNotificationKey, JSON.stringify(Array.from(new Set(ids))));
    } catch (error) {}
  }

  function getUnseenNotifications() {
    const seenIds = new Set(getSeenNotificationIds());
    return notifications.filter((item) => !seenIds.has(item.id));
  }

  function updateNotificationBadge() {
    if (!notificationBadge || !notificationCount || !notificationToggle) return;
    const unseenCount = getUnseenNotifications().length;
    notificationBadge.textContent = String(unseenCount);
    notificationBadge.hidden = unseenCount === 0;
    notificationCount.textContent = `${unseenCount} ${TRANSLATIONS[currentLang]["notifications-count"]}`;
    notificationToggle.setAttribute(
      'aria-label',
      notificationPanel && !notificationPanel.hidden
        ? TRANSLATIONS[currentLang]["notifications-close"]
        : TRANSLATIONS[currentLang]["notifications-open"]
    );
    notificationToggle.setAttribute('aria-expanded', notificationPanel && !notificationPanel.hidden ? 'true' : 'false');
  }

  function renderNotifications() {
    if (!notificationList) return;

    if (!notifications.length) {
      notificationList.innerHTML = `<p class="notification-empty">${safeText(TRANSLATIONS[currentLang]["notifications-empty"])}</p>`;
      updateNotificationBadge();
      return;
    }

    notificationList.innerHTML = notifications.map((item) => {
      const type = getProp(item, 'type', currentLang);
      const title = getProp(item, 'title', currentLang);
      const text = getProp(item, 'text', currentLang);
      const url = item.url || '#';

      return `
        <a class="notification-item" href="${safeText(url)}">
          <span class="notification-meta">${safeText(item.date)} / ${safeText(type)}</span>
          <strong>${safeText(title)}</strong>
          <span>${safeText(text)}</span>
        </a>
      `;
    }).join('');

    updateNotificationBadge();
  }

  function openNotificationPanel() {
    if (!notificationPanel) return;
    notificationPanel.hidden = false;
    setSeenNotificationIds([
      ...getSeenNotificationIds(),
      ...notifications.map((item) => item.id)
    ]);
    updateNotificationBadge();
  }

  function closeNotificationPanel() {
    if (!notificationPanel) return;
    notificationPanel.hidden = true;
    updateNotificationBadge();
  }

  if (notificationToggle && notificationPanel) {
    notificationToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      if (notificationPanel.hidden) {
        openNotificationPanel();
      } else {
        closeNotificationPanel();
      }
    });

    document.addEventListener('click', (event) => {
      if (!notificationRoot || notificationRoot.contains(event.target)) return;
      closeNotificationPanel();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNotificationPanel();
    });
  }

  // 5. Projects Core Rendering & Filters
  const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
  const grid = document.querySelector('[data-js="project-grid"]');
  const filters = document.querySelector('[data-js="filters"]');

  const categories = ['ALL', ...Array.from(new Set(projects.map((project) => project.category))).sort()];
  let activeCategory = 'ALL';

  function renderFilters() {
    if (!filters) return;
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
    if (!grid) return;
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

  if (filters) {
    filters.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-category]');
      if (!button) return;
      activeCategory = button.dataset.category;
      renderFilters();
      renderProjects();
    });
  }

  // 6. DOM Translation Engine
  function translatePage() {
    const hasPageTranslations = !!document.querySelector('[data-i18n], [data-i18n-html], [data-i18n-aria], [data-i18n-attr-alt], [data-lang-content]');
    const isLandingPage = !!document.querySelector('[data-js="project-grid"]');

    // 1. Set HTML lang attribute
    if (hasPageTranslations) {
      document.documentElement.setAttribute('lang', currentLang);
    }

    // 2. Set metadata
    if (hasPageTranslations && isLandingPage) {
      document.title = TRANSLATIONS[currentLang]["title"];
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', TRANSLATIONS[currentLang]["meta-desc"]);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', TRANSLATIONS[currentLang]["og-title"]);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', TRANSLATIONS[currentLang]["og-desc"]);
    }

    const pageTitleKey = document.body?.dataset.titleI18n;
    if (!isLandingPage && pageTitleKey && TRANSLATIONS[currentLang][pageTitleKey]) {
      document.title = TRANSLATIONS[currentLang][pageTitleKey];
    }

    if (!isLandingPage && !pageTitleKey) {
      const localizedTitle = currentLang === 'ru' ? document.body?.dataset.titleRu : document.body?.dataset.titleEn;
      if (localizedTitle) document.title = localizedTitle;
    }

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

    document.querySelectorAll('[data-i18n-attr-alt]').forEach((el) => {
      const key = el.getAttribute('data-i18n-attr-alt');
      if (TRANSLATIONS[currentLang][key]) {
        el.setAttribute('alt', TRANSLATIONS[currentLang][key]);
      }
    });

    document.querySelectorAll('[data-lang-content]').forEach((el) => {
      el.hidden = el.getAttribute('data-lang-content') !== currentLang;
    });

    // 6. Update theme toggle labels
    updateThemeLabel();

    // 7. Update language toggle button text and aria-label
    if (langLabel) langLabel.textContent = TRANSLATIONS[currentLang]["lang-btn"];
    if (langToggle) langToggle.setAttribute('aria-label', TRANSLATIONS[currentLang]["lang-aria"]);

    // 8. Re-render dynamic content to apply translated content
    renderNotifications();
    renderFilters();
    renderProjects();
  }

  // 7. Language Toggle Setup
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'ru' : 'en';
      try {
        localStorage.setItem('lotargo-lang', currentLang);
      } catch (error) {}
      translatePage();
    });
  }

  // 8. Bootstrap i18n
  currentLang = getInitialLanguage();
  translatePage();
})();

(function () {
  const currentScript = document.currentScript;
  const COPY = {
    en: {
      "skip-link": "Skip to projects",
      "nav-systems": "Systems",
      "nav-projects": "Projects",
      "nav-blog": "Blog",
      "nav-evidence": "Approach",
      "nav-contact": "Contact",
      "nav-aria": "Main navigation",
      "notifications-title": "Updates",
      "hero-kicker-text": "Ideas / Systems / Experiments / Tools",
      "hero-line-1": "THINGS",
      "hero-line-2": "WORTH",
      "hero-line-3": "USING.",
      "hero-meta-desc": "Projects, experiments, and systems grown from curiosity, practical problems, and the desire to carry interesting ideas all the way into something that works.",
      "hero-action-view": "View projects",
      "hero-action-blog": "Read blog",
      "hero-action-github": "GitHub",
      "hero-footer-evidence": "Idea / experiment / implementation",
      "hero-footer-static": "From the first question to a working system",
      "personal-note-aria": "Personal note",
      "personal-p1": "Programming has a lot in common with music.",
      "personal-p2": "Here too, composition, rhythm, and style matter. Once you understand the instruments and can use them freely, things that once seemed impossible become achievable — and that makes it possible to go further, trying again for what still seems impossible.",
      "personal-p3": "My path into this profession began after many years centered around creative work. But this is where I unexpectedly found the thing I wanted to give myself to completely.",
      "systems-label": "Where it begins",
      "systems-title": "Complex systems rarely begin with a complex solution.",
      "systems-lead": "Sometimes it starts with searching through documents. Sometimes with the need to connect several models, services, and states into one coherent flow. And sometimes a strange technical question simply refuses to go away: “what if this were done completely differently?” Those questions gradually turn into architecture, code, interfaces, and experiments. If an idea survives contact with reality, it becomes a tool someone can actually use.",
      "cap-rag-span": "RAG",
      "cap-rag-title": "Search and knowledge",
      "cap-rag-desc": "When ordinary search stops being enough, the problem becomes not only the data itself, but how a system understands its relationships, origin, and context. RAG, vector search, indexing, metadata, and document processing become parts of one mechanism rather than goals of their own.",
      "cap-ai-span": "SYS",
      "cap-ai-title": "Infrastructure and runtimes",
      "cap-ai-desc": "Sometimes the hardest problem is not inside the model at all, but around it: routing, state, service boundaries, call cost, local execution, or performance. Those are the moments when it becomes useful to go below familiar abstractions and see what the system truly needs.",
      "cap-lab-span": "LAB",
      "cap-lab-title": "Testing and experiments",
      "cap-lab-desc": "A good idea does not stop being an experiment just because it worked once. That is why implementations are followed by tests, reproducible scenarios, benchmarks, and deliberate attempts to find the conditions under which everything breaks.",
      "cap-ui-span": "UI",
      "cap-ui-title": "Interfaces",
      "cap-ui-desc": "Even the most complicated system eventually meets a person. At that point architecture has to become a clear interface: a gallery, dashboard, local tool, demo, or simply a page that does not require reading the documentation first.",
      "capabilities-aria": "Areas of work",
      "projects-label": "What came out of it",
      "projects-title": "Some ideas are worth taking all the way. Others only need to go far enough to show what they can do.",
      "projects-lead": "Finished tools, research systems, and small experiments live side by side here. They started for different reasons and solve very different problems, but each of them once began with one simple question: “will this work?”",
      "filters-aria": "Project filters",
      "evidence-label": "When the idea already works",
      "evidence-title": "A working result is more interesting than a beautiful hypothesis.",
      "evidence-lead": "That is why projects keep more than their best screenshots. Architecture decisions, limitations, tests, failed directions, and experimental results are part of the work too — sometimes they explain the final system better than the polished result ever could.",
      "evidence-p1": "<strong>Show what actually works.</strong> Project status and the boundaries of the current implementation should be clear without having to read between the lines.",
      "evidence-p2": "<strong>Do not hide the limits.</strong> Every experiment has conditions where it stops working. That can be just as useful as a successful result.",
      "evidence-p3": "<strong>Explain the architecture when it matters.</strong> Sometimes one diagram or technical note says more about a system than ten polished screenshots.",
      "evidence-p4": "<strong>Test ideas in practice.</strong> If a result depends on performance, accuracy, or reproducibility, it is better to measure it than describe it with adjectives.",
      "contact-label": "If you feel like continuing the conversation",
      "contact-title": "Let’s discuss the problem, not just the stack.",
      "contact-lead": "If something here feels familiar, or there is an idea that would be interesting to try turning into a real system, Telegram or email are the easiest ways to get in touch. For technical context, GitHub usually says more than can fit on a single page.",
      "footer-title": "Ideas · experiments · working systems",
      "hero-title-aria": "Things worth using",
      "hero-actions-aria": "Primary actions",
      "title": "Oleg Boiko / Lotargo — Projects & Experiments",
      "meta-desc": "Projects by Oleg Boiko / Lotargo: practical AI systems, RAG and retrieval infrastructure, experimental runtimes, developer tools, and research prototypes.",
      "og-title": "Oleg Boiko / Lotargo — Projects & Experiments",
      "og-desc": "Practical AI systems, experimental runtimes, retrieval infrastructure, developer tools, and projects grown from technical curiosity."
    },
    ru: {
      "skip-link": "Перейти к проектам",
      "nav-systems": "Системы",
      "nav-projects": "Проекты",
      "nav-blog": "Блог",
      "nav-evidence": "Подход",
      "nav-contact": "Контакты",
      "nav-aria": "Основная навигация",
      "notifications-title": "Обновления",
      "hero-kicker-text": "Идеи / Системы / Эксперименты / Инструменты",
      "hero-line-1": "ВЕЩИ, КОТОРЫМИ",
      "hero-line-2": "ХОЧЕТСЯ",
      "hero-line-3": "ПОЛЬЗОВАТЬСЯ.",
      "hero-meta-desc": "Здесь собраны проекты, эксперименты и системы, выросшие из любопытства, практических задач и желания доводить интересные идеи до работающего состояния.",
      "hero-action-view": "Смотреть проекты",
      "hero-action-blog": "Читать блог",
      "hero-action-github": "GitHub",
      "hero-footer-evidence": "Идея / эксперимент / реализация",
      "hero-footer-static": "От первого вопроса к работающей системе",
      "personal-note-aria": "Личный фрагмент",
      "personal-p1": "Программирование во многом похоже на музыку.",
      "personal-p2": "Здесь тоже важно чувствовать композицию, ритм и стиль. Когда начинаешь понимать инструменты и свободно ими пользоваться, вещи, которые раньше казались невозможными, становятся выполнимыми — и это позволяет идти дальше, снова пробуя совершить то, что ещё недавно казалось невозможным.",
      "personal-p3": "Мой путь в эту профессию начался после многих лет, связанных с творчеством. Но именно здесь неожиданно нашлось дело, которому захотелось посвятить себя целиком.",
      "systems-label": "С чего всё начинается",
      "systems-title": "Сложные системы редко начинаются со сложного решения.",
      "systems-lead": "Иногда всё начинается с поиска по документам. Иногда — с необходимости связать несколько моделей, сервисов и состояний в единый контур. А иногда достаточно странного технического вопроса, который не даёт покоя: «а что, если попробовать сделать это совсем иначе?» Такие вопросы постепенно превращаются в архитектуру, код, интерфейсы и эксперименты. Если идея выдерживает столкновение с реальностью — из неё появляется инструмент, которым уже можно пользоваться.",
      "cap-rag-span": "RAG",
      "cap-rag-title": "Поиск и знания",
      "cap-rag-desc": "Когда информации становится слишком много для обычного поиска, приходится думать уже не только о данных, но и о том, как система понимает их связи, происхождение и контекст. RAG, векторный поиск, индексация, метаданные и обработка документов здесь становятся не целью сами по себе, а деталями одного механизма.",
      "cap-ai-span": "SYS",
      "cap-ai-title": "Инфраструктура и рантаймы",
      "cap-ai-desc": "Иногда главная проблема находится не в самой модели, а вокруг неё: маршрутизация, состояние, границы сервисов, стоимость вызовов, локальное исполнение или производительность. В таких задачах особенно интересно спускаться ниже привычных абстракций и разбираться, что действительно необходимо системе для работы.",
      "cap-lab-span": "LAB",
      "cap-lab-title": "Проверка и эксперименты",
      "cap-lab-desc": "Хорошая идея не перестаёт быть экспериментом только потому, что однажды успешно запустилась. Поэтому рядом с реализацией появляются тесты, воспроизводимые сценарии, бенчмарки и попытки найти условия, при которых всё сломается.",
      "cap-ui-span": "UI",
      "cap-ui-title": "Интерфейсы",
      "cap-ui-desc": "Даже самая сложная система в какой-то момент встречается с человеком. И тогда архитектура должна превратиться в понятный интерфейс: галерею, панель управления, локальный инструмент, демо или просто страницу, где не приходится сначала читать документацию, чтобы понять, что происходит.",
      "capabilities-aria": "Направления работы",
      "projects-label": "То, что получилось в результате",
      "projects-title": "Некоторые идеи стоит довести до конца. Другие — хотя бы достаточно далеко, чтобы понять, на что они способны.",
      "projects-lead": "Здесь соседствуют законченные инструменты, исследовательские системы и небольшие эксперименты. Они появились по разным причинам и решают совершенно разные задачи, но каждый из них когда-то начинался с простого вопроса: «а получится ли?»",
      "filters-aria": "Фильтры проектов",
      "evidence-label": "Когда идея уже заработала",
      "evidence-title": "Работающий результат интереснее красивой гипотезы.",
      "evidence-lead": "Поэтому рядом с проектами остаются не только удачные скриншоты. Архитектурные решения, ограничения, тесты, неудачные направления и результаты экспериментов тоже являются частью работы — иногда именно они лучше всего объясняют, почему система получилась такой, какой получилась.",
      "evidence-p1": "<strong>Показывать то, что действительно работает.</strong> Статус проекта и границы текущей реализации должны быть понятны без необходимости угадывать их между строк.",
      "evidence-p2": "<strong>Не прятать ограничения.</strong> У любого эксперимента есть условия, в которых он перестаёт работать. Это не менее полезная информация, чем успешный результат.",
      "evidence-p3": "<strong>Объяснять архитектуру, когда она важна.</strong> Иногда одна схема или техническая заметка рассказывает о системе больше, чем десяток красивых скриншотов.",
      "evidence-p4": "<strong>Проверять идеи на практике.</strong> Если результат действительно зависит от производительности, точности или воспроизводимости, его лучше измерить, чем описывать прилагательными.",
      "contact-label": "Если захочется продолжить разговор",
      "contact-title": "Обсудим задачу, а не только стек.",
      "contact-lead": "Если среди этих проектов нашлось что-то близкое по духу или появилась идея, которую было бы интересно попробовать реализовать, связаться проще всего через Telegram или email. Для технического контекста всегда остаётся GitHub — там обычно можно увидеть гораздо больше, чем помещается на одной странице.",
      "footer-title": "Идеи · эксперименты · работающие системы",
      "hero-title-aria": "Вещи, которыми хочется пользоваться",
      "hero-actions-aria": "Основные действия",
      "title": "Олег Бойко / Lotargo — проекты, эксперименты и AI-системы",
      "meta-desc": "Проекты Олега Бойко / Lotargo: практические AI-системы, RAG и retrieval infrastructure, экспериментальные runtimes, developer tools и исследовательские прототипы.",
      "og-title": "Oleg Boiko / Lotargo — Projects & Experiments",
      "og-desc": "Практические AI-системы, экспериментальные runtimes, retrieval infrastructure, developer tools и проекты, выросшие из технического любопытства."
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

  function telegramIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '17');
    svg.setAttribute('height', '17');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      'M21.7 3.3 18.5 19c-.2 1.1-.8 1.4-1.7.9l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.8-8c.4-.4-.1-.6-.6-.2L6.3 13l-4.7-1.5c-1-.3-1-1 .2-1.5l18.4-7.1c.9-.3 1.7.2 1.5 1.4Z'
    );
    svg.appendChild(path);
    return svg;
  }

  function addLocalizedLabel(parent, en, ru) {
    const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';

    const enLabel = document.createElement('span');
    enLabel.dataset.langContent = 'en';
    enLabel.textContent = en;
    enLabel.hidden = lang !== 'en';
    parent.appendChild(enLabel);

    const ruLabel = document.createElement('span');
    ruLabel.dataset.langContent = 'ru';
    ruLabel.textContent = ru;
    ruLabel.hidden = lang !== 'ru';
    parent.appendChild(ruLabel);
  }

  function createTelegramLink(className, en, ru, ariaLabel) {
    const link = document.createElement('a');
    link.className = className;
    link.href = 'https://t.me/lotargo_blog';
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.setAttribute('aria-label', ariaLabel);
    link.dataset.telegramUi = 'true';
    link.appendChild(telegramIcon());
    addLocalizedLabel(link, en, ru);
    return link;
  }

  function ensureTelegramStyles() {
    if (document.querySelector('link[data-telegram-ui-styles]')) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.dataset.telegramUiStyles = 'true';
    link.href = new URL('../css/telegram.css?v=20260728-1', currentScript?.src || window.location.href).href;
    document.head.appendChild(link);
  }

  function ensureLandingTelegramUi() {
    const controls = document.querySelector('.header-controls');
    const githubLink = controls?.querySelector('.github-link');

    if (controls && githubLink && !controls.querySelector('[data-telegram-header-link]')) {
      let socials = controls.querySelector('.header-socials');
      if (!socials) {
        socials = document.createElement('div');
        socials.className = 'header-socials';
        socials.dataset.telegramUi = 'true';
        githubLink.before(socials);
        socials.appendChild(githubLink);
      }

      const telegramLink = createTelegramLink(
        'telegram-channel-link',
        'Telegram',
        'Telegram',
        'Open the Russian Telegram channel'
      );
      telegramLink.dataset.telegramHeaderLink = 'true';
      socials.appendChild(telegramLink);
    }

    const actions = document.querySelector('.hero-actions');
    if (actions && !actions.querySelector('[data-telegram-landing-action]')) {
      const link = createTelegramLink(
        'button telegram-action',
        'Telegram',
        'Telegram',
        'Open the Russian Telegram channel'
      );
      link.dataset.telegramLandingAction = 'true';
      actions.appendChild(link);
    }
  }

  function revealLandingPage() {
    document.documentElement.dataset.landingCopyReady = 'true';
    document.documentElement.dataset.landingShellReady = 'true';
  }

  function loadTelegramUi() {
    if (window.__LOTARGO_TELEGRAM_UI__ || document.querySelector('script[data-telegram-ui-loader]')) return;

    const script = document.createElement('script');
    script.dataset.telegramUiLoader = 'true';
    script.src = new URL('telegram-ui.js?v=20260728-1', currentScript?.src || window.location.href).href;
    script.async = true;
    document.head.appendChild(script);
  }

  ensureTelegramStyles();
  ensureLandingTelegramUi();
  applyCopy();
  revealLandingPage();
  loadTelegramUi();

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
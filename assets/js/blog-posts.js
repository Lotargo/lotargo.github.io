/*
  Shared blog metadata manifest.

  This file is the first single source of truth for static blog affordances:
  - previous / next post navigation;
  - landing-page notifications for posts with notify: true;
  - later: blog index rendering and a full markdown build pipeline.
*/

window.BLOG_POSTS = [
  {
    slug: 'blog-launch',
    date: '2026-06-28',
    notificationId: '2026-06-28-blog-scaffold',
    href: './blog-launch.html',
    url: './blog/posts/blog-launch.html',
    type: {
      en: 'Site architecture',
      ru: 'Архитектура сайта'
    },
    title: {
      en: 'How we added the blog and living updates',
      ru: 'Как мы добавили блог и живые уведомления'
    },
    shortTitle: {
      en: 'Blog scaffold is live',
      ru: 'Заготовка блога готова'
    },
    description: {
      en: 'The first sample post: blog structure, static notifications, assets, Mermaid, and LaTeX for future technical notes.',
      ru: 'Первый образец поста: структура блога, статические уведомления, ассеты, Mermaid и LaTeX для будущих технических заметок.'
    },
    notificationText: {
      en: 'A new writing space for development notes, architecture decisions, and project updates.',
      ru: 'Новое место для заметок о разработке, архитектурных решениях и обновлениях проектов.'
    },
    notify: true
  },
  {
    slug: 'arithmetic-overfitting',
    date: '2026-06-28',
    href: './arithmetic-overfitting.html',
    url: './blog/posts/arithmetic-overfitting.html',
    type: {
      en: 'AI stability',
      ru: 'Стабильность ИИ'
    },
    title: {
      en: 'When a Tiny Mamba Learns Arithmetic',
      ru: 'Когда маленькая Mamba учится арифметике'
    },
    shortTitle: {
      en: 'Arithmetic stability article',
      ru: 'Статья о стабильности арифметики'
    },
    description: {
      en: 'A technical article about overfitting a 380k parameter Mamba model on two-digit addition, GPU overflow failure modes, state-space stability, and why the final plateau mattered.',
      ru: 'Техническая статья об overfit-эксперименте: 380k-параметровая Mamba на сложении двухзначных чисел, GPU overflow, стабильность state-space динамики и плато обучения.'
    },
    notificationText: {
      en: 'A technical post on Mamba overfitting, FPU overflows, plateaus, and exact-match errors.',
      ru: 'Технический пост о Mamba overfit, FPU overflow, плато и exact-match ошибках.'
    },
    notify: true
  },
  {
    slug: 'three-sprints',
    date: '2026-06-29',
    href: './three-sprints.html',
    url: './blog/posts/three-sprints.html',
    type: {
      en: 'AI systems',
      ru: 'AI системы'
    },
    title: {
      en: '1000× Faster Backward Pass: Three Sprints That Reshaped the Training Pipeline',
      ru: '1000× быстрее backward pass: три спринта, перестроившие пайплайн обучения'
    },
    shortTitle: {
      en: '1000× Faster Backward Pass',
      ru: '1000× быстрее backward pass'
    },
    description: {
      en: 'How three optimisation sprints eliminated CPU bottlenecks, GPU allocation spikes, and a stubborn loss plateau in a Mamba-3 training pipeline.',
      ru: 'Как три спринта оптимизации устранили CPU-бутылочные горлышки, скачки аллокаций GPU и упрямое плато потерь в пайплайне обучения Mamba-3.'
    },
    notify: false
  },
  {
    slug: 'logs-are-not-memory',
    date: '2026-06-29',
    href: './logs-are-not-memory.html',
    url: './blog/posts/logs-are-not-memory.html',
    type: {
      en: 'Research infrastructure',
      ru: 'Исследовательская инфраструктура'
    },
    title: {
      en: 'Logs ≠ Memory: Why Research Projects Need ClickHouse',
      ru: 'Логи ≠ память: зачем исследовательским проектам ClickHouse'
    },
    shortTitle: {
      en: 'Logs ≠ Memory',
      ru: 'Логи ≠ память'
    },
    description: {
      en: 'Why experimental systems need DS/ML tooling, why PostgreSQL and ClickHouse serve different kinds of memory, and how verification bundles turn telemetry into evidence.',
      ru: 'Почему экспериментальным системам нужен DS/ML-слой, чем память состояния отличается от памяти наблюдений, и как verification bundles превращают телеметрию в доказательства.'
    },
    notify: false
  },
  {
    slug: 'gemini-safety-filter-layers',
    date: '2026-07-08',
    href: './gemini-safety-filter-layers.html',
    url: './blog/posts/gemini-safety-filter-layers.html',
    type: {
      en: 'Safety architecture',
      ru: 'Архитектура safety'
    },
    title: {
      en: 'The Filter Matryoshka: Notes on Gemini Safety Layers',
      ru: 'Матрёшка фильтров: заметки о safety-слоях Gemini'
    },
    shortTitle: {
      en: 'The Filter Matryoshka',
      ru: 'Матрёшка фильтров'
    },
    notificationTitle: {
      en: 'Gemini safety layers note',
      ru: 'Заметка о safety-слоях Gemini'
    },
    description: {
      en: 'A defensive note about input moderation, reasoning traces, final-output filters, and why LLM safety systems should not depend on a single layer.',
      ru: 'Defensive-разбор input moderation, reasoning-трасс, финального output-фильтра и того, почему безопасная LLM-система не должна зависеть от одного слоя.'
    },
    notificationText: {
      en: 'A defensive article on input moderation, reasoning traces, final-output filters, and control-plane gaps.',
      ru: 'Defensive-статья про input moderation, reasoning-трассы, финальный output-фильтр и разрывы control plane.'
    },
    notify: true
  },
  {
    slug: 'testing-web-app-ai-sandbox',
    date: '2026-07-10',
    href: './testing-web-app-ai-sandbox.html',
    url: './blog/posts/testing-web-app-ai-sandbox.html',
    type: {
      en: 'AI-assisted development',
      ru: 'AI-разработка'
    },
    title: {
      en: 'Coding Without Codex: How Far Regular ChatGPT Can Go',
      ru: 'Код без Codex: как далеко можно зайти в обычном ChatGPT'
    },
    shortTitle: {
      en: 'Coding without Codex',
      ru: 'Код без Codex'
    },
    notificationTitle: {
      en: 'New note on coding in regular ChatGPT',
      ru: 'Новая заметка о разработке в обычном ChatGPT'
    },
    description: {
      en: 'How much repository work, backend testing, and browser verification can be done in regular ChatGPT Chat without spending the shared Codex and Work agentic allowance.',
      ru: 'Сколько работы с репозиторием, backend-тестами и браузером можно выполнить в обычном ChatGPT Chat без расхода общего агентского лимита Codex и Work.'
    },
    notificationText: {
      en: 'A practical capability map for GitHub connectors, sandbox tests, Chromium, and deciding when Codex is actually necessary.',
      ru: 'Практическая карта GitHub-коннекторов, тестов в песочнице, Chromium и границы, после которой действительно нужен Codex.'
    },
    notify: true
  },
  {
    slug: 'visual-novel-ai-game',
    date: '2026-07-15',
    notificationId: '2026-07-15-visual-novel-ai-game',
    href: './visual-novel-ai-game.html',
    url: './blog/posts/visual-novel-ai-game.html',
    type: {
      en: 'AI game development',
      ru: 'Разработка AI-игры'
    },
    title: {
      en: 'Visual Novel: Starting an AI Game That Breaks the Fourth Wall',
      ru: 'Visual Novel: начинаю разработку AI-игры, которая ломает четвёртую стену'
    },
    shortTitle: {
      en: 'Starting Visual Novel',
      ru: 'Начинаю Visual Novel'
    },
    notificationTitle: {
      en: 'A new AI visual novel project',
      ru: 'Новый проект AI-визуальной новеллы'
    },
    description: {
      en: 'A new project combining free AI dialogue, persistent character memory, dynamic visual scenes, interactive choices, ComfyUI generation, and adaptive music.',
      ru: 'Новый проект, объединяющий свободный диалог с ИИ, память персонажа, динамические визуальные сцены, интерактивный выбор, генерацию через ComfyUI и адаптивную музыку.'
    },
    notificationText: {
      en: 'The first public concept note: scene-first UX, layered and cinematic modes, music, memory, and the path from MVP to Steam.',
      ru: 'Первая публичная концепция: scene-first UX, составной и cinematic-режимы, музыка, память и путь от MVP до Steam.'
    },
    notify: true
  }
];

window.BLOG_SITE_NOTIFICATIONS = [
  {
    id: '2026-06-28-portfolio-updates',
    date: '2026-06-28',
    type: {
      en: 'Update',
      ru: 'Обновление'
    },
    title: {
      en: 'Living portfolio layer',
      ru: 'Живой слой портфолио'
    },
    text: {
      en: 'The landing now has a static notification center that remembers viewed updates.',
      ru: 'На лендинге появился статический центр уведомлений, который запоминает просмотренные обновления.'
    },
    url: '#top'
  }
];

if (typeof window.BLOG_BUILD_NOTIFICATIONS === 'function') {
  window.BLOG_BUILD_NOTIFICATIONS();
}

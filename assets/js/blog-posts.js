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

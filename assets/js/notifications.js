/*
  Static update feed for the portfolio notification center.
  Use stable IDs so localStorage can remember which items were seen.
*/

window.PORTFOLIO_NOTIFICATIONS = [
  {
    id: "2026-07-08-gemini-safety-filter-layers",
    date: "2026-07-08",
    type: {
      en: "Blog",
      ru: "Блог"
    },
    title: {
      en: "Gemini safety layers note",
      ru: "Заметка о safety-слоях Gemini"
    },
    text: {
      en: "A defensive article on input moderation, reasoning traces, final-output filters, and control-plane gaps.",
      ru: "Defensive-статья про input moderation, reasoning-трассы, финальный output-фильтр и разрывы control plane."
    },
    url: "./blog/posts/gemini-safety-filter-layers.html"
  },
  {
    id: "2026-06-28-arithmetic-overfitting",
    date: "2026-06-28",
    type: {
      en: "Blog",
      ru: "Блог"
    },
    title: {
      en: "Arithmetic stability article",
      ru: "Статья о стабильности арифметики"
    },
    text: {
      en: "A new technical post on Mamba overfitting, FPU overflows, plateaus, and exact-match errors.",
      ru: "Новый технический пост о Mamba overfit, FPU overflow, плато и exact-match ошибках."
    },
    url: "./blog/posts/arithmetic-overfitting.html"
  },
  {
    id: "2026-06-28-blog-scaffold",
    date: "2026-06-28",
    type: {
      en: "Site",
      ru: "Сайт"
    },
    title: {
      en: "Blog scaffold is live",
      ru: "Заготовка блога готова"
    },
    text: {
      en: "A new writing space for development notes, architecture decisions, and project updates.",
      ru: "Новое место для заметок о разработке, архитектурных решениях и обновлениях проектов."
    },
    url: "./blog/"
  },
  {
    id: "2026-06-28-portfolio-updates",
    date: "2026-06-28",
    type: {
      en: "Update",
      ru: "Обновление"
    },
    title: {
      en: "Living portfolio layer",
      ru: "Живой слой портфолио"
    },
    text: {
      en: "The landing now has a static notification center that remembers viewed updates.",
      ru: "На лендинге появился статический центр уведомлений, который запоминает просмотренные обновления."
    },
    url: "#top"
  }
];

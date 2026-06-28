/*
  Static update feed for the portfolio notification center.
  Use stable IDs so localStorage can remember which items were seen.
*/

window.PORTFOLIO_NOTIFICATIONS = [
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

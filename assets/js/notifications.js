/*
  Static update feed for the portfolio notification center.
  Blog post notifications are generated from assets/js/blog-posts.js.
  Use stable IDs so localStorage can remember which items were seen.
*/

(function () {
  function localize(value, lang) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value[lang] || value.en || '';
    }
    return value || '';
  }

  function buildNotifications() {
    const posts = Array.isArray(window.BLOG_POSTS) ? window.BLOG_POSTS : [];
    const postNotifications = posts
      .filter((post) => post.notify)
      .map((post) => ({
        id: post.notificationId || `${post.date}-${post.slug}`,
        date: post.date,
        type: {
          en: 'Blog',
          ru: 'Блог'
        },
        title: post.notificationTitle || post.shortTitle || post.title,
        text: post.notificationText || post.description,
        url: post.url || `./blog/posts/${post.slug}.html`
      }));

    const siteNotifications = Array.isArray(window.BLOG_SITE_NOTIFICATIONS)
      ? window.BLOG_SITE_NOTIFICATIONS
      : [];

    window.PORTFOLIO_NOTIFICATIONS = [
      ...postNotifications,
      ...siteNotifications
    ].sort((a, b) => {
      const dateDiff = String(b.date || '').localeCompare(String(a.date || ''));
      if (dateDiff !== 0) return dateDiff;
      return localize(b.title, 'en').localeCompare(localize(a.title, 'en'));
    });
  }

  window.BLOG_BUILD_NOTIFICATIONS = buildNotifications;

  if (Array.isArray(window.BLOG_POSTS)) {
    buildNotifications();
    return;
  }

  const currentScript = document.currentScript;
  const manifestUrl = currentScript && currentScript.src
    ? new URL('blog-posts.js', currentScript.src).href
    : './assets/js/blog-posts.js';

  if (document.readyState === 'loading') {
    document.write('<script src="' + manifestUrl + '"><\/script>');
  } else {
    const script = document.createElement('script');
    script.src = manifestUrl;
    script.onload = buildNotifications;
    document.head.appendChild(script);
  }
})();

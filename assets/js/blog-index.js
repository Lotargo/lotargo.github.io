/*
  Blog index renderer.
  The canonical post order and metadata live in assets/js/blog-posts.js.
*/

(function () {
  const list = document.querySelector('[data-js="blog-post-list"]');
  if (!list) return;

  function localized(value, lang) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value[lang] || value.en || '';
    }
    return value || '';
  }

  function addLocalizedText(parent, tagName, value) {
    const en = document.createElement(tagName);
    en.dataset.langContent = 'en';
    en.textContent = localized(value, 'en');
    parent.appendChild(en);

    const ru = document.createElement(tagName);
    ru.dataset.langContent = 'ru';
    ru.textContent = localized(value, 'ru');
    parent.appendChild(ru);
  }

  function createPostCard(post) {
    const article = document.createElement('article');
    article.className = 'post-card';

    const meta = document.createElement('div');
    meta.className = 'post-meta';

    const date = document.createElement('span');
    date.textContent = post.date || '';
    meta.appendChild(date);
    addLocalizedText(meta, 'span', post.type || 'Blog');
    article.appendChild(meta);

    const heading = document.createElement('h3');
    const headingLink = document.createElement('a');
    headingLink.href = post.indexHref || './posts/' + post.slug + '.html';
    addLocalizedText(headingLink, 'span', post.title || post.slug);
    heading.appendChild(headingLink);
    article.appendChild(heading);

    addLocalizedText(article, 'p', post.description || '');

    const readLink = document.createElement('a');
    readLink.className = 'post-link';
    readLink.href = headingLink.href;
    readLink.dataset.i18n = 'post-read-note';
    readLink.textContent = 'Read note';
    article.appendChild(readLink);

    return article;
  }

  const posts = Array.isArray(window.BLOG_POSTS) ? window.BLOG_POSTS : [];
  if (!posts.length) return;

  list.replaceChildren(...posts.slice().reverse().map(createPostCard));
})();

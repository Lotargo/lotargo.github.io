(function () {
  if (window.__LOTARGO_TELEGRAM_UI__) return;
  window.__LOTARGO_TELEGRAM_UI__ = true;

  const currentScript = document.currentScript;
  const scriptUrl = currentScript && currentScript.src
    ? currentScript.src
    : new URL('./assets/js/telegram-ui.js', window.location.href).href;
  const channelUrl = 'https://t.me/lotargo_blog';
  const telegramPostHostnames = new Set(['t.me', 'www.t.me', 'telegram.me', 'www.telegram.me']);

  function loadStyles() {
    if (document.querySelector('link[data-telegram-ui-styles]')) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.dataset.telegramUiStyles = 'true';
    link.href = new URL('../css/telegram.css?v=20260724-2', scriptUrl).href;
    document.head.appendChild(link);
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
    const enLabel = document.createElement('span');
    enLabel.dataset.langContent = 'en';
    enLabel.textContent = en;
    parent.appendChild(enLabel);

    const ruLabel = document.createElement('span');
    ruLabel.dataset.langContent = 'ru';
    ruLabel.textContent = ru;
    parent.appendChild(ruLabel);
  }

  function syncInjectedLanguage() {
    const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';
    document.querySelectorAll('[data-telegram-ui] [data-lang-content]').forEach((node) => {
      node.hidden = node.dataset.langContent !== lang;
    });
  }

  function createChannelLink(className, en, ru, ariaLabel) {
    const link = document.createElement('a');
    link.className = className;
    link.href = channelUrl;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.setAttribute('aria-label', ariaLabel);
    link.dataset.telegramUi = 'true';
    link.appendChild(telegramIcon());
    addLocalizedLabel(link, en, ru);
    return link;
  }

  function addHeaderChannelLink() {
    const controls = document.querySelector('.header-controls');
    const githubLink = controls?.querySelector('.github-link');
    if (!controls || !githubLink || controls.querySelector('[data-telegram-header-link]')) return;

    let socials = controls.querySelector('.header-socials');
    if (!socials) {
      socials = document.createElement('div');
      socials.className = 'header-socials';
      socials.dataset.telegramUi = 'true';
      githubLink.before(socials);
      socials.appendChild(githubLink);
    }

    const telegramLink = createChannelLink(
      'telegram-channel-link',
      'Telegram',
      'Telegram',
      'Open the Russian Telegram channel'
    );
    telegramLink.dataset.telegramHeaderLink = 'true';
    socials.appendChild(telegramLink);
  }

  function addLandingChannelAction() {
    const actions = document.querySelector('.hero-actions');
    if (!actions || actions.querySelector('[data-telegram-landing-action]')) return;

    const link = createChannelLink(
      'button telegram-action',
      'Telegram RU',
      'Telegram-канал',
      'Open the Russian Telegram channel'
    );
    link.dataset.telegramLandingAction = 'true';
    actions.appendChild(link);
  }

  function addBlogChannelAction() {
    const hero = document.querySelector('.blog-hero');
    if (!hero || hero.querySelector('[data-telegram-blog-action]')) return;

    const actions = document.createElement('div');
    actions.className = 'blog-telegram-actions';
    actions.dataset.telegramUi = 'true';

    const link = createChannelLink(
      'button telegram-action',
      'Follow the Russian Telegram channel',
      'Подписаться на Telegram-канал',
      'Open the Russian Telegram channel'
    );
    link.dataset.telegramBlogAction = 'true';
    actions.appendChild(link);
    hero.appendChild(actions);
  }

  function currentArticleSlug(article) {
    const declared = article.dataset.articleSlug;
    if (declared) return declared;

    const filename = window.location.pathname.split('/').pop() || '';
    return filename.replace(/\.html$/, '');
  }

  function safeTelegramPostUrl(value) {
    if (typeof value !== 'string' || !value) return null;
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || !telegramPostHostnames.has(url.hostname)) return null;
      return url.href;
    } catch (error) {
      return null;
    }
  }

  function addArticlePostLink(article, postUrl) {
    const copy = {
      en: 'Russian publication on Telegram',
      ru: 'Читать и обсуждать в Telegram'
    };

    ['en', 'ru'].forEach((lang) => {
      const languageBlock = Array.from(article.children).find(
        (node) => node.dataset?.langContent === lang
      );
      if (!languageBlock || languageBlock.querySelector('[data-telegram-article-action]')) return;

      const anchor = languageBlock.querySelector('.post-lead') || languageBlock.querySelector('h1');
      if (!anchor) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'post-telegram-publication';
      wrapper.dataset.telegramUi = 'true';

      const link = document.createElement('a');
      link.className = 'button telegram-action post-telegram-action';
      link.href = postUrl;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.dataset.telegramArticleAction = 'true';
      link.appendChild(telegramIcon());

      const label = document.createElement('span');
      label.textContent = copy[lang];
      link.appendChild(label);

      wrapper.appendChild(link);
      anchor.insertAdjacentElement('afterend', wrapper);
    });
  }

  async function loadArticlePostLink() {
    const article = document.querySelector('.post-article');
    if (!article) return;

    const slug = currentArticleSlug(article);
    if (!slug) return;

    const stateUrl = new URL('../../blog/content/telegram-publications.json', scriptUrl);
    try {
      const response = await fetch(stateUrl, { cache: 'no-store' });
      if (!response.ok) return;
      const state = await response.json();
      const postUrl = safeTelegramPostUrl(state?.posts?.[slug]?.post_url);
      if (postUrl) addArticlePostLink(article, postUrl);
    } catch (error) {
      // The Telegram state is optional and must never block article rendering.
    }
  }

  loadStyles();
  addHeaderChannelLink();
  addLandingChannelAction();
  addBlogChannelAction();
  syncInjectedLanguage();
  loadArticlePostLink();

  const languageObserver = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.attributeName === 'lang')) {
      syncInjectedLanguage();
    }
  });
  languageObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang']
  });
})();

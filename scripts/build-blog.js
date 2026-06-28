const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const contentDir = path.join(root, 'blog', 'content');
const postsDir = path.join(root, 'blog', 'posts');
const blogIndexPath = path.join(root, 'blog', 'index.html');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: source };

  const data = {};
  const lines = match[1].split(/\r?\n/);
  let currentListKey = null;

  for (const line of lines) {
    const listMatch = line.match(/^\s*-\s+(.+)$/);
    if (listMatch && currentListKey) {
      data[currentListKey].push(stripQuotes(listMatch[1].trim()));
      continue;
    }

    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;

    const key = pair[1];
    const rawValue = pair[2].trim();
    if (rawValue === '') {
      data[key] = [];
      currentListKey = key;
    } else {
      data[key] = stripQuotes(rawValue);
      currentListKey = null;
    }
  }

  return { data, body: source.slice(match[0].length) };
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, '');
}

function readPosts() {
  const files = fs.readdirSync(contentDir)
    .filter((name) => name.endsWith('.md'))
    .sort();

  const groups = new Map();
  for (const file of files) {
    const fullPath = path.join(contentDir, file);
    const parsed = parseFrontmatter(fs.readFileSync(fullPath, 'utf8'));
    const lang = parsed.data.lang || (file.includes('.ru.') ? 'ru' : 'en');
    const slug = parsed.data.slug || slugify(file.replace(/\.(ru|en)?\.?md$/i, ''));
    if (!groups.has(slug)) groups.set(slug, { slug, translations: {} });
    groups.get(slug).translations[lang] = {
      ...parsed.data,
      slug,
      lang,
      sourceFile: file,
      body: parsed.body.trim()
    };
  }

  return Array.from(groups.values())
    .map((group) => normalizeGroup(group))
    .sort((a, b) => {
      const dateCompare = String(b.date).localeCompare(String(a.date));
      if (dateCompare !== 0) return dateCompare;
      return a.order - b.order;
    });
}

function normalizeGroup(group) {
  const en = group.translations.en || group.translations.ru;
  const ru = group.translations.ru || group.translations.en;
  const date = en.date || ru.date || '1970-01-01';
  const order = Number(en.order || ru.order || 0);
  return {
    slug: group.slug,
    date,
    order,
    en,
    ru,
    title: { en: en.title || ru.title || group.slug, ru: ru.title || en.title || group.slug },
    type: { en: en.type || ru.type || 'Post', ru: ru.type || en.type || 'Пост' },
    description: {
      en: en.description || ru.description || '',
      ru: ru.description || en.description || ''
    }
  };
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }

    const fence = line.match(/^```([A-Za-z0-9:_-]*)\s*$/);
    if (fence) {
      const lang = fence[1] || 'text';
      const code = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push(renderFence(lang, code.join('\n')));
      continue;
    }

    if (line.startsWith('$$')) {
      const formula = [];
      const first = line.replace(/^\$\$\s*/, '').replace(/\s*\$\$$/, '');
      if (first) formula.push(first);
      i += 1;
      while (i < lines.length && !lines[i].startsWith('$$')) {
        formula.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) {
        const last = lines[i].replace(/^\$\$\s*/, '').replace(/\s*\$\$$/, '');
        if (last) formula.push(last);
        i += 1;
      }
      blocks.push(renderFormula(formula.join(' ')));
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      blocks.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    const image = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (image) {
      blocks.push(`<figure class="post-figure"><img src="${escapeHtml(image[2])}" alt="${escapeHtml(image[1])}" /><figcaption>${escapeHtml(image[1])}</figcaption></figure>`);
      i += 1;
      continue;
    }

    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[i + 1])) {
      const tableLines = [line, lines[i + 1]];
      i += 2;
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        tableLines.push(lines[i]);
        i += 1;
      }
      blocks.push(renderTable(tableLines));
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i += 1;
      }
      blocks.push(`<ul>${items.map((item) => `<li>${renderInline(item)}</li>`).join('')}</ul>`);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i += 1;
      }
      blocks.push(`<ol>${items.map((item) => `<li>${renderInline(item)}</li>`).join('')}</ol>`);
      continue;
    }

    const paragraph = [line.trim()];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,3})\s+/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^!\[/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    blocks.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
  }

  return blocks.join('\n\n');
}

function renderFence(lang, code) {
  if (lang === 'mermaid') {
    return renderMermaidLite(code);
  }
  if (lang === 'chart:loss') {
    const points = code.split(/\n/).map((line) => line.split(',').map((x) => Number(x.trim()))).filter((pair) => pair.length === 2 && pair.every(Number.isFinite));
    return renderLineChart(points, 'Training loss by epoch');
  }
  if (lang === 'chart:bars') {
    const bars = code.split(/\n/).map((line) => {
      const [label, value] = line.split(',').map((x) => x.trim());
      return { label, value: Number(value) };
    }).filter((bar) => bar.label && Number.isFinite(bar.value));
    return renderBarChart(bars, 'Bar chart');
  }
  return `<pre class="post-code"><code>${escapeHtml(code)}</code></pre>`;
}

function renderLineChart(points, title) {
  if (!points.length) return '';
  const width = 720;
  const height = 320;
  const padX = 58;
  const padTop = 24;
  const padBottom = 52;
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const xScale = (x) => padX + ((x - minX) / Math.max(1, maxX - minX)) * (width - padX - 40);
  const yScale = (y) => padTop + (1 - ((y - minY) / Math.max(0.0001, maxY - minY))) * (height - padTop - padBottom);
  const poly = points.map(([x, y]) => `${xScale(x).toFixed(1)},${yScale(y).toFixed(1)}`).join(' ');
  const circles = points.map(([x, y]) => `<circle cx="${xScale(x).toFixed(1)}" cy="${yScale(y).toFixed(1)}" r="5" />`).join('');
  const labels = points.map(([x, y]) => `<text x="${xScale(x).toFixed(1)}" y="${height - 18}">${escapeHtml(x)}</text><text x="${(xScale(x) + 10).toFixed(1)}" y="${(yScale(y) - 8).toFixed(1)}">${escapeHtml(y)}</text>`).join('');
  return `<figure class="chart-card"><figcaption>${escapeHtml(title)}</figcaption><svg class="line-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(title)}"><line x1="${padX}" y1="${height - padBottom}" x2="${width - 40}" y2="${height - padBottom}" /><line x1="${padX}" y1="${padTop}" x2="${padX}" y2="${height - padBottom}" /><polyline points="${poly}" /><g>${circles}</g>${labels}</svg></figure>`;
}

function renderBarChart(bars, title) {
  const max = Math.max(...bars.map((bar) => bar.value), 1);
  return `<figure class="chart-card"><figcaption>${escapeHtml(title)}</figcaption><div class="bar-chart">${bars.map((bar) => `<div class="bar-row"><span>${escapeHtml(bar.label)}</span><div><i style="width: ${(bar.value / max * 100).toFixed(2)}%"></i></div><strong>${escapeHtml(bar.value)}</strong></div>`).join('')}</div></figure>`;
}

function renderMermaidLite(code) {
  const lines = code.split(/\n/).map((line) => line.trim()).filter(Boolean);
  const header = lines[0] || '';
  const direction = /\bTD\b|\bTB\b/.test(header) ? 'vertical' : 'horizontal';
  const nodeLabels = new Map();
  const edges = [];

  for (const line of lines.slice(1)) {
    const edge = line.match(/^([A-Za-z0-9_-]+)(?:[\[{]([^\]}]+)[\]}])?\s*--.*?-->\s*([A-Za-z0-9_-]+)(?:[\[{]([^\]}]+)[\]}])?$/);
    if (!edge) continue;
    const from = edge[1];
    const fromLabel = edge[2] || from;
    const to = edge[3];
    const toLabel = edge[4] || to;
    if (!nodeLabels.has(from)) nodeLabels.set(from, fromLabel);
    if (!nodeLabels.has(to)) nodeLabels.set(to, toLabel);
    edges.push([from, to]);
  }

  if (!edges.length) {
    return `<div class="mermaid post-diagram">${escapeHtml(code)}</div>`;
  }

  const orderedIds = [];
  edges.forEach(([from, to]) => {
    if (!orderedIds.includes(from)) orderedIds.push(from);
    if (!orderedIds.includes(to)) orderedIds.push(to);
  });

  const nodes = orderedIds.map((id, index) => {
    const arrow = index < orderedIds.length - 1 ? '<span class="flow-arrow" aria-hidden="true">-></span>' : '';
    return `<span class="flow-node">${escapeHtml(nodeLabels.get(id) || id)}</span>${arrow}`;
  }).join('');

  return `<div class="flow-diagram ${direction}" role="img" aria-label="Generated flow diagram">${nodes}</div>`;
}

function renderFormula(source) {
  return `<div class="post-formula"><span class="math-formula">${escapeHtml(source)
    .replace(/\\Rightarrow/g, '<span class="math-arrow">=&gt;</span>')
    .replace(/\\le/g, '&lt;=')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
    .replace(/_\{([^}]+)\}/g, '<sub>$1</sub>')}</span></div>`;
}

function renderTable(lines) {
  const rows = lines.map(splitTableRow);
  const header = rows[0] || [];
  const body = rows.slice(2);
  return `<div class="post-table-wrap"><table class="post-table"><thead><tr>${header.map((cell) => `<th>${renderInline(cell)}</th>`).join('')}</tr></thead><tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function splitTableRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

function renderInline(source) {
  return escapeHtml(source)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function pageShell({ titleEn, titleRu, body, description }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="theme-color" content="#000000" />
  <title>${escapeHtml(titleEn)}</title>
  <link rel="icon" type="image/svg+xml" href="../../assets/img/favicon.svg" />
  <link rel="stylesheet" href="../../assets/css/styles.css" />
  <script>
    (function () {
      try {
        var savedTheme = localStorage.getItem('lotargo-theme');
        document.documentElement.dataset.theme = savedTheme || 'dark';
      } catch (error) {
        document.documentElement.dataset.theme = 'dark';
      }
    })();
  </script>
</head>
<body data-title-en="${escapeHtml(titleEn)}" data-title-ru="${escapeHtml(titleRu)}">
  <header class="site-header" data-js="header">
    <a class="brand" href="../../" aria-label="Back to landing">
      <span class="brand-mark" aria-hidden="true">LØ</span>
      <span class="brand-text">Lotargo</span>
    </a>
    <div class="header-controls">
      <nav class="nav" aria-label="Post navigation">
        <a href="../../" data-i18n="blog-nav-home">Home</a>
        <a href="../" data-i18n="nav-blog">Blog</a>
        <a href="../../#projects" data-i18n="nav-projects">Projects</a>
      </nav>
      <button class="theme-toggle" type="button" data-js="theme-toggle" aria-label="Switch color theme">
        <span data-js="theme-label">Theme</span>
      </button>
      <button class="lang-toggle" type="button" data-js="lang-toggle" aria-label="Switch language">
        <span data-js="lang-label">EN</span>
      </button>
    </div>
  </header>
${body}
  <footer class="site-footer">
    <span>Oleg Boyko / Lotargo</span>
    <span>Blog · AI systems · verification</span>
  </footer>
  <script src="../../assets/js/main.js"></script>
  <script src="../../assets/js/blog-post.js"></script>
</body>
</html>
`;
}

function renderPost(post, previous, next) {
  const enHtml = renderMarkdown(post.en.body);
  const ruHtml = renderMarkdown(post.ru.body);
  const body = `  <main id="top" class="post-shell">
    <article class="post-article">
      <div class="post-toolbar">
        <a class="post-back" href="../" data-i18n="post-back-blog">Back to blog</a>
        <div class="post-meta">
          <span>${escapeHtml(post.date)}</span>
          <span data-lang-content="en">${escapeHtml(post.type.en)}</span>
          <span data-lang-content="ru">${escapeHtml(post.type.ru)}</span>
        </div>
      </div>
      <div data-lang-content="en">${enHtml}</div>
      <div data-lang-content="ru">${ruHtml}</div>
      ${renderPagination(previous, next)}
    </article>
  </main>`;

  return pageShell({
    titleEn: `${post.title.en} · Lotargo Blog`,
    titleRu: `${post.title.ru} · Блог Lotargo`,
    description: post.description.en || post.description.ru,
    body
  });
}

function renderPagination(previous, next) {
  return `<nav class="post-pagination" aria-label="Post navigation" data-i18n-aria="post-pagination-aria">
        ${previous ? `<a class="post-page-link" href="./${previous.slug}.html"><span data-i18n="post-prev">Previous</span><strong data-lang-content="en">${escapeHtml(previous.title.en)}</strong><strong data-lang-content="ru">${escapeHtml(previous.title.ru)}</strong></a>` : `<span class="post-page-link is-disabled" aria-disabled="true"><span data-i18n="post-prev">Previous</span><strong data-i18n="post-prev-none">No earlier post</strong></span>`}
        ${next ? `<a class="post-page-link" href="./${next.slug}.html"><span data-i18n="post-next">Next</span><strong data-lang-content="en">${escapeHtml(next.title.en)}</strong><strong data-lang-content="ru">${escapeHtml(next.title.ru)}</strong></a>` : `<span class="post-page-link is-disabled" aria-disabled="true"><span data-i18n="post-next">Next</span><strong data-i18n="post-next-none">No later post</strong></span>`}
      </nav>`;
}

function renderIndex(posts) {
  const cards = posts.map((post) => `<article class="post-card">
            <div class="post-meta">
              <span>${escapeHtml(post.date)}</span>
              <span data-lang-content="en">${escapeHtml(post.type.en)}</span>
              <span data-lang-content="ru">${escapeHtml(post.type.ru)}</span>
            </div>
            <h3><a href="./posts/${post.slug}.html"><span data-lang-content="en">${escapeHtml(post.title.en)}</span><span data-lang-content="ru">${escapeHtml(post.title.ru)}</span></a></h3>
            <p data-lang-content="en">${escapeHtml(post.description.en)}</p>
            <p data-lang-content="ru">${escapeHtml(post.description.ru)}</p>
            <a class="post-link" href="./posts/${post.slug}.html" data-i18n="post-read-note">Read note</a>
          </article>`).join('\n\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Lotargo development blog: notes on AI systems, RAG architecture, runtime experiments, verification work, and site updates." />
  <meta name="theme-color" content="#000000" />
  <title>Lotargo Blog</title>
  <link rel="icon" type="image/svg+xml" href="../assets/img/favicon.svg" />
  <link rel="stylesheet" href="../assets/css/styles.css" />
  <script>
    (function () {
      try {
        var savedTheme = localStorage.getItem('lotargo-theme');
        document.documentElement.dataset.theme = savedTheme || 'dark';
      } catch (error) {
        document.documentElement.dataset.theme = 'dark';
      }
    })();
  </script>
</head>
<body data-title-i18n="blog-page-title">
  <a class="skip-link" href="#posts">Skip to posts</a>
  <header class="site-header" data-js="header">
    <a class="brand" href="../" aria-label="Back to landing">
      <span class="brand-mark" aria-hidden="true">LØ</span>
      <span class="brand-text">Lotargo</span>
    </a>
    <div class="header-controls">
      <a class="github-link" href="https://github.com/Lotargo" target="_blank" rel="noreferrer" aria-label="GitHub Profile">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span>GitHub</span>
      </a>
      <nav class="nav" aria-label="Blog navigation">
        <a href="../" data-i18n="blog-nav-home">Home</a>
        <a href="#posts" data-i18n="blog-nav-posts">Posts</a>
        <a href="../#projects" data-i18n="nav-projects">Projects</a>
      </nav>
      <button class="theme-toggle" type="button" data-js="theme-toggle" aria-label="Switch color theme">
        <span data-js="theme-label">Theme</span>
      </button>
      <button class="lang-toggle" type="button" data-js="lang-toggle" aria-label="Switch language">
        <span data-js="lang-label">EN</span>
      </button>
    </div>
  </header>
  <main id="top" class="blog-shell">
    <section class="blog-hero" aria-labelledby="blog-title">
      <div class="hero-kicker">
        <span>05</span>
        <span data-i18n="blog-kicker">Development notes / architecture / releases</span>
      </div>
      <h1 id="blog-title" class="blog-title" data-i18n="blog-title">Lotargo Blog</h1>
      <p class="blog-intro" data-i18n="blog-intro">Notes about AI systems, RAG architecture, runtime experiments, verification work, and the decisions behind public project pages.</p>
    </section>
    <section id="posts" class="section blog-section" aria-labelledby="posts-title">
      <div class="section-label" data-i18n="blog-posts-label">01 / posts</div>
      <div class="section-body">
        <div class="section-heading-row">
          <div>
            <h2 id="posts-title" data-i18n="blog-posts-title">Latest notes</h2>
            <p class="lead compact" data-i18n="blog-posts-lead">A static archive that can later grow from markdown sources into generated pages.</p>
          </div>
          <a class="button" href="../" data-i18n="blog-back-home">Back home</a>
        </div>
        <div class="post-list">
          ${cards}
        </div>
      </div>
    </section>
  </main>
  <footer class="site-footer">
    <span>Oleg Boyko / Lotargo</span>
    <span>Blog · AI systems · verification</span>
  </footer>
  <script src="../assets/js/main.js"></script>
</body>
</html>
`;
}

function build() {
  fs.mkdirSync(postsDir, { recursive: true });
  const posts = readPosts();
  const managed = new Set(posts.map((post) => `${post.slug}.html`));

  for (const file of fs.readdirSync(postsDir)) {
    if (file.endsWith('.html') && !managed.has(file)) {
      fs.rmSync(path.join(postsDir, file));
    }
  }

  posts.forEach((post, index) => {
    const previous = posts[index + 1] || null;
    const next = posts[index - 1] || null;
    fs.writeFileSync(path.join(postsDir, `${post.slug}.html`), renderPost(post, previous, next));
  });
  fs.writeFileSync(blogIndexPath, renderIndex(posts));
  console.log(`Built ${posts.length} posts.`);
}

build();

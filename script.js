const blogPosts = [];
const timelineEvents = [];

const fallbackBlogPosts = [
  {
    title: '构建可维护的前端组件库',
    date: '2026-06-12',
    category: '前端实践',
    excerpt: '从设计原则、组件抽象到版本管理，归纳可以长期迭代的前端组件库实践方式。',
    tags: ['组件', '前端', '设计'],
    slug: 'build-maintainable-component-library',
  },
  {
    title: '静态站点与 GitHub Pages 部署指南',
    date: '2026-05-28',
    category: '部署方案',
    excerpt: '用纯静态 HTML/CSS/JS 实现博客，并将它发布到 GitHub Pages 的最佳实践。',
    tags: ['GitHub Pages', '静态站点', '部署'],
    slug: 'static-site-github-pages',
  },
  {
    title: '提升工程效率的开发流程拆解',
    date: '2026-04-18',
    category: '工作流',
    excerpt: '从任务拆分、代码审查到持续集成，探讨让团队协作效率更高的流程设计。',
    tags: ['CI/CD', '流程', '团队'],
    slug: 'efficient-workflow',
  },
  {
    title: '从思考到落地：记录思路的五个关键步骤',
    date: '2026-03-09',
    category: '思考方法',
    excerpt: '把复杂问题拆解成可执行的小步骤，帮助你把灵感转化为可交付成果。',
    tags: ['思考', '方法论', '执行'],
    slug: 'thought-to-action',
  },
];

const fallbackTimelineEvents = [
  {
    date: '2025-02-28',
    text: 'DeepSeek R1的回答有思考部分，它会向用户展示分析用户的输入，并给出回答策略。一开始我并不喜欢这部分，因为这让我感觉我处于下位。但是仔细想想，我又何尝不是呢？训练数据来自于大量的优质积累，可以简单理解为普世正常的认知和经验。尤其是当AI的回答让我感觉惊艳的时候。大部分时候，证明了我的认知水平和深度是低于正常水平的。',
  },
  {
    date: '2026-06-14',
    text: '通过模块化样式、可复用的页面片段，以及数据结构化设计，为下次迭代留出接口。',
  },
];

const postsContainer = document.getElementById('posts');
const timelineContainer = document.getElementById('timelineList');
const searchInput = document.getElementById('searchInput');
const postDetail = document.getElementById('postDetail');
const postTitle = document.getElementById('postTitle');
const postMeta = document.getElementById('postMeta');
const postContent = document.getElementById('postContent');

function parseBlogMarkdown(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim());
  const posts = [];
  let current = null;

  lines.forEach((line) => {
    if (line.startsWith('## ')) {
      if (current) posts.push(current);
      current = {
        title: line.slice(3).trim(),
        date: '',
        category: '',
        tags: [],
        excerpt: '',
      };
      return;
    }

    if (!current) return;

    if (line.startsWith('- Date:')) {
      current.date = line.replace('- Date:', '').trim();
      return;
    }

    if (line.startsWith('- Category:')) {
      current.category = line.replace('- Category:', '').trim();
      return;
    }

    if (line.startsWith('- Tags:')) {
      current.tags = line.replace('- Tags:', '').split(',').map((tag) => tag.trim()).filter(Boolean);
      return;
    }

    if (line.startsWith('- Slug:')) {
      current.slug = line.replace('- Slug:', '').trim();
      return;
    }

    if (line && !line.startsWith('#') && !line.startsWith('- ')) {
      current.excerpt = current.excerpt ? `${current.excerpt} ${line}` : line;
    }
  });

  if (current) {
    if (!current.slug) {
      current.slug = createSlug(current.title || `post-${posts.length + 1}`);
    }
    posts.push(current);
  }
  return posts;
}

function parseTimelineMarkdown(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim());
  const events = [];
  let current = null;

  lines.forEach((line) => {
    if (line.startsWith('## ')) {
      if (current) events.push(current);
      current = {
        date: line.slice(3).trim(),
        text: '',
      };
      return;
    }

    if (!current) return;

    if (line && !line.startsWith('#')) {
      current.text = current.text ? `${current.text} ${line}` : line;
    }
  });

  if (current) events.push(current);
  return events;
}

async function loadMarkdown(path, parser, target) {
  try {
    var cacheBuster = '_cb=' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    var cacheBustedPath = path + (path.includes('?') ? '&' : '?') + cacheBuster;
    var response = await fetch(cacheBustedPath, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    if (!response.ok) throw new Error('Unable to load ' + path);
    var text = await response.text();
    var parsed = parser(text);
    target.splice(0, target.length, ...parsed);
    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function renderPosts(posts) {
  if (!postsContainer) return;
  postsContainer.innerHTML = '';

  if (!posts.length) {
    postsContainer.innerHTML = '<p class="empty-state">未找到匹配的文章，尝试更换关键词。</p>';
    return;
  }

  posts.forEach((post) => {
    const card = document.createElement('article');
    card.className = 'card';

    const slug = post.slug || createSlug(post.title);
    card.innerHTML = `
      <div class="meta">
        <span>${post.category}</span>
        <span>${post.date}</span>
      </div>
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <div class="tag-list">
        ${post.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <div class="card-actions">
        <a class="button button-secondary read-more" href="post.html?slug=${encodeURIComponent(slug)}">Read More</a>
      </div>
    `;

    postsContainer.appendChild(card);
  });
}

function renderTimeline(events) {
  if (!timelineContainer) return;
  timelineContainer.innerHTML = '';
  events.forEach((event) => {
    const item = document.createElement('article');
    item.className = 'timeline-item';

    item.innerHTML = `
      <time>${event.date}</time>
      <p>${event.text}</p>
    `;

    timelineContainer.appendChild(item);
  });
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function processInlineMarkdown(text) {
  var escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}

function isTableRow(line) {
  return line.startsWith('|') && line.endsWith('|');
}

function isAlignmentRow(line) {
  return /^\|[\s\-:|]+\|$/.test(line);
}

function parseTableRow(line) {
  return line.slice(1, -1).split('|');
}

function parseAlignmentRow(line) {
  return line.slice(1, -1).split('|').map(function(cell) {
    var trimmed = cell.trim();
    if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
    if (trimmed.endsWith(':')) return 'right';
    return 'left';
  });
}

function renderTable(buffer) {
  var html = '<table>';
  var headers = parseTableRow(buffer[0]);
  html += '<thead><tr>';
  headers.forEach(function(h) {
    html += '<th>' + processInlineMarkdown(h.trim()) + '</th>';
  });
  html += '</tr></thead>';

  var dataStart = 1;
  var alignments = [];

  if (buffer.length > 1 && isAlignmentRow(buffer[1])) {
    alignments = parseAlignmentRow(buffer[1]);
    dataStart = 2;
  }

  if (dataStart < buffer.length) {
    html += '<tbody>';
    for (var i = dataStart; i < buffer.length; i++) {
      var cells = parseTableRow(buffer[i]);
      html += '<tr>';
      cells.forEach(function(cell, j) {
        var alignStyle = alignments[j] ? ' style="text-align:' + alignments[j] + '"' : '';
        html += '<td' + alignStyle + '>' + processInlineMarkdown(cell.trim()) + '</td>';
      });
      html += '</tr>';
    }
    html += '</tbody>';
  }

  html += '</table>';
  return html;
}

function markdownToHtml(text) {
  const lines = text.replace(/\r?\n/g, '\n').split('\n');
  let html = '';
  let inCodeBlock = false;
  let listType = '';
  let tableBuffer = [];

  lines.forEach((rawLine) => {
    const trimmed = rawLine.trim();
    let line = rawLine;

    if (isTableRow(trimmed)) {
      if (listType) {
        html += listType === 'ol' ? '</ol>' : '</ul>';
        listType = '';
      }
      tableBuffer.push(trimmed);
      return;
    }

    if (tableBuffer.length > 0) {
      html += renderTable(tableBuffer);
      tableBuffer = [];
    }

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      html += inCodeBlock ? '<pre><code>' : '</code></pre>';
      return;
    }

    if (inCodeBlock) {
      html += `${line.replace(/&/g, '&amp;').replace(/</g, '&lt;')}\n`;
      return;
    }

    if (trimmed.startsWith('### ')) {
      html += `<h3>${trimmed.slice(4)}</h3>`;
      return;
    }

    if (trimmed.startsWith('## ')) {
      html += `<h2>${trimmed.slice(3)}</h2>`;
      return;
    }

    if (trimmed.startsWith('# ')) {
      html += `<h1>${trimmed.slice(2)}</h1>`;
      return;
    }

    if (trimmed.startsWith('> ')) {
      html += `<blockquote>${trimmed.slice(2)}</blockquote>`;
      return;
    }

    if (/^(!\[.*\]\(.*\))$/.test(trimmed)) {
      const match = trimmed.match(/^!\[(.*)\]\((.*)\)$/);
      if (match) html += `<img src="${match[2]}" alt="${match[1]}" />`;
      return;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      if (listType !== 'ol') {
        if (listType === 'ul') html += '</ul>';
        listType = 'ol';
        html += '<ol>';
      }
      html += `<li>${trimmed.replace(/^\d+\.\s+/, '')}</li>`;
      return;
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      if (listType !== 'ul') {
        if (listType === 'ol') html += '</ol>';
        listType = 'ul';
        html += '<ul>';
      }
      html += `<li>${trimmed.replace(/^[-*+]\s+/, '')}</li>`;
      return;
    }

    if (listType) {
      html += listType === 'ol' ? '</ol>' : '</ul>';
      listType = '';
    }

    if (trimmed === '') {
      html += '';
      return;
    }

    html += '<p>' + processInlineMarkdown(line.trim()) + '</p>';
  });

  if (tableBuffer.length > 0) {
    html += renderTable(tableBuffer);
    tableBuffer = [];
  }

  if (listType) {
    html += listType === 'ol' ? '</ol>' : '</ul>';
  }

  return html;
}

function parsePostMarkdown(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim());
  const post = {
    title: '',
    date: '',
    category: '',
    tags: [],
    content: '',
  };
  let contentStart = false;

  lines.forEach((line) => {
    if (!contentStart && line.startsWith('# ')) {
      post.title = line.slice(2).trim();
      return;
    }

    if (!contentStart && line.startsWith('- Date:')) {
      post.date = line.replace('- Date:', '').trim();
      return;
    }

    if (!contentStart && line.startsWith('- Category:')) {
      post.category = line.replace('- Category:', '').trim();
      return;
    }

    if (!contentStart && line.startsWith('- Tags:')) {
      post.tags = line.replace('- Tags:', '').split(',').map((tag) => tag.trim()).filter(Boolean);
      return;
    }

    if (!contentStart && line.startsWith('- Slug:')) {
      return;
    }

    if (!contentStart && line === '') {
      return;
    }

    contentStart = true;
    post.content += line ? `${line}\n` : '\n';
  });

  return post;
}

async function loadPostDetail(slug) {
  if (!postDetail || !postTitle || !postContent || !postMeta) return;

  try {
    var cacheBuster = '_cb=' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    var postPath = 'data/posts/' + slug + '.md?' + cacheBuster;
    var response = await fetch(postPath, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    if (!response.ok) throw new Error('文章未找到');
    var text = await response.text();
    var post = parsePostMarkdown(text);

    postTitle.textContent = post.title || '文章详情';
    postMeta.innerHTML = `<span>${post.date}</span>${post.category ? `<span>${post.category}</span>` : ''}${post.tags.length ? `<span>${post.tags.join(' · ')}</span>` : ''}`;
    postContent.innerHTML = markdownToHtml(post.content);
  } catch (error) {
    postTitle.textContent = '加载失败';
    postContent.innerHTML = `<p>无法读取文章内容：${error.message}</p>`;
  }
}

function filterPosts(query) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    renderPosts(blogPosts);
    return;
  }

  const filtered = blogPosts.filter((post) => {
    const content = `${post.title} ${post.excerpt} ${post.category} ${post.tags.join(' ')}`.toLowerCase();
    return content.includes(normalized);
  });

  renderPosts(filtered);
}

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    filterPosts(event.target.value);
  });
}

(async function init() {
  if (postsContainer) {
    const loaded = await loadMarkdown('data/blog.md', parseBlogMarkdown, blogPosts);
    if (!loaded || blogPosts.length === 0) {
      blogPosts.splice(0, blogPosts.length, ...fallbackBlogPosts);
    }
    renderPosts(blogPosts);
  }

  if (timelineContainer) {
    const loaded = await loadMarkdown('data/timeline.md', parseTimelineMarkdown, timelineEvents);
    if (!loaded || timelineEvents.length === 0) {
      timelineEvents.splice(0, timelineEvents.length, ...fallbackTimelineEvents);
    }
    renderTimeline(timelineEvents);
  }

  if (postDetail) {
    const slug = getQueryParam('slug');
    if (slug) {
      await loadPostDetail(slug);
    } else {
      postTitle.textContent = '文章未指定';
      postContent.innerHTML = '<p>请通过博客列表点击文章标题进入详细阅读页面。</p>';
    }
  }
})();

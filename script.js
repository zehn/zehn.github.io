const blogPosts = [
  {
    title: '构建可维护的前端组件库',
    date: '2026-06-12',
    category: '前端实践',
    excerpt: '从设计原则、组件抽象到版本管理，归纳可以长期迭代的前端组件库实践方式。',
    tags: ['组件', '前端', '设计'],
  },
  {
    title: '静态站点与 GitHub Pages 部署指南',
    date: '2026-05-28',
    category: '部署方案',
    excerpt: '用纯静态 HTML/CSS/JS 实现博客，并将它发布到 GitHub Pages 的最佳实践。',
    tags: ['GitHub Pages', '静态站点', '部署'],
  },
  {
    title: '提升工程效率的开发流程拆解',
    date: '2026-04-18',
    category: '工作流',
    excerpt: '从任务拆分、代码审查到持续集成，探讨让团队协作效率更高的流程设计。',
    tags: ['CI/CD', '流程', '团队'],
  },
  {
    title: '从思考到落地：记录思路的五个关键步骤',
    date: '2026-03-09',
    category: '思考方法',
    excerpt: '把复杂问题拆解成可执行的小步骤，帮助你把灵感转化为可交付成果。',
    tags: ['思考', '方法论', '执行'],
  },
];

const timelineEvents = [
  {
    date: '2025-02-28',
    title: '关于DeekSeek R1的使用感受',
    text: 'DeepSeek R1的回答有思考部分，它会向用户展示分析用户的输入，并给出回答策略。一开始我并不喜欢这部分，因为这让我感觉我处于下位。但是仔细想想，我又何尝不是呢？训练数据来自于大量的优质积累，可以简单理解为普世正常的认知和经验。尤其是当AI的回答让我感觉惊艳的时候。大部分时候，证明了我的认知水平和深度是低于正常水平的。',
  },
  {
    date: '2026-06-14',
    title: '如何让静态站点更具延展性',
    text: '通过模块化样式、可复用的页面片段，以及数据结构化设计，为下次迭代留出接口。',
  },
];

const postsContainer = document.getElementById('posts');
const timelineContainer = document.getElementById('timelineList');
const searchInput = document.getElementById('searchInput');

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

renderPosts(blogPosts);
renderTimeline(timelineEvents);

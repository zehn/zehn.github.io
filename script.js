const blogPosts = [];
const timelineEvents = [];

const postsContainer = document.getElementById('posts');
const timelineContainer = document.getElementById('timelineList');
const searchInput = document.getElementById('searchInput');

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

    if (line && !line.startsWith('#') && !line.startsWith('- ')) {
      current.excerpt = current.excerpt ? `${current.excerpt} ${line}` : line;
    }
  });

  if (current) posts.push(current);
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
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Unable to load ${path}`);
    const text = await response.text();
    const parsed = parser(text);
    target.splice(0, target.length, ...parsed);
  } catch (error) {
    console.warn(error);
  }
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

(async function init() {
  if (postsContainer) {
    await loadMarkdown('data/blog.md', parseBlogMarkdown, blogPosts);
    renderPosts(blogPosts);
  }

  if (timelineContainer) {
    await loadMarkdown('data/timeline.md', parseTimelineMarkdown, timelineEvents);
    renderTimeline(timelineEvents);
  }
})();

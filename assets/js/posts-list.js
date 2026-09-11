(function () {
  const root = document.getElementById("posts-list-root");
  if (!root) return;

  const limit = root.dataset.limit ? parseInt(root.dataset.limit, 10) : null;
  const posts = limit ? POSTS.slice(0, limit) : POSTS;

  if (!posts.length) {
    root.innerHTML = '<div class="notice">No posts yet.</div>';
    return;
  }

  root.innerHTML = posts.map((p) => `
    <article class="post-entry">
      <span class="date">${p.date}</span>
      <h3><a href="post.html?post=${encodeURIComponent(p.slug)}">${p.title}</a></h3>
      <p class="excerpt">${p.excerpt}</p>
      <a class="read-more" href="post.html?post=${encodeURIComponent(p.slug)}">Read more ▸</a>
    </article>
  `).join("");
})();

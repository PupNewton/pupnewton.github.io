(function () {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("post");

  const titleEl = document.getElementById("post-title");
  const dateEl = document.getElementById("post-date");
  const bodyEl = document.getElementById("post-body");

  if (!slug) {
    bodyEl.innerHTML = '<div class="notice">No post specified. <a href="posts.html">Back to posts ▸</a></div>';
    return;
  }

  fetch(`posts/${slug}.md`)
    .then((res) => {
      if (!res.ok) throw new Error("not found");
      return res.text();
    })
    .then((raw) => {
      const { meta, body } = parsePostFile(raw);
      const title = meta.title || slug;
      document.title = `${title} — pupnewton`;
      titleEl.textContent = title;
      dateEl.textContent = meta.date || "";
      bodyEl.innerHTML = markdownToHtml(body);
    })
    .catch(() => {
      bodyEl.innerHTML = `<div class="notice">Couldn't load that post. <a href="posts.html">Back to posts ▸</a></div>`;
    });
})();

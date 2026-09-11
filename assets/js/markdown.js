/* ============================================================
   Minimal Markdown -> HTML converter.
   Supports: # ## ### headers, **bold**, *italic*, [text](url) links,
   "- " unordered lists, "> " blockquotes, and paragraphs.
   Not a full CommonMark implementation — just enough for blog posts.
   ============================================================ */

function inlineMarkdown(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function markdownToHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let listBuffer = [];
  let quoteBuffer = [];

  function flushList() {
    if (listBuffer.length) {
      html.push("<ul>" + listBuffer.map((i) => `<li>${inlineMarkdown(i)}</li>`).join("") + "</ul>");
      listBuffer = [];
    }
  }

  function flushQuote() {
    if (quoteBuffer.length) {
      html.push(`<blockquote>${inlineMarkdown(quoteBuffer.join(" "))}</blockquote>`);
      quoteBuffer = [];
    }
  }

  let paragraph = [];
  function flushParagraph() {
    if (paragraph.length) {
      html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === "") {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    const headerMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headerMatch) {
      flushParagraph();
      flushList();
      flushQuote();
      const level = headerMatch[1].length + 2; // # -> h3, ## -> h4, ### -> h5
      html.push(`<h${level}>${inlineMarkdown(headerMatch[2])}</h${level}>`);
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      flushQuote();
      listBuffer.push(line.slice(2));
      continue;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      quoteBuffer.push(line.slice(2));
      continue;
    }

    flushList();
    flushQuote();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  flushQuote();

  return html.join("\n");
}

/* Splits a post file into { meta: {...}, body: "markdown text" }.
   Expects optional frontmatter delimited by --- lines at the top:
     ---
     title: My Post
     date: September 9, 2026
     excerpt: One line summary
     ---
     Body markdown starts here...
*/
function parsePostFile(raw) {
  const fmMatch = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!fmMatch) {
    return { meta: {}, body: raw };
  }
  const meta = {};
  fmMatch[1].split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) meta[key] = value;
  });
  return { meta, body: fmMatch[2] };
}

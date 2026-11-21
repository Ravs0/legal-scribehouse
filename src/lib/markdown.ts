/**
 * Article bodies: a small, safe Markdown renderer plus an HTML allowlist sanitiser.
 *
 * Bodies written in the workspace editor are Markdown. Older rows in `content` may hold HTML. Both go through
 * `renderArticle`, which converts Markdown to HTML (escaping any raw HTML first) and then sanitises the result
 * against an allowlist, so nothing an author or a database row contains can run script in a reader's browser.
 *
 * Supported Markdown: ## and ### headings, paragraphs, - and 1. lists, > quotes, **bold**, *italic*, `code`,
 * [links](https://…), and --- rules.
 */

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const safeHref = (url: string) => {
  const u = url.trim();
  if (/^(https?:|mailto:|\/|#)/i.test(u)) return u.replace(/"/g, '%22');
  return '#';
};

function inline(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
    const h = safeHref(href.replace(/&amp;/g, '&'));
    const external = /^https?:/i.test(h);
    return `<a href="${h}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
  });
  return s;
}

export function markdownToHtml(md: string): string {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const out: string[] = [];
  let para: string[] = [];
  let list: { tag: 'ul' | 'ol'; items: string[] } | null = null;
  let quote: string[] = [];

  const flushPara = () => {
    if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list) out.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.tag}>`);
    list = null;
  };
  const flushQuote = () => {
    if (quote.length) out.push(`<blockquote><p>${inline(quote.join(' '))}</p></blockquote>`);
    quote = [];
  };
  const flushAll = () => {
    flushPara();
    flushList();
    flushQuote();
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    let m: RegExpMatchArray | null;
    if (!line.trim()) {
      flushAll();
    } else if ((m = line.match(/^(#{2,3})\s+(.*)$/))) {
      flushAll();
      const level = m[1].length;
      out.push(`<h${level}>${inline(m[2])}</h${level}>`);
    } else if (/^---+$/.test(line.trim())) {
      flushAll();
      out.push('<hr>');
    } else if ((m = line.match(/^\s*[-*]\s+(.*)$/))) {
      flushPara();
      flushQuote();
      if (!list || list.tag !== 'ul') {
        flushList();
        list = { tag: 'ul', items: [] };
      }
      list.items.push(m[1]);
    } else if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
      flushPara();
      flushQuote();
      if (!list || list.tag !== 'ol') {
        flushList();
        list = { tag: 'ol', items: [] };
      }
      list.items.push(m[1]);
    } else if ((m = line.match(/^>\s?(.*)$/))) {
      flushPara();
      flushList();
      quote.push(m[1]);
    } else {
      flushList();
      flushQuote();
      para.push(line.trim());
    }
  }
  flushAll();
  return out.join('\n');
}

const ALLOWED = new Set(['P', 'H2', 'H3', 'H4', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'STRONG', 'EM', 'B', 'I', 'CODE', 'PRE', 'A', 'HR', 'BR', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD']);
const DROP_WITH_CONTENT = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'TEMPLATE', 'NOSCRIPT', 'SVG', 'MATH', 'FORM']);

/** Keeps allowlisted tags (unwrapping others), strips all attributes except safe link attributes. */
export function sanitizeHtml(html: string): string {
  if (typeof DOMParser === 'undefined') return escapeHtml(html.replace(/<[^>]*>/g, ''));
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild as HTMLElement;
  const walk = (el: Element) => {
    for (const child of Array.from(el.children)) {
      if (DROP_WITH_CONTENT.has(child.tagName)) {
        child.remove();
        continue;
      }
      walk(child);
      if (!ALLOWED.has(child.tagName)) {
        child.replaceWith(...Array.from(child.childNodes));
        continue;
      }
      for (const attr of Array.from(child.attributes)) {
        const keep = child.tagName === 'A' && attr.name === 'href';
        if (!keep) child.removeAttribute(attr.name);
      }
      if (child.tagName === 'A') {
        const href = safeHref(child.getAttribute('href') ?? '#');
        child.setAttribute('href', href);
        if (/^https?:/i.test(href)) {
          child.setAttribute('target', '_blank');
          child.setAttribute('rel', 'noopener noreferrer');
        }
      }
    }
  };
  walk(root);
  return root.innerHTML;
}

/** Markdown or legacy HTML in, safe HTML out. */
export function renderArticle(body: string): string {
  const looksLikeHtml = /^\s*<(p|h[1-6]|ul|ol|div|section|article|blockquote)[\s>]/i.test(body);
  return sanitizeHtml(looksLikeHtml ? body : markdownToHtml(body));
}

/** Rough reading time at 220 words a minute. */
export const readingMinutes = (body: string) => Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220));

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);

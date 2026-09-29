/**
 * Minimal, dependency-free Markdown subset for blog articles.
 * Output is a block/inline tree rendered as React elements, so raw HTML in content is never executed.
 *
 * Supported: ## / ### headings, paragraphs, - or * lists, 1. lists, > quotes, **bold**, *italic*, [text](url).
 */

export type Inline =
  | { type: "text"; value: string }
  | { type: "strong"; children: Inline[] }
  | { type: "em"; children: Inline[] }
  | { type: "link"; href: string; children: Inline[] };

export type Block =
  | { type: "h2" | "h3"; children: Inline[]; id: string }
  | { type: "p"; children: Inline[] }
  | { type: "quote"; children: Inline[] }
  | { type: "ul" | "ol"; items: Inline[][] };

export function safeHref(href: string): string | null {
  const value = href.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(value)) return value;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  if (value.startsWith("#")) return value;
  return null;
}

function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function parseInline(input: string): Inline[] {
  const nodes: Inline[] = [];
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|\*(?!\s)(.+?)\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    if (match.index > lastIndex) nodes.push({ type: "text", value: input.slice(lastIndex, match.index) });
    if (match[1] !== undefined) {
      nodes.push({ type: "strong", children: parseInline(match[1]) });
    } else if (match[2] !== undefined && match[3] !== undefined) {
      const href = safeHref(match[3]);
      if (href) nodes.push({ type: "link", href, children: parseInline(match[2]) });
      else nodes.push({ type: "text", value: match[2] });
    } else if (match[4] !== undefined) {
      nodes.push({ type: "em", children: parseInline(match[4]) });
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < input.length) nodes.push({ type: "text", value: input.slice(lastIndex) });
  return nodes;
}

export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { type: "ul" | "ol"; items: Inline[][] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "p", children: parseInline(paragraph.join(" ")) });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = /^(#{2,3})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const text = heading[2].trim();
      blocks.push({ type: heading[1].length === 2 ? "h2" : "h3", children: parseInline(text), id: headingId(text) });
      continue;
    }

    const bullet = /^[-*]\s+(.+)$/.exec(line);
    const ordered = /^\d+[.)]\s+(.+)$/.exec(line);
    if (bullet || ordered) {
      flushParagraph();
      const type = bullet ? "ul" : "ol";
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push(parseInline((bullet ?? ordered)![1]));
      continue;
    }

    const quote = /^>\s?(.*)$/.exec(line);
    if (quote) {
      flushParagraph();
      flushList();
      blocks.push({ type: "quote", children: parseInline(quote[1]) });
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

export function stripMarkdown(source: string): string {
  return source
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*#>_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

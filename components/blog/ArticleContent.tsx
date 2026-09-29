import Link from "next/link";
import type { ReactNode } from "react";
import { parseMarkdown, type Inline } from "@/lib/markdown";

function renderInline(nodes: Inline[], keyPrefix: string): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    switch (node.type) {
      case "text":
        return node.value;
      case "strong":
        return <strong key={key}>{renderInline(node.children, key)}</strong>;
      case "em":
        return <em key={key}>{renderInline(node.children, key)}</em>;
      case "link":
        if (node.href.startsWith("/")) {
          return (
            <Link key={key} href={node.href}>
              {renderInline(node.children, key)}
            </Link>
          );
        }
        return (
          <a key={key} href={node.href} {...(/^https?:/i.test(node.href) ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}>
            {renderInline(node.children, key)}
          </a>
        );
    }
  });
}

/** Renders article Markdown as React elements — raw HTML in content is never injected. */
export function ArticleContent({ content, className = "article-body" }: { content: string; className?: string }) {
  const blocks = parseMarkdown(content);
  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const key = `b-${index}`;
        switch (block.type) {
          case "h2":
            return (
              <h2 key={key} id={block.id}>
                {renderInline(block.children, key)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={key} id={block.id}>
                {renderInline(block.children, key)}
              </h3>
            );
          case "p":
            return <p key={key}>{renderInline(block.children, key)}</p>;
          case "quote":
            return <blockquote key={key}>{renderInline(block.children, key)}</blockquote>;
          case "ul":
            return (
              <ul key={key}>
                {block.items.map((item, i) => (
                  <li key={`${key}-${i}`}>{renderInline(item, `${key}-${i}`)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={key}>
                {block.items.map((item, i) => (
                  <li key={`${key}-${i}`}>{renderInline(item, `${key}-${i}`)}</li>
                ))}
              </ol>
            );
        }
      })}
    </div>
  );
}

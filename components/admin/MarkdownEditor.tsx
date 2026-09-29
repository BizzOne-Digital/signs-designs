"use client";

import { useRef, useState } from "react";
import { Bold, Eye, Heading2, Heading3, Italic, Link2, List, ListOrdered, Pencil, Quote } from "lucide-react";
import { ArticleContent } from "@/components/blog/ArticleContent";

type MarkdownEditorProps = { id?: string; value: string; onChange: (value: string) => void; invalid?: boolean };

type Action = { label: string; icon: typeof Bold; apply: (selected: string) => { text: string; block?: boolean } };

const ACTIONS: Action[] = [
  { label: "Heading", icon: Heading2, apply: (s) => ({ text: `## ${s || "Section heading"}`, block: true }) },
  { label: "Subheading", icon: Heading3, apply: (s) => ({ text: `### ${s || "Subheading"}`, block: true }) },
  { label: "Bold", icon: Bold, apply: (s) => ({ text: `**${s || "bold text"}**` }) },
  { label: "Italic", icon: Italic, apply: (s) => ({ text: `*${s || "italic text"}*` }) },
  { label: "Link", icon: Link2, apply: (s) => ({ text: `[${s || "link text"}](/contact)` }) },
  { label: "Bulleted list", icon: List, apply: (s) => ({ text: (s || "List item").split("\n").map((l) => `- ${l}`).join("\n"), block: true }) },
  { label: "Numbered list", icon: ListOrdered, apply: (s) => ({ text: (s || "List item").split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n"), block: true }) },
  { label: "Quote", icon: Quote, apply: (s) => ({ text: `> ${s || "Quote"}`, block: true }) },
];

/** Lightweight structured editor: Markdown textarea with formatting toolbar and live preview. */
export function MarkdownEditor({ id, value, onChange, invalid }: MarkdownEditorProps) {
  const [mode, setMode] = useState<"write" | "preview">("write");
  const ref = useRef<HTMLTextAreaElement>(null);

  const runAction = (action: Action) => {
    const textarea = ref.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const selected = value.slice(start, end);
    const { text, block } = action.apply(selected);
    const before = value.slice(0, start);
    const after = value.slice(end);
    const prefix = block && before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : "";
    const suffix = block && after && !after.startsWith("\n") ? "\n\n" : "";
    const next = `${before}${prefix}${text}${suffix}${after}`;
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = before.length + prefix.length + text.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div className={`overflow-hidden rounded-[4px] border bg-white ${invalid ? "border-brand-deep" : "border-ink/15"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 bg-fog/70 px-2 py-1.5">
        <div className="flex flex-wrap gap-0.5" role="toolbar" aria-label="Formatting">
          {ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => runAction(action)}
              disabled={mode === "preview"}
              className="rounded p-1.5 text-graphite transition hover:bg-white hover:text-ink disabled:opacity-30"
              aria-label={action.label}
              title={action.label}
            >
              <action.icon className="size-4" aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="flex rounded-[3px] border border-ink/10 bg-white p-0.5 text-xs font-bold uppercase">
          <button type="button" onClick={() => setMode("write")} aria-pressed={mode === "write"} className={`inline-flex items-center gap-1 rounded-[2px] px-2.5 py-1 ${mode === "write" ? "bg-ink text-white" : "text-graphite"}`}>
            <Pencil className="size-3" aria-hidden="true" /> Write
          </button>
          <button type="button" onClick={() => setMode("preview")} aria-pressed={mode === "preview"} className={`inline-flex items-center gap-1 rounded-[2px] px-2.5 py-1 ${mode === "preview" ? "bg-ink text-white" : "text-graphite"}`}>
            <Eye className="size-3" aria-hidden="true" /> Preview
          </button>
        </div>
      </div>
      {mode === "write" ? (
        <textarea
          id={id}
          ref={ref}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={16}
          aria-invalid={invalid || undefined}
          className="block min-h-72 w-full resize-y px-4 py-3 font-mono text-[0.85rem] leading-6 text-ink focus:outline-none"
          placeholder={"Write the article here.\n\n## Use headings for sections\n\n- Bulleted lists\n- **Bold** and [links](/contact)"}
        />
      ) : (
        <div className="max-h-[32rem] min-h-72 overflow-y-auto px-5 py-2">
          {value.trim() ? <ArticleContent content={value} /> : <p className="py-8 text-sm text-steel">Nothing to preview yet.</p>}
        </div>
      )}
    </div>
  );
}

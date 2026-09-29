"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { adminInput } from "@/components/admin/ui";

type ListEditorProps = {
  label: string;
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  max?: number;
  help?: string;
};

/** Editable list of short strings (service features, trust indicators). */
export function ListEditor({ label, value, onChange, placeholder = "Add an item", max = 20, help }: ListEditorProps) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const item = draft.trim();
    if (!item || value.length >= max || value.includes(item)) return;
    onChange([...value, item]);
    setDraft("");
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <p className="mb-1.5 text-xs font-bold tracking-[0.08em] text-graphite uppercase">{label}</p>
      {value.length > 0 ? (
        <ul className="mb-2 divide-y divide-ink/10 rounded-[4px] border border-ink/10 bg-white">
          {value.map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-center gap-2 px-3 py-2">
              <input
                value={item}
                onChange={(event) => onChange(value.map((v, i) => (i === index ? event.target.value : v)))}
                aria-label={`${label} item ${index + 1}`}
                className="min-w-0 flex-1 bg-transparent text-sm text-ink focus:outline-none"
              />
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="rounded p-1 text-steel hover:bg-fog disabled:opacity-30" aria-label="Move up">
                <ArrowUp className="size-3.5" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === value.length - 1} className="rounded p-1 text-steel hover:bg-fog disabled:opacity-30" aria-label="Move down">
                <ArrowDown className="size-3.5" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => onChange(value.filter((_, i) => i !== index))} className="rounded p-1 text-brand-deep hover:bg-brand/10" aria-label={`Remove ${item}`}>
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {value.length < max ? (
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                add();
              }
            }}
            placeholder={placeholder}
            aria-label={`New ${label.toLowerCase()} item`}
            className={adminInput}
          />
          <button type="button" onClick={add} className="inline-flex shrink-0 items-center gap-1 rounded-[4px] bg-ink px-3 text-xs font-bold text-white uppercase hover:bg-charcoal">
            <Plus className="size-4" aria-hidden="true" />
            Add
          </button>
        </div>
      ) : null}
      {help ? <p className="mt-1.5 text-xs text-steel">{help}</p> : null}
    </div>
  );
}

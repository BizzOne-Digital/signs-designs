"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LocalImageField } from "@/components/admin/LocalImageField";
import type { UploadFolder } from "@/lib/constants";

type GalleryFieldProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  folder: UploadFolder;
  label?: string;
  max?: number;
};

/** Multiple images, each handled by its own LocalImageField, with reordering. */
export function GalleryField({ value, onChange, folder, label = "Gallery images", max = 24 }: GalleryFieldProps) {
  const [adderKey, setAdderKey] = useState(0);

  const replaceAt = (index: number, url: string) => {
    if (!url) onChange(value.filter((_, i) => i !== index));
    else onChange(value.map((item, i) => (i === index ? url : item)));
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
      <p className="mb-1.5 text-xs font-bold tracking-[0.08em] text-graphite uppercase">
        {label} <span className="font-medium tracking-normal text-steel normal-case">({value.length}/{max})</span>
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {value.map((url, index) => (
          <div key={`${url}-${index}`} className="relative">
            <LocalImageField value={url} folder={folder} compact onChange={(next) => replaceAt(index, next)} />
            <div className="absolute top-1.5 left-1.5 flex gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="flex size-7 items-center justify-center rounded-[3px] bg-ink/80 text-white transition hover:bg-ink disabled:opacity-30"
                aria-label={`Move image ${index + 1} earlier`}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === value.length - 1}
                className="flex size-7 items-center justify-center rounded-[3px] bg-ink/80 text-white transition hover:bg-ink disabled:opacity-30"
                aria-label={`Move image ${index + 1} later`}
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
        {value.length < max ? (
          <LocalImageField
            key={adderKey}
            value=""
            folder={folder}
            compact
            onChange={(url) => {
              if (url) {
                onChange([...value, url]);
                setAdderKey((k) => k + 1);
              }
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

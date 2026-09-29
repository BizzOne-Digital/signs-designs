"use client";

import { useMemo, useState } from "react";
import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPostDTO } from "@/lib/types";

export function BlogList({ posts }: { posts: BlogPostDTO[] }) {
  const [category, setCategory] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))], [posts]);
  const visible = category === "All" ? posts : posts.filter((p) => p.category === category);

  return (
    <div>
      {categories.length > 2 ? (
        <div role="group" aria-label="Filter articles by category" className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`shrink-0 rounded-[3px] border px-4 py-2 font-display text-xs font-bold tracking-[0.12em] uppercase transition ${
                category === item ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-graphite hover:border-ink/40"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
      {visible.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="rounded-[var(--radius-card)] border border-dashed border-ink/20 p-10 text-center text-steel">No articles in this category yet.</p>
      )}
    </div>
  );
}

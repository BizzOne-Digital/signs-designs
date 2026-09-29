"use client";

import { useMemo, useState } from "react";
import { PortfolioCard } from "@/components/home/PortfolioCard";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";
import type { PortfolioDTO } from "@/lib/types";

/** Masonry portfolio grid with category filter (1 column mobile, 2 tablet, 3 desktop). */
export function PortfolioGallery({ projects }: { projects: PortfolioDTO[] }) {
  const [active, setActive] = useState<string>("All");

  const categories = useMemo(() => {
    const present = new Set(projects.map((p) => p.category));
    return ["All", ...PORTFOLIO_CATEGORIES.filter((c) => present.has(c))];
  }, [projects]);

  const visible = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {categories.map((category) => {
          const selected = active === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              aria-pressed={selected}
              className={`shrink-0 rounded-[3px] border px-4 py-2 font-display text-xs font-bold tracking-[0.12em] uppercase transition ${
                selected ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-graphite hover:border-ink/40"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3" aria-live="polite">
        {visible.map((project, index) => (
          <PortfolioCard key={project.id} project={project} index={index} />
        ))}
      </div>

      {visible.length === 0 ? <p className="mt-10 text-center text-steel">No projects in this category yet.</p> : null}
    </div>
  );
}

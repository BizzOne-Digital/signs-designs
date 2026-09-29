import { MapPin } from "lucide-react";
import { SiteImage } from "@/components/ui/SiteImage";
import type { PortfolioDTO } from "@/lib/types";

const ASPECTS = ["aspect-[4/5]", "aspect-[4/3]", "aspect-square", "aspect-[4/3]", "aspect-[4/5]", "aspect-square"];

export function PortfolioCard({ project, index }: { project: PortfolioDTO; index: number }) {
  return (
    <article className="group mb-6 break-inside-avoid overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-white shadow-card transition-shadow duration-300 hover:shadow-lift">
      <div className={`relative overflow-hidden bg-fog ${ASPECTS[index % ASPECTS.length]}`}>
        <SiteImage
          src={project.image}
          alt={`${project.title} — ${project.category}`}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
        <span className="absolute top-4 left-4 rounded-[3px] bg-brand px-2.5 py-1 font-display text-[0.65rem] font-bold tracking-[0.16em] text-white uppercase">
          {project.category}
        </span>
        {project.galleryImages.length > 0 ? (
          <span className="absolute top-4 right-4 rounded-[3px] bg-ink/80 px-2 py-1 text-[0.65rem] font-semibold text-white">
            +{project.galleryImages.length} photos
          </span>
        ) : null}
        {project.location ? (
          <p className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs font-semibold text-white">
            <MapPin className="size-3.5 text-brand" aria-hidden="true" />
            {project.location}
          </p>
        ) : null}
      </div>
      <div className="border-t-[3px] border-transparent p-5 transition-colors duration-300 group-hover:border-brand">
        <h3 className="font-display text-lg leading-tight font-extrabold text-ink uppercase">{project.title}</h3>
        {project.description ? <p className="mt-2 text-sm leading-6 text-steel">{project.description}</p> : null}
      </div>
    </article>
  );
}

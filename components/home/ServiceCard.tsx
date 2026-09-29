import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServiceIcon } from "@/components/ui/Icons";
import { SiteImage } from "@/components/ui/SiteImage";
import type { ServiceDTO } from "@/lib/types";

export function ServiceCard({ service, index }: { service: ServiceDTO; index: number }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-ink transition-all duration-300 hover:-translate-y-1 hover:border-brand/70 hover:shadow-[0_30px_60px_-30px_rgba(242,13,22,0.45)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <SiteImage
          src={service.image}
          alt={service.title}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <span className="absolute top-4 right-4 font-display text-sm font-extrabold text-white/70">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="relative flex flex-1 flex-col px-6 pt-0 pb-7">
        <span className="-mt-7 mb-5 flex size-14 items-center justify-center rounded-[4px] bg-brand text-white shadow-[0_12px_24px_-10px_rgba(242,13,22,0.8)]">
          <ServiceIcon icon={service.icon} className="size-7" />
        </span>
        <h3 className="font-display text-xl leading-tight font-extrabold text-white uppercase">{service.title}</h3>
        <p className="mt-3 flex-1 text-[0.95rem] leading-7 text-white/65">{service.shortDescription}</p>
        <Link
          href={`/services#${service.slug}`}
          className="mt-6 inline-flex items-center gap-2 font-display text-xs font-bold tracking-[0.16em] text-white uppercase after:absolute after:inset-0 hover:text-brand-bright"
          aria-label={`Learn more about ${service.title}`}
        >
          Learn More
          <ArrowUpRight className="size-4 text-brand transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

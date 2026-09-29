import { ServiceIcon } from "@/components/ui/Icons";
import type { ServiceDTO } from "@/lib/types";

/** Sticky jump links to each service section. */
export function ServicesNav({ services }: { services: ServiceDTO[] }) {
  return (
    <nav aria-label="Services on this page" className="sticky top-[4.5rem] z-30 border-b border-ink/10 bg-white/95 backdrop-blur-md">
      <div className="container-site">
        <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 py-3 sm:mx-0 sm:px-0 lg:justify-center">
          {services.map((service) => (
            <li key={service.id} className="shrink-0">
              <a
                href={`#${service.slug}`}
                className="flex items-center gap-2 rounded-[3px] px-3 py-2 font-display text-[0.72rem] font-bold tracking-[0.1em] text-graphite uppercase transition hover:bg-fog hover:text-ink"
              >
                <ServiceIcon icon={service.icon} className="size-4 text-brand-deep" />
                {service.title.split(" & ")[0]}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

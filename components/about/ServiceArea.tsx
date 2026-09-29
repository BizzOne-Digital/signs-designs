import { MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { LeafMark } from "@/components/ui/Logo";

const AREAS = ["Windsor", "Tecumseh", "Lakeshore", "LaSalle", "Amherstburg", "Belle River", "Kingsville", "Leamington", "Essex", "Essex County"];

export function ServiceArea({ title, text }: { title: string; text: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal py-20 text-white sm:py-24">
      <div className="bg-grid-dark absolute inset-0 -z-10" aria-hidden="true" />
      <LeafMark className="absolute -right-24 -bottom-24 -z-10 size-[28rem] text-white/[0.03]" cut={false} />
      <div className="container-site grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="eyebrow mb-4 text-white/80">Service Area</p>
          <h2 className="text-3xl leading-[1.05] font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">{text}</p>
        </Reveal>
        <Reveal delay={100}>
          <ul className="flex flex-wrap gap-2.5">
            {AREAS.map((area) => (
              <li
                key={area}
                className="inline-flex items-center gap-2 rounded-[3px] border border-white/15 bg-white/[0.03] px-4 py-2.5 font-display text-sm font-bold tracking-wide uppercase transition hover:border-brand hover:bg-brand"
              >
                <MapPin className="size-4 text-brand group-hover:text-white" aria-hidden="true" />
                {area}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-white/55">Shop location: 12361 Lachance Crt., Tecumseh, ON N8N 1L5</p>
        </Reveal>
      </div>
    </section>
  );
}

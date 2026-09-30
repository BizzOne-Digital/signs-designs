import { ClipboardCheck, Handshake, Ruler, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";

const PRINCIPLES = [
  { icon: Handshake, title: "Honest recommendations", text: "The right sign for your budget — not the most expensive one." },
  { icon: Ruler, title: "Measured for the site", text: "Sized for viewing distance, mounting surface and visibility." },
  { icon: ClipboardCheck, title: "Approved before production", text: "You approve every proof with me before anything is made." },
  { icon: ShieldCheck, title: "Built to last", text: "Commercial-grade materials, installed securely by Eric." },
];

export function OurApproach({ title, text, image }: { title: string; text: string; image: string }) {
  return (
    <section className="bg-fog py-20 sm:py-24 lg:py-32">
      <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative order-2 lg:order-1">
          <div className="clip-angle-br relative aspect-[5/4] overflow-hidden shadow-lift">
            <SiteImage src={image} alt="Graphic designer preparing sign artwork" fill sizes="(min-width: 1024px) 45vw, 92vw" className="object-cover" />
          </div>
          <div className="absolute -top-4 -left-4 -z-0 h-24 w-24 bg-brand" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} aria-hidden="true" />
        </Reveal>
        <Reveal delay={100} className="order-1 lg:order-2">
          <p className="eyebrow mb-4 text-brand-deep">My Approach</p>
          <h2 className="text-[1.85rem] leading-[1.15] font-extrabold tracking-tight sm:text-4xl lg:text-[2.6rem]">{title}</h2>
          <p className="mt-6 text-lg leading-8 text-graphite/85">{text}</p>
          <ul className="mt-9 grid gap-5 sm:grid-cols-2">
            {PRINCIPLES.map(({ icon: Icon, title: itemTitle, text: itemText }) => (
              <li key={itemTitle} className="flex gap-3">
                <Icon className="mt-0.5 size-6 shrink-0 text-brand-deep" strokeWidth={1.75} aria-hidden="true" />
                <div>
                  <h3 className="font-display text-sm font-extrabold tracking-wide text-ink uppercase">{itemTitle}</h3>
                  <p className="mt-1 text-sm leading-6 text-steel">{itemText}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

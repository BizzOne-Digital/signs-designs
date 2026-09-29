import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SiteImage } from "@/components/ui/SiteImage";

export const STATS = [
  { value: "32", suffix: "+", label: "Years Experience", text: "Hands-on sign industry experience behind every project." },
  { value: "12", suffix: "+", label: "Years in Business", text: "Serving Windsor-Essex businesses from our Tecumseh shop." },
  { value: "6", suffix: "+", label: "Core Signage Services", text: "Design, storefront, vehicle, window, print and installation." },
  { value: "Local", suffix: "", label: "Windsor-Essex Service", text: "A local team you can call, meet and count on." },
];

export function WhyChooseUs({ title, intro, image }: { title: string; intro: string; image: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink py-20 text-white sm:py-24 lg:py-32">
      <SiteImage src={image} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/70" aria-hidden="true" />
      <div className="absolute top-0 left-0 -z-10 h-full w-2 bg-brand" aria-hidden="true" />
      <div className="container-site">
        <Reveal>
          <SectionHeading eyebrow="Why Choose Us" title={title} intro={intro} tone="dark" />
        </Reveal>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal as="li" key={stat.label} delay={index * 90} className="group relative bg-ink/90 p-7 transition-colors duration-300 hover:bg-charcoal lg:p-8">
              <span className="absolute top-0 left-0 h-[3px] w-10 bg-brand transition-all duration-500 group-hover:w-full" aria-hidden="true" />
              <p className="font-display text-6xl leading-none font-extrabold tracking-tight lg:text-7xl">
                {stat.value}
                <span className="text-brand">{stat.suffix}</span>
              </p>
              <p className="mt-3 font-display text-sm font-bold tracking-[0.16em] text-white uppercase">{stat.label}</p>
              <p className="mt-3 text-sm leading-6 text-white/60">{stat.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

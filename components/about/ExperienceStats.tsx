import { Reveal } from "@/components/ui/Reveal";
import { STATS } from "@/components/home/WhyChooseUs";

export function ExperienceStats({ text }: { text: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink py-20 text-white sm:py-24">
      <div className="bg-hazard absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow mb-4 text-white/80">Experience</p>
          <h2 className="text-3xl leading-[1.05] font-extrabold tracking-tight sm:text-4xl">
            Built on <span className="text-brand">32 years</span> of sign work
          </h2>
          <p className="mt-5 text-base leading-7 text-white/65">{text}</p>
        </Reveal>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] bg-white/10 lg:col-span-8">
          {STATS.map((stat, index) => (
            <Reveal as="li" key={stat.label} delay={index * 80} className="bg-ink p-6 sm:p-8">
              <p className="font-display text-5xl leading-none font-extrabold sm:text-6xl">
                {stat.value}
                <span className="text-brand">{stat.suffix}</span>
              </p>
              <p className="mt-3 font-display text-xs font-bold tracking-[0.16em] text-white/75 uppercase sm:text-sm">{stat.label}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

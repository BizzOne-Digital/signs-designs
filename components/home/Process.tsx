import { Factory, MessagesSquare, PenTool, Wrench } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Consultation",
    text: "I learn about your business, visit or review the site myself, and recommend the right signage for your goals and budget.",
    icon: MessagesSquare,
  },
  {
    number: "02",
    title: "Design",
    text: "I prepare production-ready artwork and a clear proof. Nothing moves forward until you approve it.",
    icon: PenTool,
  },
  {
    number: "03",
    title: "Production",
    text: "I build your signage in my Tecumseh shop with commercial-grade materials selected for the location and lifespan you need.",
    icon: Factory,
  },
  {
    number: "04",
    title: "Installation",
    text: "Eric personally handles every installation on site. Each sign is measured, mounted and aligned by Eric for a clean, durable, professional finish.",
    icon: Wrench,
  },
];

export function Process({ title, intro }: { title: string; intro: string }) {
  return (
    <section className="relative overflow-hidden bg-fog py-20 sm:py-24 lg:py-32">
      <div className="bg-grid-light absolute inset-0" aria-hidden="true" />
      <div className="container-site relative">
        <Reveal>
          <SectionHeading eyebrow="How It Works" title={title} intro={intro} align="center" />
        </Reveal>

        <div className="relative mt-16">
        <div className="absolute top-[2.6rem] right-[12.5%] left-[12.5%] hidden h-px bg-ink/15 lg:block" aria-hidden="true" />
        <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {PROCESS_STEPS.map(({ number, title: stepTitle, text, icon: Icon }, index) => (
            <Reveal as="li" key={number} delay={index * 110} className="group relative lg:px-5">
              <div className="h-full rounded-[var(--radius-card)] border border-ink/10 bg-white p-7 shadow-card transition duration-300 group-hover:-translate-y-1 group-hover:border-brand/50 lg:border-0 lg:bg-transparent lg:p-0 lg:text-center lg:shadow-none lg:group-hover:translate-y-0">
                <div className="relative flex items-center gap-4 lg:flex-col">
                  <span className="relative z-10 flex size-[5.2rem] shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    <Icon className="size-8" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="font-display text-5xl font-extrabold text-transparent [-webkit-text-stroke:1.5px_var(--color-brand)] lg:mt-5">{number}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-extrabold text-ink uppercase">{stepTitle}</h3>
                <p className="mt-2 text-[0.95rem] leading-7 text-steel">{text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        </div>
      </div>
    </section>
  );
}

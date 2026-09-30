import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROCESS_STEPS } from "@/components/home/Process";

/** Vertical design / production / installation timeline for the About page. */
export function ProcessTimeline() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Design • Production • Installation"
              title="You Work With One Person"
              intro="No salespeople and no hand-offs. The person who designs your sign is the same person who builds and installs it: me."
            />
          </div>
        </Reveal>
        <div className="relative lg:col-span-7">
        <span className="absolute top-2 bottom-2 left-[1.6rem] w-px bg-ink/15" aria-hidden="true" />
        <ol className="relative space-y-6">
          {PROCESS_STEPS.map(({ number, title, text, icon: Icon }, index) => (
            <Reveal as="li" key={number} delay={index * 90} className="relative flex gap-6">
              <span className="relative z-10 flex size-[3.25rem] shrink-0 items-center justify-center rounded-[4px] bg-ink text-white">
                <Icon className="size-6" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <div className="flex-1 rounded-[var(--radius-card)] border border-ink/10 p-6 transition hover:border-brand/40 hover:shadow-card">
                <p className="font-display text-xs font-bold tracking-[0.2em] text-brand-deep uppercase">Step {number}</p>
                <h3 className="mt-1 font-display text-xl font-extrabold text-ink uppercase">{title}</h3>
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

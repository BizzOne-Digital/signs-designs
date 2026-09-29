import { Award, Clock3, Layers, MapPin, MessageSquare, Wrench } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const REASONS = [
  { icon: Award, title: "32 years of experience", text: "Decades of hands-on sign work means fewer surprises and better results." },
  { icon: Layers, title: "Full-service under one roof", text: "Design, fabrication and installation handled by one accountable team." },
  { icon: MapPin, title: "Truly local", text: "Based in Tecumseh and familiar with sites across Windsor-Essex." },
  { icon: MessageSquare, title: "Clear communication", text: "Straight answers, clear quotes and proofs you approve before production." },
  { icon: Wrench, title: "Professional installs", text: "Level, secure and clean installations that protect your investment." },
  { icon: Clock3, title: "Built for the long term", text: "Materials selected for Ontario weather and years of daily visibility." },
];

export function WhyWorkWithUs() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="container-site">
        <Reveal>
          <SectionHeading eyebrow="Why Work With Us" title="The Local Sign Partner Businesses Rely On" align="center" />
        </Reveal>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, text }, index) => (
            <Reveal
              as="li"
              key={title}
              delay={(index % 3) * 80}
              className="group rounded-[var(--radius-card)] border border-ink/10 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-lift"
            >
              <span className="flex size-12 items-center justify-center rounded-[4px] bg-fog text-brand-deep transition-colors group-hover:bg-brand group-hover:text-white">
                <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-lg font-extrabold text-ink uppercase">{title}</h3>
              <p className="mt-2 text-[0.95rem] leading-7 text-steel">{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { Award, Clock3, Layers, MapPin, MessageSquare, Wrench } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const REASONS = [
  { icon: Award, title: "32+ years of experience", text: "Decades of hands-on sign work means fewer surprises and better results." },
  { icon: Layers, title: "Owner-operated from start to finish", text: "I handle design, fabrication and installation myself. One person, fully accountable." },
  { icon: MapPin, title: "Home-based in Tecumseh", text: "Low overhead keeps pricing fair, and I know sites across Windsor-Essex." },
  { icon: MessageSquare, title: "Direct communication", text: "You call Eric, not a front desk. Straight answers, clear quotes, quick replies." },
  { icon: Wrench, title: "Personally installed", text: "Every sign is measured, mounted and aligned by Eric himself." },
  { icon: Clock3, title: "Built for the long term", text: "Materials selected for Ontario weather and years of daily visibility." },
];

export function WhyWorkWithUs() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="container-site">
        <Reveal>
          <SectionHeading eyebrow="Why Work With Eric" title="Sign-Shop Quality With Owner-Level Attention" align="center" />
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

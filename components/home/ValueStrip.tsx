import { MapPin, PenTool, ShieldCheck, Wrench } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const VALUES = [
  { icon: PenTool, title: "Custom Design", text: "Artwork I create around your brand and your location." },
  { icon: ShieldCheck, title: "Commercial-Grade Materials", text: "Built for Ontario weather and years of daily use." },
  { icon: Wrench, title: "Professional Installation", text: "Personally measured, mounted, and aligned by Eric." },
  { icon: MapPin, title: "Direct, Low-Overhead Service", text: "Home-based in Tecumseh. You talk to the owner, and low overhead keeps pricing fair." },
];

export function ValueStrip() {
  return (
    <section aria-label="Why businesses choose us" className="relative z-10 bg-white pt-12 sm:pt-16">
      <div className="container-site">
        <div className="relative grid border border-ink/10 bg-white shadow-card sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute top-0 left-0 h-[3px] w-24 bg-brand" aria-hidden="true" />
          {VALUES.map(({ icon: Icon, title, text }, index) => (
            <Reveal
              key={title}
              delay={index * 80}
              className="group flex gap-4 border-ink/10 p-6 not-last:border-b sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:not-last:border-r lg:p-7"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-[4px] border border-brand/25 bg-brand/[0.06] text-brand-deep transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-[0.95rem] leading-snug font-extrabold text-ink uppercase">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-steel">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";

type AboutIntroProps = {
  eyebrow: string;
  title: string;
  text: string;
  text2: string;
  image: string;
};

const POINTS = ["In-house design and production", "Commercial-grade, weather-ready materials", "Installed by the team that built it"];

export function AboutIntro({ eyebrow, title, text, text2, image }: AboutIntroProps) {
  return (
    <section className="overflow-hidden bg-white py-20 sm:py-24 lg:py-32">
      <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-xl lg:mx-0">
          <div className="clip-angle-br absolute -bottom-5 -left-5 h-3/4 w-3/4 bg-brand" aria-hidden="true" />
          <div className="bg-grid-light absolute -top-6 -right-6 h-1/2 w-1/2" aria-hidden="true" />
          <div className="clip-angle-tl relative aspect-[4/5] overflow-hidden bg-fog shadow-lift">
            <SiteImage src={image} alt="Storefront signage on a local business street" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover transition-transform duration-700 hover:scale-105" />
          </div>
          <div className="absolute right-4 -bottom-8 bg-ink px-6 py-5 text-white shadow-lift sm:right-8">
            <p className="font-display text-5xl leading-none font-extrabold">
              32<span className="text-brand">+</span>
            </p>
            <p className="mt-2 text-[0.7rem] font-bold tracking-[0.2em] text-white/70 uppercase">Years of experience</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="eyebrow mb-4 text-brand-deep">{eyebrow}</p>
          <h2 className="text-[1.85rem] leading-[1.15] font-extrabold tracking-tight sm:text-4xl lg:text-[2.6rem]">{title}</h2>
          <p className="mt-6 text-lg leading-8 text-graphite">{text}</p>
          <p className="mt-4 text-base leading-7 text-graphite/80">{text2}</p>
          <ul className="mt-8 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3 font-medium text-ink">
                <span className="flex size-6 items-center justify-center rounded-[3px] bg-brand text-white">
                  <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/about" variant="dark" icon={<ArrowRight className="size-4" aria-hidden="true" />}>
              Learn More About Us
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline-dark">
              Request a Free Quote
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

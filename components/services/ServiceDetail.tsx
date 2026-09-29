import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import { SERVICE_TO_QUOTE_OPTION } from "@/lib/constants";
import type { ServiceDTO } from "@/lib/types";

export function ServiceDetail({ service, index }: { service: ServiceDTO; index: number }) {
  const reversed = index % 2 === 1;
  const quoteOption = SERVICE_TO_QUOTE_OPTION[service.slug];
  const quoteHref = quoteOption ? `/contact?service=${encodeURIComponent(quoteOption)}` : "/contact";
  const paragraphs = (service.description || service.shortDescription).split(/\n{2,}/).filter(Boolean);

  return (
    <section id={service.slug} className={`scroll-mt-36 py-20 sm:py-24 ${reversed ? "bg-fog" : "bg-white"}`} aria-labelledby={`${service.slug}-title`}>
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className={`relative ${reversed ? "lg:order-2" : ""}`}>
          <div className={`${reversed ? "clip-angle-tl" : "clip-angle-br"} relative aspect-[4/3] overflow-hidden bg-graphite shadow-lift`}>
            <SiteImage src={service.image} alt={service.title} fill sizes="(min-width: 1024px) 45vw, 92vw" className="object-cover transition-transform duration-700 hover:scale-105" />
          </div>
          <span
            className={`absolute -bottom-6 flex size-20 items-center justify-center rounded-[4px] bg-brand text-white shadow-lift ${reversed ? "-left-3 sm:-left-6" : "-right-3 sm:-right-6"}`}
          >
            <ServiceIcon icon={service.icon} className="size-9" />
          </span>
          <span className="absolute top-5 left-5 font-display text-6xl font-extrabold text-white/80 [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </Reveal>

        <Reveal delay={100}>
          <p className="eyebrow mb-4 text-brand-deep">Service {String(index + 1).padStart(2, "0")}</p>
          <h2 id={`${service.slug}-title`} className="text-3xl leading-[1.05] font-extrabold tracking-tight sm:text-4xl">
            {service.title}
          </h2>
          <p className="mt-5 font-display text-lg leading-7 font-semibold text-ink">{service.shortDescription}</p>
          {service.description
            ? paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="mt-4 text-base leading-8 text-graphite/85">
                  {paragraph}
                </p>
              ))
            : null}

          {service.features.length > 0 ? (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 rounded-[4px] border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-ink">
                  <Check className="size-4 shrink-0 text-brand" strokeWidth={3} aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-9">
            <ButtonLink href={quoteHref} icon={<ArrowRight className="size-4" aria-hidden="true" />}>
              Request a Quote
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

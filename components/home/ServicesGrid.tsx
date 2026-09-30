import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/home/ServiceCard";
import type { ServiceDTO } from "@/lib/types";

type ServicesGridProps = { eyebrow: string; title: string; intro: string; services: ServiceDTO[] };

export function ServicesGrid({ eyebrow, title, intro, services }: ServicesGridProps) {
  return (
    <section id="services" className="relative isolate overflow-hidden bg-charcoal py-20 text-white sm:py-24 lg:py-32">
      <div className="bg-grid-dark absolute inset-0 -z-10" aria-hidden="true" />
      <div className="absolute top-0 right-0 -z-10 h-2 w-1/2 bg-brand" style={{ clipPath: "polygon(12px 0, 100% 0, 100% 100%, 0 100%)" }} aria-hidden="true" />
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionHeading eyebrow={eyebrow} title={title} intro={intro} tone="dark" />
          </Reveal>
          <Reveal delay={100} className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <ButtonLink href="/services" variant="outline-light" icon={<ArrowRight className="size-4" aria-hidden="true" />}>
              View All Services
            </ButtonLink>
            <ButtonLink href="/contact">Request a Free Quote</ButtonLink>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={(index % 4) * 80} className="h-full">
              <ServiceCard service={service} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

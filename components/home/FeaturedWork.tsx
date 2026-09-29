import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PortfolioGallery } from "@/components/home/PortfolioGallery";
import type { PortfolioDTO } from "@/lib/types";

type FeaturedWorkProps = { eyebrow: string; title: string; intro: string; projects: PortfolioDTO[] };

export function FeaturedWork({ eyebrow, title, intro, projects }: FeaturedWorkProps) {
  if (projects.length === 0) return null;
  return (
    <section id="work" className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="container-site">
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
          </Reveal>
          <Reveal delay={100}>
            <ButtonLink href="/contact" icon={<ArrowRight className="size-4" aria-hidden="true" />}>
              Request a Free Quote
            </ButtonLink>
          </Reveal>
        </div>
        <PortfolioGallery projects={projects} />
      </div>
    </section>
  );
}

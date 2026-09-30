import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { QuoteCta } from "@/components/layout/QuoteCta";
import { ButtonLink } from "@/components/ui/Button";
import { OurStory } from "@/components/about/OurStory";
import { ExperienceStats } from "@/components/about/ExperienceStats";
import { OurApproach } from "@/components/about/OurApproach";
import { ProcessTimeline } from "@/components/about/ProcessTimeline";
import { ServiceArea } from "@/components/about/ServiceArea";
import { WhyWorkWithUs } from "@/components/about/WhyWorkWithUs";
import { contentText } from "@/lib/content-definitions";
import { getPageContent, getSiteSettings } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About Eric — Owner-Operated Sign Shop in Tecumseh, Ontario",
  description:
    "Meet Eric Marmus: 32+ years in the sign trade, running a home-based, owner-operated sign shop in Tecumseh. Direct communication and personal involvement from design to installation.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About Signs & Designs by Eric", url: "/about" },
};

export default async function AboutPage() {
  const [content, settings] = await Promise.all([getPageContent("about"), getSiteSettings()]);
  const t = (path: string) => contentText(content, path);

  return (
    <>
      <PageHero eyebrow="Owner-Operated · 32+ Years" title={t("hero.title")} subtitle={t("hero.subtitle")} image={t("hero.image")} breadcrumb="About">
        <ButtonLink href="/contact" size="lg" icon={<ArrowRight className="size-4" aria-hidden="true" />}>
          Request a Free Quote
        </ButtonLink>
        <ButtonLink href="/services" variant="outline-light" size="lg">
          Explore Services
        </ButtonLink>
      </PageHero>
      <OurStory eyebrow={t("story.eyebrow")} title={t("story.title")} intro={t("story.intro")} body={t("story.body")} image={t("story.image")} />
      <ExperienceStats text={t("experience.text")} />
      <OurApproach title={t("approach.title")} text={t("approach.text")} image={t("approach.image")} />
      <ProcessTimeline />
      <ServiceArea title={t("serviceArea.title")} text={t("serviceArea.text")} />
      <WhyWorkWithUs />
      <QuoteCta
        title="Let's Build Something That Gets Noticed"
        text="Tell me about your business and your space. I'll recommend the right signage and prepare a custom quote myself."
        phone={settings.phone}
      />
    </>
  );
}

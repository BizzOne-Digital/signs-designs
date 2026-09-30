import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { QuoteCta } from "@/components/layout/QuoteCta";
import { ButtonLink } from "@/components/ui/Button";
import { PortfolioGallery } from "@/components/home/PortfolioGallery";
import { EmptyGallery } from "@/components/portfolio/EmptyGallery";
import { contentText } from "@/lib/content-definitions";
import { getPageContent, getPublishedPortfolio, getSiteSettings } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Portfolio & Gallery: Signs, Vehicle Graphics & Installations",
  description:
    "Completed sign work by Eric Marmus: storefront signs, vehicle graphics, window and interior signage, site and real estate signs, displays and installations across Windsor-Essex.",
  alternates: { canonical: "/portfolio" },
  openGraph: { title: "Portfolio | Signs & Designs by Eric", url: "/portfolio" },
};

export default async function PortfolioPage() {
  const [content, projects, settings] = await Promise.all([getPageContent("portfolio"), getPublishedPortfolio(), getSiteSettings()]);
  const t = (path: string) => contentText(content, path);

  return (
    <>
      <PageHero eyebrow="Completed Work" title={t("hero.title")} subtitle={t("hero.subtitle")} image={t("hero.image")} breadcrumb="Portfolio">
        <ButtonLink href="/contact" size="lg" icon={<ArrowRight className="size-4" aria-hidden="true" />}>
          Request a Free Quote
        </ButtonLink>
      </PageHero>
      <section className="bg-fog py-16 sm:py-20 lg:py-24">
        <div className="container-site">{projects.length > 0 ? <PortfolioGallery projects={projects} /> : <EmptyGallery />}</div>
      </section>
      <QuoteCta
        title="Want Your Business in the Gallery?"
        text="Tell me about your project. I'll design, build and install it personally, and it might be the next job featured here."
        phone={settings.phone}
      />
    </>
  );
}

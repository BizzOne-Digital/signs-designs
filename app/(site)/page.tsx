import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ValueStrip } from "@/components/home/ValueStrip";
import { AboutIntro } from "@/components/home/AboutIntro";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Process } from "@/components/home/Process";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { QuoteCta } from "@/components/layout/QuoteCta";
import { contentList, contentText } from "@/lib/content-definitions";
import { getActiveServices, getFeaturedPortfolio, getPageContent, getSiteSettings } from "@/lib/data";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: { absolute: settings.seoTitle },
    description: settings.seoDescription,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [content, services, projects, settings] = await Promise.all([
    getPageContent("home"),
    getActiveServices(),
    getFeaturedPortfolio(9),
    getSiteSettings(),
  ]);
  const t = (path: string) => contentText(content, path);

  return (
    <>
      <Hero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        highlight={t("hero.highlight")}
        subtitle={t("hero.subtitle")}
        primaryCta={t("hero.primaryCta")}
        secondaryCta={t("hero.secondaryCta")}
        image={t("hero.image")}
        trust={contentList(content, "hero.trust")}
      />
      <ValueStrip />
      <AboutIntro eyebrow={t("about.eyebrow")} title={t("about.title")} text={t("about.text")} text2={t("about.text2")} image={t("about.image")} />
      <ServicesGrid eyebrow={t("services.eyebrow")} title={t("services.title")} intro={t("services.intro")} services={services} />
      <FeaturedWork eyebrow={t("portfolio.eyebrow")} title={t("portfolio.title")} intro={t("portfolio.intro")} projects={projects} />
      <Process title={t("process.title")} intro={t("process.intro")} />
      <WhyChooseUs title={t("stats.title")} intro={t("stats.intro")} image={t("stats.image")} />
      <QuoteCta title={t("cta.title")} text={t("cta.text")} phone={settings.phone} />
    </>
  );
}

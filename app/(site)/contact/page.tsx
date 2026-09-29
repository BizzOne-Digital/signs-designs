import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { QuoteForm } from "@/components/contact/QuoteForm";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { contentText } from "@/lib/content-definitions";
import { getPageContent, getSiteSettings } from "@/lib/data";
import { img } from "@/lib/placeholder-images";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Request a Free Sign Quote — Windsor, Tecumseh & Essex County",
  description:
    "Request a free quote for custom signs, storefront signage, vehicle graphics, window vinyl or sign installation. Call 519-739-1107 or send your project details online.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Get a Free Quote | Signs & Designs by Eric", url: "/contact" },
};

function FormFallback() {
  return <div className="h-[900px] animate-pulse rounded-[var(--radius-card)] border border-ink/10 bg-white" aria-hidden="true" />;
}

export default async function ContactPage() {
  const [content, settings] = await Promise.all([getPageContent("contact"), getSiteSettings()]);
  const t = (path: string) => contentText(content, path);

  return (
    <>
      <PageHero eyebrow="Contact / Request a Quote" title={t("hero.title")} subtitle={t("hero.subtitle")} image={img("menuBoards", 1600)} breadcrumb="Contact" />
      <section className="relative bg-fog py-16 sm:py-20 lg:py-24">
        <div className="bg-grid-light absolute inset-0" aria-hidden="true" />
        <div className="container-site relative grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 xl:col-span-8">
            <Suspense fallback={<FormFallback />}>
              <QuoteForm email={settings.email} />
            </Suspense>
          </div>
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-28">
              <ContactDetails settings={settings} title={t("details.title")} text={t("details.text")} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

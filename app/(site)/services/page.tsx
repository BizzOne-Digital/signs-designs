import type { Metadata } from "next";
import { ArrowRight, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { QuoteCta } from "@/components/layout/QuoteCta";
import { buttonClasses, ButtonLink } from "@/components/ui/Button";
import { ServicesNav } from "@/components/services/ServicesNav";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { JsonLdScript } from "@/components/layout/JsonLd";
import { contentText } from "@/lib/content-definitions";
import { getActiveServices, getPageContent, getSiteSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/constants";
import { telHref } from "@/lib/format";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Commercial Signage, Vehicle Graphics & Sign Installation Services",
  description:
    "Storefront signs, custom sign design, vehicle graphics, window and wall graphics, promotional prints and professional sign installation in Windsor, Tecumseh and Essex County.",
  alternates: { canonical: "/services" },
  openGraph: { title: "Signage & Graphics Services | Signs & Designs by Eric", url: "/services" },
};

export default async function ServicesPage() {
  const [content, services, settings] = await Promise.all([getPageContent("services"), getActiveServices(), getSiteSettings()]);
  const t = (path: string) => contentText(content, path);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.shortDescription,
        url: `${SITE_URL}/services#${service.slug}`,
        provider: { "@id": `${SITE_URL}/#business` },
        areaServed: ["Windsor", "Tecumseh", "Essex County"],
      },
    })),
  };

  return (
    <>
      <JsonLdScript data={serviceJsonLd} />
      <PageHero eyebrow="What I Do" title={t("hero.title")} subtitle={t("hero.subtitle")} image={t("hero.image")} breadcrumb="Services">
        <ButtonLink href="/contact" size="lg" icon={<ArrowRight className="size-4" aria-hidden="true" />}>
          Request a Free Quote
        </ButtonLink>
        <a href={telHref(settings.phone)} className={buttonClasses("outline-light", "lg")}>
          <Phone className="size-4" aria-hidden="true" />
          Call {settings.phone}
        </a>
      </PageHero>
      {services.length > 0 ? <ServicesNav services={services} /> : null}
      {services.map((service, index) => (
        <ServiceDetail key={service.id} service={service} index={index} />
      ))}
      <QuoteCta title={t("cta.title")} text={t("cta.text")} phone={settings.phone} />
    </>
  );
}

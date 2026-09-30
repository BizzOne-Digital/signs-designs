import { BUSINESS, SITE_URL } from "@/lib/constants";
import type { SiteSettingsDTO } from "@/lib/types";

/** Serializes JSON-LD safely: "<" is escaped so content can never close the script tag. */
export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** LocalBusiness structured data. Opening hours are intentionally omitted (not published by the business). */
export function LocalBusinessJsonLd({ settings }: { settings: SiteSettingsDTO }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: settings.businessName,
    description: settings.seoDescription,
    url: SITE_URL,
    telephone: `+1-${settings.phone}`,
    email: settings.email,
    image: `${SITE_URL}/opengraph-image`,
    founder: { "@type": "Person", name: BUSINESS.owner },
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.street,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.country,
    },
    areaServed: [
      { "@type": "City", name: "Windsor" },
      { "@type": "City", name: "Tecumseh" },
      { "@type": "AdministrativeArea", name: "Essex County" },
    ],
    sameAs: settings.facebook ? [settings.facebook] : [],
    knowsAbout: ["Custom signage", "Storefront signs", "Vehicle graphics", "Window graphics", "Development and real estate signs", "Interior signage", "Sign installation", "Graphic design"],
  };
  return <JsonLdScript data={data} />;
}

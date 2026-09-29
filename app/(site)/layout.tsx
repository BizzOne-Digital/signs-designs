import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileQuoteBar } from "@/components/layout/MobileQuoteBar";
import { LocalBusinessJsonLd } from "@/components/layout/JsonLd";
import { getSiteSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <>
      <LocalBusinessJsonLd settings={settings} />
      <Header settings={settings} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer settings={settings} />
      <MobileQuoteBar phone={settings.phone} />
    </>
  );
}

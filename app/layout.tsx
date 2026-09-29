import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import { SITE_URL } from "@/lib/constants";
import { getSiteSettings } from "@/lib/data";
import { normalizeImageUrl } from "@/lib/images";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const favicon = settings.favicon ? normalizeImageUrl(settings.favicon) : null;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings.seoTitle,
      template: `%s | ${settings.businessName}`,
    },
    description: settings.seoDescription,
    applicationName: settings.businessName,
    keywords: [
      "Custom Signs Windsor",
      "Signs Tecumseh Ontario",
      "Commercial Signage Windsor",
      "Vehicle Graphics Windsor",
      "Storefront Signs Windsor",
      "Sign Installation Essex County",
      "Business Signs Tecumseh",
    ],
    openGraph: {
      type: "website",
      locale: "en_CA",
      siteName: settings.businessName,
      title: settings.seoTitle,
      description: settings.seoDescription,
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle,
      description: settings.seoDescription,
    },
    ...(favicon ? { icons: { icon: favicon } } : {}),
  };
}

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA" className={`${montserrat.variable} ${inter.variable}`}>
      <body>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

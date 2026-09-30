import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { FacebookIcon } from "@/components/ui/Icons";
import { NAV_LINKS } from "@/lib/constants";
import { telHref } from "@/lib/format";
import type { SiteSettingsDTO } from "@/lib/types";

const SERVICE_LINKS = [
  { label: "Storefront Signs", href: "/services#storefront-commercial-signage" },
  { label: "Vehicle Graphics", href: "/services#vehicle-graphics-fleet-lettering" },
  { label: "Commercial Graphics", href: "/services#custom-graphic-sign-design" },
  { label: "Window Graphics", href: "/services#window-wall-floor-graphics" },
  { label: "Promotional Prints", href: "/services#promotional-prints-event-displays" },
  { label: "Site & Real Estate Signs", href: "/services#development-real-estate-site-signs" },
  { label: "Interior Signage", href: "/services#interior-signage" },
  { label: "Installation", href: "/services#professional-site-installation" },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-5 font-display text-xs font-bold tracking-[0.22em] text-white">{children}</h2>;
}

export function Footer({ settings }: { settings: SiteSettingsDTO }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="h-1 w-full bg-brand" aria-hidden="true" />
      <div className="bg-grid-dark absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-site relative pt-16 pb-28 sm:pb-12 lg:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="Signs & Designs by Eric — home" className="inline-block">
              <Logo logoUrl={settings.logo} className="h-16 sm:h-20" />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
              An owner-operated sign shop in Tecumseh. Eric personally designs, builds and installs custom signage for businesses across Windsor and Essex County.
            </p>
            <div className="mt-7">
              <ButtonLink href="/contact" icon={<ArrowRight className="size-4" aria-hidden="true" />}>
                Request a Free Quote
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-2">
            <FooterHeading>Explore</FooterHeading>
            <ul className="space-y-3 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <FooterHeading>Services</FooterHeading>
            <ul className="space-y-3 text-sm">
              {SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <FooterHeading>Contact</FooterHeading>
            <ul className="space-y-4 text-sm">
              <li>
                <a href={telHref(settings.phone)} className="flex items-start gap-3 text-white/80 transition hover:text-white">
                  <Phone className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                  <span className="font-display font-bold">{settings.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-start gap-3 break-all text-white/60 transition hover:text-white">
                  <Mail className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/60">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                <span>Tecumseh, Ontario</span>
              </li>
              {settings.facebook ? (
                <li>
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-white/60 transition hover:text-white"
                  >
                    <span className="flex size-8 items-center justify-center rounded-[4px] border border-white/15">
                      <FacebookIcon className="size-4" />
                    </span>
                    Facebook
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {settings.businessName}. All rights reserved.
          </p>
          <p>Serving Windsor, Tecumseh &amp; Essex County, Ontario</p>
        </div>
      </div>
    </footer>
  );
}

import { Clock3, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon } from "@/components/ui/Icons";
import { BUSINESS } from "@/lib/constants";
import { telHref } from "@/lib/format";
import type { SiteSettingsDTO } from "@/lib/types";

const NEXT_STEPS = [
  "I personally review your project details and any files you send.",
  "I contact you directly to ask questions or arrange a site visit.",
  "You receive a clear, custom quote from me, with no obligation.",
];

export function ContactDetails({ settings, title, text }: { settings: SiteSettingsDTO; title: string; text: string }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${BUSINESS.street} ${BUSINESS.city} ${BUSINESS.region} ${BUSINESS.postalCode}`)}`;

  const rows = [
    { icon: Phone, label: "Phone", value: settings.phone, href: telHref(settings.phone) },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
  ];

  return (
    <aside className="space-y-6">
      <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-ink p-7 text-white sm:p-9">
        <div className="absolute top-0 left-0 h-1 w-full bg-brand" aria-hidden="true" />
        <div className="bg-grid-dark absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="relative">
          <h2 className="text-2xl leading-tight font-extrabold tracking-tight">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-white/65">{text}</p>

          <ul className="mt-8 space-y-5">
            {rows.map(({ icon: Icon, label, value, href }) => (
              <li key={label}>
                <a href={href} className="group flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-[4px] bg-brand text-white">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[0.7rem] font-bold tracking-[0.18em] text-white/50 uppercase">{label}</span>
                    <span className="font-display text-lg font-bold break-all text-white group-hover:text-brand-bright">{value}</span>
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[4px] bg-brand text-white">
                  <MapPin className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[0.7rem] font-bold tracking-[0.18em] text-white/50 uppercase">Address</span>
                  <address className="not-italic">
                    <span className="block font-display font-bold text-white group-hover:text-brand-bright">{BUSINESS.street}</span>
                    <span className="block text-white/75">
                      {BUSINESS.city}, {BUSINESS.region}
                    </span>
                    <span className="block text-white/75">{BUSINESS.postalCode}</span>
                  </address>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-white/50 group-hover:text-white">
                    Get directions <ExternalLink className="size-3" aria-hidden="true" />
                  </span>
                </span>
              </a>
            </li>
            {settings.facebook ? (
              <li>
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-[4px] border border-white/20 text-white">
                    <FacebookIcon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-[0.7rem] font-bold tracking-[0.18em] text-white/50 uppercase">Facebook</span>
                    <span className="font-display font-bold text-white group-hover:text-brand-bright">See my latest projects</span>
                  </span>
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] border border-ink/10 bg-white p-7 sm:p-8">
        <h2 className="flex items-center gap-2 font-display text-sm font-extrabold tracking-[0.14em] text-ink">
          <Clock3 className="size-4 text-brand-deep" aria-hidden="true" />
          What happens next
        </h2>
        <ol className="mt-5 space-y-4">
          {NEXT_STEPS.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-6 text-graphite">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-[3px] bg-ink font-display text-xs font-bold text-white">{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <p className="mt-6 border-t border-ink/10 pt-5 text-xs leading-5 text-steel">Owner-operated from Tecumseh, serving all of Windsor-Essex.</p>
      </div>
    </aside>
  );
}

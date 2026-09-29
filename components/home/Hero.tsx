import Image from "next/image";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import heroImage from "@/public/hero.png";

type HeroProps = {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  image: string;
  trust: string[];
};

/**
 * Full-background hero. Uses public/hero.png by default; an image uploaded in
 * Admin > Pages (stored under /api/uploads/) replaces it.
 */
export function Hero({ eyebrow, title, highlight, subtitle, primaryCta, secondaryCta, image, trust }: HeroProps) {
  const uploaded = image.startsWith("/api/uploads/") ? image : null;

  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      {uploaded ? (
        <Image src={uploaded} alt="" fill priority sizes="100vw" className="-z-20 object-cover object-right" />
      ) : (
        <Image src={heroImage} alt="" fill priority placeholder="blur" sizes="100vw" className="-z-20 object-cover object-right" />
      )}
      {/* Darkens the left side so the text stays readable over the photo */}
      <div className="absolute inset-0 -z-10 bg-ink/65 lg:bg-transparent lg:bg-gradient-to-r lg:from-ink/90 lg:via-ink/55 lg:to-transparent" aria-hidden="true" />

      <div className="container-site flex min-h-[600px] items-center pt-24 pb-16 sm:min-h-[660px] lg:min-h-[max(720px,88svh)] lg:pt-28 lg:pb-20">
        <div className="max-w-xl xl:max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-white/75 uppercase">
            <MapPin className="size-4 text-brand" aria-hidden="true" />
            {eyebrow}
          </p>

          <h1 className="text-[1.9rem] leading-[1.18] font-bold tracking-tight min-[400px]:text-[2.15rem] sm:text-[2.75rem] lg:text-[3.1rem] xl:text-[3.5rem] 2xl:text-[3.9rem]">
            {title} <span className="text-brand">{highlight}</span>
          </h1>

          <p className="mt-5 text-base leading-7 text-white/80 xl:text-lg xl:leading-8">{subtitle}</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" size="lg" icon={<ArrowRight className="size-4" aria-hidden="true" />}>
              {primaryCta}
            </ButtonLink>
            <ButtonLink href="/services" variant="outline-light" size="lg">
              {secondaryCta}
            </ButtonLink>
          </div>

          {trust.length > 0 ? (
            <ul className="mt-7 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {trust.slice(0, 4).map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-white/90">
                  <Check className="size-4 shrink-0 text-brand" strokeWidth={3} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SiteImage } from "@/components/ui/SiteImage";
import { LeafMark } from "@/components/ui/Logo";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
  breadcrumb: string;
  children?: React.ReactNode;
};

/** Dark inner-page hero with angular image panel and breadcrumb. */
export function PageHero({ eyebrow, title, subtitle, image, breadcrumb, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-ink pt-28 pb-14 text-white sm:pt-32 lg:pt-36 lg:pb-20">
      {image ? (
        <div className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[55%]">
          <SiteImage src={image} alt="" fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="animate-reveal-right object-cover opacity-40 lg:clip-angle-left lg:opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30 lg:from-ink lg:via-ink/40 lg:to-transparent" />
        </div>
      ) : null}
      <div className="bg-grid-dark absolute inset-0 -z-20" aria-hidden="true" />
      <LeafMark className="absolute -bottom-24 -left-20 -z-10 size-80 text-white/[0.03]" cut={false} />
      <div className="absolute bottom-0 left-0 h-1.5 w-1/3 bg-brand" style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)" }} aria-hidden="true" />

      <div className="container-site">
        <nav aria-label="Breadcrumb" className="mb-8 animate-fade-up">
          <ol className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-white/60 uppercase">
            <li>
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="text-white">
              {breadcrumb}
            </li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="eyebrow mb-5 animate-fade-up text-white/80 [animation-delay:80ms]">{eyebrow}</p>
          <h1 className="animate-fade-up text-3xl leading-[1.12] font-extrabold tracking-tight [animation-delay:140ms] sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle ? <p className="mt-6 max-w-2xl animate-fade-up text-lg leading-8 text-white/70 [animation-delay:220ms]">{subtitle}</p> : null}
          {children ? <div className="mt-9 flex animate-fade-up flex-wrap gap-3 [animation-delay:300ms]">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

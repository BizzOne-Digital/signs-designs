import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";

type OurStoryProps = { eyebrow: string; title: string; intro: string; body: string; image: string };

export function OurStory({ eyebrow, title, intro, body, image }: OurStoryProps) {
  const paragraphs = body.split(/\n{2,}|\r\n\r\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <p className="eyebrow mb-4 text-brand-deep">{eyebrow}</p>
          <h2 className="text-[1.85rem] leading-[1.15] font-extrabold tracking-tight sm:text-4xl lg:text-[2.6rem]">{title}</h2>
          <p className="mt-7 border-l-4 border-brand pl-5 font-display text-xl leading-8 font-semibold text-ink">{intro}</p>
          <div className="mt-6 space-y-5 text-base leading-8 text-graphite/85">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120} className="relative lg:col-span-5">
          <div className="clip-angle-tl relative aspect-[4/5] overflow-hidden bg-fog shadow-lift lg:sticky lg:top-28">
            <SiteImage src={image} alt="Sign fabrication work in progress" fill sizes="(min-width: 1024px) 38vw, 92vw" className="object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { ArrowRight, Phone } from "lucide-react";
import { buttonClasses, ButtonLink } from "@/components/ui/Button";
import { LeafMark } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { telHref } from "@/lib/format";

type QuoteCtaProps = {
  title: string;
  text: string;
  phone: string;
};

/** Full-width red call-to-action band used at the end of every public page. */
export function QuoteCta({ title, text, phone }: QuoteCtaProps) {
  return (
    <section className="relative isolate overflow-hidden bg-brand text-white">
      <div className="bg-hazard absolute inset-0 -z-10" aria-hidden="true" />
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-[38%] bg-ink lg:block" style={{ clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)" }} aria-hidden="true" />
      <LeafMark className="absolute top-1/2 right-[9%] -z-10 hidden size-72 -translate-y-1/2 text-brand lg:block" cut={false} />
      <div className="container-site py-16 sm:py-20 lg:py-24">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-4 text-white [&::before]:bg-white">Free, no-obligation quote</p>
          <h2 className="text-3xl leading-[1.05] font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/90">{text}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" variant="dark" size="lg" icon={<ArrowRight className="size-4" aria-hidden="true" />}>
              Request a Free Quote
            </ButtonLink>
            <a href={telHref(phone)} className={buttonClasses("outline-light", "lg", "border-white/60")}>
              <Phone className="size-4" aria-hidden="true" />
              Call {phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

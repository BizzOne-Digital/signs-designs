import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { LeafMark } from "@/components/ui/Logo";

export default function SiteNotFound() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden bg-ink pt-28 pb-20 text-white">
      <div className="bg-grid-dark absolute inset-0 -z-10" aria-hidden="true" />
      <LeafMark className="absolute -right-20 bottom-0 -z-10 size-[30rem] text-white/[0.03]" cut={false} />
      <div className="container-site">
        <p className="font-display text-8xl leading-none font-extrabold text-brand sm:text-9xl">404</p>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">This page isn&apos;t on the map</h1>
        <p className="mt-4 max-w-lg text-lg text-white/65">The page you&apos;re looking for may have moved or no longer exists.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg" icon={<ArrowRight className="size-4" aria-hidden="true" />}>
            Back to Home
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline-light" size="lg">
            Request a Free Quote
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

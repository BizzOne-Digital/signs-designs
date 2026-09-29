import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-svh flex-col bg-ink text-white">
      <div className="bg-grid-dark absolute inset-0 -z-10" aria-hidden="true" />
      <div className="container-site flex h-20 items-center">
        <Link href="/" aria-label="Signs & Designs by Eric — home">
          <Logo />
        </Link>
      </div>
      <div className="container-site flex flex-1 flex-col justify-center pb-20">
        <p className="font-display text-8xl leading-none font-extrabold text-brand sm:text-9xl">404</p>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">Page not found</h1>
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
    </main>
  );
}

"use client";

import { useEffect } from "react";
import { Phone, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BUSINESS } from "@/lib/constants";
import { telHref } from "@/lib/format";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70svh] items-center bg-ink pt-28 pb-20 text-white">
      <div className="container-site">
        <p className="eyebrow mb-4 text-white/70">Something went wrong</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">This page couldn&apos;t load</h1>
        <p className="mt-4 max-w-lg text-lg text-white/65">Please try again. If the problem continues, give me a call. I&apos;m happy to help.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={reset} icon={<RefreshCw className="size-4" aria-hidden="true" />}>
            Try Again
          </Button>
          <a href={telHref(BUSINESS.phone)} className="inline-flex h-14 items-center justify-center gap-2 rounded-[4px] border border-white/35 px-8 font-display text-sm font-bold tracking-[0.08em] uppercase transition hover:bg-white hover:text-ink">
            <Phone className="size-4" aria-hidden="true" />
            Call {BUSINESS.phone}
          </a>
        </div>
      </div>
    </section>
  );
}

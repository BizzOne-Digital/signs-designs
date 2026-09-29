"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { telHref } from "@/lib/format";

/** Sticky mobile call-to-action. Hidden on the contact page, where the form is already visible. */
export function MobileQuoteBar({ phone }: { phone: string }) {
  const pathname = usePathname();
  if (pathname === "/contact") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-ink/95 p-3 backdrop-blur-md sm:hidden">
      <div className="flex gap-2">
        <a
          href={telHref(phone)}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[4px] border border-white/20 font-display text-xs font-bold tracking-[0.08em] text-white uppercase"
          aria-label={`Call ${phone}`}
        >
          <Phone className="size-4 text-brand" aria-hidden="true" />
          Call
        </a>
        <Link
          href="/contact"
          className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-[4px] bg-brand font-display text-xs font-bold tracking-[0.08em] text-white uppercase"
        >
          Request a Free Quote
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Mail, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { FacebookIcon } from "@/components/ui/Icons";
import { NAV_LINKS } from "@/lib/constants";
import { telHref } from "@/lib/format";

type HeaderClientProps = {
  phone: string;
  email: string;
  facebook: string;
  logoUrl: string;
};

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderClient({ phone, email, facebook, logoUrl }: HeaderClientProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openedFrom, setOpenedFrom] = useState(pathname);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the drawer when the route changes (state reset during render, no effect needed).
  if (open && openedFrom !== pathname) {
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>("a, button");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openDrawer = () => {
    setOpenedFrom(pathname);
    setOpen(true);
  };

  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[70] -translate-y-24 rounded bg-brand px-4 py-2 text-sm font-bold text-white focus:translate-y-0"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || open ? "border-b border-white/10 bg-ink/95 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md" : "bg-gradient-to-b from-ink/80 to-transparent"
        }`}
      >
        <div className={`container-site flex items-center justify-between gap-4 transition-all duration-300 h-[4.5rem]`}>
          <Link href="/" className="shrink-0 rounded-sm" aria-label="Signs & Designs by Eric — home">
            <Logo logoUrl={logoUrl} className="h-14 sm:h-16" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative px-3 py-2 font-display text-[0.78rem] font-bold tracking-[0.1em] uppercase transition-colors ${
                        active ? "text-white" : "text-white/70 hover:text-white"
                      }`}
                    >
                      {link.label}
                      <span
                        className="absolute inset-x-3 -bottom-0.5 h-[3px] origin-left bg-brand transition-transform duration-300"
                        style={{ transform: `${active ? "scaleX(1)" : "scaleX(0)"} skewX(-24deg)` }}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={telHref(phone)}
              className="hidden items-center gap-2 font-display text-sm font-bold text-white/85 transition hover:text-white xl:flex"
            >
              <Phone className="size-4 text-brand" aria-hidden="true" />
              {phone}
            </a>
            <span className="hidden sm:block">
              <ButtonLink href="/contact" icon={<ArrowRight className="size-4" aria-hidden="true" />}>
                Request a Free Quote
              </ButtonLink>
            </span>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => (open ? setOpen(false) : openDrawer())}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex size-11 items-center justify-center rounded-[4px] border border-white/20 text-white transition hover:border-white/50 lg:hidden"
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          className={`absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          id="mobile-menu"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          inert={!open}
          className={`absolute top-0 right-0 flex h-full w-full max-w-sm flex-col overflow-y-auto bg-ink pt-24 pb-8 shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="absolute top-0 right-0 h-1 w-full bg-brand" aria-hidden="true" />
          <nav aria-label="Mobile" className="px-6">
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {NAV_LINKS.map((link, index) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href} style={{ transitionDelay: open ? `${80 + index * 40}ms` : "0ms" }} className={`transition-all duration-300 ${open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}`}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between py-4 font-display text-2xl font-extrabold tracking-tight uppercase ${active ? "text-brand" : "text-white"}`}
                    >
                      {link.label}
                      <ArrowRight className="size-5 text-white/40" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-8 space-y-4 px-6">
            <ButtonLink href="/contact" size="lg" className="w-full" onClick={() => setOpen(false)} icon={<ArrowRight className="size-4" aria-hidden="true" />}>
              Request a Free Quote
            </ButtonLink>
            <a href={telHref(phone)} className="flex items-center gap-3 rounded-[4px] border border-white/15 px-4 py-3 text-white">
              <Phone className="size-5 text-brand" aria-hidden="true" />
              <span className="font-display font-bold">Call {phone}</span>
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-3 px-1 text-sm text-white/70 hover:text-white">
              <Mail className="size-4 text-brand" aria-hidden="true" />
              {email}
            </a>
            {facebook ? (
              <a href={facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-1 text-sm text-white/70 hover:text-white">
                <FacebookIcon className="size-4 text-brand" />
                Follow us on Facebook
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

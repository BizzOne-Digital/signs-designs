"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ExternalLink,
  FileText,
  FolderKanban,
  Images,
  Inbox,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Newspaper,
  Settings,
  Wrench,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useToast } from "@/components/ui/Toast";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/portfolio", label: "Portfolio", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/blogs", label: "Blog", icon: Newspaper },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/inquiries", label: "Quote Requests", icon: Inbox },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [openedFrom, setOpenedFrom] = useState(pathname);
  const [loggingOut, setLoggingOut] = useState(false);

  if (open && openedFrom !== pathname) setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } catch {
      toast.error("Could not sign out. Please try again.");
      setLoggingOut(false);
    }
  };

  const nav = (
    <nav aria-label="Admin" className="flex flex-1 flex-col">
      <ul className="space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm font-semibold transition ${
                  active ? "bg-brand text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="size-[1.15rem] shrink-0" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
        <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm font-semibold text-white/65 transition hover:bg-white/5 hover:text-white">
          <ExternalLink className="size-[1.15rem]" aria-hidden="true" />
          View website
        </Link>
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm font-semibold text-white/65 transition hover:bg-white/5 hover:text-white disabled:opacity-60"
        >
          {loggingOut ? <LoaderCircle className="size-[1.15rem] animate-spin" aria-hidden="true" /> : <LogOut className="size-[1.15rem]" aria-hidden="true" />}
          Logout
        </button>
        <p className="truncate px-3 pt-2 text-xs text-white/40" title={email}>
          Signed in as {email}
        </p>
      </div>
    </nav>
  );

  return (
    <div className="min-h-svh bg-fog">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-ink px-4 pt-6 pb-5 lg:flex">
        <Link href="/admin" className="mb-8 px-2" aria-label="Admin dashboard">
          <Logo />
        </Link>
        {nav}
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-ink px-4 lg:hidden">
        <Link href="/admin" aria-label="Admin dashboard">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={() => {
            setOpenedFrom(pathname);
            setOpen(true);
          }}
          aria-expanded={open}
          aria-controls="admin-drawer"
          aria-label="Open admin menu"
          className="inline-flex size-10 items-center justify-center rounded-[4px] border border-white/20 text-white"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-ink/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
        <div
          id="admin-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Admin menu"
          inert={!open}
          className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-ink px-4 pt-5 pb-5 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="mb-6 flex items-center justify-between px-2">
            <Logo />
            <button type="button" onClick={() => setOpen(false)} className="rounded p-1.5 text-white/70 hover:text-white" aria-label="Close admin menu">
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          {nav}
        </div>
      </div>

      <main id="main" className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}

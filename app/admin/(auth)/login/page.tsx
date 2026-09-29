import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/ui/Logo";
import { getAdminSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign In" };

export default async function AdminLoginPage() {
  const session = await getAdminSession().catch(() => null);
  if (session) redirect("/admin");

  return (
    <main className="relative isolate flex min-h-svh items-center justify-center bg-ink px-4 py-12">
      <div className="bg-grid-dark absolute inset-0 -z-10" aria-hidden="true" />
      <div className="absolute top-0 left-0 h-1 w-full bg-brand" aria-hidden="true" />
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-7 shadow-2xl sm:p-9">
          <h1 className="font-display text-2xl font-extrabold tracking-tight">Admin Sign In</h1>
          <p className="mt-1.5 mb-7 text-sm text-steel">Manage website content, portfolio and quote requests.</p>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to website
        </Link>
      </div>
    </main>
  );
}

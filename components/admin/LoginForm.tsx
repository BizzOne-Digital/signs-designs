"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { adminInput } from "@/components/admin/ui";

function safeNext(value: string | null): string {
  // Only allow redirects back into the admin area (prevents open redirects).
  if (value && value.startsWith("/admin") && !value.startsWith("//") && !value.startsWith("/admin/login")) return value;
  return "/admin";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json().catch(() => null)) as { success?: boolean; error?: string } | null;
      if (!response.ok || !payload?.success) {
        setError(payload?.error || "Sign-in failed. Please try again.");
        setSubmitting(false);
        return;
      }
      router.replace(safeNext(searchParams.get("next")));
      router.refresh();
    } catch {
      setError("Network error. Check your connection and try again.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="admin-email" className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-graphite uppercase">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={adminInput}
          required
          aria-invalid={error ? true : undefined}
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-graphite uppercase">
          Password
        </label>
        <div className="relative">
          <input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`${adminInput} pr-11`}
            required
            aria-invalid={error ? true : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-steel hover:text-ink"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {error ? (
        <p role="alert" className="rounded-[4px] border border-brand/30 bg-brand/5 px-3 py-2.5 text-sm font-medium text-brand-deep">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
        {submitting ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}

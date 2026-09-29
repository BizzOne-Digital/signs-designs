"use client";

import { useId, type ReactNode } from "react";
import { Inbox, LoaderCircle } from "lucide-react";

export const adminInput =
  "block w-full rounded-[4px] border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-steel/70 transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 disabled:bg-fog aria-[invalid=true]:border-brand-deep";

type FieldProps = {
  label: string;
  error?: string;
  help?: string;
  required?: boolean;
  children: (props: { id: string; "aria-invalid"?: boolean; "aria-describedby"?: string }) => ReactNode;
  className?: string;
};

/** Label + control + help/error text with correct aria wiring. */
export function Field({ label, error, help, required, children, className = "" }: FieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : help ? `${id}-help` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-graphite uppercase">
        {label}
        {required ? <span className="ml-0.5 text-brand-deep">*</span> : null}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-brand-deep">
          {error}
        </p>
      ) : help ? (
        <p id={`${id}-help`} className="mt-1.5 text-xs text-steel">
          {help}
        </p>
      ) : null}
    </div>
  );
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (value: boolean) => void; label: string; description?: string }) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4 rounded-[4px] border border-ink/10 bg-white px-4 py-3">
      <div>
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
        </label>
        {description ? <p className="text-xs text-steel">{description}</p> : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${checked ? "bg-brand" : "bg-ink/20"}`}
      >
        <span className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[1.35rem]" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-sm text-steel">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[var(--radius-card)] border border-ink/10 bg-white shadow-card ${className}`}>{children}</div>;
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-steel" role="status">
      <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
      {label}…
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-ink/20 bg-white px-6 py-14 text-center">
      <Inbox className="size-9 text-steel/60" aria-hidden="true" />
      <p className="mt-4 font-display font-bold text-ink uppercase">{title}</p>
      {text ? <p className="mt-1 max-w-sm text-sm text-steel">{text}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

const BADGE_TONES = {
  red: "bg-brand/10 text-brand-deep ring-brand/20",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/20",
  blue: "bg-sky-50 text-sky-800 ring-sky-600/20",
  gray: "bg-fog text-graphite ring-ink/10",
};

export function Badge({ tone = "gray", children }: { tone?: keyof typeof BADGE_TONES; children: ReactNode }) {
  return <span className={`inline-flex items-center rounded-[3px] px-2 py-0.5 text-[0.7rem] font-bold tracking-wide uppercase ring-1 ring-inset ${BADGE_TONES[tone]}`}>{children}</span>;
}

export const STATUS_TONES: Record<string, keyof typeof BADGE_TONES> = {
  new: "red",
  contacted: "amber",
  quoted: "blue",
  closed: "green",
};

export function IconButton({ label, onClick, children, tone = "default", disabled }: { label: string; onClick: () => void; children: ReactNode; tone?: "default" | "danger"; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`inline-flex size-9 items-center justify-center rounded-[4px] border transition disabled:opacity-40 ${
        tone === "danger" ? "border-brand/20 text-brand-deep hover:bg-brand hover:text-white" : "border-ink/10 text-graphite hover:border-ink/30 hover:bg-fog"
      }`}
    >
      {children}
    </button>
  );
}

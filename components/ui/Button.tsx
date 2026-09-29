import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "dark" | "light" | "outline-light" | "outline-dark" | "ghost-light";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 font-display font-bold uppercase tracking-[0.08em] transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 rounded-[4px] whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-[0_10px_30px_-12px_rgba(242,13,22,0.8)] hover:bg-brand-bright hover:-translate-y-0.5",
  dark: "bg-ink text-white hover:bg-charcoal hover:-translate-y-0.5",
  light: "bg-white text-ink hover:bg-fog hover:-translate-y-0.5",
  "outline-light": "border border-white/35 text-white hover:border-white hover:bg-white hover:text-ink",
  "outline-dark": "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white",
  "ghost-light": "text-white hover:text-brand-bright",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.8rem]",
  lg: "h-13 px-7 text-[0.85rem] sm:h-14 sm:px-8",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: ReactNode;
};

export function ButtonLink({ variant = "primary", size = "md", className = "", icon, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {children}
      {icon ? <span className="transition-transform duration-200 group-hover/btn:translate-x-1">{icon}</span> : null}
    </Link>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size; icon?: ReactNode };

export function Button({ variant = "primary", size = "md", className = "", icon, children, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...props}>
      {children}
      {icon ? <span className="transition-transform duration-200 group-hover/btn:translate-x-1">{icon}</span> : null}
    </button>
  );
}

import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({ eyebrow, title, intro, tone = "light", align = "left", as: Tag = "h2", className = "" }: SectionHeadingProps) {
  const onDark = tone === "dark";
  return (
    <div className={`${align === "center" ? "mx-auto text-center [&_.eyebrow]:justify-center" : ""} max-w-3xl ${className}`}>
      {eyebrow ? <p className={`eyebrow mb-4 ${onDark ? "text-white/80" : "text-brand-deep"}`}>{eyebrow}</p> : null}
      <Tag
        className={`text-[1.85rem] leading-[1.15] font-extrabold tracking-tight sm:text-4xl lg:text-[2.6rem] ${onDark ? "text-white" : "text-ink"}`}
      >
        {title}
      </Tag>
      {intro ? <p className={`mt-5 text-base leading-7 sm:text-lg ${onDark ? "text-white/65" : "text-graphite/80"}`}>{intro}</p> : null}
    </div>
  );
}

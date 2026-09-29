import Link from "next/link";
import { ArrowUpRight, Calendar, Clock3 } from "lucide-react";
import { SiteImage } from "@/components/ui/SiteImage";
import { formatDate, readingTime } from "@/lib/format";
import type { BlogPostDTO } from "@/lib/types";

type BlogCardProps = { post: BlogPostDTO; variant?: "default" | "featured" };

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const featured = variant === "featured";
  return (
    <article
      className={`group relative flex h-full overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift ${
        featured ? "flex-col lg:flex-row" : "flex-col"
      }`}
    >
      <div className={`relative overflow-hidden bg-fog ${featured ? "aspect-[16/10] lg:aspect-auto lg:w-[58%]" : "aspect-[16/10]"}`}>
        <SiteImage
          src={post.featuredImage}
          alt=""
          fill
          sizes={featured ? "(min-width: 1024px) 55vw, 92vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={featured}
        />
        <span className="absolute top-4 left-4 rounded-[3px] bg-brand px-2.5 py-1 font-display text-[0.65rem] font-bold tracking-[0.16em] text-white uppercase">
          {post.category}
        </span>
      </div>
      <div className={`flex flex-1 flex-col ${featured ? "p-7 sm:p-10 lg:justify-center" : "p-6"}`}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-steel">
          {post.publishedAt ? (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5" aria-hidden="true" />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5" aria-hidden="true" />
            {readingTime(post.content)} min read
          </span>
        </div>
        <h3 className={`mt-3 font-display leading-tight font-extrabold text-ink uppercase ${featured ? "text-2xl sm:text-3xl" : "text-lg"}`}>
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {post.title}
          </Link>
        </h3>
        <p className={`mt-3 leading-7 text-graphite/80 ${featured ? "text-base" : "line-clamp-3 text-sm"}`}>{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 font-display text-xs font-bold tracking-[0.16em] text-ink uppercase group-hover:text-brand-deep">
          Read Article
          <ArrowUpRight className="size-4 text-brand transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

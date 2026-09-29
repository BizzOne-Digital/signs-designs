import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock3, Phone, User } from "lucide-react";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { BlogCard } from "@/components/blog/BlogCard";
import { JsonLdScript } from "@/components/layout/JsonLd";
import { buttonClasses, ButtonLink } from "@/components/ui/Button";
import { SiteImage } from "@/components/ui/SiteImage";
import { getPostBySlug, getPublishedPosts, getSiteSettings } from "@/lib/data";
import { formatDate, readingTime, telHref } from "@/lib/format";
import { normalizeImageUrl } from "@/lib/images";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };

  const image = normalizeImageUrl(post.featuredImage);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt ?? undefined,
      authors: [post.author],
      images: [{ url: image }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [image] },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts, settings] = await Promise.all([getPostBySlug(slug), getPublishedPosts(), getSiteSettings()]);
  if (!post) notFound();

  const related = allPosts.filter((p) => p.id !== post.id).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, 3);
  const image = normalizeImageUrl(post.featuredImage);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: image.startsWith("http") ? image : `${SITE_URL}${image}`,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: settings.businessName, "@id": `${SITE_URL}/#business` },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <>
      <JsonLdScript data={articleJsonLd} />
      <article>
        <header className="relative isolate overflow-hidden bg-ink pt-32 pb-40 text-white sm:pt-36 lg:pt-44 lg:pb-56">
          <div className="bg-grid-dark absolute inset-0 -z-10" aria-hidden="true" />
          <div className="container-site max-w-4xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-white/60 uppercase transition hover:text-white">
              <ArrowLeft className="size-4" aria-hidden="true" />
              All articles
            </Link>
            <p className="mt-8">
              <span className="rounded-[3px] bg-brand px-2.5 py-1 font-display text-[0.68rem] font-bold tracking-[0.16em] uppercase">{post.category}</span>
            </p>
            <h1 className="mt-5 animate-fade-up text-3xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl">{post.title}</h1>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/65">
              <span className="inline-flex items-center gap-2">
                <User className="size-4 text-brand" aria-hidden="true" />
                {post.author}
              </span>
              {post.publishedAt ? (
                <span className="inline-flex items-center gap-2">
                  <Calendar className="size-4 text-brand" aria-hidden="true" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2">
                <Clock3 className="size-4 text-brand" aria-hidden="true" />
                {readingTime(post.content)} min read
              </span>
            </div>
          </div>
        </header>

        <div className="container-site relative -mt-28 max-w-6xl lg:-mt-40">
          <div className="clip-angle-br relative aspect-[16/9] overflow-hidden bg-graphite shadow-lift">
            <SiteImage src={post.featuredImage} alt={post.title} fill priority sizes="(min-width: 1152px) 1100px, 100vw" className="object-cover" />
          </div>
        </div>

        <div className="container-site grid max-w-6xl gap-12 py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-8">
            {post.excerpt ? <p className="mb-8 font-display text-xl leading-8 font-semibold text-ink">{post.excerpt}</p> : null}
            <ArticleContent content={post.content} />
          </div>
          <aside className="lg:col-span-4">
            <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-ink p-7 text-white lg:sticky lg:top-28">
              <div className="absolute top-0 left-0 h-1 w-full bg-brand" aria-hidden="true" />
              <p className="eyebrow mb-3 text-white/70">Free quote</p>
              <h2 className="text-2xl leading-tight font-extrabold">Planning a sign project?</h2>
              <p className="mt-3 text-sm leading-6 text-white/65">Tell us what you need and we&apos;ll prepare a custom quote for your business.</p>
              <div className="mt-6 flex flex-col gap-3">
                <ButtonLink href="/contact" icon={<ArrowRight className="size-4" aria-hidden="true" />}>
                  Request a Free Quote
                </ButtonLink>
                <a href={telHref(settings.phone)} className={buttonClasses("outline-light", "md")}>
                  <Phone className="size-4" aria-hidden="true" />
                  {settings.phone}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="bg-fog py-16 sm:py-20" aria-labelledby="related-heading">
          <div className="container-site">
            <h2 id="related-heading" className="mb-8 text-2xl font-extrabold tracking-tight sm:text-3xl">
              More Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

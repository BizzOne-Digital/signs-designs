import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { QuoteCta } from "@/components/layout/QuoteCta";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogList } from "@/components/blog/BlogList";
import { Reveal } from "@/components/ui/Reveal";
import { contentText } from "@/lib/content-definitions";
import { getPageContent, getPublishedPosts, getSiteSettings } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Signage Tips & Business Branding Blog",
  description:
    "Practical advice on storefront signs, vehicle graphics, sign materials and local branding from Eric, an owner-operated Windsor-Essex sign maker with 32+ years of experience.",
  alternates: { canonical: "/blog" },
  openGraph: { title: "Signage Tips & Business Branding Insights", url: "/blog" },
};

export default async function BlogPage() {
  const [content, posts, settings] = await Promise.all([getPageContent("blog"), getPublishedPosts(), getSiteSettings()]);
  const t = (path: string) => contentText(content, path);
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);

  return (
    <>
      <PageHero eyebrow="Insights" title={t("hero.title")} subtitle={t("hero.subtitle")} image="/ser2.png" breadcrumb="Blog" />
      <section className="bg-fog py-16 sm:py-20 lg:py-24">
        <div className="container-site">
          {featured ? (
            <>
              <Reveal>
                <p className="eyebrow mb-6 text-brand-deep">Featured article</p>
                <BlogCard post={featured} variant="featured" />
              </Reveal>
              {rest.length > 0 ? (
                <div className="mt-16">
                  <h2 className="mb-8 text-2xl font-extrabold tracking-tight sm:text-3xl">Latest Articles</h2>
                  <BlogList posts={rest} />
                </div>
              ) : null}
            </>
          ) : (
            <p className="rounded-[var(--radius-card)] border border-dashed border-ink/20 bg-white p-12 text-center text-steel">
              New articles are on the way. Check back soon.
            </p>
          )}
        </div>
      </section>
      <QuoteCta
        title="Planning a Sign Project?"
        text="Skip the guesswork. Tell me what you need and I'll recommend the right signage for your space and budget."
        phone={settings.phone}
      />
    </>
  );
}

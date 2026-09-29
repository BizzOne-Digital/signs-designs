import "server-only";
import { cache } from "react";
import { dbConnect, isDatabaseConfigured } from "@/lib/mongodb";
import { ensureSeeded } from "@/lib/seed";
import { DEFAULT_PORTFOLIO, DEFAULT_POSTS, DEFAULT_SERVICES, DEFAULT_SETTINGS } from "@/lib/defaults";
import { getPageDefaults, isPageKey, type PageKey } from "@/lib/content-definitions";
import { toBlogPostDTO, toPortfolioDTO, toServiceDTO, toSettingsDTO } from "@/lib/serializers";
import type { BlogPostDTO, PageContentValues, PortfolioDTO, ServiceDTO, SiteSettingsDTO } from "@/lib/types";
import BlogPost from "@/models/BlogPost";
import PageContent from "@/models/PageContent";
import PortfolioProject from "@/models/PortfolioProject";
import Service from "@/models/Service";
import SiteSettings from "@/models/SiteSettings";

/**
 * Public data access. If the database is unreachable (or not configured during a local build),
 * pages render with the built-in default content instead of failing.
 */
async function withDatabase<T>(label: string, fallback: () => T, query: () => Promise<T>): Promise<T> {
  if (!isDatabaseConfigured()) return fallback();
  try {
    await dbConnect();
    await ensureSeeded();
    return await query();
  } catch (error) {
    console.error(`[data] ${label} failed, using defaults:`, error);
    return fallback();
  }
}

const fallbackServices = (): ServiceDTO[] => DEFAULT_SERVICES.map((s) => ({ ...s, id: s.slug }));
const fallbackPortfolio = (): PortfolioDTO[] => DEFAULT_PORTFOLIO.map((p) => ({ ...p, id: p.slug }));
const fallbackPosts = (): BlogPostDTO[] => DEFAULT_POSTS.map((p) => ({ ...p, id: p.slug }));

export const getSiteSettings = cache(
  (): Promise<SiteSettingsDTO> =>
    withDatabase("settings", () => ({ ...DEFAULT_SETTINGS }), async () => toSettingsDTO(await SiteSettings.findOne({ key: "site" }).lean())),
);

export const getActiveServices = cache(
  (): Promise<ServiceDTO[]> =>
    withDatabase("services", fallbackServices, async () => {
      const docs = await Service.find({ active: true }).sort({ sortOrder: 1, createdAt: 1 }).lean();
      return docs.map(toServiceDTO);
    }),
);

export const getPublishedPortfolio = cache(
  (): Promise<PortfolioDTO[]> =>
    withDatabase("portfolio", fallbackPortfolio, async () => {
      const docs = await PortfolioProject.find({ published: true }).sort({ featured: -1, sortOrder: 1, createdAt: -1 }).limit(60).lean();
      return docs.map(toPortfolioDTO);
    }),
);

/** Featured projects first; if none are featured, the most recent published projects. */
export async function getFeaturedPortfolio(limit = 9): Promise<PortfolioDTO[]> {
  const projects = await getPublishedPortfolio();
  const featured = projects.filter((p) => p.featured);
  return (featured.length > 0 ? featured : projects).slice(0, limit);
}

export const getPublishedPosts = cache(
  (): Promise<BlogPostDTO[]> =>
    withDatabase(
      "posts",
      () => fallbackPosts().sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")),
      async () => {
        const docs = await BlogPost.find({ status: "published" }).sort({ publishedAt: -1, createdAt: -1 }).limit(200).lean();
        return docs.map(toBlogPostDTO);
      },
    ),
);

export const getPostBySlug = cache(
  (slug: string): Promise<BlogPostDTO | null> =>
    withDatabase(
      "post",
      () => fallbackPosts().find((p) => p.slug === slug) ?? null,
      async () => {
        const doc = await BlogPost.findOne({ slug: slug.toLowerCase(), status: "published" }).lean();
        return doc ? toBlogPostDTO(doc) : null;
      },
    ),
);

export const getPageContent = cache(
  (page: PageKey): Promise<PageContentValues> =>
    withDatabase("page content", () => getPageDefaults(page), async () => {
      const values = getPageDefaults(page);
      if (!isPageKey(page)) return values;
      const docs = await PageContent.find({ page }).lean();
      for (const doc of docs) {
        const path = `${doc.section}.${doc.key}`;
        if (!(path in values)) continue;
        const value = doc.value;
        if (typeof value === "string" && value.trim() !== "") values[path] = value;
        else if (Array.isArray(value) && value.length > 0) values[path] = value.map(String);
      }
      return values;
    }),
);

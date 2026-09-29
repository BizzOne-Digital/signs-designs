import "server-only";
import { dbConnect } from "@/lib/mongodb";
import { DEFAULT_PORTFOLIO, DEFAULT_POSTS, DEFAULT_SERVICES, DEFAULT_SETTINGS } from "@/lib/defaults";
import { PAGE_CONTENT, type ContentSection } from "@/lib/content-definitions";
import BlogPost from "@/models/BlogPost";
import PageContent from "@/models/PageContent";
import PortfolioProject from "@/models/PortfolioProject";
import Service from "@/models/Service";
import SiteSettings from "@/models/SiteSettings";
import { PHOTO } from "@/lib/placeholder-images";
import { isPublicRootImage } from "@/lib/images";

const globalForSeed = globalThis as typeof globalThis & { __seedPromise?: Promise<void> | null };

async function insertIgnoringDuplicates(operation: () => Promise<unknown>) {
  try {
    await operation();
  } catch (error) {
    // Unique indexes make concurrent cold-start seeding safe: duplicates are simply skipped.
    const code = (error as { code?: number }).code;
    const writeErrors = (error as { writeErrors?: { code?: number }[] }).writeErrors;
    const onlyDuplicates = code === 11000 || (Array.isArray(writeErrors) && writeErrors.every((e) => e.code === 11000));
    if (!onlyDuplicates) throw error;
  }
}

/** Matches any Unsplash placeholder photo this site has ever seeded. */
const PLACEHOLDER_PHOTO = new RegExp(
  `^https://images\\.unsplash\\.com/photo-(${[...Object.values(PHOTO), "1554118811-1e0d58224f24", "1609921212029-bb5a28e60960"].join("|")})`,
);

/**
 * Swaps seeded Unsplash placeholders (services and page images) for the business's own /public images.
 * Only services still showing a placeholder are touched — an image uploaded in the admin is never replaced.
 */
async function replacePlaceholderServiceImages() {
  const pageImageFields = Object.entries(PAGE_CONTENT).flatMap(([page, def]) =>
    (def.sections as ContentSection[]).flatMap((section) =>
      section.fields
        .filter((field) => field.type === "image" && typeof field.default === "string" && isPublicRootImage(field.default))
        .map((field) => ({ page, section: section.id, key: field.key, value: field.default as string })),
    ),
  );

  await Promise.all([
    ...DEFAULT_PORTFOLIO.filter((project) => isPublicRootImage(project.image)).map((project) =>
      PortfolioProject.updateOne({ slug: project.slug, image: { $regex: PLACEHOLDER_PHOTO } }, { $set: { image: project.image } }),
    ),
    ...DEFAULT_SERVICES.map((service) =>
      Service.updateOne({ slug: service.slug, image: { $regex: PLACEHOLDER_PHOTO } }, { $set: { image: service.image } }),
    ),
    ...pageImageFields.map((field) =>
      PageContent.updateOne(
        { page: field.page, section: field.section, key: field.key, value: { $regex: PLACEHOLDER_PHOTO } },
        { $set: { value: field.value } },
      ),
    ),
  ]);
}

/**
 * Seeds starter content exactly once. After the first run, SiteSettings.seededAt is set and the
 * seed never runs again — so admin edits and deletions are never overwritten by a deployment.
 */
async function runSeed(): Promise<void> {
  await dbConnect();

  const settings = await SiteSettings.findOne({ key: "site" }, { seededAt: 1 }).lean();
  if (settings?.seededAt) {
    await replacePlaceholderServiceImages();
    return;
  }

  if ((await Service.estimatedDocumentCount()) === 0) {
    await insertIgnoringDuplicates(() => Service.insertMany(DEFAULT_SERVICES, { ordered: false }));
  }

  if ((await PortfolioProject.estimatedDocumentCount()) === 0) {
    await insertIgnoringDuplicates(() => PortfolioProject.insertMany(DEFAULT_PORTFOLIO, { ordered: false }));
  }

  if ((await BlogPost.estimatedDocumentCount()) === 0) {
    await insertIgnoringDuplicates(() =>
      BlogPost.insertMany(
        DEFAULT_POSTS.map((post) => ({ ...post, publishedAt: post.publishedAt ? new Date(post.publishedAt) : null })),
        { ordered: false },
      ),
    );
  }

  if ((await PageContent.estimatedDocumentCount()) === 0) {
    const docs = Object.entries(PAGE_CONTENT).flatMap(([page, def]) =>
      (def.sections as ContentSection[]).flatMap((section) =>
        section.fields.map((field) => ({ page, section: section.id, key: field.key, value: field.default, type: field.type })),
      ),
    );
    await insertIgnoringDuplicates(() => PageContent.insertMany(docs, { ordered: false }));
  }

  await SiteSettings.updateOne(
    { key: "site" },
    { $setOnInsert: { ...DEFAULT_SETTINGS, key: "site" }, $set: { seededAt: new Date() } },
    { upsert: true },
  );
}

export function ensureSeeded(): Promise<void> {
  if (!globalForSeed.__seedPromise) {
    globalForSeed.__seedPromise = runSeed().catch((error) => {
      globalForSeed.__seedPromise = null;
      throw error;
    });
  }
  return globalForSeed.__seedPromise;
}

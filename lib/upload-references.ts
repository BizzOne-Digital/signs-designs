import "server-only";
import { dbConnect } from "@/lib/mongodb";
import { deleteStoredUpload, parseStoredUploadUrl, STORED_UPLOAD_PREFIX } from "@/lib/uploads";
import PortfolioProject from "@/models/PortfolioProject";
import Service from "@/models/Service";
import BlogPost from "@/models/BlogPost";
import PageContent from "@/models/PageContent";
import SiteSettings from "@/models/SiteSettings";

function addIfUpload(set: Set<string>, value: unknown) {
  if (typeof value === "string" && value.startsWith(STORED_UPLOAD_PREFIX)) set.add(value);
  if (Array.isArray(value)) value.forEach((item) => addIfUpload(set, item));
}

/** Every /api/uploads/ URL currently referenced by website content. */
export async function collectReferencedUploadUrls(): Promise<Set<string>> {
  await dbConnect();
  const [projects, services, posts, pageItems, settings] = await Promise.all([
    PortfolioProject.find({}, { image: 1, galleryImages: 1 }).lean(),
    Service.find({}, { image: 1 }).lean(),
    BlogPost.find({}, { featuredImage: 1 }).lean(),
    PageContent.find({ type: "image" }, { value: 1 }).lean(),
    SiteSettings.find({}, { logo: 1, favicon: 1 }).lean(),
  ]);

  const urls = new Set<string>();
  projects.forEach((p) => {
    addIfUpload(urls, p.image);
    addIfUpload(urls, p.galleryImages);
  });
  services.forEach((s) => addIfUpload(urls, s.image));
  posts.forEach((p) => addIfUpload(urls, p.featuredImage));
  pageItems.forEach((item) => addIfUpload(urls, item.value));
  settings.forEach((s) => {
    addIfUpload(urls, s.logo);
    addIfUpload(urls, s.favicon);
  });
  return urls;
}

/**
 * Call only AFTER the content document has been saved successfully.
 * Deletes stored images that were removed or replaced, unless another document still uses them.
 */
export async function cleanupReplacedUploads(previousUrls: unknown[], currentUrls: unknown[] = []): Promise<void> {
  const current = new Set(currentUrls.filter((u): u is string => typeof u === "string"));
  const candidates = [
    ...new Set(previousUrls.filter((u): u is string => typeof u === "string" && !current.has(u) && parseStoredUploadUrl(u) !== null)),
  ];
  if (candidates.length === 0) return;

  try {
    const referenced = await collectReferencedUploadUrls();
    await Promise.all(candidates.filter((url) => !referenced.has(url)).map((url) => deleteStoredUpload(url)));
  } catch (error) {
    // Cleanup failure must never fail the content update that already succeeded.
    console.error("[uploads] cleanup failed:", error);
  }
}

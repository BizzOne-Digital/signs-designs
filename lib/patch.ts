import type { Model } from "mongoose";
import { slugify, uniqueSlug } from "@/lib/slug";

/**
 * Zod applies `.default()` values even inside `.partial()` schemas. For PATCH requests we keep
 * only the keys the client actually sent, so untouched fields are never reset to defaults.
 */
export function pickProvided<T extends Record<string, unknown>>(data: T, raw: unknown): Partial<T> {
  if (!raw || typeof raw !== "object") return {};
  const provided = raw as Record<string, unknown>;
  return Object.fromEntries(Object.entries(data).filter(([key]) => key in provided)) as Partial<T>;
}

/** An empty slug keeps the existing one, so editing a title never silently changes a public URL. */
export async function resolveSlugForUpdate<T>(model: Model<T>, requested: string | undefined, existingSlug: string, id: string) {
  if (!requested) return existingSlug;
  const normalized = slugify(requested);
  if (!normalized || normalized === existingSlug) return existingSlug;
  return uniqueSlug(model, normalized, id);
}

import type { Model, Types } from "mongoose";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

/** Returns a slug that is unique within the collection, appending -2, -3... when needed. */
export async function uniqueSlug<T>(model: Model<T>, source: string, excludeId?: string | Types.ObjectId): Promise<string> {
  const base = slugify(source) || "item";
  let candidate = base;
  let counter = 2;
  while (true) {
    const filter: Record<string, unknown> = { slug: candidate };
    if (excludeId) filter._id = { $ne: excludeId };
    const exists = await model.exists(filter);
    if (!exists) return candidate;
    candidate = `${base}-${counter}`;
    counter += 1;
  }
}

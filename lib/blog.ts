import type { BlogStatus } from "@/lib/constants";

/**
 * Publishing sets publishedAt (explicit date if supplied, otherwise keeps the original date or uses now).
 * Drafts keep any existing date so re-publishing does not reorder the archive unexpectedly.
 */
export function resolvePublishedAt(status: BlogStatus | undefined, requested: string | null | undefined, existing: Date | null | undefined): Date | null {
  if (requested) {
    const date = new Date(requested);
    if (!Number.isNaN(date.getTime())) return date;
  }
  if (status === "published") return existing ?? new Date();
  return existing ?? null;
}

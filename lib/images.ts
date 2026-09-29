import { PLACEHOLDER_IMAGE } from "@/lib/constants";

/** Static image files placed directly in /public, e.g. "/hero.png" or "/ser1.png". */
const PUBLIC_ROOT_IMAGE = /^\/[A-Za-z0-9_-]+\.(png|jpe?g|webp|avif|gif)$/i;

export function isPublicRootImage(url: string): boolean {
  return PUBLIC_ROOT_IMAGE.test(url);
}

/**
 * Legacy "/uploads/..." paths pointed at files on a local disk that no longer exist
 * (Vercel has no persistent filesystem), so they resolve to the placeholder.
 */
export function normalizeImageUrl(url?: string | null): string {
  if (!url) return PLACEHOLDER_IMAGE;
  const trimmed = url.trim();
  if (!trimmed) return PLACEHOLDER_IMAGE;
  if (trimmed.startsWith("/uploads/")) return PLACEHOLDER_IMAGE;
  if (trimmed.startsWith("/api/uploads/") || trimmed.startsWith("/images/")) return trimmed;
  if (isPublicRootImage(trimmed)) return trimmed;
  if (trimmed.startsWith("https://images.unsplash.com/")) return trimmed;
  return PLACEHOLDER_IMAGE;
}

/** Builds a sized Unsplash URL from a photo id. */
export function unsplash(id: string, width = 1600, height?: number): string {
  const params = new URLSearchParams({ auto: "format", fit: "crop", w: String(width), q: "80" });
  if (height) params.set("h", String(height));
  return `https://images.unsplash.com/photo-${id}?${params.toString()}`;
}

export function isAcceptedImageUrl(url: string): boolean {
  if (url === "") return true;
  return (
    url.startsWith("/api/uploads/") ||
    url.startsWith("/images/") ||
    url.startsWith("/uploads/") ||
    isPublicRootImage(url) ||
    url.startsWith("https://images.unsplash.com/")
  );
}

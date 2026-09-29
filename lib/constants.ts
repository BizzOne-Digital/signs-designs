export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const BUSINESS = {
  name: "Signs & Designs by Eric",
  owner: "Eric Marmus",
  phone: "519-739-1107",
  email: "ericsm@mnsi.net",
  street: "12361 Lachance Crt.",
  city: "Tecumseh",
  region: "ON",
  postalCode: "N8N 1L5",
  country: "CA",
  facebook: "https://www.facebook.com/profile.php?id=100057439869686",
  serviceArea: ["Windsor", "Tecumseh", "Essex County"],
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const QUOTE_SERVICE_OPTIONS = [
  "Storefront Signs",
  "Vehicle Graphics",
  "Window Vinyl",
  "Commercial Graphics",
  "Promotional Prints",
  "Professional Installation",
  "Other",
] as const;
export type QuoteServiceOption = (typeof QUOTE_SERVICE_OPTIONS)[number];

export const PREFERRED_CONTACT_OPTIONS = ["Phone", "Email", "Either"] as const;

export const QUOTE_STATUSES = ["new", "contacted", "quoted", "closed"] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const PORTFOLIO_CATEGORIES = [
  "Storefront Signs",
  "Vehicle Graphics",
  "Commercial Graphics",
  "Window Graphics",
  "Promotional Displays",
  "Installation",
] as const;
export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

export const BLOG_CATEGORIES = [
  "Signage Tips",
  "Business Branding",
  "Vehicle Graphics",
  "Our Process",
  "Materials",
  "Local Marketing",
] as const;

export const BLOG_STATUSES = ["draft", "published"] as const;
export type BlogStatus = (typeof BLOG_STATUSES)[number];

export const SERVICE_ICONS = ["store", "pen-tool", "truck", "panels", "megaphone", "wrench", "layers", "printer"] as const;
export type ServiceIconKey = (typeof SERVICE_ICONS)[number];

/** Maps a service slug to the matching quote-form dropdown option. */
export const SERVICE_TO_QUOTE_OPTION: Record<string, QuoteServiceOption> = {
  "storefront-commercial-signage": "Storefront Signs",
  "custom-graphic-sign-design": "Commercial Graphics",
  "vehicle-graphics-fleet-lettering": "Vehicle Graphics",
  "window-wall-floor-graphics": "Window Vinyl",
  "promotional-prints-event-displays": "Promotional Prints",
  "professional-site-installation": "Professional Installation",
};

/* ---------- Uploads ---------- */

export const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const IMAGE_MIME_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
} as const;
export type ImageMimeType = keyof typeof IMAGE_MIME_EXTENSIONS;

export const ATTACHMENT_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"] as const;
export type AttachmentMimeType = (typeof ATTACHMENT_MIME_TYPES)[number];

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/**
 * Vercel serverless functions reject request bodies above ~4.5 MB.
 * Images larger than this are resized/re-encoded in the browser before upload,
 * so the 8 MB selection limit still works in production.
 */
export const TRANSPORT_SAFE_BYTES = 4 * 1024 * 1024;

export const MAX_QUOTE_ATTACHMENTS = 5;

export const PLACEHOLDER_IMAGE = "/images/placeholder.webp";

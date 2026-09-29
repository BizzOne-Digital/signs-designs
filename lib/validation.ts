import { z } from "zod";
import {
  BLOG_STATUSES,
  MAX_QUOTE_ATTACHMENTS,
  PORTFOLIO_CATEGORIES,
  PREFERRED_CONTACT_OPTIONS,
  QUOTE_SERVICE_OPTIONS,
  QUOTE_STATUSES,
  SERVICE_ICONS,
} from "@/lib/constants";
import { isAcceptedImageUrl } from "@/lib/images";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

export const imageUrlSchema = z
  .string()
  .trim()
  .max(600, "Image URL is too long")
  .refine(isAcceptedImageUrl, "Use an uploaded image or an images.unsplash.com URL");

const requiredImage = imageUrlSchema.refine((v) => v.length > 0, "An image is required");

const shortText = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters`);
const requiredText = (label: string, min: number, max: number) =>
  z
    .string({ error: `${label} is required` })
    .trim()
    .min(min, min <= 1 ? `${label} is required` : `${label} must be at least ${min} characters`)
    .max(max, `${label} must be under ${max} characters`);

const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(90)
  .regex(/^[a-z0-9-]*$/, "Slug may contain lowercase letters, numbers and dashes only")
  .optional()
  .default("");

/* ---------- Auth ---------- */

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address")),
  password: z.string().min(1, "Password is required").max(200),
});

/* ---------- Portfolio ---------- */

export const portfolioSchema = z.object({
  title: requiredText("Title", 2, 140),
  slug: slugSchema,
  category: z.enum(PORTFOLIO_CATEGORIES, { error: "Choose a category" }),
  description: shortText(1200).default(""),
  location: shortText(140).default(""),
  image: requiredImage,
  galleryImages: z.array(requiredImage).max(24, "Up to 24 gallery images").default([]),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(-9999).max(9999).default(0),
  published: z.boolean().default(true),
});
export const portfolioPatchSchema = portfolioSchema.partial();

/* ---------- Services ---------- */

export const serviceSchema = z.object({
  title: requiredText("Title", 2, 140),
  slug: slugSchema,
  shortDescription: requiredText("Short description", 10, 400),
  description: shortText(4000).default(""),
  image: imageUrlSchema.default(""),
  icon: z.enum(SERVICE_ICONS).default("store"),
  features: z.array(z.string().trim().min(1).max(140)).max(20, "Up to 20 features").default([]),
  sortOrder: z.coerce.number().int().min(-9999).max(9999).default(0),
  active: z.boolean().default(true),
});
export const servicePatchSchema = serviceSchema.partial();

/* ---------- Blog ---------- */

export const blogSchema = z.object({
  title: requiredText("Title", 3, 180),
  slug: slugSchema,
  excerpt: shortText(500).default(""),
  content: z.string().max(60000, "Article content is too long").default(""),
  featuredImage: imageUrlSchema.default(""),
  category: requiredText("Category", 1, 60),
  author: shortText(80).default("Eric Marmus"),
  status: z.enum(BLOG_STATUSES).default("draft"),
  featured: z.boolean().default(false),
  publishedAt: z.string().trim().max(40).nullable().optional(),
});
export const blogPatchSchema = blogSchema.partial();

/* ---------- Settings ---------- */

export const settingsSchema = z.object({
  businessName: requiredText("Business name", 2, 120),
  phone: requiredText("Phone", 7, 40),
  email: z.string().trim().pipe(z.email("Enter a valid email address")),
  address: shortText(240).default(""),
  facebook: z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === "" || /^https:\/\/(www\.)?facebook\.com\//i.test(v), "Use a full https://facebook.com/ link")
    .default(""),
  logo: imageUrlSchema.default(""),
  favicon: imageUrlSchema.default(""),
  seoTitle: shortText(120).default(""),
  seoDescription: shortText(320).default(""),
});

/* ---------- Page content ---------- */

export const pageContentUpdateSchema = z.object({
  page: z.string().trim().min(1).max(40),
  values: z.record(z.string().max(80), z.union([z.string().max(8000), z.array(z.string().max(300)).max(20)])),
});

/* ---------- Quote requests ---------- */

const phoneSchema = z
  .string({ error: "Phone number is required" })
  .trim()
  .min(1, "Phone number is required")
  .max(30, "Phone number is too long")
  .refine((v) => {
    const digits = v.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }, "Enter a valid phone number, including area code")
  .refine((v) => /^[\d\s()+.-]+$/.test(v), "Phone number contains invalid characters");

export const quoteSchema = z.object({
  name: requiredText("Full name", 2, 100),
  businessName: shortText(140).default(""),
  phone: phoneSchema,
  email: z.string({ error: "Email address is required" }).trim().toLowerCase().pipe(z.email("Enter a valid email address")),
  service: z.enum(QUOTE_SERVICE_OPTIONS, { error: "Choose the service you need" }),
  location: shortText(160).default(""),
  message: requiredText("Project details", 10, 5000),
  preferredContact: z.enum(PREFERRED_CONTACT_OPTIONS).default("Either"),
  attachments: z
    .array(z.object({ id: objectId, token: z.string().regex(/^[a-f\d]{32}$/i, "Invalid attachment") }))
    .max(MAX_QUOTE_ATTACHMENTS, `Up to ${MAX_QUOTE_ATTACHMENTS} files`)
    .default([]),
  // Spam protection: honeypot must stay empty, and the form must not be submitted instantly.
  website: z.string().max(0).optional().default(""),
  startedAt: z.number().optional(),
});
export type QuoteInput = z.input<typeof quoteSchema>;

export const inquiryUpdateSchema = z.object({
  status: z.enum(QUOTE_STATUSES).optional(),
  adminNotes: z.string().max(5000, "Notes must be under 5000 characters").optional(),
});

export const attachmentDeleteSchema = z.object({
  id: objectId,
  token: z.string().regex(/^[a-f\d]{32}$/i),
});

export { objectId as objectIdSchema };

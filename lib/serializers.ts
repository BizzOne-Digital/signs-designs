import "server-only";
import type { Types } from "mongoose";
import type { BlogPostDoc } from "@/models/BlogPost";
import type { PortfolioProjectDoc } from "@/models/PortfolioProject";
import type { QuoteRequestDoc } from "@/models/QuoteRequest";
import type { ServiceDoc } from "@/models/Service";
import type { SiteSettingsDoc } from "@/models/SiteSettings";
import type { BlogPostDTO, PortfolioDTO, QuoteRequestDTO, ServiceDTO, SiteSettingsDTO } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/defaults";

type WithId<T> = T & { _id: Types.ObjectId | string };

const iso = (value?: Date | string | null) => (value ? new Date(value).toISOString() : undefined);

export function toServiceDTO(doc: WithId<ServiceDoc>): ServiceDTO {
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    shortDescription: doc.shortDescription ?? "",
    description: doc.description ?? "",
    image: doc.image ?? "",
    icon: doc.icon ?? "store",
    features: Array.isArray(doc.features) ? [...doc.features] : [],
    sortOrder: doc.sortOrder ?? 0,
    active: doc.active !== false,
    updatedAt: iso(doc.updatedAt),
  };
}

export function toPortfolioDTO(doc: WithId<PortfolioProjectDoc>): PortfolioDTO {
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    category: doc.category,
    description: doc.description ?? "",
    location: doc.location ?? "",
    image: doc.image ?? "",
    galleryImages: Array.isArray(doc.galleryImages) ? [...doc.galleryImages] : [],
    featured: Boolean(doc.featured),
    sortOrder: doc.sortOrder ?? 0,
    published: doc.published !== false,
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt),
  };
}

export function toBlogPostDTO(doc: WithId<BlogPostDoc>): BlogPostDTO {
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt ?? "",
    content: doc.content ?? "",
    featuredImage: doc.featuredImage ?? "",
    category: doc.category ?? "",
    author: doc.author ?? "",
    status: doc.status,
    featured: Boolean(doc.featured),
    publishedAt: iso(doc.publishedAt) ?? null,
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt),
  };
}

export function toSettingsDTO(doc?: Partial<SiteSettingsDoc> | null): SiteSettingsDTO {
  return {
    businessName: doc?.businessName || DEFAULT_SETTINGS.businessName,
    phone: doc?.phone || DEFAULT_SETTINGS.phone,
    email: doc?.email || DEFAULT_SETTINGS.email,
    address: doc?.address || DEFAULT_SETTINGS.address,
    facebook: doc?.facebook ?? DEFAULT_SETTINGS.facebook,
    logo: doc?.logo ?? "",
    favicon: doc?.favicon ?? "",
    seoTitle: doc?.seoTitle || DEFAULT_SETTINGS.seoTitle,
    seoDescription: doc?.seoDescription || DEFAULT_SETTINGS.seoDescription,
  };
}

export function toQuoteRequestDTO(doc: WithId<QuoteRequestDoc>): QuoteRequestDTO {
  return {
    id: String(doc._id),
    name: doc.name,
    businessName: doc.businessName ?? "",
    email: doc.email,
    phone: doc.phone,
    service: doc.service,
    location: doc.location ?? "",
    message: doc.message,
    preferredContact: doc.preferredContact ?? "Either",
    attachments: (doc.attachments ?? []).map((a) => ({
      attachmentId: String(a.attachmentId),
      name: a.name,
      url: a.url,
      mimeType: a.mimeType,
      size: a.size,
    })),
    status: doc.status,
    adminNotes: doc.adminNotes ?? "",
    createdAt: iso(doc.createdAt) ?? new Date().toISOString(),
    updatedAt: iso(doc.updatedAt) ?? new Date().toISOString(),
  };
}

import type { BlogStatus, PortfolioCategory, QuoteStatus, ServiceIconKey, UploadFolder } from "@/lib/constants";

export interface ServiceDTO {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  icon: ServiceIconKey;
  features: string[];
  sortOrder: number;
  active: boolean;
  updatedAt?: string;
}

export interface PortfolioDTO {
  id: string;
  title: string;
  slug: string;
  category: PortfolioCategory;
  description: string;
  location: string;
  image: string;
  galleryImages: string[];
  featured: boolean;
  sortOrder: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPostDTO {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  author: string;
  status: BlogStatus;
  featured: boolean;
  publishedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteSettingsDTO {
  businessName: string;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  logo: string;
  favicon: string;
  seoTitle: string;
  seoDescription: string;
}

export interface QuoteAttachmentDTO {
  attachmentId: string;
  name: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface QuoteRequestDTO {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  message: string;
  preferredContact: string;
  attachments: QuoteAttachmentDTO[];
  status: QuoteStatus;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItemDTO {
  _id: string;
  folder: UploadFolder;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
  inUse: boolean;
}

export type PageContentValues = Record<string, string | string[]>;

import mongoose, { Schema, type Model } from "mongoose";

export const PAGE_CONTENT_TYPES = ["text", "textarea", "image", "json"] as const;
export type PageContentType = (typeof PAGE_CONTENT_TYPES)[number];

export interface PageContentDoc {
  page: string;
  section: string;
  key: string;
  value: string | string[];
  type: PageContentType;
  createdAt: Date;
  updatedAt: Date;
}

const PageContentSchema = new Schema<PageContentDoc>(
  {
    page: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    key: { type: String, required: true, trim: true },
    value: { type: Schema.Types.Mixed, default: "" },
    type: { type: String, enum: PAGE_CONTENT_TYPES, default: "text" },
  },
  { timestamps: true },
);

PageContentSchema.index({ page: 1, section: 1, key: 1 }, { unique: true });

const PageContent =
  (mongoose.models.PageContent as Model<PageContentDoc> | undefined) ??
  mongoose.model<PageContentDoc>("PageContent", PageContentSchema);

export default PageContent;

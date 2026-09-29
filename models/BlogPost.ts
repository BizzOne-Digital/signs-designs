import mongoose, { Schema, type Model } from "mongoose";
import { BLOG_STATUSES, type BlogStatus } from "@/lib/constants";

export interface BlogPostDoc {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  author: string;
  status: BlogStatus;
  featured: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<BlogPostDoc>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: "", trim: true },
    content: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    category: { type: String, default: "Signage Tips", trim: true },
    author: { type: String, default: "Eric Marmus", trim: true },
    status: { type: String, enum: BLOG_STATUSES, default: "draft" },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

BlogPostSchema.index({ status: 1, publishedAt: -1 });

const BlogPost = (mongoose.models.BlogPost as Model<BlogPostDoc> | undefined) ?? mongoose.model<BlogPostDoc>("BlogPost", BlogPostSchema);

export default BlogPost;

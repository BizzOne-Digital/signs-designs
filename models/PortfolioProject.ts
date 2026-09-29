import mongoose, { Schema, type Model } from "mongoose";
import { PORTFOLIO_CATEGORIES, type PortfolioCategory } from "@/lib/constants";

export interface PortfolioProjectDoc {
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
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioProjectSchema = new Schema<PortfolioProjectDoc>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, enum: PORTFOLIO_CATEGORIES },
    description: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    image: { type: String, required: true },
    galleryImages: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

PortfolioProjectSchema.index({ published: 1, featured: -1, sortOrder: 1 });

const PortfolioProject =
  (mongoose.models.PortfolioProject as Model<PortfolioProjectDoc> | undefined) ??
  mongoose.model<PortfolioProjectDoc>("PortfolioProject", PortfolioProjectSchema);

export default PortfolioProject;

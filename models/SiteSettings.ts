import mongoose, { Schema, type Model } from "mongoose";

export interface SiteSettingsDoc {
  key: "site";
  businessName: string;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  logo: string;
  favicon: string;
  seoTitle: string;
  seoDescription: string;
  seededAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<SiteSettingsDoc>(
  {
    key: { type: String, default: "site", unique: true },
    businessName: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
    facebook: { type: String, default: "", trim: true },
    logo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    seoTitle: { type: String, default: "", trim: true },
    seoDescription: { type: String, default: "", trim: true },
    seededAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const SiteSettings =
  (mongoose.models.SiteSettings as Model<SiteSettingsDoc> | undefined) ??
  mongoose.model<SiteSettingsDoc>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;

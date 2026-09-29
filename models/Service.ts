import mongoose, { Schema, type Model } from "mongoose";
import { SERVICE_ICONS, type ServiceIconKey } from "@/lib/constants";

export interface ServiceDoc {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  icon: ServiceIconKey;
  features: string[];
  sortOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<ServiceDoc>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    image: { type: String, default: "" },
    icon: { type: String, enum: SERVICE_ICONS, default: "store" },
    features: { type: [String], default: [] },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

ServiceSchema.index({ active: 1, sortOrder: 1 });

const Service = (mongoose.models.Service as Model<ServiceDoc> | undefined) ?? mongoose.model<ServiceDoc>("Service", ServiceSchema);

export default Service;

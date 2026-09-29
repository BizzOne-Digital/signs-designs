import mongoose, { Schema, Types, type Model } from "mongoose";
import { QUOTE_STATUSES, type QuoteStatus } from "@/lib/constants";

export interface QuoteAttachmentRef {
  attachmentId: Types.ObjectId;
  name: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface QuoteRequestDoc {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  message: string;
  preferredContact: string;
  attachments: QuoteAttachmentRef[];
  status: QuoteStatus;
  adminNotes: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttachmentRefSchema = new Schema<QuoteAttachmentRef>(
  {
    attachmentId: { type: Schema.Types.ObjectId, ref: "QuoteAttachment", required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { _id: false },
);

const QuoteRequestSchema = new Schema<QuoteRequestDoc>(
  {
    name: { type: String, required: true, trim: true },
    businessName: { type: String, default: "", trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    service: { type: String, required: true, trim: true },
    location: { type: String, default: "", trim: true },
    message: { type: String, required: true, trim: true },
    preferredContact: { type: String, default: "Either" },
    attachments: { type: [AttachmentRefSchema], default: [] },
    status: { type: String, enum: QUOTE_STATUSES, default: "new" },
    adminNotes: { type: String, default: "" },
    ipAddress: { type: String, select: false },
    userAgent: { type: String, select: false },
  },
  { timestamps: true },
);

QuoteRequestSchema.index({ status: 1, createdAt: -1 });
QuoteRequestSchema.index({ createdAt: -1 });

const QuoteRequest =
  (mongoose.models.QuoteRequest as Model<QuoteRequestDoc> | undefined) ??
  mongoose.model<QuoteRequestDoc>("QuoteRequest", QuoteRequestSchema);

export default QuoteRequest;

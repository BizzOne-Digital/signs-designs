import mongoose, { Schema, Types, type Model } from "mongoose";

/**
 * Customer-supplied quote files (logos, artwork, blueprints). Kept separate from the
 * public StoredUpload collection so they are only ever served to an authenticated admin.
 * Unlinked uploads expire automatically through the TTL index on `expiresAt`.
 */
export interface QuoteAttachmentDoc {
  originalName: string;
  mimeType: string;
  size: number;
  data: Buffer;
  uploadToken?: string | null;
  quoteRequest?: Types.ObjectId | null;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteAttachmentSchema = new Schema<QuoteAttachmentDoc>(
  {
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
    uploadToken: { type: String, default: null, select: false },
    quoteRequest: { type: Schema.Types.ObjectId, ref: "QuoteRequest", default: null },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);

QuoteAttachmentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
QuoteAttachmentSchema.index({ quoteRequest: 1 });

const QuoteAttachment =
  (mongoose.models.QuoteAttachment as Model<QuoteAttachmentDoc> | undefined) ??
  mongoose.model<QuoteAttachmentDoc>("QuoteAttachment", QuoteAttachmentSchema);

export default QuoteAttachment;

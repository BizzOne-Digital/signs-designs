import mongoose, { Schema, type Model } from "mongoose";
import { UPLOAD_FOLDERS, type UploadFolder } from "@/lib/constants";

/** The only collection that holds image binary data. Business documents store the returned URL. */
export interface StoredUploadDoc {
  folder: UploadFolder;
  filename: string;
  mimeType: string;
  size: number;
  data: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const StoredUploadSchema = new Schema<StoredUploadDoc>(
  {
    folder: { type: String, required: true, enum: UPLOAD_FOLDERS },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });
StoredUploadSchema.index({ createdAt: -1 });

const StoredUpload =
  (mongoose.models.StoredUpload as Model<StoredUploadDoc> | undefined) ??
  mongoose.model<StoredUploadDoc>("StoredUpload", StoredUploadSchema);

export default StoredUpload;

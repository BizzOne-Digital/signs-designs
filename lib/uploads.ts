import "server-only";
import crypto from "crypto";
import { dbConnect } from "@/lib/mongodb";
import StoredUpload from "@/models/StoredUpload";
import { IMAGE_MIME_EXTENSIONS, UPLOAD_FOLDERS, type ImageMimeType, type UploadFolder } from "@/lib/constants";

export const STORED_UPLOAD_PREFIX = "/api/uploads/";

const FILENAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

export function isAllowedFolder(value: unknown): value is UploadFolder {
  return typeof value === "string" && (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function isImageMimeType(value: unknown): value is ImageMimeType {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(IMAGE_MIME_EXTENSIONS, value);
}

/** Rejects traversal sequences, separators and anything outside a conservative character set. */
export function isSafeFilename(filename: unknown): filename is string {
  if (typeof filename !== "string") return false;
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\") || filename.includes("\0")) return false;
  return FILENAME_PATTERN.test(filename);
}

export function generateUploadFilename(mimeType: ImageMimeType): string {
  const ext = IMAGE_MIME_EXTENSIONS[mimeType];
  const randomHex = crypto.randomBytes(6).toString("hex");
  return `${Date.now()}-${randomHex}.${ext}`;
}

export function buildStoredUploadUrl(folder: UploadFolder, filename: string): string {
  return `${STORED_UPLOAD_PREFIX}${folder}/${filename}`;
}

export function parseStoredUploadUrl(url: unknown): { folder: UploadFolder; filename: string } | null {
  if (typeof url !== "string" || !url.startsWith(STORED_UPLOAD_PREFIX)) return null;
  const rest = url.slice(STORED_UPLOAD_PREFIX.length).split(/[?#]/)[0];
  const parts = rest.split("/");
  if (parts.length !== 2) return null;

  const [folder, rawFilename] = parts;
  let filename: string;
  try {
    filename = decodeURIComponent(rawFilename);
  } catch {
    return null;
  }

  if (!isAllowedFolder(folder) || !isSafeFilename(filename)) return null;
  return { folder, filename };
}

/** Deletes the StoredUpload behind a /api/uploads/ URL. Non-upload URLs (Unsplash, static) are ignored. */
export async function deleteStoredUpload(url: unknown): Promise<boolean> {
  const parsed = parseStoredUploadUrl(url);
  if (!parsed) return false;
  await dbConnect();
  const result = await StoredUpload.deleteOne({ folder: parsed.folder, filename: parsed.filename });
  return result.deletedCount > 0;
}

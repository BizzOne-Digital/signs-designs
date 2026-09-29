import type { NextRequest } from "next/server";
import { ok, serverError } from "@/lib/api";
import { denyUnlessAdmin } from "@/lib/admin-route";
import { dbConnect } from "@/lib/mongodb";
import { buildStoredUploadUrl, isAllowedFolder } from "@/lib/uploads";
import { collectReferencedUploadUrls } from "@/lib/upload-references";
import StoredUpload from "@/models/StoredUpload";
import type { MediaItemDTO } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;

  const folder = request.nextUrl.searchParams.get("folder");
  const filter = isAllowedFolder(folder) ? { folder } : {};

  try {
    await dbConnect();
    // The binary `data` field is excluded — list responses never carry image bytes.
    const [docs, referenced] = await Promise.all([
      StoredUpload.find(filter).select({ data: 0 }).sort({ createdAt: -1 }).limit(1000).lean(),
      collectReferencedUploadUrls(),
    ]);

    const items: MediaItemDTO[] = docs.map((doc) => {
      const url = buildStoredUploadUrl(doc.folder, doc.filename);
      return {
        _id: String(doc._id),
        folder: doc.folder,
        filename: doc.filename,
        mimeType: doc.mimeType,
        size: doc.size,
        url,
        createdAt: new Date(doc.createdAt).toISOString(),
        inUse: referenced.has(url),
      };
    });
    return ok(items);
  } catch (error) {
    return serverError("list media", error);
  }
}
